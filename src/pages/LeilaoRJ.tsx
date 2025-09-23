import { CookieBar } from "@/components/CookieBar";
import { SocialBar } from "@/components/SocialBar";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyPagination } from "@/components/PropertyPagination";
import { FeaturedVideos } from "@/components/FeaturedVideos";
import { SuccessCases } from "@/components/SuccessCases";
import { ArticlesSection } from "@/components/articles";
import { VideoPlayerContainer } from "@/components/video";
import { NewsletterSignup } from "@/components/newsletter2";
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
  area_displayable?: string;
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
  auctionType?: string;
  financiamento?: boolean;
  fgts?: boolean;
  parcelamento?: boolean;
  neighborhoods?: string[];
  cities?: string[];
  dataFimSegundoLeilao?: string;
  zone?: string;
  zones?: string[];
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
  originalValue?: string;
}

const ITEMS_PER_PAGE = 40;

const LeilaoRJ = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showOpportunityPopup, setShowOpportunityPopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [selectedType, setSelectedType] = useState<SelectedType | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  const [hasSecondAuction, setHasSecondAuction] = useState(false);
  const [selectedAuctionType, setSelectedAuctionType] = useState("");
  const [financiamento, setFinanciamento] = useState(false);
  const [fgts, setFgts] = useState(false);
  const [parcelamento, setParcelamento] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [isDropdownCityOpen, setIsDropdownCityOpen] = useState(false);
  const [isDropdownNeighborhoodOpen, setIsDropdownNeighborhoodOpen] = useState(false);
  const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
  const [isDropdownPriceOpen, setIsDropdownPriceOpen] = useState(false);
  const [isDropdownAuctionTypeOpen, setIsDropdownAuctionTypeOpen] = useState(false);

  // Setup filtros da URL
  const { updateFilterParams } = useFilterParams();

  // Configuração de tipos de propriedade
  const propertyTypes = [
    { label: "Todos os tipos", icon: <Home size={16} />, originalValue: "" },
    { label: "Apartamento", icon: <Building size={16} />, originalValue: "APARTAMENTO" },
    { label: "Casa", icon: <Home size={16} />, originalValue: "CASA" },
    { label: "Terreno", icon: <Trees size={16} />, originalValue: "TERRENO" },
    { label: "Rural", icon: <Tractor size={16} />, originalValue: "RURAL" },
    { label: "Comercial", icon: <Building size={16} />, originalValue: "COMERCIAL" },
    { label: "Garagem", icon: <Car size={16} />, originalValue: "GARAGEM" },
    { label: "Loja", icon: <SquareStack size={16} />, originalValue: "LOJA" },
    { label: "Galpão", icon: <Warehouse size={16} />, originalValue: "GALPAO" },
    { label: "Outros", icon: <FileText size={16} />, originalValue: "OUTROS" }
  ];

  // Configuração de faixas de preço
  const priceRanges: PriceRange[] = [
    { label: "Todos os valores", min: undefined, max: undefined },
    { label: "Até R$ 100.000", min: 0, max: 100000 },
    { label: "R$ 100.000 - R$ 200.000", min: 100000, max: 200000 },
    { label: "R$ 200.000 - R$ 300.000", min: 200000, max: 300000 },
    { label: "R$ 300.000 - R$ 500.000", min: 300000, max: 500000 },
    { label: "R$ 500.000 - R$ 1.000.000", min: 500000, max: 1000000 },
    { label: "Acima de R$ 1.000.000", min: 1000000, max: undefined }
  ];

  // Configuração de tipos de leilão
  const auctionTypes = [
    { label: "Todos os tipos", value: "" },
    { label: "Judicial", value: "JUDICIAL" },
    { label: "Extrajudicial", value: "EXTRAJUDICIAL" },
    { label: "Caixa Econômica", value: "CAIXA" }
  ];

  useEffect(() => {
    // Define títulos e meta tags específicos para RJ
    document.title = "Imóveis em Leilão RJ | Cataldo Siston";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Leilão de imóveis no RJ e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'leilão de imóveis RJ, leilão imóveis Rio de Janeiro, advocacia imobiliária, cataldo siston, leilão judicial, leilão extrajudicial');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Imóveis em Leilão RJ | Cataldo Siston');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Leilão de imóveis no RJ e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Imóveis em Leilão RJ | Cataldo Siston');
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Leilão de imóveis no RJ e Advocacia Imobiliária. Tenha alto Retorno Financeiro com segurança com Especialistas. Entre em Contato Conosco!');
    }

    initializeWhatsAppScript();
    loadProperties();
    loadCities();
    showPopupAfterDelay();
  }, []);

  const showPopupAfterDelay = () => {
    const timer = setTimeout(() => {
      setShowOpportunityPopup(true);
    }, 120000); // 2 minutos

    return () => clearTimeout(timer);
  };

  const loadCities = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('cidade')
        .eq('estado', 'RJ') // Filtra apenas cidades do RJ
        .order('cidade');

      if (error) {
        console.error('Erro ao carregar cidades:', error);
        return;
      }

      const uniqueCities = [...new Set(data?.map(item => item.cidade) || [])];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const loadNeighborhoods = async (city: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('bairro')
        .eq('cidade', city)
        .eq('estado', 'RJ') // Filtra apenas bairros do RJ
        .order('bairro');

      if (error) {
        console.error('Erro ao carregar bairros:', error);
        return;
      }

      const uniqueNeighborhoods = [...new Set(data?.map(item => item.bairro) || [])];
      setNeighborhoods(uniqueNeighborhoods);
    } catch (error) {
      console.error('Erro ao carregar bairros:', error);
    }
  };

  const buildFilters = useCallback((): Filters => {
    return {
      city: selectedCity || undefined,
      type: selectedType?.originalValue || undefined,
      neighborhood: selectedNeighborhood || undefined,
      keyword: searchTerm || undefined,
      hasSecondAuction,
      priceRange: selectedPriceRange && (selectedPriceRange.min !== undefined || selectedPriceRange.max !== undefined)
        ? { min: selectedPriceRange.min, max: selectedPriceRange.max }
        : undefined,
      auctionType: selectedAuctionType || undefined,
      financiamento: financiamento || undefined,
      fgts: fgts || undefined,
      parcelamento: parcelamento || undefined,
    };
  }, [selectedCity, selectedType, selectedNeighborhood, searchTerm, hasSecondAuction, selectedPriceRange, selectedAuctionType, financiamento, fgts, parcelamento]);

  const loadProperties = useCallback(async (page: number = 1) => {
    setLoading(true);

    try {
      const filters = buildFilters();
      const offset = (page - 1) * ITEMS_PER_PAGE;

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('estado', 'RJ') // Filtra apenas imóveis do RJ
        .range(offset, offset + ITEMS_PER_PAGE - 1)
        .order('id', { ascending: false });

      let countQuery = supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'RJ'); // Filtra apenas imóveis do RJ

      // Aplicar filtros
      if (filters.city) {
        query = query.eq('cidade', filters.city);
        countQuery = countQuery.eq('cidade', filters.city);
      }

      if (filters.neighborhood) {
        query = query.eq('bairro', filters.neighborhood);
        countQuery = countQuery.eq('bairro', filters.neighborhood);
      }

      if (filters.type) {
        query = query.eq('tipo_propriedade', filters.type);
        countQuery = countQuery.eq('tipo_propriedade', filters.type);
      }

      if (filters.keyword) {
        const searchColumns = ['titulo_propriedade', 'endereco', 'bairro', 'cidade', 'descricao'];
        const searchConditions = searchColumns.map(column => `${column}.ilike.%${filters.keyword}%`).join(',');
        query = query.or(searchConditions);
        countQuery = countQuery.or(searchConditions);
      }

      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          query = query.gte('leilao_1', filters.priceRange.min);
          countQuery = countQuery.gte('leilao_1', filters.priceRange.min);
        }
        if (filters.priceRange.max !== undefined) {
          query = query.lte('leilao_1', filters.priceRange.max);
          countQuery = countQuery.lte('leilao_1', filters.priceRange.max);
        }
      }

      if (filters.hasSecondAuction) {
        const currentDate = new Date();
        const currentDateForFilter = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
        query = query.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()},data_leilao_2.gte.${currentDateForFilter.toISOString()}`);
        countQuery = countQuery.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()},data_leilao_2.gte.${currentDateForFilter.toISOString()}`);
      }

      if (filters.auctionType) {
        if (filters.auctionType === 'EXTRAJUDICIAL') {
          query = query.or('tipo_leilao.eq.EXTRAJUDICIAL,tipo_leilao.eq.EXTRAJUDICIAL_CUSTOM,tipo_leilao.eq.EXTRAJUDICIAL_COMPOSTO');
          countQuery = countQuery.or('tipo_leilao.eq.EXTRAJUDICIAL,tipo_leilao.eq.EXTRAJUDICIAL_CUSTOM,tipo_leilao.eq.EXTRAJUDICIAL_COMPOSTO');
        } else {
          query = query.eq('tipo_leilao', filters.auctionType);
          countQuery = countQuery.eq('tipo_leilao', filters.auctionType);
        }
      }

      if (filters.financiamento) {
        query = query.eq('financiamento', true);
        countQuery = countQuery.eq('financiamento', true);
      }

      if (filters.fgts) {
        query = query.eq('fgts', true);
        countQuery = countQuery.eq('fgts', true);
      }

      if (filters.parcelamento) {
        query = query.eq('parcelamento', true);
        countQuery = countQuery.eq('parcelamento', true);
      }

      const [{ data: propertiesData, error: propertiesError }, { count, error: countError }] = await Promise.all([
        query,
        countQuery
      ]);

      if (propertiesError) {
        console.error('Erro ao carregar propriedades:', propertiesError);
        toast.error('Erro ao carregar imóveis');
        return;
      }

      if (countError) {
        console.error('Erro ao contar propriedades:', countError);
      }

      setProperties(propertiesData || []);
      setTotalItems(count || 0);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      setCurrentPage(page);

      updateFilterParams(filters);

    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  }, [buildFilters, updateFilterParams]);

  useEffect(() => {
    loadProperties(1);
  }, [loadProperties]);

  useEffect(() => {
    if (selectedCity) {
      loadNeighborhoods(selectedCity);
      setSelectedNeighborhood("");
    } else {
      setNeighborhoods([]);
      setSelectedNeighborhood("");
    }
  }, [selectedCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProperties(1);
  };

  const handlePageChange = (page: number) => {
    loadProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedNeighborhood("");
    setSelectedType(propertyTypes[0]);
    setSelectedPriceRange(priceRanges[0]);
    setHasSecondAuction(false);
    setSelectedAuctionType("");
    setFinanciamento(false);
    setFgts(false);
    setParcelamento(false);
    setCurrentPage(1);
    loadProperties(1);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownCityOpen(false);
  };

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    setIsDropdownNeighborhoodOpen(false);
  };

  const handleTypeSelect = (type: SelectedType) => {
    setSelectedType(type);
    setIsDropdownTypeOpen(false);
  };

  const handlePriceSelect = (priceRange: PriceRange) => {
    setSelectedPriceRange(priceRange);
    setIsDropdownPriceOpen(false);
  };

  const handleAuctionTypeSelect = (type: string, label: string) => {
    setSelectedAuctionType(type);
    setIsDropdownAuctionTypeOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <CookieBar />
      <SocialBar onWhatsAppClick={() => executeWhatsAppAction()} />
      <Header onContactClick={() => executeWhatsAppAction()} />
      <HeroSection onOpportunityClick={() => window.open('https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/', '_blank')} />

      {/* Properties Section */}
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
            <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block bg-white p-4 sm:p-6 rounded-lg shadow-sm border`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {/* Campo de busca */}
                <div className="lg:col-span-1">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar por palavra-chave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 h-10 text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </form>
                </div>

                {/* Dropdown Cidade */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownCityOpen(!isDropdownCityOpen)}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between text-sm"
                  >
                    <span className={selectedCity ? "text-gray-900" : "text-gray-500"}>
                      {selectedCity || "Selecione a cidade"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownCityOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownCityOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <button
                        onClick={() => handleCitySelect("")}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Todas as cidades
                      </button>
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm ${
                            selectedCity === city ? 'bg-teal-50 text-teal-700' : ''
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown Bairro */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownNeighborhoodOpen(!isDropdownNeighborhoodOpen)}
                    disabled={!selectedCity}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className={selectedNeighborhood ? "text-gray-900" : "text-gray-500"}>
                      {selectedNeighborhood || "Selecione o bairro"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownNeighborhoodOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownNeighborhoodOpen && selectedCity && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <button
                        onClick={() => handleNeighborhoodSelect("")}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Todos os bairros
                      </button>
                      {neighborhoods.map((neighborhood) => (
                        <button
                          key={neighborhood}
                          onClick={() => handleNeighborhoodSelect(neighborhood)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm ${
                            selectedNeighborhood === neighborhood ? 'bg-teal-50 text-teal-700' : ''
                          }`}
                        >
                          {neighborhood}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown Tipo */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownTypeOpen(!isDropdownTypeOpen)}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {selectedType?.icon}
                      <span className={selectedType?.label ? "text-gray-900" : "text-gray-500"}>
                        {selectedType?.label || "Selecione o tipo"}
                      </span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownTypeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownTypeOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.label}
                          onClick={() => handleTypeSelect(type)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm ${
                            selectedType?.label === type.label ? 'bg-teal-50 text-teal-700' : ''
                          }`}
                        >
                          {type.icon}
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Segunda linha de filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                {/* Dropdown Faixa de Preço */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownPriceOpen(!isDropdownPriceOpen)}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between text-sm"
                  >
                    <span className={selectedPriceRange?.label ? "text-gray-900" : "text-gray-500"}>
                      {selectedPriceRange?.label || "Faixa de preço"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownPriceOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownPriceOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => handlePriceSelect(range)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm ${
                            selectedPriceRange?.label === range.label ? 'bg-teal-50 text-teal-700' : ''
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown Tipo de Leilão */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownAuctionTypeOpen(!isDropdownAuctionTypeOpen)}
                    className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between text-sm"
                  >
                    <span className={selectedAuctionType ? "text-gray-900" : "text-gray-500"}>
                      {auctionTypes.find(t => t.value === selectedAuctionType)?.label || "Tipo de leilão"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownAuctionTypeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownAuctionTypeOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {auctionTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => handleAuctionTypeSelect(type.value, type.label)}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm ${
                            selectedAuctionType === type.value ? 'bg-teal-50 text-teal-700' : ''
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checkbox Segundo Leilão */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={hasSecondAuction}
                      onChange={(e) => setHasSecondAuction(e.target.checked)}
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Com 2º leilão</span>
                  </label>
                </div>

                {/* Checkbox Financiamento */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={financiamento}
                      onChange={(e) => setFinanciamento(e.target.checked)}
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Aceita financiamento</span>
                  </label>
                </div>

                {/* Checkbox FGTS */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={fgts}
                      onChange={(e) => setFgts(e.target.checked)}
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Aceita FGTS</span>
                  </label>
                </div>
              </div>

              {/* Terceira linha com Parcelamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Checkbox Parcelamento */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={parcelamento}
                      onChange={(e) => setParcelamento(e.target.checked)}
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Aceita parcelamento</span>
                  </label>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => loadProperties(1)}
                  className="flex-1 bg-teal-900 hover:bg-teal-800 text-white py-2 px-4 text-sm font-medium"
                >
                  <Search className="mr-2" size={16} />
                  Buscar Imóveis
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1 border-teal-900 text-teal-900 hover:bg-teal-50 py-2 px-4 text-sm font-medium"
                >
                  <X className="mr-2" size={16} />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Imóveis em Leilão RJ
              </h2>
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span>Carregando...</span>
                ) : (
                  <span>{totalItems} imóveis encontrados</span>
                )}
              </div>
            </div>
          </div>

          {/* Grid de Propriedades */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <PropertyPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar seus filtros de busca para encontrar mais resultados.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-teal-900 text-teal-900 hover:bg-teal-50"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      <FeaturedVideos />
      <SuccessCases />
      <ArticlesSection />
      <VideoPlayerContainer />
      <NewsletterSignup />
      <TestimonialsSection />
      <NewsletterBottomSection />
      <Footer />

      {showOpportunityPopup && (
        <OpportunityPopup onClose={() => setShowOpportunityPopup(false)} />
      )}
    </div>
  );
};

export default LeilaoRJ;