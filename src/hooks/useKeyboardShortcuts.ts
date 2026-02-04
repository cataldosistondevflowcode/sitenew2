/**
 * Hook: useKeyboardShortcuts
 * 
 * Atalhos de teclado para fluxo rápido
 * - Ctrl+S = Salvar rascunho
 * - Ctrl+P = Publicar
 * - Esc = Fechar modal
 * - ? = Mostrar atalhos
 * 
 * Sprint v8 — UX Zero Fricção
 */

import { useEffect, useCallback } from 'react';

export type ShortcutKey = 'save' | 'publish' | 'close' | 'help';

interface ShortcutConfig {
  key: ShortcutKey;
  label: string;
  description: string;
  combo: string[];
  handler: () => void | Promise<void>;
  enabled?: boolean;
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
 *       key: 'publish',
 *       label: 'Publicar',
 *       description: 'Publica todas as alterações',
 *       combo: ['ctrl', 'p'],
 *       handler: () => publish(),
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

    const hasCtrl = combo.includes('ctrl') && (ctrlKey || metaKey);
    const hasShift = combo.includes('shift') && shiftKey;
    const hasAlt = combo.includes('alt') && altKey;
    const keyMatch = combo.includes(key.toLowerCase());

    // Verifica se a combinação bate exatamente
    if (combo.includes('ctrl')) {
      return hasCtrl && !hasShift && !hasAlt && keyMatch;
    }

    if (combo.includes('shift') && combo.includes('ctrl')) {
      return hasCtrl && hasShift && !hasAlt && keyMatch;
    }

    return hasCtrl || hasShift || hasAlt ? true : keyMatch;
  }, []);

  // Listener de teclado
  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      // Se estiver digitando em input, ignora atalhos (exceto Esc)
      const target = event.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName);

      if (isInput && event.key !== 'Escape') {
        return;
      }

      // Procura por atalho que bate
      for (const shortcut of shortcuts) {
        if (!shortcut.enabled && shortcut.enabled !== undefined) continue;

        if (matchesCombo(shortcut.combo, event)) {
          event.preventDefault();
          await shortcut.handler();
          break;
        }
      }

      // Help: ? abre modal de atalhos
      if (showHelpOnQuestion && (event.key === '?' || event.key === '/')) {
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
