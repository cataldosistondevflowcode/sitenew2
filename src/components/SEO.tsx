import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
  structuredData?: object;
  robots?: string; // Permite sobrescrever robots (padrão: controlado por variável de ambiente)
}

// Verifica se está em modo migração (noindex, follow)
// Durante migração: VITE_SEO_MIGRATION_MODE=true
// Em produção: VITE_SEO_MIGRATION_MODE=false ou não definido
const isMigrationMode = import.meta.env.VITE_SEO_MIGRATION_MODE === 'true';

export const SEO = ({
  title = 'Imóveis em Leilão RJ | Cataldo Siston - Leilões Judiciais e Extrajudiciais',
  description = 'Encontre os melhores imóveis em leilão no Rio de Janeiro e São Paulo. Leilão Caixa, leilões judiciais e extrajudiciais. Cataldo Siston Advogados - Especialistas em Advocacia Imobiliária com mais de 20 anos de experiência.',
  keywords = 'leilão de imóveis, leilão caixa, imóveis em leilão RJ, leilão RJ, leilão SP, leilão judicial, leilão extrajudicial, advocacia imobiliária, Cataldo Siston, arrematação de imóveis',
  image = 'https://imoveis.leilaodeimoveis-cataldosiston.com/assets/banner-site-cataldo-2023.jpg',
  type = 'website',
  canonicalUrl,
  structuredData,
  robots // Permite sobrescrever (útil para páginas específicas)
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = 'https://imoveis.leilaodeimoveis-cataldosiston.com';
  
  // Para páginas com filtros, usar apenas a URL base (sem query params) na canônica
  // Isso evita canônicas inconsistentes conforme RF-01
  const cleanPath = location.pathname;
  const finalCanonicalUrl = canonicalUrl || `${baseUrl}${cleanPath}`;
  const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Robots: usar prop se fornecida, senão usar modo migração, senão index, follow
  const robotsContent = robots || (isMigrationMode ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const selectorParts = selector.match(/\[(.+?)=["'](.+?)["']\]/);
        if (selectorParts) {
          element.setAttribute(selectorParts[1], selectorParts[2]);
          element.setAttribute(attribute, content);
          document.head.appendChild(element);
        }
      }
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Update robots meta tag (CRÍTICO para migração)
    updateMetaTag('meta[name="robots"]', robotsContent);

    // Update canonical URL - garantir apenas 1 canônica (RF-01)
    // Remove canônicas duplicadas antes de adicionar
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach((canonical, index) => {
      if (index > 0) {
        canonical.remove(); // Remove duplicatas
      }
    });
    
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = finalCanonicalUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = finalCanonicalUrl;
      document.head.appendChild(canonical);
    }

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', absoluteImage);
    updateMetaTag('meta[property="og:url"]', finalCanonicalUrl);
    updateMetaTag('meta[property="og:type"]', type);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', absoluteImage);
    updateMetaTag('meta[name="twitter:url"]', finalCanonicalUrl);

    // Add structured data if provided
    if (structuredData) {
      const scriptId = 'structured-data-dynamic';
      let script = document.getElementById(scriptId);
      
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      } else {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
  }, [title, description, keywords, image, type, finalCanonicalUrl, absoluteImage, structuredData, robotsContent]);

  return null;
};
