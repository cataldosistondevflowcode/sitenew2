# Sprint CMS v7 — Realidade vs. Planejamento Inicial

_Data: 2026-02-03_  
_Status: 🔍 Análise_

---

## 📊 Descoberta Importante

Após análise do código e histórico de commits, **CTA, List e FAQ já estão completamente implementados** desde a **Sprint CMS v1** (commit 7f30ba6).

### Timeline Real das Sprints CMS

| Sprint | Data | Status | Implementação |
|--------|------|--------|----------------|
| **v0** | 2026-01-20 | ✅ Concluída | MVP: 1 bloco de texto, draft/publish |
| **v1** | 2026-01-21 | ✅ Concluída | **Múltiplos tipos: text, richtext, image, CTA, List, FAQ** |
| **v2** | 2026-01-22 | ✅ Concluída | Biblioteca de mídia + Upload |
| **v3** | 2026-01-24 | ✅ Concluída | Preview completo + Publish robusto |
| **v4** | 2026-01-25 | ✅ Concluída | Validação robusta + Feedback visual |
| **v5** | 2026-02-01 | ✅ Concluída | Testes E2E completos + Fix autenticação |
| **v6** | 2026-02-03 | ✅ Concluída | RichText com TipTap WYSIWYG |
| **v7** | 2026-02-03 | ⏳ Planejado | ??? |

---

## 🎯 O que Você Pediu vs. O que Existe

### Seu Pedido
> "Siga para o sprint v7, baseado no relato que me passou em outro chat"
> 
> Próximas Prioridades: Sprint v7 — CTA, List, FAQ editors

### Realidade
- ✅ **CTA Editor** — Implementado e funcional desde v1
- ✅ **List Editor** — Implementado e funcional desde v1
- ✅ **FAQ Editor** — Implementado e funcional desde v1
- ✅ **Renderers** — Todos renderizam corretamente no site público
- ✅ **Validação** — Funcionando para todos os tipos

---

## 🔧 Opções para Sprint v7

### Opção A: Consolidar e Testar (Conservadora)
**Objetivo:** Documentar, validar e garantir que tudo funciona perfeitamente

**Tarefas:**
- [ ] Testes E2E completos para CTA (editar → publicar → renderizar)
- [ ] Testes E2E completos para List (editar → publicar → renderizar)
- [ ] Testes E2E completos para FAQ (editar → publicar → renderizar)
- [ ] Validação robusta com casos edge (URL inválida, lista vazia, etc)
- [ ] Documentação técnica completa
- [ ] Guia de uso para cliente
- [ ] Atualizar SPEC.md e ROADMAP

**Duração:** 2-3 dias  
**Risco:** Baixo (testes de código existente)

---

### Opção B: Melhorias dos Editores Existentes (Recomendada)
**Objetivo:** Aprimorar UX e capacidades dos editores CTA/List/FAQ

**Tarefas Possíveis:**

#### 1. CTA Enhancements
- [ ] Validação de URL em tempo real (protocolo, formato)
- [ ] Preview de diferentes tamanhos de tela
- [ ] Suporte a target (_blank, _self)
- [ ] Suporte a onclick (JS customizado)
- [ ] Estilos adicionais (warning, danger, etc)

#### 2. List Enhancements
- [ ] Suporte a lista ordenada (numbered) e desordenada
- [ ] Estilos de ícone: • (bullet), ✓ (checkmark), → (arrow)
- [ ] Drag-and-drop para reordenar itens
- [ ] Importação de lista (paste múltiplas linhas)
- [ ] Limpar toda a lista com 1 clique

#### 3. FAQ Enhancements
- [ ] Suporte a HTML/richtext na resposta (não só texto)
- [ ] Toggle "Permitir múltiplas aberturas simultâneas"
- [ ] Indicador visual de "expandido" (ícone)
- [ ] Ordenação de perguntas por drag-and-drop
- [ ] Busca/filtro de perguntas

#### 4. Validação Avançada
- [ ] Validadores específicos por tipo (URL, lista, FAQ)
- [ ] Mensagens de erro contextuais e acionáveis
- [ ] Regex customizável para validação de campo
- [ ] Aviso se conteúdo publicado será quebrado por nova validação

#### 5. UI/UX Improvements
- [ ] Componentes mais intuitivos (abas vs inline)
- [ ] Preview lado-a-lado (edição vs resultado)
- [ ] Atalhos de teclado (Enter = salvar, Ctrl+P = publicar)
- [ ] Modo dark para editor

**Duração:** 4-5 dias  
**Impacto:** Alto (UX muito melhor para cliente)

---

### Opção C: Features Avançadas (Ambiciosa)
**Objetivo:** Adicionar funcionalidades não presentes em v1-v6

**Possíveis Funcionalidades:**

#### 1. Agendamento de Publicação
- [ ] Agendar publicação para data/hora futura
- [ ] Despublicar automaticamente em data/hora
- [ ] Fila de publicações

#### 2. Multi-idioma
- [ ] Blocos com conteúdo em português e inglês
- [ ] Seletor de idioma no admin
- [ ] Fallback para português se conteúdo não disponível

#### 3. Permissões Granulares
- [ ] Admin (CRUD tudo)
- [ ] Editor (editar + draft, não publicar)
- [ ] Reviewer (revisar + publicar, não editar)

#### 4. Comparação de Versões
- [ ] Diff visual entre versões
- [ ] Mostrar quem mudou o quê e quando
- [ ] Highlight de diferenças

#### 5. SEO Avançado por Bloco
- [ ] Meta tags customizáveis por bloco
- [ ] Markup schema.json por bloco
- [ ] Open Graph para compartilhamento

#### 6. Analytics de Blocos
- [ ] Rastrear cliques em CTA
- [ ] Rastrear visualizações de FAQ
- [ ] Dashboard de performance por bloco

**Duração:** 1-2 semanas  
**Risco:** Alto (muitas dependências)

---

## 📋 Recomendação

### **SUGESTÃO: Opção B (Melhorias dos Editores)**

**Por quê:**
1. ✅ Aproveita código existente (sem rewrites)
2. ✅ Melhora significativamente UX para cliente
3. ✅ Complexidade média (implementável em ~1 semana)
4. ✅ Alto valor: cliente vê diferença imediata
5. ✅ Prepara base para features futuras

### Escopo Proposto para Sprint v7
1. **CTA:** URL validation + target support + preview responsivo
2. **List:** Ordered/unordered + estilos de ícone + drag-drop
3. **FAQ:** Richtext nas respostas + multiple expand + search
4. **Validação:** Sistema genérico de validators por tipo
5. **Testes:** E2E para todos os cenários

**Duração Estimada:** 5-6 dias

---

## 🚀 Próximos Passos

1. **Confirmar direção com você** (Opção A, B ou C?)
2. **Se Opção B:** Começar com CTA enhancements
3. **Se Opção A:** Estruturar testes E2E
4. **Se Opção C:** Discutir prioridades

Qual direção você prefere?

---

_Análise realizada em 2026-02-03_
