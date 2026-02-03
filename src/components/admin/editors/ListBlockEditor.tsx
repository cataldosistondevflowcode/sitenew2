/**
 * Componente: ListBlockEditor
 * 
 * Editor de bloco de Lista
 * Sprint CMS v1
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { Plus, Trash2 } from 'lucide-react';

interface ListBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const ListBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: ListBlockEditorProps) => {
  const [items, setItems] = useState<string[]>(block.content_draft?.items || block.content_published?.items || []);
  const [newItem, setNewItem] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const originalItems = block.content_draft?.items || block.content_published?.items || [];
    setIsDirty(JSON.stringify(items) !== JSON.stringify(originalItems));
  }, [items, block.content_draft, block.content_published]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ items });
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

  const isPublished = JSON.stringify(block.content_published?.items) === JSON.stringify(block.content_draft?.items);

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
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
            <Button onClick={handleAddItem} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {items.length > 0 && (
          <div>
            <Label>Itens ({items.length})</Label>
            <ul className="space-y-2 border rounded p-3 bg-gray-50">
              {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-sm">{item}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-3 bg-gray-50 text-sm text-gray-600">
            Nenhum item adicionado ainda
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
            disabled={!isDirty || isSaving || items.length === 0}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || items.length === 0}
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
