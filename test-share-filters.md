# Funcionalidade de URLs Shareáveis para Filtros

## Implementação Concluída

Foi implementada com sucesso a funcionalidade de URLs shareáveis para os filtros nas páginas de leilão (LeilaoCaixaRJ e LeilaoSP).

## Como Funciona

### 1. Hook Personalizado `useFilterParams`
- Localização: `src/hooks/useFilterParams.tsx`
- Responsável por gerenciar a sincronização entre filtros e URL
- Funções principais:
  - `parseFiltersFromURL()`: Lê os filtros da URL atual
  - `updateURL(filters)`: Atualiza a URL com os filtros selecionados
  - `clearFiltersFromURL()`: Remove todos os filtros da URL
  - `getShareableURL()`: Retorna a URL atual para compartilhamento
  - `createShareableURL(filters)`: Cria uma URL com filtros específicos

### 2. Parâmetros da URL Suportados
- `cidade`: Cidade selecionada
- `tipo`: Tipo de imóvel
- `bairro`: Bairro selecionado
- `localizacao`: Localização específica
- `palavra_chave`: Palavra-chave de busca
- `tipo_leilao`: Tipo de leilão (apenas SP)
- `segundo_leilao`: true/false para filtrar segundo leilão
- `financiamento`: true/false para leilões com financiamento
- `fgts`: true/false para leilões que aceitam FGTS
- `parcelamento`: true/false para parcelamento
- `preco_min`: Preço mínimo
- `preco_max`: Preço máximo
- `bairros`: Lista de bairros separados por vírgula
- `cidades`: Lista de cidades separadas por vírgula

### 3. Funcionalidades Implementadas

#### Auto-aplicação de Filtros da URL
- Quando o usuário acessa uma URL com parâmetros de filtro, os filtros são automaticamente aplicados
- Os controles da interface são atualizados para refletir os filtros da URL

#### Botão de Compartilhamento
- Localizado abaixo dos botões "Limpar Filtros" e "Buscar Imóveis"
- Cor azul para distinguir das outras ações
- Usa Web Share API em dispositivos móveis quando disponível
- Fallback para copiar para área de transferência

#### Sincronização Automática
- Sempre que filtros são aplicados, a URL é automaticamente atualizada
- Quando filtros são limpos, a URL também é limpa

## Como Testar

### 1. Teste Básico
1. Acesse `/leilao-caixa-rj` ou `/leilao-sp`
2. Selecione alguns filtros (cidade, tipo, bairro, etc.)
3. Clique em "Buscar Imóveis"
4. Observe que a URL foi atualizada com os parâmetros
5. Copie a URL e abra em uma nova aba
6. Verifique se os filtros foram aplicados automaticamente

### 2. Teste do Botão de Compartilhamento
1. Aplique alguns filtros
2. Clique no botão "Compartilhar Link dos Filtros"
3. Em dispositivos móveis: aparecerá o menu de compartilhamento nativo
4. Em desktop: o link será copiado para a área de transferência
5. Cole o link em uma nova aba para verificar

### 3. Exemplos de URLs com Filtros

#### Rio de Janeiro - Apartamentos em Copacabana até R$ 500 mil
```
/leilao-caixa-rj?cidade=Rio%20de%20Janeiro&tipo=apartamento&bairro=Copacabana&preco_max=500000
```

#### São Paulo - Casas com financiamento
```
/leilao-sp?cidade=S%C3%A3o%20Paulo&tipo=casa&financiamento=true
```

#### Múltiplos bairros da Zona Sul RJ
```
/leilao-caixa-rj?cidade=Rio%20de%20Janeiro&bairros=Copacabana,Ipanema,Leblon
```

## Benefícios para o Usuário

1. **Compartilhamento Fácil**: Usuários podem compartilhar filtros específicos com colegas, familiares ou clientes
2. **Bookmarks Úteis**: Possibilidade de salvar buscas favoritas como favoritos do navegador
3. **Histórico de Navegação**: Filtros aplicados ficam no histórico, permitindo voltar facilmente
4. **SEO Melhorado**: URLs com parâmetros ajudam na indexação de buscas específicas
5. **Experiência Consistente**: Filtros são mantidos ao navegar entre páginas

## Notas Técnicas

- Compatível com React Router DOM
- Usa URLSearchParams para parsing seguro dos parâmetros
- Implementa fallbacks para navegadores mais antigos
- Trata encoding/decoding de caracteres especiais automaticamente
- Não afeta a performance da aplicação 