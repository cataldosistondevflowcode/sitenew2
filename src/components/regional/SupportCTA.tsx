import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SupportCTAProps {
  estado?: string;
}

export function SupportCTA({ estado = 'RJ' }: SupportCTAProps) {
  const navigate = useNavigate();
  
  const handleContact = () => {
    // Scroll to contact section or open WhatsApp
    const whatsappNumber = '5521999999999'; // TODO: Get from config
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis em leilão.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };
  
  const handleSearch = () => {
    navigate(`/leilao-${estado.toLowerCase()}`);
  };
  
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Não encontrou o que estava procurando?
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Nossa equipe especializada pode ajudá-lo a encontrar o imóvel ideal para você. 
          Entre em contato ou explore mais opções em nossa busca completa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleContact}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Fale Conosco
          </Button>
          <Button 
            onClick={handleSearch}
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 font-semibold"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar Imóveis
          </Button>
        </div>
      </div>
    </section>
  );
}
