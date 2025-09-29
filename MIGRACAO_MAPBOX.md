# Migração do Google Maps para Mapbox

## Resumo da Migração

Este documento descreve a migração completa do Google Maps para o Mapbox no projeto de leilões de imóveis.

## Arquivos Modificados

### 1. Novos Arquivos Criados

- `src/integrations/mapbox/client.ts` - Cliente principal do Mapbox
- `src/utils/mapboxCache.ts` - Sistema de cache para Mapbox

### 2. Arquivos Modificados

- `src/components/PropertyCard.tsx` - Componente de card de propriedade
- `src/components/PropertyMap.tsx` - Componente de mapa de propriedade
- `src/pages/StaticCatalog.tsx` - Página de catálogo estático
- `index.html` - Adicionado script do Mapbox GL JS

## Estrutura da Implementação

### Sistema de Cache

O projeto mantém o mesmo sistema de cache inteligente:

1. **Cache de Geocoding** (`mapboxGeocodeCache`)
   - Armazena coordenadas por endereço
   - Duração: 24 horas
   - Evita chamadas repetidas de geocoding

2. **Cache de Mapas** (`mapboxMapCache`)
   - Armazena instâncias de mapas
   - Duração: 30 minutos
   - Limpeza automática a cada 10 minutos

### Funcionalidades Mantidas

- **Fallback automático**: Imagem → Mapa quando imagem falha
- **Geocoding**: Conversão de endereços em coordenadas
- **Marcadores**: Indicadores visuais das propriedades
- **Interatividade**: Configurável por contexto
- **Performance**: Cache duplo para otimização

## Configuração Necessária

### 1. Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiY2F0YWxkb3Npc3RvbiIsImEiOiJjbWc1cXU0ajcwN3gyMmpxNHNiOTlpbmJ5In0.bfiSJwTEHmO_lXKYIFAxag
```

### 2. Token do Mapbox

✅ **PERFEITO**: O token fornecido é um token público (`pk.`) - ideal para uso no frontend!

1. ✅ Token público configurado corretamente
2. ✅ Seguro para uso no frontend
3. ✅ Configure restrições de domínio no painel do Mapbox se necessário

**Token atual configurado**: `pk.eyJ1IjoiY2F0YWxkb3Npc3RvbiIsImEiOiJjbWc1cXU0ajcwN3gyMmpxNHNiOTlpbmJ5In0.bfiSJwTEHmO_lXKYIFAxag`

## Diferenças Principais

### Google Maps vs Mapbox

| Aspecto | Google Maps | Mapbox |
|---------|-------------|---------|
| **Geocoding** | `google.maps.Geocoder` | API REST do Mapbox |
| **Mapa** | `google.maps.Map` | `mapboxgl.Map` |
| **Marcador** | `google.maps.Marker` | `mapboxgl.Marker` |
| **Estilo** | `MapTypeId.ROADMAP` | `mapbox://styles/mapbox/streets-v12` |
| **Carregamento** | Loader assíncrono | Script no HTML |

### Vantagens do Mapbox

1. **Custo**: Geralmente mais barato que Google Maps
2. **Customização**: Estilos de mapa mais flexíveis
3. **Performance**: Renderização mais rápida
4. **Controle**: Maior controle sobre a aparência

## Uso nas Páginas

### Páginas de Listagem (Home, Leilão-SP, Leilão-RJ)

```typescript
// PropertyCard.tsx
const initializeMap = async () => {
  // Verificar cache primeiro
  const cachedMap = mapboxMapCache.get(address);
  
  if (cachedMap) {
    // Reusar mapa do cache
    return;
  }
  
  // Fazer geocoding e criar mapa
  const coordinates = await geocodeAddress(address);
  const mapInstance = createMapboxMap(container, coordinates, {
    zoom: 15,
    interactive: false, // Não interativo na listagem
  });
};
```

### Página de Detalhes

```typescript
// PropertyMap.tsx
const mapInstance = createMapboxMap(container, coordinates, {
  zoom: 16,
  interactive: true, // Interativo na página de detalhes
  title: property.title,
});
```

## Monitoramento e Debug

### Logs de Erro

- Geocoding falhou: `console.error('Geocoding failed for address:', address)`
- Erro de carregamento: `console.error('Error loading Mapbox:', error)`

### Cache Status

```typescript
// Verificar tamanho do cache
console.log('Geocode cache size:', mapboxGeocodeCache.size());
console.log('Map cache size:', mapboxMapCache.size());
```

## Próximos Passos

1. **Teste**: Verificar funcionamento em todas as páginas
2. **Otimização**: Ajustar estilos de mapa conforme necessário
3. **Monitoramento**: Acompanhar uso da API e custos
4. **Documentação**: Atualizar documentação da API

## Rollback (se necessário)

Para voltar ao Google Maps:

1. Reverter as modificações nos arquivos listados
2. Remover os novos arquivos do Mapbox
3. Restaurar as importações originais
4. Remover o script do Mapbox do `index.html`

## Solução de Problemas

### Erro: "Failed to resolve import 'mapbox-gl'"

**Problema**: O Vite não consegue resolver a importação do mapbox-gl.

**Solução**: O Mapbox GL JS é carregado via CDN no `index.html`, não como módulo npm. O código foi ajustado para usar `window.mapboxgl` em vez de importar o módulo.

```typescript
// ❌ Não funciona (importação de módulo)
import mapboxgl from 'mapbox-gl';

// ✅ Funciona (objeto global)
declare global {
  interface Window {
    mapboxgl: any;
  }
}
```

## Suporte

Para dúvidas sobre a implementação, consulte:
- [Documentação do Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [API de Geocoding do Mapbox](https://docs.mapbox.com/api/search/geocoding/)
