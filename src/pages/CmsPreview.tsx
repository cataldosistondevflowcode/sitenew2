/**
 * Página: CmsPreview
 * Rota: /preview/:slug
 * 
 * Preview de página CMS em draft
 * Sprint CMS v1 + v3 (Token de Preview)
 */

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCmsContent } from '@/hooks/useCmsContent';
import { usePreviewToken } from '@/hooks/usePreviewToken';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2, Eye, Clock, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CmsPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { validateToken } = usePreviewToken();

  const [tokenAccess, setTokenAccess] = useState<boolean | null>(null);
  const [tokenValidating, setTokenValidating] = useState(false);

  // Verificar acesso: admin OU token válido
  const token = searchParams.get('token');

  useEffect(() => {
    const checkAccess = async () => {
      // Se é admin, tem acesso
      if (user && isAdmin) {
        setTokenAccess(true);
        return;
      }

      // Se tem token na URL, validar
      if (token) {
        setTokenValidating(true);
        const result = await validateToken(token);
        setTokenValidating(false);

        if (result && result.slug === slug) {
          setTokenAccess(true);
          return;
        }
      }

      // Sem admin e sem token válido
      if (!user) {
        // Redirecionar para login apenas se não houver token
        if (!token) {
          navigate('/admin/login');
        } else {
          setTokenAccess(false);
        }
      } else if (!isAdmin) {
        setTokenAccess(false);
      }
    };

    checkAccess();
  }, [user, isAdmin, token, slug, navigate, validateToken]);

  // Validando token
  if (tokenValidating) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Validando acesso...</p>
        </div>
      </div>
    );
  }

  // Token inválido ou expirado
  if (tokenAccess === false) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 bg-red-50 max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 text-lg mb-2">Acesso Negado</h3>
            <p className="text-sm text-red-800 mb-4">
              {token 
                ? 'O link de preview expirou ou é inválido.'
                : 'Você não tem permissão para visualizar esta página.'
              }
            </p>
            <Button
              onClick={() => navigate('/admin/login')}
              variant="outline"
              size="sm"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (loading || tokenAccess === null) {
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
              {/* Indicador de acesso via token */}
              {token && !isAdmin && (
                <div className="bg-blue-500 px-3 py-1 rounded text-xs flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Acesso via link
                </div>
              )}

              {/* Botão de voltar (só para admin) */}
              {isAdmin && (
                <Button
                  onClick={() => navigate(`/admin/cms/pages/${page.slug}/edit`)}
                  variant="secondary"
                  size="sm"
                >
                  ← Voltar para Edição
                </Button>
              )}

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
