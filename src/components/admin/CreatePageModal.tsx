/**
 * Componente: CreatePageModal
 * 
 * Modal para criar nova página CMS
 * - Título, slug e descrição
 * - Validação de slug único
 * - Opção de criar com blocos padrão
 * 
 * Sprint CMS v22 — Criar Novas Páginas pelo Admin
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreatePageData) => Promise<{ success: boolean; slug?: string; error?: string }>;
  existingSlugs: string[];
  isLoading?: boolean;
}

export interface CreatePageData {
  title: string;
  slug: string;
  description: string;
  createDefaultBlocks: boolean;
}

/**
 * Gera slug a partir do título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .substring(0, 50); // Limita tamanho
}

/**
 * Valida o formato do slug
 */
function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: 'Slug é obrigatório' };
  }
  
  if (slug.length < 2) {
    return { valid: false, error: 'Mínimo 2 caracteres' };
  }
  
  if (slug.length > 50) {
    return { valid: false, error: 'Máximo 50 caracteres' };
  }
  
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(slug) && !/^[a-z][a-z0-9]?$/.test(slug)) {
    return { valid: false, error: 'Use letras minúsculas, números e hífens. Deve começar e terminar com letra/número.' };
  }
  
  if (/--/.test(slug)) {
    return { valid: false, error: 'Não use hífens consecutivos' };
  }
  
  return { valid: true };
}

export function CreatePageModal({
  isOpen,
  onClose,
  onCreate,
  existingSlugs,
  isLoading = false,
}: CreatePageModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [createDefaultBlocks, setCreateDefaultBlocks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Reset form quando modal abre
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSlug('');
      setDescription('');
      setCreateDefaultBlocks(true);
      setError(null);
      setSlugManuallyEdited(false);
    }
  }, [isOpen]);

  // Auto-gerar slug quando título muda (se não foi editado manualmente)
  useEffect(() => {
    if (title && !slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  // Handler para mudança no slug
  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    // Formatar slug automaticamente
    const formatted = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
    setSlug(formatted);
  };

  // Validar e submeter
  const handleSubmit = async () => {
    setError(null);

    // Validar título
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    // Validar slug
    const validation = validateSlug(slug);
    if (!validation.valid) {
      setError(validation.error || 'Slug inválido');
      return;
    }

    // Verificar duplicidade
    if (existingSlugs.includes(slug)) {
      setError('Este slug já está em uso por outra página');
      return;
    }

    // Chamar callback
    const result = await onCreate({
      title: title.trim(),
      slug,
      description: description.trim(),
      createDefaultBlocks,
    });

    if (result.success) {
      onClose();
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Criar Nova Página
          </DialogTitle>
          <DialogDescription>
            Crie uma nova página editável para o site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Página *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sobre a Empresa"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">cataldosiston.com.br/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="sobre-a-empresa"
                className={cn(
                  existingSlugs.includes(slug) && 'border-red-500'
                )}
              />
            </div>
            <p className="text-xs text-gray-500">
              URL da página. Use letras minúsculas, números e hífens.
            </p>
            {slug && existingSlugs.includes(slug) && (
              <p className="text-xs text-red-500">Este slug já está em uso</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do conteúdo da página..."
              rows={2}
            />
          </div>

          {/* Blocos padrão */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="defaultBlocks"
              checked={createDefaultBlocks}
              onCheckedChange={(checked) => setCreateDefaultBlocks(checked === true)}
            />
            <Label htmlFor="defaultBlocks" className="text-sm font-normal cursor-pointer">
              Criar com blocos padrão (título, subtítulo, texto)
            </Label>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !title || !slug}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Página'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePageModal;
