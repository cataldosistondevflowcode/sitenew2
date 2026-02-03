/**
 * Componente: AssetLibrary
 * 
 * Galeria de imagens com seleção e edição de metadados
 * Sprint CMS v2
 */

import { useEffect, useState } from 'react';
import { useAssetUpload, Asset } from '@/hooks/useAssetUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface AssetLibraryProps {
  onSelectAsset?: (url: string, alt?: string) => void;
  isSelector?: boolean;
}

export const AssetLibrary = ({ onSelectAsset, isSelector = false }: AssetLibraryProps) => {
  const { loadAssets, deleteAsset, updateAssetMetadata, assets, loading } = useAssetUpload();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const handleEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setEditAlt(asset.alt_text || '');
    setEditTitle(asset.title || '');
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      const success = await updateAssetMetadata(editingId, editAlt, editTitle);
      if (success) {
        setEditingId(null);
      }
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (confirm(`Tem certeza que deseja deletar "${asset.filename}"?`)) {
      await deleteAsset(asset);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  const handleSelect = (asset: Asset) => {
    onSelectAsset?.(asset.url, asset.alt_text || asset.title);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Carregando biblioteca...</p>
        </CardContent>
      </Card>
    );
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Nenhuma imagem na biblioteca ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biblioteca de Imagens ({assets.length})</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              {/* Thumbnail */}
              <div
                className="relative bg-gray-100 aspect-square overflow-hidden cursor-pointer group"
                onClick={() => isSelector && handleSelect(asset)}
              >
                <img
                  src={asset.url}
                  alt={asset.alt_text || asset.title || 'Asset'}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                {isSelector && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Button size="sm" onClick={() => handleSelect(asset)}>
                      Selecionar
                    </Button>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="p-3 space-y-2">
                {editingId === asset.id ? (
                  <>
                    <Input
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      placeholder="Alt text"
                      size="sm"
                      className="text-xs"
                    />
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Título"
                      size="sm"
                      className="text-xs"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="flex-1 h-7 text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="flex-1 h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {asset.filename}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {asset.alt_text || asset.title || 'Sem descrição'}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyUrl(asset.url)}
                        className="flex-1 h-7 text-xs"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(asset)}
                        className="flex-1 h-7 text-xs"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(asset)}
                        className="flex-1 h-7 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
