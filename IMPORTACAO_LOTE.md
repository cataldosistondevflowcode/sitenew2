# Importação em Lote - Propriedades

## Funcionalidade Implementada

Foi implementada uma funcionalidade completa de importação em lote de propriedades através de arquivos Excel no painel administrativo.

## Como Usar

### 1. Acessar a Funcionalidade

1. Faça login no painel administrativo
2. Na página principal do admin, você verá um botão verde "Importar em Lote" ao lado do botão "Nova Propriedade"
3. Clique no botão para abrir o modal de importação

### 2. Baixar o Modelo

1. No modal de importação, clique no botão "Baixar Modelo Excel"
2. Um arquivo Excel será baixado com:
   - Planilha "Modelo_Importacao" com dados de exemplo
   - Planilha "Instrucoes" com todas as orientações

### 3. Preencher o Arquivo

#### Campos Obrigatórios:
- **Título da Propriedade**: Nome/título do imóvel
- **Endereço**: Endereço completo
- **Cidade**: Nome da cidade
- **Estado**: Sigla com 2 letras (RJ, SP, MG, etc.)
- **Tipo de Propriedade**: Casa, Apartamento, Terreno, etc.

#### Campos Opcionais:
- **Bairro**: Nome do bairro
- **Valor 1º Leilão**: Apenas números (ex: 500000 para R$ 500.000,00)
- **Valor 2º Leilão**: Apenas números
- **Data 1º Leilão**: Formato DD/MM/AAAA
- **Data 2º Leilão**: Formato DD/MM/AAAA
- **Tipo de Leilão**: Judicial, Extrajudicial, etc.
- **Aceita FGTS**: SIM ou NÃO
- **Aceita Financiamento**: SIM ou NÃO
- **Aceita Parcelamento**: SIM ou NÃO
- **Aceita Consórcio**: SIM ou NÃO
- **Nome do Leiloeiro**: Nome completo
- **Número do Processo**: Número do processo judicial
- **Descrição**: Descrição detalhada

### 4. Fazer Upload

1. Arraste e solte o arquivo Excel no modal, ou clique em "Selecionar Arquivo"
2. O sistema processará automaticamente o arquivo
3. Você verá um resumo com:
   - Quantidade de propriedades válidas
   - Lista de erros encontrados (se houver)
   - Preview dos dados que serão importados

### 5. Importar

1. Se tudo estiver correto, clique em "Importar X Propriedade(s)"
2. O sistema mostrará o progresso da importação
3. Ao final, você receberá uma confirmação do sucesso

## Funcionalidades Adicionais

### Exclusão Múltipla

Também foi implementada a funcionalidade de exclusão múltipla:

1. **Selecionar Propriedades**: Use os checkboxes na primeira coluna da tabela
2. **Selecionar Todos**: Use o checkbox no cabeçalho da tabela
3. **Excluir Selecionados**: Clique no botão vermelho "Excluir X selecionado(s)"
4. **Confirmação**: Confirme a exclusão no diálogo de confirmação

### Recursos da Interface

- **Filtros Avançados**: Filtre por estado, cidade, tipo, etc.
- **Busca**: Busque por título, endereço, processo, leiloeiro
- **Paginação**: Navegue entre as páginas de resultados
- **Contadores**: Veja quantos itens estão selecionados
- **Feedback Visual**: Badges e indicadores de status

## Validações Implementadas

### Validações de Dados:
- Campos obrigatórios preenchidos
- Formato correto de estado (2 letras)
- Valores monetários positivos
- Datas em formato válido
- Booleanos como SIM/NÃO

### Validações de Arquivo:
- Apenas arquivos Excel (.xlsx, .xls)
- Estrutura de colunas correta
- Dados não vazios entre registros

## Tratamento de Erros

- **Erros de Validação**: Mostrados na interface com detalhes
- **Erros de Importação**: Logs detalhados no console
- **Feedback ao Usuário**: Toasts informativos
- **Recuperação**: Possibilidade de tentar novamente

## Exemplo de Arquivo Excel

O modelo inclui dados de exemplo como:

```excel
Título da Propriedade | Endereço | Bairro | Cidade | Estado | Tipo de Propriedade | Valor 1º Leilão | Data 1º Leilão | FGTS | Financiamento | Descrição
Casa 3 Quartos | Rua das Flores, 123 | Centro | Rio de Janeiro | RJ | Casa | 500000 | 15/12/2024 | SIM | SIM | Casa em excelente localização
Apartamento 2 Quartos | Av. Copacabana, 456 | Copacabana | Rio de Janeiro | RJ | Apartamento | 800000 | 18/12/2024 | NÃO | SIM | Apartamento com vista para o mar
```

## Dicas Importantes

1. **Não altere os nomes das colunas** no arquivo Excel
2. **Use apenas números** para valores monetários (sem R$, pontos ou vírgulas)
3. **Use SIM ou NÃO** para campos booleanos
4. **Use DD/MM/AAAA** para datas
5. **Não deixe linhas vazias** entre os dados
6. **Salve em formato .xlsx** para melhor compatibilidade

## Suporte

Em caso de problemas:
1. Verifique se o arquivo segue o modelo exato
2. Confirme se todos os campos obrigatórios estão preenchidos
3. Verifique os formatos de data e valores
4. Consulte os logs de erro na interface
