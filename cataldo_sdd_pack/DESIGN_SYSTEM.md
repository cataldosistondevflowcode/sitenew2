# Design System — Cataldo Siston | Site Leilões RJ/SP
_Versão: 2.1 | Data: 2026-01-20_

> **REGRA CRÍTICA:** Todas as páginas do site de imóveis DEVEM seguir este design system para manter consistência visual com o site institucional (WordPress/Webflow).

---

## 1. Princípios de Design

### 1.1 Identidade Visual
O site Cataldo Siston transmite:
- **Profissionalismo** — escritório de advocacia especializado
- **Confiança** — mais de 1200 arrematações realizadas
- **Sofisticação** — uso de tipografia serifada em títulos
- **Clareza** — informações organizadas e hierarquia visual clara

### 1.2 Consistência
- Todas as páginas devem parecer parte do mesmo site
- O site de imóveis (React) deve ser indistinguível visualmente do site institucional
- Componentes reutilizáveis seguem os mesmos padrões

---

## 2. Tipografia

### 2.1 Fontes Principais

| Elemento | Fonte | Peso | Tamanho | Line-height |
|----------|-------|------|---------|-------------|
| **H1 (Títulos principais)** | `Playfair Display` | 500 | 44px | 1.2 (52.8px) |
| **H2 (Subtítulos)** | `Playfair Display` | 500 | 40px | 1.2 |
| **H3 (Seções)** | `Playfair Display` | 500 | 32px | 1.3 |
| **H4 (Cards/Destaques)** | `Quicksand` | 600 | 24px | 1.4 |
| **Corpo/Texto** | `Quicksand` | 400 | 17.6px | 1.6 |
| **Texto secundário** | `Quicksand` | 400 | 15px | 1.5 |
| **Botões** | `Quicksand` | 600 | 16px | 1 |
| **Labels/Tags** | `Quicksand` | 500 | 12px | 1 |

### 2.2 Configuração Tailwind

```javascript
// tailwind.config.js
fontFamily: {
  'display': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
  'body': ['Quicksand', 'Arial', 'Verdana', 'sans-serif'],
},
fontSize: {
  'xs': ['12px', { lineHeight: '1' }],
  'sm': ['15px', { lineHeight: '1.5' }],
  'base': ['17.6px', { lineHeight: '1.6' }],
  'lg': ['20px', { lineHeight: '1.5' }],
  'xl': ['24px', { lineHeight: '1.4' }],
  '2xl': ['32px', { lineHeight: '1.3' }],
  '3xl': ['40px', { lineHeight: '1.2' }],
  '4xl': ['44px', { lineHeight: '1.2' }],
}
```

### 2.3 Importação das Fontes

```html
<!-- No index.html ou _document -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Paleta de Cores

### 3.1 Cores Principais (CORRIGIDO)

> **IMPORTANTE:** Cores extraídas diretamente do site institucional em 2026-01-20.

| Nome | Hex | RGB | CSS Variable | Uso |
|------|-----|-----|--------------|-----|
| **Primary (Dourado)** | `#D68E08` | rgb(214, 142, 8) | `--color-primary` | CTAs, botões, links, logo "SISTON", destaques |
| **Primary Dark** | `#B87A07` | rgb(184, 122, 7) | `--color-primary-dark` | Hover de botões primários |
| **Grafite Escuro** | `#191919` | rgb(25, 25, 25) | `--color-grafite` | Texto principal, início de gradientes |
| **Grafite Médio** | `#464646` | rgb(70, 70, 70) | `--color-grafite-medio` | Final de gradientes, cards de destaque |
| **Grafite Claro** | `#3C3C3C` | rgb(60, 60, 60) | `--color-grafite-claro` | Top bar, elementos secundários |
| **Cinza Escuro** | `#333333` | rgb(51, 51, 51) | `--color-gray-dark` | Texto secundário |
| **Cinza Médio** | `#4A4A4A` | rgb(74, 74, 74) | `--color-gray-medium` | Texto terciário |
| **Branco** | `#FFFFFF` | rgb(255, 255, 255) | `--color-white` | Fundo principal, texto em fundos escuros |
| **Off-White** | `#FDFDFD` | rgb(253, 253, 253) | `--color-off-white` | Backgrounds suaves |
| **Bege/Cream** | `#EBE5DE` | rgb(235, 229, 222) | `--color-cream` | Seções alternadas (quando usado) |
| **Footer** | `#32373C` | rgb(50, 55, 60) | `--color-footer` | Background do footer |

