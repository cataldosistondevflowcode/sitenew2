/**
 * Script para gerar páginas HTML estáticas para SEO
 * 
 * Este script gera páginas HTML completas para cada região,
 * garantindo que o Google veja conteúdo único mesmo sem JavaScript.
 * 
 * Execução: npm run seo:static-pages
 */

const fs = require('fs');
const path = require('path');

// Dados das regiões - TODAS AS 25 PÁGINAS
const regionContents = {
  // ==================== RIO DE JANEIRO (15 páginas) ====================
  
  'copacabana-rj': {
    id: 'copacabana-rj',
    heroTitle: 'Imóveis em Leilão em Copacabana - Rio de Janeiro',
    heroDescription: 'Copacabana é um dos bairros mais icônicos do Rio de Janeiro, conhecido mundialmente por sua praia de 4km, calçadão em pedras portuguesas e vida cultural vibrante.',
    aboutTitle: 'Sobre Copacabana',
    aboutDescription: 'Copacabana oferece uma combinação única de tradição e modernidade. O bairro conta com excelente infraestrutura de transporte (metrô, ônibus), hospitais renomados, escolas tradicionais e uma vida noturna agitada.',
    neighborhoods: ['Leme', 'Copacabana', 'Posto 5', 'Posto 6'],
    attractions: ['Praia de Copacabana', 'Forte de Copacabana', 'Pedra do Leme', 'Beco das Garrafas'],
    infrastructure: ['Metrô Linha 1', 'Hospital Copa Star', 'Colégio Santo Inácio', 'Supermercados Zona Sul'],
    highlights: ['4km de orla', 'Calçadão histórico', 'Réveillon famoso', 'Vista para o Pão de Açúcar'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Botafogo', slug: 'botafogo-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos', 'Coberturas', 'Salas comerciais', 'Lojas'],
    averagePriceRange: 'R$ 400.000 a R$ 3.000.000',
    transportInfo: 'Estações de metrô: Cardeal Arcoverde, Siqueira Campos, Cantagalo.',
    metaTitle: 'Comprar Apartamento Copacabana: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Procura comprar apartamento em Copacabana? Encontre imóveis de leilão em Copacabana, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento copacabana, leilão de imóveis copacabana, leilão RJ',
    estado: 'RJ'
  },

  'ipanema-rj': {
    id: 'ipanema-rj',
    heroTitle: 'Imóveis em Leilão em Ipanema - Rio de Janeiro',
    heroDescription: 'Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção, o bairro oferece as melhores lojas e restaurantes.',
    aboutTitle: 'Sobre Ipanema',
    aboutDescription: 'Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo na Rua Garcia D\'Ávila e Visconde de Pirajá.',
    neighborhoods: ['Ipanema', 'Arpoador', 'Lagoa'],
    attractions: ['Praia de Ipanema', 'Pedra do Arpoador', 'Praça Nossa Senhora da Paz', 'Feira Hippie'],
    infrastructure: ['Metrô General Osório', 'Hospital São Lucas', 'Colégio Andrews', 'Shopping Leblon'],
    highlights: ['Pôr do sol no Arpoador', 'Rua Garcia D\'Ávila', 'Praça General Osório', 'Proximidade com Lagoa'],
    relatedRegions: [
      { name: 'Copacabana', slug: 'copacabana-rj' },
      { name: 'Leblon', slug: 'leblon-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de alto padrão', 'Coberturas', 'Casas'],
    averagePriceRange: 'R$ 800.000 a R$ 8.000.000',
    transportInfo: 'Estação de metrô General Osório. Linhas de ônibus para toda cidade.',
    metaTitle: 'Comprar Apartamento Ipanema: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Ipanema, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento ipanema, leilão de imóveis ipanema, leilão RJ',
    estado: 'RJ'
  },

  'leblon-rj': {
    id: 'leblon-rj',
    heroTitle: 'Imóveis em Leilão no Leblon - Rio de Janeiro',
    heroDescription: 'O Leblon é o bairro mais exclusivo do Rio de Janeiro, com o metro quadrado mais valorizado da cidade. Oferece segurança, tranquilidade e sofisticação.',
    aboutTitle: 'Sobre o Leblon',
    aboutDescription: 'O Leblon combina a beleza natural da praia com uma infraestrutura completa de serviços premium. Ruas arborizadas, restaurantes renomados e o Shopping Leblon.',
    neighborhoods: ['Leblon', 'Gávea', 'Jardim Botânico'],
    attractions: ['Praia do Leblon', 'Baixo Leblon', 'Mirante do Leblon', 'Shopping Leblon'],
    infrastructure: ['Metrô Antero de Quental', 'Hospital Barra D\'Or', 'Colégio Santo Agostinho', 'Shopping Leblon'],
    highlights: ['Metro quadrado mais caro do Rio', 'Ambiente familiar', 'Baixa criminalidade', 'Proximidade com PUC-Rio'],
    relatedRegions: [
      { name: 'Ipanema', slug: 'ipanema-rj' },
      { name: 'Gávea', slug: 'zona-sul-rj' },
      { name: 'Zona Sul RJ', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos de luxo', 'Coberturas duplex', 'Casas'],
    averagePriceRange: 'R$ 1.500.000 a R$ 15.000.000',
    transportInfo: 'Estações de metrô Antero de Quental e Jardim de Alah.',
    metaTitle: 'Comprar Apartamento Leblon: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão no Leblon, Rio de Janeiro. Leilões judiciais e extrajudiciais.',
    metaKeywords: 'comprar apartamento leblon, leilão de imóveis leblon, leilão RJ',
    estado: 'RJ'
  },

  'barra-tijuca-rj': {
    id: 'barra-tijuca-rj',
    heroTitle: 'Imóveis em Leilão na Barra da Tijuca - Rio de Janeiro',
    heroDescription: 'A Barra da Tijuca é o bairro que mais cresce no Rio de Janeiro, com infraestrutura moderna, condomínios de alto padrão e 18km de praia.',
    aboutTitle: 'Sobre a Barra da Tijuca',
    aboutDescription: 'A Barra da Tijuca é conhecida por seus grandes condomínios, shoppings de primeira linha e qualidade de vida. O bairro oferece opções para todos os perfis.',
    neighborhoods: ['Barra da Tijuca', 'Recreio', 'Itanhangá', 'São Conrado'],
    attractions: ['Praia da Barra', 'Barra Shopping', 'Village Mall', 'Parque Olímpico'],
    infrastructure: ['BRT TransOeste', 'Hospital Barra D\'Or', 'Colégios particulares', 'Shopping Village Mall'],
    highlights: ['18km de praia', 'Condomínios fechados', 'Shoppings modernos', 'Sede olímpica 2016'],
    relatedRegions: [
      { name: 'Recreio', slug: 'recreio-rj' },
      { name: 'Zona Oeste RJ', slug: 'zona-oeste-rj' },
      { name: 'São Conrado', slug: 'zona-sul-rj' }
    ],
    propertyTypes: ['Apartamentos em condomínio', 'Casas em condomínio', 'Coberturas', 'Salas comerciais'],
    averagePriceRange: 'R$ 350.000 a R$ 5.000.000',
    transportInfo: 'BRT TransOeste, linhas de ônibus. Acesso pela Linha Amarela e Av. das Américas.',
    metaTitle: 'Comprar Apartamento Barra da Tijuca: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão na Barra da Tijuca, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento barra tijuca, leilão de imóveis barra tijuca, leilão RJ',
    estado: 'RJ'
  },

  'botafogo-rj': {
    id: 'botafogo-rj',
    heroTitle: 'Imóveis em Leilão em Botafogo - Rio de Janeiro',
    heroDescription: 'Botafogo é um bairro tradicional da Zona Sul com vista privilegiada para o Pão de Açúcar e a Baía de Guanabara.',
    aboutTitle: 'Sobre Botafogo',
    aboutDescription: 'Botafogo oferece uma mistura única de prédios históricos e modernos, com forte comércio, vida cultural intensa e fácil acesso a toda cidade pelo metrô.',
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
    transportInfo: 'Estação de metrô Botafogo (integração com linhas 1 e 2). Diversas linhas de ônibus.',
    metaTitle: 'Comprar Apartamento Botafogo: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Botafogo, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento botafogo, leilão de imóveis botafogo, leilão RJ',
    estado: 'RJ'
  },

  'flamengo-rj': {
    id: 'flamengo-rj',
    heroTitle: 'Imóveis em Leilão no Flamengo - Rio de Janeiro',
    heroDescription: 'O Flamengo é um dos bairros mais tradicionais do Rio de Janeiro, com vista para a Baía de Guanabara e o maior parque urbano da cidade.',
    aboutTitle: 'Sobre o Flamengo',
    aboutDescription: 'O Flamengo oferece qualidade de vida com o Aterro do Flamengo à porta, prédios históricos, forte comércio e fácil acesso ao Centro e Zona Sul.',
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
    transportInfo: 'Estações de metrô Flamengo, Largo do Machado, Catete. Muitas linhas de ônibus.',
    metaTitle: 'Comprar Apartamento Flamengo: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão no Flamengo, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento flamengo, leilão de imóveis flamengo, leilão RJ',
    estado: 'RJ'
  },

  'laranjeiras-rj': {
    id: 'laranjeiras-rj',
    heroTitle: 'Imóveis em Leilão em Laranjeiras - Rio de Janeiro',
    heroDescription: 'Laranjeiras é um bairro residencial e tranquilo da Zona Sul, conhecido por suas ruas arborizadas, casarões históricos e proximidade com o Centro.',
    aboutTitle: 'Sobre Laranjeiras',
    aboutDescription: 'Laranjeiras combina a tranquilidade de um bairro residencial com a praticidade de estar próximo ao Centro e à Zona Sul.',
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
    transportInfo: 'Próximo ao metrô Largo do Machado. Linhas de ônibus para Centro e Zona Sul.',
    metaTitle: 'Comprar Apartamento Laranjeiras: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Laranjeiras, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento laranjeiras, leilão de imóveis laranjeiras, leilão RJ',
    estado: 'RJ'
  },

  'tijuca-rj': {
    id: 'tijuca-rj',
    heroTitle: 'Imóveis em Leilão na Tijuca - Rio de Janeiro',
    heroDescription: 'A Tijuca é o maior bairro da Zona Norte, famoso pela Floresta da Tijuca, forte comércio e excelente infraestrutura.',
    aboutTitle: 'Sobre a Tijuca',
    aboutDescription: 'A Tijuca é conhecida pela Floresta da Tijuca, o maior parque urbano do mundo, e por oferecer todas as facilidades de um grande centro urbano.',
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
    transportInfo: 'Estações de metrô Saens Peña, Afonso Pena, São Francisco Xavier.',
    metaTitle: 'Comprar Apartamento Tijuca: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão na Tijuca, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento tijuca, leilão de imóveis tijuca, leilão RJ',
    estado: 'RJ'
  },

  'recreio-rj': {
    id: 'recreio-rj',
    heroTitle: 'Imóveis em Leilão no Recreio dos Bandeirantes - Rio de Janeiro',
    heroDescription: 'O Recreio dos Bandeirantes oferece praias paradisíacas, condomínios de qualidade e um estilo de vida mais tranquilo.',
    aboutTitle: 'Sobre o Recreio',
    aboutDescription: 'O Recreio é conhecido por suas praias com ondas perfeitas para surf, condomínios com infraestrutura completa e um ritmo de vida mais calmo.',
    neighborhoods: ['Recreio', 'Vargem Grande', 'Vargem Pequena', 'Grumari'],
    attractions: ['Praia do Recreio', 'Praia do Pontal', 'Praia de Grumari', 'Reserva de Marapendi'],
    infrastructure: ['BRT TransOeste', 'Shopping Recreio', 'Hospitais particulares', 'Escolas'],
    highlights: ['Praias paradisíacas', 'Surf e esportes aquáticos', 'Condomínios com lazer', 'Natureza preservada'],
    relatedRegions: [
      { name: 'Barra da Tijuca', slug: 'barra-tijuca-rj' },
      { name: 'Zona Oeste RJ', slug: 'zona-oeste-rj' },
      { name: 'Vargem Grande', slug: 'zona-oeste-rj' }
    ],
    propertyTypes: ['Apartamentos em condomínio', 'Casas', 'Coberturas'],
    averagePriceRange: 'R$ 250.000 a R$ 2.000.000',
    transportInfo: 'BRT TransOeste. Acesso pela Av. das Américas.',
    metaTitle: 'Comprar Apartamento Recreio: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão no Recreio dos Bandeirantes, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento recreio, leilão de imóveis recreio, leilão RJ',
    estado: 'RJ'
  },

  'zona-sul-rj': {
    id: 'zona-sul-rj',
    heroTitle: 'Imóveis em Leilão na Zona Sul do Rio de Janeiro',
    heroDescription: 'A Zona Sul do Rio de Janeiro concentra os bairros mais valorizados da cidade, incluindo Copacabana, Ipanema, Leblon, Botafogo e Flamengo.',
    aboutTitle: 'Sobre a Zona Sul',
    aboutDescription: 'A Zona Sul carioca é sinônimo de qualidade de vida, com praias famosas, parques, metrô, hospitais de excelência e as melhores escolas.',
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
    transportInfo: 'Metrô Linhas 1 e 2. Diversas linhas de ônibus. Ciclovias.',
    metaTitle: 'Imóveis em Leilão na Zona Sul do Rio de Janeiro | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Sul do Rio de Janeiro. Copacabana, Ipanema, Leblon.',
    metaKeywords: 'leilão zona sul RJ, imóveis zona sul leilão',
    estado: 'RJ'
  },

  'zona-norte-rj': {
    id: 'zona-norte-rj',
    heroTitle: 'Imóveis em Leilão na Zona Norte do Rio de Janeiro',
    heroDescription: 'A Zona Norte é a maior região do Rio de Janeiro, oferecendo excelente custo-benefício, forte comércio e infraestrutura completa.',
    aboutTitle: 'Sobre a Zona Norte',
    aboutDescription: 'A Zona Norte oferece diversidade de bairros, desde áreas mais valorizadas como Tijuca e Vila Isabel até opções mais acessíveis.',
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
    transportInfo: 'Metrô, SuperVia (trens), BRT TransCarioca. Diversas linhas de ônibus.',
    metaTitle: 'Imóveis em Leilão na Zona Norte do Rio de Janeiro | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Norte do Rio de Janeiro. Tijuca, Méier, Vila Isabel.',
    metaKeywords: 'leilão zona norte RJ, imóveis zona norte leilão',
    estado: 'RJ'
  },

  'zona-oeste-rj': {
    id: 'zona-oeste-rj',
    heroTitle: 'Imóveis em Leilão na Zona Oeste do Rio de Janeiro',
    heroDescription: 'A Zona Oeste abriga a Barra da Tijuca, Recreio e Jacarepaguá, oferecendo condomínios modernos, praias extensas e qualidade de vida.',
    aboutTitle: 'Sobre a Zona Oeste',
    aboutDescription: 'A Zona Oeste é a região que mais cresce no Rio, com grandes condomínios, shoppings modernos e infraestrutura em constante evolução.',
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
    transportInfo: 'BRT TransOeste e TransOlímpica. Linhas de ônibus. Acesso pelas principais vias.',
    metaTitle: 'Imóveis em Leilão na Zona Oeste do Rio de Janeiro | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Oeste do Rio de Janeiro. Barra da Tijuca, Recreio, Jacarepaguá.',
    metaKeywords: 'leilão zona oeste RJ, imóveis zona oeste leilão',
    estado: 'RJ'
  },

  'niteroi-rj': {
    id: 'niteroi-rj',
    heroTitle: 'Imóveis em Leilão em Niterói - RJ',
    heroDescription: 'Niterói oferece qualidade de vida, praias paradisíacas como Icaraí e Itacoatiara, e vista privilegiada para o Rio de Janeiro.',
    aboutTitle: 'Sobre Niterói',
    aboutDescription: 'Niterói é conhecida pela alta qualidade de vida, praias limpas, forte comércio em Icaraí e infraestrutura completa.',
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
    transportInfo: 'Barcas para Praça XV. Ônibus pela Ponte Rio-Niterói. Acesso pela BR-101.',
    metaTitle: 'Comprar Apartamento Niterói: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Niterói, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento niterói, leilão de imóveis niterói, leilão RJ',
    estado: 'RJ'
  },

  'centro-rj': {
    id: 'centro-rj',
    heroTitle: 'Imóveis em Leilão no Centro do Rio de Janeiro',
    heroDescription: 'O Centro do Rio de Janeiro é o coração comercial e histórico da cidade, oferecendo fácil acesso a toda cidade.',
    aboutTitle: 'Sobre o Centro do RJ',
    aboutDescription: 'O Centro é a principal região comercial e financeira do Rio, com prédios históricos, museus, teatros e forte infraestrutura de transporte.',
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
    transportInfo: 'Metrô, VLT, Barcas, Aeroporto Santos Dumont. Principal hub de transporte do Rio.',
    metaTitle: 'Comprar Apartamento Centro RJ: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão no Centro do Rio de Janeiro.',
    metaKeywords: 'comprar apartamento centro rj, leilão de imóveis centro, leilão RJ',
    estado: 'RJ'
  },

  'meier-rj': {
    id: 'meier-rj',
    heroTitle: 'Imóveis em Leilão no Méier - Rio de Janeiro',
    heroDescription: 'O Méier é um dos bairros mais tradicionais da Zona Norte, conhecido pelo forte comércio do Calçadão e excelente infraestrutura.',
    aboutTitle: 'Sobre o Méier',
    aboutDescription: 'O Méier é o coração comercial da Zona Norte, com o famoso Calçadão, shoppings, hospitais e fácil acesso ao metrô.',
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
    transportInfo: 'Metrô Méier. Trem SuperVia. Diversas linhas de ônibus.',
    metaTitle: 'Comprar Apartamento Méier: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão no Méier, Rio de Janeiro.',
    metaKeywords: 'comprar apartamento méier, leilão de imóveis méier, leilão RJ',
    estado: 'RJ'
  },

  // ==================== SÃO PAULO (10 páginas) ====================

  'jardins-sp': {
    id: 'jardins-sp',
    heroTitle: 'Imóveis em Leilão nos Jardins - São Paulo',
    heroDescription: 'Os Jardins são o endereço mais prestigiado de São Paulo, reunindo lojas de grife, restaurantes sofisticados e imóveis de altíssimo padrão.',
    aboutTitle: 'Sobre os Jardins',
    aboutDescription: 'Os Jardins (Jardim Paulista, Jardim América, Jardim Europa) formam a região mais valorizada de São Paulo. Ruas arborizadas e apartamentos de luxo.',
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
    transportInfo: 'Metrô Linha 2 Verde (estações Consolação, Trianon-MASP). Próximo à Av. Paulista.',
    metaTitle: 'Comprar Apartamento Jardins SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão nos Jardins, São Paulo.',
    metaKeywords: 'comprar apartamento jardins sp, leilão de imóveis jardins',
    estado: 'SP'
  },

  'pinheiros-sp': {
    id: 'pinheiros-sp',
    heroTitle: 'Imóveis em Leilão em Pinheiros - São Paulo',
    heroDescription: 'Pinheiros é um dos bairros mais descolados de São Paulo, com vida noturna agitada, gastronomia diversificada e excelente infraestrutura.',
    aboutTitle: 'Sobre Pinheiros',
    aboutDescription: 'Pinheiros combina tradição e modernidade, com vilas charmosas, prédios novos, forte comércio e uma das vidas noturnas mais agitadas de São Paulo.',
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
    transportInfo: 'Metrô Linha 4 Amarela (estações Pinheiros, Faria Lima). Ciclovia.',
    metaTitle: 'Comprar Apartamento Pinheiros SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão em Pinheiros, São Paulo.',
    metaKeywords: 'comprar apartamento pinheiros sp, leilão de imóveis pinheiros',
    estado: 'SP'
  },

  'moema-sp': {
    id: 'moema-sp',
    heroTitle: 'Imóveis em Leilão em Moema - São Paulo',
    heroDescription: 'Moema é um dos bairros mais desejados de São Paulo, com localização privilegiada próxima ao Parque Ibirapuera.',
    aboutTitle: 'Sobre Moema',
    aboutDescription: 'Moema oferece qualidade de vida com proximidade do Parque Ibirapuera, ruas arborizadas, forte comércio e gastronomia variada.',
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
    transportInfo: 'Metrô Linha 5 Lilás (estações Moema, Eucaliptos). Próximo ao Aeroporto de Congonhas.',
    metaTitle: 'Comprar Apartamento Moema SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão em Moema, São Paulo.',
    metaKeywords: 'comprar apartamento moema sp, leilão de imóveis moema',
    estado: 'SP'
  },

  'itaim-bibi-sp': {
    id: 'itaim-bibi-sp',
    heroTitle: 'Imóveis em Leilão no Itaim Bibi - São Paulo',
    heroDescription: 'O Itaim Bibi é o polo empresarial de São Paulo, com escritórios de grandes empresas, restaurantes renomados e imóveis de alto padrão.',
    aboutTitle: 'Sobre o Itaim Bibi',
    aboutDescription: 'O Itaim Bibi concentra o principal centro financeiro de São Paulo, com a Avenida Faria Lima abrigando bancos e empresas de tecnologia.',
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
    transportInfo: 'Metrô Linha 4 Amarela (estação Faria Lima). Ciclovias. Fácil acesso à Marginal Pinheiros.',
    metaTitle: 'Comprar Apartamento Itaim Bibi SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Apartamentos em leilão no Itaim Bibi, São Paulo.',
    metaKeywords: 'comprar apartamento itaim bibi sp, leilão de imóveis itaim bibi',
    estado: 'SP'
  },

  'vila-mariana-sp': {
    id: 'vila-mariana-sp',
    heroTitle: 'Imóveis em Leilão na Vila Mariana - São Paulo',
    heroDescription: 'A Vila Mariana é um bairro tradicional e residencial de São Paulo, com excelente infraestrutura e próximo ao Parque Ibirapuera.',
    aboutTitle: 'Sobre a Vila Mariana',
    aboutDescription: 'A Vila Mariana combina tradição e modernidade, com ruas arborizadas, forte comércio, hospitais renomados e proximidade do Parque Ibirapuera.',
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
    transportInfo: 'Metrô Linha 1 Azul (estações Vila Mariana, Santa Cruz, Ana Rosa). Ótima conectividade.',
    metaTitle: 'Comprar Apartamento Vila Mariana SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão na Vila Mariana, São Paulo.',
    metaKeywords: 'comprar apartamento vila mariana sp, leilão de imóveis vila mariana',
    estado: 'SP'
  },

  'zona-sul-sp': {
    id: 'zona-sul-sp',
    heroTitle: 'Imóveis em Leilão na Zona Sul de São Paulo',
    heroDescription: 'A Zona Sul de São Paulo abriga bairros nobres como Moema, Vila Mariana, Brooklin e Campo Belo.',
    aboutTitle: 'Sobre a Zona Sul de SP',
    aboutDescription: 'A Zona Sul concentra alguns dos bairros mais valorizados de São Paulo, com condomínios de alto padrão, shoppings, parques e hospitais.',
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
    transportInfo: 'Metrô Linhas 1, 5 e 9. CPTM. Acesso às Marginais. Aeroporto de Congonhas próximo.',
    metaTitle: 'Imóveis em Leilão na Zona Sul de São Paulo | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Sul de São Paulo. Moema, Vila Mariana, Brooklin.',
    metaKeywords: 'leilão zona sul SP, imóveis zona sul são paulo leilão',
    estado: 'SP'
  },

  'zona-oeste-sp': {
    id: 'zona-oeste-sp',
    heroTitle: 'Imóveis em Leilão na Zona Oeste de São Paulo',
    heroDescription: 'A Zona Oeste paulistana reúne bairros descolados como Pinheiros e Vila Madalena, além de Perdizes e Alto de Pinheiros.',
    aboutTitle: 'Sobre a Zona Oeste de SP',
    aboutDescription: 'A Zona Oeste é conhecida pela vida cultural intensa, universidades (USP, PUC), bairros arborizados e gastronomia diversificada.',
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
    transportInfo: 'Metrô Linha 4 Amarela. CPTM. Ciclofaixas.',
    metaTitle: 'Imóveis em Leilão na Zona Oeste de São Paulo | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Oeste de São Paulo. Pinheiros, Vila Madalena.',
    metaKeywords: 'leilão zona oeste SP, imóveis zona oeste são paulo leilão',
    estado: 'SP'
  },

  'zona-norte-sp': {
    id: 'zona-norte-sp',
    heroTitle: 'Imóveis em Leilão na Zona Norte de São Paulo',
    heroDescription: 'A Zona Norte de São Paulo oferece bairros tradicionais como Santana e Tucuruvi, com ótimo custo-benefício e fácil acesso ao Centro.',
    aboutTitle: 'Sobre a Zona Norte de SP',
    aboutDescription: 'A Zona Norte reúne bairros residenciais tradicionais, com forte comércio, parques e fácil acesso ao metrô.',
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
    transportInfo: 'Metrô Linha 1 Azul. CPTM. Marginais Tietê e Pinheiros próximas.',
    metaTitle: 'Imóveis em Leilão na Zona Norte de São Paulo | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Norte de São Paulo. Santana, Tucuruvi.',
    metaKeywords: 'leilão zona norte SP, imóveis zona norte são paulo leilão',
    estado: 'SP'
  },

  'zona-leste-sp': {
    id: 'zona-leste-sp',
    heroTitle: 'Imóveis em Leilão na Zona Leste de São Paulo',
    heroDescription: 'A Zona Leste é a maior região de São Paulo, oferecendo diversidade de bairros, forte comércio e preços acessíveis.',
    aboutTitle: 'Sobre a Zona Leste de SP',
    aboutDescription: 'A Zona Leste oferece grande diversidade, desde bairros tradicionais como Tatuapé e Mooca até regiões em crescimento.',
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
    transportInfo: 'Metrô Linha 3 Vermelha. CPTM. Radial Leste.',
    metaTitle: 'Imóveis em Leilão na Zona Leste de São Paulo | Cataldo Siston',
    metaDescription: 'Encontre imóveis em leilão na Zona Leste de São Paulo. Tatuapé, Mooca, Penha.',
    metaKeywords: 'leilão zona leste SP, imóveis zona leste são paulo leilão',
    estado: 'SP'
  },

  'centro-sp': {
    id: 'centro-sp',
    heroTitle: 'Imóveis em Leilão no Centro de São Paulo',
    heroDescription: 'O Centro de São Paulo é o coração histórico e comercial da cidade, com prédios icônicos e excelente conectividade.',
    aboutTitle: 'Sobre o Centro de SP',
    aboutDescription: 'O Centro de São Paulo concentra a história da cidade, com prédios art déco, teatros, museus e forte comércio.',
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
    transportInfo: 'Principal hub de metrô de SP (todas as linhas). Rodoviária Tietê. Terminais de ônibus.',
    metaTitle: 'Comprar Apartamento Centro SP: Leilão de Imóveis | Cataldo Siston',
    metaDescription: 'Encontre apartamentos em leilão no Centro de São Paulo.',
    metaKeywords: 'comprar apartamento centro sp, leilão de imóveis centro são paulo',
    estado: 'SP'
  }
};

// Função para gerar HTML de uma página regional
function generatePageHTML(region) {
  const baseUrl = 'https://sitenew2.vercel.app';
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${region.metaTitle}</title>
  <meta name="description" content="${region.metaDescription}">
  <meta name="keywords" content="${region.metaKeywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${baseUrl}/catalogo/${region.id}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/catalogo/${region.id}">
  <meta property="og:title" content="${region.metaTitle}">
  <meta property="og:description" content="${region.metaDescription}">
  <meta property="og:site_name" content="Cataldo Siston Advogados">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Redirect para SPA quando JavaScript está habilitado -->
  <script>
    // Se JS está ativo, redireciona para a SPA (usuários normais)
    // Se JS está desabilitado (crawlers), mostra este HTML estático
    (function() {
      // Verifica se já está na SPA (evita loop)
      if (window.location.search.indexOf('spa=1') !== -1) {
        return; // Já redirecionou, não faz nada
      }
      var currentPath = window.location.pathname;
      // Remove .html se existir
      if (currentPath.endsWith('.html')) {
        currentPath = currentPath.slice(0, -5);
      }
      // Redireciona para a SPA mantendo a mesma rota
      window.location.replace(currentPath + '?spa=1');
    })();
  </script>
  
  <style>
    body { font-family: 'Quicksand', Arial, sans-serif; margin: 0; padding: 0; color: #191919; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    header { background: #3C3C3C; color: white; padding: 20px; text-align: center; }
    header h1 { font-family: 'Playfair Display', Georgia, serif; color: #d68e08; margin: 0 0 10px; }
    .hero { background: #EBE5DE; padding: 30px 20px; }
    .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-bottom: 15px; }
    section { padding: 25px 20px; }
    section h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .info-box h3 { font-size: 16px; margin-bottom: 10px; }
    .info-box ul { padding-left: 20px; margin: 0; }
    .info-box li { margin-bottom: 5px; }
    .cta { background: #d68e08; color: white; padding: 25px; text-align: center; margin: 20px 0; }
    .cta a { display: inline-block; background: white; color: #d68e08; padding: 12px 30px; text-decoration: none; font-weight: bold; }
    .related-links { background: #f5f5f5; padding: 25px; }
    .related-links ul { list-style: none; padding: 0; }
    .related-links li { margin-bottom: 10px; }
    .related-links a { color: #d68e08; text-decoration: none; }
    footer { background: #191919; color: white; padding: 30px 20px; text-align: center; }
    footer a { color: #d68e08; }
  </style>
</head>
<body>
  <header>
    <h1>Cataldo Siston Advogados</h1>
    <p>Especialistas em Leilões de Imóveis no Rio de Janeiro e São Paulo</p>
  </header>

  <div class="container">
    <section class="hero">
      <h1>${region.heroTitle}</h1>
      <p>${region.heroDescription}</p>
    </section>

    <section>
      <h2>${region.aboutTitle}</h2>
      <p>${region.aboutDescription}</p>
      
      <div class="info-grid">
        <div class="info-box">
          <h3>Bairros da Região</h3>
          <ul>
            ${region.neighborhoods.map(n => `<li>${n}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Atrações</h3>
          <ul>
            ${region.attractions.map(a => `<li>${a}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Infraestrutura</h3>
          <ul>
            ${region.infrastructure.map(i => `<li>${i}</li>`).join('\n            ')}
          </ul>
        </div>
        <div class="info-box">
          <h3>Diferenciais</h3>
          <ul>
            ${region.highlights.map(h => `<li>${h}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      
      <p style="margin-top: 20px;"><strong>Tipos de Imóveis:</strong> ${region.propertyTypes.join(', ')}</p>
      <p><strong>Faixa de Preço Médio:</strong> ${region.averagePriceRange}</p>
      <p><strong>Transporte:</strong> ${region.transportInfo}</p>
    </section>

    <div class="cta">
      <h2>Fale Conosco pelo WhatsApp</h2>
      <p>Receba oportunidades personalizadas de imóveis em leilão.</p>
      <a href="https://wa.me/5521977294848">Quero receber oportunidades</a>
    </div>

    <section class="related-links">
      <h2>Regiões Atendidas</h2>
      <p>Oferecemos assessoria para imóveis em leilão nas seguintes regiões:</p>
      <ul>
        ${region.relatedRegions.map(r => `<li><a href="${baseUrl}/catalogo/${r.slug}">Imóveis em Leilão em ${r.name}</a></li>`).join('\n        ')}
        <li><a href="${baseUrl}">Ver todos os imóveis em leilão</a></li>
      </ul>
    </section>

    <section>
      <h2>Entre em Contato</h2>
      <p><strong>WhatsApp:</strong> <a href="https://wa.me/5521977294848">+55 (21) 97729-4848</a></p>
      <p><strong>Telefone:</strong> <a href="tel:+552131733795">+55 (21) 3173-3795</a></p>
      <p><strong>Email:</strong> <a href="mailto:contato@cataldosiston-adv.com.br">contato@cataldosiston-adv.com.br</a></p>
      <p><strong>Site:</strong> <a href="https://leilaodeimoveis-cataldosiston.com">leilaodeimoveis-cataldosiston.com</a></p>
    </section>
  </div>

  <footer>
    <p>© 2025 Cataldo Siston Advogados. Todos os direitos reservados.</p>
    <p>Av. Rio Branco, 156, Gr. 3336 a 3339 - Centro - Rio de Janeiro - RJ</p>
    <nav style="margin-top: 15px;">
      <a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos de Sucesso</a> |
      <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a>
    </nav>
  </footer>
</body>
</html>`;
}

// Diretório de saída
const outputDir = path.join(__dirname, '..', 'public', 'catalogo');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar páginas
console.log('🚀 Gerando páginas estáticas para SEO...\n');

let count = 0;
for (const [id, region] of Object.entries(regionContents)) {
  const html = generatePageHTML(region);
  const filePath = path.join(outputDir, `${id}.html`);
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Gerado: /catalogo/${id}.html`);
  count++;
}

console.log(`\n📝 Total: ${count} páginas geradas em /public/catalogo/`);
console.log('🎯 Estas páginas serão servidas para crawlers sem JavaScript');
