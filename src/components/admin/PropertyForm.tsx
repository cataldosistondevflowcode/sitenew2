import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { Save, X, Upload, Image, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
    // Campos de financiamento
    financiamento: false,
    parcelamento: false,
    consorcio: false,
    fgts: false,
  });

  // Estados para upload de imagem
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      
      // Definir preview da imagem se existir
      if (property.imagem) {
        setImagePreview(property.imagem);
      }
      
      // Garantir que campos de financiamento tenham valores booleanos
      setFormData(prev => ({
        ...prev,
        financiamento: property.financiamento || false,
        parcelamento: property.parcelamento || false,
        consorcio: property.consorcio || false,
        fgts: property.fgts || false,
      }));
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Fazer upload da imagem se houver uma nova selecionada
      let imageUrl = formData.imagem;
      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      // Converter datas de volta para formato ISO
      const dataToSubmit = {
        ...formData,
        imagem: imageUrl,
        data_leilao_1: formData.data_leilao_1 ? 
          new Date(formData.data_leilao_1).toISOString() : null,
        data_leilao_2: formData.data_leilao_2 ? 
          new Date(formData.data_leilao_2).toISOString() : null,
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Lógica automática para campo financiamento baseado no tipo de leilão
      if (field === 'tipo_leilao') {
        if (value === 'EXTRAJUDICIAL FINANCIÁVEL') {
          newData.financiamento = true;
          console.log('✅ Financiamento marcado automaticamente para EXTRAJUDICIAL FINANCIÁVEL');
        } else {
          newData.financiamento = false;
          console.log('❌ Financiamento desmarcado para:', value);
        }
      }
      
      return newData;
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imagem: '' }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return formData.imagem || null;

    try {
      setUploadingImage(true);
      
      // Gerar nome único para o arquivo
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `backup/${fileName}`;

      // Upload para o Supabase
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, selectedImage);

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const isEditing = !!property?.id;

  // Função para determinar opções de financiamento baseado no tipo de leilão
  const getFinancingOptions = () => {
    switch (formData.tipo_leilao) {
      case 'JUDICIAL':
        return {
          showFinancing: false,
          showParcelamento: false,
          showConsorcio: false,
          showFgts: false,
          description: 'Leilões judiciais são pagos à vista'
        };
      case 'EXTRAJUDICIAL':
        return {
          showFinancing: true,
          showParcelamento: true,
          showConsorcio: true,
          showFgts: true,
          description: 'Leilões extrajudiciais podem ter opções de financiamento'
        };
      case 'EXTRAJUDICIAL FINANCIÁVEL':
        return {
          showFinancing: true,
          showParcelamento: true,
          showConsorcio: true,
          showFgts: true,
          description: 'Leilões extrajudiciais com financiamento facilitado. Campo "Financiamento" marcado automaticamente.'
        };
      default:
        return {
          showFinancing: false,
          showParcelamento: false,
          showConsorcio: false,
          showFgts: false,
          description: 'Selecione o tipo de leilão para ver as opções'
        };
    }
  };

  const financingOptions = getFinancingOptions();

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
                   <SelectItem value="Apartamento">Apartamento</SelectItem>
                   <SelectItem value="Área">Área</SelectItem>
                   <SelectItem value="Casa">Casa</SelectItem>
                   <SelectItem value="Chácara">Chácara</SelectItem>
                   <SelectItem value="Comercial">Comercial</SelectItem>
                   <SelectItem value="Fazenda">Fazenda</SelectItem>
                   <SelectItem value="Outros">Outros</SelectItem>
                   <SelectItem value="Prédio">Prédio</SelectItem>
                   <SelectItem value="Rural">Rural</SelectItem>
                   <SelectItem value="Terreno">Terreno</SelectItem>
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
                  <SelectItem value="JUDICIAL">JUDICIAL</SelectItem>
                  <SelectItem value="EXTRAJUDICIAL">EXTRAJUDICIAL</SelectItem>
                  <SelectItem value="EXTRAJUDICIAL FINANCIÁVEL">EXTRAJUDICIAL FINANCIÁVEL</SelectItem>
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
              <Label htmlFor="imagem">Imagem da Propriedade</Label>
              
              {/* Preview da imagem atual ou selecionada */}
              {imagePreview && (
                <div className="relative mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview da propriedade" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                    disabled={uploadingImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload de nova imagem */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label htmlFor="imagem" className="cursor-pointer">
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Fazendo upload...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {imagePreview ? 'Clique para trocar a imagem' : 'Clique ou arraste para fazer upload'}
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF até 5MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
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
            <Button type="submit" disabled={isLoading || uploadingImage}>
              <Save className="h-4 w-4 mr-2" />
              {uploadingImage ? 'Fazendo Upload...' : (isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar'))}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm; 