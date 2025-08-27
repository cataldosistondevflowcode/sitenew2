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

    console.log('🚀 Iniciando processamento de agendamentos WhatsApp...')

    // Buscar agendamentos que precisam ser executados
    const now = new Date().toISOString()
    console.log(`⏰ Horário atual: ${now}`)
    
    const { data: schedulesToProcess, error: fetchError } = await supabaseClient
      .from('whatsapp_schedules')
      .select('*')
      .eq('is_active', true)
      .not('next_send_at', 'is', null)
      .lte('next_send_at', now)

    if (fetchError) {
      console.error('❌ Erro ao buscar agendamentos:', fetchError)
      throw fetchError
    }

    console.log(`📋 Encontrados ${schedulesToProcess?.length || 0} agendamentos para processar`)
    
    // Log detalhado dos agendamentos encontrados
    if (schedulesToProcess && schedulesToProcess.length > 0) {
      schedulesToProcess.forEach(schedule => {
        console.log(`   📅 ${schedule.name}: next_send_at=${schedule.next_send_at}, is_active=${schedule.is_active}`)
      })
    }

    if (!schedulesToProcess || schedulesToProcess.length === 0) {
      return Response.json({
        success: true,
        processed: 0,
        successful: 0,
        total_messages_sent: 0,
        results: [],
        current_time: now,
        message: 'Nenhum agendamento pronto para executar no horário atual'
      }, { headers: corsHeaders })
    }

    const results = []
    let totalMessagesProcessed = 0
    let successfulSchedules = 0

    for (const schedule of schedulesToProcess) {
      console.log(`\n📱 Processando agendamento: ${schedule.name}`)
      
      try {
        const result = await processWhatsAppSchedule(supabaseClient, schedule)
        results.push(result)
        
        if (result.success) {
          successfulSchedules++
          totalMessagesProcessed += result.messagesSent
        }
        
        console.log(`✅ Agendamento ${schedule.name} processado com sucesso`)
      } catch (error) {
        console.error(`❌ Erro ao processar agendamento ${schedule.name}:`, error)
        results.push({
          schedule_id: schedule.id,
          schedule_name: schedule.name,
          success: false,
          propertiesCount: 0,
          messagesSent: 0,
          error: error.message
        })
      }
    }

    console.log(`\n🎯 Processamento concluído:`)
    console.log(`   - Agendamentos processados: ${schedulesToProcess.length}`)
    console.log(`   - Sucessos: ${successfulSchedules}`)
    console.log(`   - Total de mensagens: ${totalMessagesProcessed}`)

    return Response.json({
      success: true,
      processed: schedulesToProcess.length,
      successful: successfulSchedules,
      total_messages_sent: totalMessagesProcessed,
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

async function processWhatsAppSchedule(supabaseClient: any, schedule: any) {
  const startTime = Date.now()
  
  try {
    console.log(`   📱 Processando agendamento WhatsApp: ${schedule.name}`)
    
    // Para WhatsApp, usamos a URL que foi configurada no agendamento
    let pageUrl = schedule.page_url || schedule.message_template
    
    if (!pageUrl) {
      throw new Error('URL da página não encontrada no agendamento')
    }

    // Se for uma URL completa com localhost, extrair apenas o path
    if (pageUrl.includes('localhost') || pageUrl.includes('http://') || pageUrl.includes('https://')) {
      try {
        const url = new URL(pageUrl)
        pageUrl = url.pathname + url.search + url.hash
      } catch (error) {
        // Se não conseguir fazer parse da URL, usar como está
        console.log('Não foi possível fazer parse da URL, usando como está:', pageUrl)
      }
    }

    // Garantir que comece com /
    if (!pageUrl.startsWith('/')) {
      pageUrl = '/' + pageUrl
    }

    console.log(`   🔗 URL a ser enviada: ${pageUrl}`)

    // Obter lista de telefones
    let phoneNumbers: string[] = []
    
    if (schedule.phone_list_id) {
      // Usar lista de telefones
      const { data: phoneList, error: listError } = await supabaseClient
        .from('whatsapp_phone_lists')
        .select('phones')
        .eq('id', schedule.phone_list_id)
        .eq('is_active', true)
        .single()
      
      if (listError) {
        throw new Error(`Erro ao buscar lista de telefones: ${listError.message}`)
      }
      
      phoneNumbers = phoneList.phones || []
    } else {
      // Usar telefones manuais
      phoneNumbers = schedule.recipient_phones || []
    }

    phoneNumbers = phoneNumbers.filter(phone => phone && phone.trim())
    
    if (phoneNumbers.length === 0) {
      throw new Error('Nenhum telefone destinatário encontrado')
    }

    console.log(`   📞 Enviando para ${phoneNumbers.length} telefone(s)...`)

    // Definir webhook baseado no tipo de página
    const webhookUrl = schedule.page_type === 'RJ' 
      ? 'https://n8n-production-49ae.up.railway.app/webhook/wpprj'
      : 'https://n8n-production-49ae.up.railway.app/webhook/wppsp'

    console.log(`   🎯 Webhook: ${webhookUrl}`)

    // Enviar mensagens através do webhook n8n
    let messagesSent = 0
    const messageDetails = []

    for (const phoneNumber of phoneNumbers) {
      try {
        console.log(`     📱 Verificando se já foi enviado para ${phoneNumber}`)
        
        // Verificar se a mensagem já foi enviada para este telefone/URL
        const { data: alreadySent, error: checkError } = await supabaseClient
          .rpc('check_whatsapp_message_sent', {
            phone: phoneNumber,
            url: pageUrl
          })

        if (checkError) {
          console.error(`     ⚠️ Erro ao verificar duplicata:`, checkError)
          // Continua mesmo com erro na verificação, melhor enviar do que não enviar
        } else if (alreadySent) {
          console.log(`     ⏭️ Mensagem já foi enviada para ${phoneNumber}, pulando...`)
          messageDetails.push({
            phone: phoneNumber,
            url: pageUrl,
            sent_at: new Date().toISOString(),
            success: false,
            skipped: true,
            reason: 'Mensagem já enviada anteriormente'
          })
          continue
        }

        console.log(`     📱 Enviando para ${phoneNumber}`)
        
        // Preparar payload para o webhook
        const payload = {
          num: phoneNumber,
          url: pageUrl
        }

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

        const result = await response.json()
        console.log(`     ✅ Resposta do webhook:`, result)
        
        // Registrar a mensagem como enviada
        try {
          const { data: messageId, error: registerError } = await supabaseClient
            .rpc('register_whatsapp_message_sent', {
              phone: phoneNumber,
              url: pageUrl,
              schedule_id_param: schedule.id,
              webhook_response_param: result
            })

          if (registerError) {
            console.error(`     ⚠️ Erro ao registrar mensagem enviada:`, registerError)
          } else {
            console.log(`     📝 Mensagem registrada com ID: ${messageId}`)
          }
        } catch (regError) {
          console.error(`     ⚠️ Erro ao registrar mensagem:`, regError)
        }
        
        messagesSent++
        messageDetails.push({
          phone: phoneNumber,
          url: pageUrl,
          sent_at: new Date().toISOString(),
          success: true,
          webhook_response: result
        })
        
        // Pequeno delay entre mensagens para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`     ❌ Erro ao enviar para ${phoneNumber}:`, error)
        messageDetails.push({
          phone: phoneNumber,
          url: pageUrl,
          sent_at: new Date().toISOString(),
          success: false,
          error: error.message
        })
      }
    }

    console.log(`   📊 Mensagens enviadas: ${messagesSent}/${phoneNumbers.length}`)

    // Calcular próximo envio
    const nextSendAt = await calculateNextSendTime(supabaseClient, schedule)
    
    // Atualizar estatísticas do agendamento
    const updateData: any = {
      last_sent_at: new Date().toISOString(),
      total_messages_sent: (schedule.total_messages_sent || 0) + messagesSent,
      next_send_at: nextSendAt
    }

    // Se for agendamento único (once) e já foi executado, desativar
    if (schedule.recurrence_type === 'once') {
      updateData.is_active = false
      console.log(`   ⏹️ Agendamento único "${schedule.name}" será desativado após execução`)
    }

    const { error: updateError } = await supabaseClient
      .from('whatsapp_schedules')
      .update(updateData)
      .eq('id', schedule.id)

    if (updateError) {
      console.error('⚠️ Erro ao atualizar agendamento:', updateError)
    }

    // Criar log de execução
    const executionTime = Date.now() - startTime
    await supabaseClient
      .from('whatsapp_schedule_logs')
      .insert([{
        schedule_id: schedule.id,
        executed_at: new Date().toISOString(),
        status: messagesSent > 0 ? 'success' : 'error',
        properties_found: 1, // Sempre 1 página
        properties_sent: messagesSent > 0 ? 1 : 0,
        messages_sent: messagesSent,
        message_details: {
          page_url: pageUrl,
          webhook_url: webhookUrl,
          phone_numbers: phoneNumbers,
          results: messageDetails
        },
        execution_time_ms: executionTime
      }])

    return {
      schedule_id: schedule.id,
      schedule_name: schedule.name,
      success: messagesSent > 0,
      propertiesCount: 1, // Sempre 1 página
      messagesSent,
      pageUrl
    }

  } catch (error) {
    // Criar log de erro
    const executionTime = Date.now() - startTime
    await supabaseClient
      .from('whatsapp_schedule_logs')
      .insert([{
        schedule_id: schedule.id,
        executed_at: new Date().toISOString(),
        status: 'error',
        properties_found: 0,
        properties_sent: 0,
        messages_sent: 0,
        error_message: error.message,
        error_details: { error: error.toString() },
        execution_time_ms: executionTime
      }])

    throw error
  }
}

async function calculateNextSendTime(supabaseClient: any, schedule: any) {
  if (schedule.recurrence_type === 'once') {
    return null // Agendamento único, não recorre
  }

  try {
    const { data, error } = await supabaseClient
      .rpc('calculate_next_whatsapp_send_time', {
        p_recurrence_type: schedule.recurrence_type,
        p_recurrence_interval: schedule.recurrence_interval,
        p_send_time: schedule.send_time,
        p_send_weekdays: schedule.send_weekdays,
        p_send_day_of_month: schedule.send_day_of_month,
        p_timezone: schedule.send_timezone || 'America/Sao_Paulo'
      })

    if (error) {
      console.error('Erro ao calcular próximo envio:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao calcular próximo envio:', error)
    return null
  }
}
