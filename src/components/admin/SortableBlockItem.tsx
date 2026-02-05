/**
 * Componente: SortableBlockItem
 * 
 * Item arrastável para reordenação de blocos CMS
 * Usa @dnd-kit/sortable para funcionalidade de drag-and-drop
 * 
 * Sprint CMS v21 — Reordenar Blocos com Drag-and-Drop
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableBlockItemProps {
  id: number;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SortableBlockItem({ id, children, disabled = false }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50 shadow-2xl ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Handle de drag */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center',
            'cursor-grab active:cursor-grabbing',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'bg-gradient-to-r from-gray-100 to-transparent',
            'hover:from-gray-200 rounded-l-lg',
            isDragging && 'opacity-100'
          )}
          title="Arraste para reordenar"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      {/* Conteúdo do bloco */}
      <div className={cn(!disabled && 'pl-8')}>
        {children}
      </div>
    </div>
  );
}

export default SortableBlockItem;
