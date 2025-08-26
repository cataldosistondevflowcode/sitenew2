import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmailListManager } from '@/components/admin/EmailListManager';
import { LogOut, User, Mail, Home, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminEmailLists = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleBackToMarketing = () => {
    navigate('/admin/marketing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Listas de Emails
                </h1>
                <p className="text-sm text-gray-500">
                  Leilão RJ Imóveis - Gestão de Listas de Marketing
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
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
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
          {/* Informações */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Gestão de Listas de Emails
                </h2>
                <p className="text-blue-100">
                  Crie e gerencie listas de destinatários para suas campanhas de marketing automáticas.
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/90 text-sm mb-1">Sistema de Listas</div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ ATIVO
                </div>
              </div>
            </div>
          </div>

          {/* Componente Principal */}
          <EmailListManager />
        </div>
      </main>
    </div>
  );
};

export default AdminEmailLists;
