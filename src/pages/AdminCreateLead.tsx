import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LogOut, 
  User, 
  FileText, 
  Home, 
  Settings, 
  Users,
  ArrowLeft,
  Save,
  Calendar
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  filter_config?: any;
}

const AdminCreateLead = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingLead = location.state?.lead as Lead | null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    filter_config: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingLead) {
      console.log('🔍 Lead sendo editado:', editingLead);
      console.log('🔍 Filter config do lead:', editingLead.filter_config);
      setFormData({
        name: editingLead.name || '',
        email: editingLead.email || '',
        phone: editingLead.phone || '',
        message: editingLead.message || '',
        utm_source: editingLead.utm_source || '',
        utm_medium: editingLead.utm_medium || '',
        utm_campaign: editingLead.utm_campaign || '',
        filter_config: editingLead.filter_config || ''
      });
    }
  }, [editingLead]);



  const handleLogout = () => {
    logout();
  };

  const handleBackToLeads = () => {
    navigate('/admin/leads');
  };



  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const leadData = {
        name: formData.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        message: formData.message || null,
        utm_source: formData.utm_source || null,
        utm_medium: formData.utm_medium || null,
        utm_campaign: formData.utm_campaign || null,
        filter_config: formData.filter_config || null
      };

      if (editingLead) {
        // Atualizar lead existente
        const { error } = await supabase
          .from('contact_leads')
          .update(leadData)
          .eq('id', editingLead.id);

        if (error) throw error;
      } else {
        // Criar novo lead
        const { error } = await supabase
          .from('contact_leads')
          .insert(leadData);

        if (error) throw error;
      }

      navigate('/admin/leads');
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      alert('Erro ao salvar lead. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
                  {editingLead ? 'Editar Lead' : 'Criar Novo Lead'}
                </h1>
                <p className="text-sm text-gray-500">
                  {editingLead ? 'Edite as informações do lead' : 'Adicione um novo lead ao sistema'}
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
                onClick={() => navigate('/admin/schedules')}
                className="flex items-center gap-2 border-2 font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300 hover:border-orange-400"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Agendamentos</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBackToLeads}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos Leads
            </Button>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>{editingLead ? 'Editar Lead' : 'Criar Novo Lead'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Observações</h3>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Mensagem ou observações sobre o lead..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* UTM Parameters - OCULTO */}
              {/* 
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parâmetros UTM</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="utm_source">UTM Source</Label>
                    <Input
                      id="utm_source"
                      placeholder="google, facebook, etc."
                      value={formData.utm_source}
                      onChange={(e) => handleInputChange('utm_source', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="utm_medium">UTM Medium</Label>
                    <Input
                      id="utm_medium"
                      placeholder="cpc, email, social, etc."
                      value={formData.utm_medium}
                      onChange={(e) => handleInputChange('utm_medium', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="utm_campaign">UTM Campaign</Label>
                    <Input
                      id="utm_campaign"
                      placeholder="nome da campanha"
                      value={formData.utm_campaign}
                      onChange={(e) => handleInputChange('utm_campaign', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              */}

              {/* Filtros Aplicados */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Filtros Aplicados</h3>
                <div className="space-y-4">
                  {/* Campo de entrada para URL do filtro */}
                  <div>
                    <Label htmlFor="filter_config">URL do Filtro</Label>
                    <Input
                      id="filter_config"
                      type="url"
                      placeholder="https://exemplo.com/catalogo/filters-1234567890-abc123"
                      value={formData.filter_config}
                      onChange={(e) => handleInputChange('filter_config', e.target.value)}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Cole aqui a URL do filtro (ex: /catalogo/filters-1756754329532-0zleaq5hx). 
                      Esta URL será usada para enviar imóveis específicos em agendamentos de email/WhatsApp.
                    </p>
                  </div>

                                     {/* Exibição do filtro atual (se existir) */}
                   {formData.filter_config && (
                     <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                       <div className="flex items-center gap-2 mb-3">
                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                         <span className="text-sm font-medium text-blue-900">Filtro Configurado</span>
                       </div>
                       <div className="flex flex-wrap gap-2 mb-3">
                         <Badge variant="outline" className="text-sm bg-white border-blue-300 text-blue-700">
                           <a 
                             href={formData.filter_config} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800 underline"
                           >
                             Ver Filtro
                           </a>
                         </Badge>
                       </div>
                       <p className="text-sm text-blue-700">
                         Este link será usado para enviar imóveis específicos em agendamentos de email/WhatsApp.
                       </p>
                     </div>
                   )}
                </div>
              </div>

                             {/* Botões */}
               <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                 <Button
                   variant="outline"
                   onClick={handleBackToLeads}
                   className="px-6"
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={handleSubmit}
                   disabled={loading}
                   className="bg-purple-600 hover:bg-purple-700 px-6"
                 >
                   <Save className="h-4 w-4 mr-2" />
                   {loading ? 'Salvando...' : (editingLead ? 'Atualizar Lead' : 'Criar Lead')}
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCreateLead;
