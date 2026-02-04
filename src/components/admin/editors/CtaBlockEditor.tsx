/**
 * Componente: CtaBlockEditor
 * 
 * Editor de bloco de CTA (Chamada para Ação)
 * Sprint CMS v7 — Enhancement: Validação robusta, target support, preview responsivo
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UrlInput } from './shared/UrlInput';
import { validateCTAContent, ValidationError } from '@/utils/validation/blockValidators';
import { ValidationFeedback } from '../ux/ValidationFeedback';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface CtaBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

const CTA_STYLES = [
  { value: 'primary', label: '🟡 Primário (Dourado)', color: '#D68E08' },
  { value: 'secondary', label: '⬜ Secundário (Outline)', color: 'transparent' },
  { value: 'warning', label: '🟠 Aviso (Laranja)', color: '#F97316' },
  { value: 'danger', label: '🔴 Perigo (Vermelho)', color: '#DC2626' },
  { value: 'success', label: '🟢 Sucesso (Verde)', color: '#16A34A' },
];

const TARGET_OPTIONS = [
  { value: '_self', label: 'Abrir na mesma aba' },
  { value: '_blank', label: 'Abrir em nova aba' },
];

export const CtaBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: CtaBlockEditorProps) => {
  const [text, setText] = useState<string>(block.content_draft?.text || block.content_published?.text || '');
  const [url, setUrl] = useState<string>(block.content_draft?.url || block.content_published?.url || '');
  const [style, setStyle] = useState<string>(block.content_draft?.style || block.content_published?.style || 'primary');
  const [target, setTarget] = useState<string>(block.content_draft?.target || block.content_published?.target || '_self');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Detectar dirty state
  useEffect(() => {
    const originalText = block.content_draft?.text || block.content_published?.text || '';
    const originalUrl = block.content_draft?.url || block.content_published?.url || '';
    const originalStyle = block.content_draft?.style || block.content_published?.style || 'primary';
    const originalTarget = block.content_draft?.target || block.content_published?.target || '_self';
    
    const isDirtyNow =
      text !== originalText ||
      url !== originalUrl ||
      style !== originalStyle ||
      target !== originalTarget;
    
    setIsDirty(isDirtyNow);

    // Validar conteúdo
    if (isDirtyNow || text || url) {
      const errors = validateCTAContent({ text, url, style, target });
      setValidationErrors(errors);
    }
  }, [text, url, style, target, block.content_draft, block.content_published]);

  const handleSaveDraft = async () => {
    const errors = validateCTAContent({ text, url, style, target });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await onSaveDraft({ text, url, style, target });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    const errors = validateCTAContent({ text, url, style, target });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsPublishing(true);
    try {
      await onPublish();
      setIsDirty(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished =
    block.content_published?.text === block.content_draft?.text &&
    block.content_published?.url === block.content_draft?.url &&
    block.content_published?.style === block.content_draft?.style &&
    block.content_published?.target === block.content_draft?.target;

  const hasErrors = validationErrors.length > 0;
  const canSave = isDirty && !hasErrors && !isSaving;
  const canPublish = !hasErrors && !isSaving && !isPublishing;

  // Get color for preview
  const selectedStyle = CTA_STYLES.find((s) => s.value === style);
  const previewColor = selectedStyle?.color || '#D68E08';

  // Atalhos de teclado
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'save',
        label: 'Salvar Rascunho',
        description: 'Salva o CTA como rascunho',
        combo: ['ctrl', 's'],
        handler: () => canSave && handleSaveDraft(),
        enabled: canSave,
      },
      {
        key: 'publish',
        label: 'Publicar',
        description: 'Publica o CTA',
        combo: ['ctrl', 'p'],
        handler: () => canPublish && handlePublish(),
        enabled: canPublish,
      },
    ],
  });

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-5">
        {/* Texto do Botão */}
        <div>
          <Label htmlFor={`text-${block.id}`}>
            Texto do Botão
            {text.length > 0 && (
              <span className={`ml-2 text-xs ${text.length > 100 ? 'text-red-600' : 'text-gray-500'}`}>
                ({text.length}/100)
              </span>
            )}
          </Label>
          <Input
            id={`text-${block.id}`}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 100))}
            placeholder="ex: Entre em Contato"
            maxLength={100}
          />
          {validationErrors.find((e) => e.field === 'text') && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.find((e) => e.field === 'text')?.message}
            </p>
          )}
        </div>

        {/* URL com validação */}
        <UrlInput
          id={`url-${block.id}`}
          value={url}
          onChange={setUrl}
          onError={setUrlError}
          label="URL/Link"
          placeholder="ex: https://exemplo.com ou /contato"
          showSuggestion={true}
        />

        {/* Target */}
        <div>
          <Label htmlFor={`target-${block.id}`}>Comportamento do Link</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger id={`target-${block.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TARGET_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estilo */}
        <div>
          <Label htmlFor={`style-${block.id}`}>Estilo Visual</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger id={`style-${block.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CTA_STYLES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview Responsivo */}
        {text && url && !urlError && (
          <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-medium text-blue-900">Preview em diferentes tamanhos:</p>

            {/* Mobile */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-blue-100">
              <span className="text-xs text-gray-600 font-medium">Mobile (375px)</span>
              <a
                href={url}
                target={target === '_blank' ? '_blank' : undefined}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                  style === 'secondary'
                    ? `border-2 border-[#D68E08] text-[#D68E08]`
                    : `text-white`
                }`}
                style={{
                  backgroundColor: style !== 'secondary' ? previewColor : 'transparent',
                }}
                onClick={(e) => e.preventDefault()}
              >
                {text.length > 20 ? text.slice(0, 17) + '...' : text}
              </a>
            </div>

            {/* Tablet */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-blue-100">
              <span className="text-xs text-gray-600 font-medium">Tablet (768px)</span>
              <a
                href={url}
                target={target === '_blank' ? '_blank' : undefined}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  style === 'secondary'
                    ? `border-2 border-[#D68E08] text-[#D68E08]`
                    : `text-white`
                }`}
                style={{
                  backgroundColor: style !== 'secondary' ? previewColor : 'transparent',
                }}
                onClick={(e) => e.preventDefault()}
              >
                {text.length > 30 ? text.slice(0, 27) + '...' : text}
              </a>
            </div>

            {/* Desktop */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-blue-100">
              <span className="text-xs text-gray-600 font-medium">Desktop (1024px+)</span>
              <a
                href={url}
                target={target === '_blank' ? '_blank' : undefined}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`px-6 py-2 rounded text-sm font-semibold transition ${
                  style === 'secondary'
                    ? `border-2 border-[#D68E08] text-[#D68E08]`
                    : `text-white`
                }`}
                style={{
                  backgroundColor: style !== 'secondary' ? previewColor : 'transparent',
                }}
                onClick={(e) => e.preventDefault()}
              >
                {text}
              </a>
            </div>
          </div>
        )}

        {/* Validation Errors - com novo component */}
        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, idx) => (
              <ValidationFeedback
                key={idx}
                status="error"
                message={error.message}
                suggestion={error.suggestion}
                onDismiss={() => {
                  setValidationErrors(validationErrors.filter((_, i) => i !== idx));
                }}
              />
            ))}
          </div>
        )}

        {/* Unsaved changes warning - com novo component */}
        {isDirty && (
          <ValidationFeedback
            status="warning"
            message="Você tem mudanças não salvas"
          />
        )}

        {/* Sucesso - salvo */}
        {!isDirty && !hasErrors && block.content_draft && (
          <ValidationFeedback
            status="success"
            message="✓ Rascunho salvo com sucesso"
          />
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSaveDraft}
            disabled={!canSave}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={!canPublish}
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
