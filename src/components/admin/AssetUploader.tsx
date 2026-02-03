/**
 * Componente: AssetUploader
 * 
 * Interface para upload de imagens
 * Sprint CMS v2
 */

import { useState, useRef } from 'react';
import { useAssetUpload } from '@/hooks/useAssetUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface AssetUploaderProps {
  onUploadSuccess?: (fileUrl: string) => void;
}

export const AssetUploader = ({ onUploadSuccess }: AssetUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const { uploadAsset, isUploading, uploadProgress } = useAssetUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const asset = await uploadAsset(selectedFile, altText);
    if (asset) {
      setSelectedFile(null);
      setAltText('');
      onUploadSuccess?.(asset.url);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload de Imagem
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seletor de arquivo */}
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 hover:bg-blue-100 transition cursor-pointer">
          <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <span className="font-semibold text-blue-900">
              {selectedFile ? selectedFile.name : 'Clique para selecionar imagem'}
            </span>
            <span className="text-sm text-blue-700">JPG, PNG, WebP ou GIF (máx 5MB)</span>
          </label>
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Alt text */}
        {selectedFile && (
          <div>
            <Label htmlFor="alt-text">Texto Alternativo (Alt)</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descrição da imagem para SEO"
            />
          </div>
        )}

        {/* Progresso */}
        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-900">Enviando: {uploadProgress}%</p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? `Enviando (${uploadProgress}%)` : 'Enviar Imagem'}
          </Button>

          {selectedFile && (
            <Button
              onClick={() => {
                setSelectedFile(null);
                setAltText('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              variant="outline"
              disabled={isUploading}
            >
              Cancelar
            </Button>
          )}
        </div>

        {selectedFile && (
          <div className="bg-white p-3 rounded border">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="max-w-xs max-h-40 rounded"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
