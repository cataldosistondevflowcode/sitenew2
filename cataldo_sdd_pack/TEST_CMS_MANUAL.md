# TEST_CMS_MANUAL.md — Testes Manuais do Editor CMS via Browser

_Data: 2026-02-04_  
_Objetivo: Validar funcionalidades do CMS através do navegador._

---

## Pré-requisitos

- [ ] App rodando em `http://localhost:5173` (ou URL local)
- [ ] Usuário admin autenticado (email/senha)
- [ ] Base de dados Supabase com tabelas CMS já populadas

---

## 9 Cenários de Teste

### Cenário 1: Autenticação & Proteção de Rotas

**Objetivo:** Validar que rotas `/admin/cms/*` exigem autenticação.

**Passos:**
1. Abra navegador privado/incógnito
2. Acesse `http://localhost:5173/admin/cms` (sem estar logado)
3. **Esperado:** Redireciona para `/admin/login`
4. Faça login com credenciais admin
5. Acesse `/admin/cms` novamente
6. **Esperado:** Lista de páginas carrega

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Redireciona para login
[ ] Login funciona
[ ] Após login, /admin/cms carrega
```

---

### Cenário 2: Lista de Páginas

**Objetivo:** Validar que lista de páginas CMS é exibida corretamente.

**Passos:**
1. Logado como admin, acesse `/admin/cms`
2. Observe a tabela de páginas
3. **Esperado:** 
   - Coluna "Página" mostra titulo
   - Coluna "Status" mostra "draft" ou "published" com cor
   - Coluna "Última atualização" mostra data
   - Botão "Editar" em cada linha

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Tabela carrega com dados
[ ] Status visível (draft/published)
[ ] Data de atualização exibida
[ ] Botão Editar presente
```

---

### Cenário 3: Editor - Salvar Draft

**Objetivo:** Validar que editar e salvar como draft funciona.

**Passos:**
1. Na lista de páginas, clique em "Editar" de uma página (ex.: Home)
2. Aguarde carregamento da página de edição
3. Encontre um bloco de tipo `text` (ex.: hero_title)
4. Clique no bloco para expandir
5. Edite o texto (mude uma palavra)
6. Clique botão "Salvar" (ou Ctrl+S)
7. **Esperado:** Toast verde "Sucesso: Draft salvo com sucesso"
8. Recarregue a página (F5)
9. **Esperado:** Alteração persiste no draft

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Bloco expande
[ ] Campo de texto editável
[ ] Botão Salvar funciona
[ ] Toast de sucesso aparece
[ ] Alteração persiste após reload
```

---

### Cenário 4: Editor - Preview em Tempo Real

**Objetivo:** Validar que preview lado-a-lado funciona (Sprint v8).

**Passos:**
1. Na página de edição, observe o lado direito (em desktop)
2. **Esperado:** Painel "Pré-visualização em Tempo Real" está visível
3. Edite um texto no bloco (lado esquerdo)
4. **Esperado:** Preview atualiza em tempo real (lado direito)
5. Clique botão "Ocultar Preview" no header
6. **Esperado:** Layout fica full-width (só editor)
7. Clique "Mostrar Preview"
8. **Esperado:** Preview volta

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Preview painel visível em desktop
[ ] Preview atualiza ao editar
[ ] Botão ocultar/mostrar funciona
[ ] Layout responsivo (mobile sem preview)
```

---

### Cenário 5: Editor - Validação

**Objetivo:** Validar que validação impede salvar conteúdo vazio.

**Passos:**
1. Edite um bloco `text` e apague todo o conteúdo
2. Clique "Salvar"
3. **Esperado:** Toast vermelho com erro "Conteúdo não pode estar vazio"
4. Não salva (validação bloqueou)

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Validação impede salvar vazio
[ ] Mensagem de erro exibida
[ ] Campo fica marcado como erro
```

---

### Cenário 6: Publicar & Audit Log

**Objetivo:** Validar que publicação funciona e audit log registra.

**Passos:**
1. Com draft alterado, clique botão "Publicar" (ou Ctrl+P)
2. **Esperado:** Toast verde "Sucesso: Conteúdo publicado com sucesso"
3. Status da página muda de "draft" para "published"
4. Acesse `/admin/cms/audit-log`
5. **Esperado:** Entrada mais recente mostra "publish" pela conta do usuário

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Botão Publicar funciona
[ ] Toast de sucesso
[ ] Status muda para published
[ ] Audit log registra ação
```

