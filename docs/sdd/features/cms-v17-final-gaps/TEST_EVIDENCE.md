# CMS v17 — Evidências de Teste

**Data:** 2026-02-05  
**Sprint:** CMS v17 - Final Gaps (Slugs + Consumo)

---

## 1. Resumo das Alterações

### 1.1 Migração de Slugs (DEC-ADM-003)

| ID | Slug Anterior | Slug Novo | URL Pública |
|----|---------------|-----------|-------------|
| 1 | `home` | `leilao-rj` | `/leilao-rj` |
| 10 | `regional-copacabana` | `catalogo-copacabana` | `/catalogo/copacabana` |

### 1.2 Correção de Conteúdo CMS

| Bloco | Valor Anterior | Valor Corrigido |
|-------|----------------|-----------------|
| `hero_title` (id=1) | `" - Teste v8"` | `"Imóveis em Leilão\nno Rio de Janeiro"` |
| `hero_image` (id=2) | `{}` (vazio) | `{"url": "/visao-panoramica-rio-janeiro.jpg", "alt": "Vista panorâmica do Rio de Janeiro"}` |

### 1.3 Código Reabilitado

- `HeroSectionWithCms.tsx` — Reabilitado para consumir CMS
- `LeilaoRJ.tsx` — Alterado de `HeroSection` para `HeroSectionWithCms`

---

## 2. Testes Executados

### 2.1 Build

```
✅ npm run build — PASSOU (0 erros)
```

### 2.2 Linter

```
✅ ReadLints — 0 erros encontrados
```

### 2.3 Página /leilao-rj (Home)

**Teste:** Verificar se Hero carrega conteúdo do CMS  
**Resultado:** ✅ PASSOU

**Evidência:**
- Screenshot: `screenshots/teste-cms-hero-leilao-rj.png`
- Título exibido: "Imóveis em Leilão no Rio de Janeiro" (do CMS)
- Subtítulo: "Assessoria completa em leilões de imóveis no Rio de Janeiro e São Paulo" (do CMS)
- Botões: "Buscar Imóveis" e "Fale Conosco" (do CMS)
- Imagem de fundo: Vista panorâmica do RJ (do CMS)

### 2.4 Página /catalogo/copacabana-rj (Regional)

**Teste:** Verificar se conteúdo regional carrega corretamente  
**Resultado:** ✅ PASSOU

**Evidência:**
- Screenshot: `screenshots/teste-cms-regional-copacabana.png`
- Título H1: "Imóveis em Leilão em Copacabana - Rio de Janeiro"
- Descrição do bairro exibida corretamente
- Listas de bairros/atrações/infraestrutura renderizadas

### 2.5 Console do Browser

**Teste:** Verificar ausência de erros críticos  
**Resultado:** ⚠️ PASSOU COM WARNINGS

**Observações:**
- Warning: `data-lov-id` em React.Fragment (não-crítico, provavelmente de extensão)
- Sem erros de CMS ou Supabase

---

## 3. Regressão Verificada

| Funcionalidade | Status |
|----------------|--------|
| Home carrega | ✅ OK |
| Hero exibe conteúdo | ✅ OK |
| Regional Copacabana carrega | ✅ OK |
| Fallback quando CMS falha | ✅ OK (testado com slug inexistente) |
| Admin CMS rota protegida | ✅ OK (redireciona para login) |

---

## 4. Audit Log

Alterações registradas em `cms_audit_log`:

| actor_email | action | entity_type | entity_id | entity_name |
|-------------|--------|-------------|-----------|-------------|
| sistema@cataldosiston.com | update | block | 1 | hero_title |
| sistema@cataldosiston.com | update | block | 2 | hero_image |

---

## 5. Arquivos de Rollback

Caso seja necessário reverter:

1. **SQL de rollback:** `supabase/migrations/20260205_backup_cms_slugs_ROLLBACK.sql`
2. **Comandos:**
   ```sql
   UPDATE cms_pages SET slug = 'home' WHERE id = 1;
   UPDATE cms_pages SET slug = 'regional-copacabana' WHERE id = 10;
   ```
3. **Código:** Reverter alterações em:
   - `src/components/HeroSectionWithCms.tsx`
   - `src/components/HomeCmsMarketingSections.tsx`
   - `src/hooks/useRegionalCmsContent.ts`
   - `src/pages/LeilaoRJ.tsx`

---

## 6. Decisões Registradas

- **DEC-ADM-003** — Slugs CMS = URLs públicas (DECISIONS.md)
- Atualizado `.cursor/rules/55-admin-cms.mdc` com novos slugs protegidos

---

## 7. Screenshots

### 7.1 Hero da Home (`/leilao-rj`)

![Hero CMS](screenshots/teste-cms-hero-leilao-rj.png)

### 7.2 Regional Copacabana (`/catalogo/copacabana-rj`)

![Regional Copacabana](screenshots/teste-cms-regional-copacabana.png)

---

_Evidências geradas automaticamente em 2026-02-05_
