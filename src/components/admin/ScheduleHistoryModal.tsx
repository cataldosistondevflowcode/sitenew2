import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail, MessageCircle, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleLog {
  id: number;
  schedule_id: number;
  execution_date: string;
  status: 'success' | 'error' | 'partial';
  total_recipients: number;
  successful_sends: number;
  failed_sends: number;
  method: 'whatsapp' | 'email' | 'both';
  error_message?: string;
  execution_details?: any;
  created_at: string;
}

interface ScheduleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
  scheduleName: string;
}

export const ScheduleHistoryModal = ({ isOpen, onClose, scheduleId, scheduleName }: ScheduleHistoryModalProps) => {
  const [logs, setLogs] = useState<ScheduleLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && scheduleId) {
      fetchScheduleLogs();
    }
  }, [isOpen, scheduleId]);

  const fetchScheduleLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_logs')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('execution_date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar logs do agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Parcial</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'both':
        return (
          <div className="flex gap-1">
            <MessageCircle className="h-3 w-3 text-green-600" />
            <Mail className="h-3 w-3 text-blue-600" />
          </div>
        );
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Envios - {scheduleName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Carregando histórico...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum envio registrado ainda</p>
              <p className="text-sm text-gray-400">Os logs aparecerão aqui após a primeira execução</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {formatDate(log.execution_date)}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getMethodIcon(log.method)}
                            <span className="text-xs text-gray-500 capitalize">
                              {log.method === 'both' ? 'WhatsApp + Email' : log.method}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-medium">{log.total_recipients}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Sucessos</p>
                          <p className="font-medium text-green-600">{log.successful_sends}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500">Falhas</p>
                          <p className="font-medium text-red-600">{log.failed_sends}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Taxa</p>
                          <p className="font-medium">
                            {log.total_recipients > 0 
                              ? Math.round((log.successful_sends / log.total_recipients) * 100)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {log.error_message && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Erro:</strong> {log.error_message}
                        </p>
                      </div>
                    )}
                    
                    {log.execution_details && (
                      <details className="mt-3">
                        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                          Ver detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.execution_details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
