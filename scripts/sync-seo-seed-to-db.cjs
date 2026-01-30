/**
 * Script para sincronizar páginas SEO do seed JSON com o banco de dados
 * 
 * Este script lê os dados de:
 * - data/regional_pages_seo_seed.json (meta tags)
 * - data/region-content.json (conteúdo descritivo)
 * 
 * E cria/atualiza entradas na tabela seo_pages do Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurações do Supabase (mesmas do projeto React)
const SUPABASE_URL = "https://jmcurflvrvuvzoddjkcg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptY3VyZmx2cnZ1dnpvZGRqa2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjMzNDQsImV4cCI6MjA2MTY5OTM0NH0.LOtcUSiuDkbCbKCBPTTaDz2ip4Gb1DqjHqkbtzu_3oc";

const SEED_FILE = path.join(__dirname, '..', 'data', 'regional_pages_seo_seed.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'region-content.json');

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🔄 Sincronizando páginas SEO com banco de dados...\n');
  
  // Carregar dados
  let seedData, contentData;
  
  try {
    seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8')).regions;
    console.log(`✅ Seed carregado: ${seedData.length} regiões`);
  } catch (e) {
    console.error(`❌ Erro ao ler seed: ${e.message}`);
    process.exit(1);
  }
  
  try {
    contentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')).regions;
    console.log(`✅ Conteúdo carregado: ${Object.keys(contentData).length} regiões\n`);
  } catch (e) {
    console.warn(`⚠️  Arquivo de conteúdo não encontrado, usando placeholders\n`);
    contentData = {};
  }
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
  for (const region of seedData) {
    const { slug, estado, regiao, keyword, metaTitle, metaDescription } = region;
    const content = contentData[slug] || {};
    
    // Determinar tipo de filtro
    let filterType = 'bairro';
    let filterValue = regiao;
    
    // Regiões especiais que são zonas ou cidades
    if (slug.includes('zona-sul') || slug.includes('zona-norte')) {
      filterType = 'zona';
      filterValue = regiao + (estado === 'RJ' ? ' (Rio de Janeiro)' : ' (São Paulo)');
    } else if (slug === 'niteroi-rj' || slug === 'angra-dos-reis-rj') {
      filterType = 'cidade';
      filterValue = regiao;
    } else if (slug.includes('regiao-')) {
      filterType = 'zona';
      filterValue = regiao;
    }
    
    // Gerar url_slug a partir do keyword
    const urlSlug = keyword
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const pageData = {
      page_id: slug,
      estado: estado,
      regiao: regiao,
      keyword: keyword,
      url_slug: urlSlug,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: `${keyword}, leilão de imóveis, ${regiao.toLowerCase()}, ${estado}`,
      filter_type: filterType,
      filter_value: filterValue,
      is_active: true,
      intro_text: content.heroDescription || null,
      region_description: content.aboutText || null,
      region_content: content.neighborhoods ? {
        neighborhoods: content.neighborhoods,
        attractions: content.attractions,
        infrastructure: content.infrastructure,
        highlights: content.highlights
      } : null
    };
    
    try {
      // Verificar se já existe
      const { data: existing, error: selectError } = await supabase
        .from('seo_pages')
        .select('id')
        .eq('page_id', slug)
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }
      
      if (existing) {
        // Atualizar
        const { error: updateError } = await supabase
          .from('seo_pages')
          .update(pageData)
          .eq('page_id', slug);
        
        if (updateError) throw updateError;
        
        updated++;
        console.log(`🔄 ${slug} - atualizado`);
      } else {
        // Criar
        const { error: insertError } = await supabase
          .from('seo_pages')
          .insert(pageData);
        
        if (insertError) throw insertError;
        
        created++;
        console.log(`✅ ${slug} - criado`);
      }
    } catch (e) {
      errors++;
      console.error(`❌ ${slug} - erro: ${e.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('RESUMO:');
  console.log(`  ✅ Criados: ${created}`);
  console.log(`  🔄 Atualizados: ${updated}`);
  console.log(`  ❌ Erros: ${errors}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
