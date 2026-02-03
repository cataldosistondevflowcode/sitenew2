/**
 * Componente: FaqBlockEditor
 * 
 * Editor de bloco de FAQ (Perguntas & Respostas)
 * Sprint CMS v1
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CmsBlock } from '@/hooks/useCmsContent';
import { BlockEditorHeader } from './BlockEditorHeader';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBlockEditorProps {
  block: CmsBlock;
  onSaveDraft: (content: Record<string, any>) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  isSaving?: boolean;
}

export const FaqBlockEditor = ({
  block,
  onSaveDraft,
  onPublish,
  isSaving = false,
}: FaqBlockEditorProps) => {
  const [items, setItems] = useState<FaqItem[]>(block.content_draft?.items || block.content_published?.items || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const originalItems = block.content_draft?.items || block.content_published?.items || [];
    setIsDirty(JSON.stringify(items) !== JSON.stringify(originalItems));
  }, [items, block.content_draft, block.content_published]);

  const handleAddItem = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setItems([...items, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    const success = await onSaveDraft({ items });
    if (success) {
      setIsDirty(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      setIsDirty(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = JSON.stringify(block.content_published?.items) === JSON.stringify(block.content_draft?.items);

  return (
    <Card className="mb-6">
      <BlockEditorHeader block={block} isPublished={isPublished} />

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor={`question-${block.id}`}>Pergunta</Label>
            <Input
              id={`question-${block.id}`}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Digite a pergunta..."
            />
          </div>

          <div>
            <Label htmlFor={`answer-${block.id}`}>Resposta</Label>
            <Textarea
              id={`answer-${block.id}`}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Digite a resposta..."
              rows={4}
            />
          </div>

          <Button onClick={handleAddItem} size="sm" variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar FAQ
          </Button>
        </div>

        {items.length > 0 && (
          <div>
            <Label>FAQs ({items.length})</Label>
            <div className="space-y-2 border rounded p-3 bg-gray-50">
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded border">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium text-left flex-1">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition ${expandedIndex === index ? 'rotate-180' : ''}`}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>

                  {expandedIndex === index && (
                    <div className="border-t p-3 bg-gray-50">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="border rounded p-3 bg-gray-50 text-sm text-gray-600">
            Nenhuma FAQ adicionada ainda
          </div>
        )}

        {isDirty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Você tem mudanças não salvas
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            disabled={!isDirty || isSaving || items.length === 0}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving || isPublishing || items.length === 0}
            variant="default"
            size="sm"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
