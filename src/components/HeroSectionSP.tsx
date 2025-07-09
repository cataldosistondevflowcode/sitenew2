import React from 'react';
import { ChevronRight, Play } from "lucide-react";

interface HeroSectionSPProps {
  onOpportunityClick?: () => void;
}

export const HeroSectionSP = ({ onOpportunityClick }: HeroSectionSPProps) => {
  return (
    <>
      {/* Primeira seção - Hero tradicional */}
      <section className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
        {/* Imagem de fundo com filtro */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/ponte-estaiada-octavio-frias-sao-paulo.jpg')",
            filter: "grayscale(100%)"
          }}
        ></div>
        
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Conteúdo */}
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
            <div className="max-w-[960px] w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              <div className="flex-1 max-w-[512px] text-center lg:text-left lg:ml-[100px]">
                <div className="mb-4 sm:mb-6">
                  <h1 
                    className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight lg:leading-[52.8px] mb-4" 
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Imóveis em Leilão<br className="hidden sm:block" />
                    em São Paulo
                  </h1>
                </div>
                
                <div className="mb-6 sm:mb-8">
                  <p 
                    className="text-white font-bold text-base sm:text-lg md:text-xl leading-relaxed" 
                    style={{ fontFamily: "Quicksand, sans-serif" }}
                  >
                    Receba oportunidades de leilões personalizadas,<br className="hidden sm:block" />
                    de acordo com o seu perfil.
                  </p>
                </div>
                
                <div className="flex justify-center lg:justify-start">
                  <button
                    onClick={onOpportunityClick}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#6d4403] via-[#b57309] to-[#d48d07] text-white rounded-full px-4 sm:px-6 md:px-7 py-3 sm:py-4 font-normal text-sm sm:text-base md:text-[19.8px] leading-relaxed hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ fontFamily: "Quicksand, sans-serif" }}
                  >
                    <span className="text-center">Quero receber novas oportunidades</span>
                    <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-7 flex-shrink-0" />
                  </button>
                </div>
              </div>
              
              {/* Espaço para balanceamento - apenas em desktop */}
              <div className="w-[383px] hidden xl:block"></div>
            </div>
          </div>
      </section>

      {/* Segunda seção - Vídeo e títulos das oportunidades */}
      <section className="relative -mt-16 sm:-mt-20 pt-16 sm:pt-20">
        <div 
          className="bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[450px] md:min-h-[506px] relative"
          style={{
            backgroundImage: "url('/fundo-marmore-1-webp.png')"
          }}
        >
          <div className="container mx-auto relative z-10 py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-[1170px] mx-auto">
              {/* Player de vídeo */}
              <div className="mb-6 sm:mb-8 flex justify-center">
                <div className="relative w-full max-w-[560px] aspect-video bg-black rounded-lg overflow-hidden">
                  {/* Iframe do YouTube */}
                  <iframe
                    src="https://www.youtube.com/embed/H9-LPE3gRFg"
                    title="Como funciona nossa assessoria em leilões de imóveis"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                  
                  {/* Overlay com informações do canal */}
                  <div className="absolute bottom-0 left-0 bg-black/80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-tr-md">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm">Assistir no</span>
                      <svg className="w-12 sm:w-16 h-3 sm:h-4" viewBox="0 0 72 16" fill="white">
                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324Z" />
                        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="black"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Títulos das oportunidades */}
              <div className="max-w-[960px] mx-auto">
                <div className="text-center">
                  {/* Título principal com ícones decorativos */}
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {/* Ícones decorativos à esquerda */}
                      <div className="hidden md:flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      
                      <h2 
                        className="text-[#191919] font-medium text-lg sm:text-xl md:text-2xl text-center px-4"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        OPORTUNIDADES DE IMÓVEIS EM LEILÃO
                      </h2>
                      
                      {/* Ícones decorativos à direita */}
                      <div className="hidden md:flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtítulo */}
                  <h3 
                    className="text-[#191919] font-medium text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center mb-8 sm:mb-10 md:mb-12 px-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Imóveis até 50% abaixo da sua avaliação
                  </h3>
                  
                  {/* Texto explicativo */}
                  <div className="px-4 sm:px-6">
                    <p 
                      className="text-[#191919] font-normal text-sm sm:text-base md:text-[17.6px] leading-relaxed text-center max-w-4xl mx-auto"
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia. 
                      Entenda como funciona o nosso{" "}
                      <span className="font-bold">estudo de viabilidade jurídica</span>{" "}
                      clicando{" "}
                      <a href="#" className="text-[#d48d07] font-bold hover:underline">
                        aqui
                      </a>{" "}
                      ou entre em contato conosco
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}; 