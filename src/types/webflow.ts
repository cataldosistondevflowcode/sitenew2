/**
 * Tipos TypeScript para integração com Webflow CMS
 * 
 * Estes tipos mapeiam os campos das collections do Webflow
 * para garantir type safety no frontend.
 */

/**
 * Item genérico do Webflow CMS
 */
export interface WebflowCMSItem {
  id: string;
  cmsLocaleId: string;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: Record<string, any>;
}

/**
 * Hero Content do Webflow CMS
 * 
 * Campos editáveis:
 * - hero_title: Título principal do hero
 * - hero_text: Texto descritivo do hero
 * - hero_background_image: URL da imagem de fundo
 * - hero_cta_text: Texto do botão CTA (opcional)
 */
export interface WebflowHeroContent extends WebflowCMSItem {
  fieldData: {
    hero_title?: string;
    hero_text?: string;
    hero_background_image?: string;
    hero_cta_text?: string;
    [key: string]: any;
  };
}

/**
 * Testimonial do Webflow CMS
 * 
 * Campos editáveis:
 * - author_name: Nome do autor do depoimento
 * - testimonial_text: Texto do depoimento
 * - author_image: URL da imagem do autor (opcional)
 * - author_role: Cargo/função do autor (opcional)
 * - author_company: Empresa do autor (opcional)
 */
export interface WebflowTestimonial extends WebflowCMSItem {
  fieldData: {
    author_name?: string;
    testimonial_text?: string;
    author_image?: string;
    author_role?: string;
    author_company?: string;
    [key: string]: any;
  };
}

/**
 * Resposta da Edge Function
 */
export interface WebflowCMSResponse<T = WebflowCMSItem> {
  success: boolean;
  data: T[];
  count: number;
  error?: string;
  message?: string;
}
