# ✅ Fase 5: Testes E2E Sprint CMS v7 — Checklist Executável

_Data: 2026-02-03_  
_Status: ⏳ EM EXECUÇÃO_  
_Objetivo: Validar Fases 1-4 através de testes end-to-end_

---

## 🎯 Testes a Executar

### **T7.15: Testes E2E CTA (Fluxo Completo)**

#### Pré-requisitos
- [ ] Ambiente local rodando (`npm run dev`)
- [ ] URL local: http://localhost:5173
- [ ] Acesso ao admin: adm@hotmail.com / adm123

#### Teste 1.1: CTA Validação de URL ✅
```
1. Navegar para /admin/cms/pages/home/edit
2. Localizar bloco CTA (tipo 'cta')
3. Preencher:
   - Texto: "Clique Aqui"
   - URL: "invalid-url" (SEM protocolo)
4. Observar:
   ✓ Erro aparece em vermelho
   ✓ Sugestão: "https://invalid-url"
   ✓ Botão "Publicar" desabilitado
   ✓ Clique em "Aplicar" sugestão → URL preenchida
5. Preencher URL corretamente: "https://exemplo.com"
   ✓ Erro desaparece
   ✓ Ícone ✓ verde aparece
```

#### Teste 1.2: CTA Estilos & Preview ✅
```
1. Manter CTA preenchido (Texto + URL válida)
2. Testar cada estilo no dropdown:
   - primary (dourado) → Preview muda para dourado
   - secondary (outline) → Preview muda para borda dourada
   - warning (laranja) → Preview muda para laranja
   - danger (vermelho) → Preview muda para vermelho
   - success (verde) → Preview muda para verde
3. Verificar Preview Responsivo:
   - Mobile (375px) → Botão compacto
   - Tablet (768px) → Botão médio
   - Desktop (1024px+) → Botão normal
```

#### Teste 1.3: CTA Target (_self vs _blank) ✅
```
1. Testar Target "_self":
   - Selecionar: "Abrir na mesma aba"
   - Publicar
   - Abrir site público (Home)
   - Clicar no botão CTA → Abre na MESMA aba

2. Testar Target "_blank":
   - Editar CTA novamente
   - Selecionar: "Abrir em nova aba"
   - Publicar
   - Abrir site público (Home)
   - Clicar no botão CTA → Abre em NOVA aba
```

#### Teste 1.4: CTA Salvamento & Publicação ✅
```
1. Preencher CTA corretamente
2. Clicar "Salvar Rascunho"
   ✓ Mensagem de sucesso
   ✓ Status muda para "Rascunho"
3. Clicar "Publicar"
   ✓ Mensagem de sucesso
   ✓ Status muda para "Publicada ✓"
4. Abrir site público
   ✓ Novo CTA renderiza corretamente
   ✓ Cores, texto, link funcionam
```

---

### **T7.16: Testes E2E List (Drag-Drop, Importação)**

#### Teste 2.1: List Drag-Drop ✅
```
1. Navegar para /admin/cms/pages/[qualquer-página]/edit
2. Localizar/criar bloco de tipo 'list'
3. Adicionar 3 items:
   - "Item 1"
   - "Item 2"
   - "Item 3"
4. Testar Drag-Drop:
   - Arrastar Item 2 para posição 1
   ✓ Ordem muda para: Item 2, Item 1, Item 3
   - Arrastar Item 3 para posição 1
   ✓ Ordem muda para: Item 3, Item 2, Item 1
5. Publicar
   ✓ Ordem publicada corretamente
```

#### Teste 2.2: List Estilos ✅
```
1. Manter 3 items na lista
2. Selecionar Estilo: "Padrão (bullet)"
   - Preview mostra: • Item 1, • Item 2, • Item 3
3. Selecionar Estilo: "Checkmark"
   - Preview mostra: ✓ Item 1, ✓ Item 2, ✓ Item 3
4. Selecionar Estilo: "Arrow"
   - Preview mostra: → Item 1, → Item 2, → Item 3
5. Publicar
   ✓ Estilo renderiza corretamente no site público
```

