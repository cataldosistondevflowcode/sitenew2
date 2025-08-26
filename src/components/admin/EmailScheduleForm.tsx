import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  X,
  Calendar,
  Clock,
  Mail,
  Settings,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailSchedule {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  page_type: 'RJ' | 'SP';
  filter_config?: any;
  max_properties: number;
  subject_template: string;
  recipient_emails: string[];
  recurrence_type: 'daily' | 'weekly' | 'monthly';
  recurrence_interval: number;
  send_time: string;
  send_weekdays?: number[];
  send_day_of_month?: number;
}

interface EmailScheduleFormProps {
  schedule?: EmailSchedule | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmailScheduleForm({ schedule, onSuccess, onCancel }: EmailScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmailSchedule>({
    name: '',
    description: '',
    is_active: true,
    page_type: 'RJ',
    filter_config: {},
    max_properties: 10,
    subject_template: 'Catálogo de Imóveis - {count} propriedades selecionadas',
    recipient_emails: [''],
    recurrence_type: 'weekly',
    recurrence_interval: 1,
    send_time: '09:00',
    send_weekdays: [1, 2, 3, 4, 5], // Seg-Sex
    send_day_of_month: 1
  });

  // Opções de filtros disponíveis
  const [filterOptions, setFilterOptions] = useState({
    cidades: [] as string[],
    tipos_leilao: [] as string[]
  });

  useEffect(() => {
    fetchFilterOptions();
    if (schedule) {
      setFormData({
        ...schedule,
        recipient_emails: schedule.recipient_emails.length > 0 ? schedule.recipient_emails : ['']
      });
    }
  }, [schedule]);

  const fetchFilterOptions = async () => {
    try {
      // Buscar cidades disponíveis
      const { data: cidadesData } = await supabase
        .from('leiloes_imoveis')
        .select('cidade')
        .not('cidade', 'is', null)
        .order('cidade');

      // Buscar tipos de leilão disponíveis  
      const { data: tiposData } = await supabase
        .from('leiloes_imoveis')
        .select('tipo_leilao')
        .not('tipo_leilao', 'is', null)
        .order('tipo_leilao');

      const cidades = [...new Set(cidadesData?.map(item => item.cidade) || [])];
      const tipos = [...new Set(tiposData?.map(item => item.tipo_leilao) || [])];

      setFilterOptions({
        cidades,
        tipos_leilao: tipos
      });
    } catch (error) {
      console.error('Erro ao carregar opções de filtro:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (formData.recipient_emails.filter(email => email.trim()).length === 0) {
      toast.error('Pelo menos um email destinatário é obrigatório');
      return;
    }

    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = formData.recipient_emails.filter(email => 
      email.trim() && !emailRegex.test(email.trim())
    );
    
    if (invalidEmails.length > 0) {
      toast.error('Alguns emails são inválidos');
      return;
    }

    if (formData.recurrence_type === 'weekly' && (!formData.send_weekdays || formData.send_weekdays.length === 0)) {
      toast.error('Selecione pelo menos um dia da semana');
      return;
    }

    try {
      setLoading(true);

      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        is_active: formData.is_active,
        page_type: formData.page_type,
        filter_config: formData.filter_config,
        max_properties: formData.max_properties,
        subject_template: formData.subject_template.trim(),
        recipient_emails: formData.recipient_emails.filter(email => email.trim()).map(email => email.trim()),
        recurrence_type: formData.recurrence_type,
        recurrence_interval: formData.recurrence_interval,
        send_time: formData.send_time,
        send_weekdays: formData.recurrence_type === 'weekly' ? formData.send_weekdays : null,
        send_day_of_month: formData.recurrence_type === 'monthly' ? formData.send_day_of_month : null
      };

      if (schedule?.id) {
        // Atualizar
        const { error } = await supabase
          .from('email_schedules')
          .update(dataToSave)
          .eq('id', schedule.id);

        if (error) throw error;
        toast.success('Agendamento atualizado com sucesso');
      } else {
        // Criar
        const { error } = await supabase
          .from('email_schedules')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Agendamento criado com sucesso');
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast.error('Erro ao salvar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    setFormData({
      ...formData,
      recipient_emails: [...formData.recipient_emails, '']
    });
  };

  const removeEmailField = (index: number) => {
    const newEmails = formData.recipient_emails.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      recipient_emails: newEmails.length > 0 ? newEmails : ['']
    });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...formData.recipient_emails];
    newEmails[index] = value;
    setFormData({
      ...formData,
      recipient_emails: newEmails
    });
  };

  const handleWeekdayChange = (day: number, checked: boolean) => {
    const current = formData.send_weekdays || [];
    let newWeekdays;
    
    if (checked) {
      newWeekdays = [...current, day].sort();
    } else {
      newWeekdays = current.filter(d => d !== day);
    }
    
    setFormData({
      ...formData,
      send_weekdays: newWeekdays
    });
  };

  const weekdays = [
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Agendamento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Catálogo RJ Semanal"
                required
              />
            </div>
            <div>
              <Label htmlFor="page_type">Página *</Label>
              <Select
                value={formData.page_type}
                onValueChange={(value: 'RJ' | 'SP') => setFormData({ ...formData, page_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RJ">RJ - Leilão RJ Imóveis</SelectItem>
                  <SelectItem value="SP">SP - Leilão SP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição opcional do agendamento"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_properties">Máximo de Imóveis *</Label>
              <Input
                id="max_properties"
                type="number"
                min="1"
                max="50"
                value={formData.max_properties}
                onChange={(e) => setFormData({ ...formData, max_properties: parseInt(e.target.value) || 10 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="subject_template">Assunto do Email *</Label>
              <Input
                id="subject_template"
                value={formData.subject_template}
                onChange={(e) => setFormData({ ...formData, subject_template: e.target.value })}
                placeholder="Use {count} para número de imóveis"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinatários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Destinatários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.recipient_emails.map((email, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                placeholder="email@exemplo.com"
                className="flex-1"
              />
              {formData.recipient_emails.length > 1 && (
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
        </CardContent>
      </Card>

      {/* Recorrência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configurações de Recorrência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recurrence_type">Tipo de Recorrência *</Label>
              <Select
                value={formData.recurrence_type}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setFormData({ ...formData, recurrence_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurrence_interval">Intervalo *</Label>
              <Input
                id="recurrence_interval"
                type="number"
                min="1"
                max="365"
                value={formData.recurrence_interval}
                onChange={(e) => setFormData({ ...formData, recurrence_interval: parseInt(e.target.value) || 1 })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.recurrence_type === 'daily' && 'A cada X dias'}
                {formData.recurrence_type === 'weekly' && 'A cada X semanas'}
                {formData.recurrence_type === 'monthly' && 'A cada X meses'}
              </p>
            </div>

            <div>
              <Label htmlFor="send_time">Horário de Envio *</Label>
              <Input
                id="send_time"
                type="time"
                value={formData.send_time}
                onChange={(e) => setFormData({ ...formData, send_time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Dias da semana (para recorrência semanal) */}
          {formData.recurrence_type === 'weekly' && (
            <div>
              <Label>Dias da Semana *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekdays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weekday-${day.value}`}
                      checked={formData.send_weekdays?.includes(day.value) || false}
                      onCheckedChange={(checked) => handleWeekdayChange(day.value, checked as boolean)}
                    />
                    <Label htmlFor={`weekday-${day.value}`} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dia do mês (para recorrência mensal) */}
          {formData.recurrence_type === 'monthly' && (
            <div>
              <Label htmlFor="send_day_of_month">Dia do Mês *</Label>
              <Input
                id="send_day_of_month"
                type="number"
                min="1"
                max="31"
                value={formData.send_day_of_month}
                onChange={(e) => setFormData({ ...formData, send_day_of_month: parseInt(e.target.value) || 1 })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Dia do mês para envio (1-31)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Seleção (Opcional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cidades</Label>
              <Select
                value={formData.filter_config?.cidade || ''}
                onValueChange={(value) => 
                  setFormData({
                    ...formData,
                    filter_config: { ...formData.filter_config, cidade: value || undefined }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as cidades</SelectItem>
                  {filterOptions.cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de Leilão</Label>
              <Select
                value={formData.filter_config?.tipo_leilao || ''}
                onValueChange={(value) => 
                  setFormData({
                    ...formData,
                    filter_config: { ...formData.filter_config, tipo_leilao: value || undefined }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {filterOptions.tipos_leilao.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_min">Valor Mínimo</Label>
              <Input
                id="valor_min"
                type="number"
                min="0"
                step="1000"
                value={formData.filter_config?.valor_min || ''}
                onChange={(e) => 
                  setFormData({
                    ...formData,
                    filter_config: { 
                      ...formData.filter_config, 
                      valor_min: e.target.value ? parseInt(e.target.value) : undefined 
                    }
                  })
                }
                placeholder="Ex: 100000"
              />
            </div>

            <div>
              <Label htmlFor="valor_max">Valor Máximo</Label>
              <Input
                id="valor_max"
                type="number"
                min="0"
                step="1000"
                value={formData.filter_config?.valor_max || ''}
                onChange={(e) => 
                  setFormData({
                    ...formData,
                    filter_config: { 
                      ...formData.filter_config, 
                      valor_max: e.target.value ? parseInt(e.target.value) : undefined 
                    }
                  })
                }
                placeholder="Ex: 500000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : schedule?.id ? 'Atualizar' : 'Criar'} Agendamento
        </Button>
      </div>
    </form>
  );
}
