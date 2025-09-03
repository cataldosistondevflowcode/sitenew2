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
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle
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

interface ImportedLead {
  name: string;
  email: string;
  phone: string;
  url_filtro: string;
  mensagem?: string;
}

const AdminLeads = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Estados para importação
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportedLead[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

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

  // Funções para importação
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setImportError('Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV válido.');
      return;
    }

    setImportFile(file);
    setImportError(null);
    setImportSuccess(null);
    setImportPreview([]);

    // Ler e processar o arquivo
    try {
      await processFile(file);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setImportError('Erro ao processar o arquivo. Verifique se o formato está correto.');
    }
  };

  const processFile = async (file: File) => {
    const text = await file.text();
    let rows: string[][] = [];

    if (file.name.endsWith('.csv')) {
      // Processar CSV
      rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
    } else {
      // Processar arquivos Excel (.xlsx, .xls)
      try {
        const XLSX = await import('xlsx');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para array de arrays
        rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      } catch (error) {
        console.error('Erro ao processar arquivo Excel:', error);
        setImportError('Erro ao processar arquivo Excel. Verifique se o formato está correto.');
        return;
      }
    }

    // Remover linhas vazias e cabeçalho
    rows = rows.filter(row => row.some(cell => cell.trim() !== ''));
    
    if (rows.length === 0) {
      setImportError('Arquivo vazio ou sem dados válidos.');
      return;
    }

    // Primeira linha como cabeçalho
    const headers = rows[0];
    const dataRows = rows.slice(1);

                 // Mapear colunas
       const nameIndex = headers.findIndex(h => 
         h && h.toString().toLowerCase().includes('nome') || h.toString().toLowerCase().includes('name')
       );
       const emailIndex = headers.findIndex(h => 
         h && h.toString().toLowerCase().includes('email') || h.toString().toLowerCase().includes('e-mail')
       );
       const phoneIndex = headers.findIndex(h => 
         h && h.toString().toLowerCase().includes('telefone') || h.toString().toLowerCase().includes('phone') || h.toString().toLowerCase().includes('celular')
       );
       const urlFiltroIndex = headers.findIndex(h => 
         h && h.toString().toLowerCase().includes('url_filtro') || h.toString().toLowerCase().includes('url') || h.toString().toLowerCase().includes('filtro')
       );
       const mensagemIndex = headers.findIndex(h => 
         h && h.toString().toLowerCase().includes('mensagem') || h.toString().toLowerCase().includes('message')
       );

       console.log('📍 Índices encontrados:', {
         nameIndex,
         emailIndex,
         phoneIndex,
         urlFiltroIndex,
         mensagemIndex
       });

      if (nameIndex === -1 || emailIndex === -1 || urlFiltroIndex === -1) {
        setImportError(`O arquivo deve conter pelo menos as colunas "Nome", "Email" e "URL do Filtro". 
        
Cabeçalhos encontrados: ${headers.join(', ')}
        
Colunas obrigatórias não encontradas:
${nameIndex === -1 ? '❌ Nome' : '✅ Nome'}
${emailIndex === -1 ? '❌ Email' : '✅ Email'}
${urlFiltroIndex === -1 ? '❌ URL do Filtro' : '✅ URL do Filtro'}`);
        return;
      }

         // Processar dados
     const processedLeads: ImportedLead[] = dataRows.map(row => ({
       name: row[nameIndex] || '',
       email: row[emailIndex] || '',
       phone: phoneIndex !== -1 ? row[phoneIndex] || '' : '',
       url_filtro: (row[urlFiltroIndex] || '').toString().trim(),
       mensagem: mensagemIndex !== -1 ? (row[mensagemIndex] || '').toString().trim() : ''
     })).filter(lead => lead.name && lead.email && lead.url_filtro); // Filtrar leads válidos

    if (processedLeads.length === 0) {
      setImportError('Nenhum lead válido encontrado no arquivo.');
      return;
    }

    setImportPreview(processedLeads);
  };

  const handleImport = async () => {
    if (!importPreview.length) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      let successCount = 0;
      let errorCount = 0;

             for (const lead of importPreview) {
         try {
           // Inserir lead
           const { error: insertError } = await supabase
             .from('contact_leads')
             .insert({
               name: lead.name,
               email: lead.email,
               phone: lead.phone || null,
               filter_config: lead.url_filtro || null,
               message: lead.mensagem || null,
               contact_method: 'import',
               created_at: new Date().toISOString()
             });

          if (insertError) {
            console.error('Erro ao inserir lead:', insertError);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error('Erro ao processar lead:', error);
          errorCount++;
        }
      }

      // Atualizar lista de leads
      await fetchLeads();

      if (errorCount === 0) {
        setImportSuccess(`${successCount} leads importados com sucesso!`);
        setTimeout(() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportPreview([]);
        }, 2000);
      } else {
        setImportSuccess(`${successCount} leads importados com sucesso. ${errorCount} erros encontrados.`);
      }

    } catch (error) {
      console.error('Erro na importação:', error);
      setImportError('Erro durante a importação. Tente novamente.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Importar XLSX dinamicamente para evitar problemas de SSR
    import('xlsx').then((XLSX) => {
             // Dados do template
       const templateData = [
         ['Nome', 'Email', 'Telefone', 'URL do Filtro', 'Mensagem'],
         ['João Silva', 'joao@email.com', '11999999999', 'https://site.com/filtro?cidade=RJ', 'Interessado em imóveis'],
         ['Maria Santos', 'maria@email.com', '21988888888', 'https://site.com/filtro?bairro=Botafogo', 'Quero mais informações'],
         ['Carlos Oliveira', 'carlos@email.com', '31977777777', 'https://site.com/filtro?tipo=casa', 'Interessado em casas'],
         ['', '', '', '', ''], // Linha em branco para exemplo
         ['', '', '', '', ''], // Linha em branco para exemplo
       ];

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(templateData);

             // Configurar largura das colunas
       const columnWidths = [
         { wch: 20 }, // Nome
         { wch: 25 }, // Email
         { wch: 15 }, // Telefone
         { wch: 40 }, // URL do Filtro
         { wch: 30 }, // Mensagem
       ];
      worksheet['!cols'] = columnWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template_Leads');

             // Criar planilha de instruções
       const instructionsData = [
         ['INSTRUÇÕES PARA IMPORTAÇÃO DE LEADS'],
         [''],
         ['CAMPOS OBRIGATÓRIOS:'],
         ['• Nome: Nome completo do lead'],
         ['• Email: Endereço de email válido'],
         ['• URL do Filtro: URL da configuração de filtros aplicada'],
         [''],
         ['CAMPOS OPCIONAIS:'],
         ['• Telefone: Número de telefone (com ou sem formatação)'],
         ['• Mensagem: Mensagem ou observação sobre o lead'],
         [''],
         ['EXEMPLOS DE URL DO FILTRO:'],
         ['• https://site.com/filtro?cidade=RJ'],
         ['• https://site.com/filtro?bairro=Botafogo'],
         ['• https://site.com/filtro?tipo=casa&valor_min=500000'],
         [''],
         ['IMPORTANTE:'],
         ['• Não altere os cabeçalhos das colunas'],
         ['• Preencha pelo menos Nome, Email e URL do Filtro'],
         ['• Salve como .xlsx antes de importar'],
       ];

      const instructionsWorksheet = XLSX.utils.aoa_to_sheet(instructionsData);
      instructionsWorksheet['!cols'] = [{ wch: 60 }];
      XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'Instruções');

      // Gerar arquivo e fazer download
      XLSX.writeFile(workbook, 'template_leads.xlsx');
    }).catch((error) => {
      console.error('Erro ao gerar template Excel:', error);
             // Fallback para CSV se der erro
       const csvContent = 'Nome,Email,Telefone,URL do Filtro,Mensagem\nJoão Silva,joao@email.com,11999999999,https://site.com/filtro?cidade=RJ,Interessado em imóveis\nMaria Santos,maria@email.com,21988888888,https://site.com/filtro?bairro=Botafogo,Quero mais informações';
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'template_leads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                onClick={() => navigate('/admin/schedules')}
                className="flex items-center gap-2 border-2 font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400"
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
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="h-4 w-4" />
                Importar Leads
              </Button>
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

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                Importar Leads via Planilha
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Instruções */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Como usar:</h3>
                             <ul className="text-sm text-blue-800 space-y-1">
                 <li>• Prepare uma planilha com as colunas: Nome, Email, Telefone (opcional), URL do Filtro (obrigatório), Mensagem (opcional)</li>
                 <li>• Salve como CSV ou Excel (.xlsx, .xls)</li>
                 <li>• A primeira linha deve conter os cabeçalhos das colunas</li>
                 <li>• Nome, Email e URL do Filtro são obrigatórios para cada lead</li>
               </ul>
            </div>

            {/* Download do Template */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                                 Baixar Template Excel
              </Button>
            </div>

            {/* Upload do Arquivo */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Clique para selecionar um arquivo
                  </p>
                  <p className="text-sm text-gray-500">
                    Suporta arquivos CSV, Excel (.xlsx, .xls)
                  </p>
                </label>
              </div>
              
              {importFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="font-medium">Arquivo selecionado:</span>
                    <span>{importFile.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preview dos Dados */}
            {importPreview.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Preview dos Dados ({importPreview.length} leads encontrados)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                                         <thead>
                       <tr className="border-b bg-gray-50">
                         <th className="text-left p-2">Nome</th>
                         <th className="text-left p-2">Email</th>
                         <th className="text-left p-2">Telefone</th>
                         <th className="text-left p-2">URL do Filtro</th>
                       </tr>
                     </thead>
                     <tbody>
                       {importPreview.slice(0, 5).map((lead, index) => (
                         <tr key={index} className="border-b">
                           <td className="p-2">{lead.name}</td>
                           <td className="p-2">{lead.email}</td>
                           <td className="p-2">{lead.phone || '-'}</td>
                           <td className="p-2">{lead.url_filtro || '-'}</td>
                         </tr>
                       ))}
                       {importPreview.length > 5 && (
                         <tr>
                           <td colSpan={4} className="p-2 text-center text-gray-500">
                             ... e mais {importPreview.length - 5} leads
                           </td>
                         </tr>
                       )}
                     </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mensagens de Erro/Sucesso */}
            {importError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span>{importError}</span>
                </div>
              </div>
            )}

            {importSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span>{importSuccess}</span>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                disabled={importing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importPreview.length || importing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar {importPreview.length} Leads
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
