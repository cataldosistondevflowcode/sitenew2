// EXEMPLO DE COMO USAR O SCHEDULE LOGGER
// Este arquivo mostra como integrar o sistema de logs nas funções de envio

import { ScheduleLogger } from '@/utils/scheduleLogger';

// Exemplo 1: Envio bem-sucedido
export async function executeScheduleSuccessfully(
  scheduleId: number,
  recipients: any[],
  method: 'whatsapp' | 'email' | 'both'
) {
  try {
    // Simular envio para todos os destinatários
    const totalRecipients = recipients.length;
    const successfulSends = totalRecipients; // Todos foram enviados com sucesso
    
    // Registrar log de sucesso
    await ScheduleLogger.logSuccess(
      scheduleId,
      totalRecipients,
      successfulSends,
      method,
      {
        execution_time: new Date().toISOString(),
        recipients_count: totalRecipients,
        message_sent: true
      }
    );

    console.log('Agendamento executado com sucesso!');
  } catch (error) {
    console.error('Erro na execução:', error);
  }
}

// Exemplo 2: Envio com falhas
export async function executeScheduleWithFailures(
  scheduleId: number,
  recipients: any[],
  method: 'whatsapp' | 'email' | 'both'
) {
  try {
    const totalRecipients = recipients.length;
    const successfulSends = Math.floor(totalRecipients * 0.8); // 80% de sucesso
    const failedSends = totalRecipients - successfulSends;
    
    // Registrar log parcial
    await ScheduleLogger.logPartial(
      scheduleId,
      totalRecipients,
      successfulSends,
      failedSends,
      method,
      'Alguns envios falharam devido a números inválidos',
      {
        execution_time: new Date().toISOString(),
        failed_recipients: recipients.slice(successfulSends),
        error_details: 'Números de telefone inválidos'
      }
    );

    console.log('Agendamento executado parcialmente!');
  } catch (error) {
    console.error('Erro na execução:', error);
  }
}

// Exemplo 3: Envio com erro total
export async function executeScheduleWithError(
  scheduleId: number,
  recipients: any[],
  method: 'whatsapp' | 'email' | 'both'
) {
  try {
    const totalRecipients = recipients.length;
    
    // Simular erro total
    throw new Error('Serviço de WhatsApp indisponível');
    
  } catch (error) {
    // Registrar log de erro
    await ScheduleLogger.logError(
      scheduleId,
      recipients.length,
      recipients.length, // Todos falharam
      method,
      error instanceof Error ? error.message : 'Erro desconhecido',
      {
        execution_time: new Date().toISOString(),
        error_type: 'service_unavailable',
        retry_attempts: 3
      }
    );

    console.error('Agendamento falhou completamente!');
  }
}

// Exemplo 4: Como integrar nas funções existentes
export async function integrateWithExistingScheduleFunction(
  scheduleId: number,
  scheduleData: any,
  recipients: any[]
) {
  const startTime = Date.now();
  
  try {
    // Sua lógica de envio existente aqui
    let successfulSends = 0;
    let failedSends = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Simular envio individual
        await sendToRecipient(recipient, scheduleData);
        successfulSends++;
      } catch (error) {
        failedSends++;
        errors.push(`${recipient.name}: ${error}`);
      }
    }

    // Determinar status baseado nos resultados
    let status: 'success' | 'error' | 'partial';
    if (failedSends === 0) {
      status = 'success';
    } else if (successfulSends === 0) {
      status = 'error';
    } else {
      status = 'partial';
    }

    // Registrar log
    await ScheduleLogger.logExecution({
      schedule_id: scheduleId,
      status,
      total_recipients: recipients.length,
      successful_sends: successfulSends,
      failed_sends: failedSends,
      method: scheduleData.method,
      error_message: errors.length > 0 ? errors.join('; ') : undefined,
      execution_details: {
        execution_time_ms: Date.now() - startTime,
        schedule_name: scheduleData.name,
        individual_errors: errors
      }
    });

    return { successfulSends, failedSends, errors };
    
  } catch (error) {
    // Log de erro geral
    await ScheduleLogger.logError(
      scheduleId,
      recipients.length,
      recipients.length,
      scheduleData.method,
      error instanceof Error ? error.message : 'Erro geral na execução',
      {
        execution_time_ms: Date.now() - startTime,
        schedule_name: scheduleData.name
      }
    );
    
    throw error;
  }
}

// Função auxiliar simulada
async function sendToRecipient(recipient: any, scheduleData: any) {
  // Simular envio
  if (Math.random() < 0.1) { // 10% de chance de falha
    throw new Error('Falha no envio');
  }
  return true;
}
