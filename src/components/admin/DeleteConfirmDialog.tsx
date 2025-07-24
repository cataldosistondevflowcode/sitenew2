import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tables } from '@/integrations/supabase/types';
import { Trash2 } from 'lucide-react';

type Property = Tables<'leiloes_imoveis'>;

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onConfirm: (propertyId: number) => Promise<void>;
  isLoading?: boolean;
}

const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  property, 
  onConfirm, 
  isLoading = false 
}: DeleteConfirmDialogProps) => {
  
  const handleConfirm = async () => {
    if (property) {
      await onConfirm(property.id);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita.
            </div>
            {property && (
              <div className="bg-gray-50 p-3 rounded-md mt-3">
                <div className="text-sm">
                  <div><strong>ID:</strong> {property.id}</div>
                  <div><strong>Título:</strong> {property.titulo_propriedade || 'N/A'}</div>
                  <div><strong>Endereço:</strong> {property.endereco || 'N/A'}</div>
                  <div><strong>Cidade:</strong> {property.cidade || 'N/A'}, {property.estado || 'N/A'}</div>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog; 