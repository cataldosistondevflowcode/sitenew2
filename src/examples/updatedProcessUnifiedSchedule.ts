// EXEMPLO DE COMO INTEGRAR O SISTEMA DE LOGS
// Esta é uma versão atualizada da função processUnifiedSchedule com logging

async function processUnifiedScheduleWithLogging(supabaseClient: any, schedule: any) {
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
    let emailErrors: string[] = []
    let whatsappErrors: string[] = []

    // Processar emails se necessário
    if (schedule.method === 'email' || schedule.method === 'both') {
      try {
        emailsSent = await processEmails(supabaseClient, schedule, leads)
      } catch (error) {
        emailErrors.push(`Erro no envio de emails: ${error.message}`)
        console.error(`   ❌ Erro no processamento de emails:`, error)
      }
    }

    // Processar WhatsApp se necessário
    if (schedule.method === 'whatsapp' || schedule.method === 'both') {
      try {
        whatsappSent = await processWhatsApp(supabaseClient, schedule, leads)
      } catch (error) {
        whatsappErrors.push(`Erro no envio de WhatsApp: ${error.message}`)
        console.error(`   ❌ Erro no processamento de WhatsApp:`, error)
      }
    }

    // Calcular estatísticas para o log
    const totalRecipients = leads.length
    const totalSuccessfulSends = emailsSent + whatsappSent
    const totalFailedSends = totalRecipients - totalSuccessfulSends
    const allErrors = [...emailErrors, ...whatsappErrors]

    // Determinar status do log
    let logStatus: 'success' | 'error' | 'partial'
    if (allErrors.length === 0 && totalFailedSends === 0) {
      logStatus = 'success'
    } else if (totalSuccessfulSends === 0) {
      logStatus = 'error'
    } else {
      logStatus = 'partial'
    }

    // Registrar log no banco de dados
    await supabaseClient
      .from('schedule_logs')
      .insert({
        schedule_id: schedule.id,
        status: logStatus,
        total_recipients: totalRecipients,
        successful_sends: totalSuccessfulSends,
        failed_sends: totalFailedSends,
        method: schedule.method,
        error_message: allErrors.length > 0 ? allErrors.join('; ') : null,
        execution_details: {
          execution_time_ms: Date.now() - startTime,
          schedule_name: schedule.name,
          emails_sent: emailsSent,
          whatsapp_sent: whatsappSent,
          email_errors: emailErrors,
          whatsapp_errors: whatsappErrors,
          leads_processed: leads.length
        },
        execution_date: new Date().toISOString()
      })

    console.log(`   📊 Log registrado: ${logStatus} - ${totalSuccessfulSends}/${totalRecipients} envios`)

    // Calcular próximo envio se for recorrente
    let nextSend = null
    if (schedule.is_recurring) {
      nextSend = await calculateNextSendTime(supabaseClient, schedule)
    }

    // Atualizar agendamento
    const updateData: any = {
      last_sent: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (nextSend) {
      updateData.next_send = nextSend
    }

    const { error: updateError } = await supabaseClient
      .from('unified_schedules')
      .update(updateData)
      .eq('id', schedule.id)

    if (updateError) {
      console.error(`   ⚠️ Erro ao atualizar agendamento:`, updateError)
    }

    return {
      schedule_id: schedule.id,
      schedule_name: schedule.name,
      success: logStatus !== 'error',
      emailsSent,
      whatsappSent,
      totalRecipients,
      logStatus,
      errors: allErrors
    }

  } catch (error) {
    console.error(`   ❌ Erro geral no processamento:`, error)
    
    // Registrar log de erro
    await supabaseClient
      .from('schedule_logs')
      .insert({
        schedule_id: schedule.id,
        status: 'error',
        total_recipients: 0,
        successful_sends: 0,
        failed_sends: 0,
        method: schedule.method,
        error_message: error.message,
        execution_details: {
          execution_time_ms: Date.now() - startTime,
          schedule_name: schedule.name,
          error_type: 'general_error'
        },
        execution_date: new Date().toISOString()
      })

    throw error
  }
}

// Função auxiliar para processar emails (exemplo)
async function processEmails(supabaseClient: any, schedule: any, leads: any[]) {
  console.log(`   📧 Processando emails para ${leads.length} leads`)
  
  let emailsSent = 0
  const validEmails = leads.filter(lead => lead.email && lead.email.trim())

  if (validEmails.length === 0) {
    console.log(`   ⚠️ Nenhum email válido encontrado`)
    return 0
  }

  for (const lead of validEmails) {
    try {
      // Aqui você colocaria sua lógica de envio de email
      // Por exemplo, chamar um serviço de email como SendGrid, Mailgun, etc.
      
      console.log(`     📧 Enviando email para ${lead.email}`)
      
      // Simular envio (substitua pela sua lógica real)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      emailsSent++
      console.log(`     ✅ Email enviado para ${lead.email}`)
      
    } catch (error) {
      console.error(`     ❌ Erro ao enviar email para ${lead.email}:`, error)
      throw error // Re-throw para ser capturado pela função principal
    }
  }

  console.log(`   ✅ ${emailsSent} emails processados`)
  return emailsSent
}

// Função auxiliar para processar WhatsApp (exemplo)
async function processWhatsApp(supabaseClient: any, schedule: any, leads: any[]) {
  console.log(`   📱 Processando WhatsApp para ${leads.length} leads`)
  
  let whatsappSent = 0
  const validPhones = leads.filter(lead => lead.phone && lead.phone.trim())

  if (validPhones.length === 0) {
    console.log(`   ⚠️ Nenhum telefone válido encontrado`)
    return 0
  }

  for (const lead of validPhones) {
    try {
      // Aqui você colocaria sua lógica de envio de WhatsApp
      // Por exemplo, chamar o webhook do n8n como no código original
      
      console.log(`     📱 Enviando WhatsApp para ${lead.phone}`)
      
      // Simular envio (substitua pela sua lógica real)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      whatsappSent++
      console.log(`     ✅ WhatsApp enviado para ${lead.phone}`)
      
    } catch (error) {
      console.error(`     ❌ Erro ao enviar WhatsApp para ${lead.phone}:`, error)
      throw error // Re-throw para ser capturado pela função principal
    }
  }

  console.log(`   ✅ ${whatsappSent} mensagens WhatsApp processadas`)
  return whatsappSent
}

// Função auxiliar para calcular próximo envio
async function calculateNextSendTime(supabaseClient: any, schedule: any) {
  // Sua lógica existente para calcular próximo envio
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Exemplo: +1 dia
}
