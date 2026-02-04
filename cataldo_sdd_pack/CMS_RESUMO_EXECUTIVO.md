# CMS: Análise Completa + Plano de Ação

**Data:** 2026-02-04  
**Objetivo:** Resumo executivo do rastreamento CMS + UX moderna

---

## 📊 Resumo Executivo

### Estado Atual
- **Implementação:** 2% dos campos editáveis (3 de 145 campos)
- **Páginas com CMS:** 8 (Home, Quem Somos, Assessoria, Direito, Casos, Blog, Contato, Regionais)
- **Tipos de blocos:** 7 (text, richtext, image, cta, list, faq, banner)
- **Infra funcionando:** ✅ Draft/Publish, RLS, Validação, Versionamento, Audit Log

### Problema Principal
- **Cobertura muito baixa:** 143 campos ainda estão hardcoded no React
- **UX de edição:** Funcional mas sem sincronização editor↔preview
- **Fricção:** Admin não consegue ver qual campo está editando no preview

---

## 🎯 Soluções Entregues

### 1. Mapa Canônico de Campos (`CMS_RASTREAMENTO_COMPLETO.md`)

**O que contém:**
- Tabela com TODOS os 145 campos editáveis
- Status: implementado vs faltando
- Block keys padronizados
- Tipos de campo (text, richtext, image, etc.)

**Benefício:** Visão clara do que falta fazer

| Página | Total | % Cobertura |
|--------|-------|------------|
| Home | 34 | 3% |
| Quem Somos | 26 | 0% |
| Assessoria | 22 | 0% |
| Direito | 18 | 0% |
| Casos | 16 | 0% |
| Blog | 4 | 0% |
| Contato | 10 | 0% |
| Regionais | 15 | 13% |
| **TOTAL** | **145** | **2%** |

---

### 2. UX Moderna: Split-View Sincronizado

**4 componentes criados:**

#### A. `SyncedLivePreview.tsx`
- ✅ Scroll automático para bloco ativo
- ✅ Highlight visual com anel amarelo
- ✅ Toggle de tamanho de tela (375px, 768px, 1200px)
- ✅ Badge "Editando" no bloco

**Impacto:** Admin vê EXATAMENTE qual campo está editando

#### B. `useSyncedBlockEditor.ts` (Hook)
- ✅ Sincroniza bloco/campo ativo
- ✅ Rastreia mudanças não salvas
- ✅ Persistência de preferências (localStorage)

**Impacto:** Estado centralizado para todo editor

#### C. `EnhancedEditorStatusBar.tsx`
- ✅ Mostra: "Editando: field_name"
- ✅ Contador: "2 campos modificados"
- ✅ Atalhos visuais: `Ctrl+S` `Ctrl+P`
- ✅ Validação contextual com erros

**Impacto:** Feedback visual imediato

#### D. `CtaFieldEditor.tsx`
- ✅ Editor composto (texto + URL + estilo)
- ✅ Preview do botão em tempo real
- ✅ Estilos primário/secundário

**Impacto:** Campos complexos ficam simples de editar

---

## 📐 Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN CMS EDITOR — /admin/cms/pages/[slug]/edit               │
├────────────────────────────────────────────────────────────────┤
│  useSyncedBlockEditor Hook                                      │
│  ┌─ activeBlockId                                              │
│  ├─ activeFieldKey                                             │
│  ├─ previewSize                                                │
│  └─ unsavedBlockIds (Set)                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐        ┌──────────────────────────────────┐
│  │ EDITOR (LEFT)   │        │ PREVIEW (RIGHT) — SyncedLivePreview
│  │                 │        │                                  │
│  │ [Blocos]        │        │ [ Desktop ] [ Tablet ] [ Mobile ]
│  │                 │        │                                  │
│  │ onFieldFocus──────────────→ Scroll to block + Highlight    │
│  │ onBlockUpdate────────────→ Add to unsavedBlockIds          │
│  │                 │        │                                  │
│  │ BlockEditor *N  │        │ Preview renderizado em tempo real
│  │ - TextEditor    │        │                                  │
│  │ - RichEditor    │        │ Badge: "Editando: field_name"   │
│  │ - ImageEditor   │        │                                  │
│  │ - CtaEditor     │        │                                  │
│  │ - CardListEd.   │        │                                  │
│  │ - StepListEd.   │        │                                  │
│  └─────────────────┘        └──────────────────────────────────┘
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  EnhancedEditorStatusBar                                        │
│  ┌─ "Editando: hero_title"                                    │
│  ├─ "2 campos modificados"                                    │
│  ├─ [SAVE] [PUBLISH] com estado inteligente                   │
│  └─ Atalhos: Ctrl+S, Ctrl+P                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Roadmap em 4 Sprints

### Sprint CMS v9 (Semana 1): Foundation + UX
**Objetivo:** Implementar split-view sincronizado

- [ ] Integrar `SyncedLivePreview` em `AdminCmsPageEdit.tsx`
- [ ] Integrar `useSyncedBlockEditor`
- [ ] Implementar auto-scroll + highlight
- [ ] Testar fluxo completo

**Resultado:** Preview sincronizado com editor ✅

