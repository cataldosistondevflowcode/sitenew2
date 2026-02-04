# CMS — Rastreamento Completo de Campos Editáveis e UX

**Versão:** 1.0  
**Data:** 2026-02-04  
**Objetivo:** Mapear TODOS os campos editáveis do site que devem estar no CMS e verificar implementação + melhorar UX com split-view lado a lado com sincronização

---

## 1. Estado Atual da Implementação CMS

### ✅ O que ESTÁ FUNCIONANDO

**Infraestrutura:**
- Tabelas CMS criadas em Supabase (`cms_pages`, `cms_blocks`, `cms_versions`, `cms_audit_log`, `cms_assets`)
- RLS configurado (público vê apenas conteúdo publicado)
- Sistema draft/published separado
- Preview em tempo real (via `LivePreview`)
- Validação antes de publicar
- Atalhos de teclado (Ctrl+S, Ctrl+P)
- Histórico de versões + rollback
- Audit log funcionando
- Biblioteca de mídia com upload

**Componentes:**
- 7 tipos de editores: `text`, `richtext`, `image`, `cta`, `list`, `faq`, `banner`
- Factory pattern bem implementado
- Layout lado a lado (editores esquerda + preview direita)

**Rotas protegidas:**
- `/admin/cms` — Lista de páginas
- `/admin/cms/pages/[slug]/edit` — Editor
- `/preview/[slug]` — Preview (com token opcional)
- `/admin/cms/assets` — Biblioteca
- `/admin/cms/audit-log` — Auditoria

---

### ⚠️ O que PRECISA MELHORAR

#### A. Sincronização Editor ↔ Preview
- **Problema:** Não há sincronização de scroll entre editor e preview
- **Impacto:** Admin não vê qual bloco está sendo editado no preview
- **Solução:** Implementar highlight e auto-scroll do preview

#### B. Mapa Completo de Campos Editáveis
- **Problema:** Não existe rastreamento formal de TODOS os campos que DEVERIAM ser editáveis por página
- **Impacto:** Alguns campos podem estar "presos" hardcoded
- **Solução:** Criar mapa canônico de campos por página

#### C. Intuititividade da Edição
- **Problema:** Não é 100% claro qual bloco está sendo editado vs o que está no site
- **Impacto:** Fricção na edição
- **Solução:** Adicionar indicador visual destacando campo no preview enquanto edita

#### D. Responsive da Preview
- **Problema:** Preview sempre em desktop
- **Impacto:** Admin não consegue validar como fica em mobile
- **Solução:** Toggle de tamanhos de tela

#### E. Validação Contextual
- **Problema:** Validação é genérica, não contextual ao campo específico
- **Impacto:** Erro pode ser vago
- **Solução:** Feedback visual destacando campo inválido no preview

---

## 2. Mapa Canônico de Campos Editáveis por Página

