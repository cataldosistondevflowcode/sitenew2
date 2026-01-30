import { test, expect } from '@playwright/test';

/**
 * Testes de SEO para páginas regionais com JavaScript desabilitado
 * 
 * Objetivo: Garantir que as páginas regionais renderizam conteúdo único
 * mesmo quando o JavaScript está desabilitado (simulando crawlers).
 * 
 * Páginas testadas:
 * - /catalogo/copacabana-rj
 * - /catalogo/ipanema-rj
 */

test.describe('SEO JS-Off: Páginas Regionais', () => {
  
  test.describe('Copacabana', () => {
    const url = '/catalogo/copacabana-rj';
    
    test('deve ter H1 único com nome da região', async ({ page }) => {
      await page.goto(url);
      
      const h1 = await page.locator('h1').first();
      await expect(h1).toContainText('Copacabana');
      await expect(h1).toContainText('Imóveis em Leilão');
    });
    
    test('deve ter meta title com Copacabana', async ({ page }) => {
      await page.goto(url);
      
      const title = await page.title();
      expect(title).toContain('Copacabana');
      expect(title).toContain('Cataldo Siston');
    });
    
    test('deve ter meta description otimizada', async ({ page }) => {
      await page.goto(url);
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('Copacabana');
      expect(metaDescription).toContain('50%');
    });
    
    test('deve ter header/nav visível com links', async ({ page }) => {
      await page.goto(url);
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Verificar links de navegação
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      expect(count).toBeGreaterThanOrEqual(4);
      
      // Verificar que links têm href
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    });
    
    test('deve ter seção "Sobre Copacabana"', async ({ page }) => {
      await page.goto(url);
      
      const aboutSection = page.locator('h2:has-text("Sobre Copacabana")');
      await expect(aboutSection).toBeVisible();
      
      // Verificar conteúdo único
      const pageContent = await page.content();
      expect(pageContent).toContain('Forte de Copacabana');
      expect(pageContent).toContain('Cardeal Arcoverde');
    });
    
    test('deve ter seção de casos de sucesso', async ({ page }) => {
      await page.goto(url);
      
      const casesSection = page.locator('h2:has-text("Casos de Sucesso")');
      await expect(casesSection).toBeVisible();
      
      // Verificar cards de casos
      const caseCards = page.locator('.case-card');
      const count = await caseCards.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });
    
    test('deve ter footer visível', async ({ page }) => {
      await page.goto(url);
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Verificar informações de contato
      const footerContent = await footer.textContent();
      expect(footerContent).toContain('Cataldo Siston');
      expect(footerContent).toContain('Rio de Janeiro');
    });
    
    test('deve ter canonical correto', async ({ page }) => {
      await page.goto(url);
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/catalogo/copacabana-rj');
      expect(canonical).not.toContain('.html');
    });
  });
  
  test.describe('Ipanema', () => {
    const url = '/catalogo/ipanema-rj';
    
    test('deve ter H1 único com nome da região', async ({ page }) => {
      await page.goto(url);
      
      const h1 = await page.locator('h1').first();
      await expect(h1).toContainText('Ipanema');
      await expect(h1).toContainText('Imóveis em Leilão');
    });
    
    test('deve ter meta title com Ipanema', async ({ page }) => {
      await page.goto(url);
      
      const title = await page.title();
      expect(title).toContain('Ipanema');
      expect(title).toContain('Cataldo Siston');
    });
    
    test('deve ter meta description otimizada', async ({ page }) => {
      await page.goto(url);
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('Ipanema');
      expect(metaDescription).toContain('50%');
    });
    
    test('deve ter header/nav visível com links', async ({ page }) => {
      await page.goto(url);
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });
    
    test('deve ter seção "Sobre Ipanema"', async ({ page }) => {
      await page.goto(url);
      
      const aboutSection = page.locator('h2:has-text("Sobre Ipanema")');
      await expect(aboutSection).toBeVisible();
      
      // Verificar conteúdo único
      const pageContent = await page.content();
      expect(pageContent).toContain('Pedra do Arpoador');
      expect(pageContent).toContain('General Osório');
    });
    
    test('deve ter seção de casos de sucesso', async ({ page }) => {
      await page.goto(url);
      
      const casesSection = page.locator('h2:has-text("Casos de Sucesso")');
      await expect(casesSection).toBeVisible();
    });
    
    test('deve ter footer visível', async ({ page }) => {
      await page.goto(url);
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });
    
    test('deve ter canonical correto', async ({ page }) => {
      await page.goto(url);
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/catalogo/ipanema-rj');
      expect(canonical).not.toContain('.html');
    });
  });
  
  test.describe('Comparação: Copacabana vs Ipanema', () => {
    
    test('H1 deve ser diferente entre as páginas', async ({ page }) => {
      // Copacabana
      await page.goto('/catalogo/copacabana-rj');
      const h1Copa = await page.locator('h1').first().textContent();
      
      // Ipanema
      await page.goto('/catalogo/ipanema-rj');
      const h1Ipan = await page.locator('h1').first().textContent();
      
      expect(h1Copa).not.toEqual(h1Ipan);
      expect(h1Copa).toContain('Copacabana');
      expect(h1Ipan).toContain('Ipanema');
    });
    
    test('Meta description deve ser diferente entre as páginas', async ({ page }) => {
      // Copacabana
      await page.goto('/catalogo/copacabana-rj');
      const descCopa = await page.locator('meta[name="description"]').getAttribute('content');
      
      // Ipanema
      await page.goto('/catalogo/ipanema-rj');
      const descIpan = await page.locator('meta[name="description"]').getAttribute('content');
      
      expect(descCopa).not.toEqual(descIpan);
    });
    
    test('Conteúdo "Sobre" deve ser diferente entre as páginas', async ({ page }) => {
      // Copacabana - deve ter "Forte de Copacabana"
      await page.goto('/catalogo/copacabana-rj');
      const contentCopa = await page.content();
      expect(contentCopa).toContain('Forte de Copacabana');
      expect(contentCopa).not.toContain('Pedra do Arpoador');
      
      // Ipanema - deve ter "Pedra do Arpoador"
      await page.goto('/catalogo/ipanema-rj');
      const contentIpan = await page.content();
      expect(contentIpan).toContain('Pedra do Arpoador');
      expect(contentIpan).not.toContain('Forte de Copacabana');
    });
    
    test('Faixa de preço deve ser diferente entre as páginas', async ({ page }) => {
      // Copacabana - R$ 400.000 a R$ 3.000.000
      await page.goto('/catalogo/copacabana-rj');
      const contentCopa = await page.content();
      expect(contentCopa).toContain('R$ 400.000');
      
      // Ipanema - R$ 800.000 a R$ 8.000.000
      await page.goto('/catalogo/ipanema-rj');
      const contentIpan = await page.content();
      expect(contentIpan).toContain('R$ 800.000');
    });
  });
});

