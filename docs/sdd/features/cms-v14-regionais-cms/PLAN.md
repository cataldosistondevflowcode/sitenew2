# PLAN: CMS v14 — Regionais via CMS (Conteúdo Complementar)

## Metadata
- **Feature ID**: CMS-V14
- **SPEC**: [SPEC.md](./SPEC.md)
- **Autor**: SDD Agent
- **Data**: 2026-02-04

---

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE DADOS CMS v14                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐      │
│  │ Admin CMS    │───────►│ cms_blocks   │───────►│ StaticCatalog│      │
│  │ (Editor)     │ draft  │ (Supabase)   │ publish│ (Público)    │      │
│  └──────────────┘        └──────────────┘        └──────┬───────┘      │
│         │                       │                       │               │
│         │                       │                       ▼               │
│         │                       │              ┌──────────────┐         │
│         │                       │              │ Fallback:    │         │
│         │                       │              │ seo_pages    │         │
│         │                       │              │ (leitura)    │         │
│         │                       │              └──────────────┘         │
│         │                       │                                       │
│         ▼                       ▼                                       │
│  ┌──────────────┐        ┌──────────────┐                              │
│  │ cms_versions │        │ cms_audit_log│                              │
│  │ (rollback)   │        │ (auditoria)  │                              │
│  └──────────────┘        └──────────────┘                              │
│                                                                         │
│  REGRA: Nunca alterar imoveis ou seo_pages (apenas leitura p/ fallback)│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Componentes Afetados

### Backend (Supabase)

| Componente | Ação | Descrição |
|------------|------|-----------|
| `cms_pages` | INSERT | Criar página CMS para regional (ex: `regional-copacabana`) |
| `cms_blocks` | INSERT | Criar ~12 blocos por página regional |
| `cms_versions` | (automático) | Versionamento via RPC existente |
| `cms_audit_log` | (automático) | Audit via RPC existente |
| `seo_pages` | **LEITURA APENAS** | Fallback de dados existentes |
| `imoveis` | **NÃO TOCAR** | Regra crítica |

### Frontend

| Componente | Ação | Descrição |
|------------|------|-----------|
| `src/pages/StaticCatalog.tsx` | Modificar | Adicionar lógica de consumo CMS + fallback |
| `src/hooks/useRegionalCmsContent.ts` | **Criar** | Hook específico para carregar blocos regionais |
| `src/components/regional/RegionCmsContent.tsx` | **Criar** | Renderizador de blocos regionais via CMS |
| `src/components/regional/RegionContentSection.tsx` | Manter | Compatibilidade com fallback |
| Editor existente | Reutilizar | TextBlockEditor, RichTextBlockEditor, ListBlockEditor, CtaBlockEditor |

---

## Modelo de Dados

### 4.1 Blocos CMS para Regionais

Estrutura dos blocos a criar para cada página regional:

```sql
-- Blocos a inserir (exemplo para Copacabana)
-- Serão criados via MCP do Supabase

-- 1. Título do Hero (customizado por região)
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_hero_title',
  'text',
  1,
  '{"value": "Imóveis em Leilão em Copacabana"}',
  '{"value": "Imóveis em Leilão em Copacabana"}'
);

-- 2. Descrição do Hero
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_hero_desc',
  'richtext',
  2,
  '{"value": "<p>Encontre as melhores oportunidades de imóveis em leilão em Copacabana, um dos bairros mais valorizados do Rio de Janeiro.</p>"}',
  '{"value": "<p>Encontre as melhores oportunidades de imóveis em leilão em Copacabana, um dos bairros mais valorizados do Rio de Janeiro.</p>"}'
);

-- 3. Texto Introdutório
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_intro_text',
  'richtext',
  3,
  '{"value": ""}',
  '{"value": ""}'
);

-- 4. Lista de Bairros
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_content_neighborhoods',
  'list',
  4,
  '{"items": []}',
  '{"items": []}'
);

-- 5. Lista de Atrações
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_content_attractions',
  'list',
  5,
  '{"items": []}',
  '{"items": []}'
);

-- 6. Lista de Infraestrutura
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_content_infrastructure',
  'list',
  6,
  '{"items": []}',
  '{"items": []}'
);

-- 7. Lista de Diferenciais/Highlights
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_content_highlights',
  'list',
  7,
  '{"items": []}',
  '{"items": []}'
);

-- 8. Título da Seção "Sobre a Empresa"
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_about_title',
  'text',
  8,
  '{"value": "Sobre a Cataldo & Siston"}',
  '{"value": "Sobre a Cataldo & Siston"}'
);

-- 9. Descrição da Seção "Sobre a Empresa"
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_about_desc',
  'richtext',
  9,
  '{"value": ""}',
  '{"value": ""}'
);

-- 10. CTA Final (composto)
INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published)
VALUES (
  (SELECT id FROM cms_pages WHERE slug = 'regional-copacabana'),
  'region_final_cta',
  'cta',
  10,
  '{"text": "Fale com um Especialista", "url": "/contato", "style": "primary"}',
  '{"text": "Fale com um Especialista", "url": "/contato", "style": "primary"}'
);
```