### 2.1 Página HOME (`/`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título principal | `hero_title` | text | ✅ Impl | H1 do site |
| Subtítulo/Descrição | `hero_subtitle` | richtext | ❌ Falta | Texto abaixo do H1 |
| Imagem de fundo | `hero_image` | image | ❌ Falta | Background do hero |
| **CTA HERO** | | | | |
| Botão primário - texto | `hero_cta_primary_text` | text | ❌ Falta | Ex: "Buscar Imóveis" |
| Botão primário - URL | `hero_cta_primary_url` | text | ❌ Falta | Link do botão |
| Botão secundário - texto | `hero_cta_secondary_text` | text | ❌ Falta | Ex: "Ver Mais" |
| Botão secundário - URL | `hero_cta_secondary_url` | text | ❌ Falta | Link secundário |
| **SEÇÃO DESTAQUE (cards)** | | | | |
| Título seção | `highlight_section_title` | text | ❌ Falta | H2 acima dos cards |
| Card 1 - Título | `highlight_card_1_title` | text | ❌ Falta | Título do card |
| Card 1 - Descrição | `highlight_card_1_desc` | richtext | ❌ Falta | Texto do card |
| Card 1 - Ícone/Imagem | `highlight_card_1_image` | image | ❌ Falta | Imagem do card |
| Card 2 - Título | `highlight_card_2_title` | text | ❌ Falta | Idem |
| Card 2 - Descrição | `highlight_card_2_desc` | richtext | ❌ Falta | Idem |
| Card 2 - Ícone/Imagem | `highlight_card_2_image` | image | ❌ Falta | Idem |
| Card 3 - Título | `highlight_card_3_title` | text | ❌ Falta | Idem |
| Card 3 - Descrição | `highlight_card_3_desc` | richtext | ❌ Falta | Idem |
| Card 3 - Ícone/Imagem | `highlight_card_3_image` | image | ❌ Falta | Idem |
| **SEÇÃO "COMO FUNCIONA"** | | | | |
| Título | `how_it_works_title` | text | ❌ Falta | H2 |
| Descrição | `how_it_works_desc` | richtext | ❌ Falta | Texto introdutório |
| Passo 1 - Título | `how_it_works_step_1_title` | text | ❌ Falta | |
| Passo 1 - Descrição | `how_it_works_step_1_desc` | richtext | ❌ Falta | |
| Passo 2 - Título | `how_it_works_step_2_title` | text | ❌ Falta | |
| Passo 2 - Descrição | `how_it_works_step_2_desc` | richtext | ❌ Falta | |
| Passo 3 - Título | `how_it_works_step_3_title` | text | ❌ Falta | |
| Passo 3 - Descrição | `how_it_works_step_3_desc` | richtext | ❌ Falta | |
| **SEÇÃO "SOBRE"** | | | | |
| Título | `about_section_title` | text | ❌ Falta | H2 |
| Descrição | `about_section_desc` | richtext | ❌ Falta | |
| Imagem | `about_section_image` | image | ❌ Falta | |
| **CTA FINAL** | | | | |
| Título | `final_cta_title` | text | ❌ Falta | |
| Descrição | `final_cta_desc` | richtext | ❌ Falta | |
| Botão - Texto | `final_cta_button_text` | text | ❌ Falta | |
| Botão - URL | `final_cta_button_url` | text | ❌ Falta | |

**Total: 34 campos | Implementados: 1 | Faltam: 33**

---

### 2.2 Página "Quem Somos" (`/quem-somos`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `quem_somos_hero_title` | text | ❌ Falta | |
| Subtítulo | `quem_somos_hero_subtitle` | richtext | ❌ Falta | |
| Imagem | `quem_somos_hero_image` | image | ❌ Falta | |
| **CONTEÚDO PRINCIPAL** | | | | |
| Título seção | `quem_somos_content_title` | text | ❌ Falta | |
| Parágrafo 1 | `quem_somos_para1` | richtext | ❌ Falta | |
| Parágrafo 2 | `quem_somos_para2` | richtext | ❌ Falta | |
| Parágrafo 3 | `quem_somos_para3` | richtext | ❌ Falta | |
| **VALORES** | | | | |
| Título | `values_title` | text | ❌ Falta | |
| Valor 1 - Título | `value_1_title` | text | ❌ Falta | |
| Valor 1 - Descrição | `value_1_desc` | richtext | ❌ Falta | |
| Valor 2 - Título | `value_2_title` | text | ❌ Falta | |
| Valor 2 - Descrição | `value_2_desc` | richtext | ❌ Falta | |
| Valor 3 - Título | `value_3_title` | text | ❌ Falta | |
| Valor 3 - Descrição | `value_3_desc` | richtext | ❌ Falta | |
| **DEPOIMENTOS** | | | | |
| Título | `testimonials_title` | text | ❌ Falta | |
| Depoimento 1 - Texto | `testimonial_1_text` | richtext | ❌ Falta | |
| Depoimento 1 - Autor | `testimonial_1_author` | text | ❌ Falta | |
| Depoimento 2 - Texto | `testimonial_2_text` | richtext | ❌ Falta | |
| Depoimento 2 - Autor | `testimonial_2_author` | text | ❌ Falta | |
| **CTA FINAL** | | | | |
| Título | `quem_somos_final_cta_title` | text | ❌ Falta | |
| Texto | `quem_somos_final_cta_text` | richtext | ❌ Falta | |
| Botão - Texto | `quem_somos_final_cta_button` | text | ❌ Falta | |
| Botão - URL | `quem_somos_final_cta_url` | text | ❌ Falta | |

**Total: 26 campos | Implementados: 0 | Faltam: 26**

---

