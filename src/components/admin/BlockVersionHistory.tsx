/**
 * BlockVersionHistory — Histórico de versões de um bloco (Sprint CMS v4)
 * Lista versões e permite reverter para uma versão anterior (como draft).
 * Sprint CMS v17: Adicionado modal de confirmação antes de reverter
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCmsVersions, type CmsVersion } from '@/hooks/useCmsVersions';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { History, Loader2, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlockVersionHistoryProps {
  blockId: number;
  blockKey: string;
  onReverted?: () => void;
  triggerClassName?: string;
}

export function BlockVersionHistory({
  blockId,
  blockKey,
  onReverted,
  triggerClassName,
}: BlockVersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const { listBlockVersions, revertBlockToVersion, loading, reverting } = useCmsVersions();
  const [versions, setVersions] = useState<CmsVersion[]>([]);
  
  // Sprint CMS v17: Estado para modal de confirmação
  const [confirmRevertId, setConfirmRevertId] = useState<number | null>(null);

  const loadVersions = async () => {
    const list = await listBlockVersions(blockId);
    setVersions(list);
  };

  useEffect(() => {
    if (open) {
      loadVersions();
    }
  }, [open, blockId]);

  const handleRevert = async (versionId: number) => {
    const ok = await revertBlockToVersion(blockId, versionId);
    if (ok) {
      setConfirmRevertId(null);
      setOpen(false);
      onReverted?.();
    }
  };
  
  // Sprint CMS v17: Abrir modal de confirmação em vez de reverter diretamente
  const requestRevert = (versionId: number) => {
    setConfirmRevertId(versionId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClassName}>
          <History className="w-4 h-4 mr-1" />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico — {blockKey}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma versão publicada ainda. Versões são criadas ao publicar o bloco.
            </p>
          ) : (
            <ul className="space-y-2">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-muted/30"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Versão #{v.version_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(v.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => requestRevert(v.id)}
                    disabled={reverting}
                  >
                    {reverting && confirmRevertId === v.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reverter
                      </>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Reverter restaura o conteúdo como rascunho. É preciso publicar novamente para ir ao ar.
        </p>
      </DialogContent>
      
      {/* Sprint CMS v17: Modal de confirmação */}
      <ConfirmationModal
        open={confirmRevertId !== null}
        onOpenChange={(open) => !open && setConfirmRevertId(null)}
        title="Reverter para versão anterior?"
        description="Isso substituirá o rascunho atual pelo conteúdo desta versão. Você precisará publicar para que as alterações fiquem visíveis ao público."
        confirmLabel="Reverter"
        cancelLabel="Cancelar"
        onConfirm={() => confirmRevertId && handleRevert(confirmRevertId)}
        variant="destructive"
      />
    </Dialog>
  );
}
