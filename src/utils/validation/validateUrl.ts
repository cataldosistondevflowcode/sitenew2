/**
 * Validador de URL para CMS
 * Sprint CMS v7 — Validação robusta
 * 
 * Suporta:
 * - URLs externas: https://..., http://...
 * - URLs internas: /contato, #footer
 * - Email: mailto:email@example.com
 * - Telefone: tel:+5511999999999
 */

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
  type?: 'external' | 'internal' | 'email' | 'phone';
}

/**
 * Valida uma URL e retorna resultado com erro e sugestão (se aplicável)
 */
export function validateUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      error: 'URL não pode estar vazia',
    };
  }

  const trimmedUrl = url.trim();

  // Detectar tipo de URL
  if (trimmedUrl.startsWith('mailto:')) {
    return validateEmailUrl(trimmedUrl);
  }

  if (trimmedUrl.startsWith('tel:')) {
    return validatePhoneUrl(trimmedUrl);
  }

  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#')) {
    return validateInternalUrl(trimmedUrl);
  }

  // Assume URL externa
  return validateExternalUrl(trimmedUrl);
}

/**
 * Valida URLs externas (http://, https://)
 */
function validateExternalUrl(url: string): UrlValidationResult {
  try {
    // Tentar parsear como URL
    const urlObj = new URL(url);

    // Verificar protocolo
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Protocolo deve ser http:// ou https://',
        suggestion: `https://${url}`,
      };
    }

    // Verificar hostname
    if (!urlObj.hostname) {
      return {
        valid: false,
        error: 'URL inválida: falta o domínio',
      };
    }

    return {
      valid: true,
      type: 'external',
    };
  } catch (e) {
    // Se falhar parse, pode ser que falta protocolo
    if (!url.includes('://')) {
      return {
        valid: false,
        error: 'URL externa precisa de protocolo (http:// ou https://)',
        suggestion: `https://${url}`,
      };
    }

    return {
      valid: false,
      error: 'URL inválida',
    };
  }
}

/**
 * Valida URLs internas (/, #)
 */
function validateInternalUrl(url: string): UrlValidationResult {
  // URLs internas aceitar praticamente qualquer coisa após / ou #
  if (url === '/' || url === '#') {
    return {
      valid: true,
      type: 'internal',
    };
  }

  if (url.startsWith('/') || url.startsWith('#')) {
    return {
      valid: true,
      type: 'internal',
    };
  }

  return {
    valid: false,
    error: 'URL interna deve começar com / (página) ou # (âncora)',
  };
}

/**
 * Valida URLs de email (mailto:)
 */
function validateEmailUrl(url: string): UrlValidationResult {
  const email = url.replace('mailto:', '').trim();

  // Regex simples para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Email inválido',
      suggestion: `mailto:email@example.com`,
    };
  }

  return {
    valid: true,
    type: 'email',
  };
}

/**
 * Valida URLs de telefone (tel:)
 */
function validatePhoneUrl(url: string): UrlValidationResult {
  const phone = url.replace('tel:', '').trim();

  // Aceitar: +55 11 99999-9999, 11 99999-9999, +5511999999999, 11999999999
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}$/;

  if (!phoneRegex.test(phone)) {
    return {
      valid: false,
      error: 'Número de telefone inválido',
      suggestion: `tel:+5511999999999`,
    };
  }

  return {
    valid: true,
    type: 'phone',
  };
}

/**
 * Retorna uma sugestão de correção amigável para URL
 */
export function suggestUrlFix(url: string): string | null {
  const result = validateUrl(url);
  return result.suggestion || null;
}

/**
 * Retorna mensagem de erro amigável
 */
export function getUrlErrorMessage(url: string): string | null {
  const result = validateUrl(url);
  return result.error || null;
}
