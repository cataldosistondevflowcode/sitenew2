# 📋 O QUE PODE SER ALTERADO NO CMS (Sprint v7)

_Documento de Escopo — O que foi implementado e o que é editável_  
_Data: 2026-02-03_

---

## ✅ RESPOSTA RÁPIDA

**SIM!** É possível alterar **quase todo o conteúdo** do site através do CMS.

**O QUE PODE SER EDITADO:**
- ✅ Textos (simples)
- ✅ Textos formatados (negrito, itálico, links, etc)
- ✅ Imagens (upload + seleção)
- ✅ **Botões de Ação (CTAs)** com validação robusta
- ✅ **Listas** com múltiplos itens e estilos
- ✅ **FAQs** com perguntas e respostas
- ✅ Todas as páginas do site: Home, Quem Somos, Assessoria, etc

**O QUE NÃO PODE SER EDITADO:**
- ❌ Layout/Design do site (ex: cores, posição dos elementos)
- ❌ Tabela de imóveis (BD de propriedades)
- ❌ Filtros de busca/categorias
- ❌ Funcionalidades core (SEO, listagem, etc)

---

## 📑 PÁGINAS EDITÁVEIS

### Estrutura de Páginas

```
CMS do Site
├── 🏠 HOME
│   ├── Hero (imagem + título + CTA)
│   ├── Sobre (texto)
│   ├── Serviços (lista)
│   ├── Depoimentos (FAQ)
│   └── CTA Final (botão)
│
├── 👥 QUEM SOMOS
│   ├── Título
│   ├── Descrição (richtext)
│   ├── Equipe (lista)
│   └── FAQ
│
├── 📋 ASSESSORIA
│   ├── Título
│   ├── Conteúdo (richtext)
│   ├── Passos (lista numerada)
│   ├── Preços (tabela/list)
│   └── FAQ
│
├── ⚖️ DIREITO IMOBILIÁRIO
│   ├── Título
│   ├── Conteúdo (richtext)
│   ├── Serviços (lista)
│   ├── Casos Reais (lista)
│   └── FAQ
│
├── 💼 CASOS REAIS
│   ├── Título
│   ├── Casos (lista)
│   └── Depoimentos (FAQ)
│
├── 📝 BLOG
│   ├── Título
│   ├── Posts (lista com links)
│   └── Categorias (lista)
│
├── 📞 CONTATO
│   ├── Título
│   ├── Endereço (texto)
│   ├── Telefone (texto)
│   ├── Email (texto)
│   ├── Horário (texto)
│   └── CTA (botão)
│
└── 🗺️ PÁGINAS REGIONAIS (RJ/SP)
    ├── Título (por região)
    ├── Descrição (por região)
    ├── CTA (por região)
    └── FAQ (por região)
```

---

## 🎯 TIPOS DE BLOCOS EDITÁVEIS (Sprint v7)

### 1. **TEXT** — Texto Simples
```
✅ O que pode fazer:
   - Digitar/editar texto
   - Limite de caracteres
   - Validação básica

❌ O que NÃO pode fazer:
   - Formatar (negrito, itálico)
   - Adicionar links
   - Inserir imagens
```

**Exemplo:**
```
Bloco: "hero_title"
Tipo: text
Editar: "Bem-vindo à Cataldo Siston Imóveis"
```

---

### 2. **RICHTEXT** — Texto Formatado (HTML)
```
✅ O que pode fazer:
   - Negrito, itálico, sublinhado
   - Títulos (H1, H2, H3, etc)
   - Listas numeradas e com bullets
   - Links
   - Blocos de código (se necessário)
   - Imagens inline

✅ Editor: TipTap (tipo WordPress)
```

**Exemplo:**
```
Bloco: "about_content"
Tipo: richtext
Editar: "
  <h2>Quem Somos</h2>
  <p>Somos uma <strong>empresa especializada</strong> em imóveis...</p>
  <ul>
    <li>Experiência de 20 anos</li>
    <li>Equipe profissional</li>
  </ul>
"
```

---

### 3. **IMAGE** — Imagens
```
✅ O que pode fazer:
   - Upload de imagem (jpg, png, webp)
   - Selecionar de biblioteca existente
   - Editar alt text (SEO)
   - Editar título/descrição

✅ Limites:
   - Tamanho máx: 5MB
   - Formatos: jpg, png, webp
```

