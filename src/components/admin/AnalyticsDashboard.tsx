import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Search, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  RefreshCw,
  Calendar,
  Filter,
  MousePointer
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AnalyticsSummary {
  total_daily_visits: number;
  total_property_views: number;
  total_unique_visitors: number;
  total_searches: number;
  total_leads: number;
  avg_time_on_properties: string;
}

interface MostViewedProperty {
  property_id: number;
  titulo_propriedade: string;
  cidade: string;
  estado: string;
  view_count: number;
  unique_viewers: number;
  avg_time_spent: number;
}

interface PopularSearch {
  search_query: string;
  search_count: number;
  avg_results: number;
}

interface PopularFilter {
  filter_key: string;
  filter_value: string;
  usage_count: number;
}

interface MostClickedProperty {
  property_id: number;
  titulo_propriedade: string;
  cidade: string;
  estado: string;
  click_count: number;
  last_clicked: string;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [mostViewed, setMostViewed] = useState<MostViewedProperty[]>([]);
  const [mostClicked, setMostClicked] = useState<MostClickedProperty[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [popularFilters, setPopularFilters] = useState<PopularFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const periodDays = parseInt(selectedPeriod);

      // Buscar resumo geral
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_analytics_summary', { days_back: periodDays });

      if (summaryError) throw summaryError;

      // Buscar propriedades mais vistas
      const { data: mostViewedData, error: mostViewedError } = await supabase
        .rpc('get_most_viewed_properties', { limit_count: 10, days_back: periodDays });

      if (mostViewedError) throw mostViewedError;

      // Buscar pesquisas populares
      const { data: searchesData, error: searchesError } = await supabase
        .rpc('get_popular_searches', { limit_count: 10 });

      if (searchesError) throw searchesError;

      // Buscar filtros populares
      const { data: filtersData, error: filtersError } = await supabase
        .rpc('get_popular_filters', { limit_count: 10 });

      if (filtersError) throw filtersError;

      // Buscar imóveis mais clicados (nova tabela)
      const { data: mostClickedData, error: mostClickedError } = await supabase
        .rpc('get_most_clicked_properties_v2', { limit_count: 10, days_back: periodDays });

      if (mostClickedError) throw mostClickedError;

      // console.log('📊 Dados do Analytics (Período:', periodDays, 'dias):', {
      //   summary: summaryData,
      //   mostViewed: mostViewedData,
      //   mostClicked: mostClickedData,
      //   searches: searchesData,
      //   filters: filtersData
      // });

      setAnalytics(summaryData?.[0] || null);
      setMostViewed(mostViewedData || []);
      setMostClicked(mostClickedData || []);
      setPopularSearches(searchesData || []);
      setPopularFilters(filtersData || []);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const statCards = analytics ? [
    {
      title: 'Visitas Totais',
      value: analytics.total_daily_visits?.toString() || '0',
      icon: Users,
      description: `Últimos ${selectedPeriod} dia${selectedPeriod === '1' ? '' : 's'}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Visitantes Únicos',
      value: analytics.total_unique_visitors?.toString() || '0',
      icon: Eye,
      description: 'Pessoas diferentes',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Visualizações de Imóveis',
      value: analytics.total_property_views?.toString() || '0',
      icon: MousePointer,
      description: 'Páginas de detalhes acessadas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },

    {
      title: 'Tempo Médio por Imóvel',
      value: analytics.avg_time_on_properties ? formatTime(Number(analytics.avg_time_on_properties)) : '0s',
      icon: Clock,
      description: 'Tempo de visualização',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ] : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando analytics...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles do Período */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Período:</span>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="1" className="hover:bg-gray-50 focus:bg-gray-50">Último dia</SelectItem>
              <SelectItem value="7" className="hover:bg-gray-50 focus:bg-gray-50">Últimos 7 dias</SelectItem>
              <SelectItem value="30" className="hover:bg-gray-50 focus:bg-gray-50">Últimos 30 dias</SelectItem>
              <SelectItem value="90" className="hover:bg-gray-50 focus:bg-gray-50">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          onClick={fetchAnalytics}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Imóveis Mais Visualizados */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Imóveis Mais Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostViewed.length > 0 ? (
                mostViewed.slice(0, 5).map((property, index) => (
                  <div key={property.property_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-3">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium truncate">
                          ID {property.property_id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate max-w-full" title={property.titulo_propriedade}>
                        {property.titulo_propriedade || 'Sem título'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {property.cidade}, {property.estado}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {property.view_count} views
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {property.unique_viewers} únicos
                      </p>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime(property.avg_time_spent)} médio
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma visualização registrada ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Imóveis Mais Clicados (Saiba Mais) */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Imóveis Mais Clicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostClicked.length > 0 ? (
                mostClicked.slice(0, 5).map((property, index) => (
                  <div key={property.property_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-3">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium truncate">
                          ID {property.property_id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate max-w-full" title={property.titulo_propriedade}>
                        {property.titulo_propriedade || 'Sem título'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {property.cidade}, {property.estado}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          {property.click_count} cliques
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        Último: {new Date(property.last_clicked).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum clique registrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pesquisas Mais Populares */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Pesquisas Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularSearches.length > 0 ? (
                popularSearches.slice(0, 5).map((search, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-3">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium truncate max-w-full" title={search.search_query}>
                          "{search.search_query}"
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        resultados em média
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {search.search_count} cliques
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma pesquisa registrada ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Mais Utilizados */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Mais Utilizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {popularFilters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filtro</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Uso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularFilters.slice(0, 10).map((filter, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium truncate max-w-32">
                      {filter.filter_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs max-w-24 truncate">
                        Filtro
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        {filter.filter_count}x
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum filtro utilizado ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
