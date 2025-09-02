import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  User, 
  FileText, 
  Home, 
  Settings, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Plus,
  Save,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Group {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_active: boolean;
  lead_count?: number;
}

const AdminGroups = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Buscar grupos
      const { data, error } = await supabase
        .from('lead_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar contagem de leads para cada grupo
      const groupsWithCounts = await Promise.all(
        (data || []).map(async (group) => {
          const { count } = await supabase
            .from('contact_leads')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);
          
          return {
            ...group,
            lead_count: count || 0
          };
        })
      );

      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const groupData = {
        name: formData.name,
        description: formData.description || null,
        is_active: formData.is_active,
        created_by: user?.email || 'admin'
      };

      if (editingGroup) {
        // Atualizar grupo existente
        const { error } = await supabase
          .from('lead_groups')
          .update(groupData)
          .eq('id', editingGroup.id);

        if (error) throw error;
      } else {
        // Criar novo grupo
        const { error } = await supabase
          .from('lead_groups')
          .insert(groupData);

        if (error) throw error;
      }

      // Limpar formulário e recarregar dados
      setFormData({ name: '', description: '', is_active: true });
      setShowCreateForm(false);
      setEditingGroup(null);
      fetchGroups();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      alert('Erro ao salvar grupo. Tente novamente.');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      is_active: group.is_active
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (groupId: number) => {
    if (!confirm('Tem certeza que deseja excluir este grupo?')) return;

    try {
      const { error } = await supabase
        .from('lead_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
      fetchGroups();
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
      alert('Erro ao excluir grupo. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingGroup(null);
    setFormData({ name: '', description: '', is_active: true });
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Gerenciar Grupos
                </h1>
                <p className="text-sm text-gray-500">
                  Organize seus leads em grupos
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
                Grupos de Leads ({groups.length})
              </h2>
              <p className="text-gray-600 mt-1">
                Organize seus leads em grupos para facilitar o gerenciamento
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Grupo
              </Button>
            </div>
          </div>

          {/* Formulário de Criação/Edição */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Grupo *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Compradores Premium"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o propósito deste grupo..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_active">Grupo ativo</Label>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingGroup ? 'Atualizar' : 'Criar'} Grupo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Grupos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Grupos ({filteredGroups.length})</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar grupos..."
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando grupos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Nome</th>
                        <th className="text-left p-3 font-medium">Descrição</th>
                        <th className="text-left p-3 font-medium">Leads</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Criado em</th>
                        <th className="text-left p-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGroups.map((group) => (
                        <tr key={group.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{group.name}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {group.description || 'Sem descrição'}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="text-xs">
                              {group.lead_count || 0} leads
                            </Badge>
                          </td>
                          <td className="p-3">
                            {group.is_active ? (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              {new Date(group.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(group)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(group.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredGroups.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum grupo encontrado</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm ? 'Tente ajustar sua busca' : 'Crie seu primeiro grupo para organizar seus leads'}
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

export default AdminGroups;
