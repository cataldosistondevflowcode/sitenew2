# Especificação: Fallback HTML/CSS para SEO (JS OFF)

## Objetivo

Garantir que quando JavaScript está desativado, a página regional exiba **exatamente a mesma estrutura, textos, títulos, informações, formulários e componentes** da versão React, com a **única exceção sendo os filtros e listagem de imóveis**.

## Contexto

A LiveSEO identificou que crawlers (Googlebot) não executam JavaScript de forma confiável. Para SEO, o conteúdo crítico deve estar presente no HTML inicial.

---

## Mapeamento: React vs HTML Estático

### ✅ DEVE EXISTIR NO HTML ESTÁTICO (Paridade com React)

| # | Seção | Elementos Necessários |
|---|-------|----------------------|
| 1 | **Header Superior** | Barra com: email, telefone, botão "Fale Conosco", ícones redes sociais (Facebook, Instagram, YouTube) |
| 2 | **Header Principal** | Logo + Menu com 7 itens: Quem somos, Imóveis em Leilão, Assessoria em leilões, Direito Imobiliário, Casos Reais, Blog, Contato |
| 3 | **Hero** | Imagem de fundo (Rio/SP), H1 dinâmico, texto introdutório, botão CTA "Quero receber novas oportunidades" |
| 4 | **Vídeo Institucional** | Embed YouTube ou thumbnail com link para vídeo "Como Funciona a Nossa Assessoria em Leilões" |
| 5 | **Seção Oportunidades** | Subtítulo "OPORTUNIDADES DE IMÓVEIS EM LEILÃO", H2 "Imóveis até 50% abaixo da sua avaliação", disclaimer com link |
| 6 | **Sobre a Região** | H2 "Sobre [Região]", texto descritivo único |
| 7 | **[EXCEÇÃO]** | ~~Filtros de imóveis~~ - NÃO incluir |
| 8 | **[EXCEÇÃO]** | ~~Listagem de imóveis~~ - NÃO incluir |
| 9 | **CTA "Não encontrou"** | Fundo laranja, H2, texto, 2 botões (Fale Conosco, Buscar Imóveis), 2 links (Página de Contato, Assessoria em Leilões) |
| 10 | **Conheça mais sobre [Região]** | H2, Grid 4 colunas com ÍCONES: Bairros da Região, Atrações, Infraestrutura, Diferenciais |
| 11 | **Casos de Sucesso** | H2, 3 cards com thumbnails de vídeo YouTube, título, descrição, autor. Botão "Veja os nossos resultados" |
| 12 | **Depoimentos** | H2, aspas decorativas, texto do depoimento, autor, cargo, indicadores de paginação (visual estático) |
| 13 | **Newsletter + Contato** | Fundo escuro, H2 "Receba nossa newsletter", formulário (Nome, Email, Telefone, Enviar), bloco "Podemos ajudar" com 3 botões, foto do advogado |
| 14 | **Footer** | Logo, tagline, endereço, telefones, Mapa do Site (11 links), Entre em Contato (email + redes sociais) |
| 15 | **Copyright** | Texto + links Casos de Sucesso | Contato |

---

## Estrutura HTML Detalhada

### 1. Header Superior
```html
<div class="header-top">
  <div class="header-contact">
    <a href="mailto:contato@cataldosiston-adv.com.br">
      <img src="icon-email.svg" alt=""> contato@cataldosiston-adv.com.br
    </a>
    <a href="tel:+552131733795">
      <img src="icon-phone.svg" alt=""> +55 (21) 3173-3795
    </a>
    <a href="https://wa.me/5521977294848" class="btn-whatsapp">
      <img src="icon-whatsapp.svg" alt=""> Fale Conosco
    </a>
  </div>
  <div class="header-social">
    <a href="https://www.facebook.com/cataldosistonadvogados/"><img src="icon-facebook.svg" alt="Facebook"></a>
    <a href="https://www.instagram.com/cataldosiston.advogados/"><img src="icon-instagram.svg" alt="Instagram"></a>
    <a href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg"><img src="icon-youtube.svg" alt="YouTube"></a>
  </div>
</div>
```

