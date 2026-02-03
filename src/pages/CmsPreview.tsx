/**
 * Página: CmsPreview
 * Rota: /preview/:slug
 * 
 * Preview de página CMS em draft
 * Sprint CMS v1
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCmsContent } from '@/hooks/useCmsContent';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2, Eye } from 'lucide-react';
import { useEffect } from 'react';

export default function CmsPreview() {
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

  const { page, blocks, loading, error } = useCmsContent(slug);

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Carregando preview...</p>
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
              <h3 className="font-semibold text-red-900">Erro ao carregar preview</h3>
              <p className="text-sm text-red-800 mt-1">{error || 'Página não encontrada'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Preview */}
      <div className="bg-blue-600 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-90">PREVIEW (Não é visível ao público)</p>
                <h1 className="text-xl font-bold">{page.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(`/admin/cms/pages/${page.slug}/edit`)}
                variant="secondary"
                size="sm"
              >
                ← Voltar para Edição
              </Button>

              {page.status === 'draft' && (
                <div className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  ⚠ Rascunho
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Preview */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
          {/* Blocos renderizados em draft */}
          {blocks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhum bloco encontrado nesta página
            </div>
          ) : (
            blocks.map((block) => (
              <CmsBlockRenderer key={block.id} block={block} isPreview={true} />
            ))
          )}
        </div>

        {/* Botão para publicar */}
        {page.status === 'draft' && (
          <div className="mt-8 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-blue-900 mb-3">
              ℹ️ Este é um rascunho. Volte para a edição e clique em "Publicar" para tornar visível ao público.
            </p>
            <Button
              onClick={() => navigate(`/admin/cms/pages/${page.slug}/edit`)}
              variant="outline"
            >
              Voltar e Publicar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
