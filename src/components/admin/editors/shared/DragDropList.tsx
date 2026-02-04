/**
 * Componente: DragDropList
 * 
 * Lista com suporte a drag-and-drop para reordenação
 * Sprint CMS v7 — List & FAQ Enhancement
 * 
 * Features:
 * - Reordenar itens via drag-drop
 * - Feedback visual durante drag
 * - Mobile-friendly (touch events)
 * - Remover itens com 1 clique
 */

import { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

export interface DragDropListProps {
  items: string[];
  onReorder: (items: string[]) => void;
  onRemove: (index: number) => void;
  onUpdate?: (index: number, value: string) => void;
  editable?: boolean;
  label?: string;
}

export const DragDropList = ({
  items,
  onReorder,
  onRemove,
  onUpdate,
  editable = false,
  label = 'Itens',
}: DragDropListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Handlers para drag-drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Reordenar itens
    const newItems = Array.from(items);
    const draggedItem = newItems[draggedIndex];

    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onReorder(newItems);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handlers para edição (se habilitado)
  const handleStartEdit = (index: number) => {
    if (editable) {
      setEditingIndex(index);
      setEditingValue(items[index]);
    }
  };

  const handleSaveEdit = (index: number) => {
    if (onUpdate && editingValue.trim()) {
      onUpdate(index, editingValue.trim());
    }
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleSaveEdit(index);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (items.length === 0) {
    return (
      <div className="border rounded p-4 bg-gray-50 text-center text-sm text-gray-600">
        <p>Nenhum item adicionado ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label} ({items.length})
        </p>
      )}

      <div className="space-y-2 border rounded p-3 bg-gray-50">
        {items.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-2 p-3 bg-white rounded border transition ${
              draggedIndex === index
                ? 'opacity-50 border-dashed border-gray-400'
                : dragOverIndex === index
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200'
            }`}
          >
            {/* Drag handle */}
            <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />

            {/* Item content or edit input */}
            {editingIndex === index ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => handleSaveEdit(index)}
                autoFocus
                className="flex-1 px-2 py-1 border rounded text-sm"
                placeholder="Editar item..."
              />
            ) : (
              <span
                className={`flex-1 text-sm ${editable ? 'cursor-pointer hover:text-blue-600' : ''}`}
                onClick={() => handleStartEdit(index)}
                title={editable ? 'Clique para editar' : undefined}
              >
                {item}
              </span>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-800 flex-shrink-0"
              title="Remover item"
              aria-label={`Remover item ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        💡 Arraste o ícone
        <GripVertical className="w-3 h-3 inline mx-1" />
        para reordenar itens
      </p>
    </div>
  );
};