### 2. Header Principal
```html
<header class="header-main">
  <a href="/" class="logo">
    <img src="logo-cataldo-siston.svg" alt="Cataldo Siston Advogados">
  </a>
  <nav>
    <ul>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem somos</a></li>
      <li><a href="/catalogo">Imóveis em Leilão</a></li>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria em leilões</a></li>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/">Direito Imobiliário</a></li>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos Reais</a></li>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/">Blog</a></li>
      <li><a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a></li>
    </ul>
  </nav>
</header>
```

### 3. Hero com Imagem de Fundo
```html
<section class="hero" style="background-image: url('hero-rio-de-janeiro.jpg')">
  <div class="hero-content">
    <h1>Imóveis em Leilão em {REGIÃO} - {CIDADE}</h1>
    <p class="hero-intro">{TEXTO_INTRODUTÓRIO}</p>
    <a href="https://wa.me/5521977294848?text=..." class="btn-cta">
      Quero receber novas oportunidades <span>›</span>
    </a>
  </div>
</section>
```

### 4. Vídeo Institucional
```html
<section class="video-section">
  <div class="video-wrapper">
    <!-- Thumbnail estático com link para YouTube -->
    <a href="https://www.youtube.com/watch?v=G8Wp2ju3CaU" target="_blank" class="video-thumbnail">
      <img src="video-thumbnail-assessoria.jpg" alt="Como Funciona a Nossa Assessoria em Leilões">
      <span class="play-button"></span>
    </a>
  </div>
</section>
```

### 5. Seção Oportunidades
```html
<section class="opportunities-section">
  <div class="section-header">
    <span class="dots">●●●</span>
    <span class="subtitle">OPORTUNIDADES DE IMÓVEIS EM LEILÃO</span>
    <span class="dots">●●●</span>
  </div>
  <h2>Imóveis até 50% abaixo da sua avaliação</h2>
  <p class="disclaimer">
    Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia. 
    Entenda como funciona o nosso estudo de viabilidade jurídica clicando 
    <a href="https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-importancia-analise-juridica/">aqui</a> 
    ou entre em contato conosco
  </p>
</section>
```

### 6. Sobre a Região (já existe, manter)

### 7-8. [EXCEÇÃO] Filtros e Listagem - NÃO INCLUIR

### 9. CTA "Não encontrou"
```html
<section class="cta-not-found">
  <div class="cta-content">
    <h2>Não encontrou o que estava procurando?</h2>
    <p>Entre em contato com nossa equipe especializada ou explore mais opções em nossa busca completa.</p>
    <div class="cta-buttons">
      <a href="https://wa.me/5521977294848" class="btn btn-outline">
        <img src="icon-chat.svg" alt=""> Fale Conosco
      </a>
      <a href="/catalogo" class="btn btn-outline">
        <img src="icon-search.svg" alt=""> Buscar Imóveis
      </a>
    </div>
  </div>
  <div class="cta-links">
    <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">
      <img src="icon-external.svg" alt=""> Página de Contato
    </a>
    <a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">
      <img src="icon-external.svg" alt=""> Assessoria em Leilões
    </a>
  </div>
</section>
```

### 10. Conheça mais sobre [Região] (com ícones)
```html
<section class="region-details">
  <h2>Conheça mais sobre {REGIÃO}</h2>
  <div class="details-grid">
    <div class="detail-card">
      <div class="card-header">
        <img src="icon-location.svg" alt="">
        <h3>Bairros da Região</h3>
      </div>
      <ul>
        <li>Leme</li>
        <li>Copacabana</li>
        <!-- ... -->
      </ul>
    </div>
    <div class="detail-card">
      <div class="card-header">
        <img src="icon-attraction.svg" alt="">
        <h3>Atrações</h3>
      </div>
      <ul><!-- ... --></ul>
    </div>
    <div class="detail-card">
      <div class="card-header">
        <img src="icon-building.svg" alt="">
        <h3>Infraestrutura</h3>
      </div>
      <ul><!-- ... --></ul>
    </div>
    <div class="detail-card">
      <div class="card-header">
        <img src="icon-star.svg" alt="">
        <h3>Diferenciais</h3>
      </div>
      <ul><!-- ... --></ul>
    </div>
  </div>
</section>
```

