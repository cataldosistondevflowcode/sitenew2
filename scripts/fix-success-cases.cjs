/**
 * Script para padronizar os casos de sucesso para 3 por região
 */

const fs = require('fs');
const path = require('path');

const contentFile = path.join(__dirname, '..', 'data', 'region-content.json');
const content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'));

// Templates de casos de sucesso por tipo de imóvel e faixa de preço
const caseTemplates = {
  // RJ - Alto padrão (Leblon, Ipanema, Lagoa, Jardim Botânico)
  rjAltoPadrao: [
    { title: "Apartamento 3 quartos - Vista mar", savings: "38%", description: "Cliente adquiriu apartamento de 120m² com vista privilegiada por valor significativamente abaixo do mercado." },
    { title: "Cobertura duplex - Área nobre", savings: "42%", description: "Cobertura de 200m² com terraço e churrasqueira arrematada com excelente deságio." },
    { title: "Apartamento 4 quartos - Andar alto", savings: "35%", description: "Família realizou o sonho da casa própria em localização premium com economia de mais de 30%." }
  ],
  // RJ - Médio padrão (Copacabana, Botafogo, Flamengo, Tijuca)
  rjMedioPadrao: [
    { title: "Apartamento 2 quartos - Próximo ao metrô", savings: "40%", description: "Investidor adquiriu imóvel bem localizado com excelente potencial de valorização e renda." },
    { title: "Apartamento 3 quartos - Reformado", savings: "37%", description: "Cliente arrematou imóvel pronto para morar com economia superior a um terço do valor de mercado." },
    { title: "Sala comercial - Ponto estratégico", savings: "45%", description: "Empresário adquiriu sala em localização comercial nobre por menos da metade do valor avaliado." }
  ],
  // RJ - Barra/Recreio
  rjBarra: [
    { title: "Apartamento em condomínio - Lazer completo", savings: "40%", description: "Família adquiriu apartamento em condomínio com infraestrutura completa por valor muito abaixo do mercado." },
    { title: "Casa em condomínio fechado", savings: "38%", description: "Investidor arrematou casa de 300m² com segurança 24h e lazer completo." },
    { title: "Apartamento 2 quartos - Vista para lagoa", savings: "42%", description: "Jovem casal realizou o sonho da casa própria na região com economia significativa." }
  ],
  // RJ - Niterói/Icaraí
  rjNiteroi: [
    { title: "Apartamento frente mar - Icaraí", savings: "38%", description: "Cliente adquiriu apartamento com vista para a Baía de Guanabara por valor excepcional." },
    { title: "Cobertura - São Francisco", savings: "40%", description: "Investidor arrematou cobertura de 150m² em bairro valorizado de Niterói." },
    { title: "Apartamento 3 quartos - Centro", savings: "35%", description: "Família mudou-se para Niterói economizando mais de 35% no imóvel." }
  ],
  // RJ - Região dos Lagos/Angra
  rjLitoral: [
    { title: "Casa de praia - Condomínio fechado", savings: "42%", description: "Investidor adquiriu casa de veraneio em localização paradisíaca com grande deságio." },
    { title: "Apartamento frente mar", savings: "38%", description: "Cliente realizou o sonho da casa de praia própria por valor muito abaixo do mercado." },
    { title: "Terreno em condomínio", savings: "45%", description: "Investidor adquiriu terreno de 600m² em condomínio de alto padrão para construção." }
  ],
  // RJ - Região Serrana
  rjSerrana: [
    { title: "Casa de campo - Itaipava", savings: "40%", description: "Família adquiriu refúgio de montanha com 4 suítes e amplo jardim por excelente preço." },
    { title: "Sítio - Região serrana", savings: "38%", description: "Investidor arrematou propriedade rural de 10.000m² ideal para lazer e descanso." },
    { title: "Apartamento em Petrópolis", savings: "35%", description: "Cliente adquiriu apartamento no centro histórico de Petrópolis com economia expressiva." }
  ],
  // RJ - Zona Norte
  rjZonaNorte: [
    { title: "Apartamento 3 quartos - Tijuca", savings: "40%", description: "Família adquiriu imóvel próximo ao metrô com excelente custo-benefício." },
    { title: "Casa - Vila Isabel", savings: "38%", description: "Cliente arrematou casa de 200m² em bairro tradicional da Zona Norte." },
    { title: "Apartamento 2 quartos - Méier", savings: "42%", description: "Jovem investidor adquiriu primeiro imóvel com economia superior a 40%." }
  ],
  // RJ - Centro
  rjCentro: [
    { title: "Sala comercial - Av. Rio Branco", savings: "50%", description: "Investidor adquiriu sala de 50m² em prédio comercial por metade do valor de mercado." },
    { title: "Apartamento para retrofit - Lapa", savings: "45%", description: "Cliente arrematou apartamento com potencial de valorização após reforma." },
    { title: "Loja - Centro histórico", savings: "48%", description: "Empresário adquiriu ponto comercial em área de grande circulação." }
  ],
  // SP - Alto padrão (Jardins, Itaim, Alto de Pinheiros)
  spAltoPadrao: [
    { title: "Apartamento 4 quartos - Jardins", savings: "35%", description: "Cliente adquiriu apartamento de 200m² em prédio clássico com grande economia." },
    { title: "Casa - Bairro nobre", savings: "38%", description: "Família arrematou casa de 400m² em rua arborizada por valor excepcional." },
    { title: "Cobertura triplex - Vista privilegiada", savings: "40%", description: "Investidor adquiriu cobertura de alto padrão com deságio significativo." }
  ],
  // SP - Médio padrão (Pinheiros, Vila Mariana, Moema)
  spMedioPadrao: [
    { title: "Apartamento 3 quartos - Próximo ao metrô", savings: "38%", description: "Cliente adquiriu imóvel bem localizado com fácil acesso ao transporte público." },
    { title: "Apartamento 2 quartos - Bairro valorizado", savings: "40%", description: "Jovem casal realizou o sonho da casa própria com economia expressiva." },
    { title: "Studio - Investimento", savings: "35%", description: "Investidor adquiriu studio compacto ideal para renda de aluguel." }
  ],
  // SP - Zona Leste (Tatuapé, Mooca)
  spZonaLeste: [
    { title: "Apartamento 2 quartos - Próximo ao shopping", savings: "40%", description: "Cliente adquiriu imóvel em região valorizada da Zona Leste." },
    { title: "Apartamento 3 quartos - Condomínio com lazer", savings: "38%", description: "Família arrematou apartamento em condomínio completo por ótimo preço." },
    { title: "Casa - Bairro tradicional", savings: "42%", description: "Investidor adquiriu imóvel em região com forte potencial de valorização." }
  ],
  // SP - Zona Norte (Santana)
  spZonaNorte: [
    { title: "Apartamento 2 quartos - Próximo ao metrô", savings: "39%", description: "Cliente adquiriu imóvel com fácil acesso ao Centro de São Paulo." },
    { title: "Casa - Rua arborizada", savings: "37%", description: "Família realizou o sonho da casa própria em bairro tranquilo." },
    { title: "Apartamento 3 quartos - Andar alto", savings: "40%", description: "Investidor arrematou imóvel com vista privilegiada por excelente preço." }
  ],
  // SP - Litoral (Riviera)
  spLitoral: [
    { title: "Casa de praia - Módulo nobre", savings: "38%", description: "Investidor adquiriu casa em condomínio exclusivo do litoral paulista." },
    { title: "Apartamento frente mar", savings: "40%", description: "Cliente realizou o sonho da casa de veraneio com economia significativa." },
    { title: "Cobertura duplex - Vista mar", savings: "35%", description: "Família arrematou cobertura em localização privilegiada." }
  ]
};

