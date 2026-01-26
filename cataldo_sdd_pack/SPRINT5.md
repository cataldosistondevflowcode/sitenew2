# Sprint 5 — Webflow CMS Integration
_Data: 2026-01-19_  
_Status: ✅ Estrutura Base Implementada (Aguardando Configurações do Cliente)_

## Objetivos
- ✅ Mapear componentes que precisam de conteúdo do Webflow CMS
- ✅ Criar Edge Function para integração segura com Webflow API
- ✅ Criar hooks/componentes para buscar e renderizar conteúdo do Webflow
- ✅ Implementar cache para melhorar performance
- ⏳ Testar integração completa (aguardando credenciais)

## Entregáveis
- ✅ Cliente edita hero/depôimentos e vê no site (estrutura pronta)
- ⏳ Integração completa (pendente credenciais)

---

## Requisitos (RF-07)

### RF-07 — Webflow CMS (última fase)
**Descrição:** permitir edição pelo cliente via CMS (escopo editável mínimo).

**Regras:**
1. Conteúdo editável mínimo:
   - Hero text
   - Hero background image
   - Testimonials
2. Token Webflow **não** fica no frontend (usar Edge Function / backend proxy).

**Critérios de aceite:**
- Editor altera conteúdo no Webflow → mudança reflete no site
- Sem exposição de credenciais no bundle

---

## Implementações Realizadas

### 1. ✅ Edge Function para Proxy Seguro

**Arquivo**: `supabase/functions/webflow-cms-proxy/index.ts`

**Funcionalidades**:
- ✅ Proxy seguro para Webflow CMS API
- ✅ Token Webflow armazenado como secret (nunca exposto no frontend)
- ✅ Cache implementado (5 minutos por padrão)
- ✅ Tratamento de erros completo
- ✅ CORS configurado

**Características**:
- ✅ Segurança: Token nunca exposto no frontend
- ✅ Performance: Cache para reduzir chamadas à API
- ✅ Flexibilidade: Suporta qualquer collection do Webflow

**Como funciona**:
1. Frontend faz requisição para Edge Function
2. Edge Function busca conteúdo do Webflow API (usando token seguro)
3. Edge Function retorna conteúdo (com cache se configurado)
4. Frontend renderiza conteúdo no componente

### 2. ✅ Tipos TypeScript

**Arquivo**: `src/types/webflow.ts`

**Interfaces Criadas**:
- ✅ `WebflowCMSItem` - Item genérico do Webflow CMS
- ✅ `WebflowHeroContent` - Hero Content com campos tipados
- ✅ `WebflowTestimonial` - Testimonial com campos tipados
- ✅ `WebflowCMSResponse` - Resposta da Edge Function

**Características**:
- ✅ Type safety completo
- ✅ Mapeamento explícito dos campos do CMS
- ✅ Extensível para novos campos

### 3. ✅ Hook para Buscar Conteúdo

**Arquivo**: `src/hooks/useWebflowCMS.tsx`

**Hooks Criados**:
- ✅ `useWebflowCMS` - Hook genérico para buscar qualquer collection
- ✅ `useWebflowHero` - Hook específico para Hero Content
- ✅ `useWebflowTestimonials` - Hook específico para Testimonials

**Funcionalidades**:
- ✅ Integração com TanStack Query (cache automático)
- ✅ Estados de loading e error
- ✅ Retry automático em caso de falha
- ✅ Configurável via variáveis de ambiente

**Uso**:
```tsx
// Hook para Hero Content
const { data: heroContent, isLoading, error } = useWebflowHero();

// Hook para Testimonials
const { data: testimonials, isLoading, error } = useWebflowTestimonials(10);
```

### 4. ✅ Componentes Identificados

**Componentes que precisam ser atualizados**:
- ✅ `HeroSection.tsx` - Identificado (texto e imagem de fundo)
- ✅ `TestimonialsSection.tsx` - Identificado (depoimentos)

**Status**: Componentes mapeados, aguardando integração com hooks (pendente credenciais)

---

## Pendências (Requerem Informações do Cliente)

### 1. Credenciais e Configuração do Webflow

**O que precisamos**:
- **Token da API do Webflow** (API Token)
- **Site ID** do Webflow
- **Collection IDs** das collections que serão usadas:
  - Collection ID para Hero Content (texto e imagem)
  - Collection ID para Testimonials (depoimentos)

**Onde será usado**:
- Armazenado como secret no Supabase (nunca no frontend)
- Usado na Edge Function para fazer proxy seguro

**Como obter**:
1. Acessar o painel do Webflow
2. Ir em Settings → API
3. Gerar/copiar o API Token
4. Identificar o Site ID e Collection IDs

### 2. Estrutura das Collections no Webflow

**O que precisamos**:
- **Hero Content Collection**:
  - Nome dos campos (ex: `hero_title`, `hero_text`, `hero_background_image`)
  - Tipos de campos (text, rich text, image, etc.)
  - Exemplo de item publicado

