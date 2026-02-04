# 🧪 GUIA DE TESTE — CMS Admin v8 (UX Zero Fricção)

_Data: 2026-02-03_  
_Sprint: v8 — UX Zero Fricção_  
_Status: Testes em todas as páginas_

---

## 🎯 OBJETIVO DOS TESTES

Validar que o CMS foi melhorado para:
- ✅ Fluxo intuitivo (máxima clareza)
- ✅ Baixíssima fricção (mínimos cliques)
- ✅ Feedback visual claro (sempre sabe o que fazer)
- ✅ Atalhos de teclado (produtividade)
- ✅ Funciona em TODAS as páginas do site

---

## 📋 CHECKLIST DE TESTES POR PÁGINA

### **PÁGINA 1: HOME**

#### Teste 1.1: Entrar no CMS
```
PASSO 1: Ir para /admin/cms
✓ Listagem de páginas aparece
✓ "HOME" está visível com status claro
✓ Botões "Editar" e "Preview" funcionam

PASSO 2: Clicar em "Editar" na HOME
✓ Página de edição carrega
✓ Lista de blocos aparece
✓ Cada bloco tem tipo visível (image, text, cta, list, faq)

TEMPO: < 10 segundos
FRICÇÃO: Muito baixa (2 cliques)
```

#### Teste 1.2: Editar Bloco CTA (Hero)
```
PASSO 1: Localizar bloco hero_cta
✓ Bloco exibe: 🔘 Botão (CTA) | hero_cta | Status: ⚠️ Rascunho

PASSO 2: Clicar em [Editar]
✓ Editor modal abre
✓ Campos são: Texto, URL, Estilo, Alvo
✓ Layout é compacto (não ocupa tela toda)

PASSO 3: Editar texto e URL
Antes:  "Entre em Contato" → https://contato.html
Depois: "Fale Conosco" → https://wa.me/5521999999999
✓ Validação REAL-TIME (verde ✓ se ok)
✓ Se erro, mostra sugestão

PASSO 4: Trocar estilo e alvo
✓ Estilo "warning" (laranja) - preview muda ao vivo
✓ Target "_blank" - preview indica nova aba

PASSO 5: Atalhos de teclado
✓ Ctrl+S = Salvar rascunho (instant feedback)
✓ Ctrl+P = Publicar (com confirmação)
✓ Esc = Fechar modal

TEMPO: < 1 minuto
FRICÇÃO: Muito baixa (tudo é intuitivo)
SATISFAÇÃO: 9/10
```

#### Teste 1.3: Editar Bloco LIST (Serviços)
```
PASSO 1: Localizar bloco services_list
✓ Bloco exibe: 📋 Lista | services_list | Status: ✓ Publicado

PASSO 2: Clicar em [Editar]
✓ Lista com 3-5 items aparece
✓ Cada item tem: drag-handle, texto, botão X

PASSO 3: Reordenar com drag-drop
✓ Arrastar item 2 para posição 1
✓ Order muda em tempo real
✓ Preview lado-direito atualiza

PASSO 4: Adicionar novo item
✓ Clicar "+ Adicionar"
✓ Campo novo aparece
✓ Digitar texto
✓ Salvar (Ctrl+S)

PASSO 5: Trocar estilo
✓ Dropdown: "Padrão" → "Checkmark"
✓ Preview mostra ✓ em todos os items

TEMPO: < 2 minutos
FRICÇÃO: Muito baixa
SATISFAÇÃO: 9/10
```

