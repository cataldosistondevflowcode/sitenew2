# Sprint CMS v7 — Editores de Tipos Complexos (CTA, List, FAQ)
_Data: 2026-02-03_  
_Status: 🎯 Planejado_  
_Prioridade: Alta_  
_Baseado em: Progressão das Sprints CMS v0-v6_

---

## 📋 Contexto

Após completar **6 sprints do Admin CMS**, o sistema possui:
- ✅ MVP Mínimo (v0)
- ✅ Blocos por página + Preview (v1)
- ✅ Biblioteca de mídia (v2)
- ✅ Preview completo + Publish robusto (v3)
- ✅ Validação robusta (v4)
- ✅ Testes E2E completos (v5)
- ✅ RichText editor com TipTap (v6)

**Sprint v7 adiciona** editores para tipos de conteúdo mais complexos e reutilizáveis:
- **CTA (Call-to-Action)** — botões com texto, URL, estilos
- **List** — listas de itens ordenadas/desordenadas
- **FAQ (Perguntas e Respostas)** — pares pergunta/resposta expansíveis

---

## 🎯 Objetivos

1. **Implementar editores para 3 novos tipos de blocos** (CTA, List, FAQ)
2. **Validação robusta** para tipos complexos (arrays, objects)
3. **Rendering/Exibição** desses tipos nas páginas públicas
4. **Testes E2E** para fluxo completo (editar → publicar → renderizar)
5. **Documentação técnica** atualizada

---

## 📊 Requisitos Funcionais

### RF-V7-001 — Editor CTA
**Descrição:** Editar blocos de Call-to-Action (botões com ação).

**Campos:**
- `text` (string, obrigatório) — Texto do botão (ex: "Entre em Contato")
- `url` (string, obrigatório) — URL/link (ex: "/contato", "https://...", "mailto:...", "tel:...")
- `style` (enum, obrigatório) — Estilo visual (primary, secondary, outline)
- `target` (enum, opcional) — Alvo do link (_self, _blank)

**Estrutura no banco:**
```jsonc
// cms_blocks com block_type = 'cta'
{
  "content_draft": {
    "text": "Entre em Contato",
    "url": "/contato",
    "style": "primary",
    "target": "_self"
  }
}
```

**Validação:**
- `text` não pode estar vazio e não pode ter mais de 100 caracteres
- `url` não pode estar vazio e deve ser URL válida (http, https, mailto, tel, /)
- `style` deve estar em lista pré-definida
- `target` deve estar em lista pré-definida

**Critérios de aceite:**
- [ ] Editor renderiza campos corretos
- [ ] Validação em tempo real
- [ ] Salvar draft funciona
- [ ] Publicar funciona
- [ ] Site público renderiza botão com estilo correto
- [ ] Clique no botão navega para URL correta

---

### RF-V7-002 — Editor List
**Descrição:** Editar blocos de listas de itens.

**Campos:**
- `items` (array de strings, obrigatório) — Lista de itens
- `ordered` (boolean, opcional) — Se é lista numerada (padrão: false)
- `style` (enum, opcional) — Estilo visual (default, checkmark, arrow)

**Estrutura no banco:**
```jsonc
// cms_blocks com block_type = 'list'
{
  "content_draft": {
    "items": ["Item 1", "Item 2", "Item 3"],
    "ordered": false,
    "style": "default"
  }
}
```

**Validação:**
- `items` deve ter no mínimo 1 item
- Cada item não pode estar vazio
- Cada item não pode ter mais de 500 caracteres
- `ordered` deve ser boolean
- `style` deve estar em lista pré-definida

**UI do Editor:**
- Textarea para adicionar itens (um por linha)
- Toggle "Lista numerada"
- Dropdown para selecionar estilo
- Preview em tempo real

**Critérios de aceite:**
- [ ] Editor renderiza textarea e opções
- [ ] Adicionar/remover itens funciona
- [ ] Preview mostra lista corretamente
- [ ] Site público renderiza lista com estilo correto
- [ ] Lista numerada funciona quando ativada

---

### RF-V7-003 — Editor FAQ
**Descrição:** Editar blocos de Perguntas e Respostas.

**Campos:**
- `items` (array de objects, obrigatório) — Array de {question, answer}
- `allowMultiple` (boolean, opcional) — Se pode abrir múltiplos items ao mesmo tempo

