/**
 * Script para gerar sitemap.xml dinamicamente com todas as páginas de imóveis
 * Este script busca todos os imóveis do Supabase e gera URLs no sitemap
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações do Supabase (mesmas do client.ts)
const SUPABASE_URL = "https://jmcurflvrvuvzoddjkcg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptY3VyZmx2cnZ1dnpvZGRqa2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjMzNDQsImV4cCI6MjA2MTY5OTM0NH0.LOtcUSiuDkbCbKCBPTTaDz2ip4Gb1DqjHqkbtzu_3oc";

const BASE_URL = 'https://imoveis.leilaodeimoveis-cataldosiston.com';
const SITEMAP_PATH = join(__dirname, '../public/sitemap.xml');

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Gera o sitemap XML com todas as páginas
 */
async function generateSitemap() {
  console.log('🚀 Iniciando geração do sitemap...');
  
  try {
    // Buscar todos os imóveis do banco de dados
    console.log('📡 Buscando imóveis do Supabase...');
    
    const { data: properties, error } = await supabase
      .from('leiloes_imoveis')
      .select('id, endereco, bairro, cidade, estado, data_leilao_1, data_leilao_2')
      .order('id', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar imóveis: ${error.message}`);
    }

    console.log(`✅ Encontrados ${properties?.length || 0} imóveis`);

    // Data atual para lastmod
    const currentDate = new Date().toISOString().split('T')[0];

    // Iniciar construção do XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Página Principal -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Leilão Caixa RJ -->
  <url>
    <loc>${BASE_URL}/leilao-caixa-rj</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Leilão RJ -->
  <url>
    <loc>${BASE_URL}/leilao-rj</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Leilão SP -->
  <url>
    <loc>${BASE_URL}/leilao-sp</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

`;

    // Adicionar URLs dos imóveis
    if (properties && properties.length > 0) {
      console.log('📝 Gerando URLs dos imóveis...');
      
      properties.forEach((property) => {
        // Determinar lastmod baseado na data mais recente do leilão
        let lastmod = currentDate;
        
        if (property.data_leilao_2) {
          try {
            const auctionDate = new Date(property.data_leilao_2).toISOString().split('T')[0];
            lastmod = auctionDate;
          } catch (e) {
            // Se houver erro, usar data atual
          }
        } else if (property.data_leilao_1) {
          try {
            const auctionDate = new Date(property.data_leilao_1).toISOString().split('T')[0];
            lastmod = auctionDate;
          } catch (e) {
            // Se houver erro, usar data atual
          }
        }

        // Determinar changefreq baseado na data do leilão
        let changefreq = 'weekly';
        let priority = '0.8';
        
        if (property.data_leilao_1) {
          const auctionDate = new Date(property.data_leilao_1);
          const daysUntilAuction = Math.ceil((auctionDate - new Date()) / (1000 * 60 * 60 * 24));
          
          // Se o leilão está próximo (menos de 7 dias), prioridade maior
          if (daysUntilAuction > 0 && daysUntilAuction <= 7) {
            changefreq = 'daily';
            priority = '0.9';
          } else if (daysUntilAuction > 7 && daysUntilAuction <= 30) {
            changefreq = 'daily';
            priority = '0.85';
          }
        }

        // Criar slug para URL amigável (opcional, mas melhora SEO)
        const createSlug = (text) => {
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
        };

        // Criar URL com slug se tiver dados suficientes
        let propertyUrl = `${BASE_URL}/imovel/${property.id}`;
        if (property.endereco || property.bairro || property.cidade) {
          const parts = [
            'imovel',
            'leilao',
            property.endereco,
            property.bairro,
            property.cidade,
            property.estado
          ].filter(Boolean);
          
          const slug = createSlug(parts.join(' '));
          if (slug) {
            propertyUrl = `${BASE_URL}/imovel/${property.id}/${slug}`;
          }
        }

        xml += `  <!-- Imóvel ID: ${property.id} -->
  <url>
    <loc>${propertyUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>

`;
      });
    }

    // Fechar XML
    xml += `</urlset>`;

    // Salvar arquivo
    writeFileSync(SITEMAP_PATH, xml, 'utf-8');
    
    const totalUrls = 4 + (properties?.length || 0); // 4 páginas estáticas + imóveis
    console.log(`✅ Sitemap gerado com sucesso!`);
    console.log(`   📄 Arquivo: ${SITEMAP_PATH}`);
    console.log(`   🔗 Total de URLs: ${totalUrls}`);
    console.log(`   🏠 Páginas estáticas: 4`);
    console.log(`   🏘️  Páginas de imóveis: ${properties?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar sitemap:', error);
    process.exit(1);
  }
}

// Executar
generateSitemap();

