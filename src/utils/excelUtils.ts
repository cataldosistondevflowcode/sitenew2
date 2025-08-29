import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Tables } from '@/integrations/supabase/types';

type Property = Tables<'leiloes_imoveis'>;

// Definição das colunas do modelo
export const EXCEL_COLUMNS = [
  { key: 'titulo_propriedade', label: 'Título da Propriedade', required: true },
  { key: 'endereco', label: 'Endereço', required: true },
  { key: 'bairro', label: 'Bairro', required: false },
  { key: 'cidade', label: 'Cidade', required: true },
  { key: 'estado', label: 'Estado (UF)', required: true },
  { key: 'tipo_propriedade', label: 'Tipo de Propriedade', required: true },
  { key: 'leilao_1', label: 'Valor 1º Leilão (R$)', required: false },
  { key: 'leilao_2', label: 'Valor 2º Leilão (R$)', required: false },
  { key: 'data_leilao_1', label: 'Data 1º Leilão (DD/MM/AAAA)', required: false },
  { key: 'data_leilao_2', label: 'Data 2º Leilão (DD/MM/AAAA)', required: false },
  { key: 'tipo_leilao', label: 'Tipo de Leilão', required: false },
  { key: 'fgts', label: 'Aceita FGTS (SIM/NÃO)', required: false },
  { key: 'financiamento', label: 'Aceita Financiamento (SIM/NÃO)', required: false },
  { key: 'parcelamento', label: 'Aceita Parcelamento (SIM/NÃO)', required: false },
  { key: 'consorcio', label: 'Aceita Consórcio (SIM/NÃO)', required: false },
  { key: 'leiloeiro_nome', label: 'Nome do Leiloeiro', required: false },
  { key: 'numero_processo', label: 'Número do Processo', required: false },
  { key: 'descricao', label: 'Descrição', required: false },
];

// Dados de exemplo para o modelo
const EXAMPLE_DATA = [
  {
    titulo_propriedade: 'Casa em Condomínio - 3 Quartos',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    tipo_propriedade: 'Casa',
    leilao_1: '500000',
    leilao_2: '400000',
    data_leilao_1: '15/12/2024',
    data_leilao_2: '20/12/2024',
    tipo_leilao: 'Judicial',
    fgts: 'SIM',
    financiamento: 'SIM',
    parcelamento: 'NÃO',
    consorcio: 'NÃO',
    leiloeiro_nome: 'João Silva',
    numero_processo: '0001234-12.2023.8.19.0001',
    descricao: 'Casa em excelente localização, próxima ao metrô',
  },
  {
    titulo_propriedade: 'Apartamento - 2 Quartos',
    endereco: 'Av. Copacabana, 456',
    bairro: 'Copacabana',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    tipo_propriedade: 'Apartamento',
    leilao_1: '800000',
    leilao_2: '700000',
    data_leilao_1: '18/12/2024',
    data_leilao_2: '25/12/2024',
    tipo_leilao: 'Extrajudicial',
    fgts: 'NÃO',
    financiamento: 'SIM',
    parcelamento: 'SIM',
    consorcio: 'SIM',
    leiloeiro_nome: 'Maria Santos',
    numero_processo: '0005678-12.2023.8.19.0001',
    descricao: 'Apartamento com vista para o mar',
  },
];

// Gerar modelo de Excel para download
export const generateExcelTemplate = () => {
  // Criar workbook
  const wb = XLSX.utils.book_new();
  
  // Criar worksheet com dados de exemplo
  const ws = XLSX.utils.json_to_sheet(EXAMPLE_DATA);
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo_Importacao');
  
  // Criar worksheet com instruções
  const instructions = [
    ['INSTRUÇÕES PARA IMPORTAÇÃO EM LOTE'],
    [''],
    ['1. Preencha os dados nas colunas correspondentes'],
    ['2. Campos obrigatórios: Título da Propriedade, Endereço, Cidade, Estado, Tipo de Propriedade'],
    ['3. Para campos booleanos (FGTS, Financiamento, etc.), use SIM ou NÃO'],
    ['4. Para valores monetários, use apenas números (ex: 500000 para R$ 500.000,00)'],
    ['5. Para datas, use o formato DD/MM/AAAA'],
    ['6. Não altere os nomes das colunas'],
    ['7. Não deixe linhas vazias entre os dados'],
    ['8. Salve o arquivo em formato .xlsx'],
    [''],
    ['FORMATOS ACEITOS:'],
    ['- Tipo de Propriedade: Casa, Apartamento, Terreno, Comercial, etc.'],
    ['- Estado: Sigla com 2 letras (RJ, SP, MG, etc.)'],
    ['- Tipo de Leilão: Judicial, Extrajudicial, etc.'],
    ['- Valores: Apenas números (sem pontos, vírgulas ou R$)'],
    ['- Datas: DD/MM/AAAA'],
    ['- Booleanos: SIM ou NÃO'],
  ];
  
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instrucoes');
  
  // Gerar arquivo
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Download do arquivo
  saveAs(data, 'modelo_importacao_propriedades.xlsx');
};

