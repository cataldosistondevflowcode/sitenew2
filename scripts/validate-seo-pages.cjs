/**
 * Script de Validação de Páginas SEO
 * 
 * Verifica se todas as páginas estáticas estão em conformidade com o React.
 * Executa checklist de paridade para cada página.
 */

const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'regional_pages_seo_seed.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'region-content.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'catalogo');

// Textos obrigatórios que devem estar em todas as páginas (paridade com React)
const REQUIRED_TEXTS = {
  // Seção Oportunidades (igual ao React)
  opportunitiesSubtitle: 'OPORTUNIDADES DE IMÓVEIS EM LEILÃO',
  opportunitiesTitle: 'Imóveis até 50% abaixo da sua avaliação',
  opportunitiesDisclaimer: 'Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia',
  viabilityLink: 'estudo de viabilidade jurídica',
  
  // CTA Não Encontrou (igual ao React SupportCTA)
  ctaTitle: 'Não encontrou o que estava procurando?',
  ctaText: 'Entre em contato com nossa equipe especializada ou explore mais opções em nossa busca completa',
  ctaButton1: 'Fale Conosco',
  ctaButton2: 'Buscar Imóveis',
  ctaLink1: 'Página de Contato',
  ctaLink2: 'Assessoria em Leilões',
  
  // Casos de Sucesso (vídeos reais)
  case1Title: 'Leilão de imóvel | Ipanema/RJ',
  case2Title: 'Leilão de imóvel | Botafogo/RJ',
  case3Title: 'Leilão de imóvel | Fonte da Saudade/RJ',
  casesButton: 'Veja os nossos resultados',
  
  // Depoimentos
  testimonialAuthor: 'Felipe Bueno',
  testimonialTitle: 'PRESIDENTE DA BX CAPITAL',
  
  // Newsletter
  newsletterTitle: 'Receba nossa newsletter',
  newsletterHelper: 'Podemos ajudar a solucionar o seu caso!',
  
  // Footer
  footerAddress: 'Av. Rio Branco, 156, Gr. 3336 a 3339',
  footerCity: 'Centro - Rio de Janeiro - RJ - Brasil',
  footerPhone: '+55 (21) 3173-3795',
  footerWhatsApp: '+55 (21) 97729-4848',
  footerMapTitle: 'Mapa do Site',
  footerContactTitle: 'Entre em Contato',
  
  // Header
  headerEmail: 'contato@cataldosiston-adv.com.br',
  headerPhone: '+55 (21) 3173-3795',
  navQuemSomos: 'Quem somos',
  navImoveis: 'Imóveis em Leilão',
  navAssessoria: 'Assessoria em leilões',
  navDireito: 'Direito Imobiliário',
  navCasos: 'Casos Reais',
  navBlog: 'Blog',
  navContato: 'Contato'
};

// Estruturas HTML obrigatórias (classes usadas no HTML gerado)
const REQUIRED_STRUCTURES = [
  { name: 'Top Bar', selector: 'header-topbar' },
  { name: 'Header Principal', selector: 'header-main' },
  { name: 'Hero Section', selector: 'hero' },
  { name: 'Vídeo Section', selector: 'video-section' },
  { name: 'Oportunidades Section', selector: 'opportunities-section' },
  { name: 'Sobre a Região', selector: 'about-region' },
  { name: 'CTA Não Encontrou', selector: 'cta-not-found' },
  { name: 'Detalhes da Região', selector: 'region-details' },
  { name: 'Casos de Sucesso', selector: 'success-cases' },
  { name: 'Depoimentos', selector: 'testimonials' },
  { name: 'Newsletter', selector: 'newsletter' },
  { name: 'Footer', selector: 'footer' }
];

// Carregar dados
let seedData = [];
let regionContentData = {};
let errors = [];
let warnings = [];
let passed = 0;
let total = 0;

try {
  seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8')).regions;
  console.log(`✅ Seed carregado: ${seedData.length} regiões\n`);
} catch (e) {
  console.error(`❌ Erro ao ler seed: ${e.message}`);
  process.exit(1);
}

try {
  regionContentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')).regions;
  console.log(`✅ Conteúdo carregado: ${Object.keys(regionContentData).length} regiões\n`);
} catch (e) {
  console.warn(`⚠️  Arquivo de conteúdo não encontrado\n`);
}

console.log('='.repeat(60));
console.log('  VALIDAÇÃO DE PARIDADE SEO - TODAS AS PÁGINAS');
console.log('='.repeat(60));
console.log('');

