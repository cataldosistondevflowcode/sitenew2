import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚀 Iniciando processamento de agendamentos unificados...')

    // Buscar agendamentos que precisam ser executados
    const now = new Date().toISOString()
    console.log(`⏰ Horário atual: ${now}`)
    
    // Calcular o início do dia atual (00:00:00)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startOfDay = today.toISOString()
    
    console.log(`📅 Início do dia: ${startOfDay}`)
    
    // Buscar agendamentos que precisam ser executados
    // Primeiro: agendamentos que nunca foram enviados
    const { data: neverSentSchedules, error: neverSentError } = await supabaseClient
      .from('unified_schedules')
      .select('*')
      .eq('status', 'active')
      .not('next_send', 'is', null)
      .lte('next_send', now)
      .is('last_sent', null)

    if (neverSentError) {
      console.error('❌ Erro ao buscar agendamentos nunca enviados:', neverSentError)
      throw neverSentError
    }

    // Segundo: agendamentos que foram enviados antes de hoje
    const { data: oldSentSchedules, error: oldSentError } = await supabaseClient
      .from('unified_schedules')
      .select('*')
      .eq('status', 'active')
      .not('next_send', 'is', null)
      .lte('next_send', now)
      .not('last_sent', 'is', null)
      .lt('last_sent', startOfDay)

    if (oldSentError) {
      console.error('❌ Erro ao buscar agendamentos enviados antes de hoje:', oldSentError)
      throw oldSentError
    }

    // Combinar os resultados
    const schedulesToProcess = [...(neverSentSchedules || []), ...(oldSentSchedules || [])]

    console.log(`📋 Resumo dos agendamentos encontrados:`)
    console.log(`   - Nunca enviados: ${neverSentSchedules?.length || 0}`)
    console.log(`   - Enviados antes de hoje: ${oldSentSchedules?.length || 0}`)
    console.log(`   - Total para processar: ${schedulesToProcess?.length || 0}`)
    
    // Log detalhado dos agendamentos encontrados
    if (schedulesToProcess && schedulesToProcess.length > 0) {
      schedulesToProcess.forEach(schedule => {
        console.log(`   📅 ${schedule.name}: next_send=${schedule.next_send}, method=${schedule.method}`)
      })
    }

    if (!schedulesToProcess || schedulesToProcess.length === 0) {
      return Response.json({
        success: true,
        processed: 0,
        successful: 0,
        total_emails_sent: 0,
        total_whatsapp_sent: 0,
        results: [],
        current_time: now,
        message: 'Nenhum agendamento pronto para executar no horário atual'
      }, { headers: corsHeaders })
    }

    const results = []
    let totalEmailsSent = 0
    let totalWhatsAppSent = 0
    let successfulSchedules = 0

    for (const schedule of schedulesToProcess) {
      console.log(`\n📱 Processando agendamento: ${schedule.name}`)
      
      try {
        const result = await processUnifiedSchedule(supabaseClient, schedule)
        results.push(result)
        
        if (result.success) {
          successfulSchedules++
          totalEmailsSent += result.emailsSent || 0
          totalWhatsAppSent += result.whatsappSent || 0
        }
        
        console.log(`✅ Agendamento ${schedule.name} processado com sucesso`)
      } catch (error) {
        console.error(`❌ Erro ao processar agendamento ${schedule.name}:`, error)
        results.push({
          schedule_id: schedule.id,
          schedule_name: schedule.name,
          success: false,
          emailsSent: 0,
          whatsappSent: 0,
          error: error.message
        })
      }
    }

    console.log(`\n🎯 Processamento concluído:`)
    console.log(`   - Agendamentos processados: ${schedulesToProcess.length}`)
    console.log(`   - Sucessos: ${successfulSchedules}`)
    console.log(`   - Total de emails: ${totalEmailsSent}`)
    console.log(`   - Total de WhatsApp: ${totalWhatsAppSent}`)

    return Response.json({
      success: true,
      processed: schedulesToProcess.length,
      successful: successfulSchedules,
      total_emails_sent: totalEmailsSent,
      total_whatsapp_sent: totalWhatsAppSent,
      results
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})