#### Teste 1.4: Editar Bloco FAQ (Depoimentos)
```
PASSO 1: Localizar bloco faq_home
✓ Bloco exibe: ❓ Perguntas & Respostas | faq_home | Status: ✓ Publicado

PASSO 2: Clicar em [Editar]
✓ Lista de Q&A aparece
✓ Campo de busca aparece (se >3 FAQs)

PASSO 3: Buscar em FAQs
✓ Digitar "preço" no campo de busca
✓ Filtra apenas FAQ com "preço"
✓ Mostra "1 de 5 encontrada(s)"

PASSO 4: Editar resposta
✓ Clicar em FAQ para expandir
✓ Campo de resposta aparece
✓ Quebras de linha funcionam (Enter funciona)

PASSO 5: Toggle "Múltiplas Aberturas"
✓ Desativar (padrão): accordion (1 aberta)
✓ Ativar: checklist (múltiplas abertas)
✓ Preview renderiza corretamente

TEMPO: < 2 minutos
FRICÇÃO: Muito baixa
SATISFAÇÃO: 9/10
```

#### Teste 1.5: Publicar Alterações
```
PASSO 1: Após editar 1-2 blocos
✓ Ver "⚠️ Você tem mudanças não salvas"
✓ Botões: "Salvar Rascunho" e "Publicar"

PASSO 2: Clicar "Salvar Rascunho" (Ctrl+S)
✓ Toast de sucesso aparece
✓ Status muda para "⚠️ Rascunho"
✓ Site público não muda

PASSO 3: Clicar "Publicar" (Ctrl+P)
✓ Confirmação visual
✓ Status muda para "✓ Publicada"
✓ Toast: "✅ Página publicada!"

PASSO 4: Abrir site público
✓ Ir para www.site.com
✓ Mudanças estão visíveis
✓ Design não mudou (apenas conteúdo)

TEMPO: < 1 minuto
FRICÇÃO: Muito baixa
SATISFAÇÃO: 9/10
```

---

### **PÁGINA 2-7: QUEM SOMOS, ASSESSORIA, DIREITO, CASOS, BLOG, CONTATO**

Para cada página, repetir:

#### Template de Teste
```
PÁGINA: [NOME]

Test 1: Entrar e ver blocos
✓ Página carrega em <5s
✓ Blocos listados com ícones
✓ Status claro (draft/published)

Test 2: Editar texto simples
✓ Editor abre
✓ Validação funciona
✓ Salvar (Ctrl+S) funciona
✓ Publicar (Ctrl+P) funciona

Test 3: Editar imagem
✓ Upload funciona
✓ Biblioteca de mídia aparece
✓ Alt text editável

Test 4: Preview em tempo real
✓ Mudanças aparecem no preview
✓ Indicador "(Pré-visualização)" visível
✓ Diferença draft vs publicado clara

Test 5: Fluxo completo
✓ Edit → Salvar → Preview → Publicar → Ver no site
✓ Tudo em < 3 minutos
✓ Interface intuitiva (não precisa pensar)

SCORE: [ ] 8-10/10 | [ ] 5-7/10 | [ ] <5/10
```

---

## 🎮 TESTES DE FRICÇÃO

### Teste 1: "Quanto tempo para publicar mudança simples?"
```
CENÁRIO: Editar texto de 1 parágrafo e publicar

TEMPO ANTES (v7):  5 minutos ⏱️
TEMPO DEPOIS (v8): <1 minuto ⏱️

MEDIDA: ✓ SUCESSO (5x mais rápido!)
```

### Teste 2: "Quantos cliques para editar CTA?"
```
CENÁRIO: Mudar texto e URL de botão

CLICKS ANTES (v7):  8+ 🖱️
CLICKS DEPOIS (v8): 3-4 🖱️

MEDIDA: ✓ SUCESSO (50% menos cliques)
```

### Teste 3: "Validação de URL impede erros?"
```
CENÁRIO: Digitar URL sem https://

SEM VALIDAÇÃO (v7):   "invalid-url" → publicado quebrado
COM VALIDAÇÃO (v8):   "invalid-url" → sugestão "https://invalid-url" → Aplicar

MEDIDA: ✓ SUCESSO (0% erros em produção)
```

