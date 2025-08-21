import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { extractPropertyIdFromUrl } from "@/utils/slugUtils";
import { SocialBar } from "@/components/SocialBar";
import { Header } from "@/components/Header";
import { CookieBar } from "@/components/CookieBar";
import { MainPropertyDetail } from "@/components/property-detail/MainPropertyDetail";
import { Newsletter } from "@/components/Newsletter";
import { TestimonialsSection } from "@/components/testimonials";
import { NewsletterSignup } from "@/components/newsletter2/NewsletterSignup";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SimilarPropertiesSection } from "@/components/SimilarPropertiesSection";
import OpportunityPopup from "@/components/OpportunityPopup";
import { executeWhatsAppAction, initializeWhatsAppScript } from "@/utils/whatsappScript";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

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
  area_displayable?: string;
  parkingSpots?: string;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
  tipo_propriedade?: string;
  quartos?: number;
  banheiros?: number;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para controlar os modais
  const [showOpportunityPopup, setShowOpportunityPopup] = useState(false);
  
  // Extrai ID da URL (compatível com formato antigo e novo)
  const propertyId = id || extractPropertyIdFromUrl(location.pathname);

  // Função para fechar o popup de oportunidades
  const closeOpportunityPopup = () => {
    setShowOpportunityPopup(false);
  };

  // Carregar script do WhatsApp automaticamente e configurar GTM
  useEffect(() => {
    initializeWhatsAppScript();
    
    // Adicionar Google Tag Manager script no head se ainda não existir
    if (!document.querySelector('script[src*="gtm.js"]')) {
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PKRHXGM');`;
      document.head.insertBefore(gtmScript, document.head.firstChild);
    }

    // Adicionar noscript do Google Tag Manager no body se ainda não existir
    if (!document.querySelector('noscript iframe[src*="googletagmanager.com"]')) {
      const noscriptElement = document.createElement('noscript');
      noscriptElement.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PKRHXGM" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      document.body.insertBefore(noscriptElement, document.body.firstChild);
    }
  }, []);

  // Mostrar popup de oportunidades quando a página carregar
  useEffect(() => {
    // Verificar se o popup já foi exibido na sessão atual com timestamp
    const popupData = sessionStorage.getItem('opportunity-popup-shown');
    const currentTime = Date.now();
    
    // Se não existe ou expirou (opcional: adicionar expiração de sessão)
    if (!popupData) {
      const timer = setTimeout(() => {
        setShowOpportunityPopup(true);
        sessionStorage.setItem('opportunity-popup-shown', JSON.stringify({
          shown: true,
          timestamp: currentTime
        }));
      }, 3000); // Mostrar após 3 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  // Função para formatar datas no padrão brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // Extrair apenas a parte da data (YYYY-MM-DD) antes do "T" para evitar problemas de timezone
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      
      // Criar data local sem conversão de timezone
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('leiloes_imoveis')
          .select('*')
          .eq('id', Number(propertyId))
          .single();
          
        if (error) throw error;
        
        setProperty(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do imóvel:', err);
        setError('Não foi possível carregar os detalhes do imóvel.');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SocialBar />
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="h-32 bg-gray-300 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <SocialBar />
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Imóvel não encontrado</h1>
          <p className="text-lg mb-8 text-gray-700">{error || "O imóvel solicitado não está disponível."}</p>
          <a href="/" className="bg-[#d68e08] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  const formattedProperty = {
    id: property.id,
    title: `Leilão ${[
      property.tipo_propriedade || 'Imóvel',
      property.bairro,
      property.cidade,
      property.estado
    ].filter(Boolean).join(' - ')}`,
    address: property.endereco,
    location: `${property.bairro}, ${property.cidade}/${property.estado}`,
    description: property.descricao || "",
    area: property.area_displayable || "",
    bedrooms: property.quartos || 0,
    bathrooms: property.banheiros || 0,
    parkingSpots: property.parkingSpots || "0",
    image: property.imagem,
    firstAuctionDate: formatDateToBrazilian(property.data_leilao_1),
    firstAuctionValue: property.leilao_1,
    // Se não houver data do segundo leilão, usar a data do primeiro leilão
    secondAuctionDate: formatDateToBrazilian(property.data_leilao_2 || property.data_leilao_1),
    // Se não houver valor do segundo leilão, usar o valor do primeiro leilão
    secondAuctionValue: property.leilao_2 || property.leilao_1,
    auctionType: property.tipo_leilao || "Extrajudicial",
    fgts: property.fgts || false,
    financiamento: property.financiamento || false,
    propertyType: property.tipo_propriedade || "Imóvel",
    parcelamento: property.parcelamento || false
  };

  return (
    <div className="min-h-screen bg-white">
      <SocialBar onWhatsAppClick={() => executeWhatsAppAction()} />
      <Header onContactClick={() => executeWhatsAppAction()} />
      
      <div className="w-full">
        <main className="container mx-auto px-4 py-8 pb-0 mb-0">
          <MainPropertyDetail 
            property={formattedProperty} 
            rawPropertyData={property}
            onContactClick={() => executeWhatsAppAction()}
          />
        </main>
        
        <SimilarPropertiesSection 
          currentPropertyId={property.id}
          propertyType={property.tipo_propriedade}
          city={property.cidade}
          neighborhood={property.bairro}
          auctionType={property.tipo_leilao}
          onContactClick={() => executeWhatsAppAction()}
        />
        
        <NewsletterSignup />
        
        <TestimonialsSection />
      </div>
      <Newsletter onWhatsAppClick={() => executeWhatsAppAction()} />
      <Footer onWhatsAppClick={() => executeWhatsAppAction()} />
      
      <CookieBar />
      
      {/* Floating Buttons */}
      <div className="fixed bottom-2 sm:bottom-4 right-[80px] sm:right-[110px] z-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-end">
        <Button 
          className="bg-primary hover:bg-primary/90 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2"
          onClick={() => setShowOpportunityPopup(true)}
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Inscreva-se para oportunidades</span>
          <span className="sm:hidden">Oportunidades</span>
        </Button>
        
        <Button 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-gray-100 border border-gray-200 hidden"
          onClick={() => executeWhatsAppAction()}
        >
          <WhatsAppIcon />
        </Button>
      </div>

      {/* Popup de Oportunidades */}
      <OpportunityPopup 
        isOpen={showOpportunityPopup} 
        onClose={closeOpportunityPopup} 
      />


    </div>
  );
};

export default PropertyDetail;
