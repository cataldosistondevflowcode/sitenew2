import { test, expect } from '@playwright/test';

/**
 * Testes de SEO para páginas regionais com JavaScript desabilitado
 * 
 * Objetivo: Garantir que as páginas regionais renderizam conteúdo único
 * e estrutura completa mesmo quando o JavaScript está desabilitado 
 * (simulando crawlers de busca).
 * 
 * Template v3 - Estrutura esperada:
 * 1. TopBar (email, telefone, redes sociais)
 * 2. Header Principal (logo, navegação)
 * 3. Hero Section (título, descrição, CTA)
 * 4. Vídeo Section (YouTube thumbnail)
 * 5. Oportunidades Section
 * 6. Sobre a Região
 * 7. CTA Não Encontrou
 * 8. Detalhes da Região
 * 9. Casos de Sucesso
 * 10. Depoimentos
 * 11. Newsletter
 * 12. Footer
 * 
 * Páginas testadas:
 * - /catalogo/copacabana-rj
 * - /catalogo/ipanema-rj
 * - /catalogo/pinheiros-sp (São Paulo)
 */

test.describe('SEO JS-Off: Estrutura Completa v3', () => {
  
  // ===========================================
  // COPACABANA - RJ
  // ===========================================
  test.describe('Copacabana', () => {
    const url = '/catalogo/copacabana-rj';
    
    test('1. TopBar: deve ter email, telefone e redes sociais', async ({ page }) => {
      await page.goto(url);
      
      // Verificar TopBar
      const topbar = page.locator('.header-topbar');
      await expect(topbar).toBeVisible();
      
      // Email no TopBar
      const emailLink = page.locator('.header-topbar a[href*="mailto:contato@cataldosiston"]');
      await expect(emailLink).toBeVisible();
      
      // Telefone no TopBar
      const phoneLink = page.locator('.header-topbar a[href*="tel:"]');
      await expect(phoneLink).toBeVisible();
      
      // Redes sociais no TopBar
      const facebookLink = page.locator('.header-topbar a[href*="facebook.com/cataldosiston"]');
      await expect(facebookLink).toBeVisible();
      
      const instagramLink = page.locator('.header-topbar a[href*="instagram.com/cataldosiston"]');
      await expect(instagramLink).toBeVisible();
      
      const youtubeLink = page.locator('.header-topbar a[href*="youtube.com"]');
      await expect(youtubeLink).toBeVisible();
    });
    
    test('2. Header: deve ter logo e navegação com 7 itens', async ({ page }) => {
      await page.goto(url);
      
      // Logo
      const logo = page.locator('.header-main__logo img');
      await expect(logo).toBeVisible();
      
      // Navegação
      const navLinks = page.locator('.header-main__nav a');
      const count = await navLinks.count();
      expect(count).toBeGreaterThanOrEqual(7);
      
      // Verificar links específicos
      const pageContent = await page.content();
      expect(pageContent).toContain('Quem somos');
      expect(pageContent).toContain('Imóveis em Leilão');
      expect(pageContent).toContain('Assessoria em leilões');
      expect(pageContent).toContain('Casos Reais');
    });
    
    test('3. Hero: deve ter H1 único, descrição e CTA', async ({ page }) => {
      await page.goto(url);
      
      // H1
      const h1 = await page.locator('h1').first();
      await expect(h1).toContainText('Copacabana');
      await expect(h1).toContainText('Imóveis em Leilão');
      
      // Descrição introdutória
      const heroIntro = page.locator('.hero__intro');
      await expect(heroIntro).toBeVisible();
      const introText = await heroIntro.textContent();
      expect(introText).toContain('Copacabana');
      
      // CTA Button
      const ctaButton = page.locator('.hero .btn-cta');
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toContainText('oportunidades');
    });
    
    test('4. Vídeo: deve ter thumbnail do YouTube', async ({ page }) => {
      await page.goto(url);
      
      // Video thumbnail
      const videoSection = page.locator('.video-section');
      await expect(videoSection).toBeVisible();
      
      const videoThumbnail = page.locator('.video-thumbnail img');
      await expect(videoThumbnail).toBeVisible();
      
      // Link para YouTube
      const videoLink = page.locator('.video-thumbnail');
      const href = await videoLink.getAttribute('href');
      expect(href).toContain('youtube.com/watch');
    });
    
    test('5. Oportunidades: deve ter título e disclaimer', async ({ page }) => {
      await page.goto(url);
      
      const opportunitiesSection = page.locator('.opportunities-section');
      await expect(opportunitiesSection).toBeVisible();
      
      // H2 com nome da região
      const h2 = page.locator('.opportunities-section h2');
      await expect(h2).toContainText('Oportunidades em Copacabana');
      
      // Disclaimer
      const disclaimer = page.locator('.opportunities-section__disclaimer');
      await expect(disclaimer).toBeVisible();
    });
    
    test('6. Sobre a Região: deve ter texto único', async ({ page }) => {
      await page.goto(url);
      
      const aboutSection = page.locator('.about-region');
      await expect(aboutSection).toBeVisible();
      
      // H2
      const h2 = page.locator('.about-region h2');
      await expect(h2).toContainText('Sobre Copacabana');
      
      // Texto único
      const pageContent = await page.content();
      expect(pageContent).toContain('Copacabana');
    });
    
    test('7. CTA Não Encontrou: deve ter botões de contato', async ({ page }) => {
      await page.goto(url);
      
      const ctaSection = page.locator('.cta-not-found');
      await expect(ctaSection).toBeVisible();
      
      // WhatsApp
      const whatsappBtn = page.locator('.cta-not-found a[href*="wa.me"]');
      await expect(whatsappBtn).toBeVisible();
      
      // Email
      const emailBtn = page.locator('.cta-not-found a[href*="mailto:"]');
      await expect(emailBtn).toBeVisible();
      
      // Telefone
      const phoneBtn = page.locator('.cta-not-found a[href*="tel:"]');
      await expect(phoneBtn).toBeVisible();
    });
    
    test('8. Detalhes da Região: deve ter cards de informação', async ({ page }) => {
      await page.goto(url);
      
      // Verificar se existe a seção (pode não existir se não há dados)
      const detailsSection = page.locator('.region-details');
      const hasDetails = await detailsSection.count() > 0;
      
      if (hasDetails) {
        await expect(detailsSection).toBeVisible();
        
        // Verificar cards
        const detailCards = page.locator('.detail-card');
        const count = await detailCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
      }
    });
    
    test('9. Casos de Sucesso: deve ter cards com vídeos', async ({ page }) => {
      await page.goto(url);
      
      // A seção pode não existir se não há casos
      const casesSection = page.locator('.success-cases');
      const hasCases = await casesSection.count() > 0;
      
      if (hasCases) {
        await expect(casesSection).toBeVisible();
        
        // H2
        const h2 = page.locator('.success-cases h2');
        await expect(h2).toContainText('Casos de Sucesso');
        
        // Cards com thumbnails
        const caseCards = page.locator('.case-card');
        const count = await caseCards.count();
        expect(count).toBeGreaterThanOrEqual(1);
      }
    });
    
    test('10. Depoimentos: deve ter quote e autor', async ({ page }) => {
      await page.goto(url);
      
      const testimonialsSection = page.locator('.testimonials');
      await expect(testimonialsSection).toBeVisible();
      
      // H2
      const h2 = page.locator('.testimonials h2');
      await expect(h2).toContainText('Depoimentos');
      
      // Quote
      const blockquote = page.locator('.testimonials blockquote');
      await expect(blockquote).toBeVisible();
      
      // Autor
      const author = page.locator('.testimonials__author');
      await expect(author).toBeVisible();
    });
    
    test('11. Newsletter: deve ter formulário e foto', async ({ page }) => {
      await page.goto(url);
      
      const newsletterSection = page.locator('.newsletter-section');
      await expect(newsletterSection).toBeVisible();
      
      // H2
      const h2 = page.locator('.newsletter-section h2');
      await expect(h2).toContainText('newsletter');
      
      // Formulário
      const form = page.locator('.newsletter-form');
      await expect(form).toBeVisible();
      
      // Inputs
      const nameInput = page.locator('.newsletter-form input[name="name"]');
      await expect(nameInput).toBeVisible();
      
      const emailInput = page.locator('.newsletter-form input[name="email"]');
      await expect(emailInput).toBeVisible();
      
      const phoneInput = page.locator('.newsletter-form input[name="personal_phone"]');
      await expect(phoneInput).toBeVisible();
      
      // Botão
      const submitBtn = page.locator('.newsletter-form button[type="submit"]');
      await expect(submitBtn).toBeVisible();
      
      // Foto do advogado
      const photo = page.locator('.newsletter-section__photo img');
      await expect(photo).toBeVisible();
    });
    
    test('12. Footer: deve ter 3 colunas e copyright', async ({ page }) => {
      await page.goto(url);
      
      const footer = page.locator('footer.footer');
      await expect(footer).toBeVisible();
      
      // Logo/endereço
      const footerContent = await footer.textContent();
      expect(footerContent).toContain('Cataldo Siston');
      expect(footerContent).toContain('Rio de Janeiro');
      expect(footerContent).toContain('Av. Rio Branco');
      
      // Mapa do site
      expect(footerContent).toContain('Mapa do Site');
      
      // Contato
      expect(footerContent).toContain('Entre em Contato');
      
      // Copyright
      expect(footerContent).toContain('Todos os direitos reservados');
      
      // Redes sociais no footer
      const footerSocial = page.locator('.footer__social a');
      const socialCount = await footerSocial.count();
      expect(socialCount).toBeGreaterThanOrEqual(3);
    });
    
    test('Meta tags SEO devem estar corretas', async ({ page }) => {
      await page.goto(url);
      
      // Title
      const title = await page.title();
      expect(title).toContain('Copacabana');
      expect(title).toContain('Cataldo Siston');
      
      // Meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('Copacabana');
      expect(metaDescription!.length).toBeGreaterThan(50);
      
      // Canonical
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/catalogo/copacabana-rj');
      expect(canonical).not.toContain('.html');
      
      // Robots
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('index');
      
      // Open Graph
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toContain('Copacabana');
      
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toBeTruthy();
    });
  });
  
  // ===========================================
  // IPANEMA - RJ
  // ===========================================
  test.describe('Ipanema', () => {
    const url = '/catalogo/ipanema-rj';
    
    test('deve ter estrutura completa com conteúdo único', async ({ page }) => {
      await page.goto(url);
      
      // H1 único
      const h1 = await page.locator('h1').first();
      await expect(h1).toContainText('Ipanema');
      await expect(h1).toContainText('Imóveis em Leilão');
      
      // Sobre Ipanema
      const aboutH2 = page.locator('.about-region h2');
      await expect(aboutH2).toContainText('Sobre Ipanema');
      
      // Meta tags
      const title = await page.title();
      expect(title).toContain('Ipanema');
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/catalogo/ipanema-rj');
    });
    
    test('deve ter todas as seções visíveis', async ({ page }) => {
      await page.goto(url);
      
      // TopBar
      await expect(page.locator('.header-topbar')).toBeVisible();
      
      // Header
      await expect(page.locator('.header-main')).toBeVisible();
      
      // Hero
      await expect(page.locator('.hero')).toBeVisible();
      
      // Video
      await expect(page.locator('.video-section')).toBeVisible();
      
      // Oportunidades
      await expect(page.locator('.opportunities-section')).toBeVisible();
      
      // Sobre
      await expect(page.locator('.about-region')).toBeVisible();
      
      // CTA
      await expect(page.locator('.cta-not-found')).toBeVisible();
      
      // Depoimentos
      await expect(page.locator('.testimonials')).toBeVisible();
      
      // Newsletter
      await expect(page.locator('.newsletter-section')).toBeVisible();
      
      // Footer
      await expect(page.locator('footer.footer')).toBeVisible();
    });
  });
  
  // ===========================================
  // PINHEIROS - SP (Testar estado diferente)
  // ===========================================
  test.describe('Pinheiros SP', () => {
    const url = '/catalogo/pinheiros-sp';
    
    test('deve ter conteúdo único de São Paulo', async ({ page }) => {
      await page.goto(url);
      
      // H1 único
      const h1 = await page.locator('h1').first();
      await expect(h1).toContainText('Pinheiros');
      await expect(h1).toContainText('SP');
      
      // Meta tags
      const title = await page.title();
      expect(title).toContain('Pinheiros');
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/catalogo/pinheiros-sp');
    });
    
    test('deve ter todas as seções padrão', async ({ page }) => {
      await page.goto(url);
      
      await expect(page.locator('.header-topbar')).toBeVisible();
      await expect(page.locator('.header-main')).toBeVisible();
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.about-region')).toBeVisible();
      await expect(page.locator('.testimonials')).toBeVisible();
      await expect(page.locator('.newsletter-section')).toBeVisible();
      await expect(page.locator('footer.footer')).toBeVisible();
    });
  });
  
  // ===========================================
  // COMPARAÇÕES
  // ===========================================
  test.describe('Comparação: Copacabana vs Ipanema vs Pinheiros', () => {
    
    test('H1 deve ser diferente entre as páginas', async ({ page }) => {
      // Copacabana
      await page.goto('/catalogo/copacabana-rj');
      const h1Copa = await page.locator('h1').first().textContent();
      
      // Ipanema
      await page.goto('/catalogo/ipanema-rj');
      const h1Ipan = await page.locator('h1').first().textContent();
      
      // Pinheiros
      await page.goto('/catalogo/pinheiros-sp');
      const h1Pinh = await page.locator('h1').first().textContent();
      
      expect(h1Copa).not.toEqual(h1Ipan);
      expect(h1Copa).not.toEqual(h1Pinh);
      expect(h1Ipan).not.toEqual(h1Pinh);
      
      expect(h1Copa).toContain('Copacabana');
      expect(h1Ipan).toContain('Ipanema');
      expect(h1Pinh).toContain('Pinheiros');
    });
    
    test('Meta description deve ser diferente entre as páginas', async ({ page }) => {
      await page.goto('/catalogo/copacabana-rj');
      const descCopa = await page.locator('meta[name="description"]').getAttribute('content');
      
      await page.goto('/catalogo/ipanema-rj');
      const descIpan = await page.locator('meta[name="description"]').getAttribute('content');
      
      await page.goto('/catalogo/pinheiros-sp');
      const descPinh = await page.locator('meta[name="description"]').getAttribute('content');
      
      expect(descCopa).not.toEqual(descIpan);
      expect(descCopa).not.toEqual(descPinh);
    });
    
    test('Canonical deve ser único por página', async ({ page }) => {
      await page.goto('/catalogo/copacabana-rj');
      const canCopa = await page.locator('link[rel="canonical"]').getAttribute('href');
      
      await page.goto('/catalogo/ipanema-rj');
      const canIpan = await page.locator('link[rel="canonical"]').getAttribute('href');
      
      expect(canCopa).toContain('copacabana-rj');
      expect(canIpan).toContain('ipanema-rj');
      expect(canCopa).not.toEqual(canIpan);
    });
  });
  
  // ===========================================
  // VERIFICAÇÃO DE HTML SOURCE
  // ===========================================
  test.describe('HTML Source (Crawlers)', () => {
    
    test('HTML source deve conter textos regionais (Copacabana)', async ({ page }) => {
      const response = await page.goto('/catalogo/copacabana-rj');
      const html = await response?.text();
      
      // Verificar que o HTML contém os textos (não apenas DOM pós-hidratação)
      expect(html).toContain('Imóveis em Leilão em Copacabana');
      expect(html).toContain('Sobre Copacabana');
      expect(html).toContain('Depoimentos');
      expect(html).toContain('newsletter');
      expect(html).toContain('footer');
    });
    
    test('HTML source deve conter textos regionais (Ipanema)', async ({ page }) => {
      const response = await page.goto('/catalogo/ipanema-rj');
      const html = await response?.text();
      
      expect(html).toContain('Imóveis em Leilão em Ipanema');
      expect(html).toContain('Sobre Ipanema');
    });
    
    test('HTML source NÃO deve ser apenas SPA shell', async ({ page }) => {
      const response = await page.goto('/catalogo/copacabana-rj');
      const html = await response?.text();
      
      // Não deve ser apenas o index.html da SPA
      expect(html).not.toContain('<div id="root"></div>');
      
      // Deve ter conteúdo real
      expect(html).toContain('<h1>');
      expect(html).toContain('<footer');
      expect(html).toContain('class="header-topbar"');
      expect(html).toContain('class="hero"');
    });
    
    test('HTML source deve ter CSS carregado', async ({ page }) => {
      const response = await page.goto('/catalogo/copacabana-rj');
      const html = await response?.text();
      
      // Deve referenciar o CSS de fallback
      expect(html).toContain('fallback.css');
    });
    
    test('HTML source deve ter formulário de newsletter funcional', async ({ page }) => {
      const response = await page.goto('/catalogo/copacabana-rj');
      const html = await response?.text();
      
      // Formulário com action
      expect(html).toContain('action="https://api.rd.services/platform/conversions"');
      expect(html).toContain('name="name"');
      expect(html).toContain('name="email"');
      expect(html).toContain('name="personal_phone"');
    });
  });
});