**Exemplo:**
```
Bloco: "hero_image"
Tipo: image
Editar:
  - Upload: /img/hero-novo.jpg
  - Alt text: "Vista de apartamento de luxo em Copacabana"
  - Título: "Imóvel em Copacabana, RJ"
```

---

### 4. **CTA** — Botão de Ação (NOVO SPRINT v7)
```
✅ O que pode fazer:
   - Texto do botão (ex: "Comprar Agora")
   - URL (http, https, mailto, tel, /internal-route)
   - Estilo (5 cores):
     • primary (dourado)
     • secondary (outline)
     • warning (laranja)
     • danger (vermelho)
     • success (verde)
   - Target (_self = mesma aba, _blank = nova aba)
   - Preview responsivo (mobile/tablet/desktop)
   - Validação inteligente (URL com sugestões)

✅ Validação Robusta:
   ✓ URL obrigatória
   ✓ Formato correto (http://, https://, mailto:, etc)
   ✓ Se digitar URL sem protocolo → sugestão automática
   ✓ Botão bloqueado até corrigir erro
```

**Exemplo:**
```
Bloco: "hero_cta"
Tipo: cta
Editar:
  - Texto: "Agende uma Consulta"
  - URL: "https://calendly.com/cataldo"
  - Estilo: "primary" (fica dourado)
  - Target: "_blank" (abre em nova aba)
  - Resultado: Botão dourado clicável
```

---

### 5. **LIST** — Lista de Itens (NOVO SPRINT v7)
```
✅ O que pode fazer:
   - Adicionar múltiplos items
   - Reordenar itens com DRAG-DROP
   - Toggle "Lista Numerada":
     • Ativado: 1, 2, 3, ... (ol)
     • Desativado: •, •, • (ul)
   - Escolher estilo de ícone:
     • Padrão (•)
     • Checkmark (✓)
     • Arrow (→)
   - Importar em lote (remover duplicatas)
   - Validação: 1-100 itens

✅ Drag-Drop:
   - Clique e arraste item para reordenar
   - Sem limite de reordenações
```

**Exemplo:**
```
Bloco: "services_list"
Tipo: list
Editar:
  Estilo: "Numerada com Checkmark"
  Items:
    1. ✓ Consulta Imobiliária
    2. ✓ Análise de Contratos
    3. ✓ Suporte Jurídico
  Reordenar: Arrastar item 2 para posição 1
  Importação: Cola texto com múltiplos items
```

---

### 6. **FAQ** — Perguntas e Respostas (NOVO SPRINT v7)
```
✅ O que pode fazer:
   - Adicionar perguntas + respostas
   - Respostas com QUEBRAS DE LINHA
   - Respostas formatadas (bold, itálico, links)
   - Importar em lote (formato: "Q|A")
   - Campo de busca (filtro em tempo real):
     • Se > 3 items, mostra busca automática
     • Digitar "como" → filtra perguntas com "como"
   - Toggle "Múltiplas Aberturas":
     • Desativado (padrão): Accordion (1 aberta)
     • Ativado: Checklist (múltiplas abertas)
   - Validação: 1-100 FAQs

✅ Comportamentos:
   Accordion (padrão):
     - Clica em FAQ1 → expande
     - Clica em FAQ2 → FAQ1 colapsa, FAQ2 expande
   
   Checklist (múltiplas):
     - Clica em FAQ1 → expande
     - Clica em FAQ2 → AMBAS ficam abertas
```

**Exemplo:**
```
Bloco: "home_faq"
Tipo: faq
Editar:
  Comportamento: "Múltiplas Aberturas"
  Items:
    {
      Q: "O que é um leilão imobiliário?"
      A: "Um leilão é um processo onde o imóvel é vendido
         para o maior lance.\n\nO valor inicial é baseado..."
    },
    {
      Q: "Como faço para comprar?"
      A: "1. Cadastre-se na plataforma\n2. Analise os imóveis..."
    }
  Busca: Digitar "leilão" → mostra apenas pergunta 1
  Importação: Cola múltiplas perguntas/respostas em lote
```

---

## 🔐 PÁGINA DE EXEMPLO: HOME

Vamos ver o que pode ser editado na HOME:

