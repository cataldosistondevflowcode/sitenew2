/**
 * Componente: BlockEditorFactory
 * 
 * Factory que renderiza o editor apropriado baseado no tipo de bloco
 * Sprint CMS v1 — Multiplos tipos de bloco
 * Sprint CMS v9 — Sincronizacao com preview (onFieldFocus, onContentChange)
 * Sprint CMS v10 — Editores compostos (CardListEditor, StepListEditor)
 */

import { CmsBlock } from '@/hooks/useCmsContent';
import { TextBlockEditor } from './editors/TextBlockEditor';
import { RichTextBlockEditor } from './editors/RichTextBlockEditor';
import { ImageBlockEditor } from './editors/ImageBlockEditor';
import { CtaBlockEditor } from './editors/CtaBlockEditor';
import { ListBlockEditor } from './editors/ListBlockEditor';
import { FaqBlockEditor } from './editors/FaqBlockEditor';
import { BannerBlockEditor } from './editors/BannerBlockEditor';
import { CardListEditor } from './editors/CardListEditor';
import { StepListEditor } from './editors/StepListEditor';

interface BlockEditorFactoryProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
  /** Sprint v9: Callback quando campo recebe foco (sincronização com preview) */
  onFieldFocus?: (blockId: number, fieldKey?: string) => void;
  /** Sprint v9: Callback quando conteúdo muda (rastrear mudanças não salvas) */
  onContentChange?: (blockId: number) => void;
}

export const BlockEditorFactory = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
  onFieldFocus,
  onContentChange,
}: BlockEditorFactoryProps) => {
  // Handler para disparar foco quando editor recebe interação
  const handleEditorFocus = () => {
    onFieldFocus?.(block.id, block.block_key);
  };

  // Handler para disparar mudança de conteúdo
  const handleContentChange = () => {
    onContentChange?.(block.id);
  };

  // Wrapper com onFocus para sincronização
  const wrapWithFocusHandler = (editor: React.ReactNode) => (
    <div 
      onFocus={handleEditorFocus}
      onMouseDown={handleEditorFocus}
      className="focus-within:ring-2 focus-within:ring-yellow-300 focus-within:ring-offset-1 rounded-lg transition-all"
    >
      {editor}
    </div>
  );

  // Sprint v10: Detectar editores compostos pelo block_key
  const isCardList = block.block_key.includes('_cards') || block.block_key.includes('highlight_cards');
  const isStepList = block.block_key.includes('_steps') || block.block_key.includes('how_it_works_steps');

  // Renderizar editor apropriado baseado no tipo de bloco e block_key
  // Prioridade: editores compostos > tipo de bloco
  
  if (isCardList && block.block_type === 'list') {
    return wrapWithFocusHandler(
      <CardListEditor
        block={block}
        onSaveDraft={async (content) => {
          handleContentChange();
          return onSaveDraft(content);
        }}
        onPublish={onPublish}
        isSaving={isSaving}
        validateContent={validateContent}
      />
    );
  }

  if (isStepList && block.block_type === 'list') {
    return wrapWithFocusHandler(
      <StepListEditor
        block={block}
        onSaveDraft={async (content) => {
          handleContentChange();
          return onSaveDraft(content);
        }}
        onPublish={onPublish}
        isSaving={isSaving}
        validateContent={validateContent}
      />
    );
  }

  switch (block.block_type) {
    case 'text':
      return wrapWithFocusHandler(
        <TextBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'richtext':
      return wrapWithFocusHandler(
        <RichTextBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'image':
      return wrapWithFocusHandler(
        <ImageBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'cta':
      return wrapWithFocusHandler(
        <CtaBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'list':
      return wrapWithFocusHandler(
        <ListBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'faq':
      return wrapWithFocusHandler(
        <FaqBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    case 'banner':
      return wrapWithFocusHandler(
        <BannerBlockEditor
          block={block}
          onSaveDraft={async (content) => {
            handleContentChange();
            return onSaveDraft(content);
          }}
          onPublish={onPublish}
          isSaving={isSaving}
          validateContent={validateContent}
        />
      );

    default:
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">
            Tipo de bloco nao suportado: <code className="bg-red-100 px-1">{block.block_type}</code>
          </p>
        </div>
      );
  }
};
