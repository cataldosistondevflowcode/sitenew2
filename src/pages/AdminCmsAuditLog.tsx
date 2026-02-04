/**
 * Página: AdminCmsAuditLog
 * Rota: /admin/cms/audit-log
 *
 * Log de auditoria do CMS (Sprint CMS v4 — FR-ADM-010).
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PAGE_SIZE = 50;

interface AuditEntry {
  id: number;
  actor_id?: string;
  actor_email?: string;
  action: string;
  entity_type: string;
  entity_id: number;
  entity_name?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

const actionLabels: Record<string, string> = {
  create: 'Criar',
  update: 'Atualizar',
  publish: 'Publicar',
  revert: 'Reverter',
  delete: 'Excluir',
  upload: 'Upload',
};

export default function AdminCmsAuditLog() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: err } = await supabase
          .from('cms_audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(PAGE_SIZE);

        if (err) throw err;
        setEntries((data || []) as AuditEntry[]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar log';
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

    if (user && isAdmin) {
      load();
    }
  }, [user, isAdmin, toast]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button onClick={() => navigate('/admin/cms')} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao CMS
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Log de Auditoria — CMS
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quem alterou o quê. Registros append-only (não editáveis).
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum registro ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Data</th>
                    <th className="text-left py-2 px-2">Quem</th>
                    <th className="text-left py-2 px-2">Ação</th>
                    <th className="text-left py-2 px-2">Entidade</th>
                    <th className="text-left py-2 px-2">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">
                        {format(new Date(e.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </td>
                      <td className="py-2 px-2">{e.actor_email || e.actor_id || '—'}</td>
                      <td className="py-2 px-2">
                        <span className="font-medium">{actionLabels[e.action] ?? e.action}</span>
                      </td>
                      <td className="py-2 px-2">{e.entity_type}</td>
                      <td className="py-2 px-2">
                        {e.entity_name ? `${e.entity_name} (#${e.entity_id})` : `#${e.entity_id}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
