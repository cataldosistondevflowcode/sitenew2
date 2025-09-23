export const formatPropertyAddress = (
  endereco: string,
  bairro: string,
  cidade: string,
  estado: string
): string => {
  const parts = [endereco, bairro, cidade, estado].filter(Boolean);
  return parts.join(', ');
};

