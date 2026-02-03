/**
 * Hook: useAssetUpload
 * 
 * Gerencia upload de imagens para Supabase Storage
 * Sprint CMS v2
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Asset {
  id: number;
  filename: string;
  url: string;
  alt_text?: string;
  title?: string;
  created_at: string;
}

const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  BUCKET_NAME: 'cms_assets',
};

export const useAssetUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fazer upload de arquivo
   */
  const uploadAsset = async (file: File, altText?: string): Promise<Asset | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Validar arquivo
      if (!file) {
        throw new Error('Nenhum arquivo selecionado');
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.');
      }

      if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`Arquivo muito grande. Máximo: ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      setUploadProgress(25);

      // Gerar nome único do arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filePath = `cms/${filename}`;

      setUploadProgress(50);

      // Upload para Storage
      const { error: uploadError, data } = await supabase.storage
        .from(UPLOAD_CONFIG.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      setUploadProgress(75);

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(UPLOAD_CONFIG.BUCKET_NAME)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        throw new Error('Não foi possível gerar URL pública');
      }

      setUploadProgress(90);

      // Salvar registro em cms_assets
      const { data: asset, error: dbError } = await supabase
        .from('cms_assets')
        .insert({
          filename,
          original_filename: file.name,
          storage_path: filePath,
          url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          alt_text: altText || '',
          created_by: user?.id,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Erro ao salvar asset: ${dbError.message}`);
      }

      setUploadProgress(100);

      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso',
      });

      return asset as Asset;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Carregar lista de assets
   */
  const loadAssets = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('cms_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssets((data || []) as Asset[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar assets';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletar asset
   */
  const deleteAsset = async (asset: Asset): Promise<boolean> => {
    try {
      // Deletar do Storage
      const { error: storageError } = await supabase.storage
        .from(UPLOAD_CONFIG.BUCKET_NAME)
        .remove([asset.storage_path]);

      if (storageError) {
        console.warn('Erro ao deletar arquivo do storage:', storageError);
      }

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('cms_assets')
        .delete()
        .eq('id', asset.id);

      if (dbError) throw dbError;

      // Atualizar lista local
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));

      toast({
        title: 'Sucesso',
        description: 'Imagem deletada com sucesso',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar imagem';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  };

  /**
   * Atualizar metadados do asset
   */
  const updateAssetMetadata = async (
    assetId: number,
    altText?: string,
    title?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cms_assets')
        .update({
          alt_text: altText || '',
          title: title || '',
        })
        .eq('id', assetId);

      if (error) throw error;

      // Atualizar lista local
      setAssets((prev) =>
        prev.map((a) =>
          a.id === assetId
            ? { ...a, alt_text: altText, title: title }
            : a
        )
      );

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar metadados';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadAsset,
    loadAssets,
    deleteAsset,
    updateAssetMetadata,
    assets,
    isUploading,
    uploadProgress,
    loading,
  };
};
