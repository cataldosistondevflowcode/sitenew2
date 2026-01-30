/**
 * Script para ler a planilha de SERPs e gerar o registry canônico de regiões
 * 
 * Uso: node scripts/parse-serps-xlsx.cjs
 * 
 * Entrada: cataldo_sdd_pack/docs-pré-projeto/SEO/SERPs 02 das regiões selecionadas para criação de páginas - Cataldo Siston (1).xlsx
 * Saída: data/regional_pages_seo_seed.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo de entrada
const INPUT_FILE = path.join(
  __dirname, 
  '..', 
  'cataldo_sdd_pack', 
  'docs-pré-projeto', 
  'SEO', 
  'SERPs 02 das regiões selecionadas para criação de páginas - Cataldo Siston (1).xlsx'
);

// Caminho do arquivo de saída
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'regional_pages_seo_seed.json');

// Função para gerar slug a partir do nome da região
function generateSlug(regiao, estado) {
  const estadoSuffix = estado.toLowerCase() === 'rio de janeiro' ? 'rj' : 
                       estado.toLowerCase() === 'são paulo' ? 'sp' : 
                       estado.toLowerCase().replace(/\s+/g, '-');
  
  const regiaoSlug = regiao
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
  
  return `${regiaoSlug}-${estadoSuffix}`;
}

// Função principal
function main() {
  console.log('=== Parser de SERPs para SEO Regional ===\n');
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Arquivo não encontrado: ${INPUT_FILE}`);
    console.log('\nPor favor, verifique se o arquivo existe no caminho especificado.');
    process.exit(1);
  }
  
  console.log(`📄 Lendo arquivo: ${INPUT_FILE}\n`);
  
  // Ler o arquivo Excel
  const workbook = XLSX.readFile(INPUT_FILE);
  
  // Listar todas as abas
  console.log('📑 Abas encontradas:');
  workbook.SheetNames.forEach((name, i) => {
    console.log(`   ${i + 1}. ${name}`);
  });
  console.log('');
  
  // Processar cada aba
  const allRegions = [];
  const columnMappings = {};
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n📊 Processando aba: "${sheetName}"`);
    
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (data.length === 0) {
      console.log('   ⚠️ Aba vazia, pulando...');
      return;
    }
    
    // Primeira linha são os headers
    const headers = data[0];
    console.log(`   Headers: ${JSON.stringify(headers)}`);
    
    // Mapear colunas
    const colMap = {};
    headers.forEach((header, index) => {
      if (!header) return;
      const h = String(header).toLowerCase().trim();
      
      if (h.includes('estado') || h.includes('uf')) {
        colMap.estado = index;
      } else if (h.includes('região') || h.includes('regiao') || h.includes('bairro') || h.includes('local')) {
        colMap.regiao = index;
      } else if (h.includes('keyword') || h.includes('palavra') || h.includes('busca')) {
        colMap.keyword = index;
      } else if (h.includes('title') || h.includes('título') || h.includes('titulo')) {
        colMap.metaTitle = index;
      } else if (h.includes('description') || h.includes('descrição') || h.includes('descricao')) {
        colMap.metaDescription = index;
      } else if (h.includes('slug')) {
        colMap.slug = index;
      } else if (h.includes('cidade') || h.includes('city')) {
        colMap.cidade = index;
      } else if (h.includes('volume') || h.includes('busca')) {
        colMap.searchVolume = index;
      }
    });
    
    columnMappings[sheetName] = {
      headers: headers,
      mapping: colMap
    };
    
    console.log(`   Mapeamento: ${JSON.stringify(colMap)}`);
    
    // Processar linhas de dados
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      
      // Extrair dados
      const estado = colMap.estado !== undefined ? String(row[colMap.estado] || '').trim() : '';
      const regiao = colMap.regiao !== undefined ? String(row[colMap.regiao] || '').trim() : '';
      const keyword = colMap.keyword !== undefined ? String(row[colMap.keyword] || '').trim() : '';
      const metaTitle = colMap.metaTitle !== undefined ? String(row[colMap.metaTitle] || '').trim() : '';
      const metaDescription = colMap.metaDescription !== undefined ? String(row[colMap.metaDescription] || '').trim() : '';
      const slugFromSheet = colMap.slug !== undefined ? String(row[colMap.slug] || '').trim() : '';
      const cidade = colMap.cidade !== undefined ? String(row[colMap.cidade] || '').trim() : '';
      const searchVolume = colMap.searchVolume !== undefined ? row[colMap.searchVolume] : null;
      
      // Pular linhas sem região
      if (!regiao) continue;
      
      // Gerar slug se não existir
      const slug = slugFromSheet || generateSlug(regiao, estado);
      
      allRegions.push({
        slug,
        estado,
        cidade,
        regiao,
        keyword,
        metaTitle,
        metaDescription,
        searchVolume: searchVolume ? Number(searchVolume) : null,
        sourceSheet: sheetName
      });
    }
  });
  
  console.log(`\n📈 Total de regiões encontradas: ${allRegions.length}`);
  
  // Remover duplicatas por slug (manter a primeira ocorrência)
  const uniqueRegions = {};
  const duplicates = [];
  
  allRegions.forEach(region => {
    if (uniqueRegions[region.slug]) {
      duplicates.push(region.slug);
    } else {
      uniqueRegions[region.slug] = region;
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️ Duplicatas removidas: ${duplicates.join(', ')}`);
  }
  
  const finalRegions = Object.values(uniqueRegions);
  console.log(`✅ Regiões únicas: ${finalRegions.length}`);
  
  // Criar diretório de saída se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`\n📁 Diretório criado: ${OUTPUT_DIR}`);
  }
  
  // Salvar JSON
  const output = {
    _meta: {
      generatedAt: new Date().toISOString(),
      sourceFile: path.basename(INPUT_FILE),
      totalRegions: finalRegions.length,
      columnMappings: columnMappings
    },
    regions: finalRegions
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n💾 Arquivo salvo: ${OUTPUT_FILE}`);
  
  // Mostrar resumo
  console.log('\n=== RESUMO ===');
  console.log(`Total de regiões: ${finalRegions.length}`);
  
  // Agrupar por estado
  const byState = {};
  finalRegions.forEach(r => {
    const estado = r.estado || 'Não especificado';
    byState[estado] = (byState[estado] || 0) + 1;
  });
  
  console.log('\nPor estado:');
  Object.entries(byState).forEach(([estado, count]) => {
    console.log(`  - ${estado}: ${count} regiões`);
  });
  
  // Mostrar primeiras 5 regiões como exemplo
  console.log('\nExemplos (primeiras 5):');
  finalRegions.slice(0, 5).forEach(r => {
    console.log(`  - ${r.slug}: "${r.metaTitle || 'SEM TÍTULO'}"`);
  });
  
  console.log('\n✅ Processamento concluído!');
}

main();
