/**
 * Componente: ImportModal
 * 
 * Modal para importação em lote de itens (List ou FAQ)
 * Sprint CMS v7 — List & FAQ Enhancement
 * 
 * Features:
 * - Suporta texto (um item por linha)
 * - Suporta JSON
 * - Preview dos itens
 * - Validação de formato
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: any[]) => void;
  type: 'list' | 'faq';
}

export const ImportModal = ({
  isOpen,
  onClose,
  onImport,
  type,
}: ImportModalProps) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  if (!isOpen) return null;

  // Tentar parsear entrada
  const parseContent = (text: string) => {
    setError(null);
    setPreview([]);

    if (!text.trim()) {
      setError('Conteúdo vazio');
      return;
    }

    // Tentar JSON primeiro
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        setPreview(json);
        return;
      }
      setError('JSON deve ser um array');
      return;
    } catch (e) {
      // Não é JSON, continuar
    }

    // Parsear como texto (linhas)
    if (type === 'list') {
      const items = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (items.length === 0) {
        setError('Nenhuma linha válida');
        return;
      }

      setPreview(items);
    } else if (type === 'faq') {
      // Para FAQ, esperar JSON ou pares separados por | ou ::
      const lines = text.split('\n').filter((line) => line.trim());
      const items = lines
        .map((line) => {
          const parts = line.split('|').map((p) => p.trim());
          if (parts.length >= 2) {
            return {
              question: parts[0],
              answer: parts.slice(1).join(' | '),
            };
          }

          const parts2 = line.split('::').map((p) => p.trim());
          if (parts2.length >= 2) {
            return {
              question: parts2[0],
              answer: parts2[1],
            };
          }

          setError(`Linha inválida: "${line}"\nUse: pergunta | resposta`);
          return null;
        })
        .filter((item): item is any => item !== null);

      if (items.length === 0) {
        setError('Nenhum par pergunta|resposta válido');
        return;
      }

      setPreview(items);
    }
  };

  // Atualizar preview ao digitar
  const handleContentChange = (text: string) => {
    setContent(text);
    parseContent(text);
  };

  // Confirmar importação
  const handleImport = () => {
    if (preview.length === 0) {
      setError('Nada para importar');
      return;
    }

    onImport(preview);
    setContent('');
    setPreview([]);
    setError(null);
    onClose();
  };

  // Cancelar
  const handleClose = () => {
    setContent('');
    setPreview([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">
            {type === 'list' ? 'Importar Itens' : 'Importar Perguntas & Respostas'}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-900">
            <p className="font-medium mb-1">Formatos suportados:</p>
            {type === 'list' ? (
              <ul className="space-y-1">
                <li>• Uma linha = um item</li>
                <li>• JSON: ["item1", "item2", "item3"]</li>
              </ul>
            ) : (
              <ul className="space-y-1">
                <li>• pergunta | resposta (uma por linha)</li>
                <li>• pergunta :: resposta</li>
                <li>
                  • JSON:[{'{'}question: "...", answer: "..."{'}'}]
                </li>
              </ul>
            )}
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label>Colar conteúdo aqui</Label>
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={
                type === 'list'
                  ? 'Item 1\nItem 2\nItem 3\n\nou\n\n["Item 1", "Item 2"]'
                  : 'Pergunta 1 | Resposta 1\nPergunta 2 | Resposta 2\n\nou\n\n[{"question": "P1", "answer": "R1"}]'
              }
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-900">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-900">
                  Preview: {preview.length} item(s) para importar
                </p>
              </div>

              <div className="border rounded p-3 bg-gray-50 max-h-32 overflow-y-auto">
                <ul className="space-y-2 text-sm">
                  {preview.slice(0, 5).map((item, index) => (
                    <li key={index} className="text-gray-700 truncate">
                      {typeof item === 'string' ? (
                        <span>• {item}</span>
                      ) : (
                        <span>• {item.question}</span>
                      )}
                    </li>
                  ))}
                  {preview.length > 5 && (
                    <li className="text-gray-600 italic">
                      ... e mais {preview.length - 5}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-3 justify-end">
          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0 || !!error}
            size="sm"
          >
            Importar {preview.length} item(s)
          </Button>
        </div>
      </div>
    </div>
  );
};
