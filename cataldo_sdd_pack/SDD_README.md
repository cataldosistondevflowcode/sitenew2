# SDD Pack — Cataldo Siston | Leilões RJ/SP
_Data: 2026-02-03_  
_Dono: Eduardo Sousa (Dev)_

Este pacote contém a documentação completa no formato **SPEC-Driven Development (SDD)** para você usar como "fonte da verdade" dentro do Cursor.

## Hierarquia de documentos (ordem de precedência)
1. **SPEC.md** (canônico) — requisitos, regras de negócio, fluxos, critérios de aceite
2. **DESIGN_SYSTEM.md** ⭐ — padrões visuais obrigatórios (tipografia, cores, componentes)
3. **CMS_ADMIN_SPEC.md** ⭐ NOVO — especificação do Admin CMS (tipo WordPress)
4. **ROADMAP_SPRINTS.md** — cronograma por sprints + entregáveis
5. **TEST_PLAN.md** — checklist de validação (SEO, filtros, páginas regionais, integrações, Admin CMS)
6. **DECISIONS.md** — registro de decisões arquiteturais (ex: Admin CMS via Supabase)
7. **RUNBOOK_DEPLOYMENT.md** — como rodar, gerar páginas SEO, deploy, variáveis de ambiente
8. **.cursor/rules/*.mdc** — regras para agentes do Cursor (obrigatório)

## ⚠️ Regras Críticas

### Design System
**TODAS as páginas e componentes DEVEM seguir o `DESIGN_SYSTEM.md`.**

Principais pontos:
- **Títulos:** `Playfair Display` (serifada)
- **Corpo:** `Quicksand` (sans-serif)
- **Cor primária:** `#D68E08` (dourado)
- **Hero/Headers:** Imagem + overlay escuro
- **Seções alternadas:** `#EBE5DE` (bege/cream)

### Admin CMS ⭐ NOVO
**Para implementar o Admin CMS, seguir `CMS_ADMIN_SPEC.md`.**

Principais pontos:
- **Decisão:** Admin próprio via Supabase (não Webflow CMS) — ver `DECISIONS.md`
- **Tabelas:** Prefixo `cms_*` (cms_pages, cms_blocks, cms_assets, cms_versions, cms_audit_log)
- **RLS obrigatório:** Público lê apenas published; admin lê/escreve tudo
- **Fluxo:** Draft → Preview → Publish
- **Regras:** Ver `.cursor/rules/55-admin-cms.mdc`

## Como usar no Cursor (fluxo recomendado)
1. Abra o projeto no Cursor.
2. Copie a pasta `.cursor/rules/` para dentro do seu repositório.
3. Sempre que for pedir algo para os agentes, comece com:
   - “Leia **SPEC.md** e **ROADMAP_SPRINTS.md** e siga exatamente os critérios de aceite.”
4. Trabalhe sprint a sprint. Ao final de cada sprint, execute o **TEST_PLAN.md**.

## Segurança (importante)
- **NUNCA** commitar senhas, tokens ou credenciais no repositório.
- Use `.env` + variáveis no provedor de deploy (Netlify).
- Se credenciais tiverem sido compartilhadas por print, trate como **vazamento** e faça rotação.
