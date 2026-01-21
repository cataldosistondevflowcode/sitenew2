import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export function AboutCompanySection() {
  const handleContact = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre imóveis em leilão.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="bg-[#f5f5f5] py-14 md:py-20 relative overflow-hidden">
      {/* Background decorativo - círculos como no site institucional */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ebe5de] rounded-full opacity-50 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#ebe5de] rounded-full opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-10 text-center">
          Sobre
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Foto do Advogado - com borda dourada */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Borda dourada decorativa */}
              <div className="absolute -bottom-4 -left-4 w-full h-full border-4 border-[#d68e08] rounded-sm"></div>
              <img 
                src="/foto-recortada-cataldo.png"
                alt="Raphael Cataldo Siston - Advogado especialista em leilões de imóveis"
                className="relative z-10 w-full max-w-[350px] rounded-sm shadow-lg"
                onError={(e) => {
                  // Fallback para imagem do site institucional
                  (e.target as HTMLImageElement).src = 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/Raphael-Cataldo-Siston-Advogado-especialista-em-leilao-de-imoveis-RJ-SP-1.png';
                }}
              />
            </div>
          </div>
          
          {/* Informações */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-medium text-[#191919] mb-4">
              Raphael Cataldo Siston
            </h3>
            
            <p className="font-body text-[#333333] mb-6 leading-relaxed text-base md:text-lg">
              Advogado especialista em leilões de imóveis, com mais de 19 anos de experiência 
              em arrematações imobiliárias. Pós-graduado em direito imobiliário e em direito 
              processual civil.
            </p>
            
            {/* Assinatura */}
            <div className="mb-6 h-16">
              <img 
                src="https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/assinatura-raphael-cataldo-siston.png"
                alt="Assinatura Raphael Cataldo Siston"
                className="h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            {/* OAB e Email */}
            <div className="space-y-2 mb-8">
              <p className="font-body font-semibold text-[#191919]">
                OAB/RJ nº 153.146
              </p>
              <a 
                href="mailto:raphael@cataldosiston-adv.com.br"
                className="font-body text-[#d68e08] hover:underline block"
              >
                raphael@cataldosiston-adv.com.br
              </a>
            </div>
            
            {/* Card de Contato do Escritório */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h4 className="font-display text-lg font-medium text-[#191919] mb-4">
                Cataldo Siston Advogados
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 font-body text-[#333333]">
                  <MapPin className="h-5 w-5 text-[#d68e08] mt-0.5 flex-shrink-0" />
                  <span>
                    Av. Rio Branco, 156, Gr. 3336 a 3339<br />
                    Centro - Rio de Janeiro - RJ - Brasil
                  </span>
                </div>
                <div className="flex items-center gap-3 font-body text-[#333333]">
                  <Phone className="h-5 w-5 text-[#d68e08]" />
                  <a href="tel:+552131733795" className="hover:text-[#d68e08]">
                    +55 (21) 3173-3795
                  </a>
                </div>
                <div className="flex items-center gap-3 font-body text-[#333333]">
                  <Mail className="h-5 w-5 text-[#d68e08]" />
                  <a href="mailto:contato@cataldosiston-adv.com.br" className="hover:text-[#d68e08]">
                    contato@cataldosiston-adv.com.br
                  </a>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleContact}
                  className="flex-1 bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold"
                >
                  Fale com um Especialista
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="flex-1 border-[#191919] text-[#191919] hover:bg-[#191919] hover:text-white font-body"
                >
                  <a 
                    href="https://leilaodeimoveis-cataldosiston.com/escritorio-imobiliario/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Conheça o Escritório
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
