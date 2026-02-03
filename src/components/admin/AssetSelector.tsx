/**
 * Componente: AssetSelector
 * 
 * Modal para selecionar imagem da biblioteca
 * Sprint CMS v3
 */

import { useEffect, useState } from 'react';
import { useAssetUpload } from '@/hooks/useAssetUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetLibrary } from './AssetLibrary';
import { AssetUploader } from './AssetUploader';
import { X } from 'lucide-react';

interface AssetSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAsset: (url: string, alt?: string) => void;
}

export const AssetSelector = ({ open, onOpenChange, onSelectAsset }: AssetSelectorProps) => {
  const { loadAssets } = useAssetUpload();

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open, loadAssets]);

  const handleSelectAsset = (url: string, alt?: string) => {
    onSelectAsset(url, alt);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Imagem</DialogTitle>
          <DialogDescription>
            Escolha uma imagem da biblioteca ou faça upload de uma nova
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">📁 Biblioteca</TabsTrigger>
            <TabsTrigger value="upload">📤 Upload Novo</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <AssetLibrary
              onSelectAsset={handleSelectAsset}
              isSelector={true}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <AssetUploader
              onUploadSuccess={(url) => {
                handleSelectAsset(url);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