#### Teste 2.3: List Numerada ✅
```
1. Manter items na lista
2. Desativar toggle "Lista numerada"
   - Preview mostra <ul>: • Item 1, • Item 2, • Item 3
3. Ativar toggle "Lista numerada"
   - Preview mostra <ol>: 1. Item 1, 2. Item 2, 3. Item 3
4. Publicar
   ✓ Site público renderiza <ol> com números
```

#### Teste 2.4: List Importação ✅
```
1. Criar bloco list vazio
2. Clicar botão "Importar"
3. Modal abre
4. Colar texto com items (um por linha):
   Item A
   Item B
   Item C
5. Verificar Preview mostra 3 items
6. Clicar "Importar 3 items"
   ✓ Items aparecem na lista
   ✓ Modal fecha
7. Publicar
   ✓ Site público renderiza lista importada
```

---

### **T7.17: Testes E2E FAQ (Busca, Múltiplas Aberturas)**

#### Teste 3.1: FAQ Busca/Filtro ✅
```
1. Criar bloco FAQ com 5 perguntas:
   - "O que é leilão?"
   - "Como comprar um imóvel?"
   - "Quais são os custos?"
   - "Posso parcelar?"
   - "Qual é a taxa de juros?"
2. Verificar campo de busca aparece (pois >3 itens)
3. Digitar "leilão" no campo de busca
   ✓ Mostra "1/5 encontrada(s)"
   ✓ Apenas "O que é leilão?" visível
4. Digitar "como" no campo de busca
   ✓ Mostra "1/5 encontrada(s)"
   ✓ Apenas "Como comprar um imóvel?" visível
5. Limpar busca
   ✓ Todas 5 perguntas visíveis novamente
```

#### Teste 3.2: FAQ Múltiplas Aberturas ✅
```
1. Manter FAQ com 5 perguntas criadas
2. Desativar toggle "Permitir múltiplas aberturas" (padrão)
   - Comportamento: accordion (só 1 aberta por vez)
   - Clicar em "O que é leilão?" → Expande
   - Clicar em "Como comprar um imóvel?" → Colapsa anterior, expande esta
3. Ativar toggle "Permitir múltiplas aberturas"
   - Comportamento: checklist (múltiplas abertas)
   - Clicar em "O que é leilão?" → Expande
   - Clicar em "Como comprar um imóvel?" → Ambas PERMANECEM expandidas
4. Publicar
   ✓ Site público renderiza com comportamento correto
```

#### Teste 3.3: FAQ Importação ✅
```
1. Criar bloco FAQ vazio
2. Clicar botão "Importar"
3. Modal abre
4. Colar texto com formato:
   Qual é o melhor bairro? | Depende do seu orçamento
   Preciso de documentos? | Sim, você precisa de RG
5. Verificar Preview mostra 2 items
6. Clicar "Importar 2 items"
   ✓ 2 Q&A aparecem na lista
   ✓ Modal fecha
7. Publicar
   ✓ Site público renderiza FAQ importada
```

---

### **T7.18: Validação de Regressão**

#### Teste 4.1: Blocos Existentes Funcionam ✅
```
1. Abrir página com bloco TEXT
   - Editar texto
   - Publicar
   ✓ Funciona normalmente

2. Abrir página com bloco RICHTEXT
   - Editar com bold/italic
   - Publicar
   ✓ Funciona normalmente

3. Abrir página com bloco IMAGE
   - Editar/publicar
   ✓ Funciona normalmente

4. Verificar Preview ainda funciona para todos os blocos
   ✓ Pré-visualizar abre modal com conteúdo draft
```