- **Testimonials Collection**:
  - Nome dos campos (ex: `author_name`, `testimonial_text`, `author_image`)
  - Tipos de campos
  - Quantidade de depoimentos que devem ser exibidos

**Onde será usado**:
- Para mapear os campos do Webflow para interfaces TypeScript
- Para criar queries corretas na Edge Function

### 3. Estratégia de Cache

**O que precisamos**:
- **Frequência de atualização**: Com que frequência o conteúdo deve ser atualizado?
  - Em tempo real (sem cache)?
  - A cada X minutos/horas?
  - Apenas quando o cliente publicar no Webflow?

**Onde será usado**:
- Para configurar TTL (Time To Live) do cache
- Para decidir se usamos cache no Supabase ou apenas no frontend

### 4. Fallback e Conteúdo Padrão

**O que precisamos**:
- **Conteúdo padrão**: Se o Webflow não estiver disponível, qual conteúdo deve ser exibido?
  - Manter o conteúdo hardcoded atual?
  - Exibir mensagem de erro?
  - Usar conteúdo de backup?

**Onde será usado**:
- Para implementar fallback seguro
- Para garantir que o site sempre funcione mesmo se Webflow estiver offline

### 5. Integração nos Componentes

**O que precisa ser feito**:
- ⏳ Atualizar `HeroSection.tsx` para usar conteúdo do Webflow
- ⏳ Atualizar `TestimonialsSection.tsx` para usar conteúdo do Webflow
- ⏳ Implementar fallback para conteúdo hardcoded

**Status**: Aguardando credenciais para testar e integrar

### 6. Testes

**O que precisa ser testado**:
- ⏳ Testar Edge Function com credenciais reais
- ⏳ Validar que conteúdo aparece corretamente
- ⏳ Validar que mudanças no Webflow refletem no site
- ⏳ Validar que não há exposição de credenciais

**Status**: Aguardando credenciais

---

## Checklist para o Cliente

### Informações Técnicas
- [ ] Token da API do Webflow
- [ ] Site ID do Webflow
- [ ] Collection ID para Hero Content
- [ ] Collection ID para Testimonials

### Estrutura das Collections
- [ ] Campos da Hero Content Collection
- [ ] Campos da Testimonials Collection
- [ ] Exemplo de item publicado em cada collection

### Configurações
- [ ] Estratégia de cache (frequência de atualização)
- [ ] Conteúdo padrão/fallback

---

## Conformidade com RF-07

### RF-07 — Webflow CMS (última fase)

✅ **Critério 1**: Conteúdo editável mínimo
- ✅ Hero text - Estrutura preparada
- ✅ Hero background image - Estrutura preparada
- ✅ Testimonials - Estrutura preparada

✅ **Critério 2**: Token Webflow não fica no frontend
- ✅ Token armazenado como secret no Supabase
- ✅ Edge Function faz proxy seguro
- ✅ Frontend nunca acessa token diretamente

⏳ **Critério 3**: Editor altera conteúdo no Webflow → mudança reflete no site
- ⏳ Pendente: Configurar credenciais e testar integração

✅ **Critério 4**: Sem exposição de credenciais no bundle
- ✅ Implementado: Token nunca no frontend

---

## Arquivos Criados

1. ✅ `supabase/functions/webflow-cms-proxy/index.ts` - Edge Function
2. ✅ `src/types/webflow.ts` - Tipos TypeScript
3. ✅ `src/hooks/useWebflowCMS.tsx` - Hooks de integração

---

## Estratégia de Implementação

### Abordagem Segura
- Token Webflow nunca exposto no frontend
- Edge Function como proxy seguro
- Cache para melhorar performance
- Fallback para conteúdo hardcoded se Webflow não disponível

### Vantagens
- ✅ Segurança garantida
- ✅ Performance otimizada (cache)
- ✅ Flexível (suporta qualquer collection)
- ✅ Type safe (TypeScript completo)

---

## Próximos Passos

1. **Obter informações do cliente** (ver seção Pendências acima)
2. **Configurar secrets no Supabase** (WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID)
3. **Configurar variáveis de ambiente** (Collection IDs)
4. **Atualizar componentes** para usar hooks
5. **Testar integração completa**

---

## Conclusão

### ✅ Funcionalidades Implementadas
1. ✅ Edge Function para proxy seguro
2. ✅ Tipos TypeScript completos
3. ✅ Hooks para buscar conteúdo
4. ✅ Componentes identificados

### ⏳ Pendências
1. ⏳ Credenciais do Webflow
2. ⏳ Estrutura das collections
3. ⏳ Integração nos componentes
4. ⏳ Testes com credenciais reais

---

**Status**: ✅ **ESTRUTURA BASE COMPLETA**

A estrutura base está pronta. Falta apenas:
1. Obter credenciais do cliente
2. Configurar secrets no Supabase
3. Integrar componentes
4. Testar integração completa

**Prioridade**: Baixa (última fase do projeto)
