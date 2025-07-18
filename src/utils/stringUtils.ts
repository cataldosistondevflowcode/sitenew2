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