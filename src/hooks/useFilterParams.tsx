import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';

// Interface para os filtros base
export interface FilterParams {
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
  financiamento?: boolean;
  fgts?: boolean;
  parcelamento?: boolean;
  auctionType?: string; // Para SP
  neighborhoods?: string[]; // Para múltiplos bairros
  cities?: string[]; // Para múltiplas cidades
  dataFimSegundoLeilao?: string; // Data final do filtro de data de encerramento do segundo leilão
}

// Tipos para as faixas de preço
export interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

// Tipos para o tipo selecionado
export interface SelectedType {
  label: string;
  icon: JSX.Element;
  originalValue?: string;
}

// Mapeamento de códigos curtos para cidades mais comuns
const CITY_CODES: Record<string, string> = {
  'Rio de Janeiro': 'rj',
  'São Paulo': 'sp',
  'Niterói': 'nit',
  'São Gonçalo': 'sg',
  'Duque de Caxias': 'dc',
  'Nova Iguaçu': 'ni',
  'Petrópolis': 'pet',
  'Volta Redonda': 'vr',
  'Campos dos Goytacazes': 'cmp',
  'Macaé': 'mac',
  'Cabo Frio': 'cf',
  'Campinas': 'cam',
  'Santos': 'san',
  'Guarulhos': 'gru'
};

const CITY_CODES_REVERSE = Object.fromEntries(
  Object.entries(CITY_CODES).map(([k, v]) => [v, k])
);

// Mapeamento de códigos curtos para tipos de imóveis
const TYPE_CODES: Record<string, string> = {
  'Apartamento': 'apt',
  'Casa': 'cas',
  'Comercial': 'com',
  'Terreno': 'ter',
  'Sala': 'sal',
  'Loja': 'loj',
  'Galpão': 'gal',
  'Chácara': 'cha',
  'Sítio': 'sit'
};

const TYPE_CODES_REVERSE = Object.fromEntries(
  Object.entries(TYPE_CODES).map(([k, v]) => [v, k])
);

// Função para codificar arrays usando códigos curtos
const encodeArray = (items: string[], codeMap: Record<string, string>): string => {
  return items.map(item => {
    const trimmed = item.trim();
    return codeMap[trimmed] || trimmed.toLowerCase().replace(/\s+/g, '-').substring(0, 6);
  }).join(',');
};

// Função para decodificar arrays usando códigos curtos
const decodeArray = (encoded: string, reverseMap: Record<string, string>): string[] => {
  return encoded.split(',').map(code => reverseMap[code] || code.replace(/-/g, ' '));
};