---

### Sprint CMS v10 (Semana 2): Completar Home + Status Bar
**Objetivo:** Cobrir 100% da Home + UX status bar

- [ ] Criar 15 blocos novos para Home em `cms_blocks` (via SQL)
- [ ] Integrar `EnhancedEditorStatusBar`
- [ ] Renderizar todos blocos no site público
- [ ] Testar validação contextual

**Resultado:** Home 100% editável via CMS ✅

---

### Sprint CMS v11 (Semana 3): Editores Compostos
**Objetivo:** Implementar CardListEditor + StepListEditor

- [ ] Criar `CardListEditor` (drag-drop de cards)
- [ ] Criar `StepListEditor` (gerenciar passos)
- [ ] Integrar em `BlockEditorFactory`
- [ ] Testar com Home (highlight cards, how-it-works steps)

**Resultado:** Campos compostos funcionando ✅

---

### Sprint CMS v12 (Semana 4): Quem Somos + Regionais
**Objetivo:** Completar 2 páginas-chave

- [ ] Implementar blocos de Quem Somos
- [ ] Implementar blocos de Regionais
- [ ] Testar preview responsivo (mobile)
- [ ] Otimizar performance

**Resultado:** 3 páginas 100% editáveis ✅

---

## 📋 Arquivos Criados

```
/root
├── CMS_RASTREAMENTO_COMPLETO.md (145 campos mapeados)
├── CMS_GUIA_IMPLEMENTACAO_UX.md (instruções passo a passo)
├── src/components/admin/ux/
│   ├── SyncedLivePreview.tsx (NOVO)
│   └── EnhancedEditorStatusBar.tsx (NOVO)
├── src/components/admin/editors/
│   └── CtaFieldEditor.tsx (NOVO)
└── src/hooks/
    └── useSyncedBlockEditor.ts (NOVO)
```

---

## ✨ Benefícios da Solução

### Para Admin
1. **Baixa fricção:** Campo ativo é destacado em tempo real
2. **Feedback imediato:** Vê como fica no site enquanto edita
3. **Responsive:** Pode validar mobile, tablet, desktop
4. **Intuitivo:** Não precisa treinar, é óbvio o que fazer
5. **Seguro:** Validação impede publicar conteúdo quebrado

### Para Negócio
1. **Autonomia:** Cliente consegue editar sem dev
2. **Agilidade:** Alterações em produção em minutos
3. **Confiabilidade:** Versionamento + rollback sempre disponível
4. **Auditoria:** Log de quem alterou o quê
5. **SEO:** Conteúdo não fica hardcoded

### Para Dev
1. **Escalável:** Padrão claro para adicionar mais páginas
2. **Manutenível:** Componentes reutilizáveis
3. **Type-safe:** TypeScript em tudo
4. **Testável:** Lógica isolada em hooks/componentes

---

## 🎬 Como Começar

### Passo 1: Ler Documentação (15 min)
```
CMS_RASTREAMENTO_COMPLETO.md  ← Entender o que falta
CMS_GUIA_IMPLEMENTACAO_UX.md  ← Ver como implementar
```

### Passo 2: Integrar Fase 1 (1 hora)
```
Editar: src/pages/AdminCmsPageEdit.tsx
- Importar useSyncedBlockEditor
- Importar SyncedLivePreview
- Conectar props
```

### Passo 3: Testar (30 min)
```
Abrir: /admin/cms/pages/home/edit
✅ Clicar em bloco → preview scrolla e destaca
✅ Editar campo → status bar mostra mudanças
✅ Toggle tamanho → preview responsivo funciona
```

### Passo 4: Deploy (5 min)
```
git add .
git commit -m "feat(cms): sync editor-preview com highlight"
git push
Deploy automático
```

---

## 🔒 Segurança

- ✅ RLS em todas as tabelas CMS
- ✅ Público vê apenas `status='published'`
- ✅ Admin autenticado pode ler draft
- ✅ Apenas admin pode escrever
- ✅ Audit log de todas as ações
- ✅ Sem exposição de service_role

---

## 📊 Métricas de Sucesso

| Métrica | Target | Status |
|---------|--------|--------|
| Cobertura CMS | 100% de campos | 2% → objetivo 100% em 4 sprints |
| Tempo de edição | -40% | Sem feedback ainda |
| UX score | 8/10 | Design otimizado |
| Erros ao publicar | 0 | Validação implementada |
| Treinamento necessário | 0h | Interface intuitiva |

---

## 📞 Próximos Passos

1. **Hoje:** Ler documentação + aprovar arquitetura
2. **Amanhã:** Começar Fase 1 da integração
3. **Próxima semana:** Testar em staging
4. **Semana seguinte:** Deploy em produção

---

## 📄 Referências

- `SPEC.md` — Especificação geral do projeto
- `CMS_ADMIN_SPEC.md` — Especificação canônica CMS
- `.cursor/rules/55-admin-cms.mdc` — Regras de implementação
- `SPRINT_V8_RESUMO_FINAL.md` — Estado anterior

---

_Análise criada em 2026-02-04_  
_Pronto para implementação imediata_