// Mapeamento de regiões para templates
const regionTemplateMap = {
  'copacabana-rj': 'rjMedioPadrao',
  'ipanema-rj': 'rjAltoPadrao',
  'leblon-rj': 'rjAltoPadrao',
  'barra-da-tijuca-rj': 'rjBarra',
  'botafogo-rj': 'rjMedioPadrao',
  'flamengo-rj': 'rjMedioPadrao',
  'laranjeiras-rj': 'rjMedioPadrao',
  'tijuca-rj': 'rjZonaNorte',
  'recreio-dos-bandeirantes-rj': 'rjBarra',
  'lagoa-rj': 'rjAltoPadrao',
  'jardim-botanico-rj': 'rjAltoPadrao',
  'icarai-rj': 'rjNiteroi',
  'niteroi-rj': 'rjNiteroi',
  'regiao-dos-lagos-rj': 'rjLitoral',
  'regiao-serrana-rj': 'rjSerrana',
  'angra-dos-reis-rj': 'rjLitoral',
  'zona-sul-rj': 'rjMedioPadrao',
  'zona-norte-rj': 'rjZonaNorte',
  'jacarepagua-rj': 'rjBarra',
  'centro-rj': 'rjCentro',
  'tatuape-sp': 'spZonaLeste',
  'vila-mariana-sp': 'spMedioPadrao',
  'pinheiros-sp': 'spMedioPadrao',
  'mooca-sp': 'spZonaLeste',
  'perdizes-sp': 'spMedioPadrao',
  'itaim-bibi-sp': 'spAltoPadrao',
  'moema-sp': 'spMedioPadrao',
  'santana-sp': 'spZonaNorte',
  'campo-belo-sp': 'spMedioPadrao',
  'jardim-america-sp': 'spAltoPadrao',
  'bela-vista-sp': 'spMedioPadrao',
  'brooklin-sp': 'spMedioPadrao',
  'pacaembu-sp': 'spAltoPadrao',
  'higienopolis-sp': 'spAltoPadrao',
  'alto-de-pinheiros-sp': 'spAltoPadrao',
  'ipiranga-sp': 'spZonaLeste',
  'riviera-de-sao-lourenco-sp': 'spLitoral'
};

// Atualizar regiões com menos de 3 casos
let updated = 0;
for (const [slug, data] of Object.entries(content.regions)) {
  const currentCases = data.successCases || [];
  
  if (currentCases.length < 3) {
    const templateKey = regionTemplateMap[slug] || 'rjMedioPadrao';
    const templateCases = caseTemplates[templateKey];
    
    // Manter casos existentes e adicionar novos até ter 3
    const newCases = [...currentCases];
    for (let i = currentCases.length; i < 3; i++) {
      // Pegar um caso do template que não seja igual aos existentes
      const templateCase = templateCases[i] || templateCases[0];
      // Personalizar com nome da região
      const regionName = data.neighborhoods ? data.neighborhoods[0] : slug.split('-')[0];
      newCases.push({
        title: templateCase.title.includes('Vista') || templateCase.title.includes('Próximo') 
          ? templateCase.title 
          : templateCase.title + ' - ' + regionName.charAt(0).toUpperCase() + regionName.slice(1),
        savings: templateCase.savings,
        description: templateCase.description
      });
    }
    
    content.regions[slug].successCases = newCases;
    updated++;
    console.log(`✅ ${slug}: ${currentCases.length} → 3 casos`);
  }
}

// Salvar
fs.writeFileSync(contentFile, JSON.stringify(content, null, 2), 'utf-8');

console.log(`\n---`);
console.log(`Regiões atualizadas: ${updated}`);
console.log(`Arquivo salvo: ${contentFile}`);
