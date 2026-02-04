/**
 * Componente: ValidationFeedback
 * 
 * Feedback visual inteligente para validação de inputs
 * - Mostra status: erro, sucesso, aviso
 * - Sugere correção automática
 * - Animação suave
 * 
 * Sprint v8 — UX Zero Fricção
 */

import { CheckCircle2, AlertCircle, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ValidationStatus = 'error' | 'success' | 'warning' | 'info';

interface ValidationFeedbackProps {
  status: ValidationStatus;
  message: string;
  suggestion?: string;
  onApplySuggestion?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ValidationFeedback({
  status,
  message,
  suggestion,
  onApplySuggestion,
  onDismiss,
  className,
}: ValidationFeedbackProps) {
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  const iconColors = {
    error: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Lightbulb className="w-5 h-5" />,
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-all duration-200',
        colors[status],
        className
      )}
      role="alert"
    >
      {/* Ícone */}
      <div className={cn('flex-shrink-0 mt-0.5', iconColors[status])}>
        {icons[status]}
      </div>

      {/* Mensagem + Sugestão */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>

        {suggestion && (
          <div className="mt-2 space-y-2">
            <p className="text-xs opacity-75">
              💡 Sugestão: <code className="bg-white/50 px-1 rounded text-xs">{suggestion}</code>
            </p>
            {onApplySuggestion && (
              <Button
                onClick={onApplySuggestion}
                size="xs"
                variant="ghost"
                className="h-6 px-2 text-xs"
              >
                Aplicar sugestão
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Botão de fechar */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Descartar"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
