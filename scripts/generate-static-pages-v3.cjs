/**
 * Script de Geração de Páginas Estáticas SEO v3
 * 
 * Este script gera páginas HTML com PARIDADE TOTAL ao React app (exceto filtros/listagem).
 * As páginas HTML são servidas para crawlers (JS off), enquanto usuários com JS são
 * redirecionados para o SPA.
 * 
 * Estrutura replicada:
 * 1. Top Bar (email, telefone, redes sociais, botão Fale Conosco)
 * 2. Header Principal (logo, navegação)
 * 3. Hero Section (título, descrição, CTA)
 * 4. Vídeo Section (YouTube thumbnail + link)
 * 5. Oportunidades Section (subtitle + disclaimer)
 * 6. Sobre a Região (texto único)
 * 7. CTA Não Encontrou (WhatsApp + opções)
 * 8. Detalhes da Região (grid de infos)
 * 9. Casos de Sucesso (cards com vídeos)
 * 10. Depoimentos (carousel estático)
 * 11. Newsletter (formulário + foto)
 * 12. Footer (3 colunas + copyright)
 */

const fs = require('fs');
const path = require('path');

// Configurações
const SEED_FILE = path.join(__dirname, '..', 'data', 'regional_pages_seo_seed.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'region-content.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'catalogo');
const BASE_URL = 'https://catalogo.cataldosiston-adv.com.br';
const NOINDEX = process.env.NOINDEX === 'true';
const ROBOTS_CONTENT = NOINDEX ? 'noindex, follow' : 'index, follow';

// CDN Images para ícones sociais (do React original)
const SOCIAL_ICONS = {
  facebook: 'https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/72d95d25980c13a7793be843a3be119eac9a23d4',
  instagram: 'https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/244b9c45e595799dda32400ab0c739ab1dcf1e36',
  youtube: 'https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/e31888807ac0e2e4d00224790a076ac9216edea3',
  logo: 'https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/bf5a59e7e68461e9ad6a56b785454e48938ce393'
};

// Vídeo principal do YouTube (usado em todas as páginas)
const MAIN_VIDEO = {
  id: 'eeJ95Dy3l3s',
  title: 'Leilões de Imóveis - Como Funciona?',
  thumbnail: 'https://i.ytimg.com/vi/eeJ95Dy3l3s/maxresdefault.jpg'
};

// Depoimento padrão (primeiro da lista)
const DEFAULT_TESTIMONIAL = {
  content: `Como cliente e parceiro de negócios do escritório Cataldo Siston há quase 10 anos tenho toda tranquilidade em referenciar seus serviços, seu trabalho impecável e histórico de sucesso em todas as aquisições, investimentos e serviços a nós prestados. Além de ser um workaholic sempre comprometido nos mínimos detalhes, nos protegendo contra riscos e cumprindo estritamente todos os prazos.`,
  author: 'Felipe Bueno',
  title: 'PRESIDENTE DA BX CAPITAL'
};

// Ler dados
let seedData = [];
let regionContentData = {};

try {
  seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8')).regions;
  console.log(`✅ Seed carregado: ${seedData.length} regiões`);
} catch (e) {
  console.error(`❌ Erro ao ler seed: ${e.message}`);
  process.exit(1);
}

try {
  regionContentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')).regions;
  console.log(`✅ Conteúdo carregado: ${Object.keys(regionContentData).length} regiões`);
} catch (e) {
  console.warn(`⚠️  Arquivo de conteúdo não encontrado, usando placeholders`);
  regionContentData = {};
}

/**
 * Gera HTML completo da página com paridade ao React
 */
