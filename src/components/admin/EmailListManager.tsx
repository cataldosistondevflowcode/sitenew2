import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Edit,
  Trash2,
  Mail,
  Users,
  List,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailListForm } from './EmailListForm';

interface EmailList {
  id: string;
  name: string;
  description?: string;
  emails: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function EmailListManager() {
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<EmailList | null>(null);

  useEffect(() => {
    fetchEmailLists();
  }, []);

  const fetchEmailLists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmailLists(data || []);
    } catch (error) {
      console.error('Erro ao carregar listas de emails:', error);
      toast.error('Erro ao carregar listas de emails');
    } finally {
      setLoading(false);
    }
  };

  const toggleListStatus = async (id: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_lists')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEmailLists(emailLists.map(list => 
        list.id === id 
          ? { ...list, is_active: newStatus }
          : list
      ));

      toast.success(`Lista ${newStatus ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da lista');
    }
  };

  const deleteList = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.')) return;

    try {
      // Verificar se a lista está sendo usada em algum agendamento
      const { data: schedulesUsingList } = await supabase
        .from('email_schedules')
        .select('id, name')
        .eq('email_list_id', id);

      if (schedulesUsingList && schedulesUsingList.length > 0) {
        toast.error('Esta lista não pode ser excluída pois está sendo usada em agendamentos ativos');
        return;
      }

      const { error } = await supabase
        .from('email_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmailLists(emailLists.filter(list => list.id !== id));
      toast.success('Lista excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      toast.error('Erro ao excluir lista');
    }
  };

  const openEditDialog = (list: EmailList) => {
    setEditingList(list);
    setFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setFormDialogOpen(false);
    setEditingList(null);
  };

  const handleFormSuccess = () => {
    fetchEmailLists();
    closeFormDialog();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando listas de emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas de Emails</h1>
          <p className="text-gray-600">Gerencie suas listas de destinatários para campanhas de marketing</p>
        </div>
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Lista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingList ? 'Editar Lista' : 'Nova Lista de Emails'}
              </DialogTitle>
              <DialogDescription>
                Crie ou edite uma lista de emails para usar em campanhas de marketing
              </DialogDescription>
            </DialogHeader>
            <EmailListForm 
              emailList={editingList}
              onSuccess={handleFormSuccess}
              onCancel={closeFormDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Email Lists */}
      {emailLists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <List className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma lista criada</h3>
            <p className="text-gray-600 text-center mb-4">
              Crie sua primeira lista de emails para usar em campanhas
            </p>
            <Button onClick={() => setFormDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {emailLists.map((list) => (
            <Card key={list.id} className={list.is_active ? 'border-green-200' : 'border-gray-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${list.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      {list.description && (
                        <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={list.is_active ? 'default' : 'secondary'}>
                      {list.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Emails:</span>
                    <span className="text-sm">{list.emails.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Criada em:</span>
                    <span className="text-sm">{formatDate(list.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Atualizada:</span>
                    <span className="text-sm">{formatDate(list.updated_at)}</span>
                  </div>
                </div>

                {/* Preview de alguns emails */}
                {list.emails.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Emails na lista:</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-wrap gap-1">
                        {list.emails.slice(0, 3).map((email, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {email}
                          </Badge>
                        ))}
                        {list.emails.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{list.emails.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {list.emails.length} email{list.emails.length !== 1 ? 's' : ''} na lista
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleListStatus(list.id, !list.is_active)}
                      className="flex items-center gap-1"
                    >
                      {list.is_active ? (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(list)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteList(list.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