### 11. Casos de Sucesso (com vídeos)
```html
<section class="success-cases">
  <h2>Casos de Sucesso</h2>
  <div class="cases-grid">
    <article class="case-card">
      <a href="https://www.youtube.com/watch?v=nXMiKXmjEOs" target="_blank" class="video-link">
        <img src="thumbnail-ipanema.jpg" alt="Leilão de imóvel | Ipanema/RJ">
        <span class="play-icon"></span>
      </a>
      <div class="case-content">
        <h3>Leilão de imóvel | Ipanema/RJ</h3>
        <p>Caso real de imóvel em leilão em Ipanema, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.</p>
        <span class="author">Cataldo Siston Advogados</span>
      </div>
    </article>
    <!-- Mais 2 cards -->
  </div>
  <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" class="btn btn-primary">
    Veja os nossos resultados
  </a>
</section>
```

### 12. Depoimentos (estático)
```html
<section class="testimonials" style="background-image: url('marble-texture.jpg')">
  <h2>Depoimentos</h2>
  <div class="quote-icon">❝</div>
  <div class="testimonial-content">
    <blockquote>
      <p>Como cliente e parceiro de negócios do escritório Cataldo Siston há quase 10 anos...</p>
      <!-- texto completo -->
    </blockquote>
    <div class="testimonial-author">
      <strong>Felipe Bueno</strong>
      <span>PRESIDENTE DA BX CAPITAL</span>
    </div>
  </div>
  <div class="testimonial-dots">
    <span class="dot active"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</section>
```

### 13. Newsletter + Contato
```html
<section class="newsletter-section" style="background-image: url('office-dark.jpg')">
  <div class="newsletter-form">
    <h2>Receba nossa newsletter</h2>
    <form action="#" method="post">
      <input type="text" name="nome" placeholder="Nome*" required>
      <input type="email" name="email" placeholder="Email*" required>
      <input type="tel" name="telefone" placeholder="Telefone*" required>
      <button type="submit">ENVIAR</button>
    </form>
    <div class="contact-block">
      <h3>Podemos ajudar a solucionar o seu caso!</h3>
      <div class="contact-buttons">
        <a href="https://wa.me/5521977294848">
          <img src="icon-whatsapp.svg" alt=""> WhatsApp
        </a>
        <a href="mailto:contato@cataldosiston-adv.com.br">
          <img src="icon-email.svg" alt=""> Email
        </a>
        <a href="tel:+552131733795">
          <img src="icon-phone.svg" alt=""> Telefone
        </a>
      </div>
    </div>
  </div>
  <div class="lawyer-photo">
    <img src="advogado-cataldo.jpg" alt="Advogado Cataldo">
  </div>
</section>
```

