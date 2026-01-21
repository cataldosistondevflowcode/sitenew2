import { Button } from '@/components/ui/button';
import { Search, MessageCircle, ExternalLink } from 'lucide-react';
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

  const handleContactPage = () => {
    window.open('https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/', '_blank');
  };
  
  return (
    <section className="bg-[#d68e08] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Texto */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-4">
              Não encontrou o que estava procurando?
            </h2>
            <p className="font-body text-white/90 text-base md:text-lg">
              Entre em contato com nossa equipe especializada ou explore mais opções em nossa busca completa.
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-body font-semibold px-8 py-3 h-auto"
            >
              <Search className="h-5 w-5 mr-2" />
              Buscar Imóveis
            </Button>
          </div>
        </div>

        {/* Links adicionais */}
        <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-6">
          <a 
            href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/80 hover:text-white font-body text-sm transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Página de Contato
          </a>
          <a 
            href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/80 hover:text-white font-body text-sm transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Assessoria em Leilões
          </a>
        </div>
      </div>
    </section>
  );
}
