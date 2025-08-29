import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2 
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { 
  generateExcelTemplate, 
  processExcelFile, 
  validatePropertyData 
} from '@/utils/excelUtils';
import { PropertyCRUD } from './PropertyCRUD';

type Property = Tables<'leiloes_imoveis'>;

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BulkImportModal = ({ isOpen, onClose, onSuccess }: BulkImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [processedData, setProcessedData] = useState<{
    success: Property[];
    errors: string[];
  } | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setProcessedData(null);
    setIsProcessing(true);

    try {
      const result = await processExcelFile(selectedFile);
      setProcessedData(result);
      
      if (result.errors.length > 0) {
        toast({
          title: "Atenção",
          description: `${result.errors.length} erro(s) encontrado(s) no arquivo. Verifique os detalhes abaixo.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${result.success.length} propriedade(s) processada(s) com sucesso!`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
    toast({
      title: "Download iniciado",
      description: "Modelo de Excel baixado com sucesso!",
    });
  };

  const handleImport = async () => {
    if (!processedData || processedData.success.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);

    try {
      const totalProperties = processedData.success.length;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < totalProperties; i++) {
        const property = processedData.success[i];
        
        // Validar dados antes de salvar
        const validationErrors = validatePropertyData(property);
        
        if (validationErrors.length > 0) {
          errorCount++;
          console.error(`Erro na propriedade ${i + 1}:`, validationErrors);
        } else {
          try {
            await PropertyCRUD.createProperty(property);
            successCount++;
          } catch (error) {
            errorCount++;
            console.error(`Erro ao salvar propriedade ${i + 1}:`, error);
          }
        }

        // Atualizar progresso
        setImportProgress(((i + 1) / totalProperties) * 100);
      }

      // Mostrar resultado final
      if (successCount > 0) {
        toast({
          title: "Importação concluída!",
          description: `${successCount} propriedade(s) importada(s) com sucesso${errorCount > 0 ? `, ${errorCount} erro(s)` : ''}`,
        });
        onSuccess();
        handleClose();
      } else {
        toast({
          title: "Erro na importação",
          description: "Nenhuma propriedade foi importada. Verifique os dados.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro durante a importação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setProcessedData(null);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = {
        target: { files: [droppedFile] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importação em Lote - Propriedades
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo Excel para importar múltiplas propriedades de uma vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download do modelo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Baixar Modelo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Baixe o modelo de Excel com as colunas corretas e dados de exemplo.
              </p>
              <Button 
                onClick={handleDownloadTemplate}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Modelo Excel
              </Button>
            </CardContent>
          </Card>

          {/* Upload do arquivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Upload do Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  file 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Processando arquivo...</p>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                    <p className="font-medium text-green-800">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setProcessedData(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arraste e solte um arquivo Excel aqui, ou
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Selecionar Arquivo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Resultado do processamento */}
          {processedData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Resultado do Processamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {processedData.success.length} válido(s)
                  </Badge>
                  {processedData.errors.length > 0 && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {processedData.errors.length} erro(s)
                    </Badge>
                  )}
                </div>

                {/* Lista de erros */}
                {processedData.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h4 className="font-medium text-red-800 mb-2">Erros encontrados:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {processedData.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700">
                          • {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview dos dados válidos */}
                {processedData.success.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h4 className="font-medium text-green-800 mb-2">
                      Dados válidos para importação:
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {processedData.success.slice(0, 5).map((property, index) => (
                        <div key={index} className="text-sm text-green-700">
                          • {property.titulo_propriedade} - {property.cidade}/{property.estado}
                        </div>
                      ))}
                      {processedData.success.length > 5 && (
                        <p className="text-sm text-green-600">
                          ... e mais {processedData.success.length - 5} propriedade(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progresso da importação */}
          {isImporting && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Importando Propriedades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Importando propriedades... Por favor, aguarde.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isImporting}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!processedData || processedData.success.length === 0 || isImporting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar {processedData?.success.length || 0} Propriedade(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportModal;