**Estrutura no banco:**
```jsonc
// cms_blocks com block_type = 'faq'
{
  "content_draft": {
    "items": [
      {
        "question": "Pergunta 1?",
        "answer": "Resposta 1 com <strong>HTML</strong>"
      },
      {
        "question": "Pergunta 2?",
        "answer": "Resposta 2"
      }
    ],
    "allowMultiple": false
  }
}
```

**Validação:**
- `items` deve ter no mínimo 1 item
- Cada `question` não pode estar vazio e não pode ter mais de 200 caracteres
- Cada `answer` não pode estar vazio e não pode ter mais de 2000 caracteres
- `allowMultiple` deve ser boolean

**UI do Editor:**
- Tabela ou lista expansível com campos pergunta/resposta
- Botão para adicionar nova linha
- Botão para remover linha
- Toggle "Permitir múltiplas aberturas"
- Preview em tempo real

**Critérios de aceite:**
- [ ] Editor renderiza lista de Q&A
- [ ] Adicionar/remover linhas funciona
- [ ] Preview mostra accordeon funcionando
- [ ] Site público renderiza FAQ com expansão correta
- [ ] Comportamento allowMultiple funciona

---

## 🛠️ Arquitetura Técnica

### Estrutura de Componentes

```
src/components/admin/cms/
├── BlockEditor/
│   ├── CTABlockEditor.tsx          (NOVO)
│   ├── ListBlockEditor.tsx         (NOVO)
│   ├── FAQBlockEditor.tsx          (NOVO)
│   ├── TextBlockEditor.tsx         (existente)
│   ├── RichTextBlockEditor.tsx     (existente)
│   └── ImageBlockEditor.tsx        (existente)
├── renderers/
│   ├── CTABlockRenderer.tsx        (NOVO)
│   ├── ListBlockRenderer.tsx       (NOVO)
│   ├── FAQBlockRenderer.tsx        (NOVO)
│   ├── TextBlockRenderer.tsx       (existente)
│   └── RichTextBlockRenderer.tsx   (existente)
└── validation/
    ├── validateCTABlock.ts         (NOVO)
    ├── validateListBlock.ts        (NOVO)
    ├── validateFAQBlock.ts         (NOVO)
    ├── validateBlockContent.ts     (existente, será estendido)
    └── blockValidationRules.ts     (NOVO)
```

### Validação Genérica

Estender `validateBlockContent()` para suportar os novos tipos:

```typescript
// src/utils/cms/blockValidationRules.ts
export const blockValidationRules = {
  text: {
    maxLength: 1000,
    required: true,
  },
  cta: {
    text: { maxLength: 100, required: true },
    url: { pattern: /^(https?:\/\/|mailto:|tel:|\/|#)/, required: true },
    style: { enum: ['primary', 'secondary', 'outline'], required: true },
    target: { enum: ['_self', '_blank'], required: false },
  },
  list: {
    items: { minItems: 1, maxLength: 500, required: true },
    ordered: { type: 'boolean', required: false },
    style: { enum: ['default', 'checkmark', 'arrow'], required: false },
  },
  faq: {
    items: { minItems: 1, required: true },
    items: [{
      question: { maxLength: 200, required: true },
      answer: { maxLength: 2000, required: true },
    }],
    allowMultiple: { type: 'boolean', required: false },
  },
};
```

### Fluxo de Dados

```
[Editor] → [Validação] → [Salvar Draft] → [Preview] → [Publicar] → [Renderer]
   ↓          ↓              ↓              ↓           ↓           ↓
CTA/List/  validateBlock  Supabase    PreviewPage  Supabase   HTMLComponent
FAQ        (regras)       (cms_blocks) (draft)    (cms_blocks)
                                                  (published)
```

---

## 📝 Tarefas de Implementação

### Fase 1: Validação e Tipos TypeScript (1 dia)

**T7.1** — Criar tipos TypeScript para blocos complexos
- [ ] Type `CTABlockContent`
- [ ] Type `ListBlockContent`
- [ ] Type `FAQBlockContent`
- [ ] Type `BlockValidationRule`
- Arquivo: `src/types/cms/blockTypes.ts`

