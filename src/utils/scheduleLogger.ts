import { supabase } from '@/integrations/supabase/client';

export interface ScheduleLogData {
  schedule_id: number;
  status: 'success' | 'error' | 'partial';
  total_recipients: number;
  successful_sends: number;
  failed_sends: number;
  method: 'whatsapp' | 'email' | 'both';
  error_message?: string;
  execution_details?: any;
}

export class ScheduleLogger {
  /**
   * Registra um log de execução de agendamento
   */
  static async logExecution(logData: ScheduleLogData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('schedule_logs')
        .insert({
          schedule_id: logData.schedule_id,
          status: logData.status,
          total_recipients: logData.total_recipients,
          successful_sends: logData.successful_sends,
          failed_sends: logData.failed_sends,
          method: logData.method,
          error_message: logData.error_message || null,
          execution_details: logData.execution_details || null,
          execution_date: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao registrar log de execução:', error);
        return false;
      }

      console.log('Log de execução registrado com sucesso:', logData);
      return true;
    } catch (error) {
      console.error('Erro inesperado ao registrar log:', error);
      return false;
    }
  }

  /**
   * Registra um log de sucesso
   */
  static async logSuccess(
    scheduleId: number,
    totalRecipients: number,
    successfulSends: number,
    method: 'whatsapp' | 'email' | 'both',
    details?: any
  ): Promise<boolean> {
    return this.logExecution({
      schedule_id: scheduleId,
      status: 'success',
      total_recipients: totalRecipients,
      successful_sends: successfulSends,
      failed_sends: totalRecipients - successfulSends,
      method,
      execution_details: details
    });
  }

  /**
   * Registra um log de erro
   */
  static async logError(
    scheduleId: number,
    totalRecipients: number,
    failedSends: number,
    method: 'whatsapp' | 'email' | 'both',
    errorMessage: string,
    details?: any
  ): Promise<boolean> {
    return this.logExecution({
      schedule_id: scheduleId,
      status: 'error',
      total_recipients: totalRecipients,
      successful_sends: totalRecipients - failedSends,
      failed_sends: failedSends,
      method,
      error_message: errorMessage,
      execution_details: details
    });
  }

  /**
   * Registra um log parcial (alguns sucessos, alguns erros)
   */
  static async logPartial(
    scheduleId: number,
    totalRecipients: number,
    successfulSends: number,
    failedSends: number,
    method: 'whatsapp' | 'email' | 'both',
    errorMessage?: string,
    details?: any
  ): Promise<boolean> {
    return this.logExecution({
      schedule_id: scheduleId,
      status: 'partial',
      total_recipients: totalRecipients,
      successful_sends: successfulSends,
      failed_sends: failedSends,
      method,
      error_message: errorMessage,
      execution_details: details
    });
  }

  /**
   * Busca logs de um agendamento específico
   */
  static async getScheduleLogs(scheduleId: number) {
    try {
      const { data, error } = await supabase
        .from('schedule_logs')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('execution_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar logs do agendamento:', error);
      return [];
    }
  }

  /**
   * Busca estatísticas de logs de um agendamento
   */
  static async getScheduleStats(scheduleId: number) {
    try {
      const { data, error } = await supabase
        .from('schedule_logs')
        .select('*')
        .eq('schedule_id', scheduleId);

      if (error) throw error;

      const logs = data || [];
      const totalExecutions = logs.length;
      const successfulExecutions = logs.filter(log => log.status === 'success').length;
      const failedExecutions = logs.filter(log => log.status === 'error').length;
      const partialExecutions = logs.filter(log => log.status === 'partial').length;
      const totalSent = logs.reduce((sum, log) => sum + log.successful_sends, 0);
      const totalFailed = logs.reduce((sum, log) => sum + log.failed_sends, 0);

      return {
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        partialExecutions,
        totalSent,
        totalFailed,
        successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do agendamento:', error);
      return null;
    }
  }
}