### 2.3 Página "Assessoria em Leilões" (`/assessoria`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `assessoria_hero_title` | text | ❌ Falta | |
| Subtítulo | `assessoria_hero_subtitle` | richtext | ❌ Falta | |
| Imagem | `assessoria_hero_image` | image | ❌ Falta | |
| **INTRO** | | | | |
| Descrição | `assessoria_intro_desc` | richtext | ❌ Falta | |
| **SERVIÇOS** | | | | |
| Título | `services_title` | text | ❌ Falta | |
| Serviço 1 - Título | `service_1_title` | text | ❌ Falta | |
| Serviço 1 - Descrição | `service_1_desc` | richtext | ❌ Falta | |
| Serviço 2 - Título | `service_2_title` | text | ❌ Falta | |
| Serviço 2 - Descrição | `service_2_desc` | richtext | ❌ Falta | |
| Serviço 3 - Título | `service_3_title` | text | ❌ Falta | |
| Serviço 3 - Descrição | `service_3_desc` | richtext | ❌ Falta | |
| **PROCESSO** | | | | |
| Título | `process_title` | text | ❌ Falta | |
| Etapa 1 - Título | `process_step_1_title` | text | ❌ Falta | |
| Etapa 1 - Descrição | `process_step_1_desc` | richtext | ❌ Falta | |
| Etapa 2 - Título | `process_step_2_title` | text | ❌ Falta | |
| Etapa 2 - Descrição | `process_step_2_desc` | richtext | ❌ Falta | |
| Etapa 3 - Título | `process_step_3_title` | text | ❌ Falta | |
| Etapa 3 - Descrição | `process_step_3_desc` | richtext | ❌ Falta | |
| **CTA** | | | | |
| Texto | `assessoria_final_cta_text` | richtext | ❌ Falta | |
| Botão | `assessoria_final_cta_button` | text | ❌ Falta | |

**Total: 22 campos | Implementados: 0 | Faltam: 22**

---

### 2.4 Página "Direito Imobiliário" (`/direito-imobiliario`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `direito_hero_title` | text | ❌ Falta | |
| Subtítulo | `direito_hero_subtitle` | richtext | ❌ Falta | |
| Imagem | `direito_hero_image` | image | ❌ Falta | |
| **INTRO** | | | | |
| Texto | `direito_intro_text` | richtext | ❌ Falta | |
| **ÁREAS DE PRÁTICA** | | | | |
| Título | `practice_areas_title` | text | ❌ Falta | |
| Área 1 - Título | `practice_area_1_title` | text | ❌ Falta | |
| Área 1 - Descrição | `practice_area_1_desc` | richtext | ❌ Falta | |
| Área 2 - Título | `practice_area_2_title` | text | ❌ Falta | |
| Área 2 - Descrição | `practice_area_2_desc` | richtext | ❌ Falta | |
| Área 3 - Título | `practice_area_3_title` | text | ❌ Falta | |
| Área 3 - Descrição | `practice_area_3_desc` | richtext | ❌ Falta | |
| **FAQ** | | | | |
| Título | `direito_faq_title` | text | ❌ Falta | |
| Perguntas/Respostas | `direito_faq_items` | faq | ❌ Falta | Lista de Q&A |
| **CTA** | | | | |
| Texto final | `direito_final_text` | richtext | ❌ Falta | |
| Botão | `direito_final_button` | text | ❌ Falta | |

**Total: 18 campos | Implementados: 0 | Faltam: 18**

---

### 2.5 Página "Casos Reais" (`/casos-reais`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `casos_hero_title` | text | ❌ Falta | |
| Subtítulo | `casos_hero_subtitle` | richtext | ❌ Falta | |
| **INTRO** | | | | |
| Descrição | `casos_intro_desc` | richtext | ❌ Falta | |
| **CASOS (Lista dinâmica)** | | | | |
| Caso 1 - Título | `case_1_title` | text | ❌ Falta | |
| Caso 1 - Descrição | `case_1_desc` | richtext | ❌ Falta | |
| Caso 1 - Resultado | `case_1_result` | richtext | ❌ Falta | |
| Caso 1 - Imagem | `case_1_image` | image | ❌ Falta | |
| Caso 2 - Título | `case_2_title` | text | ❌ Falta | |
| Caso 2 - Descrição | `case_2_desc` | richtext | ❌ Falta | |
| Caso 2 - Resultado | `case_2_result` | richtext | ❌ Falta | |
| Caso 2 - Imagem | `case_2_image` | image | ❌ Falta | |
| **CTA** | | | | |
| Texto | `casos_final_text` | richtext | ❌ Falta | |
| Botão | `casos_final_button` | text | ❌ Falta | |

