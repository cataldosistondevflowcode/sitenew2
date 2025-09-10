const fs = require('fs');

// Ler o arquivo JSON
const dados = JSON.parse(fs.readFileSync('c:/Users/paulo/Downloads/amarelo_bairros.json', 'utf8'));

// Filtrar apenas os bairros que precisam ser adicionados
const bairrosParaAdicionar = dados.filter(item => 
  item.STATUS && (
    item.STATUS.includes('NÃO LISTADO PREVIAMENTE NÃO LISTADO ADICIONAR!') ||
    item.STATUS.includes('FORA DA ZONA') && item.STATUS.includes('ADICIONAR!')
  )
);

console.log(`Total de bairros para adicionar: ${bairrosParaAdicionar.length}`);

// Agrupar por zona
const bairrosPorZona = {};
bairrosParaAdicionar.forEach(item => {
  const zona = item.ZONA;
  if (!bairrosPorZona[zona]) {
    bairrosPorZona[zona] = [];
  }
  bairrosPorZona[zona].push(item.BAIRRO);
});

// Gerar SQL para inserir os bairros
let sql = `-- Script para inserir bairros faltantes de São Paulo
-- Total de bairros: ${bairrosParaAdicionar.length}

`;

// Gerar INSERT statements
Object.keys(bairrosPorZona).forEach(zona => {
  const bairros = bairrosPorZona[zona];
  sql += `-- Zona ${zona} (${bairros.length} bairros)\n`;
  
  bairros.forEach(bairro => {
    // Escapar aspas simples no nome do bairro
    const bairroEscapado = bairro.replace(/'/g, "''");
    sql += `INSERT INTO leiloes_imoveis (bairro, cidade, estado) VALUES ('${bairroEscapado}', 'São Paulo', 'SP');\n`;
  });
  sql += '\n';
});

// Salvar o arquivo SQL
fs.writeFileSync('inserir_bairros_sp.sql', sql);

// Gerar também um resumo
let resumo = `RESUMO DOS BAIRROS PARA ADICIONAR EM SP:\n\n`;
Object.keys(bairrosPorZona).forEach(zona => {
  resumo += `ZONA ${zona}: ${bairrosPorZona[zona].length} bairros\n`;
  bairrosPorZona[zona].forEach(bairro => {
    resumo += `  - ${bairro}\n`;
  });
  resumo += '\n';
});

fs.writeFileSync('resumo_bairros_sp.txt', resumo);

console.log('Arquivos gerados:');
console.log('- inserir_bairros_sp.sql (script SQL)');
console.log('- resumo_bairros_sp.txt (resumo dos bairros)');
console.log('\nResumo por zona:');
Object.keys(bairrosPorZona).forEach(zona => {
  console.log(`${zona}: ${bairrosPorZona[zona].length} bairros`);
});
