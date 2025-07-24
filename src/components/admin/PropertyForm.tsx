import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { Save, X } from 'lucide-react';

type Property = Tables<'leiloes_imoveis'>;

interface PropertyFormProps {
  property?: Property | null;
  onSubmit: (data: Partial<Property>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PropertyForm = ({ property, onSubmit, onCancel, isLoading = false }: PropertyFormProps) => {
  const [formData, setFormData] = useState<Partial<Property>>({
    titulo_propriedade: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    descricao: '',
    url: '',
    imagem: '',
    leilao_1: null,
    leilao_2: null,
    data_leilao_1: null,
    data_leilao_2: null,
    leiloeiro_nome: '',
    numero_processo: '',
    tipo_leilao: '',
    tipo_propriedade: '',
    consorcio: false,
    parcelamento: false,
    fgts: false,
    financiamento: false,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        // Converter datas para formato de input datetime-local
        data_leilao_1: property.data_leilao_1 ? 
          new Date(property.data_leilao_1).toISOString().slice(0, 16) : null,
        data_leilao_2: property.data_leilao_2 ? 
          new Date(property.data_leilao_2).toISOString().slice(0, 16) : null,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter datas de volta para formato ISO
    const dataToSubmit = {
      ...formData,
      data_leilao_1: formData.data_leilao_1 ? 
        new Date(formData.data_leilao_1).toISOString() : null,
      data_leilao_2: formData.data_leilao_2 ? 
        new Date(formData.data_leilao_2).toISOString() : null,
    };

    await onSubmit(dataToSubmit);
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isEditing = !!property?.id;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          {isEditing ? 'Editar Propriedade' : 'Nova Propriedade'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo_propriedade">Título da Propriedade *</Label>
              <Input
                id="titulo_propriedade"
                value={formData.titulo_propriedade || ''}
                onChange={(e) => handleInputChange('titulo_propriedade', e.target.value)}
                placeholder="Ex: Casa 3 quartos - Centro"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo_propriedade">Tipo de Propriedade</Label>
              <Select 
                value={formData.tipo_propriedade || ''} 
                onValueChange={(value) => handleInputChange('tipo_propriedade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco || ''}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua, número, complemento"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro || ''}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                placeholder="Nome do bairro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.cidade || ''}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Nome da cidade"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select 
                value={formData.estado || ''} 
                onValueChange={(value) => handleInputChange('estado', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo_leilao">Tipo de Leilão</Label>
              <Select 
                value={formData.tipo_leilao || ''} 
                onValueChange={(value) => handleInputChange('tipo_leilao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Judicial">Judicial</SelectItem>
                  <SelectItem value="Extrajudicial">Extrajudicial</SelectItem>
                  <SelectItem value="Caixa Econômica Federal">Caixa Econômica Federal</SelectItem>
                  <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                  <SelectItem value="Santander">Santander</SelectItem>
                  <SelectItem value="Itaú">Itaú</SelectItem>
                  <SelectItem value="Bradesco">Bradesco</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valores e Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leilao_1">Valor 1º Leilão (R$)</Label>
              <Input
                id="leilao_1"
                type="number"
                step="0.01"
                value={formData.leilao_1 || ''}
                onChange={(e) => handleInputChange('leilao_1', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0,00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leilao_2">Valor 2º Leilão (R$)</Label>
              <Input
                id="leilao_2"
                type="number"
                step="0.01"
                value={formData.leilao_2 || ''}
                onChange={(e) => handleInputChange('leilao_2', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_leilao_1">Data 1º Leilão</Label>
              <Input
                id="data_leilao_1"
                type="datetime-local"
                value={formData.data_leilao_1 || ''}
                onChange={(e) => handleInputChange('data_leilao_1', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data_leilao_2">Data 2º Leilão</Label>
              <Input
                id="data_leilao_2"
                type="datetime-local"
                value={formData.data_leilao_2 || ''}
                onChange={(e) => handleInputChange('data_leilao_2', e.target.value)}
              />
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leiloeiro_nome">Nome do Leiloeiro</Label>
              <Input
                id="leiloeiro_nome"
                value={formData.leiloeiro_nome || ''}
                onChange={(e) => handleInputChange('leiloeiro_nome', e.target.value)}
                placeholder="Nome completo do leiloeiro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numero_processo">Número do Processo</Label>
              <Input
                id="numero_processo"
                value={formData.numero_processo || ''}
                onChange={(e) => handleInputChange('numero_processo', e.target.value)}
                placeholder="Número do processo judicial"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL do Leilão</Label>
              <Input
                id="url"
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://exemplo.com/leilao"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imagem">URL da Imagem</Label>
              <Input
                id="imagem"
                type="url"
                value={formData.imagem || ''}
                onChange={(e) => handleInputChange('imagem', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descrição detalhada da propriedade..."
              rows={4}
            />
          </div>

          {/* Opções */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Opções de Financiamento</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fgts"
                  checked={formData.fgts || false}
                  onCheckedChange={(checked) => handleInputChange('fgts', checked)}
                />
                <Label htmlFor="fgts" className="text-sm">FGTS</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financiamento"
                  checked={formData.financiamento || false}
                  onCheckedChange={(checked) => handleInputChange('financiamento', checked)}
                />
                <Label htmlFor="financiamento" className="text-sm">Financiamento</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parcelamento"
                  checked={formData.parcelamento || false}
                  onCheckedChange={(checked) => handleInputChange('parcelamento', checked)}
                />
                <Label htmlFor="parcelamento" className="text-sm">Parcelamento</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consorcio"
                  checked={formData.consorcio || false}
                  onCheckedChange={(checked) => handleInputChange('consorcio', checked)}
                />
                <Label htmlFor="consorcio" className="text-sm">Consórcio</Label>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm; 