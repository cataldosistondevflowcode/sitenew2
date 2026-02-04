# Guia de Implementação: CMS Split-View Sincronizado

**Versão:** 1.0  
**Data:** 2026-02-04  
**Objetivo:** Implementar UX moderna de edição lado a lado com sincronização

---

## ✅ Componentes Criados

### 1. `SyncedLivePreview.tsx`
**Localização:** `src/components/admin/ux/SyncedLivePreview.tsx`

**Melhorias:**
- ✅ Auto-scroll para bloco ativo
- ✅ Highlight visual do campo em edição (anel amarelo)
- ✅ Toggle de tamanho de tela (mobile/tablet/desktop)
- ✅ Badge "Editando" no bloco ativo
- ✅ Click em blocos para focar

**Próximos passos:** Integrar em `AdminCmsPageEdit.tsx`

---

### 2. `useSyncedBlockEditor.ts` (Hook)
**Localização:** `src/hooks/useSyncedBlockEditor.ts`

**Funcionalidades:**
- ✅ Gerencia bloco/campo ativo
- ✅ Rastreia mudanças não salvas (Set de IDs)
- ✅ Tamanho de preview (persiste em localStorage)
- ✅ Callbacks para sincronização

**Como usar:**
```typescript
const {
  activeBlockId,
  activeFieldKey,
  previewSize,
  unsavedCount,
  onFieldFocus,
  onBlockUpdate,
  onSaveComplete,
  setPreviewSize,
} = useSyncedBlockEditor();
```

---

### 3. `EnhancedEditorStatusBar.tsx`
**Localização:** `src/components/admin/ux/EnhancedEditorStatusBar.tsx`

**Melhorias:**
- ✅ Mostra campo ativo em tempo real
- ✅ Contador de mudanças
- ✅ Indicadores de erro
- ✅ Atalhos de teclado (Ctrl+S, Ctrl+P)
- ✅ Botões de ação desabilitados conforme estado

**Próximos passos:** Integrar em layout do editor

---

### 4. `CtaFieldEditor.tsx`
**Localização:** `src/components/admin/editors/CtaFieldEditor.tsx`

**Funcionalidades:**
- ✅ Editor composto (texto + URL + estilo)
- ✅ Preview do botão em tempo real
- ✅ Validação de URL
- ✅ Estilos primário/secundário
- ✅ Callbacks para sincronização

---

## 📋 Plano de Integração em 3 Fases

### FASE 1 (Hoje): Integrar SyncedLivePreview + Hook

**Arquivo a alterar:** `src/pages/AdminCmsPageEdit.tsx`

**Passos:**

1. Importar `useSyncedBlockEditor`:
```typescript
import { useSyncedBlockEditor } from '@/hooks/useSyncedBlockEditor';
```

2. Importar `SyncedLivePreview`:
```typescript
import { SyncedLivePreview } from '@/components/admin/ux/SyncedLivePreview';
```

3. Dentro do componente, após `useCmsContent`:
```typescript
const {
  activeBlockId,
  activeFieldKey,
  previewSize,
  unsavedCount,
  onFieldFocus,
  onBlockUpdate,
  onSaveComplete,
  setPreviewSize,
} = useSyncedBlockEditor();
```

4. Substituir `<LivePreview>` por `<SyncedLivePreview>`:

**ANTES:**
```jsx
<LivePreview blocks={blocks} isDraft={true} />
```

**DEPOIS:**
```jsx
<SyncedLivePreview
  blocks={blocks}
  isDraft={true}
  activeBlockId={activeBlockId}
  activeFieldKey={activeFieldKey}
  previewSize={previewSize}
  onBlockFocus={onFieldFocus}
  onPreviewSizeChange={setPreviewSize}
/>
```

5. Ao expandir cada bloco no editor, chamar `onFieldFocus`:

Em cada campo do editor (TextBlockEditor, ImageBlockEditor, etc.):
```jsx
<input
  onFocus={() => onFieldFocus(blockId, 'field_name')}
  // ...
/>
```

---

### FASE 2 (Amanhã): Integrar EnhancedEditorStatusBar

**Arquivo a alterar:** `src/pages/AdminCmsPageEdit.tsx`

1. Importar:
```typescript
import { EnhancedEditorStatusBar } from '@/components/admin/ux/EnhancedEditorStatusBar';
```

2. Coletar erros de validação (já existente em `useCmsContent`):
```typescript
const validationErrors = blocks
  .filter((b) => unsavedBlockIds.has(b.id))
  .flatMap((b) => 
    validateBlockContent(b)?.map(err => ({
      blockId: b.id,
      fieldKey: b.block_key,
      message: err,
    })) || []
  );
```

3. Substituir `LivePreview` por novo layout com `EnhancedEditorStatusBar`:

