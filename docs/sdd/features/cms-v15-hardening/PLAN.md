# PLAN: CMS v15 — Hardening (RLS/Roles/Segurança)

## Metadata
- **Feature ID**: CMS-V15
- **SPEC**: [SPEC.md](./SPEC.md)
- **Data**: 2026-02-05

---

## 1. Visão Geral da Arquitetura

### 1.1 Fluxo de Autenticação Atual
```
Usuário → Login Supabase → JWT com email → authenticated role → Acesso total ao CMS
```

### 1.2 Fluxo Proposto
```
Usuário → Login Supabase → JWT com email → is_cms_admin() → Se TRUE: acesso | Se FALSE: negado
```

---

## 2. Componentes Afetados

### 2.1 Banco de Dados (Supabase)
- Nova tabela: `admin_users`
- Nova função: `is_cms_admin()`
- Policies atualizadas em: `cms_pages`, `cms_blocks`, `cms_assets`, `cms_preview_tokens`

### 2.2 Frontend (Não requer alterações)
- O frontend já usa Supabase client com RLS
- Erros de permissão serão tratados pelo error handling existente
- Toast de erro já implementado

---

## 3. Diagrama de Sequência

```
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌─────────────┐
│ Browser │     │ Supabase │     │ is_cms_admin()│     │ admin_users │
└────┬────┘     └────┬─────┘     └──────┬────────┘     └──────┬──────┘
     │               │                   │                    │
     │ UPDATE cms_blocks...              │                    │
     │──────────────>│                   │                    │
     │               │                   │                    │
     │               │ Check policy      │                    │
     │               │──────────────────>│                    │
     │               │                   │                    │
     │               │                   │ SELECT email       │
     │               │                   │───────────────────>│
     │               │                   │                    │
     │               │                   │<───────────────────│
     │               │                   │    true/false      │
     │               │<──────────────────│                    │
     │               │                   │                    │
     │<──────────────│                   │                    │
     │   OK / ERROR  │                   │                    │
```

---

## 4. Plano de Migração

### 4.1 Ordem de Execução
1. Criar tabela `admin_users` (idempotente)
2. Inserir admins iniciais (seed)
3. Criar função `is_cms_admin()` (idempotente)
4. Atualizar policies (DROP + CREATE)
5. Testar com admin
6. Testar com não-admin

### 4.2 Rollback
Se algo der errado:
1. DROP policies novas
2. Recriar policies antigas (authenticated = ALL)
3. DROP função e tabela se necessário

---

## 5. SQL da Migration

```sql
-- ================================================
-- Migration: CMS Hardening - Admin-only write access
-- Sprint: CMS v15
-- Data: 2026-02-05
-- ================================================

-- 1. Criar tabela admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'system'
);

-- RLS: tabela invisível para anon/authenticated
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- (Sem policies = ninguém pode ler via client, apenas service_role)

-- 2. Seed: admins iniciais
INSERT INTO admin_users (email, name, created_by)
VALUES 
  ('adm@hotmail.com', 'Admin Demo', 'migration'),
  -- Adicionar outros admins aqui se necessário
  ('contato@cataldosiston-adv.com.br', 'Cataldo Siston', 'migration')
ON CONFLICT (email) DO NOTHING;

-- 3. Criar função is_cms_admin()
CREATE OR REPLACE FUNCTION is_cms_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = (auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 5. Atualizar policies de cms_pages
DROP POLICY IF EXISTS cms_pages_authenticated_write ON cms_pages;
CREATE POLICY cms_pages_admin_write ON cms_pages
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- 6. Atualizar policies de cms_blocks
DROP POLICY IF EXISTS cms_blocks_authenticated_write ON cms_blocks;
CREATE POLICY cms_blocks_admin_write ON cms_blocks
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- 7. Atualizar policies de cms_assets
DROP POLICY IF EXISTS cms_assets_authenticated_write ON cms_assets;
CREATE POLICY cms_assets_admin_write ON cms_assets
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- 8. Atualizar policies de cms_preview_tokens
DROP POLICY IF EXISTS "Authenticated can insert tokens" ON cms_preview_tokens;
DROP POLICY IF EXISTS "Authenticated can delete tokens" ON cms_preview_tokens;
CREATE POLICY cms_preview_tokens_admin_insert ON cms_preview_tokens
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());
CREATE POLICY cms_preview_tokens_admin_delete ON cms_preview_tokens
  FOR DELETE TO authenticated
  USING (is_cms_admin());

-- 9. Manter policies de leitura (não alterar)
-- cms_pages_anon_read: SELECT onde status='published'
-- cms_blocks_anon_read: SELECT onde página é published
-- cms_assets_anon_read: SELECT (imagens públicas)
-- cms_pages_authenticated_read: SELECT all
-- cms_blocks_authenticated_read: SELECT all
```

---

## 6. Testes

### 6.1 Teste com Admin (adm@hotmail.com)
1. Login no Admin CMS
2. Editar bloco de texto
3. Salvar → deve funcionar
4. Publicar → deve funcionar

### 6.2 Teste com Não-Admin (criar usuário teste)
1. Login com email não cadastrado em admin_users
2. Tentar acessar /admin/cms
3. Tentar editar bloco → deve falhar com erro RLS
4. UI deve mostrar mensagem de erro graciosamente

### 6.3 Teste de Leitura Pública
1. Acessar página regional sem login
2. Conteúdo CMS deve carregar normalmente
3. Imagens devem carregar normalmente

---

## 7. Checklist de Implementação

- [ ] Verificar policies atuais via MCP
- [ ] Criar migration SQL
- [ ] Aplicar migration via MCP
- [ ] Testar com admin
- [ ] Testar com não-admin
- [ ] Testar leitura pública
- [ ] Atualizar ROADMAP_SPRINTS.md
- [ ] Atualizar documentação

---

## 8. Considerações de Segurança

### 8.1 SECURITY DEFINER
A função `is_cms_admin()` usa `SECURITY DEFINER` para executar com privilégios do owner (postgres), permitindo ler `admin_users` mesmo sem policy de leitura.

### 8.2 Sem Exposição de admin_users
A tabela `admin_users` não tem policies de leitura para anon/authenticated, tornando-a invisível para o client. Apenas funções SECURITY DEFINER podem lê-la.

### 8.3 Email como Identificador
Usamos email do JWT para identificar o admin. Isso é seguro porque:
- Email é verificado pelo Supabase Auth
- JWT é assinado e não pode ser forjado
- Apenas emails em admin_users têm acesso

---

_Documento criado seguindo SDD (Spec-Driven Development)._
