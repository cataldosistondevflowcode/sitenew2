import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Property = Tables<'leiloes_imoveis'>;

const PropertiesTable = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  
  const pageSize = 1000;

  const fetchProperties = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const from = page * pageSize;
      const to = from + pageSize - 1;

      // Construir query base
      let query = supabase
        .from('leiloes_imoveis')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false });

      // Aplicar filtros
      if (searchTerm) {
        query = query.or(`titulo_propriedade.ilike.%${searchTerm}%,endereco.ilike.%${searchTerm}%,bairro.ilike.%${searchTerm}%,numero_processo.ilike.%${searchTerm}%`);
      }

      if (cityFilter && cityFilter !== 'all') {
        query = query.eq('cidade', cityFilter);
      }

      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('tipo_propriedade', typeFilter);
      }

      // Aplicar paginação
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setProperties(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
      
      console.log(`Página ${page + 1}: ${data?.length || 0} registros de ${count || 0} totais`);
    } catch (err) {
      console.error('Erro ao buscar propriedades:', err);
      setError('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      // Buscar cidades únicas
      const { data: citiesData } = await supabase
        .from('leiloes_imoveis')
        .select('cidade')
        .not('cidade', 'is', null);

      // Buscar tipos únicos
      const { data: typesData } = await supabase
        .from('leiloes_imoveis')
        .select('tipo_propriedade')
        .not('tipo_propriedade', 'is', null);

      const uniqueCities = Array.from(new Set(citiesData?.map(item => item.cidade))).filter(Boolean).sort();
      const uniqueTypes = Array.from(new Set(typesData?.map(item => item.tipo_propriedade))).filter(Boolean).sort();

      setAllCities(uniqueCities);
      setAllTypes(uniqueTypes);
    } catch (err) {
      console.error('Erro ao buscar metadados:', err);
    }
  };

  useEffect(() => {
    fetchProperties(0);
    fetchMetadata();
  }, []);

  useEffect(() => {
    // Quando filtros mudam, voltar para primeira página
    setCurrentPage(0);
    fetchProperties(0);
  }, [searchTerm, cityFilter, typeFilter]);

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalCount);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando propriedades...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProperties}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Propriedades ({startRecord}-{endRecord} de {totalCount})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, endereço, bairro ou processo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {allCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {allTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            onClick={() => {
              setSearchTerm('');
              setCityFilter('all');
              setTypeFilter('all');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>

          <Button 
            variant="outline" 
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            onClick={() => {
              fetchProperties(currentPage);
              fetchMetadata();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Leilão 1</TableHead>
                <TableHead>Leilão 2</TableHead>
                <TableHead>Data Leilão 1</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leiloeiro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.id}</TableCell>
                  <TableCell className="max-w-48">
                    <div className="truncate" title={property.titulo_propriedade || 'N/A'}>
                      {property.titulo_propriedade || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48">
                    <div className="truncate" title={`${property.endereco || ''}, ${property.bairro || ''}`}>
                      {property.endereco && property.bairro 
                        ? `${property.endereco}, ${property.bairro}`
                        : property.endereco || property.bairro || 'N/A'
                      }
                    </div>
                  </TableCell>
                  <TableCell>{property.cidade}/{property.estado}</TableCell>
                  <TableCell>
                    {property.tipo_propriedade ? (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                      >
                        {property.tipo_propriedade}
                      </Badge>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{formatCurrency(property.leilao_1)}</TableCell>
                  <TableCell>{formatCurrency(property.leilao_2)}</TableCell>
                  <TableCell>{formatDate(property.data_leilao_1)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {property.fgts && (
                        <Badge className="text-xs bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                          FGTS
                        </Badge>
                      )}
                      {property.financiamento && (
                        <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
                          Financ.
                        </Badge>
                      )}
                      {property.consorcio && (
                        <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
                          Consórcio
                        </Badge>
                      )}
                      {property.parcelamento && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
                          Parcelamento
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-32">
                    <div className="truncate" title={property.leiloeiro_nome || 'N/A'}>
                      {property.leiloeiro_nome || 'N/A'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {properties.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {totalCount === 0 
                ? 'Nenhuma propriedade encontrada no banco de dados'
                : 'Nenhuma propriedade corresponde aos filtros aplicados'
              }
            </div>
          )}
        </div>
        
        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Mostrando {startRecord} a {endRecord} de {totalCount} registros
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => fetchProperties(currentPage - 1)}
                disabled={currentPage === 0 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = currentPage < 3 ? index : currentPage - 2 + index;
                  if (pageNumber >= totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchProperties(pageNumber)}
                      disabled={loading}
                      className={`w-10 ${
                        pageNumber === currentPage 
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } disabled:bg-gray-100 disabled:text-gray-400`}
                    >
                      {pageNumber + 1}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProperties(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesTable; 