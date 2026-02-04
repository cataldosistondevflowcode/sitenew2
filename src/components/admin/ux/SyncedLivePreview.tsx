/**
 * Componente: SyncedLivePreview
 * 
 * Preview sincronizado com editor
 * - Scroll automático para o bloco sendo editado
 * - Highlight visual do campo ativo
 * - Toggle de tamanho de tela (mobile/tablet/desktop)
 * - Sincronização bidirecional (opcional)
 * 
 * Sprint CMS v9 — UX Moderna com Sincronização
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Smartphone, Tablet, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface SyncedLivePreviewProps {
  blocks: CmsBlock[];
  isDraft?: boolean;
  activeBlockId?: number;
  activeFieldKey?: string;
  onBlockFocus?: (blockId: number) => void;
  previewSize?: 'mobile' | 'tablet' | 'desktop';
  onPreviewSizeChange?: (size: 'mobile' | 'tablet' | 'desktop') => void;
  className?: string;
}

type PreviewDeviceSize = {
  name: 'mobile' | 'tablet' | 'desktop';
  width: number;
  label: string;
  icon: React.ReactNode;
};

const DEVICE_SIZES: PreviewDeviceSize[] = [
  { name: 'mobile', width: 375, label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
  { name: 'tablet', width: 768, label: 'Tablet', icon: <Tablet className="w-4 h-4" /> },
  { name: 'desktop', width: 1200, label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
];

export function SyncedLivePreview({
  blocks,
  isDraft = false,
  activeBlockId,
  activeFieldKey,
  onBlockFocus,
  previewSize = 'desktop',
  onPreviewSizeChange,
  className,
}: SyncedLivePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-scroll para bloco ativo
  useEffect(() => {
    if (activeBlockId && blockRefs.current[activeBlockId] && previewRef.current) {
      const element = blockRefs.current[activeBlockId];
      const container = previewRef.current;

      // Scroll suave
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Highlight temporário
      element.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'bg-yellow-50/50');
      const timer = setTimeout(() => {
        element?.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2', 'bg-yellow-50/50');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeBlockId]);

  const getDeviceWidth = (size: string) => {
    return DEVICE_SIZES.find((d) => d.name === size)?.width || 1200;
  };

  if (blocks.length === 0) {
    return (
      <div className={cn('rounded-lg border border-dashed border-gray-300 p-6', className)}>
        <p className="text-center text-gray-500 text-sm">Nenhum bloco para pré-visualizar</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Indicador de Draft */}
      {isDraft && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Pré-visualização:</strong> Mostrando rascunho (não publicado)
          </p>
        </div>
      )}

      {/* Controles de Tamanho de Tela */}
      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
        <span className="text-xs font-semibold text-gray-700">Visualização:</span>
        <div className="flex gap-2 ml-auto">
          {DEVICE_SIZES.map((device) => (
            <Button
              key={device.name}
              size="sm"
              variant={previewSize === device.name ? 'default' : 'outline'}
              onClick={() => onPreviewSizeChange?.(device.name)}
              className="gap-1"
            >
              {device.icon}
              <span className="hidden sm:inline">{device.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <div
        ref={previewRef}
        className="overflow-auto border border-gray-200 rounded-lg bg-white"
        style={{
          maxHeight: '70vh',
          width: `${getDeviceWidth(previewSize)}px`,
          margin: '0 auto',
        }}
      >
        <Card className="border-0 rounded-0 shadow-none">
          <CardHeader className="pb-4 sticky top-0 bg-white border-b">
            <CardTitle className="text-sm">
              Pré-visualização ({DEVICE_SIZES.find((d) => d.name === previewSize)?.label})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {blocks.map((block) => {
              const content =
                isDraft && block.content_draft ? block.content_draft : block.content_published;

              if (!content || Object.keys(content).length === 0) {
                return null;
              }

              const isActive = activeBlockId === block.id;
              const blockElement = (
                <div
                  key={block.id}
                  ref={(el) => {
                    blockRefs.current[block.id] = el;
                  }}
                  className={cn(
                    'pb-6 border-b last:border-0 last:pb-0 transition-all duration-300',
                    isActive && 'ring-2 ring-yellow-400 ring-offset-2 bg-yellow-50/50 rounded-lg p-4'
                  )}
                  onClick={() => onBlockFocus?.(block.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onBlockFocus?.(block.id);
                    }
                  }}
                >
                  {/* Rótulo do bloco */}
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                    <span className="font-mono">{block.block_key}</span>
                    <span>•</span>
                    <span className="capitalize">{block.block_type}</span>
                    {isActive && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                        ✏️ Editando
                      </span>
                    )}
                  </div>

                  {/* Renderer do bloco */}
                  <div className="prose prose-sm max-w-none">
                    <CmsBlockRenderer
                      block={{
                        ...block,
                        content_draft: isDraft ? block.content_draft : block.content_published,
                        content_published: block.content_published,
                      }}
                    />
                  </div>
                </div>
              );

              return blockElement;
            })}
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center p-2 rounded bg-gray-50">
        🔄 Preview atualiza em tempo real | 👆 Clique nos blocos para destacar | ⌨️ CTRL+S para salvar
      </div>
    </div>
  );
}
