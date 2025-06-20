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
import { PropertyDetailAuctionSteps } from "@/components/PropertyDetailAuctionSteps";
import { Footer } from "@/components/Footer";
import { Search, MessageCircle, Filter, X, MapPin, ChevronDown, Home, Building, Tractor, Trees, FileText, Globe, DollarSign, CalendarIcon, Car, SquareStack, Warehouse, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Definição dos bairros por zona do Rio de Janeiro
const bairrosPorZonaRJ: Record<string, string[]> = {
  'Zona Central': [
    'Benfica', 'Caju', 'Catumbi', 'Centro', 'Cidade Nova', 'Estácio', 'Gamboa', 'Glória', 'Lapa', 'Paquetá', 'Rio Comprido', 'Santa Teresa', 'Santo Cristo', 'São Cristóvão', 'Saúde'
  ],
  'Zona Norte': [
    'Abolição', 'Acari', 'Água Santa', 'Alto da Boa Vista', 'Anchieta', 'Andaraí', 'Barros Filho', 'Bento Ribeiro', 'Bonsucesso', 'Brás de Pina', 'Cachambi', 'Campinho', 'Cascadura', 'Cavalcanti', 'Cidade Universitária', 'Coelho Neto', 'Colégio', 'Cordovil', 'Costa Barros', 'Del Castilho', 'Encantado', 'Engenheiro Leal', 'Engenho da Rainha', 'Engenho de Dentro', 'Engenho Novo', 'Grajaú', 'Guadalupe', 'Higienópolis', 'Honório Gurgel', 
    // Ilha do Governador (mantida na busca principal com sub-bairros)
    'Ilha do Governador', 'Bancários', 'Cacuia', 'Cocotá', 'Freguesia', 'Galeão', 'Jardim Carioca', 'Jardim Guanabara', 'Moneró', 'Pitangueiras', 'Portuguesa', 'Praia da Bandeira', 'Ribeira', 'Tauá', 'Zumbi',
    'Inhaúma', 'Irajá', 'Jacaré', 'Jardim América', 'Lins de Vasconcelos', 'Madureira', 'Mangueira', 'Manguinhos', 'Maracanã', 'Marechal Hermes', 'Maria da Graça', 'Méier', 'Olaria', 'Oswaldo Cruz', 'Parada de Lucas', 'Pavuna', 'Penha', 'Penha Circular', 'Piedade', 'Pilares', 'Praça da Bandeira', 'Quintino Bocaiuva', 'Ramos', 'Riachuelo', 'Ricardo de Albuquerque', 'Rocha', 'Rocha Miranda', 'Sampaio', 'São Francisco Xavier', 'Tijuca', 'Todos os Santos', 'Tomás Coelho', 'Turiaçu', 'Vaz Lobo', 'Vicente de Carvalho', 'Vila da Penha', 'Vila Isabel', 'Vista Alegre'
  ],
  'Zona Oeste': [
    'Bangu', 'Barra da Tijuca', 'Barra de Guaratiba',
    // Barra Olímpica (mantida na busca principal com sub-bairros)
    'Barra Olímpica', 'Camorim',
    'Campo dos Afonsos', 'Campo Grande', 'Cosmos', 'Deodoro', 'Grumari', 'Guaratiba', 'Inhoaíba', 'Itanhangá',
    // Jacarepaguá (mantida na busca principal com sub-bairros)
    'Jacarepaguá', 'Anil', 'Curicica', 'Freguesia', 'Pechincha', 'Praça Seca', 'Tanque', 'Taquara', 'Vila Valqueire',
    'Jardim Sulacap', 'Joá', 'Magalhães Bastos', 'Paciência', 'Padre Miguel', 'Pedra de Guaratiba', 'Realengo', 'Recreio dos Bandeirantes', 'Santa Cruz', 'Santíssimo', 'Senador Camará', 'Senador Vasconcelos', 'Sepetiba', 'Vargem Grande', 'Vargem Pequena', 'Vila Militar'
  ],
  'Zona Sul': [
    'Botafogo', 'Catete', 'Copacabana', 'Cosme Velho', 'Flamengo', 'Gávea', 'Humaitá', 'Ipanema', 'Jardim Botânico', 'Lagoa', 'Laranjeiras', 'Leblon', 'Leme', 'São Conrado', 'Urca'
  ]
};

// Definição das áreas especiais e seus sub-bairros
const areasEspeciaisRJ: Record<string, string[]> = {
  'Ilha do Governador': [
    'Ilha do Governador', 'Bancários', 'Cacuia', 'Cocotá', 'Freguesia', 'Galeão', 'Jardim Carioca', 'Jardim Guanabara', 'Moneró', 'Pitangueiras', 'Portuguesa', 'Praia da Bandeira', 'Ribeira', 'Tauá', 'Zumbi'
  ],
  'Barra Olímpica': [
    'Barra Olímpica', 'Barra da Tijuca', 'Camorim', 'Jacarepaguá'
  ],
  'Jacarepaguá': [
    'Jacarepaguá', 'Anil', 'Curicica', 'Freguesia', 'Pechincha', 'Praça Seca', 'Tanque', 'Taquara', 'Vila Valqueire'
  ]
};

const AUCTION_TYPE_JUDICIAL = "JUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL = "EXTRAJUDICIAL";
const AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO = "EXTRAJUDICIAL FINANCIÁVEL";

// Definição das cidades por região do RJ
const cidadesPorRegiaoRJ: Record<string, string[]> = {
  "Região Capital": ["Rio de Janeiro"],
  "Região Serrana": ["Petrópolis", "Três Rios", "Nova Friburgo", "Teresópolis", "Magé"],
  "Região Norte Fluminense": ["Campos dos Goytacazes", "Itaperuna", "Macaé"],
  "Região Sul Fluminense": ["Volta Redonda", "Resende", "Angra dos Reis", "Barra do Piraí"],
  "Região Baixada Fluminense": ["São João de Meriti", "Duque de Caxias", "Nova Iguaçu"],
  "Região Niterói e Baixada Litorânea": ["Niterói", "Itaboraí", "São Pedro da Aldeia", "São Gonçalo"]
};

const Index = () => {
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

  // Adicionar estados e função para o modal de interesse
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestName, setInterestName] = useState("");
  const [interestPhone, setInterestPhone] = useState("");
  const [interestEmail, setInterestEmail] = useState("");

  // Carregar as cidades do estado RJ
  useEffect(() => {
    const fetchRjCities = async () => {
      try {
        // Iniciar um objeto para contagem de cidades
        const cityCount: Record<string, number> = {};
        
        // Buscar todos os registros com paginação
        let page = 0;
        const pageSize = 1000;
        let hasMore = true;
        
        while (hasMore) {
          const from = page * pageSize;
          const to = from + pageSize - 1;
          
          const { data, error, count } = await supabase
            .from('leiloes_imoveis')
            .select('cidade', { count: 'exact' })
            .eq('estado', 'RJ')
            .order('cidade')
            .not('cidade', 'is', null)
            .range(from, to);
          
          if (error) throw error;
          
          // Processar os dados desta página
          data.forEach(item => {
            if (item.cidade && item.cidade.trim() !== '') {
              cityCount[item.cidade] = (cityCount[item.cidade] || 0) + 1;
            }
          });
          
          // Verificar se há mais páginas
          hasMore = data.length === pageSize;
          page++;
          
          // Segurança para evitar loops infinitos
          if (page > 50) break;
        }
        
        // Converter para array para usar no dropdown
        const citiesArray = Object.keys(cityCount)
          .map(city => ({
            city,
            count: cityCount[city]
          }))
          .sort((a, b) => {
            // Primeiro ordenar por contagem decrescente
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            // Se a contagem for igual, ordenar alfabeticamente
            return a.city.localeCompare(b.city, 'pt-BR');
          });
        
        console.log(`Total de cidades encontradas: ${citiesArray.length}`);
        setRjCities(citiesArray);
      } catch (err) {
        console.error('Erro ao buscar cidades do RJ:', err);
      }
    };

    // Buscar tipos de propriedade
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('leiloes_imoveis')
          .select('tipo_propriedade')
          .eq('estado', 'RJ')
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



    fetchRjCities();
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
          .eq('estado', 'RJ');
          
        // Adicionar filtros se existirem
        if (filters.city) {
          const cidades = filters.city.split(',').map(c => c.trim()).filter(Boolean);
          if (cidades.length > 1) {
            query = query.in('cidade', cidades);
          } else {
            query = query.eq('cidade', filters.city);
          }
        }
        
        if (filters.type && filters.type !== "Todos os imóveis") {
          // Usar diretamente o valor original do tipo_propriedade sem converter para minúsculas
          query = query.eq('tipo_propriedade', filters.type);
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
        
        // Adicionar filtro de data para considerar apenas leilões futuros ou sem data na contagem
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
    if (selectedCities.length > 0) {
      newFilters.city = selectedCities.join(','); // Passa como string separada por vírgula
    } else if (selectedCity && selectedCity !== "Selecione a cidade") {
      // Compatibilidade: se só uma cidade foi selecionada pelo modo antigo
      const cityName = selectedCity.split(" (")[0];
      newFilters.city = cityName;
    }
    
    // Verificar se há tipo selecionado
    if (selectedType && selectedType.label !== "Todos os imóveis") {
      // Usar o valor original do tipo_propriedade
      newFilters.type = selectedType.originalValue || selectedType.label.split(" (")[0];
    }
    
    // Verificar se há bairros selecionados (pode ser 1 ou vários)
    if (selectedNeighborhoods.length > 0) {
      newFilters.neighborhood = selectedNeighborhoods.join(','); // Passa como string separada por vírgula
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
    
    // Adicionar filtro de faixa de preço
    if (selectedPriceRange && selectedPriceRange.label !== "Todos os preços") {
      newFilters.priceRange = {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max
      };
    }
    
    // Adicionar filtro de tipo de leilão conforme as novas regras
    if (selectedAuctionType && selectedAuctionType !== "Todos os tipos de leilão") {
      if (selectedAuctionType === AUCTION_TYPE_JUDICIAL) {
        // JUDICIAL: tipo_leilao = "Judicial"
        newFilters.auctionType = "Judicial";
      } else if (selectedAuctionType === AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO) {
        // EXTRAJUDICIAL FINANCIÁVEL: tipo_leilao != "Judicial" && financiamento = true
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
        newFilters.financiamento = true;
      } else if (selectedAuctionType === AUCTION_TYPE_EXTRAJUDICIAL) {
        // EXTRAJUDICIAL: tipo_leilao != "Judicial"
        newFilters.auctionType = "EXTRAJUDICIAL_CUSTOM";
      }
    }
    
    // Aplicar filtros
    setFilters(newFilters);
    
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
  
  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedCityName(city);
    setSelectedCities([city]);
    setShowRegionMenu(false);
    setSelectedRegion(null);
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
    fetchNeighborhoodsByCity(city);
  };
  
  const selectRegion = (region: string) => {
    const cidades = cidadesPorRegiaoRJ[region] || [];
    setSelectedCity(`${region} (todos)`);
    setSelectedCityName(region);
    setSelectedCities(cidades);
    setShowRegionMenu(false);
    setSelectedRegion(null);
    setSelectedNeighborhood("Selecione o bairro");
    setSelectedNeighborhoods([]);
    // Não buscar bairros, pois não é uma cidade única
  };
  
  const selectNeighborhood = (neighborhood: string) => {
    // Verificar se é uma área especial
    if (areasEspeciaisRJ[neighborhood]) {
      // Se for área especial, incluir todos os sub-bairros
      setSelectedNeighborhood(neighborhood);
      setSelectedNeighborhoods(areasEspeciaisRJ[neighborhood]);
    } else {
      // Comportamento normal para bairros individuais
      setSelectedNeighborhood(neighborhood);
      setSelectedNeighborhoods([neighborhood]);
    }
    setShowNeighborhoodMenu(false);
  };
  
  const selectZone = (zone: string) => {
    // Seleciona todos os bairros da zona
    const bairros = bairrosPorZonaRJ[zone] || [];
    setSelectedNeighborhood(`${zone} (todos)`);
    setSelectedNeighborhoods(bairros);
    setShowNeighborhoodMenu(false);
  };
  
  const selectPriceRange = (priceRange: PriceRange) => {
    setSelectedPriceRange(priceRange);
    setShowPriceMenu(false);
  };
  
  const selectAuctionType = (auctionType: string) => {
    setSelectedAuctionType(auctionType);
    setShowAuctionTypeMenu(false);
  };

  // Função para buscar bairros por cidade
  const fetchNeighborhoodsByCity = async (cityName: string) => {
    if (!cityName) return;
    try {
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('bairro')
        .eq('estado', 'RJ')
        .eq('cidade', cityName)
        .order('bairro')
        .not('bairro', 'is', null);
      if (error) throw error;
      const neighborhoodCount: Record<string, number> = {};
      data.forEach(item => {
        if (item.bairro && item.bairro.trim() !== '') {
          neighborhoodCount[item.bairro] = (neighborhoodCount[item.bairro] || 0) + 1;
        }
      });
      // Se for Rio de Janeiro, mostrar todos os bairros da lista fixa
      if (cityName.toLowerCase() === 'rio de janeiro') {
        const bairrosAgrupados: Record<string, { neighborhood: string, count: number }[]> = {};
        Object.keys(bairrosPorZonaRJ).forEach(zona => {
          bairrosAgrupados[zona] = bairrosPorZonaRJ[zona].map(bairro => ({
            neighborhood: bairro,
            count: neighborhoodCount[bairro] || 0
          }));
        });
        // Adicionar bairros "Outros" que estão no banco mas não na lista fixa
        Object.keys(neighborhoodCount).forEach(bairro => {
          let found = false;
          for (const zona in bairrosPorZonaRJ) {
            if (bairrosPorZonaRJ[zona].map(b => b.toLowerCase()).includes(bairro.toLowerCase())) {
              found = true;
              break;
            }
          }
          if (!found) {
            if (!bairrosAgrupados['Outros']) bairrosAgrupados['Outros'] = [];
            bairrosAgrupados['Outros'].push({ neighborhood: bairro, count: neighborhoodCount[bairro] });
          }
        });
        setRjNeighborhoods(bairrosAgrupados as any);
      } else {
        // Normal, lista simples
        const neighborhoodsArray = Object.keys(neighborhoodCount)
          .filter(neighborhood => neighborhood.trim() !== '')
          .map(neighborhood => ({
            neighborhood,
            count: neighborhoodCount[neighborhood]
          }))
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            return a.neighborhood.localeCompare(b.neighborhood, 'pt-BR');
          });
        setRjNeighborhoods(neighborhoodsArray);
      }
    } catch (err) {
      console.error(`Erro ao buscar bairros de ${cityName}:`, err);
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
    setLocationInput("");
    setKeywordInput("");
    setFilterSecondAuction(false);
    setSelectedCityName("");
    setRjNeighborhoods([]);
    setSelectedCities([]);
    
    // Limpar os filtros e atualizar a exibição
    setFilters({});
    setCurrentPage(1);
    
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
      <SocialBar />
      <Header />
      <HeroSection />
      
      {/* Properties Section - Movida para cima */}
      <section className="py-16 bg-background opportunities">
        <div className="container">
          {/* Filtros Container */}
          <div className="mb-8">
            {/* Mobile Filter Button */}
            {isMobile && (
              <Button 
                className="w-full mb-4 flex items-center justify-center bg-teal-900 hover:bg-teal-800"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? (
                  <>
                    <X className="mr-2" size={16} /> Fechar
                  </>
                ) : (
                  <>
                    <Filter className="mr-2" size={16} /> Filtrar
                  </>
                )}
              </Button>
            )}

            {/* Filtros */}
            <div className={`${isMobile && !isFilterOpen ? 'hidden' : ''} bg-white p-5 rounded-lg shadow-md`}>
              {/* Primeira linha de selects */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                      <div 
                        className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectPropertyType("Todos os imóveis", <Globe className="h-4 w-4" />, undefined)}
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
                        
                        return (
                          <div 
                            key={index}
                            className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectPropertyType(formattedTypeName, icon, typeData.type)}
                          >
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
                    onClick={() => setShowRegionMenu(!showRegionMenu)}
                  >
                    <span>{selectedCity}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  {showRegionMenu && (
                    <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-[400px] overflow-y-auto">
                      <div className="border-b border-gray-200 py-2 px-4 font-bold bg-gray-50 text-gray-700">CIDADES DO RIO DE JANEIRO</div>
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
                      {Object.keys(cidadesPorRegiaoRJ)
                        .filter(regiao => 
                          citySearchTerm === '' || 
                          regiao.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
                          cidadesPorRegiaoRJ[regiao].some(cidade => 
                            cidade.toLowerCase().includes(citySearchTerm.toLowerCase())
                          )
                        )
                        .map((regiao) => (
                        <div key={regiao}>
                          {(citySearchTerm === '' || regiao.toLowerCase().includes(citySearchTerm.toLowerCase())) && (
                            <div
                              className="py-2 px-4 font-bold text-primary bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-yellow-100"
                              onClick={() => selectRegion(regiao)}
                            >
                              {regiao} (todos)
                            </div>
                          )}
                          {cidadesPorRegiaoRJ[regiao]
                            .filter(cidade => 
                              citySearchTerm === '' || 
                              cidade.toLowerCase().includes(citySearchTerm.toLowerCase())
                            )
                            .map((cidade) => (
                            <div
                              key={cidade}
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectCity(cidade)}
                            >
                              {cidade}
                            </div>
                          ))}
                        </div>
                      ))}
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
                      {selectedCityName.toLowerCase() === 'rio de janeiro' ? (
                        Object.keys(rjNeighborhoods)
                          .filter(zona => {
                            if (neighborhoodSearchTerm === '') return true;
                            return zona.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase()) ||
                              rjNeighborhoods[zona].some((neighborhoodData: any) => 
                                neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                              );
                          })
                          .map((zona) => (
                          <div key={zona}>
                            {(neighborhoodSearchTerm === '' || zona.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())) && (
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
                                neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                              )
                              .map((neighborhoodData: any, index: number) => (
                                <div
                                  key={neighborhoodData.neighborhood}
                                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => selectNeighborhood(neighborhoodData.neighborhood)}
                                >
                                  {neighborhoodData.neighborhood}
                                </div>
                              ))}
                          </div>
                        ))
                      ) : (
                        rjNeighborhoods.length > 0 ? (
                          rjNeighborhoods
                            .filter((neighborhoodData: any) => 
                              neighborhoodSearchTerm === '' || 
                              neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                            )
                            .map((neighborhoodData: any, index: number) => (
                            <div
                              key={neighborhoodData.neighborhood}
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectNeighborhood(neighborhoodData.neighborhood)}
                            >
                              {neighborhoodData.neighborhood}
                            </div>
                          ))
                        ) : (
                          <div className="py-2 px-4 text-gray-500">Nenhum bairro encontrado</div>
                        )
                      )}
                      {neighborhoodSearchTerm !== '' && (
                        (selectedCityName.toLowerCase() === 'rio de janeiro' ? 
                          Object.keys(rjNeighborhoods).every(zona => 
                            !zona.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase()) &&
                            !rjNeighborhoods[zona].some((neighborhoodData: any) => 
                              neighborhoodData.neighborhood.toLowerCase().includes(neighborhoodSearchTerm.toLowerCase())
                            )
                          ) :
                          !rjNeighborhoods.some((neighborhoodData: any) => 
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
                      {/* Filtros conforme imagem */}
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'Até 300 mil', max: 300000 })}>Até 300 mil</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'De 301 a 500 mil', min: 301000, max: 500000 })}>De 301 a 500 mil</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'De 501 a 700 mil', min: 501000, max: 700000 })}>De 501 a 700 mil</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'De 700 a 1 milhão', min: 700000, max: 1000000 })}>De 700 a 1 milhão</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'De 1 a 1,5 milhão', min: 1000000, max: 1500000 })}>De 1 a 1,5 milhão</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'De 1,5 a 2 milhões', min: 1500000, max: 2000000 })}>De 1,5 a 2 milhões</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectPriceRange({ label: 'Mais de 2 milhões', min: 2000001 })}>Mais de 2 milhões</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Segunda linha de selects */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
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
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectAuctionType("Todos os tipos de leilão")}
                      >
                        Todos os tipos de leilão
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectAuctionType(AUCTION_TYPE_JUDICIAL)}
                      >
                        {AUCTION_TYPE_JUDICIAL}
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectAuctionType(AUCTION_TYPE_EXTRAJUDICIAL)}
                      >
                        {AUCTION_TYPE_EXTRAJUDICIAL}
                      </div>
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectAuctionType(AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO)}
                      >
                        {AUCTION_TYPE_EXTRAJUDICIAL_FINANCIAMENTO}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Campo de busca rápida */}
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Busca rápida, escreva o que procura" 
                  className="w-full p-3 bg-[#fafafa] border border-gray-200 rounded-md text-sm focus:outline-none"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                />
              </div>
              
              {/* Botões de Buscar e Limpar */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 py-3 bg-[#F44336] hover:bg-[#e53935] text-white font-bold"
                  onClick={clearAllFilters}
                >
                  Limpar
                </Button>
                <Button 
                  className="flex-1 py-3 bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold"
                  onClick={applyFilters}
                >
                  Buscar
                </Button>
              </div>
            </div>
            
            {/* Contagem de resultados e ordenação */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
              <div className="text-base font-bold mb-3 md:mb-0">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
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
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg mb-6">Nenhum imóvel encontrado com os filtros selecionados.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
                      <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-3"
                        onClick={() => {
                          // Buscar nas proximidades: redefine o filtro de bairro para todos da zona ou cidade
                          if (selectedCityName && selectedNeighborhood && selectedCityName.toLowerCase() === 'rio de janeiro') {
                            // Descobrir a zona do bairro selecionado
                            let zonaDoBairro = null;
                            for (const zona in bairrosPorZonaRJ) {
                              if (bairrosPorZonaRJ[zona].includes(selectedNeighborhood)) {
                                zonaDoBairro = zona;
                                break;
                              }
                            }
                            if (zonaDoBairro) {
                              setSelectedNeighborhood(`${zonaDoBairro} (todos)`);
                              setSelectedNeighborhoods(bairrosPorZonaRJ[zonaDoBairro]);
                              setFilters((prev) => ({ ...prev, neighborhood: bairrosPorZonaRJ[zonaDoBairro].join(',') }));
                              setCurrentPage(1);
                              toast.success('Buscando imóveis em todos os bairros da zona selecionada!');
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
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full text-left">
                          <h2 className="text-xl font-bold mb-4 text-gray-900">Quero acompanhar oportunidades</h2>
                          <form onSubmit={handleInterestSubmit}>
                            <div className="mb-3">
                              <label className="block text-gray-700 mb-1">Nome</label>
                              <input type="text" className="w-full border rounded p-2" value={interestName} onChange={e => setInterestName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                              <label className="block text-gray-700 mb-1">Telefone</label>
                              <input type="tel" className="w-full border rounded p-2" value={interestPhone} onChange={e => setInterestPhone(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                              <label className="block text-gray-700 mb-1">E-mail</label>
                              <input type="email" className="w-full border rounded p-2" value={interestEmail} onChange={e => setInterestEmail(e.target.value)} required />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button type="submit" className="bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold flex-1">Enviar</Button>
                              <Button type="button" className="bg-gray-300 text-gray-800 flex-1" onClick={() => setShowInterestModal(false)}>Cancelar</Button>
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
                <div className="mt-8 flex justify-center">
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

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Featured Videos Section */}
      <FeaturedVideos />
      
      {/* Auction Steps Section */}
      <PropertyDetailAuctionSteps />
      
      {/* Success Cases Section */}
      <SuccessCases />

      {/* Articles Section */}
      <ArticlesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Horizontal Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Inscreva-se para receber oportunidades de leilões de imóveis</h2>
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <input type="text" placeholder="Nome" className="flex-1 px-4 py-3 border-2 border-[#d68e08] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
              <input type="email" placeholder="Email" className="flex-1 px-4 py-3 border-2 border-[#d68e08] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
              <input type="tel" placeholder="Telefone" className="flex-1 px-4 py-3 border-2 border-[#d68e08] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
              <button type="submit" className="px-8 py-3 bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold rounded-md transition-colors">ENVIAR</button>
            </form>
          </div>
        </div>
      </section>

      {/* Vertical Newsletter Section */}
      <section className="py-16 bg-cover bg-center relative" style={{backgroundImage: 'url(/bg-newsletter.jpg.webp)'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">Receba nossa newsletter</h2>
                <form className="space-y-4">
                  <input type="text" placeholder="Nome" className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
                  <input type="tel" placeholder="Telefone" className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08]" />
                  <button type="submit" className="w-full px-8 py-3 bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold rounded-md transition-colors">ENVIAR</button>
                </form>
                
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Podemos ajudar a solucionar o seu caso!</h3>
                  <div className="flex justify-center space-x-8">
                    <a href="#" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                      <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      <span className="text-sm">WhatsApp</span>
                    </a>
                    <a href="#" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                      <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span className="text-sm">Email</span>
                    </a>
                    <a href="#" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                      <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <span className="text-sm">Telefone</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img src="/foto-recortada-cataldo.png.webp" alt="Advogado Cataldo" className="max-w-full h-auto rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Buttons */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button className="bg-primary hover:bg-primary/90 font-bold">
          Inscreva-se para oportunidades
        </Button>
      </div>
      
      <div className="fixed bottom-4 right-4 z-40">
        <Button className="w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#25d366]/90">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;