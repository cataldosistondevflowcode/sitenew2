/**
 * Página: AdminCmsAssets
 * Rota: /admin/cms/assets
 * 
 * Gerenciamento de biblioteca de mídia
 * Sprint CMS v2
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AssetUploader } from '@/components/admin/AssetUploader';
import { AssetLibrary } from '@/components/admin/AssetLibrary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminCmsAssets() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Redirecionar se não for admin
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate('/admin/cms')}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold">Biblioteca de Mídia</h1>
        <p className="text-gray-600 mt-2">
          Faça upload e gerencie imagens para usar nos blocos do CMS
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Uploader */}
        <div className="lg:col-span-1">
          <AssetUploader />
        </div>

        {/* Biblioteca */}
        <div className="lg:col-span-2">
          <AssetLibrary />
        </div>
      </div>

      {/* Dicas */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Dicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>• Use imagens em formato JPG, PNG, WebP ou GIF</p>
          <p>• Máximo 5MB por imagem</p>
          <p>• Adicione texto alternativo (alt) para melhorar o SEO</p>
          <p>• Clique em uma imagem para copiar a URL</p>
          <p>• Use o ícone de edição para atualizar metadados</p>
        </CardContent>
      </Card>
    </div>
  );
}
