/**
 * Página: AdminCmsPageEdit
 * Rota: /admin/cms/pages/:slug/edit
 * 
 * Editor de página CMS
 * Sprint CMS v0 — MVP mínimo (edita página Home, bloco hero_title)
 * Sprint CMS v9 — UX sincronizada com preview (auto-scroll, highlight, status bar)
 * Sprint CMS v19 — Undo/Redo global (Ctrl+Z / Ctrl+Shift+Z)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCmsContent, CmsBlock } from '@/hooks/useCmsContent';
import { useSyncedBlockEditor } from '@/hooks/useSyncedBlockEditor';
import { useUndoRedo, UndoRedoAction } from '@/hooks/useUndoRedo';
import { useKeyboardShortcuts, STANDARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';
import { BlockEditorFactory } from '@/components/admin/BlockEditorFactory';
import { AddBlockModal, BlockType } from '@/components/admin/AddBlockModal';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SortableBlockList } from '@/components/admin/SortableBlockList';
import { SortableBlockItem } from '@/components/admin/SortableBlockItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2, Eye, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { SyncedLivePreview } from '@/components/admin/ux/SyncedLivePreview';
import { BlockStatusIndicator } from '@/components/admin/ux/BlockStatusIndicator';
import { EnhancedEditorStatusBar } from '@/components/admin/ux/EnhancedEditorStatusBar';
import { SharePreviewButton } from '@/components/admin/SharePreviewButton';
import { BlockVersionHistory } from '@/components/admin/BlockVersionHistory';
import { useToast } from '@/hooks/use-toast';

export default function AdminCmsPageEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Array<{ blockId: number; fieldKey: string; message: string }>>([]);
  
  // Sprint v20: Estados para adicionar/excluir blocos
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [addBlockAtIndex, setAddBlockAtIndex] = useState<number | undefined>(undefined);
  const [blockToDelete, setBlockToDelete] = useState<{ id: number; key: string } | null>(null);
  
  // Ref para controlar se já inicializamos o estado do undo
  const undoInitialized = useRef(false);

  // Sprint v9: Hook de sincronização editor-preview
  const {
    activeBlockId,
    activeFieldKey,
    previewSize,
    unsavedBlockIds,
    unsavedCount,
    onFieldFocus,
    onBlockUpdate,
    onSaveComplete,
    setPreviewSize,
  } = useSyncedBlockEditor();

  // Sprint v19: Hook de Undo/Redo global
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    clearHistory,
    undoStackLength,
    redoStackLength,
  } = useUndoRedo<CmsBlock[]>({
    maxStackSize: 50,
    persistInSession: false, // Não persistir entre recarregamentos
    debounceMs: 500, // Agrupa edições rápidas
  });

  // Redirecionar se não for admin
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  // Não pode ser undefined
  if (!slug) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>Página não especificada</span>
        </div>
      </div>
    );
  }

  const { page, blocks, loading, error, updateBlockDraft, publishBlock, validateBlockContent, isSaving, reloadPage, createBlock, deleteBlock, reorderBlocks, setBlocksLocal } =
    useCmsContent(slug);

  // Sprint v19: Inicializar estado do undo quando blocos carregam
  useEffect(() => {
    if (blocks.length > 0 && !undoInitialized.current) {
      // Salva o estado inicial para permitir undo até o estado original
      pushState(blocks, 'edit', 'Estado inicial');
      undoInitialized.current = true;
    }
  }, [blocks, pushState]);

  // Sprint v23: Validar blocos e popular validationErrors em tempo real
  useEffect(() => {
    if (blocks.length === 0) {
      setValidationErrors([]);
      return;
    }
    const errors: Array<{ blockId: number; fieldKey: string; message: string }> = [];
    for (const block of blocks) {
      if (block.content_draft && Object.keys(block.content_draft).length > 0) {
        const blockErrors = validateBlockContent(block, block.content_draft);
        for (const msg of blockErrors) {
          errors.push({ blockId: block.id, fieldKey: block.block_key, message: msg });
        }
      }
    }
    setValidationErrors(errors);
  }, [blocks, validateBlockContent]);

  // Sprint v19: Limpar histórico ao trocar de página
  useEffect(() => {
    return () => {
      clearHistory();
      undoInitialized.current = false;
    };
  }, [slug, clearHistory]);

  // Toggle de expansão de bloco
  const toggleBlockExpanded = (blockId: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
    // Sprint v9: Também dispara foco no bloco
    onFieldFocus(blockId);
  };

  // Expandir todos os blocos
  const expandAll = () => {
    setExpandedBlocks(new Set(blocks.map((b) => b.id)));
  };

  // Colapsar todos os blocos
  const collapseAll = () => {
    setExpandedBlocks(new Set());
  };

  // Sprint v19 + v23 fix: Handler de Undo — aplica state do stack em vez de recarregar
  const handleUndo = useCallback(() => {
    const previousBlocks = undo();
    if (previousBlocks) {
      // Sprint v23: Aplicar o estado anterior diretamente no estado local
      setBlocksLocal(previousBlocks);
      toast({
        title: 'Desfeito',
        description: 'Ação desfeita. Salve para persistir.',
      });
    }
  }, [undo, toast, setBlocksLocal]);

  // Sprint v19 + v23 fix: Handler de Redo — aplica state do stack em vez de recarregar
  const handleRedo = useCallback(() => {
    const nextBlocks = redo();
    if (nextBlocks) {
      // Sprint v23: Aplicar o próximo estado diretamente no estado local
      setBlocksLocal(nextBlocks);
      toast({
        title: 'Refeito',
        description: 'Ação refeita. Salve para persistir.',
      });
    }
  }, [redo, toast, setBlocksLocal]);

  // Sprint v19: Salvar estado antes de modificar
  const saveStateForUndo = useCallback((action: UndoRedoAction, description?: string, blockId?: number) => {
    pushState(blocks, action, description, blockId);
  }, [blocks, pushState]);

  // Sprint v9 + v19: Salvar todos os blocos modificados
  const handleSaveAll = useCallback(async () => {
    const blockIdsToSave = Array.from(unsavedBlockIds);
    let success = true;
    
    // Sprint v19: Salvar estado antes de gravar no banco
    saveStateForUndo('save', `Salvou ${blockIdsToSave.length} blocos`);
    
    for (const blockId of blockIdsToSave) {
      const block = blocks.find((b) => b.id === blockId);
      if (block && block.content_draft) {
        const result = await updateBlockDraft(blockId, block.content_draft);
        if (!result) success = false;
      }
    }
    
    if (success) {
      onSaveComplete(blockIdsToSave);
    }
    return success;
  }, [unsavedBlockIds, blocks, updateBlockDraft, onSaveComplete, saveStateForUndo]);

  // Sprint v9 + v19: Publicar bloco ativo (ou primeiro não salvo)
  const handlePublishActive = useCallback(async () => {
    const blockToPublish = activeBlockId || (unsavedBlockIds.size > 0 ? Array.from(unsavedBlockIds)[0] : null);
    if (blockToPublish) {
      // Sprint v19: Salvar estado antes de publicar
      saveStateForUndo('publish', `Publicou bloco #${blockToPublish}`, blockToPublish);
      
      const success = await publishBlock(blockToPublish);
      if (success) {
        onSaveComplete([blockToPublish]);
      }
      return success;
    }
    return false;
  }, [activeBlockId, unsavedBlockIds, publishBlock, onSaveComplete, saveStateForUndo]);

  // Sprint v9: Handler para quando preview clica num bloco
  const handlePreviewBlockFocus = useCallback((blockId: number) => {
    onFieldFocus(blockId);
    // Também expande o bloco no editor
    setExpandedBlocks((prev) => new Set(prev).add(blockId));
  }, [onFieldFocus]);

  // Sprint v20: Handler para adicionar bloco
  const handleAddBlock = useCallback(async (blockKey: string, blockType: BlockType, position: number | null) => {
    // Salvar estado antes de criar (para undo)
    saveStateForUndo('create', `Criou bloco ${blockKey}`);
    
    const result = await createBlock(blockKey, blockType, position);
    return result.success;
  }, [createBlock, saveStateForUndo]);

  // Sprint v20 + v23 fix: Handler para confirmar exclusão de bloco (com error handling)
  const handleDeleteBlock = useCallback(async () => {
    if (!blockToDelete) return;
    
    // Salvar estado antes de excluir (para undo)
    saveStateForUndo('delete', `Excluiu bloco ${blockToDelete.key}`, blockToDelete.id);
    
    const result = await deleteBlock(blockToDelete.id);
    if (!result.success) {
      // Sprint v23: Se falhou, notificar o usuário e recarregar para restaurar estado
      toast({
        title: 'Erro ao excluir bloco',
        description: result.error || 'Não foi possível excluir o bloco. Tente novamente.',
        variant: 'destructive',
      });
      reloadPage();
    }
    setBlockToDelete(null);
  }, [blockToDelete, deleteBlock, saveStateForUndo, toast, reloadPage]);

  // Sprint v20: Abrir modal de adicionar bloco após um bloco específico
  const openAddBlockModalAfter = useCallback((index: number) => {
    setAddBlockAtIndex(index);
    setShowAddBlockModal(true);
  }, []);

  // Sprint v20: Abrir modal de adicionar bloco no final
  const openAddBlockModalAtEnd = useCallback(() => {
    setAddBlockAtIndex(undefined);
    setShowAddBlockModal(true);
  }, []);

  // Sprint v21: Handler para reordenar blocos via drag-and-drop
  const handleReorderBlocks = useCallback(async (activeId: number, overId: number) => {
    // Salvar estado antes de reordenar (para undo)
    saveStateForUndo('reorder', 'Reordenou blocos');
    
    await reorderBlocks(activeId, overId);
  }, [reorderBlocks, saveStateForUndo]);

  // Sprint v19: Atalhos de teclado globais (Ctrl+Z, Ctrl+Shift+Z, Ctrl+S, Ctrl+P)
  useKeyboardShortcuts({
    shortcuts: [
      {
        ...STANDARD_SHORTCUTS.SAVE_DRAFT,
        key: 'save',
        description: 'Salvar todas as alterações como rascunho',
        handler: handleSaveAll,
        enabled: unsavedCount > 0,
        allowInInput: true, // Ctrl+S funciona mesmo em inputs
      },
      {
        ...STANDARD_SHORTCUTS.PUBLISH,
        key: 'publish',
        description: 'Publicar alterações',
        handler: handlePublishActive,
        enabled: true,
        allowInInput: true,
      },
      {
        ...STANDARD_SHORTCUTS.UNDO,
        key: 'undo',
        description: 'Desfazer última ação',
        handler: handleUndo,
        enabled: canUndo,
        allowInInput: false, // Deixa Ctrl+Z nativo em inputs
      },
      {
        ...STANDARD_SHORTCUTS.REDO,
        key: 'redo',
        description: 'Refazer ação desfeita',
        handler: handleRedo,
        enabled: canRedo,
        allowInInput: false, // Deixa Ctrl+Shift+Z nativo em inputs
      },
    ],
    showHelpOnQuestion: true,
  });

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Carregando página...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar página</h3>
              <p className="text-sm text-red-800 mt-1">{error || 'Página não encontrada'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fixo */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/admin/cms')}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold">{page.title}</h1>
                <p className="text-xs text-gray-600">
                  {page.status === 'published' ? '✓ Publicada' : '⚠ Rascunho'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant={showPreview ? 'default' : 'outline'}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
              </Button>

              <Button
                onClick={() => window.open(`/preview/${page.slug}`, '_blank')}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Nova Aba
              </Button>

              {/* Botão de compartilhar preview (Sprint v3) */}
              <SharePreviewButton pageId={page.id} pageSlug={page.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Lado-a-Lado */}
      <div className="container py-6">
        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Coluna Esquerda: Editores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Blocos de Conteúdo ({blocks.length})</h2>
              <div className="flex gap-2">
                <Button
                  onClick={expandAll}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Expandir Tudo
                </Button>
                <Button
                  onClick={collapseAll}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Colapsar Tudo
                </Button>
              </div>
            </div>

            {blocks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <p className="mb-4">Nenhum bloco de conteúdo encontrado para esta página.</p>
                  <Button onClick={openAddBlockModalAtEnd} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Bloco
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Sprint v21: Lista de blocos com drag-and-drop */}
                <SortableBlockList
                  blocks={blocks}
                  onReorder={handleReorderBlocks}
                  disabled={isSaving}
                >
                  {(block, index) => {
                    const isExpanded = expandedBlocks.has(block.id);
                    const isActive = activeBlockId === block.id;
                    const isUnsaved = unsavedBlockIds.has(block.id);

                    return (
                      <SortableBlockItem key={block.id} id={block.id} disabled={isSaving}>
                        <div 
                          className={`border rounded-lg overflow-hidden bg-white transition-all duration-200 ${
                            isActive ? 'ring-2 ring-yellow-400 ring-offset-1' : ''
                          } ${isUnsaved ? 'border-orange-300' : ''}`}
                        >
                          {/* Status do Bloco */}
                          <button
                            onClick={() => toggleBlockExpanded(block.id)}
                            className="w-full"
                          >
                            <BlockStatusIndicator
                              blockKey={block.block_key}
                              blockType={block.block_type as any}
                              status={
                                JSON.stringify(block.content_draft) !== JSON.stringify(block.content_published)
                                  ? 'draft'
                                  : 'published'
                              }
                              isDirty={isUnsaved}
                              isExpanded={isExpanded}
                              onToggleExpand={() => toggleBlockExpanded(block.id)}
                            />
                          </button>

                          {/* Editor Colapsavel */}
                          {isExpanded && (
                            <div className="border-t p-4">
                              <div className="flex justify-between items-center mb-2">
                                {/* Sprint v20: Botão de excluir bloco */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setBlockToDelete({ id: block.id, key: block.block_key })}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Excluir Bloco
                                </Button>
                                <BlockVersionHistory
                                  blockId={block.id}
                                  blockKey={block.block_key}
                                  onReverted={reloadPage}
                                />
                              </div>
                              <BlockEditorFactory
                                block={block}
                                onSaveDraft={(content) => updateBlockDraft(block.id, content)}
                                onPublish={() => publishBlock(block.id)}
                                isSaving={isSaving}
                                validateContent={(content) => validateBlockContent(block, content)}
                                onFieldFocus={onFieldFocus}
                                onContentChange={onBlockUpdate}
                              />
                            </div>
                          )}
                        </div>
                      </SortableBlockItem>
                    );
                  }}
                </SortableBlockList>

                {/* Sprint v20: Botão para adicionar novo bloco */}
                <Button
                  onClick={openAddBlockModalAtEnd}
                  variant="outline"
                  className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Bloco
                </Button>
              </div>
            )}

          </div>

          {/* Coluna Direita: Preview Sincronizado */}
          {showPreview && (
            <div className="sticky top-24 space-y-4">
              <SyncedLivePreview
                blocks={blocks}
                isDraft={page.status === 'draft'}
                activeBlockId={activeBlockId ?? undefined}
                activeFieldKey={activeFieldKey ?? undefined}
                onBlockFocus={handlePreviewBlockFocus}
                previewSize={previewSize}
                onPreviewSizeChange={setPreviewSize}
              />
            </div>
          )}
        </div>

        {/* Sprint v9 + v19: Status Bar Fixa no Rodape */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="container">
            <EnhancedEditorStatusBar
              activeFieldKey={activeFieldKey}
              activeBlockId={activeBlockId}
              unsavedCount={unsavedCount}
              validationErrors={validationErrors}
              isSaving={isSaving}
              isPublishing={isSaving}
              onSave={handleSaveAll}
              onPublish={handlePublishActive}
              showShortcutHint={true}
              // Sprint v19: Props de Undo/Redo
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              undoStackLength={undoStackLength}
              redoStackLength={redoStackLength}
            />
          </div>
        </div>
      </div>

      {/* Sprint v20: Modal de Adicionar Bloco */}
      <AddBlockModal
        isOpen={showAddBlockModal}
        onClose={() => {
          setShowAddBlockModal(false);
          setAddBlockAtIndex(undefined);
        }}
        onAdd={handleAddBlock}
        existingBlockKeys={blocks.map((b) => b.block_key)}
        currentBlockIndex={addBlockAtIndex}
        totalBlocks={blocks.length}
        isLoading={isSaving}
      />

      {/* Sprint v20: Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        open={!!blockToDelete}
        onOpenChange={(open) => !open && setBlockToDelete(null)}
        title="Excluir Bloco"
        description={`Tem certeza que deseja excluir o bloco "${blockToDelete?.key}"? Esta ação não pode ser desfeita, mas o conteúdo será salvo no histórico de auditoria.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteBlock}
        variant="destructive"
      />
    </div>
  );
}
