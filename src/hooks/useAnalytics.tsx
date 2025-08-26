import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Função para gerar um ID de sessão único
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Função para obter o IP do visitante (simulado - em produção você usaria um serviço)
const getVisitorIP = async (): Promise<string> => {
  try {
    // Em um ambiente real, você usaria um serviço como ipify ou similar
    // Para desenvolvimento, vamos simular um IP
    return `192.168.1.${Math.floor(Math.random() * 255)}`;
  } catch {
    return 'unknown';
  }
};

// Hook para tracking de visitas diárias
export const useDailyVisitTracker = () => {
  const hasTracked = useRef(false);

  useEffect(() => {
    const trackDailyVisit = async () => {
      if (hasTracked.current) return;

      try {
        // Verifica se já foi registrado hoje por este visitante
        const sessionKey = `daily_visit_${new Date().toDateString()}`;
        const hasVisitedToday = localStorage.getItem(sessionKey);

        if (!hasVisitedToday) {
          // Registra a visita
          try {
            const { error } = await supabase.rpc('increment_daily_visit');
            
            if (!error) {
              localStorage.setItem(sessionKey, 'true');
              hasTracked.current = true;
            } else {
              console.warn('Erro ao chamar increment_daily_visit:', error);
            }
          } catch (rpcError) {
            console.warn('RPC increment_daily_visit não encontrada:', rpcError);
          }
        }
      } catch (error) {
        console.warn('Erro ao registrar visita diária:', error);
      }
    };

    trackDailyVisit();
  }, []);
};

// Hook para tracking de visualizações de propriedades
export const usePropertyViewTracker = (propertyId: number | null) => {
  const sessionId = useRef(generateSessionId());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!propertyId) return;

    const trackPropertyView = async () => {
      try {
        const visitorIP = await getVisitorIP();
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || null;

        const { error } = await supabase.from('property_views').insert({
          property_id: propertyId,
          visitor_ip: visitorIP,
          user_agent: userAgent,
          referrer,
          session_id: sessionId.current
        });

        if (error) {
          console.warn('Erro ao inserir property_view:', error);
        }
      } catch (error) {
        console.warn('Erro ao registrar visualização da propriedade:', error);
      }
    };

    trackPropertyView();

    // Função para atualizar o tempo gasto na página ao sair
    const updateTimeSpent = async () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      
      try {
        await supabase
          .from('property_views')
          .update({ time_spent_seconds: timeSpent })
          .eq('session_id', sessionId.current)
          .eq('property_id', propertyId);
      } catch (error) {
        console.warn('Erro ao atualizar tempo gasto:', error);
      }
    };

    // Atualizar tempo gasto quando o usuário sair da página
    const handleBeforeUnload = () => {
      updateTimeSpent();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateTimeSpent();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updateTimeSpent();
    };
  }, [propertyId]);
};

// Hook para tracking de pesquisas
export const useSearchTracker = () => {
  const sessionId = useRef(generateSessionId());

  const trackSearch = async (
    searchQuery: string | null,
    filters: Record<string, any>,
    resultsCount: number,
    clickedPropertyId?: number
  ) => {
    try {
      const visitorIP = await getVisitorIP();

      await supabase.from('search_analytics').insert({
        session_id: sessionId.current,
        visitor_ip: visitorIP,
        search_query: searchQuery,
        filters_used: filters,
        results_count: resultsCount,
        clicked_property_id: clickedPropertyId || null
      });
    } catch (error) {
      console.warn('Erro ao registrar pesquisa:', error);
    }
  };

  return { trackSearch };
};

// Hook para tracking de leads/contatos
export const useContactTracker = () => {
  const trackContact = async (
    propertyId: number | null,
    name: string,
    email: string,
    phone: string,
    message: string,
    contactMethod: 'whatsapp' | 'email' | 'phone',
    utmParams?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    }
  ) => {
    try {
      await supabase.from('contact_leads').insert({
        property_id: propertyId,
        name,
        email,
        phone,
        message,
        contact_method: contactMethod,
        utm_source: utmParams?.utm_source || null,
        utm_medium: utmParams?.utm_medium || null,
        utm_campaign: utmParams?.utm_campaign || null
      });
    } catch (error) {
      console.warn('Erro ao registrar contato:', error);
    }
  };

  return { trackContact };
};

// Hook principal que combina todos os trackers
export const useAnalytics = (propertyId?: number | null) => {
  const { trackSearch } = useSearchTracker();
  const { trackContact } = useContactTracker();

  // Tracking automático de visitas diárias
  useDailyVisitTracker();

  // Tracking automático de visualizações de propriedades (se propertyId for fornecido)
  usePropertyViewTracker(propertyId || null);

  return {
    trackSearch,
    trackContact
  };
};
