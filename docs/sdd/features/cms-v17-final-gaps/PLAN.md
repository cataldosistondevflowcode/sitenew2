# PLAN: CMS v17 — Fechamento de Gaps Finais

## Metadata
- **Feature ID**: CMS-V17
- **SPEC**: [SPEC.md](./SPEC.md)
- **Data**: 2026-02-05

---

## 1. Visão Geral

Esta sprint implementa os 5 gaps identificados na análise de alinhamento (Sprint v16) para atingir 100% de cobertura dos requisitos do CMS.

---

## 2. Arquitetura de Mudanças

### 2.1 Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/hooks/useAuth.tsx` | Adicionar lógica de expiração de sessão |
| `src/pages/AdminCmsPages.tsx` | Adicionar filtro por status |
| `src/pages/CmsPreview.tsx` | Adicionar meta noindex |
| `src/pages/AdminCmsPageEdit.tsx` | Adicionar modal de confirmação |
| `src/components/BlockVersionHistory.tsx` | Adicionar modal de confirmação |
| `src/pages/AdminCmsAssets.tsx` | Adicionar busca/filtro |

### 2.2 Novos Componentes

| Componente | Descrição |
|------------|-----------|
| `ConfirmationModal.tsx` | Modal reutilizável de confirmação |
| `PageStatusFilter.tsx` | Filtro de status para lista de páginas |
| `AssetSearchFilter.tsx` | Busca/filtro para biblioteca de mídia |

---

## 3. Detalhamento Técnico

### 3.1 FR-V17-001 — Expiração de Sessão

**Implementação**:
```typescript
// useAuth.tsx
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 horas

// Ao fazer login, salvar timestamp
localStorage.setItem('admin_auth_timestamp', Date.now().toString());

// Ao verificar auth, checar expiração
const checkSessionExpiry = () => {
  const timestamp = localStorage.getItem('admin_auth_timestamp');
  if (timestamp && Date.now() - parseInt(timestamp) > SESSION_TIMEOUT_MS) {
    logout();
    toast({ title: 'Sessão expirada', description: 'Faça login novamente.' });
    return true;
  }
  return false;
};

// Atualizar timestamp em cada atividade
const updateActivity = () => {
  if (isAuthenticated) {
    localStorage.setItem('admin_auth_timestamp', Date.now().toString());
  }
};
```

---

### 3.2 FR-V17-002 — Filtro por Status

**Implementação**:
```tsx
// AdminCmsPages.tsx
const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

const filteredPages = useMemo(() => {
  if (statusFilter === 'all') return pages;
  return pages.filter(p => p.status === statusFilter);
}, [pages, statusFilter]);

// UI
<Tabs value={statusFilter} onValueChange={setStatusFilter}>
  <TabsList>
    <TabsTrigger value="all">Todas ({pages.length})</TabsTrigger>
    <TabsTrigger value="draft">Rascunhos ({draftCount})</TabsTrigger>
    <TabsTrigger value="published">Publicadas ({publishedCount})</TabsTrigger>
  </TabsList>
</Tabs>
```

---

### 3.3 FR-V17-003 — Meta Noindex

**Implementação**:
```tsx
// CmsPreview.tsx
import { Helmet } from 'react-helmet-async';

// No início do componente de preview
<Helmet>
  <meta name="robots" content="noindex, nofollow" />
  <title>Preview: {page?.title}</title>
</Helmet>
```

**Dependência**: Verificar se `react-helmet-async` já está instalado.

---

### 3.4 FR-V17-004 — Modal de Confirmação

**Componente Reutilizável**:
```tsx
// src/components/ConfirmationModal.tsx
interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}
```

**Uso em BlockVersionHistory**:
```tsx
const [confirmRevert, setConfirmRevert] = useState<number | null>(null);

<ConfirmationModal
  open={confirmRevert !== null}
  onOpenChange={() => setConfirmRevert(null)}
  title="Reverter para versão anterior?"
  description="Isso substituirá o rascunho atual. Você poderá publicar depois."
  onConfirm={() => handleRevert(confirmRevert)}
  variant="destructive"
/>
```

---

### 3.5 FR-V17-005 — Busca na Biblioteca de Mídia

**Implementação**:
```tsx
// AdminCmsAssets.tsx
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 300);

const filteredAssets = useMemo(() => {
  if (!debouncedSearch) return assets;
  const query = debouncedSearch.toLowerCase();
  return assets.filter(a => 
    a.filename.toLowerCase().includes(query) ||
    a.original_filename?.toLowerCase().includes(query) ||
    a.alt_text?.toLowerCase().includes(query)
  );
}, [assets, debouncedSearch]);

// UI
<Input
  placeholder="Buscar por nome..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="max-w-sm"
/>
```

---

## 4. Ordem de Implementação

1. **FR-V17-003** — Meta noindex (mais simples, 5 min)
2. **FR-V17-002** — Filtro por status (10 min)
3. **FR-V17-005** — Busca na biblioteca (15 min)
4. **FR-V17-004** — Modal de confirmação (20 min)
5. **FR-V17-001** — Expiração de sessão (20 min)

---

## 5. Testes

| FR | Teste |
|----|-------|
| FR-V17-001 | Simular expiração alterando timestamp no DevTools |
| FR-V17-002 | Filtrar por cada status e verificar contagem |
| FR-V17-003 | View Source no preview, verificar meta robots |
| FR-V17-004 | Clicar em reverter, verificar modal |
| FR-V17-005 | Digitar no campo de busca, verificar filtragem |

---

## 6. Riscos

| Risco | Mitigação |
|-------|-----------|
| react-helmet-async não instalado | Instalar se necessário |
| Modal pode quebrar fluxo existente | Testar fluxo completo após implementar |
| Debounce pode causar lag | Usar 300ms (padrão) |

---

## 7. Entregáveis

- [ ] `useAuth.tsx` com expiração de sessão
- [ ] `AdminCmsPages.tsx` com filtro por status
- [ ] `CmsPreview.tsx` com meta noindex
- [ ] `ConfirmationModal.tsx` novo componente
- [ ] `BlockVersionHistory.tsx` com confirmação
- [ ] `AdminCmsAssets.tsx` com busca
- [ ] Documentação atualizada

---

_Documento criado seguindo SDD._
