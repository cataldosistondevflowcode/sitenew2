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
  Plus,
  Calendar,
  Users,
  Mail,
  MessageCircle,
  Trash2,
  Power,
  PowerOff,
  History
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleHistoryModal } from '@/components/admin/ScheduleHistoryModal';

interface Schedule {
  id: number;
  name: string;
  group_name: string;
  properties: string[];
  method: 'email' | 'whatsapp' | 'both';
  frequency: string;
  next_send: string;
  status: 'active' | 'inactive' | 'paused';
  leads: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  leads_count: number;
}

const AdminSchedules = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedScheduleName, setSelectedScheduleName] = useState<string>('');

  // Função para formatar a data do próximo envio corretamente
  const formatNextSendDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        console.error('Data inválida:', dateString);
        return 'Envio realizado';
      }
      
      // Formatar sem conversão de timezone - usar a data como está
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleString('pt-BR', options);
    } catch (error) {
      console.error('Erro ao formatar data:', error, 'String:', dateString);
      return 'Envio realizado';
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      console.log('Buscando agendamentos...');
      
      const { data, error } = await supabase
        .from('unified_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na consulta:', error);
        throw error;
      }

      console.log('Dados brutos recebidos:', data);

      // Buscar nomes dos grupos e leads para cada agendamento
      const schedulesWithGroups = await Promise.all(
        (data || []).map(async (schedule) => {
          let groupName = 'Sem grupo';
          if (schedule.group_id) {
            const { data: groupData } = await supabase
              .from('lead_groups')
              .select('name')
              .eq('id', schedule.group_id)
              .single();
            groupName = groupData?.name || 'Sem grupo';
          }
          
          // Buscar leads associados ao agendamento
          let leads: Array<{id: number, name: string, email: string}> = [];
          let leadsCount = 0;
          
          // Primeiro, verificar se há leads específicos na tabela schedule_leads
          const { data: scheduleLeads } = await supabase
            .from('schedule_leads')
            .select(`
              lead_id,
              contact_leads (
                id,
                name,
                email
              )
            `)
            .eq('schedule_id', schedule.id);
          
          if (scheduleLeads && scheduleLeads.length > 0) {
            leads = scheduleLeads
              .map(sl => sl.contact_leads)
              .filter(Boolean)
              .map(lead => ({
                id: lead.id,
                name: lead.name || 'Sem nome',
                email: lead.email || ''
              }));
            leadsCount = leads.length;
          } else if (schedule.group_id) {
            // Se não há leads específicos, buscar leads do grupo
            const { data: groupLeads } = await supabase
              .from('contact_leads')
              .select('id, name, email')
              .eq('group_id', schedule.group_id);
            
            if (groupLeads && groupLeads.length > 0) {
              leads = groupLeads.map(lead => ({
                id: lead.id,
                name: lead.name || 'Sem nome',
                email: lead.email || ''
              }));
              leadsCount = leads.length;
            }
          }
          
          return {
            id: schedule.id,
            name: schedule.name,
            group_name: groupName,
            properties: [], // TODO: Buscar propriedades relacionadas
            method: schedule.method,
            frequency: schedule.frequency,
            next_send: schedule.next_send || 'Não agendado',
            status: schedule.status,
            leads: leads,
            leads_count: leadsCount
          };
        })
      );

      const formattedSchedules: Schedule[] = schedulesWithGroups;

      console.log('Agendamentos formatados:', formattedSchedules);
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };



  const handleCreateSchedule = () => {
    navigate('/admin/schedules/create');
  };

  const handleOpenHistory = (scheduleId: number, scheduleName: string) => {
    setSelectedScheduleId(scheduleId);
    setSelectedScheduleName(scheduleName);
    setHistoryModalOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
    setSelectedScheduleId(null);
    setSelectedScheduleName('');
  };

  const handleToggleStatus = async (scheduleId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('unified_schedules')
        .update({ status: newStatus })
        .eq('id', scheduleId);

      if (error) {
        console.error('Erro ao alterar status:', error);
        alert('Erro ao alterar status do agendamento. Tente novamente.');
        return;
      }

      // Atualizar a lista local
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, status: newStatus as 'active' | 'inactive' | 'paused' }
          : schedule
      ));

      console.log(`Agendamento ${scheduleId} ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do agendamento. Tente novamente.');
    }
  };

  const handleDeleteSchedule = async (scheduleId: number, scheduleName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o agendamento "${scheduleName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // Primeiro, excluir relacionamentos
      await supabase
        .from('schedule_properties')
        .delete()
        .eq('schedule_id', scheduleId);

      await supabase
        .from('schedule_leads')
        .delete()
        .eq('schedule_id', scheduleId);

      // Depois, excluir o agendamento
      const { error } = await supabase
        .from('unified_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento. Tente novamente.');
        return;
      }

      // Atualizar a lista local
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));

      console.log(`Agendamento ${scheduleId} excluído com sucesso`);
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert('Erro ao excluir agendamento. Tente novamente.');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'both':
        return (
          <div className="flex gap-1">
            <Mail className="h-4 w-4 text-blue-600" />
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'email':
        return 'Email';
      case 'whatsapp':
        return 'WhatsApp';
      case 'both':
        return 'Ambos';
      default:
        return method;
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
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://imoveis.leilaodeimoveis-cataldosiston.com/logotipo_cataldo_siston.png" 
                  alt="Cataldo Siston" 
                  className="h-10 w-auto"
                />
              </button>
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
                onClick={() => navigate('/admin/leads')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </Button>



              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAdmin}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Agendamentos
              </h2>
              <p className="text-gray-600 mt-1">
                Programe envios automáticos para seus grupos
              </p>
            </div>
            <Button 
              onClick={handleCreateSchedule}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>

          {/* Card Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Ativos ({schedules.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando agendamentos...</p>
                </div>
              ) : schedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Nome</th>
                        <th className="text-left p-3 font-medium">Leads</th>
                        <th className="text-left p-3 font-medium">Método</th>
                        <th className="text-left p-3 font-medium">Frequência</th>
                        <th className="text-left p-3 font-medium">Próximo Envio</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((schedule) => (
                        <tr key={schedule.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{schedule.name}</div>
                          </td>
                          <td className="p-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-help">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">
                                      {schedule.leads_count} lead{schedule.leads_count !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <div className="font-medium">Leads associados:</div>
                                    {schedule.leads.length > 0 ? (
                                      schedule.leads.map((lead, index) => (
                                        <div key={lead.id} className="text-sm">
                                          • {lead.name} {lead.email && `(${lead.email})`}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-gray-500">
                                        Nenhum lead associado
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                                                     <td className="p-3">
                             <div className="flex items-center gap-2">
                               {getMethodIcon(schedule.method)}
                               <span className="text-sm">{getMethodText(schedule.method)}</span>
                             </div>
                           </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {schedule.is_recurring ? schedule.frequency : 'Pontual'}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {schedule.frequency === 'Pontual' 
                                ? 'Não terá próximo'
                                : (schedule.next_send 
                                    ? formatNextSendDate(schedule.next_send)
                                    : 'N/A')
                              }
                            </div>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(schedule.status)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleOpenHistory(schedule.id, schedule.name)}
                                      title="Histórico de Envios"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <History className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver histórico de envios</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                                title={schedule.status === 'active' ? 'Desativar' : 'Ativar'}
                                className={schedule.status === 'active' ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'}
                              >
                                {schedule.status === 'active' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSchedule(schedule.id, schedule.name)}
                                title="Excluir"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum agendamento criado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Crie seu primeiro agendamento para automatizar o envio de imóveis para seus grupos.
                  </p>
                  <Button 
                    onClick={handleCreateSchedule}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Histórico */}
      {selectedScheduleId && (
        <ScheduleHistoryModal
          isOpen={historyModalOpen}
          onClose={handleCloseHistory}
          scheduleId={selectedScheduleId}
          scheduleName={selectedScheduleName}
        />
      )}
    </div>
  );
};

export default AdminSchedules;