### 4.2 Estrutura JSON dos Blocos

```jsonc
// region_hero_title (text)
{ "value": "Imóveis em Leilão em Copacabana" }

// region_hero_desc (richtext)
{ "value": "<p>Descrição HTML</p>", "format": "html" }

// region_intro_text (richtext)
{ "value": "<p>Texto introdutório sobre a região...</p>", "format": "html" }

// region_content_neighborhoods (list)
{ "items": ["Copacabana", "Leme", "Ipanema"] }

// region_content_attractions (list)
{ "items": ["Praia de Copacabana", "Forte de Copacabana", "Pedra do Arpoador"] }

// region_content_infrastructure (list)
{ "items": ["Metrô", "Hospitais", "Escolas", "Supermercados"] }

// region_content_highlights (list)
{ "items": ["Alta valorização", "Vista para o mar", "Infraestrutura completa"] }

// region_about_title (text)
{ "value": "Sobre a Cataldo & Siston" }

// region_about_desc (richtext)
{ "value": "<p>Somos especialistas em leilões de imóveis...</p>", "format": "html" }

// region_final_cta (cta)
{ "text": "Fale com um Especialista", "url": "/contato", "style": "primary" }
```

---

## Fluxo de Dados

### 5.1 Renderização no Site Público

```
1. Usuário acessa /imoveis/rj/copacabana
   │
2. StaticCatalog.tsx carrega seo_pages para metas/filtro
   │
3. Hook useRegionalCmsContent tenta carregar blocos CMS
   │
   ├── Se CMS tem dados publicados → Renderiza do CMS
   │   └── RegionCmsContent.tsx renderiza blocos
   │
   └── Se CMS vazio/erro → Fallback para seo_pages
       └── RegionContentSection.tsx renderiza dados existentes
   │
4. Listagem de imóveis renderiza normalmente (independente)
```

### 5.2 Edição no Admin

```
1. Admin acessa /admin/cms/pages/regional-copacabana/edit
   │
2. useCmsContent carrega página e blocos
   │
3. Editor exibe blocos com editores apropriados:
   - TextBlockEditor para text
   - RichTextBlockEditor para richtext
   - ListBlockEditor para list
   - CtaBlockEditor para cta
   │
4. Admin edita → "Salvar Draft" (content_draft atualizado)
   │
5. Admin clica "Preview" → Visualiza em /preview/regional-copacabana
   │
6. Admin clica "Publicar" → RPC publish_block_atomic
   │
7. Site público reflete alterações
```

---

## Hook: useRegionalCmsContent

```typescript
// src/hooks/useRegionalCmsContent.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RegionalCmsBlock {
  block_key: string;
  block_type: string;
  content_published: Record<string, any>;
}

interface UseRegionalCmsContentResult {
  blocks: RegionalCmsBlock[];
  loading: boolean;
  error: string | null;
  hasContent: boolean;
}

/**
 * Hook para carregar conteúdo CMS de páginas regionais
 * Usado pelo site público para renderizar conteúdo editável
 * 
 * @param regionSlug - Slug da página regional (ex: 'regional-copacabana')
 */
export function useRegionalCmsContent(regionSlug: string): UseRegionalCmsContentResult {
  const [blocks, setBlocks] = useState<RegionalCmsBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar página CMS publicada
        const { data: page, error: pageError } = await supabase
          .from('cms_pages')
          .select('id')
          .eq('slug', regionSlug)
          .eq('status', 'published')
          .single();

        if (pageError || !page) {
          // Sem página CMS = fallback para seo_pages
          setBlocks([]);
          return;
        }

        // Buscar blocos publicados
        const { data: blocksData, error: blocksError } = await supabase
          .from('cms_blocks')
          .select('block_key, block_type, content_published')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (blocksError) throw blocksError;

        // Filtrar blocos com conteúdo válido
        const validBlocks = (blocksData || []).filter(
          (b) => b.content_published && Object.keys(b.content_published).length > 0
        );

        setBlocks(validBlocks);
      } catch (err) {
        console.error('Erro ao carregar CMS regional:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    if (regionSlug) {
      loadContent();
    }
  }, [regionSlug]);

  return {
    blocks,
    loading,
    error,
    hasContent: blocks.length > 0,
  };
}
```

---

## Componente: RegionCmsContent

