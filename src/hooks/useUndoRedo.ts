/**
 * Hook: useUndoRedo
 * 
 * Sistema de Undo/Redo global para o editor CMS
 * - Stack de estados com limite de 50 entradas
 * - Funciona entre saves (não perde histórico ao salvar)
 * - Persistência opcional em sessionStorage
 * 
 * Sprint CMS v19 — Undo/Redo Global
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Tipo de ação que gerou o estado
 */
export type UndoRedoAction = 
  | 'edit'      // Edição de conteúdo
  | 'save'      // Salvamento de draft
  | 'publish'   // Publicação
  | 'revert'    // Reversão de versão
  | 'create'    // Criação de bloco
  | 'delete'    // Exclusão de bloco
  | 'reorder';  // Reordenação de blocos

/**
 * Estado capturado em um ponto do histórico
 */
export interface UndoRedoState<T = unknown> {
  /** Dados do estado (ex: array de blocos) */
  data: T;
  /** Timestamp do estado */
  timestamp: number;
  /** Tipo de ação que gerou o estado */
  action: UndoRedoAction;
  /** Descrição opcional da ação */
  description?: string;
  /** ID do bloco afetado (se aplicável) */
  affectedBlockId?: number;
}

/**
 * Configuração do hook
 */
export interface UseUndoRedoConfig {
  /** Tamanho máximo do stack (default: 50) */
  maxStackSize?: number;
  /** Persistir em sessionStorage (default: false) */
  persistInSession?: boolean;
  /** Chave para sessionStorage */
  storageKey?: string;
  /** Debounce em ms para captura de estados (default: 300) */
  debounceMs?: number;
}

/**
 * Retorno do hook
 */
export interface UseUndoRedoReturn<T> {
  /** Se pode desfazer */
  canUndo: boolean;
  /** Se pode refazer */
  canRedo: boolean;
  /** Desfaz última ação */
  undo: () => T | null;
  /** Refaz ação desfeita */
  redo: () => T | null;
  /** Adiciona novo estado ao histórico */
  pushState: (data: T, action: UndoRedoAction, description?: string, affectedBlockId?: number) => void;
  /** Limpa todo o histórico */
  clearHistory: () => void;
  /** Quantidade de estados no histórico de undo */
  undoStackLength: number;
  /** Quantidade de estados no histórico de redo */
  redoStackLength: number;
  /** Estado atual (último estado adicionado) */
  currentState: UndoRedoState<T> | null;
  /** Histórico completo de undo (para debug) */
  undoHistory: UndoRedoState<T>[];
  /** Histórico completo de redo (para debug) */
  redoHistory: UndoRedoState<T>[];
}

const DEFAULT_MAX_STACK_SIZE = 50;
const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Hook para gerenciar Undo/Redo global no editor CMS
 * 
 * @example
 * const {
 *   canUndo,
 *   canRedo,
 *   undo,
 *   redo,
 *   pushState,
 *   clearHistory,
 * } = useUndoRedo<CmsBlock[]>({
 *   maxStackSize: 50,
 *   persistInSession: false,
 * });
 * 
 * // Ao editar um bloco
 * pushState(updatedBlocks, 'edit', 'Editou bloco hero_title');
 * 
 * // Ao salvar
 * pushState(savedBlocks, 'save', 'Salvou draft');
 * 
 * // Para desfazer
 * const previousBlocks = undo();
 * if (previousBlocks) {
 *   setBlocks(previousBlocks);
 * }
 */