// Processar arquivo Excel importado
export const processExcelFile = async (file: File): Promise<{ success: Property[], errors: string[] }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Pegar a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Remover cabeçalho
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const success: Property[] = [];
        const errors: string[] = [];
        
        rows.forEach((row, index) => {
          try {
            // Pular linhas vazias
            if (row.every(cell => !cell)) return;
            
            const property: Partial<Property> = {};
            
            // Mapear dados das colunas
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              if (value !== undefined && value !== null && value !== '') {
                const column = EXCEL_COLUMNS.find(col => 
                  col.label.toLowerCase() === header.toLowerCase() ||
                  col.key === header
                );
                
                if (column) {
                  let processedValue = value;
                  
                  // Processar tipos específicos
                  switch (column.key) {
                    case 'leilao_1':
                    case 'leilao_2':
                      processedValue = parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
                      break;
                    case 'fgts':
                    case 'financiamento':
                    case 'parcelamento':
                    case 'consorcio':
                      processedValue = value.toString().toUpperCase() === 'SIM';
                      break;
                    case 'data_leilao_1':
                    case 'data_leilao_2':
                      if (value) {
                        const [day, month, year] = value.toString().split('/');
                        processedValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      }
                      break;
                  }
                  
                  (property as any)[column.key] = processedValue;
                }
              }
            });
            
            // Validar campos obrigatórios
            const requiredFields = EXCEL_COLUMNS.filter(col => col.required);
            const missingFields = requiredFields.filter(field => 
              !property[field.key as keyof Property]
            );
            
            if (missingFields.length > 0) {
              errors.push(`Linha ${index + 2}: Campos obrigatórios faltando: ${missingFields.map(f => f.label).join(', ')}`);
              return;
            }
            
            // Adicionar à lista de sucesso
            success.push(property as Property);
            
          } catch (error) {
            errors.push(`Linha ${index + 2}: Erro ao processar dados - ${error}`);
          }
        });
        
        resolve({ success, errors });
        
      } catch (error) {
        resolve({ 
          success: [], 
          errors: [`Erro ao processar arquivo: ${error}`] 
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Validar dados antes de salvar
export const validatePropertyData = (property: Partial<Property>): string[] => {
  const errors: string[] = [];
  
  // Validar campos obrigatórios
  if (!property.titulo_propriedade) errors.push('Título da propriedade é obrigatório');
  if (!property.endereco) errors.push('Endereço é obrigatório');
  if (!property.cidade) errors.push('Cidade é obrigatória');
  if (!property.estado) errors.push('Estado é obrigatório');
  if (!property.tipo_propriedade) errors.push('Tipo de propriedade é obrigatório');
  
  // Validar formato do estado
  if (property.estado && property.estado.length !== 2) {
    errors.push('Estado deve ter 2 caracteres (ex: RJ, SP)');
  }
  
  // Validar valores monetários
  if (property.leilao_1 && (property.leilao_1 <= 0 || isNaN(property.leilao_1))) {
    errors.push('Valor do 1º leilão deve ser um número positivo');
  }
  
  if (property.leilao_2 && (property.leilao_2 <= 0 || isNaN(property.leilao_2))) {
    errors.push('Valor do 2º leilão deve ser um número positivo');
  }
  
  // Validar datas
  if (property.data_leilao_1) {
    const date1 = new Date(property.data_leilao_1);
    if (isNaN(date1.getTime())) {
      errors.push('Data do 1º leilão deve estar no formato YYYY-MM-DD');
    }
  }
  
  if (property.data_leilao_2) {
    const date2 = new Date(property.data_leilao_2);
    if (isNaN(date2.getTime())) {
      errors.push('Data do 2º leilão deve estar no formato YYYY-MM-DD');
    }
  }
  
  return errors;
};