### 14. Footer (completo)
```html
<footer>
  <div class="footer-content">
    <div class="footer-col">
      <img src="logo-cataldo-siston.svg" alt="Cataldo Siston Advogados">
      <p>Leilões de imóveis e advocacia imobiliária</p>
      <address>
        Av. Rio Branco, 156, Gr. 3336 a 3339 Centro<br>
        - Rio de Janeiro - RJ - Brasil<br>
        <a href="tel:+552131733795">+55 (21) 3173-3795</a><br>
        <a href="tel:+5521977294848">+55 (21) 97729-4848</a>
      </address>
    </div>
    <div class="footer-col">
      <h3>Mapa do Site</h3>
      <ul>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/escritorio/">Quem Somos</a></li>
        <li><a href="/">Imóveis em Leilão RJ</a></li>
        <li><a href="/leilao-sp">Imóveis em Leilão SP</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/">Assessoria em leilões</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/">Direito Imobiliário</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/distrato-imobiliario/">Distrato imobiliário</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/?page_id=1052">Direito civil</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos Reais</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/">Blog</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a></li>
        <li><a href="https://leilaodeimoveis-cataldosiston.com/privacidade/">Política de Privacidade</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Entre em Contato</h3>
      <p>Tire suas dúvidas ou siga-nos nas redes sociais</p>
      <a href="mailto:contato@cataldosiston-adv.com.br">contato@cataldosiston-adv.com.br</a>
      <div class="social-links">
        <a href="https://www.facebook.com/cataldosistonadvogados/"><img src="icon-facebook.svg" alt="Facebook"></a>
        <a href="https://www.instagram.com/cataldosiston.advogados/"><img src="icon-instagram.svg" alt="Instagram"></a>
        <a href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg"><img src="icon-youtube.svg" alt="YouTube"></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 Cataldo Siston Advogados. Todos os direitos reservados.</p>
    <p>
      <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/">Casos de Sucesso</a> | 
      <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/">Contato</a>
    </p>
  </div>
</footer>
```

---

## Assets Necessários

### Imagens
- `logo-cataldo-siston.svg` - Logo da empresa
- `hero-rio-de-janeiro.jpg` - Imagem de fundo hero (RJ)
- `hero-sao-paulo.jpg` - Imagem de fundo hero (SP)
- `video-thumbnail-assessoria.jpg` - Thumbnail do vídeo institucional
- `thumbnail-ipanema.jpg` - Thumbnail caso de sucesso Ipanema
- `thumbnail-botafogo.jpg` - Thumbnail caso de sucesso Botafogo
- `thumbnail-fonte-saudade.jpg` - Thumbnail caso de sucesso Fonte da Saudade
- `marble-texture.jpg` - Textura mármore para depoimentos
- `office-dark.jpg` - Fundo escuro para newsletter
- `advogado-cataldo.jpg` - Foto do advogado

### Ícones
- `icon-email.svg`
- `icon-phone.svg`
- `icon-whatsapp.svg`
- `icon-facebook.svg`
- `icon-instagram.svg`
- `icon-youtube.svg`
- `icon-location.svg`
- `icon-attraction.svg`
- `icon-building.svg`
- `icon-star.svg`
- `icon-chat.svg`
- `icon-search.svg`
- `icon-external.svg`

---

## Dados Dinâmicos por Região

Os seguintes campos devem ser preenchidos dinamicamente do `region-content.json`:

```json
{
  "slug": "copacabana-rj",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "regiao": "Copacabana",
  "metaTitle": "...",
  "metaDescription": "...",
  "heroDescription": "...",
  "aboutText": "...",
  "neighborhoods": [...],
  "attractions": [...],
  "infrastructure": [...],
  "highlights": [...],
  "propertyTypes": [...],
  "priceRange": "...",
  "transport": "...",
  "relatedRegions": [...],
  "successCases": [...]
}
```

---

## Checklist de Validação

Para cada página regional, verificar (com JS desativado):

- [ ] Header superior com email, telefone, WhatsApp, redes sociais
- [ ] Header principal com logo e menu 7 itens
- [ ] Hero com imagem de fundo, H1, texto, CTA
- [ ] Vídeo institucional (thumbnail clicável)
- [ ] Seção "Oportunidades" com subtítulo, H2, disclaimer
- [ ] Seção "Sobre [Região]" com texto único
- [ ] CTA "Não encontrou" com botões e links
- [ ] Seção "Conheça mais" com 4 colunas e ícones
- [ ] Casos de Sucesso com 3 vídeos (thumbnails)
- [ ] Depoimentos com texto e indicadores
- [ ] Newsletter com formulário funcional
- [ ] Footer completo com 3 colunas
- [ ] Copyright com links

---

## Próximos Passos

Ver `docs/SEO_FALLBACK_SPRINTS.md` para o plano de implementação.