#### Teste 4.2: Site Público Íntegro ✅
```
1. Abrir Home pública (/)
   ✓ Carrega normalmente
   ✓ Nenhum erro no console

2. Abrir página regional (/catalogo/copacabana-rj)
   ✓ Carrega normalmente
   ✓ Filtros funcionam

3. Abrir detalhe de imóvel (/imovel/:id)
   ✓ Carrega normalmente
   ✓ Informações corretas

4. Verificar que conteúdo draft NÃO aparece no público
   ✓ Editar CTA → Salvar draft (NÃO publicar)
   ✓ Ir para site público
   ✓ Conteúdo antigo ainda está lá (draft oculto)
```

---

## 📋 Checklist de Testes

### Testes E2E CTA (T7.15)
- [ ] URL Validação (erro, sugestão, apply)
- [ ] Estilos (5 estilos renderizam cores corretas)
- [ ] Preview Responsivo (3 tamanhos)
- [ ] Target (_self vs _blank)
- [ ] Salvamento & Publicação (fluxo completo)

### Testes E2E List (T7.16)
- [ ] Drag-Drop (reordenar items)
- [ ] Estilos (•, ✓, →)
- [ ] Numerada (toggle funciona)
- [ ] Importação (texto, remover duplicatas)

### Testes E2E FAQ (T7.17)
- [ ] Busca/Filtro (mostra corretos)
- [ ] Múltiplas Aberturas (accordion vs checklist)
- [ ] Importação (Q|A format)

### Regressão (T7.18)
- [ ] Text bloco funciona
- [ ] RichText bloco funciona
- [ ] Image bloco funciona
- [ ] Preview funciona
- [ ] Site público íntegro
- [ ] Draft não aparece no público

---

## 🔍 Checklist de Validação Técnica

- [ ] **Sem Erros no Console**
  ```
  Abrir DevTools (F12) → Console
  ✓ Nenhuma mensagem de erro vermelha
  ✓ Apenas warnings esperados (se houver)
  ```

- [ ] **Performance OK**
  ```
  Abrir DevTools → Performance
  ✓ Página carrega em <2s
  ✓ Nenhum jank ao arrastar items
  ```

- [ ] **Renderização Correcta**
  ```
  ✓ Todos os estilos aparecem corretamente
  ✓ Texto não é truncado
  ✓ Botões são clicáveis
  ✓ Ícones aparecem corretamente
  ```

- [ ] **RLS Mantido**
  ```
  ✓ Usuário anônimo não consegue acessar /admin
  ✓ Usuário anônimo só vê conteúdo published
  ✓ Draft não vaza para público
  ```

---

## 📝 Resultados dos Testes

### CTA Tests
```
Status: [ ] PASSOU / [ ] FALHOU
Issues: _________________
```

### List Tests
```
Status: [ ] PASSOU / [ ] FALHOU
Issues: _________________
```

### FAQ Tests
```
Status: [ ] PASSOU / [ ] FALHOU
Issues: _________________
```

### Regression Tests
```
Status: [ ] PASSOU / [ ] FALHOU
Issues: _________________
```

---

## 🎯 Próximas Etapas

Após completar todos os testes com ✓:

1. **T7.19:** Documentação Final
   - [ ] Atualizar CMS_ADMIN_SPEC.md
   - [ ] Atualizar ROADMAP_SPRINTS.md
   - [ ] Criar guia para cliente

2. **T7.20:** Commit Final Sprint v7
   - [ ] `git add .`
   - [ ] `git commit -m "feat(cms-v7): Sprint v7 Completa - Fase 5 Testes"`
   - [ ] Verificar: `git log --oneline -5`

---

## ✅ Conclusão Sprint v7

Após todos os testes passarem:

```
✅ Sprint CMS v7 — CONCLUÍDA
├─ Fase 1: Componentes Compartilhados ✅
├─ Fase 2: CTA Enhancement ✅
├─ Fase 3: List Enhancement ✅
├─ Fase 4: FAQ Enhancement ✅
└─ Fase 5: Testes E2E ✅

📊 Próxima: Sprint v8 — Versionamento & Rollback
```

---

_Guia de testes criado conforme TEST_PLAN.md Seção 9 (Admin CMS)_