```jsx
<div className="flex h-full flex-col">
  <SyncedLivePreview
    blocks={blocks}
    isDraft={true}
    activeBlockId={activeBlockId}
    activeFieldKey={activeFieldKey}
    previewSize={previewSize}
    onBlockFocus={onFieldFocus}
    onPreviewSizeChange={setPreviewSize}
  />

  <EnhancedEditorStatusBar
    activeBlockId={activeBlockId}
    activeFieldKey={activeFieldKey}
    unsavedCount={unsavedCount}
    validationErrors={validationErrors}
    isSaving={isSaving}
    isPublishing={false}
    onSave={async () => {
      // Salvar todos os blocos não salvos
      for (const id of unsavedBlockIds) {
        const block = blocks.find(b => b.id === id);
        if (block) {
          await updateBlockDraft(block.id, block.content_draft);
        }
      }
      onSaveComplete(Array.from(unsavedBlockIds));
    }}
    onPublish={async () => {
      // Publicar blocos não salvos
      for (const id of unsavedBlockIds) {
        await publishBlock(id);
      }
      onSaveComplete(Array.from(unsavedBlockIds));
    }}
  />
</div>
```

---

### FASE 3 (Próxima semana): Integrar CtaFieldEditor e Editores Compostos

1. Atualizar `BlockEditorFactory.tsx` para reconhecer tipo `cta`:

```typescript
case 'cta':
  return (
    <CtaFieldEditor
      value={block.content_draft || { text: '', url: '', style: 'primary' }}
      onChange={(content) => onUpdate(block.id, { ...block, content_draft: content })}
      onFieldFocus={(fieldKey) => onFieldFocus?.(block.id, fieldKey)}
      isDirty={isDirtyBlock}
      errors={validationErrors[block.block_key] || {}}
      onSave={() => updateBlockDraft(block.id, block.content_draft)}
    />
  );
```

2. Criar editor composto para Cards:

```typescript
// src/components/admin/editors/CardListEditor.tsx
export function CardListEditor({
  value,
  onChange,
  onFieldFocus,
  onUpdate,
  isDirty,
  errors,
}: CardListEditorProps) {
  // Implementar drag-and-drop, adicionar/remover cards
  // Seguir padrão de CtaFieldEditor
}
```

3. Criar editor composto para Steps:

```typescript
// src/components/admin/editors/StepListEditor.tsx
export function StepListEditor({
  // Idem
}) {
  // Implementar
}
```

---

## 🚀 Como Testar Cada Fase

### Fase 1: SyncedLivePreview

1. Abrir `/admin/cms/pages/home/edit`
2. Clicar em um bloco (ex: hero_title)
3. ✅ Verificar:
   - [ ] Preview scrolla para o bloco
   - [ ] Bloco tem highlight amarelo
   - [ ] Badge "Editando" aparece
   - [ ] Toggle de tamanho funciona

### Fase 2: EnhancedEditorStatusBar

1. Editar um campo (digitar algo)
2. ✅ Verificar:
   - [ ] Mostra "Editando: field_name"
   - [ ] Mostra "1 campo modificado"
   - [ ] Botão "Salvar" está ativo
   - [ ] Atalhos aparecem

3. Clicar "Salvar"
4. ✅ Verificar:
   - [ ] Mudança é salva
   - [ ] Contador volta a 0
   - [ ] Mostra "Tudo salvo"

### Fase 3: CtaFieldEditor

1. Em página com CTA, clicar para expandir
2. ✅ Verificar:
   - [ ] Campos de texto e URL aparecem
   - [ ] Preview do botão mostra em tempo real
   - [ ] Estilo primário/secundário funciona
   - [ ] URL validation funciona

---

## 📝 Checklist de Implementação

### Semana 1: Setup Básico
- [ ] Ler este documento
- [ ] Testar componentes individualmente em Storybook (opcional)
- [ ] Integrar Fase 1 em `AdminCmsPageEdit.tsx`
- [ ] Testar fluxo básico
- [ ] Commit com mensagem: "feat(cms): sync editor-preview com highlight"

### Semana 2: Status Bar
- [ ] Integrar Fase 2
- [ ] Testar counter de mudanças
- [ ] Testar validação contextual
- [ ] Commit com mensagem: "feat(cms): enhanced status bar com atalhos"

### Semana 3: Editores Compostos
- [ ] Integrar Fase 3
- [ ] Criar CardListEditor
- [ ] Criar StepListEditor
- [ ] Testar com Home
- [ ] Commit com mensagem: "feat(cms): composite field editors (CTA, cards, steps)"

---

## 🔗 Relacionados

- `CMS_RASTREAMENTO_COMPLETO.md` — Mapa de campos por página
- `CMS_ADMIN_SPEC.md` — Especificação canônica
- `src/pages/AdminCmsPageEdit.tsx` — Página a alterar
- `src/hooks/useCmsContent.ts` — Hook existente (não alterar)

---

## 📞 Suporte

Se algo não funcionar:

1. Verifique se imports estão corretos
2. Verifique se tipos de props estão corretos
3. Rode `npm run type-check` para checar erros TypeScript
4. Veja logs do navegador (F12) para erros de runtime

---

_Guia criado em 2026-02-04 como roadmap de implementação._
