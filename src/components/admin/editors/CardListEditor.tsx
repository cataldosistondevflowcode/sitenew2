/**
 * Componente: CardListEditor
 * 
 * Editor de bloco para listas de cards compostos
 * Suporta: title, description, icon/image, link
 * 
 * Sprint CMS v10 — Editores Compostos
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { ValidationFeedback } from '../ux/ValidationFeedback';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Award, Shield, Headset, Star, Heart, Zap } from 'lucide-react';

interface CardItem {
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  link?: string;
}

interface CardListEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
}

const ICON_OPTIONS = [
  { value: 'award', label: 'Award', icon: Award },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'headset', label: 'Headset', icon: Headset },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'zap', label: 'Zap', icon: Zap },
];

export const CardListEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
}: CardListEditorProps) => {
  const initialItems: CardItem[] = block.content_draft?.items || block.content_published?.items || [];
  const [items, setItems] = useState<CardItem[]>(initialItems);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Detectar dirty state
  useEffect(() => {
    const originalItems = block.content_draft?.items || block.content_published?.items || [];
    const isDirtyNow = JSON.stringify(items) !== JSON.stringify(originalItems);
    setIsDirty(isDirtyNow);

    // Validar
    if (isDirtyNow && validateContent) {
      const errors = validateContent({ items });
      setValidationErrors(errors);
    }
  }, [items, block.content_draft, block.content_published, validateContent]);

  const handleAddCard = () => {
    const newCard: CardItem = {
      title: 'Novo Card',
      description: 'Descricao do card',
      icon: 'star',
    };
    setItems([...items, newCard]);
    setExpandedIndex(items.length);
  };

  const handleRemoveCard = (index: number) => {
    if (window.confirm('Remover este card?')) {
      setItems(items.filter((_, i) => i !== index));
      setExpandedIndex(null);
    }
  };

  const handleUpdateCard = (index: number, field: keyof CardItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setItems(updated);
    setExpandedIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setItems(updated);
    setExpandedIndex(index + 1);
  };

  const handleSaveDraft = async () => {
    if (validateContent) {
      const errors = validateContent({ items });
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    const success = await onSaveDraft({ items });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    if (validateContent) {
      const errors = validateContent({ items });
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
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
    JSON.stringify(block.content_published?.items) === JSON.stringify(block.content_draft?.items);

  const hasErrors = validationErrors.length > 0;
  const canSave = isDirty && !hasErrors && !isSaving;
  const canPublish = !hasErrors && !isSaving && !isPublishing;

  // Atalhos de teclado
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'save',
        label: 'Salvar Rascunho',
        description: 'Salva os cards como rascunho',
        combo: ['ctrl', 's'],
        handler: () => canSave && handleSaveDraft(),
        enabled: canSave,
      },
      {
        key: 'publish',
        label: 'Publicar',
        description: 'Publica os cards',
        combo: ['ctrl', 'p'],
        handler: () => canPublish && handlePublish(),
        enabled: canPublish,
      },
    ],
  });

  const renderIconPreview = (iconName?: string) => {
    const iconOption = ICON_OPTIONS.find((opt) => opt.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent className="w-6 h-6 text-primary" />;
    }
    return <Star className="w-6 h-6 text-gray-400" />;
  };

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        {/* Lista de Cards */}
        <div className="space-y-3">
          {items.map((card, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-all ${
                expandedIndex === index ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Header do Card */}
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                {renderIconPreview(card.icon)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{card.title || 'Sem titulo'}</p>
                  <p className="text-xs text-gray-500 truncate">{card.description || 'Sem descricao'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    disabled={index === 0}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    disabled={index === items.length - 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCard(index);
                    }}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor do Card (expandido) */}
              {expandedIndex === index && (
                <div className="p-4 space-y-4 border-t bg-white">
                  <div>
                    <Label htmlFor={`card-title-${index}`}>Titulo</Label>
                    <Input
                      id={`card-title-${index}`}
                      value={card.title}
                      onChange={(e) => handleUpdateCard(index, 'title', e.target.value)}
                      placeholder="Titulo do card"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`card-desc-${index}`}>Descricao</Label>
                    <Textarea
                      id={`card-desc-${index}`}
                      value={card.description}
                      onChange={(e) => handleUpdateCard(index, 'description', e.target.value)}
                      placeholder="Descricao do card"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`card-icon-${index}`}>Icone</Label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {ICON_OPTIONS.map((opt) => {
                        const IconComponent = opt.icon;
                        return (
                          <Button
                            key={opt.value}
                            size="sm"
                            variant={card.icon === opt.value ? 'default' : 'outline'}
                            onClick={() => handleUpdateCard(index, 'icon', opt.value)}
                            className="h-10 w-10 p-0"
                            title={opt.label}
                          >
                            <IconComponent className="w-5 h-5" />
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`card-link-${index}`}>Link (opcional)</Label>
                    <Input
                      id={`card-link-${index}`}
                      value={card.link || ''}
                      onChange={(e) => handleUpdateCard(index, 'link', e.target.value)}
                      placeholder="/pagina ou https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botao Adicionar */}
        <Button onClick={handleAddCard} variant="outline" className="w-full" disabled={isSaving}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Card
        </Button>

        {/* Preview */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {items.map((card, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    {renderIconPreview(card.icon)}
                    <h4 className="font-semibold text-sm">{card.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-4 bg-gray-50 text-center text-sm text-gray-500">
            Nenhum card adicionado. Clique em "Adicionar Card" para comecar.
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, idx) => (
              <ValidationFeedback key={idx} status="error" message={error} />
            ))}
          </div>
        )}

        {/* Unsaved changes warning */}
        {isDirty && <ValidationFeedback status="warning" message="Voce tem mudancas nao salvas" />}

        {/* Success */}
        {!isDirty && !hasErrors && items.length > 0 && (
          <ValidationFeedback status="success" message="Cards salvos com sucesso" />
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSaveDraft} disabled={!canSave} variant="outline" size="sm">
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button onClick={handlePublish} disabled={!canPublish} variant="default" size="sm">
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
