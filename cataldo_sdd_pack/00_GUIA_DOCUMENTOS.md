# 📚 GUIA: Quais Documentos Seguir?

**Atualizado:** 2026-02-04

---

## ✅ DOCUMENTOS CANÔNICOS (SÓ ESSES GUIAM O PROJETO)

### 1. SPEC.md
**O que é:** Especificação geral do projeto (requisitos, fases, regras)  
**Quando usar:** Para entender o escopo completo do site

### 2. CMS_ADMIN_SPEC.md
**O que é:** Especificação do Admin CMS (tipo WordPress)  
**Quando usar:** Para implementar/entender o CMS

### 3. ROADMAP_SPRINTS.md
**O que é:** Roadmap de execução com todas as sprints  
**Quando usar:** Para saber o que fazer em cada sprint

### 4. DESIGN_SYSTEM.md
**O que é:** Padrão visual obrigatório (cores, fontes, espaçamentos)  
**Quando usar:** Para qualquer trabalho visual/frontend

---

## 📋 DOCUMENTOS DE SUPORTE (SPRINT CMS v9)

Estes documentos detalham a Sprint CMS v9 (UX sincronizada):

| Documento | Para que serve |
|-----------|---------------|
| `CMS_RASTREAMENTO_COMPLETO.md` | Mapa de 145 campos por página |
| `CMS_GUIA_IMPLEMENTACAO_UX.md` | Passo a passo de implementação |
| `CMS_VISUALIZACAO_UX.md` | Fluxo de interações (diagramas) |
| `CMS_RESUMO_EXECUTIVO.md` | Resumo para stakeholders |
| `CMS_INDICE_ARQUIVOS.md` | Índice de todos os docs |
| `README_CMS_COMPLETO.md` | Visão geral completa |

---

## 🗑️ PODE IGNORAR (Histórico/Legado)

Estes são apenas histórico, não guiam mais o projeto:

- `SPRINT_CMS_V7*.md` — Histórico da Sprint v7
- `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` — Gap analysis (já resolvido)
- `TEST_CMS_MANUAL.md` — Testes manuais antigos
- `SPRINT0.md` a `SPRINT7.md` — Histórico de sprints antigas

---

## 🎯 FLUXO SIMPLES

```
COMEÇAR AQUI:
    ↓
1. SPEC.md (entender projeto)
    ↓
2. ROADMAP_SPRINTS.md (ver sprint atual)
    ↓
3. CMS_ADMIN_SPEC.md (se for trabalhar no CMS)
    ↓
4. CMS_GUIA_IMPLEMENTACAO_UX.md (Sprint v9 - passo a passo)
```

---

## 📁 ESTRUTURA SIMPLIFICADA

```
cataldo_sdd_pack/
├── 00_GUIA_DOCUMENTOS.md ← VOCÊ ESTÁ AQUI
│
├── CANÔNICOS (guiam o projeto):
│   ├── SPEC.md
│   ├── CMS_ADMIN_SPEC.md
│   ├── ROADMAP_SPRINTS.md
│   └── DESIGN_SYSTEM.md
│
├── SPRINT CMS v9 (suporte):
│   ├── CMS_RASTREAMENTO_COMPLETO.md
│   ├── CMS_GUIA_IMPLEMENTACAO_UX.md
│   ├── CMS_VISUALIZACAO_UX.md
│   └── (outros)
│
└── HISTÓRICO (ignorar):
    ├── SPRINT_CMS_V7*.md
    └── (outros)
```

---

## 🚀 RESUMO

**Para trabalhar no projeto:**
1. Abra `ROADMAP_SPRINTS.md` → veja sprint atual
2. Siga as instruções da sprint
3. Se for CMS → use `CMS_ADMIN_SPEC.md` + `CMS_GUIA_IMPLEMENTACAO_UX.md`
4. Se for visual → use `DESIGN_SYSTEM.md`

**Não se perca!** Só siga os 4 documentos canônicos.
