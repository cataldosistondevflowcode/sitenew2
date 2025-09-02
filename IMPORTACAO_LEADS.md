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
- Certifique-se de que Nome e Email estão preenchidos
- Salve como CSV ou Excel

### 2. Fazer Upload
- Clique em **"Importar Leads"**
- Arraste e solte o arquivo ou clique para selecionar
- O sistema validará o formato do arquivo

### 3. Preview dos Dados
- Após o upload, você verá um preview dos dados
- Verifique se as informações estão corretas
- O sistema mostrará quantos leads foram encontrados

### 4. Confirmar Importação
- Clique em **"Importar X Leads"**
- O sistema processará cada lead individualmente
- Você receberá um relatório de sucesso/erro

## Template de Exemplo

Clique em **"Baixar Template CSV"** para baixar um arquivo de exemplo com a estrutura correta.

## Validações do Sistema

### Validações de Arquivo
- Formato deve ser CSV, Excel (.xlsx, .xls)
- Arquivo não pode estar vazio
- Deve conter pelo menos as colunas Nome e Email

### Validações de Dados
- Nome e Email são obrigatórios
- Email deve ter formato válido
- Telefone é opcional
- Grupo deve existir no sistema (se especificado)

### Validações de Negócio
- Leads duplicados por email são permitidos
- Grupos inexistentes são ignorados
- UTM parameters são opcionais

## Tratamento de Erros

### Erros Comuns
- **Arquivo inválido**: Verifique o formato do arquivo
- **Colunas obrigatórias**: Nome e Email são necessários
- **Grupo inexistente**: O grupo especificado não foi encontrado
- **Erro de inserção**: Problema ao salvar no banco de dados

### Relatório de Importação
- Contador de leads importados com sucesso
- Contador de erros encontrados
- Detalhes dos erros no console do navegador

## Limitações

### Técnicas
- Arquivos muito grandes podem demorar para processar
- Processamento é sequencial (não em lote)
- Timeout para arquivos com muitos leads

### Funcionais
- Não há validação de formato de telefone
- Grupos devem existir previamente no sistema
- Não há verificação de duplicatas

## Dicas de Uso

### Para Melhor Performance
- Use arquivos CSV para grandes volumes
- Mantenha as colunas organizadas
- Evite linhas vazias desnecessárias

### Para Dados Limpos
- Verifique a formatação antes de importar
- Use nomes de grupos exatos
- Padronize formatos de telefone

### Para Troubleshooting
- Verifique o console do navegador para erros detalhados
- Teste com poucos leads primeiro
- Valide o formato do arquivo antes do upload

## Exemplo de Uso Completo

### 1. Preparar Dados
```
Nome,Email,Telefone,Grupo,UTM Source,UTM Medium,UTM Campaign
João Silva,joao@email.com,11999999999,Compradores Premium,google,search,leiloes
Maria Santos,maria@email.com,21988888888,Rio de Janeiro,facebook,ads,imoveis
Carlos Oliveira,carlos@email.com,31977777777,São Paulo,email,newsletter,imoveis
```

### 2. Importar
- Abrir modal de importação
- Fazer upload do arquivo
- Verificar preview
- Confirmar importação

### 3. Resultado
- 3 leads importados com sucesso
- Leads aparecem na lista principal
- Podem ser usados para criar agendamentos

## Suporte

Em caso de problemas:
1. Verifique o console do navegador
2. Confirme o formato do arquivo
3. Teste com o template fornecido
4. Verifique se os grupos existem no sistema

## Changelog

### v1.0.0
- ✅ Upload de arquivos CSV e Excel
- ✅ Validação de formato e conteúdo
- ✅ Preview dos dados antes da importação
- ✅ Mapeamento automático de colunas
- ✅ Tratamento de erros e relatórios
- ✅ Template de exemplo para download
- ✅ Integração com sistema de grupos existente
