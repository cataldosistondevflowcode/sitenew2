import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { escapeSqlLike } from '@/utils/stringUtils';
import { getTodayDateString } from '@/utils/dateUtils';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight, Download, Edit, ExternalLink, Plus, Trash2, Trash, FileSpreadsheet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPropertyUrl } from '@/utils/slugUtils';
import { formatPropertyAddress } from '@/utils/addressFormatter';
import { toast } from '@/hooks/use-toast';
import PropertyModal from './PropertyModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import BulkImportModal from './BulkImportModal';
import { PropertyCRUD } from './PropertyCRUD';

type Property = Tables<'leiloes_imoveis'>;

const PropertiesTable = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos filtros
  const [stateFilter, setStateFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [auctionTypeFilter, setAuctionTypeFilter] = useState('all');
  const [showCurrentOnly, setShowCurrentOnly] = useState(false); // Novo estado para filtro "Atual"
  
  // Estados para metadados
  const [allStates, setAllStates] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [allAuctionTypes, setAllAuctionTypes] = useState<string[]>([]);

  // Estados para CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);
  
  // Estados para seleção múltipla
  const [selectedProperties, setSelectedProperties] = useState<Set<number>>(new Set());
  const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false);
  const [deleteMultipleLoading, setDeleteMultipleLoading] = useState(false);
  
  // Estados para importação em lote
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  const pageSize = 20;

  const fetchProperties = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Limpar seleção quando mudar de página
      if (page !== currentPage) {
        setSelectedProperties(new Set());
      }
      
      const from = page * pageSize;
      const to = from + pageSize - 1;

      // Construir query base
      let query = supabase
        .from('leiloes_imoveis')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false });

      // Aplicar filtros
      if (searchTerm) {
        const escapedSearchTerm = escapeSqlLike(searchTerm);
        query = query.or(`titulo_propriedade.ilike.%${escapedSearchTerm}%,endereco.ilike.%${escapedSearchTerm}%,bairro.ilike.%${escapedSearchTerm}%,numero_processo.ilike.%${escapedSearchTerm}%,descricao.ilike.%${escapedSearchTerm}%,leiloeiro_nome.ilike.%${escapedSearchTerm}%`);
      }

      if (cityFilter && cityFilter !== 'all') {
        query = query.eq('cidade', cityFilter);
      }

      if (stateFilter && stateFilter !== 'all') {
        query = query.eq('estado', stateFilter);
      }

      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('tipo_propriedade', typeFilter);
      }

      if (auctionTypeFilter && auctionTypeFilter !== 'all') {
        query = query.eq('tipo_leilao', auctionTypeFilter);
      }

      // Filtro "Atual" - apenas leilões que ainda não passaram
      // IMPORTANTE: Usar formato YYYY-MM-DD pois as colunas são do tipo DATE, não TIMESTAMP
      if (showCurrentOnly) {
        const currentDateForFilter = getTodayDateString();
        // Considerar tanto 1º quanto 2º leilão - incluir se qualquer um for futuro ou nulo
        query = query.or(`data_leilao_1.is.null,data_leilao_1.gte.${currentDateForFilter},data_leilao_2.gte.${currentDateForFilter}`);
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

      // Buscar estados únicos
      const { data: statesData } = await supabase
        .from('leiloes_imoveis')
        .select('estado')
        .not('estado', 'is', null);

      // Buscar tipos únicos
      const { data: typesData } = await supabase
        .from('leiloes_imoveis')
        .select('tipo_propriedade')
        .not('tipo_propriedade', 'is', null);

      // Buscar tipos de leilão únicos
      const { data: auctionTypesData } = await supabase
        .from('leiloes_imoveis')
        .select('tipo_leilao')
        .not('tipo_leilao', 'is', null);

      const uniqueCities = Array.from(new Set(citiesData?.map(item => item.cidade))).filter(Boolean).sort();
      const uniqueStates = Array.from(new Set(statesData?.map(item => item.estado))).filter(Boolean).sort();
      const uniqueTypes = Array.from(new Set(typesData?.map(item => item.tipo_propriedade))).filter(Boolean).sort();
      const uniqueAuctionTypes = Array.from(new Set(auctionTypesData?.map(item => item.tipo_leilao))).filter(Boolean).sort();

      setAllCities(uniqueCities);
      setAllStates(uniqueStates);
      setAllTypes(uniqueTypes);
      setAllAuctionTypes(uniqueAuctionTypes);
    } catch (err) {
      console.error('Erro ao buscar metadados:', err);
    }
  };

  useEffect(() => {
    fetchProperties(0);
    fetchMetadata();
  }, []);

  // Debounce para o campo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(0);
        setSelectedProperties(new Set());
        fetchProperties(0);
      }
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efeito separado para outros filtros
  useEffect(() => {
    // Quando outros filtros mudam, voltar para primeira página e limpar seleção
    setCurrentPage(0);
    setSelectedProperties(new Set());
    fetchProperties(0);
  }, [cityFilter, stateFilter, typeFilter, auctionTypeFilter, showCurrentOnly]);



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

  const clearAllFilters = () => {
    setSearchTerm('');
    setStateFilter('all');
    setCityFilter('all');
    setTypeFilter('all');
    setAuctionTypeFilter('all');

    setShowCurrentOnly(false); // Limpar também o filtro "Atual"
    setSelectedProperties(new Set()); // Limpar seleção
    setCurrentPage(0);
    fetchProperties(0);
  };

  // Funções CRUD
  const handleCreateProperty = async (data: Partial<Property>) => {
    await PropertyCRUD.createProperty(data);
    fetchProperties(0); // Recarregar primeira página
    fetchMetadata(); // Atualizar metadados
  };

  const handleUpdateProperty = async (data: Partial<Property>) => {
    if (selectedProperty?.id) {
      await PropertyCRUD.updateProperty(selectedProperty.id, data);
      fetchProperties(currentPage); // Recarregar página atual
      fetchMetadata(); // Atualizar metadados
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      setCrudLoading(true);
      await PropertyCRUD.deleteProperty(propertyId);
      toast({
        title: "Sucesso!",
        description: "Propriedade excluída com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedProperty(null);
      fetchProperties(currentPage); // Recarregar página atual
      fetchMetadata(); // Atualizar metadados
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir propriedade. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCrudLoading(false);
    }
  };

  // Funções para seleção múltipla
  const handleSelectProperty = (propertyId: number, checked: boolean) => {
    const newSelected = new Set(selectedProperties);
    if (checked) {
      newSelected.add(propertyId);
    } else {
      newSelected.delete(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = properties.map(p => p.id);
      setSelectedProperties(new Set(allIds));
    } else {
      setSelectedProperties(new Set());
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      setDeleteMultipleLoading(true);
      const propertyIds = Array.from(selectedProperties);
      
      // Excluir propriedades em paralelo
      await Promise.all(propertyIds.map(id => PropertyCRUD.deleteProperty(id)));
      
      toast({
        title: "Sucesso!",
        description: `${propertyIds.length} propriedade(s) excluída(s) com sucesso.`,
      });
      
      setIsDeleteMultipleDialogOpen(false);
      setSelectedProperties(new Set());
      fetchProperties(currentPage); // Recarregar página atual
      fetchMetadata(); // Atualizar metadados
    } catch (error) {
      console.error('Erro ao excluir propriedades:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir propriedades. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeleteMultipleLoading(false);
    }
  };

  const openDeleteMultipleDialog = () => {
    setIsDeleteMultipleDialogOpen(true);
  };

  const closeDeleteMultipleDialog = () => {
    setIsDeleteMultipleDialogOpen(false);
  };

  const openBulkImportModal = () => {
    setIsBulkImportModalOpen(true);
  };

  const closeBulkImportModal = () => {
    setIsBulkImportModalOpen(false);
  };

  const handleBulkImportSuccess = () => {
    fetchProperties(currentPage);
    fetchMetadata();
  };

  const openCreateModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProperty(null);
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
            <Button onClick={() => fetchProperties(currentPage)}>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Propriedades ({startRecord}-{endRecord} de {totalCount})
            </CardTitle>
            {selectedProperties.size > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {selectedProperties.size} selecionado(s)
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedProperties.size > 0 && (
              <Button 
                onClick={openDeleteMultipleDialog}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir {selectedProperties.size} selecionado(s)
              </Button>
            )}
            <Button 
              onClick={openBulkImportModal}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Importar em Lote
            </Button>
            <Button 
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Propriedade
            </Button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="space-y-4 mt-4">
          {/* Primeira linha de filtros */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título, endereço, bairro, processo, leiloeiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos os estados</SelectItem>
                {allStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todas as cidades</SelectItem>
                {allCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos os tipos</SelectItem>
                {allTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Segunda linha de filtros */}
          <div className="flex flex-wrap gap-4">
            <Select value={auctionTypeFilter} onValueChange={setAuctionTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo Leilão" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos os tipos</SelectItem>
                {allAuctionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border border-gray-200">
              <Checkbox
                id="show-current-only"
                checked={showCurrentOnly}
                onCheckedChange={(checked) => setShowCurrentOnly(checked as boolean)}
              />
              <Eye className="h-4 w-4 text-gray-500" />
              <label htmlFor="show-current-only" className="text-sm text-gray-700 cursor-pointer">
                Apenas atuais
              </label>
            </div>

            <Button 
              variant="outline" 
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={clearAllFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProperties.size === properties.length && properties.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="ml-2"
                  />
                </TableHead>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="min-w-64">Título</TableHead>
                <TableHead className="min-w-48">Endereço</TableHead>
                <TableHead className="w-24">Bairro</TableHead>
                <TableHead className="w-24">Cidade</TableHead>
                <TableHead className="w-16">UF</TableHead>
                <TableHead className="min-w-32">Tipo</TableHead>
                <TableHead className="w-32">Leilão 1</TableHead>
                <TableHead className="w-32">Leilão 2</TableHead>
                <TableHead className="w-28">Data 1º</TableHead>
                <TableHead className="w-28">Data 2º</TableHead>
                <TableHead className="min-w-32">Tipo Leilão</TableHead>
                <TableHead className="min-w-48">Leiloeiro</TableHead>
                <TableHead className="min-w-32">Processo</TableHead>
                <TableHead className="min-w-64">Descrição</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id} className="hover:bg-gray-50">
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedProperties.has(property.id)}
                      onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                      className="ml-2"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-xs">
                    <a 
                      href={createPropertyUrl(
                        property.id, 
                        property.endereco || '', 
                        property.bairro || '', 
                        property.cidade || '', 
                        property.estado || ''
                      )} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center hover:underline text-blue-600 hover:text-blue-800"
                    >
                      {property.id}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate text-xs" title={property.titulo_propriedade || 'N/A'}>
                      {property.titulo_propriedade || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48">
                    <div className="truncate text-xs" title={property.endereco || 'N/A'}>
                      {property.endereco || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{property.bairro || 'N/A'}</TableCell>
                  <TableCell className="text-xs">{property.cidade || 'N/A'}</TableCell>
                  <TableCell className="text-xs">{property.estado || 'N/A'}</TableCell>
                  <TableCell>
                    {property.tipo_propriedade ? (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                      >
                        {property.tipo_propriedade}
                      </Badge>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-xs">{formatCurrency(property.leilao_1)}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(property.leilao_2)}</TableCell>
                  <TableCell className="text-xs">{formatDate(property.data_leilao_1)}</TableCell>
                  <TableCell className="text-xs">{formatDate(property.data_leilao_2)}</TableCell>
                  <TableCell>
                    {property.tipo_leilao ? (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {property.tipo_leilao}
                      </Badge>
                    ) : 'N/A'}
                  </TableCell>

                  <TableCell className="max-w-48">
                    <div className="truncate text-xs" title={property.leiloeiro_nome || 'N/A'}>
                      {property.leiloeiro_nome || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-32">
                    <div className="truncate text-xs" title={property.numero_processo || 'N/A'}>
                      {property.numero_processo || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate text-xs" title={property.descricao || 'N/A'}>
                      {property.descricao || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(property)}
                        className="h-8 w-8 p-0"
                        title="Editar propriedade"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteDialog(property)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir propriedade"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
              Mostrando {startRecord} a {endRecord} de {totalCount} registros (Página {currentPage + 1} de {totalPages})
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => fetchProperties(0)}
                disabled={currentPage === 0 || loading}
              >
                Primeira
              </Button>
              
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
                {(() => {
                  const maxPages = 7;
                  const pages = [];
                  
                  if (totalPages <= maxPages) {
                    for (let i = 0; i < totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    if (currentPage < 3) {
                      for (let i = 0; i < 5; i++) pages.push(i);
                      pages.push(-1); // Separator
                      pages.push(totalPages - 1);
                    } else if (currentPage > totalPages - 4) {
                      pages.push(0);
                      pages.push(-1); // Separator
                      for (let i = totalPages - 5; i < totalPages; i++) pages.push(i);
                    } else {
                      pages.push(0);
                      pages.push(-1); // Separator
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                      pages.push(-1); // Separator
                      pages.push(totalPages - 1);
                    }
                  }
                  
                  return pages.map((pageNumber, index) => {
                    if (pageNumber === -1) {
                      return <span key={`sep-${index}`} className="px-2 text-gray-400">...</span>;
                    }
                    
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
                  });
                })()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => fetchProperties(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                onClick={() => fetchProperties(totalPages - 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Última
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal para Criar/Editar Propriedade */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        property={selectedProperty}
        onSuccess={() => {
          fetchProperties(currentPage);
          fetchMetadata();
        }}
        onSubmit={selectedProperty ? handleUpdateProperty : handleCreateProperty}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        property={selectedProperty}
        onConfirm={handleDeleteProperty}
        isLoading={crudLoading}
      />

      {/* Dialog de Confirmação de Exclusão Múltipla */}
      <DeleteConfirmDialog
        isOpen={isDeleteMultipleDialogOpen}
        onClose={closeDeleteMultipleDialog}
        property={null}
        onConfirm={handleDeleteMultiple}
        isLoading={deleteMultipleLoading}
        isMultiple={true}
        selectedCount={selectedProperties.size}
      />

      {/* Modal de Importação em Lote */}
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={closeBulkImportModal}
        onSuccess={handleBulkImportSuccess}
      />
    </Card>
  );
};

export default PropertiesTable; 