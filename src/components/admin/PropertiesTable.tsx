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
import { Search, Filter, Eye, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Property = Tables<'leiloes_imoveis'>;

const PropertiesTable = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('leiloes_imoveis')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (err) {
      console.error('Erro ao buscar propriedades:', err);
      setError('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.titulo_propriedade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.numero_processo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por cidade
    if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter(property => property.cidade === cityFilter);
    }

    // Filtro por tipo
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(property => property.tipo_propriedade === typeFilter);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, cityFilter, typeFilter, properties]);

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

  const uniqueCities = Array.from(new Set(properties.map(p => p.cidade))).filter(Boolean).sort();
  const uniqueTypes = Array.from(new Set(properties.map(p => p.tipo_propriedade))).filter(Boolean).sort();

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
          Propriedades ({filteredProperties.length} de {properties.length})
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
              {uniqueCities.map(city => (
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
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setCityFilter('all');
            setTypeFilter('all');
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>

          <Button variant="outline" onClick={fetchProperties}>
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
              {filteredProperties.map((property) => (
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
                      <Badge variant="secondary">{property.tipo_propriedade}</Badge>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{formatCurrency(property.leilao_1)}</TableCell>
                  <TableCell>{formatCurrency(property.leilao_2)}</TableCell>
                  <TableCell>{formatDate(property.data_leilao_1)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {property.fgts && <Badge variant="outline" className="text-xs">FGTS</Badge>}
                      {property.financiamento && <Badge variant="outline" className="text-xs">Financ.</Badge>}
                      {property.consorcio && <Badge variant="outline" className="text-xs">Consórcio</Badge>}
                      {property.parcelamento && <Badge variant="outline" className="text-xs">Parcelamento</Badge>}
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
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {properties.length === 0 
                ? 'Nenhuma propriedade encontrada no banco de dados'
                : 'Nenhuma propriedade corresponde aos filtros aplicados'
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesTable; 