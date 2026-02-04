/**
 * Validadores específicos por tipo de bloco CMS
 * Sprint CMS v7 — Validação robusta e contextual
 */

import { validateUrl } from './validateUrl';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

/**
 * Valida conteúdo de bloco CTA
 */
export function validateCTAContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar text
  if (!content.text || typeof content.text !== 'string') {
    errors.push({
      field: 'text',
      message: 'Texto do botão é obrigatório',
      type: 'error',
    });
  } else if (content.text.trim().length === 0) {
    errors.push({
      field: 'text',
      message: 'Texto do botão não pode estar vazio',
      type: 'error',
    });
  } else if (content.text.length > 100) {
    errors.push({
      field: 'text',
      message: 'Texto do botão não pode ter mais de 100 caracteres',
      type: 'error',
    });
  }

  // Validar URL
  if (!content.url || typeof content.url !== 'string') {
    errors.push({
      field: 'url',
      message: 'URL é obrigatória',
      type: 'error',
    });
  } else {
    const urlResult = validateUrl(content.url);
    if (!urlResult.valid) {
      errors.push({
        field: 'url',
        message: urlResult.error || 'URL inválida',
        type: 'error',
      });
    }
  }

  // Validar style
  const validStyles = ['primary', 'secondary', 'warning', 'danger', 'success'];
  if (content.style && !validStyles.includes(content.style)) {
    errors.push({
      field: 'style',
      message: `Estilo inválido. Deve ser um de: ${validStyles.join(', ')}`,
      type: 'error',
    });
  }

  // Validar target (opcional)
  if (content.target && !['_self', '_blank'].includes(content.target)) {
    errors.push({
      field: 'target',
      message: 'Target deve ser _self ou _blank',
      type: 'error',
    });
  }

  return errors;
}

/**
 * Valida conteúdo de bloco List
 */
export function validateListContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar items
  if (!Array.isArray(content.items)) {
    errors.push({
      field: 'items',
      message: 'Lista de itens é obrigatória',
      type: 'error',
    });
    return errors;
  }

  if (content.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Lista deve ter no mínimo 1 item',
      type: 'error',
    });
  }

  if (content.items.length > 100) {
    errors.push({
      field: 'items',
      message: 'Lista não pode ter mais de 100 itens',
      type: 'error',
    });
  }

  // Validar cada item
  content.items.forEach((item: any, index: number) => {
    if (typeof item !== 'string') {
      errors.push({
        field: `items[${index}]`,
        message: 'Cada item deve ser um texto',
        type: 'error',
      });
      return;
    }

    if (item.trim().length === 0) {
      errors.push({
        field: `items[${index}]`,
        message: 'Item não pode estar vazio',
        type: 'error',
      });
    } else if (item.length > 500) {
      errors.push({
        field: `items[${index}]`,
        message: 'Item não pode ter mais de 500 caracteres',
        type: 'error',
      });
    }
  });

  // Validar ordered (opcional)
  if (content.ordered !== undefined && typeof content.ordered !== 'boolean') {
    errors.push({
      field: 'ordered',
      message: 'Campo "numerada" deve ser verdadeiro ou falso',
      type: 'error',
    });
  }

  // Validar style (opcional)
  const validStyles = ['default', 'checkmark', 'arrow'];
  if (content.style && !validStyles.includes(content.style)) {
    errors.push({
      field: 'style',
      message: `Estilo inválido. Deve ser um de: ${validStyles.join(', ')}`,
      type: 'error',
    });
  }

  // Aviso: duplicatas
  const uniqueItems = new Set(content.items.map((i: string) => i.toLowerCase().trim()));
  if (uniqueItems.size < content.items.length) {
    errors.push({
      field: 'items',
      message: `Detectadas ${content.items.length - uniqueItems.size} duplicata(s)`,
      type: 'warning',
    });
  }

  return errors;
}

/**
 * Valida conteúdo de bloco FAQ
 */
