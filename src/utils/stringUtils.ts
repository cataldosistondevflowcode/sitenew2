// Função para remover acentos e normalizar strings para busca
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais exceto espaços
    .trim();
};

// Função para verificar se uma string contém outra de forma flexível
export const flexibleIncludes = (text: string, search: string): boolean => {
  if (!search.trim()) return true;
  
  const normalizedText = normalizeString(text);
  const normalizedSearch = normalizeString(search);
  
  return normalizedText.includes(normalizedSearch);
};

// Função para busca ainda mais flexível que permite palavras em qualquer ordem
export const flexibleSearch = (text: string, search: string): boolean => {
  if (!search.trim()) return true;
  
  const normalizedText = normalizeString(text);
  const searchWords = normalizeString(search).split(/\s+/);
  
  // Verifica se todas as palavras da busca estão presentes no texto
  return searchWords.every(word => normalizedText.includes(word));
};

// Função para formatar valores monetários em Real
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função para escapar caracteres especiais em consultas SQL ilike
export const escapeSqlLike = (str: string): string => {
  if (!str) return '';
  
  // Escapar caracteres especiais do SQL LIKE
  return str
    .replace(/\\/g, '\\\\')  // Escapar barras invertidas primeiro
    .replace(/%/g, '\\%')    // Escapar percentuais
    .replace(/_/g, '\\_')    // Escapar underscores
    .replace(/'/g, "''");    // Escapar aspas simples (duplicar)
};

// Função para sanitizar entrada de busca, removendo caracteres problemáticos
export const sanitizeSearchInput = (str: string): string => {
  if (!str) return '';
  
  // Remover caracteres que podem causar problemas em consultas SQL
  return str
    .replace(/[,;]/g, '')  // Remover vírgulas e ponto e vírgula
    .trim();               // Remover espaços extras
}; 