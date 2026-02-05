/**
 * Hook: useKeyboardShortcuts
 * 
 * Atalhos de teclado para fluxo rápido
 * - Ctrl+S = Salvar rascunho
 * - Ctrl+P = Publicar
 * - Ctrl+Z = Desfazer (Undo)
 * - Ctrl+Shift+Z = Refazer (Redo)
 * - Esc = Fechar modal
 * - ? = Mostrar atalhos
 * 
 * Sprint v8 — UX Zero Fricção
 * Sprint v19 — Undo/Redo Global
 */

import { useEffect, useCallback } from 'react';

export type ShortcutKey = 'save' | 'publish' | 'close' | 'help' | 'undo' | 'redo';

interface ShortcutConfig {
  key: ShortcutKey;
  label: string;
  description: string;
  combo: string[];
  handler: () => void | Promise<void>;
  enabled?: boolean;
  /** Se true, permite funcionar mesmo em inputs/textareas */
  allowInInput?: boolean;
}

interface UseKeyboardShortcutsProps {
  shortcuts: ShortcutConfig[];
  showHelpOnQuestion?: boolean;
}

/**
 * Hook para registrar atalhos de teclado globais
 * 
 * @example
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'save',
 *       label: 'Salvar Rascunho',
 *       description: 'Salva todas as alterações como rascunho',
 *       combo: ['ctrl', 's'],
 *       handler: () => saveDraft(),
 *     },
 *     {
 *       key: 'undo',
 *       label: 'Desfazer',
 *       description: 'Desfaz a última ação',
 *       combo: ['ctrl', 'z'],
 *       handler: () => handleUndo(),
 *       allowInInput: false, // Ctrl+Z nativo funciona em inputs
 *     },
 *     {
 *       key: 'redo',
 *       label: 'Refazer',
 *       description: 'Refaz a ação desfeita',
 *       combo: ['ctrl', 'shift', 'z'],
 *       handler: () => handleRedo(),
 *       allowInInput: false,
 *     },
 *   ]
 * });
 */
export function useKeyboardShortcuts({
  shortcuts,
  showHelpOnQuestion = true,
}: UseKeyboardShortcutsProps) {
  // Função para verificar se uma combinação de teclas foi pressionada
  const matchesCombo = useCallback((combo: string[], event: KeyboardEvent): boolean => {
    const { ctrlKey, shiftKey, altKey, metaKey, key } = event;

    // Normalizar a tecla pressionada
    const pressedKey = key.toLowerCase();
    
    // Verificar modificadores esperados vs pressionados
    const expectsCtrl = combo.includes('ctrl');
    const expectsShift = combo.includes('shift');
    const expectsAlt = combo.includes('alt');
    
    const hasCtrl = ctrlKey || metaKey;
    const hasShift = shiftKey;
    const hasAlt = altKey;
    
    // A tecla principal é qualquer elemento do combo que não seja um modificador
    const mainKey = combo.find(k => !['ctrl', 'shift', 'alt', 'meta'].includes(k));
    const keyMatch = mainKey === pressedKey;

    // Verificar se todos os modificadores batem EXATAMENTE
    // Isso evita que Ctrl+Z dispare quando Ctrl+Shift+Z é pressionado
    const ctrlMatch = expectsCtrl === hasCtrl;
    const shiftMatch = expectsShift === hasShift;
    const altMatch = expectsAlt === hasAlt;

    return ctrlMatch && shiftMatch && altMatch && keyMatch;
  }, []);

  // Listener de teclado
  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName);
      const isContentEditable = target.isContentEditable;
      const isInEditor = isInput || isContentEditable;

      // Procura por atalho que bate
      for (const shortcut of shortcuts) {
        // Verificar se o atalho está habilitado
        if (shortcut.enabled === false) continue;

        if (matchesCombo(shortcut.combo, event)) {
          // Se estiver em input/textarea, só executa se allowInInput for true
          // Exceção: Escape sempre funciona
          if (isInEditor && !shortcut.allowInInput && event.key !== 'Escape') {
            // Para undo/redo em inputs, deixa o comportamento nativo
            if (shortcut.key === 'undo' || shortcut.key === 'redo') {
              return; // Não previne default, deixa o browser fazer undo/redo nativo
            }
            continue;
          }

          event.preventDefault();
          await shortcut.handler();
          return; // Sai após executar um atalho
        }
      }

      // Help: ? abre modal de atalhos (apenas fora de inputs)
      if (!isInEditor && showHelpOnQuestion && (event.key === '?' || event.key === '/')) {
        showShortcutHelp(shortcuts);
      }
    },
    [shortcuts, matchesCombo, showHelpOnQuestion]
  );

  // Registra listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Função para mostrar ajuda de atalhos
  const showHelp = () => showShortcutHelp(shortcuts);

  return { showHelp };
}

/**
 * Mostra modal com atalhos disponíveis
 */
function showShortcutHelp(shortcuts: ShortcutConfig[]) {
  // Nota: Isso é um placeholder. Em produção, seria um modal React
  // Para agora, vamos log no console
  console.group('⌨️ Atalhos de Teclado');
  shortcuts.forEach((s) => {
    if (s.enabled !== false) {
      console.log(`${s.combo.join('+').toUpperCase()}: ${s.description}`);
    }
  });
  console.groupEnd();

  // TODO: Implementar modal bonito
  // showModal({
  //   title: '⌨️ Atalhos de Teclado',
  //   content: <ShortcutHelpModal shortcuts={shortcuts} />,
  // });
}

/**
 * Combinações de atalho padrão
 */
export const STANDARD_SHORTCUTS = {
  SAVE_DRAFT: { combo: ['ctrl', 's'], key: 'save', label: 'Salvar Rascunho' },
  PUBLISH: { combo: ['ctrl', 'p'], key: 'publish', label: 'Publicar' },
  CLOSE: { combo: ['escape'], key: 'close', label: 'Fechar' },
  UNDO: { combo: ['ctrl', 'z'], key: 'undo', label: 'Desfazer' },
  REDO: { combo: ['ctrl', 'shift', 'z'], key: 'redo', label: 'Refazer' },
  HELP: { combo: ['?'], key: 'help', label: 'Ajuda' },
};