async function processUnifiedSchedule(supabaseClient: any, schedule: any) {
  const startTime = Date.now()
  
  try {
    console.log(`   📱 Processando agendamento unificado: ${schedule.name}`)
    
    // Buscar leads associados ao agendamento
    const { data: scheduleLeads, error: leadsError } = await supabaseClient
      .from('schedule_leads')
      .select(`
        lead_id,
        contact_leads (
          id,
          name,
          email,
          phone,
          filter_config
        )
      `)
      .eq('schedule_id', schedule.id)

    if (leadsError) {
      throw new Error(`Erro ao buscar leads: ${leadsError.message}`)
    }

    // Se não há leads específicos, buscar por grupo
    let leads = []
    if (scheduleLeads && scheduleLeads.length > 0) {
      leads = scheduleLeads.map(sl => sl.contact_leads).filter(Boolean)
    } else if (schedule.group_id) {
      const { data: groupLeads, error: groupError } = await supabaseClient
        .from('contact_leads')
        .select('id, name, email, phone, filter_config')
        .eq('group_id', schedule.group_id)

      if (groupError) {
        throw new Error(`Erro ao buscar leads do grupo: ${groupError.message}`)
      }
      leads = groupLeads || []
    }

    if (leads.length === 0) {
      throw new Error('Nenhum lead encontrado para este agendamento')
    }

    console.log(`   👥 Encontrados ${leads.length} leads para processar`)

    let emailsSent = 0
    let whatsappSent = 0

    // Processar emails se necessário
    if (schedule.method === 'email' || schedule.method === 'both') {
      emailsSent = await processEmails(supabaseClient, schedule, leads)
    }

    // Processar WhatsApp se necessário
    if (schedule.method === 'whatsapp' || schedule.method === 'both') {
      whatsappSent = await processWhatsApp(supabaseClient, schedule, leads)
    }

    // Calcular próximo envio se for recorrente
    let nextSend = null
    if (schedule.is_recurring) {
      nextSend = await calculateNextSendTime(supabaseClient, schedule)
    }

    // Atualizar agendamento
    const { error: updateError } = await supabaseClient
      .from('unified_schedules')
      .update({
        last_sent: new Date().toISOString(),
        next_send: nextSend,
        updated_at: new Date().toISOString()
      })
      .eq('id', schedule.id)

    if (updateError) {
      console.error('Erro ao atualizar agendamento:', updateError)
    }

    const executionTime = Date.now() - startTime

    return {
      schedule_id: schedule.id,
      schedule_name: schedule.name,
      success: true,
      emailsSent,
      whatsappSent,
      leadsProcessed: leads.length,
      execution_time_ms: executionTime
    }

  } catch (error) {
    const executionTime = Date.now() - startTime
    console.error(`❌ Erro ao processar agendamento ${schedule.name}:`, error)
    
    return {
      schedule_id: schedule.id,
      schedule_name: schedule.name,
      success: false,
      emailsSent: 0,
      whatsappSent: 0,
      error: error.message,
      execution_time_ms: executionTime
    }
  }
}