```
┌─────────────────────────────────────────┐
│           PÁGINA: HOME                  │
│         (Editável via CMS)              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ HERO SECTION                    │  │
│  │                                 │  │
│  │ [Image] ← CAN EDIT              │  │
│  │ Bem-vindo à Cataldo ← CAN EDIT  │  │
│  │ [Button: Consulta] ← CAN EDIT   │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ SOBRE SEÇÃO                     │  │
│  │                                 │  │
│  │ Texto: "Somos especialistas..." │  │
│  │ ← CAN EDIT (richtext)           │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ SERVIÇOS (LIST)                 │  │
│  │                                 │  │
│  │ ✓ Consultoria Jurídica          │  │
│  │ ✓ Avaliação de Imóveis          │  │ ← CAN EDIT (list)
│  │ ✓ Negociação de Contratos       │  │   - Reordenar
│  │                                 │  │   - Adicionar/remover
│  │                                 │  │   - Importar em lote
│  │ Estilo: "Checkmark"             │  │   - Numérico/bullets
│  │ ← CAN EDIT                      │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ FAQ SEÇÃO                       │  │
│  │                                 │  │
│  │ Q: O que vocês fazem?           │  │
│  │ A: Oferecemos serviços... ← EDIT │  │ ← CAN EDIT (faq)
│  │                                 │  │   - Perguntas/respostas
│  │ Q: Como contratar?              │  │   - Buscar/filtrar
│  │ A: Chame nosso whatsapp... ← EDIT│   │   - Importar Q&A
│  │                                 │  │   - Accordion/checklist
│  │ ← CAN EDIT                      │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ CTA FINAL                       │  │
│  │                                 │  │
│  │ [Button: Fale Conosco]          │  │
│  │ Estilo: warning (laranja)       │  │
│  │ Link: WhatsApp                  │  │ ← CAN EDIT
│  │ Target: _blank                  │  │
│  │ ← CAN EDIT                      │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘

✅ TUDO ACIMA: Editável via CMS
❌ NÃO EDITÁVEL:
   - Layout/grid das seções
   - Cores de fundo
   - Fontes/tamanhos
   - Espaçamentos
   - Estrutura HTML
```

---

## 🎨 O QUE NÃO PODE SER EDITADO

### ❌ Decisões de Design (fixas)

```
✗ Cores de fundo das seções
✗ Espaçamento entre elementos
✗ Tamanho das fontes
✗ Posição dos elementos na página
✗ Layout responsivo (mobile, tablet, desktop)
✗ Animações e transições
✗ Tema escuro/claro
✗ Fonte tipográfica
```

**Por quê?** Alterar design requer mudança no código frontend (React/CSS), não em dados.

---

### ❌ Dados de Imóveis (BD separada)

```
✗ Adicionar/editar propriedades
✗ Preços dos imóveis
✗ Fotos de imóveis
✗ Detalhes de localização
✗ Características de cada imóvel
✗ Status de venda
```

**Por quê?** Tabela `imoveis` é gerenciada separadamente. CMS foca em conteúdo editável.

---

### ❌ Funcionalidades Core

```
✗ Sistema de busca
✗ Filtros de imóveis (bairro, preço, etc)
✗ Geolocalização
✗ Cálculo de hipoteca
✗ Sistema de login/cadastro
✗ Carrinho de compras
✗ Checkout
✗ Integração com APIs (CEP, bancária, etc)
```

---

## 📊 TABELA COMPARATIVA

| O que | Pode editar? | Onde | Como |
|------|---------|-------|------|
| Texto página | ✅ SIM | CMS Admin | TEXT/RICHTEXT |
| Imagem | ✅ SIM | CMS Admin | IMAGE |
| Botão (CTA) | ✅ SIM | CMS Admin | CTA |
| Lista items | ✅ SIM | CMS Admin | LIST |
| FAQ | ✅ SIM | CMS Admin | FAQ |
| Cores | ❌ NÃO | Código | React/CSS |
| Layout | ❌ NÃO | Código | React/CSS |
| Imóveis | ❌ NÃO | DB separada | Supabase `imoveis` |
| Busca | ❌ NÃO | Código | React/API |
| Filtros | ❌ NÃO | Código | React/API |

---

## 🔄 FLUXO DE EDIÇÃO

