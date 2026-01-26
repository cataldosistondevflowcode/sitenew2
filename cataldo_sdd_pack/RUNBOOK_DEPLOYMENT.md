# RUNBOOK_DEPLOYMENT.md — Rodar, gerar SEO pages e fazer deploy
_Data: 2026-01-15_

## 1) Rodando local
```bash
npm install
npm run dev
```

## 2) Build
```bash
npm run build
npm run preview
```

## 3) Geração de páginas SEO
```bash
npm run seo:list
npm run seo:generate
```

## 4) Variáveis de ambiente
Crie um `.env` local (NÃO COMMITAR):
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

Se integrar Webflow via Edge Function:
- `WEBFLOW_API_TOKEN` (apenas no backend/edge; nunca no frontend)

## 5) Deploy (Netlify)
- Build command: `npm run build`
- Publish dir: `dist/`
- Variáveis `.env` no painel do Netlify

## 6) Segurança
- Credenciais em password manager + env vars
- Se houve print com senhas, faça rotação
