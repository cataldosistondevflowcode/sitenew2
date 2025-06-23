import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SocialBar } from "@/components/SocialBar";
import { Header } from "@/components/Header";
import { CookieBar } from "@/components/CookieBar";
import { MainPropertyDetail } from "@/components/property-detail/MainPropertyDetail";
import { Newsletter } from "@/components/Newsletter";
import { TestimonialsSection } from "@/components/testimonials";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SimilarPropertiesSection } from "@/components/SimilarPropertiesSection";

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
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .eq('id', Number(id))
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

    if (id) {
      fetchProperty();
    }
  }, [id]);

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
    title: property.titulo_propriedade,
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
    secondAuctionDate: formatDateToBrazilian(property.data_leilao_2),
    secondAuctionValue: property.leilao_2,
    auctionType: property.tipo_leilao || "Extrajudicial",
    fgts: property.fgts || false,
    financiamento: property.financiamento || false,
    propertyType: property.tipo_propriedade || "Imóvel",
    parcelamento: property.parcelamento || false
  };

  return (
    <div className="min-h-screen bg-white">
      <SocialBar />
      <Header />
      
      <div className="w-full">
        <main className="container mx-auto px-4 py-8 pb-0 mb-0">
          <MainPropertyDetail 
            property={formattedProperty} 
            rawPropertyData={property}
          />
        </main>
        
        <NewsletterSignup />
        
        <SimilarPropertiesSection 
          currentPropertyId={property.id}
          propertyType={property.tipo_propriedade}
          city={property.cidade}
          neighborhood={property.bairro}
          auctionType={property.tipo_leilao}
        />
        
        <TestimonialsSection />
      </div>
      <Newsletter />
      <Footer />
      
      <CookieBar />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
