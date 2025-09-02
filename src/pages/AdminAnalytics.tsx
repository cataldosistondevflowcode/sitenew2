import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AnalyticsTablesView from '@/components/admin/AnalyticsTablesView';
import { LogOut, User, BarChart3, Database, ArrowLeft, Home, Settings, Users, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAnalytics = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleGoToLeads = () => {
    navigate('/admin/leads');
  };

  const handleGoToSchedules = () => {
    navigate('/admin/schedules');
  };

  const handleGoToMarketing = () => {
    navigate('/admin/marketing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Leilão RJ Imóveis - Sistema de Métricas
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
                onClick={handleGoToLeads}
                className="flex items-center gap-2 border-2 font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 hover:border-purple-400"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToSchedules}
                className="flex items-center gap-2 border-2 font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Agendamentos</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
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
        <div className="space-y-8">
          {/* Bem-vindo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Sistema de Analytics
            </h2>
            <p className="text-blue-100">
              Acompanhe métricas de acesso, pesquisas, visualizações e conversões do seu site de leilões.
            </p>
          </div>

          {/* Abas de Analytics */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard de Métricas
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dados Brutos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="tables" className="mt-6">
              <AnalyticsTablesView />
            </TabsContent>
          </Tabs>

          {/* Informações sobre o Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sobre o Sistema de Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">📊 Dashboard de Métricas</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visitas diárias e visualizações</li>
                    <li>• Imóveis mais acessados</li>
                    <li>• Pesquisas populares</li>
                    <li>• Filtros mais utilizados</li>
                    <li>• Leads gerados por período</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🗄️ Dados Brutos</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tabela de visitas diárias</li>
                    <li>• Visualizações por propriedade</li>
                    <li>• Histórico de pesquisas</li>
                    <li>• Leads de contato</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