```
1. ADMIN ENTRA NO CMS
   /admin/cms/pages

2. SELECIONA PÁGINA A EDITAR
   /admin/cms/pages/home/edit

3. VISUALIZA BLOCOS
   - Hero Image (type: image)
   - Hero Title (type: text)
   - Hero CTA (type: cta)
   - Services List (type: list)
   - FAQ (type: faq)

4. CLICA EM BLOCO PARA EDITAR
   /admin/cms/pages/home/blocks/hero_cta

5. EDITOR APARECE
   INPUT: Texto do botão
   INPUT: URL (com validação)
   DROPDOWN: Estilo (5 cores)
   DROPDOWN: Target (_self, _blank)
   PREVIEW: Renderiza botão em tempo real

6. SALVA COMO DRAFT
   Status: "Rascunho"
   Site público: não muda

7. VISUALIZA PREVIEW
   /preview/home?token=xxx
   Mostra página com conteúdo draft

8. PUBLICA
   Status: "Publicada ✓"
   Site público: atualiza

9. SITE PÚBLICO RENDERIZA
   www.cataldosiston.com
   Mostra conteúdo publicado
```

---

## 🚀 EXEMPLO PRÁTICO: EDITAR FAQ

### Cenário: Adicionar nova pergunta na Home

**ANTES (v1):** Tinha que mexer no código  
**DEPOIS (Sprint v7):** Apenas clicar em editar

```
1. Abrir /admin/cms/pages/home/edit
2. Clicar em bloco "home_faq"
3. Clicar botão "+ Adicionar FAQ"
4. Preencher:
   Pergunta: "Quanto custa sua consultoria?"
   Resposta: "Oferecemos pacotes personalizados
            de R$ 500 a R$ 5.000 conforme
            complexidade do caso."
5. Clicar "Salvar Rascunho"
6. Clicar "Pré-visualizar" → ver FAQ na página
7. Clicar "Publicar" → vai ao ar
8. Site www.cataldosiston.com mostra nova FAQ
```

**Tempo:** 2 minutos (sem programador)  
**Validação:** Automática (perguntas/respostas obrigatórias)  
**Revert:** Se não gostar, reverter versão anterior com 1 clique

---

## 💼 PARA O CLIENTE

### ✅ O QUE VOCÊ CONSEGUE FAZER (Sozinho)

```
✓ Editar textos de apresentação
✓ Atualizar descrição de serviços
✓ Mudar botões de CTA (texto, link, cor)
✓ Reordenar listas com drag-drop
✓ Adicionar/remover FAQs
✓ Trocar imagens
✓ Publicar/reverter alterações
✓ Ver preview antes de publicar
✓ Importar múltiplos items em lote
```

### ❌ O QUE VOCÊ NÃO CONSEGUE FAZER (Precisa programador)

```
✗ Alterar cores/layout
✗ Adicionar novas seções/páginas
✗ Mudar funcionalidades core
✗ Gerenciar imóveis
✗ Configurar integrações
```

---

## 🎯 PRÓXIMAS SPRINTS

**Sprint v8 — Versionamento & Rollback Avançado**
- [ ] Ver histórico completo de mudanças
- [ ] Comparar 2 versões (diff visual)
- [ ] Revert automático em 1 clique

**Sprint v9 — Agendamento de Publicação**
- [ ] Agendar publicação para data/hora
- [ ] Publicar automaticamente às 9AM

**Sprint v10 — Multi-idioma**
- [ ] Editar conteúdo em português + inglês
- [ ] Site com versão EN/PT

---

## 📞 RESUMO FINAL

### ✅ É POSSÍVEL ALTERAR CADA PARTE DO SITE?

**SIM!** Mas apenas o **conteúdo editável** (textos, imagens, botões, listas, FAQs).

A **estrutura** (layout, design, funcionalidades) permanece fixa e requer mudanças no código.

### 🎯 O CMS COBRE 80% DO QUE UM CLIENTE QUER EDITAR

- Textos: ✅
- Imagens: ✅
- Botões: ✅
- Listas: ✅
- FAQs: ✅
- Design: ❌ (requer dev)
- Funcionalidades: ❌ (requer dev)

### 🚀 CONCLUSÃO

**Sprint v7 entregou um CMS funcional e robusto que permite editar praticamente todo conteúdo do site sem precisar de programador para alterações simples.**

A validação inteligente, drag-drop, importação em lote e pré-visualização tornam o sistema profissional e seguro.

---

_Documento criado em 2026-02-03_  
_Escopo: Sprint CMS v7 — Melhorias de UX & Validação Avançada_
