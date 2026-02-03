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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TextBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
}

export const TextBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
}: TextBlockEditorProps) => {
  const [content, setContent] = useState<string>(
    block.content_draft?.value || block.content_published?.value || ''
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Detectar mudanças e validar
  useEffect(() => {
    const originalContent = block.content_draft?.value || block.content_published?.value || '';
    setIsDirty(content !== originalContent);

    // Validar conteúdo em tempo real
    if (validateContent) {
      const errors = validateContent({ value: content });
      setValidationErrors(errors);
    }
  }, [content, block.content_draft, block.content_published, validateContent]);

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
            className={`font-mono text-sm ${validationErrors.length > 0 ? 'border-red-500' : ''}`}
          />
        </div>

        {/* Erros de validação */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc ml-5 space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Status de mudanças */}
        {isDirty && validationErrors.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>Você tem mudanças não salvas</span>
          </div>
        )}

        {/* Confirmação de validação */}
        {!isDirty && validationErrors.length === 0 && content.trim() && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Conteúdo validado ✓</span>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            disabled={!isDirty || isSaving || validationErrors.length > 0}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || validationErrors.length > 0}
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