// Função para verificar se os filtros devem usar códigos curtos
const shouldUseShortCodes = (filters: FilterParams): boolean => {
  const cityCount = filters.city ? filters.city.split(',').length : 0;
  const typeCount = filters.type ? filters.type.split(',').length : 0;
  const neighborhoodCount = filters.neighborhood ? filters.neighborhood.split(',').length : 0;
  const citiesCount = filters.cities ? filters.cities.length : 0;
  const neighborhoodsCount = filters.neighborhoods ? filters.neighborhoods.length : 0;
  
  // Usar códigos curtos se tem mais de 2 itens em qualquer categoria
  return (
    cityCount > 2 ||
    typeCount > 2 ||
    neighborhoodCount > 2 ||
    citiesCount > 2 ||
    neighborhoodsCount > 2
  );
};

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Função para converter params da URL para objeto de filtros
  const parseFiltersFromURL = useCallback((): FilterParams => {
    const filters: FilterParams = {};
    
    // Verificar se há parâmetros com códigos curtos
    const shortCities = searchParams.get('c');
    if (shortCities) {
      filters.city = decodeArray(shortCities, CITY_CODES_REVERSE).join(',');
    }
    
    const shortTypes = searchParams.get('t');
    if (shortTypes) {
      filters.type = decodeArray(shortTypes, TYPE_CODES_REVERSE).join(',');
    }
    
    const shortNeighborhoods = searchParams.get('b');
    if (shortNeighborhoods) {
      filters.neighborhood = shortNeighborhoods.split(',').map(n => n.replace(/-/g, ' ')).join(',');
    }

    // Parâmetros simples
    const city = searchParams.get('cidade');
    if (city) filters.city = city;

    const type = searchParams.get('tipo');
    if (type) filters.type = type;

    const neighborhood = searchParams.get('bairro');
    if (neighborhood) filters.neighborhood = neighborhood;

    const location = searchParams.get('localizacao');
    if (location) filters.location = location;

    const keyword = searchParams.get('palavra_chave');
    if (keyword) filters.keyword = keyword;

    const auctionType = searchParams.get('tipo_leilao');
    if (auctionType) filters.auctionType = auctionType;

    // Parâmetros booleanos
    const hasSecondAuction = searchParams.get('segundo_leilao');
    if (hasSecondAuction === 'true') filters.hasSecondAuction = true;

    const financiamento = searchParams.get('financiamento');
    if (financiamento === 'true') filters.financiamento = true;

    const fgts = searchParams.get('fgts');
    if (fgts === 'true') filters.fgts = true;

    const parcelamento = searchParams.get('parcelamento');
    if (parcelamento === 'true') filters.parcelamento = true;

    // Faixa de preço
    const minPrice = searchParams.get('preco_min');
    const maxPrice = searchParams.get('preco_max');
    if (minPrice || maxPrice) {
      filters.priceRange = {};
      if (minPrice) filters.priceRange.min = parseInt(minPrice);
      if (maxPrice) filters.priceRange.max = parseInt(maxPrice);
    }

    // Filtro de data de encerramento do segundo leilão
    const dataFimSegundoLeilao = searchParams.get('data_fim_segundo_leilao');
    if (dataFimSegundoLeilao) filters.dataFimSegundoLeilao = dataFimSegundoLeilao;

    // Arrays para múltiplos valores
    const neighborhoods = searchParams.get('bairros');
    if (neighborhoods) {
      filters.neighborhoods = neighborhoods.split(',').filter(Boolean);
    }

    const cities = searchParams.get('cidades');
    if (cities) {
      filters.cities = cities.split(',').filter(Boolean);
    }

    return filters;
  }, [searchParams]);

  // Função para atualizar a URL com os filtros
  const updateURL = useCallback((filters: FilterParams) => {
    const newParams = new URLSearchParams();
    
    // Verificar se deve usar códigos curtos
    if (shouldUseShortCodes(filters)) {
      // Usar códigos curtos para cidades
      if (filters.city) {
        const cities = filters.city.split(',');
        if (cities.length > 2) {
          newParams.set('c', encodeArray(cities, CITY_CODES));
        } else {
          newParams.set('cidade', filters.city);
        }
      } else if (filters.cities && filters.cities.length > 2) {
        newParams.set('c', encodeArray(filters.cities, CITY_CODES));
      }
      
      // Usar códigos curtos para tipos
      if (filters.type) {
        const types = filters.type.split(',');
        if (types.length > 2) {
          newParams.set('t', encodeArray(types, TYPE_CODES));
        } else {
          newParams.set('tipo', filters.type);
        }
      }
      
      // Usar códigos curtos para bairros (apenas abreviando)
      if (filters.neighborhood) {
        const neighborhoods = filters.neighborhood.split(',');
        if (neighborhoods.length > 2) {
          newParams.set('b', neighborhoods.map(n => n.toLowerCase().replace(/\s+/g, '-').substring(0, 6)).join(','));
        } else {
          newParams.set('bairro', filters.neighborhood);
        }
      } else if (filters.neighborhoods && filters.neighborhoods.length > 2) {
        newParams.set('b', filters.neighborhoods.map(n => n.toLowerCase().replace(/\s+/g, '-').substring(0, 6)).join(','));
      }
      
      // Adicionar outros parâmetros normalmente
      if (filters.location) newParams.set('localizacao', filters.location);
      if (filters.keyword) newParams.set('palavra_chave', filters.keyword);
      if (filters.auctionType) newParams.set('tipo_leilao', filters.auctionType);
      if (filters.hasSecondAuction) newParams.set('segundo_leilao', 'true');
      if (filters.financiamento) newParams.set('financiamento', 'true');
      if (filters.fgts) newParams.set('fgts', 'true');
      if (filters.parcelamento) newParams.set('parcelamento', 'true');
      if (filters.priceRange?.min) newParams.set('preco_min', filters.priceRange.min.toString());
      if (filters.priceRange?.max) newParams.set('preco_max', filters.priceRange.max.toString());
      if (filters.dataFimSegundoLeilao) newParams.set('data_fim_segundo_leilao', filters.dataFimSegundoLeilao);
      
      setSearchParams(newParams, { replace: true });
      return;
    }

    // Adicionar parâmetros simples
    if (filters.city) newParams.set('cidade', filters.city);
    if (filters.type) newParams.set('tipo', filters.type);
    if (filters.neighborhood) newParams.set('bairro', filters.neighborhood);
    if (filters.location) newParams.set('localizacao', filters.location);
    if (filters.keyword) newParams.set('palavra_chave', filters.keyword);
    if (filters.auctionType) newParams.set('tipo_leilao', filters.auctionType);

    // Adicionar parâmetros booleanos
    if (filters.hasSecondAuction) newParams.set('segundo_leilao', 'true');
    if (filters.financiamento) newParams.set('financiamento', 'true');
    if (filters.fgts) newParams.set('fgts', 'true');
    if (filters.parcelamento) newParams.set('parcelamento', 'true');

    // Adicionar faixa de preço
    if (filters.priceRange?.min) newParams.set('preco_min', filters.priceRange.min.toString());
    if (filters.priceRange?.max) newParams.set('preco_max', filters.priceRange.max.toString());

    // Adicionar filtro de data de encerramento do segundo leilão
    if (filters.dataFimSegundoLeilao) newParams.set('data_fim_segundo_leilao', filters.dataFimSegundoLeilao);

    // Adicionar arrays
    if (filters.neighborhoods && filters.neighborhoods.length > 0) {
      newParams.set('bairros', filters.neighborhoods.join(','));
    }
    if (filters.cities && filters.cities.length > 0) {
      newParams.set('cidades', filters.cities.join(','));
    }

    setSearchParams(newParams, { replace: true });
  }, [setSearchParams]);

  // Função para limpar todos os filtros da URL
  const clearFiltersFromURL = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Função para obter URL shareável atual
  const getShareableURL = useCallback(() => {
    const currentURL = window.location.href;
    return currentURL;
  }, []);

  // Função para criar URL shareável com filtros específicos
  const createShareableURL = useCallback((filters: FilterParams) => {
    const newParams = new URLSearchParams();
    
    // Verificar se deve usar códigos curtos
    if (shouldUseShortCodes(filters)) {
      if (filters.city && filters.city.split(',').length > 2) {
        newParams.set('c', encodeArray(filters.city.split(','), CITY_CODES));
      } else if (filters.city) {
        newParams.set('cidade', filters.city);
      }
      
      if (filters.type && filters.type.split(',').length > 2) {
        newParams.set('t', encodeArray(filters.type.split(','), TYPE_CODES));
      } else if (filters.type) {
        newParams.set('tipo', filters.type);
      }
      
      if (filters.neighborhood && filters.neighborhood.split(',').length > 2) {
        newParams.set('b', filters.neighborhood.split(',').map(n => n.toLowerCase().replace(/\s+/g, '-').substring(0, 6)).join(','));
      } else if (filters.neighborhood) {
        newParams.set('bairro', filters.neighborhood);
      }
      
      if (filters.cities && filters.cities.length > 2) {
        newParams.set('c', encodeArray(filters.cities, CITY_CODES));
      }
      
      if (filters.neighborhoods && filters.neighborhoods.length > 2) {
        newParams.set('b', filters.neighborhoods.map(n => n.toLowerCase().replace(/\s+/g, '-').substring(0, 6)).join(','));
      }
      
      // Adicionar outros filtros
      if (filters.location) newParams.set('localizacao', filters.location);
      if (filters.keyword) newParams.set('palavra_chave', filters.keyword);
      if (filters.auctionType) newParams.set('tipo_leilao', filters.auctionType);
      if (filters.hasSecondAuction) newParams.set('segundo_leilao', 'true');
      if (filters.financiamento) newParams.set('financiamento', 'true');
      if (filters.fgts) newParams.set('fgts', 'true');
      if (filters.parcelamento) newParams.set('parcelamento', 'true');
      if (filters.priceRange?.min) newParams.set('preco_min', filters.priceRange.min.toString());
      if (filters.priceRange?.max) newParams.set('preco_max', filters.priceRange.max.toString());
      if (filters.dataFimSegundoLeilao) newParams.set('data_fim_segundo_leilao', filters.dataFimSegundoLeilao);
      
      const baseURL = window.location.origin + window.location.pathname;
      return `${baseURL}?${newParams.toString()}`;
    }

    // Usar método normal se não comprimir
    if (filters.city) newParams.set('cidade', filters.city);
    if (filters.type) newParams.set('tipo', filters.type);
    if (filters.neighborhood) newParams.set('bairro', filters.neighborhood);
    if (filters.location) newParams.set('localizacao', filters.location);
    if (filters.keyword) newParams.set('palavra_chave', filters.keyword);
    if (filters.auctionType) newParams.set('tipo_leilao', filters.auctionType);

    if (filters.hasSecondAuction) newParams.set('segundo_leilao', 'true');
    if (filters.financiamento) newParams.set('financiamento', 'true');
    if (filters.fgts) newParams.set('fgts', 'true');
    if (filters.parcelamento) newParams.set('parcelamento', 'true');

    if (filters.priceRange?.min) newParams.set('preco_min', filters.priceRange.min.toString());
    if (filters.priceRange?.max) newParams.set('preco_max', filters.priceRange.max.toString());

    if (filters.dataFimSegundoLeilao) newParams.set('data_fim_segundo_leilao', filters.dataFimSegundoLeilao);

    if (filters.neighborhoods && filters.neighborhoods.length > 0) {
      newParams.set('bairros', filters.neighborhoods.join(','));
    }
    if (filters.cities && filters.cities.length > 0) {
      newParams.set('cidades', filters.cities.join(','));
    }

    const baseURL = window.location.origin + window.location.pathname;
    return newParams.toString() ? `${baseURL}?${newParams.toString()}` : baseURL;
  }, []);

  return {
    parseFiltersFromURL,
    updateURL,
    clearFiltersFromURL,
    getShareableURL,
    createShareableURL,
    searchParams
  };
}; 