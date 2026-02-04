/**
 * Página: AdminCmsPages
 * Rota: /admin/cms
 * 
 * Lista de páginas editáveis do CMS
 * Sprint CMS v0 — MVP mínimo
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CmsPage {
  id: number;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  published_at?: string;
  updated_at: string;
}

export default function AdminCmsPages() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se não for admin
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  // Carregar páginas
  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from('cms_pages')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;

        setPages(data || []);
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

    loadPages();
  }, [toast]);

  const getStatusColor = (status: 'draft' | 'published') => {
    return status === 'published' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  };

  const getStatusLabel = (status: 'draft' | 'published') => {
    return status === 'published' ? '✓ Publicada' : '⚠ Rascunho';
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/admin/cms/audit-log')}
              variant="outline"
              size="sm"
            >
              📋 Log de Auditoria
            </Button>
            <Button
              onClick={() => navigate('/admin/cms/assets')}
              variant="outline"
              size="sm"
            >
              📁 Biblioteca de Mídia
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold">Gerenciador de Conteúdo CMS</h1>
        <p className="text-gray-600 mt-2">Edite o conteúdo das páginas do site</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Carregando páginas...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar páginas</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Páginas */}
      {!loading && !error && (
        <div className="grid gap-4">
          {pages.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                Nenhuma página de CMS encontrada. Contate o administrador.
              </CardContent>
            </Card>
          ) : (
            pages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{page.title}</h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(
                            page.status
                          )}`}
                        >
                          {getStatusLabel(page.status)}
                        </span>
                      </div>
                      {page.description && (
                        <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Slug: <code className="bg-gray-100 px-1 rounded">{page.slug}</code></p>
                        <p>
                          Última atualização:{' '}
                          {new Date(page.updated_at).toLocaleString('pt-BR')}
                        </p>
                        {page.published_at && (
                          <p>
                            Publicada em:{' '}
                            {new Date(page.published_at).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/admin/cms/pages/${page.slug}/edit`)}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
