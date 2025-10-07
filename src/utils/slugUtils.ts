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
 * Cria URL completa para propriedade com ID e slug do endereço, bairro, cidade e estado
 * Formato: /imovel/{id}/{imovel-leilao-endereco-bairro-cidade-estado}/
 */
export const createPropertyUrl = (id: number, address: string, neighborhood?: string, city?: string, state?: string): string => {
  const parts = [
    'imovel', 
    'leilao',
    address,
    neighborhood,
    city,
    state
  ].filter(Boolean); // Remove valores vazios/undefined
  
  const slug = createSlug(parts.join(' '));
  return `/imovel/${id}/${slug}/`;
};

/**
 * Extrai ID da URL de propriedade (compatível com formato antigo e novo)
 */
export const extractPropertyIdFromUrl = (urlPath: string): string | null => {
  // Formato novo: /imovel/{id}/{slug}/ 
  // Formato antigo: /imovel/{id} ou /imovel/{id}/slug
  const match = urlPath.match(/\/imovel\/(\d+)(?:\/.*)?/);
  return match ? match[1] : null;
};

/**
 * Normaliza o tipo de leilão para exibição
 * "Outros" é tratado como "Judicial"
 */
export const normalizeAuctionType = (tipoLeilao?: string): string => {
  if (!tipoLeilao) return "Extrajudicial";
  
  // Tratar "Outros" como "Judicial"
  if (tipoLeilao === "Outros") {
    return "Judicial";
  }
  
  return tipoLeilao;
}; 