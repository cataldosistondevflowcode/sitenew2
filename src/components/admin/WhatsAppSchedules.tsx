import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Phone, Edit2, Trash2, Play, Pause, BarChart3, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppSchedule {
  id: string;
  name: string;
  description: string | null;
  page_type: 'RJ' | 'SP';
  message_template: string;
  recipient_phones: string[] | null;
  phone_list_id: string | null;
  recurrence_type: string;
  recurrence_interval: number;
  send_time: string;
  send_weekdays: number[] | null;
  send_day_of_month: number | null;
  is_active: boolean;
  next_send_at: string | null;
  last_sent_at: string | null;
  total_messages_sent: number | null;
  created_at: string;
  // Dados relacionados
  phone_list?: {
    name: string;
    phones: string[];
  };
}

interface ScheduleLog {
  id: string;
  executed_at: string;
  status: string;
  messages_sent: number;
  properties_found: number;
  error_message: string | null;
  execution_time_ms: number;
}

const WhatsAppSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<WhatsAppSchedule[]>([]);
  const [logs, setLogs] = useState<Record<string, ScheduleLog[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [processingSchedule, setProcessingSchedule] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar agendamentos
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_schedules')
        .select(`
          *,
          phone_list:whatsapp_phone_lists(name, phones)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar logs de um agendamento
  const fetchScheduleLogs = async (scheduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_schedule_logs')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('executed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(prev => ({ ...prev, [scheduleId]: data || [] }));
    } catch (error: any) {
      console.error('Erro ao carregar logs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar logs",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Ativar/desativar agendamento
  const handleToggleActive = async (scheduleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('whatsapp_schedules')
        .update({ is_active: !isActive })
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: !isActive ? 'Agendamento ativado' : 'Agendamento pausado'
      });
      fetchSchedules();
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar agendamento",
        variant: "destructive"
      });
    }
  };

  // Deletar agendamento
  const handleDeleteSchedule = async (scheduleId: string, scheduleName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o agendamento "${scheduleName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('whatsapp_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Agendamento deletado com sucesso"
      });
      fetchSchedules();
    } catch (error: any) {
      console.error('Erro ao deletar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar agendamento",
        variant: "destructive"
      });
    }
  };

  // Executar agendamento manualmente
  const handleExecuteNow = async (scheduleId: string, scheduleName: string) => {
    if (!confirm(`Executar agendamento "${scheduleName}" agora?`)) {
      return;
    }

    try {
      setProcessingSchedule(scheduleId);

      // Atualizar o next_send_at para agora para forçar execução
      const { error: updateError } = await supabase
        .from('whatsapp_schedules')
        .update({ next_send_at: new Date().toISOString() })
        .eq('id', scheduleId);

      if (updateError) throw updateError;

      // Chamar a Edge Function
      const { data, error } = await supabase.functions.invoke('process-whatsapp-schedules');

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Agendamento executado com sucesso"
      });
      fetchSchedules();
      if (expandedSchedule === scheduleId) {
        fetchScheduleLogs(scheduleId);
      }
    } catch (error: any) {
      console.error('Erro ao executar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar agendamento",
        variant: "destructive"
      });
    } finally {
      setProcessingSchedule(null);
    }
  };

  // Expandir/colapsar detalhes
  const toggleExpanded = (scheduleId: string) => {
    if (expandedSchedule === scheduleId) {
      setExpandedSchedule(null);
    } else {
      setExpandedSchedule(scheduleId);
      fetchScheduleLogs(scheduleId);
    }
  };

  // Formatar recorrência
  const formatRecurrence = (schedule: WhatsAppSchedule) => {
    switch (schedule.recurrence_type) {
      case 'once':
        return 'Única';
      case 'daily':
        return `Diário (a cada ${schedule.recurrence_interval} dia(s))`;
      case 'weekly':
        return `Semanal (a cada ${schedule.recurrence_interval} semana(s))`;
      case 'monthly':
        return `Mensal (a cada ${schedule.recurrence_interval} mês(es))`;
      default:
        return schedule.recurrence_type;
    }
  };

  // Formatar próximo envio
  const formatNextSend = (nextSendAt: string | null) => {
    if (!nextSendAt) return 'N/A';
    const date = new Date(nextSendAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Pronto para executar';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `Em ${diffDays} dia(s) - ${date.toLocaleString('pt-BR')}`;
    } else if (diffHours > 0) {
      return `Em ${diffHours} hora(s) - ${date.toLocaleString('pt-BR')}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Em ${diffMinutes} minuto(s) - ${date.toLocaleString('pt-BR')}`;
    }
  };

  // Formatar telefones
  const getPhoneCount = (schedule: WhatsAppSchedule) => {
    if (schedule.phone_list?.phones) {
      return schedule.phone_list.phones.length;
    }
    return schedule.recipient_phones?.filter(p => p.trim()).length || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando agendamentos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agendamentos WhatsApp</h1>
        <p className="text-gray-600 mt-2">Gerencie e monitore agendamentos de envio WhatsApp</p>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{schedules.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {schedules.filter(s => s.is_active).length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pausados</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {schedules.filter(s => !s.is_active).length}
                </p>
              </div>
              <Pause className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensagens Enviadas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {schedules.reduce((sum, s) => sum + (s.total_messages_sent || 0), 0)}
                </p>
              </div>
              <Phone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-gray-600">Os agendamentos criados aparecerão aqui</p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {schedule.name}
                      <Badge variant={schedule.is_active ? "default" : "secondary"}>
                        {schedule.is_active ? 'Ativo' : 'Pausado'}
                      </Badge>
                      <Badge variant="outline">
                        {schedule.page_type}
                      </Badge>
                    </CardTitle>
                    {schedule.description && (
                      <CardDescription className="mt-1">
                        {schedule.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(schedule.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(schedule.id, schedule.is_active)}
                    >
                      {schedule.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecuteNow(schedule.id, schedule.name)}
                      disabled={processingSchedule === schedule.id}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id, schedule.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Recorrência:</span>
                    <p>{formatRecurrence(schedule)}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Horário:</span>
                    <p>{schedule.send_time}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Telefones:</span>
                    <p>{getPhoneCount(schedule)} contatos</p>
                  </div>
                  <div>
                    <span className="font-semibold">Mensagens Enviadas:</span>
                    <p>{schedule.total_messages_sent || 0}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold">Próximo Envio:</span>
                    <p>{formatNextSend(schedule.next_send_at)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold">Último Envio:</span>
                    <p>{schedule.last_sent_at ? new Date(schedule.last_sent_at).toLocaleString('pt-BR') : 'Nunca'}</p>
                  </div>
                </div>

                {expandedSchedule === schedule.id && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    {/* Detalhes do agendamento */}
                    <div>
                      <h4 className="font-semibold mb-2">Detalhes do Agendamento</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p><strong>URL:</strong> {schedule.message_template}</p>
                        {schedule.phone_list ? (
                          <p><strong>Lista:</strong> {schedule.phone_list.name}</p>
                        ) : (
                          <p><strong>Telefones manuais:</strong> {schedule.recipient_phones?.join(', ')}</p>
                        )}
                      </div>
                    </div>

                    {/* Logs de execução */}
                    <div>
                      <h4 className="font-semibold mb-2">Últimas Execuções</h4>
                      {logs[schedule.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {logs[schedule.id].slice(0, 5).map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                                  {log.status}
                                </Badge>
                                <span className="text-sm">
                                  {new Date(log.executed_at).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {log.messages_sent} mensagem(s) • {log.execution_time_ms}ms
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Nenhuma execução registrada</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WhatsAppSchedules;
