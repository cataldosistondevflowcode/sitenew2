/**
 * Componente: RichTextBlockEditor
 * 
 * Editor de bloco de texto formatado (HTML)
 * Sprint CMS v1
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { Eye } from 'lucide-react';

interface RichTextBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const RichTextBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: RichTextBlockEditorProps) => {
  const [content, setContent] = useState<string>(
    block.content_draft?.value || block.content_published?.value || ''
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const originalContent = block.content_draft?.value || block.content_published?.value || '';
    setIsDirty(content !== originalContent);
  }, [content, block.content_draft, block.content_published]);

  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ value: content, format: 'html' });
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

  const isPublished = block.content_published?.value === block.content_draft?.value;

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor={`block-${block.id}`}>Conteúdo HTML</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Editar' : 'Preview'}
            </Button>
          </div>

          {!showPreview && (
            <Textarea
              id={`block-${block.id}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite HTML aqui... (ex: <p>Seu conteúdo</p>)"
              rows={10}
              className="font-mono text-sm"
            />
          )}

          {showPreview && (
            <div
              className="border rounded p-4 bg-white prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {isDirty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Você tem mudanças não salvas
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            disabled={!isDirty || isSaving}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || !content.trim()}
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