**Total: 16 campos | Implementados: 0 | Faltam: 16**

---

### 2.6 Página "Blog" (`/blog`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `blog_hero_title` | text | ❌ Falta | |
| Subtítulo | `blog_hero_subtitle` | richtext | ❌ Falta | |
| **POSTS (CRUD dinâmico)** | | | | |
| Gerenciado por tabela separada | `posts` | — | 🔄 Parcial | Ver comentário |
| **CTA** | | | | |
| Seção final | `blog_final_section` | richtext | ❌ Falta | |

**Total: 4 campos | Implementados: 0 | Faltam: 4**  
**Obs:** Blog pode ter CRUD próprio (não via CMS direto)

---

### 2.7 Página "Contato" (`/contato`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título | `contato_hero_title` | text | ❌ Falta | |
| Subtítulo | `contato_hero_subtitle` | richtext | ❌ Falta | |
| **FORMULÁRIO** | | | | |
| Instrução | `contato_form_instruction` | richtext | ❌ Falta | Texto acima do form |
| **INFO CONTATO** | | | | |
| Email de contato | `contato_email` | text | ❌ Falta | |
| Telefone | `contato_phone` | text | ❌ Falta | |
| Endereço | `contato_address` | richtext | ❌ Falta | |
| **HORÁRIO** | | | | |
| Horário funcionamento | `contato_hours` | richtext | ❌ Falta | |
| **REDES SOCIAIS** | | | | |
| Links | `contato_social_links` | list | ❌ Falta | URLs das redes |

**Total: 10 campos | Implementados: 0 | Faltam: 10**

---

### 2.8 Páginas Regionais (ex: `/imoveis/rj`, `/imoveis/sp/bairro-x`)

| Campo | Block Key | Tipo | Status | Observações |
|-------|-----------|------|--------|------------|
| **HERO** | | | | |
| Título (com região) | `region_hero_title` | text | ❌ Falta | "Imóveis em Leilão no RJ" |
| Descrição | `region_hero_desc` | richtext | ❌ Falta | Texto introdutório |
| **INTRO REGIÃO** | | | | |
| Descrição da região | `region_description` | richtext | ❌ Falta | Características gerais |
| **LISTAGEM** | | | | |
| Gerenciada por filtro | — | — | ✅ Impl | OK |
| **CARROSSEL RELACIONADOS** | | | | |
| Título | `region_related_title` | text | ❌ Falta | |
| **CONTEÚDO COMPLEMENTAR** | | | | |
| Bairros | `region_neighborhoods` | richtext | ❌ Falta | Lista de bairros |
| Atrações | `region_attractions` | richtext | ❌ Falta | |
| Infraestrutura | `region_infrastructure` | richtext | ❌ Falta | |
| **SOBRE A EMPRESA (seção)** | | | | |
| Título | `company_section_title` | text | ❌ Falta | |
| Descrição | `company_section_desc` | richtext | ❌ Falta | |
| **CASOS DE SUCESSO** | | | | |
| Gerenciado por tabela | — | — | 🔄 Parcial | Ver comentário |
| **CTA FINAL** | | | | |
| Texto | `region_final_cta_text` | richtext | ❌ Falta | |
| Botão | `region_final_cta_button` | text | ❌ Falta | |

**Total: 15 campos | Implementados: 2 | Faltam: 13**

---

## 3. Resumo de Cobertura CMS

| Página | Total Campos | Implementados | Faltam | % Cobertura |
|--------|----------|---|---|---|
| **Home** | 34 | 1 | 33 | 3% |
| **Quem Somos** | 26 | 0 | 26 | 0% |
| **Assessoria** | 22 | 0 | 22 | 0% |
| **Direito Imobiliário** | 18 | 0 | 18 | 0% |
| **Casos Reais** | 16 | 0 | 16 | 0% |
| **Blog** | 4 | 0 | 4 | 0% |
| **Contato** | 10 | 0 | 10 | 0% |
| **Regionais** | 15 | 2 | 13 | 13% |
| **TOTAL** | **145** | **3** | **142** | **2%** |

