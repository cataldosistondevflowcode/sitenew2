import React, { useState } from 'react';

export const FeaturedVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 3; // Número de vídeos mostrados por vez
  
  const videos = [
    {
      title: "Quais as vantagens de comprar imóveis em leilão?",
      description: "Existem muitas vantagens nos leilões de imóveis em relação a uma compra e venda comum. Veja alguns motivos que têm levado cada vez mais pessoas a optarem por essa modalidade.",
      url: "https://leilaodeimoveis-cataldosiston.com/vantagens-de-comprarimoveis-em-leilao/",
      youtubeId: "H9-LPE3gRFg"
    },
    {
      title: "É possível parcelar o valor da arrematação em leilões de imóveis?",
      description: "Tem dúvidas sobre como deve ser feito o pagamento do valor da arrematação em leilões de imóveis? Quer saber em quais casos é possível realizar o parcelamento? Veja o vídeo que nós preparamos sobre esse assunto.",
      url: "https://leilaodeimoveis-cataldosiston.com/e-possivel-parcelar-o-valorda-arrematacao-em-leiloes-de-imoveis/",
      youtubeId: "yvQrGmdXDiU"
    },
    {
      title: "Quem deve arcar com as dívidas de um imóvel arrematado em leilão?",
      description: "Imóveis vão a leilão para saldar alguma dívida do antigo proprietário. No entanto, e se houver mais dívidas registradas no imóvel, que não possam ser quitadas apenas com o valor da arrematação? Quem precisa arcar o restante? O arrematante ou o executado?",
      url: "https://leilaodeimoveis-cataldosiston.com/quem-deve-arcar-com-asdividas-de-um-imovel-arrematado-em-leilao/",
      youtubeId: "1keAvaimI5k"
    },
    {
      title: "Arrematar um imóvel ocupado dá mais dor de cabeça?",
      description: "Muita gente pensa que comprar imóveis em leilão que estejam ocupados dá mais dor de cabeça do que arrematar um imóvel desocupado. No entanto, será que isso faz mesmo diferença? Descubra agora!",
      url: "https://leilaodeimoveis-cataldosiston.com/arrematar-um-imovelocupado-da-mais-dor-de-cabeca/",
      youtubeId: "9ZnMzYQJNck"
    },
    {
      title: "Como é calculado o ITBI em leilões de imóveis?",
      description: "Como é calculado o ITBI em leilões de imóveis e mais baixo?",
      url: "https://leilaodeimoveis-cataldosiston.com/como-e-calculado-o-itbiem-leiloes-de-imoveis/",
      youtubeId: "FQAUWbkwjT8"
    },
    {
      title: "Leilões extrajudiciais: tudo que você deve saber",
      description: "Tudo que você deve saber sobre leilões de bancos",
      url: "https://leilaodeimoveis-cataldosiston.com/leiloes-extrajudiciais-tudoque-voce-deve-saber/",
      youtubeId: "VVxUQtMC-xg"
    },
    {
      title: "Entrevista do advogado Raphael Cataldo Siston sobre leilões de imóveis",
      description: "Confira a entrevista do advogado Raphael Cataldo Siston sobre leilões de imóveis",
      url: "https://leilaodeimoveis-cataldosiston.com/entrevista-raphael-cataldosiston-leiloes-de-imoveis/"
    },
    {
      title: "O que fazer após a arrematação de um imóvel em leilão?",
      description: "O que fazer após a arrematação de um imóvel em leilão?",
      url: "https://leilaodeimoveis-cataldosiston.com/o-que-fazer-apos-aarrematacao-de-um-imovel-em-leilao/",
      youtubeId: "uISCy7wT-G4"
    },
    {
      title: "Posso perder o imóvel que arrematei em leilão?",
      description: "Posso perder o imóvel que arrematei em leilão?",
      url: "https://leilaodeimoveis-cataldosiston.com/posso-perder-o-imovel-quearrematei-em-leilao/"
    },
    {
      title: "Como funciona a nossa assessoria em leilões de imóveis",
      description: "Como funciona a nossa assessoria em leilões de imóveis",
      url: "https://leilaodeimoveis-cataldosiston.com/como-funciona-a-nossaassessoria-em-leiloes-de-imoveis/",
      youtubeId: "G8Wp2ju3CaU"
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
          <div className="flex items-center justify-center">
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

            {/* Container dos vídeos */}
            <div className="flex-1 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          
          {/* Indicadores de página - apenas mostrados se houver mais de uma página */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
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
