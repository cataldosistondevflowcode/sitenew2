/**
 * Componente: FaqBlockEditor
 * 
 * Editor de bloco de FAQ (Perguntas & Respostas)
 * Sprint CMS v7 — Enhancement: richtext, busca, múltiplas aberturas, drag-drop, import
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { DragDropList } from './shared/DragDropList';
import { ImportModal } from './shared/ImportModal';
import { validateFAQContent, ValidationError } from '@/utils/validation/blockValidators';
import { ValidationFeedback } from '../ux/ValidationFeedback';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Plus, Trash2, ChevronDown, Upload, Search } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const FaqBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: FaqBlockEditorProps) => {
  const [items, setItems] = useState<FaqItem[]>(block.content_draft?.items || block.content_published?.items || []);
  const [allowMultiple, setAllowMultiple] = useState<boolean>(
    block.content_draft?.allowMultiple || block.content_published?.allowMultiple || false
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Detectar dirty state e validar
  useEffect(() => {
    const originalItems = block.content_draft?.items || block.content_published?.items || [];
    const originalAllowMultiple = block.content_draft?.allowMultiple || block.content_published?.allowMultiple || false;

    const isDirtyNow =
      JSON.stringify(items) !== JSON.stringify(originalItems) ||
      allowMultiple !== originalAllowMultiple;

    setIsDirty(isDirtyNow);

    // Validar conteúdo
    if (isDirtyNow || items.length > 0) {
      const errors = validateFAQContent({ items, allowMultiple });
      setValidationErrors(errors);
    }
  }, [items, allowMultiple, block.content_draft, block.content_published]);

  const handleAddItem = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setItems([...items, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setExpandedIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleReorderItems = (newItems: string[]) => {
    // Este handler é para compatibilidade, mas FAQ não usa DragDropList
    // pois é mais complexo (objeto com question + answer)
  };

  const handleToggleExpanded = (index: number) => {
    const newSet = new Set(expandedIndexes);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      if (!allowMultiple) {
        newSet.clear(); // Se não permite múltiplas, fecha os outros
      }
      newSet.add(index);
    }
    setExpandedIndexes(newSet);
  };

  const handleImportItems = (importedItems: any[]) => {
    const validItems = importedItems
      .filter((item) => typeof item === 'object' && item.question && item.answer)
      .map((item) => ({
        question: String(item.question).trim(),
        answer: String(item.answer).trim(),
      }));

    // Remover duplicatas
    const uniqueItems = Array.from(
      new Map(
        [...items, ...validItems].map((item) => [
          item.question.toLowerCase().trim(),
          item,
        ])
      ).values()
    );

    setItems(uniqueItems);
    setShowImport(false);
  };

  const handleSaveDraft = async () => {
    const errors = validateFAQContent({ items, allowMultiple });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await onSaveDraft({ items, allowMultiple });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    const errors = validateFAQContent({ items, allowMultiple });
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
    JSON.stringify(block.content_published?.items) === JSON.stringify(block.content_draft?.items) &&
    block.content_published?.allowMultiple === block.content_draft?.allowMultiple;

  const hasErrors = validationErrors.some((e) => e.type === 'error');
  const canSave = isDirty && !hasErrors && !isSaving;
  const canPublish = !hasErrors && !isSaving && !isPublishing;

  // Atalhos de teclado
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'save',
        label: 'Salvar Rascunho',
        description: 'Salva a FAQ como rascunho',
        combo: ['ctrl', 's'],
        handler: () => canSave && handleSaveDraft(),
        enabled: canSave,
      },
      {
        key: 'publish',
        label: 'Publicar',
        description: 'Publica a FAQ',
        combo: ['ctrl', 'p'],
        handler: () => canPublish && handlePublish(),
        enabled: canPublish,
      },
    ],
  });

  // Filtro de busca
  const filteredItems = items.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchResults = searchQuery.length > 0;

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-5">
        {/* Adicionar Q&A */}
        <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-medium text-blue-900">Adicionar Pergunta & Resposta</p>

          <div>
            <Label htmlFor={`question-${block.id}`}>
              Pergunta
              {newQuestion.length > 0 && (
                <span className={`ml-2 text-xs ${newQuestion.length > 200 ? 'text-red-600' : 'text-gray-500'}`}>
                  ({newQuestion.length}/200)
                </span>
              )}
            </Label>
            <Input
              id={`question-${block.id}`}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value.slice(0, 200))}
              placeholder="Digite a pergunta..."
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor={`answer-${block.id}`}>
              Resposta
              {newAnswer.length > 0 && (
                <span className={`ml-2 text-xs ${newAnswer.length > 5000 ? 'text-red-600' : 'text-gray-500'}`}>
                  ({newAnswer.length}/5000)
                </span>
              )}
            </Label>
            <Textarea
              id={`answer-${block.id}`}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value.slice(0, 5000))}
              placeholder="Digite a resposta (suporta quebras de linha)..."
              rows={4}
              maxLength={5000}
            />
          </div>

          <Button 
            onClick={handleAddItem} 
            size="sm" 
            variant="outline" 
            className="w-full"
            disabled={!newQuestion.trim() || !newAnswer.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar FAQ
          </Button>
        </div>

        {/* Opções */}
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <Label htmlFor={`allow-multiple-${block.id}`} className="flex items-center gap-2 cursor-pointer">
            <input
              id={`allow-multiple-${block.id}`}
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Permitir múltiplas aberturas simultâneas</span>
          </Label>
        </div>

        {/* Busca */}
        {items.length > 3 && (
          <div>
            <Label htmlFor={`search-${block.id}`}>Buscar pergunta</Label>
            <div className="flex gap-2">
              <Search className="w-5 h-5 text-gray-400 absolute mt-3 ml-3 pointer-events-none" />
              <Input
                id={`search-${block.id}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite para filtrar..."
                className="pl-10"
              />
            </div>
            {hasSearchResults && (
              <p className="text-xs text-gray-600 mt-1">
                {filteredItems.length}/{items.length} encontrada(s)
              </p>
            )}
          </div>
        )}

        {/* Lista de FAQs */}
        {items.length > 0 && (
          <div>
            <Label>
              FAQs ({filteredItems.length}/{items.length})
              {allowMultiple && <span className="ml-2 text-xs text-green-600">📂 Múltiplas aberturas</span>}
            </Label>
            <div className="space-y-2 border rounded p-3 bg-gray-50">
              {filteredItems.map((item, originalIndex) => {
                const index = items.findIndex((i) => i.question === item.question && i.answer === item.answer);
                const isExpanded = expandedIndexes.has(index);

                return (
                  <div key={index} className="bg-white rounded border hover:border-blue-300 transition">
                    <button
                      onClick={() => handleToggleExpanded(index)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
                    >
                      <span className="text-sm font-medium text-left flex-1 truncate">{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(index);
                        }}
                        className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </button>

                    {isExpanded && (
                      <div className="border-t p-3 bg-gray-50">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-3 bg-gray-50 text-sm text-gray-600">
            Nenhuma FAQ adicionada ainda
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => setShowImport(true)}
            size="sm"
            variant="outline"
            disabled={isSaving}
          >
            <Upload className="w-4 h-4 mr-1" />
            Importar
          </Button>
        </div>

        {/* Validation Errors - com novo component */}
        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, idx) => (
              <ValidationFeedback
                key={idx}
                status="error"
                message={error.message}
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
        {!isDirty && !hasErrors && items.length > 0 && (
          <ValidationFeedback
            status="success"
            message="✓ FAQ salva com sucesso"
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

        {/* Import Modal */}
        <ImportModal
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onImport={handleImportItems}
          type="faq"
        />
      </CardContent>
    </Card>
  );
};