function generatePageHTML(seedRegion, content) {
  const { slug, estado, regiao, metaTitle, metaDescription, keyword } = seedRegion;
  const region = regiao;
  const isRJ = estado === 'RJ';
  const isSP = estado === 'SP';
  
  // Conteúdo padrão se não existir
  const c = content || {
    heroDescription: `Encontre imóveis em leilão em ${region} com descontos de até 50% abaixo do valor de mercado. Nossa equipe especializada oferece assessoria completa, da análise jurídica à imissão na posse.`,
    aboutText: `${region} é uma das regiões mais valorizadas de ${estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo'}. Nossa equipe de advogados especializados em leilões de imóveis está pronta para ajudá-lo a encontrar excelentes oportunidades nesta região privilegiada.`,
    neighborhoods: [],
    attractions: [],
    infrastructure: [],
    highlights: [],
    propertyTypes: ['Apartamentos', 'Casas', 'Salas Comerciais'],
    priceRange: 'A consultar',
    transport: 'Consulte disponibilidade',
    relatedRegions: [],
    successCases: []
  };
  
  // H1 específico
  const h1 = `Imóveis em Leilão em ${region} - ${estado}`;
  
  // Background do hero baseado no estado
  const heroBackground = isRJ 
    ? '/visao-panoramica-rio-janeiro.jpg' 
    : '/assets/ponte-estaiada-octavio-frias-sao-paulo.jpg';
  
  // Gerar HTML das seções opcionais
  const neighborhoodsHTML = c.neighborhoods && c.neighborhoods.length > 0 
    ? `<div class="detail-card">
        <div class="detail-card__header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <h3>Bairros e Sub-regiões</h3>
        </div>
        <ul>${c.neighborhoods.map(n => `<li>${n}</li>`).join('')}</ul>
      </div>` : '';
  
  const attractionsHTML = c.attractions && c.attractions.length > 0
    ? `<div class="detail-card">
        <div class="detail-card__header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <h3>Pontos de Interesse</h3>
        </div>
        <ul>${c.attractions.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>` : '';
  
  const infrastructureHTML = c.infrastructure && c.infrastructure.length > 0
    ? `<div class="detail-card">
        <div class="detail-card__header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"/></svg>
          <h3>Infraestrutura</h3>
        </div>
        <ul>${c.infrastructure.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>` : '';
  
  const highlightsHTML = c.highlights && c.highlights.length > 0
    ? `<div class="detail-card">
        <div class="detail-card__header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <h3>Destaques</h3>
        </div>
        <ul>${c.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
      </div>` : '';
  
  // Cases de sucesso
  const casesHTML = c.successCases && c.successCases.length > 0
    ? c.successCases.slice(0, 3).map(cs => `
      <div class="case-card">
        <div class="case-card__video">
          <img src="https://i.ytimg.com/vi/${cs.videoId || 'eeJ95Dy3l3s'}/mqdefault.jpg" alt="${cs.title}">
          <a href="https://www.youtube.com/watch?v=${cs.videoId || 'eeJ95Dy3l3s'}" class="play-icon" target="_blank" rel="noopener" aria-label="Assistir vídeo"></a>
        </div>
        <div class="case-card__content">
          <h3>${cs.title}</h3>
          <p>${cs.description}</p>
          <span class="author">${cs.author || 'Cliente'}</span>
        </div>
      </div>
    `).join('') : '';
  
  // Regiões relacionadas
  const relatedHTML = (c.relatedRegions && c.relatedRegions.length > 0 
    ? c.relatedRegions 
    : getDefaultRelatedRegions(estado, slug)
  ).map(r => `<a href="${BASE_URL}/catalogo/${r.slug}">${r.name}</a>`).join('');
  
  // Stats section
  const statsHTML = (c.propertyTypes || c.priceRange || c.transport)
    ? `<div class="stats-bar">
        ${c.propertyTypes ? `<span><strong>Tipos:</strong> ${c.propertyTypes.join(', ')}</span>` : ''}
        ${c.priceRange ? `<span><strong>Faixa:</strong> ${c.priceRange}</span>` : ''}
        ${c.transport ? `<span><strong>Transporte:</strong> ${c.transport}</span>` : ''}
      </div>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${keyword}, leilão de imóveis, ${region.toLowerCase()}, ${estado}">
  <meta name="robots" content="${ROBOTS_CONTENT}">
  <link rel="canonical" href="${BASE_URL}/catalogo/${slug}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/catalogo/${slug}">
  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="${BASE_URL}${heroBackground}">
  <meta property="og:site_name" content="Cataldo Siston Advogados">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${metaTitle}">
  <meta name="twitter:description" content="${metaDescription}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/cropped-favicon-cataldo-siston-1-1-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/cropped-favicon-cataldo-siston-1-1-180x180.png">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- CSS Fallback -->
  <link rel="stylesheet" href="/assets/seo/fallback.css">
</head>
<body>
  <!-- ==============================
       1. TOP BAR
       ============================== -->
  <div class="header-topbar">
    <div class="container">
      <div class="header-topbar__contact">
        <a href="mailto:contato@cataldosiston-adv.com.br">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#d68e08"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          contato@cataldosiston-adv.com.br
        </a>
        <a href="tel:+552131733795">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#d68e08"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          +55 (21) 3173-3795
        </a>
        <a href="#contact" class="btn-fale-conosco">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          Fale Conosco
        </a>
      </div>
      <div class="header-topbar__social">
        <a href="https://www.facebook.com/cataldosistonadvogados/" target="_blank" rel="noopener" title="Facebook">
          <img src="${SOCIAL_ICONS.facebook}" alt="Facebook" width="28" height="28">
        </a>
        <a href="https://www.instagram.com/cataldosiston.advogados/" target="_blank" rel="noopener" title="Instagram">
          <img src="${SOCIAL_ICONS.instagram}" alt="Instagram" width="28" height="28">
        </a>
        <a href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg" target="_blank" rel="noopener" title="YouTube">
          <img src="${SOCIAL_ICONS.youtube}" alt="YouTube" width="28" height="28">
        </a>
      </div>
    </div>
  </div>
  
  <!-- ==============================
       2. HEADER PRINCIPAL
       ============================== -->
  <header class="header-main">
    <div class="container">
      <a href="https://leilaodeimoveis-cataldosiston.com/" class="header-main__logo">
        <img src="/logotipo_cataldo_siston.png" alt="Cataldo Siston Advogados" height="48">
      </a>
      <nav class="header-main__nav">
        <ul>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem somos</a></li>
          <li><a href="${BASE_URL}" class="active">Imóveis em Leilão</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria em leilões</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/">Direito Imobiliário</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos Reais</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/">Blog</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <!-- ==============================
       3. HERO SECTION
       ============================== -->
  <section class="hero${isSP ? ' hero--sp' : ''}" style="background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${heroBackground}');">
    <div class="hero__content">
      <h1>${h1}</h1>
      <p class="hero__intro">${c.heroDescription}</p>
      <a href="https://wa.me/5521977294848?text=Olá! Tenho interesse em imóveis em leilão em ${region}." class="btn-cta">
        Quero receber oportunidades
      </a>
    </div>
  </section>
  
  <!-- ==============================
       4. VÍDEO SECTION
       ============================== -->
  <section class="video-section">
    <div class="video-wrapper">
      <a href="https://www.youtube.com/watch?v=${MAIN_VIDEO.id}" class="video-thumbnail" target="_blank" rel="noopener" aria-label="Assistir: ${MAIN_VIDEO.title}">
        <img src="${MAIN_VIDEO.thumbnail}" alt="${MAIN_VIDEO.title}" loading="lazy">
        <span class="play-button"></span>
      </a>
    </div>
  </section>
  
  <!-- ==============================
       5. OPORTUNIDADES SECTION
       ============================== -->
  <section class="opportunities-section">
    <div class="container">
      <div class="opportunities-section__header">
        <span class="opportunities-section__dots">●●●●●</span>
        <span class="opportunities-section__subtitle">Oportunidades de Leilão</span>
        <span class="opportunities-section__dots">●●●●●</span>
      </div>
      <h2>Oportunidades em ${region}</h2>
      <p class="opportunities-section__disclaimer">
        As informações contidas neste catálogo são meramente informativas. Havendo qualquer dúvida quanto às informações disponibilizadas, consulte um advogado especializado.
        <a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Saiba mais sobre assessoria em leilões</a>
      </p>
    </div>
  </section>
  
  <!-- ==============================
       6. SOBRE A REGIÃO
       ============================== -->
  <section class="about-region">
    <h2>Sobre ${region}</h2>
    <p class="about-region__text">${c.aboutText}</p>
  </section>
  
  <!-- ==============================
       7. CTA - NÃO ENCONTROU
       ============================== -->
  <section class="cta-not-found">
    <div class="container">
      <h2>Não encontrou o imóvel ideal em ${region}?</h2>
      <p>Nossa equipe pode ajudar você a encontrar a oportunidade perfeita de leilão na região.</p>
      <div class="cta-not-found__buttons">
        <a href="https://wa.me/5521977294848?text=Olá! Procuro imóvel em leilão em ${region}." class="btn-outline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          WhatsApp
        </a>
        <a href="mailto:contato@cataldosiston-adv.com.br" class="btn-outline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          Email
        </a>
        <a href="tel:+552131733795" class="btn-outline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Telefone
        </a>
      </div>
      <div class="cta-not-found__links">
        <a href="${BASE_URL}/leilao-rj">Ver todos os imóveis RJ</a>
        <a href="${BASE_URL}/leilao-sp">Ver todos os imóveis SP</a>
      </div>
    </div>
  </section>
  
  <!-- ==============================
       8. DETALHES DA REGIÃO
       ============================== -->
  ${(neighborhoodsHTML || attractionsHTML || infrastructureHTML || highlightsHTML) ? `
  <section class="region-details">
    <div class="container">
      <h2>Conheça ${region}</h2>
      <div class="region-details__grid">
        ${neighborhoodsHTML}
        ${attractionsHTML}
        ${infrastructureHTML}
        ${highlightsHTML}
      </div>
      ${statsHTML}
    </div>
  </section>
  ` : ''}
  
  <!-- ==============================
       9. CASOS DE SUCESSO
       ============================== -->
  ${casesHTML ? `
  <section class="success-cases">
    <div class="container">
      <h2>Casos de Sucesso</h2>
      <div class="success-cases__grid">
        ${casesHTML}
      </div>
      <div class="success-cases__cta">
        <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" class="btn-cta">Ver mais casos de sucesso</a>
      </div>
    </div>
  </section>
  ` : ''}
  
  <!-- ==============================
       10. DEPOIMENTOS
       ============================== -->
  <section class="testimonials">
    <h2>Depoimentos</h2>
    <div class="testimonials__quote">"</div>
    <div class="testimonials__content">
      <blockquote>
        ${DEFAULT_TESTIMONIAL.content}
      </blockquote>
      <div class="testimonials__author">
        <strong>${DEFAULT_TESTIMONIAL.author}</strong>
        <span>${DEFAULT_TESTIMONIAL.title}</span>
      </div>
    </div>
    <div class="testimonials__dots">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </section>
  
  <!-- ==============================
       11. NEWSLETTER
       ============================== -->
  <section class="newsletter-section" id="contact">
    <div class="container">
      <div class="newsletter-form-wrapper">
        <h2>Receba nossa newsletter</h2>
        <form class="newsletter-form" action="https://api.rd.services/platform/conversions" method="POST">
          <input type="hidden" name="token_rdstation" value="de34ae318d19588a9ae8">
          <input type="hidden" name="identificador" value="newsletter-site-de34ae318d19588a9ae8">
          <input type="text" name="name" placeholder="Nome*" required>
          <input type="email" name="email" placeholder="Email*" required>
          <input type="tel" name="personal_phone" placeholder="Telefone*" required>
          <button type="submit">ENVIAR</button>
        </form>
        
        <div class="newsletter-contact">
          <h3>Podemos ajudar a solucionar o seu caso!</h3>
          <div class="newsletter-contact__buttons">
            <a href="https://wa.me/5521977294848">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WhatsApp
            </a>
            <a href="mailto:contato@cataldosiston-adv.com.br">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              Email
            </a>
            <a href="tel:+552131733795">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Telefone
            </a>
          </div>
        </div>
      </div>
      <div class="newsletter-section__photo">
        <img src="/foto-recortada-cataldo.png" alt="Advogado Cataldo" loading="lazy">
      </div>
    </div>
  </section>
  
  <!-- ==============================
       12. FOOTER
       ============================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__col">
          <img src="${SOCIAL_ICONS.logo}" alt="Cataldo Siston" height="64" style="margin-bottom: 15px;">
          <p>Leilões de imóveis e advocacia imobiliária</p>
          <address>
            <p>Av. Rio Branco, 156, Gr. 3336 a 3339</p>
            <p>Centro - Rio de Janeiro - RJ - Brasil</p>
            <p><a href="tel:+552131733795">+55 (21) 3173-3795</a></p>
            <p><strong><a href="https://wa.me/5521977294848">+55 (21) 97729-4848</a></strong></p>
          </address>
        </div>
        
        <div class="footer__col">
          <h4>Mapa do Site</h4>
          <ul>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a></li>
            <li><a href="${BASE_URL}">Imóveis em Leilão RJ</a></li>
            <li><a href="${BASE_URL}/leilao-sp">Imóveis em Leilão SP</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria em leilões</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/">Direito Imobiliário</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/distrato-imobiliario/">Distrato imobiliário</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos Reais</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/">Blog</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a></li>
            <li><a href="https://leilaodeimoveis-cataldosiston.com/privacidade/">Política de Privacidade</a></li>
          </ul>
        </div>
        
        <div class="footer__col">
          <h4>Entre em Contato</h4>
          <p>Tire suas dúvidas ou siga-nos nas redes sociais</p>
          <p><strong><a href="mailto:contato@cataldosiston-adv.com.br">contato@cataldosiston-adv.com.br</a></strong></p>
          <div class="footer__social">
            <a href="https://www.facebook.com/cataldosistonadvogados/" target="_blank" rel="noopener">
              <img src="${SOCIAL_ICONS.facebook}" alt="Facebook" width="32" height="32">
            </a>
            <a href="https://www.instagram.com/cataldosiston.advogados/" target="_blank" rel="noopener">
              <img src="${SOCIAL_ICONS.instagram}" alt="Instagram" width="32" height="32">
            </a>
            <a href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg" target="_blank" rel="noopener">
              <img src="${SOCIAL_ICONS.youtube}" alt="YouTube" width="32" height="32">
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer__bottom">
        <p>© ${new Date().getFullYear()} Cataldo Siston Advogados. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
  
  <!-- SEO: Este HTML é servido para crawlers. Usuários com JS são redirecionados para o SPA -->
  <script>
    // Redireciona usuários com JS para a versão SPA completa
    // Crawlers (sem JS) veem este HTML estático
    window.location.replace(window.location.pathname + '?app=1');
  </script>
  <noscript>
    <!-- Crawlers sem JS veem todo o conteúdo acima normalmente -->
  </noscript>
</body>
</html>`;
}

