/**
 * Componente: BannerBlockEditor
 * 
 * Editor para blocos tipo "banner"
 * Sprint CMS v1 — Tipo banner do spec
 * 
 * Estrutura banner:
 * {
 *   "title": "Título do banner",
 *   "subtitle": "Subtítulo (opcional)",
 *   "image_url": "https://...",
 *   "cta_text": "Botão CTA",
 *   "cta_link": "/destino",
 *   "background_color": "#ffffff"
 * }
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Save, Send, X } from 'lucide-react';
import { BlockEditorHeader } from './BlockEditorHeader';
import { CmsBlock } from '@/hooks/useCmsContent';
import { ValidationFeedback } from '@/components/admin/ux/ValidationFeedback';

interface BannerBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
}

export const BannerBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
}: BannerBlockEditorProps) => {
  const content = block.content_draft || block.content_published || {};
  
  const [formData, setFormData] = useState({
    title: content.title || '',
    subtitle: content.subtitle || '',
    image_url: content.image_url || '',
    cta_text: content.cta_text || 'Saiba Mais',
    cta_link: content.cta_link || '/',
    background_color: content.background_color || '#f5f5f5',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [localSaving, setLocalSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSave = async () => {
    setLocalSaving(true);
    const validationErrors = validateContent?.(formData) || [];
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLocalSaving(false);
      return;
    }

    const ok = await onSaveDraft(formData);
    if (ok) {
      setErrors([]);
    }
    setLocalSaving(false);
  };

  const handlePublish = async () => {
    setLocalSaving(true);
    const validationErrors = validateContent?.(formData) || [];
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLocalSaving(false);
      return;
    }

    // Salvar draft primeiro
    await onSaveDraft(formData);
    // Depois publicar
    await onPublish();
    setLocalSaving(false);
  };

  const isPublished =
    JSON.stringify(block.content_draft) === JSON.stringify(block.content_published);

  return (
    <div className="space-y-4">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      {/* Erros de validação */}
      {errors.length > 0 && (
        <ValidationFeedback
          type="error"
          message="Validação falhou"
          details={errors}
        />
      )}

      {/* Formulário do Banner */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Título */}
          <div>
            <label className="text-sm font-medium text-gray-700">Título *</label>
            <Input
              type="text"
              placeholder="Ex: Bem-vindo ao site"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Texto principal do banner.</p>
          </div>

          {/* Subtítulo */}
          <div>
            <label className="text-sm font-medium text-gray-700">Subtítulo</label>
            <Textarea
              placeholder="Ex: Uma descrição adicional (opcional)"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>

          {/* URL da Imagem */}
          <div>
            <label className="text-sm font-medium text-gray-700">URL da Imagem</label>
            <Input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="mt-1"
            />
            {formData.image_url && (
              <div className="mt-2 rounded overflow-hidden border">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23999%22%3EImagem inválida%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
          </div>

          {/* CTA Texto */}
          <div>
            <label className="text-sm font-medium text-gray-700">Texto do Botão</label>
            <Input
              type="text"
              placeholder="Ex: Clique aqui"
              value={formData.cta_text}
              onChange={(e) => handleChange('cta_text', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* CTA Link */}
          <div>
            <label className="text-sm font-medium text-gray-700">Link do Botão</label>
            <Input
              type="text"
              placeholder="Ex: /pagina ou https://exemplo.com"
              value={formData.cta_link}
              onChange={(e) => handleChange('cta_link', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Cor de fundo */}
          <div>
            <label className="text-sm font-medium text-gray-700">Cor de Fundo</label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="flex-1"
                placeholder="#f5f5f5"
              />
            </div>
          </div>

          {/* Preview do Banner */}
          <div className="mt-6 p-4 rounded border-2 border-dashed border-gray-300">
            <div
              className="rounded p-6 text-center transition-colors"
              style={{ backgroundColor: formData.background_color }}
            >
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Banner"
                  className="w-full h-24 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-lg font-bold text-gray-900">{formData.title || 'Título'}</h3>
              {formData.subtitle && (
                <p className="text-sm text-gray-600 mt-2">{formData.subtitle}</p>
              )}
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium">
                {formData.cta_text}
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={localSaving || isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {localSaving || isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Draft
                </>
              )}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={localSaving || isSaving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {localSaving || isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
