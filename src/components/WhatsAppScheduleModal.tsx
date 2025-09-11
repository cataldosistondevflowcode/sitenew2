import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Calendar, Clock, Settings, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    RDStationForms: any;
  }
}

interface WhatsAppSchedule {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  page_type: 'RJ' | 'SP';
  filter_config?: any;
  max_properties: number;
  message_template: string;
  recipient_phones: string[];
  phone_list_id?: string;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'once';
  recurrence_interval: number;
  send_time: string;
  send_weekdays?: number[];
  send_day_of_month?: number;
}

interface WhatsAppScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
}

const WhatsAppScheduleModal: React.FC<WhatsAppScheduleModalProps> = ({ 
  isOpen, 
  onClose,
  currentUrl = ''
}) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'now' | 'schedule'>('now');
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para envio imediato
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Estado para agendamento
  const [scheduleData, setScheduleData] = useState<WhatsAppSchedule>({
    name: '',
    description: '',
    is_active: true,
    page_type: 'RJ',
    filter_config: {},
    max_properties: 10,
    message_template: (() => {
      // Processar URL atual para remover localhost
      if (!currentUrl) return '';
      
      if (currentUrl.includes('localhost')) {
        try {
          const url = new URL(currentUrl);
          let path = url.pathname + url.search + url.hash;
          return path.startsWith('/') ? path : '/' + path;
        } catch (error) {
          return currentUrl;
        }
      }
      
      return currentUrl;
    })(),
    recipient_phones: [''],
    phone_list_id: undefined,
    recurrence_type: 'once',
    recurrence_interval: 1,
    send_time: '09:00',
    send_weekdays: [1, 2, 3, 4, 5], // Seg-Sex
    send_day_of_month: 1
  });



  // Listas de telefones disponíveis
  const [phoneLists, setPhoneLists] = useState<Array<{id: string, name: string, phones: string[]}>>([]);
  const [usePhoneList, setUsePhoneList] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPhoneLists();
      loadRDStationForm();
    }
  }, [isOpen]);

  const fetchPhoneLists = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_phone_lists')
        .select('id, name, phones')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      console.log('Listas de telefones carregadas:', data);
      setPhoneLists(data || []);
    } catch (error) {
      console.error('Erro ao carregar listas de telefones:', error);
    }
  };

  const loadRDStationForm = () => {
    if (containerRef.current) {
      // Limpa qualquer conteúdo anterior
      containerRef.current.innerHTML = '';
      
      // Verifica se já existe um script do RDStation carregado
      const existingScript = document.querySelector('script[src*="rdstation-forms"]');
      const uniqueId = 'whatsapp-modal-shortcode3';
      const existingContainer = document.getElementById(uniqueId);
      
      // Remove elementos duplicados se existirem
      if (existingContainer && existingContainer !== containerRef.current.querySelector(`#${uniqueId}`)) {
        existingContainer.remove();
      }
      
      // Código HTML e JavaScript direto do RDStation com ID único
      const formHTML = `
        <div role="main" id="${uniqueId}" style="display: none;"></div>
      `;
      
      containerRef.current.innerHTML = formHTML;
      
      // Carrega o script apenas se não existir
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
        script.onload = () => {
          console.log('Script RDStation carregado para WhatsApp modal');
          initializeRDStationForm();
        };
        script.onerror = () => {
          console.error('Erro ao carregar script do RDStation para WhatsApp modal');
        };
        document.head.appendChild(script);
      } else {
        // Se o script já existe, apenas inicializa o formulário
        initializeRDStationForm();
      }
    }
  };
  
  const initializeRDStationForm = () => {
    setTimeout(() => {
      try {
        if (window.RDStationForms) {
          new window.RDStationForms(uniqueId, 'UA-150032078-1').createForm();
          console.log('RDStation Form do WhatsApp modal criado com sucesso');
          setIsFormLoaded(true);
        } else {
          console.error('RDStationForms não disponível para WhatsApp modal');
        }
      } catch (error) {
        console.error('Erro ao criar RDStation Form do WhatsApp modal:', error);
      }
    }, 1000);
  };

  // Função para envio imediato via WhatsApp
  const handleImmediateSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone) {
      toast({
        title: "Erro",
        description: "Telefone é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar URL para envio
      let pageUrl = currentUrl || '';
      
      // Se for localhost, extrair apenas o path
      if (pageUrl.includes('localhost')) {
        try {
          const url = new URL(pageUrl);
          pageUrl = url.pathname + url.search + url.hash;
        } catch (error) {
          console.error('Erro ao processar URL:', error);
        }
      }

      // Garantir que comece com /
      if (pageUrl && !pageUrl.startsWith('/')) {
        pageUrl = '/' + pageUrl;
      }

      if (!pageUrl) {
        toast({
          title: "Erro",
          description: "URL da página não encontrada",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Determinar webhook baseado na URL (se contém /leilao-sp/ use SP, senão RJ)
      const isSpPage = pageUrl.includes('/leilao-sp/') || pageUrl.includes('SP');
      const webhookUrl = isSpPage 
        ? 'https://n8n-production-49ae.up.railway.app/webhook/wppsp'
        : 'https://n8n-production-49ae.up.railway.app/webhook/wpprj';

      // Preparar telefone (adicionar +55 se não tiver)
      let phoneNumber = formData.phone.replace(/\D/g, ''); // Remove tudo que não é número
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = '55' + phoneNumber;
      }

      console.log('📱 Verificando duplicatas para:', {
        phone: phoneNumber,
        url: pageUrl
      });

      // Verificar se a mensagem já foi enviada
      const { data: alreadySent, error: checkError } = await supabase
        .rpc('check_whatsapp_message_sent', {
          phone: phoneNumber,
          url: pageUrl
        });

      if (checkError) {
        console.error('Erro ao verificar duplicata:', checkError);
        // Continua mesmo com erro, melhor enviar do que bloquear
      } else if (alreadySent) {
        toast({
          title: "Aviso",
          description: "Esta mensagem já foi enviada para este número anteriormente.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      console.log('📱 Enviando WhatsApp:', {
        phone: phoneNumber,
        url: pageUrl,
        webhook: webhookUrl
      });

      // Chamar webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num: phoneNumber,
          url: pageUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook retornou ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Resposta do webhook:', result);

      // Registrar a mensagem como enviada
      try {
        const { data: messageId, error: registerError } = await supabase
          .rpc('register_whatsapp_message_sent', {
            phone: phoneNumber,
            url: pageUrl,
            webhook_response_param: result
          });

        if (registerError) {
          console.error('Erro ao registrar mensagem enviada:', registerError);
        } else {
          console.log('📝 Mensagem registrada com ID:', messageId);
        }
      } catch (regError) {
        console.error('Erro ao registrar mensagem:', regError);
      }

      toast({
        title: "Sucesso!",
        description: "Mensagem enviada pelo WhatsApp com sucesso!"
      });
      
      // Fechar o modal e limpar os campos
      setFormData({ name: '', email: '', phone: '' });
      onClose();

    } catch (error) {
      console.error('Erro ao enviar pelo WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar pelo WhatsApp. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para criar agendamento
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!scheduleData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    // Validar destinatários - ou lista ou telefones manuais
    if (usePhoneList) {
      if (!scheduleData.phone_list_id) {
        toast({
          title: "Erro",
          description: "Selecione uma lista de telefones",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (scheduleData.recipient_phones.filter(phone => phone.trim()).length === 0) {
        toast({
          title: "Erro",
          description: "Pelo menos um telefone destinatário é obrigatório",
          variant: "destructive"
        });
        return;
      }
    }

    if (scheduleData.recurrence_type === 'weekly' && (!scheduleData.send_weekdays || scheduleData.send_weekdays.length === 0)) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um dia da semana",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Calcular próximo envio
      let nextSendAt = null;
      
      if (scheduleData.recurrence_type === 'once') {
        // Para agendamentos únicos, calcular próximo horário disponível
        const today = new Date();
        const [hours, minutes] = scheduleData.send_time.split(':').map(Number);
        
        // Criar data para hoje no horário especificado
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // Se o horário já passou hoje, agendar para amanhã
        if (scheduledTime <= today) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        nextSendAt = scheduledTime.toISOString();
      } else {
        // Para agendamentos recorrentes, usar a função do banco
        const { data: nextSendData, error: nextSendError } = await supabase
          .rpc('calculate_next_whatsapp_send_time', {
            p_recurrence_type: scheduleData.recurrence_type,
            p_recurrence_interval: scheduleData.recurrence_interval,
            p_send_time: scheduleData.send_time,
            p_send_weekdays: scheduleData.recurrence_type === 'weekly' ? scheduleData.send_weekdays : null,
            p_send_day_of_month: scheduleData.recurrence_type === 'monthly' ? scheduleData.send_day_of_month : null,
            p_timezone: 'America/Sao_Paulo'
          });

        if (nextSendError) {
          console.error('Erro ao calcular próximo envio:', nextSendError);
        } else {
          nextSendAt = nextSendData;
        }
      }

      const dataToSave = {
        name: scheduleData.name.trim(),
        description: scheduleData.description?.trim() || null,
        is_active: scheduleData.is_active,
        page_type: scheduleData.page_type,
        filter_config: scheduleData.filter_config,
        max_properties: scheduleData.max_properties,
        message_template: scheduleData.message_template.trim(),
        recipient_phones: usePhoneList ? [] : scheduleData.recipient_phones.filter(phone => phone.trim()).map(phone => phone.trim()),
        phone_list_id: usePhoneList ? scheduleData.phone_list_id : null,
        recurrence_type: scheduleData.recurrence_type,
        recurrence_interval: scheduleData.recurrence_interval,
        send_time: scheduleData.send_time,
        send_weekdays: scheduleData.recurrence_type === 'weekly' ? scheduleData.send_weekdays : null,
        send_day_of_month: scheduleData.recurrence_type === 'monthly' ? scheduleData.send_day_of_month : null,
        next_send_at: nextSendAt
      };

      const { error } = await supabase
        .from('whatsapp_schedules')
        .insert([dataToSave]);

      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso"
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar agendamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPhoneField = () => {
    setScheduleData({
      ...scheduleData,
      recipient_phones: [...scheduleData.recipient_phones, '']
    });
  };

  const removePhoneField = (index: number) => {
    const newPhones = scheduleData.recipient_phones.filter((_, i) => i !== index);
    setScheduleData({
      ...scheduleData,
      recipient_phones: newPhones.length > 0 ? newPhones : ['']
    });
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...scheduleData.recipient_phones];
    newPhones[index] = value;
    setScheduleData({
      ...scheduleData,
      recipient_phones: newPhones
    });
  };

  const handleWeekdayChange = (day: number, checked: boolean) => {
    const current = scheduleData.send_weekdays || [];
    let newWeekdays;
    
    if (checked) {
      newWeekdays = [...current, day].sort();
    } else {
      newWeekdays = current.filter(d => d !== day);
    }
    
    setScheduleData({
      ...scheduleData,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="bg-[#25d366] text-white p-4 rounded-t-lg relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold">Enviar página pelo WhatsApp</h2>
          <p className="text-sm opacity-90">Envie a página gerada para um número de WhatsApp</p>
        </div>
        
        {/* Corpo do modal */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'now' | 'schedule')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="now" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Enviar Agora
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Enviar Agendado
              </TabsTrigger>
            </TabsList>

            {/* Tab: Enviar Agora */}
            <TabsContent value="now" className="mt-6">
              <form onSubmit={handleImmediateSend} className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </Label>
                  <div className="flex">
                    <select className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent">
                      <option value="+55">🇧🇷 +55</option>
                    </select>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="21999999999"
                      className="rounded-l-none border-l-0"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Digite apenas os números (DDD + número). O +55 será adicionado automaticamente.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Página a ser enviada:</strong><br />
                    {currentUrl ? (
                      currentUrl.includes('localhost') ? 
                        new URL(currentUrl).pathname + new URL(currentUrl).search + new URL(currentUrl).hash :
                        currentUrl
                    ) : 'Página atual'}
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isSubmitting ? "Enviando..." : "Enviar pelo WhatsApp"}
                </Button>
              </form>
            </TabsContent>

            {/* Tab: Enviar Agendado */}
            <TabsContent value="schedule" className="mt-6">
              <form onSubmit={handleScheduleSubmit} className="space-y-6">
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
                          value={scheduleData.name}
                          onChange={(e) => setScheduleData({ ...scheduleData, name: e.target.value })}
                          placeholder="Ex: WhatsApp RJ Semanal"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="page_type">Página *</Label>
                        <Select
                          value={scheduleData.page_type}
                          onValueChange={(value: 'RJ' | 'SP') => setScheduleData({ ...scheduleData, page_type: value })}
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
                        value={scheduleData.description}
                        onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                        placeholder="Descrição opcional do agendamento"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message_template">URL da Página *</Label>
                      <Input
                        id="message_template"
                        value={scheduleData.message_template}
                        onChange={(e) => setScheduleData({ ...scheduleData, message_template: e.target.value })}
                        placeholder="URL da página estática gerada"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Esta é a URL que será enviada para os telefones via WhatsApp
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Destinatários */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Destinatários e Listas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Opção de usar lista ou telefones manuais */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="use-phone-list"
                          checked={usePhoneList}
                          onCheckedChange={(checked) => {
                            setUsePhoneList(checked as boolean);
                            if (checked) {
                              // Limpar telefones manuais quando usar lista
                              setScheduleData({ ...scheduleData, recipient_phones: [''] });
                            } else {
                              // Limpar lista quando usar telefones manuais
                              setScheduleData({ ...scheduleData, phone_list_id: undefined });
                            }
                          }}
                        />
                        <Label htmlFor="use-phone-list" className="text-sm font-medium">
                          Usar lista de telefones existente
                        </Label>
                      </div>
                    
                      {phoneLists.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            Nenhuma lista de telefones encontrada. Você pode usar telefones manuais ou criar uma lista primeiro.
                          </p>
                        </div>
                      )}
                    </div>

                    {usePhoneList ? (
                      /* Seleção de lista */
                      <div>
                        <Label htmlFor="phone-list">Lista de Telefones *</Label>
                        <Select
                          value={scheduleData.phone_list_id || ''}
                          onValueChange={(value) => 
                            setScheduleData({ ...scheduleData, phone_list_id: value || undefined })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma lista" />
                          </SelectTrigger>
                          <SelectContent>
                            {phoneLists.map((list) => (
                              <SelectItem key={list.id} value={list.id}>
                                {list.name} ({list.phones.length} telefones)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Preview da lista selecionada */}
                        {scheduleData.phone_list_id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            {(() => {
                              const selectedList = phoneLists.find(l => l.id === scheduleData.phone_list_id);
                              if (!selectedList) return null;
                              
                              return (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Preview da lista "{selectedList.name}":
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedList.phones.slice(0, 5).map((phone, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {phone}
                                      </Badge>
                                    ))}
                                    {selectedList.phones.length > 5 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{selectedList.phones.length - 5} mais
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Telefones manuais */
                      <div className="space-y-3">
                        <Label>Telefones Manuais *</Label>
                        {scheduleData.recipient_phones.map((phone, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="tel"
                              value={phone}
                              onChange={(e) => updatePhone(index, e.target.value)}
                              placeholder="+5521999999999"
                              className="flex-1"
                            />
                            {scheduleData.recipient_phones.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePhoneField(index)}
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
                          onClick={addPhoneField}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar Telefone
                        </Button>
                      </div>
                    )}
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
                          value={scheduleData.recurrence_type}
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'once') => 
                            setScheduleData({ ...scheduleData, recurrence_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Apenas uma vez</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {scheduleData.recurrence_type !== 'once' && (
                        <div>
                          <Label htmlFor="recurrence_interval">Intervalo *</Label>
                          <Input
                            id="recurrence_interval"
                            type="number"
                            min="1"
                            max="365"
                            value={scheduleData.recurrence_interval}
                            onChange={(e) => setScheduleData({ ...scheduleData, recurrence_interval: parseInt(e.target.value) || 1 })}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {scheduleData.recurrence_type === 'daily' && 'A cada X dias'}
                            {scheduleData.recurrence_type === 'weekly' && 'A cada X semanas'}
                            {scheduleData.recurrence_type === 'monthly' && 'A cada X meses'}
                          </p>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="send_time">Horário de Envio *</Label>
                        <Input
                          id="send_time"
                          type="time"
                          value={scheduleData.send_time}
                          onChange={(e) => setScheduleData({ ...scheduleData, send_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Dias da semana (para recorrência semanal) */}
                    {scheduleData.recurrence_type === 'weekly' && (
                      <div>
                        <Label>Dias da Semana *</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {weekdays.map((day) => (
                            <div key={day.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`weekday-${day.value}`}
                                checked={scheduleData.send_weekdays?.includes(day.value) || false}
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
                    {scheduleData.recurrence_type === 'monthly' && (
                      <div>
                        <Label htmlFor="send_day_of_month">Dia do Mês *</Label>
                        <Input
                          id="send_day_of_month"
                          type="number"
                          min="1"
                          max="31"
                          value={scheduleData.send_day_of_month}
                          onChange={(e) => setScheduleData({ ...scheduleData, send_day_of_month: parseInt(e.target.value) || 1 })}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Dia do mês para envio (1-31)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>



                {/* Botões */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-[#25d366] hover:bg-[#128c7e]">
                    {loading ? 'Salvando...' : 'Criar Agendamento'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Container oculto para o formulário RDStation */}
          <div 
            ref={containerRef}
            style={{ display: 'none' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppScheduleModal;
