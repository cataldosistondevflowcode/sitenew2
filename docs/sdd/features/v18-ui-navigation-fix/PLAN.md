# PLAN: v18 — Correção UI Topo + Navegação Regional

## Metadata
- **Feature ID**: V18-UI-NAV
- **Data**: 2026-02-05
- **Status**: Aprovado
- **Estimativa**: 2-3 horas de implementação

---

## 1. Visão Geral da Arquitetura

### 1.1. Componentes Afetados

```
src/
├── components/
│   └── SocialBar.tsx         # FR-V18-001: Correção layout shift
├── hooks/
│   └── useSEORedirect.tsx    # FR-V18-002/003: Lógica de navegação
├── pages/
│   ├── LeilaoRJ.tsx          # Integração do hook de navegação
│   └── LeilaoSP.tsx          # Integração do hook de navegação
└── [testes manuais]          # Validação via browser
```

### 1.2. Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE NAVEGAÇÃO                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Usuário seleciona bairro(s)]                                      │
│           │                                                         │
│           ▼                                                         │
│  ┌─────────────────────────────────────────┐                        │
│  │  selectedNeighborhoods.length === 1?    │                        │
│  └─────────────────────────────────────────┘                        │
│           │                   │                                     │
│        SIM                   NÃO                                    │
│           │                   │                                     │
│           ▼                   ▼                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐                   │
│  │ Tem página SEO? │  │ Permanecer em /leilao-X │                   │
│  └─────────────────┘  │ com filtros aplicados   │                   │
│       │       │       └─────────────────────────┘                   │
│      SIM     NÃO                                                    │
│       │       │                                                     │
│       ▼       ▼                                                     │
│  ┌─────────┐ ┌─────────────────┐                                    │
│  │navigate │ │Filtro normal    │                                    │
│  │/catalogo│ │sem navegação    │                                    │
│  │/{slug}  │ │                 │                                    │
│  └─────────┘ └─────────────────┘                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Decisões Técnicas

### DEC-V18-001: Altura Fixa no SocialBar
**Problema**: Layout shift causado por variação de altura
**Solução**: Aplicar `min-h-[48px]` ou equivalente no container principal
**Justificativa**: Garante altura mínima fixa independente do conteúdo

### DEC-V18-002: Dimensões Fixas nos Ícones
**Problema**: Ícones podem causar reflow ao carregar/renderizar
**Solução**: Aplicar `w-5 h-5` ou dimensões explícitas nos containers de ícones
**Justificativa**: Reserva espaço antes do ícone renderizar

### DEC-V18-003: Usar replace() em vez de push()
**Problema**: Navegação para regional polui histórico do browser
**Solução**: Usar `navigate(url, { replace: true })`
**Justificativa**: Usuário não precisa voltar para estado intermediário

### DEC-V18-004: Verificação de Mapeamento antes de Navegação
**Problema**: Nem todo bairro tem página SEO
**Solução**: Verificar em `seo_pages` antes de decidir navegar
**Justificativa**: Evita navegação para páginas inexistentes

---

## 3. Implementação Detalhada

### 3.1. Correção SocialBar (FR-V18-001)

**Arquivo**: `src/components/SocialBar.tsx`

**Mudanças**:
```tsx
// ANTES
<header className="w-full bg-neutral-700 py-2 sm:py-3">

// DEPOIS
<header className="w-full bg-neutral-700 py-2 sm:py-3 min-h-[44px] sm:min-h-[52px]">
```

**Mudanças nos ícones**:
```tsx
// ANTES
<div className="flex-shrink-0 w-5 h-5">
  <WhatsAppIcon />
</div>

// DEPOIS (garantir dimensões explícitas)
<div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
  <WhatsAppIcon className="w-5 h-5" />
</div>
```

**Mudanças nos links sociais**:
```tsx
// ANTES
className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity rounded-full hover:bg-neutral-600"

// DEPOIS (transição mais suave, sem alterar dimensões)
className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-[opacity,background-color] duration-150 rounded-full hover:bg-neutral-600"
```

### 3.2. Lógica de Navegação Regional (FR-V18-002/003)

**Arquivo**: `src/pages/LeilaoRJ.tsx` (função `applyFilters`)

**Mudanças**:
```tsx
const applyFilters = () => {
  // ... código existente de construção de newFilters ...

  // NOVA LÓGICA: Verificar se deve navegar para página regional
  if (selectedNeighborhoods.length === 1) {
    const bairro = selectedNeighborhoods[0];
    const seoPage = findSEOPageForNeighborhood(bairro, 'RJ');
    
    if (seoPage) {
      // Navegar para página regional usando replace
      navigate(`/catalogo/${seoPage.page_id}`, { replace: true });
      return; // Não continuar com filtro normal
    }
  }
  
  // Se chegou aqui, aplicar filtro normal
  setFilters(newFilters);
};
```

**Função auxiliar** (pode ser no próprio arquivo ou no hook):
```tsx
const findSEOPageForNeighborhood = async (
  neighborhood: string, 
  state: string
): Promise<SEOPage | null> => {
  // Usar dados já carregados dos mapeamentos SEO
  // ou buscar do Supabase se necessário
};
```

### 3.3. Integração com useSEORedirect

O hook `useSEORedirect.tsx` já tem a lógica básica. Precisamos:
1. Garantir que seja chamado no momento correto (após seleção de 1 bairro)
2. Evitar redirecionamento duplicado
3. Garantir que funcione com o fluxo de `applyFilters`

---

## 4. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar filtro existente | Média | Alto | Testar todos os cenários antes de merge |
| Loop de redirecionamento | Baixa | Alto | Usar flag de controle / replace |
| Bairro sem página SEO | Média | Baixo | Verificar mapeamento antes de navegar |
| Layout shift em outros elementos | Baixa | Médio | Revisar CSS de componentes adjacentes |

---

## 5. Testes de Regressão

Após implementação, verificar:
- [ ] Filtro por cidade funciona
- [ ] Filtro por zona funciona
- [ ] Filtro por múltiplos bairros funciona
- [ ] Paginação funciona
- [ ] SEO meta tags presentes
- [ ] Performance não degradou
- [ ] Mobile responsivo

---

## 6. Rollback Plan

Se problemas forem detectados:
1. Reverter commits da feature
2. Restaurar versão anterior dos arquivos:
   - `src/components/SocialBar.tsx`
   - `src/pages/LeilaoRJ.tsx`
   - `src/pages/LeilaoSP.tsx`
3. Deploy de hotfix

---

_Documento criado seguindo SDD (Spec-Driven Development)._