// Validar cada página
for (const region of seedData) {
  const { slug, regiao, estado } = region;
  const htmlPath = path.join(OUTPUT_DIR, `${slug}.html`);
  const content = regionContentData[slug] || {};
  
  total++;
  let pageErrors = [];
  let pageWarnings = [];
  
  // Verificar se arquivo existe
  if (!fs.existsSync(htmlPath)) {
    errors.push(`❌ ${slug}: Arquivo HTML não encontrado`);
    continue;
  }
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // 1. Verificar textos obrigatórios
  for (const [key, text] of Object.entries(REQUIRED_TEXTS)) {
    if (!html.includes(text)) {
      pageErrors.push(`Texto faltando: "${text.substring(0, 50)}..."`);
    }
  }
  
  // 2. Verificar estruturas HTML
  for (const struct of REQUIRED_STRUCTURES) {
    if (!html.includes(`class="${struct.selector}`) && !html.includes(`class="${struct.selector} `)) {
      // Verificar variações
      const hasClass = html.toLowerCase().includes(struct.selector.toLowerCase());
      if (!hasClass) {
        pageErrors.push(`Estrutura faltando: ${struct.name} (.${struct.selector})`);
      }
    }
  }
  
  // 3. Verificar H1 único para a região
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (!h1Match) {
    pageErrors.push('H1 não encontrado');
  } else if (!h1Match[1].toLowerCase().includes(regiao.toLowerCase())) {
    pageWarnings.push(`H1 não menciona região: "${h1Match[1]}"`);
  }
  
  // 4. Verificar meta tags
  if (!html.includes(`<title>`)) {
    pageErrors.push('Tag <title> não encontrada');
  }
  if (!html.includes(`name="description"`)) {
    pageErrors.push('Meta description não encontrada');
  }
  if (!html.includes(`rel="canonical"`)) {
    pageErrors.push('Canonical não encontrada');
  }
  
  // 5. Verificar seção "Sobre [Região]"
  const aboutRegex = new RegExp(`Sobre\\s+${regiao}`, 'i');
  if (!aboutRegex.test(html)) {
    pageWarnings.push(`Seção "Sobre ${regiao}" não encontrada`);
  }
  
  // 6. Verificar "Conheça mais sobre [Região]"
  const knowMoreRegex = new RegExp(`Conheça\\s+mais\\s+sobre\\s+${regiao}`, 'i');
  if (!knowMoreRegex.test(html) && content.neighborhoods && content.neighborhoods.length > 0) {
    pageWarnings.push(`Seção "Conheça mais sobre ${regiao}" não encontrada`);
  }
  
  // 7. Verificar vídeos de casos de sucesso
  const videoIds = ['nXMiKXmjEOs', 'AH_sNBsqIMg', '9vziuX_9kxA'];
  for (const vid of videoIds) {
    if (!html.includes(vid)) {
      pageErrors.push(`Vídeo de caso de sucesso faltando: ${vid}`);
    }
  }
  
  // 8. Verificar bairros (se existirem no content)
  if (content.neighborhoods && content.neighborhoods.length > 0) {
    for (const bairro of content.neighborhoods) {
      if (!html.includes(bairro)) {
        pageWarnings.push(`Bairro não encontrado no HTML: ${bairro}`);
      }
    }
  }
  
  // 9. Verificar formulário newsletter
  if (!html.includes('type="email"') && !html.includes('Email*')) {
    pageErrors.push('Campo de email do formulário não encontrado');
  }
  
  // 10. Verificar links importantes
  const requiredLinks = [
    'https://wa.me/5521977294848',
    'tel:+552131733795',
    'mailto:contato@cataldosiston-adv.com.br',
    'https://leilaodeimoveis-cataldosiston.com'
  ];
  for (const link of requiredLinks) {
    if (!html.includes(link)) {
      pageErrors.push(`Link obrigatório faltando: ${link}`);
    }
  }
  
  // Resultado da página
  if (pageErrors.length === 0) {
    passed++;
    console.log(`✅ ${slug} - OK${pageWarnings.length > 0 ? ` (${pageWarnings.length} avisos)` : ''}`);
    if (pageWarnings.length > 0) {
      pageWarnings.forEach(w => warnings.push(`⚠️  ${slug}: ${w}`));
    }
  } else {
    console.log(`❌ ${slug} - ${pageErrors.length} erros, ${pageWarnings.length} avisos`);
    pageErrors.forEach(e => errors.push(`❌ ${slug}: ${e}`));
    pageWarnings.forEach(w => warnings.push(`⚠️  ${slug}: ${w}`));
  }
}

// Resumo final
console.log('');
console.log('='.repeat(60));
console.log('  RESUMO DA VALIDAÇÃO');
console.log('='.repeat(60));
console.log('');
console.log(`📊 Total de páginas: ${total}`);
console.log(`✅ Páginas OK: ${passed}`);
console.log(`❌ Páginas com erros: ${total - passed}`);
console.log(`⚠️  Total de avisos: ${warnings.length}`);
console.log('');

if (errors.length > 0) {
  console.log('--- ERROS ---');
  errors.forEach(e => console.log(e));
  console.log('');
}

if (warnings.length > 0 && process.argv.includes('--verbose')) {
  console.log('--- AVISOS ---');
  warnings.forEach(w => console.log(w));
  console.log('');
}

// Resultado final
if (errors.length === 0) {
  console.log('🎉 TODAS AS PÁGINAS ESTÃO EM CONFORMIDADE!');
  process.exit(0);
} else {
  console.log(`⚠️  ${errors.length} problemas encontrados. Corrija e execute novamente.`);
  process.exit(1);
}
