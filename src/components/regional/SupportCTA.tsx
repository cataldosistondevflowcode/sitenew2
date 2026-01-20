import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SupportCTAProps {
  estado?: string;
}

export function SupportCTA({ estado = 'RJ' }: SupportCTAProps) {
  const navigate = useNavigate();
  
  const handleContact = () => {
    // WhatsApp oficial Cataldo Siston
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis em leilão.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };
  
  const handleSearch = () => {
    navigate(`/leilao-${estado.toLowerCase()}`);
  };
  
  return (
    <section className="bg-[#d68e08] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-4">
          Não encontrou o que estava procurando?
        </h2>
        <p className="font-body text-white/90 mb-8 max-w-2xl mx-auto text-base md:text-lg">
          Nossa equipe especializada pode ajudá-lo a encontrar o imóvel ideal para você. 
          Entre em contato ou explore mais opções em nossa busca completa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleContact}
            size="lg"
            className="bg-white text-[#d68e08] hover:bg-gray-100 font-body font-semibold px-8 py-3 h-auto"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Fale Conosco
          </Button>
          <Button 
            onClick={handleSearch}
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-body font-semibold px-8 py-3 h-auto"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar Imóveis
          </Button>
        </div>
      </div>
    </section>
  );
}
