import { CookieBar } from "@/components/CookieBar";
import { SocialBar } from "@/components/SocialBar";
import { Header } from "@/components/Header";
import { HeroSectionSP } from "@/components/HeroSectionSP";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyPagination } from "@/components/PropertyPagination";
import { FeaturedVideos } from "@/components/FeaturedVideos";
import { SuccessCases } from "@/components/SuccessCases";
import { ArticlesSection } from "@/components/articles";
import { VideoPlayerContainer } from "@/components/video";
import { TestimonialsSection } from "@/components/testimonials";
import { NewsletterBottomSection } from "@/components/NewsletterBottomSection";
import { Footer } from "@/components/Footer";
import OpportunityPopup from "@/components/OpportunityPopup";
import { Search, MessageCircle, Filter, X, MapPin, ChevronDown, Home, Building, Tractor, Trees, FileText, Globe, DollarSign, CalendarIcon, Car, SquareStack, Warehouse, Gavel, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFilterParams } from "@/hooks/useFilterParams";
import { flexibleSearch } from "@/utils/stringUtils";
import { executeWhatsAppAction, initializeWhatsAppScript } from "@/utils/whatsappScript";

// Interface para os dados dos imóveis
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
  area_displayable?: string; // Renomeado para evitar confusão com campo inexistente
  parkingSpots?: string;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
}

// Interface para os filtros
interface Filters {
  city?: string;
  type?: string;
  neighborhood?: string;
  location?: string;
  keyword?: string;
  hasSecondAuction?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
  auctionType?: string; // Filtro para tipo de leilão (inclui EXTRAJUDICIAL_CUSTOM, EXTRAJUDICIAL_COMPOSTO para múltiplos tipos)
  financiamento?: boolean; // Filtro para leilão com financiamento
  fgts?: boolean; // Filtro para leilão que aceita FGTS
  parcelamento?: boolean; // Filtro para parcelamento
  neighborhoods?: string[]; // Para múltiplos bairros
  cities?: string[]; // Para múltiplas cidades
  dataFimSegundoLeilao?: string; // Data final do filtro de data de encerramento do segundo leilão
  zone?: string; // Para zonas (ex: "CENTRAL", "LESTE", etc.)
  zones?: string[]; // Para múltiplas zonas (ex: ["CENTRAL", "LESTE", "NORTE"])
}

// Interface para as faixas de preço
interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

// Interface para o tipo selecionado
interface SelectedType {
  label: string;
  icon: JSX.Element;
  originalValue?: string; // Valor original do tipo_propriedade
}

const ITEMS_PER_PAGE = 40;

// Definição dos bairros por zona de São Paulo (complementado)
const bairrosPorZonaSP: Record<string, string[]> = {
  'CENTRAL': [
    '12º Subd - Cambuci', 'Aclimação', 'Anhangabaú', 'Barra Funda', 'Bela Vista', 'Bom Retiro', 'Brás',
    'Cambuci', 'Centro', 'Conjunto Residencial José Bonifácio', 'Consolação', 'Glicério',
    'Higienópolis', 'Jardim Bela Vista', 'Jardim Bela Vista (Zona Norte)', 'Jardim Da Glória',
    'José Bonifácio', 'Largo Da Misericórdia', 'Liberdade', 'Luz', 'Mercado', 'Pacaembú', 'Paraíso',
    'Pari', 'Parque Dom Pedro I', 'Ponte Pequena', 'República',
    'Santa Cecília', 'Santa Ifigênia', 'Sé', 'Sé Bela Vista', 'Vila Bela Vista',
    'Vila Buarque', 'Vila Inglesa', 'Vila São José'
  ],
  'LESTE': [
    '3º Sub Penha Franca', 'Água Marinha', 'Água Rasa', 'Alto Da Mooca', 'Anália Franco', 'Aricanduva',
    'Austral', 'Bairro Dos Pereiras', 'Belém', 'Cangaiba', 'Carrão', 'Carrãozinho', 'Castro Alves', 'Catumbi',
    'Chácara California', 'Cidade Nova São Miguel', 'Cidade São Mateus', 'Cidade Tiradentes',
    'Corinthians-Itaquera', 'Distrito De Itaquera', 'Distrito São Miguel Paulista',
    'Engenheiro Goulart', 'Ermelino Matarazzo', 'Fazenda Aricanduva',
    'Guaianases', 'Iguaçu', 'Iguatemi', 'Itaim Paulista', 'Itaquera',
    'Jadim Helian', 'Jardim', 'Jardim Alto Alegre', 'Jardim Alto Alegre (São Rafael)',
    'Jardim América Da Penha', 'Jardim Anália Franco', 'Jardim Aricanduva', 'Jardim Arpoador', 'Jardim Aurora',
    'Jardim Cibele', 'Jardim Claudia', 'Jardim Colorado', 'Jardim Da Casa Pintada', 'Jardim Danfer',
    'Jardim Das Oliveiras', 'Jardim Do Divino', 'Jardim Gianeti', 'Jardim Helena', 'Jardim Independência',
    'Jardim Iva', 'Jardim Juazeiro', 'Jardim Lajeado', 'Jardim Marabá', 'Jardim Melunas', 'Jardim Nélia',
    'Jardim Nossa Senhora Do Carmo', 'Jardim Nove De Julho', 'Jardim Robru', 'Jardim Romano',
    'Jardim Santa Terezinha', 'Jardim Santo Antônio', 'Jardim Textil', 'Jardim Tietê', 'Jardim Verônia',
    'Lajeado', 'Mooca', 'Mooca Baixa', 'Mooca Água Rasa',
    'Parada XV De Novembro', 'Parque Boturussu', 'Parque Da Mooca', 'Parque Guarani', 'Parque Mooca', 'Parque Moóca',
    'Parque Paulistano', 'Parque São Jorge', 'Parque São Lourenço', 'Parque São Lucas', 'Parque São Rafael',
    'Parque Savoi City', 'Passagem Funda', 'Patriarca', 'Penha', 'Penha De França', 'Ponte Rasa',
    'Quarta Parada', 'Sapopemba', 'São Lucas', 'São Mateus', 'São Matheus', 'São Miguel Paulista', 'São Rafael',
    'Sítio Da Figueira', 'Tatuapé', 'Usp Leste',
    'Vila Alpina', 'Vila Alto Pedroso', 'Vila Antonieta', 'Vila Araguaia', 'Vila Aricanduva', 'Vila Bela',
    'Vila Carmosina', 'Vila Carolina', 'Vila Celeste', 'Vila Chabilândia', 'Vila Conceição', 'Vila Constança',
    'Vila Cosmopolita', 'Vila Curuça', 'Vila Dalila', 'Vila Do Encontro', 'Vila Formosa', 'Vila Guarani',
    'Vila Independência', 'Vila Itaim', 'Vila Jacui', 'Vila Jurema', 'Vila Libanesa', 'Vila Lourdes',
    'Vila Matilde', 'Vila Mesquita', 'Vila Monte Santo', 'Vila Nhocunhé', 'Vila Norma', 'Vila Nova Curuça',
    'Vila Nova Manchester', 'Vila Nova Savoia', 'Vila Paranaguá', 'Vila Plana', 'Vila Progresso',
    'Vila Prudente', 'Vila Ré', 'Vila Regente Feijó', 'Vila Rosaria', 'Vila Santa Clara', 'Vila Santa Cruz',
    'Vila Santa Isabel', 'Vila Santana', 'Vila São Silvestre', 'Vila Silva Teles', 'Vila Sílvia',
    'Vila Talarico', 'Vila Tolstói', 'Vila Zéfira', 'Vila Zéphyr'
  ],
  'NORTE': [
    '36ª Subd Vila Maria', 'Alto De Santana', 'América', 'Anhanguera', 'Anhembi', 'Barro Branco',
    'Brasilândia', 'Cachoeirinha', 'Cantareira', 'Carandiru', 'Casa Verde', 'Chora Menino', 'City América',
    'Corisco', 'Freguesia Do Ó', 'Furnas', 'Guapira', 'Horto Florestal', 'Itaberaba',
    'Jardim', 'Jardim Anhanguera', 'Jardim Britania', 'Jardim Dayse', 'Jardim França', 'Jardim Guapira',
    'Jardim Japão', 'Jardim Jaraguá', 'Jardim Kioto', 'Jardim Paraíso', 'Jardim Peri Peri',
    'Jardim Recanto Verde', 'Jardim São Bento', 'Jardim Tremembé', 'Jardim Vista Alegre', 'Jaçanã',
    'Lausane Paulista', 'Lauzane', 'Lauzane Paulista', 'Limão', 'Loteamento City Jaraguá',
    'Loteamento Vista Verde', 'Mandaqui', 'Morro Grande', 'Parque Anhembi', 'Parque Mandaqui',
    'Parque Peruche', 'Parque Vitória', 'Pedra Branca', 'Perus', 'Piqueri', 'Pirituba',
    'Santa Terezinha', 'Santana', 'São Domingos', 'Sítio Do Mandaqui', 'Sítio Mandaqui', 'Tucuruvi',
    'Vila Albertina', 'Vila Aurora', 'Vila Cachoeira', 'Vila Clarice', 'Vila Constança', 'Vila Dom Pedro II',
    'Vila Ede', 'Vila Edi', 'Vila Guilherme', 'Vila Gustavo', 'Vila João Batista', 'Vila Mafra',
    'Vila Mangalot', 'Vila Maria', 'Vila Maria Alta', 'Vila Maria Baixa', 'Vila Mazzei', 'Vila Medeiros',
    'Vila Nina', 'Vila Nova Cachoeirinha', 'Vila Nova Parada', 'Vila Penteado', 'Vila Pirituba',
    'Vila Primavera', 'Vila Rica', 'Vila Sabrina', 'Vila Santa Maria', 'Vila Santa Teresinha',
    'Vila Santana', 'Vila Santos', 'Vila Siqueira', 'Vila Zatt', 'Vista Alegre'
  ],
  'OESTE': [
    '13º Distrito Butantã', 'Alto De Pinheiros', 'Butantã', 'Caxingui', 'Ceasa', 'Cerqueira César',
    'Chácara Maria Trindade', 'Educandário', 'Fazenda Morumbi', 'Ferreira', 'Itaim Bibi',
    'Jardim Bonfiglioli', 'Jardim Colombo', 'Jardim D´Abril', 'Jardim Das Vertentes', 'Jardim Esmeralda',
    'Jardim Ester Yolanda', 'Jardim Gilda Maria', 'Jardim Iris', 'Jardim Leonor', 'Jardim Leopoldina',
    'Jardim Londrina', 'Jardim Parque Morumbi', 'Jardim Santo Elias', 'Jardim Sarah', 'Jardim Vera Cruz',
    'Jardim Vitória Régia', 'Lapa', 'Lapa De Baixo', 'Paineiras Do Morumbi', 'Parque Anhanguera',
    'Parque Cisper', 'Parque Continental', 'Parque Da Lapa', 'Parque Das Flores', 'Parque Nações Unidas',
    'Paulista', 'Perdizes', 'Pinheiros', 'Pompeia', 'Raposo Tavares', 'Real Parque', 'Subdistrito Butantã',
    'Sumaré', 'Vila Anastácia', 'Vila Brasilina', 'Vila Buenos Aires', 'Vila Guedes', 'Vila Hamburguesa',
    'Vila Jaguara', 'Vila Lajeado', 'Vila Leopoldina', 'Vila Madalena', 'Vila Morse', 'Vila Piauí',
    'Vila Pinheiros', 'Vila Pirajussara', 'Vila Pompeia', 'Vila Remédios', 'Vila Romana', 'Vila Suzana'
  ],
  'SUL': [
    'Alto Da Boa Vista', 'Barragem', 'Bela Marajoara', 'Boi Mirim', 'Brooklin', 'Brooklin Paulista',
    'Campo Grande', 'Campo Limpo', 'Capela', 'Capela Do Socorro', 'Capão Redondo', 'Centro Empresarial',
    'Chácara Flora', 'Chácara Inglesa', 'Chácara Klabin', 'Chácara Santa Maria', 'Chácara São João',
    'Cidade Dutra', 'Embura', 'Engenho Velho', 'Estância Mirim', 'Grajaú', 'Guarapiranga', 'Hileópolis',
    'Ibirapuera', 'Interlagos', 'Ipiranga', 'Jabaquara', 'Jardim Amália', 'Jardim Ana Rosa', 'Jardim Ângela',
    'Jardim Caravelas', 'Jardim Celeste', 'Jardim Dos Lagos', 'Jardim Edda', 'Jardim Edi', 'Jardim Glória',
    'Jardim Helga', 'Jardim Ingá', 'Jardim Itapura', 'Jardim Leme', 'Jardim Leonidas Moreira',
    'Jardim Macedônia', 'Jardim Maria Duarte', 'Jardim Maria Estela', 'Jardim Mirante', 'Jardim Monte Azul',
    'Jardim Palmares', 'Jardim Patente', 'Jardim Roschel', 'Jardim Santa Cruz', 'Jardim Santo Amaro',
    'Jardim São Luis', 'Jardim Sonia Ingá', 'Jardim Thomas', 'Jardim Umarizal', 'Jardim Vergueiro', 'Jardins',
    "M'Boi Mirim", 'Marsilac', 'Moema', 'Moinho Velho', 'Morumbi', 'Nova Alexandria', 'Parelheiros',
    'Parque Arariba', 'Parque Cocaia', 'Parque Esmeralda', 'Parque Fongaro', 'Parque Grajaú',
    'Parque Independência', 'Parque Rebouças', 'Piraporinha', 'Planalto Paulista', 'Sacomã', 'Santo Amaro',
    'Saúde', 'Socorro', 'São Francisco', 'São João', 'São João Clímaco', 'Valo Velho', 'Vargem Grande',
    'Veleiros', 'Vila Carioca', 'Vila Da Saúde', 'Vila Das Mercês', 'Vila Firmiano Pinto', 'Vila Guaraní',
    'Vila Gumercindo', 'Vila Isa', 'Vila Joaniza', 'Vila Lúcia', 'Vila Mariana', 'Vila Mercês',
    'Vila Moinho Velho', 'Vila Morumbi', 'Vila Natália', 'Vila Olímpia', 'Vila Parque Jabaquara',
    'Vila Prel', 'Vila Santa Catarina', 'Vila Sofía', 'Vila Sta Catarina', 'Vila Vera'
  ]
};


