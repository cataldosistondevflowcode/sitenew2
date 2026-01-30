# TEST_PLAN.md — Checklist de validação
_Data: 2026-01-15_

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
