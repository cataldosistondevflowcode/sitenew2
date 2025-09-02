import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarketingPDF from '@/components/admin/MarketingPDF';
import { LogOut, User, FileText, Home, Settings, Mail, Calendar, Phone, MessageCircle, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminMarketing = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Marketing Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Leilão RJ Imóveis - Gerador de Materiais
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


          {/* Seção: Ferramentas Tradicionais - OCULTA */}
          {/* 
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ferramentas Tradicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Listas de Emails</h3>
                    <p className="text-sm text-gray-600">Gerencie destinatários</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Crie e organize listas de emails para usar em campanhas automáticas.
                </p>
                <Button 
                  onClick={() => navigate('/admin/email-lists')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Gerenciar Listas
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Emails Automáticos</h3>
                    <p className="text-sm text-gray-600">Configure campanhas</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Agende envios recorrentes de catálogos com filtros personalizados.
                </p>
                <Button 
                  onClick={() => navigate('/admin/email-schedules')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Gerenciar Agendamentos
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Listas WhatsApp</h3>
                    <p className="text-sm text-gray-600">Gerencie contatos</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Crie e organize listas de telefones para envios automáticos via WhatsApp.
                </p>
                <Button 
                  onClick={() => navigate('/admin/whatsapp-phone-lists')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Gerenciar Listas
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">WhatsApp Automático</h3>
                    <p className="text-sm text-gray-600">Configure envios</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Agende envios recorrentes de páginas para WhatsApp Business.
                </p>
                <Button 
                  onClick={() => navigate('/admin/whatsapp-schedules')}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  Gerenciar Agendamentos
                </Button>
              </div>
            </div>
          </div>
          */}

          {/* Seção: Gestão de Leads e Agendamentos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Leads e Agendamentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 flex flex-col h-full border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Lista de Leads</h3>
                    <p className="text-sm text-gray-600">Gerencie seus leads e contatos</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Visualize, organize e gerencie todos os leads capturados. Selecione leads específicos para criar agendamentos personalizados de email ou WhatsApp.
                </p>
                <Button 
                  onClick={() => navigate('/admin/leads')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Gerenciar Leads
                </Button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 flex flex-col h-full border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gerenciar Grupos</h3>
                    <p className="text-sm text-gray-600">Organize leads em grupos</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Crie e gerencie grupos de leads para facilitar a organização e segmentação de seus contatos.
                </p>
                <Button 
                  onClick={() => navigate('/admin/groups')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Gerenciar Grupos
                </Button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 flex flex-col h-full border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Agendamentos</h3>
                    <p className="text-sm text-gray-600">Programe envios automáticos</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  Crie e gerencie agendamentos unificados para envio de emails e WhatsApp. Configure grupos, frequências e conteúdos personalizados.
                </p>
                <Button 
                  onClick={() => navigate('/admin/schedules')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Gerenciar Agendamentos
                </Button>
              </div>
            </div>
          </div>

          {/* Componente Principal */}
          <MarketingPDF />
        </div>
      </main>
    </div>
  );
};

export default AdminMarketing;