**T7.2** — Implementar regras de validação genéricas
- [ ] Função `validateBlockContent()` estendida
- [ ] Funções específicas: `validateCTA()`, `validateList()`, `validateFAQ()`
- [ ] Testes unitários para cada validador
- Arquivo: `src/utils/cms/blockValidationRules.ts`

---

### Fase 2: Editores CTA, List, FAQ (2 dias)

**T7.3** — Implementar `CTABlockEditor`
- [ ] Campos: text, url, style, target
- [ ] Validação em tempo real
- [ ] Preview inline do botão
- [ ] Integração com BlockEditor pai
- Arquivo: `src/components/admin/cms/BlockEditor/CTABlockEditor.tsx`

**T7.4** — Implementar `ListBlockEditor`
- [ ] Textarea com suporte a múltiplas linhas
- [ ] Toggle para lista numerada
- [ ] Dropdown de estilos
- [ ] Preview em tempo real
- [ ] Botões adicionar/remover itens
- Arquivo: `src/components/admin/cms/BlockEditor/ListBlockEditor.tsx`

**T7.5** — Implementar `FAQBlockEditor`
- [ ] Tabela/lista de Q&A
- [ ] Campos pergunta/resposta editáveis
- [ ] Botões adicionar/remover linhas
- [ ] Toggle allowMultiple
- [ ] Preview com accordeon funcional
- Arquivo: `src/components/admin/cms/BlockEditor/FAQBlockEditor.tsx`

---

### Fase 3: Renderers (Exibição Pública) (1,5 dias)

**T7.6** — Implementar `CTABlockRenderer`
- [ ] Renderizar botão com estilo correto
- [ ] Suportar links internos/externos, mailto, tel
- [ ] Aplicar estilos do design system
- [ ] Acessibilidade (aria-label, title)
- Arquivo: `src/components/admin/cms/renderers/CTABlockRenderer.tsx`

**T7.7** — Implementar `ListBlockRenderer`
- [ ] Renderizar `<ul>` ou `<ol>` conforme `ordered`
- [ ] Aplicar estilos (default, checkmark, arrow)
- [ ] HTML seguro (sem XSS)
- Arquivo: `src/components/admin/cms/renderers/ListBlockRenderer.tsx`

**T7.8** — Implementar `FAQBlockRenderer`
- [ ] Componente Accordeon expansível
- [ ] Comportamento allowMultiple funcional
- [ ] Animações suaves
- [ ] Acessibilidade (role, aria-expanded)
- Arquivo: `src/components/admin/cms/renderers/FAQBlockRenderer.tsx`

---

### Fase 4: Integração e Testes (1 dia)

**T7.9** — Integrar editores e renderers
- [ ] BlockEditor rota para componente correto baseado em type
- [ ] BlockRenderer rota para componente correto baseado em type
- [ ] Testar fluxo completo para cada tipo
- Arquivos: `src/components/admin/cms/BlockEditor/index.tsx`, `src/components/admin/cms/renderers/index.tsx`

**T7.10** — Testes E2E
- [ ] Login → editar CTA → salvar → publicar → verificar site público
- [ ] Login → editar List → salvar → publicar → verificar site público
- [ ] Login → editar FAQ → salvar → publicar → verificar site público
- [ ] Validação: tentar publicar sem preencher campos obrigatórios
- Arquivo: `cypress/e2e/cms-complex-blocks.cy.ts` ou similar

**T7.11** — Documentação
- [ ] Atualizar `CMS_ADMIN_SPEC.md` com tipos complexos
- [ ] Atualizar `ROADMAP_SPRINTS.md` com Sprint v7
- [ ] Criar exemplo de uso para cada tipo
- Arquivos: `cataldo_sdd_pack/*`

---

## 🧪 Testes de Aceitação

### AC-V7-001 — Editor CTA Funcional
- [ ] Abrir editor de CTA
- [ ] Preencher text, url, style
- [ ] Botão "Salvar" grava em draft
- [ ] Preview mostra botão com estilo correto
- [ ] Publicar funciona
- [ ] Site público renderiza botão e clique navega corretamente

### AC-V7-002 — Editor List Funcional
- [ ] Abrir editor de List
- [ ] Adicionar 3+ itens (um por linha)
- [ ] Ativar "Lista numerada"
- [ ] Selecionar estilo (checkmark, arrow)
- [ ] Preview mostra lista com estilo
- [ ] Publicar funciona
- [ ] Site público renderiza `<ol>` ou `<ul>` conforme configurado