### 3.2 Gradiente Grafite (Cards de Destaque)

O site usa um **gradiente grafite** nos cards de destaque do hero:

```css
/* Gradiente usado nos cards de destaque */
.grafite-gradient {
  background: linear-gradient(90deg, #191919 0%, #464646 100%);
}
```

### 3.3 Cores Semânticas

| Nome | Hex | Uso |
|------|-----|-----|
| **Success (WhatsApp)** | `#53A451` | Botão WhatsApp, confirmações |
| **Warning** | `#F59E0B` | Alertas, avisos |
| **Error** | `#DC2626` | Erros, validações |
| **Info** | `#0EA5E9` | Informações, dicas |

### 3.4 Configuração CSS Variables

```css
:root {
  /* Cores principais */
  --color-primary: #D68E08;
  --color-primary-dark: #B87A07;
  --color-primary-light: #F4A82A;
  
  /* Tons de Grafite/Cinza (paleta principal do site) */
  --color-grafite: #191919;
  --color-grafite-medio: #464646;
  --color-grafite-claro: #3C3C3C;
  --color-gray-dark: #333333;
  --color-gray-medium: #4A4A4A;
  
  /* Tons claros */
  --color-cream: #EBE5DE;
  --color-off-white: #FDFDFD;
  --color-white: #FFFFFF;
  
  /* Footer */
  --color-footer: #32373C;
  
  /* Texto */
  --text-primary: #191919;
  --text-secondary: #333333;
  --text-muted: #4A4A4A;
  --text-inverse: #FFFFFF;
  
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FDFDFD;
  --bg-tertiary: #EBE5DE;
  --bg-dark: #191919;
  --bg-footer: #32373C;
  
  /* Gradientes */
  --gradient-grafite: linear-gradient(90deg, #191919 0%, #464646 100%);
}
```

### 3.5 Configuração Tailwind

```javascript
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: '#D68E08',
    dark: '#B87A07',
    light: '#F4A82A',
  },
  grafite: {
    DEFAULT: '#191919',
    medio: '#464646',
    claro: '#3C3C3C',
  },
  gray: {
    dark: '#333333',
    medium: '#4A4A4A',
  },
  cream: '#EBE5DE',
  footer: '#32373C',
}
```

---

## 4. Componentes

### 4.1 Botões

#### Botão Primário (CTA Principal)
```css
.btn-primary {
  background-color: #D68E08;
  color: #FFFFFF;
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #B87A07;
}
```

#### Botão Secundário (Outline Dourado)
```css
.btn-secondary {
  background-color: transparent;
  color: #D68E08;
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 4px;
  border: 2px solid #D68E08;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #D68E08;
  color: #FFFFFF;
}
```

#### Botão WhatsApp
```css
.btn-whatsapp {
  background-color: #53A451;
  color: #FFFFFF;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
}
```

### 4.2 Cards de Destaque (Hero)

Os cards de destaque no hero usam o gradiente grafite:

```css
.card-destaque {
  background: linear-gradient(90deg, #191919 0%, #464646 100%);
  color: #FFFFFF;
  padding: 24px;
  text-align: center;
}

.card-destaque h3 {
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #FFFFFF;
}
```

### 4.3 Cards de Imóvel

```css
.property-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.property-card__price {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #D68E08;
}
```

### 4.4 Badges/Tags

```css
/* Badge tipo de leilão - JUDICIAL */
.badge-judicial {
  background: #191919;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

/* Badge tipo de leilão - EXTRAJUDICIAL */
.badge-extrajudicial {
  background: #D68E08;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
```

---

## 5. Layout e Seções

### 5.1 Estrutura de Página

```
┌─────────────────────────────────────────────┐
│  TOP BAR (bg: #3C3C3C - grafite claro)      │
│  Email | Telefone | Fale Conosco | Social   │
├─────────────────────────────────────────────┤
│  NAVBAR (bg: transparente ou branco)        │
│  Logo (CATALDO dourado, SISTON branco)      │
├─────────────────────────────────────────────┤
│  HERO (imagem de fundo + overlay escuro)    │
│  H1 + Subtítulo + CTA dourado               │
│  Cards de destaque (gradiente grafite)      │
├─────────────────────────────────────────────┤
│  CONTEÚDO (bg: #FFFFFF)                     │
├─────────────────────────────────────────────┤
│  SEÇÃO ALTERNADA (bg: #EBE5DE - bege)       │
├─────────────────────────────────────────────┤
│  CONTEÚDO (bg: #FFFFFF)                     │
├─────────────────────────────────────────────┤
│  CTA DESTACADO (bg: #D68E08 - dourado)      │
├─────────────────────────────────────────────┤
│  FOOTER (bg: #32373C)                       │
└─────────────────────────────────────────────┘
```

