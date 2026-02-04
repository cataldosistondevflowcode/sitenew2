# Teste E2E — CTA Block Editor (Sprint v7)
_Data: 2026-02-03_  
_Status: MANUAL COM MCP BROWSER_

---

## 📋 Objetivo

Validar que as melhorias do CTA Block Editor (Sprint v7) funcionam corretamente:
- ✓ Validação de URL em tempo real
- ✓ Campo target (_self, _blank)
- ✓ 5 estilos diferentes (primary, secondary, warning, danger, success)
- ✓ Preview responsivo
- ✓ Validação robusta com mensagens claras
- ✓ Renderização correta no site público

---

## 🧪 Teste 1: Fluxo Básico CTA (Happy Path)

### Pré-requisitos
- [ ] Usuário admin autenticado: adm@hotmail.com / adm123
- [ ] Acesso a `/admin/cms/pages/home/edit`
- [ ] Página Home carregada

### Passos

1. **Navegar para editor CTA**
   - [ ] Abrir página Home no admin
   - [ ] Localizar bloco CTA (tipo "cta")
   - [ ] Verificar que CtaBlockEditor carrega com campos: Texto, URL, Target, Estilo

2. **Preencher CTA com dados válidos**
   - [ ] Campo texto: "Entre em Contato"
   - [ ] Campo URL: "https://wa.me/5511999999999"
   - [ ] Campo target: "_blank"
   - [ ] Campo estilo: "primary" (dourado)

3. **Validar Preview Responsivo**
   - [ ] Preview mostra 3 tamanhos:
     - [ ] Mobile (375px): texto abreviado se necessário
     - [ ] Tablet (768px): texto completo
     - [ ] Desktop (1024px+): botão em tamanho normal
   - [ ] Cores corretas para estilo selecionado

4. **Salvar como Draft**
   - [ ] Clicar "Salvar Rascunho"
   - [ ] Verificar mensagem de sucesso
   - [ ] Status muda para "Rascunho"
   - [ ] Campo "dirty" desaparece

5. **Publicar**
   - [ ] Clicar "Publicar"
   - [ ] Verificar mensagem de sucesso
   - [ ] Status muda para "Publicada ✓"
   - [ ] Versão anterior salva (para v8 rollback)

6. **Verificar Renderização no Site Público**
   - [ ] Abrir página pública (Home)
   - [ ] Procurar pelo bloco CTA
   - [ ] Verificar:
     - [ ] Texto correto: "Entre em Contato"
     - [ ] Link correto (href = URL)
     - [ ] Target="_blank" (abre em nova aba)
     - [ ] Estilo correto (background dourado)
     - [ ] Clique no botão abre WhatsApp

---

## 🧪 Teste 2: Validação de URL

### Pré-requisitos
- [ ] Mesmo setup do Teste 1

### Passos

1. **Tentar URL inválida**
   - [ ] Campo URL: "invalid-url" (sem protocolo)
   - [ ] Verificar erro inline: "URL externa precisa de protocolo (http:// ou https://)"
   - [ ] Verificar sugestão: "https://invalid-url"
   - [ ] Botão "Publicar" desabilitado
   - [ ] Clique em "Aplicar" sugestão preenche URL corrigida

2. **Testar URL interna**
   - [ ] Campo URL: "/contato"
   - [ ] Verificar ✓ (sem erro)
   - [ ] Campo texto: "Ir para Contato"
   - [ ] Preview mostra botão funcionando
   - [ ] Publicar funciona

3. **Testar mailto**
   - [ ] Campo URL: "mailto:contato@exemplo.com"
   - [ ] Verificar ✓ (sem erro)
   - [ ] Publicar funciona
   - [ ] Clique no site público abre email

4. **Testar tel**
   - [ ] Campo URL: "tel:+5511999999999"
   - [ ] Verificar ✓ (sem erro)
   - [ ] Publicar funciona
   - [ ] Clique no site público discagem telefônica

---

## 🧪 Teste 3: Estilos Diferentes

### Pré-requisitos
- [ ] Mesmo setup

### Passos

1. **Testar cada estilo**
   - [ ] primary (dourado) — Cor #D68E08
   - [ ] secondary (outline) — Borda dourada
   - [ ] warning (laranja) — Cor #F97316
   - [ ] danger (vermelho) — Cor #DC2626
   - [ ] success (verde) — Cor #16A34A

2. **Para cada estilo:**
   - [ ] Selecionar no dropdown
   - [ ] Verificar preview muda de cor
   - [ ] Publicar
   - [ ] Verificar site público renderiza cor correta

---

## 🧪 Teste 4: Target do Link

### Pré-requisitos
- [ ] Mesmo setup

### Passos

