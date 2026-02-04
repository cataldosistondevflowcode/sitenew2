# TEST_PLAN.md — Checklist de validação
_Data: 2026-01-15_  
_Atualizado: 2026-02-03 (Admin CMS)_

## 1) Smoke test (sempre)
- [ ] `npm install` ok
- [ ] `npm run dev` ok
- [ ] Navegar: `/`, `/leilao-rj`, `/leilao-sp`, `/imovel/:id`
- [ ] Filtros: aplicar/remover e ver URL sincronizando

## 2) SEO migração
- [ ] `meta robots` correto em todas páginas no ambiente de migração
- [ ] 1 canônica por página
- [ ] Titles/descriptions presentes
- [ ] Headings com hierarquia válida (H1 único por página principal)
- [ ] Páginas válidas retornam HTTP 2xx (sem 4xx/5xx)

## 3) Páginas regionais
- [ ] Abrir 10 páginas regionais diferentes e confirmar:
  - [ ] metaTitle/metaDescription corretos
  - [ ] filtro aplicado automaticamente
  - [ ] resultados batem com a região escolhida
- [ ] Selecionar região no filtro e confirmar que navega para slug (quando aplicável)

## 4) Filtros via Supabase
- [ ] Cidades carregam do Supabase
- [ ] Bairros carregam do Supabase
- [ ] Alterar no Admin e ver refletir no filtro após refresh

## 5) RD Station
- [ ] Widget carrega
- [ ] Pop-up aparece nas condições configuradas
- [ ] Evento de formulário dispara
- [ ] Evento de CTA click dispara (se aplicável)

## 6) Contexto da página (bairro vs cidade) — catálogo regional
Testar no browser em `/catalogo/:pageId` (ex.: página Rio de Janeiro ou bairro).

- [ ] **Nenhum bairro selecionado**
  - H1 = nome da cidade (ex.: "Rio de Janeiro")
  - Conteúdo exibido = cidade (sem texto de bairro)
  - Nenhum bloco "Sobre [bairro]" nem benefícios/atrações de bairro visíveis
- [ ] **Exatamente 1 bairro selecionado**
  - H1 = nome do bairro (ex.: "Imóveis em Leilão em Botafogo")
  - Descrição do bairro e benefícios/atrações visíveis
  - Conteúdo SEO específico do bairro permitido
- [ ] **Dois ou mais bairros selecionados** (ex.: Botafogo + Ipanema + Leblon)
  - H1 = nome da cidade (ex.: "Rio de Janeiro")
  - Nenhum texto de bairro único visível (descrição/benefícios ocultos)
  - Listagem de imóveis correta (filtrada pelos bairros)
  - SEO consistente: title/description sem menção a bairro único; canonical da página da cidade

## 7) Performance
- [ ] Lighthouse (mobile/desktop) sem regressões graves


## 8) DB Safety (obrigatório quando houver mudança de dados/admin)
- [ ] Confirmei via MCP do Supabase que **não há migrations** alterando `imoveis`
- [ ] Não alterei policies/indexes/triggers da tabela `imoveis`
- [ ] Novas tabelas/views possuem RLS/policies adequadas (quando necessário)
- [ ] Fluxo principal do site (listagem + filtro + detalhe) não regrediu

---

## 9) Admin CMS — Testes de Funcionalidade ⭐ NOVO

> **Documento de especificação:** `CMS_ADMIN_SPEC.md`

### 9.1) Autenticação e Proteção de Rotas
- [ ] Login com email/senha válido funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Acesso a `/admin` sem auth redireciona para `/admin/login`
- [ ] Acesso a `/admin/*` sem role admin retorna 403 ou redireciona
- [ ] Logout funciona e limpa sessão

### 9.2) Lista de Páginas
- [ ] `/admin/cms` lista todas as páginas configuradas
- [ ] Status (draft/published) é exibido corretamente
- [ ] Data de última atualização é exibida
- [ ] Click em página navega para editor

