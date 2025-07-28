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
import { NewsletterSignup } from "@/components/newsletter2";
import { TestimonialsSection } from "@/components/testimonials";
import { NewsletterBottomSection } from "@/components/NewsletterBottomSection";
import { Footer } from "@/components/Footer";
import OpportunityPopup from "@/components/OpportunityPopup";
import WhatsAppModal from "@/components/WhatsAppModal";
import { Search, MessageCircle, Filter, X, MapPin, ChevronDown, Home, Building, Tractor, Trees, FileText, Globe, DollarSign, CalendarIcon, Car, SquareStack, Warehouse, Gavel, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFilterParams } from "@/hooks/useFilterParams";
import { flexibleSearch } from "@/utils/stringUtils";

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
  auctionType?: string; // Filtro para tipo de leilão (inclui EXTRAJUDICIAL_CUSTOM)
  financiamento?: boolean; // Filtro para leilão com financiamento
  fgts?: boolean; // Filtro para leilão que aceita FGTS
  parcelamento?: boolean; // Filtro para parcelamento
  neighborhoods?: string[]; // Para múltiplos bairros
  cities?: string[]; // Para múltiplas cidades
  dataFimSegundoLeilao?: string; // Data final do filtro de data de encerramento do segundo leilão
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

// Definição dos bairros por zona de São Paulo
const bairrosPorZonaSP: Record<string, string[]> = {
  'Zona Central': [
    'Bela Vista', 'Bom Retiro', 'Cambuci', 'Consolação', 'Higienópolis', 'Liberdade', 'República', 'Santa Cecília', 'Sé'
  ],
  'Zona Leste': [
    'Água Rasa', 'Aricanduva', 'Artur Alvim', 'Belém', 'Brás', 'Cangaíba', 'Carrão', 'Cidade Líder', 'Cidade Tiradentes', 'Ermelino Matarazzo', 'Guaianases', 'Itaim Paulista', 'Itaquera', 'Jardim Helena', 'José Bonifácio', 'Lajeado', 'Mooca', 'Pari', 'Parque do Carmo', 'Penha', 'Ponte Rasa', 'São Lucas', 'São Mateus', 'São Miguel', 'São Rafael', 'Sapopemba', 'Tatuapé', 'Vila Curuçá', 'Vila Formosa', 'Vila Jacuí', 'Vila Matilde', 'Vila Prudente'
  ],
  'Zona Norte': [
    'Anhanguera', 'Brasilândia', 'Cachoeirinha', 'Casa Verde', 'Freguesia do Ó', 'Jaçanã', 'Jaraguá', 'Limão', 'Mandaqui', 'Perus', 'Pirituba', 'Santana', 'São Domingos', 'Tremembé', 'Tucuruvi', 'Vila Guilherme', 'Vila Maria', 'Vila Medeiros'
  ],
  'Zona Oeste': [
    'Alto de Pinheiros', 'Barra Funda', 'Butantã', 'Jaguará', 'Itaim Bibi', 'Jardim América', 'Jardim Europa', 'Jardim Paulista', 'Jardim Paulistano', 'Lapa', 'Morumbi', 'Perdizes', 'Pinheiros', 'Raposo Tavares', 'Rio Pequeno', 'Vila Leopoldina', 'Vila Madalena', 'Vila Sônia'
  ],
  'Zona Sul': [
    'Campo Belo', 'Campo Limpo', 'Capão Redondo', 'Cidade Ademar', 'Cidade Dutra', 'Cursino', 'Grajaú', 'Ipiranga', 'Jabaquara', 'Jardim Ângela', 'Jardim São Luís', 'Marsilac', 'Moema', 'Parelheiros', 'Pedreira', 'Sacomã', 'Socorro', 'Santo Amaro', 'Saúde', 'Vila Andrade', 'Vila Mariana', 'Vila Olímpia'
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
  const [selectedCity, setSelectedCity] = useState("Selecione a cidade");
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
  
  // Estado para armazenar a cidade selecionada sem a contagem entre parênteses
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  
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
    { label: "Até R$ 100 mil", max: 100000 },
    { label: "R$ 100 mil a R$ 300 mil", min: 100000, max: 300000 },
    { label: "R$ 300 mil a R$ 500 mil", min: 300000, max: 500000 },
    { label: "R$ 500 mil a R$ 1 milhão", min: 500000, max: 1000000 },
    { label: "R$ 1 milhão a R$ 2 milhões", min: 1000000, max: 2000000 },
    { label: "R$ 2 milhões a R$ 5 milhões", min: 2000000, max: 5000000 },
    { label: "R$ 5 milhões a R$ 10 milhões", min: 5000000, max: 10000000 },
    { label: "Acima de R$ 10 milhões", min: 10000000 }
  ];

  // Novo estado para controlar o menu de regiões de cidades
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Novo estado para armazenar cidades selecionadas (pode ser uma ou todas de uma região)
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Estados para busca nos dropdowns
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");

  // Estado para filtro de data de encerramento do segundo leilão
  const [dataFimSegundoLeilao, setDataFimSegundoLeilao] = useState("");

  // Estado para controlar o popup de oportunidades
  const [showOpportunityPopup, setShowOpportunityPopup] = useState(false);

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

  // Estados para o modal do WhatsApp
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Mostrar popup de oportunidades quando a página carregar
  useEffect(() => {
    // Verificar se o popup já foi exibido na sessão atual
    const popupShown = sessionStorage.getItem('opportunity-popup-shown');
    
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowOpportunityPopup(true);
        sessionStorage.setItem('opportunity-popup-shown', 'true');
      }, 3000); // Mostrar após 3 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  // Carregar filtros da URL quando a página carrega
  useEffect(() => {
    const urlFilters = parseFiltersFromURL();
    
    if (Object.keys(urlFilters).length > 0) {
      // Aplicar filtros da URL ao estado
      if (urlFilters.cities && urlFilters.cities.length > 0) {
        setSelectedCities(urlFilters.cities);
        if (urlFilters.cities.length === 1) {
          if (urlFilters.cities[0] === "TODO_SP_STATE") {
            setSelectedCity("Todas cidades de SP");
            setSelectedCityName("TODO_SP_STATE");
          } else {
            setSelectedCity(urlFilters.cities[0]);
            setSelectedCityName(urlFilters.cities[0]);
          }
        } else {
          setSelectedCity(`Várias cidades (${urlFilters.cities.length})`);
        }
      } else if (urlFilters.city) {
        if (urlFilters.city === "TODO_SP_STATE") {
          setSelectedCity("Todas cidades de SP");
          setSelectedCityName("TODO_SP_STATE");
        } else {
          setSelectedCity(urlFilters.city);
          setSelectedCityName(urlFilters.city);
        }
        setSelectedCities([urlFilters.city]);
      }
      
      if (urlFilters.neighborhoods && urlFilters.neighborhoods.length > 0) {
        setSelectedNeighborhoods(urlFilters.neighborhoods);
        if (urlFilters.neighborhoods.length === 1) {
          setSelectedNeighborhood(urlFilters.neighborhoods[0]);
        } else {
          setSelectedNeighborhood(`Vários bairros (${urlFilters.neighborhoods.length})`);
        }
      } else if (urlFilters.neighborhood) {
        setSelectedNeighborhood(urlFilters.neighborhood);
        setSelectedNeighborhoods([urlFilters.neighborhood]);
      }
      
      if (urlFilters.type) {
        // Encontrar o tipo correspondente e aplicar
        const propertyTypeData = propertyTypes.find(p => p.type === urlFilters.type);
        if (propertyTypeData) {
          const formattedTypeName = propertyTypeData.type.charAt(0).toUpperCase() + propertyTypeData.type.slice(1).toLowerCase();
          let icon = <Globe className="h-4 w-4" />;
          const typeLC = propertyTypeData.type.toLowerCase();
          
          if (typeLC === 'apartamento' || typeLC === 'comercial' || typeLC === 'prédio' || typeLC === 'galpão') {
            icon = <Building className="h-4 w-4" />;
          } else if (typeLC === 'casa') {
            icon = <Home className="h-4 w-4" />;
          } else if (typeLC === 'terreno') {
            icon = <Trees className="h-4 w-4" />;
          } else if (typeLC === 'rural' || typeLC === 'fazenda' || typeLC === 'chácara') {
            icon = <Tractor className="h-4 w-4" />;
          } else if (typeLC === 'estacionamento') {
            icon = <Car className="h-4 w-4" />;
          } else if (typeLC === 'área') {
            icon = <SquareStack className="h-4 w-4" />;
          } else {
            icon = <FileText className="h-4 w-4" />;
          }
          
          setSelectedType({ label: formattedTypeName, icon, originalValue: propertyTypeData.type });
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
      
      if (urlFilters.priceRange) {
        // Encontrar a faixa de preço correspondente
        const priceRange = priceRanges.find(range => 
          range.min === urlFilters.priceRange?.min && range.max === urlFilters.priceRange?.max
        );
        if (priceRange) {
          setSelectedPriceRange(priceRange);
        }
      }
      
      if (urlFilters.auctionType) {
        if (urlFilters.auctionType === "Judicial") {
          setSelectedAuctionType(AUCTION_TYPE_JUDICIAL);
        } else if (urlFilters.auctionType === "EXTRAJUDICIAL_CUSTOM" && urlFilters.financiamento) {
          setSelectedAuctionType(AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO);
        } else if (urlFilters.auctionType === "EXTRAJUDICIAL_CUSTOM") {
          setSelectedAuctionType(AUCTION_TYPE_EXTRAJUDICIAL);
        }
      }

      // Restaurar filtro de data de encerramento do segundo leilão
      if (urlFilters.dataFimSegundoLeilao) {
        setDataFimSegundoLeilao(urlFilters.dataFimSegundoLeilao);
      }
      
      // Aplicar os filtros
      setFilters(urlFilters);
    }
  }, [parseFiltersFromURL, propertyTypes]); // Dependência nos propertyTypes para garantir que estejam carregados

  // Função para buscar cidades de SP
  const fetchSpCities = async () => {
    try {
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('cidade')
        .eq('estado', 'SP')
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
      const citiesArray = Object.keys(cityCount)
        .map(city => ({
          city,
          count: cityCount[city]
        }))
        .sort((a, b) => a.city.localeCompare(b.city, 'pt-BR'));
      
      console.log(`Total de cidades de SP encontradas: ${citiesArray.length}`);
      setRjCities(citiesArray);
    } catch (err) {
      console.error('Erro ao buscar cidades de SP:', err);
    }
  };

  // Função para buscar bairros de uma cidade específica de SP
  const fetchNeighborhoodsByCity = async (cityName?: string) => {
    const targetCity = cityName || selectedCityName || 'São Paulo';
    
    try {
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('bairro')
        .eq('estado', 'SP')
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
            if (neighborhoodCount[bairro]) {
              bairrosAgrupados[zona].push({
                neighborhood: bairro,
                count: neighborhoodCount[bairro]
              });
            }
          });
        });
        
        // Adicionar bairros "Outros" que estão no banco mas não na lista fixa de zonas
        const bairrosOutros: { neighborhood: string, count: number }[] = [];
        Object.keys(neighborhoodCount).forEach(bairro => {
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
        
        // Remover zonas vazias
        Object.keys(bairrosAgrupados).forEach(zona => {
          if (bairrosAgrupados[zona].length === 0) {
            delete bairrosAgrupados[zona];
          }
        });
        
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

  // Inicializar São Paulo e carregar dados
  useEffect(() => {
    // Definir São Paulo como cidade selecionada automaticamente
    setSelectedCity("São Paulo");
    setSelectedCityName("São Paulo");
    setSelectedCities(["São Paulo"]);
    
    // Buscar tipos de propriedade
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('leiloes_imoveis')
          .select('tipo_propriedade')
          .eq('estado', 'SP')
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

    // Carregar cidades de SP e bairros de São Paulo automaticamente
    fetchSpCities();
    fetchNeighborhoodsByCity('São Paulo');
    fetchPropertyTypes();
  }, []);

  // Carregar os imóveis do Supabase com filtros
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      try {
        // Começar a consulta do Supabase
        let query = supabase
          .from('leiloes_imoveis')
          .select('*', { count: 'exact' })
          .eq('estado', 'SP');
          
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
        
        if (filters.neighborhood) {
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

        
        // Obter a data atual para comparação no servidor
        const currentDateForFilter = new Date();
        
        let countQuery = query;
        
        // Adicionar filtro de data para considerar apenas leilões futuros
        countQuery = countQuery.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()}`);
        
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
        query = query.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter.toISOString()}`);

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

        let filteredProperties = formattedProperties;
        if (filters.dataFimSegundoLeilao) {
          const filterDate = new Date(filters.dataFimSegundoLeilao);
          filteredProperties = formattedProperties.filter(property => {
            const effectiveDate = property.data_leilao_2_original || property.data_leilao_1_original;
            if (!effectiveDate) return false;
            const propertyDate = new Date(effectiveDate);
            return propertyDate <= filterDate;
          });
        }

        setProperties(filteredProperties);
      } catch (err) {
        console.error('Erro ao buscar imóveis:', err);
        setError('Não foi possível carregar os imóveis. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, filters]);

  // Função para formatar datas
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Data inválida recebida:', dateString);
        return '';
      }
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

  // Função para aplicar filtros
  const applyFilters = () => {
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
    
    // Verificar se há bairros selecionados (pode ser 1 ou vários)
    if (selectedNeighborhoods.length > 0) {
      newFilters.neighborhood = selectedNeighborhoods.join(','); // Passa como string separada por vírgula
      newFilters.neighborhoods = selectedNeighborhoods; // Para URL params
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
      const allMins = selectedPriceRanges.filter(range => range.min !== undefined).map(range => range.min!);
      const allMaxs = selectedPriceRanges.filter(range => range.max !== undefined).map(range => range.max!);
      
      newFilters.priceRange = {
        min: allMins.length > 0 ? Math.min(...allMins) : undefined,
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
      
      if (hasJudicial && (hasExtrajudicial || hasExtrajudicialFinanciamento)) {
        // Se tem judicial E extrajudicial, não filtrar por tipo específico (mostrar todos)
        // Mas se só tem extrajudicial com financiamento, aplicar esse filtro
        if (hasExtrajudicialFinanciamento && !hasExtrajudicial) {
          newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
          newFilters.financiamento = true;
        }
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
    
    // Aplicar filtros
    setFilters(newFilters);
    
    // Atualizar URL com os filtros aplicados
    updateURL(newFilters);
    
    // Resetar para a primeira página quando aplicar filtros
    setCurrentPage(1);
    
    // Notificação de filtro aplicado
    toast.success('Filtros aplicados com sucesso!');
    
    // Se estiver no mobile, fechar o painel de filtros
    if (isMobile) {
      setIsFilterOpen(false);
    }
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
      if (showTypeMenu || showCityMenu || showNeighborhoodMenu || showPriceMenu || showAuctionTypeMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-dropdown')) {
          setShowTypeMenu(false);
          setShowCityMenu(false);
          setShowNeighborhoodMenu(false);
          setShowPriceMenu(false);
          setShowAuctionTypeMenu(false);
          setCitySearchTerm("");
          setNeighborhoodSearchTerm("");
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTypeMenu, showCityMenu, showNeighborhoodMenu, showPriceMenu, showAuctionTypeMenu]);
  
  // Funções para manipular os menus
  const toggleTypeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTypeMenu(!showTypeMenu);
    setShowCityMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
  };
  
  const toggleCityMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCityMenu(!showCityMenu);
    setShowTypeMenu(false);
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
    setShowNeighborhoodMenu(false);
    setShowAuctionTypeMenu(false);
  };
  
  const toggleAuctionTypeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAuctionTypeMenu(!showAuctionTypeMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
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
  
  const selectZone = (zone: string) => {
    // Seleciona todos os bairros da zona
    const bairros = bairrosPorZonaSP[zone] || [];
    setSelectedNeighborhood(`${zone} (todos)`);
    setSelectedNeighborhoods(bairros);
    setShowNeighborhoodMenu(false);
  };

  const selectAllSaoPaulo = () => {
    // Seleciona todos os bairros de todas as zonas de São Paulo
    const todosBairros = Object.values(bairrosPorZonaSP).flat();
    setSelectedNeighborhood("Toda São Paulo");
    setSelectedNeighborhoods(todosBairros);
    setShowNeighborhoodMenu(false);
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
      <SocialBar onWhatsAppClick={() => setShowWhatsAppModal(true)} />
              <Header onContactClick={() => setShowWhatsAppModal(true)} />
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
                        onClick={() => togglePropertyType("Todos os imóveis", <Globe className="h-4 w-4" />, undefined)}
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
                            onClick={() => togglePropertyType(formattedTypeName, icon, typeData.type)}
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
                            onClick={() => toggleCity(cityData.city)}
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
                                  onClick={() => selectZone(zona)}
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
                      {[
                        { label: 'Até 300 mil', max: 300000 },
                        { label: 'De 301 a 500 mil', min: 301000, max: 500000 },
                        { label: 'De 501 a 700 mil', min: 501000, max: 700000 },
                        { label: 'De 700 a 1 milhão', min: 700000, max: 1000000 },
                        { label: 'De 1 a 1,5 milhão', min: 1000000, max: 1500000 },
                        { label: 'De 1,5 a 2 milhões', min: 1500000, max: 2000000 },
                        { label: 'Mais de 2 milhões', min: 2000001 }
                      ].map((range, index) => {
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
                      onContactClick={() => setShowWhatsAppModal(true)}
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
      <NewsletterSignup />
      
      {/* Success Cases Section */}
      <SuccessCases />

      {/* Articles Section */}
      <ArticlesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Bottom Section */}
      <NewsletterBottomSection 
        onWhatsAppClick={() => setShowWhatsAppModal(true)}
        onOpportunityClick={() => window.open('https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/', '_blank')}
      />

      {/* Footer */}
      <Footer onWhatsAppClick={() => setShowWhatsAppModal(true)} />

      {/* Floating Buttons */}
      <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-40 flex flex-col sm:flex-row gap-2 sm:gap-3 items-end">
        <Button 
          className="bg-primary hover:bg-primary/90 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2"
          onClick={() => setShowOpportunityPopup(true)}
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Inscreva-se para oportunidades</span>
          <span className="sm:hidden">Oportunidades</span>
        </Button>
        
        <Button 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-gray-100 border border-gray-200"
          onClick={() => setShowWhatsAppModal(true)}
        >
          <WhatsAppIcon />
        </Button>
      </div>

      {/* Popup de Oportunidades */}
      <OpportunityPopup 
        isOpen={showOpportunityPopup} 
        onClose={closeOpportunityPopup} 
      />

      {/* Modal do WhatsApp */}
      {showWhatsAppModal && (
        <WhatsAppModal 
          isOpen={showWhatsAppModal} 
          onClose={() => setShowWhatsAppModal(false)} 
        />
      )}
    </div>
  );
};

export default LeilaoSP;
