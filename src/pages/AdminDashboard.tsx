import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/admin/DashboardStats';
import PropertiesTable from '@/components/admin/PropertiesTable';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AnalyticsTablesView from '@/components/admin/AnalyticsTablesView';
import MarketingPDF from '@/components/admin/MarketingPDF';
import { LogOut, Settings, MessageCircle, AlertTriangle, User, BarChart3, Home, Database, FileText, Phone, Calendar, Edit2 } from 'lucide-react';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");

  const handleLogout = () => {
    logout();
  };

  const handleGoToAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleWhatsAppConnect = () => {
    // Por enquanto apenas mostra um alerta
    alert('Funcionalidade em manutenção. Em breve você poderá conectar seu WhatsApp!');
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
                onClick={() => setActiveTab("analytics")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
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
        <div className="space-y-8">
          {/* Bem-vindo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Bem-vindo ao Painel Administrativo!
                </h2>
                <p className="text-blue-100">
                  Gerencie todos os aspectos do seu site de leilões de imóveis. Use as abas abaixo para navegar entre Imóveis, Analytics e Dados Brutos.
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/90 text-sm mb-1">Sistema de Analytics</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ ATIVO
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas do Dashboard */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visão Geral do Sistema
            </h3>
            <DashboardStats />
          </div>

          <Separator />

          {/* Seção do WhatsApp */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sistema WhatsApp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    Listas de Telefones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Gerencie listas de telefones para envios automáticos de WhatsApp.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/whatsapp-phone-lists')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Gerenciar Listas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Agendamentos WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Visualize e gerencie agendamentos de envio automático.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/whatsapp-schedules')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agendamentos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* CMS Admin */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gerenciador de Conteúdo CMS
            </h3>
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-purple-600" />
                  Admin CMS (Tipo WordPress)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Edite o conteúdo das páginas do site (textos, imagens, blocos) com sistema draft → preview → publish.
                </p>
                <Button 
                  onClick={() => navigate('/admin/cms')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Abrir Gerenciador CMS
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Status: <span className="text-green-600 font-semibold">Sprint CMS v0 — MVP Ativo</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Abas para diferentes seções */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Gestão de Imóveis
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics Dashboard
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Marketing
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dados Brutos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="mt-6">
              <PropertiesTable />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    📊 Sistema de Analytics Ativo
                  </h3>
                  <p className="text-blue-700 text-sm">
                    O sistema de tracking está coletando dados de visitantes, pesquisas e interações.
                  </p>
                </div>
                <AnalyticsDashboard />
              </div>
            </TabsContent>
            
            <TabsContent value="marketing" className="mt-6">
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    📄 Gerador de Material de Marketing
                  </h3>
                  <p className="text-orange-700 text-sm">
                    Selecione imóveis da base de dados para gerar catálogos em PDF para campanhas de marketing.
                  </p>
                </div>
                <MarketingPDF />
              </div>
            </TabsContent>
            
            <TabsContent value="tables" className="mt-6">
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    🗄️ Dados Brutos das Tabelas
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Visualize os dados brutos coletados pelo sistema de analytics.
                  </p>
                </div>
                <AnalyticsTablesView />
              </div>
            </TabsContent>
          </Tabs>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximas Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Integração com WhatsApp Business API
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Relatórios avançados de analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sistema de notificações em tempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Gestão de leads e contatos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versão:</span>
                    <Badge variant="secondary">v1.0.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banco de Dados:</span>
                    <Badge className="bg-green-500">Conectado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última Atualização:</span>
                    <span className="text-gray-500">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ambiente:</span>
                    <Badge variant="outline">Produção</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 