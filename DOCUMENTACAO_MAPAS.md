## Visão Geral
- **Objetivo**: explicar como os mapas e o Street View são exibidos nas páginas de imóveis.
- **Abordagem**: geocodificação via Mapbox (com cache local) + embeds gratuitos do Google Maps/Street View.
- **Benefício**: experiência completa para o usuário sem custo de exibição e com uso otimizado das APIs pagas.

## Fluxo Resumido
- Carregamento da página do imóvel → `PropertyMap` decide entre `Foto`, `Mapa` e `Visão da rua`.
- Tab `Mapa` → `MapEmbed` monta endereço, consulta o Mapbox e cria `iframe` do Google Maps.
- Tab `Visão da rua` → `StreetViewEmbed` reutiliza o endereço e abre `iframe` do Google Street View.
- Falhas de geocodificação exibem um bloco de erro amigável.

## Componentes Principais
- `PropertyMap` (`src/components/PropertyMap.tsx`): gerencia abas, estados e decide qual componente renderizar.
- `MapEmbed` (`src/components/MapEmbed.tsx`): usa cache + Mapbox para obter coordenadas e cria `iframe` `embed/v1/place`.
- `StreetViewEmbed` (`src/components/StreetViewEmbed.tsx`): replica o fluxo, mas usa `embed/v1/streetview` com parâmetros de visão.
- `formatPropertyAddress` (`src/utils/addressFormatter.ts`): concatena endereço completo vindos de `rawPropertyData`.

## Integrações com APIs
- **Mapbox**
  - Token lido de `import.meta.env.VITE_MAPBOX_ACCESS_TOKEN` com fallback.
  - `geocodeAddress` (`src/integrations/mapbox/client.ts`) chama `mapbox.places` (limit=1, country=BR).
  - Resultado cacheado por 24h em `mapboxGeocodeCache` (`src/utils/mapboxCache.ts`).
- **Google Maps / Street View**
  - API key lida de `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` com fallback.
  - Uso somente por `iframe` (endpoints `embed/v1/place` e `embed/v1/streetview`), evitando custos de JavaScript Maps.

## Carregamento do Mapbox GL
- `index.html` inclui os scripts e CSS do Mapbox GL via CDN.
- `loadMapbox` apenas valida a presença global (`window.mapboxgl`) e aplica o token.

## Comportamento no Catálogo Estático
- Em `StaticCatalog` (`src/pages/StaticCatalog.tsx`), quando a imagem do imóvel falha, o mapa interativo é renderizado diretamente com Mapbox GL (`createMapboxMap`), usando o mesmo fluxo de geocodificação.

## Tratamento de Erros e UX
- Enquanto aguarda coordenadas → skeleton/loader animado.
- Falha de geocodificação ou ausência de cobertura Street View → mensagens amigáveis sugerindo verificar outras abas.
- Estados de cache reutilizam coordenadas quando disponíveis, evitando reconsultas e acelerando trocas de aba.

## Pré-Requisitos
- Variáveis `.env` configuradas com `VITE_MAPBOX_ACCESS_TOKEN` e `VITE_GOOGLE_MAPS_API_KEY`.
- Garantir que os imóveis tenham os campos `endereco`, `bairro`, `cidade` e `estado` preenchidos.
- Manter o `<script>` do Mapbox GL em `index.html` para que o catálogo estático funcione.


