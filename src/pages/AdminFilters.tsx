/**
 * Página Admin para gerenciar filtros (RF-05)
 * CRUD de Regiões, Cidades, Zonas e Bairros
 */

import { useState } from 'react';
import { useFilterData, useFilterRegions, useFilterCities, useFilterZones, useFilterNeighborhoods } from '@/hooks/useFilterData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { FilterRegion, FilterCity, FilterZone, FilterNeighborhood } from '@/hooks/useFilterData';

export default function AdminFilters() {
  const [activeTab, setActiveTab] = useState<'regions' | 'cities' | 'zones' | 'neighborhoods'>('regions');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Buscar dados
  const { regions, loading: regionsLoading } = useFilterRegions();
  const { cities, loading: citiesLoading } = useFilterCities();
  const { zones, loading: zonesLoading } = useFilterZones();
  const { neighborhoods, loading: neighborhoodsLoading } = useFilterNeighborhoods();

  const loading = regionsLoading || citiesLoading || zonesLoading || neighborhoodsLoading;

  // Estados para formulários
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      state: 'RJ',
      display_order: 0,
      is_active: true,
      ...(activeTab === 'cities' && { region_id: null }),
      ...(activeTab === 'zones' && { city_id: null, zone_type: 'zone' }),
      ...(activeTab === 'neighborhoods' && { city_id: null, zone_id: null })
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      let tableName = '';
      let data: any = { ...formData };

      switch (activeTab) {
        case 'regions':
          tableName = 'filter_regions';
          data = { name: data.name, state: data.state, display_order: data.display_order || 0, is_active: data.is_active !== false };
          break;
        case 'cities':
          tableName = 'filter_cities';
          data = { name: data.name, state: data.state, region_id: data.region_id || null, display_order: data.display_order || 0, is_active: data.is_active !== false };
          break;
        case 'zones':
          tableName = 'filter_zones';
          data = { name: data.name, city_id: data.city_id, zone_type: data.zone_type || 'zone', display_order: data.display_order || 0, is_active: data.is_active !== false };
          break;
        case 'neighborhoods':
          tableName = 'filter_neighborhoods';
          data = { name: data.name, city_id: data.city_id, zone_id: data.zone_id || null, display_order: data.display_order || 0, is_active: data.is_active !== false };
          break;
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from(tableName)
          .update(data)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Item atualizado com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from(tableName)
          .insert(data);

        if (error) throw error;
        toast.success('Item criado com sucesso!');
      }

      handleCancel();
      // Recarregar dados (os hooks vão atualizar automaticamente)
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(`Erro ao salvar: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      let tableName = '';
      switch (activeTab) {
        case 'regions':
          tableName = 'filter_regions';
          break;
        case 'cities':
          tableName = 'filter_cities';
          break;
        case 'zones':
          tableName = 'filter_zones';
          break;
        case 'neighborhoods':
          tableName = 'filter_neighborhoods';
          break;
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item excluído com sucesso!');
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Filtros</h1>
        <p className="text-gray-600 mt-2">Gerencie regiões, cidades, zonas e bairros para os filtros do site</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as any);
        handleCancel();
      }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regions">Regiões ({regions.length})</TabsTrigger>
          <TabsTrigger value="cities">Cidades ({cities.length})</TabsTrigger>
          <TabsTrigger value="zones">Zonas ({zones.length})</TabsTrigger>
          <TabsTrigger value="neighborhoods">Bairros ({neighborhoods.length})</TabsTrigger>
        </TabsList>

        {/* Regiões */}
        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Regiões</CardTitle>
                  <CardDescription>Gerencie as regiões disponíveis nos filtros</CardDescription>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Região
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(isCreating || editingId) && (
                <div className="mb-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.state || 'RJ'}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      <option value="RJ">RJ</option>
                      <option value="SP">SP</option>
                    </select>
                  </div>
                  <div>
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active_region"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active_region">Ativo</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((region) => (
                    <TableRow key={region.id}>
                      <TableCell>{region.id}</TableCell>
                      <TableCell>{region.name}</TableCell>
                      <TableCell>{region.state}</TableCell>
                      <TableCell>{region.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={region.is_active ? 'default' : 'secondary'}>
                          {region.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(region)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(region.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cidades */}
        <TabsContent value="cities">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cidades</CardTitle>
                  <CardDescription>Gerencie as cidades disponíveis nos filtros</CardDescription>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cidade
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(isCreating || editingId) && (
                <div className="mb-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.state || 'RJ'}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      <option value="RJ">RJ</option>
                      <option value="SP">SP</option>
                    </select>
                  </div>
                  <div>
                    <Label>Região</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.region_id || ''}
                      onChange={(e) => setFormData({ ...formData, region_id: e.target.value ? parseInt(e.target.value) : null })}
                    >
                      <option value="">Nenhuma</option>
                      {regions.filter(r => r.state === formData.state).map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active_city"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active_city">Ativo</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>{city.id}</TableCell>
                      <TableCell>{city.name}</TableCell>
                      <TableCell>{city.state}</TableCell>
                      <TableCell>
                        {city.region_id ? regions.find(r => r.id === city.region_id)?.name || city.region_id : '-'}
                      </TableCell>
                      <TableCell>{city.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={city.is_active ? 'default' : 'secondary'}>
                          {city.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(city)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(city.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zonas */}
        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Zonas</CardTitle>
                  <CardDescription>Gerencie as zonas disponíveis nos filtros</CardDescription>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Zona
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(isCreating || editingId) && (
                <div className="mb-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.city_id || ''}
                      onChange={(e) => setFormData({ ...formData, city_id: parseInt(e.target.value) })}
                    >
                      <option value="">Selecione uma cidade</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name} ({city.state})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Tipo de Zona</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.zone_type || 'zone'}
                      onChange={(e) => setFormData({ ...formData, zone_type: e.target.value })}
                    >
                      <option value="zone">Zona</option>
                      <option value="region">Região</option>
                    </select>
                  </div>
                  <div>
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active_zone"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active_zone">Ativo</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.id}</TableCell>
                      <TableCell>{zone.name}</TableCell>
                      <TableCell>
                        {cities.find(c => c.id === zone.city_id)?.name || zone.city_id}
                      </TableCell>
                      <TableCell>{zone.zone_type}</TableCell>
                      <TableCell>{zone.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={zone.is_active ? 'default' : 'secondary'}>
                          {zone.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(zone)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(zone.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bairros */}
        <TabsContent value="neighborhoods">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Bairros</CardTitle>
                  <CardDescription>Gerencie os bairros disponíveis nos filtros</CardDescription>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Bairro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(isCreating || editingId) && (
                <div className="mb-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.city_id || ''}
                      onChange={(e) => setFormData({ ...formData, city_id: parseInt(e.target.value) })}
                    >
                      <option value="">Selecione uma cidade</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name} ({city.state})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Zona (Opcional)</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.zone_id || ''}
                      onChange={(e) => setFormData({ ...formData, zone_id: e.target.value ? parseInt(e.target.value) : null })}
                    >
                      <option value="">Nenhuma</option>
                      {zones.filter(z => z.city_id === formData.city_id).map(zone => (
                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active_neighborhood"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active_neighborhood">Ativo</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Zona</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {neighborhoods.map((neighborhood) => (
                    <TableRow key={neighborhood.id}>
                      <TableCell>{neighborhood.id}</TableCell>
                      <TableCell>{neighborhood.name}</TableCell>
                      <TableCell>
                        {cities.find(c => c.id === neighborhood.city_id)?.name || neighborhood.city_id}
                      </TableCell>
                      <TableCell>
                        {neighborhood.zone_id ? zones.find(z => z.id === neighborhood.zone_id)?.name || neighborhood.zone_id : '-'}
                      </TableCell>
                      <TableCell>{neighborhood.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={neighborhood.is_active ? 'default' : 'secondary'}>
                          {neighborhood.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(neighborhood)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(neighborhood.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
