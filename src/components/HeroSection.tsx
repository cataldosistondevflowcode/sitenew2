import React from 'react';
import { ChevronRight, Play } from "lucide-react";

export const HeroSection = () => {
  return (
    <>
      {/* Primeira seção - Hero tradicional */}
      <section className="relative">
        <div 
          className="bg-cover bg-center bg-no-repeat h-[500px] relative"
          style={{
            backgroundImage: "url('/visao-panoramica-rio-janeiro.jpg')"
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Conteúdo */}
          <div className="relative z-10 container h-full flex items-center justify-center">
            <div className="max-w-[960px] px-4 flex items-start gap-8">
              <div className="flex-1 max-w-[512px]">
                <div className="mb-4">
                  <h1 className="text-white font-medium text-[44px] leading-[52.8px] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                    Imóveis em Leilão<br />
                    no Rio de Janeiro
                  </h1>
                </div>
                
                <div className="mb-4">
                  <p className="text-white font-bold text-xl leading-[30px]" style={{ fontFamily: "Quicksand, sans-serif" }}>
                    Receba oportunidades de leilões personalizadas, de<br />
                    acordo com o seu perfil.
                  </p>
                </div>
                
                <div className="flex flex-wrap">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#6d4403] via-[#b57309] to-[#d48d07] text-white rounded-full px-7 py-4 font-normal text-[19.8px] leading-[29.7px] hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "Quicksand, sans-serif" }}
                  >
                    Quero receber novas oportunidades
                    <ChevronRight className="ml-2 h-6 w-7" />
                  </a>
                </div>
              </div>
              
              {/* Espaço para balanceamento */}
              <div className="w-[383px] hidden lg:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Segunda seção - Vídeo e títulos das oportunidades */}
      <section className="relative -mt-20 pt-20">
        <div 
          className="bg-cover bg-center bg-no-repeat min-h-[506px] relative"
          style={{
            backgroundImage: "url('/fundo-marmore-1-webp.png')"
          }}
        >
          <div className="container relative z-10 py-12">
            <div className="max-w-[1170px] mx-auto px-4">
              {/* Player de vídeo */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-[560px] h-[315px] bg-black rounded-lg overflow-hidden">
                  {/* Iframe do YouTube */}
                  <iframe
                    src="https://www.youtube.com/embed/IssSNAzj4ag"
                    title="Como funciona nossa assessoria em leilões de imóveis"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                  
                  {/* Overlay com informações do canal (se necessário) */}
                  <div className="absolute bottom-0 left-0 bg-black/80 text-white px-3 py-2 rounded-tr-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Assistir no</span>
                      <svg className="w-16 h-4" viewBox="0 0 72 16" fill="white">
                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324Z" />
                        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="black"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Títulos das oportunidades */}
              <div className="max-w-[960px] mx-auto px-4">
                <div className="text-center">
                  {/* Título principal com ícones decorativos */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-4">
                      {/* Ícones decorativos à esquerda */}
                      <div className="hidden md:flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      
                      <h2 
                        className="text-[#191919] font-medium text-2xl leading-4 text-center whitespace-nowrap"
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
                    className="text-[#191919] font-medium text-[40px] leading-4 text-center whitespace-nowrap mb-12"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Imóveis até 50% abaixo da sua avaliação
                  </h3>
                  
                  {/* Texto explicativo */}
                  <div className="px-6">
                    <p 
                      className="text-[#191919] font-normal text-[17.6px] leading-[26.4px] text-center"
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
