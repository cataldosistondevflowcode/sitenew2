/**
 * Componente: EnhancedEditorStatusBar
 * 
 * Barra de status melhorada do editor CMS
 * - Mostra campo ativo em edição
 * - Contador de mudanças não salvas
 * - Botões Undo/Redo (Sprint v19)
 * - Atalhos diretos (CTRL+S, CTRL+P, CTRL+Z, CTRL+SHIFT+Z)
 * - Indicadores visuais de validação
 * 
 * Sprint CMS v9 — UX Moderna
 * Sprint CMS v19 — Undo/Redo Global
 */

import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Save, Send, Keyboard, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  /** Sprint v19: Callbacks de Undo/Redo */
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  undoStackLength?: number;
  redoStackLength?: number;
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
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  undoStackLength = 0,
  redoStackLength = 0,
}: EnhancedEditorStatusBarProps) {
  const hasErrors = validationErrors.length > 0;
  const fieldErrorsForActive = validationErrors.filter(
    (e) => activeBlockId && e.blockId === activeBlockId
  );

  return (
    <TooltipProvider>
      <div className={cn('border-t bg-gray-50 p-4', className)}>
        {/* Status Line 1: Campo ativo + Undo/Redo */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b">
          <div className="flex items-center gap-3 flex-1">
            {/* Botões Undo/Redo — Sprint v19 */}
            {(onUndo || onRedo) && (
              <div className="flex items-center gap-1 pr-3 border-r">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onUndo}
                      disabled={!canUndo}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      aria-label="Desfazer (Ctrl+Z)"
                    >
                      <Undo2 className={cn('w-4 h-4', !canUndo && 'opacity-40')} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Desfazer <kbd className="ml-1 px-1 bg-gray-700 rounded text-xs">Ctrl+Z</kbd></p>
                    {undoStackLength > 1 && (
                      <p className="text-xs text-gray-400 mt-1">{undoStackLength - 1} ações para desfazer</p>
                    )}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onRedo}
                      disabled={!canRedo}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      aria-label="Refazer (Ctrl+Shift+Z)"
                    >
                      <Redo2 className={cn('w-4 h-4', !canRedo && 'opacity-40')} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Refazer <kbd className="ml-1 px-1 bg-gray-700 rounded text-xs">Ctrl+Shift+Z</kbd></p>
                    {redoStackLength > 0 && (
                      <p className="text-xs text-gray-400 mt-1">{redoStackLength} ações para refazer</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

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
              <span className="hidden md:inline">
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl+Z</kbd>
                <span className="mx-1">/</span>
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl+S</kbd>
                <span className="mx-1">/</span>
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl+P</kbd>
              </span>
              <span className="hidden sm:inline md:hidden">
                <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">S</kbd>
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
    </TooltipProvider>
  );
}
