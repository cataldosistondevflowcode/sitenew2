import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Calendar,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

interface ProcessResult {
  success: boolean;
  processed: number;
  successful: number;
  total_messages_sent: number;
  results: Array<{
    schedule_id: string;
    schedule_name: string;
    success: boolean;
    propertiesCount: number;
    messagesSent: number;
    error?: string;
  }>;
}

export default function TestWhatsAppScheduleProcessor() {
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ProcessResult | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos WhatsApp:', error);
      toast.error('Erro ao carregar agendamentos WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const processSchedules = async () => {
    try {
      setProcessing(true);
      
      console.log('Chamando Edge Function process-whatsapp-schedules...');
      
      const { data, error } = await supabase.functions.invoke('process-whatsapp-schedules', {
        method: 'POST'
      });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw error;
      }

      console.log('Resultado:', data);
      setLastResult(data);
      
      if (data.success) {
        toast.success(`Processamento concluído! ${data.total_messages_sent} mensagens enviadas`);
      } else {
        toast.error('Erro no processamento');
      }

      // Recarregar agendamentos para ver atualizações
      await fetchSchedules();

    } catch (error) {
      console.error('Erro ao processar agendamentos WhatsApp:', error);
      toast.error('Erro ao processar agendamentos WhatsApp');
    } finally {
      setProcessing(false);
    }
  };

  const formatNextSend = (nextSendAt?: string) => {
    if (!nextSendAt) return 'Não agendado';
    
    const date = new Date(nextSendAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Pronto para executar';
    
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `Em ${diffMinutes} min`;
    
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `Em ${diffHours}h`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const getRecurrenceText = (schedule: any) => {
    switch (schedule.recurrence_type) {
      case 'once':
        return 'Única vez';
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

  const getPhoneCount = (schedule: any) => {
    if (schedule.phone_list_id) {
      return 'Lista de telefones';
    }
    return `${schedule.recipient_phones?.length || 0} telefone(s)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Processador de Agendamentos WhatsApp</h1>
            <p className="text-gray-600">Teste manual da Edge Function de WhatsApp recorrente</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchSchedules}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button
              onClick={processSchedules}
              disabled={processing}
              className="flex items-center gap-2 bg-[#25d366] hover:bg-[#128c7e]"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Processar Agendamentos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resultado da última execução */}
        {lastResult && (
          <Card className={lastResult.success ? 'border-green-200' : 'border-red-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {lastResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Resultado da Última Execução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{lastResult.processed}</div>
                  <div className="text-sm text-gray-600">Processados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{lastResult.successful}</div>
                  <div className="text-sm text-gray-600">Sucessos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#25d366]">{lastResult.total_messages_sent}</div>
                  <div className="text-sm text-gray-600">Mensagens Enviadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {lastResult.results?.reduce((sum, r) => sum + r.propertiesCount, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Propriedades</div>
                </div>
              </div>

              {/* Detalhes por agendamento */}
              {lastResult.results && lastResult.results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detalhes por Agendamento:</h4>
                  {lastResult.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.schedule_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{result.propertiesCount} propriedades</span>
                        <span>{result.messagesSent} mensagens</span>
                        {result.error && (
                          <Badge variant="destructive" className="text-xs">
                            {result.error}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lista de agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#25d366]" />
              Agendamentos WhatsApp Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Carregando agendamentos...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum agendamento WhatsApp encontrado</p>
                <Button 
                  variant="outline" 
                  onClick={fetchSchedules}
                  className="mt-4"
                >
                  Recarregar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${schedule.is_active ? 'bg-[#25d366]' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium">{schedule.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {getPhoneCount(schedule)}
                          </span>
                          <span>{schedule.page_type}</span>
                          <span>Max: {schedule.max_properties} imóveis</span>
                          <span>{getRecurrenceText(schedule)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formatNextSend(schedule.next_send_at)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Enviadas: {schedule.total_messages_sent || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              1. <strong>Verifique os agendamentos</strong> na lista acima
            </p>
            <p className="text-sm text-gray-600">
              2. <strong>Clique "Processar Agendamentos"</strong> para executar manualmente a Edge Function
            </p>
            <p className="text-sm text-gray-600">
              3. <strong>Agendamentos "Pronto para executar"</strong> serão processados e mensagens enviadas
            </p>
            <p className="text-sm text-gray-600">
              4. <strong>Verifique o resultado</strong> no card de resultado acima
            </p>
            <div className="bg-yellow-50 p-3 rounded-lg mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> A integração real com WhatsApp API precisa ser configurada na Edge Function. 
                Atualmente, as mensagens são apenas simuladas nos logs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
