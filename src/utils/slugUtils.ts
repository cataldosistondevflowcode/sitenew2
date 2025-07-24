/**
 * Converte texto em slug amigável para URL
 * Remove acentos, espaços e caracteres especiais
 */
export const createSlug = (text: string): string => {
  return text
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais, mantém letras, números, espaços e hífens
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove múltiplos hífens consecutivos
    .replace(/^-|-$/g, ''); // Remove hífens no início e fim
};

/**
 * Cria URL completa para propriedade com ID e slug do endereço
 */
export const createPropertyUrl = (id: number, address: string): string => {
  const slug = createSlug(address);
  return `/imovel/${id}/${slug}`;
};

/**
 * Extrai ID da URL de propriedade (compatível com formato antigo e novo)
 */
export const extractPropertyIdFromUrl = (urlPath: string): string | null => {
  // Suporta tanto /imovel/123 quanto /imovel/123/slug
  const match = urlPath.match(/\/imovel\/(\d+)(?:\/.*)?/);
  return match ? match[1] : null;
}; 