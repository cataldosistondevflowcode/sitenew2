/**
 * Script para gerenciar páginas SEO regionais
 * Conforme RF-03 - Páginas Regionais Fixas (SEO Local)
 * 
 * Comandos disponíveis:
 * - npm run seo:list - Lista todas as páginas configuradas
 * - npm run seo:generate - Gera/atualiza páginas no banco de dados
 * - npm run seo:sync - Sincroniza config/seo-pages.json com banco de dados
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações do Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://jmcurflvrvuvzoddjkcg.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptY3VyZmx2cnZ1dnpvZGRqa2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjMzNDQsImV4cCI6MjA2MTY5OTM0NH0.LOtcUSiuDkbCbKCBPTTaDz2ip4Gb1DqjHqkbtzu_3oc";

const CONFIG_PATH = join(__dirname, '../config/seo-pages.json');
const BASE_URL = 'https://imoveis.leilaodeimoveis-cataldosiston.com';

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Carrega configuração do arquivo JSON
 */
function loadConfig() {
  try {
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Erro ao carregar config/seo-pages.json:', error.message);
    process.exit(1);
  }
}

/**
 * Gera slug a partir de texto
 */
function generateSlug(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Lista todas as páginas configuradas
 */
async function listPages() {
  console.log('📋 Listando páginas SEO configuradas...\n');
  
  const config = loadConfig();
  const pages = config.pages || [];
  
  if (pages.length === 0) {
    console.log('⚠️  Nenhuma página configurada.');
    return;
  }
  
  console.log(`Total: ${pages.length} páginas\n`);
  
  pages.forEach((page, index) => {
    const status = page.active ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${page.id}`);
    console.log(`   Estado: ${page.estado} | Região: ${page.regiao}`);
    console.log(`   URL: ${BASE_URL}/catalogo/${page.id}`);
    console.log(`   Slug: ${page.urlSlug}`);
    console.log(`   Filtro: ${page.filterType} = ${page.filterValue}`);
    console.log('');
  });
}

/**
 * Sincroniza páginas do config/seo-pages.json com o banco de dados
 */
async function syncPages() {
  console.log('🔄 Sincronizando páginas SEO com banco de dados...\n');
  
  const config = loadConfig();
  const pages = config.pages || [];
  
  if (pages.length === 0) {
    console.log('⚠️  Nenhuma página para sincronizar.');
    return;
  }
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
  for (const page of pages) {
    try {
      // Preparar dados para o banco
      const pageData = {
        page_id: page.id,
        estado: page.estado,
        regiao: page.regiao,
        keyword: page.keyword,
        url_slug: page.urlSlug || generateSlug(page.keyword),
        meta_title: page.metaTitle,
        meta_description: page.metaDescription,
        meta_keywords: page.metaKeywords || '',
        filter_type: page.filterType || 'bairro',
        filter_value: page.filterValue,
        is_active: page.active !== false
      };
      
      // Verificar se página já existe
      const { data: existing } = await supabase
        .from('seo_pages')
        .select('id')
        .eq('page_id', page.id)
        .single();
      
      if (existing) {
        // Atualizar página existente
        const { error } = await supabase
          .from('seo_pages')
          .update(pageData)
          .eq('page_id', page.id);
        
        if (error) {
          console.error(`❌ Erro ao atualizar ${page.id}:`, error.message);
          errors++;
        } else {
          console.log(`✅ Atualizado: ${page.id}`);
          updated++;
        }
      } else {
        // Criar nova página
        const { error } = await supabase
          .from('seo_pages')
          .insert(pageData);
        
        if (error) {
          console.error(`❌ Erro ao criar ${page.id}:`, error.message);
          errors++;
        } else {
          console.log(`✅ Criado: ${page.id}`);
          created++;
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${page.id}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n📊 Resumo:');
  console.log(`   ✅ Criadas: ${created}`);
  console.log(`   🔄 Atualizadas: ${updated}`);
  console.log(`   ❌ Erros: ${errors}`);
  console.log(`   📄 Total processado: ${pages.length}`);
}

/**
 * Gera páginas ativas (alias para sync)
 */
async function generatePages() {
  await syncPages();
}

// Executar comando baseado no argumento
const command = process.argv[2];

switch (command) {
  case 'list':
    listPages();
    break;
  case 'sync':
  case 'generate':
    generatePages();
    break;
  default:
    console.log('📖 Uso: node scripts/manage-seo-pages.js [list|sync|generate]');
    console.log('');
    console.log('Comandos:');
    console.log('  list      - Lista todas as páginas configuradas');
    console.log('  sync      - Sincroniza config/seo-pages.json com banco de dados');
    console.log('  generate  - Alias para sync');
    process.exit(1);
}