test.describe('SEO JS-Off: Verificações de HTML Source', () => {
  
  test('Copacabana: HTML source deve conter textos regionais', async ({ page }) => {
    const response = await page.goto('/catalogo/copacabana-rj');
    const html = await response?.text();
    
    // Verificar que o HTML contém os textos (não apenas o DOM pós-hidratação)
    expect(html).toContain('Imóveis em Leilão em Copacabana');
    expect(html).toContain('Sobre Copacabana');
    expect(html).toContain('Forte de Copacabana');
    expect(html).toContain('Cardeal Arcoverde');
  });
  
  test('Ipanema: HTML source deve conter textos regionais', async ({ page }) => {
    const response = await page.goto('/catalogo/ipanema-rj');
    const html = await response?.text();
    
    expect(html).toContain('Imóveis em Leilão em Ipanema');
    expect(html).toContain('Sobre Ipanema');
    expect(html).toContain('Pedra do Arpoador');
    expect(html).toContain('General Osório');
  });
  
  test('HTML source não deve conter apenas SPA shell', async ({ page }) => {
    const response = await page.goto('/catalogo/copacabana-rj');
    const html = await response?.text();
    
    // Não deve ser apenas o index.html da SPA
    expect(html).not.toContain('<div id="root"></div>');
    
    // Deve ter conteúdo real
    expect(html).toContain('<h1>');
    expect(html).toContain('<footer>');
  });
});
