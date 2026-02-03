/**
 * Componente: BlockEditorHeader
 * 
 * Header compartilhado para todos os editores de bloco
 * Sprint CMS v1
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlockEditorHeaderProps {
  block: CmsBlock;
  isPublished: boolean;
}

const blockTypeLabels: Record<string, string> = {
  text: 'Texto Simples',
  richtext: 'Texto Formatado',
  image: 'Imagem',
  cta: 'Chamada para Ação',
  list: 'Lista',
  faq: 'Perguntas & Respostas',
  banner: 'Banner',
};

export const BlockEditorHeader = ({ block, isPublished }: BlockEditorHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{block.block_key}</span>
        <span className={`text-sm font-semibold ${isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
          {isPublished ? '✓ Publicado' : '⚠ Rascunho'}
        </span>
      </CardTitle>
      <CardDescription>
        Tipo: <code className="bg-gray-100 px-2 py-1 rounded">{blockTypeLabels[block.block_type] || block.block_type}</code>
      </CardDescription>
    </CardHeader>
  );
};
