import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download,
  CheckSquare,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  FileText,
  ExternalLink,
  Maximize2,
  X,
  Eye,
  EyeOff,
  Mail,
  Send,
  Calendar,
  Clock,
  Repeat,
  Plus,
  Settings,
  Globe,
  MessageCircle,
  Filter
} from 'lucide-react';
import { formatCurrency } from '@/utils/stringUtils';
import { toast } from 'sonner';
import WhatsAppModal from '@/components/WhatsAppModal';

interface Property {
  id: number;
  titulo_propriedade: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_leilao_1: string;
  data_leilao_2: string;
  leilao_1: number;
  leilao_2: number;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
}

interface AppliedFilters {
  cidade?: string;
  bairros?: string[];
  valor_min?: number;
  valor_max?: number;
  search?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
  tipo_leilao?: string;
  segundo_leilao?: boolean;
  cidades?: string[];
}

const MarketingPDF = () => {
  // Função utilitária para gerar URLs corretas (sem barras duplas)
  const generateCorrectUrl = (path: string) => {
    const baseUrl = window.location.origin.endsWith('/') 
      ? window.location.origin.slice(0, -1) 
      : window.location.origin;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Estado para controlar qual página está sendo exibida
  const [currentPage, setCurrentPage] = useState<'RJ' | 'SP'>('RJ');
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Estados para email
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [generatingStaticPage, setGeneratingStaticPage] = useState(false);
  
  // Estados para WhatsApp
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [lastGeneratedPageUrl, setLastGeneratedPageUrl] = useState('');
  
  // Estados para geração por filtros
  const [generateByFiltersDialogOpen, setGenerateByFiltersDialogOpen] = useState(false);
  const [filterQuantity, setFilterQuantity] = useState(10);
  const [generatingByFilters, setGeneratingByFilters] = useState(false);
  
  // Estados para agendamento recorrente
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    email: '',
    email_list_id: undefined as string | undefined,
    recurrence_type: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recurrence_interval: 1,
    send_time: '09:00',
    send_weekdays: [1, 2, 3, 4, 5], // Seg-Sex
    send_day_of_month: 1,
    max_properties: 10
  });
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const [emailLists, setEmailLists] = useState<Array<{id: string, name: string, emails: string[]}>>([]);
  const [useEmailList, setUseEmailList] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // URLs das páginas originais - agora dinâmicas com filtros
  const getPageUrlWithFilters = (page: 'RJ' | 'SP') => {
    const basePath = page === 'RJ' ? '/' : '/leilao-sp';
    
    // Se não há parâmetros na URL atual, retorna URL base
    const currentParams = window.location.search;
    console.log('Parâmetros da URL atual para iframe:', currentParams);
    
    // IMPORTANTE: Se você quer testar com bairros específicos, pode forçar aqui
    // Por exemplo, se você sabe que quer testar com Caju,Catumbi:
    let testParams = currentParams;
    if (!currentParams || !currentParams.includes('neighborhood') && !currentParams.includes('bairros')) {
      // Para testes, você pode descomentar a linha abaixo e definir bairros específicos:
      // testParams = '?cidade=Rio de Janeiro&neighborhood=Caju,Catumbi';
      console.log('Nenhum filtro de bairro encontrado na URL atual');
    }
    
    if (!testParams) return basePath;
    
    // Retorna URL com filtros atuais (ou de teste)
    const finalUrl = `${basePath}${testParams}`;
    console.log('URL final para iframe:', finalUrl);
    return finalUrl;
  };

  const pageUrls = {
    RJ: getPageUrlWithFilters('RJ'),
    SP: getPageUrlWithFilters('SP')
  };

  useEffect(() => {
    setIframeLoaded(false);
    setSelectedProperties([]);
  }, [currentPage]);

  // Função para sincronizar filtros com iframe
  const syncFiltersWithIframe = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const newUrl = getPageUrlWithFilters(currentPage);
      iframe.src = newUrl;
      setIframeLoaded(false);
    }
  };

  // Função para detectar cliques nos cards do iframe
  useEffect(() => {
    if (!iframeLoaded || !selectionMode) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeClick = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'PROPERTY_CARD_CLICK') {
        const propertyId = event.data.propertyId;
        handleSelectProperty(propertyId);
      }
    };

    window.addEventListener('message', handleIframeClick);
    
    return () => {
      window.removeEventListener('message', handleIframeClick);
    };
  }, [iframeLoaded, selectionMode, selectedProperties]);

  // Injetar CSS e JavaScript no iframe para modo de seleção
  useEffect(() => {
    if (!iframeLoaded) return;

    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const iframeDoc = iframe.contentDocument;
    
    // Bridge permanente para responder filtros mesmo sem modo de seleção
    if (!iframeDoc.querySelector('#marketing-bridge')) {
      const bridge = iframeDoc.createElement('script');
      bridge.id = 'marketing-bridge';
      bridge.textContent = `
        (function() {
          function getNumber(value) {
            if (!value && value !== 0) return undefined;
            const n = parseInt(String(value), 10);
            return isNaN(n) ? undefined : n;
          }
          function getBool(value) { return (value === 'true' ? true : undefined); }
          function getArray(value) { return (value ? value.split(',').map(v => v.trim()).filter(Boolean) : undefined); }
          window.addEventListener('message', function(event) {
            if (event.origin !== location.origin) return;
            if (event.data.type === 'GET_ACTIVE_FILTERS') {
              console.log('===== IFRAME: Recebida mensagem GET_ACTIVE_FILTERS =====');
              console.log('URL do iframe:', window.location.href);
              console.log('Search params:', window.location.search);
              
              try {
                const params = new URLSearchParams(window.location.search);
                console.log('Params parseados:', Object.fromEntries(params.entries()));
                
                // Capturar bairros diretamente do DOM
                function getSelectedNeighborhoods() {
                  const neighborhoods = [];
                  
                  // Buscar por diferentes seletores de bairros (mais amplo e específico)
                  const selectors = [
                    // Checkboxes marcados com "bairro" no nome ou atributo
                    'input[type="checkbox"]:checked[name*="bairro"]',
                    'input[type="checkbox"]:checked[data-value*="bairro"]',
                    'input[type="checkbox"]:checked[id*="bairro"]',
                    
                    // Checkboxes marcados com "neighborhood" 
                    'input[type="checkbox"]:checked[name*="neighborhood"]',
                    'input[type="checkbox"]:checked[data-value*="neighborhood"]',
                    'input[type="checkbox"]:checked[id*="neighborhood"]',
                    
                    // Seletores por classes e data-testid
                    '[data-testid*="neighborhood"] input:checked',
                    '[data-testid*="bairro"] input:checked',
                    '.neighborhood-filter input:checked',
                    '.bairro-filter input:checked',
                    '[class*="neighborhood"] input:checked',
                    '[class*="bairro"] input:checked',
                    
                    // Checkboxes dentro de elementos com "bairro"
                    '[class*="bairro"] input[type="checkbox"]:checked',
                    '[class*="neighborhood"] input[type="checkbox"]:checked',
                    
                    // Select options selecionadas
                    'select[name*="bairro"] option:checked',
                    'select[name*="neighborhood"] option:checked'
                  ];
                  
                  // Também capturar do URL se existir
                  const urlParams = new URLSearchParams(window.location.search);
                  const urlBairros = urlParams.get('bairros');
                  if (urlBairros) {
                    const urlNeighborhoods = urlBairros.split(',').map(b => b.trim()).filter(Boolean);
                    neighborhoods.push(...urlNeighborhoods);
                  }
                  
                  selectors.forEach(selector => {
                    try {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        let value = null;
                        
                        // Diferentes formas de obter o valor
                        if (el.tagName.toLowerCase() === 'option') {
                          value = el.value || el.textContent?.trim();
                        } else {
                          value = el.value || 
                                  el.getAttribute('data-value') || 
                                  el.getAttribute('data-neighborhood') ||
                                  el.getAttribute('data-bairro') ||
                                  el.nextElementSibling?.textContent?.trim() ||
                                  el.parentElement?.textContent?.trim();
                        }
                        
                        if (value && !neighborhoods.includes(value)) {
                          neighborhoods.push(value);
                        }
                      });
                    } catch (e) { 
                      console.warn('Erro ao processar seletor:', selector, e);
                    }
                  });
                  
                  console.log('===== DEBUG BAIRROS =====');
                  console.log('Bairros capturados do DOM:', neighborhoods);
                  console.log('Total de bairros encontrados:', neighborhoods.length);
                  
                  // Debug adicional: listar todos os elementos de input na página
                  const allInputs = document.querySelectorAll('input');
                  console.log('Total de inputs na página:', allInputs.length);
                  
                  const checkedInputs = document.querySelectorAll('input:checked');
                  console.log('Total de inputs marcados:', checkedInputs.length);
                  checkedInputs.forEach((input, index) => {
                    console.log('Input marcado ' + (index + 1) + ':', {
                      type: input.type,
                      name: input.name,
                      value: input.value,
                      id: input.id,
                      className: input.className,
                      parentText: input.parentElement?.textContent?.trim()?.substring(0, 50)
                    });
                  });
                  
                  return neighborhoods.length > 0 ? neighborhoods : undefined;
                }
                
                const filters = {
                  cidade: params.get('cidade') || undefined,
                  tipo_leilao: params.get('tipo_leilao') || undefined,
                  valor_min: getNumber(params.get('preco_min')),
                  valor_max: getNumber(params.get('preco_max')),
                  search: params.get('palavra_chave') || undefined,
                  fgts: getBool(params.get('fgts')),
                  financiamento: getBool(params.get('financiamento')),
                  parcelamento: getBool(params.get('parcelamento')),
                  segundo_leilao: getBool(params.get('segundo_leilao')),
                  bairros: getSelectedNeighborhoods() || getArray(params.get('bairros')) || getArray(params.get('bairro')),
                  cidades: getArray(params.get('cidades')),
                };
                
                console.log('===== ENVIANDO FILTROS =====');
                console.log('Filtros completos capturados no iframe:', filters);
                console.log('Especificamente - bairros:', filters.bairros);
                
                parent.postMessage({ type: 'ACTIVE_FILTERS_RESPONSE', filters }, location.origin);
              } catch (e) {
                console.error('Erro ao capturar filtros:', e);
                parent.postMessage({ type: 'ACTIVE_FILTERS_RESPONSE', filters: {} }, location.origin);
              }
            }
          });
        })();
      `;
      iframeDoc.body.appendChild(bridge);
    }

    // Injetar CSS para ocultar elementos desnecessários e destacar cards selecionáveis
    const style = iframeDoc.createElement('style');
    style.textContent = `
      /* Ocultar elementos desnecessários para mostrar só os imóveis */
      header, 
      .hero-section, 
      .top-bar,
      .social-bar,
      .newsletter,
      .benefits-section,
      .faq-section,
      .interview-section,
      .testimonials-section,
      .success-cases,
      .call-to-action,
      .featured-videos,
      .whatsapp-button,
      .whatsapp-modal,
      footer,
      .footer,
      .auction-benefits-section,
      nav {
        display: none !important;
      }

      /* Ajustar layout para mostrar só a grid de imóveis */
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #f8fafc !important;
      }
      
      main {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      .container {
        max-width: 100% !important;
        padding: 20px !important;
      }

      /* Estilos para modo de seleção */
      .marketing-selection-mode .property-card {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        position: relative !important;
        border-radius: 12px !important;
        overflow: hidden !important;
      }
      
      .marketing-selection-mode .property-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
      }
      
      /* Overlay de seleção sobre o card */
      .marketing-selection-mode .property-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(59, 130, 246, 0) !important;
        transition: all 0.3s ease !important;
        pointer-events: none;
        z-index: 5;
      }
      
      .marketing-selection-mode .property-card.selected::after {
        background: rgba(59, 130, 246, 0.15) !important;
        border: 3px solid #3b82f6 !important;
        border-radius: 12px !important;
      }
      
      /* Checkbox visual */
      .marketing-selection-mode .property-card::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 12px;
        width: 28px;
        height: 28px;
        border: 2px solid #fff;
        border-radius: 6px;
        background: rgba(0,0,0,0.6);
        z-index: 10;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .marketing-selection-mode .property-card.selected::before {
        background: #3b82f6 !important;
        content: '✓';
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        border-color: #3b82f6;
      }

      /* Filtro escuro nos cards selecionados */
      .marketing-selection-mode .property-card.selected img {
        filter: brightness(0.8) saturate(1.2) !important;
        transition: all 0.3s ease !important;
      }
      
      /* Overlay informativo */
      .marketing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        color: white;
        padding: 16px;
        text-align: center;
        font-weight: 600;
        z-index: 9999;
        border-bottom: 3px solid #1e40af;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      /* Ajustar padding do conteúdo quando overlay estiver ativo */
      .marketing-selection-mode main {
        padding-top: 60px !important;
      }
      
      /* Estilos para links de imóveis em modo de seleção */
      .marketing-selection-mode [href*="/imovel/"] {
        cursor: pointer !important;
        user-select: none !important;
        transition: all 0.2s ease;
        position: relative;
        pointer-events: auto !important;
      }
      
      .marketing-selection-mode [href*="/imovel/"]:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        z-index: 10;
      }
      
      .marketing-selection-mode [href*="/imovel/"].selected {
        border: 3px solid #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
        background: rgba(59, 130, 246, 0.05) !important;
      }
      
      .marketing-selection-mode [href*="/imovel/"].selected::after {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        background: #3b82f6;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        z-index: 100;
      }
      
      /* Sobrescrever qualquer pointer-events que possa estar bloqueando */
      .marketing-selection-mode [href*="/imovel/"] * {
        pointer-events: none !important;
      }
      
      .marketing-selection-mode [href*="/imovel/"] {
        pointer-events: auto !important;
      }

      /* Estilo para placeholder de mapas */
      .map-placeholder {
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 8px;
        border: 2px dashed #0369a1;
        color: #0369a1;
        font-weight: 600;
      }

      .map-placeholder svg {
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
        opacity: 0.7;
      }
    `;
    iframeDoc.head.appendChild(style);

    // Adicionar/remover classe ao body baseado no modo de seleção
    if (selectionMode) {
      iframeDoc.body.classList.add('marketing-selection-mode');
      
      // Adicionar overlay informativo
      let overlay = iframeDoc.querySelector('.marketing-overlay');
      if (!overlay) {
        overlay = iframeDoc.createElement('div');
        overlay.className = 'marketing-overlay';
        iframeDoc.body.appendChild(overlay);
      }
      
      overlay.innerHTML = `
        📋 MODO SELEÇÃO ATIVO - Clique nos imóveis para selecionar para o PDF
        <span style="margin-left: 20px; font-size: 14px; opacity: 0.9;">
          <strong>${selectedProperties.length}</strong> imóveis selecionados
        </span>
      `;

      // Injetar JavaScript para capturar cliques (versão simplificada e mais robusta)
      if (!iframeDoc.querySelector('#marketing-script')) {
        const script = iframeDoc.createElement('script');
        script.id = 'marketing-script';
        script.textContent = `
          (function() {
            console.log('🚀 Script de seleção iniciado');
            
            // Array para rastrear IDs selecionados localmente
            window.marketingSelectedIds = window.marketingSelectedIds || [];
            
            // Função para interceptar TODOS os cliques na página
            function globalClickHandler(event) {
              console.log('🔍 Clique global detectado:', event.target);
              
              // Verificar se estamos em modo de seleção
              if (!document.body.classList.contains('marketing-selection-mode')) {
                console.log('⚠️ Não está em modo de seleção');
                return;
              }
              
              // Procurar o card de imóvel mais próximo
              let element = event.target;
              let card = null;
              
              // Buscar até 10 níveis acima para encontrar o link do imóvel
              for (let i = 0; i < 10 && element; i++) {
                if (element.tagName === 'A' && element.href && element.href.includes('/imovel/')) {
                  card = element;
                  break;
                }
                element = element.parentElement;
              }
              
              if (card) {
                console.log('✅ Card encontrado:', card.href);
                
                // PARAR COMPLETAMENTE o evento
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                const match = card.href.match(/\\/imovel\\/(\\d+)/);
                if (match) {
                  const propertyId = parseInt(match[1]);
                  console.log('🎯 ID do imóvel:', propertyId);
                  
                  // Toggle seleção
                  const index = window.marketingSelectedIds.indexOf(propertyId);
                  const isSelected = index === -1;
                  
                  if (isSelected) {
                    window.marketingSelectedIds.push(propertyId);
                    card.classList.add('selected');
                  } else {
                    window.marketingSelectedIds.splice(index, 1);
                    card.classList.remove('selected');
                  }
                  
                  console.log('📋 Selecionados:', window.marketingSelectedIds);
                  
                  // Enviar mensagem para o componente pai
                  parent.postMessage({
                    type: 'PROPERTY_CARD_CLICK',
                    propertyId: propertyId,
                    isSelected: isSelected
                  }, '*');
                }
                
                return false;
              }
            }
            
            // Adicionar listener global no documento com capture
            document.addEventListener('click', globalClickHandler, true);
            
            // Escutar mensagens do componente pai
            window.addEventListener('message', function(event) {
              if (event.origin !== location.origin) return;
              
              if (event.data.type === 'UPDATE_SELECTIONS') {
                window.marketingSelectedIds = event.data.selectedIds;
                console.log('🔄 Sincronizando seleções:', window.marketingSelectedIds);
                
                // Atualizar visual de todos os cards
                document.querySelectorAll('a[href*="/imovel/"]').forEach(card => {
                  const match = card.href.match(/\\/imovel\\/(\\d+)/);
                  if (match) {
                    const propertyId = parseInt(match[1]);
                    const isSelected = window.marketingSelectedIds.includes(propertyId);
                    
                    if (isSelected) {
                      card.classList.add('selected');
                    } else {
                      card.classList.remove('selected');
                    }
                  }
                });
              }
            });
            
            console.log('✅ Script de seleção configurado');
          })();
        `;
        iframeDoc.body.appendChild(script);
      }
    } else {
      iframeDoc.body.classList.remove('marketing-selection-mode');
      
      // Remover overlay
      const overlay = iframeDoc.querySelector('.marketing-overlay');
      if (overlay) {
        overlay.remove();
      }
    }

  }, [iframeLoaded, selectionMode, selectedProperties.length]);

  // Sincronizar seleções com iframe sempre que selectedProperties mudar
  useEffect(() => {
    if (!iframeLoaded || !selectionMode) return;

    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'UPDATE_SELECTIONS',
        selectedIds: selectedProperties
      }, '*');
    }
  }, [iframeLoaded, selectionMode, selectedProperties]);

  const handleSelectProperty = (propertyId: number) => {
    setSelectedProperties(prev => {
      const newSelection = prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      return newSelection;
    });
  };

  const handleSelectAll = async () => {
    if (!selectionMode) return;
    
    try {
      // Buscar todas as propriedades da página atual
      let query = supabase
        .from('leiloes_imoveis')
        .select('id');

      if (currentPage === 'RJ') {
        query = query.eq('estado', 'RJ');
      } else if (currentPage === 'SP') {
        query = query.eq('estado', 'SP');
      }

      const { data, error } = await query;
      if (error) throw error;

      const allIds = data?.map(p => p.id) || [];
      
      const newSelection = selectedProperties.length === allIds.length ? [] : allIds;
      
      setSelectedProperties(newSelection);
      
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      toast({
        title: "Erro",
        description: "Erro ao selecionar todas as propriedades",
        variant: "destructive"
      });
    }
  };

  const generatePDF = async () => {
    if (selectedProperties.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um imóvel para gerar o PDF",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      // Buscar dados completos dos imóveis selecionados
      const { data: selectedPropertiesData, error } = await supabase
        .from('leiloes_imoveis')
        .select(`
          id,
          titulo_propriedade,
          endereco,
          bairro,
          cidade,
          estado,
          data_leilao_1,
          data_leilao_2,
          leilao_1,
          leilao_2,
          imagem,
          descricao,
          tipo_leilao,
          fgts,
          financiamento,
          parcelamento
        `)
        .in('id', selectedProperties);

      if (error) throw error;
      
      // Gerar HTML baseado no design das páginas originais
      const htmlContent = generateHTMLContent(selectedPropertiesData || []);
      
      // Abrir nova janela com o conteúdo para impressão/PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      toast.success(`PDF gerado com ${selectedProperties.length} imóveis!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const sendPdfByEmail = async () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecione pelo menos um imóvel para enviar por email');
      return;
    }

    if (!recipientEmail) {
      toast.error('Digite um email válido');
      return;
    }

    setSendingEmail(true);
    try {
      // Chamar a Edge Function para gerar e enviar o PDF
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          propertyIds: selectedProperties,
          recipientEmail: recipientEmail,
          pageType: currentPage,
          subject: emailSubject || `Catálogo de Imóveis - Leilão ${currentPage} (${selectedProperties.length} propriedades)`
        }
      });

      if (error) throw error;

      toast.success(`PDF enviado com sucesso para ${recipientEmail}!`);
      setEmailDialogOpen(false);
      setRecipientEmail('');
      setEmailSubject('');
    } catch (error) {
      console.error('Erro ao enviar PDF por email:', error);
      toast.error('Erro ao enviar PDF por email. Tente novamente.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Função para gerar página estática baseada apenas em filtros
  const generateStaticPageByFilters = async () => {
    try {
      setGeneratingByFilters(true);

      // Capturar filtros ativos do iframe
      console.log('🎯 Capturando filtros ativos para geração automática...');
      const activeFilters = await captureCurrentFilters();
      console.log('📋 Filtros capturados:', activeFilters);

      if (!activeFilters || Object.keys(activeFilters).length === 0) {
        toast.error('Nenhum filtro ativo encontrado. Aplique alguns filtros primeiro.');
        return;
      }

      // Construir query baseada nos filtros
      let query = supabase
        .from('leiloes_imoveis')
        .select('*');

      // Aplicar filtros na query
      if (currentPage === 'RJ') {
        query = query.eq('estado', 'RJ');
      } else if (currentPage === 'SP') {
        query = query.eq('estado', 'SP');
      }

      if (activeFilters.cidade) {
        query = query.eq('cidade', activeFilters.cidade);
      }

      if (activeFilters.bairros && activeFilters.bairros.length > 0) {
        query = query.in('bairro', activeFilters.bairros);
      }

      if (activeFilters.valor_min) {
        query = query.gte('leilao_1', activeFilters.valor_min);
      }

      if (activeFilters.valor_max) {
        query = query.lte('leilao_1', activeFilters.valor_max);
      }

      if (activeFilters.tipo_leilao) {
        query = query.eq('tipo_leilao', activeFilters.tipo_leilao);
      }

      if (activeFilters.fgts === true) {
        query = query.eq('fgts', true);
      }

      if (activeFilters.financiamento === true) {
        query = query.eq('financiamento', true);
      }

      if (activeFilters.parcelamento === true) {
        query = query.eq('parcelamento', true);
      }

      if (activeFilters.search) {
        query = query.or(`titulo_propriedade.ilike.%${activeFilters.search}%,descricao.ilike.%${activeFilters.search}%,endereco.ilike.%${activeFilters.search}%`);
      }

      // Ordenar e limitar resultados
      query = query.order('data_leilao_1', { ascending: true });
      query = query.limit(filterQuantity);

      const { data: propertiesData, error: propertiesError } = await query;

      if (propertiesError) throw propertiesError;

      if (!propertiesData || propertiesData.length === 0) {
        toast.error('Nenhum imóvel encontrado com os filtros aplicados.');
        return;
      }

      console.log(`🏠 Encontrados ${propertiesData.length} imóveis com os filtros aplicados`);

      // Extrair IDs dos imóveis
      const propertyIds = propertiesData.map(p => p.id);

      // Gerar ID único para a página
      const pageId = `filters-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Criar título e descrição baseados nos filtros
      const filterDetails = [];
      
      if (activeFilters.cidade) {
        filterDetails.push(activeFilters.cidade);
      }
      
      if (activeFilters.bairros && activeFilters.bairros.length > 0) {
        if (activeFilters.bairros.length === 1) {
          filterDetails.push(activeFilters.bairros[0]);
        } else {
          filterDetails.push(`${activeFilters.bairros.length} bairros`);
        }
      }
      
      if (activeFilters.valor_min || activeFilters.valor_max) {
        const valorRange = [];
        if (activeFilters.valor_min) valorRange.push(`R$ ${activeFilters.valor_min.toLocaleString('pt-BR')}+`);
        if (activeFilters.valor_max) valorRange.push(`até R$ ${activeFilters.valor_max.toLocaleString('pt-BR')}`);
        filterDetails.push(valorRange.join(' '));
      }

      const filterSummary = filterDetails.length > 0 ? ` - ${filterDetails.join(', ')}` : '';
      const title = `Catálogo ${currentPage}${filterSummary} - ${propertiesData.length} Imóveis`;
      const description = `Catálogo gerado automaticamente com ${propertiesData.length} imóveis baseado em filtros aplicados. ${filterDetails.length > 0 ? `Filtros: ${filterDetails.join(', ')}.` : ''} Gerado em ${new Date().toLocaleDateString('pt-BR')}.`;

      // Salvar página estática no Supabase
      const { data: staticPage, error: pageError } = await supabase
        .from('static_pages')
        .insert({
          page_id: pageId,
          title: title,
          description: description,
          page_type: currentPage,
          property_ids: propertyIds,
          properties_data: propertiesData,
          total_properties: propertiesData.length,
          filter_config: activeFilters,
          applied_filters: activeFilters,
        })
        .select()
        .single();

      if (pageError) throw pageError;

      // Gerar URL da página
      // Gerar URL da página
      const pageUrl = generateCorrectUrl(`/catalogo/${pageId}`);
      console.log('🔗 URL gerada para página estática:', pageUrl);
      
      // Salvar URL da última página gerada para WhatsApp
      setLastGeneratedPageUrl(pageUrl);

      // Copiar URL para clipboard
      await navigator.clipboard.writeText(pageUrl);

      toast.success(
        <div>
          <p className="font-semibold">Página criada com filtros automáticos!</p>
          <p className="text-sm text-gray-600 mt-1">{propertiesData.length} imóveis encontrados e incluídos</p>
          <p className="text-xs text-blue-600 mt-2 break-all">{pageUrl}</p>
        </div>
      );

      // Fechar dialog e abrir página em nova aba
      setGenerateByFiltersDialogOpen(false);
      window.open(pageUrl, '_blank');

    } catch (error) {
      console.error('Erro ao gerar página estática por filtros:', error);
      toast.error('Erro ao gerar página estática. Tente novamente.');
    } finally {
      setGeneratingByFilters(false);
    }
  };

  const generateStaticPage = async () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecione pelo menos um imóvel para gerar a página estática');
      return;
    }

    try {
      setGeneratingStaticPage(true);

      // Capturar filtros ativos do iframe - usar mesma lógica do agendamento recorrente  
      console.log('🎯 Capturando filtros ativos do iframe para página estática...');
      const activeFilters = await captureCurrentFilters();
      console.log('📋 Filtros capturados para página estática:', activeFilters);
      
      // Debug específico para bairros (igual ao agendamento recorrente)
      if (activeFilters?.bairros) {
        console.log('✅ Bairros encontrados nos filtros da página estática:', activeFilters.bairros);
      } else {
        console.warn('⚠️ Nenhum bairro encontrado nos filtros ativos da página estática!');
      }
      
      // Debug completo dos filtros (igual ao agendamento)
      console.log('🔍 Debug completo dos filtros capturados:', {
        cidade: activeFilters?.cidade,
        bairros: activeFilters?.bairros,
        valor_min: activeFilters?.valor_min,
        valor_max: activeFilters?.valor_max,
        search: activeFilters?.search,
        total_filters: activeFilters ? Object.keys(activeFilters).length : 0
      });
      
      // Converter para o tipo correto
      const appliedFilters: AppliedFilters = activeFilters || {};

      // Buscar dados completos dos imóveis selecionados
      const { data: selectedPropertiesData, error: propertiesError } = await supabase
        .from('leiloes_imoveis')
        .select('*')
        .in('id', selectedProperties);

      if (propertiesError) throw propertiesError;

      // Gerar ID único para a página
      const pageId = `catalog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Criar título e descrição mais detalhados baseados nos filtros
      let titleSuffix = '';
      let descriptionDetails = '';
      
      if (activeFilters && Object.keys(activeFilters).length > 0) {
        const filterDetails = [];
        
        if (activeFilters.cidade) {
          filterDetails.push(`cidade: ${activeFilters.cidade}`);
        }
        
        if (activeFilters.bairros && activeFilters.bairros.length > 0) {
          filterDetails.push(`bairros: ${activeFilters.bairros.join(', ')}`);
        }
        
        if (activeFilters.valor_min || activeFilters.valor_max) {
          const valorRange = [];
          if (activeFilters.valor_min) valorRange.push(`mín: R$ ${activeFilters.valor_min.toLocaleString('pt-BR')}`);
          if (activeFilters.valor_max) valorRange.push(`máx: R$ ${activeFilters.valor_max.toLocaleString('pt-BR')}`);
          if (valorRange.length > 0) filterDetails.push(`valor: ${valorRange.join(' - ')}`);
        }
        
        if (activeFilters.search) {
          filterDetails.push(`busca: "${activeFilters.search}"`);
        }
        
        const features = [];
        if (activeFilters.fgts) features.push('FGTS');
        if (activeFilters.financiamento) features.push('Financiamento');
        if (activeFilters.parcelamento) features.push('Parcelamento');
        if (features.length > 0) filterDetails.push(`características: ${features.join(', ')}`);
        
        if (filterDetails.length > 0) {
          titleSuffix = ` - Filtrado`;
          descriptionDetails = ` Filtros aplicados: ${filterDetails.join('; ')}.`;
        }
      }
      
      const title = `Catálogo ${currentPage} - ${selectedProperties.length} Imóveis${titleSuffix}`;
      const description = `Catálogo com ${selectedProperties.length} imóveis selecionados do leilão ${currentPage}. Gerado em ${new Date().toLocaleDateString('pt-BR')}.${descriptionDetails}`;

      // Salvar página estática no Supabase com filtros aplicados (igual ao agendamento recorrente)
      const { data: staticPage, error: pageError } = await supabase
        .from('static_pages')
        .insert({
          page_id: pageId,
          title: title,
          description: description,
          page_type: currentPage,
          property_ids: selectedProperties,
          properties_data: selectedPropertiesData || [],
          total_properties: selectedProperties.length,
          filter_config: activeFilters, // Usar activeFilters diretamente como no agendamento
          applied_filters: activeFilters, // Salvar também em applied_filters para compatibilidade
        })
        .select()
        .single();

      if (pageError) throw pageError;

      // Gerar URL da página
      // Gerar URL da página
      const pageUrl = generateCorrectUrl(`/catalogo/${pageId}`);
      console.log('🔗 URL gerada para página estática:', pageUrl);
      
      // Salvar URL da última página gerada para WhatsApp
      setLastGeneratedPageUrl(pageUrl);

      // Copiar URL para clipboard
      await navigator.clipboard.writeText(pageUrl);

      const successMessage = activeFilters && Object.keys(activeFilters).length > 0 ? (
        <div>
          <p className="font-semibold">Página estática criada com filtros!</p>
          <p className="text-sm text-gray-600 mt-1">Filtros aplicados foram salvos junto com a página</p>
          <p className="text-xs text-blue-600 mt-2 break-all">{pageUrl}</p>
        </div>
      ) : (
        <div>
          <p className="font-semibold">Página estática criada com sucesso!</p>
          <p className="text-sm text-gray-600 mt-1">Link copiado para a área de transferência</p>
          <p className="text-xs text-blue-600 mt-2 break-all">{pageUrl}</p>
        </div>
      );

      toast.success(successMessage);

      // Abrir página em nova aba
      window.open(pageUrl, '_blank');

    } catch (error) {
      console.error('Erro ao gerar página estática:', error);
      toast.error('Erro ao gerar página estática. Tente novamente.');
    } finally {
      setGeneratingStaticPage(false);
    }
  };

  const openEmailDialog = () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecione pelo menos um imóvel primeiro');
      return;
    }
    
    // Definir assunto padrão
    setEmailSubject(`Catálogo de Imóveis - Leilão ${currentPage} (${selectedProperties.length} propriedades)`);
    setEmailDialogOpen(true);
  };

  const openWhatsappDialog = () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecione pelo menos um imóvel primeiro');
      return;
    }
    
    setWhatsappDialogOpen(true);
  };



  // Função para capturar filtros da página principal (fora do iframe)
  const captureMainPageFilters = (): any => {
    const filters: any = {};
    
    // Capturar da URL atual
    const currentParams = new URLSearchParams(window.location.search);
    
    console.log('===== DEBUG PÁGINA PRINCIPAL =====');
    console.log('URL completa:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Todos os parâmetros:', Object.fromEntries(currentParams.entries()));
    
    // Mapear parâmetros conhecidos
    if (currentParams.get('cidade')) filters.cidade = currentParams.get('cidade');
    
    // Prioridade: bairro (singular) -> bairros (plural) -> neighborhood (inglês)
    if (currentParams.get('bairro')) {
      filters.bairros = currentParams.get('bairro')!.split(',').map(b => b.trim()).filter(Boolean);
      console.log('Bairros encontrados em bairro (singular):', filters.bairros);
    } else if (currentParams.get('bairros')) {
      filters.bairros = currentParams.get('bairros')!.split(',').map(b => b.trim()).filter(Boolean);
      console.log('Bairros encontrados em bairros (plural):', filters.bairros);
    } else if (currentParams.get('neighborhood')) {
      filters.bairros = currentParams.get('neighborhood')!.split(',').map(b => b.trim()).filter(Boolean);
      console.log('Bairros encontrados em neighborhood:', filters.bairros);
    }
    
    // Se ainda não encontrou bairros, tentar outros parâmetros possíveis
    if (!filters.bairros) {
      const possibleNeighborhoodParams = ['neighborhoods', 'district', 'districts'];
      possibleNeighborhoodParams.forEach(param => {
        const value = currentParams.get(param);
        if (value && !filters.bairros) {
          console.log(`Parâmetro ${param} encontrado:`, value);
          filters.bairros = value.split(',').map(b => b.trim()).filter(Boolean);
        }
      });
    }
    
    // Fallback: tentar capturar de elementos da própria página de marketing
    if (!filters.bairros) {
      try {
        // Procurar por elementos que possam conter informações de bairro
        const possibleElements = document.querySelectorAll('[data-neighborhood], [data-bairro], [data-selected-neighborhoods]');
        possibleElements.forEach(el => {
          const neighborhoods = el.getAttribute('data-neighborhood') || 
                               el.getAttribute('data-bairro') || 
                               el.getAttribute('data-selected-neighborhoods');
          if (neighborhoods && !filters.bairros) {
            filters.bairros = neighborhoods.split(',').map(b => b.trim()).filter(Boolean);
            console.log('Bairros encontrados em elementos da página:', filters.bairros);
          }
        });
      } catch (e) {
        console.warn('Erro ao procurar bairros em elementos da página:', e);
      }
    }
    
    // Fallback final: se estamos em uma página de marketing mas viemos de uma página com filtros,
    // tentar capturar do iframe que está carregando a página original
    if (!filters.bairros && iframeRef.current) {
      console.log('Tentando capturar bairros do iframe da página original...');
    }
    
    console.log('Filtros finais da página principal:', filters);
    return filters;
  };

  // Função para capturar filtros ativos do iframe
  const captureCurrentFilters = async (): Promise<any> => {
    // Primeiro tentar capturar da página principal
    const mainPageFilters = captureMainPageFilters();
    
    return new Promise((resolve) => {
      const iframe = iframeRef.current;
      if (!iframe) {
        resolve(mainPageFilters);
        return;
      }

      // Enviar mensagem para o iframe capturar os filtros ativos
      iframe.contentWindow?.postMessage({ type: 'GET_ACTIVE_FILTERS' }, window.location.origin);

      // Escutar resposta
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'ACTIVE_FILTERS_RESPONSE') {
          window.removeEventListener('message', handleMessage);
          
          // Fallback: capturar bairros dos parâmetros da URL atual da página principal
          const currentUrl = window.location.search;
          const currentParams = new URLSearchParams(currentUrl);
          const urlBairros = currentParams.get('bairros') || currentParams.get('neighborhood');
          
          let filters = event.data.filters || {};
          
          // Fazer merge com filtros da página principal (priorizando bairros da página principal)
          const mergedFilters = {
            ...filters,
            ...mainPageFilters,
            // Se temos bairros da página principal, usar eles
            bairros: mainPageFilters.bairros || filters.bairros
          };
          
          console.log('Filtros finais após merge:', mergedFilters);
          resolve(mergedFilters);
        }
      };

      window.addEventListener('message', handleMessage);

      // Timeout de 2 segundos - se iframe não responder, usar filtros da página principal
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        console.warn('Timeout ao capturar filtros do iframe, usando filtros da página principal');
        resolve(mainPageFilters);
      }, 2000);
    });
  };

  // Função para carregar listas de emails
  const fetchEmailLists = async () => {
    try {
      const { data, error } = await supabase
        .from('email_lists')
        .select('id, name, emails')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setEmailLists(data || []);
    } catch (error) {
      console.error('Erro ao carregar listas de emails:', error);
    }
  };

  // Função para abrir dialog de agendamento
  const openScheduleDialog = () => {
    const defaultName = `Agendamento ${currentPage} - ${new Date().toLocaleDateString('pt-BR')}`;
    setScheduleForm({
      ...scheduleForm,
      name: defaultName,
      email: '',
      email_list_id: undefined
    });
    setUseEmailList(false);
    fetchEmailLists();
    setScheduleDialogOpen(true);
  };

  // Função para criar agendamento recorrente
  const createRecurringSchedule = async () => {
    try {
      setCreatingSchedule(true);

      // Validações
      if (!scheduleForm.name.trim()) {
        toast({
          title: "Erro",
          description: "Nome é obrigatório",
          variant: "destructive"
        });
        return;
      }

      // Validar destinatários - ou lista ou email manual
      if (useEmailList) {
        if (!scheduleForm.email_list_id) {
          toast({
            title: "Erro",
            description: "Selecione uma lista de emails",
            variant: "destructive"
          });
          return;
        }
      } else {
        if (!scheduleForm.email.trim()) {
          toast({
            title: "Erro",
            description: "Email é obrigatório",
            variant: "destructive"
          });
          return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(scheduleForm.email.trim())) {
          toast({
            title: "Erro",
            description: "Email inválido",
            variant: "destructive"
          });
          return;
        }
      }

      if (scheduleForm.recurrence_type === 'weekly' && scheduleForm.send_weekdays.length === 0) {
        toast.error('Selecione pelo menos um dia da semana');
        return;
      }

      // Capturar filtros ativos do iframe
      const activeFilters = await captureCurrentFilters();
      console.log('Filtros capturados para agendamento:', activeFilters);
      
      // Debug específico para bairros
      if (activeFilters?.bairros) {
        console.log('Bairros encontrados nos filtros:', activeFilters.bairros);
      } else {
        console.warn('Nenhum bairro encontrado nos filtros ativos!');
      }

      // Calcular próximo envio com base no fuso
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const { data: nextSendAtData, error: nextCalcError } = await supabase.rpc('calculate_next_send_time', {
        p_from_date: new Date().toISOString(),
        p_recurrence_interval: scheduleForm.recurrence_interval,
        p_recurrence_type: scheduleForm.recurrence_type,
        p_send_day_of_month: scheduleForm.recurrence_type === 'monthly' ? scheduleForm.send_day_of_month : 1,
        p_send_time: scheduleForm.send_time,
        p_send_weekdays: scheduleForm.recurrence_type === 'weekly' ? scheduleForm.send_weekdays : [1,2,3,4,5],
        p_timezone: timezone
      });
      if (nextCalcError) {
        console.error('Erro ao calcular próximo envio:', nextCalcError);
      }

      // Criar agendamento
      const { error } = await supabase
        .from('email_schedules')
        .insert([{
          name: scheduleForm.name.trim(),
          description: `Agendamento criado a partir dos filtros ativos na página ${currentPage}`,
          is_active: true,
          page_type: currentPage,
          filter_config: activeFilters,
          selected_neighborhoods: activeFilters?.bairros || null,
          max_properties: scheduleForm.max_properties,
          subject_template: `${currentPage} - Catálogo com {count} imóveis`,
          recipient_emails: useEmailList ? [] : [scheduleForm.email.trim()],
          email_list_id: useEmailList ? scheduleForm.email_list_id : null,
          recurrence_type: scheduleForm.recurrence_type,
          recurrence_interval: scheduleForm.recurrence_interval,
          send_time: scheduleForm.send_time,
          send_timezone: timezone,
          next_send_at: nextSendAtData || null,
          send_weekdays: scheduleForm.recurrence_type === 'weekly' ? scheduleForm.send_weekdays : null,
          send_day_of_month: scheduleForm.recurrence_type === 'monthly' ? scheduleForm.send_day_of_month : null
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso!"
      });
      setScheduleDialogOpen(false);
      
      // Reset form
      setScheduleForm({
        name: '',
        email: '',
        email_list_id: undefined,
        recurrence_type: 'weekly',
        recurrence_interval: 1,
        send_time: '09:00',
        send_weekdays: [1, 2, 3, 4, 5],
        send_day_of_month: 1,
        max_properties: 10
      });

    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento",
        variant: "destructive"
      });
    } finally {
      setCreatingSchedule(false);
    }
  };

  // Função para handle mudança dos dias da semana
  const handleWeekdayChange = (day: number, checked: boolean) => {
    const current = scheduleForm.send_weekdays;
    let newWeekdays;
    
    if (checked) {
      newWeekdays = [...current, day].sort();
    } else {
      newWeekdays = current.filter(d => d !== day);
    }
    
    setScheduleForm({
      ...scheduleForm,
      send_weekdays: newWeekdays
    });
  };

  // Função para gerar URL do Google Static Maps
  const generateStaticMapUrl = (property: Property) => {
    const address = [property.endereco, property.bairro, property.cidade, property.estado]
      .filter(Boolean)
      .join(', ');
    
    if (!address) return null;
    
    const encodedAddress = encodeURIComponent(address);
    const apiKey = 'AIzaSyDgSXLV-7AdIZ_bm8mNWswm516VqcFwQzI'; // Chave da API do Google Maps do projeto
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x300&markers=color:red%7C${encodedAddress}&key=${apiKey}`;
  };

  // Função para criar URL do imóvel (mesma lógica do site)
  const createPropertyUrl = (property: Property) => {
    const baseUrl = window.location.origin;
    const slug = property.titulo_propriedade
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'imovel';
    
    return `${baseUrl}/imovel/${property.id}/${slug}`;
  };

  const generateHTMLContent = (selectedPropertiesData: Property[]) => {
    const date = new Date().toLocaleDateString('pt-BR');
    const pageTitle = currentPage === 'RJ' ? 'Leilão RJ Imóveis' : 'Leilão SP Imóveis';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Catálogo de Imóveis - ${pageTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #d68e08, #e6a010, #d68e08); color: white; padding: 3rem 2rem; text-align: center; }
          .header h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
          .header p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .stats { background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 12px; margin-top: 2rem; border: 1px solid rgba(255,255,255,0.2); }
          .container { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; }
          .property-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
          .property-card { border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); break-inside: avoid; background: white; transition: transform 0.3s ease; }
          .property-card:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
          .property-image { width: 100%; height: 300px; object-fit: cover; background: #f3f4f6; }
          .property-content { padding: 2rem; }
          .property-title { font-size: 1.35rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937; line-height: 1.3; }
          .property-link { color: #d68e08; text-decoration: none; font-weight: 600; }
          .property-link:hover { color: #b8780a; text-decoration: underline; }
          .property-location { color: #6b7280; margin-bottom: 1.5rem; font-size: 1rem; }
          .property-price { font-size: 1.75rem; font-weight: 700; color: #d68e08; margin-bottom: 1.5rem; }
          .property-details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
          .detail-item { font-size: 0.95rem; color: #4b5563; }
          .detail-label { font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
          .property-features { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
          .feature-badge { background: #fef3c7; color: #d68e08; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; border: 1px solid #e6a010; }
          .property-description { color: #6b7280; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #f3f4f6; padding-top: 1.5rem; }
          .property-actions { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #f3f4f6; text-align: center; }
          .view-property-btn { display: inline-block; background: linear-gradient(135deg, #d68e08, #e6a010); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
          .view-property-btn:hover { background: linear-gradient(135deg, #b8780a, #c8920e); transform: translateY(-1px); }
          .footer { margin-top: 4rem; padding: 3rem 2rem; background: linear-gradient(135deg, #f9fafb, #f3f4f6); text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .footer h3 { color: #d68e08; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700; }
          .badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
          .badge-judicial { background: #dcfce7; color: #166534; }
          .badge-extrajudicial { background: #fef3c7; color: #d68e08; }
          @media print { 
            .property-card { page-break-inside: avoid; margin-bottom: 2rem; }
            body { font-size: 11pt; }
            .header { padding: 2rem; }
            .header h1 { font-size: 2.5rem; }
            .container { padding: 2rem; }
            .property-grid { gap: 2rem; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${pageTitle}</h1>
          <p>Catálogo de Imóveis Selecionados</p>
          <div class="stats">
            <p><strong>${selectedPropertiesData.length}</strong> propriedades selecionadas para este catálogo</p>
            <p>Gerado em: ${date}</p>
          </div>
        </div>
        
        <div class="container">
          <div class="property-grid">
            ${selectedPropertiesData.map(property => {
              const isImageNotFound = !property.imagem || 
                                     property.imagem === '' || 
                                     property.imagem.includes('/not-found') ||
                                     property.imagem === 'https://kmiblhbe.manus.space/imovel_sao_goncalo.jpeg';
              
              const staticMapUrl = isImageNotFound ? generateStaticMapUrl(property) : null;
              
              return `
              <div class="property-card">
                ${!isImageNotFound ? 
                  `<img src="${property.imagem}" alt="${property.titulo_propriedade}" class="property-image" />` :
                  staticMapUrl ? 
                    `<img src="${staticMapUrl}" alt="Mapa de ${property.titulo_propriedade}" class="property-image" />` :
                    `<div class="property-image" style="display: flex; align-items: center; justify-content: center; background: #f3f4f6; color: #9ca3af; font-size: 1.1rem;">📍 Localização não disponível</div>`
                }
                <div class="property-content">
                  <h3 class="property-title">
                    <a href="${createPropertyUrl(property)}" class="property-link" target="_blank" rel="noopener noreferrer">
                      ${property.titulo_propriedade || 'Título não informado'}
                    </a>
                  </h3>
                  <p class="property-location">📍 ${[property.endereco, property.bairro, property.cidade, property.estado].filter(Boolean).join(', ')}</p>
                  <p class="property-price">${property.leilao_1 ? formatCurrency(property.leilao_1) : 'Valor não informado'}</p>
                  
                  <div class="property-details">
                    <div class="detail-item">
                      <div class="detail-label">1º Leilão</div>
                      <div>${property.data_leilao_1 ? new Date(property.data_leilao_1).toLocaleDateString('pt-BR') : 'Não informada'}</div>
                      <div>${property.leilao_1 ? formatCurrency(property.leilao_1) : 'Valor não informado'}</div>
                    </div>
                    ${property.data_leilao_2 && property.leilao_2 ? `
                    <div class="detail-item">
                      <div class="detail-label">2º Leilão</div>
                      <div>${new Date(property.data_leilao_2).toLocaleDateString('pt-BR')}</div>
                      <div>${formatCurrency(property.leilao_2)}</div>
                    </div>
                    ` : `
                    <div class="detail-item">
                      <div class="detail-label">Tipo</div>
                      <span class="badge ${property.tipo_leilao?.toLowerCase().includes('judicial') ? 'badge-judicial' : 'badge-extrajudicial'}">${property.tipo_leilao || 'N/A'}</span>
                    </div>
                    `}
                  </div>
                  
                  ${(property.fgts || property.financiamento || property.parcelamento) ? `
                    <div class="property-features">
                      ${property.fgts ? '<span class="feature-badge">✅ FGTS</span>' : ''}
                      ${property.financiamento ? '<span class="feature-badge">🏦 Financiamento</span>' : ''}
                      ${property.parcelamento ? '<span class="feature-badge">💳 Parcelamento</span>' : ''}
                    </div>
                  ` : ''}
                  
                  ${property.descricao ? `
                    <div class="property-description">
                      <strong>Descrição:</strong><br>
                      ${property.descricao.substring(0, 300)}${property.descricao.length > 300 ? '...' : ''}
                    </div>
                  ` : ''}
                  
                  <div class="property-actions">
                    <a href="${createPropertyUrl(property)}" class="view-property-btn" target="_blank" rel="noopener noreferrer">
                      📋 Ver Detalhes Completos
                    </a>
                    <p style="font-size: 0.8rem; color: #6b7280; margin-top: 0.5rem;">
                      Clique no link para acessar todas as informações do imóvel
                    </p>
                  </div>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="footer">
          <h3>${pageTitle}</h3>
          <p style="margin-bottom: 1rem;">Este catálogo foi gerado automaticamente pelo sistema de gestão de marketing</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; text-align: left;">
            <div>
              <h4 style="color: #d68e08; font-weight: 600; margin-bottom: 0.5rem;">📞 Contato</h4>
              <p style="margin-bottom: 0.25rem;">Telefone: <a href="tel:+552131733795" style="color: #d68e08; text-decoration: none;">(21) 3173-3795</a></p>
              <p>Email: <a href="mailto:contato@cataldosiston-adv.com.br" style="color: #d68e08; text-decoration: none;">contato@cataldosiston-adv.com.br</a></p>
            </div>
            
            <div>
              <h4 style="color: #d68e08; font-weight: 600; margin-bottom: 0.5rem;">🌐 Acesse Online</h4>
              <p style="margin-bottom: 0.25rem;">Site: <a href="${window.location.origin}" style="color: #d68e08; text-decoration: none;">${window.location.origin}</a></p>
              <p>Todos os imóveis com mais detalhes e fotos</p>
            </div>
            
            <div>
              <h4 style="color: #d68e08; font-weight: 600; margin-bottom: 0.5rem;">📋 Sobre Este Catálogo</h4>
              <p style="margin-bottom: 0.25rem;"><strong>Data:</strong> ${date}</p>
              <p><strong>Total:</strong> ${selectedPropertiesData.length} imóveis selecionados</p>
            </div>
          </div>
          
          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #d68e08; font-weight: 600;">Cataldo Siston Advogados - Especialistas em Leilões de Imóveis</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Todos os links neste catálogo são clicáveis e direcionam para mais informações</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="relative">
      {/* Header Flutuante Fixo */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Lado esquerdo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Marketing PDF</span>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={currentPage === 'RJ' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage('RJ')}
                  className="text-sm"
                >
                  RJ
                </Button>
                <Button
                  variant={currentPage === 'SP' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage('SP')}
                  className="text-sm"
                >
                  SP
                </Button>
              </div>
            </div>

            {/* Lado direito - Controles */}
            <div className="flex items-center gap-3">
              {/* Status de seleção */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <CheckSquare className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm">
                  {selectedProperties.length} selecionados
                </span>
                {selectedProperties.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {currentPage}
                  </Badge>
                )}
              </div>

              {/* Botão Modo Seleção */}
              <Button
                variant={selectionMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectionMode(!selectionMode)}
                className="flex items-center gap-2"
              >
                {selectionMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {selectionMode ? 'Seleção ON' : 'Seleção OFF'}
              </Button>

              {/* Botão Gerar PDF */}
              <Button
                onClick={generatePDF}
                disabled={selectedProperties.length === 0 || generating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {generating ? 'Gerando...' : `PDF (${selectedProperties.length})`}
              </Button>

              {/* Botão Gerar Página Estática */}
              <Button
                onClick={generateStaticPage}
                disabled={selectedProperties.length === 0 || generatingStaticPage}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                title={selectionMode ? 'Gerar página estática com filtros aplicados' : 'Gerar página estática'}
              >
                {generatingStaticPage ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                {generatingStaticPage ? 'Gerando...' : 
                  selectionMode ? `Página + Filtros (${selectedProperties.length})` : `Página (${selectedProperties.length})`}
              </Button>

              {/* Botão Gerar por Filtros */}
              <Button
                onClick={() => setGenerateByFiltersDialogOpen(true)}
                disabled={generatingByFilters}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                title="Gerar página estática automaticamente baseada nos filtros aplicados"
              >
                {generatingByFilters ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                {generatingByFilters ? 'Gerando...' : 'Gerar por Filtros'}
              </Button>

              {/* Botão Enviar Catálogo */}
              <Button
                onClick={openEmailDialog}
                disabled={selectedProperties.length === 0}
                size="sm"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Catálogo
              </Button>


            </div>
          </div>
        </div>
      </div>

      {/* Espaçamento para o header fixo */}
      <div className="pt-16">
        <div className="space-y-6">
      {/* Header de controle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Marketing com Iframe - Páginas Originais
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controles principais */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            {/* Seletor de página */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Página:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant={currentPage === 'RJ' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage('RJ')}
                  className="flex items-center gap-1"
                >
                  {currentPage === 'RJ' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  RJ (Index)
                </Button>
                <Button
                  variant={currentPage === 'SP' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage('SP')}
                  className="flex items-center gap-1"
                >
                  {currentPage === 'SP' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  SP
                </Button>
              </div>
            </div>

            {/* Botão de modo seleção */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectionMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectionMode(!selectionMode)}
                className="flex items-center gap-2"
              >
                {selectionMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {selectionMode ? 'Modo Seleção ATIVO' : 'Ativar Seleção'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(pageUrls[currentPage], '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir Original
              </Button>


            </div>
          </div>

          {/* Controles de seleção */}
          {selectionMode && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Selecionar Todos
                </Button>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-700">{selectedProperties.length}</span> imóveis selecionados
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={generatePDF}
                  disabled={selectedProperties.length === 0 || generating}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {generating ? 'Gerando PDF...' : 'Gerar PDF'}
                </Button>

                <Button
                  onClick={generateStaticPage}
                  disabled={selectedProperties.length === 0 || generatingStaticPage}
                  variant="outline"
                  className="flex items-center gap-2"
                  title={selectionMode ? 'Gerar página estática com filtros aplicados' : 'Gerar página estática'}
                >
                  {generatingStaticPage ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                  {generatingStaticPage ? 'Gerando...' : 
                    selectionMode ? 'Página + Filtros' : 'Gerar Página'}
                </Button>

                <Button
                  onClick={() => setGenerateByFiltersDialogOpen(true)}
                  disabled={generatingByFilters}
                  className="flex items-center gap-2"
                  title="Gerar página estática automaticamente baseada nos filtros aplicados"
                >
                  {generatingByFilters ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                  {generatingByFilters ? 'Gerando...' : 'Gerar por Filtros'}
                </Button>

                <Button
                  onClick={openWhatsappDialog}
                  disabled={selectedProperties.length === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                  title={selectedProperties.length === 0 ? 'Selecione pelo menos um imóvel primeiro' : 'Enviar pelo WhatsApp'}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>

                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openEmailDialog}
                      disabled={selectedProperties.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Enviar por Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Enviar Catálogo por Email
                      </DialogTitle>
                      <DialogDescription>
                        Envie o catálogo com {selectedProperties.length} imóveis selecionados por email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="destinatario@email.com"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          Assunto
                        </Label>
                        <Input
                          id="subject"
                          placeholder="Assunto do email"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="col-span-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <p><strong>O catálogo incluirá:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Catálogo com {selectedProperties.length} imóveis selecionados</li>
                          <li>Informações detalhadas de cada propriedade</li>
                          <li>Links clicáveis para ver mais detalhes e mapas</li>
                          <li>Design otimizado para email</li>
                          <li>Dados de contato da empresa</li>
                        </ul>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEmailDialogOpen(false)}
                        disabled={sendingEmail}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={sendPdfByEmail}
                        disabled={!recipientEmail || sendingEmail}
                        className="flex items-center gap-2"
                      >
                        {sendingEmail ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar Email
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {/* Dialog de Agendamento Recorrente */}
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Criar Agendamento Recorrente
                </DialogTitle>
                <DialogDescription>
                  Configure um envio automático baseado nos filtros atuais da página {currentPage}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Informações básicas */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="schedule-name">Nome do Agendamento *</Label>
                    <Input
                      id="schedule-name"
                      value={scheduleForm.name}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                      placeholder="Ex: Catálogo RJ Semanal"
                    />
                  </div>

                  {/* Seleção de destinatários */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-email-list"
                        checked={useEmailList}
                        onCheckedChange={(checked) => {
                          setUseEmailList(checked as boolean);
                          if (checked) {
                            setScheduleForm({ ...scheduleForm, email: '' });
                          } else {
                            setScheduleForm({ ...scheduleForm, email_list_id: undefined });
                          }
                        }}
                      />
                      <Label htmlFor="use-email-list" className="text-sm font-medium">
                        Usar lista de emails existente
                      </Label>
                    </div>

                    {useEmailList ? (
                      <div>
                        <Label htmlFor="email-list">Lista de Emails *</Label>
                        <Select
                          value={scheduleForm.email_list_id || ''}
                          onValueChange={(value) => 
                            setScheduleForm({ ...scheduleForm, email_list_id: value || undefined })
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione uma lista" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {emailLists.map((list) => (
                              <SelectItem key={list.id} value={list.id}>
                                {list.name} ({list.emails.length} emails)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Preview da lista selecionada */}
                        {scheduleForm.email_list_id && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            {(() => {
                              const selectedList = emailLists.find(l => l.id === scheduleForm.email_list_id);
                              if (!selectedList) return 'Lista não encontrada';
                              
                              return (
                                <div>
                                  <strong>Preview:</strong> {selectedList.emails.slice(0, 3).join(', ')}
                                  {selectedList.emails.length > 3 && ` +${selectedList.emails.length - 3} mais`}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="schedule-email">Email Destinatário *</Label>
                        <Input
                          id="schedule-email"
                          type="email"
                          value={scheduleForm.email}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                          placeholder="destinatario@email.com"
                        />
                      </div>
                    )}

                    {emailLists.length === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800">
                        Nenhuma lista encontrada. <a href="/admin/email-lists" target="_blank" className="underline">Criar lista</a>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="max-properties">Máximo de Imóveis</Label>
                    <Input
                      id="max-properties"
                      type="number"
                      min="1"
                      max="50"
                      value={scheduleForm.max_properties}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, max_properties: parseInt(e.target.value) || 10 })}
                    />
                  </div>
                </div>

                {/* Configurações de recorrência */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Configurações de Recorrência
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Recorrência</Label>
                      <Select
                        value={scheduleForm.recurrence_type}
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                          setScheduleForm({ ...scheduleForm, recurrence_type: value })
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Intervalo</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={scheduleForm.recurrence_interval}
                        onChange={(e) => setScheduleForm({ 
                          ...scheduleForm, 
                          recurrence_interval: parseInt(e.target.value) || 1 
                        })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {scheduleForm.recurrence_type === 'daily' && 'A cada X dias'}
                        {scheduleForm.recurrence_type === 'weekly' && 'A cada X semanas'}
                        {scheduleForm.recurrence_type === 'monthly' && 'A cada X meses'}
                      </p>
                    </div>

                    <div>
                      <Label>Horário de Envio</Label>
                      <Input
                        type="time"
                        value={scheduleForm.send_time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, send_time: e.target.value })}
                      />
                    </div>

                    {scheduleForm.recurrence_type === 'monthly' && (
                      <div>
                        <Label>Dia do Mês</Label>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          value={scheduleForm.send_day_of_month}
                          onChange={(e) => setScheduleForm({ 
                            ...scheduleForm, 
                            send_day_of_month: parseInt(e.target.value) || 1 
                          })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Dias da semana para recorrência semanal */}
                  {scheduleForm.recurrence_type === 'weekly' && (
                    <div className="mt-4">
                      <Label>Dias da Semana</Label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {[
                          { value: 1, label: 'Seg' },
                          { value: 2, label: 'Ter' },
                          { value: 3, label: 'Qua' },
                          { value: 4, label: 'Qui' },
                          { value: 5, label: 'Sex' },
                          { value: 6, label: 'Sáb' },
                          { value: 0, label: 'Dom' }
                        ].map((day) => (
                          <div key={day.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day.value}`}
                              checked={scheduleForm.send_weekdays.includes(day.value)}
                              onCheckedChange={(checked) => handleWeekdayChange(day.value, checked as boolean)}
                            />
                            <Label htmlFor={`day-${day.value}`} className="text-sm">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações dos filtros */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Filtros Atuais da Página
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Página:</strong> {currentPage}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Os filtros ativos no iframe serão capturados automaticamente (cidade, busca, etc.)
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setScheduleDialogOpen(false)}
                  disabled={creatingSchedule}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={createRecurringSchedule}
                  disabled={
                    !scheduleForm.name || 
                    (!useEmailList && !scheduleForm.email) || 
                    (useEmailList && !scheduleForm.email_list_id) || 
                    creatingSchedule
                  }
                  className="flex items-center gap-2"
                >
                  {creatingSchedule ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Criar Agendamento
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de Geração por Filtros */}
          <Dialog open={generateByFiltersDialogOpen} onOpenChange={setGenerateByFiltersDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Gerar Página por Filtros
                </DialogTitle>
                <DialogDescription>
                  Gere uma página estática automaticamente baseada nos filtros aplicados no iframe
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="filter-quantity">
                    Quantidade máxima de imóveis
                  </Label>
                  <Input
                    id="filter-quantity"
                    type="number"
                    min="1"
                    max="50"
                    value={filterQuantity}
                    onChange={(e) => setFilterQuantity(parseInt(e.target.value) || 10)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Quantos imóveis no máximo incluir na página (1-50)
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">Como funciona:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Os filtros ativos no iframe serão capturados automaticamente</li>
                    <li>• O sistema buscará imóveis que atendem aos critérios</li>
                    <li>• Será gerada uma página com até {filterQuantity} imóveis encontrados</li>
                    <li>• Ordenação: próximos leilões primeiro</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-1">⚠️ Importante:</p>
                  <p className="text-xs text-yellow-700">
                    Certifique-se de aplicar filtros no iframe antes de gerar a página. 
                    Sem filtros ativos, a geração será cancelada.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGenerateByFiltersDialogOpen(false)}
                  disabled={generatingByFilters}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={generateStaticPageByFilters}
                  disabled={generatingByFilters}
                  className="flex items-center gap-2"
                >
                  {generatingByFilters ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Filter className="h-4 w-4" />
                      Gerar Página
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal do WhatsApp */}
          <WhatsAppModal
            isOpen={whatsappDialogOpen}
            onClose={() => setWhatsappDialogOpen(false)}
            currentUrl={lastGeneratedPageUrl}
          />

          {/* Instruções */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Como usar:</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Escolha a página (RJ ou SP) que deseja usar</li>
              <li>2. <strong>OPÇÃO A - Seleção Manual:</strong></li>
              <li>   • Clique em "Ativar Seleção" para entrar no modo de seleção</li>
              <li>   • Use os filtros para encontrar imóveis e clique para selecioná-los</li>
              <li>   • Clique em "Página + Filtros" para criar página com seleções manuais</li>
              <li>3. <strong>🔥 OPÇÃO B - Geração Automática por Filtros:</strong></li>
              <li>   • Apply filtros normais da página (cidade, bairros, valor, etc.)</li>
              <li>   • Clique em "Gerar por Filtros" e defina a quantidade de imóveis</li>
              <li>   • O sistema busca e inclui automaticamente os imóveis que atendem os filtros!</li>
              <li>4. Clique em "Gerar PDF" para visualizar e imprimir o catálogo</li>
              <li>5. Clique em "WhatsApp" para enviar a página por WhatsApp</li>
              <li>6. Ou clique em "Enviar por Email" para enviar o PDF automaticamente</li>
              <li>7. Clique em "Agendar Recorrente" para criar envios automáticos com os filtros atuais</li>
            </ol>
            
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-medium text-green-900 mb-1">🚀 Novo! Geração Automática por Filtros</h5>
              <p className="text-xs text-green-700 mb-2">
                <strong>Agora você pode gerar páginas estáticas automaticamente!</strong> Basta aplicar filtros 
                (cidade, bairros, preço, etc.) e clicar em "Gerar por Filtros". O sistema busca e inclui 
                automaticamente os imóveis que atendem aos critérios, sem precisar selecionar um por um.
              </p>
              <p className="text-xs text-green-600">
                ✅ Muito mais rápido • ✅ Perfeito para campanhas • ✅ Funciona com qualquer filtro
              </p>
            </div>

            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-1">💡 Filtros em Páginas Estáticas</h5>
              <p className="text-xs text-blue-700">
                Todos os filtros aplicados são automaticamente capturados e salvos junto com a página estática, 
                permitindo recriar catálogos específicos baseados nos mesmos critérios de filtragem.
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Iframe com a página original */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-gray-600">Carregando página {currentPage}...</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={pageUrls[currentPage]}
              className="w-full h-screen border-0"
              onLoad={() => setIframeLoaded(true)}
              title={`Página ${currentPage} - Marketing Mode`}
            />
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketingPDF;