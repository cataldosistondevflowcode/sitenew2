# SPEC: CMS v16 — Alinhamento Final (Docs, Gaps, Testes)

## Metadata
- **Feature ID**: CMS-V16
- **Sprint**: CMS v16
- **Data**: 2026-02-05
- **Dependências**: Sprint CMS v15 (concluída)
- **Prioridade**: Média

---

## 1. Problema

Após 15 sprints de desenvolvimento do Admin CMS, a documentação (SPEC) e a implementação podem ter divergido. Além disso, alguns critérios de aceite não foram atualizados e o checklist de testes (`TEST_PLAN.md`) não foi executado de forma sistemática.

**Riscos:**
- Documentação desatualizada dificulta manutenção futura
- Critérios de aceite não marcados dificultam validação de completude
- Gaps não documentados podem virar dívida técnica

---

## 2. Solução Proposta

Criar documento de gaps (spec vs implementação), atualizar critérios de aceite na SPEC, e executar o checklist de testes do `TEST_PLAN.md`.

---

## 3. Requisitos Funcionais

### FR-V16-001 — Documento de Gaps
**Descrição:** Criar `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` documentando discrepâncias entre SPEC e implementação.

**Estrutura do documento:**
1. FR implementados (com evidências)
2. FR parcialmente implementados (o que falta)
3. FR não implementados (justificativa)
4. Funcionalidades extras (implementadas mas não especificadas)

### FR-V16-002 — Atualizar Critérios de Aceite
**Descrição:** Revisar cada FR/NFR na `CMS_ADMIN_SPEC.md` e marcar [x] os critérios que passam.

### FR-V16-003 — Executar TEST_PLAN.md
**Descrição:** Executar checklist das seções 9 (Admin CMS) e 10 (Regressão) do `TEST_PLAN.md`.

---

## 4. Requisitos Não-Funcionais

### NFR-V16-001 — Documentação Consistente
- Todos os documentos devem ter data de atualização
- Gaps devem ter rastreabilidade (FR-ADM-XXX → status)

### NFR-V16-002 — Testes Reproduzíveis
- Checklist deve ser executável por qualquer desenvolvedor
- Resultados devem ser documentados

---

## 5. Escopo

**Incluído:**
- Criar `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md`
- Atualizar `CMS_ADMIN_SPEC.md` (critérios de aceite)
- Executar `TEST_PLAN.md` seções 9 e 10
- Atualizar `ROADMAP_SPRINTS.md`

**Excluído:**
- Implementar novos features
- Corrigir bugs (apenas documentar se encontrados)
- Alterar código fonte

---

## 6. Critérios de Aceite

- [ ] `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` criado com análise de todos os FRs
- [ ] `CMS_ADMIN_SPEC.md` atualizada com critérios marcados
- [ ] `TEST_PLAN.md` seção 9 executada e documentada
- [ ] `TEST_PLAN.md` seção 10 executada e documentada
- [ ] `ROADMAP_SPRINTS.md` atualizado com status da sprint

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-05 | 1.0 | Criação do documento |
