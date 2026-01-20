/**
 * Utilitário para integração com RD Station
 * 
 * Este módulo fornece funções para rastrear eventos e interações
 * que devem ser enviadas para o RD Station.
 * 
 * IMPORTANTE: Algumas configurações específicas (como token, identificador da conta)
 * precisam ser fornecidas pelo cliente e configuradas via variáveis de ambiente.
 */

// Tipos de eventos que podem ser rastreados
export type RDStationEventType =
  | 'page_view'
  | 'form_submit'
  | 'cta_click'
  | 'property_view'
  | 'property_click'
  | 'filter_applied'
  | 'search_performed'
  | 'whatsapp_click'
  | 'contact_click';

// Interface para dados de evento
export interface RDStationEvent {
  event_type: RDStationEventType;
  event_name: string;
  event_data?: Record<string, any>;
  page_url?: string;
  page_title?: string;
}

/**
 * Verifica se o RD Station está carregado e disponível
 */
export const isRDStationLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).RdIntegration !== 'undefined';
};

/**
 * Aguarda o RD Station carregar (com timeout)
 */
export const waitForRDStation = (timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRDStationLoaded()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isRDStationLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Rastreia um evento no RD Station
 * 
 * @param event - Dados do evento a ser rastreado
 */
export const trackRDStationEvent = async (event: RDStationEvent): Promise<void> => {
  try {
    // Aguardar RD Station carregar
    const loaded = await waitForRDStation();
    
    if (!loaded) {
      console.warn('RD Station não carregado. Evento não rastreado:', event);
      return;
    }

    // Preparar dados do evento
    const eventData = {
      event_type: event.event_type,
      event_name: event.event_name,
      ...(event.event_data || {}),
      page_url: event.page_url || window.location.href,
      page_title: event.page_title || document.title,
      timestamp: new Date().toISOString(),
    };

    // Enviar evento para RD Station
    // NOTA: A API exata do RD Station pode variar. Esta é uma implementação genérica.
    // O cliente deve fornecer a documentação específica da API do RD Station.
    if (typeof (window as any).RdIntegration !== 'undefined') {
      (window as any).RdIntegration.track(eventData);
    } else if (typeof (window as any).rdt !== 'undefined') {
      // Alternativa: API do RD Station via rdt
      (window as any).rdt('send', 'event', event.event_name, eventData);
    } else {
      console.warn('RD Station API não encontrada. Evento:', event);
    }

    // Log para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log('📊 RD Station Event:', event);
    }
  } catch (error) {
    console.error('Erro ao rastrear evento RD Station:', error);
  }
};

/**
 * Rastreia visualização de página
 */
export const trackPageView = (pageName?: string, additionalData?: Record<string, any>): void => {
  trackRDStationEvent({
    event_type: 'page_view',
    event_name: pageName || 'Page View',
    event_data: {
      page_name: pageName || document.title,
      ...additionalData,
    },
  });
};

/**
 * Rastreia submissão de formulário
 */
export const trackFormSubmit = (
  formName: string,
  formData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'form_submit',
    event_name: `Form Submit: ${formName}`,
    event_data: {
      form_name: formName,
      ...formData,
    },
  });
};

/**
 * Rastreia clique em CTA (Call to Action)
 */
export const trackCTAClick = (
  ctaName: string,
  ctaLocation?: string,
  additionalData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'cta_click',
    event_name: `CTA Click: ${ctaName}`,
    event_data: {
      cta_name: ctaName,
      cta_location: ctaLocation || 'unknown',
      ...additionalData,
    },
  });
};

/**
 * Rastreia visualização de imóvel
 */
export const trackPropertyView = (
  propertyId: string | number,
  propertyData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'property_view',
    event_name: `Property View: ${propertyId}`,
    event_data: {
      property_id: propertyId,
      ...propertyData,
    },
  });
};

/**
 * Rastreia clique em imóvel
 */
export const trackPropertyClick = (
  propertyId: string | number,
  propertyData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'property_click',
    event_name: `Property Click: ${propertyId}`,
    event_data: {
      property_id: propertyId,
      ...propertyData,
    },
  });
};

/**
 * Rastreia aplicação de filtro
 */
export const trackFilterApplied = (
  filterType: string,
  filterValue: string,
  additionalData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'filter_applied',
    event_name: `Filter Applied: ${filterType}`,
    event_data: {
      filter_type: filterType,
      filter_value: filterValue,
      ...additionalData,
    },
  });
};

/**
 * Rastreia busca/perquisa realizada
 */
export const trackSearch = (
  searchQuery: string,
  resultsCount?: number,
  additionalData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'search_performed',
    event_name: 'Search Performed',
    event_data: {
      search_query: searchQuery,
      results_count: resultsCount,
      ...additionalData,
    },
  });
};

/**
 * Rastreia clique no WhatsApp
 */
export const trackWhatsAppClick = (
  location?: string,
  additionalData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'whatsapp_click',
    event_name: 'WhatsApp Click',
    event_data: {
      location: location || 'unknown',
      ...additionalData,
    },
  });
};

/**
 * Rastreia clique em contato
 */
export const trackContactClick = (
  contactType: string,
  location?: string,
  additionalData?: Record<string, any>
): void => {
  trackRDStationEvent({
    event_type: 'contact_click',
    event_name: `Contact Click: ${contactType}`,
    event_data: {
      contact_type: contactType,
      location: location || 'unknown',
      ...additionalData,
    },
  });
};

/**
 * Inicializa o rastreamento automático de eventos comuns
 * 
 * Esta função deve ser chamada uma vez no início da aplicação
 */
export const initializeRDStationTracking = (): void => {
  // Rastrear visualização de página inicial
  if (typeof window !== 'undefined') {
    trackPageView(document.title);
    
    // Rastrear mudanças de rota (para SPAs)
    // Isso será feito via hook useLocation do React Router
  }
};