### AC-V7-003 — Editor FAQ Funcional
- [ ] Abrir editor de FAQ
- [ ] Adicionar 2+ linhas com pergunta/resposta
- [ ] Toggle "Permitir múltiplas aberturas"
- [ ] Preview mostra accordeon expandindo/colapsando
- [ ] Publicar funciona
- [ ] Site público: clicar em pergunta expande resposta, comportamento allowMultiple funciona

### AC-V7-004 — Validação Robusta
- [ ] Tentar salvar CTA com text vazio → erro
- [ ] Tentar salvar CTA com url inválida → erro
- [ ] Tentar salvar List com 0 itens → erro
- [ ] Tentar salvar FAQ com pergunta vazia → erro
- [ ] Mensagens de erro claras e acionáveis

### AC-V7-005 — Sem Regressão CMS
- [ ] Editar bloco text ainda funciona
- [ ] Editar bloco richtext ainda funciona
- [ ] Editar bloco image ainda funciona
- [ ] Draft/Publish workflow não regrediu
- [ ] RLS de segurança mantido

---

## 📐 Estimativa de Tempo

| Fase | Tarefa | Duração |
|------|--------|---------|
| 1 | Validação + Tipos TS | 1 dia |
| 2 | Editores CTA/List/FAQ | 2 dias |
| 3 | Renderers | 1,5 dias |
| 4 | Integração + Testes | 1 dia |
| **Total** | | **5,5 dias** |

---

## 🔍 Checklist de Implementação

- [ ] **Validação e Tipos** (T7.1, T7.2)
  - [ ] Types TypeScript criados
  - [ ] Validadores implementados
  - [ ] Testes unitários passando

- [ ] **Editores** (T7.3, T7.4, T7.5)
  - [ ] CTABlockEditor funcional
  - [ ] ListBlockEditor funcional
  - [ ] FAQBlockEditor funcional
  - [ ] Todos com preview em tempo real
  - [ ] Validação em tempo real ativa

- [ ] **Renderers** (T7.6, T7.7, T7.8)
  - [ ] CTABlockRenderer renderiza botões corretamente
  - [ ] ListBlockRenderer renderiza listas com estilos
  - [ ] FAQBlockRenderer renderiza accordeon com expansão

- [ ] **Integração** (T7.9, T7.10)
  - [ ] BlockEditor e BlockRenderer rotam corretamente
  - [ ] Fluxo completo funcionando para cada tipo
  - [ ] Testes E2E passando
  - [ ] Sem regressão em tipos existentes

- [ ] **Documentação** (T7.11)
  - [ ] SPEC.md atualizado
  - [ ] ROADMAP_SPRINTS.md atualizado
  - [ ] Exemplos de uso documentados

---

## 🎨 Padrões de Design System

### CTA Button Styles

| Style | Background | Color | Hover |
|-------|-----------|-------|-------|
| primary | `#d68e08` | white | `#b87a07` |
| secondary | `#f5f5f5` | `#191919` | `#e0e0e0` |
| outline | transparent | `#d68e08` | `#f5f5f5` |

### List Styles

| Style | Icon/Marker |
|-------|------------|
| default | • (bullet) ou 1. (number) |
| checkmark | ✓ (checkmark) |
| arrow | → (arrow) |

### FAQ Styling
- Background: `#f5f5f5`
- Question bold: `#191919`
- Answer normal: `#595959`
- Accordeon animation: 0.3s ease-out

---

## 📚 Referências

- `CMS_ADMIN_SPEC.md` — Especificação geral do Admin CMS
- `DECISIONS.md` — DEC-ADM-001 (decisão de usar Supabase)
- `DESIGN_SYSTEM.md` — Padrões visuais
- Sprint v6 (RichText Editor com TipTap)

---

## 🚀 Próximos Passos após v7

**Sprint CMS v8 — Versionamento e Rollback**
- UI de histórico de versões melhorada
- Comparação visual entre versões
- Revert automático para versão anterior

**Sprint CMS v9 — Audit Log Completo**
- Dashboard de auditoria
- Filtros por ação/usuário/data
- Exportação de logs

---

_Documento criado seguindo SDD (Spec-Driven Development)._  
_Aprovação e kick-off necessários antes de iniciar._
