// Script de validação RD Station
// Cole este código no console do navegador para testar

console.log('🔍 Iniciando validação RD Station...');

// 1. Verificar IDs únicos
const uniqueIds = [
  'newsletter-signup-shortcode3',
  'whatsapp-modal-shortcode3', 
  'opportunity-popup-shortcode3',
  'newsletter-bottom-shortcode3'
];

console.log('📋 Verificando IDs únicos:');
uniqueIds.forEach(id => {
  const element = document.getElementById(id);
  console.log(`  ${id}: ${element ? '✅ Encontrado' : '❌ Não encontrado'}`);
});

// 2. Verificar scripts RD Station
const rdScripts = document.querySelectorAll('script[src*="rdstation"]');
console.log(`📜 Scripts RD Station carregados: ${rdScripts.length}`);

// 3. Monitorar conversões
let conversionCount = 0;
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('rd.services')) {
    console.log(`🚀 Conversão #${++conversionCount} detectada:`, url);
  }
  return originalFetch.apply(this, args);
};

// 4. Verificar formulários
const rdForms = document.querySelectorAll('form[data-rd-form], [id*="shortcode3"]');
console.log(`📝 Formulários RD Station encontrados: ${rdForms.length}`);

console.log('✅ Validação concluída! Monitore o console para conversões.');