---

## 4. Plano de Melhoria: UX Split-View com Sincronização

### 4.1 Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│  EDITOR PAGE - /admin/cms/pages/[slug]/edit                    │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│  PAINEL ESQUERDO     │      PREVIEW DIREITO (RESPONSIVO)       │
│  (EDITORES)          │                                          │
│                      │  [ ] Desktop  [ ] Tablet  [ ] Mobile    │
│  [ Blocos ]          │                                          │
│  ┌────────────────┐  │  ┌─────────────────────────────────────┐│
│  │ BLOCO: Hero    │  │  │  ┌─ Hero ────────────────────────┐ ││
│  │ (expandido)    │  │  │  │ Título do site                │ ││
│  │                │  │  │  │ Subtítulo                     │ ││
│  │ [●] hero_title ◄──┼──┼──►(DESTACADO EM AMARELO)        │ ││
│  │ [●] hero_image ◄──┼──┼──►(IMAGEM)                       │ ││
│  │                │  │  │  │ [Botão] [Botão]               │ ││
│  │ ┌─────────────┐│  │  │  └─────────────────────────────────┘ ││
│  │ │ LIVE SYNC:  ││  │  │  ┌─ Highlights ──────────────────────┐││
│  │ │ Ao focar em ││  │  │  │ [Card] [Card] [Card]              │││
│  │ │ hero_title, ││  │  │  └──────────────────────────────────────┘││
│  │ │ o campo é   ││  │  │                                        ││
│  │ │ destacado   ││  │  │ (scroll automático para o bloco)     ││
│  │ │ no preview  ││  │  │                                        ││
│  │ └─────────────┘│  │  └────────────────────────────────────────┘│
│  │                │  │                                          │
│  │ ┌────────────┐ │  │  Status bar:                           │
│  │ │ [SAVE]     │ │  │  "Editar campo: hero_title"           │
│  │ │ [PUBLISH]  │ │  │  Mudanças: 2 campos  [CTRL+S]         │
│  │ │ [PREVIEW]  │ │  │                                        │
│  │ └────────────┘ │  │                                        │
│  └──────────────────┘  │                                        │
└──────────────────────┴──────────────────────────────────────────┘
```

---

### 4.2 Componentes Principais a Implementar/Melhorar

#### A. `SyncedLivePreview.tsx` (NOVA)
- Recebe bloco ativo em edição
- Scroll automático para o bloco no preview
- Highlight visual do bloco sendo editado
- Toggle de tamanho de tela (desktop/tablet/mobile)
- Sincronização de scroll bidirecional (opcional)

```typescript
interface SyncedLivePreviewProps {
  blocks: CmsBlock[];
  isDraft: boolean;
  activeBlockId?: number;  // NEW: bloco sendo editado
  activeFieldKey?: string; // NEW: campo específico
  onBlockFocus?: (blockId: number) => void;
}
```

#### B. `BlockFieldHighlight.tsx` (NOVA)
- Wrapper que aplica highlight visual em torno de um campo
- Útil para renderizar blocos no preview
- Cores diferentes por status: `editing`, `valid`, `invalid`, `unsaved`

```typescript
interface BlockFieldHighlightProps {
  blockId: number;
  fieldKey: string;
  isActive: boolean;
  status: 'editing' | 'valid' | 'invalid' | 'unsaved';
  children: React.ReactNode;
}
```

#### C. `EnhancedBlockEditor.tsx` (MELHORADO)
- Cada editor emite eventos `onFieldFocus` quando usuário clica no campo
- Mostra indicador de mudanças pendentes
- Validação em tempo real com debounce
- Sugestões de correção

#### D. `ResponsivePreviewToggle.tsx` (NOVA)
- Buttons para alternar tamanho: Mobile (375px) | Tablet (768px) | Desktop (1200px)
- Salva preferência em localStorage

#### E. `EditorStatusBar.tsx` (MELHORADO)
- Mostra: "Editar campo: hero_title"
- Contador de mudanças: "Mudanças: 2 campos não salvas"
- Botões diretos: [CTRL+S] [CTRL+P]
- Indicador visual de validação

---

### 4.3 Melhorias Incrementais

#### Fase 1 (Imediata): Highlight + Scroll
```typescript
// LivePreview recebe activeBlockId
// Quando muda, scroll para o bloco
// Aplica background highlight por 2 segundos
```

#### Fase 2 (Semana 1): Responsive + Status Bar
```typescript
// Toggle de tamanho de tela
// Status bar melhorado
// Indicador de campo ativo
```

#### Fase 3 (Semana 2): Sincronização Bidirecional
```typescript
// Ao clicar em campo no preview, abre editor
// Validação contextual (erro no preview)
// Atalhos adicionais
```

---

## 5. Checklist de Implementação CMS por Página

### HOME — Prioridade ALTA

**Sprint CMS v9 — Completar Home**

- [ ] Criar blocos faltantes em `cms_blocks`
- [ ] Implementar editores para cada bloco:
  - [ ] `hero_subtitle` (richtext)
  - [ ] `hero_image` (image)
  - [ ] `hero_cta_primary_text` + `hero_cta_primary_url` (texto + link em componente único)
  - [ ] `hero_cta_secondary_text` + `hero_cta_secondary_url` (idem)
  - [ ] `highlight_section_title` (text)
  - [ ] `highlight_card_*` (componente reutilizável para 3 cards)
  - [ ] `how_it_works_*` (componente reutilizável para 3 passos)
  - [ ] `about_section_*` (text + richtext + image)
  - [ ] `final_cta_*` (componente reutilizável)
- [ ] Renderizar blocos no site público
- [ ] Preview em tempo real
- [ ] Validação
- [ ] Testar: editar → salvar → preview → publicar

---

### QUEM SOMOS — Prioridade ALTA

**Sprint CMS v10 — Completar Quem Somos**

- [ ] Criar estrutura de blocos
- [ ] Implementar editores
- [ ] Renderizar no site
- [ ] Testar

---

### Demais Páginas — Prioridade MÉDIA

**Sprint CMS v11+ — Completar Assessoria, Direito, Casos, Blog, Contato**

Seguindo o mesmo padrão.

---

### Regionais — Prioridade MÉDIA

**Sprint CMS v12 — Completar Regionais**

- [ ] Adicionar campos faltantes por região
- [ ] Renderizar conteúdo dinâmico
- [ ] Testar com ~5 regiões diferentes

---

## 6. Especificação Técnica: Campos Compostos (CTA, Cards, etc.)

Alguns campos precisam de componente especial (ex: CTA = texto + URL em bloco único).

### 6.1 Componente `CtaFieldEditor` (MELHORA)

Ao invés de 2 blocos separados (`hero_cta_primary_text` + `hero_cta_primary_url`), criar bloco único que guarda ambos:

**Estrutura no banco:**
```json
{
  "text": "Buscar Imóveis",
  "url": "/search",
  "style": "primary"  // ou "secondary"
}
```

**Block key:** `hero_cta_primary`

**Renderização:**
```jsx
<Button 
  href={contentPublished.url} 
  variant={contentPublished.style}
