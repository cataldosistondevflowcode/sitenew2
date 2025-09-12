import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  LogOut, 
  User, 
  FileText, 
  Home, 
  Settings, 
  Clock,
  ArrowLeft,
  Mail,
  MessageCircle,
  Calendar,
  Users,
  Info,
  X,
  Upload,
  Image,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  filter_config?: string | null;
}



const AdminCreateSchedule = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLeads, leads } = location.state || { selectedLeads: [], leads: [] };

  const [formData, setFormData] = useState({
    name: '',
    group: '',
    selectionType: 'group' as 'group' | 'individual', // NOVO: tipo de seleção

    method: 'whatsapp' as 'email' | 'whatsapp' | 'both',
    frequency: 'semanal',
    sendDate: '',
    sendTime: '10:00',
    recurring: true,
    endDate: '', // NOVO: data limite para desativação automática
    whatsappMessage: 'Olá! Somos do escritório Cataldo Siston ,especializado em leilões e trouxemos as melhores oportunidades de imóveis em leilão para você.* Clique no botão abaixo e veja agora mesmo.',
    emailMessage: '',
    emailSubject: '',
    whatsappPdf: null as File | null, // Upload de PDF para WhatsApp
    uploadType: 'pdf' as 'pdf' | 'image' // NOVO: tipo de upload
  });


  const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedIndividualLeads, setSelectedIndividualLeads] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string>(''); // Estado para erro de validação do PDF
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para busca de leads

  useEffect(() => {
    fetchGroups();
    fetchAllLeads();
  }, []);



  const fetchGroups = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('lead_groups')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('contact_leads')
        .select('id, name, email, phone, filter_config')
        .order('name');

      if (error) throw error;
      setAllLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleBackToSchedules = () => {
    navigate('/admin/schedules');
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

  // NOVO: Função para validar arquivo PDF
  const validatePdfFile = (file: File): string => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Apenas arquivos PDF são permitidos.';
    }
    
    if (file.size > maxSize) {
      return 'O arquivo deve ter no máximo 10MB.';
    }
    
    return '';
  };

  // NOVO: Função para validar arquivo de imagem
  const validateImageFile = (file: File): string => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Apenas arquivos de imagem (JPG, PNG, GIF, WEBP) são permitidos.';
    }
    
    if (file.size > maxSize) {
      return 'O arquivo deve ter no máximo 10MB.';
    }
    
    return '';
  };




  const handleLeadToggle = (leadId: number) => {
    setSelectedIndividualLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAllLeads = () => {
    const filteredLeads = getFilteredLeads();
    if (selectedIndividualLeads.length === filteredLeads.length) {
      setSelectedIndividualLeads([]);
    } else {
      setSelectedIndividualLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Função para filtrar leads por nome ou email
  const getFilteredLeads = () => {
    if (!searchTerm.trim()) {
      return allLeads;
    }
    
    const term = searchTerm.toLowerCase();
    return allLeads.filter(lead => 
      (lead.name && lead.name.toLowerCase().includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // VALIDAÇÃO OBRIGATÓRIA: Verificar se há leads ou grupo selecionado
      const allSelectedLeads = [...selectedLeads, ...selectedIndividualLeads];
      const hasSelectedLeads = allSelectedLeads.length > 0;
      
      if (!hasSelectedLeads) {
        alert('ERRO: É obrigatório selecionar pelo menos um lead para criar o agendamento!');
        setLoading(false);
        return;
      }
      
      // Upload do arquivo PDF se existir
      let fileUrl = null;
      const fileToUpload = formData.whatsappPdf;
      
      if (fileToUpload) {
        try {
          // Limpar nome do arquivo para evitar caracteres especiais
          const cleanFileName = fileToUpload.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/\s+/g, '_');
          
          const fileName = `${Date.now()}-${cleanFileName}`;
          
          console.log('Tentando upload do arquivo:', {
            originalName: fileToUpload.name,
            cleanName: cleanFileName,
            fileName: fileName,
            fileSize: fileToUpload.size,
            fileType: fileToUpload.type,
            isPdf: !!formData.whatsappPdf
          });

          // Tentar upload simples no bucket images
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(`backup/${fileName}`, fileToUpload);

          if (uploadError) {
            console.error('Erro no upload:', uploadError);
            
            // Se falhar, tentar sem a pasta backup
            const { data: uploadData2, error: uploadError2 } = await supabase.storage
              .from('images')
              .upload(fileName, fileToUpload);

            if (uploadError2) {
              console.error('Erro no upload alternativo:', uploadError2);
              throw new Error(`Erro no upload: ${uploadError2.message}`);
            }
            
            // Usar o upload alternativo
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);
            
            fileUrl = urlData.publicUrl;
          } else {
            // Usar o upload original
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(`backup/${fileName}`);
            
            fileUrl = urlData.publicUrl;
          }
          
          console.log('Arquivo enviado com sucesso:', fileUrl);
        } catch (error) {
          console.error('Erro no upload do arquivo:', error);
          alert(`Erro ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          setLoading(false);
          return;
        }
      }

      // Calcular próximo envio para agendamentos recorrentes
      const calculateNextSend = () => {
        const now = new Date();
        const [hours, minutes] = formData.sendTime.split(':').map(Number);
        
        // Criar data para hoje com o horário especificado
        const nextSend = new Date();
        nextSend.setHours(hours, minutes, 0, 0);
        
        console.log('Debug - Cálculo de horário recorrente:');
        console.log('  Horário atual:', now.toLocaleString('pt-BR'));
        console.log('  Horário desejado:', nextSend.toLocaleString('pt-BR'));
        console.log('  Horário já passou?', nextSend <= now);
        
        // Se o horário já passou hoje, agendar para amanhã
        if (nextSend <= now) {
          nextSend.setDate(nextSend.getDate() + 1);
          console.log('  Agendando para amanhã:', nextSend.toLocaleString('pt-BR'));
        }
        
        // Construir string UTC manualmente para evitar conversão automática
        const year = nextSend.getFullYear();
        const month = String(nextSend.getMonth() + 1).padStart(2, '0');
        const day = String(nextSend.getDate()).padStart(2, '0');
        const hour = String(nextSend.getHours()).padStart(2, '0');
        const minute = String(nextSend.getMinutes()).padStart(2, '0');
        const second = String(nextSend.getSeconds()).padStart(2, '0');
        
        // Como o Brasil é UTC-3, precisamos adicionar 3 horas para converter para UTC
        const utcHour = (nextSend.getHours() + 3) % 24;
        const utcHourStr = String(utcHour).padStart(2, '0');
        
        const utcString = `${year}-${month}-${day}T${utcHourStr}:${minute}:${second}.000Z`;
        
        console.log('Resultado final recorrente:');
        console.log('  Horário local:', nextSend.toLocaleString('pt-BR'));
        console.log('  Horário UTC manual:', utcString);
        
        return utcString;
      };

      // Calcular envio para agendamentos pontuais
      const calculateOneTimeSend = () => {
        const [hours, minutes] = formData.sendTime.split(':').map(Number);
        
        // Criar data com a data e horário especificados
        const sendDate = new Date(formData.sendDate);
        sendDate.setHours(hours, minutes, 0, 0);
        
        console.log('Debug - Cálculo de horário pontual:');
        console.log('  Data especificada:', formData.sendDate);
        console.log('  Horário especificado:', formData.sendTime);
        console.log('  Data/hora local:', sendDate.toLocaleString('pt-BR'));
        
        // Construir string UTC manualmente
        const year = sendDate.getFullYear();
        const month = String(sendDate.getMonth() + 1).padStart(2, '0');
        const day = String(sendDate.getDate()).padStart(2, '0');
        const hour = String(sendDate.getHours()).padStart(2, '0');
        const minute = String(sendDate.getMinutes()).padStart(2, '0');
        const second = String(sendDate.getSeconds()).padStart(2, '0');
        
        // Como o Brasil é UTC-3, precisamos adicionar 3 horas para converter para UTC
        const utcHour = (sendDate.getHours() + 3) % 24;
        const utcHourStr = String(utcHour).padStart(2, '0');
        
        const utcString = `${year}-${month}-${day}T${utcHourStr}:${minute}:${second}.000Z`;
        
        console.log('Resultado final pontual:');
        console.log('  Horário local:', sendDate.toLocaleString('pt-BR'));
        console.log('  Horário UTC manual:', utcString);
        
        return utcString;
      };

      // Criar o agendamento no Supabase
      const schedulePayload = {
        name: formData.name,
        group_id: formData.group ? parseInt(formData.group) : null,
        method: formData.method,
        frequency: formData.frequency,
        send_time: formData.sendTime,
        send_date: formData.sendDate || null,
        is_recurring: formData.recurring,
        end_date: formData.recurring && formData.endDate ? formData.endDate : null, // NOVO: data limite
        whatsapp_message: formData.whatsappMessage,
        email_message: formData.emailMessage,
        email_subject: formData.emailSubject,
        whatsapp_pdf_url: fileUrl, // URL do arquivo (PDF ou imagem)
        whatsapp_file_type: formData.uploadType, // NOVO: tipo do arquivo (pdf ou image)
        status: 'active',
        next_send: formData.recurring ? calculateNextSend() : (formData.sendDate ? calculateOneTimeSend() : null),
        created_by: user?.email || 'admin'
      };

      console.log('Payload do agendamento:', schedulePayload);

      const { data: scheduleData, error: scheduleError } = await (supabase as any)
        .from('unified_schedules')
        .insert(schedulePayload)
        .select()
        .single();

      if (scheduleError) {
        console.error('Erro ao inserir agendamento:', scheduleError);
        throw scheduleError;
      }

      console.log('Agendamento criado com sucesso:', scheduleData);

      // Adicionar relacionamentos com leads específicos (se vier da página de leads ou selecionados individualmente)
      if (allSelectedLeads.length > 0) {
        const leadRelations = allSelectedLeads.map(leadId => ({
          schedule_id: scheduleData.id,
          lead_id: leadId
        }));

        await (supabase as any)
          .from('schedule_leads')
          .insert(leadRelations);
      }

      // Se for WhatsApp, processar mensagem com filtros e imagem
      if (formData.method === 'whatsapp' || formData.method === 'both') {
        let finalWhatsAppMessage = formData.whatsappMessage;
        
        // Adicionar URLs dos filtros dos leads selecionados
        if (allSelectedLeads.length > 0) {
          const selectedLeadData = allLeads.filter(lead => allSelectedLeads.includes(lead.id));
          const filterUrls = selectedLeadData
            .map(lead => lead.filter_config)
            .filter(url => url && url.trim() !== '')
            .filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicatas
          
          if (filterUrls.length > 0) {
            finalWhatsAppMessage += '\n\nLinks dos filtros:\n' + filterUrls.join('\n');
          }
        }
        
        // URL da imagem será enviada separadamente no payload, não no texto
        
        // Atualizar a mensagem no banco
        if (finalWhatsAppMessage !== formData.whatsappMessage) {
          await (supabase as any)
            .from('unified_schedules')
            .update({ 
              whatsapp_message: finalWhatsAppMessage
            })
            .eq('id', scheduleData.id);
        }
      }

      // Redirecionar para a página de agendamentos
      navigate('/admin/schedules');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodCardClass = (method: string) => {
    const isSelected = formData.method === method;
    const baseClass = "p-4 border-2 rounded-lg cursor-pointer transition-all";
    
    switch (method) {
      case 'whatsapp':
        return `${baseClass} ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`;
      case 'email':
        return `${baseClass} ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`;
      case 'both':
        return `${baseClass} ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Criar Novo Agendamento
                </h1>
                <p className="text-sm text-gray-500">
                  Configure um agendamento automático para enviar imóveis para um grupo específico.
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
                onClick={() => navigate('/admin/leads')}
                className="flex items-center gap-2 border-2 font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 hover:border-purple-400"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
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
              onClick={handleBackToSchedules}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos Agendamentos
            </Button>
          </div>

                     {/* Formulário */}
           <Card>
             <CardHeader>
               <CardTitle>Criar Novo Agendamento</CardTitle>
               {selectedLeads.length > 0 && (
                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <Users className="h-4 w-4 text-blue-600" />
                     <span className="text-sm font-medium text-blue-900">
                       {selectedLeads.length} lead(s) selecionado(s)
                     </span>
                   </div>
                   <div className="text-sm text-blue-700">
                     {leads.map(lead => (
                       <div key={lead.id} className="flex items-center gap-2">
                         <span>• {lead.name || 'Sem nome'}</span>
                         {lead.email && <span className="text-blue-600">({lead.email})</span>}
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome do agendamento"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              {/* Seleção Individual de Leads - Sempre visível */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Selecionar Leads</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAllLeads}
                    className="text-xs"
                  >
                    {selectedIndividualLeads.length === getFilteredLeads().length ? 'Deselecionar Todos' : 'Selecionar Todos'}
                  </Button>
                </div>
                
                {/* Campo de busca */}
                <div className="mb-3">
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                  {getFilteredLeads().length > 0 ? (
                    getFilteredLeads().map((lead) => (
                      <div key={lead.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`lead-${lead.id}`}
                          checked={selectedIndividualLeads.includes(lead.id)}
                          onCheckedChange={() => handleLeadToggle(lead.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{lead.name || 'Sem nome'}</div>
                          <div className="text-sm text-gray-500">
                            {lead.email && <span>{lead.email}</span>}
                            {lead.phone && <span className="ml-2">{lead.phone}</span>}
                          </div>
                          {lead.filter_config && (
                            <div className="text-xs text-blue-600 mt-1">
                              Filtro: {lead.filter_config}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {searchTerm ? 'Nenhum lead encontrado com o termo de busca.' : 'Nenhum lead disponível.'}
                    </div>
                  )}
                </div>
                
                {selectedIndividualLeads.length > 0 && (
                  <div className="text-sm text-blue-600 mt-2">
                    {selectedIndividualLeads.length} lead(s) selecionado(s)
                  </div>
                )}
              </div>



              {/* Método de Envio - Apenas WhatsApp */}
              <div>
                <Label>Método de Envio</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <div className="border-2 border-green-500 bg-green-50 p-4 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipo de Envio */}
              <div className="space-y-4">
                <Label>Tipo de Envio</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => handleInputChange('recurring', true)}>
                     <input
                       type="radio"
                       name="envio-tipo"
                       checked={formData.recurring}
                       onChange={() => handleInputChange('recurring', true)}
                       className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                     />
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                       <span className="font-medium text-gray-900">Envio Recorrente</span>
                     </div>
                   </div>
                  
                                     <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-orange-300 hover:bg-orange-50"
                        onClick={() => handleInputChange('recurring', false)}>
                     <input
                       type="radio"
                       name="envio-tipo"
                       checked={!formData.recurring}
                       onChange={() => handleInputChange('recurring', false)}
                       className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                     />
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                       <span className="font-medium text-gray-900">Envio Pontual</span>
                     </div>
                   </div>
                </div>
              </div>

              {/* Frequência - Apenas para envio recorrente */}
              {formData.recurring && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quinzenal">Quinzenal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* NOVO: Data limite para desativação automática */}
                  <div>
                    <Label htmlFor="endDate">Data Limite (opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      placeholder="Selecione uma data para desativar automaticamente"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      O agendamento será desativado automaticamente nesta data
                    </p>
                  </div>
                </div>
              )}

                             {/* Configuração de Horário */}
               <div className="space-y-4">
                 <h3 className="text-lg font-medium text-gray-900">Configuração de Horário</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="sendTime">Horário</Label>
                     <Input
                       id="sendTime"
                       type="time"
                       value={formData.sendTime}
                       onChange={(e) => handleInputChange('sendTime', e.target.value)}
                     />
                   </div>
                   
                   {!formData.recurring && (
                     <div>
                       <Label htmlFor="sendDate">Data de Envio</Label>
                       <Input
                         id="sendDate"
                         type="date"
                         value={formData.sendDate}
                         onChange={(e) => handleInputChange('sendDate', e.target.value)}
                       />
                     </div>
                   )}
                 </div>
               </div>

                             {/* Conteúdo WhatsApp */}
               {(formData.method === 'whatsapp' || formData.method === 'both') && (
                 <div>
                   <Label htmlFor="whatsapp-content">Mensagem WhatsApp</Label>
                   
                   
                   <Textarea
                     id="whatsapp-content"
                     placeholder="Escreva aqui a mensagem que será enviada via WhatsApp..."
                     value={formData.whatsappMessage}
                     onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                     rows={4}
                     className="mb-3"
                   />
                   
                   {/* Upload de arquivo para WhatsApp */}
                   <div className="space-y-4">
                     <Label>Arquivo (opcional)</Label>
                     
                     {/* Checkbox para seleção do tipo de arquivo */}
                     <div className="flex items-center space-x-6">
                       <div className="flex items-center space-x-2">
                         <input
                           type="radio"
                           id="upload-pdf"
                           name="upload-type"
                           checked={formData.uploadType === 'pdf'}
                           onChange={() => {
                             handleInputChange('uploadType', 'pdf');
                             handleInputChange('whatsappPdf', null);
                             setPdfError('');
                           }}
                           className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                         />
                         <Label htmlFor="upload-pdf" className="flex items-center gap-2 cursor-pointer">
                           <FileText className="h-4 w-4" />
                           PDF
                         </Label>
                       </div>
                       
                       <div className="flex items-center space-x-2">
                         <input
                           type="radio"
                           id="upload-image"
                           name="upload-type"
                           checked={formData.uploadType === 'image'}
                           onChange={() => {
                             handleInputChange('uploadType', 'image');
                             handleInputChange('whatsappPdf', null);
                             setPdfError('');
                           }}
                           className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                         />
                         <Label htmlFor="upload-image" className="flex items-center gap-2 cursor-pointer">
                           <Image className="h-4 w-4" />
                           Imagem
                         </Label>
                       </div>
                     </div>
                     
                     {/* Upload do arquivo */}
                     <div className="flex items-center gap-3">
                       <input
                         type="file"
                         id="whatsapp-file"
                         accept={formData.uploadType === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.gif,.webp'}
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             // Limpar arquivos anteriores
                             handleInputChange('whatsappPdf', null);
                             setPdfError('');
                             
                             // Validar arquivo baseado no tipo selecionado
                             const error = formData.uploadType === 'pdf' 
                               ? validatePdfFile(file)
                               : validateImageFile(file);
                             
                             if (error) {
                               setPdfError(error);
                               return;
                             }
                             handleInputChange('whatsappPdf', file);
                           }
                         }}
                         className="hidden"
                       />
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => document.getElementById('whatsapp-file')?.click()}
                         className="flex items-center gap-2"
                       >
                         <Upload className="h-4 w-4" />
                         Selecionar {formData.uploadType === 'pdf' ? 'PDF' : 'Imagem'}
                       </Button>
                       {formData.whatsappPdf && (
                         <div className="flex items-center gap-2 text-sm text-green-600">
                           {formData.uploadType === 'pdf' ? (
                             <FileText className="h-4 w-4" />
                           ) : (
                             <Image className="h-4 w-4" />
                           )}
                           {formData.whatsappPdf.name}
                         </div>
                       )}
                     </div>
                     {pdfError && (
                       <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                         {pdfError}
                       </div>
                     )}
                   </div>
                 </div>
               )}

               {/* Conteúdo Email */}
               {(formData.method === 'email' || formData.method === 'both') && (
                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="email-subject">Título do Email</Label>
                     <Input
                       id="email-subject"
                       placeholder="Título do email..."
                       value={formData.emailSubject}
                       onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                     />
                   </div>
                   {/* Campo de mensagem do email removido conforme solicitado */}
                 </div>
               )}

              {/* Validação de Leads */}
              {(() => {
                const allSelectedLeads = [...selectedLeads, ...selectedIndividualLeads];
                const hasSelectedLeads = allSelectedLeads.length > 0;
                
                return (
                  <div className="space-y-4">
                    {!hasSelectedLeads && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-900">
                            ATENÇÃO: É obrigatório selecionar pelo menos um lead!
                          </span>
                        </div>
                        <div className="text-sm text-red-700 mt-2">
                          • Selecione leads individualmente na lista acima
                        </div>
                      </div>
                    )}
                    
                    {hasSelectedLeads && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            ✓ Agendamento pronto para ser criado
                          </span>
                        </div>
                        <div className="text-sm text-green-700 mt-2">
                          • {allSelectedLeads.length} lead(s) selecionado(s)
                        </div>
                      </div>
                    )}
                    
                    {/* Botões */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        variant="outline"
                        onClick={handleBackToSchedules}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !hasSelectedLeads || pdfError !== ''}
                        className={`${hasSelectedLeads && pdfError === '' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      >
                        {loading ? 'Criando...' : 'Criar Agendamento'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCreateSchedule;
