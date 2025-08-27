import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit2, Plus, Phone, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PhoneList {
  id: string;
  name: string;
  description: string | null;
  phones: string[];
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

const WhatsAppPhoneLists: React.FC = () => {
  const [phoneLists, setPhoneLists] = useState<PhoneList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    phones: '',
    is_active: true
  });
  const { toast } = useToast();

  // Carregar listas de telefones
  const fetchPhoneLists = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_phone_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhoneLists(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar listas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar listas de telefones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneLists();
  }, []);

  // Criar nova lista
  const handleCreateList = async () => {
    if (!newList.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da lista é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      // Processar telefones
      const phones = newList.phones
        .split('\n')
        .map(phone => phone.trim().replace(/\D/g, ''))
        .filter(phone => phone.length >= 10)
        .map(phone => phone.startsWith('55') ? phone : '55' + phone);

      if (phones.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos um telefone válido",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('whatsapp_phone_lists')
        .insert([{
          name: newList.name.trim(),
          description: newList.description.trim() || null,
          phones: phones,
          is_active: newList.is_active
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `Lista criada com ${phones.length} telefones`
      });
      setNewList({ name: '', description: '', phones: '', is_active: true });
      setShowCreateForm(false);
      fetchPhoneLists();
    } catch (error: any) {
      console.error('Erro ao criar lista:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lista de telefones",
        variant: "destructive"
      });
    }
  };

  // Atualizar status da lista
  const handleToggleActive = async (listId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('whatsapp_phone_lists')
        .update({ is_active: !isActive })
        .eq('id', listId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: !isActive ? 'Lista ativada' : 'Lista desativada'
      });
      fetchPhoneLists();
    } catch (error: any) {
      console.error('Erro ao atualizar lista:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lista",
        variant: "destructive"
      });
    }
  };

  // Deletar lista
  const handleDeleteList = async (listId: string, listName: string) => {
    if (!confirm(`Tem certeza que deseja deletar a lista "${listName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('whatsapp_phone_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Lista deletada com sucesso"
      });
      fetchPhoneLists();
    } catch (error: any) {
      console.error('Erro ao deletar lista:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar lista",
        variant: "destructive"
      });
    }
  };

  // Formatar telefone para exibição
  const formatPhone = (phone: string) => {
    if (phone.startsWith('55')) {
      const number = phone.substring(2);
      if (number.length === 11) {
        return `+55 (${number.substring(0,2)}) ${number.substring(2,7)}-${number.substring(7)}`;
      }
    }
    return phone;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando listas de telefones...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Listas de Telefones WhatsApp</h1>
          <p className="text-gray-600 mt-2">Gerencie listas de telefones para envios automáticos</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Lista
        </Button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Lista de Telefones</CardTitle>
            <CardDescription>
              Crie uma nova lista de telefones para envios WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Lista *</Label>
              <Input
                id="name"
                value={newList.name}
                onChange={(e) => setNewList(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Clientes VIP, Corretores Parceiros"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newList.description}
                onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional da lista"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phones">Telefones *</Label>
              <Textarea
                id="phones"
                value={newList.phones}
                onChange={(e) => setNewList(prev => ({ ...prev, phones: e.target.value }))}
                placeholder="Digite um telefone por linha:&#10;21999999999&#10;11888888888&#10;27777777777"
                rows={6}
                className="mt-1 font-mono"
              />
              <p className="text-sm text-gray-500 mt-1">
                Digite um telefone por linha. O +55 será adicionado automaticamente.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newList.is_active}
                onCheckedChange={(checked) => setNewList(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Lista ativa</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateList} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Criar Lista
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setNewList({ name: '', description: '', phones: '', is_active: true });
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de telefones */}
      <div className="grid gap-4">
        {phoneLists.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Phone className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma lista encontrada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira lista de telefones para começar</p>
              <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Lista
              </Button>
            </CardContent>
          </Card>
        ) : (
          phoneLists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {list.name}
                      <Badge variant={list.is_active ? "default" : "secondary"}>
                        {list.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </CardTitle>
                    {list.description && (
                      <CardDescription className="mt-1">
                        {list.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(list.id, list.is_active)}
                    >
                      <Switch checked={list.is_active} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingList(editingList === list.id ? null : list.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteList(list.id, list.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span><strong>{list.phones.length}</strong> telefones</span>
                    <span>Criada em: {new Date(list.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {editingList === list.id && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold mb-2">Telefones na lista:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {list.phones.map((phone, index) => (
                          <div key={index} className="text-sm font-mono bg-white px-2 py-1 rounded border">
                            {formatPhone(phone)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WhatsAppPhoneLists;