export function useUndoRedo<T = unknown>(
  config: UseUndoRedoConfig = {}
): UseUndoRedoReturn<T> {
  const {
    maxStackSize = DEFAULT_MAX_STACK_SIZE,
    persistInSession = false,
    storageKey = 'cms_undo_redo_history',
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = config;

  // Stack de estados para undo (mais recente no final)
  const [undoStack, setUndoStack] = useState<UndoRedoState<T>[]>([]);
  
  // Stack de estados para redo (mais recente no final)
  const [redoStack, setRedoStack] = useState<UndoRedoState<T>[]>([]);

  // Ref para debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushTime = useRef<number>(0);

  // Carregar do sessionStorage se configurado
  useEffect(() => {
    if (persistInSession && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.undoStack) setUndoStack(parsed.undoStack);
          if (parsed.redoStack) setRedoStack(parsed.redoStack);
        }
      } catch (err) {
        console.warn('[useUndoRedo] Erro ao carregar do sessionStorage:', err);
      }
    }
  }, [persistInSession, storageKey]);

  // Salvar no sessionStorage quando stack mudar
  useEffect(() => {
    if (persistInSession && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ undoStack, redoStack })
        );
      } catch (err) {
        console.warn('[useUndoRedo] Erro ao salvar no sessionStorage:', err);
      }
    }
  }, [undoStack, redoStack, persistInSession, storageKey]);

  /**
   * Adiciona novo estado ao histórico
   */
  const pushState = useCallback(
    (data: T, action: UndoRedoAction, description?: string, affectedBlockId?: number) => {
      const now = Date.now();
      
      // Debounce: se a última ação foi muito recente, substituir ao invés de adicionar
      const shouldDebounce = now - lastPushTime.current < debounceMs;
      lastPushTime.current = now;

      const newState: UndoRedoState<T> = {
        data,
        timestamp: now,
        action,
        description,
        affectedBlockId,
      };

      setUndoStack((prev) => {
        let newStack: UndoRedoState<T>[];
        
        if (shouldDebounce && prev.length > 0) {
          // Substituir último estado ao invés de adicionar
          newStack = [...prev.slice(0, -1), newState];
        } else {
          newStack = [...prev, newState];
        }

        // Limitar tamanho do stack
        if (newStack.length > maxStackSize) {
          newStack = newStack.slice(-maxStackSize);
        }

        return newStack;
      });

      // Limpar redo stack quando nova ação é feita
      setRedoStack([]);
    },
    [maxStackSize, debounceMs]
  );

  /**
   * Desfaz última ação
   */
  const undo = useCallback((): T | null => {
    if (undoStack.length <= 1) {
      // Precisa de pelo menos 2 estados para undo (atual + anterior)
      return null;
    }

    // Pegar o estado atual (último) e o anterior
    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    // Mover estado atual para redo stack
    setRedoStack((prev) => [...prev, currentState]);

    // Remover estado atual do undo stack
    setUndoStack((prev) => prev.slice(0, -1));

    return previousState.data;
  }, [undoStack]);

  /**
   * Refaz ação desfeita
   */
  const redo = useCallback((): T | null => {
    if (redoStack.length === 0) {
      return null;
    }

    // Pegar o último estado do redo stack
    const stateToRestore = redoStack[redoStack.length - 1];

    // Mover para undo stack
    setUndoStack((prev) => [...prev, stateToRestore]);

    // Remover do redo stack
    setRedoStack((prev) => prev.slice(0, -1));

    return stateToRestore.data;
  }, [redoStack]);

  /**
   * Limpa todo o histórico
   */
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
    lastPushTime.current = 0;
    
    if (persistInSession && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(storageKey);
      } catch (err) {
        console.warn('[useUndoRedo] Erro ao limpar sessionStorage:', err);
      }
    }
  }, [persistInSession, storageKey]);

  // Estado atual (último do undo stack)
  const currentState = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;

  // Pode desfazer se tiver mais de 1 estado (precisa do anterior)
  const canUndo = undoStack.length > 1;

  // Pode refazer se tiver estados no redo stack
  const canRedo = redoStack.length > 0;

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    clearHistory,
    undoStackLength: undoStack.length,
    redoStackLength: redoStack.length,
    currentState,
    undoHistory: undoStack,
    redoHistory: redoStack,
  };
}

/**
 * Hook simplificado para uso com CmsBlock[]
 * Já tipado para o caso de uso mais comum
 */
export function useCmsUndoRedo(config?: UseUndoRedoConfig) {
  return useUndoRedo<Record<string, unknown>[]>(config);
}

export default useUndoRedo;
