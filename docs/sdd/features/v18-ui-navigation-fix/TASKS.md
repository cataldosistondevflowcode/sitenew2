# TASKS: v18 — Correção UI Topo + Navegação Regional

## Metadata
- **Feature ID**: V18-UI-NAV
- **Data**: 2026-02-05

---

## Checklist de Tarefas

### Fase 1: Preparação
- [x] TASK-001: Criar artefatos SDD (SPEC, PLAN, TASKS)
- [x] TASK-002: Analisar código existente (SocialBar, filtros, useSEORedirect)

### Fase 2: Correção UI Topo (FR-V18-001)
- [ ] TASK-003: Adicionar min-height fixo ao SocialBar
- [ ] TASK-004: Garantir dimensões explícitas nos ícones
- [ ] TASK-005: Revisar transições CSS para não afetar dimensões
- [ ] TASK-006: Testar em múltiplos viewports (mobile, tablet, desktop)

### Fase 3: Navegação Regional (FR-V18-002, FR-V18-003, FR-V18-004)
- [ ] TASK-007: Implementar lógica de navegação na função applyFilters (LeilaoRJ)
- [ ] TASK-008: Implementar lógica de navegação na função applyFilters (LeilaoSP)
- [ ] TASK-009: Garantir que replace() é usado para não poluir histórico
- [ ] TASK-010: Testar cenário 1 bairro → página regional
- [ ] TASK-011: Testar cenário 2+ bairros → permanecer city
- [ ] TASK-012: Testar cenário limpar filtros → voltar para city

### Fase 4: Documentação
- [ ] TASK-013: Atualizar SPEC.md canônico com novos FRs
- [ ] TASK-014: Documentar testes realizados

### Fase 5: Validação Final
- [ ] TASK-015: Validar via browser (checklist completo)
- [ ] TASK-016: Verificar regressão em funcionalidades existentes

---

## Detalhamento das Tarefas Principais

### TASK-003: Adicionar min-height fixo ao SocialBar

**Arquivo**: `src/components/SocialBar.tsx`

**Ação**:
1. Localizar o elemento `<header>` principal
2. Adicionar classe `min-h-[44px] sm:min-h-[52px]`
3. Verificar que altura não muda em nenhum estado

**Verificação**: Medir altura do header antes/depois de hover nos ícones

---

### TASK-007: Implementar lógica de navegação (LeilaoRJ)

**Arquivo**: `src/pages/LeilaoRJ.tsx`

**Ação**:
1. Localizar função `applyFilters`
2. Adicionar verificação: `if (selectedNeighborhoods.length === 1)`
3. Buscar página SEO correspondente
4. Se existir, usar `navigate('/catalogo/{page_id}', { replace: true })`
5. Se não existir, continuar com filtro normal

**Dependências**:
- Dados de `seo_pages` já carregados ou disponíveis
- Hook `useNavigate` do React Router

---

### TASK-013: Atualizar SPEC.md canônico

**Arquivo**: `cataldo_sdd_pack/SPEC.md`

**Ação**:
1. Adicionar FR-13 (ou próximo número disponível): Estabilidade do Layout do Topo
2. Adicionar FR-14: Navegação Automática para Página Regional
3. Incluir critérios de aceite detalhados
4. Referenciar feature v18

---

## Critérios de Conclusão

Todas as tarefas marcadas como concluídas quando:
1. ✅ Código implementado e funcionando
2. ✅ Testes manuais passando
3. ✅ Documentação atualizada
4. ✅ Sem regressões identificadas

---

_Documento criado seguindo SDD (Spec-Driven Development)._
