-- Script para remover bairros com grafia errada ou outros problemas
-- Total de bairros: 15
-- Gerado em: 2025-09-09T23:49:56.510Z
-- 
-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- ou via interface de administração

-- 1. 13ª Subd. Butantã (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = '13ª Subd. Butantã' AND cidade = 'São Paulo' AND estado = 'SP';

-- 2. CONJUNTO HABITACIONAL SANTA ETELVINA II (EXCLUIR COMUNIDADE RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'CONJUNTO HABITACIONAL SANTA ETELVINA II' AND cidade = 'São Paulo' AND estado = 'SP';

-- 3. DISTRITO DE GUAIANASES JÁ LISTADO ACIMA DISTRITO (NÃO É BAIRRO RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'DISTRITO DE GUAIANASES JÁ LISTADO ACIMA DISTRITO' AND cidade = 'São Paulo' AND estado = 'SP';

-- 4. DISTRITO DE ITAQUERA JÁ LISTADO ACIMA DISTRITO (NÃO É BAIRRO RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'DISTRITO DE ITAQUERA JÁ LISTADO ACIMA DISTRITO' AND cidade = 'São Paulo' AND estado = 'SP';

-- 5. GUIANAZES (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'GUIANAZES' AND cidade = 'São Paulo' AND estado = 'SP';

-- 6. HIDRAULICA (EXCLUIR É UMA RUA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'HIDRAULICA' AND cidade = 'São Paulo' AND estado = 'SP';

-- 7. Jardim Boa Vista (DUPLICADO OESTE - FORA DA ZONA ORIGINAL RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'Jardim Boa Vista' AND cidade = 'São Paulo' AND estado = 'SP';

-- 8. JARDIM DA LARANJEIRA (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM DA LARANJEIRA' AND cidade = 'São Paulo' AND estado = 'SP';

-- 9. JARDIM DO LAGO (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM DO LAGO' AND cidade = 'São Paulo' AND estado = 'SP';

-- 10. JARDIM ESTHER YOLANDA (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM ESTHER YOLANDA' AND cidade = 'São Paulo' AND estado = 'SP';

-- 11. JARDIM PEDRO JOSÉ NUNES (EXCLUIR COMUNIDADE RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM PEDRO JOSÉ NUNES' AND cidade = 'São Paulo' AND estado = 'SP';

-- 12. JARDIM SÃO REMO (EXCLUIR COMUNIDADE RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'JARDIM SÃO REMO' AND cidade = 'São Paulo' AND estado = 'SP';

-- 13. PARAISÓPOLIS (EXCLUIR COMUNIDADE RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'PARAISÓPOLIS' AND cidade = 'São Paulo' AND estado = 'SP';

-- 14. VILA CONSTANCIA (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'VILA CONSTANCIA' AND cidade = 'São Paulo' AND estado = 'SP';

-- 15. VILA CURUÇÃO (EXCLUIR GRAFIA ERRADA RETIRAR!)
DELETE FROM leiloes_imoveis WHERE bairro = 'VILA CURUÇÃO' AND cidade = 'São Paulo' AND estado = 'SP';

-- 
-- Script finalizado!
-- Total de bairros removidos: 15
-- 
-- Para verificar se os bairros foram removidos corretamente, execute:
-- SELECT DISTINCT bairro FROM leiloes_imoveis WHERE cidade = 'São Paulo' AND estado = 'SP' ORDER BY bairro;