async function processEmails(supabaseClient: any, schedule: any, leads: any[]) {
  console.log(`   📧 Processando emails para ${leads.length} leads`)
  
  let emailsSent = 0
  const validEmails = leads.filter(lead => lead.email && lead.email.trim())

  if (validEmails.length === 0) {
    console.log(`   ⚠️ Nenhum email válido encontrado`)
    return 0
  }

  // Buscar URLs dos filtros dos leads
  const filterUrls = leads
    .map(lead => lead.filter_config)
    .filter(url => url && url.trim() !== '')
    .filter((url, index, arr) => arr.indexOf(url) === index) // Remove duplicatas

  console.log(`     🔗 URLs dos filtros encontradas: ${filterUrls.length}`)

  // Se não há filtros, buscar propriedades padrão
  let propertyIds: number[] = []
  let pageType = 'RJ' // Padrão

  if (filterUrls.length > 0) {
    // Para cada URL de filtro, extrair page_id e buscar na tabela static_pages
    for (const filterUrl of filterUrls) {
      try {
        console.log(`     🔍 Processando URL: ${filterUrl}`)
        
        // Extrair page_id da URL (ex: catalog-1756762390099-9si775wi8)
        let pageId = null
        if (filterUrl.includes('/catalogo/')) {
          pageId = filterUrl.split('/catalogo/')[1]
        } else if (filterUrl.includes('/filters/')) {
          pageId = filterUrl.split('/filters/')[1]
        }

        if (pageId) {
          console.log(`     📄 Buscando page_id: ${pageId}`)
          
          // Buscar na tabela static_pages
          const { data: staticPage, error: pageError } = await supabaseClient
            .from('static_pages')
            .select('property_ids, page_type, title')
            .eq('page_id', pageId)
            .single()

          if (pageError) {
            console.error(`     ❌ Erro ao buscar página estática:`, pageError)
            continue
          }

          if (staticPage && staticPage.property_ids) {
            console.log(`     ✅ Encontrada página: ${staticPage.title}`)
            console.log(`     📋 Property IDs: ${staticPage.property_ids.length}`)
            
            // Converter string IDs para números
            const ids = staticPage.property_ids.map(id => parseInt(id)).filter(id => !isNaN(id))
            propertyIds.push(...ids)
            
            // Usar o page_type da página estática
            if (staticPage.page_type) {
              pageType = staticPage.page_type
            }
          }
        }
      } catch (error) {
        console.error(`     ❌ Erro ao processar URL ${filterUrl}:`, error)
      }
    }
  }

  // Se não conseguiu extrair IDs das páginas estáticas, buscar propriedades ativas
  if (propertyIds.length === 0) {
    console.log(`     ⚠️ Nenhum filtro válido encontrado, usando propriedades padrão`)
    const { data: allProperties, error: propertiesError } = await supabaseClient
      .from('leiloes_imoveis')
      .select('id')
      .eq('status', 'ativo')
      .limit(10) // Limitar a 10 propriedades por padrão

    if (propertiesError) {
      console.error(`     ❌ Erro ao buscar propriedades:`, propertiesError)
      return 0
    }

    propertyIds = allProperties?.map(p => p.id) || []
  }

  // Remover duplicatas
  propertyIds = [...new Set(propertyIds)]

  console.log(`     📋 Enviando email com ${propertyIds.length} propriedades (${pageType})`)

  // Enviar email para cada lead válido
  for (const lead of validEmails) {
    try {
      console.log(`     📧 Enviando email para ${lead.email}`)
      
      // Preparar payload para a função send-pdf-email
      const emailPayload = {
        propertyIds: propertyIds,
        recipientEmail: lead.email,
        pageType: pageType,
        subject: schedule.email_subject || `Catálogo de Imóveis - Leilão ${pageType}`,
        message: schedule.email_message || 'Confira nossos imóveis em leilão!'
      }

      console.log(`     📤 Payload do email:`, emailPayload)

      // Chamar a função send-pdf-email existente
      const { data: emailResult, error: emailError } = await supabaseClient
        .functions.invoke('send-pdf-email', {
          body: emailPayload
        })

      if (emailError) {
        console.error(`     ❌ Erro ao enviar email para ${lead.email}:`, emailError)
        continue
      }

      console.log(`     ✅ Email enviado para ${lead.email}:`, emailResult)
      emailsSent++
      
    } catch (error) {
      console.error(`     ❌ Erro ao enviar email para ${lead.email}:`, error)
    }
  }

  console.log(`   ✅ ${emailsSent} emails processados`)
  return emailsSent
}

