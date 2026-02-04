# 🚀 Sprint CMS v7 — Progresso de Implementação

_Data: 2026-02-03_  
_Status: 🔄 EM ANDAMENTO_  
_Progresso: Fase 1 COMPLETA | Fase 2 (CTA) 50% | Fase 3-5 PENDENTES_

---

## ✅ O Que Foi Feito Até Agora

### Fase 1: Componentes Compartilhados — COMPLETA ✅

#### ✅ 1. `UrlInput.tsx` (Novo)
**Arquivo:** `src/components/admin/editors/shared/UrlInput.tsx`

Componente input de URL com:
- ✅ Validação em tempo real
- ✅ Suporte a URLs externas (http://, https://)
- ✅ Suporte a URLs internas (/contato, #footer)
- ✅ Suporte a mailto: e tel:
- ✅ Ícone de status (✓/✗)
- ✅ Sugestões automáticas de correção
- ✅ Mensagens de erro inline amigáveis
- ✅ Helper text contextual

**Uso:**
```tsx
<UrlInput
  value={url}
  onChange={setUrl}
  onError={setError}
  label="URL do Botão"
  showSuggestion={true}
/>
```

---

#### ✅ 2. `DragDropList.tsx` (Novo)
**Arquivo:** `src/components/admin/editors/shared/DragDropList.tsx`

Componente de lista com drag-and-drop para:
- ✅ Reordenar itens com mouse
- ✅ Feedback visual durante drag
- ✅ Mobile-friendly (touch events)
- ✅ Remover items com 1 clique
- ✅ Edição inline (opcional)
- ✅ Ícone de grip visual

**Uso:**
```tsx
<DragDropList
  items={items}
  onReorder={setItems}
  onRemove={(idx) => setItems(items.filter((_, i) => i !== idx))}
  editable={true}
/>
```

---

#### ✅ 3. `ImportModal.tsx` (Novo)
**Arquivo:** `src/components/admin/editors/shared/ImportModal.tsx`

Modal para importação em lote com:
- ✅ Suporte a texto simples (um item por linha)
- ✅ Suporte a JSON
- ✅ Suporte a pares separados por `|` (para FAQ)
- ✅ Preview dos itens antes de importar
- ✅ Validação de formato
- ✅ Contador de itens

**Uso:**
```tsx
<ImportModal
  isOpen={showImport}
  onClose={() => setShowImport(false)}
  onImport={(items) => setItems(prev => [...prev, ...items])}
  type="list"
/>
```

---

#### ✅ 4. `validateUrl.ts` (Novo)
**Arquivo:** `src/utils/validation/validateUrl.ts`

Validador de URLs com:
- ✅ Validação de protocolo (http, https, mailto, tel, /)
- ✅ Detecção automática de tipo (external, internal, email, phone)
- ✅ Mensagens de erro contextuais
- ✅ Sugestões de correção automáticas
- ✅ Regex seguro para email e telefone

**Uso:**
```tsx
import { validateUrl } from '@/utils/validation/validateUrl';

const result = validateUrl('https://exemplo.com');
if (!result.valid) {
  console.error(result.error); // "URL inválida"
  console.log(result.suggestion); // Sugestão de correção
}
```

---

#### ✅ 5. `blockValidators.ts` (Novo)
**Arquivo:** `src/utils/validation/blockValidators.ts`

Validadores específicos por tipo de bloco com:
- ✅ `validateCTAContent()` — Valida blocos CTA
- ✅ `validateListContent()` — Valida blocos List
- ✅ `validateFAQContent()` — Valida blocos FAQ
- ✅ `validateTextContent()` — Valida blocos Text
- ✅ `validateRichTextContent()` — Valida blocos RichText
- ✅ `validateImageContent()` — Valida blocos Image
- ✅ `validateBlockContent(type, content)` — Dispatcher genérico
- ✅ Retorna array de `ValidationError` com field, message, type

**Exemplo de erro:**
```typescript
interface ValidationError {
  field: string;      // ex: "text", "items[0]", "url"
  message: string;    // ex: "Texto do botão é obrigatório"
  type: 'error' | 'warning';
}
```

**Uso:**
```tsx
import { validateCTAContent, hasValidationErrors } from '@/utils/validation/blockValidators';

const errors = validateCTAContent({ text, url, style, target });
if (hasValidationErrors(errors)) {
  // Bloquear publicação
}
```

---

### Fase 2: CTA Enhancement — 50% COMPLETA ⏳

#### ✅ T7.6: `CtaBlockEditor.tsx` Refatorado
**Arquivo:** `src/components/admin/editors/CtaBlockEditor.tsx`

Melhorias implementadas:
- ✅ Usa `UrlInput` para validação de URL em tempo real
- ✅ Novo campo `target` (abrir em mesma aba ou nova aba)
- ✅ Novos estilos: primary, secondary, warning, danger, success
- ✅ Preview responsivo (3 tamanhos: mobile, tablet, desktop)
- ✅ Validação robusta com `validateCTAContent()`
- ✅ Mensagens de erro inline detalhadas
- ✅ Botões desabilitados até validação passar
- ✅ Suporte completo a sugestões de URL

**Novidades no UI:**
- 🎨 5 estilos diferentes com cores visuais
- 📱 Preview responsivo mostra como fica em mobile/tablet/desktop
- ✅ Ícone de status ao lado do label
- 💡 Helper text com exemplos de URLs aceitas
- ⚠️ Contador de caracteres para o texto
- 🔴 Erros agrupados em seção visível

#### ⏳ T7.7: `CmsBlockRenderer` para CTA
**Arquivo:** `src/components/CmsBlockRenderer.tsx`

Melhorias implementadas:
- ✅ Suporta novo campo `target` (_self, _blank)
- ✅ Renderiza com `rel="noopener noreferrer"` quando _blank
- ✅ Suporta novos estilos (warning, danger, success)
- ✅ Acessibilidade (aria-label pronto para adicionar)

---

## 🎯 O Que Falta

### Fase 2: CTA Enhancement — FALTA ⏳
- [ ] T7.7: Testes E2E para CTA (editar → publicar → renderizar)
- [ ] T7.7: Testar validação com URLs inválidas

### Fase 3: List Enhancement — PENDENTE ⏳
- [ ] T7.8: Refatorar `ListBlockEditor.tsx`
  - [ ] Adicionar toggle "Lista numerada"
  - [ ] Adicionar dropdown de estilos (checkmark, arrow)
  - [ ] Usar `DragDropList` para reordenar
  - [ ] Integrar `ImportModal`
  - [ ] Usar `validateListContent()`
- [ ] T7.9: Melhorar `CmsBlockRenderer` para List
  - [ ] Renderizar <ul> ou <ol> conforme `ordered`
  - [ ] Renderizar ícones (•, ✓, →)

### Fase 4: FAQ Enhancement — PENDENTE ⏳
- [ ] T7.10: Refatorar `FaqBlockEditor.tsx`
  - [ ] Usar RichText para respostas
  - [ ] Adicionar toggle "Múltiplas aberturas"
  - [ ] Adicionar campo de busca
  - [ ] Usar `DragDropList` para reordenar
  - [ ] Integrar `ImportModal`
  - [ ] Usar `validateFAQContent()`
- [ ] T7.11: Melhorar `CmsBlockRenderer` para FAQ
  - [ ] Renderizar HTML seguro (DOMPurify)
  - [ ] Suportar `allowMultiple`

### Fase 5: Integração & Testes — PENDENTE ⏳
- [ ] T7.12: Integração completa
- [ ] T7.13: Testes E2E (CTA, List, FAQ)
- [ ] T7.14: Documentação (SPEC, ROADMAP, guia cliente)

---

## 📊 Métricas de Desenvolvimento

| Métrica | Valor |
|---------|-------|
| Linhas de código novas | ~1.500 |
| Componentes novos | 4 (UrlInput, DragDropList, ImportModal, Validators) |
| Funcionalidades adicionadas | 15+ |
| Testes unitários | 0 (próximo) |
| Testes E2E | 0 (próximo) |

---

## 🔧 Como Usar os Novos Componentes

### 1. UrlInput com Validação
```tsx
import { UrlInput } from '@/components/admin/editors/shared/UrlInput';

<UrlInput
  value={url}
  onChange={setUrl}
  onError={(error) => {
    if (error) {
      // Mostrar erro
    }
  }}
  label="URL do CTA"
  showSuggestion={true}
/>
```

### 2. DragDropList para Reordenar
```tsx
import { DragDropList } from '@/components/admin/editors/shared/DragDropList';

<DragDropList
  items={items}
  onReorder={(newItems) => setItems(newItems)}
  onRemove={(index) => {
    setItems(items.filter((_, i) => i !== index));
  }}
  editable={true}
  label="Itens da Lista"
/>
```

### 3. ImportModal para Importar em Lote
```tsx
import { ImportModal } from '@/components/admin/editors/shared/ImportModal';

const [showImport, setShowImport] = useState(false);

<>
  <button onClick={() => setShowImport(true)}>Importar Itens</button>
  <ImportModal
    isOpen={showImport}
    onClose={() => setShowImport(false)}
    onImport={(newItems) => {
      setItems(prev => [...prev, ...newItems]);
    }}
    type="list"
  />
</>
```

### 4. Validação Robusta
```tsx
import { validateCTAContent, hasValidationErrors } from '@/utils/validation/blockValidators';

const content = { text, url, style, target };
const errors = validateCTAContent(content);

if (hasValidationErrors(errors)) {
  // Mostrar erros ao usuário
  errors.forEach((error) => {
    if (error.type === 'error') {
      console.error(`${error.field}: ${error.message}`);
    }
  });
  return; // Não permitir salvamento
}

// OK para salvar
await onSaveDraft(content);
```

---

## 🚀 Próximas Ações

### Opção 1: Continuar com List Enhancement
Refatorar `ListBlockEditor.tsx` para usar novos componentes e validação.

### Opção 2: Testes E2E para CTA
Criar testes de browser para validar fluxo completo do CTA.

### Opção 3: FAQ Enhancement
Refatorar `FaqBlockEditor.tsx` com suporte a richtext e busca.

**Recomendação:** Seguir a sequência (Opção 1 → 2 → 3) para manter coerência.

---

## 📝 Notas Técnicas

- **UrlInput** usa regex simples para validação (poderia ser melhorado com validação mais robusta)
- **DragDropList** usa drag-drop nativa do HTML5 (compatível com mobile)
- **ImportModal** detecta formato automaticamente (texto, JSON, ou pares)
- **blockValidators** usa interface `ValidationError` para coerência
- **CTA novo** suporta `target` mas pode ser expandido para `title`, `aria-label`, etc.

---

_Sprint v7 — Opção B (Melhorias) — Em Progresso_  
_Recomendação: Continuar com Phase 3 (List Enhancement) próxima_
