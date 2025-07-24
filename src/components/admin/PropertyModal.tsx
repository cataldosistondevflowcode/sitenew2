import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tables } from '@/integrations/supabase/types';
import PropertyForm from './PropertyForm';
import { toast } from '@/hooks/use-toast';

type Property = Tables<'leiloes_imoveis'>;

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  onSuccess: () => void;
  onSubmit: (data: Partial<Property>) => Promise<void>;
}

const PropertyModal = ({ 
  isOpen, 
  onClose, 
  property, 
  onSuccess, 
  onSubmit 
}: PropertyModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<Property>) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: "Sucesso!",
        description: property?.id 
          ? "Propriedade atualizada com sucesso." 
          : "Propriedade criada com sucesso.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      toast({
        title: "Erro",
        description: property?.id 
          ? "Erro ao atualizar propriedade. Tente novamente." 
          : "Erro ao criar propriedade. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property?.id ? 'Editar Propriedade' : 'Nova Propriedade'}
          </DialogTitle>
        </DialogHeader>
        
        <PropertyForm
          property={property}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal; 