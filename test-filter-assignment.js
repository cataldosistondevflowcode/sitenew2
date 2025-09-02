// Test script para verificar se a atribuição de filtros está funcionando
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFilterAssignment() {
  try {
    console.log('🧪 Iniciando teste de atribuição de filtros...');
    
    // 1. Buscar um lead existente
    const { data: leads, error: fetchError } = await supabase
      .from('contact_leads')
      .select('id, name, email, filter_config')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar leads:', fetchError);
      return;
    }
    
    if (!leads || leads.length === 0) {
      console.log('⚠️ Nenhum lead encontrado para teste');
      return;
    }
    
    const testLead = leads[0];
    console.log('📋 Lead encontrado:', testLead);
    
    // 2. Criar filtros de teste
    const testFilters = {
      cidade: 'Rio de Janeiro',
      bairros: ['Copacabana', 'Ipanema'],
      valor_min: '100000',
      valor_max: '500000',
      fgts: true,
      financiamento: false
    };
    
    console.log('🔍 Filtros de teste:', testFilters);
    
    // 3. Atualizar o lead com os filtros
    const { data: updatedLead, error: updateError } = await supabase
      .from('contact_leads')
      .update({ 
        filter_config: testFilters
      })
      .eq('id', testLead.id)
      .select('id, name, email, filter_config');
    
    if (updateError) {
      console.error('❌ Erro ao atualizar lead:', updateError);
      return;
    }
    
    console.log('✅ Lead atualizado com sucesso:', updatedLead);
    
    // 4. Verificar se os filtros foram salvos corretamente
    const { data: verifyLead, error: verifyError } = await supabase
      .from('contact_leads')
      .select('id, name, email, filter_config')
      .eq('id', testLead.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Erro ao verificar lead:', verifyError);
      return;
    }
    
    console.log('🔍 Verificação final:', verifyLead);
    console.log('📊 Filter config salvo:', verifyLead.filter_config);
    
    if (verifyLead.filter_config && Object.keys(verifyLead.filter_config).length > 0) {
      console.log('✅ Teste PASSOU: Filtros foram salvos corretamente!');
    } else {
      console.log('❌ Teste FALHOU: Filter config está vazio ou não foi salvo');
    }
    
  } catch (error) {
    console.error('💥 Erro geral no teste:', error);
  }
}

// Executar o teste
testFilterAssignment();