```typescript
// src/components/regional/RegionCmsContent.tsx

import { useRegionalCmsContent } from '@/hooks/useRegionalCmsContent';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { MapPin, Landmark, Building2, Star } from 'lucide-react';

interface RegionCmsContentProps {
  regionSlug: string;
  regionName: string;
  fallbackContent?: {
    neighborhoods?: string[];
    attractions?: string[];
    infrastructure?: string[];
    highlights?: string[];
  };
}

export function RegionCmsContent({
  regionSlug,
  regionName,
  fallbackContent,
}: RegionCmsContentProps) {
  const { blocks, loading, hasContent } = useRegionalCmsContent(`regional-${regionSlug}`);

  // Enquanto carrega, não mostrar nada (evitar flash)
  if (loading) {
    return null;
  }

  // Se CMS tem conteúdo, renderizar do CMS
  if (hasContent) {
    // Extrair listas do CMS
    const neighborhoodsBlock = blocks.find((b) => b.block_key === 'region_content_neighborhoods');
    const attractionsBlock = blocks.find((b) => b.block_key === 'region_content_attractions');
    const infrastructureBlock = blocks.find((b) => b.block_key === 'region_content_infrastructure');
    const highlightsBlock = blocks.find((b) => b.block_key === 'region_content_highlights');

    const sections = [
      {
        key: 'neighborhoods',
        title: 'Bairros da Região',
        icon: MapPin,
        items: neighborhoodsBlock?.content_published?.items,
      },
      {
        key: 'attractions',
        title: 'Atrações',
        icon: Landmark,
        items: attractionsBlock?.content_published?.items,
      },
      {
        key: 'infrastructure',
        title: 'Infraestrutura',
        icon: Building2,
        items: infrastructureBlock?.content_published?.items,
      },
      {
        key: 'highlights',
        title: 'Diferenciais',
        icon: Star,
        items: highlightsBlock?.content_published?.items,
      },
    ].filter((section) => section.items && section.items.length > 0);

    if (sections.length === 0) {
      // CMS sem listas preenchidas = fallback
      return null;
    }

    return (
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-10 text-center">
            Conheça mais sobre {regionName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.key}
                  className="bg-[#f5f5f5] rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#191919] flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-medium text-[#191919]">
                      {section.title}
                    </h3>
                  </div>

                  <ul className="space-y-2.5">
                    {section.items?.map((item: string, index: number) => (
                      <li
                        key={index}
                        className="font-body text-[#333333] text-sm flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d68e08] mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Fallback: sem CMS = não renderizar (deixar para RegionContentSection)
  return null;
}
```

---

## Estratégia de Testes

### Unitários
- Hook `useRegionalCmsContent`: mock de Supabase, testar cenários de sucesso/erro/vazio
- Componente `RegionCmsContent`: testar renderização com/sem dados

### Integração
- Fluxo admin: criar página → criar blocos → editar → salvar → publicar
- Fluxo público: acessar regional → verificar CMS → fallback

### E2E (Manual)
- [ ] Editar conteúdo de Copacabana no Admin
- [ ] Salvar draft e verificar que público não mudou
- [ ] Publicar e verificar que público atualizou
- [ ] Desativar CMS e verificar fallback para seo_pages
- [ ] Verificar que listagem de imóveis não foi afetada

---

## Considerações de Segurança

1. **RLS existente já cobre** — `anon` só vê `status = 'published'`
2. **Não expor draft** — Hook público filtra por `status = 'published'`
3. **Não alterar tabelas protegidas** — `imoveis` e `seo_pages` são somente leitura
4. **Preview protegido** — Rota `/preview/*` exige auth ou token

---

## Plano de Rollback

1. **Se CMS quebrar o site**:
   - Desativar flag/condição que chama CMS
   - Site volta a usar apenas `seo_pages`
   - Zero downtime

2. **Se edição publicar conteúdo errado**:
   - Usar histórico de versões (`cms_versions`)
   - Reverter para versão anterior via Admin

3. **Se precisar remover feature**:
   - Deletar blocos e página CMS
   - Remover código do hook/componente
   - Sem impacto em dados de imóveis

---

## Estimativa de Complexidade

| Área | Complexidade | Justificativa |
|------|--------------|---------------|
| Backend (Supabase) | Baixa | Apenas INSERTs, sem alteração de schema |
| Frontend (Hook) | Baixa | Reutiliza padrão de useCmsContent |
| Frontend (Componente) | Média | Lógica de fallback e renderização condicional |
| Admin (Editor) | Baixa | Reutiliza editores existentes |
| Integração StaticCatalog | Média | Cuidado para não quebrar listagem |
| Testes | Média | Cenários de fallback precisam cobertura |

**Total estimado**: Complexidade média-baixa

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-04 | 1.0 | Criação do documento |

---

_Documento criado seguindo SDD (Spec-Driven Development)._
