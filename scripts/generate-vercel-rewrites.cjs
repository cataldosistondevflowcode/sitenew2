/**
 * Script para gerar vercel.json com rewrites baseados no seed SEO
 * 
 * Uso: node scripts/generate-vercel-rewrites.cjs
 */

const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'regional_pages_seo_seed.json');
const VERCEL_FILE = path.join(__dirname, '..', 'vercel.json');

function main() {
  console.log('=== Gerador de Vercel Rewrites ===\n');
  
  // Ler seed
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`❌ Seed não encontrado: ${SEED_FILE}`);
    process.exit(1);
  }
  
  const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
  console.log(`📊 Regiões no seed: ${seedData.regions.length}`);
  
  // Gerar rewrites
  const rewrites = [];
  
  // Para cada região: URL com ?app=1 vai para SPA, URL limpa vai para HTML estático
  for (const region of seedData.regions) {
    // URL com parâmetro app=1 -> SPA React
    rewrites.push({
      source: `/catalogo/${region.slug}`,
      has: [{ type: 'query', key: 'app', value: '1' }],
      destination: '/index.html'
    });
    
    // URL limpa (sem parâmetros) -> HTML estático para SEO
    rewrites.push({
      source: `/catalogo/${region.slug}`,
      destination: `/catalogo/${region.slug}.html`
    });
  }
  
  // Fallback geral para SPA
  rewrites.push({
    source: "/(.*)",
    destination: "/index.html"
  });
  
  // Criar vercel.json
  const vercelConfig = {
    cleanUrls: false,
    trailingSlash: false,
    rewrites: rewrites,
    headers: [
      {
        source: "/catalogo/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400"
          }
        ]
      }
    ]
  };
  
  // Salvar
  fs.writeFileSync(VERCEL_FILE, JSON.stringify(vercelConfig, null, 2), 'utf-8');
  console.log(`\n✅ vercel.json atualizado com ${rewrites.length - 1} rewrites de páginas regionais`);
}

main();
