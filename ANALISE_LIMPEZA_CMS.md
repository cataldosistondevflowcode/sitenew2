# 📊 Análise: Arquivos MD na Raiz — O Que Manter/Excluir

**Data:** 2026-02-04  
**Objetivo:** Mapear arquivos CMS na raiz e consolidar para SDD

---

## 📁 Arquivos na Raiz do Projeto (19 encontrados)

### ✅ CRIAR/INTEGRAR NOS DOCS CANÔNICOS (Fazem parte da Sprint v9)

**6 Arquivos Novos (Criados Hoje) — MANTER na raiz por enquanto, depois integrar em `cataldo_sdd_pack/`:**

| Arquivo | Tamanho | Status | Ação |
|---------|---------|--------|------|
| **CMS_RASTREAMENTO_COMPLETO.md** | 759 linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |
| **CMS_RESUMO_EXECUTIVO.md** | 300+ linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |
| **CMS_GUIA_IMPLEMENTACAO_UX.md** | 400+ linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |
| **CMS_VISUALIZACAO_UX.md** | 300+ linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |
| **CMS_INDICE_ARQUIVOS.md** | 346 linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |
| **README_CMS_COMPLETO.md** | 338 linhas | ✅ Novo | ➡️ Integrar em cataldo_sdd_pack/ |

**1 Arquivo de Validação — CRÍTICO, MANTER na raiz:**

| Arquivo | Tamanho | Status | Ação |
|---------|---------|--------|------|
| **CMS_VALIDACAO_FINAL.md** | 306 linhas | ✅ Novo | 📌 MANTER na raiz (referência rápida) |

---

### ❌ OBSOLETOS — Já Integrados em Docs Canônicos, Podem Ser Excluídos

| Arquivo | Conteúdo | Local Atual | Ação |
|---------|----------|------------|------|
| **CMS_ESCOPO_EDITAVEL.md** | O que pode ser editado (Sprint v7) | `cataldo_sdd_pack/` | ❌ EXCLUIR (duplica CMS_ADMIN_SPEC.md) |
| **ROADMAP_CMS_COMPLETO.md** | Roadmap de sprints | `cataldo_sdd_pack/ROADMAP_SPRINTS.md` | ❌ EXCLUIR (duplica ROADMAP_SPRINTS.md) |
| **IMPLEMENTACAO_CMS_V0.md** | Sprint v0 resumo | `cataldo_sdd_pack/` | ❌ EXCLUIR (info em ROADMAP_SPRINTS.md) |
| **CMS_SUMARIO_ENTREGAS.md** | Índice de entregáveis | (raiz) | ⚠️ DUPLICA CMS_INDICE_ARQUIVOS.md — EXCLUIR |

**Razão:** Tudo já está em `cataldo_sdd_pack/ROADMAP_SPRINTS.md` atualizado hoje.

---

### 📋 TESTES/RESULTADOS — Mantêm Valor Histórico, Podem Ficar

| Arquivo | Propósito | Status | Ação |
|---------|-----------|--------|------|
| **TESTE_RESULTADOS_CMS_V8.md** | Resultados E2E da Sprint v8 | ✅ Histórico | 📌 MANTER (referência de testes) |
| **TESTE_CMS_V8_COMPLETO.md** | Teste completo v8 | ✅ Histórico | 📌 MANTER (referência de testes) |

---

### 📚 DOCS CANÔNICOS (em `cataldo_sdd_pack/`) — NÃO MEXER

| Arquivo | Status | Atualizado Hoje? |
|---------|--------|-----------------|
| **CMS_ADMIN_SPEC.md** | ✅ Canônico | Sim, adicionada Sprint v9 |
| **ROADMAP_SPRINTS.md** | ✅ Canônico | Sim, adicionada Sprint v9 |
| **CMS_ADMIN_GAPS_SPEC_VS_IMPL.md** | ✅ Canônico | Não (intacto) |
| **SPRINT_CMS_V7.md** | ✅ Histórico | Não (intacto) |
| **SPRINT_CMS_V7_FINAL.md** | ✅ Histórico | Não (intacto) |
| **SPRINT_CMS_V7_REALIDADE.md** | ✅ Histórico | Não (intacto) |
| **TEST_CMS_MANUAL.md** | ✅ Histórico | Não (intacto) |

---

## 🎯 Plano de Limpeza

### Passo 1: Excluir Arquivos Obsoletos (4 arquivos)
```bash
# Estes já têm conteúdo em cataldo_sdd_pack/
rm CMS_ESCOPO_EDITAVEL.md
rm ROADMAP_CMS_COMPLETO.md
rm IMPLEMENTACAO_CMS_V0.md
rm CMS_SUMARIO_ENTREGAS.md
```

