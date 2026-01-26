import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { formatCurrency, flexibleSearch, sanitizeSearchInput } from '@/utils/stringUtils';
import { ArrowLeft, ChevronRight, ChevronDown, Filter, X, MapPin, Home, Building, Tractor, Trees, FileText, Globe, DollarSign, CalendarIcon, Car, SquareStack, Gavel } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { useFilterParams, FilterParams } from '@/hooks/useFilterParams';

// Componentes iguais à página /leilao-rj
import { SocialBar } from '@/components/SocialBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyPagination } from '@/components/PropertyPagination';
import { TestimonialsSection } from '@/components/testimonials';
import { NewsletterBottomSection } from '@/components/NewsletterBottomSection';

// Sprint 6 - Regional page components
import {
  RegionContentSection,
  SupportCTA,
  SuccessCasesSection,
} from '@/components/regional';

// Sprint 7 - NoScript fallback for SEO
import { NoScriptFallback } from '@/components/NoScriptFallback';

interface Property {
  id: number;
  titulo_propriedade: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_leilao_1: string;
  data_leilao_2?: string;
  leilao_1: number;
  leilao_2?: number;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  tipo_propriedade?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
}

interface RegionContent {
  neighborhoods?: string[];
  attractions?: string[];
  infrastructure?: string[];
  highlights?: string[];
}

interface SEOPage {
  id: number;
  page_id: string;
  estado: string;
  regiao: string;
  keyword: string;
  url_slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  filter_type: 'bairro' | 'zona' | 'cidade';
  filter_value: string;
  is_active: boolean;
  view_count: number;
  last_viewed_at: string | null;
  created_at: string;
  updated_at: string;
  intro_text?: string | null;
  region_description?: string | null;
  region_content?: RegionContent | null;
  h1_title?: string | null;
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
  priceRanges?: string[];
  auctionType?: string;
  financiamento?: boolean;
  fgts?: boolean;
  parcelamento?: boolean;
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

const AUCTION_TYPE_JUDICIAL = "JUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL = "EXTRAJUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO = "EXTRAJUDICIAL FINANCIÁVEL";

// Definição dos bairros por zona do Rio de Janeiro
const bairrosPorZonaRJ: Record<string, string[]> = {
  'Zona Central (Rio de Janeiro)': [
    'Benfica', 'Caju', 'Catumbi', 'Centro', 'Cidade Nova', 'Gamboa', 'Glória', 'Lapa', 'Paquetá', 'Santa Teresa', 'Santo Cristo', 'São Cristóvão', 'Saúde'
  ],
  'Zona Norte (Rio de Janeiro)': [
    'Abolição', 'Água Santa', 'Anchieta', 'Barros Filho', 'Bento Ribeiro', 'Bonsucesso', 'Brás de Pina', 'Cachambi', 'Campinho', 'Cascadura', 'Cidade Universitária', 'Coelho Neto', 'Cordovil', 'Del Castilho', 'Encantado', 'Engenho da Rainha', 'Engenho de Dentro', 'Engenho Novo', 'Guadalupe', 'Higienópolis',
    'Grande Tijuca', 'Tijuca', 'Vila Isabel', 'Maracanã', 'Andaraí', 'Grajaú', 'Alto da Boa Vista', 'São Francisco Xavier', 'Rio Comprido', 'Estácio', 'Praça da Bandeira', 'Usina',
    'Grande Méier', 'Méier', 'Inhaúma', 'Pilares', 'Riachuelo', 'Piedade', 'Todos os Santos', 'Rocha', 'Maria da Graça', 'Lins de Vasconcelos',
    'Ilha do Governador', 'Bancários', 'Cacuia', 'Cocotá', 'Freguesia', 'Galeão', 'Jardim Carioca', 'Jardim Guanabara', 'Moneró', 'Pitangueiras', 'Portuguesa', 'Praia da Bandeira', 'Ribeira', 'Tauá', 'Zumbi',
    'Irajá', 'Jardim América', 'Madureira', 'Mangueira', 'Marechal Hermes', 'Olaria', 'Pavuna', 'Penha', 'Penha Circular', 'Ramos', 'Rocha Miranda', 'Vaz Lobo', 'Vicente de Carvalho', 'Vila da Penha', 'Vista Alegre'
  ],
  'Zona Oeste (Rio de Janeiro)': [
    'Bangu', 'Barra de Guaratiba',
    'Barra e Adjacências', 'Barra da Tijuca', 'Recreio dos Bandeirantes', 'Barra Olímpica', 'Freguesia de Jacarepaguá', 'Joá', 'Itanhangá',
    'Camorim',
    'Campo dos Afonsos', 'Campo Grande', 'Cosmos', 'Deodoro', 'Grumari', 'Guaratiba',
    'Jacarepaguá', 'Anil', 'Curicica', 'Pechincha', 'Praça Seca', 'Tanque', 'Taquara', 'Vila Valqueire',
    'Jardim Sulacap', 'Padre Miguel', 'Pedra de Guaratiba', 'Realengo', 'Santa Cruz', 'Santíssimo', 'Senador Vasconcelos', 'Sepetiba', 'Vargem Grande', 'Vargem Pequena', 'Vila Militar', 'Vila Kennedy'
  ],
  'Zona Sul (Rio de Janeiro)': [
    'Botafogo', 'Catete', 'Copacabana', 'Cosme Velho', 'Flamengo', 'Gávea', 'Humaitá', 'Ipanema', 'Jardim Botânico', 'Lagoa', 'Laranjeiras', 'Leblon', 'Leme', 'São Conrado', 'Urca', 'Vidigal'
  ],
};

// Definição das cidades por região do RJ
const cidadesPorRegiaoRJ: Record<string, string[]> = {
  "Região Metropolitana": [
    "Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", 
    "Itaboraí", "Maricá", "Magé", "Guapimirim", "Seropédica", "Paracambi", "Itaguaí", "Mangaratiba", 
    "Tanguá", "Cachoeiras de Macacu", "Rio Bonito"
  ],
  "Região dos Lagos": [
    "Cabo Frio", "Búzios", "Arraial do Cabo", "São Pedro da Aldeia", "Araruama", "Saquarema", 
    "Iguaba Grande", "Silva Jardim", "Casimiro de Abreu"
  ],
  "Região Norte Fluminense": [
    "Campos dos Goytacazes", "Macaé", "Rio das Ostras", "São João da Barra", "São Fidélis", 
    "Conceição de Macabu", "Carapebus", "Quissamã", "São Francisco de Itabapoana"
  ],
  "Região Serrana": [
    "Petrópolis", "Nova Friburgo", "Teresópolis", "Friburgo", "Cantagalo", "Cordeiro", "Macuco", 
    "Bom Jardim", "Duas Barras", "Santa Maria Madalena", "São José do Vale do Rio Preto", 
    "São Sebastião do Alto", "Sumidouro", "Trajano de Moraes", "Carmo"
  ],
  "Região Sul Fluminense": [
    "Volta Redonda", "Barra Mansa", "Resende", "Angra dos Reis", "Paraty", "Barra do Piraí", 
    "Valença", "Rio Claro", "Piraí", "Rio das Flores", "Pinheiral", "Porto Real", "Quatis", 
    "Itatiaia"
  ],
  "Região Centro-Sul Fluminense": [
    "Três Rios", "Paraíba do Sul", "Vassouras", "Miguel Pereira", "Paty do Alferes", "Mendes", 
    "Engenheiro Paulo de Frontin", "Sapucaia", "Areal", "Comendador Levy Gasparian"
  ],
  "Região Noroeste Fluminense": [
    "Itaperuna", "Bom Jesus do Itabapoana", "Porciúncula", "Varre-Sai", "Natividade", 
    "Laje do Muriaé", "Cambuci", "Aperibé", "Santo Antônio de Pádua", "Miracema", 
    "São José de Ubá", "Itaocara", "Cardoso Moreira", "Italva"
  ]
};

// Imagens de fundo por região/estado
const getBackgroundImage = (estado: string): string => {
  const images: Record<string, string> = {
    'RJ': '/visao-panoramica-rio-janeiro.jpg',
    'SP': 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1920&q=80',
  };
  return images[estado] || images['RJ'];
};

export default function StaticCatalog() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { updateURL, clearFiltersFromURL, parseFiltersFromURL } = useFilterParams();
  
