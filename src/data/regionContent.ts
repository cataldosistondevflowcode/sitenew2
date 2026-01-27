/**
 * Dados estáticos únicos por região para SEO
 * 
 * Este arquivo contém conteúdo específico para cada página regional
 * que será renderizado no NoScriptFallback para crawlers sem JavaScript.
 * 
 * IMPORTANTE: Cada região deve ter conteúdo ÚNICO para evitar que o Google
 * interprete as páginas como duplicadas.
 */

export interface RegionContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  neighborhoods: string[];
  attractions: string[];
  infrastructure: string[];
  highlights: string[];
  relatedRegions: { name: string; slug: string }[];
  propertyTypes: string[];
  averagePriceRange: string;
  transportInfo: string;
}

export const regionContents: Record<string, RegionContent> = {
  // ==================== RIO DE JANEIRO ====================
  
  'copacabana-rj': {
    id: 'copacabana-rj',
    heroTitle: 'Imóveis em Leilão em Copacabana - Rio de Janeiro',
    heroDescription: 'Copacabana é um dos bairros mais icônicos do Rio de Janeiro, conhecido mundialmente por sua praia de 4km, calçadão em pedras portuguesas e vida cultural vibrante. Encontre as melhores oportunidades de imóveis em leilão nesta região privilegiada da Zona Sul carioca.',
    aboutTitle: 'Sobre Copacabana',
    aboutDescription: 'Copacabana oferece uma combinação única de tradição e modernidade. O bairro conta com excelente infraestrutura de transporte (metrô, ônibus), hospitais renomados, escolas tradicionais e uma vida noturna agitada. Os imóveis variam desde studios compactos até apartamentos espaçosos de frente para o mar, atendendo diferentes perfis de compradores.',
    neighborhoods: ['Leme', 'Copacabana', 'Posto 5', 'Posto 6'],
    attractions: ['Praia de Copacabana', 'Forte de Copacabana', 'Pedra do Leme', 'Beco das Garrafas'],
    infrastructure: ['Metrô Linha 1', 'Hospital Copa Star', 'Colégio Santo Inácio', 'Supermercados Zona Sul'],
    highlights: ['4km de orla', 'Calçadão histórico', 'Réveillon famoso', 'Vista para o Pão de Açúcar'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Leme', slug: 'zona-sul-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 400.000 a R$ 3.000.000',
    transportInfo: 'Estações de metrô: Cardeal Arcoverde, Siqueira Campos, Cantagalo. Diversas linhas de ônibus.'
  },

  'ipanema-rj': {
    id: 'ipanema-rj',
    heroTitle: 'Imóveis em Leilão em Ipanema - Rio de Janeiro',
    heroDescription: 'Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção, o bairro oferece as melhores lojas, restaurantes e uma atmosfera cosmopolita única.',
    aboutTitle: 'Sobre Ipanema',
    aboutDescription: 'Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo na Rua Garcia DÁvila e Visconde de Pirajá, além de praças charmosas. Ideal para quem busca qualidade de vida e investimento seguro.',
    neighborhoods: ['Ipanema', 'Arpoador', 'Lagoa'],
    attractions: ['Praia de Ipanema', 'Pedra do Arpoador', 'Praça Nossa Senhora da Paz', 'Feira Hippie'],
    infrastructure: ['Metrô General Osório', 'Hospital São Lucas', 'Colégio Andrews', 'Shopping Leblon'],
    highlights: ['Pôr do sol no Arpoador', 'Rua Garcia DÁvila', 'Praça General Osório', 'Proximidade com Lagoa'],
    relatedRegions: [
      { name: 'Copacabana', slug: 'copacabana-rj' },
      { name: 'Leblon', slug: 'leblon-rj' },
      { name: 'Lagoa', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de alto padrão', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 800.000 a R$ 8.000.000',
    transportInfo: 'Estação de metrô General Osório. Linhas de ônibus para toda cidade.'
  },

  'leblon-rj': {
    id: 'leblon-rj',
    heroTitle: 'Imóveis em Leilão no Leblon - Rio de Janeiro',
    heroDescription: 'O Leblon é o bairro mais exclusivo do Rio de Janeiro, com o metro quadrado mais valorizado da cidade. Oferece segurança, tranquilidade e sofisticação em um ambiente familiar.',
    aboutTitle: 'Sobre o Leblon',
    aboutDescription: 'O Leblon combina a beleza natural da praia com uma infraestrutura completa de serviços premium. Ruas arborizadas, restaurantes renomados, o Shopping Leblon e escolas tradicionais fazem do bairro a escolha preferida de famílias de alto padrão.',
    neighborhoods: ['Leblon', 'Gávea', 'Jardim Botânico'],
    attractions: ['Praia do Leblon', 'Baixo Leblon', 'Mirante do Leblon', 'Shopping Leblon'],
    infrastructure: ['Metrô Antero de Quental', 'Hospital Barra DÓr', 'Colégio Santo Agostinho', 'Shopping Leblon'],
    highlights: ['Metro quadrado mais caro do Rio', 'Ambiente familiar', 'Baixa criminalidade', 'Proximidade com PUC-Rio'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Gávea', slug: 'zona-sul-rj' },
      { name: 'Jardim Botânico', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de luxo', 'Coberturas duplex', 'Casas'],
    averagePriceRange: 'R$ 1.500.000 a R$ 15.000.000',
    transportInfo: 'Estações de metrô Antero de Quental e Jardim de Alah. Acesso rápido à Lagoa.'
  },

  'barra-tijuca-rj': {
    id: 'barra-tijuca-rj',
    heroTitle: 'Imóveis em Leilão na Barra da Tijuca - Rio de Janeiro',
    heroDescription: 'A Barra da Tijuca é o bairro que mais cresce no Rio de Janeiro, com infraestrutura moderna, condomínios de alto padrão e a maior praia urbana da cidade com 18km de extensão.',
    aboutTitle: 'Sobre a Barra da Tijuca',
    aboutDescription: 'A Barra da Tijuca é conhecida por seus grandes condomínios, shoppings de primeira linha e qualidade de vida. O bairro oferece opções para todos os perfis, desde apartamentos compactos até mansões em condomínios fechados.',
    neighborhoods: ['Barra da Tijuca', 'Recreio', 'Itanhangá', 'São Conrado'],
    attractions: ['Praia da Barra', 'Barra Shopping', 'Village Mall', 'Parque Olímpico'],
    infrastructure: ['BRT TransOeste', 'Hospital Barra DÓr', 'Colégios particulares', 'Shopping Village Mall'],
    highlights: ['18km de praia', 'Condomínios fechados', 'Shoppings modernos', 'Sede olímpica 2016'],
    relatedRegions: [
      { name: 'Recreio', slug: 'recreio-rj' },
      { name: 'Zona Oeste', slug: 'zona-oeste-rj' },
      { name: 'São Conrado', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos em condomínio', 'Casas em condomínio', 'Coberturas', 'Salas comerciais'],
    averagePriceRange: 'R$ 350.000 a R$ 5.000.000',
    transportInfo: 'BRT TransOeste, linhas de ônibus. Acesso pela Linha Amarela e Av. das Américas.'
  },

  'botafogo-rj': {
    id: 'botafogo-rj',
    heroTitle: 'Imóveis em Leilão em Botafogo - Rio de Janeiro',
    heroDescription: 'Botafogo é um bairro tradicional da Zona Sul com vista privilegiada para o Pão de Açúcar e a Baía de Guanabara. Combina história, cultura e praticidade em uma localização estratégica.',
    aboutTitle: 'Sobre Botafogo',
    aboutDescription: 'Botafogo oferece uma mistura única de prédios históricos e modernos, com forte comércio, vida cultural intensa e fácil acesso a toda cidade pelo metrô. O bairro abriga shoppings, universidades e está próximo ao Aterro do Flamengo.',
    neighborhoods: ['Botafogo', 'Humaitá', 'Urca'],
    attractions: ['Praia de Botafogo', 'Bondinho do Pão de Açúcar', 'Botafogo Praia Shopping', 'Casa Daros'],
    infrastructure: ['Metrô Botafogo', 'Hospital Samaritano', 'Colégio São Vicente', 'Botafogo Praia Shopping'],
    highlights: ['Vista para Pão de Açúcar', 'Proximidade do metrô', 'Vida cultural ativa', 'Gastronomia variada'],
    relatedRegions: [
      { name: 'Flamengo', slug: 'flamengo-rj' },
      { name: 'Urca', slug: 'zona-sul-rj' },
      { name: 'Copacabana', slug: 'copacabana-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais', 'Casas em vilas'],
    averagePriceRange: 'R$ 400.000 a R$ 3.500.000',
    transportInfo: 'Estação de metrô Botafogo (integração com linhas 1 e 2). Diversas linhas de ônibus.'
  },

  'flamengo-rj': {
    id: 'flamengo-rj',
    heroTitle: 'Imóveis em Leilão no Flamengo - Rio de Janeiro',
    heroDescription: 'O Flamengo é um dos bairros mais tradicionais do Rio de Janeiro, com vista para a Baía de Guanabara, o maior parque urbano da cidade e excelente infraestrutura de transporte.',
    aboutTitle: 'Sobre o Flamengo',
    aboutDescription: 'O Flamengo oferece qualidade de vida com o Aterro do Flamengo à porta, prédios históricos, forte comércio e fácil acesso ao Centro e Zona Sul. Ideal para quem trabalha no Centro e busca qualidade de vida.',
    neighborhoods: ['Flamengo', 'Catete', 'Laranjeiras', 'Glória'],
    attractions: ['Aterro do Flamengo', 'Marina da Glória', 'Museu de Arte Moderna', 'Praia do Flamengo'],
    infrastructure: ['Metrô Flamengo', 'Hospital Federal', 'Colégio Pedro II', 'Largo do Machado'],
    highlights: ['Aterro do Flamengo', 'Vista para Baía', 'Arquitetura art déco', 'Fácil acesso ao Centro'],
    relatedRegions: [
      { name: 'Botafogo', slug: 'botafogo-rj' },
      { name: 'Laranjeiras', slug: 'laranjeiras-rj' },
      { name: 'Catete', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais'],
    averagePriceRange: 'R$ 350.000 a R$ 2.500.000',
    transportInfo: 'Estações de metrô Flamengo, Largo do Machado, Catete. Muitas linhas de ônibus.'
  },

  'laranjeiras-rj': {
    id: 'laranjeiras-rj',
    heroTitle: 'Imóveis em Leilão em Laranjeiras - Rio de Janeiro',
    heroDescription: 'Laranjeiras é um bairro residencial e tranquilo da Zona Sul, conhecido por suas ruas arborizadas, casarões históricos e proximidade com o Centro.',
    aboutTitle: 'Sobre Laranjeiras',
    aboutDescription: 'Laranjeiras combina a tranquilidade de um bairro residencial com a praticidade de estar próximo ao Centro e à Zona Sul. O bairro possui forte comércio local, escolas tradicionais e ruas arborizadas.',
    neighborhoods: ['Laranjeiras', 'Cosme Velho', 'Santa Teresa'],
    attractions: ['Trem do Corcovado', 'Palácio Guanabara', 'Parque Guinle', 'Largo do Machado'],
    infrastructure: ['Metrô Largo do Machado', 'Hospital São José', 'Colégio Notre Dame', 'Supermercados'],
    highlights: ['Próximo ao Corcovado', 'Ruas arborizadas', 'Casarões históricos', 'Ambiente familiar'],
    relatedRegions: [
      { name: 'Flamengo', slug: 'flamengo-rj' },
      { name: 'Cosme Velho', slug: 'zona-sul-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Coberturas'],
    averagePriceRange: 'R$ 300.000 a R$ 2.000.000',
    transportInfo: 'Próximo ao metrô Largo do Machado. Linhas de ônibus para Centro e Zona Sul.'
  },

  'tijuca-rj': {
    id: 'tijuca-rj',
    heroTitle: 'Imóveis em Leilão na Tijuca - Rio de Janeiro',
    heroDescription: 'A Tijuca é o maior bairro da Zona Norte, famoso pela Floresta da Tijuca, forte comércio e excelente infraestrutura. Oferece ótimo custo-benefício para moradia.',
    aboutTitle: 'Sobre a Tijuca',
    aboutDescription: 'A Tijuca é conhecida pela Floresta da Tijuca, o maior parque urbano do mundo, e por oferecer todas as facilidades de um grande centro urbano. O bairro possui shoppings, hospitais, escolas e fácil acesso ao metrô.',
    neighborhoods: ['Tijuca', 'Vila Isabel', 'Grajaú', 'Andaraí'],
    attractions: ['Floresta da Tijuca', 'Cascatinha', 'Parque Nacional', 'Shopping Tijuca'],
    infrastructure: ['Metrô Saens Peña', 'Hospital Federal', 'UERJ', 'Shopping Tijuca'],
    highlights: ['Floresta da Tijuca', 'Forte comércio', 'Ótimo custo-benefício', 'Fácil acesso ao metrô'],
    relatedRegions: [
      { name: 'Vila Isabel', slug: 'zona-norte-rj' },
      { name: 'Grajaú', slug: 'zona-norte-rj' },
      { name: 'Méier', slug: 'meier-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 200.000 a R$ 1.200.000',
    transportInfo: 'Estações de metrô Saens Peña, Afonso Pena, São Francisco Xavier. Diversas linhas de ônibus.'
  },

  'recreio-rj': {
    id: 'recreio-rj',
    heroTitle: 'Imóveis em Leilão no Recreio dos Bandeirantes - Rio de Janeiro',
    heroDescription: 'O Recreio dos Bandeirantes oferece praias paradisíacas, condomínios de qualidade e um estilo de vida mais tranquilo, sendo uma excelente opção para famílias.',
    aboutTitle: 'Sobre o Recreio',
    aboutDescription: 'O Recreio é conhecido por suas praias com ondas perfeitas para surf, condomínios com infraestrutura completa e um ritmo de vida mais calmo que a Barra da Tijuca. Ideal para quem busca qualidade de vida com preços mais acessíveis.',
    neighborhoods: ['Recreio', 'Vargem Grande', 'Vargem Pequena', 'Grumari'],
    attractions: ['Praia do Recreio', 'Praia do Pontal', 'Praia de Grumari', 'Reserva de Marapendi'],
    infrastructure: ['BRT TransOeste', 'Shopping Recreio', 'Hospitais particulares', 'Escolas'],
    highlights: ['Praias paradisíacas', 'Surf e esportes aquáticos', 'Condomínios com lazer', 'Natureza preservada'],
    relatedRegions: [
      { name: 'Barra da Tijuca', slug: 'barra-tijuca-rj' },
      { name: 'Zona Oeste', slug: 'zona-oeste-rj' },
      { name: 'Vargem Grande', slug: 'zona-oeste-rj' }
    ],
    propertyTypes: ['Apartamentos em condomínio', 'Casas', 'Coberturas'],
    averagePriceRange: 'R$ 250.000 a R$ 2.000.000',
    transportInfo: 'BRT TransOeste. Acesso pela Av. das Américas.'
  },

  'zona-sul-rj': {
    id: 'zona-sul-rj',
    heroTitle: 'Imóveis em Leilão na Zona Sul do Rio de Janeiro',
    heroDescription: 'A Zona Sul do Rio de Janeiro concentra os bairros mais valorizados da cidade, incluindo Copacabana, Ipanema, Leblon, Botafogo e Flamengo. Região de alto padrão com as melhores praias urbanas do mundo.',
    aboutTitle: 'Sobre a Zona Sul',
    aboutDescription: 'A Zona Sul carioca é sinônimo de qualidade de vida, com praias famosas, parques, metrô, hospitais de excelência e as melhores escolas. Os imóveis da região são muito procurados tanto para moradia quanto para investimento.',
    neighborhoods: ['Copacabana', 'Ipanema', 'Leblon', 'Botafogo', 'Flamengo', 'Laranjeiras', 'Humaitá', 'Lagoa', 'Gávea', 'Jardim Botânico'],
    attractions: ['Praias', 'Lagoa Rodrigo de Freitas', 'Jardim Botânico', 'Cristo Redentor', 'Pão de Açúcar'],
    infrastructure: ['Metrô Linhas 1 e 2', 'Hospitais renomados', 'Escolas tradicionais', 'Shoppings'],
    highlights: ['Praias mundialmente famosas', 'Alta valorização', 'Infraestrutura completa', 'Segurança'],
    relatedRegions: [
      { name: 'Copacabana', slug: 'copacabana-rj' },
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Leblon', slug: 'leblon-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas', 'Salas comerciais'],
    averagePriceRange: 'R$ 400.000 a R$ 15.000.000',
    transportInfo: 'Metrô Linhas 1 e 2. Diversas linhas de ônibus. Ciclovias.'
  },

  'zona-norte-rj': {
    id: 'zona-norte-rj',
    heroTitle: 'Imóveis em Leilão na Zona Norte do Rio de Janeiro',
    heroDescription: 'A Zona Norte é a maior região do Rio de Janeiro, oferecendo excelente custo-benefício, forte comércio e infraestrutura completa. Bairros como Tijuca, Méier e Vila Isabel são muito procurados.',
    aboutTitle: 'Sobre a Zona Norte',
    aboutDescription: 'A Zona Norte oferece diversidade de bairros, desde áreas mais valorizadas como Tijuca e Vila Isabel até opções mais acessíveis. A região possui shoppings, hospitais, universidades e bom transporte público.',
    neighborhoods: ['Tijuca', 'Méier', 'Vila Isabel', 'Grajaú', 'Maracanã', 'Engenho Novo', 'Cachambi'],
    attractions: ['Maracanã', 'Quinta da Boa Vista', 'Floresta da Tijuca', 'Shopping Nova América'],
    infrastructure: ['Metrô', 'SuperVia', 'Hospitais', 'UERJ', 'Shoppings'],
    highlights: ['Ótimo custo-benefício', 'Forte comércio', 'Transporte público', 'Diversidade de bairros'],
    relatedRegions: [
      { name: 'Tijuca', slug: 'tijuca-rj' },
      { name: 'Méier', slug: 'meier-rj' },
      { name: 'Vila Isabel', slug: 'zona-norte-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 150.000 a R$ 1.000.000',
    transportInfo: 'Metrô, SuperVia (trens), BRT TransCarioca. Diversas linhas de ônibus.'
  },

  'zona-oeste-rj': {
    id: 'zona-oeste-rj',
    heroTitle: 'Imóveis em Leilão na Zona Oeste do Rio de Janeiro',
    heroDescription: 'A Zona Oeste abriga a Barra da Tijuca, Recreio e Jacarepaguá, oferecendo condomínios modernos, praias extensas e qualidade de vida em expansão.',
    aboutTitle: 'Sobre a Zona Oeste',
    aboutDescription: 'A Zona Oeste é a região que mais cresce no Rio, com grandes condomínios, shoppings modernos e infraestrutura em constante evolução. A região oferece opções para todos os bolsos e estilos de vida.',
    neighborhoods: ['Barra da Tijuca', 'Recreio', 'Jacarepaguá', 'Campo Grande', 'Santa Cruz', 'Bangu'],
    attractions: ['Praias da Barra e Recreio', 'Parque Olímpico', 'Village Mall', 'Barra Shopping'],
    infrastructure: ['BRT', 'Hospitais', 'Shoppings', 'Escolas particulares'],
    highlights: ['Condomínios modernos', 'Praias extensas', 'Área em expansão', 'Qualidade de vida'],
    relatedRegions: [
      { name: 'Barra da Tijuca', slug: 'barra-tijuca-rj' },
      { name: 'Recreio', slug: 'recreio-rj' },
      { name: 'Jacarepaguá', slug: 'zona-oeste-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas em condomínio', 'Terrenos', 'Salas comerciais'],
    averagePriceRange: 'R$ 150.000 a R$ 5.000.000',
    transportInfo: 'BRT TransOeste e TransOlímpica. Linhas de ônibus. Acesso pelas principais vias.'
  },

  'niteroi-rj': {
    id: 'niteroi-rj',
    heroTitle: 'Imóveis em Leilão em Niterói - RJ',
    heroDescription: 'Niterói oferece qualidade de vida, praias paradisíacas como Icaraí e Itacoatiara, e vista privilegiada para o Rio de Janeiro. Uma excelente opção para quem trabalha no Centro do Rio.',
    aboutTitle: 'Sobre Niterói',
    aboutDescription: 'Niterói é conhecida pela alta qualidade de vida, praias limpas, forte comércio em Icaraí e infraestrutura completa. A cidade oferece ótimo custo-benefício comparada à Zona Sul do Rio, com fácil acesso pela Ponte Rio-Niterói.',
    neighborhoods: ['Icaraí', 'São Francisco', 'Charitas', 'Itacoatiara', 'Camboinhas', 'Centro'],
    attractions: ['MAC - Museu de Arte Contemporânea', 'Praia de Icaraí', 'Praia de Itacoatiara', 'Fortaleza de Santa Cruz'],
    infrastructure: ['Barcas', 'Linha de ônibus', 'Hospital Icaraí', 'Shopping Bay Market'],
    highlights: ['Vista para o Rio', 'Praias limpas', 'Alto IDH', 'Custo-benefício'],
    relatedRegions: [
      { name: 'Centro RJ', slug: 'centro-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas', 'Salas comerciais'],
    averagePriceRange: 'R$ 250.000 a R$ 3.000.000',
    transportInfo: 'Barcas para Praça XV. Ônibus pela Ponte Rio-Niterói. Acesso pela BR-101.'
  },

  'centro-rj': {
    id: 'centro-rj',
    heroTitle: 'Imóveis em Leilão no Centro do Rio de Janeiro',
    heroDescription: 'O Centro do Rio de Janeiro é o coração comercial e histórico da cidade, oferecendo fácil acesso a toda cidade e imóveis com excelente potencial de valorização.',
    aboutTitle: 'Sobre o Centro do RJ',
    aboutDescription: 'O Centro é a principal região comercial e financeira do Rio, com prédios históricos, museus, teatros e forte infraestrutura de transporte. Ideal para investimento comercial ou para quem trabalha na região.',
    neighborhoods: ['Centro', 'Lapa', 'Cinelândia', 'Praça Mauá', 'Saúde'],
    attractions: ['Theatro Municipal', 'Praça Mauá', 'Museu do Amanhã', 'AquaRio', 'Arcos da Lapa'],
    infrastructure: ['Metrô', 'VLT', 'Barcas', 'Aeroporto Santos Dumont', 'Hospitais'],
    highlights: ['Centro financeiro', 'Patrimônio histórico', 'Revitalização Porto Maravilha', 'Transporte integrado'],
    relatedRegions: [
      { name: 'Flamengo', slug: 'flamengo-rj' },
      { name: 'Niterói', slug: 'niteroi-rj' },
      { name: 'Tijuca', slug: 'tijuca-rj' }
    ],
    propertyTypes: ['Salas comerciais', 'Apartamentos', 'Prédios comerciais', 'Lojas'],
    averagePriceRange: 'R$ 100.000 a R$ 2.000.000',
    transportInfo: 'Metrô, VLT, Barcas, Aeroporto Santos Dumont. Principal hub de transporte do Rio.'
  },

  'meier-rj': {
    id: 'meier-rj',
    heroTitle: 'Imóveis em Leilão no Méier - Rio de Janeiro',
    heroDescription: 'O Méier é um dos bairros mais tradicionais da Zona Norte, conhecido pelo forte comércio do Calçadão e excelente infraestrutura.',
    aboutTitle: 'Sobre o Méier',
    aboutDescription: 'O Méier é o coração comercial da Zona Norte, com o famoso Calçadão, shoppings, hospitais e fácil acesso ao metrô. Oferece ótimo custo-benefício e qualidade de vida.',
    neighborhoods: ['Méier', 'Engenho de Dentro', 'Cachambi', 'Todos os Santos', 'Lins'],
    attractions: ['Calçadão do Méier', 'Shopping NorteShopping', 'Feira do Méier', 'Largo do Bicão'],
    infrastructure: ['Metrô', 'SuperVia', 'NorteShopping', 'Hospital Salgado Filho'],
    highlights: ['Forte comércio', 'Metrô e trem', 'Custo-benefício', 'Tradição'],
    relatedRegions: [
      { name: 'Tijuca', slug: 'tijuca-rj' },
      { name: 'Engenho de Dentro', slug: 'zona-norte-rj' },
      { name: 'Cachambi', slug: 'zona-norte-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 150.000 a R$ 600.000',
    transportInfo: 'Metrô Méier. Trem SuperVia. Diversas linhas de ônibus.'
  },

  // ==================== SÃO PAULO ====================

  'jardins-sp': {
    id: 'jardins-sp',
    heroTitle: 'Imóveis em Leilão nos Jardins - São Paulo',
    heroDescription: 'Os Jardins são o endereço mais prestigiado de São Paulo, reunindo lojas de grife, restaurantes sofisticados e imóveis de altíssimo padrão.',
    aboutTitle: 'Sobre os Jardins',
    aboutDescription: 'Os Jardins (Jardim Paulista, Jardim América, Jardim Europa) formam a região mais valorizada de São Paulo. Ruas arborizadas, mansões históricas e apartamentos de luxo fazem do bairro a escolha de executivos e famílias de alto padrão.',
    neighborhoods: ['Jardim Paulista', 'Jardim América', 'Jardim Europa', 'Cerqueira César'],
    attractions: ['Rua Oscar Freire', 'Avenida Paulista', 'Parque Trianon', 'Casa das Rosas'],
    infrastructure: ['Metrô Paulista', 'Hospitais Sírio-Libanês e Albert Einstein', 'Shopping Iguatemi', 'Escolas bilíngues'],
    highlights: ['Metro quadrado mais caro de SP', 'Lojas de grife', 'Gastronomia premium', 'Segurança'],
    relatedRegions: [
      { name: 'Pinheiros', slug: 'pinheiros-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' },
      { name: 'Vila Mariana', slug: 'vila-mariana-sp' }
    ],
    propertyTypes: ['Apartamentos de luxo', 'Coberturas', 'Casas', 'Salas comerciais'],
    averagePriceRange: 'R$ 800.000 a R$ 15.000.000',
    transportInfo: 'Metrô Linha 2 Verde (estações Consolação, Trianon-MASP). Próximo à Av. Paulista.'
  },

  'pinheiros-sp': {
    id: 'pinheiros-sp',
    heroTitle: 'Imóveis em Leilão em Pinheiros - São Paulo',
    heroDescription: 'Pinheiros é um dos bairros mais descolados de São Paulo, com vida noturna agitada, gastronomia diversificada e excelente infraestrutura.',
    aboutTitle: 'Sobre Pinheiros',
    aboutDescription: 'Pinheiros combina tradição e modernidade, com vilas charmosas, prédios novos, forte comércio e uma das vidas noturnas mais agitadas de São Paulo. O bairro abriga startups, agências e profissionais criativos.',
    neighborhoods: ['Pinheiros', 'Vila Madalena', 'Alto de Pinheiros', 'Sumaré'],
    attractions: ['Beco do Batman', 'Praça Benedito Calixto', 'Mercado de Pinheiros', 'Pinacoteca'],
    infrastructure: ['Metrô Faria Lima', 'Hospitais', 'Escolas', 'Shopping Eldorado'],
    highlights: ['Vida noturna', 'Gastronomia', 'Cultura', 'Startups e coworkings'],
    relatedRegions: [
      { name: 'Jardins', slug: 'jardins-sp' },
      { name: 'Vila Madalena', slug: 'zona-oeste-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas em vilas', 'Studios'],
    averagePriceRange: 'R$ 500.000 a R$ 4.000.000',
    transportInfo: 'Metrô Linha 4 Amarela (estações Pinheiros, Faria Lima). Ciclovia.'
  },

  'moema-sp': {
    id: 'moema-sp',
    heroTitle: 'Imóveis em Leilão em Moema - São Paulo',
    heroDescription: 'Moema é um dos bairros mais desejados de São Paulo, com localização privilegiada próxima ao Parque Ibirapuera, forte comércio e infraestrutura completa.',
    aboutTitle: 'Sobre Moema',
    aboutDescription: 'Moema oferece qualidade de vida com proximidade do Parque Ibirapuera, ruas arborizadas, forte comércio e gastronomia variada. O bairro é muito procurado por famílias e jovens profissionais.',
    neighborhoods: ['Moema', 'Moema Pássaros', 'Moema Índios'],
    attractions: ['Parque Ibirapuera', 'Shopping Ibirapuera', 'Praça Pereira Coutinho', 'Rua Normandia'],
    infrastructure: ['Metrô Moema', 'Hospital Alvorada', 'Escolas particulares', 'Shopping Ibirapuera'],
    highlights: ['Próximo ao Ibirapuera', 'Ruas arborizadas', 'Comércio forte', 'Ambiente familiar'],
    relatedRegions: [
      { name: 'Vila Mariana', slug: 'vila-mariana-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' },
      { name: 'Brooklin', slug: 'zona-sul-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 600.000 a R$ 5.000.000',
    transportInfo: 'Metrô Linha 5 Lilás (estações Moema, Eucaliptos). Próximo ao Aeroporto de Congonhas.'
  },

  'itaim-bibi-sp': {
    id: 'itaim-bibi-sp',
    heroTitle: 'Imóveis em Leilão no Itaim Bibi - São Paulo',
    heroDescription: 'O Itaim Bibi é o polo empresarial de São Paulo, com escritórios de grandes empresas, restaurantes renomados e imóveis de alto padrão.',
    aboutTitle: 'Sobre o Itaim Bibi',
    aboutDescription: 'O Itaim Bibi concentra o principal centro financeiro de São Paulo, com a Avenida Faria Lima abrigando bancos e empresas de tecnologia. O bairro oferece gastronomia de primeira e vida noturna sofisticada.',
    neighborhoods: ['Itaim Bibi', 'Vila Olímpia', 'Faria Lima'],
    attractions: ['Avenida Faria Lima', 'JK Iguatemi', 'Parque do Povo', 'Restaurantes estrelados'],
    infrastructure: ['Metrô Faria Lima', 'Hospitais de primeira', 'Shopping JK', 'Escolas bilíngues'],
    highlights: ['Centro financeiro', 'Alta valorização', 'Gastronomia premium', 'Vida corporativa'],
    relatedRegions: [
      { name: 'Jardins', slug: 'jardins-sp' },
      { name: 'Pinheiros', slug: 'pinheiros-sp' },
      { name: 'Vila Olímpia', slug: 'zona-sul-sp' }
    ],
    propertyTypes: ['Apartamentos executivos', 'Coberturas', 'Salas comerciais', 'Lajes corporativas'],
    averagePriceRange: 'R$ 700.000 a R$ 8.000.000',
    transportInfo: 'Metrô Linha 4 Amarela (estação Faria Lima). Ciclovias. Fácil acesso à Marginal Pinheiros.'
  },

  'vila-mariana-sp': {
    id: 'vila-mariana-sp',
    heroTitle: 'Imóveis em Leilão na Vila Mariana - São Paulo',
    heroDescription: 'A Vila Mariana é um bairro tradicional e residencial de São Paulo, com excelente infraestrutura, próximo ao Parque Ibirapuera e com fácil acesso ao metrô.',
    aboutTitle: 'Sobre a Vila Mariana',
    aboutDescription: 'A Vila Mariana combina tradição e modernidade, com ruas arborizadas, forte comércio, hospitais renomados e proximidade do Parque Ibirapuera. É um dos bairros mais procurados por famílias.',
    neighborhoods: ['Vila Mariana', 'Vila Clementino', 'Paraíso', 'Chácara Klabin'],
    attractions: ['Parque Ibirapuera', 'Hospital São Paulo', 'Shopping Santa Cruz', 'Praça Pedroso'],
    infrastructure: ['Metrô Vila Mariana', 'Hospital São Paulo/UNIFESP', 'Escolas tradicionais', 'Shopping Santa Cruz'],
    highlights: ['Próximo ao Ibirapuera', 'Metrô', 'Ambiente familiar', 'Hospitais renomados'],
    relatedRegions: [
      { name: 'Moema', slug: 'moema-sp' },
      { name: 'Paraíso', slug: 'zona-sul-sp' },
      { name: 'Aclimação', slug: 'zona-sul-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas', 'Studios'],
    averagePriceRange: 'R$ 400.000 a R$ 3.000.000',
    transportInfo: 'Metrô Linha 1 Azul (estações Vila Mariana, Santa Cruz, Ana Rosa). Ótima conectividade.'
  },

  'zona-sul-sp': {
    id: 'zona-sul-sp',
    heroTitle: 'Imóveis em Leilão na Zona Sul de São Paulo',
    heroDescription: 'A Zona Sul de São Paulo abriga bairros nobres como Moema, Vila Mariana, Brooklin e Campo Belo, oferecendo qualidade de vida, proximidade do Ibirapuera e excelente infraestrutura.',
    aboutTitle: 'Sobre a Zona Sul de SP',
    aboutDescription: 'A Zona Sul concentra alguns dos bairros mais valorizados de São Paulo, com condomínios de alto padrão, shoppings, parques e hospitais de excelência. Ideal para quem busca qualidade de vida.',
    neighborhoods: ['Moema', 'Vila Mariana', 'Brooklin', 'Campo Belo', 'Santo Amaro', 'Morumbi'],
    attractions: ['Parque Ibirapuera', 'Estádio Morumbi', 'Shopping Morumbi', 'Represa Guarapiranga'],
    infrastructure: ['Metrô', 'CPTM', 'Hospitais', 'Shoppings', 'Aeroporto de Congonhas'],
    highlights: ['Alto padrão', 'Infraestrutura completa', 'Parques', 'Valorização constante'],
    relatedRegions: [
      { name: 'Moema', slug: 'moema-sp' },
      { name: 'Vila Mariana', slug: 'vila-mariana-sp' },
      { name: 'Itaim Bibi', slug: 'itaim-bibi-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Casas em condomínio', 'Terrenos'],
    averagePriceRange: 'R$ 300.000 a R$ 10.000.000',
    transportInfo: 'Metrô Linhas 1, 5 e 9. CPTM. Acesso às Marginais. Aeroporto de Congonhas próximo.'
  },

  'zona-oeste-sp': {
    id: 'zona-oeste-sp',
    heroTitle: 'Imóveis em Leilão na Zona Oeste de São Paulo',
    heroDescription: 'A Zona Oeste paulistana reúne bairros descolados como Pinheiros e Vila Madalena, além de Perdizes e Alto de Pinheiros, oferecendo cultura, gastronomia e qualidade de vida.',
    aboutTitle: 'Sobre a Zona Oeste de SP',
    aboutDescription: 'A Zona Oeste é conhecida pela vida cultural intensa, universidades (USP, PUC), bairros arborizados e gastronomia diversificada. Reúne perfis variados, de estudantes a famílias tradicionais.',
    neighborhoods: ['Pinheiros', 'Vila Madalena', 'Perdizes', 'Alto de Pinheiros', 'Lapa', 'Butantã'],
    attractions: ['USP', 'Beco do Batman', 'Praça Benedito Calixto', 'Allianz Parque'],
    infrastructure: ['Metrô', 'CPTM', 'Hospitais', 'Universidades', 'Shoppings'],
    highlights: ['Cultura e arte', 'Universidades', 'Vida noturna', 'Bairros arborizados'],
    relatedRegions: [
      { name: 'Pinheiros', slug: 'pinheiros-sp' },
      { name: 'Jardins', slug: 'jardins-sp' },
      { name: 'Perdizes', slug: 'zona-oeste-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Casas em vilas', 'Studios', 'Coberturas'],
    averagePriceRange: 'R$ 300.000 a R$ 5.000.000',
    transportInfo: 'Metrô Linha 4 Amarela. CPTM. Ciclofaixas.'
  },

  'zona-norte-sp': {
    id: 'zona-norte-sp',
    heroTitle: 'Imóveis em Leilão na Zona Norte de São Paulo',
    heroDescription: 'A Zona Norte de São Paulo oferece bairros tradicionais como Santana e Tucuruvi, com ótimo custo-benefício, infraestrutura completa e fácil acesso ao Centro.',
    aboutTitle: 'Sobre a Zona Norte de SP',
    aboutDescription: 'A Zona Norte reúne bairros residenciais tradicionais, com forte comércio, parques e fácil acesso ao metrô. Oferece ótimo custo-benefício para famílias e investidores.',
    neighborhoods: ['Santana', 'Tucuruvi', 'Mandaqui', 'Casa Verde', 'Tremembé', 'Jaçanã'],
    attractions: ['Parque da Cantareira', 'Shopping Santana', 'Horto Florestal', 'Expo Center Norte'],
    infrastructure: ['Metrô Linha 1 Azul', 'CPTM', 'Hospitais', 'Shoppings', 'Escolas'],
    highlights: ['Custo-benefício', 'Parque da Cantareira', 'Metrô', 'Tradição'],
    relatedRegions: [
      { name: 'Santana', slug: 'zona-norte-sp' },
      { name: 'Centro SP', slug: 'centro-sp' },
      { name: 'Vila Maria', slug: 'zona-norte-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Sobrados', 'Salas comerciais'],
    averagePriceRange: 'R$ 200.000 a R$ 1.500.000',
    transportInfo: 'Metrô Linha 1 Azul. CPTM. Marginais Tietê e Pinheiros próximas.'
  },

  'zona-leste-sp': {
    id: 'zona-leste-sp',
    heroTitle: 'Imóveis em Leilão na Zona Leste de São Paulo',
    heroDescription: 'A Zona Leste é a maior região de São Paulo, oferecendo diversidade de bairros, forte comércio e preços acessíveis. Tatuapé, Mooca e Penha são os mais procurados.',
    aboutTitle: 'Sobre a Zona Leste de SP',
    aboutDescription: 'A Zona Leste oferece grande diversidade, desde bairros tradicionais como Tatuapé e Mooca até regiões em crescimento. É a região mais populosa e oferece ótimas oportunidades de investimento.',
    neighborhoods: ['Tatuapé', 'Mooca', 'Penha', 'Vila Carrão', 'Anália Franco', 'Itaquera'],
    attractions: ['Shopping Tatuapé', 'Arena Corinthians', 'Parque do Carmo', 'SESC Itaquera'],
    infrastructure: ['Metrô', 'CPTM', 'Hospitais', 'Shoppings', 'Universidades'],
    highlights: ['Maior população', 'Preços acessíveis', 'Metrô expandindo', 'Diversidade'],
    relatedRegions: [
      { name: 'Tatuapé', slug: 'zona-leste-sp' },
      { name: 'Mooca', slug: 'zona-leste-sp' },
      { name: 'Penha', slug: 'zona-leste-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Casas', 'Sobrados', 'Terrenos'],
    averagePriceRange: 'R$ 150.000 a R$ 1.200.000',
    transportInfo: 'Metrô Linha 3 Vermelha. CPTM. Radial Leste.'
  },

  'centro-sp': {
    id: 'centro-sp',
    heroTitle: 'Imóveis em Leilão no Centro de São Paulo',
    heroDescription: 'O Centro de São Paulo é o coração histórico e comercial da cidade, com prédios icônicos, forte comércio e excelente conectividade de transporte.',
    aboutTitle: 'Sobre o Centro de SP',
    aboutDescription: 'O Centro de São Paulo concentra a história da cidade, com prédios art déco, teatros, museus e forte comércio. A região está em processo de revitalização e oferece oportunidades de investimento.',
    neighborhoods: ['Sé', 'República', 'Bela Vista', 'Consolação', 'Santa Cecília', 'Liberdade'],
    attractions: ['Avenida Paulista', 'Theatro Municipal', 'MASP', 'Pinacoteca', 'Mercado Municipal'],
    infrastructure: ['Metrô', 'CPTM', 'Rodoviária Tietê', 'Hospitais', 'Universidades'],
    highlights: ['Patrimônio histórico', 'Transporte integrado', 'Cultura', 'Revitalização'],
    relatedRegions: [
      { name: 'Jardins', slug: 'jardins-sp' },
      { name: 'Bela Vista', slug: 'centro-sp' },
      { name: 'Liberdade', slug: 'centro-sp' }
    ],
    propertyTypes: ['Apartamentos', 'Studios', 'Salas comerciais', 'Prédios'],
    averagePriceRange: 'R$ 150.000 a R$ 1.500.000',
    transportInfo: 'Principal hub de metrô de SP (todas as linhas). Rodoviária Tietê. Terminais de ônibus.'
  }
};

/**
 * Retorna o conteúdo de uma região pelo ID
 */
export function getRegionContent(pageId: string): RegionContent | null {
  return regionContents[pageId] || null;
}

/**
 * Retorna todas as regiões de um estado
 */
export function getRegionsByState(estado: 'RJ' | 'SP'): RegionContent[] {
  return Object.values(regionContents).filter(region => {
    if (estado === 'RJ') {
      return region.id.endsWith('-rj');
    }
    return region.id.endsWith('-sp');
  });
}
