/**
 * Componente: CtaBlockEditor
 * 
 * Editor de bloco de CTA (Chamada para Ação)
 * Sprint CMS v1
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CtaBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

const CTA_STYLES = [
  { value: 'primary', label: 'Primário (Dourado)' },
  { value: 'secondary', label: 'Secundário (Outline)' },
  { value: 'success', label: 'Sucesso (Verde)' },
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
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const originalText = block.content_draft?.text || block.content_published?.text || '';
    const originalUrl = block.content_draft?.url || block.content_published?.url || '';
    const originalStyle = block.content_draft?.style || block.content_published?.style || 'primary';
    setIsDirty(text !== originalText || url !== originalUrl || style !== originalStyle);
  }, [text, url, style, block.content_draft, block.content_published]);

  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ text, url, style });
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

  const isPublished =
    block.content_published?.text === block.content_draft?.text &&
    block.content_published?.url === block.content_draft?.url;

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`text-${block.id}`}>Texto do Botão</Label>
          <Input
            id={`text-${block.id}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ex: Entre em Contato"
          />
        </div>

        <div>
          <Label htmlFor={`url-${block.id}`}>URL/Link</Label>
          <Input
            id={`url-${block.id}`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ex: /contato ou https://exemplo.com"
          />
        </div>

        <div>
          <Label htmlFor={`style-${block.id}`}>Estilo</Label>
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

        {text && url && (
          <div className="border rounded p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <a
              href={url}
              className={`inline-block px-4 py-2 rounded text-sm font-semibold ${
                style === 'primary'
                  ? 'bg-[#D68E08] text-white'
                  : style === 'secondary'
                    ? 'border-2 border-[#D68E08] text-[#D68E08]'
                    : 'bg-green-600 text-white'
              }`}
              onClick={(e) => e.preventDefault()}
            >
              {text}
            </a>
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
            disabled={!isDirty || isSaving || !text || !url}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || !text || !url}
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
