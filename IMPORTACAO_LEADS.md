# Importação de Leads via Planilha

## Visão Geral

A funcionalidade de importação de leads via planilha permite que você importe múltiplos leads de uma vez usando arquivos CSV ou Excel (.xlsx, .xls). Esta funcionalidade está disponível na página de Lista de Leads (`/admin/leads`).

## Como Acessar

1. Navegue para `/admin/leads`
2. Clique no botão **"Importar Leads"** no cabeçalho da página
3. O modal de importação será aberto

## Formatos Suportados

- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

## Estrutura da Planilha

### Colunas Obrigatórias
- **Nome**: Nome completo do lead
- **Email**: Endereço de email válido

### Colunas Opcionais
- **Telefone**: Número de telefone (com ou sem formatação)
- **Grupo**: Nome do grupo de leads (deve existir no sistema)
- **UTM Source**: Fonte da campanha (ex: google, facebook, email)
- **UTM Medium**: Meio da campanha (ex: search, ads, social)
- **UTM Campaign**: Nome da campanha (ex: leiloes, imoveis)

### Exemplo de Estrutura

| Nome | Email | Telefone | Grupo | UTM Source | UTM Medium | UTM Campaign |
|------|-------|----------|-------|------------|------------|--------------|
| João Silva | joao@email.com | 11999999999 | Compradores Premium | google | search | leiloes |
| Maria Santos | maria@email.com | 21988888888 | Rio de Janeiro | facebook | ads | imoveis |

## Processo de Importação

### 1. Preparar a Planilha
- Organize os dados nas colunas corretas
- Certifique-se de que Nome, Email e URL do Filtro estão preenchidos
- Salve como CSV ou Excel

## Template de Exemplo

Clique em **"Baixar Template Excel"** para baixar um arquivo de exemplo com a estrutura correta.

**O template inclui:**
- **Planilha "Template_Leads"**: Com dados de exemplo e colunas organizadas
- **Planilha "Instruções"**: Com orientações detalhadas sobre cada campo
- **Formatação automática**: Colunas com largura otimizada para melhor visualização
- **Exemplos práticos**: Dados reais para facilitar o preenchimento

## Validações do Sistema

### Validações de Arquivo
- Formato deve ser CSV, Excel (.xlsx, .xls)
- Arquivo não pode estar vazio
- Deve conter pelo menos as colunas Nome, Email e URL do Filtro

### Validações de Dados
- Nome, Email e URL do Filtro são obrigatórios
- Email deve ter formato válido
- Telefone é opcional
- Grupo deve existir no sistema (se especificado)

### Validações de Negócio
- Leads duplicados por email são permitidos
- Grupos inexistentes são ignorados
- Metodo de contato e mensagem são opcionais

## Tratamento de Erros

### Erros Comuns
- **Arquivo inválido**: Verifique o formato do arquivo
- **Colunas obrigatórias**: Nome, Email e URL do Filtro são necessários
- **Grupo inexistente**: O grupo especificado não foi encontrado
- **Erro de inserção**: Problema ao salvar no banco de dados

## Exemplo de Uso Completo

### 1. Preparar Dados
```
Nome,Email,Telefone,URL do Filtro,Metodo de Contato,Grupo,Mensagem
João Silva,joao@email.com,11999999999,https://site.com/filtro?cidade=RJ,WhatsApp,Compradores Premium,Interessado em imóveis
Maria Santos,maria@email.com,21988888888,https://site.com/filtro?bairro=Botafogo,Email,Rio de Janeiro,Quero mais informações
Carlos Oliveira,carlos@email.com,31977777777,https://site.com/filtro?tipo=casa,Telefone,São Paulo,Interessado em casas
```

## Changelog

### v2.1.0
- ✅ Template Excel (.xlsx) em vez de CSV
- ✅ Duas planilhas: Template_Leads + Instruções
- ✅ Formatação automática das colunas
- ✅ Melhor visualização e edição dos dados

### v2.0.0
- ✅ Novo modelo obrigatório: Nome, Email, URL do Filtro
- ✅ Campos opcionais: Metodo de Contato, Grupo, Mensagem
- ✅ Template atualizado com nova estrutura
- ✅ Validações atualizadas para novos campos obrigatórios
- ✅ Preview atualizado para mostrar URL do Filtro