---

### Cenário 7: Histórico & Reverter (Sprint v4)

**Objetivo:** Validar que versões são salvas e rollback funciona.

**Passos:**
1. Na página de edição, em um bloco expandido, clique botão "Histórico"
2. **Esperado:** Dialog abre com lista de versões
3. Veja versão anterior (data relativa, ex.: "há 5 minutos")
4. Clique "Reverter" em uma versão anterior
5. **Esperado:** Dialog fecha, bloco se recarrega com content_draft restaurado
6. Clique "Salvar" (agora como novo draft)
7. Clique "Publicar" (restaura versão)
8. Audit log mostra "revert" e "publish"

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Botão Histórico abre dialog
[ ] Versões listadas com datas
[ ] Botão Reverter funciona
[ ] content_draft restaurado
[ ] Publicar funciona após revert
[ ] Audit log registra revert
```

---

### Cenário 8: Upload & Seletor de Imagem (Sprint v2)

**Objetivo:** Validar biblioteca de mídia e seletor.

**Passos:**
1. Acesse `/admin/cms/assets`
2. Clique "Fazer Upload"
3. Selecione uma imagem (jpg, png ou webp)
4. **Esperado:** Upload completa, imagem aparece na galeria
5. Volte para edição de uma página
6. Edite um bloco `image`
7. Clique "Seletor de Imagem"
8. **Esperado:** Modal abre com galeria
9. Clique na imagem que fez upload
10. **Esperado:** URL é preenchida, preview atualiza

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Upload funciona
[ ] Imagem aparece na galeria
[ ] Seletor modal abre
[ ] Selecionar imagem preenche URL
[ ] Preview atualiza
```

---

### Cenário 9: Atalhos de Teclado (Sprint v8)

**Objetivo:** Validar que atalhos Ctrl+S e Ctrl+P funcionam.

**Passos:**
1. Na página de edição, edite um bloco
2. Pressione `Ctrl+S` (ou `Cmd+S` no Mac)
3. **Esperado:** Draft salva (sem clicar no botão)
4. Faça outra alteração
5. Pressione `Ctrl+P` (ou `Cmd+P`)
6. **Esperado:** Conteúdo publica (sem clicar no botão)

**Resultado:** ✓ PASSOU / ✗ FALHOU
```
[ ] Ctrl+S salva draft
[ ] Ctrl+P publica conteúdo
[ ] Toast de sucesso em ambos
```

---

## Resumo de Resultados

| Cenário | Status | Notas |
|---------|--------|-------|
| 1. Auth & Proteção | ✓ / ✗ | |
| 2. Lista Páginas | ✓ / ✗ | |
| 3. Salvar Draft | ✓ / ✗ | |
| 4. Preview Real-time | ✓ / ✗ | |
| 5. Validação | ✓ / ✗ | |
| 6. Publicar & Audit | ✓ / ✗ | |
| 7. Histórico & Reverter | ✓ / ✗ | |
| 8. Upload & Seletor | ✓ / ✗ | |
| 9. Atalhos Teclado | ✓ / ✗ | |

**Total:** __/9 passou

---

## Erros Encontrados

(Listar aqui qualquer erro ou comportamento inesperado)

```
1. [Descrever erro]
   - Passo: [qual passo]
   - Comportamento: [o que aconteceu]
   - Esperado: [o que deveria acontecer]
```

---

## Aprovação

- **Data do teste:** 
- **Testador:**
- **Resultado geral:** ✓ TODOS PASSARAM / ✗ ALGUNS FALHARAM
- **Próximo passo:** Implementar banner editor / Corrigir falhas

---

_Documento para referência durante testes manuais._
