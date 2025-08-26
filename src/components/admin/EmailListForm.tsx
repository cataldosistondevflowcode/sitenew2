import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Plus,
  X,
  Mail,
  Upload,
  Download,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailList {
  id?: string;
  name: string;
  description?: string;
  emails: string[];
  is_active: boolean;
}

interface EmailListFormProps {
  emailList?: EmailList | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmailListForm({ emailList, onSuccess, onCancel }: EmailListFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmailList>({
    name: '',
    description: '',
    emails: [''],
    is_active: true
  });

  const [bulkEmails, setBulkEmails] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  useEffect(() => {
    if (emailList) {
      setFormData({
        ...emailList,
        emails: emailList.emails.length > 0 ? emailList.emails : ['']
      });
    }
  }, [emailList]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    const validEmails = formData.emails.filter(email => email.trim() && validateEmail(email));
    
    if (validEmails.length === 0) {
      toast.error('Pelo menos um email válido é obrigatório');
      return;
    }

    const invalidEmails = formData.emails.filter(email => 
      email.trim() && !validateEmail(email.trim())
    );
    
    if (invalidEmails.length > 0) {
      toast.error(`Alguns emails são inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Verificar emails duplicados
    const uniqueEmails = [...new Set(validEmails.map(email => email.trim().toLowerCase()))];
    if (uniqueEmails.length !== validEmails.length) {
      toast.error('Existem emails duplicados na lista');
      return;
    }

    try {
      setLoading(true);

      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        emails: uniqueEmails,
        is_active: formData.is_active
      };

      if (emailList?.id) {
        // Atualizar
        const { error } = await supabase
          .from('email_lists')
          .update(dataToSave)
          .eq('id', emailList.id);

        if (error) throw error;
        toast.success('Lista atualizada com sucesso');
      } else {
        // Criar
        const { error } = await supabase
          .from('email_lists')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Lista criada com sucesso');
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      toast.error('Erro ao salvar lista');
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, '']
    });
  };

  const removeEmailField = (index: number) => {
    const newEmails = formData.emails.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      emails: newEmails.length > 0 ? newEmails : ['']
    });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData({
      ...formData,
      emails: newEmails
    });
  };

  const processBulkEmails = () => {
    if (!bulkEmails.trim()) return;

    // Dividir por vírgulas, quebras de linha, pontos e vírgulas
    const emailsFromBulk = bulkEmails
      .split(/[,;\n\r]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    // Combinar com emails existentes
    const currentEmails = formData.emails.filter(email => email.trim());
    const allEmails = [...currentEmails, ...emailsFromBulk];
    
    // Remover duplicados
    const uniqueEmails = [...new Set(allEmails.map(email => email.trim().toLowerCase()))];
    
    setFormData({
      ...formData,
      emails: uniqueEmails.length > 0 ? uniqueEmails : ['']
    });

    setBulkEmails('');
    setShowBulkInput(false);
    toast.success(`${emailsFromBulk.length} emails adicionados`);
  };

  const exportEmails = () => {
    const validEmails = formData.emails.filter(email => email.trim());
    if (validEmails.length === 0) {
      toast.error('Nenhum email para exportar');
      return;
    }

    const emailsText = validEmails.join('\n');
    const blob = new Blob([emailsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'lista-emails'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Lista exportada com sucesso');
  };

  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast.error('Apenas arquivos .txt são suportados');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setBulkEmails(content);
        setShowBulkInput(true);
      }
    };
    reader.readAsText(file);
  };

  const validEmailsCount = formData.emails.filter(email => email.trim() && validateEmail(email)).length;
  const invalidEmailsCount = formData.emails.filter(email => email.trim() && !validateEmail(email)).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informações da Lista
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Lista *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Clientes Premium, Investidores SP, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição opcional da lista"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Emails */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Emails da Lista
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Adicionar em Lote
              </Button>
              <input
                type="file"
                accept=".txt"
                onChange={importFromFile}
                className="hidden"
                id="import-file"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('import-file')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar
              </Button>
              {validEmailsCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportEmails}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              )}
            </div>
          </div>
          {(validEmailsCount > 0 || invalidEmailsCount > 0) && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600">{validEmailsCount} emails válidos</span>
              {invalidEmailsCount > 0 && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {invalidEmailsCount} inválidos
                </span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adição em lote */}
          {showBulkInput && (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <Label htmlFor="bulk-emails">Adicionar Emails em Lote</Label>
              <Textarea
                id="bulk-emails"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="Cole seus emails aqui separados por vírgula, ponto-e-vírgula ou quebra de linha..."
                rows={4}
                className="mt-2"
              />
              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={processBulkEmails}
                  disabled={!bulkEmails.trim()}
                >
                  Adicionar Emails
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkEmails('');
                    setShowBulkInput(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Emails individuais */}
          <div className="space-y-3">
            {formData.emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="email@exemplo.com"
                  className={`flex-1 ${
                    email.trim() && !validateEmail(email) 
                      ? 'border-red-300 focus:border-red-500' 
                      : email.trim() && validateEmail(email)
                      ? 'border-green-300 focus:border-green-500'
                      : ''
                  }`}
                />
                {formData.emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || validEmailsCount === 0}
        >
          {loading ? 'Salvando...' : emailList?.id ? 'Atualizar' : 'Criar'} Lista
        </Button>
      </div>
    </form>
  );
}
