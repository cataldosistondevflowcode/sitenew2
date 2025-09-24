-- Remove specific communities from São Paulo neighborhoods
-- These communities should not appear in neighborhood filter options

-- Remove CONJUNTO HABITACIONAL SANTA ETELVINA II
DELETE FROM leiloes_imoveis WHERE bairro = 'CONJUNTO HABITACIONAL SANTA ETELVINA II' AND cidade = 'São Paulo' AND estado = 'SP';

-- Remove JARDIM PEDRO JOSÉ NUNES
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM PEDRO JOSÉ NUNES' AND cidade = 'São Paulo' AND estado = 'SP';

-- Remove JARDIM SÃO REMO
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM SÃO REMO' AND cidade = 'São Paulo' AND estado = 'SP';

-- Remove PARAISÓPOLIS
DELETE FROM leiloes_imoveis WHERE bairro = 'PARAISÓPOLIS' AND cidade = 'São Paulo' AND estado = 'SP';

-- Check results
SELECT 'Communities removed successfully' as status;