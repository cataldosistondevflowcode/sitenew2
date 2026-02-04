/**
 * Componente: SharePreviewButton
 * 
 * Botão para gerar e compartilhar link de preview temporário
 * Sprint CMS v3
 */

import { useState } from 'react';
import { usePreviewToken } from '@/hooks/usePreviewToken';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, CheckCircle2, Loader2, Clock } from 'lucide-react';

interface SharePreviewButtonProps {
  pageId: number;
  pageSlug: string;
}

export const SharePreviewButton = ({ pageId, pageSlug }: SharePreviewButtonProps) => {
  const { createToken, copyPreviewUrl, getPreviewUrl, isCreating } = usePreviewToken();
  const [open, setOpen] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expirationMinutes, setExpirationMinutes] = useState('60');

  const handleGenerate = async () => {
    const minutes = parseInt(expirationMinutes, 10);
    const tokenData = await createToken(pageId, minutes);
    if (tokenData) {
      const url = getPreviewUrl(pageSlug, tokenData.token);
      setGeneratedUrl(url);
    }
  };

  const handleCopy = async () => {
    if (generatedUrl) {
      const success = await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedUrl(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartilhar Preview
          </DialogTitle>
          <DialogDescription>
            Gere um link temporário para compartilhar o preview desta página com alguém que não tem acesso ao admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!generatedUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="expiration">Tempo de expiração</Label>
                <Select value={expirationMinutes} onValueChange={setExpirationMinutes}>
                  <SelectTrigger id="expiration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="1440">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Gerar Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Link de preview</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedUrl}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800 flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Este link expira em {expirationMinutes} minutos</p>
                  <p className="text-xs mt-1 opacity-80">
                    Qualquer pessoa com este link pode visualizar o preview.
                    Gere um novo link se precisar compartilhar novamente.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedUrl(null)}
                  className="flex-1"
                >
                  Gerar Novo Link
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
