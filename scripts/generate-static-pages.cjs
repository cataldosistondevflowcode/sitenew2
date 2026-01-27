/**
 * Script para gerar páginas HTML estáticas para SEO
 * 
 * Este script gera páginas HTML completas para cada região,
 * garantindo que o Google veja conteúdo único mesmo sem JavaScript.
 * 
 * Execução: npm run seo:generate-pages
 */

const fs = require('fs');
const path = require('path');

// Dados das regiões (mesmo conteúdo de src/data/regionContent.ts)
const regionContents = {
  'copacabana-rj': {
    id: 'copacabana-rj',
    heroTitle: 'Imóveis em Leilão em Copacabana - Rio de Janeiro',
    heroDescription: 'Copacabana é um dos bairros mais icônicos do Rio de Janeiro, conhecido mundialmente por sua praia de 4km, calçadão em pedras portuguesas e vida cultural vibrante.',
    aboutTitle: 'Sobre Copacabana',
    aboutDescription: 'Copacabana oferece uma combinação única de tradição e modernidade. O bairro conta com excelente infraestrutura de transporte (metrô, ônibus), hospitais renomados, escolas tradicionais e uma vida noturna agitada.',
    neighborhoods: ['Leme', 'Copacabana', 'Posto 5', 'Posto 6'],
    attractions: ['Praia de Copacabana', 'Forte de Copacabana', 'Pedra do Leme', 'Beco das Garrafas'],
    infrastructure: ['Metrô Linha 1', 'Hospital Copa Star', 'Colégio Santo Inácio', 'Supermercados Zona Sul'],
    highlights: ['4km de orla', 'Calçadão histórico', 'Réveillon famoso', 'Vista para o Pão de Açúcar'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 400.000 a R$ 3.000.000',
    transportInfo: 'Estações de metrô: Cardeal Arcoverde, Siqueira Campos, Cantagalo.',
    metaTitle: 'Comprar Apartamento Copacabana: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Procura comprar apartamento em Copacabana? Encontre imóveis de leilão em Copacabana, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento copacabana, leilão de imóveis copacabana, leilão RJ',
    estado: 'RJ'
  },
  'ipanema-rj': {
    id: 'ipanema-rj',
    heroTitle: 'Imóveis em Leilão em Ipanema - Rio de Janeiro',
    heroDescription: 'Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção.',
    aboutTitle: 'Sobre Ipanema',
    aboutDescription: 'Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo.',
    neighborhoods: ['Ipanema', 'Arpoador', 'Lagoa'],
    attractions: ['Praia de Ipanema', 'Pedra do Arpoador', 'Praça Nossa Senhora da Paz', 'Feira Hippie'],
    infrastructure: ['Metrô General Osório', 'Hospital São Lucas', 'Colégio Andrews', 'Shopping Leblon'],
    highlights: ['Pôr do sol no Arpoador', 'Rua Garcia D\'Ávila', 'Praça General Osório'],
    relatedRegions: [
      { name: 'Copacabana', slug: 'copacabana-rj' },
      { name: 'Leblon', slug: 'leblon-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de alto padrão', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 800.000 a R$ 8.000.000',
    transportInfo: 'Estação de metrô General Osório.',
    metaTitle: 'Comprar Apartamento Ipanema: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Ipanema, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento ipanema, leilão de imóveis ipanema, leilão RJ',
    estado: 'RJ'
  },
  'leblon-rj': {
    id: 'leblon-rj',
    heroTitle: 'Imóveis em Leilão no Leblon - Rio de Janeiro',
    heroDescription: 'O Leblon é o bairro mais exclusivo do Rio de Janeiro, com o metro quadrado mais valorizado da cidade.',
    aboutTitle: 'Sobre o Leblon',
    aboutDescription: 'O Leblon combina a beleza natural da praia com uma infraestrutura completa de serviços premium.',
    neighborhoods: ['Leblon', 'Gávea', 'Jardim Botânico'],
    attractions: ['Praia do Leblon', 'Baixo Leblon', 'Mirante do Leblon', 'Shopping Leblon'],
    infrastructure: ['Metrô Antero de Quental', 'Hospital Barra D\'Or', 'Colégio Santo Agostinho'],
    highlights: ['Metro quadrado mais caro do Rio', 'Ambiente familiar', 'Baixa criminalidade'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Gávea', slug: 'zona-sul-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de luxo', 'Coberturas duplex', 'Casas'],
    averagePriceRange: 'R$ 1.500.000 a R$ 15.000.000',
    transportInfo: 'Estações de metrô Antero de Quental e Jardim de Alah.',
    metaTitle: 'Comprar Apartamento Leblon: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão no Leblon, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento leblon, leilão de imóveis leblon, leilão RJ',
    estado: 'RJ'
  },
  'barra-tijuca-rj': {
    id: 'barra-tijuca-rj',
    heroTitle: 'Imóveis em Leilão na Barra da Tijuca - Rio de Janeiro',
    heroDescription: 'A Barra da Tijuca é o bairro que mais cresce no Rio de Janeiro, com infraestrutura moderna e 18km de praia.',
    aboutTitle: 'Sobre a Barra da Tijuca',
    aboutDescription: 'A Barra da Tijuca é conhecida por seus grandes condomínios, shoppings de primeira linha e qualidade de vida.',
    neighborhoods: ['Barra da Tijuca', 'Recreio', 'Itanhangá', 'São Conrado'],
    attractions: ['Praia da Barra', 'Barra Shopping', 'Village Mall', 'Parque Olímpico'],
    infrastructure: ['BRT TransOeste', 'Hospital Barra D\'Or', 'Colégios particulares'],
    highlights: ['18km de praia', 'Condomínios fechados', 'Shoppings modernos'],
    relatedRegions: [
      { name: 'Recreio', slug: 'recreio-rj' },
      { name: 'Zona Oeste RJ', slug: 'zona-oeste-rj' }
    ],
    propertyTypes: ['Apartamentos em condomínio', 'Casas em condomínio', 'Coberturas'],
    averagePriceRange: 'R$ 350.000 a R$ 5.000.000',
    transportInfo: 'BRT TransOeste, linhas de ônibus.',
    metaTitle: 'Comprar Apartamento Barra da Tijuca: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão na Barra da Tijuca, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento barra tijuca, leilão de imóveis barra tijuca',
    estado: 'RJ'
  },
  'botafogo-rj': {
    id: 'botafogo-rj',
    heroTitle: 'Imóveis em Leilão em Botafogo - Rio de Janeiro',
    heroDescription: 'Botafogo é um bairro tradicional da Zona Sul com vista privilegiada para o Pão de Açúcar.',
    aboutTitle: 'Sobre Botafogo',
    aboutDescription: 'Botafogo oferece uma mistura única de prédios históricos e modernos, com forte comércio e vida cultural.',
    neighborhoods: ['Botafogo', 'Humaitá', 'Urca'],
    attractions: ['Praia de Botafogo', 'Bondinho do Pão de Açúcar', 'Botafogo Praia Shopping'],
    infrastructure: ['Metrô Botafogo', 'Hospital Samaritano', 'Colégio São Vicente'],
    highlights: ['Vista para Pão de Açúcar', 'Proximidade do metrô', 'Vida cultural ativa'],
    relatedRegions: [
      { name: 'Flamengo', slug: 'flamengo-rj' },
      { name: 'Copacabana', slug: 'copacabana-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais'],
    averagePriceRange: 'R$ 400.000 a R$ 3.500.000',
    transportInfo: 'Estação de metrô Botafogo.',
    metaTitle: 'Comprar Apartamento Botafogo: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Botafogo, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento botafogo, leilão de imóveis botafogo',
    estado: 'RJ'
  },
  'zona-sul-rj': {
    id: 'zona-sul-rj',
    heroTitle: 'Imóveis em Leilão na Zona Sul do Rio de Janeiro',
    heroDescription: 'A Zona Sul do Rio de Janeiro concentra os bairros mais valorizados da cidade.',
    aboutTitle: 'Sobre a Zona Sul',
    aboutDescription: 'A Zona Sul carioca é sinônimo de qualidade de vida, com praias famosas, parques e metrô.',
    neighborhoods: ['Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Flamengo', 'Laranjeiras', 'Lagoa', 'Gávea'],
    attractions: ['Praias', 'Lagoa Rodrigo de Freitas', 'Jardim Botânico', 'Cristo Redentor'],
    infrastructure: ['Metrô Linhas 1 e 2', 'Hospitais renomados', 'Escolas tradicionais'],
    highlights: ['Praias mundialmente famosas', 'Alta valorização', 'Infraestrutura completa'],
    relatedRegions: [
      { name: 'Copacabana', slug: 'copacabana-rj' },
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Leblon', slug: 'leblon-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas', 'Salas comerciais'],
    averagePriceRange: 'R$ 400.000 a R$ 15.000.000',
    transportInfo: 'Metrô Linhas 1 e 2. Diversas linhas de ônibus.',
    metaTitle: 'Imóveis em Leilão na Zona Sul do Rio de Janeiro | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Sul do Rio de Janeiro. Copacabana, Ipanema, Leblon.',
    metaKeywords: 'leilão zona sul RJ, imóveis zona sul leilão',
    estado: 'RJ'
  },
  'zona-norte-rj': {
    id: 'zona-norte-rj',
    heroTitle: 'Imóveis em Leilão na Zona Norte do Rio de Janeiro',
    heroDescription: 'A Zona Norte é a maior região do Rio de Janeiro, oferecendo excelente custo-benefício.',
    aboutTitle: 'Sobre a Zona Norte',
    aboutDescription: 'A Zona Norte oferece diversidade de bairros, desde áreas mais valorizadas como Tijuca até opções mais acessíveis.',
    neighborhoods: ['Tijuca', 'Méier', 'Vila Isabel', 'Grajaú', 'Maracanã', 'Engenho Novo'],
    attractions: ['Maracanã', 'Quinta da Boa Vista', 'Floresta da Tijuca'],
    infrastructure: ['Metrô', 'SuperVia', 'Hospitais', 'UERJ'],
    highlights: ['Ótimo custo-benefício', 'Forte comércio', 'Transporte público'],
    relatedRegions: [
      { name: 'Tijuca', slug: 'tijuca-rj' },
      { name: 'Méier', slug: 'meier-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 150.000 a R$ 1.000.000',
    transportInfo: 'Metrô, SuperVia (trens), BRT TransCarioca.',
    metaTitle: 'Imóveis em Leilão na Zona Norte do Rio de Janeiro | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Norte do Rio de Janeiro. Tijuca, Méier, Vila Isabel.',
    metaKeywords: 'leilão zona norte RJ, imóveis zona norte leilão',
    estado: 'RJ'
  },
  'jardins-sp': {
    id: 'jardins-sp',
    heroTitle: 'Imóveis em Leilão nos Jardins - São Paulo',
    heroDescription: 'Os Jardins são o endereço mais prestigiado de São Paulo, com lojas de grife e restaurantes sofisticados.',
    aboutTitle: 'Sobre os Jardins',
    aboutDescription: 'Os Jardins formam a região mais valorizada de São Paulo. Ruas arborizadas e apartamentos de luxo.',
    neighborhoods: ['Jardim Paulista', 'Jardim América', 'Jardim Europa', 'Cerqueira César'],
    attractions: ['Rua Oscar Freire', 'Avenida Paulista', 'Parque Trianon'],
    infrastructure: ['Metrô Paulista', 'Hospitais Sírio-Libanês e Albert Einstein', 'Shopping Iguatemi'],
    highlights: ['Metro quadrado mais caro de SP', 'Lojas de grife', 'Gastronomia premium'],
    relatedRegions: [
      { name: 'Pinheiros', slug: 'pinheiros-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' }
    ],
    propertyTypes: ['Apartamentos de luxo', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 800.000 a R$ 15.000.000',
    transportInfo: 'Metrô Linha 2 Verde.',
    metaTitle: 'Comprar Apartamento Jardins SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão nos Jardins, São Paulo.',
    metaKeywords: 'comprar apartamento jardins sp, leilão de imóveis jardins',
    estado: 'SP'
  },
  'moema-sp': {
    id: 'moema-sp',
    heroTitle: 'Imóveis em Leilão em Moema - São Paulo',
    heroDescription: 'Moema é um dos bairros mais desejados de São Paulo, próximo ao Parque Ibirapuera.',
    aboutTitle: 'Sobre Moema',
    aboutDescription: 'Moema oferece qualidade de vida com proximidade do Parque Ibirapuera e forte comércio.',
    neighborhoods: ['Moema', 'Moema Pássaros', 'Moema Índios'],
    attractions: ['Parque Ibirapuera', 'Shopping Ibirapuera', 'Praça Pereira Coutinho'],
    infrastructure: ['Metrô Moema', 'Hospital Alvorada', 'Escolas particulares'],
    highlights: ['Próximo ao Ibirapuera', 'Ruas arborizadas', 'Comércio forte'],
    relatedRegions: [
      { name: 'Vila Mariana', slug: 'vila-mariana-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 600.000 a R$ 5.000.000',
    transportInfo: 'Metrô Linha 5 Lilás.',
    metaTitle: 'Comprar Apartamento Moema SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Moema, São Paulo.',
    metaKeywords: 'comprar apartamento moema sp, leilão de imóveis moema',
    estado: 'SP'
  },
  'zona-sul-sp': {
    id: 'zona-sul-sp',
    heroTitle: 'Imóveis em Leilão na Zona Sul de São Paulo',
    heroDescription: 'A Zona Sul de São Paulo abriga bairros nobres como Moema, Vila Mariana e Brooklin.',
    aboutTitle: 'Sobre a Zona Sul de SP',
    aboutDescription: 'A Zona Sul concentra alguns dos bairros mais valorizados de São Paulo.',
    neighborhoods: ['Moema', 'Vila Mariana', 'Brooklin', 'Campo Belo', 'Santo Amaro'],
    attractions: ['Parque Ibirapuera', 'Estádio Morumbi', 'Shopping Morumbi'],
    infrastructure: ['Metrô', 'CPTM', 'Hospitais', 'Shoppings'],
    highlights: ['Alto padrão', 'Infraestrutura completa', 'Parques'],
    relatedRegions: [
      { name: 'Moema', slug: 'moema-sp' },
      { name: 'Vila Mariana', slug: 'vila-mariana-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas em condomínio'],
    averagePriceRange: 'R$ 300.000 a R$ 10.000.000',
    transportInfo: 'Metrô Linhas 1, 5 e 9.',
    metaTitle: 'Imóveis em Leilão na Zona Sul de São Paulo | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Sul de São Paulo. Moema, Vila Mariana, Brooklin.',
    metaKeywords: 'leilão zona sul SP, imóveis zona sul são paulo leilão',
    estado: 'SP'
  }
};

// Função para gerar HTML de uma página regional
function generatePageHTML(region) {
  const baseUrl = 'https://sitenew2.vercel.app';
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${region.metaTitle}</title>
  <meta name="description" content="${region.metaDescription}">
  <meta name="keywords" content="${region.metaKeywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${baseUrl}/catalogo/${region.id}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/catalogo/${region.id}">
  <meta property="og:title" content="${region.metaTitle}">
  <meta property="og:description" content="${region.metaDescription}">
  <meta property="og:site_name" content="Cataldo Siston Advogados">
  <meta property="og:locale" content="pt_BR">
  
  <style>
    body { font-family: 'Quicksand', Arial, sans-serif; margin: 0; padding: 0; color: #191919; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    header { background: #3C3C3C; color: white; padding: 20px; text-align: center; }
    header h1 { font-family: 'Playfair Display', Georgia, serif; color: #d68e08; margin: 0 0 10px; }
    .hero { background: #EBE5DE; padding: 30px 20px; }
    .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-bottom: 15px; }
    section { padding: 25px 20px; }
    section h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .info-box h3 { font-size: 16px; margin-bottom: 10px; }
    .info-box ul { padding-left: 20px; margin: 0; }
    .info-box li { margin-bottom: 5px; }
    .cta { background: #d68e08; color: white; padding: 25px; text-align: center; margin: 20px 0; }
    .cta a { display: inline-block; background: white; color: #d68e08; padding: 12px 30px; text-decoration: none; font-weight: bold; }
    .related-links { background: #f5f5f5; padding: 25px; }
    .related-links ul { list-style: none; padding: 0; }
    .related-links li { margin-bottom: 10px; }
    .related-links a { color: #d68e08; text-decoration: none; }
    footer { background: #191919; color: white; padding: 30px 20px; text-align: center; }
    footer a { color: #d68e08; }
  </style>
</head>
<body>
  <header>
    <h1>Cataldo Siston Advogados</h1>
    <p>Especialistas em Leilões de Imóveis no Rio de Janeiro e São Paulo</p>
  </header>

  <div class="container">
    <section class="hero">
      <h1>${region.heroTitle}</h1>
      <p>${region.heroDescription}</p>
    </section>

    <section>
      <h2>${region.aboutTitle}</h2>
      <p>${region.aboutDescription}</p>
      
      <div class="info-grid">
        <div class="info-box">
          <h3>Bairros da Região</h3>
          <ul>
            ${region.neighborhoods.map(n => `<li>${n}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Atrações</h3>
          <ul>
            ${region.attractions.map(a => `<li>${a}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Infraestrutura</h3>
          <ul>
            ${region.infrastructure.map(i => `<li>${i}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Diferenciais</h3>
          <ul>
            ${region.highlights.map(h => `<li>${h}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      
      <p style="margin-top: 20px;"><strong>Tipos de Imóveis:</strong> ${region.propertyTypes.join(', ')}</p>
      <p><strong>Faixa de Preço Médio:</strong> ${region.averagePriceRange}</p>
      <p><strong>Transporte:</strong> ${region.transportInfo}</p>
    </section>

    <div class="cta">
      <h2>Fale Conosco pelo WhatsApp</h2>
      <p>Receba oportunidades personalizadas de imóveis em leilão.</p>
      <a href="https://wa.me/5521977294848">Quero receber oportunidades</a>
    </div>

    <section class="related-links">
      <h2>Regiões Atendidas</h2>
      <p>Oferecemos assessoria para imóveis em leilão nas seguintes regiões:</p>
      <ul>
        ${region.relatedRegions.map(r => `<li><a href="${baseUrl}/catalogo/${r.slug}">Imóveis em Leilão em ${r.name}</a></li>`).join('\n        ')}
        <li><a href="${baseUrl}">Ver todos os imóveis em leilão</a></li>
      </ul>
    </section>

    <section>
      <h2>Entre em Contato</h2>
      <p><strong>WhatsApp:</strong> <a href="https://wa.me/5521977294848">+55 (21) 97729-4848</a></p>
      <p><strong>Telefone:</strong> <a href="tel:+552131733795">+55 (21) 3173-3795</a></p>
      <p><strong>Email:</strong> <a href="mailto:contato@cataldosiston-adv.com.br">contato@cataldosiston-adv.com.br</a></p>
      <p><strong>Site:</strong> <a href="https://leilaodeimoveis-cataldosiston.com">leilaodeimoveis-cataldosiston.com</a></p>
    </section>
  </div>

  <footer>
    <p>© 2025 Cataldo Siston Advogados. Todos os direitos reservados.</p>
    <p>Av. Rio Branco, 156, Gr. 3336 a 3339 - Centro - Rio de Janeiro - RJ</p>
    <nav style="margin-top: 15px;">
      <a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos de Sucesso</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a>
    </nav>
  </footer>
  
  <!-- Redirect para versão JavaScript se disponível -->
  <script>
    // Se JavaScript está habilitado, redireciona para a SPA
    if (typeof window !== 'undefined') {
      // A SPA vai lidar com a rota
    }
  </script>
</body>
</html>`;
}

// Diretório de saída
const outputDir = path.join(__dirname, '..', 'public', 'catalogo');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar páginas
console.log('🚀 Gerando páginas estáticas para SEO...\n');

let count = 0;
for (const [id, region] of Object.entries(regionContents)) {
  const html = generatePageHTML(region);
  const filePath = path.join(outputDir, `${id}.html`);
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Gerado: /catalogo/${id}.html`);
  count++;
}

console.log(`\n📝 Total: ${count} páginas geradas em /public/catalogo/`);
console.log('🎯 Estas páginas serão servidas para crawlers sem JavaScript');
