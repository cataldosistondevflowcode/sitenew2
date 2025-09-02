import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  User, 
  FileText, 
  Home, 
  Settings, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Calendar,
  Users,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  contact_method: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string | null;
  property_id: number | null;
  group_id: number | null;
  filter_config?: any;
  lead_groups?: {
    name: string;
  } | null;
}

const AdminLeads = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_leads')
        .select(`
          *,
          lead_groups(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('📊 Leads carregados:', data);
      console.log('🔍 Filter config dos leads:', data?.map(lead => ({ id: lead.id, filter_config: lead.filter_config })));
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
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

  const handleBackToMarketing = () => {
    navigate('/admin/marketing');
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleCreateSchedule = () => {
    if (selectedLeads.length === 0) return;
    
    // Navegar para a página de criação de agendamento com os leads selecionados
    navigate('/admin/schedules/create', { 
      state: { 
        selectedLeads,
        leads: leads.filter(lead => selectedLeads.includes(lead.id))
      }
    });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  );

  const formatContact = (lead: Lead) => {
    const parts = [];
    if (lead.email) parts.push(lead.email);
    if (lead.phone) parts.push(lead.phone);
    return parts.join(', ');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Lista de Leads
                </h1>
                <p className="text-sm text-gray-500">
                  Gerencie seus leads e contatos
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
                onClick={handleBackToMarketing}
                className="flex items-center gap-2 border-2 font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 hover:border-purple-400"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Marketing</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAdmin}
                className="flex items-center gap-2 border-2 font-medium bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
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
                 Lista de Leads
               </h2>
               <p className="text-gray-600 mt-1">
                 Gerencie seus leads e contatos
               </p>
             </div>
             <div className="flex gap-3">
               <Button 
                 variant="outline"
                 className="flex items-center gap-2"
                 onClick={() => navigate('/admin/leads/create')}
               >
                 <Plus className="h-4 w-4" />
                 Novo Lead
               </Button>
             </div>
           </div>

          {/* Card Principal */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Leads</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedLeads.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedLeads.length} lead(s) selecionado(s)
                      </span>
                    </div>
                    <Button 
                      onClick={handleCreateSchedule}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Criar Agendamento
                    </Button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando leads...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                                                 <th className="text-left p-3 font-medium">Nome</th>
                         <th className="text-left p-3 font-medium">Contato</th>
                         <th className="text-left p-3 font-medium">Método</th>
                         <th className="text-left p-3 font-medium">Grupos</th>
                         <th className="text-left p-3 font-medium">Filtros</th>
                         <th className="text-left p-3 font-medium">Data</th>
                         <th className="text-left p-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <Checkbox
                              checked={selectedLeads.includes(lead.id)}
                              onCheckedChange={(checked) => 
                                handleSelectLead(lead.id, checked as boolean)
                              }
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{lead.name || 'Sem nome'}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {formatContact(lead)}
                            </div>
                          </td>
                                                     <td className="p-3">
                             <div className="text-sm text-gray-600">
                               {lead.contact_method || '-'}
                             </div>
                           </td>
                           <td className="p-3">
                             <div className="flex gap-1">
                               <Badge variant="secondary" className="text-xs">
                                 {lead.lead_groups?.name || 'Sem grupo'}
                               </Badge>
                               {lead.utm_campaign && (
                                 <Badge variant="outline" className="text-xs">
                                   {lead.utm_campaign}
                                 </Badge>
                               )}
                             </div>
                           </td>
                           <td className="p-3">
                             <div className="text-sm text-gray-600">
                               {lead.filter_config ? (
                                 <div className="flex flex-wrap gap-1">
                                   <Badge variant="outline" className="text-xs">
                                     <a 
                                       href={lead.filter_config} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:text-blue-800 underline"
                                     >
                                       Ver Filtro
                                     </a>
                                   </Badge>
                                 </div>
                               ) : (
                                 <span className="text-gray-400">Sem filtros</span>
                               )}
                             </div>
                           </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {formatDate(lead.created_at)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate('/admin/leads/edit', { state: { lead } })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                               <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum lead encontrado</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm ? 'Tente ajustar sua busca' : 'Os leads aparecerão aqui quando forem capturados'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminLeads;
