/**
 * Componente: CtaFieldEditor
 * 
 * Editor para campos de CTA (Call To Action)
 * - Texto do botão
 * - URL de destino
 * - Estilo (primary/secondary)
 * 
 * Usado para campos como: hero_cta_primary, hero_cta_secondary, etc.
 * 
 * Sprint CMS v9 — Editores Compostos
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CtaContent {
  text: string;
  url: string;
  style?: 'primary' | 'secondary';
}

interface CtaFieldEditorProps {
  value: CtaContent;
  onChange: (value: CtaContent) => void;
  onSave?: () => void;
  onFieldFocus?: (fieldKey: string) => void;
  isDirty?: boolean;
  errors?: Record<string, string>;
  disabled?: boolean;
}

/**
 * Editor para campo CTA (texto + URL + estilo)
 */
export function CtaFieldEditor({
  value,
  onChange,
  onSave,
  onFieldFocus,
  isDirty = false,
  errors = {},
  disabled = false,
}: CtaFieldEditorProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleTextChange = (text: string) => {
    onChange({ ...value, text });
    onFieldFocus?.('text');
  };

  const handleUrlChange = (url: string) => {
    onChange({ ...value, url });
    onFieldFocus?.('url');
  };

  const handleStyleChange = (style: 'primary' | 'secondary') => {
    onChange({ ...value, style });
    onFieldFocus?.('style');
  };

  const urlError = errors.url;
  const textError = errors.text;

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Editar CTA</h4>
        {isDirty && (
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
            Não salvo
          </span>
        )}
      </div>

      {/* Texto do botão */}
      <div className="space-y-2">
        <Label htmlFor="cta-text" className="text-sm font-medium">
          Texto do botão *
        </Label>
        <Input
          id="cta-text"
          placeholder="Ex: Buscar Imóveis"
          value={value.text || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={disabled}
          className={cn(textError && 'border-red-500 focus:ring-red-500')}
          onFocus={() => onFieldFocus?.('text')}
        />
        {textError && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            {textError}
          </div>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="cta-url" className="text-sm font-medium">
          URL de destino *
        </Label>
        <div className="flex gap-2">
          <Input
            id="cta-url"
            placeholder="Ex: /search ou https://example.com"
            value={value.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={disabled}
            className={cn(urlError && 'border-red-500 focus:ring-red-500', 'flex-1')}
            onFocus={() => onFieldFocus?.('url')}
          />
          {value.url && !urlError && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewOpen(!previewOpen)}
              title="Visualizar link"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
        {urlError && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            {urlError}
          </div>
        )}
      </div>

      {/* Preview do link */}
      {previewOpen && value.url && (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-700 break-all">
          {value.url}
        </div>
      )}

      {/* Estilo */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Estilo do botão</Label>
        <div className="flex gap-2">
          {(['primary', 'secondary'] as const).map((style) => (
            <button
              key={style}
              onClick={() => handleStyleChange(style)}
              disabled={disabled}
              className={cn(
                'px-4 py-2 rounded text-sm font-medium transition-all',
                value.style === style
                  ? style === 'primary'
                    ? 'bg-[#D68E08] text-white'
                    : 'border-2 border-[#D68E08] text-[#D68E08] bg-white'
                  : style === 'primary'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {style === 'primary' ? 'Primário' : 'Secundário'}
            </button>
          ))}
        </div>
      </div>

      {/* Preview do botão */}
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Preview:</p>
        <div className="flex gap-2">
          {value.style === 'primary' ? (
            <button
              disabled
              className="px-4 py-2 bg-[#D68E08] text-white rounded font-semibold hover:bg-[#B87A07]"
            >
              {value.text || 'Botão primário'}
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 border-2 border-[#D68E08] text-[#D68E08] rounded font-semibold hover:bg-[#D68E08] hover:text-white"
            >
              {value.text || 'Botão secundário'}
            </button>
          )}
        </div>
      </div>

      {/* Botão Salvar */}
      {onSave && isDirty && (
        <Button onClick={onSave} disabled={disabled || !value.text || !value.url} className="w-full">
          Salvar CTA
        </Button>
      )}
    </div>
  );
}