### 5.2 Backgrounds por Tipo de Seção

| Tipo de Seção | Background | Cor do Texto |
|---------------|------------|--------------|
| **Top Bar** | `#3C3C3C` (grafite claro) | Branco |
| **Navbar** | Transparente ou `#FFFFFF` | `#191919` |
| **Hero** | Imagem + overlay escuro | Branco |
| **Cards de Destaque** | Gradiente grafite `#191919 → #464646` | Branco |
| **Conteúdo padrão** | `#FFFFFF` | `#191919` |
| **Seção alternada** | `#EBE5DE` (cream/bege) | `#191919` |
| **CTA destacado** | `#D68E08` (dourado) | Branco |
| **Footer** | `#32373C` | Branco/Cinza claro |

### 5.3 Hero com Imagem de Fundo

O hero do site usa uma **imagem de fundo** (mármore/textura) com **overlay escuro**:

```html
<section class="relative">
  <!-- Imagem de fundo -->
  <div class="absolute inset-0 bg-cover bg-center" 
       style="background-image: url('/images/background-marmore.jpg')">
  </div>
  
  <!-- Overlay escuro -->
  <div class="absolute inset-0 bg-black/60"></div>
  
  <!-- Conteúdo -->
  <div class="relative z-10 container py-20">
    <h1 class="font-display text-4xl text-white mb-4">
      Advogados especialistas em leilão<br/>
      de imóveis e direito imobiliário
    </h1>
    <button class="btn-secondary border-primary text-primary hover:bg-primary hover:text-white">
      Entre em Contato →
    </button>
  </div>
  
  <!-- Cards de destaque -->
  <div class="relative z-10 grid grid-cols-3 gap-0">
    <div class="grafite-gradient p-6 text-center text-white">
      <p class="font-body font-semibold">Excelência acadêmica aliada à experiência de 19 anos...</p>
    </div>
    <!-- ... outros cards ... -->
  </div>
</section>
```

### 5.4 Espaçamentos

| Elemento | Espaçamento |
|----------|-------------|
| **Padding de seção** | `py-16` (64px) ou `py-20` (80px) |
| **Gap entre cards** | `gap-6` (24px) |
| **Margem entre seções** | `mb-16` (64px) |
| **Padding interno de cards** | `p-4` (16px) ou `p-6` (24px) |
| **Container max-width** | 1200px |

---

## 6. Header e Navegação

### 6.1 Top Bar (Barra Superior)

```html
<div class="bg-[#3C3C3C] py-3">
  <div class="container flex justify-between items-center">
    <!-- Contato -->
    <div class="flex items-center gap-4 text-white text-sm">
      <a href="mailto:..." class="flex items-center gap-2">
        ✉️ contato@cataldosiston-adv.com.br
      </a>
      <a href="tel:..." class="flex items-center gap-2">
        📞 +55 (21) 3173-3795
      </a>
      <button class="bg-[#53A451] text-white px-4 py-1 rounded text-sm">
        💬 Fale Conosco
      </button>
    </div>
    
    <!-- Social -->
    <div class="flex items-center gap-3 text-white">
      <a href="...">Facebook</a>
      <a href="...">Instagram</a>
      <a href="...">YouTube</a>
    </div>
  </div>
</div>
```

### 6.2 Logo

O logo tem duas partes:
- **"CATALDO"** — Cor branca (ou preta em fundo claro)
- **"SISTON"** — Cor dourada `#D68E08`
- **"ADVOGADOS"** — Cor branca com linhas decorativas

---

## 7. Footer

```html
<footer class="bg-[#32373C] py-12">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Logo e descrição -->
      <div>
        <img src="/logo-white.svg" alt="Cataldo Siston" class="h-10 mb-4" />
        <p class="text-gray-400 text-sm">
          Escritório especializado em leilões de imóveis e direito imobiliário.
        </p>
      </div>
      
      <!-- ... outras colunas ... -->
    </div>
    
    <!-- Copyright -->
    <div class="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400 text-sm">
      © 2026 Cataldo Siston Advogados. Todos os direitos reservados.
    </div>
  </div>
</footer>
```

---

