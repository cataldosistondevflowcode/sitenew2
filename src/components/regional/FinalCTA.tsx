import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  regionName?: string;
}

export function FinalCTA({ regionName }: FinalCTAProps) {
  const handleContact = () => {
    const whatsappNumber = '5521999999999'; // TODO: Get from config
    const message = encodeURIComponent(
      regionName 
        ? `Olá! Tenho interesse em imóveis em leilão em ${regionName}. Gostaria de mais informações.`
        : 'Olá! Gostaria de mais informações sobre imóveis em leilão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Encontre seu imóvel ideal
        </h2>
        
        <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
          Nossa equipe de especialistas está pronta para ajudá-lo a realizar o sonho 
          do imóvel próprio com economia e segurança.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleContact}
            size="lg"
            className="bg-white text-amber-600 hover:bg-amber-50 font-bold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="h-5 w-5 mr-2" />
            Fale com um Especialista
          </Button>
          
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 h-auto"
          >
            <a href="/leilao-rj">
              Ver Todos os Imóveis
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Assessoria Jurídica Completa</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>15+ Anos de Experiência</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Atendimento Personalizado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
