/**
 * Hook: useCmsContent
 * 
 * Gerencia conteúdo do CMS (páginas, blocos, draft/publish)
 * Sprint CMS v0 — MVP mínimo
 * Sprint CMS v20 — Criar/Excluir blocos dinamicamente
 * 
 * Funcionalidades:
 * - Carregar página e blocos do CMS
 * - Salvar alterações como draft
 * - Publicar conteúdo (draft → published)
 * - Criar novos blocos (v20)
 * - Excluir blocos existentes (v20)
 * - Registrar no audit log
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CmsBlock {
  id: number;
  page_id: number;
  block_key: string;
  block_type: 'text' | 'richtext' | 'image' | 'cta' | 'list' | 'faq' | 'banner';
  content_draft: Record<string, any>;
  content_published: Record<string, any>;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsAuditLog {
  id: number;
  actor_id?: string;
  actor_email?: string;
  action: 'create' | 'update' | 'publish' | 'revert' | 'delete' | 'upload';
  entity_type: 'page' | 'block' | 'asset';
  entity_id: number;
  entity_name?: string;
  details?: Record<string, any>;
  created_at: string;
}

export const useCmsContent = (pageSlug: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [page, setPage] = useState<CmsPage | null>(null);
  const [blocks, setBlocks] = useState<CmsBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar página e blocos
  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Carregar página
      const { data: pageData, error: pageError } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', pageSlug)
        .single();

      if (pageError) throw new Error(`Página não encontrada: ${pageError.message}`);
      if (!pageData) throw new Error('Página não encontrada');

      setPage(pageData as CmsPage);

      // 2. Carregar blocos
      const { data: blocksData, error: blocksError } = await supabase
        .from('cms_blocks')
        .select('*')
        .eq('page_id', pageData.id)
        .order('display_order', { ascending: true });

      if (blocksError) throw new Error(`Erro ao carregar blocos: ${blocksError.message}`);

      setBlocks((blocksData || []) as CmsBlock[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Validar conteúdo do bloco
  const validateBlockContent = (block: CmsBlock, content: Record<string, any>): string[] => {
    const errors: string[] = [];

    const isCardList =
      block.block_key.includes('_cards') || block.block_key.includes('highlight_cards') || block.block_key.includes('values_cards');
    const isStepList =
      block.block_key.includes('_steps') || block.block_key.includes('how_it_works_steps');

    const isValidUrlOrPath = (value: unknown) => {
      if (typeof value !== 'string') return false;
      const v = value.trim();
      if (!v) return false;
      if (v.startsWith('/')) return true;
      try {
        // eslint-disable-next-line no-new
        new URL(v);
        return true;
      } catch {
        return false;
      }
    };

    switch (block.block_type) {
      case 'text':
      case 'richtext':
        if (!content.value || !content.value.trim()) {
          errors.push('Conteúdo não pode estar vazio');
        }
        break;

      case 'image':
        if (!content.url || !content.url.trim()) {
          errors.push('URL da imagem é obrigatória');
        } else {
          try {
            new URL(content.url);
          } catch {
            errors.push('URL da imagem inválida');
          }
        }
        break;

      case 'cta':
        if (!content.text || !content.text.trim()) {
          errors.push('Texto do botão é obrigatório');
        }
        if (!content.url || !content.url.trim()) {
          errors.push('URL/Link é obrigatório');
        }
        break;

      case 'list':
        if (!Array.isArray(content.items) || content.items.length === 0) {
          errors.push('Lista precisa de pelo menos um item');
          break;
        }

        // Listas compostas (cards/steps) — Sprint v13
        if (isCardList) {
          content.items.forEach((item: any, idx: number) => {
            if (!item || typeof item !== 'object') {
              errors.push(`Card #${idx + 1}: formato inválido`);
              return;
            }
            if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
              errors.push(`Card #${idx + 1}: título é obrigatório`);
            }
            if (!item.description || typeof item.description !== 'string' || !item.description.trim()) {
              errors.push(`Card #${idx + 1}: descrição é obrigatória`);
            }
            if (item.image_url && !isValidUrlOrPath(item.image_url)) {
              errors.push(`Card #${idx + 1}: image_url inválida`);
            }
            if (item.link && !isValidUrlOrPath(item.link)) {
              errors.push(`Card #${idx + 1}: link inválido`);
            }
          });
        }

        if (isStepList) {
          content.items.forEach((item: any, idx: number) => {
            if (!item || typeof item !== 'object') {
              errors.push(`Passo #${idx + 1}: formato inválido`);
              return;
            }
            if (typeof item.number !== 'number' || !Number.isFinite(item.number) || item.number <= 0) {
              errors.push(`Passo #${idx + 1}: número inválido`);
            }
            if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
              errors.push(`Passo #${idx + 1}: título é obrigatório`);
            }
            if (!item.description || typeof item.description !== 'string' || !item.description.trim()) {
              errors.push(`Passo #${idx + 1}: descrição é obrigatória`);
            }
          });
        }
        break;

      case 'faq':
        if (!Array.isArray(content.items) || content.items.length === 0) {
          errors.push('FAQ precisa de pelo menos um item');
        }
        break;
    }

    return errors;
  };

  // Atualizar bloco (salvar como draft)
  const updateBlockDraft = async (blockId: number, content: Record<string, any>) => {
    try {
      setIsSaving(true);

      // Validar conteúdo
      const block = blocks.find((b) => b.id === blockId);
      if (!block) throw new Error('Bloco não encontrado');

      const validationErrors = validateBlockContent(block, content);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      // Atualizar content_draft no Supabase
      const { error } = await supabase
        .from('cms_blocks')
        .update({
          content_draft: content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', blockId);

      if (error) throw error;

      // Atualizar estado local
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId
            ? { ...block, content_draft: content, updated_at: new Date().toISOString() }
            : block
        )
      );

      // Registrar audit log
      await createAuditLog('update', 'block', blockId, 'Bloco atualizado como draft');

      toast({
        title: 'Sucesso',
        description: 'Draft salvo com sucesso',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar draft';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar bloco (draft → published) usando função RPC atômica
  const publishBlock = async (blockId: number) => {
    try {
      setIsSaving(true);

      // Obter bloco com draft
      const block = blocks.find((b) => b.id === blockId);
      if (!block) throw new Error('Bloco não encontrado');

      // Usar content_draft se existir, senão usar content_published
      const contentToPublish = block.content_draft || block.content_published;
      if (!contentToPublish) {
        throw new Error('Nenhum conteúdo para publicar');
      }

      // Validar antes de publicar
      const validationErrors = validateBlockContent(block, contentToPublish);
      if (validationErrors.length > 0) {
        throw new Error(`Validação falhou: ${validationErrors.join('; ')}`);
      }

      // Chamar função RPC atômica (Sprint v3)
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('publish_block_atomic', {
          p_block_id: blockId,
          p_user_id: user?.id || null,
        });

      if (rpcError) {
        throw new Error(`Erro no publish atômico: ${rpcError.message}`);
      }

      // Verificar resultado da RPC
      if (rpcResult && !rpcResult.success) {
        throw new Error(rpcResult.error || 'Erro desconhecido no publish');
      }

      // Atualizar estado local
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                content_published: b.content_draft || b.content_published,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );

      // Atualizar status da página para published
      if (page) {
        setPage((prev) =>
          prev
            ? {
                ...prev,
                status: 'published',
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : null
        );
      }

      // Audit log já é registrado pela função RPC (não precisa duplicar)

      toast({
        title: 'Sucesso',
        description: 'Conteúdo publicado com sucesso',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao publicar';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Registrar ação no audit log
  const createAuditLog = async (
    action: CmsAuditLog['action'],
    entityType: CmsAuditLog['entity_type'],
    entityId: number,
    summary?: string
  ) => {
    try {
      const { error } = await supabase.from('cms_audit_log').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action,
        entity_type: entityType,
        entity_id: entityId,
        entity_name: summary,
        details: { timestamp: new Date().toISOString() },
      });

      if (error) console.warn('Erro ao registrar audit log:', error);
    } catch (err) {
      console.warn('Erro ao criar audit log:', err);
    }
  };

  // Sprint v20: Criar novo bloco
  const createBlock = async (
    blockKey: string,
    blockType: CmsBlock['block_type'],
    position: number | null = null
  ): Promise<{ success: boolean; blockId?: number; error?: string }> => {
    try {
      setIsSaving(true);

      if (!page) {
        throw new Error('Página não carregada');
      }

      // Chamar RPC
      const { data: rpcResult, error: rpcError } = await supabase.rpc('create_block_safe', {
        p_page_id: page.id,
        p_block_key: blockKey,
        p_block_type: blockType,
        p_position: position,
      });

      if (rpcError) {
        throw new Error(`Erro ao criar bloco: ${rpcError.message}`);
      }

      // Verificar resultado da RPC
      if (!rpcResult?.success) {
        throw new Error(rpcResult?.error || 'Erro desconhecido ao criar bloco');
      }

      // Recarregar blocos para atualizar estado local
      await loadPage();

      toast({
        title: 'Sucesso',
        description: `Bloco "${blockKey}" criado com sucesso`,
      });

      return { success: true, blockId: rpcResult.block_id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar bloco';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return { success: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  // Sprint v20: Excluir bloco
  const deleteBlock = async (blockId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsSaving(true);

      // Obter info do bloco para feedback
      const block = blocks.find((b) => b.id === blockId);
      const blockKey = block?.block_key || `#${blockId}`;

      // Chamar RPC
      const { data: rpcResult, error: rpcError } = await supabase.rpc('delete_block_safe', {
        p_block_id: blockId,
      });

      if (rpcError) {
        throw new Error(`Erro ao excluir bloco: ${rpcError.message}`);
      }

      // Verificar resultado da RPC
      if (!rpcResult?.success) {
        throw new Error(rpcResult?.error || 'Erro desconhecido ao excluir bloco');
      }

      // Atualizar estado local imediatamente
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));

      toast({
        title: 'Sucesso',
        description: `Bloco "${blockKey}" excluído`,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir bloco';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return { success: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  // Sprint v21: Reordenar blocos
  const reorderBlocks = async (
    activeId: number,
    overId: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!page) {
        throw new Error('Página não carregada');
      }

      // Encontrar índices
      const oldIndex = blocks.findIndex((b) => b.id === activeId);
      const newIndex = blocks.findIndex((b) => b.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        throw new Error('Bloco não encontrado');
      }

      if (oldIndex === newIndex) {
        return { success: true }; // Sem mudança
      }

      // Reordenar localmente primeiro (otimistic update)
      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      // Atualizar display_order localmente
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        display_order: index + 1,
      }));

      // Atualizar estado local imediatamente
      setBlocks(updatedBlocks);

      // Preparar dados para a RPC
      const blockOrders = updatedBlocks.map((b) => ({
        id: b.id,
        order: b.display_order,
      }));

      // Chamar RPC para persistir
      const { data: rpcResult, error: rpcError } = await supabase.rpc('reorder_blocks_batch', {
        p_page_id: page.id,
        p_block_orders: blockOrders,
      });

      if (rpcError) {
        // Rollback local
        await loadPage();
        throw new Error(`Erro ao reordenar blocos: ${rpcError.message}`);
      }

      if (!rpcResult?.success) {
        // Rollback local
        await loadPage();
        throw new Error(rpcResult?.error || 'Erro desconhecido ao reordenar blocos');
      }

      toast({
        title: 'Blocos reordenados',
        description: 'A nova ordem foi salva',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao reordenar blocos';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return { success: false, error: message };
    }
  };

  // Carregar página ao montar ou mudar slug
  useEffect(() => {
    if (pageSlug) {
      loadPage();
    }
  }, [pageSlug]);

  return {
    page,
    blocks,
    loading,
    error,
    isSaving,
    updateBlockDraft,
    publishBlock,
    validateBlockContent,
    reloadPage: loadPage,
    // Sprint v20: Criar/Excluir blocos
    createBlock,
    deleteBlock,
    // Sprint v21: Reordenar blocos
    reorderBlocks,
  };
};
