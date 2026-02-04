/**
 * Componente: ListBlockEditor
 * 
 * Editor de bloco de Lista
 * Sprint CMS v7 — Enhancement: Numerada/desordenada, estilos, drag-drop, import
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { DragDropList } from './shared/DragDropList';
import { ImportModal } from './shared/ImportModal';
import { validateListContent, ValidationError } from '@/utils/validation/blockValidators';
import { Plus, Upload, Trash2, CheckSquare, ArrowRight } from 'lucide-react';

interface ListBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

const LIST_STYLES = [
  { value: 'default', label: '• Padrão (bullet)', icon: '•' },
  { value: 'checkmark', label: '✓ Checkmark', icon: '✓' },
  { value: 'arrow', label: '→ Arrow', icon: '→' },
];

export const ListBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: ListBlockEditorProps) => {
  const [items, setItems] = useState<string[]>(block.content_draft?.items || block.content_published?.items || []);
  const [ordered, setOrdered] = useState<boolean>(block.content_draft?.ordered || block.content_published?.ordered || false);
  const [style, setStyle] = useState<string>(block.content_draft?.style || block.content_published?.style || 'default');
  const [newItem, setNewItem] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Detectar dirty state e validar
  useEffect(() => {
    const originalItems = block.content_draft?.items || block.content_published?.items || [];
    const originalOrdered = block.content_draft?.ordered || block.content_published?.ordered || false;
    const originalStyle = block.content_draft?.style || block.content_published?.style || 'default';

    const isDirtyNow =
      JSON.stringify(items) !== JSON.stringify(originalItems) ||
      ordered !== originalOrdered ||
      style !== originalStyle;

    setIsDirty(isDirtyNow);

    // Validar conteúdo
    if (isDirtyNow || items.length > 0) {
      const errors = validateListContent({ items, ordered, style });
      setValidationErrors(errors);
    }
  }, [items, ordered, style, block.content_draft, block.content_published]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleReorderItems = (newItems: string[]) => {
    setItems(newItems);
  };

  const handleImportItems = (importedItems: string[]) => {
    // Remover duplicatas
    const uniqueItems = Array.from(new Set([...items, ...importedItems]));
    setItems(uniqueItems);
    setShowImport(false);
  };

  const handleClearList = () => {
    if (window.confirm('Tem certeza que quer limpar TODA a lista?')) {
      setItems([]);
    }
  };

  const handleSaveDraft = async () => {
    const errors = validateListContent({ items, ordered, style });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await onSaveDraft({ items, ordered, style });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    const errors = validateListContent({ items, ordered, style });
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
    block.content_published?.ordered === block.content_draft?.ordered &&
    block.content_published?.style === block.content_draft?.style;

  const hasErrors = validationErrors.some((e) => e.type === 'error');
  const canSave = isDirty && !hasErrors && !isSaving;
  const canPublish = !hasErrors && !isSaving && !isPublishing;

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-5">
        {/* Adicionar Item */}
        <div>
          <Label htmlFor={`new-item-${block.id}`}>Adicionar Item</Label>
          <div className="flex gap-2">
            <Input
              id={`new-item-${block.id}`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Digite um item..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                }
              }}
            />
            <Button onClick={handleAddItem} size="sm" variant="outline" disabled={!newItem.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Opções da Lista */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 border border-blue-200 rounded">
          {/* Lista Numerada */}
          <div>
            <Label htmlFor={`ordered-${block.id}`} className="flex items-center gap-2 cursor-pointer">
              <input
                id={`ordered-${block.id}`}
                type="checkbox"
                checked={ordered}
                onChange={(e) => setOrdered(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Lista numerada (1, 2, 3...)</span>
            </Label>
          </div>

          {/* Estilo */}
          <div>
            <Label htmlFor={`style-${block.id}`}>Estilo</Label>
            <select
              id={`style-${block.id}`}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              {LIST_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista com Drag-Drop */}
        {items.length > 0 && (
          <DragDropList
            items={items}
            onReorder={handleReorderItems}
            onRemove={handleRemoveItem}
            label={`Itens (${items.length})`}
          />
        )}

        {/* Preview */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            {ordered ? (
              <ol className="ml-5 space-y-1 text-sm text-gray-700">
                {items.map((item, idx) => (
                  <li key={idx} className="list-decimal">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="ml-5 space-y-1 text-sm text-gray-700">
                {items.map((item, idx) => (
                  <li key={idx} className={`list-${style === 'default' ? 'disc' : 'none'}`}>
                    {style === 'checkmark' && '✓ '}
                    {style === 'arrow' && '→ '}
                    {style === 'default' && '• '}
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-3 bg-gray-50 text-sm text-gray-600">
            Nenhum item adicionado ainda
          </div>
        )}

        {/* Botões de Ação */}
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

          {items.length > 0 && (
            <Button
              onClick={handleClearList}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              disabled={isSaving}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Limpar Tudo
            </Button>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <p className="font-medium mb-1">Erros de validação:</p>
            <ul className="space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>•</span>
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Unsaved changes warning */}
        {isDirty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Você tem mudanças não salvas
          </div>
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
          type="list"
        />
      </CardContent>
    </Card>
  );
};
