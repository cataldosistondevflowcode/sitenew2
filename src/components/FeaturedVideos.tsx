import React, { useState } from 'react';

export const FeaturedVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 3; // Número de vídeos mostrados por vez
  
  const videos = [
    {
      title: "Quais as vantagens de comprar imóveis em leilão?",
      description: "Existem muitas vantagens nos leilões de imóveis em relação a uma compra e venda comum. Veja alguns motivos que têm levado cada vez mais pessoas a optarem por essa modalidade.",
      url: "https://www.youtube.com/watch?v=hbt-4kFMD4Q&embeds_referring_euri=https%3A%2F%2Fleilaodeimoveis-cataldosiston.com%2F&source_ve_path=Mjg2NjY",
      youtubeId: "hbt-4kFMD4Q"
    },
    {
      title: "É possível parcelar o valor da arrematação em leilões de imóveis?",
      description: "Tem dúvidas sobre como deve ser feito o pagamento do valor da arrematação em leilões de imóveis? Quer saber em quais casos é possível realizar o parcelamento? Veja o vídeo que nós preparamos sobre esse assunto.",
      url: "https://www.youtube.com/watch?time_continue=1&v=yvQrGmdXDiU&embeds_referring_euri=https%3A%2F%2Fleilaodeimoveis-cataldosiston.com%2F&source_ve_path=Mjg2NjY",
      youtubeId: "yvQrGmdXDiU"
    },
    {
      title: "Quem deve arcar com as dívidas de um imóvel arrematado em leilão?",
      description: "Imóveis vão a leilão para saldar alguma dívida do antigo proprietário. No entanto, e se houver mais dívidas registradas no imóvel, que não possam ser quitadas apenas com o valor da arrematação? Quem precisa arcar o restante? O arrematante ou o executado?",
      url: "https://www.youtube.com/watch?v=1keAvaimI5k&embeds_referring_euri=https%3A%2F%2Fleilaodeimoveis-cataldosiston.com%2F&source_ve_path=Mjg2NjY",
      youtubeId: "1keAvaimI5k"
    },
    {
      title: "Arrematar um imóvel ocupado dá mais dor de cabeça?",
      description: "Muita gente pensa que comprar imóveis em leilão que estejam ocupados dá mais dor de cabeça do que arrematar um imóvel desocupado. No entanto, será que isso faz mesmo diferença? Descubra agora!",
      url: "https://www.youtube.com/watch?v=9ZnMzYQJNck&embeds_referring_euri=https%3A%2F%2Fleilaodeimoveis-cataldosiston.com%2F&source_ve_path=Mjg2NjY",
      youtubeId: "9ZnMzYQJNck"
    },
    {
      title: "Como é calculado o ITBI em leilões de imóveis?",
      description: "Como é calculado o ITBI em leilões de imóveis e mais baixo?",
      url: "https://www.youtube.com/watch?v=FQAUWbkwjT8",
      youtubeId: "FQAUWbkwjT8"
    },
    {
      title: "Tudo que você precisa saber sobre leilões extrajudiciais",
      description: "Tudo que você deve saber sobre leilões de bancos",
      url: "https://www.youtube.com/watch?v=VVxUQtMC-xg",
      youtubeId: "VVxUQtMC-xg"
    },
    {
      title: "Imissão na posse em leilões de imóveis",
      description: "Basta ler o edital? O arrematante sempre precisa lidar com as dívidas do imóvel? É sempre possível parcelar o valor da arrematação? Neste vídeo, vamos desmentir alguns mitos comuns sobre leilões de imóveis!",
      url: "https://www.youtube.com/watch?v=Bps7pphdE_g",
      youtubeId: "Bps7pphdE_g"
    },
    {
      title: "3 mitos sobre leilões de imóveis",
      description: "Basta ler o edital? O arrematante sempre precisa lidar com as dívidas do imóvel? É sempre possível parcelar o valor da arrematação? Neste vídeo, vamos desmentir alguns mitos comuns sobre leilões de imóveis!",
      url: "https://www.youtube.com/watch?v=a4yQKEDt7hc",
      youtubeId: "a4yQKEDt7hc"
    },
    {
      title: "5 fatores que podem levar à anulação da arrematação",
      description: "Ao participar de leilões de imóveis, é importante estar sempre atento se todos os trâmites legais foram devidamente respeitados.",
      url: "https://www.youtube.com/watch?v=Bps7pphdE_g",
      youtubeId: "Bps7pphdE_g"
    },
    {
      title: "Carta de arrematação e auto de arrematação",
      description: "O auto de arrematação e a carta de arrematação são dois importantes documentos dos leilões de imóveis judiciais, que devem ser obtidos após a arrematação. O que eles são? Qual a importância deles para os processos burocráticos pós-leilão? Qual a diferença entre eles? Descubra agora!",
      url: "https://www.youtube.com/watch?v=xGUunlbUAx0",
      youtubeId: "xGUunlbUAx0"
    }
  ];

  const paddingNeeded = (videosPerPage - (videos.length % videosPerPage)) % videosPerPage;
  const displayVideos = paddingNeeded ? [...videos, ...videos.slice(0, paddingNeeded)] : videos;
  const totalPages = Math.ceil(displayVideos.length / videosPerPage);
  
  const nextVideos = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };
  
  const prevVideos = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const getCurrentVideos = () => {
    const startIndex = currentIndex * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    return displayVideos.slice(startIndex, endIndex);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Vídeos em destaque</h2>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Container principal com flex para botões laterais */}
          {/* Layout Desktop com botões laterais */}
          <div className="hidden md:flex items-center justify-center">
            {/* Botão anterior - lateral esquerda */}
            {totalPages > 1 && (
              <button 
                className="mr-6 bg-[#d68e08] hover:bg-[#b8780a] text-white p-3 rounded-full transition-all duration-200 flex-shrink-0"
                onClick={prevVideos}
                aria-label="Vídeos anteriores"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Container dos vídeos - Desktop */}
            <div className="flex-1 max-w-6xl">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {getCurrentVideos().map((video, idx) => {
                  const ytId = (video as any).youtubeId || (video as any).id;
                  const thumbnail = ytId
                    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                    : "/imagem-padrao.webp";
                  const href = video.url || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined);
                  return (
                    <div key={`${video.title}-${idx}`} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                      <div className="relative aspect-w-16 aspect-h-9 bg-black">
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <img src={thumbnail} alt={video.title} className="w-full h-64 object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-black shadow-md">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.5 5.5l8 4.5-8 4.5v-9z" /></svg>
                              </span>
                            </span>
                          </a>
                        ) : (
                          <img src={thumbnail} alt={video.title} className="w-full h-64 object-cover" />
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-3 text-gray-900">{video.title}</h3>
                      {video.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{video.description}</p>
                      )}
                      <div className="mt-4 text-sm text-[#d68e08] font-semibold">
                        Cataldo Siston Advogados
                      </div>
                      {null}
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Botão próximo - lateral direita */}
            {totalPages > 1 && (
              <button 
                className="ml-6 bg-[#d68e08] hover:bg-[#b8780a] text-white p-3 rounded-full transition-all duration-200 flex-shrink-0"
                onClick={nextVideos}
                aria-label="Próximos vídeos"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Layout Mobile com scroll horizontal */}
          <div className="md:hidden">
            <div className="relative">
              {/* Indicador de scroll */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>Deslize para ver mais</span>
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
                  {videos.map((video, idx) => {
                    const ytId = (video as any).youtubeId || (video as any).id;
                    const thumbnail = ytId
                      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                      : "/imagem-padrao.webp";
                    const href = video.url || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined);
                    return (
                      <div key={`mobile-${video.title}-${idx}`} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-80 flex-shrink-0">
                        <div className="relative aspect-w-16 aspect-h-9 bg-black">
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                              <img src={thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-black shadow-md">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.5 5.5l8 4.5-8 4.5v-9z" /></svg>
                                </span>
                              </span>
                            </a>
                          ) : (
                            <img src={thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold mb-3 text-gray-900">{video.title}</h3>
                          {video.description && (
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{video.description}</p>
                          )}
                          <div className="mt-4 text-sm text-[#d68e08] font-semibold">
                            Cataldo Siston Advogados
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Gradientes indicadores nas laterais para mobile */}
              <div className="absolute top-16 left-0 w-4 h-64 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
              <div className="absolute top-16 right-0 w-4 h-64 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
          
          {/* Indicadores de página - apenas mostrados no desktop se houver mais de uma página */}
          {totalPages > 1 && (
            <div className="hidden md:flex justify-center mt-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-[#d68e08]' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir para página ${index + 1} de vídeos`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