  // Estados básicos da página
  const [seoPage, setSeoPage] = useState<SEOPage | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Estados de UI para filtros
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
  
  // Estado para armazenar os filtros de busca
  const [filters, setFilters] = useState<Filters>({});
  
  // Estado para armazenar a lista de cidades
  const [rjCities, setRjCities] = useState<{city: string, count: number}[]>([]);
  
  // Estado para armazenar a lista de bairros
  const [rjNeighborhoods, setRjNeighborhoods] = useState<any>([]);
  
  // Estado para armazenar a cidade selecionada
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  
  // Estado para armazenar os tipos de propriedade
  const [propertyTypes, setPropertyTypes] = useState<{type: string, count: number}[]>([]);
  
  // Estado para armazenar os valores dos inputs
  const [keywordInput, setKeywordInput] = useState("");
  
  // Estado para filtro de data
  const [dataFimSegundoLeilao, setDataFimSegundoLeilao] = useState("");

  // Adicionar estados para múltipla seleção
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SelectedType[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedAuctionTypes, setSelectedAuctionTypes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Estados para busca nos dropdowns
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [neighborhoodSearchTerm, setNeighborhoodSearchTerm] = useState("");

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

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carregar página SEO
  useEffect(() => {
    if (pageId) {
      fetchSEOPage(pageId);
    }
  }, [pageId]);

  // Aplicar filtros da página SEO quando carregada
  useEffect(() => {
    if (seoPage && seoPage.filter_type && seoPage.filter_value) {
      applyInitialFiltersFromSEOPage();
    }
  }, [seoPage]);

  // Carregar cidades e tipos de propriedade
  useEffect(() => {
    if (seoPage) {
      fetchCities();
      fetchPropertyTypes();
    }
  }, [seoPage]);

  // Carregar bairros quando cidade é selecionada
  useEffect(() => {
    if (selectedCityName) {
      fetchNeighborhoodsByCity(selectedCityName);
    }
  }, [selectedCityName]);

  // Carregar imóveis quando filtros mudam
  useEffect(() => {
    if (seoPage && filtersLoaded) {
      fetchProperties();
    }
  }, [filters, currentPage, filtersLoaded, seoPage]);

  const fetchSEOPage = async (pageId: string) => {
    try {
      setLoading(true);
      
      const { data: page, error: pageError } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .single();

      if (pageError) {
        if (pageError.code === 'PGRST116') {
          setError('Página não encontrada');
        } else {
          setError('Erro ao carregar página');
        }
        return;
      }

      if (!page) {
        setError('Página não encontrada');
        return;
      }

      await supabase
        .from('seo_pages')
        .update({ 
          view_count: (page.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', page.id);

      setSeoPage(page);

    } catch (error) {
      console.error('Erro ao buscar página SEO:', error);
      setError('Erro ao carregar página');
    }
  };

  const applyInitialFiltersFromSEOPage = () => {
    if (!seoPage) return;

    const initialFilters: Filters = {};

    if (seoPage.filter_type === 'bairro') {
      initialFilters.neighborhood = seoPage.filter_value;
      setSelectedNeighborhood(seoPage.filter_value);
      setSelectedNeighborhoods([seoPage.filter_value]);
    } else if (seoPage.filter_type === 'zona') {
      initialFilters.zone = seoPage.filter_value;
      const bairrosDaZona = bairrosPorZonaRJ[seoPage.filter_value] || [];
      setSelectedNeighborhoods(bairrosDaZona);
      setSelectedNeighborhood(`${seoPage.filter_value} (todos)`);
    } else if (seoPage.filter_type === 'cidade') {
      initialFilters.city = seoPage.filter_value;
      setSelectedCity(seoPage.filter_value);
      setSelectedCityName(seoPage.filter_value);
      setSelectedCities([seoPage.filter_value]);
    }

    setFilters(initialFilters);
    setFiltersLoaded(true);
  };

  const fetchCities = async () => {
    if (!seoPage) return;
    
    try {
      const cityCount: Record<string, number> = {};
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error } = await supabase
          .from('imoveis')
          .select('cidade', { count: 'exact' })
          .eq('estado', seoPage.estado)
          .gte('leilao_1', 75000)
          .order('cidade')
          .not('cidade', 'is', null)
          .range(from, to);
        
        if (error) throw error;
        
        data.forEach(item => {
          if (item.cidade && item.cidade.trim() !== '') {
            cityCount[item.cidade] = (cityCount[item.cidade] || 0) + 1;
          }
        });
        
        hasMore = data.length === pageSize;
        page++;
        if (page > 50) break;
      }
      
      const citiesArray = Object.keys(cityCount)
        .map(city => ({ city, count: cityCount[city] }))
        .sort((a, b) => b.count - a.count);
      
      setRjCities(citiesArray);
    } catch (err) {
      console.error('Erro ao buscar cidades:', err);
    }
  };

  const fetchPropertyTypes = async () => {
    if (!seoPage) return;
    
    try {
      const { data, error } = await supabase
        .from('imoveis')
        .select('tipo_propriedade')
        .eq('estado', seoPage.estado)
        .gte('leilao_1', 75000)
        .not('tipo_propriedade', 'is', null);
        
      if (error) throw error;
      
      const typeCount: Record<string, number> = {};
      data.forEach(item => {
        if (item.tipo_propriedade && item.tipo_propriedade.trim() !== '') {
          typeCount[item.tipo_propriedade] = (typeCount[item.tipo_propriedade] || 0) + 1;
        }
      });
      
      const typesArray = Object.keys(typeCount)
        .map(type => ({ type, count: typeCount[type] }))
        .sort((a, b) => a.type.localeCompare(b.type, 'pt-BR'));
      
      setPropertyTypes(typesArray);
    } catch (err) {
      console.error('Erro ao buscar tipos de propriedade:', err);
    }
  };

  const fetchNeighborhoodsByCity = async (cityName: string) => {
    if (!seoPage) return;
    
    try {
      // Para Rio de Janeiro, usar a estrutura de zonas
      if (cityName.toLowerCase() === 'rio de janeiro') {
        const neighborhoodsByZone: Record<string, any[]> = {};
        
        for (const zona of Object.keys(bairrosPorZonaRJ)) {
          const bairrosDaZona = bairrosPorZonaRJ[zona];
          
          const { data, error } = await supabase
            .from('imoveis')
            .select('bairro')
            .eq('estado', seoPage.estado)
            .eq('cidade', cityName)
            .gte('leilao_1', 75000)
            .in('bairro', bairrosDaZona);
          
          if (error) throw error;
          
          const bairroCount: Record<string, number> = {};
          data.forEach(item => {
            if (item.bairro) {
              bairroCount[item.bairro] = (bairroCount[item.bairro] || 0) + 1;
            }
          });
          
          neighborhoodsByZone[zona] = Object.keys(bairroCount)
            .map(neighborhood => ({ neighborhood, count: bairroCount[neighborhood] }))
            .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood, 'pt-BR'));
        }
        
        setRjNeighborhoods(neighborhoodsByZone);
      } else {
        // Para outras cidades, buscar bairros normalmente
        const { data, error } = await supabase
          .from('imoveis')
          .select('bairro')
          .eq('estado', seoPage.estado)
          .eq('cidade', cityName)
          .gte('leilao_1', 75000)
          .not('bairro', 'is', null);
        
        if (error) throw error;
        
        const bairroCount: Record<string, number> = {};
        data.forEach(item => {
          if (item.bairro && item.bairro.trim() !== '') {
            bairroCount[item.bairro] = (bairroCount[item.bairro] || 0) + 1;
          }
        });
        
        const neighborhoodsArray = Object.keys(bairroCount)
          .map(neighborhood => ({ neighborhood, count: bairroCount[neighborhood] }))
          .sort((a, b) => a.neighborhood.localeCompare(b.neighborhood, 'pt-BR'));
        
        setRjNeighborhoods(neighborhoodsArray);
      }
    } catch (err) {
      console.error('Erro ao buscar bairros:', err);
    }
  };

