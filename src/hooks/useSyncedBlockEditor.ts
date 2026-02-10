/**
 * Hook: useSyncedBlockEditor
 * 
 * Gerencia estado sincronizado entre editor e preview
 * - Bloco/campo ativo
 * - Tamanho de tela de preview
 * - Contador de mudanças não salvas
 * 
 * Sprint CMS v9 — Sincronização
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseSyncedBlockEditorState {
  activeBlockId: number | null;
  activeFieldKey: string | null;
  previewSize: 'mobile' | 'tablet' | 'desktop';
  unsavedBlockIds: Set<number>;
}

interface UseSyncedBlockEditorReturn extends UseSyncedBlockEditorState {
  onFieldFocus: (blockId: number, fieldKey?: string) => void;
  onBlockUpdate: (blockId: number) => void;
  onSaveComplete: (blockIds: number[]) => void;
  setPreviewSize: (size: 'mobile' | 'tablet' | 'desktop') => void;
  clearUnsaved: () => void;
  unsavedCount: number;
}

/**
 * Hook para sincronizar estado de edição entre editor e preview
 */
export function useSyncedBlockEditor(): UseSyncedBlockEditorReturn {
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  // Sprint v23: localStorage com try/catch para evitar crash em navegação privada
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    try {
      const saved = localStorage.getItem('cms-preview-size');
      return (saved as 'mobile' | 'tablet' | 'desktop') || 'desktop';
    } catch {
      return 'desktop';
    }
  });
  const [unsavedBlockIds, setUnsavedBlockIds] = useState<Set<number>>(new Set());

  // Salvar preferência de tamanho (com try/catch)
  useEffect(() => {
    try {
      localStorage.setItem('cms-preview-size', previewSize);
    } catch {
      // Ignora silenciosamente se localStorage não estiver disponível
    }
  }, [previewSize]);

  const onFieldFocus = useCallback((blockId: number, fieldKey?: string) => {
    setActiveBlockId(blockId);
    setActiveFieldKey(fieldKey || null);
  }, []);

  const onBlockUpdate = useCallback((blockId: number) => {
    setUnsavedBlockIds((prev) => new Set(prev).add(blockId));
    setActiveBlockId(blockId);
  }, []);

  const onSaveComplete = useCallback((blockIds: number[]) => {
    setUnsavedBlockIds((prev) => {
      const next = new Set(prev);
      blockIds.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clearUnsaved = useCallback(() => {
    setUnsavedBlockIds(new Set());
  }, []);

  // Sprint v23.1: Cleanup ao desmontar para evitar memory leak
  useEffect(() => {
    return () => {
      setUnsavedBlockIds(new Set());
      setActiveBlockId(null);
      setActiveFieldKey(null);
    };
  }, []);

  return {
    activeBlockId,
    activeFieldKey,
    previewSize,
    unsavedBlockIds,
    unsavedCount: unsavedBlockIds.size,
    onFieldFocus,
    onBlockUpdate,
    onSaveComplete,
    setPreviewSize,
    clearUnsaved,
  };
}
