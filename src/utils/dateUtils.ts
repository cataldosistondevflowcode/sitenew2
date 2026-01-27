/**
 * Utilitários para manipulação de datas
 * 
 * IMPORTANTE: As colunas data_leilao_1 e data_leilao_2 no banco de dados
 * são do tipo DATE (não TIMESTAMP). Por isso, ao fazer comparações com
 * essas colunas via Supabase, devemos usar apenas o formato YYYY-MM-DD,
 * sem informações de hora.
 * 
 * Usar toISOString() completo (ex: 2026-01-27T02:00:32.626Z) pode causar
 * problemas de comparação e excluir registros válidos.
 * 
 * @see https://github.com/cataldosistondevflowcode/sitenew2/issues/XX
 */

/**
 * Retorna a data atual no formato YYYY-MM-DD
 * Use esta função para comparações com colunas DATE do Supabase
 * 
 * @example
 * // Para filtrar leilões futuros:
 * const today = getTodayDateString();
 * query.or(`data_leilao_1.gte.${today},data_leilao_2.gte.${today}`)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Retorna uma data no formato YYYY-MM-DD
 * Use esta função para comparações com colunas DATE do Supabase
 * 
 * @param date - Data a ser formatada
 * @returns String no formato YYYY-MM-DD
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Retorna a data atual para uso em filtros de leilão
 * Considera o fuso horário de São Paulo (America/Sao_Paulo)
 * 
 * @returns String no formato YYYY-MM-DD
 */
export function getCurrentDateForAuctionFilter(): string {
  // Usar a data local do Brasil (UTC-3)
  const now = new Date();
  const brasilOffset = -3 * 60; // UTC-3 em minutos
  const localOffset = now.getTimezoneOffset();
  const diff = brasilOffset - localOffset;
  const brasilTime = new Date(now.getTime() + diff * 60 * 1000);
  return brasilTime.toISOString().split('T')[0];
}

/**
 * Formata uma data para exibição no formato brasileiro
 * 
 * @param dateString - String de data (YYYY-MM-DD ou ISO)
 * @returns String formatada (DD/MM/YYYY)
 */
export function formatDateBR(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  } catch {
    return '-';
  }
}

/**
 * Verifica se uma data de leilão é futura (ainda não passou)
 * 
 * @param dateString - String de data do leilão
 * @returns true se a data é futura ou nula
 */
export function isAuctionDateFuture(dateString: string | null | undefined): boolean {
  if (!dateString) return true; // Datas nulas são consideradas "futuras" (sem data definida)
  
  const today = getTodayDateString();
  return dateString >= today;
}
