# SPEC: CMS v17 — Fechamento de Gaps Finais

## Metadata
- **Feature ID**: CMS-V17
- **Data**: 2026-02-05
- **Status**: Parcialmente Implementada
- **Prioridade**: Média
- **Dependências**: Sprint CMS v16 (concluída)

---

## 0. Implementações Realizadas (2026-02-05)

### Migração de Slugs (DEC-ADM-003)
- ✅ Slugs renomeados para corresponder às URLs públicas
- ✅ `home` → `leilao-rj`, `regional-copacabana` → `catalogo-copacabana`
- ✅ Código frontend atualizado (5 arquivos)
- ✅ Arquivo de rollback criado

### Correção de Conteúdo CMS
- ✅ `hero_title` corrigido (de "Teste v8" para valor correto)
- ✅ `hero_image` populado (estava vazio)
- ✅ `HeroSectionWithCms` reabilitado
- ✅ `LeilaoRJ.tsx` agora usa CMS

### Evidências
- Testes executados e documentados em `TEST_EVIDENCE.md`
- Screenshots salvos em `screenshots/`

---

## 1. Problema

O documento `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` identificou gaps menores entre a especificação e a implementação atual do Admin CMS:

1. **FR-ADM-001**: Sessão não expira; auth frontend-only
2. **FR-ADM-003**: Falta filtro por status na lista de páginas
3. **FR-ADM-006**: Falta meta `noindex, nofollow` no preview
4. **NFR-ADM-003**: Confirmação parcial antes de ações destrutivas
5. **FR-ADM-009**: Falta busca/filtro na biblioteca de mídia

---

## 2. Solução Proposta

Implementar os gaps identificados para alcançar 100% de cobertura dos requisitos da SPEC.

---

## 3. Requisitos Funcionais

### FR-V17-001 — Expiração de Sessão
**Descrição**: Implementar expiração automática de sessão no frontend.

**Regras**:
1. Sessão expira após 24 horas de inatividade
2. Ao expirar, redirecionar para `/admin/login`
3. Mostrar toast informando que sessão expirou

**Critérios de aceite**:
- [ ] localStorage armazena timestamp de última atividade
- [ ] Ao navegar, verificar se sessão expirou
- [ ] Toast "Sessão expirada" aparece antes do redirect

---

### FR-V17-002 — Filtro por Status na Lista de Páginas
**Descrição**: Adicionar filtro por status (draft/published/all) em `/admin/cms`.

**Regras**:
1. Dropdown ou tabs para filtrar: "Todas", "Rascunhos", "Publicadas"
2. Filtro é local (não recarrega do servidor)
3. Contador de páginas por status

**Critérios de aceite**:
- [ ] UI de filtro visível no topo da lista
- [ ] Filtrar por "Rascunhos" mostra apenas draft
- [ ] Filtrar por "Publicadas" mostra apenas published
- [ ] "Todas" mostra todas as páginas

---

### FR-V17-003 — Meta Noindex no Preview
**Descrição**: Adicionar meta robots `noindex, nofollow` na página de preview.

**Regras**:
1. Preview nunca deve ser indexado pelo Google
2. Meta tag inserida via React Helmet ou similar

**Critérios de aceite**:
- [ ] `<meta name="robots" content="noindex, nofollow">` presente no preview
- [ ] Verificável via View Source

---

### FR-V17-004 — Confirmação antes de Ações Destrutivas
**Descrição**: Exigir confirmação do usuário antes de reverter versão ou descartar alterações.

**Regras**:
1. Modal de confirmação para "Reverter para versão anterior"
2. Modal de confirmação para "Descartar alterações não salvas"
3. Botão primário é "Cancelar" (seguro), secundário é "Confirmar"

**Critérios de aceite**:
- [ ] Modal aparece ao clicar "Reverter"
- [ ] Modal aparece ao sair da página com alterações não salvas
- [ ] Usuário pode cancelar a ação

---

### FR-V17-005 — Busca/Filtro na Biblioteca de Mídia
**Descrição**: Adicionar busca e filtro por tipo na biblioteca de assets.

**Regras**:
1. Campo de busca por nome do arquivo
2. Filtro por tipo MIME (imagens, todos)
3. Ordenação por data (mais recente primeiro)

**Critérios de aceite**:
- [ ] Campo de busca filtra assets em tempo real
- [ ] Busca é case-insensitive
- [ ] Resultados atualizam enquanto digita

---

## 4. Requisitos Não-Funcionais

### NFR-V17-001 — Performance
- Filtros devem ser locais (sem round-trip ao servidor)
- Busca com debounce de 300ms

### NFR-V17-002 — UX
- Transições suaves ao filtrar
- Loading states durante operações

---

## 5. Fora do Escopo

- Migrar autenticação para Supabase Auth (complexidade alta, benefício baixo dado que RLS já protege)
- Múltiplos usuários admin com permissões (backlog futuro)
- Locking de edição (backlog futuro)

---

## 6. Critérios de Aceite Globais

- [ ] Todos os 5 FRs implementados
- [ ] `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` atualizado para refletir 100% de cobertura
- [ ] `TEST_PLAN.md` seção 9.5 atualizada (meta noindex)
- [ ] Build passa sem erros
- [ ] Nenhuma regressão em funcionalidades existentes

---

## 7. Referências

- `CMS_ADMIN_GAPS_SPEC_VS_IMPL.md` — Lista de gaps
- `CMS_ADMIN_SPEC.md` — Especificação completa
- `TEST_PLAN.md` — Checklist de testes

---

_Documento criado seguindo SDD (Spec-Driven Development)._
