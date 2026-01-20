import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Award, Users, Clock } from 'lucide-react';

export function AboutCompanySection() {
  const handleContact = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre imóveis em leilão.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="bg-[#ebe5de] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-10 text-center">
          Conheça a Cataldo Siston
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <p className="font-body text-[#333333] mb-8 leading-relaxed text-base md:text-lg">
              A Cataldo Siston é um escritório de advocacia especializado em leilões de imóveis, 
              com mais de 15 anos de experiência no mercado imobiliário do Rio de Janeiro e São Paulo. 
              Nossa equipe de advogados especializados oferece assessoria completa em todas as etapas 
              do processo de aquisição de imóveis em leilão.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#265c54] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-medium text-[#191919]">15+</div>
                <div className="font-body text-sm text-[#333333]">Anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-[#265c54] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-medium text-[#191919]">500+</div>
                <div className="font-body text-sm text-[#333333]">Clientes atendidos</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-[#265c54] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-medium text-[#191919]">98%</div>
                <div className="font-body text-sm text-[#333333]">Taxa de sucesso</div>
              </div>
            </div>
            
            {/* Contato */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-body text-[#333333]">
                <MapPin className="h-5 w-5 text-[#d68e08]" />
                <span>Rio de Janeiro e São Paulo</span>
              </div>
              <div className="flex items-center gap-3 font-body text-[#333333]">
                <Phone className="h-5 w-5 text-[#d68e08]" />
                <span>(21) 3173-3795</span>
              </div>
              <div className="flex items-center gap-3 font-body text-[#333333]">
                <Mail className="h-5 w-5 text-[#d68e08]" />
                <span>contato@cataldosiston-adv.com.br</span>
              </div>
            </div>
          </div>
          
          {/* Card visual */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#d68e08] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-display font-medium">CS</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-[#191919]">Cataldo Siston</h3>
                  <p className="font-body text-[#333333]">Advocacia Imobiliária</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#265c54]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#265c54]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-[#333333]">Assessoria jurídica completa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#265c54]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#265c54]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-[#333333]">Análise de riscos do imóvel</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#265c54]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#265c54]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-body text-[#333333]">Acompanhamento pós-leilão</span>
                </div>
              </div>
              
              <Button 
                onClick={handleContact}
                className="w-full bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold py-3 h-auto"
              >
                Fale com um Especialista
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
