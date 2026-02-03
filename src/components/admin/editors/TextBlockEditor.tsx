/**
 * Componente: TextBlockEditor
 * 
 * Editor de bloco de texto simples
 * Sprint CMS v1 — Parte do BlockEditorFactory
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';

interface TextBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const TextBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: TextBlockEditorProps) => {
  const [content, setContent] = useState<string>(
    block.content_draft?.value || block.content_published?.value || ''
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Detectar mudanças
  useEffect(() => {
    const originalContent = block.content_draft?.value || block.content_published?.value || '';
    setIsDirty(content !== originalContent);
  }, [content, block.content_draft, block.content_published]);

  // Salvar draft
  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ value: content });
    if (success) {
      setIsDirty(false);
    }
  };

  // Publicar
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const success = await onPublish();
      if (success) {
        setIsDirty(false);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = block.content_published?.value === block.content_draft?.value;

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        {/* Campo de edição */}
        <div>
          <Label htmlFor={`block-${block.id}`}>Conteúdo</Label>
          <Textarea
            id={`block-${block.id}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite o conteúdo aqui..."
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        {/* Status de mudanças */}
        {isDirty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Você tem mudanças não salvas
          </div>
        )}

        {/* Botões de ação */}
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

        {/* Informações de publicação */}
        {block.content_published && (
          <div className="text-xs text-gray-500 border-t pt-3">
            <p>Última atualização: {new Date(block.updated_at).toLocaleString('pt-BR')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
