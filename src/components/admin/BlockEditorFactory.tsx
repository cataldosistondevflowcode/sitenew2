/**
 * Componente: BlockEditorFactory
 * 
 * Factory que renderiza o editor apropriado baseado no tipo de bloco
 * Sprint CMS v1 — Múltiplos tipos de bloco
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { TextBlockEditor } from './editors/TextBlockEditor';
import { RichTextBlockEditor } from './editors/RichTextBlockEditor';
import { ImageBlockEditor } from './editors/ImageBlockEditor';
import { CtaBlockEditor } from './editors/CtaBlockEditor';
import { ListBlockEditor } from './editors/ListBlockEditor';
import { FaqBlockEditor } from './editors/FaqBlockEditor';

interface BlockEditorFactoryProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const BlockEditorFactory = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: BlockEditorFactoryProps) => {
  // Renderizar editor apropriado baseado no tipo de bloco
  switch (block.block_type) {
    case 'text':
      return (
        <TextBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    case 'richtext':
      return (
        <RichTextBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    case 'image':
      return (
        <ImageBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    case 'cta':
      return (
        <CtaBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    case 'list':
      return (
        <ListBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    case 'faq':
      return (
        <FaqBlockEditor
          block={block}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSaving={isSaving}
        />
      );

    default:
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">
            ❌ Tipo de bloco não suportado: <code className="bg-red-100 px-1">{block.block_type}</code>
          </p>
        </div>
      );
  }
};
