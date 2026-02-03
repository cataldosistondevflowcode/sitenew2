/**
 * Componente: ImageBlockEditor
 * 
 * Editor de bloco de imagem com seletor de biblioteca
 * Sprint CMS v1 + v3
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { AssetSelector } from '../AssetSelector';
import { Image as ImageIcon } from 'lucide-react';

interface ImageBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const ImageBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: ImageBlockEditorProps) => {
  const [url, setUrl] = useState<string>(block.content_draft?.url || block.content_published?.url || '');
  const [alt, setAlt] = useState<string>(block.content_draft?.alt || block.content_published?.alt || '');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    const originalUrl = block.content_draft?.url || block.content_published?.url || '';
    const originalAlt = block.content_draft?.alt || block.content_published?.alt || '';
    setIsDirty(url !== originalUrl || alt !== originalAlt);
  }, [url, alt, block.content_draft, block.content_published]);

  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ url, alt, asset_id: null });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      setIsDirty(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = block.content_published?.url === block.content_draft?.url;

  const handleSelectAsset = (assetUrl: string, assetAlt?: string) => {
    setUrl(assetUrl);
    if (assetAlt) {
      setAlt(assetAlt);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <BlockEditorHeader block={block} isPublished={isPublished} />

        <CardContent className="space-y-4">
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Biblioteca
              </TabsTrigger>
              <TabsTrigger value="manual">URL Manual</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-3">
              <Button
                onClick={() => setSelectorOpen(true)}
                variant="outline"
                className="w-full"
              >
                Selecionar Imagem da Biblioteca
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-3">
              <div>
                <Label htmlFor={`url-${block.id}`}>URL da Imagem</Label>
                <Input
                  id={`url-${block.id}`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  type="url"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <Label htmlFor={`alt-${block.id}`}>Texto Alternativo (Alt)</Label>
            <Input
              id={`alt-${block.id}`}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Descrição da imagem para SEO"
            />
          </div>

          {url && (
            <div className="border rounded p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={url}
                alt={alt}
                className="max-w-md max-h-64 rounded"
              />
            </div>
          )}

          {isDirty && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              ⚠️ Você tem mudanças não salvas
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSaveDraft}
              disabled={!isDirty || isSaving || !url}
              variant="outline"
              size="sm"
            >
              {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isSaving || isPublishing || !url}
              variant="default"
              size="sm"
            >
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Asset Selector Modal */}
      <AssetSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectAsset={handleSelectAsset}
      />
    </>
  );
};