/**
 * Retorna regiões relacionadas padrão baseado no estado
 */
function getDefaultRelatedRegions(estado, currentSlug) {
  const rjRegions = [
    { slug: 'copacabana-rj', name: 'Copacabana' },
    { slug: 'ipanema-rj', name: 'Ipanema' },
    { slug: 'leblon-rj', name: 'Leblon' },
    { slug: 'barra-da-tijuca-rj', name: 'Barra da Tijuca' },
    { slug: 'botafogo-rj', name: 'Botafogo' },
    { slug: 'flamengo-rj', name: 'Flamengo' }
  ];
  
  const spRegions = [
    { slug: 'jardins-sp', name: 'Jardins' },
    { slug: 'pinheiros-sp', name: 'Pinheiros' },
    { slug: 'moema-sp', name: 'Moema' },
    { slug: 'itaim-bibi-sp', name: 'Itaim Bibi' },
    { slug: 'vila-mariana-sp', name: 'Vila Mariana' },
    { slug: 'brooklin-sp', name: 'Brooklin' }
  ];
  
  const regions = estado === 'RJ' ? rjRegions : spRegions;
  return regions.filter(r => r.slug !== currentSlug).slice(0, 5);
}

/**
 * Função principal
 */
function main() {
  console.log('\n===========================================');
  console.log('  Gerador de Páginas Estáticas SEO v3');
  console.log('  Paridade Total HTML/React');
  console.log('===========================================\n');
  
  console.log(`📋 Seed: ${SEED_FILE}`);
  console.log(`📝 Conteúdo: ${CONTENT_FILE}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🤖 Robots: ${ROBOTS_CONTENT}`);
  console.log('');
  
  // Criar diretório de saída se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Diretório criado: ${OUTPUT_DIR}`);
  }
  
  // Estatísticas
  let generated = 0;
  let withContent = 0;
  
  // Gerar páginas
  for (const region of seedData) {
    const slug = region.slug;
    const content = regionContentData[slug];
    
    // Gerar HTML
    const html = generatePageHTML(region, content);
    const filePath = path.join(OUTPUT_DIR, `${slug}.html`);
    
    fs.writeFileSync(filePath, html, 'utf-8');
    generated++;
    
    if (content) {
      withContent++;
      console.log(`✅ ${slug}.html (com conteúdo)`);
    } else {
      console.log(`📄 ${slug}.html (placeholder)`);
    }
  }
  
  console.log('\n-------------------------------------------');
  console.log(`📊 Total gerado: ${generated} páginas`);
  console.log(`📝 Com conteúdo: ${withContent}`);
  console.log(`📋 Placeholders: ${generated - withContent}`);
  console.log('-------------------------------------------\n');
  
  console.log('✅ Geração concluída com sucesso!');
  console.log('\n💡 Próximos passos:');
  console.log('   1. npm run seo:vercel-rewrites');
  console.log('   2. git add public/catalogo/*.html');
  console.log('   3. Deploy para Vercel\n');
}

// Executar
main();
