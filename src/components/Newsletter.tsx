import React from 'react';

export const Newsletter = () => {
  return (
    <section className="py-12 sm:py-16 bg-cover bg-center relative" style={{backgroundImage: 'url(/bg-newsletter.jpg.webp)'}}>
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="container relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">Receba nossa newsletter</h2>
              <p className="text-base sm:text-lg mb-6 sm:mb-8 text-center lg:text-left">Oportunidades de negócios, dicas sobre leilões, artigos e casos etc</p>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome*" 
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <input 
                  type="email" 
                  placeholder="Email*" 
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <input 
                  type="tel" 
                  placeholder="Telefone*" 
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <button 
                  type="submit" 
                  className="w-full px-6 sm:px-8 py-3 bg-[#d68e08] hover:bg-[#b8780a] text-white font-bold rounded-md transition-colors text-sm sm:text-base"
                >
                  ENVIAR
                </button>
              </form>
              <p className="text-xs sm:text-sm mt-4 text-gray-300 text-center lg:text-left">
                Prometemos não utilizar suas informações de contato para enviar qualquer tipo de SPAM
              </p>
              
              <div className="mt-8 sm:mt-12">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Podemos ajudar a solucionar o seu caso!</h3>
                <p className="text-base sm:text-lg mb-4 sm:mb-6 text-[#d68e08] text-center lg:text-left">Entre em contato conosco</p>
                <div className="flex justify-center lg:justify-start space-x-6 sm:space-x-8">
                  <a href="https://wa.me/5521977294848" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">WhatsApp</span>
                  </a>
                  <a href="mailto:contato@cataldosiston-adv.com.br" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Email</span>
                  </a>
                  <a href="tel:+552131733795" className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Telefone</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center order-first lg:order-last">
              <img 
                src="/foto-recortada-cataldo.png.webp" 
                alt="Advogado Cataldo" 
                className="max-w-full h-auto rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