### 9.3) Editor de Blocos
- [ ] Abrir página para edição carrega blocos existentes
- [ ] Editar bloco de texto funciona
- [ ] Editar bloco de imagem funciona
- [ ] Editar bloco richtext funciona
- [ ] Validação impede salvar campo vazio (se obrigatório)

### 9.4) Salvar Draft
- [ ] Botão "Salvar" grava alterações como draft
- [ ] Após salvar, página exibe conteúdo atualizado no editor
- [ ] Sair e voltar mantém alterações salvas
- [ ] Site público **não** exibe conteúdo draft

### 9.5) Preview
- [ ] Botão "Pré-visualizar" abre página em modo preview
- [ ] Preview exibe conteúdo draft
- [ ] Indicador visual de "modo preview" é visível
- [ ] Usuário não-autenticado **não** consegue acessar preview
- [ ] Preview tem meta noindex, nofollow

### 9.6) Publicar
- [ ] Botão "Publicar" funciona
- [ ] Após publicar, site público exibe novo conteúdo
- [ ] Status da página muda para "published"
- [ ] Versão anterior é salva para rollback (quando implementado)
- [ ] Audit log registra a publicação

### 9.7) Biblioteca de Mídia (quando implementado)
- [ ] Upload de imagem funciona (jpg, png, webp)
- [ ] Limite de tamanho é respeitado
- [ ] Imagens aparecem na galeria
- [ ] Posso selecionar imagem para bloco
- [ ] Alt text é editável

### 9.8) Histórico e Rollback (quando implementado)
- [ ] Lista de versões é exibida
- [ ] Posso visualizar conteúdo de versão anterior
- [ ] Reverter restaura como draft
- [ ] Posso publicar versão revertida

### 9.9) Audit Log (quando implementado)
- [ ] Cada ação gera registro no log
- [ ] Log mostra actor, timestamp, ação
- [ ] Log não pode ser editado
- [ ] Interface de visualização funciona

### 9.10) Segurança CMS
- [ ] RLS: anon só lê status='published' em cms_pages
- [ ] RLS: anon só lê blocos de páginas published
- [ ] RLS: authenticated pode ler tudo
- [ ] RLS: apenas authenticated pode escrever
- [ ] Tabelas CMS não afetam tabela `imoveis`

---

## 10) Regressão após CMS ⭐ NOVO
Após implementar qualquer sprint do CMS, validar:

- [ ] Home carrega normalmente (sem CMS e com CMS)
- [ ] Páginas regionais funcionam
- [ ] Filtros funcionam
- [ ] Listagem de imóveis funciona
- [ ] Detalhes de imóvel funcionam
- [ ] SEO não regrediu (metas, canonicals, titles)
- [ ] Performance não degradou significativamente
- [ ] Nenhuma rota pública expõe conteúdo admin/draft

---

## 11) Próximos passos recomendados (respaldo canônico)

**Documentos de referência:** `ROADMAP_SPRINTS.md`, `CMS_ADMIN_SPEC.md`, `55-admin-cms.mdc`, `00-sdd.mdc`.

| Prioridade | Ação | Documento | Risco |
|------------|------|-----------|--------|
| 1 | Executar testes manuais da **seção 9** (Admin CMS) e **seção 10** (Regressão); marcar [x] no TEST_PLAN no que passar | TEST_PLAN.md §9, §10 | Nenhum (só validação) |
| 2 | Confirmar RLS: anon não vê draft (abrir site em aba anônima e conferir que conteúdo draft não aparece) | 55-admin-cms.mdc checklist | Nenhum |
| 3 | Decidir próximo workstream: **Sprint 1** (SEO), **2** (regionais), **3** (Filtros), **4** (RD Station) conforme prioridade do negócio | ROADMAP_SPRINTS.md | Cada sprint tem spec/escopo próprio |
| 4 | Expansão futura CMS (WYSIWYG, agendamento, diff) só com demanda explícita — está em "baixa prioridade" no ROADMAP | ROADMAP_SPRINTS.md | Não iniciar sem spec/aprovacao |

**Regra SDD:** Nenhuma alteração de código/banco sem SPEC ou decisão documentada (DECISIONS.md / SPEC.md).
