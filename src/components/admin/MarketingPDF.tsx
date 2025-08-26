import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  EyeOff
} from 'lucide-react';
import { formatCurrency } from '@/utils/stringUtils';
import { toast } from 'sonner';

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

const MarketingPDF = () => {
  // Estado para controlar qual página está sendo exibida
  const [currentPage, setCurrentPage] = useState<'RJ' | 'SP'>('RJ');
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // URLs das páginas originais
  const pageUrls = {
    RJ: '/',
    SP: '/leilao-sp'
  };

  useEffect(() => {
    setIframeLoaded(false);
    setSelectedProperties([]);
  }, [currentPage]);

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

      // Injetar JavaScript para capturar cliques (apenas uma vez)
      if (!iframeDoc.querySelector('#marketing-script')) {
        const script = iframeDoc.createElement('script');
        script.id = 'marketing-script';
        script.textContent = `
          (function() {
            // Array para rastrear IDs selecionados localmente
            window.marketingSelectedIds = window.marketingSelectedIds || [];
            
            function updateCardSelection(propertyId, isSelected) {
              const cards = document.querySelectorAll('[href*="/imovel/' + propertyId + '"]');
              cards.forEach(card => {
                if (isSelected) {
                  card.classList.add('selected');
                } else {
                  card.classList.remove('selected');
                }
              });
            }
            
            function handlePropertyCardClick(event) {
              event.preventDefault();
              event.stopPropagation();
              
              let target = event.target;
              let card = target.closest('[href*="/imovel/"]');
              
              if (card) {
                const href = card.getAttribute('href');
                const match = href.match(/\\/imovel\\/(\\d+)/);
                if (match) {
                  const propertyId = parseInt(match[1]);
                  
                  // Toggle no array local
                  const index = window.marketingSelectedIds.indexOf(propertyId);
                  const isSelected = index === -1;
                  
                  if (isSelected) {
                    window.marketingSelectedIds.push(propertyId);
                  } else {
                    window.marketingSelectedIds.splice(index, 1);
                  }
                  
                  // Atualizar visual
                  updateCardSelection(propertyId, isSelected);
                  
                  // Enviar mensagem para o componente pai
                  parent.postMessage({
                    type: 'PROPERTY_CARD_CLICK',
                    propertyId: propertyId,
                    isSelected: isSelected
                  }, '*');
                }
              }
            }
            
            // Adicionar listeners a todos os cards existentes
            function addListenersToCards() {
              document.querySelectorAll('[href*="/imovel/"]').forEach(card => {
                card.removeEventListener('click', handlePropertyCardClick);
                card.addEventListener('click', handlePropertyCardClick);
              });
            }
            
            addListenersToCards();
            
            // Observer para novos cards
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                  if (node.nodeType === 1) {
                    const newCards = node.querySelectorAll('[href*="/imovel/"]');
                    if (newCards.length > 0) {
                      addListenersToCards();
                    }
                  }
                });
              });
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });

            // Escutar mensagens do componente pai para sincronizar seleções
            window.addEventListener('message', function(event) {
              if (event.data.type === 'UPDATE_SELECTIONS') {
                window.marketingSelectedIds = event.data.selectedIds;
                
                // Atualizar visual de todos os cards
                document.querySelectorAll('[href*="/imovel/"]').forEach(card => {
                  const href = card.getAttribute('href');
                  const match = href.match(/\\/imovel\\/(\\d+)/);
                  if (match) {
                    const propertyId = parseInt(match[1]);
                    const isSelected = window.marketingSelectedIds.includes(propertyId);
                    updateCardSelection(propertyId, isSelected);
                  }
                });
              }
            });
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

  const handleSelectProperty = (propertyId: number) => {
    setSelectedProperties(prev => {
      const newSelection = prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      // Sincronizar com o iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_SELECTIONS',
          selectedIds: newSelection
        }, '*');
      }
      
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
      
      // Sincronizar com o iframe
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_SELECTIONS',
          selectedIds: newSelection
        }, '*');
      }
      
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      toast.error('Erro ao selecionar todas as propriedades');
    }
  };

  const generatePDF = async () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecione pelo menos um imóvel para gerar o PDF');
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
          .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 3rem 2rem; text-align: center; }
          .header h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
          .header p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .stats { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 12px; margin-top: 2rem; }
          .container { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; }
          .property-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
          .property-card { border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); break-inside: avoid; background: white; }
          .property-image { width: 100%; height: 300px; object-fit: cover; background: #f3f4f6; }
          .property-content { padding: 2rem; }
          .property-title { font-size: 1.35rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937; line-height: 1.3; }
          .property-location { color: #6b7280; margin-bottom: 1.5rem; font-size: 1rem; }
          .property-price { font-size: 1.75rem; font-weight: 700; color: #dc2626; margin-bottom: 1.5rem; }
          .property-details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
          .detail-item { font-size: 0.95rem; color: #4b5563; }
          .detail-label { font-weight: 600; color: #374151; margin-bottom: 0.25rem; }
          .property-features { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
          .feature-badge { background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
          .property-description { color: #6b7280; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #f3f4f6; padding-top: 1.5rem; }
          .footer { margin-top: 4rem; padding: 3rem 2rem; background: #f9fafb; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .footer h3 { color: #1f2937; margin-bottom: 1rem; font-size: 1.5rem; }
          .badge { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
          .badge-judicial { background: #dcfce7; color: #166534; }
          .badge-extrajudicial { background: #fef3c7; color: #92400e; }
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
            ${selectedPropertiesData.map(property => `
              <div class="property-card">
                ${property.imagem ? 
                  `<img src="${property.imagem}" alt="${property.titulo_propriedade}" class="property-image" />` :
                  `<div class="property-image" style="display: flex; align-items: center; justify-content: center; background: #f3f4f6; color: #9ca3af; font-size: 1.1rem;">📷 Imagem não disponível</div>`
                }
                <div class="property-content">
                  <h3 class="property-title">${property.titulo_propriedade || 'Título não informado'}</h3>
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
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="footer">
          <h3>${pageTitle}</h3>
          <p>Este catálogo foi gerado automaticamente pelo sistema de gestão de marketing</p>
          <p>Para mais informações sobre os imóveis, visite nosso site ou entre em contato conosco</p>
          <p><strong>Data de geração:</strong> ${date} | <strong>Total de imóveis:</strong> ${selectedPropertiesData.length}</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
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

              <Button
                onClick={generatePDF}
                disabled={selectedProperties.length === 0 || generating}
                className="flex items-center gap-2"
              >
                {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {generating ? 'Gerando PDF...' : 'Gerar PDF'}
              </Button>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Como usar:</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Escolha a página (RJ ou SP) que deseja usar</li>
              <li>2. Clique em "Ativar Seleção" para entrar no modo de seleção</li>
              <li>3. Use os filtros normais da página para encontrar imóveis</li>
              <li>4. Clique nos cards dos imóveis para selecioná-los (aparecerá um ✓ azul)</li>
              <li>5. Clique em "Gerar PDF" para criar o catálogo com os imóveis selecionados</li>
            </ol>
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
  );
};

export default MarketingPDF;