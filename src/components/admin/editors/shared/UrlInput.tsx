/**
 * Componente: UrlInput
 * 
 * Input de URL com validação em tempo real e feedback visual
 * Sprint CMS v7 — CTA Enhancement
 * 
 * Features:
 * - Validação de URLs externas, internas, email, telefone
 * - Ícone de status (✓ ou ✗)
 * - Sugestão de correção automática
 * - Mensagem de erro inline
 */

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateUrl } from '@/utils/validation/validateUrl';
import { Check, X, AlertCircle } from 'lucide-react';

export interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  showSuggestion?: boolean;
}

export const UrlInput = ({
  value,
  onChange,
  onError,
  label = 'URL',
  placeholder = 'ex: https://exemplo.com ou /contato',
  id = 'url-input',
  disabled = false,
  showSuggestion = true,
}: UrlInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Validar URL quando valor muda
  useEffect(() => {
    if (!value) {
      setError(null);
      setSuggestion(null);
      if (onError) onError(null);
      return;
    }

    const result = validateUrl(value);

    if (!result.valid) {
      setError(result.error || 'URL inválida');
      setSuggestion(result.suggestion || null);
      if (onError) onError(result.error || 'URL inválida');
    } else {
      setError(null);
      setSuggestion(null);
      if (onError) onError(null);
    }
  }, [value, onError]);

  // Aplicar sugestão
  const handleApplySuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
    }
  };

  // Determinar status
  const isValid = value && !error;
  const isInvalid = value && error;
  const isEmpty = !value;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          {label}
          {/* Status icon */}
          {isValid && <Check className="w-4 h-4 text-green-600" />}
          {isInvalid && <X className="w-4 h-4 text-red-600" />}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${
            isInvalid ? 'border-red-500 focus:ring-red-500' : isValid ? 'border-green-500 focus:ring-green-500' : ''
          }`}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${id}-error` : undefined}
        />

        {/* Status icon inside input */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid && <Check className="w-5 h-5 text-green-600" />}
          {isInvalid && <X className="w-5 h-5 text-red-600" />}
        </div>
      </div>

      {/* Error message */}
      {isInvalid && (
        <div id={`${id}-error`} className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Suggestion */}
      {showSuggestion && suggestion && (
        <div className="flex items-center justify-between gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <div>
            <p className="font-medium">Sugestão:</p>
            <p className="text-yellow-700">{suggestion}</p>
          </div>
          <button
            type="button"
            onClick={handleApplySuggestion}
            className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-yellow-900 font-medium whitespace-nowrap"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Helper text */}
      {isEmpty && isFocused && (
        <p className="text-xs text-gray-500">
          Exemplos: https://exemplo.com, /contato, #footer, mailto:contato@exemplo.com, tel:+5511999999999
        </p>
      )}

      {/* Success state */}
      {isValid && (
        <p className="text-xs text-green-600">
          ✓ URL válida
        </p>
      )}
    </div>
  );
};