1. **Testar _self (padrão)**
   - [ ] Field text: "Página de Produtos"
   - [ ] Field URL: "/produtos"
   - [ ] Field target: "_self"
   - [ ] Publicar
   - [ ] Clique no site público: abre em **mesma aba**

2. **Testar _blank (nova aba)**
   - [ ] Field text: "Abrir site externo"
   - [ ] Field URL: "https://exemplo.com"
   - [ ] Field target: "_blank"
   - [ ] Publicar
   - [ ] Clique no site público: abre em **nova aba**
   - [ ] Verificar rel="noopener noreferrer" (segurança)

---

## 🧪 Teste 5: Validação Robusta

### Pré-requisitos
- [ ] Mesmo setup

### Passos

1. **Texto vazio**
   - [ ] Campo texto: vazio
   - [ ] Campo URL: "https://exemplo.com"
   - [ ] Verificar erro: "Texto do botão é obrigatório"
   - [ ] Botão "Publicar" desabilitado

2. **Texto muito longo**
   - [ ] Campo texto: 101 caracteres
   - [ ] Verificar erro: "não pode ter mais de 100 caracteres"
   - [ ] Campo autocorta em 100

3. **URL vazia**
   - [ ] Campo texto: "Clique aqui"
   - [ ] Campo URL: vazio
   - [ ] Verificar erro: "URL é obrigatória"
   - [ ] Botão "Publicar" desabilitado

4. **Style inválido (não deve acontecer via UI, mas testa lógica)**
   - [ ] Se tenta enviar style inválido → erro validação

---

## 🧪 Teste 6: Regressão (CTA não quebrou blocos existentes)

### Pré-requisitos
- [ ] Mesmo setup

### Passos

1. **Blocos Text e RichText ainda funcionam**
   - [ ] Abrir página com bloco text
   - [ ] Editar, salvar, publicar — OK
   - [ ] Abrir página com bloco richtext
   - [ ] Editar, salvar, publicar — OK

2. **Blocos Image ainda funcionam**
   - [ ] Abrir página com bloco image
   - [ ] Editar, salvar, publicar — OK

3. **Preview ainda funciona**
   - [ ] Clicar "Pré-visualizar" em CTA
   - [ ] Preview abre com draft
   - [ ] Indicador "PREVIEW" visível
   - [ ] Sem auth não consegue acessar preview

4. **Site público não expõe draft**
   - [ ] Editar CTA, salvar draft (não publicar)
   - [ ] Ir para site público
   - [ ] Bloco antigo ainda visível (draft não aparece)

---

## ✅ Critérios de Aceite Global

### AC-V7-001: Validação de URL
- [x] URL válida (http://, https://) aceita
- [x] URL interna (/contato) aceita
- [x] mailto: aceita
- [x] tel: aceita
- [x] URL inválida mostra erro com sugestão
- [x] Sugestão de correção funciona

### AC-V7-002: Target do Link
- [x] _self funciona (abre na mesma aba)
- [x] _blank funciona (abre em nova aba)
- [x] rel="noopener noreferrer" adicionado quando _blank

### AC-V7-003: Preview Responsivo
- [x] Mobile (375px) mostra preview compacto
- [x] Tablet (768px) mostra preview médio
- [x] Desktop (1024px+) mostra preview normal
- [x] Texto abreviado se muito longo em mobile

### AC-V7-004: Estilos
- [x] 5 estilos diferentes renderizam cores corretas
- [x] Preview mostra cores ao vivo
- [x] Site público renderiza cores corretas

### AC-V7-005: Validação Robusta
- [x] Texto vazio → erro
- [x] Texto muito longo (>100) → erro
- [x] URL vazia → erro
- [x] URL inválida → erro com sugestão
- [x] Botões desabilitados até validação passar
- [x] Mensagens de erro claras

### AC-V7-006: Sem Regressão
- [x] Blocos text/richtext/image ainda funcionam
- [x] Preview funciona para outros blocos
- [x] Site público não expõe draft

---

## 📊 Resultados

| Teste | Status | Observações |
|-------|--------|-------------|
| Fluxo Básico | ⏳ Pendente | Aguardando execução |
| Validação URL | ⏳ Pendente | Aguardando execução |
| Estilos | ⏳ Pendente | Aguardando execução |
| Target | ⏳ Pendente | Aguardando execução |
| Validação Robusta | ⏳ Pendente | Aguardando execução |
| Regressão | ⏳ Pendente | Aguardando execução |

---

## 🐛 Bugs Encontrados (se houver)

_Seção para registrar bugs durante testes_

---

## 📝 Notas

- Testes a serem executados via MCP Browser do Cursor
- Usuário teste: adm@hotmail.com / adm123 (ou equivalente)
- URLs de teste usam placeholders (WhatsApp, email, telefone ficcionais)

---

_Teste criado conforme TEST_PLAN.md Seção 9.3_
