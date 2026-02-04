# Sprint CMS v7 — Melhorias de UX & Validação Avançada
_Data: 2026-02-03_  
_Status: 🚀 INICIADO_  
_Prioridade: Alta_  
_Duração Estimada: 5-6 dias_  
_Tipo: Enhancement (Opção B selecionada)_

---

## 📋 Contexto

Após descoberta de que CTA, List e FAQ **já foram implementados na Sprint v1**, decidimos usar v7 para **melhorar significativamente a UX e adicionar validação robusta** aos editores existentes.

**Objetivo:** Tornar os editores mais intuitivos, com melhor feedback visual e funcionalidades que o cliente pediu.

---

## 🎯 Objetivos da Sprint

1. ✨ Melhorar UX dos editores (drag-drop, estilos, preview)
2. 🛡️ Validação robusta com mensagens contextuais
3. 🔧 Funcionalidades solicitadas (ordered list, richtext FAQ, etc)
4. ✅ Testes E2E para todos os cenários
5. 📚 Documentação para cliente e dev

---

## 📊 Requisitos por Tipo de Bloco

### 🟡 CTA Block Enhancements

**RF-V7-CTA-001 — Validação de URL em Tempo Real**
- [x] Validar protocolo (http, https, mailto, tel, /)
- [x] Mostrar erro inline se URL inválida
- [x] Sugerir correções comuns (faltou http://, etc)
- [x] Suportar links internos (/contato, #footer)

**RF-V7-CTA-002 — Target do Link**
- [x] Dropdown com opções: _self, _blank
- [x] Preview mostra comportamento correto
- [x] Padrão: _self

**RF-V7-CTA-003 — Preview Responsivo**
- [x] Mostra botão em múltiplos tamanhos (mobile, tablet, desktop)
- [x] Verifica se texto cabe no botão
- [x] Alerta se texto muito longo

**RF-V7-CTA-004 — Estilos Adicionais**
- [x] Adicionar "warning" (laranja/amarelo) e "danger" (vermelho)
- [x] Preview ao vivo de cada estilo
- [x] Cores seguem design system

**Validação:**
- ✅ `text` 1-100 caracteres
- ✅ `url` válida (protocolo correto)
- ✅ `style` em lista pré-definida
- ✅ `target` em lista pré-definida

---

### 📝 List Block Enhancements

**RF-V7-LIST-001 — Suporte a Lista Ordenada**
- [x] Toggle "Lista numerada" (ordered)
- [x] Preview mostra <ol> ou <ul> conforme seleção
- [x] Renderizador público suporta ambos

**RF-V7-LIST-002 — Estilos de Ícone**
- [x] Dropdown com opções: default (•), checkmark (✓), arrow (→)
- [x] Preview ao vivo de cada ícone
- [x] Renderizador renderiza ícone correto

**RF-V7-LIST-003 — Drag-and-Drop para Reordenar**
- [x] Interface drag-drop funcional
- [x] Feedback visual durante drag (hover)
- [x] Ordem refletida no preview
- [x] Compatível com mobile (touch events)

**RF-V7-LIST-004 — Importação em Lote**
- [x] Botão "Importar itens"
- [x] Textarea para colar múltiplas linhas
- [x] Cada linha = 1 item
- [x] Limpar duplicatas automaticamente

**RF-V7-LIST-005 — Limpar Tudo**
- [x] Botão "Limpar lista" com confirmação
- [x] Ícone de lixeira
- [x] Aviso visual antes de deletar

**Validação:**
- ✅ `items` minimo 1, máximo 100 itens
- ✅ Cada item 1-500 caracteres
- ✅ Sem itens duplicados (opcional)
- ✅ `ordered` boolean
- ✅ `style` em lista pré-definida

---

### ❓ FAQ Block Enhancements

**RF-V7-FAQ-001 — Richtext nas Respostas**
- [x] Editor richtext (bold, italic, links) para resposta
- [x] Preview mostra HTML renderizado
- [x] Renderizador público suporta HTML seguro (DOMPurify)

**RF-V7-FAQ-002 — Múltiplas Aberturas Simultâneas**
- [x] Toggle "Permitir múltiplas aberturas"
- [x] Padrão: false (accordion normal)
- [x] Com true: comportamento tipo checklist
- [x] Preview demonstra comportamento

**RF-V7-FAQ-003 — Busca/Filtro de Perguntas**
- [x] Campo de busca acima da lista
- [x] Filtra perguntas em tempo real
- [x] Destaca termo buscado em amarelo
- [x] Mostra contador (3/10 encontradas)

**RF-V7-FAQ-004 — Drag-and-Drop para Reordenar**
- [x] Interface drag-drop funcional
- [x] Feedback visual durante drag
- [x] Ordem refletida em preview
- [x] Mobile-friendly

**RF-V7-FAQ-005 — Importação JSON/CSV**
- [x] Botão "Importar Q&A"
- [x] Aceita JSON: [{question, answer}, ...]
- [x] Aceita CSV: pergunta,resposta (com \n para quebras)

**Validação:**
- ✅ `items` minimo 1, máximo 50 items
- ✅ Cada `question` 1-200 caracteres
- ✅ Cada `answer` 1-5000 caracteres
- ✅ Sem perguntas duplicadas (aviso)
- ✅ `allowMultiple` boolean

---

## 🏗️ Arquitetura Técnica

### Estrutura de Diretórios

```
src/
├── components/admin/
│   ├── editors/
│   │   ├── CtaBlockEditor.tsx           (MELHORAR)
│   │   ├── ListBlockEditor.tsx          (MELHORAR)
│   │   ├── FaqBlockEditor.tsx           (MELHORAR)
│   │   └── shared/
│   │       ├── UrlInput.tsx             (NOVO)
│   │       ├── DragDropList.tsx         (NOVO)
│   │       ├── RichTextAnswerEditor.tsx (NOVO)
│   │       └── ImportModal.tsx          (NOVO)
│   └── BlockEditorFactory.tsx           (SEM MUDANÇA)
├── utils/
│   ├── validation/
│   │   ├── validateUrl.ts              (NOVO)
│   │   ├── validateBlockContent.ts     (MELHORAR)
│   │   ├── blockValidators.ts          (NOVO)
│   │   └── validationErrors.ts         (NOVO)
│   └── cms/
│       └── blockValidationRules.ts     (NOVO)
├── components/
│   └── CmsBlockRenderer.tsx             (MELHORAR - suportar novo HTML)
└── hooks/
    └── useDragDrop.ts                   (NOVO - hook para drag/drop)
```

### Componentes Novos (Compartilhados)

**1. UrlInput.tsx** — Input de URL com validação em tempo real
```typescript
interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  label?: string;
}

// Valida: http://, https://, mailto:, tel:, /, #
// Mostra erro inline
// Seta ícone de status ✓ ou ✗
```

**2. DragDropList.tsx** — Lista com drag-drop
```typescript
interface DragDropListProps {
  items: string[];
  onReorder: (items: string[]) => void;
  onRemove: (index: number) => void;
  renderItem?: (item: string, index: number) => React.ReactNode;
}

// SortableJS ou React-Beautiful-DnD
// Feedback visual
// Mobile-friendly
```

**3. RichTextAnswerEditor.tsx** — Editor richtext para FAQ
```typescript
interface RichTextAnswerEditorProps {
  value: string;
  onChange: (html: string) => void;
  error?: string;
}

// TipTap (já está no projeto)
// Toolbar simplificada: bold, italic, link, list
```

**4. ImportModal.tsx** — Modal para importação em lote
```typescript
interface ImportModalProps {
  onImport: (items: string[]) => void;
  onClose: () => void;
  type: 'list' | 'faq'; // JSON ou CSV format
}

// Textarea
// Botões: Importar, Cancelar
// Validação de formato
// Preview dos itens
```

---

## 📝 Tarefas Detalhadas

### Fase 1: Componentes Compartilhados (1,5 dias)

**T7.1** — Criar `UrlInput.tsx`
- [ ] Input com label
- [ ] Validação regex
- [ ] Ícone de status (✓/✗)
- [ ] Mensagem de erro inline
- [ ] Suporte a URLs internas/externas/mailto/tel
- **Arquivo:** `src/components/admin/editors/shared/UrlInput.tsx`

**T7.2** — Criar `DragDropList.tsx`
- [ ] Usar React Beautiful DnD ou SortableJS
- [ ] Rendering de itens customizável
- [ ] Botão remover por item
- [ ] Feedback visual durante drag
- [ ] Mobile support (touch)
- **Arquivo:** `src/components/admin/editors/shared/DragDropList.tsx`

**T7.3** — Criar `RichTextAnswerEditor.tsx`
- [ ] Usar TipTap (já está no projeto)
- [ ] Toolbar: Bold, Italic, Link, List
- [ ] Validação de tamanho
- [ ] Mensagem de erro
- **Arquivo:** `src/components/admin/editors/shared/RichTextAnswerEditor.tsx`

**T7.4** — Criar `ImportModal.tsx`
- [ ] Textarea
- [ ] Detectar formato (JSON vs CSV)
- [ ] Validar entrada
- [ ] Preview de itens
- [ ] Botões: Importar, Cancelar
- **Arquivo:** `src/components/admin/editors/shared/ImportModal.tsx`

**T7.5** — Criar validators (`validateUrl.ts`, `blockValidators.ts`)
- [ ] `validateUrl(url: string): { valid: boolean; error?: string }`
- [ ] `validateCTA(content): string[]`
- [ ] `validateList(content): string[]`
- [ ] `validateFAQ(content): string[]`
- [ ] Testes unitários para cada validador
- **Arquivo:** `src/utils/validation/*.ts`

---

### Fase 2: CTA Block Enhancement (1,5 dias)

**T7.6** — Refatorar CtaBlockEditor.tsx
- [ ] Usar UrlInput para campo URL (com validação)
- [ ] Adicionar dropdown de target (_self, _blank)
- [ ] Adicionar estilos: primary, secondary, warning, danger
- [ ] Preview responsivo (3 tamanhos: mobile, tablet, desktop)
- [ ] Remover validação inline anterior
- [ ] Usar novo sistema de validators
- [ ] Testes: salvar, publicar, validação
- **Arquivo:** `src/components/admin/editors/CtaBlockEditor.tsx`

**T7.7** — Melhorar CmsBlockRenderer para CTA
- [ ] Suportar novo campo `target`
- [ ] Renderizar com `target` correto (href + target attribute)
- [ ] Suportar novos estilos (warning, danger)
- [ ] Acessibilidade (aria-label, title)
- **Arquivo:** `src/components/CmsBlockRenderer.tsx`

---

### Fase 3: List Block Enhancement (1,5 dias)

**T7.8** — Refatorar ListBlockEditor.tsx
- [ ] Usar DragDropList para reordenar itens
- [ ] Adicionar toggle "Lista numerada" (ordered)
- [ ] Adicionar dropdown de estilos: default, checkmark, arrow
- [ ] Adicionar botão "Importar itens" → ImportModal
- [ ] Adicionar botão "Limpar lista" com confirmação
- [ ] Preview mostra estilo correto (•, ✓, →)
- [ ] Usar novo sistema de validators
- [ ] Testes: drag-drop, validação, import
- **Arquivo:** `src/components/admin/editors/ListBlockEditor.tsx`

**T7.9** — Melhorar CmsBlockRenderer para List
- [ ] Renderizar <ul> ou <ol> conforme `ordered`
- [ ] Renderizar ícones corretos (•, ✓, →)
- [ ] CSS para estilos
- [ ] Sem quebras de layout
- **Arquivo:** `src/components/CmsBlockRenderer.tsx`

---

### Fase 4: FAQ Block Enhancement (1,5 dias)

**T7.10** — Refatorar FaqBlockEditor.tsx
- [ ] Usar RichTextAnswerEditor para respostas (ao invés de textarea)
- [ ] Adicionar toggle "Permitir múltiplas aberturas"
- [ ] Adicionar campo de busca/filtro de perguntas
- [ ] Usar DragDropList para reordenar linhas
- [ ] Adicionar botão "Importar Q&A" → ImportModal
- [ ] Preview mostra accordeon funcionando
- [ ] Usar novo sistema de validators
- [ ] Testes: richtext, accordion, busca, validação
- **Arquivo:** `src/components/admin/editors/FaqBlockEditor.tsx`

**T7.11** — Melhorar CmsBlockRenderer para FAQ
- [ ] Renderizar HTML seguro na resposta (DOMPurify)
- [ ] Suportar comportamento `allowMultiple`
- [ ] Animações suaves
- [ ] Acessibilidade (role, aria-expanded)
- [ ] Busca/destaque de termo (opcional)
- **Arquivo:** `src/components/CmsBlockRenderer.tsx`

---

### Fase 5: Integração & Testes (1 dia)

**T7.12** — Integração completa
- [ ] Todos os novos componentes funcionando
- [ ] Validação funcionando para todos os tipos
- [ ] Sem erros de lint
- [ ] Build sem problemas

**T7.13** — Testes E2E
- [ ] **CTA:** Login → editar URL + target + style → preview → publicar → site público ✓
- [ ] **List:** Login → adicionar items → drag-drop → import → ordenada → publicar → site público ✓
- [ ] **FAQ:** Login → adicionar Q&A com richtext → busca → múltiplas aberturas → publicar → site público ✓
- [ ] **Validação:** Tentar publicar sem preencher obrigatórios → erro ✓
- [ ] **Sem Regressão:** Blocos text/richtext/image ainda funcionam ✓

**T7.14** — Documentação
- [ ] Atualizar CMS_ADMIN_SPEC.md com v7
- [ ] Atualizar ROADMAP_SPRINTS.md
- [ ] Guia de uso para cliente (com screenshots)
- [ ] Documentação técnica interna

---

## 🧪 Testes de Aceitação

### AC-V7-001 — CTA Validação de URL
- [ ] URL válida (http://) aceita ✓
- [ ] URL sem protocolo → erro com sugestão
- [ ] URL mailto: aceita ✓
- [ ] URL interna (/contato) aceita ✓
- [ ] Preview mostra target correto

### AC-V7-002 — List Drag-Drop
- [ ] Arrastar item A para posição de item B funciona
- [ ] Ordem persiste ao salvar
- [ ] Feedback visual durante drag
- [ ] Funciona em mobile

### AC-V7-003 — FAQ Richtext
- [ ] Aplicar bold em resposta funciona
- [ ] Salvar e publicar preserva formatação
- [ ] Site público renderiza HTML seguro
- [ ] Sem quebra de layout

### AC-V7-004 — Importação
- [ ] Importar 10 itens de uma vez funciona
- [ ] Importar JSON válido funciona
- [ ] Importar CSV válido funciona
- [ ] Itens duplicados removidos

### AC-V7-005 — Validação Robusta
- [ ] Tentar salvar List sem itens → erro
- [ ] Tentar salvar FAQ com pergunta vazia → erro
- [ ] Mensagens de erro claras e acionáveis
- [ ] Botões desabilitados até validação passar

---

## 📐 Estimativa de Tempo

| Fase | Tarefas | Duração |
|------|---------|---------|
| 1 | Componentes compartilhados (T7.1-T7.5) | 1,5 dias |
| 2 | CTA Enhancement (T7.6-T7.7) | 1,5 dias |
| 3 | List Enhancement (T7.8-T7.9) | 1,5 dias |
| 4 | FAQ Enhancement (T7.10-T7.11) | 1,5 dias |
| 5 | Integração & Testes (T7.12-T7.14) | 1 dia |
| **Total** | | **7 dias** |

---

## ✅ Checklist de Implementação

### Componentes
- [ ] UrlInput.tsx — Input de URL com validação
- [ ] DragDropList.tsx — Lista com drag-drop
- [ ] RichTextAnswerEditor.tsx — Editor richtext
- [ ] ImportModal.tsx — Modal de importação

### Validadores
- [ ] validateUrl.ts
- [ ] blockValidators.ts
- [ ] Testes unitários

### CTA Enhancement
- [ ] CtaBlockEditor refatorado
- [ ] CmsBlockRenderer suporta novo HTML
- [ ] Testes E2E

### List Enhancement
- [ ] ListBlockEditor refatorado
- [ ] CmsBlockRenderer suporta <ol>, ícones
- [ ] Testes E2E

### FAQ Enhancement
- [ ] FaqBlockEditor refatorado
- [ ] CmsBlockRenderer suporta HTML seguro
- [ ] Testes E2E

### Documentação
- [ ] CMS_ADMIN_SPEC.md atualizado
- [ ] ROADMAP_SPRINTS.md atualizado
- [ ] Guia para cliente

---

## 📚 Referências

- `CMS_ADMIN_SPEC.md` — Especificação geral do Admin CMS
- `DESIGN_SYSTEM.md` — Padrões visuais (cores, tipografia)
- Sprint v6 (RichText Editor com TipTap)
- React Beautiful DnD ou SortableJS (para drag-drop)
- DOMPurify (para sanitizar HTML)

---

## 🚀 Próximos Passos após v7

**Sprint CMS v8 — Versionamento & Rollback Avançado**
- [ ] UI de histórico de versões melhorada
- [ ] Comparação visual entre versões (diff)
- [ ] Revert automático para versão anterior com 1 clique

**Sprint CMS v9 — Audit Log & Dashboard**
- [ ] Dashboard de auditoria
- [ ] Filtros por ação/usuário/data
- [ ] Exportação de logs

---

_Documento criado seguindo SDD (Spec-Driven Development)._  
_Sprint v7 iniciada em 2026-02-03._  
_Aprovação: ✅ Opção B (Melhorias) selecionada pelo usuário._
