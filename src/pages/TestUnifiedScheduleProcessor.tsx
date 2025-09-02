import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  User, 
  FileText, 
  Home, 
  Settings, 
  Clock,
  ArrowLeft,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProcessResult {
  success: boolean;
  processed: number;
  successful: number;
  total_emails_sent: number;
  total_whatsapp_sent: number;
  results: Array<{
    schedule_id: number;
    schedule_name: string;
    success: boolean;
    emailsSent: number;
    whatsappSent: number;
    leadsProcessed?: number;
    error?: string;
  }>;
  current_time?: string;
  message?: string;
  error?: string;
}

export default function TestUnifiedScheduleProcessor() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ProcessResult | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unified_schedules')
        .select(`
          *,
          lead_groups (name),
          schedule_leads (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processSchedules = async () => {
    try {
      setProcessing(true);
      
      console.log('Chamando Edge Function process-unified-schedules...');
      
      const { data, error } = await supabase.functions.invoke('process-unified-schedules', {
        method: 'POST'
      });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw error;
      }

      console.log('Resultado:', data);
      setLastResult(data);
      
      if (data.success) {
        toast({
          title: "Sucesso!",
          description: `Processamento concluído! ${data.total_emails_sent} emails e ${data.total_whatsapp_sent} WhatsApp enviados`
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro no processamento",
          variant: "destructive"
        });
      }

      // Recarregar agendamentos para ver atualizações
      await fetchSchedules();

    } catch (error) {
      console.error('Erro ao processar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar agendamentos",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatNextSend = (nextSend?: string) => {
    if (!nextSend) return 'Não agendado';
    return new Date(nextSend).toLocaleString('pt-BR');
  };

  const formatLastSent = (lastSent?: string) => {
    if (!lastSent) return 'Nunca enviado';
    return new Date(lastSent).toLocaleString('pt-BR');
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'email':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Email</Badge>;
      case 'whatsapp':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">WhatsApp</Badge>;
      case 'both':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Ambos</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Teste - Processador de Agendamentos Unificados
                </h1>
                <p className="text-sm text-gray-500">
                  Teste a função de processamento de agendamentos unificados
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center gap-2 text-xs">
                <User className="h-3 w-3" />
                {user?.email}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Site</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 border-2 font-medium bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Controles de Teste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={processSchedules}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  {processing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {processing ? 'Processando...' : 'Executar Processamento'}
                </Button>

                <Button
                  variant="outline"
                  onClick={fetchSchedules}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Carregando...' : 'Recarregar Agendamentos'}
                </Button>
              </div>

              {lastResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Último Resultado:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Processados:</span> {lastResult.processed}
                    </div>
                    <div>
                      <span className="font-medium">Sucessos:</span> {lastResult.successful}
                    </div>
                    <div>
                      <span className="font-medium">Emails:</span> {lastResult.total_emails_sent}
                    </div>
                    <div>
                      <span className="font-medium">WhatsApp:</span> {lastResult.total_whatsapp_sent}
                    </div>
                  </div>
                  {lastResult.current_time && (
                    <div className="mt-2 text-xs text-gray-500">
                      Executado em: {new Date(lastResult.current_time).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Agendamentos Unificados ({schedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Carregando agendamentos...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum agendamento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Método</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Próximo Envio</th>
                      <th className="text-left py-2">Último Envio</th>
                      <th className="text-left py-2">Frequência</th>
                      <th className="text-left py-2">Grupo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{schedule.name}</td>
                        <td className="py-2">{getMethodBadge(schedule.method)}</td>
                        <td className="py-2">{getStatusBadge(schedule.status)}</td>
                        <td className="py-2 text-sm">{formatNextSend(schedule.next_send)}</td>
                        <td className="py-2 text-sm">{formatLastSent(schedule.last_sent)}</td>
                        <td className="py-2 text-sm">
                          {schedule.frequency} {schedule.is_recurring ? '(Recorrente)' : '(Único)'}
                        </td>
                        <td className="py-2 text-sm">
                          {schedule.lead_groups?.name || 'Leads específicos'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados Detalhados */}
        {lastResult && lastResult.results && lastResult.results.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resultados Detalhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lastResult.results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{result.schedule_name}</h4>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Status:</span> {result.success ? 'Sucesso' : 'Erro'}
                      </div>
                      <div>
                        <span className="font-medium">Emails:</span> {result.emailsSent}
                      </div>
                      <div>
                        <span className="font-medium">WhatsApp:</span> {result.whatsappSent}
                      </div>
                      {result.leadsProcessed && (
                        <div>
                          <span className="font-medium">Leads:</span> {result.leadsProcessed}
                        </div>
                      )}
                    </div>
                    {result.error && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                        <span className="font-medium">Erro:</span> {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
