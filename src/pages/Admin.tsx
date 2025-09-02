import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

import PropertiesTable from '@/components/admin/PropertiesTable';
import { LogOut, Settings, MessageCircle, AlertTriangle, User, BarChart3, Home, FileText, Users, Calendar } from 'lucide-react';

const Admin = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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

  const handleWhatsAppConnect = () => {
    // Por enquanto apenas mostra um alerta
    alert('Funcionalidade em manutenção. Em breve você poderá conectar seu WhatsApp!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
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
          {/* Tabela de Propriedades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gestão de Imóveis
            </h3>
            <PropertiesTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin; 