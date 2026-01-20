import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  regionName?: string;
}

export function FinalCTA({ regionName }: FinalCTAProps) {
  const handleContact = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent(
      regionName 
        ? `Olá! Tenho interesse em imóveis em leilão em ${regionName}. Gostaria de mais informações.`
        : 'Olá! Gostaria de mais informações sobre imóveis em leilão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="bg-[#265c54] py-16 md:py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-medium text-white mb-6">
          Encontre seu imóvel ideal
        </h2>
        
        <p className="font-body text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Nossa equipe de especialistas está pronta para ajudá-lo a realizar o sonho 
          do imóvel próprio com economia e segurança.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleContact}
            size="lg"
            className="bg-[#d68e08] text-white hover:bg-[#b87a07] font-body font-semibold text-base md:text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="h-5 w-5 mr-2" />
            Fale com um Especialista
          </Button>
          
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-body font-semibold text-base md:text-lg px-8 py-4 h-auto"
          >
            <a href="/leilao-rj">
              Ver Todos os Imóveis
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 font-body text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#d68e08]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Assessoria Jurídica Completa</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#d68e08]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>15+ Anos de Experiência</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#d68e08]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Atendimento Personalizado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
