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

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Função para converter params da URL para objeto de filtros
  const parseFiltersFromURL = useCallback((): FilterParams => {
    const filters: FilterParams = {};

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