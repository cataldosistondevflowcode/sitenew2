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
import { AlertCircle, ArrowLeft, Loader2, Eye } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminCmsPageEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

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
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate('/admin/cms')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={() => window.open(`/preview/${page.slug}`, '_blank')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Pré-visualizar
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <p className="text-gray-600 mt-2">
            Edite os blocos de conteúdo abaixo. As mudanças são salvas como rascunho
            automaticamente.
          </p>
        </div>
      </div>

      {/* Status da página */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">Status da Página</p>
              <p className="text-sm text-blue-800 mt-1">
                {page.status === 'published' ? (
                  <span className="text-green-600">✓ Publicada</span>
                ) : (
                  <span className="text-yellow-600">⚠ Rascunho</span>
                )}
              </p>
            </div>
            {page.published_at && (
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Última publicação: {new Date(page.published_at).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blocos de conteúdo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Blocos de Conteúdo</h2>

        {blocks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              Nenhum bloco de conteúdo encontrado para esta página.
            </CardContent>
          </Card>
        ) : (
          blocks.map((block) => (
            <BlockEditorFactory
              key={block.id}
              block={block}
              onSaveDraft={(content) => updateBlockDraft(block.id, content)}
              onPublish={() => publishBlock(block.id)}
              isSaving={isSaving}
              validateContent={(content) => validateBlockContent(block, content)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border">
        <p>💡 Dica: Salve o rascunho e depois clique em "Publicar" para tornar as mudanças públicas.</p>
      </div>
    </div>
  );
}
