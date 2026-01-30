/**
 * Contexto da página de catálogo: cidade vs bairro.
 *
 * Regra centralizada:
 * - Exatamente 1 bairro selecionado → contexto BAIRRO (conteúdo/título do bairro).
 * - Nenhum ou 2+ bairros selecionados → contexto CIDADE (apenas nome da cidade, sem conteúdo de bairro).
 */

export type PageContext = 'city' | 'neighborhood';

/**
 * Retorna a lista de bairros atualmente selecionados (fonte única para decisões).
 * Pode vir de estado (array) ou do parâmetro de filtro (string comma-separated).
 */
export function getSelectedNeighborhoods(
  selectedNeighborhoods: string[],
  neighborhoodFilter?: string | null
): string[] {
  if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
    return selectedNeighborhoods.filter(Boolean);
  }
  if (neighborhoodFilter && neighborhoodFilter.trim()) {
    return neighborhoodFilter
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Define o contexto da página com base nos bairros selecionados.
 * - Exatamente 1 bairro → 'neighborhood'
 * - 0 ou 2+ bairros → 'city'
 */
export function getPageContext(selectedNeighborhoods: string[]): PageContext {
  const list = Array.isArray(selectedNeighborhoods)
    ? selectedNeighborhoods.filter(Boolean)
    : [];
  return list.length === 1 ? 'neighborhood' : 'city';
}

/**
 * Retorna o nome do único bairro quando o contexto é bairro; caso contrário null.
 */
export function getSingleNeighborhoodName(
  selectedNeighborhoods: string[]
): string | null {
  const list = Array.isArray(selectedNeighborhoods)
    ? selectedNeighborhoods.filter(Boolean)
    : [];
  return list.length === 1 ? list[0] : null;
}
