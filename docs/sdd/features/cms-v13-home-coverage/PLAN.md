# PLAN — CMS v13: Home 100% + validacao de listas compostas

## Design

### Estruturas compostas
- `highlight_cards` / `values_cards`:
```json
{ "items": [ { "title": "...", "description": "...", "icon": "shield", "image_url": "https://...", "image_alt": "...", "link": "/contato" } ] }
```

- `how_it_works_steps`:
```json
{ "items": [ { "number": 1, "title": "...", "description": "..." } ] }
```

### Validacao
- Implementada em `useCmsContent.validateBlockContent()` usando `block_key` para diferenciar:
  - `_cards`/`highlight_cards`/`values_cards`
  - `_steps`/`how_it_works_steps`

### UX
- `AssetSelector` (ja existente) usado dentro do `CardListEditor`.

