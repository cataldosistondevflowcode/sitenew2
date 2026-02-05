/**
 * Componente: SortableBlockList
 * 
 * Container para lista de blocos CMS com funcionalidade de drag-and-drop
 * Usa @dnd-kit para permitir reordenação visual
 * 
 * Sprint CMS v21 — Reordenar Blocos com Drag-and-Drop
 */

import { useCallback, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CmsBlock } from '@/hooks/useCmsContent';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

interface SortableBlockListProps {
  blocks: CmsBlock[];
  children: (block: CmsBlock, index: number) => React.ReactNode;
  onReorder: (activeId: number, overId: number) => void;
  disabled?: boolean;
}

/**
 * Componente de overlay durante o drag
 */
function DragOverlayContent({ block }: { block: CmsBlock | null }) {
  if (!block) return null;

  return (
    <Card className="shadow-2xl border-2 border-primary opacity-90">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <CardTitle className="text-sm font-medium">
            {block.block_key}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {block.block_type}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}

export function SortableBlockList({
  blocks,
  children,
  onReorder,
  disabled = false,
}: SortableBlockListProps) {
  const [activeBlock, setActiveBlock] = useState<CmsBlock | null>(null);

  // Configurar sensores de drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de pixels antes de iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler quando drag inicia
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const block = blocks.find((b) => b.id === active.id);
      setActiveBlock(block || null);
    },
    [blocks]
  );

  // Handler quando drag termina
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveBlock(null);

      if (over && active.id !== over.id) {
        onReorder(Number(active.id), Number(over.id));
      }
    },
    [onReorder]
  );

  // IDs dos blocos para o SortableContext
  const blockIds = blocks.map((b) => b.id);

  if (disabled || blocks.length <= 1) {
    // Sem drag-drop se desabilitado ou só tem 1 bloco
    return (
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id}>{children(block, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block, index) => children(block, index))}
        </div>
      </SortableContext>

      {/* Overlay durante o drag */}
      <DragOverlay>
        <DragOverlayContent block={activeBlock} />
      </DragOverlay>
    </DndContext>
  );
}

export default SortableBlockList;