const AUCTION_TYPE_JUDICIAL = "JUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL = "EXTRAJUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO = "EXTRAJUDICIAL FINANCIÁVEL";

const LeilaoSP = () => {
  // Hook para gerenciar filtros na URL
  const { parseFiltersFromURL, updateURL, clearFiltersFromURL } = useFilterParams();

  // Estados para os imóveis e paginação
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Estados para controlar os dropdowns
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showNeighborhoodMenu, setShowNeighborhoodMenu] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);
  const [showAuctionTypeMenu, setShowAuctionTypeMenu] = useState(false);
  
  // Estados para armazenar as seleções
  const [selectedType, setSelectedType] = useState<SelectedType>({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
  const [selectedCity, setSelectedCity] = useState("São Paulo");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Selecione o bairro");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>({ label: "Todos os preços" });
  const [selectedAuctionType, setSelectedAuctionType] = useState("Todos os tipos de leilão");
  
  // Estado para filtrar imóveis com segundo leilão
  const [filterSecondAuction, setFilterSecondAuction] = useState(false);

  // Estado para armazenar os filtros de busca
  const [filters, setFilters] = useState<Filters>({});
  
  // Estado para armazenar a lista de cidades do RJ
  const [rjCities, setRjCities] = useState<{city: string, count: number}[]>([]);
  
  // Estado para armazenar a lista de bairros do RJ
  const [rjNeighborhoods, setRjNeighborhoods] = useState<{neighborhood: string, count: number}[]>([]);

  // Configurar título da página e metadados para SP
  useEffect(() => {
    document.title = "Imóveis em Leilão SP | Cataldo Siston";
    
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
    
    // Atualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Leilão de imóveis em SP e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }
    
    // Atualizar Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Imóveis em Leilão SP | Cataldo Siston');
    }
    
    // Atualizar Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Leilão de imóveis em SP e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }
    
    // Atualizar Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Imóveis em Leilão SP | Cataldo Siston');
    }
    
    // Atualizar Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Leilão de imóveis em SP e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }
  }, []);
  
  // Estado para armazenar a cidade selecionada sem a contagem entre parênteses
  const [selectedCityName, setSelectedCityName] = useState<string>("São Paulo");
  
  // Estado para armazenar os tipos de propriedade
  const [propertyTypes, setPropertyTypes] = useState<{type: string, count: number}[]>([]);
  
  // Estado para armazenar os valores dos inputs
  const [locationInput, setLocationInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Adicionar novo estado para bairros selecionados (pode ser 1 bairro ou vários de uma zona)
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);

  // Novos estados para múltipla seleção
  const [selectedTypes, setSelectedTypes] = useState<SelectedType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedAuctionTypes, setSelectedAuctionTypes] = useState<string[]>([]);

  // Faixas de preço disponíveis
  const priceRanges: PriceRange[] = [
    { label: "Todos os preços" },
    { label: 'Até 300 mil', max: 300000 },
    { label: 'De 301 a 500 mil', min: 301000, max: 500000 },
    { label: 'De 501 a 700 mil', min: 501000, max: 700000 },
    { label: 'De 700 a 1 milhão', min: 700000, max: 1000000 },
    { label: 'De 1 a 1,5 milhão', min: 1000000, max: 1500000 },
    { label: 'De 1,5 a 2 milhões', min: 1500000, max: 2000000 },
    { label: 'Mais de 2 milhões', min: 2000001 }
  ];

  // Novo estado para controlar o menu de regiões de cidades
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Novo estado para armazenar cidades selecionadas (pode ser uma ou todas de uma região)
  const [selectedCities, setSelectedCities] = useState<string[]>(["São Paulo"]);

  // Estados para busca nos dropdowns
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");

  // Estado para filtro de data de encerramento do segundo leilão
  const [dataFimSegundoLeilao, setDataFimSegundoLeilao] = useState("");

  // Estado para controlar o popup de oportunidades
  const [showOpportunityPopup, setShowOpportunityPopup] = useState(false);

  // Função para aplicar filtros
  const applyFilters = useCallback(() => {
    const newFilters: Filters = {};
    
    // Verificar se há cidade selecionada
    if (selectedCities.length > 0 && selectedCities[0] !== "TODO_SP_STATE") {
      newFilters.city = selectedCities.join(','); // Passa como string separada por vírgula
      newFilters.cities = selectedCities; // Para URL params
    } else if (selectedCity && selectedCity !== "Selecione a cidade" && selectedCity !== "Todas cidades de SP") {
      // Compatibilidade: se só uma cidade foi selecionada pelo modo antigo
      const cityName = selectedCity.split(" (")[0];
      newFilters.city = cityName;
    }
    // Se for "Todas cidades de SP" (TODO_SP_STATE), não aplicar filtro de cidade - apenas o estado='SP' já presente na query
    
    // Verificar se há tipo selecionado - usar múltipla seleção se disponível
    if (selectedTypes.length > 0) {
      // Usar múltiplos tipos
      const typeValues = selectedTypes.map(type => type.originalValue || type.label.split(" (")[0]);
      newFilters.type = typeValues.join(',');
    } else if (selectedType && selectedType.label !== "Todos os imóveis" && !selectedType.label.includes("tipos selecionados")) {
      // Compatibilidade: se só um tipo foi selecionado pelo modo antigo
      newFilters.type = selectedType.originalValue || selectedType.label.split(" (")[0];
    }
    
    // Verificar se há zona selecionada (prioridade sobre bairros individuais)
    const isZoneSelected = selectedNeighborhood && (selectedNeighborhood.includes(" (todos)") || selectedNeighborhood === "Toda São Paulo");
    if (isZoneSelected) {
      if (selectedNeighborhood === "Toda São Paulo") {
        newFilters.zone = "TODA_SP";
      } else {
        // Extrair o nome da zona
        const zoneName = selectedNeighborhood.replace(" (todos)", "");
        newFilters.zone = zoneName;
      }
    } else if (selectedNeighborhoods.length > 0) {
      // Verificar se os bairros selecionados pertencem a zonas completas
      const selectedZones: string[] = [];
      const remainingBairros: string[] = [];
      
      // Primeiro, verificar quais zonas de SP estão completas
      for (const [zoneName, zoneBairros] of Object.entries(bairrosPorZonaSP)) {
        const allZoneBairrosSelected = zoneBairros.every(zoneBairro => selectedNeighborhoods.includes(zoneBairro));
        if (allZoneBairrosSelected && zoneBairros.length > 0) {
          selectedZones.push(zoneName);
        }
      }
      
      // Verificar se são todos os bairros de SP
      if (selectedZones.length === 0) {
        const todosBairrosSP = Object.values(bairrosPorZonaSP).flat();
        const allSelectedInSP = selectedNeighborhoods.every(bairro => todosBairrosSP.includes(bairro));
        if (allSelectedInSP && selectedNeighborhoods.length === todosBairrosSP.length) {
          selectedZones.push("TODA_SP");
        }
      }
      
      // Depois, identificar bairros que não pertencem a zonas completas
      for (const bairro of selectedNeighborhoods) {
        let belongsToCompleteZone = false;
        
        // Verificar zonas de SP
        for (const [zoneName, zoneBairros] of Object.entries(bairrosPorZonaSP)) {
          if (zoneBairros.includes(bairro) && selectedZones.includes(zoneName)) {
            belongsToCompleteZone = true;
            break;
          }
        }
        
        // Verificar se é toda SP
        if (!belongsToCompleteZone && selectedZones.includes("TODA_SP")) {
          const todosBairrosSP = Object.values(bairrosPorZonaSP).flat();
          if (todosBairrosSP.includes(bairro)) {
            belongsToCompleteZone = true;
          }
        }
        
        if (!belongsToCompleteZone) {
          remainingBairros.push(bairro);
        }
      }
      
      if (selectedZones.length > 0) {
        if (selectedZones.length === 1) {
          // Se é apenas uma zona, usar o parâmetro zone
          newFilters.zone = selectedZones[0];
        } else {
          // Se são múltiplas zonas, usar o parâmetro zones
          newFilters.zones = selectedZones;
        }
        
        // Se há bairros que não pertencem a zonas completas, adicionar como bairros individuais
        if (remainingBairros.length > 0) {
          newFilters.neighborhood = remainingBairros.join(',');
          newFilters.neighborhoods = remainingBairros;
        }
      } else {
        // Caso contrário, usar os bairros individuais
        newFilters.neighborhood = selectedNeighborhoods.join(',');
        newFilters.neighborhoods = selectedNeighborhoods;
      }
    } else if (selectedNeighborhood && selectedNeighborhood !== "Selecione o bairro") {
      // Compatibilidade: se só um bairro foi selecionado pelo modo antigo
      const neighborhoodName = selectedNeighborhood.split(" (")[0];
      newFilters.neighborhood = neighborhoodName;
    }
    
    // Verificar se há valor no input de localização
    if (locationInput) {
      newFilters.location = locationInput;
    }
    
    // Verificar se há valor no input de palavra-chave
    if (keywordInput) {
      newFilters.keyword = keywordInput;
    }
    
    // Adicionar filtro de segundo leilão
    if (filterSecondAuction) {
      newFilters.hasSecondAuction = true;
    }
    
    // Adicionar filtro de faixa de preço - usar múltipla seleção se disponível
    if (selectedPriceRanges.length > 0) {
      // Para múltiplas faixas, usar o mínimo do menor e máximo do maior
      // Se alguma faixa não tem min (como "Até 300k"), considerar min como 0
      const allMins = selectedPriceRanges.map(range => range.min ?? 0);
      const allMaxs = selectedPriceRanges.filter(range => range.max !== undefined).map(range => range.max!);
      
      newFilters.priceRange = {
        min: Math.min(...allMins),
        max: allMaxs.length > 0 ? Math.max(...allMaxs) : undefined
      };
    } else if (selectedPriceRange && selectedPriceRange.label !== "Todos os preços" && !selectedPriceRange.label.includes("faixas selecionadas")) {
      // Compatibilidade: se só uma faixa foi selecionada pelo modo antigo
      newFilters.priceRange = {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max
      };
    }
    
    // Adicionar filtro de tipo de leilão - usar múltipla seleção se disponível
    if (selectedAuctionTypes.length > 0) {
      // Para múltiplas modalidades, vamos definir uma lógica específica
      let hasJudicial = selectedAuctionTypes.includes(AUCTION_TYPE_JUDICIAL);
      let hasExtrajudicial = selectedAuctionTypes.includes(AUCTION_TYPE_EXTRAJUDICIAL);
      let hasExtrajudicialFinanciamento = selectedAuctionTypes.includes(AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO);
      
      // NOVA LÓGICA: Permitir múltiplos tipos de leilão
      if (hasJudicial && (hasExtrajudicial || hasExtrajudicialFinanciamento)) {
        // Se tem judicial E extrajudicial, não filtrar por tipo específico (mostrar todos)
        // Mas se só tem extrajudicial com financiamento, aplicar esse filtro
        if (hasExtrajudicialFinanciamento && !hasExtrajudicial) {
          newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
          newFilters.financiamento = true;
        }
      } else if (hasExtrajudicial && hasExtrajudicialFinanciamento) {
        // NOVO: Se tem EXTRAJUDICIAL E EXTRAJUDICIAL FINANCIÁVEL, usar filtro composto
        newFilters.auctionType = "EXTRAJUDICIAL_COMPOSTO";
        newFilters.financiamento = undefined; // Será tratado na query
      } else if (hasJudicial) {
        newFilters.auctionType = "Judicial";
      } else if (hasExtrajudicialFinanciamento) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
        newFilters.financiamento = true;
      } else if (hasExtrajudicial) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
      }
    } else if (selectedAuctionType && selectedAuctionType !== "Todos os tipos de leilão" && !selectedAuctionType.includes("modalidades selecionadas")) {
      // Compatibilidade: se só uma modalidade foi selecionada pelo modo antigo
      if (selectedAuctionType === AUCTION_TYPE_JUDICIAL) {
        newFilters.auctionType = "Judicial";
      } else if (selectedAuctionType === AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
        newFilters.financiamento = true;
      } else if (selectedAuctionType === AUCTION_TYPE_EXTRAJUDICIAL) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
      }
    }

    // Adicionar filtro de data de encerramento do segundo leilão
    if (dataFimSegundoLeilao) {
      newFilters.dataFimSegundoLeilao = dataFimSegundoLeilao;
    }
    
    // Adicionar múltiplas faixas de preço selecionadas para persistir na URL
    if (selectedPriceRanges.length > 0) {
      newFilters.priceRanges = selectedPriceRanges.map(range => range.label);
    }
    
    // Aplicar filtros
    setFilters(newFilters);
    
    // Resetar para a primeira página quando aplicar filtros
    setCurrentPage(1);
    
    // Atualizar URL com os filtros aplicados (usar setTimeout para evitar loops)
    setTimeout(() => {
      updateURL(newFilters);
    }, 0);
    
    // Notificação de filtro aplicado
    toast.success('Filtros aplicados com sucesso!');
    
    // Se estiver no mobile, fechar o painel de filtros
    if (isMobile) {
      setIsFilterOpen(false);
    }
  }, [selectedCities, selectedCity, selectedTypes, selectedType, selectedNeighborhoods, selectedNeighborhood, locationInput, keywordInput, filterSecondAuction, selectedPriceRanges, selectedPriceRange, selectedAuctionTypes, selectedAuctionType, dataFimSegundoLeilao, isMobile]);

  // Função para fechar o popup de oportunidades
  const closeOpportunityPopup = () => {
    setShowOpportunityPopup(false);
    // Não remover o sessionStorage para evitar que o popup apareça novamente na mesma sessão
  };

  // Adicionar estados e função para o modal de interesse
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestName, setInterestName] = useState("");
  const [interestPhone, setInterestPhone] = useState("");
  const [interestEmail, setInterestEmail] = useState("");



  // Carregar script do WhatsApp automaticamente
  useEffect(() => {
    initializeWhatsAppScript();
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

  // Carregar filtros da URL quando a página carrega
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    if (Object.keys(urlFilters).length > 0) {
      // Sincronizar estados visuais com os filtros da URL
      if (urlFilters.city) {
        const cities = urlFilters.city.split(',');
        if (cities.length > 1) {
          setSelectedCities(cities);
          setSelectedCity(`${cities.length} cidades selecionadas`);
        } else {
          setSelectedCity(cities[0]);
          setSelectedCityName(cities[0]);
        }
      }
      
      if (urlFilters.type) {
        const types = urlFilters.type.split(',');
        if (types.length > 1) {
          const typeObjects = types.map(type => ({ 
            label: type, 
            icon: <Home className="h-4 w-4" />,
            originalValue: type 
          }));
          setSelectedTypes(typeObjects);
          setSelectedType({ label: `${types.length} tipos selecionados`, icon: <Home className="h-4 w-4" /> });
        } else {
          setSelectedType({ label: types[0], icon: <Home className="h-4 w-4" />, originalValue: types[0] });
        }
      }
      
      if (urlFilters.zones && urlFilters.zones.length > 0) {
        // Se há múltiplas zonas na URL, carregar todos os bairros das zonas
        let todosBairrosDasZonas: string[] = [];
        for (const zona of urlFilters.zones) {
          let bairrosDaZona: string[] = [];
          
          if (zona === "TODA_SP") {
            // Se é toda São Paulo, usar todos os bairros de todas as zonas
            bairrosDaZona = Object.values(bairrosPorZonaSP).flat();
          } else if (bairrosPorZonaSP[zona]) {
            // Se é uma zona específica
            bairrosDaZona = bairrosPorZonaSP[zona];
          }
          
          todosBairrosDasZonas = [...todosBairrosDasZonas, ...bairrosDaZona];
        }
        setSelectedNeighborhoods(todosBairrosDasZonas);
        setSelectedNeighborhood(`${urlFilters.zones.length} zonas selecionadas`);
      } else if (urlFilters.zone) {
        // Se há uma zona na URL, carregar todos os bairros da zona
        let bairrosDaZona: string[] = [];
        
        if (urlFilters.zone === "TODA_SP") {
          // Se é toda São Paulo, usar todos os bairros de todas as zonas
          bairrosDaZona = Object.values(bairrosPorZonaSP).flat();
          setSelectedNeighborhood("Toda São Paulo");
        } else if (bairrosPorZonaSP[urlFilters.zone]) {
          // Se é uma zona específica
          bairrosDaZona = bairrosPorZonaSP[urlFilters.zone];
          setSelectedNeighborhood(`${urlFilters.zone} (todos)`);
        }
        
        if (bairrosDaZona.length > 0) {
          setSelectedNeighborhoods(bairrosDaZona);
        }
      } else if (urlFilters.neighborhood) {
        const neighborhoods = urlFilters.neighborhood.split(',');
        if (neighborhoods.length > 1) {
          setSelectedNeighborhoods(neighborhoods);
          setSelectedNeighborhood(`${neighborhoods.length} bairros selecionados`);
        } else {
          setSelectedNeighborhood(neighborhoods[0]);
        }
      }
      
      // Inicializar múltiplas faixas de preço se existirem na URL
      if (urlFilters.priceRanges && urlFilters.priceRanges.length > 0) {
        const rangeObjects: PriceRange[] = [];
        urlFilters.priceRanges.forEach(rangeLabel => {
          const matchedRange = priceRanges.find(r => r.label === rangeLabel);
          if (matchedRange) {
            rangeObjects.push(matchedRange);
          }
        });
        if (rangeObjects.length > 0) {
          setSelectedPriceRanges(rangeObjects);
          if (rangeObjects.length === 1) {
            setSelectedPriceRange(rangeObjects[0]);
          } else {
            setSelectedPriceRange({ label: `${rangeObjects.length} faixas selecionadas` });
          }
        }
      } else if (urlFilters.priceRange) {
        // Fallback para compatibilidade com URLs antigas de range único
        const range = urlFilters.priceRange;
        const matchedRange = priceRanges.find(r => r.min === range.min && r.max === range.max);
        if (matchedRange) {
          setSelectedPriceRange(matchedRange);
          setSelectedPriceRanges([matchedRange]);
        } else {
          // Criar faixa personalizada se não encontrou correspondência exata
          const customRange: PriceRange = {
            label: range.min && range.max 
              ? `R$ ${(range.min / 1000).toFixed(0)}k a R$ ${(range.max / 1000).toFixed(0)}k`
              : range.min 
                ? `Acima de R$ ${(range.min / 1000).toFixed(0)}k`
                : range.max 
                  ? `Até R$ ${(range.max / 1000).toFixed(0)}k`
                  : "Faixa personalizada",
            min: range.min,
            max: range.max
          };
          setSelectedPriceRange(customRange);
          setSelectedPriceRanges([customRange]);
        }
      }
      
      if (urlFilters.location) {
        setLocationInput(urlFilters.location);
      }
      
      if (urlFilters.keyword) {
        setKeywordInput(urlFilters.keyword);
      }
      
      if (urlFilters.hasSecondAuction) {
        setFilterSecondAuction(true);
      }
      
      if (urlFilters.auctionType) {
        setSelectedAuctionType(urlFilters.auctionType);
        
        // Converter auctionType da URL para selectedAuctionTypes
        if (urlFilters.auctionType === "EXTRAJUDICIAL_COMPOSTO") {
          // Se é EXTRAJUDICIAL_COMPOSTO, significa que ambos EXTRAJUDICIAL e EXTRAJUDICIAL_FINANCIAMENTO foram selecionados
          // IGNORAR o parâmetro financiamento da URL neste caso
          setSelectedAuctionTypes([AUCTION_TYPE_EXTRAJUDICIAL, AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO]);
        } else if (urlFilters.auctionType === "EXTRAJUDICIAL_CUSTOM") {
          // Se é EXTRAJUDICIAL_CUSTOM, verificar se tem financiamento
          if (urlFilters.financiamento === true) {
            setSelectedAuctionTypes([AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO]);
          } else {
            setSelectedAuctionTypes([AUCTION_TYPE_EXTRAJUDICIAL]);
          }
        } else if (urlFilters.auctionType === "Judicial") {
          setSelectedAuctionTypes([AUCTION_TYPE_JUDICIAL]);
        }
      }
      
      if (urlFilters.dataFimSegundoLeilao) {
        setDataFimSegundoLeilao(urlFilters.dataFimSegundoLeilao);
      }
      
      // Aplicar os filtros vindos da URL APÓS toda a lógica de conversão
      // Se for EXTRAJUDICIAL_COMPOSTO, remover o financiamento dos filtros
      if (urlFilters.auctionType === "EXTRAJUDICIAL_COMPOSTO") {
        const correctedFilters = { ...urlFilters, financiamento: undefined };
        setFilters(correctedFilters);
      } else {
        setFilters(urlFilters);
      }
    }
    setFiltersLoaded(true);
  }, []);

  // Função para buscar cidades de SP
  const fetchSpCities = async () => {
    try {
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('cidade')
        .eq('estado', 'SP')
        .gte('leilao_1', 75000) // Filtro obrigatório: valor mínimo de R$ 75.000
        .not('cidade', 'is', null);
      
      if (error) throw error;
      
      // Contar ocorrências de cada cidade
      const cityCount: Record<string, number> = {};
      data.forEach(item => {
        if (item.cidade && item.cidade.trim() !== '') {
          cityCount[item.cidade] = (cityCount[item.cidade] || 0) + 1;
        }
      });
      
      // Converter para array e ordenar
      let citiesArray = Object.keys(cityCount)
        .map(city => ({
          city,
          count: cityCount[city]
        }))
        .sort((a, b) => a.city.localeCompare(b.city, 'pt-BR'));
      
      // Garantir que Jaú esteja na lista (adicionar manualmente se não estiver)
      const jauExists = citiesArray.some(city => city.city === 'Jaú');
      if (!jauExists) {
        citiesArray.push({ city: 'Jaú', count: 18 });
        citiesArray = citiesArray.sort((a, b) => a.city.localeCompare(b.city, 'pt-BR'));
        console.log('✅ Jaú adicionada manualmente à lista de cidades');
      } else {
        console.log('✅ Jaú já estava na lista de cidades');
      }
      
      console.log(`Total de cidades de SP encontradas: ${citiesArray.length}`);
      setRjCities(citiesArray);
    } catch (err) {
      console.error('Erro ao buscar cidades de SP:', err);
    }
  };

  // Função para buscar bairros de uma cidade específica de SP
  const fetchNeighborhoodsByCity = async (cityName?: string) => {
    const targetCity = cityName || selectedCityName;

    if (!targetCity) {
      setRjNeighborhoods([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('bairro')
        .eq('estado', 'SP')
        .gte('leilao_1', 75000) // Filtro obrigatório: valor mínimo de R$ 75.000
        .eq('cidade', targetCity)
        .not('bairro', 'is', null);
      
      if (error) throw error;
      
      // Contar ocorrências de cada bairro
      const neighborhoodCount: Record<string, number> = {};
      data.forEach(item => {
        if (item.bairro && item.bairro.trim() !== '') {
          neighborhoodCount[item.bairro] = (neighborhoodCount[item.bairro] || 0) + 1;
        }
      });
      
      // Se for São Paulo capital, manter a estrutura por zonas para os bairros que conhecemos
      if (targetCity === 'São Paulo') {
        // Mostrar todos os bairros organizados por zona
        const bairrosAgrupados: Record<string, { neighborhood: string, count: number }[]> = {};
        
        // Primeiro, adicionar bairros conhecidos organizados por zona
        Object.keys(bairrosPorZonaSP).forEach(zona => {
          bairrosAgrupados[zona] = [];
          bairrosPorZonaSP[zona].forEach(bairro => {
            // Mostrar todos os bairros, independente de terem imóveis ou não
            bairrosAgrupados[zona].push({
              neighborhood: bairro,
              count: neighborhoodCount[bairro] || 0
            });
          });
        });
        
        // Lista de comunidades excluídas que não devem aparecer nos filtros
        const comunidadesExcluidas = [
          'CONJUNTO HABITACIONAL SANTA ETELVINA II',
          'JARDIM PEDRO JOSÉ NUNES',
          'JARDIM SÃO REMO',
          'PARAISÓPOLIS'
        ];

        // Adicionar bairros "Outros" que estão no banco mas não na lista fixa de zonas
        const bairrosOutros: { neighborhood: string, count: number }[] = [];
        Object.keys(neighborhoodCount).forEach(bairro => {
          // Verificar se o bairro está na lista de comunidades excluídas
          if (comunidadesExcluidas.some(exc => exc.toLowerCase() === bairro.toLowerCase())) {
            return; // Pular este bairro
          }

          let found = false;
          for (const zona in bairrosPorZonaSP) {
            if (bairrosPorZonaSP[zona].some(b => b.toLowerCase() === bairro.toLowerCase())) {
              found = true;
              break;
            }
          }
          if (!found) {
            bairrosOutros.push({ neighborhood: bairro, count: neighborhoodCount[bairro] });
          }
        });
        
        // Se houver bairros "outros", adicionar à estrutura
        if (bairrosOutros.length > 0) {
          bairrosAgrupados['Outros Bairros'] = bairrosOutros.sort((a, b) => 
            a.neighborhood.localeCompare(b.neighborhood, 'pt-BR')
          );
        }
        
        // Manter todas as zonas, mesmo se não tiverem imóveis
        // Object.keys(bairrosAgrupados).forEach(zona => {
        //   if (bairrosAgrupados[zona].length === 0) {
        //     delete bairrosAgrupados[zona];
        //   }
        // });
        
        setRjNeighborhoods(bairrosAgrupados as any);
      } else {
        // Para outras cidades, usar lista simples
        const neighborhoodsArray = Object.keys(neighborhoodCount)
          .map(neighborhood => ({
            neighborhood,
            count: neighborhoodCount[neighborhood]
          }))
          .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood, 'pt-BR'));
        
        setRjNeighborhoods(neighborhoodsArray as any);
      }
    } catch (err) {
      console.error(`Erro ao buscar bairros de ${targetCity}:`, err);
    }
  };

  // Inicializar dados
  useEffect(() => {
    
    // Buscar tipos de propriedade
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('leiloes_imoveis')
          .select('tipo_propriedade')
          .eq('estado', 'SP')
          .gte('leilao_1', 75000) // Filtro obrigatório: valor mínimo de R$ 75.000
          .not('tipo_propriedade', 'is', null);
          
        if (error) throw error;
        
        // Contagem de tipos distintos
        const typeCount: Record<string, number> = {};
        data.forEach(item => {
          if (item.tipo_propriedade && item.tipo_propriedade.trim() !== '') {
            typeCount[item.tipo_propriedade] = (typeCount[item.tipo_propriedade] || 0) + 1;
          }
        });
        
        // Converter para array para usar no dropdown
        const typesArray = Object.keys(typeCount)
          .map(type => ({
            type,
            count: typeCount[type]
          }))
          .sort((a, b) => a.type.localeCompare(b.type, 'pt-BR')); // Ordenar alfabeticamente
        
        console.log(`Total de tipos de propriedade encontrados: ${typesArray.length}`);
        setPropertyTypes(typesArray);
      } catch (err) {
        console.error('Erro ao buscar tipos de propriedade:', err);
      }
    };

    // Carregar cidades de SP, tipos de propriedade e bairros de São Paulo
    fetchSpCities();
    fetchPropertyTypes();
    fetchNeighborhoodsByCity('São Paulo'); // Carregar bairros de São Paulo por padrão
  }, []);

  // Carregar os imóveis do Supabase com filtros
  useEffect(() => {
    if (!filtersLoaded) return; // Aguarda os filtros serem carregados da URL
    
    const fetchProperties = async () => {
      setLoading(true);
      
      try {
        // Começar a consulta do Supabase
        let query = supabase
          .from('leiloes_imoveis')
          .select('*', { count: 'exact' })
          .eq('estado', 'SP')
          .gte('leilao_1', 75000); // Filtro obrigatório: valor mínimo de R$ 75.000
          
        // Adicionar filtros se existirem
        if (filters.city && filters.city !== "TODO_SP_STATE") {
          const cidades = filters.city.split(',').map(c => c.trim()).filter(Boolean);
          if (cidades.length > 1) {
            query = query.in('cidade', cidades);
          } else {
            query = query.eq('cidade', filters.city);
          }
        }
        // Se for "TODO_SP_STATE", não aplicar filtro de cidade (já está limitado a SP)
        
        if (filters.type && filters.type !== "Todos os imóveis") {
          // Verificar se são múltiplos tipos (separados por vírgula)
          const tipos = filters.type.split(',').map(t => t.trim()).filter(Boolean);
          if (tipos.length > 1) {
            // Filtro IN para múltiplos tipos
            query = query.in('tipo_propriedade', tipos);
          } else {
            // Usar diretamente o valor original do tipo_propriedade
            query = query.eq('tipo_propriedade', filters.type);
          }
        }
        
        if (filters.zones && filters.zones.length > 0) {
          // Se há múltiplas zonas selecionadas, expandir para todos os bairros das zonas
          let todosBairrosDasZonas: string[] = [];
          for (const zona of filters.zones) {
            let bairrosDaZona: string[] = [];
            
            if (zona === "TODA_SP") {
              // Se é toda São Paulo, usar todos os bairros de todas as zonas
              bairrosDaZona = Object.values(bairrosPorZonaSP).flat();
            } else if (bairrosPorZonaSP[zona]) {
              // Se é uma zona específica
              bairrosDaZona = bairrosPorZonaSP[zona];
            }
            
            todosBairrosDasZonas = [...todosBairrosDasZonas, ...bairrosDaZona];
          }
          if (todosBairrosDasZonas.length > 0) {
            query = query.in('bairro', todosBairrosDasZonas);
          }
        } else if (filters.zone) {
          // Se há uma zona selecionada, expandir para todos os bairros da zona
          let bairrosDaZona: string[] = [];
          
          if (filters.zone === "TODA_SP") {
            // Se é toda São Paulo, usar todos os bairros de todas as zonas
            bairrosDaZona = Object.values(bairrosPorZonaSP).flat();
          } else if (bairrosPorZonaSP[filters.zone]) {
            // Se é uma zona específica
            bairrosDaZona = bairrosPorZonaSP[filters.zone];
          }
          
          if (bairrosDaZona.length > 0) {
            query = query.in('bairro', bairrosDaZona);
          }
        } else if (filters.neighborhood) {
          // Se for múltiplos bairros (string separada por vírgula)
          const bairros = filters.neighborhood.split(',').map(b => b.trim()).filter(Boolean);
          if (bairros.length > 1) {
            // Filtro OR para múltiplos bairros
            query = query.in('bairro', bairros);
          } else {
            query = query.eq('bairro', filters.neighborhood);
          }
        }
        
        if (filters.location) {
          query = query.or(`endereco.ilike.%${filters.location}%,bairro.ilike.%${filters.location}%,cidade.ilike.%${filters.location}%`);
        }
        
        if (filters.keyword) {
          query = query.or(`titulo_propriedade.ilike.%${filters.keyword}%,descricao.ilike.%${filters.keyword}%`);
        }
        
        // Filtrar por imóveis que têm segundo leilão
        if (filters.hasSecondAuction) {
          query = query.not('data_leilao_2', 'is', null).not('leilao_2', 'is', null);
        }
        
        // Filtrar por faixa de preço (usando o campo leilao_1 para o valor mínimo)
        if (filters.priceRange) {
          if (filters.priceRange.min !== undefined) {
            query = query.gte('leilao_1', filters.priceRange.min);
          }
          if (filters.priceRange.max !== undefined) {
            query = query.lte('leilao_1', filters.priceRange.max);
          }
        }
        
        // Filtrar por tipo de leilão
        if (filters.auctionType) {
          if (filters.auctionType === "EXTRAJUDICIAL_CUSTOM") {
            // EXTRAJUDICIAL: tipo_leilao != "Judicial"
            query = query.neq('tipo_leilao', 'Judicial');
          } else if (filters.auctionType === "EXTRAJUDICIAL_COMPOSTO") {
            // NOVO: EXTRAJUDICIAL + EXTRAJUDICIAL FINANCIÁVEL
            // Mostrar todos os extrajudiciais (com ou sem financiamento)
            query = query.neq('tipo_leilao', 'Judicial');
          } else {
            query = query.eq('tipo_leilao', filters.auctionType);
          }
        }
        
        // Filtrar por financiamento (agora usado pelos badges específicos)
        if (filters.financiamento === true) {
          query = query.eq('financiamento', true);
        } else if (filters.financiamento === false) {
          query = query.eq('financiamento', false);
        }
        
        // Filtrar por FGTS (agora usado pelos badges específicos)
        if (filters.fgts === true) {
          query = query.eq('fgts', true);
        } else if (filters.fgts === false) {
          query = query.eq('fgts', false);
        }
        
        // Filtrar por parcelamento (usado pelos badges específicos)
        if (filters.parcelamento === true) {
          query = query.eq('parcelamento', true);
        } else if (filters.parcelamento === false) {
          query = query.eq('parcelamento', false);
        }

        // Filtrar por data de encerramento do segundo leilão
        if (filters.dataFimSegundoLeilao) {
          const filterDate = new Date(filters.dataFimSegundoLeilao);
          // Aplicar o filtro considerando tanto data_leilao_2 quanto data_leilao_1 como fallback
          query = query.or(`data_leilao_2.lte.${filterDate.toISOString()},and(data_leilao_2.is.null,data_leilao_1.lte.${filterDate.toISOString()})`);
        }
        
        // Obter a data atual para comparação no servidor
        const currentDateForFilter = new Date();
        
        let countQuery = query;
        
        // Adicionar filtro de data para considerar apenas leilões futuros
        // Considerar tanto 1º quanto 2º leilão - incluir se qualquer um for futuro ou nulo
        countQuery = countQuery.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()},data_leilao_2.gte.${currentDateForFilter.toISOString()}`);
        
        // Obter a contagem total para calcular o número de páginas
        const countResult = await countQuery;
        
        if (countResult.error) {
          throw countResult.error;
        }

        // Calcula total de páginas
        const total = countResult.count || 0;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

        // Busca a página atual
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        // Aplicar o mesmo filtro de data na query principal
        // Considerar tanto 1º quanto 2º leilão - incluir se qualquer um for futuro ou nulo
        query = query.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()},data_leilao_2.gte.${currentDateForFilter.toISOString()}`);

        const { data, error } = await query
          .range(from, to)
          .order('data_leilao_1', { ascending: true }); // Ordenar pela data do leilão (mais próxima primeiro)

        if (error) {
          throw error;
        }

        // Obter a data atual para comparação
        const currentDate = new Date();
        
        // Transforma os dados no formato esperado pelo PropertyCard
        const formattedProperties = data
          .map(item => {
            // Se não houver data para o primeiro leilão, adicionar 15 dias à frente
            let data_leilao_1_final = item.data_leilao_1;
            if (!item.data_leilao_1) {
              const futureDate = new Date();
              futureDate.setDate(futureDate.getDate() + 15);
              data_leilao_1_final = futureDate.toISOString();
            }
            
            // Se não houver segundo leilão, copia do primeiro
            const data_leilao_2 = item.data_leilao_2 || data_leilao_1_final;
            const leilao_2 = item.leilao_2 || item.leilao_1;

            return {
              id: item.id,
              titulo_propriedade: item.titulo_propriedade || `Leilão ${item.tipo_propriedade || 'Imóvel'} - ${item.cidade}/${item.estado}`,
              endereco: item.endereco || '',
              bairro: item.bairro || '',
              cidade: item.cidade || '',
              estado: item.estado || '',
              data_leilao_1: formatDate(data_leilao_1_final),
              data_leilao_2: formatDate(data_leilao_2),
              leilao_1: item.leilao_1 || 0,
              leilao_2: leilao_2 || 0,
              area_displayable: 'Área não informada', // Valor fixo já que o campo não existe
              imagem: item.imagem || 'https://kmiblhbe.manus.space/imovel_sao_goncalo.jpeg', // Imagem padrão caso não tenha
              descricao: item.descricao,
              data_leilao_1_original: data_leilao_1_final, // Guardar a data final para ordenação
              data_leilao_2_original: data_leilao_2, // Guardar a data do segundo leilão para filtro
              tipo_leilao: item.tipo_leilao,
              fgts: item.fgts,
              financiamento: item.financiamento,
              parcelamento: item.parcelamento
            };
          })
          // Ordenar no cliente para garantir a ordem correta
          .sort((a, b) => {
            // Se não tem data, colocar no final
            if (!a.data_leilao_1_original) return 1;
            if (!b.data_leilao_1_original) return -1;
            
            // Comparar as datas
            const dateA = new Date(a.data_leilao_1_original);
            const dateB = new Date(b.data_leilao_1_original);
            return dateA.getTime() - dateB.getTime();
          });

        setProperties(formattedProperties);
      } catch (err) {
        console.error('Erro ao buscar imóveis:', err);
        setError('Não foi possível carregar os imóveis. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, filters, filtersLoaded]);

  // Função para formatar datas
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      // Extrair apenas a parte da data (YYYY-MM-DD) antes do "T" para evitar problemas de timezone
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      
      // Criar data local sem conversão de timezone
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Erro ao formatar data:', e, 'Data recebida:', dateString);
      return '';
    }
  };

  // Função para formatar valores monetários
  const formatCurrency = (value?: number) => {
    if (!value && value !== 0) return '';
    
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };



  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Rolar para o topo da seção de imóveis
    document.querySelector('.opportunities')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Fechar menus ao clicar fora deles
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickInsideFilter = target.closest('.filter-dropdown');
      
      if (!isClickInsideFilter) {
        // Fechar todos os menus se o clique foi fora de qualquer filtro
        if (showTypeMenu || showCityMenu || showRegionMenu || showNeighborhoodMenu || showPriceMenu || showAuctionTypeMenu) {
          setShowTypeMenu(false);
          setShowCityMenu(false);
          setShowRegionMenu(false);
          setShowNeighborhoodMenu(false);
          setShowPriceMenu(false);
          setShowAuctionTypeMenu(false);
          setCitySearchTerm("");
          setNeighborhoodSearchTerm("");
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showTypeMenu, showCityMenu, showRegionMenu, showNeighborhoodMenu, showPriceMenu, showAuctionTypeMenu]);
  
  // Funções para manipular os menus
  const toggleTypeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTypeMenu(!showTypeMenu);
    setShowCityMenu(false);
    setShowRegionMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
  };
  
  const toggleCityMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCityMenu(!showCityMenu);
    setShowTypeMenu(false);
    setShowRegionMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
    if (showCityMenu) {
      setCitySearchTerm("");
    }
  };
  
  const toggleNeighborhoodMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNeighborhoodMenu(!showNeighborhoodMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowRegionMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
    if (showNeighborhoodMenu) {
      setNeighborhoodSearchTerm("");
    }
  };
  
  const togglePriceMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriceMenu(!showPriceMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowRegionMenu(false);
    setShowNeighborhoodMenu(false);
    setShowAuctionTypeMenu(false);
  };
  
  const toggleAuctionTypeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAuctionTypeMenu(!showAuctionTypeMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowRegionMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
  };
  
  const selectPropertyType = (label: string, icon: JSX.Element, originalValue?: string) => {
    setSelectedType({ label, icon, originalValue });
    setShowTypeMenu(false);
  };

  // Nova função para múltipla seleção de tipos
  const togglePropertyType = (label: string, icon: JSX.Element, originalValue?: string) => {
    const newType = { label, icon, originalValue };
    
    // Se é "Todos os imóveis", limpar todas as seleções
    if (label === "Todos os imóveis") {
      setSelectedTypes([]);
      setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
      return;
    }

    const typeExists = selectedTypes.some(type => type.label === label);
    
    if (typeExists) {
      // Remover o tipo se já existe
      const newTypes = selectedTypes.filter(type => type.label !== label);
      setSelectedTypes(newTypes);
      
      // Atualizar o display
      if (newTypes.length === 0) {
        setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
      } else if (newTypes.length === 1) {
        setSelectedType(newTypes[0]);
      } else {
        setSelectedType({ label: `${newTypes.length} tipos selecionados`, icon: <Globe className="h-4 w-4" /> });
      }
    } else {
      // Adicionar o novo tipo
      const newTypes = [...selectedTypes, newType];
      setSelectedTypes(newTypes);
      
      // Atualizar o display
      if (newTypes.length === 1) {
        setSelectedType(newTypes[0]);
      } else {
        setSelectedType({ label: `${newTypes.length} tipos selecionados`, icon: <Globe className="h-4 w-4" /> });
      }
    }
  };
  
  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedCityName(city);
    setSelectedCities([city]);
    setShowRegionMenu(false);
    setSelectedRegion(null);
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
    fetchNeighborhoodsByCity(city);
    setShowCityMenu(false);
  };

  // Nova função para múltipla seleção de cidades
  const toggleCity = (city: string) => {
    // Se é "Todas as cidades de SP", limpar todas as seleções
    if (city === "Todas cidades de SP" || city.includes("(todos)")) {
      setSelectedCities([]);
      setSelectedCity("Selecione a cidade");
      setSelectedCityName("");
      setSelectedNeighborhood("Selecione o bairro");
      setSelectedNeighborhoods([]);
      return;
    }

    const cityExists = selectedCities.includes(city);
    
    if (cityExists) {
      // Remover a cidade se já existe
      const newCities = selectedCities.filter(c => c !== city);
      setSelectedCities(newCities);
      
      // Atualizar o display
      if (newCities.length === 0) {
        setSelectedCity("Selecione a cidade");
        setSelectedCityName("");
      } else if (newCities.length === 1) {
        setSelectedCity(newCities[0]);
        setSelectedCityName(newCities[0]);
        fetchNeighborhoodsByCity(newCities[0]);
      } else {
        setSelectedCity(`${newCities.length} cidades selecionadas`);
        setSelectedCityName("MULTIPLE_CITIES");
      }
    } else {
      // Adicionar a nova cidade
      const newCities = [...selectedCities, city];
      setSelectedCities(newCities);
      
      // Atualizar o display
      if (newCities.length === 1) {
        setSelectedCity(newCities[0]);
        setSelectedCityName(newCities[0]);
        fetchNeighborhoodsByCity(newCities[0]);
      } else {
        setSelectedCity(`${newCities.length} cidades selecionadas`);
        setSelectedCityName("MULTIPLE_CITIES");
      }
    }
    
    // Limpar bairros quando múltiplas cidades são selecionadas
    if (selectedCities.length > 0) {
      setSelectedNeighborhood("Selecione o bairro");
      setSelectedNeighborhoods([]);
    }
  };
  
  const selectAllStateSP = () => {
    setSelectedCity("Todas cidades de SP");
    setSelectedCityName("TODO_SP_STATE"); // Valor especial para identificar que é todo o estado
    setSelectedCities(["TODO_SP_STATE"]);
    setShowRegionMenu(false);
    setSelectedRegion(null);
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
    setShowCityMenu(false);
  };
  
  const selectRegion = (region: string) => {
    // Para SP, não temos regiões múltiplas - sempre será São Paulo
    setSelectedCity("São Paulo");
    setSelectedCityName("São Paulo");
    setSelectedCities(["São Paulo"]);
    setShowRegionMenu(false);
    setSelectedRegion(null);
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
  };
  
  const selectNeighborhood = (neighborhood: string) => {
    // Para SP, comportamento normal para bairros individuais
    setSelectedNeighborhood(neighborhood);
    setSelectedNeighborhoods([neighborhood]);
    setShowNeighborhoodMenu(false);
  };

  // Nova função para múltipla seleção de bairros
  const toggleNeighborhood = (neighborhood: string) => {
    // Se é "Todos os bairros" ou zona, limpar todas as seleções
    if (neighborhood.includes("(todos)") || neighborhood === "Todos os bairros" || neighborhood === "Toda São Paulo") {
      setSelectedNeighborhoods([]);
      setSelectedNeighborhood("Selecione o bairro");
      return;
    }

    const neighborhoodExists = selectedNeighborhoods.includes(neighborhood);
    
    if (neighborhoodExists) {
      // Remover o bairro se já existe
      const newNeighborhoods = selectedNeighborhoods.filter(n => n !== neighborhood);
      setSelectedNeighborhoods(newNeighborhoods);
      
      // Atualizar o display
      if (newNeighborhoods.length === 0) {
        setSelectedNeighborhood("Selecione o bairro");
      } else if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(newNeighborhoods[0]);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    } else {
      // Verificar se é uma zona (para SP)
      let bairrosToAdd = [neighborhood];
      if (bairrosPorZonaSP[neighborhood]) {
        bairrosToAdd = bairrosPorZonaSP[neighborhood];
      }
      
      // Adicionar os novos bairros (removendo duplicatas)
      const newNeighborhoods = [...new Set([...selectedNeighborhoods, ...bairrosToAdd])];
      setSelectedNeighborhoods(newNeighborhoods);
      
      // Atualizar o display
      if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(newNeighborhoods[0]);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    }
  };

  // Nova função para múltipla seleção de zonas
  const toggleZone = (zone: string) => {
    const bairros = bairrosPorZonaSP[zone] || [];
    
    // Verificar se todos os bairros da zona já estão selecionados
    const allZoneBairrosSelected = bairros.every(bairro => selectedNeighborhoods.includes(bairro));
    
    if (allZoneBairrosSelected) {
      // Remover todos os bairros da zona
      const newNeighborhoods = selectedNeighborhoods.filter(n => !bairros.includes(n));
      setSelectedNeighborhoods(newNeighborhoods);
      
      // Atualizar o display
      if (newNeighborhoods.length === 0) {
        setSelectedNeighborhood("Selecione o bairro");
      } else if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(newNeighborhoods[0]);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    } else {
      // Adicionar todos os bairros da zona (removendo duplicatas)
      const newNeighborhoods = [...new Set([...selectedNeighborhoods, ...bairros])];
      setSelectedNeighborhoods(newNeighborhoods);
      
      // Atualizar o display
      if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(newNeighborhoods[0]);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    }
  };
  
  const selectZone = (zone: string) => {
    // Seleciona todos os bairros da zona
    const bairros = bairrosPorZonaSP[zone] || [];
    setSelectedNeighborhood(`${zone} (todos)`);
    setSelectedNeighborhoods(bairros);
    setShowNeighborhoodMenu(false);
    
    // Aplicar filtros imediatamente com a zona
    const newFilters: Filters = {
      zone: zone
    };
    
    // Manter outros filtros existentes
    if (selectedCities.length > 0) {
      newFilters.city = selectedCities.join(',');
      newFilters.cities = selectedCities;
    } else if (selectedCity && selectedCity !== "Selecione a cidade") {
      const cityName = selectedCity.split(" (")[0];
      newFilters.city = cityName;
    }
    
    if (selectedTypes.length > 0) {
      const typeValues = selectedTypes.map(type => type.originalValue || type.label.split(" (")[0]);
      newFilters.type = typeValues.join(',');
    } else if (selectedType && selectedType.label !== "Todos os imóveis" && !selectedType.label.includes("tipos selecionados")) {
      newFilters.type = selectedType.originalValue || selectedType.label.split(" (")[0];
    }
    
    if (locationInput) {
      newFilters.location = locationInput;
    }
    
    if (keywordInput) {
      newFilters.keyword = keywordInput;
    }
    
    if (filterSecondAuction) {
      newFilters.hasSecondAuction = true;
    }
    
    if (selectedPriceRange) {
      newFilters.priceRange = {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max
      };
    }
    
    if (filterFinanciamento) {
      newFilters.financiamento = true;
    }
    
    if (filterFGTS) {
      newFilters.fgts = true;
    }
    
    if (filterParcelamento) {
      newFilters.parcelamento = true;
    }
    
    updateURL(newFilters);
  };

  const selectAllSaoPaulo = () => {
    // Seleciona todos os bairros de todas as zonas de São Paulo
    const todosBairros = Object.values(bairrosPorZonaSP).flat();
    setSelectedNeighborhood("Toda São Paulo");
    setSelectedNeighborhoods(todosBairros);
    setShowNeighborhoodMenu(false);
    
    // Aplicar filtros imediatamente com a zona especial "TODA_SP"
    const newFilters: Filters = {
      zone: "TODA_SP"
    };
    
    // Manter outros filtros existentes
    if (selectedCities.length > 0) {
      newFilters.city = selectedCities.join(',');
      newFilters.cities = selectedCities;
    } else if (selectedCity && selectedCity !== "Selecione a cidade") {
      const cityName = selectedCity.split(" (")[0];
      newFilters.city = cityName;
    }
    
    if (selectedTypes.length > 0) {
      const typeValues = selectedTypes.map(type => type.originalValue || type.label.split(" (")[0]);
      newFilters.type = typeValues.join(',');
    } else if (selectedType && selectedType.label !== "Todos os imóveis" && !selectedType.label.includes("tipos selecionados")) {
      newFilters.type = selectedType.originalValue || selectedType.label.split(" (")[0];
    }
    
    if (locationInput) {
      newFilters.location = locationInput;
    }
    
    if (keywordInput) {
      newFilters.keyword = keywordInput;
    }
    
    if (filterSecondAuction) {
      newFilters.hasSecondAuction = true;
    }
    
    if (selectedPriceRange) {
      newFilters.priceRange = {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max
      };
    }
    
    if (filterFinanciamento) {
      newFilters.financiamento = true;
    }
    
    if (filterFGTS) {
      newFilters.fgts = true;
    }
    
    if (filterParcelamento) {
      newFilters.parcelamento = true;
    }
    
    updateURL(newFilters);
  };
  
  const selectPriceRange = (priceRange: PriceRange) => {
    setSelectedPriceRange(priceRange);
    setShowPriceMenu(false);
  };

  // Nova função para múltipla seleção de faixas de preço
  const togglePriceRange = (priceRange: PriceRange) => {
    // Se é "Todos os preços", limpar todas as seleções
    if (priceRange.label === "Todos os preços") {
      setSelectedPriceRanges([]);
      setSelectedPriceRange({ label: "Todos os preços" });
      return;
    }

    const rangeExists = selectedPriceRanges.some(range => range.label === priceRange.label);
    
    if (rangeExists) {
      // Remover a faixa se já existe
      const newRanges = selectedPriceRanges.filter(range => range.label !== priceRange.label);
      setSelectedPriceRanges(newRanges);
      
      // Atualizar o display
      if (newRanges.length === 0) {
        setSelectedPriceRange({ label: "Todos os preços" });
      } else if (newRanges.length === 1) {
        setSelectedPriceRange(newRanges[0]);
      } else {
        setSelectedPriceRange({ label: `${newRanges.length} faixas selecionadas` });
      }
    } else {
      // Adicionar a nova faixa
      const newRanges = [...selectedPriceRanges, priceRange];
      setSelectedPriceRanges(newRanges);
      
      // Atualizar o display
      if (newRanges.length === 1) {
        setSelectedPriceRange(newRanges[0]);
      } else {
        setSelectedPriceRange({ label: `${newRanges.length} faixas selecionadas` });
      }
    }
  };
  
  const selectAuctionType = (auctionType: string) => {
    setSelectedAuctionType(auctionType);
    setShowAuctionTypeMenu(false);
  };

  // Nova função para múltipla seleção de modalidades de leilão
  const toggleAuctionType = (auctionType: string) => {
    // Se é "Todos os tipos de leilão", limpar todas as seleções
    if (auctionType === "Todos os tipos de leilão") {
      setSelectedAuctionTypes([]);
      setSelectedAuctionType("Todos os tipos de leilão");
      return;
    }

    const typeExists = selectedAuctionTypes.includes(auctionType);
    
    if (typeExists) {
      // Remover o tipo se já existe
      const newTypes = selectedAuctionTypes.filter(type => type !== auctionType);
      setSelectedAuctionTypes(newTypes);
      
      // Atualizar o display
      if (newTypes.length === 0) {
        setSelectedAuctionType("Todos os tipos de leilão");
      } else if (newTypes.length === 1) {
        setSelectedAuctionType(newTypes[0]);
      } else {
        setSelectedAuctionType(`${newTypes.length} modalidades selecionadas`);
      }
    } else {
      // Adicionar o novo tipo
      const newTypes = [...selectedAuctionTypes, auctionType];
      setSelectedAuctionTypes(newTypes);
      
      // Atualizar o display
      if (newTypes.length === 1) {
        setSelectedAuctionType(newTypes[0]);
      } else {
        setSelectedAuctionType(`${newTypes.length} modalidades selecionadas`);
      }
        }
  };
  
  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
    setSelectedCity("Selecione a cidade");
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]); // Limpar array de bairros selecionados
    setSelectedPriceRange({ label: "Todos os preços" });
    setSelectedAuctionType("Todos os tipos de leilão");
    
    // Limpar os novos arrays de múltipla seleção
    setSelectedTypes([]);
    setSelectedPriceRanges([]);
    setSelectedAuctionTypes([]);
    
    setLocationInput("");
    setKeywordInput("");
    setFilterSecondAuction(false);
    setSelectedCityName("");
    setRjNeighborhoods([]);
    setSelectedCities([]);
    setDataFimSegundoLeilao(""); // Limpar data final
    
    // Limpar os filtros e atualizar a exibição
    setFilters({});
    setCurrentPage(1);
    
    // Limpar filtros da URL
    clearFiltersFromURL();
    
    // Notificação de filtros limpos
    toast.success('Filtros limpos com sucesso!');
  };

  // Adicionar função para o modal de interesse
  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInterestModal(false);
    setInterestName("");
    setInterestPhone("");
    setInterestEmail("");
    toast.success('Seus dados foram registrados! Entraremos em contato caso apareça um imóvel com esse perfil.');
  };





  return (
    <div className="min-h-screen bg-background">
      <CookieBar />
      <SocialBar onWhatsAppClick={() => executeWhatsAppAction()} />
              <Header onContactClick={() => executeWhatsAppAction()} />
              <HeroSectionSP onOpportunityClick={() => window.open('https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/', '_blank')} />
      
      {/* Properties Section - Movida para cima */}
      <section className="py-16 bg-background opportunities">
        <div className="container">
          {/* Filtros Container */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile Filter Button */}
            <div className="block md:hidden mb-4">
              <Button 
                className="w-full flex items-center justify-center bg-teal-900 hover:bg-teal-800 text-white py-3 text-base font-medium"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? (
                  <>
                    <X className="mr-2" size={18} /> Fechar Filtros
                  </>
                ) : (
                  <>
                    <Filter className="mr-2" size={18} /> Filtrar Imóveis
                  </>
                )}
              </Button>
            </div>

            {/* Filtros */}
            <div className={`${!isFilterOpen ? 'hidden md:block' : 'block'} bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md`}>
              {/* Primeira linha de selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                {/* Dropdown de Tipo de Imóvel */}
                <div className="filter-dropdown relative">
                  <div 
                    className="flex items-center justify-between w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md cursor-pointer text-sm"
                    onClick={toggleTypeMenu}
                  >
                    <div className="flex items-center">
                      {selectedType.icon}
                      <span className="ml-2">{selectedType.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  {showTypeMenu && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 py-2 max-h-[400px] overflow-y-auto">
                      <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-200">
                        Clique para selecionar/deselecionar (múltipla escolha)
                      </div>
                      <div 
                        className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePropertyType("Todos os imóveis", <Globe className="h-4 w-4" />, undefined);
                          }}
                      >
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Todos os imóveis</span>
                      </div>
                      
                      {/* Tipos de propriedade do banco de dados */}
                      {propertyTypes.map((typeData, index) => {
                        // Definir o ícone com base no tipo de propriedade
                        let icon;
                        const typeLC = typeData.type.toLowerCase();
                        
                        if (typeLC === 'apartamento' || typeLC === 'comercial' || typeLC === 'prédio' || typeLC === 'galpão') {
                          icon = <Building className="h-4 w-4 mr-2 text-gray-500" />;
                        } else if (typeLC === 'casa') {
                          icon = <Home className="h-4 w-4 mr-2 text-gray-500" />;
                        } else if (typeLC === 'terreno') {
                          icon = <Trees className="h-4 w-4 mr-2 text-gray-500" />;
                        } else if (typeLC === 'rural' || typeLC === 'fazenda' || typeLC === 'chácara') {
                          icon = <Tractor className="h-4 w-4 mr-2 text-gray-500" />;
                        } else if (typeLC === 'estacionamento') {
                          icon = <Car className="h-4 w-4 mr-2 text-gray-500" />;
                        } else if (typeLC === 'área') {
                          icon = <SquareStack className="h-4 w-4 mr-2 text-gray-500" />;
                        } else {
                          icon = <FileText className="h-4 w-4 mr-2 text-gray-500" />;
                        }
                        
                        // Formatar o nome do tipo para exibição
                        const formattedTypeName = typeData.type.charAt(0).toUpperCase() + typeData.type.slice(1).toLowerCase();
                        
                        // Verificar se este tipo está selecionado
                        const isSelected = selectedTypes.some(type => type.label === formattedTypeName);
                        
                        return (
                          <div 
                            key={index}
                            className={`px-4 py-2 flex items-center cursor-pointer ${
                              isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePropertyType(formattedTypeName, icon, typeData.type);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Controlled by parent onClick
                              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            {icon}
                            <span>{formattedTypeName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Dropdown de Cidades */}
                <div className="filter-dropdown relative">
                  <div 
                    className="flex items-center justify-between w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md cursor-pointer text-sm"
                    onClick={toggleCityMenu}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedCity}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  {showCityMenu && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-[400px] overflow-y-auto">
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">CIDADES DE SÃO PAULO</div>
                      <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-200">
                        Clique para selecionar/deselecionar (múltipla escolha)
                      </div>
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Procurar..."
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                                             {/* Opção para todo o estado */}
                       <div
                         className="py-2 px-4 hover:bg-blue-50 cursor-pointer font-semibold text-blue-700 border-b border-gray-100"
                         onClick={() => selectAllStateSP()}
                       >
                         Todas cidades de SP
                       </div>
                      {rjCities
                        .filter(cityData => 
                          citySearchTerm === '' || 
                          flexibleSearch(cityData.city, citySearchTerm)
                        )
                        .map((cityData, index) => {
                        const isSelected = selectedCities.includes(cityData.city);
                        return (
                          <div
                            key={index}
                            className={`py-2 px-4 flex items-center cursor-pointer ${
                              isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                            }`}
                                                          onClick={(e) => {
                                e.stopPropagation();
                                toggleCity(cityData.city);
                              }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Controlled by parent onClick
                              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            {cityData.city}
                          </div>
                        );
                      })}
                      {citySearchTerm !== '' && !rjCities.some(cityData => 
                        flexibleSearch(cityData.city, citySearchTerm)
                      ) && (
                        <div className="py-2 px-4 text-gray-500">Nenhuma cidade encontrada</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown de Bairros */}
                <div className="filter-dropdown relative">
                  <div 
                    className={`flex items-center justify-between w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md cursor-pointer text-sm ${!selectedCityName ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={selectedCityName ? toggleNeighborhoodMenu : undefined}
                  >
                    <span>{selectedNeighborhood}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  {showNeighborhoodMenu && selectedCityName && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-[400px] overflow-y-auto">
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">BAIRROS DE {selectedCityName.toUpperCase()}</div>
                      <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-200">
                        Clique para selecionar/deselecionar (múltipla escolha)
                      </div>
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Procurar..."
                          value={neighborhoodSearchTerm}
                          onChange={(e) => setNeighborhoodSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {selectedCityName.toLowerCase() === 'são paulo' ? (
                        <>
                          {/* Opção "Toda São Paulo" */}
                          {(neighborhoodSearchTerm === '' || 'toda são paulo'.includes(neighborhoodSearchTerm.toLowerCase())) && (
                            <div
                              className="py-2 px-4 font-bold text-white bg-[#d68e08] border-b border-gray-200 cursor-pointer hover:bg-[#b8780a]"
                              onClick={() => selectAllSaoPaulo()}
                            >
                              Toda São Paulo
                            </div>
                          )}
                          
                          {/* Zonas de São Paulo */}
                          {Object.keys(rjNeighborhoods)
                            .filter(zona => {
                              if (neighborhoodSearchTerm === '') return true;
                              return flexibleSearch(zona, neighborhoodSearchTerm) ||
                                rjNeighborhoods[zona].some((neighborhoodData: any) => 
                                  flexibleSearch(neighborhoodData.neighborhood, neighborhoodSearchTerm)
                                );
                            })
                            .map((zona) => (
                            <div key={zona}>
                              {(neighborhoodSearchTerm === '' || flexibleSearch(zona, neighborhoodSearchTerm)) && (
                                <div
                                  className="py-2 px-4 font-bold text-primary bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-yellow-100"
                                  onClick={(e) => {
                                  e.stopPropagation();
                                  toggleZone(zona);
                                }}
                                >
                                  {zona} (todos)
                                </div>
                              )}
                              {rjNeighborhoods[zona]
                                .filter((neighborhoodData: any) => 
                                  neighborhoodSearchTerm === '' || 
                                  flexibleSearch(neighborhoodData.neighborhood, neighborhoodSearchTerm)
                                )
                                .map((neighborhoodData: any, index: number) => {
                                  const isSelected = selectedNeighborhoods.includes(neighborhoodData.neighborhood);
                                  return (
                                    <div
                                      key={neighborhoodData.neighborhood}
                                      className={`py-2 px-4 flex items-center cursor-pointer ${
                                        isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                                      }`}
                                      onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNeighborhood(neighborhoodData.neighborhood);
                                  }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}} // Controlled by parent onClick
                                        className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                      />
                                      {neighborhoodData.neighborhood}
                                    </div>
                                  );
                                })}
                            </div>
                          ))}
                        </>
                      ) : (
                        rjNeighborhoods.length > 0 ? (
                          rjNeighborhoods
                            .filter((neighborhoodData: any) => 
                              neighborhoodSearchTerm === '' || 
                              flexibleSearch(neighborhoodData.neighborhood, neighborhoodSearchTerm)
                            )
                            .map((neighborhoodData: any, index: number) => {
                            const isSelected = selectedNeighborhoods.includes(neighborhoodData.neighborhood);
                            return (
                              <div
                                key={neighborhoodData.neighborhood}
                                className={`py-2 px-4 flex items-center cursor-pointer ${
                                  isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => toggleNeighborhood(neighborhoodData.neighborhood)}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // Controlled by parent onClick
                                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                {neighborhoodData.neighborhood}
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-2 px-4 text-gray-500">Nenhum bairro encontrado</div>
                        )
                      )}
                      {neighborhoodSearchTerm !== '' && (
                        (selectedCityName.toLowerCase() === 'são paulo' ? 
                          // Para São Paulo, verificar se não há resultados em nenhuma zona
                          !'toda são paulo'.includes(neighborhoodSearchTerm.toLowerCase()) &&
                          Object.keys(rjNeighborhoods).every(zona => 
                            !zona.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase()) &&
                            !rjNeighborhoods[zona].some((neighborhoodData: any) => 
                              neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                            )
                          ) :
                          selectedCityName.toLowerCase() === 'rio de janeiro' ? 
                            Object.keys(rjNeighborhoods).every(zona => 
                              !zona.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase()) &&
                              !rjNeighborhoods[zona].some((neighborhoodData: any) => 
                                neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                              )
                            ) :
                            Array.isArray(rjNeighborhoods) && !rjNeighborhoods.some((neighborhoodData: any) => 
                              neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                            )
                        ) && (
                          <div className="py-2 px-4 text-gray-500">Nenhum resultado encontrado</div>
                        )
                      )}
                    </div>
                  )}
                </div>
                
                {/* Dropdown de Faixas de Preço */}
                <div className="filter-dropdown relative">
                  <div 
                    className="flex items-center justify-between w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md cursor-pointer text-sm"
                    onClick={togglePriceMenu}
                  >
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedPriceRange.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  {showPriceMenu && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 py-2 max-h-[400px] overflow-y-auto">
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">FAIXAS DE PREÇO</div>
                      <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-200">
                        Clique para selecionar/deselecionar (múltipla escolha)
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => togglePriceRange({ label: 'Todos os preços' })}
                      >
                        Todos os preços
                      </div>
                      {/* Faixas de preço */}
                      {priceRanges.filter(r => r.label !== "Todos os preços").map((range, index) => {
                        const isSelected = selectedPriceRanges.some(r => r.label === range.label);
                        return (
                          <div 
                            key={index}
                            className={`px-4 py-2 flex items-center cursor-pointer ${
                              isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => togglePriceRange(range)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Controlled by parent onClick
                              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span>{range.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Segunda linha - Modalidade de Leilão */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4">
                {/* Dropdown de Modalidade de Leilão */}
                <div className="filter-dropdown relative">
                  <div 
                    className="flex items-center justify-between w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md cursor-pointer text-sm"
                    onClick={toggleAuctionTypeMenu}
                  >
                    <div className="flex items-center">
                      <Gavel className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedAuctionType}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  {showAuctionTypeMenu && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 py-2 max-h-[400px] overflow-y-auto">
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">MODALIDADE DE LEILÃO</div>
                      <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-200">
                        Clique para selecionar/deselecionar (múltipla escolha)
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleAuctionType("Todos os tipos de leilão")}
                      >
                        Todos os tipos de leilão
                      </div>
                      {[
                        AUCTION_TYPE_JUDICIAL,
                        AUCTION_TYPE_EXTRAJUDICIAL,
                        AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO
                      ].map((auctionType, index) => {
                        const isSelected = selectedAuctionTypes.includes(auctionType);
                        return (
                          <div 
                            key={index}
                            className={`px-4 py-2 flex items-center cursor-pointer ${
                              isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => toggleAuctionType(auctionType)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Controlled by parent onClick
                              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span>{auctionType}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Filtro de Data de Encerramento do 2º Leilão */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Filtrar por Data de Encerramento (2º Leilão)
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mostrar leilões até a data:</label>
                    <input
                      type="date"
                      value={dataFimSegundoLeilao}
                      onChange={(e) => setDataFimSegundoLeilao(e.target.value)}
                      className="w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                      placeholder="Data limite"
                    />
                  </div>
                </div>
              </div>

              {/* Campo de busca rápida */}
              <div className="mb-4 sm:mb-6">
                <input 
                  type="text" 
                  placeholder="Busca rápida, escreva o que procura" 
                  className="w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                />
              </div>
              
              {/* Botões de Buscar e Limpar */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex gap-3 sm:gap-4">
                  <Button 
                    className="flex-1 py-3 sm:py-3 bg-[#F44336] hover:bg-[#e53935] text-white font-bold text-base"
                    onClick={clearAllFilters}
                  >
                    Limpar Filtros
                  </Button>
                  <Button 
                    className="flex-1 py-3 sm:py-3 bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold text-base"
                    onClick={applyFilters}
                  >
                    Buscar Imóveis
                  </Button>
                </div>
                

              </div>
            </div>
            
            {/* Contagem de resultados e ordenação */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 px-1">
              <div className="text-sm sm:text-base font-bold mb-3 sm:mb-0">
                <span className="text-teal-800">{totalCount}</span> oportunidades encontradas
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Property Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      image={property.imagem}
                      title={property.titulo_propriedade}
                      location={`${property.endereco}${property.bairro ? ', ' + property.bairro : ''}, ${property.cidade}, ${property.estado}`}
                      firstAuctionDate={property.data_leilao_1}
                      firstAuctionValue={formatCurrency(property.leilao_1)}
                      secondAuctionDate={property.data_leilao_2}
                      secondAuctionValue={formatCurrency(property.leilao_2)}
                      area={property.area_displayable}
                      parkingSpots={property.parkingSpots}
                      tipoLeilao={property.tipo_leilao}
                      fgts={property.fgts}
                      financiamento={property.financiamento}
                      parcelamento={property.parcelamento}
                      rawPropertyData={property}
                      onContactClick={() => executeWhatsAppAction()}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 sm:py-10 px-4">
                    <p className="text-gray-500 text-base sm:text-lg mb-6">Nenhum imóvel encontrado com os filtros selecionados.</p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 max-w-md mx-auto">
                      <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-3"
                        onClick={() => {
                          // Buscar nas proximidades: redefine o filtro de bairro para todos da zona ou cidade
                          if (selectedCityName && selectedNeighborhood && selectedCityName.toLowerCase() === 'são paulo') {
                            // Se já é "Toda São Paulo", não pode expandir mais
                            if (selectedNeighborhood === 'Toda São Paulo') {
                              return;
                            }
                            
                            // Descobrir a zona do bairro selecionado
                            let zonaDoBairro = null;
                            for (const zona in bairrosPorZonaSP) {
                              if (bairrosPorZonaSP[zona].includes(selectedNeighborhood)) {
                                zonaDoBairro = zona;
                                break;
                              }
                            }
                            if (zonaDoBairro) {
                              setSelectedNeighborhood(`${zonaDoBairro} (todos)`);
                              setSelectedNeighborhoods(bairrosPorZonaSP[zonaDoBairro]);
                              setFilters((prev) => ({ ...prev, neighborhood: bairrosPorZonaSP[zonaDoBairro].join(',') }));
                              setCurrentPage(1);
                              toast.success('Buscando imóveis em todos os bairros da zona selecionada!');
                            } else {
                              // Se não encontrou zona ou já é uma zona (todos), expandir para Toda São Paulo
                              setSelectedNeighborhood('Toda São Paulo');
                              const todosBairros = Object.values(bairrosPorZonaSP).flat();
                              setSelectedNeighborhoods(todosBairros);
                              setFilters((prev) => ({ ...prev, neighborhood: todosBairros.join(',') }));
                              setCurrentPage(1);
                              toast.success('Buscando imóveis em toda São Paulo!');
                            }
                          } else if (selectedCityName && selectedNeighborhood) {
                            // Se não for Rio, buscar todos os bairros da cidade
                            setSelectedNeighborhood('Todos os bairros');
                            setSelectedNeighborhoods([]);
                            setFilters((prev) => {
                              const newFilters = { ...prev };
                              delete newFilters.neighborhood;
                              return newFilters;
                            });
                            setCurrentPage(1);
                            toast.success('Buscando imóveis em todos os bairros da cidade!');
                          }
                        }}
                      >
                        Buscar nas proximidades
                      </Button>
                      <Button
                        className="bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold px-6 py-3"
                        onClick={() => setShowInterestModal(true)}
                      >
                        Ficar de olho nesse filtro
                      </Button>
                    </div>
                    {/* Modal de interesse */}
                    {showInterestModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-left max-h-[90vh] overflow-y-auto">
                          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">Quero acompanhar oportunidades</h2>
                          <form onSubmit={handleInterestSubmit}>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 text-sm sm:text-base">Nome</label>
                              <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={interestName} 
                                onChange={e => setInterestName(e.target.value)} 
                                required 
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2 text-sm sm:text-base">Telefone</label>
                              <input 
                                type="tel" 
                                className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={interestPhone} 
                                onChange={e => setInterestPhone(e.target.value)} 
                                required 
                              />
                            </div>
                            <div className="mb-6">
                              <label className="block text-gray-700 mb-2 text-sm sm:text-base">E-mail</label>
                              <input 
                                type="email" 
                                className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={interestEmail} 
                                onChange={e => setInterestEmail(e.target.value)} 
                                required 
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                              <Button type="submit" className="bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold flex-1 py-3">Enviar</Button>
                              <Button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1 py-3" onClick={() => setShowInterestModal(false)}>Cancelar</Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {properties.length > 0 && (
                <div className="mt-6 sm:mt-8 flex justify-center px-4">
                  <PropertyPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* YouTube Video Section */}
      <VideoPlayerContainer />

      {/* Featured Videos Section */}
      <FeaturedVideos />

      {/* Newsletter Signup Section */}
      
      {/* Success Cases Section */}
      <SuccessCases />

      {/* Articles Section */}
      <ArticlesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Bottom Section */}
      <NewsletterBottomSection 
        onWhatsAppClick={() => executeWhatsAppAction()}
        onOpportunityClick={() => window.open('https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/', '_blank')}
      />

      {/* Footer */}
      <Footer onWhatsAppClick={() => executeWhatsAppAction()} />

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

export default LeilaoSP;
