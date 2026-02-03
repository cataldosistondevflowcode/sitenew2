/**
 * Componente: ImageBlockEditor
 * 
 * Editor de bloco de imagem
 * Sprint CMS v1
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';

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

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
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
              onError={() => (
                <div className="bg-red-50 border border-red-200 rounded p-2 text-red-800 text-sm">
                  ❌ URL não carregou
                </div>
              )}
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
  );
};
