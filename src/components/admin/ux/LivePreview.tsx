/**
 * Componente: LivePreview
 * 
 * Preview em tempo real da página
 * - Renderiza blocos conforme edita
 * - Mostra draft vs publicado
 * - Layout responsivo
 * 
 * Sprint v8 — UX Zero Fricção
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  blocks: CmsBlock[];
  isDraft?: boolean;
  showIndicator?: boolean;
  className?: string;
}

export function LivePreview({
  blocks,
  isDraft = false,
  showIndicator = true,
  className,
}: LivePreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className={cn('rounded-lg border border-dashed border-gray-300 p-6', className)}>
        <p className="text-center text-gray-500 text-sm">
          Nenhum bloco para pré-visualizar
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Indicador de Draft */}
      {isDraft && showIndicator && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Pré-visualização:</strong> Mostrando rascunho (não publicado)
          </p>
        </div>
      )}

      {/* Preview */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Pré-visualização da Página</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {blocks.map((block) => {
            // Usa draft se disponível, senão published
            const content = isDraft && block.content_draft 
              ? block.content_draft 
              : block.content_published;

            if (!content || Object.keys(content).length === 0) {
              return null;
            }

            return (
              <div key={block.id} className="pb-6 border-b last:border-0 last:pb-0">
                {/* Rótulo do bloco */}
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <span className="font-mono">{block.block_key}</span>
                  <span>•</span>
                  <span className="capitalize">{block.block_type}</span>
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
          })}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center p-2 rounded bg-gray-50">
        🔄 Preview atualiza em tempo real conforme você edita
      </div>
    </div>
  );
}
