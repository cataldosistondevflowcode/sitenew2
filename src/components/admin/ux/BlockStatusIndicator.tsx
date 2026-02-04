/**
 * Componente: BlockStatusIndicator
 * 
 * Indicador visual do status de um bloco
 * - Mostra: tipo, status, última edição
 * - Ícone com cor de status
 * - Ações rápidas
 * 
 * Sprint v8 — UX Zero Fricção
 */

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const BLOCK_ICONS = {
  text: '📝',
  richtext: '✍️',
  image: '🖼️',
  cta: '🔘',
  list: '📋',
  faq: '❓',
  banner: '🎯',
};

const BLOCK_LABELS = {
  text: 'Texto Simples',
  richtext: 'Texto Formatado',
  image: 'Imagem',
  cta: 'Botão (CTA)',
  list: 'Lista',
  faq: 'Perguntas & Respostas',
  banner: 'Banner',
};

type BlockType = keyof typeof BLOCK_ICONS;
type BlockStatus = 'draft' | 'published' | 'error';

interface BlockStatusIndicatorProps {
  blockKey: string;
  blockType: BlockType;
  status: BlockStatus;
  isDirty?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onHistory?: () => void;
  onRevert?: () => void;
  className?: string;
}

export function BlockStatusIndicator({
  blockKey,
  blockType,
  status,
  isDirty = false,
  isExpanded = true,
  onToggleExpand,
  onHistory,
  onRevert,
  className,
}: BlockStatusIndicatorProps) {
  const statusColors = {
    draft: { dot: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
    published: { dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
    error: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  };

  const statusLabels = {
    draft: isDirty ? '⚠️ Rascunho (modificado)' : '⚠️ Rascunho',
    published: '✓ Publicado',
    error: '✗ Erro',
  };

  const colors = statusColors[status];
  const label = BLOCK_LABELS[blockType];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all',
        colors.bg,
        'border-transparent',
        className
      )}
    >
      {/* Ícone do tipo de bloco */}
      <span className="text-lg flex-shrink-0">{BLOCK_ICONS[blockType]}</span>

      {/* Informação */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <code className="text-xs bg-white/50 px-1.5 py-0.5 rounded font-mono">
            {blockKey}
          </code>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
          <p className={cn('text-xs font-medium', colors.text)}>
            {statusLabels[status]}
          </p>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {onHistory && (
          <Button
            onClick={onHistory}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Ver histórico"
          >
            <History className="w-4 h-4" />
          </Button>
        )}

        {onRevert && status === 'draft' && (
          <Button
            onClick={onRevert}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Reverter para publicado"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}

        {onToggleExpand && (
          <Button
            onClick={onToggleExpand}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
