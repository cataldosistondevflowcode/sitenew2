/**
 * Componente: EnhancedEditorStatusBar
 * 
 * Barra de status melhorada do editor CMS
 * - Mostra campo ativo em edição
 * - Contador de mudanças não salvas
 * - Atalhos diretos (CTRL+S, CTRL+P)
 * - Indicadores visuais de validação
 * 
 * Sprint CMS v9 — UX Moderna
 */

import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Save, Send, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationError {
  blockId: number;
  fieldKey: string;
  message: string;
}

interface EnhancedEditorStatusBarProps {
  activeFieldKey?: string | null;
  activeBlockId?: number | null;
  unsavedCount: number;
  validationErrors: ValidationError[];
  isSaving?: boolean;
  isPublishing?: boolean;
  onSave: () => void | Promise<void>;
  onPublish: () => void | Promise<void>;
  showShortcutHint?: boolean;
  className?: string;
}

export function EnhancedEditorStatusBar({
  activeFieldKey,
  activeBlockId,
  unsavedCount,
  validationErrors,
  isSaving = false,
  isPublishing = false,
  onSave,
  onPublish,
  showShortcutHint = true,
  className,
}: EnhancedEditorStatusBarProps) {
  const hasErrors = validationErrors.length > 0;
  const fieldErrorsForActive = validationErrors.filter(
    (e) => activeBlockId && e.blockId === activeBlockId
  );

  return (
    <div className={cn('border-t bg-gray-50 p-4', className)}>
      {/* Status Line 1: Campo ativo */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b">
        <div className="flex items-center gap-3 flex-1">
          {/* Campo ativo */}
          {activeBlockId ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                <strong>Editando:</strong>
              </span>
              <code className="px-2 py-1 bg-yellow-100 text-yellow-900 rounded text-xs font-mono">
                {activeFieldKey || `bloco #${activeBlockId}`}
              </code>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Selecione um bloco para editar</span>
          )}
        </div>

        {/* Atalhos de teclado */}
        {showShortcutHint && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Keyboard className="w-3 h-3" />
            <span className="hidden sm:inline">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Ctrl</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-2 py-1 bg-white border rounded text-xs">S</kbd>
              <span className="mx-2">ou</span>
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Ctrl</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-2 py-1 bg-white border rounded text-xs">P</kbd>
            </span>
          </div>
        )}
      </div>

      {/* Status Line 2: Mudanças e erros */}
      <div className="flex items-center justify-between">
        {/* Mudanças */}
        <div className="flex items-center gap-4 flex-1">
          {unsavedCount > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-gray-700">
                <strong>{unsavedCount}</strong> campo{unsavedCount !== 1 ? 's' : ''}
                {unsavedCount === 1 ? ' modificado' : ' modificados'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-600" />
              <span>Tudo salvo</span>
            </div>
          )}

          {/* Erros de validação */}
          {hasErrors && (
            <div className="flex items-center gap-2 text-sm text-red-600 ml-4">
              <AlertCircle className="w-4 h-4" />
              <span>
                <strong>{validationErrors.length}</strong> erro
                {validationErrors.length !== 1 ? 's' : ''} de validação
              </span>
            </div>
          )}

          {/* Erros do bloco ativo */}
          {fieldErrorsForActive.length > 0 && (
            <div className="ml-auto flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>{fieldErrorsForActive[0].message}</span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 ml-4">
          <Button
            onClick={onSave}
            disabled={isSaving || unsavedCount === 0}
            size="sm"
            variant={unsavedCount > 0 ? 'default' : 'outline'}
            className="gap-2"
          >
            <Save className={cn('w-4 h-4', isSaving && 'animate-spin')} />
            <span className="hidden sm:inline">Salvar</span>
            <span className="hidden sm:inline text-xs opacity-75">
              {unsavedCount > 0 && `(${unsavedCount})`}
            </span>
          </Button>

          <Button
            onClick={onPublish}
            disabled={isPublishing || hasErrors}
            size="sm"
            variant="default"
            className="gap-2 bg-green-600 hover:bg-green-700"
            title={hasErrors ? 'Corrija os erros de validação antes de publicar' : 'Publicar mudanças'}
          >
            <Send className={cn('w-4 h-4', isPublishing && 'animate-spin')} />
            <span className="hidden sm:inline">Publicar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
