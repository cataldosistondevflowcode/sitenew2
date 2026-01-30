/**
 * Script para gerar páginas HTML estáticas para SEO (v2)
 * 
 * FONTE DE VERDADE: data/regional_pages_seo_seed.json
 * 
 * Este script:
 * 1. Lê o seed JSON gerado a partir da planilha de SERPs
 * 2. Mescla com dados de conteúdo local (regionContent.ts)
 * 3. Gera HTMLs estáticos completos para cada região
 * 
 * Execução: npm run seo:static-pages
 */

const fs = require('fs');
const path = require('path');

// Caminhos
const SEED_FILE = path.join(__dirname, '..', 'data', 'regional_pages_seo_seed.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'region-content.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'catalogo');
const BASE_URL = process.env.BASE_URL || 'https://sitenew2.vercel.app';

// Configuração de robots (pode ser sobrescrita por ENV)
const ROBOTS_CONTENT = process.env.NOINDEX === 'true' ? 'noindex, follow' : 'index, follow';

// Carregar dados de conteúdo do arquivo JSON
let regionContentData = {};
if (fs.existsSync(CONTENT_FILE)) {
  const contentJson = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
  regionContentData = contentJson.regions || {};
  console.log(`📄 Conteúdo carregado: ${Object.keys(regionContentData).length} regiões`);
}

// Fallback para dados inline (caso o arquivo não exista)
const inlineContentData = {
  'copacabana-rj': {
    heroDescription: 'Copacabana é um dos bairros mais icônicos do Rio de Janeiro, conhecido mundialmente por sua praia de 4km, calçadão em pedras portuguesas e vida cultural vibrante. Encontre oportunidades únicas de imóveis em leilão com até 50% de desconto do valor de mercado.',
    aboutText: 'Copacabana oferece uma combinação única de tradição e modernidade. O bairro conta com excelente infraestrutura de transporte (metrô, ônibus), hospitais renomados, escolas tradicionais e uma vida noturna agitada. É um dos metros quadrados mais valorizados do Rio de Janeiro, com alta liquidez para investimentos imobiliários.',
    neighborhoods: ['Leme', 'Copacabana', 'Posto 5', 'Posto 6'],
    attractions: ['Praia de Copacabana', 'Forte de Copacabana', 'Pedra do Leme', 'Beco das Garrafas'],
    infrastructure: ['Metrô Linha 1', 'Hospital Copa Star', 'Colégio Santo Inácio', 'Supermercados Zona Sul'],
    highlights: ['4km de orla', 'Calçadão histórico', 'Réveillon famoso', 'Vista para o Pão de Açúcar'],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais', 'Lojas'],
    priceRange: 'R$ 400.000 a R$ 3.000.000',
    transport: 'Cardeal Arcoverde, Siqueira Campos, Cantagalo',
    relatedRegions: ['ipanema-rj', 'leblon-rj', 'botafogo-rj', 'flamengo-rj', 'barra-da-tijuca-rj', 'zona-sul-rj'],
    successCases: [
      { title: 'Apartamento 3 quartos - Posto 5', savings: '42%', description: 'Cliente adquiriu apartamento de 95m² por R$ 580.000 (valor de mercado: R$ 1.000.000). Processo concluído em 4 meses.' },
      { title: 'Cobertura duplex - Leme', savings: '38%', description: 'Cobertura de 180m² com vista para o mar arrematada por R$ 1.200.000. Assessoria completa desde a análise até a imissão na posse.' },
      { title: 'Sala comercial - Av. Nossa Senhora de Copacabana', savings: '45%', description: 'Investidor adquiriu sala de 50m² em ponto comercial nobre por R$ 280.000. Excelente para renda de aluguel.' }
    ]
  },
  'ipanema-rj': {
    heroDescription: 'Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção, o bairro oferece as melhores lojas, restaurantes e uma das localizações mais privilegiadas do Brasil. Encontre oportunidades únicas de imóveis em leilão com até 50% de desconto.',
    aboutText: 'Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo na Rua Garcia D\'Ávila e Visconde de Pirajá, além de uma vida cultural intensa. A proximidade com a Lagoa Rodrigo de Freitas e o Leblon torna a região ainda mais atrativa para investidores e moradores exigentes.',
    neighborhoods: ['Ipanema', 'Arpoador', 'Lagoa', 'General Osório'],
    attractions: ['Praia de Ipanema', 'Pedra do Arpoador', 'Praça Nossa Senhora da Paz', 'Feira Hippie'],
    infrastructure: ['Metrô General Osório', 'Hospital São Lucas', 'Colégio Andrews', 'Shopping Leblon'],
    highlights: ['Pôr do sol no Arpoador', 'Rua Garcia D\'Ávila', 'Praça General Osório', 'Proximidade com Lagoa'],
    propertyTypes: ['Apartamentos de alto padrão', 'Coberturas', 'Casas'],
    priceRange: 'R$ 800.000 a R$ 8.000.000',
    transport: 'General Osório (Linha 1)',
    relatedRegions: ['copacabana-rj', 'leblon-rj', 'botafogo-rj', 'flamengo-rj', 'barra-da-tijuca-rj', 'zona-sul-rj'],
    successCases: [
      { title: 'Apartamento 4 quartos - Rua Visconde de Pirajá', savings: '48%', description: 'Cliente adquiriu apartamento de 150m² por R$ 1.800.000 (valor de mercado: R$ 3.500.000). Localização privilegiada próximo à praia.' },
      { title: 'Cobertura triplex - Rua Prudente de Morais', savings: '40%', description: 'Cobertura de 280m² com vista para o mar e Lagoa arrematada por R$ 4.200.000. Um dos melhores negócios da região.' },
      { title: 'Apartamento 2 quartos - General Osório', savings: '35%', description: 'Jovem casal adquiriu primeiro imóvel de 75m² por R$ 780.000. Próximo ao metrô e à Praça General Osório.' }
    ]
  }
};