export function validateFAQContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar items
  if (!Array.isArray(content.items)) {
    errors.push({
      field: 'items',
      message: 'Lista de perguntas é obrigatória',
      type: 'error',
    });
    return errors;
  }

  if (content.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'FAQ deve ter no mínimo 1 pergunta',
      type: 'error',
    });
  }

  if (content.items.length > 50) {
    errors.push({
      field: 'items',
      message: 'FAQ não pode ter mais de 50 perguntas',
      type: 'error',
    });
  }

  // Validar cada item
  content.items.forEach((item: any, index: number) => {
    // Validar structure
    if (typeof item !== 'object' || !item) {
      errors.push({
        field: `items[${index}]`,
        message: 'Cada item deve ter pergunta e resposta',
        type: 'error',
      });
      return;
    }

    // Validar question
    if (!item.question || typeof item.question !== 'string') {
      errors.push({
        field: `items[${index}].question`,
        message: 'Pergunta é obrigatória',
        type: 'error',
      });
    } else if (item.question.trim().length === 0) {
      errors.push({
        field: `items[${index}].question`,
        message: 'Pergunta não pode estar vazia',
        type: 'error',
      });
    } else if (item.question.length > 200) {
      errors.push({
        field: `items[${index}].question`,
        message: 'Pergunta não pode ter mais de 200 caracteres',
        type: 'error',
      });
    }

    // Validar answer
    if (!item.answer || typeof item.answer !== 'string') {
      errors.push({
        field: `items[${index}].answer`,
        message: 'Resposta é obrigatória',
        type: 'error',
      });
    } else if (item.answer.trim().length === 0) {
      errors.push({
        field: `items[${index}].answer`,
        message: 'Resposta não pode estar vazia',
        type: 'error',
      });
    } else if (item.answer.length > 5000) {
      errors.push({
        field: `items[${index}].answer`,
        message: 'Resposta não pode ter mais de 5000 caracteres',
        type: 'error',
      });
    }
  });

  // Validar allowMultiple (opcional)
  if (content.allowMultiple !== undefined && typeof content.allowMultiple !== 'boolean') {
    errors.push({
      field: 'allowMultiple',
      message: 'Campo "múltiplas aberturas" deve ser verdadeiro ou falso',
      type: 'error',
    });
  }

  // Aviso: perguntas duplicadas
  const questions = content.items
    .map((i: any) => i.question?.toLowerCase().trim())
    .filter((q: string) => q);
  const uniqueQuestions = new Set(questions);
  if (uniqueQuestions.size < questions.length) {
    errors.push({
      field: 'items',
      message: `Detectadas ${questions.length - uniqueQuestions.size} pergunta(s) duplicada(s)`,
      type: 'warning',
    });
  }

  return errors;
}

/**
 * Valida conteúdo genérico de bloco de texto
 */
export function validateTextContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!content.value || typeof content.value !== 'string') {
    errors.push({
      field: 'value',
      message: 'Texto é obrigatório',
      type: 'error',
    });
  } else if (content.value.trim().length === 0) {
    errors.push({
      field: 'value',
      message: 'Texto não pode estar vazio',
      type: 'error',
    });
  } else if (content.value.length > 1000) {
    errors.push({
      field: 'value',
      message: 'Texto não pode ter mais de 1000 caracteres',
      type: 'error',
    });
  }

  return errors;
}

/**
 * Valida conteúdo genérico de bloco richtext
 */
export function validateRichTextContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!content.value || typeof content.value !== 'string') {
    errors.push({
      field: 'value',
      message: 'Conteúdo é obrigatório',
      type: 'error',
    });
  } else if (content.value.trim().length === 0) {
    errors.push({
      field: 'value',
      message: 'Conteúdo não pode estar vazio',
      type: 'error',
    });
  }

  return errors;
}

/**
 * Valida conteúdo genérico de bloco imagem
 */
export function validateImageContent(content: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!content.url || typeof content.url !== 'string') {
    errors.push({
      field: 'url',
      message: 'URL da imagem é obrigatória',
      type: 'error',
    });
  }

  // Alt text é recomendado mas não obrigatório
  if (!content.alt) {
    errors.push({
      field: 'alt',
      message: 'Alt text é recomendado para acessibilidade',
      type: 'warning',
    });
  }

  return errors;
}

/**
 * Dispatcher genérico para validar qualquer tipo de bloco
 */
export function validateBlockContent(
  blockType: string,
  content: Record<string, any>,
): ValidationError[] {
  switch (blockType) {
    case 'cta':
      return validateCTAContent(content);
    case 'list':
      return validateListContent(content);
    case 'faq':
      return validateFAQContent(content);
    case 'text':
      return validateTextContent(content);
    case 'richtext':
      return validateRichTextContent(content);
    case 'image':
      return validateImageContent(content);
    default:
      return [
        {
          field: 'type',
          message: `Tipo de bloco desconhecido: ${blockType}`,
          type: 'error',
        },
      ];
  }
}

/**
 * Retorna apenas erros (exclui warnings)
 */
export function getValidationErrors(errors: ValidationError[]): ValidationError[] {
  return errors.filter((e) => e.type === 'error');
}

/**
 * Retorna apenas warnings
 */
export function getValidationWarnings(errors: ValidationError[]): ValidationError[] {
  return errors.filter((e) => e.type === 'warning');
}

/**
 * Verifica se há erros
 */
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return getValidationErrors(errors).length > 0;
}
