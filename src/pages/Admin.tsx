import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DashboardStats from '@/components/admin/DashboardStats';
import PropertiesTable from '@/components/admin/PropertiesTable';
import { LogOut, Settings, MessageCircle, AlertTriangle, User } from 'lucide-react';

const Admin = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
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
              <div className="bg-blue-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-500">
                  Leilão RJ Imóveis - Sistema de Gestão
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="flex items-center gap-2 bg-gray-100 text-gray-800 border-gray-300">
                <User className="h-3 w-3" />
                {user?.email}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
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
              Bem-vindo ao Painel Administrativo!
            </h2>
            <p className="text-blue-100">
              Gerencie todos os aspectos do seu site de leilões de imóveis em um só lugar.
            </p>
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
              Integrações
            </h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Conexão WhatsApp Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Conecte sua conta do WhatsApp Business para receber leads diretamente no seu celular.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="flex items-center gap-1 bg-orange-100 text-orange-800 border-orange-200">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        Em Manutenção
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Funcionalidade será disponibilizada em breve
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleWhatsAppConnect}
                    disabled
                    className="ml-4 bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                    variant="outline"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conectar WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Tabela de Propriedades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gestão de Imóveis
            </h3>
            <PropertiesTable />
          </div>

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
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">v1.0.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banco de Dados:</span>
                    <Badge className="bg-green-500 text-white border-green-600">Conectado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última Atualização:</span>
                    <span className="text-gray-500">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ambiente:</span>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">Produção</Badge>
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

export default Admin; 