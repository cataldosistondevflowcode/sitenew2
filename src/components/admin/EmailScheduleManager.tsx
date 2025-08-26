import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Calendar,
  Clock,
  Mail,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailScheduleForm } from './EmailScheduleForm';

interface EmailSchedule {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  page_type: 'RJ' | 'SP';
  filter_config?: any;
  max_properties: number;
  subject_template: string;
  recipient_emails: string[];
  email_list_id?: string;
  recurrence_type: 'daily' | 'weekly' | 'monthly';
  recurrence_interval: number;
  send_time: string;
  send_weekdays?: number[];
  send_day_of_month?: number;
  last_sent_at?: string;
  next_send_at?: string;
  total_emails_sent: number;
  created_at: string;
}

export function EmailScheduleManager() {
  const [schedules, setSchedules] = useState<EmailSchedule[]>([]);
  const [emailLists, setEmailLists] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<EmailSchedule | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchEmailLists();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailLists = async () => {
    try {
      const { data, error } = await supabase
        .from('email_lists')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setEmailLists(data || []);
    } catch (error) {
      console.error('Erro ao carregar listas de emails:', error);
    }
  };

  const toggleScheduleStatus = async (id: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_schedules')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSchedules(schedules.map(schedule => 
        schedule.id === id 
          ? { ...schedule, is_active: newStatus }
          : schedule
      ));

      toast.success(`Agendamento ${newStatus ? 'ativado' : 'pausado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do agendamento');
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('email_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast.success('Agendamento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      toast.error('Erro ao excluir agendamento');
    }
  };

  const formatRecurrence = (schedule: EmailSchedule) => {
    const { recurrence_type, recurrence_interval, send_weekdays, send_day_of_month } = schedule;
    
    let text = '';
    if (recurrence_interval > 1) {
      text = `A cada ${recurrence_interval} `;
    } else {
      text = '';
    }

    switch (recurrence_type) {
      case 'daily':
        text += recurrence_interval > 1 ? 'dias' : 'Todo dia';
        break;
      case 'weekly':
        text += recurrence_interval > 1 ? 'semanas' : 'Toda semana';
        if (send_weekdays?.length) {
          const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          const dayNames = send_weekdays.map(day => days[day % 7]).join(', ');
          text += ` (${dayNames})`;
        }
        break;
      case 'monthly':
        text += recurrence_interval > 1 ? 'meses' : 'Todo mês';
        if (send_day_of_month) {
          text += ` (dia ${send_day_of_month})`;
        }
        break;
    }

    return text;
  };

  const formatNextSend = (nextSendAt?: string) => {
    if (!nextSendAt) return 'Não agendado';
    
    const date = new Date(nextSendAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Atrasado';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `Em ${diffDays} dias`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const openEditDialog = (schedule: EmailSchedule) => {
    setEditingSchedule(schedule);
    setFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setFormDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleFormSuccess = () => {
    fetchSchedules();
    closeFormDialog();
  };

  const getRecipientInfo = (schedule: EmailSchedule) => {
    if (schedule.email_list_id) {
      const emailList = emailLists.find(list => list.id === schedule.email_list_id);
      return emailList ? `Lista: ${emailList.name}` : 'Lista não encontrada';
    } else {
      return `${schedule.recipient_emails.length} email${schedule.recipient_emails.length !== 1 ? 's' : ''} manual${schedule.recipient_emails.length !== 1 ? 'is' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails Recorrentes</h1>
          <p className="text-gray-600">Gerencie agendamentos automáticos de envio de catálogos</p>
        </div>
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription>
                Configure um envio recorrente de catálogo de imóveis por email
              </DialogDescription>
            </DialogHeader>
            <EmailScheduleForm 
              schedule={editingSchedule}
              onSuccess={handleFormSuccess}
              onCancel={closeFormDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Agendamentos */}
      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
            <p className="text-gray-600 text-center mb-4">
              Crie seu primeiro agendamento de envio recorrente
            </p>
            <Button onClick={() => setFormDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className={schedule.is_active ? 'border-green-200' : 'border-gray-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${schedule.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                      {schedule.description && (
                        <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={schedule.page_type === 'RJ' ? 'default' : 'secondary'}>
                      {schedule.page_type}
                    </Badge>
                    <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                      {schedule.is_active ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Recorrência:</span>
                    <span className="text-sm">{formatRecurrence(schedule)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Horário:</span>
                    <span className="text-sm">{schedule.send_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Destinatários:</span>
                    <span className="text-sm">{getRecipientInfo(schedule)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Max imóveis:</span>
                    <span className="text-sm">{schedule.max_properties}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">Próximo envio:</span>
                      <span className={`ml-1 ${schedule.next_send_at && new Date(schedule.next_send_at) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                        {formatNextSend(schedule.next_send_at)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Total enviados:</span>
                      <span className="ml-1 text-gray-600">{schedule.total_emails_sent}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleScheduleStatus(schedule.id, !schedule.is_active)}
                      className="flex items-center gap-1"
                    >
                      {schedule.is_active ? (
                        <>
                          <Pause className="h-3 w-3" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(schedule)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSchedule(schedule.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