  const fetchProperties = async () => {
    if (!seoPage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('imoveis')
        .select('*', { count: 'exact' })
        .eq('estado', seoPage.estado)
        .gte('leilao_1', 75000);

      // Aplicar filtros
      if (filters.city) {
        const cidades = filters.city.split(',').map(c => c.trim()).filter(Boolean);
        if (cidades.length > 1) {
          query = query.in('cidade', cidades);
        } else {
          query = query.eq('cidade', filters.city);
        }
      }

      if (filters.type && filters.type !== "Todos os imóveis") {
        const tipos = filters.type.split(',').map(t => t.trim()).filter(Boolean);
        if (tipos.length > 1) {
          query = query.in('tipo_propriedade', tipos);
        } else {
          query = query.eq('tipo_propriedade', filters.type);
        }
      }

      if (filters.zones && filters.zones.length > 0) {
        let todosBairrosDasZonas: string[] = [];
        for (const zona of filters.zones) {
          const bairrosDaZona = bairrosPorZonaRJ[zona] || [];
          todosBairrosDasZonas = [...todosBairrosDasZonas, ...bairrosDaZona];
        }
        if (todosBairrosDasZonas.length > 0) {
          query = query.in('bairro', todosBairrosDasZonas);
        }
      } else if (filters.zone) {
        const bairrosDaZona = bairrosPorZonaRJ[filters.zone] || [];
        if (bairrosDaZona.length > 0) {
          query = query.in('bairro', bairrosDaZona);
        }
      } else if (filters.neighborhood) {
        const bairros = filters.neighborhood.split(',').map(b => b.trim()).filter(Boolean);
        if (bairros.length > 1) {
          query = query.in('bairro', bairros);
        } else {
          query = query.eq('bairro', filters.neighborhood);
        }
      }

      if (filters.keyword) {
        const sanitizedKeyword = sanitizeSearchInput(filters.keyword);
        if (sanitizedKeyword) {
          query = query.or(`titulo_propriedade.ilike.%${sanitizedKeyword}%,endereco.ilike.%${sanitizedKeyword}%,descricao.ilike.%${sanitizedKeyword}%`);
        }
      }

      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          query = query.gte('leilao_1', filters.priceRange.min);
        }
        if (filters.priceRange.max !== undefined) {
          query = query.lte('leilao_1', filters.priceRange.max);
        }
      }