## 8. Páginas Regionais (SEO)

### 8.1 Estrutura Obrigatória

As páginas regionais devem seguir esta estrutura:

1. **Header/Hero** (imagem + overlay escuro)
   - H1 com nome da região
   - Texto introdutório contextualizando a região
   
2. **Listagem de Imóveis** (bg: `#FFFFFF`)
   - Grid de cards de imóveis
   - Filtros aplicados automaticamente
   
3. **Carrossel de Imóveis Relacionados** (bg: `#FDFDFD`)
   
4. **CTA de Apoio** (bg: `#EBE5DE`)
   - "Não encontrou o que procurava? Entre em contato"
   
5. **Conteúdo Complementar** (bg: `#FFFFFF`)
   - Informações sobre bairros, infraestrutura
   
6. **Sobre a Empresa** (bg: gradiente grafite ou imagem)
   - Seção "Conheça a Cataldo Siston"
   
7. **Prova Social** (bg: `#FFFFFF`)
   - Casos de sucesso + carrossel de posts do blog
   
8. **CTA Final** (bg: `#D68E08`)
   - Último CTA de contato

---

## 9. Checklist de Consistência Visual

Antes de finalizar qualquer componente ou página, verificar:

### Tipografia
- [ ] Títulos (H1, H2, H3) usam `Playfair Display`
- [ ] Corpo de texto usa `Quicksand`
- [ ] Tamanhos de fonte seguem a escala definida
- [ ] Line-height está correto

### Cores
- [ ] Cor primária (dourado) é `#D68E08`
- [ ] Grafite escuro é `#191919`
- [ ] Bege/cream é `#EBE5DE`
- [ ] Texto escuro é `#191919` ou `#333333`
- [ ] Backgrounds alternam corretamente

### Botões
- [ ] Botões primários têm bg dourado `#D68E08` e texto branco
- [ ] Botões secundários têm borda dourada
- [ ] Border-radius é 4px
- [ ] Hover states funcionam

### Layout
- [ ] Container tem max-width 1200px
- [ ] Espaçamentos são consistentes (py-16, gap-6)
- [ ] Hero usa imagem com overlay escuro
- [ ] Cards de destaque usam gradiente grafite

### Comparação Visual
- [ ] Página foi comparada com site institucional
- [ ] Não há elementos "genéricos" ou "AI slop"
- [ ] Design é indistinguível do site institucional

---

## 10. Referências Visuais

### Sites de Referência
- **Quem Somos:** https://leilaodeimoveis-cataldosiston.com/escritorio-imobiliario/
- **Casos Reais:** https://leilaodeimoveis-cataldosiston.com/casos-reais/
- **Assessoria em Leilões:** https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/
- **Site de Imóveis:** https://imoveis.leilaodeimoveis-cataldosiston.com/

### Elementos-Chave a Replicar
1. Top bar grafite claro (#3C3C3C) com contatos
2. Logo com "SISTON" em dourado
3. Hero com imagem de fundo + overlay escuro
4. Cards de destaque com gradiente grafite
5. Seções alternando branco/bege
6. CTAs dourados (#D68E08)
7. Footer cinza escuro (#32373C)
8. Tipografia serifada (Playfair Display) em títulos

---

## 11. Anti-Padrões (O que NÃO fazer)

### ❌ Evitar
- Usar fontes genéricas (Inter, Roboto, Arial, system-ui)
- Usar verde escuro (#265C54) como cor principal do hero ⚠️ **ERRO ANTERIOR**
- Gradientes roxos ou cores "AI slop"
- Border-radius muito arredondados (> 8px em botões)
- Sombras muito fortes
- Cores primárias diferentes de #D68E08
- Tipografia toda sans-serif
- Espaçamentos inconsistentes

### ✅ Preferir
- Playfair Display para títulos
- Quicksand para corpo
- Dourado #D68E08 como cor de destaque
- Grafite #191919 para elementos escuros
- Imagem + overlay para heroes
- Gradiente grafite para cards de destaque
- Bege #EBE5DE para seções alternadas
- Design sofisticado e profissional

---

_Documento atualizado em 2026-01-20 após correção das cores baseada na análise visual do site institucional._

**Correções da versão 2.1:**
- Removido verde escuro (#265C54) que não existe no site
- Adicionado gradiente grafite (#191919 → #464646) para cards de destaque
- Corrigido top bar para #3C3C3C
- Corrigido footer para #32373C
- Adicionada informação sobre hero com imagem de fundo + overlay