async function processWhatsApp(supabaseClient: any, schedule: any, leads: any[]) {
  console.log(`   📱 Processando WhatsApp para ${leads.length} leads`)
  
  let whatsappSent = 0
  const validPhones = leads.filter(lead => lead.phone && lead.phone.trim())

  if (validPhones.length === 0) {
    console.log(`   ⚠️ Nenhum telefone válido encontrado`)
    return 0
  }

  // Preparar mensagem WhatsApp
  let whatsappMessage = schedule.whatsapp_message || ''
  
  // Verificar se a mensagem já contém "Links dos filtros" para evitar duplicação
  const hasFilterLinks = whatsappMessage.includes('Links dos filtros:')
  
  // Adicionar URLs dos filtros dos leads apenas se não existirem na mensagem
  if (!hasFilterLinks) {
    const filterUrls = leads
      .map(lead => lead.filter_config)
      .filter(url => url && url.trim() !== '')
      .filter((url, index, arr) => arr.indexOf(url) === index) // Remove duplicatas
    
    if (filterUrls.length > 0) {
      whatsappMessage += '\n\nLinks dos filtros:\n' + filterUrls.join('\n')
    }
  }

  // Adicionar URL da imagem se existir
  let imageUrl = schedule.whatsapp_image_url || null

  // Determinar webhook baseado no tipo (assumindo RJ como padrão)
  const webhookUrl = 'https://n8n-production-49ae.up.railway.app/webhook/wpprj'

  for (const lead of validPhones) {
    try {
      console.log(`     📱 Enviando WhatsApp para ${lead.phone}`)
      
      // Formatear número de telefone
      let formattedNumber = lead.phone.replace(/\D/g, '')
      if (!formattedNumber.startsWith('55')) {
        formattedNumber = '55' + formattedNumber
      }

      // Se o lead tem filter_config, usar essa URL
      let pageUrl = lead.filter_config
      if (!pageUrl) {
        // Se não tem filter_config, usar uma URL padrão
        pageUrl = '/catalogo'
      }

      // Extrair apenas a parte relativa da URL
      if (pageUrl.includes('http')) {
        try {
          const url = new URL(pageUrl)
          pageUrl = url.pathname + url.search
        } catch {
          // Se não conseguir fazer parse, usar como está
        }
      }

      // Garantir que comece com /
      if (!pageUrl.startsWith('/')) {
        pageUrl = '/' + pageUrl
      }

      // Preparar payload para o webhook
      const payload = {
        num: formattedNumber,
        url: pageUrl,
        message: whatsappMessage,
        image: imageUrl // Adicionar URL da imagem ao payload
      }

      console.log(`     📤 Payload do WhatsApp:`, payload)

      // Chamar webhook do n8n
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Webhook retornou ${response.status}: ${errorText}`)
      }

      whatsappSent++
      console.log(`     ✅ WhatsApp enviado para ${lead.phone}`)
      
    } catch (error) {
      console.error(`     ❌ Erro ao enviar WhatsApp para ${lead.phone}:`, error)
    }
  }

  console.log(`   ✅ ${whatsappSent} mensagens WhatsApp processadas`)
  return whatsappSent
}

async function calculateNextSendTime(supabaseClient: any, schedule: any) {
  try {
    // Pegar data atual no fuso horário local (Brasil - UTC-3)
    const now = new Date()
    const [hours, minutes] = schedule.send_time.split(':').map(Number)
    
    // Criar data para hoje com o horário especificado
    let nextSend = new Date()
    nextSend.setHours(hours, minutes, 0, 0)
    
    console.log(`   ⏰ Debug - Cálculo de horário:`)
    console.log(`      Horário atual: ${now.toLocaleString('pt-BR')}`)
    console.log(`      Horário desejado: ${nextSend.toLocaleString('pt-BR')}`)
    console.log(`      Horário já passou? ${nextSend <= now}`)
    
    // Se o horário já passou hoje, agendar para amanhã
    if (nextSend <= now) {
      nextSend.setDate(nextSend.getDate() + 1)
      console.log(`      Agendando para amanhã: ${nextSend.toLocaleString('pt-BR')}`)
    }
    
    // Construir string UTC manualmente para evitar conversão automática
    const year = nextSend.getFullYear()
    const month = String(nextSend.getMonth() + 1).padStart(2, '0')
    const day = String(nextSend.getDate()).padStart(2, '0')
    const hour = String(nextSend.getHours()).padStart(2, '0')
    const minute = String(nextSend.getMinutes()).padStart(2, '0')
    const second = String(nextSend.getSeconds()).padStart(2, '0')
    
    // Como o Brasil é UTC-3, precisamos adicionar 3 horas para converter para UTC
    const utcHour = (nextSend.getHours() + 3) % 24
    const utcHourStr = String(utcHour).padStart(2, '0')
    
    const utcString = `${year}-${month}-${day}T${utcHourStr}:${minute}:${second}.000Z`
    
    console.log(`   ⏰ Resultado final:`)
    console.log(`      Horário local: ${nextSend.toLocaleString('pt-BR')}`)
    console.log(`      Horário UTC manual: ${utcString}`)
    
    return utcString
  } catch (error) {
    console.error('Erro ao calcular próximo envio:', error)
    return null
  }
}