      if (filters.auctionType) {
        if (filters.auctionType === "EXTRAJUDICIAL_CUSTOM") {
          query = query.eq('tipo_leilao', 'EXTRAJUDICIAL');
        } else if (filters.auctionType === "EXTRAJUDICIAL_COMPOSTO") {
          query = query.in('tipo_leilao', ['EXTRAJUDICIAL', 'EXTRAJUDICIAL FINANCIÁVEL']);
        } else if (filters.auctionType === "Judicial") {
          query = query.eq('tipo_leilao', 'JUDICIAL');
        } else {
          query = query.eq('tipo_leilao', filters.auctionType);
        }
      }

      if (filters.financiamento === true) {
        query = query.eq('financiamento', true);
      }

      if (filters.fgts === true) {
        query = query.eq('fgts', true);
      }

      if (filters.parcelamento === true) {
        query = query.eq('parcelamento', true);
      }

      if (filters.dataFimSegundoLeilao) {
        query = query.lte('data_leilao_2', filters.dataFimSegundoLeilao);
      }

      // Filtro de data para leilões futuros
      if (!filters.dataFimSegundoLeilao) {
        const currentDate = new Date().toISOString();
        query = query.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDate},data_leilao_2.gte.${currentDate}`);
      }

      // Contar total
      const countQuery = query;
      const { count } = await countQuery;
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      // Buscar página atual
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error: queryError } = await query
        .order('data_leilao_1', { ascending: true, nullsFirst: false })
        .range(from, to);

      if (queryError) {
        console.error('Erro ao buscar imóveis:', queryError);
        setError('Erro ao carregar imóveis');
      } else {
        // Deduplicar imóveis por ID para evitar duplicatas na listagem
        const uniqueProperties = data ? 
          data.filter((property, index, self) => 
            index === self.findIndex((p) => p.id === property.id)
          ) : [];
        setProperties(uniqueProperties);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      setError('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  // Funções de toggle para dropdowns
  const toggleTypeMenu = () => {
    setShowTypeMenu(!showTypeMenu);
    setShowCityMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
  };

  const toggleCityMenu = () => {
    setShowCityMenu(!showCityMenu);
    setShowTypeMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
  };

  const toggleNeighborhoodMenu = () => {
    setShowNeighborhoodMenu(!showNeighborhoodMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowPriceMenu(false);
    setShowAuctionTypeMenu(false);
  };

  const togglePriceMenu = () => {
    setShowPriceMenu(!showPriceMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowNeighborhoodMenu(false);
    setShowAuctionTypeMenu(false);
  };

  const toggleAuctionTypeMenu = () => {
    setShowAuctionTypeMenu(!showAuctionTypeMenu);
    setShowTypeMenu(false);
    setShowCityMenu(false);
    setShowNeighborhoodMenu(false);
    setShowPriceMenu(false);
  };

  // Função para selecionar tipo de propriedade
  const togglePropertyType = (typeName: string, icon: JSX.Element, originalValue?: string) => {
    if (typeName === "Todos os imóveis") {
      setSelectedTypes([]);
      setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
      return;
    }

    const typeExists = selectedTypes.some(type => type.label === typeName);
    
    if (typeExists) {
      const newTypes = selectedTypes.filter(type => type.label !== typeName);
      setSelectedTypes(newTypes);
      if (newTypes.length === 0) {
        setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
      } else if (newTypes.length === 1) {
        setSelectedType(newTypes[0]);
      } else {
        setSelectedType({ label: `${newTypes.length} tipos selecionados`, icon: <Home className="h-4 w-4" /> });
      }
    } else {
      const newTypes = [...selectedTypes, { label: typeName, icon, originalValue }];
      setSelectedTypes(newTypes);
      if (newTypes.length === 1) {
        setSelectedType(newTypes[0]);
      } else {
        setSelectedType({ label: `${newTypes.length} tipos selecionados`, icon: <Home className="h-4 w-4" /> });
      }
    }
  };

  // Função para selecionar cidade
  const toggleCity = (cityName: string) => {
    const cityExists = selectedCities.includes(cityName);
    
    if (cityExists) {
      const newCities = selectedCities.filter(c => c !== cityName);
      setSelectedCities(newCities);
      if (newCities.length === 0) {
        setSelectedCity("Selecione a cidade");
        setSelectedCityName("");
      } else if (newCities.length === 1) {
        setSelectedCity(newCities[0]);
        setSelectedCityName(newCities[0]);
      } else {
        setSelectedCity(`${newCities.length} cidades selecionadas`);
        setSelectedCityName(newCities[0]);
      }
    } else {
      const newCities = [...selectedCities, cityName];
      setSelectedCities(newCities);
      if (newCities.length === 1) {
        setSelectedCity(cityName);
        setSelectedCityName(cityName);
      } else {
        setSelectedCity(`${newCities.length} cidades selecionadas`);
      }
    }
    
    // Limpar bairros quando cidade muda
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
  };

  // Função para selecionar bairro
  const toggleNeighborhood = (neighborhoodName: string) => {
    const neighborhoodExists = selectedNeighborhoods.includes(neighborhoodName);
    
    if (neighborhoodExists) {
      const newNeighborhoods = selectedNeighborhoods.filter(n => n !== neighborhoodName);
      setSelectedNeighborhoods(newNeighborhoods);
      if (newNeighborhoods.length === 0) {
        setSelectedNeighborhood("Selecione o bairro");
      } else if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(newNeighborhoods[0]);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    } else {
      const newNeighborhoods = [...selectedNeighborhoods, neighborhoodName];
      setSelectedNeighborhoods(newNeighborhoods);
      if (newNeighborhoods.length === 1) {
        setSelectedNeighborhood(neighborhoodName);
      } else {
        setSelectedNeighborhood(`${newNeighborhoods.length} bairros selecionados`);
      }
    }
  };

  // Função para selecionar zona
  const toggleZone = (zoneName: string) => {
    const bairrosDaZona = bairrosPorZonaRJ[zoneName] || [];
    setSelectedNeighborhoods(bairrosDaZona);
    setSelectedNeighborhood(`${zoneName} (todos)`);
  };

  // Função para selecionar faixa de preço
  const togglePriceRange = (priceRange: PriceRange) => {
    if (priceRange.label === 'Todos os preços') {
      setSelectedPriceRanges([]);
      setSelectedPriceRange({ label: 'Todos os preços' });
      return;
    }

    const rangeExists = selectedPriceRanges.some(range => range.label === priceRange.label);
    
    if (rangeExists) {
      const newRanges = selectedPriceRanges.filter(range => range.label !== priceRange.label);
      setSelectedPriceRanges(newRanges);
      if (newRanges.length === 0) {
        setSelectedPriceRange({ label: 'Todos os preços' });
      } else if (newRanges.length === 1) {
        setSelectedPriceRange(newRanges[0]);
      } else {
        setSelectedPriceRange({ label: `${newRanges.length} faixas selecionadas` });
      }
    } else {
      const newRanges = [...selectedPriceRanges, priceRange];
      setSelectedPriceRanges(newRanges);
      if (newRanges.length === 1) {
        setSelectedPriceRange(priceRange);
      } else {
        setSelectedPriceRange({ label: `${newRanges.length} faixas selecionadas` });
      }
    }
  };

  // Função para selecionar tipo de leilão
  const toggleAuctionType = (auctionType: string) => {
    if (auctionType === "Todos os tipos de leilão") {
      setSelectedAuctionTypes([]);
      setSelectedAuctionType("Todos os tipos de leilão");
      return;
    }

    const typeExists = selectedAuctionTypes.includes(auctionType);
    
    if (typeExists) {
      const newTypes = selectedAuctionTypes.filter(type => type !== auctionType);
      setSelectedAuctionTypes(newTypes);
      if (newTypes.length === 0) {
        setSelectedAuctionType("Todos os tipos de leilão");
      } else if (newTypes.length === 1) {
        setSelectedAuctionType(newTypes[0]);
      } else {
        setSelectedAuctionType(`${newTypes.length} tipos selecionados`);
      }
    } else {
      const newTypes = [...selectedAuctionTypes, auctionType];
      setSelectedAuctionTypes(newTypes);
      if (newTypes.length === 1) {
        setSelectedAuctionType(auctionType);
      } else {
        setSelectedAuctionType(`${newTypes.length} tipos selecionados`);
      }
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    const newFilters: Filters = {};

    // Cidade
    if (selectedCities.length > 0) {
      newFilters.city = selectedCities.join(',');
    }

    // Tipo de propriedade
    if (selectedTypes.length > 0) {
      newFilters.type = selectedTypes.map(t => t.originalValue || t.label).join(',');
    }

    // Bairros/Zonas
    if (selectedNeighborhoods.length > 0) {
      newFilters.neighborhood = selectedNeighborhoods.join(',');
    }

    // Faixa de preço
    if (selectedPriceRanges.length > 0) {
      const allMins = selectedPriceRanges.map(range => range.min ?? 0);
      const allMaxs = selectedPriceRanges.filter(range => range.max !== undefined).map(range => range.max!);
      
      newFilters.priceRange = {
        min: Math.min(...allMins),
        max: allMaxs.length > 0 ? Math.max(...allMaxs) : undefined
      };
      newFilters.priceRanges = selectedPriceRanges.map(range => range.label);
    }

    // Tipo de leilão
    if (selectedAuctionTypes.length > 0) {
      const hasJudicial = selectedAuctionTypes.includes(AUCTION_TYPE_JUDICIAL);
      const hasExtrajudicial = selectedAuctionTypes.includes(AUCTION_TYPE_EXTRAJUDICIAL);
      const hasExtrajudicialFinanciamento = selectedAuctionTypes.includes(AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO);

      if (hasExtrajudicial && hasExtrajudicialFinanciamento && !hasJudicial) {
        newFilters.auctionType = "EXTRAJUDICIAL_COMPOSTO";
      } else if (hasExtrajudicialFinanciamento && !hasExtrajudicial && !hasJudicial) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
        newFilters.financiamento = true;
      } else if (hasExtrajudicial && !hasExtrajudicialFinanciamento && !hasJudicial) {
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
      } else if (hasJudicial && !hasExtrajudicial && !hasExtrajudicialFinanciamento) {
        newFilters.auctionType = "Judicial";
      }
    }

    // Palavra-chave
    if (keywordInput.trim()) {
      newFilters.keyword = keywordInput.trim();
    }

    // Data de encerramento
    if (dataFimSegundoLeilao) {
      newFilters.dataFimSegundoLeilao = dataFimSegundoLeilao;
    }

    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters);
    
    // Fechar menu de filtros no mobile
    if (isMobile) {
      setIsFilterOpen(false);
    }
    
    toast.success('Filtros aplicados!');
  };

  // Limpar filtros
  const clearAllFilters = () => {
    // Manter o filtro inicial da página SEO
    if (seoPage) {
      applyInitialFiltersFromSEOPage();
    } else {
      setFilters({});
    }
    
    setSelectedType({ label: "Todos os imóveis", icon: <Globe className="h-4 w-4" /> });
    setSelectedTypes([]);
    setSelectedPriceRange({ label: "Todos os preços" });
    setSelectedPriceRanges([]);
    setSelectedAuctionType("Todos os tipos de leilão");
    setSelectedAuctionTypes([]);
    setKeywordInput("");
    setDataFimSegundoLeilao("");
    setCurrentPage(1);
    
    clearFiltersFromURL();
    toast.success('Filtros limpos!');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent(
      seoPage 
        ? `Olá! Tenho interesse em imóveis em leilão em ${seoPage.regiao}/${seoPage.estado}. Gostaria de mais informações.`
        : 'Olá! Gostaria de mais informações sobre imóveis em leilão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const getCanonicalUrl = () => {
    if (!seoPage) return '';
    return `https://imoveis.leilaodeimoveis-cataldosiston.com/catalogo/${seoPage.page_id}`;
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setShowTypeMenu(false);
        setShowCityMenu(false);
        setShowNeighborhoodMenu(false);
        setShowPriceMenu(false);
        setShowAuctionTypeMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading && !seoPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d68e08] mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || !seoPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 font-body mb-6">{error || 'Esta página não existe ou foi removida.'}</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2 bg-[#d68e08] hover:bg-[#b87a07]">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const title = seoPage.h1_title || `Imóveis em Leilão em ${seoPage.regiao}`;
  const introText = seoPage.intro_text || `Receba oportunidades de leilões personalizadas, de acordo com o seu perfil.`;
  const backgroundImage = getBackgroundImage(seoPage.estado);

  return (
    <>
      <SEO 
        title={seoPage.meta_title}
        description={seoPage.meta_description}
        keywords={seoPage.meta_keywords || ''}
        canonicalUrl={getCanonicalUrl()}
      />
      
      {/* Sprint 7 - Fallback para SEO quando JavaScript está desabilitado */}
      <NoScriptFallback
        pageTitle={seoPage.meta_title}
        pageDescription={seoPage.meta_description}
        region={seoPage.regiao}
        estado={seoPage.estado}
      />
      
      <SocialBar onWhatsAppClick={handleWhatsAppClick} />
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <div 
            className="bg-cover bg-center bg-no-repeat h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] relative"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          >
            <div className="absolute inset-0 bg-black/15"></div>
            
            <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
              <div className="max-w-[960px] w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                <div className="flex-1 max-w-[512px] text-center lg:text-left lg:ml-[100px]">
                  <div className="mb-4 sm:mb-6">
                    <h1 
                      className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight lg:leading-[52.8px] mb-4" 
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {title}
                    </h1>
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <p 
                      className="text-white font-bold text-base sm:text-lg md:text-xl leading-relaxed" 
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      {introText}
                    </p>
                  </div>
                  
                  <div className="flex justify-center lg:justify-start">
                    <button
                      onClick={handleWhatsAppClick}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-[#6d4403] via-[#b57309] to-[#d48d07] text-white rounded-full px-4 sm:px-6 md:px-7 py-3 sm:py-4 font-normal text-sm sm:text-base md:text-[19.8px] leading-relaxed hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      <span className="text-center">Quero receber novas oportunidades</span>
                      <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-7 flex-shrink-0" />
                    </button>
                  </div>
                </div>
                
                <div className="w-[383px] hidden xl:block"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Vídeo + Títulos */}
        <section className="relative -mt-16 sm:-mt-20 pt-16 sm:pt-20">
          <div 
            className="bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[450px] md:min-h-[506px] relative"
            style={{ backgroundImage: "url('/fundo-marmore-1-webp.png')" }}
          >
            <div className="container mx-auto relative z-10 py-8 sm:py-10 md:py-12 px-4">
              <div className="max-w-[1170px] mx-auto">
                {/* Player de vídeo */}
                <div className="mb-6 sm:mb-8 flex justify-center">
                  <div className="relative w-full max-w-[560px] aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/G8Wp2ju3CaU"
                      title="Como funciona nossa assessoria em leilões de imóveis"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
                
                {/* Títulos das oportunidades */}
                <div className="max-w-[960px] mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden md:flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        
                        <h2 
                          className="text-[#191919] font-medium text-lg sm:text-xl md:text-2xl text-center px-4"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          OPORTUNIDADES DE IMÓVEIS EM LEILÃO
                        </h2>
                        
                        <div className="hidden md:flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-[#191919] font-medium text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center mb-8 sm:mb-10 md:mb-12 px-4"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Imóveis até 50% abaixo da sua avaliação
                    </h3>
                    
                    <div className="px-4 sm:px-6">
                      <p 
                        className="text-[#191919] font-normal text-sm sm:text-base md:text-[17.6px] leading-relaxed text-center max-w-4xl mx-auto"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
                      >
                        Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia. 
                        Entenda como funciona o nosso{" "}
                        <span className="font-bold">estudo de viabilidade jurídica</span>{" "}
                        clicando{" "}
                        <a href="https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-importancia-analise-juridica/" className="text-[#d48d07] font-bold hover:underline" target="_blank" rel="noopener noreferrer">
                          aqui
                        </a>{" "}
                        ou entre em contato conosco
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Descrição da Região */}
        {seoPage.region_description && (
          <section className="bg-white py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 
                  className="text-[#191919] font-medium text-xl sm:text-2xl md:text-3xl text-center mb-6"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Sobre {seoPage.regiao}
                </h2>
                <p 
                  className="text-[#333333] text-base md:text-lg leading-relaxed text-center"
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {seoPage.region_description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            SEÇÃO DE FILTROS (igual /leilao-rj)
            ============================================ */}
        <section className="bg-[#f5f5f5] py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Botão mobile para abrir/fechar filtros */}
            <div className="md:hidden mb-4">
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
                      
                      {propertyTypes.map((typeData, index) => {
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
                        
                        const formattedTypeName = typeData.type.charAt(0).toUpperCase() + typeData.type.slice(1).toLowerCase();
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
                              onChange={() => {}}
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
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">CIDADES DO {seoPage.estado}</div>
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
                      
                      {seoPage.estado === 'RJ' ? (
                        Object.keys(cidadesPorRegiaoRJ)
                          .filter(regiao => 
                            citySearchTerm === '' || 
                            flexibleSearch(regiao, citySearchTerm) ||
                            cidadesPorRegiaoRJ[regiao].some(cidade => 
                              flexibleSearch(cidade, citySearchTerm)
                            )
                          )
                          .map((regiao) => (
                          <div key={regiao}>
                            {(citySearchTerm === '' || flexibleSearch(regiao, citySearchTerm)) && (
                              <div className="py-2 px-4 font-bold text-primary bg-gray-100 border-b border-gray-200">
                                {regiao}
                              </div>
                            )}
                            {cidadesPorRegiaoRJ[regiao]
                              .filter(cidade => 
                                citySearchTerm === '' || 
                                flexibleSearch(cidade, citySearchTerm)
                              )
                              .map((cidade) => {
                              const isSelected = selectedCities.includes(cidade);
                              return (
                                <div
                                  key={cidade}
                                  className={`py-2 px-4 flex items-center cursor-pointer ${
                                    isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCity(cidade);
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  {cidade}
                                </div>
                              );
                            })}
                          </div>
                        ))
                      ) : (
                        rjCities
                          .filter(cityData => 
                            citySearchTerm === '' || 
                            flexibleSearch(cityData.city, citySearchTerm)
                          )
                          .map((cityData) => {
                          const isSelected = selectedCities.includes(cityData.city);
                          return (
                            <div
                              key={cityData.city}
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
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              {cityData.city} ({cityData.count})
                            </div>
                          );
                        })
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
                      
                      {selectedCityName.toLowerCase() === 'rio de janeiro' && typeof rjNeighborhoods === 'object' && !Array.isArray(rjNeighborhoods) ? (
                        Object.keys(rjNeighborhoods)
                          .filter(zona => 
                            neighborhoodSearchTerm === '' || 
                            flexibleSearch(zona, neighborhoodSearchTerm) ||
                            rjNeighborhoods[zona]?.some((n: any) => flexibleSearch(n.neighborhood, neighborhoodSearchTerm))
                          )
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
                              ?.filter((neighborhoodData: any) => 
                                neighborhoodSearchTerm === '' || 
                                flexibleSearch(neighborhoodData.neighborhood, neighborhoodSearchTerm)
                              )
                              .map((neighborhoodData: any) => {
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
                                      onChange={() => {}}
                                      className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    {neighborhoodData.neighborhood}
                                  </div>
                                );
                              })}
                          </div>
                        ))
                      ) : Array.isArray(rjNeighborhoods) ? (
                        rjNeighborhoods
                          .filter((neighborhoodData: any) => 
                            neighborhoodSearchTerm === '' || 
                            flexibleSearch(neighborhoodData.neighborhood, neighborhoodSearchTerm)
                          )
                          .map((neighborhoodData: any) => {
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
                                  onChange={() => {}}
                                  className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                {neighborhoodData.neighborhood}
                              </div>
                            );
                          })
                      ) : (
                        <div className="py-2 px-4 text-gray-500">Nenhum bairro encontrado</div>
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
                              onChange={() => {}}
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
              
              {/* Segunda linha de selects */}
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
                              onChange={() => {}}
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
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
            
            {/* Contagem de resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 px-1">
              <div className="text-sm sm:text-base font-bold mb-3 sm:mb-0">
                <span className="text-teal-800">{totalCount}</span> oportunidades encontradas
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Imóveis */}
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4">
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
                {properties.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <h3 className="font-display text-xl font-medium text-[#191919] mb-2">
                      Nenhum imóvel encontrado
                    </h3>
                    <p className="text-[#333333] font-body mb-6 max-w-md mx-auto">
                      Não encontramos imóveis em leilão com os filtros selecionados. 
                      Tente ajustar os filtros ou limpar a busca.
                    </p>
                    <Button 
                      onClick={clearAllFilters} 
                      className="bg-[#d68e08] hover:bg-[#b87a07]"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        image={property.imagem || ''}
                        title={property.titulo_propriedade || 'Imóvel em Leilão'}
                        location={`${property.bairro || ''}, ${property.cidade || ''}, ${property.estado || ''}`}
                        firstAuctionDate={property.data_leilao_1 || ''}
                        firstAuctionValue={property.leilao_1 ? formatCurrency(property.leilao_1) : 'Consulte'}
                        secondAuctionDate={property.data_leilao_2 || ''}
                        secondAuctionValue={property.leilao_2 ? formatCurrency(property.leilao_2) : 'Consulte'}
                        tipoLeilao={property.tipo_leilao}
                        fgts={property.fgts}
                        financiamento={property.financiamento}
                        parcelamento={property.parcelamento}
                        rawPropertyData={property}
                        onContactClick={handleWhatsAppClick}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {properties.length > 0 && totalPages > 1 && (
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

        {/* CTA de Apoio */}
        <SupportCTA estado={seoPage.estado} />

        {/* Conteúdo Complementar da Região */}
        {seoPage.region_content && (
          <RegionContentSection
            regionName={seoPage.regiao}
            content={typeof seoPage.region_content === 'string' 
              ? JSON.parse(seoPage.region_content) 
              : seoPage.region_content}
          />
        )}

        {/* Casos de Sucesso - Sprint 7 */}
        <SuccessCasesSection region={seoPage.regiao} />

        {/* Depoimentos */}
        <TestimonialsSection />

        {/* Newsletter */}
        <NewsletterBottomSection />
      </main>
      
      <Footer />
    </>
  );
}
