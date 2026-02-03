/**
 * Componente: RichTextBlockEditor
 * 
 * Editor de bloco de rich text com formatação
 * Sprint CMS v6 — Rich Text Avançado
 * Usa TipTap para WYSIWYG
 */

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';
import './RichTextBlockEditor.css';

interface RichTextBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
  validateContent?: (content: Record<string, any>) => string[];
}

export const RichTextBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
  validateContent,
}: RichTextBlockEditorProps) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: block.content_draft?.value || block.content_published?.value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const originalContent = block.content_draft?.value || block.content_published?.value || '';
      setIsDirty(html !== originalContent);

      // Validar conteúdo
      if (validateContent) {
        const errors = validateContent({ value: html });
        setValidationErrors(errors);
      }
    },
  });

  // Salvar draft
  const handleSaveDraft = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const success = await onSaveDraft({ value: html });
    if (success) {
      setIsDirty(false);
    }
  };

  // Publicar
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const success = await onPublish();
      if (success) {
        setIsDirty(false);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Comandos de formatação
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleHeading = (level: 1 | 2 | 3) => 
    editor?.chain().focus().toggleHeading({ level }).run();

  const setLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const isPublished = block.content_published?.value === block.content_draft?.value;
  const hasContent = editor?.getHTML() && editor.getHTML() !== '<p></p>';

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="border rounded-lg bg-gray-50 p-3 flex flex-wrap gap-2">
          <button
            onClick={toggleBold}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor?.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={toggleItalic}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor?.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px bg-gray-300" />

          <button
            onClick={() => toggleHeading(1)}
            className={`px-2 py-1 rounded hover:bg-gray-200 transition font-bold text-sm ${
              editor?.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 1"
          >
            H1
          </button>

          <button
            onClick={() => toggleHeading(2)}
            className={`px-2 py-1 rounded hover:bg-gray-200 transition font-bold text-sm ${
              editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            onClick={() => toggleHeading(3)}
            className={`px-2 py-1 rounded hover:bg-gray-200 transition font-bold text-sm ${
              editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px bg-gray-300" />

          <button
            onClick={toggleBullet}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor?.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={toggleOrderedList}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor?.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px bg-gray-300" />

          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition ${
              editor?.isActive('link') ? 'bg-gray-300' : ''
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Editor */}
        <div>
          <Label className="mb-2 block">Conteúdo (RichText)</Label>
          <div className={`border rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-primary ${
            validationErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
          }`}>
            <EditorContent 
              editor={editor}
              className="prose prose-sm max-w-none [&_*]:font-inherit"
            />
          </div>
        </div>

        {/* Erros de validação */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc ml-5 space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Status de mudanças */}
        {isDirty && validationErrors.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>Você tem mudanças não salvas</span>
          </div>
        )}

        {/* Confirmação de validação */}
        {!isDirty && validationErrors.length === 0 && hasContent && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Conteúdo validado ✓</span>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            disabled={!isDirty || isSaving || validationErrors.length > 0}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || validationErrors.length > 0}
            variant="default"
            size="sm"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>

        {/* Informações de publicação */}
        {block.content_published && (
          <div className="text-xs text-gray-500 border-t pt-3">
            <p>Última atualização: {new Date(block.updated_at).toLocaleString('pt-BR')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
