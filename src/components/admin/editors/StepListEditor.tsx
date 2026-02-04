/**
 * Componente: StepListEditor
 * 
 * Editor de bloco para listas de passos numerados
 * Suporta: number, title, description
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
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface StepItem {
  number: number;
  title: string;
  description: string;
}

interface StepListEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
}

export const StepListEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
}: StepListEditorProps) => {
  const initialItems: StepItem[] = block.content_draft?.items || block.content_published?.items || [];
  const [items, setItems] = useState<StepItem[]>(initialItems);
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

  // Renumerar passos quando a ordem muda
  const renumberSteps = (stepList: StepItem[]): StepItem[] => {
    return stepList.map((step, index) => ({
      ...step,
      number: index + 1,
    }));
  };

  const handleAddStep = () => {
    const newStep: StepItem = {
      number: items.length + 1,
      title: 'Novo Passo',
      description: 'Descricao do passo',
    };
    setItems([...items, newStep]);
    setExpandedIndex(items.length);
  };

  const handleRemoveStep = (index: number) => {
    if (window.confirm('Remover este passo?')) {
      const updated = items.filter((_, i) => i !== index);
      setItems(renumberSteps(updated));
      setExpandedIndex(null);
    }
  };

  const handleUpdateStep = (index: number, field: keyof StepItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setItems(renumberSteps(updated));
    setExpandedIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setItems(renumberSteps(updated));
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
        description: 'Salva os passos como rascunho',
        combo: ['ctrl', 's'],
        handler: () => canSave && handleSaveDraft(),
        enabled: canSave,
      },
      {
        key: 'publish',
        label: 'Publicar',
        description: 'Publica os passos',
        combo: ['ctrl', 'p'],
        handler: () => canPublish && handlePublish(),
        enabled: canPublish,
      },
    ],
  });

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        {/* Lista de Passos */}
        <div className="space-y-3">
          {items.map((step, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-all ${
                expandedIndex === index ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Header do Passo */}
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{step.title || 'Sem titulo'}</p>
                  <p className="text-xs text-gray-500 truncate">{step.description || 'Sem descricao'}</p>
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
                      handleRemoveStep(index);
                    }}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor do Passo (expandido) */}
              {expandedIndex === index && (
                <div className="p-4 space-y-4 border-t bg-white">
                  <div>
                    <Label htmlFor={`step-title-${index}`}>Titulo do Passo</Label>
                    <Input
                      id={`step-title-${index}`}
                      value={step.title}
                      onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                      placeholder="Ex: Escolha o Imovel"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`step-desc-${index}`}>Descricao</Label>
                    <Textarea
                      id={`step-desc-${index}`}
                      value={step.description}
                      onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                      placeholder="Descricao detalhada do passo"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botao Adicionar */}
        <Button onClick={handleAddStep} variant="outline" className="w-full" disabled={isSaving}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Passo
        </Button>

        {/* Preview */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-4">Preview:</p>
            <div className="space-y-4">
              {items.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-4 bg-gray-50 text-center text-sm text-gray-500">
            Nenhum passo adicionado. Clique em "Adicionar Passo" para comecar.
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
          <ValidationFeedback status="success" message="Passos salvos com sucesso" />
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