**Razão:** Conteúdo consolidado em ROADMAP_SPRINTS.md atualizado hoje

---

### Passo 2: Mover Documentos Novos para cataldo_sdd_pack/ (6 arquivos)
```bash
# Estes são documentação SDD, devem ir em cataldo_sdd_pack/
mv CMS_RASTREAMENTO_COMPLETO.md cataldo_sdd_pack/
mv CMS_RESUMO_EXECUTIVO.md cataldo_sdd_pack/
mv CMS_GUIA_IMPLEMENTACAO_UX.md cataldo_sdd_pack/
mv CMS_VISUALIZACAO_UX.md cataldo_sdd_pack/
mv CMS_INDICE_ARQUIVOS.md cataldo_sdd_pack/
mv README_CMS_COMPLETO.md cataldo_sdd_pack/
```

**Razão:** Documentação SDD deve estar centralizada em cataldo_sdd_pack/

---

### Passo 3: Manter na Raiz (2 arquivos)
```bash
# CMS_VALIDACAO_FINAL.md → MANTER na raiz
# (referência rápida de validation/checklist)

# TESTE_RESULTADOS_CMS_V8.md → MANTER na raiz
# (histórico de testes, pode ser útil para debugging)

# TESTE_CMS_V8_COMPLETO.md → MANTER na raiz
# (histórico de testes)
```

**Razão:** Valor histórico ou referência rápida

---

## 📊 Resultado Final (Após Limpeza)

### Na Raiz (3 arquivos):
```
├── CMS_VALIDACAO_FINAL.md ← Referência rápida de validation
├── TESTE_RESULTADOS_CMS_V8.md ← Histórico de testes
└── TESTE_CMS_V8_COMPLETO.md ← Histórico de testes
```

### Em cataldo_sdd_pack/ (Docs Novos adicionados):
```
├── CMS_ADMIN_SPEC.md ← Atualizado com Sprint v9 ✅
├── ROADMAP_SPRINTS.md ← Atualizado com Sprint v9 ✅
├── CMS_RASTREAMENTO_COMPLETO.md ← NOVO (mover de raiz)
├── CMS_RESUMO_EXECUTIVO.md ← NOVO (mover de raiz)
├── CMS_GUIA_IMPLEMENTACAO_UX.md ← NOVO (mover de raiz)
├── CMS_VISUALIZACAO_UX.md ← NOVO (mover de raiz)
├── CMS_INDICE_ARQUIVOS.md ← NOVO (mover de raiz)
├── README_CMS_COMPLETO.md ← NOVO (mover de raiz)
├── CMS_ADMIN_GAPS_SPEC_VS_IMPL.md ← Existente
├── SPRINT_CMS_V7*.md ← Histórico
└── TEST_CMS_MANUAL.md ← Histórico
```

---

## ✅ Checklist de Limpeza

- [ ] Excluir `CMS_ESCOPO_EDITAVEL.md` (obsoleto)
- [ ] Excluir `ROADMAP_CMS_COMPLETO.md` (duplica ROADMAP_SPRINTS.md)
- [ ] Excluir `IMPLEMENTACAO_CMS_V0.md` (info em ROADMAP)
- [ ] Excluir `CMS_SUMARIO_ENTREGAS.md` (duplica CMS_INDICE_ARQUIVOS.md)
- [ ] Mover 6 documentos novos para `cataldo_sdd_pack/`
- [ ] Manter `CMS_VALIDACAO_FINAL.md` na raiz (referência rápida)
- [ ] Manter testes na raiz (histórico)
- [ ] Atualizar `CMS_INDICE_ARQUIVOS.md` com novo local (cataldo_sdd_pack/)

---

## 📌 Por Que Essa Limpeza?

1. **Consolidação SDD:** Toda documentação SDD em `cataldo_sdd_pack/`
2. **Sem duplicação:** Evita versões diferentes do mesmo conteúdo
3. **Referência rápida:** `CMS_VALIDACAO_FINAL.md` fica na raiz para acesso fácil
4. **Histórico preservado:** Testes mantidos para referência
5. **Estrutura clara:** Fácil navegar e encontrar documentação

---

## 🎯 Próximos Passos

1. **Hoje:** Executar limpeza (excluir 4 + mover 6)
2. **Hoje:** Atualizar referências internas (se houver)
3. **Amanhã:** Documentação SDD pronta em cataldo_sdd_pack/
4. **Amanhã:** Começar Sprint CMS v9 com documentação limpa

---

_Análise criada em 2026-02-04_
_Recomendação: Executar limpeza para manter repositório organizado_