>
  {contentPublished.text}
</Button>
```

---

### 6.2 Componente `CardListEditor` (NOVO)

Para seções com múltiplos cards (ex: highlight_cards, services, etc.):

**Estrutura no banco:**
```json
{
  "cards": [
    {
      "title": "Card 1",
      "description": "Descrição",
      "image_url": "https://..."
    },
    {
      "title": "Card 2",
      "description": "Descrição",
      "image_url": "https://..."
    }
  ]
}
```

**Block key:** `highlight_cards` (singular)

**Editor:**
- Drag-and-drop para reordenar cards
- Botão "Adicionar card"
- Botão "Remover card"
- Inline editing por card

---

### 6.3 Componente `StepListEditor` (NOVO)

Para seções "Como Funciona" com passos:

**Estrutura:**
```json
{
  "steps": [
    {
      "number": 1,
      "title": "Passo 1",
      "description": "Descrição"
    },
    {
      "number": 2,
      "title": "Passo 2",
      "description": "Descrição"
    }
  ]
}
```

---

## 7. Roadmap Proposto

### Sprint CMS v9 (Semana 1)
**Objetivo:** Completar Home com novos editores + melhoria UX split-view

**Entregáveis:**
- [ ] Criar 15 blocos novos para Home em `cms_blocks`
- [ ] Implementar `CtaFieldEditor`
- [ ] Implementar `CardListEditor`
- [ ] Implementar `StepListEditor`
- [ ] Melhorar `LivePreview` com sincronização de scroll
- [ ] Adicionar highlight de bloco ativo
- [ ] Renderizar todos os blocos no site público
- [ ] Testar fluxo completo: editar → preview → publicar

**Critérios de aceite:**
- Consigo editar TODOS os campos da Home
- Preview mostra o campo ativo destacado
- Publicar atualiza site público sem quebras
- SEO não degrada

---

### Sprint CMS v10 (Semana 2)
**Objetivo:** Completar Quem Somos + implementar split-view responsivo

**Entregáveis:**
- [ ] Criar blocos para Quem Somos
- [ ] Implementar `ResponsivePreviewToggle`
- [ ] Melhorar `EditorStatusBar`
- [ ] Renderizar Quem Somos
- [ ] Testar mobile preview

---

### Sprint CMS v11 (Semana 3)
**Objetivo:** Completar demais páginas

**Entregáveis:**
- [ ] Assessoria
- [ ] Direito Imobiliário
- [ ] Casos Reais
- [ ] Blog (com CRUD próprio)
- [ ] Contato

---

### Sprint CMS v12 (Semana 4)
**Objetivo:** Completar Regionais + polimentos finais

**Entregáveis:**
- [ ] Adicionar campos por região
- [ ] Testar ~5 regiões diferentes
- [ ] Otimizações de performance
- [ ] Documentação final

---

## 8. Implementação: Estrutura de Código

### 8.1 Novo Hook: `useSyncedBlockEditor`

```typescript
export function useSyncedBlockEditor() {
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [unsavedCount, setUnsavedCount] = useState(0);

  const onFieldFocus = (blockId: number, fieldKey: string) => {
    setActiveBlockId(blockId);
    setActiveFieldKey(fieldKey);
    // Emitir evento para scroll automático
  };

  const handleSave = async () => {
    // Salvar todos os blocos modificados
    setUnsavedCount(0);
  };

  return {
    activeBlockId,
    activeFieldKey,
    previewSize,
    unsavedCount,
    onFieldFocus,
    handleSave,
    setPreviewSize,
  };
}
```

---

### 8.2 Novo Componente: `CmsEditorLayout`

```typescript
export function CmsEditorLayout({
  slug,
}: {
  slug: string;
}) {
  const {
    activeBlockId,
    activeFieldKey,
    previewSize,
    unsavedCount,
    onFieldFocus,
    handleSave,
    setPreviewSize,
  } = useSyncedBlockEditor();

  const { page, blocks, loading, error, updateBlockDraft, publishBlock } =
    useCmsContent(slug);

  if (loading) return <LoadingState />;
  if (error || !page) return <ErrorState />;

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Left: Editors */}
      <div className="w-1/2 overflow-y-auto border-r">
        <EditorSidebar
          blocks={blocks}
          activeBlockId={activeBlockId}
          onFieldFocus={onFieldFocus}
          onUpdate={updateBlockDraft}
        />
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 overflow-y-auto">
        <SyncedLivePreview
          blocks={blocks}
          isDraft={true}
          activeBlockId={activeBlockId}
          activeFieldKey={activeFieldKey}
          previewSize={previewSize}
          onPreviewSizeChange={setPreviewSize}
        />

        <EditorStatusBar
          unsavedCount={unsavedCount}
          onSave={handleSave}
          onPublish={() => publishBlock(activeBlockId!)}
        />
      </div>
    </div>
  );
}
```

---

## 9. Métricas de Sucesso

- [ ] 100% de cobertura CMS para Home, Quem Somos, Assessoria
- [ ] Preview sincronizado com scroll automático
- [ ] Tempo de edição reduzido em 40%
- [ ] 0 campos hardcoded no React (todos vindo do CMS)
- [ ] SEO não degrada após publicação
- [ ] Admin consegue editar sem treinamento extenso

---

## 10. Referências

- `CMS_ADMIN_SPEC.md` — Especificação canônica
- `.cursor/rules/55-admin-cms.mdc` — Regras CMS
- `src/pages/AdminCmsPageEdit.tsx` — Editor atual
- `src/components/admin/ux/LivePreview.tsx` — Preview atual

---

_Documento criado em 2026-02-04 como rastreamento completo da implementação CMS._
