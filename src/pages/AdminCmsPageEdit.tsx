/**
 * Página: AdminCmsPageEdit
 * Rota: /admin/cms/pages/:slug/edit
 * 
 * Editor de página CMS
 * Sprint CMS v0 — MVP mínimo (edita página Home, bloco hero_title)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCmsContent } from '@/hooks/useCmsContent';
import { BlockEditorFactory } from '@/components/admin/BlockEditorFactory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LivePreview } from '@/components/admin/ux/LivePreview';
import { BlockStatusIndicator } from '@/components/admin/ux/BlockStatusIndicator';

export default function AdminCmsPageEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(true);

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

  const { page, blocks, loading, error, updateBlockDraft, publishBlock, validateBlockContent, isSaving } =
    useCmsContent(slug);

  // Toggle de expansão de bloco
  const toggleBlockExpanded = (blockId: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  // Expandir todos os blocos
  const expandAll = () => {
    setExpandedBlocks(new Set(blocks.map((b) => b.id)));
  };

  // Colapsar todos os blocos
  const collapseAll = () => {
    setExpandedBlocks(new Set());
  };

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
                  Nenhum bloco de conteúdo encontrado para esta página.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {blocks.map((block) => {
                  const isExpanded = expandedBlocks.has(block.id);

                  return (
                    <div key={block.id} className="border rounded-lg overflow-hidden bg-white">
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
                          isDirty={false}
                          isExpanded={isExpanded}
                          onToggleExpand={() => toggleBlockExpanded(block.id)}
                        />
                      </button>

                      {/* Editor Colapsável */}
                      {isExpanded && (
                        <div className="border-t p-4">
                          <BlockEditorFactory
                            block={block}
                            onSaveDraft={(content) => updateBlockDraft(block.id, content)}
                            onPublish={() => publishBlock(block.id)}
                            isSaving={isSaving}
                            validateContent={(content) => validateBlockContent(block, content)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 border border-blue-200 mt-6">
              💡 <strong>Dica:</strong> Use Ctrl+S para salvar ou Ctrl+P para publicar. Clique no bloco para expandir.
            </div>
          </div>

          {/* Coluna Direita: Preview */}
          {showPreview && (
            <div className="sticky top-24">
              <Card className="border-2 border-blue-200 bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Pré-visualização em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <LivePreview blocks={blocks} isDraft={page.status === 'draft'} showIndicator={true} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
