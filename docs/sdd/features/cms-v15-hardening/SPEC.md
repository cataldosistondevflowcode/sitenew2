# SPEC: CMS v15 — Hardening (RLS/Roles/Segurança)

## Metadata
- **Feature ID**: CMS-V15
- **Sprint**: Sprint CMS v15
- **Status**: Em Andamento
- **Data**: 2026-02-05
- **Dependências**: Sprint CMS v14 (concluída)

---

## 1. Problema

Atualmente, as policies RLS do CMS usam apenas `authenticated` como role, o que significa que **qualquer usuário autenticado no Supabase pode editar conteúdo do CMS**. Isso é inseguro para produção.

### 1.1 Estado Atual das Policies

| Tabela | Policy Write | Problema |
|--------|-------------|----------|
| `cms_pages` | `authenticated` = ALL | Qualquer usuário logado pode editar/deletar páginas |
| `cms_blocks` | `authenticated` = ALL | Qualquer usuário logado pode editar blocos |
| `cms_assets` | `authenticated` = ALL | Qualquer usuário logado pode fazer upload |
| `cms_versions` | `authenticated` = INSERT/SELECT | OK (apenas leitura/inserção) |
| `cms_audit_log` | `authenticated` = INSERT/SELECT | OK (append-only) |
| `cms_preview_tokens` | `public` = INSERT/DELETE | Problema: qualquer um pode criar tokens |

### 1.2 Risco

- Um visitante que faz login (ex: para newsletter) poderia teoricamente acessar o CMS
- Não há distinção entre "usuário comum" e "administrador"
- Preview tokens podem ser criados por qualquer pessoa

---

## 2. Solução Proposta

### 2.1 Opção A: Role `admin` no Supabase (Custom Claims)
Criar uma custom claim `is_admin` no JWT do usuário e verificar nas policies.

**Prós:** Segurança robusta, padrão Supabase
**Contras:** Requer configurar Auth hooks ou função para definir claims

### 2.2 Opção B: Tabela `admin_users` (RECOMENDADA)
Criar tabela simples `admin_users` com emails autorizados e verificar nas policies.

**Prós:** Simples de implementar, fácil de gerenciar
**Contras:** Query adicional nas policies (mínimo impacto)

### 2.3 Decisão: Opção B

Criar tabela `admin_users` e atualizar policies para verificar se o email do usuário está nessa tabela.

---

## 3. Requisitos Funcionais

### FR-SEC-001: Tabela de Administradores
- Criar tabela `admin_users` com coluna `email` (unique)
- Seed inicial com emails de administradores conhecidos
- RLS: apenas service_role pode ler/escrever

### FR-SEC-002: Função Helper `is_cms_admin()`
- Criar função SQL que retorna TRUE se o usuário atual é admin
- Usar `auth.jwt() ->> 'email'` para obter email do usuário logado
- Verificar se email existe em `admin_users`

### FR-SEC-003: Atualizar Policies de Escrita
- `cms_pages`: write apenas se `is_cms_admin()`
- `cms_blocks`: write apenas se `is_cms_admin()`
- `cms_assets`: write apenas se `is_cms_admin()`
- `cms_preview_tokens`: insert/delete apenas se `is_cms_admin()`

### FR-SEC-004: Manter Policies de Leitura Pública
- `cms_pages` anon: SELECT onde status='published' (manter)
- `cms_blocks` anon: SELECT onde página é published (manter)
- `cms_assets` anon: SELECT (imagens são públicas) (manter)

### FR-SEC-005: Fallback no Frontend
- Se usuário não for admin, mostrar mensagem de acesso negado
- Não quebrar a aplicação, apenas negar acesso

---

## 4. Requisitos Não-Funcionais

### RNF-SEC-001: Performance
- Função `is_cms_admin()` deve ser rápida (< 10ms)
- Considerar cache se necessário

### RNF-SEC-002: Auditoria
- Registrar em `cms_audit_log` tentativas de acesso negadas (opcional)

### RNF-SEC-003: Retrocompatibilidade
- Não quebrar funcionalidades existentes
- Admin atual (adm@hotmail.com) deve continuar funcionando

---

## 5. Modelo de Dados

### 5.1 Nova Tabela: `admin_users`

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- RLS: apenas service_role
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy para anon/authenticated = tabela invisível para eles
```

### 5.2 Função: `is_cms_admin()`

```sql
CREATE OR REPLACE FUNCTION is_cms_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = (auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.3 Policies Atualizadas

```sql
-- cms_pages: write apenas admin
DROP POLICY IF EXISTS cms_pages_authenticated_write ON cms_pages;
CREATE POLICY cms_pages_admin_write ON cms_pages
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- cms_blocks: write apenas admin
DROP POLICY IF EXISTS cms_blocks_authenticated_write ON cms_blocks;
CREATE POLICY cms_blocks_admin_write ON cms_blocks
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- cms_assets: write apenas admin
DROP POLICY IF EXISTS cms_assets_authenticated_write ON cms_assets;
CREATE POLICY cms_assets_admin_write ON cms_assets
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- cms_preview_tokens: insert/delete apenas admin
DROP POLICY IF EXISTS "Authenticated can insert tokens" ON cms_preview_tokens;
DROP POLICY IF EXISTS "Authenticated can delete tokens" ON cms_preview_tokens;
CREATE POLICY cms_preview_tokens_admin_insert ON cms_preview_tokens
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());
CREATE POLICY cms_preview_tokens_admin_delete ON cms_preview_tokens
  FOR DELETE TO authenticated
  USING (is_cms_admin());
```

---

## 6. Critérios de Aceite

### AC-SEC-001: Admin pode editar
- [ ] Usuário com email em `admin_users` consegue criar/editar páginas
- [ ] Usuário com email em `admin_users` consegue criar/editar blocos
- [ ] Usuário com email em `admin_users` consegue fazer upload de assets

### AC-SEC-002: Não-admin não pode editar
- [ ] Usuário autenticado sem email em `admin_users` recebe erro ao tentar editar
- [ ] Erro é gracioso (não quebra UI)

### AC-SEC-003: Leitura pública mantida
- [ ] Visitante anônimo vê páginas publicadas
- [ ] Visitante anônimo vê blocos de páginas publicadas
- [ ] Visitante anônimo vê imagens/assets

### AC-SEC-004: Retrocompatibilidade
- [ ] Admin atual (adm@hotmail.com) funciona normalmente
- [ ] Build passa sem erros
- [ ] Testes manuais passam

---

## 7. Fora de Escopo

- Sistema de roles múltiplos (editor, revisor, admin)
- UI para gerenciar admin_users (pode ser feito via SQL/Supabase Dashboard)
- 2FA / MFA
- Rate limiting

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Função is_cms_admin() lenta | Baixa | Médio | Índice em admin_users.email |
| Esquecer de adicionar admin | Baixa | Alto | Seed com admins conhecidos |
| Policy quebra algo existente | Média | Alto | Testar exaustivamente antes de aplicar |

---

## 9. Referências

- `cataldo_sdd_pack/CMS_ADMIN_SPEC.md` - Especificação original
- `.cursor/rules/55-admin-cms.mdc` - Regras de RLS obrigatórias
- `.cursor/rules/25-supabase-mcp-safety.mdc` - Regra de não alterar imoveis

---

_Documento criado seguindo SDD (Spec-Driven Development)._
