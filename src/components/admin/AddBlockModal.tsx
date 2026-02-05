/**
 * Componente: AddBlockModal
 * 
 * Modal para adicionar novo bloco a uma página CMS
 * - Lista de tipos de bloco disponíveis
 * - Campo para identificador (block_key)
 * - Seleção de posição (após bloco atual ou no final)
 * 
 * Sprint CMS v20 — Criar/Excluir Blocos Dinamicamente
 */

import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Type, FileText, Image, MousePointer, List, HelpCircle, LayoutTemplate, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tipos de bloco disponíveis
 */
export type BlockType = 'text' | 'richtext' | 'image' | 'cta' | 'list' | 'faq' | 'banner';

interface BlockTypeOption {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const BLOCK_TYPE_OPTIONS: BlockTypeOption[] = [
  {
    type: 'text',
    label: 'Texto Simples',
    description: 'Texto puro sem formatação',
    icon: <Type className="w-5 h-5" />,
  },
  {
    type: 'richtext',
    label: 'Texto Rico',
    description: 'Texto com formatação (negrito, itálico, links)',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    type: 'image',
    label: 'Imagem',
    description: 'Imagem com alt text e legenda',
    icon: <Image className="w-5 h-5" />,
  },
  {
    type: 'cta',
    label: 'Botão (CTA)',
    description: 'Botão de ação com link',
    icon: <MousePointer className="w-5 h-5" />,
  },
  {
    type: 'list',
    label: 'Lista',
    description: 'Lista de itens ou cards',
    icon: <List className="w-5 h-5" />,
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Perguntas e respostas (accordion)',
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    type: 'banner',
    label: 'Banner',
    description: 'Banner com imagem de fundo e texto',
    icon: <LayoutTemplate className="w-5 h-5" />,
  },
];

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (blockKey: string, blockType: BlockType, position: number | null) => Promise<boolean>;
  existingBlockKeys: string[];
  currentBlockIndex?: number;
  totalBlocks: number;
  isLoading?: boolean;
}

/**
 * Valida o formato do block_key
 * - Apenas letras minúsculas, números e underscore
 * - Deve começar com letra
 * - Mínimo 3, máximo 50 caracteres
 */
function validateBlockKey(key: string): { valid: boolean; error?: string } {
  if (!key) {
    return { valid: false, error: 'Identificador é obrigatório' };
  }
  
  if (key.length < 3) {
    return { valid: false, error: 'Mínimo 3 caracteres' };
  }
  
  if (key.length > 50) {
    return { valid: false, error: 'Máximo 50 caracteres' };
  }
  
  if (!/^[a-z][a-z0-9_]*$/.test(key)) {
    return { valid: false, error: 'Use apenas letras minúsculas, números e underscore. Deve começar com letra.' };
  }
  
  return { valid: true };
}

export function AddBlockModal({
  isOpen,
  onClose,
  onAdd,
  existingBlockKeys,
  currentBlockIndex,
  totalBlocks,
  isLoading = false,
}: AddBlockModalProps) {
  const [blockKey, setBlockKey] = useState('');
  const [blockType, setBlockType] = useState<BlockType>('text');
  const [positionType, setPositionType] = useState<'after' | 'end'>('end');
  const [error, setError] = useState<string | null>(null);

  // Reset form quando modal abre
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    if (open) {
      setBlockKey('');
      setBlockType('text');
      setPositionType('end');
      setError(null);
    }
  };

  // Validar e submeter
  const handleSubmit = async () => {
    setError(null);

    // Validar block_key
    const validation = validateBlockKey(blockKey);
    if (!validation.valid) {
      setError(validation.error || 'Identificador inválido');
      return;
    }

    // Verificar duplicidade
    if (existingBlockKeys.includes(blockKey)) {
      setError('Este identificador já existe nesta página');
      return;
    }

    // Calcular posição
    let position: number | null = null;
    if (positionType === 'after' && currentBlockIndex !== undefined) {
      position = currentBlockIndex + 2; // +2 porque display_order começa em 1 e queremos após o atual
    }

    // Chamar callback
    const success = await onAdd(blockKey, blockType, position);
    if (success) {
      handleOpenChange(false);
    }
  };

  // Sugerir nome baseado no tipo
  const getSuggestedName = (type: BlockType): string => {
    const count = existingBlockKeys.filter(k => k.startsWith(type)).length;
    return count === 0 ? type : `${type}_${count + 1}`;
  };

  // Quando tipo muda, sugerir nome
  const handleTypeChange = (type: BlockType) => {
    setBlockType(type);
    if (!blockKey || BLOCK_TYPE_OPTIONS.some(opt => opt.type === blockKey || blockKey.startsWith(opt.type))) {
      setBlockKey(getSuggestedName(type));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Bloco</DialogTitle>
          <DialogDescription>
            Escolha o tipo de bloco e defina um identificador único.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tipo de Bloco */}
          <div className="space-y-3">
            <Label>Tipo de Bloco</Label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => handleTypeChange(option.type)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border text-left transition-all',
                    blockType === option.type
                      ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-1'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-md',
                    blockType === option.type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  )}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 truncate">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Identificador (block_key) */}
          <div className="space-y-2">
            <Label htmlFor="blockKey">Identificador (block_key)</Label>
            <Input
              id="blockKey"
              value={blockKey}
              onChange={(e) => setBlockKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="ex: hero_title, section_cta"
              className={cn(error && 'border-red-500')}
            />
            <p className="text-xs text-gray-500">
              Identificador único para este bloco. Use letras minúsculas, números e underscore.
            </p>
          </div>

          {/* Posição */}
          {totalBlocks > 0 && (
            <div className="space-y-2">
              <Label>Posição</Label>
              <RadioGroup
                value={positionType}
                onValueChange={(v) => setPositionType(v as 'after' | 'end')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="end" id="pos-end" />
                  <Label htmlFor="pos-end" className="font-normal cursor-pointer">
                    No final da página (posição {totalBlocks + 1})
                  </Label>
                </div>
                {currentBlockIndex !== undefined && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after" id="pos-after" />
                    <Label htmlFor="pos-after" className="font-normal cursor-pointer">
                      Após o bloco atual (posição {currentBlockIndex + 2})
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !blockKey}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Bloco'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddBlockModal;
