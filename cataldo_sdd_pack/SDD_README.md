# SDD Pack — Cataldo Siston | Leilões RJ/SP
_Data: 2026-01-20_  
_Dono: Eduardo Sousa (Dev)_

Este pacote contém a documentação completa no formato **SPEC-Driven Development (SDD)** para você usar como "fonte da verdade" dentro do Cursor.

## Hierarquia de documentos (ordem de precedência)
1. **SPEC.md** (canônico) — requisitos, regras de negócio, fluxos, critérios de aceite
2. **DESIGN_SYSTEM.md** ⭐ — padrões visuais obrigatórios (tipografia, cores, componentes)
3. **ROADMAP_SPRINTS.md** — cronograma por sprints + entregáveis
4. **TEST_PLAN.md** — checklist de validação (SEO, filtros, páginas regionais, integrações)
5. **RUNBOOK_DEPLOYMENT.md** — como rodar, gerar páginas SEO, deploy, variáveis de ambiente
6. **.cursor/rules/*.mdc** — regras para agentes do Cursor (obrigatório)

## ⚠️ Regra Crítica: Design System
**TODAS as páginas e componentes DEVEM seguir o `DESIGN_SYSTEM.md`.**

Principais pontos:
- **Títulos:** `Playfair Display` (serifada)
- **Corpo:** `Quicksand` (sans-serif)
- **Cor primária:** `#D68E08` (dourado)
- **Hero/Headers:** `#265C54` (verde escuro)
- **Seções alternadas:** `#EBE5DE` (bege/cream)

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