// Dados padrão para regiões sem conteúdo específico
const defaultRegionContent = {
  heroDescription: 'Encontre oportunidades únicas de imóveis em leilão com até 50% de desconto do valor de mercado. Nossa equipe de advogados especializados oferece assessoria completa.',
  aboutText: 'Esta região oferece excelentes oportunidades para quem busca imóveis em leilão. Com infraestrutura completa e boa valorização, é uma ótima opção para moradia ou investimento.',
  neighborhoods: [],
  attractions: [],
  infrastructure: [],
  highlights: [],
  propertyTypes: ['Apartamentos', 'Casas', 'Salas comerciais'],
  priceRange: 'Consulte',
  transport: 'Consulte opções de transporte',
  relatedRegions: [],
  successCases: []
};

// Função para obter nome da cidade a partir do estado
function getCityFromState(estado) {
  if (estado === 'RJ') return 'Rio de Janeiro';
  if (estado === 'SP') return 'São Paulo';
  return estado;
}

// Função para gerar H1 a partir dos dados
function generateH1(region, seedData) {
  return `Imóveis em Leilão em ${region} - ${getCityFromState(seedData.estado)}`;
}

// Função para gerar o HTML completo
function generatePageHTML(seedData, contentData) {
  const slug = seedData.slug;
  const region = seedData.regiao;
  const estado = seedData.estado;
  const city = getCityFromState(estado);
  
  // Mesclar dados do seed com conteúdo local
  const content = contentData || defaultRegionContent;
  
  // Gerar H1
  const h1 = generateH1(region, seedData);
  
  // Gerar lista de regiões relacionadas
  const relatedRegionsHTML = content.relatedRegions && content.relatedRegions.length > 0
    ? content.relatedRegions.map(slug => {
        const name = slug.replace(/-rj$|-sp$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `<li><a href="${BASE_URL}/catalogo/${slug}"><span>${name}</span> - Imóveis em leilão</a></li>`;
      }).join('\n        ')
    : `<li><a href="${BASE_URL}/catalogo">Ver todas as regiões</a></li>`;
  
  // Gerar seção de casos de sucesso
  const successCasesHTML = content.successCases && content.successCases.length > 0
    ? `
  <section class="success-cases">
    <div class="container">
      <h2>Casos de Sucesso em ${region}</h2>
      <p>Veja alguns exemplos de clientes que adquiriram imóveis em leilão na região com nossa assessoria:</p>
      
      <div class="cases-list">
        ${content.successCases.map(c => `
        <div class="case-card">
          <h3>${c.title}</h3>
          <div class="savings">Economia de ${c.savings}</div>
          <p>${c.description}</p>
        </div>`).join('')}
      </div>
      
      <p style="margin-top: 25px; text-align: center;">
        <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" style="color: #d68e08; font-weight: 600;">Ver todos os casos de sucesso →</a>
      </p>
    </div>
  </section>`
    : '';
  
  // Gerar info grid (se houver dados)
  const hasInfoGrid = content.neighborhoods.length > 0 || content.attractions.length > 0;
  const infoGridHTML = hasInfoGrid ? `
      <div class="info-grid">
        ${content.neighborhoods.length > 0 ? `
        <div class="info-box">
          <h3>Bairros da Região</h3>
          <ul>
            ${content.neighborhoods.map(n => `<li>${n}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
        ${content.attractions.length > 0 ? `
        <div class="info-box">
          <h3>Atrações</h3>
          <ul>
            ${content.attractions.map(a => `<li>${a}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
        ${content.infrastructure.length > 0 ? `
        <div class="info-box">
          <h3>Infraestrutura</h3>
          <ul>
            ${content.infrastructure.map(i => `<li>${i}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
        ${content.highlights.length > 0 ? `
        <div class="info-box">
          <h3>Diferenciais</h3>
          <ul>
            ${content.highlights.map(h => `<li>${h}</li>`).join('\n            ')}
          </ul>
        </div>` : ''}
      </div>` : '';
  
  // Gerar stats (se houver dados)
  const statsHTML = content.propertyTypes.length > 0 ? `
      <div class="stats">
        <div class="stat-item"><strong>Tipos de Imóveis:</strong> ${content.propertyTypes.join(', ')}</div>
        <div class="stat-item"><strong>Faixa de Preço:</strong> ${content.priceRange}</div>
        <div class="stat-item"><strong>Metrô:</strong> ${content.transport}</div>
      </div>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seedData.metaTitle}</title>
  <meta name="description" content="${seedData.metaDescription}">
  <meta name="keywords" content="${seedData.keyword}, leilão de imóveis, ${region.toLowerCase()}">
  <meta name="robots" content="${ROBOTS_CONTENT}">
  <link rel="canonical" href="${BASE_URL}/catalogo/${slug}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/catalogo/${slug}">
  <meta property="og:title" content="${seedData.metaTitle}">
  <meta property="og:description" content="${seedData.metaDescription}">
  <meta property="og:site_name" content="Cataldo Siston Advogados">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Quicksand', Arial, sans-serif; margin: 0; padding: 0; color: #191919; line-height: 1.6; }
    a { color: inherit; }
    .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
    
    /* Header/Nav */
    header { background: #3C3C3C; color: white; padding: 0; }
    .header-top { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; max-width: 1100px; margin: 0 auto; }
    .logo { font-family: 'Playfair Display', Georgia, serif; color: #d68e08; font-size: 24px; font-weight: 700; text-decoration: none; }
    .logo span { color: white; font-weight: 400; }
    nav ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 25px; flex-wrap: wrap; }
    nav a { color: white; text-decoration: none; font-size: 14px; font-weight: 500; }
    nav a:hover { color: #d68e08; }
    .header-contact { background: #2a2a2a; padding: 8px 20px; text-align: right; font-size: 13px; }
    .header-contact a { color: #d68e08; margin-left: 20px; }
    
    /* Hero */
    .hero { background: linear-gradient(135deg, #EBE5DE 0%, #f5f0e8 100%); padding: 50px 20px; }
    .hero-content { max-width: 1100px; margin: 0 auto; }
    .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; margin: 0 0 20px; color: #191919; }
    .hero-intro { font-size: 18px; color: #444; max-width: 800px; }
    
    /* Sections */
    section { padding: 40px 20px; }
    section h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-bottom: 20px; color: #191919; }
    
    /* About Region */
    .about-region { background: #fff; }
    .about-text { font-size: 16px; line-height: 1.8; max-width: 900px; }
    
    /* Info Grid */
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px; margin-top: 30px; }
    .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .info-box h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; margin: 0 0 15px; color: #d68e08; }
    .info-box ul { padding-left: 20px; margin: 0; }
    .info-box li { margin-bottom: 8px; }
    
    /* Stats */
    .stats { display: flex; flex-wrap: wrap; gap: 30px; margin-top: 25px; padding: 20px; background: #EBE5DE; border-radius: 8px; }
    .stat-item strong { color: #d68e08; }
    
    /* CTA */
    .cta { background: #d68e08; color: white; padding: 40px 20px; text-align: center; }
    .cta h2 { color: white; margin-bottom: 15px; }
    .cta p { margin-bottom: 20px; font-size: 16px; }
    .cta-button { display: inline-block; background: white; color: #d68e08; padding: 15px 40px; text-decoration: none; font-weight: 700; border-radius: 4px; font-size: 16px; }
    .cta-button:hover { background: #f5f5f5; }
    
    /* Success Cases */
    .success-cases { background: #f5f5f5; }
    .cases-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 25px; }
    .case-card { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #d68e08; }
    .case-card h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; margin: 0 0 10px; }
    .case-card .savings { color: #d68e08; font-weight: 700; font-size: 20px; }
    .case-card p { margin: 10px 0 0; font-size: 14px; color: #666; }
    
    /* Related Links */
    .related-links { background: #fff; }
    .related-links ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
    .related-links li { margin: 0; }
    .related-links a { display: block; padding: 15px; background: #f9f9f9; color: #191919; text-decoration: none; border-radius: 4px; transition: background 0.2s; }
    .related-links a:hover { background: #EBE5DE; }
    .related-links a span { color: #d68e08; font-weight: 600; }
    
    /* Contact */
    .contact-section { background: #EBE5DE; }
    .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .contact-item { background: white; padding: 20px; border-radius: 8px; text-align: center; }
    .contact-item strong { display: block; color: #d68e08; margin-bottom: 5px; }
    .contact-item a { color: #191919; text-decoration: none; }
    
    /* Footer */
    footer { background: #191919; color: white; padding: 40px 20px; }
    .footer-content { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
    .footer-section h4 { font-family: 'Playfair Display', Georgia, serif; color: #d68e08; margin: 0 0 15px; }
    .footer-section ul { list-style: none; padding: 0; margin: 0; }
    .footer-section li { margin-bottom: 8px; }
    .footer-section a { color: #ccc; text-decoration: none; font-size: 14px; }
    .footer-section a:hover { color: #d68e08; }
    .footer-bottom { max-width: 1100px; margin: 30px auto 0; padding-top: 20px; border-top: 1px solid #333; text-align: center; font-size: 13px; color: #888; }
    
    /* Responsive */
    @media (max-width: 768px) {
      .header-top { flex-direction: column; gap: 15px; text-align: center; }
      nav ul { justify-content: center; }
      .hero h1 { font-size: 28px; }
      .stats { flex-direction: column; gap: 15px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-contact">
      <a href="tel:+552131733795">(21) 3173-3795</a>
      <a href="https://wa.me/5521977294848">WhatsApp</a>
    </div>
    <div class="header-top">
      <a href="${BASE_URL}" class="logo">Cataldo Siston <span>Advogados</span></a>
      <nav>
        <ul>
          <li><a href="${BASE_URL}">Início</a></li>
          <li><a href="${BASE_URL}/catalogo">Imóveis em Leilão</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos de Sucesso</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1>${h1}</h1>
      <p class="hero-intro">${content.heroDescription}</p>
    </div>
  </section>

  <section class="about-region">
    <div class="container">
      <h2>Sobre ${region}</h2>
      <p class="about-text">${content.aboutText}</p>
      ${infoGridHTML}
      ${statsHTML}
    </div>
  </section>

  <section class="cta">
    <h2>Quer Receber Oportunidades em ${region}?</h2>
    <p>Nossa equipe seleciona os melhores imóveis em leilão da região. Fale conosco pelo WhatsApp.</p>
    <a href="https://wa.me/5521977294848?text=Olá! Tenho interesse em imóveis em leilão em ${region}." class="cta-button">Quero receber oportunidades</a>
  </section>

  ${successCasesHTML}

  <section class="related-links">
    <div class="container">
      <h2>Outras Regiões Atendidas</h2>
      <p>Oferecemos assessoria para imóveis em leilão em diversas regiões do Rio de Janeiro e São Paulo:</p>
      <ul>
        ${relatedRegionsHTML}
      </ul>
    </div>
  </section>

  <section class="contact-section">
    <div class="container">
      <h2>Entre em Contato</h2>
      <p>Nossa equipe está pronta para ajudá-lo a encontrar o imóvel ideal em leilão.</p>
      <div class="contact-grid">
        <div class="contact-item">
          <strong>WhatsApp</strong>
          <a href="https://wa.me/5521977294848">+55 (21) 97729-4848</a>
        </div>
        <div class="contact-item">
          <strong>Telefone</strong>
          <a href="tel:+552131733795">+55 (21) 3173-3795</a>
        </div>
        <div class="contact-item">
          <strong>Email</strong>
          <a href="mailto:contato@cataldosiston-adv.com.br">contato@cataldosiston-adv.com.br</a>
        </div>
        <div class="contact-item">
          <strong>Site</strong>
          <a href="https://leilaodeimoveis-cataldosiston.com">leilaodeimoveis-cataldosiston.com</a>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h4>Cataldo Siston Advogados</h4>
        <p style="font-size: 14px; color: #ccc; margin: 0;">Especialistas em leilões de imóveis no Rio de Janeiro e São Paulo desde 2010.</p>
        <p style="font-size: 13px; color: #888; margin-top: 15px;">Av. Rio Branco, 156<br>Gr. 3336 a 3339 - Centro<br>Rio de Janeiro - RJ</p>
      </div>
      <div class="footer-section">
        <h4>Navegação</h4>
        <ul>
          <li><a href="${BASE_URL}">Início</a></li>
          <li><a href="${BASE_URL}/catalogo">Imóveis em Leilão</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a></li>
          <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Regiões RJ</h4>
        <ul>
          <li><a href="${BASE_URL}/catalogo/copacabana-rj">Copacabana</a></li>
          <li><a href="${BASE_URL}/catalogo/ipanema-rj">Ipanema</a></li>
          <li><a href="${BASE_URL}/catalogo/leblon-rj">Leblon</a></li>
          <li><a href="${BASE_URL}/catalogo/barra-da-tijuca-rj">Barra da Tijuca</a></li>
          <li><a href="${BASE_URL}/catalogo/zona-sul-rj">Zona Sul</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Regiões SP</h4>
        <ul>
          <li><a href="${BASE_URL}/catalogo/jardins-sp">Jardins</a></li>
          <li><a href="${BASE_URL}/catalogo/pinheiros-sp">Pinheiros</a></li>
          <li><a href="${BASE_URL}/catalogo/moema-sp">Moema</a></li>
          <li><a href="${BASE_URL}/catalogo/itaim-bibi-sp">Itaim Bibi</a></li>
          <li><a href="${BASE_URL}/catalogo/vila-mariana-sp">Vila Mariana</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Cataldo Siston Advogados. Todos os direitos reservados.</p>
      <p style="margin-top: 10px;">
        <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" style="color: #d68e08;">Casos de Sucesso</a> |
        <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/" style="color: #d68e08;">Contato</a>
      </p>
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

// Função principal
function main() {
  console.log('=== Gerador de Páginas Estáticas SEO (v2) ===\n');
  console.log(`📋 Fonte de verdade: ${SEED_FILE}`);
  console.log(`📁 Diretório de saída: ${OUTPUT_DIR}`);
  console.log(`🤖 Robots: ${ROBOTS_CONTENT}`);
  console.log('');
  
  // Verificar se o seed existe
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`❌ Arquivo seed não encontrado: ${SEED_FILE}`);
    console.log('\nExecute primeiro: node scripts/parse-serps-xlsx.cjs');
    process.exit(1);
  }
  
  // Ler o seed
  const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
  console.log(`📊 Regiões no seed: ${seedData.regions.length}`);
  
  // Criar diretório de saída se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Diretório criado: ${OUTPUT_DIR}`);
  }
  
  // Gerar páginas
  let generated = 0;
  let withContent = 0;
  let withoutContent = 0;
  
  for (const region of seedData.regions) {
    const slug = region.slug;
    const contentData = regionContentData[slug];
    
    // Gerar HTML
    const html = generatePageHTML(region, contentData);
    const filePath = path.join(OUTPUT_DIR, `${slug}.html`);
    
    fs.writeFileSync(filePath, html, 'utf-8');
    
    if (contentData) {
      console.log(`✅ ${slug}.html (com conteúdo completo)`);
      withContent++;
    } else {
      console.log(`⚠️  ${slug}.html (conteúdo padrão - TODO)`);
      withoutContent++;
    }
    
    generated++;
  }
  
  console.log('\n=== RESUMO ===');
  console.log(`Total gerado: ${generated} páginas`);
  console.log(`Com conteúdo completo: ${withContent}`);
  console.log(`Com conteúdo padrão (TODO): ${withoutContent}`);
  
  if (withoutContent > 0) {
    console.log('\n⚠️  Páginas com conteúdo padrão precisam de textos "Sobre a região".');
    console.log('   Adicione os dados em regionContentData no script ou em arquivo separado.');
  }
  
  console.log('\n✅ Geração concluída!');
}

main();