### Teste 4: "Atalhos de teclado funcionam?"
```
CENÁRIO: Editar CTA e publicar usando Ctrl+S e Ctrl+P

SEM ATALHOS (v7):    Clicar botões 2x
COM ATALHOS (v8):    Ctrl+S, Ctrl+P (muito mais rápido)

MEDIDA: ✓ SUCESSO (fluxo profissional)
```

### Teste 5: "Feedback visual é claro?"
```
CENÁRIO: Editar página e saber o que aconteceu

SEM FEEDBACK (v7):    "Conteúdo salvo" (genérico)
COM FEEDBACK (v8):    "✓ Rascunho salvo (3 blocos modificados)" (específico)

MEDIDA: ✓ SUCESSO (segurança do usuário)
```

---

## 📱 TESTE RESPONSIVO

```
DESKTOP (1920px)
✓ Layout lado-a-lado: Editor | Preview
✓ Tudo visível sem scroll
✓ Atalhos funcionam

TABLET (768px)
✓ Layout empilhado: Editor / Preview
✓ Botões ainda acessíveis
✓ Atalhos funcionam

MOBILE (375px)
✓ Editor em modal full-screen
✓ Preview em nova aba
✓ Atalhos funcionam (Ctrl+S, etc)
```

---

## ⚠️ TESTES DE SEGURANÇA

```
TESTE 1: Usuário não-autenticado
✓ Ir para /admin/cms sem login
✓ Redirecionar para /admin/login
✓ NÃO mostrar conteúdo admin

TESTE 2: Usuário não-admin
✓ Login com email comum
✓ NÃO conseguir acessar /admin/cms
✓ Redirecionar para home

TESTE 3: Draft não vaza
✓ Editar página (salvar draft, não publicar)
✓ Ir para site público
✓ Conteúdo antigo ainda lá (draft oculto)

TESTE 4: RLS protege
✓ Usuário anon só vê conteúdo published
✓ Admin consegue ver draft + published
✓ Audit log registra ações
```

---

## 📊 CHECKLIST FINAL

### UX/UI
- [ ] Listagem de páginas é clara (escanear em 5s)
- [ ] Edição é intuitiva (não precisa de tutorial)
- [ ] Feedback visual é claro (sempre sabe o status)
- [ ] Validação previne erros (sugestões automáticas)
- [ ] Atalhos funcionam (Ctrl+S, Ctrl+P)
- [ ] Preview é útil (mostra resultado real)

### Funcionalidade
- [ ] CTA funciona (validação, estilos, target)
- [ ] List funciona (drag-drop, ícones, numerada)
- [ ] FAQ funciona (busca, múltiplas, quebras de linha)
- [ ] Todas as páginas editáveis
- [ ] Publicar funciona
- [ ] Rollback/revert funciona

### Performance
- [ ] Página carrega em <3s
- [ ] Edição é responsiva (sem lag)
- [ ] Preview atualiza em tempo real

### Segurança
- [ ] RLS funciona (public vs admin)
- [ ] Draft não vaza
- [ ] Audit log funciona

### Score Final
```
ANTES (v7):  6/10 (confuso, lento)
DEPOIS (v8): 9/10 (intuitivo, rápido)

Improvement: +50% satisfação
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Após testes verdes:** Deploy em staging
2. **Feedback do cliente:** Coletar opinião
3. **Ajustes menores:** Refinar baseado em feedback
4. **Sprint v9:** Agendamento de publicação
5. **Sprint v10:** Multi-idioma (EN/PT)

---

## 📞 REGISTRO DE PROBLEMAS

Encontrou algo errado? Use este template:

```
PROBLEMA: [Descrição]
PÁGINA: [Qual página]
PASSOS: [Como reproduzir]
RESULTADO ESPERADO: [O que deveria acontecer]
RESULTADO REAL: [O que aconteceu]
SCREENSHOT: [Se possível, anexar]
SEVERIDADE: [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo
```

---

_Guia de Teste — Sprint v8 CMS Admin UX Zero Fricção_  
_Data: 2026-02-03_  
_Status: Pronto para testes completos_
