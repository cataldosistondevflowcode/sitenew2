import React, { useState } from 'react';

export const FeaturedVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 3; // Número de vídeos mostrados por vez
  
  const videos = [
    {
      id: "H9-LPE3gRFg",
      title: "Quais as vantagens de comprar imóveis em leilão?",
      description: "Existem muitas vantagens nos leilões de imóveis em relação a uma compra e venda comum. Veja alguns motivos que têm levado cada vez mais pessoas a optarem por essa modalidade."
    },
    {
      id: "yvQrGmdXDiU", 
      title: "É possível parcelar o valor da arrematação em leilões de imóveis?",
      description: "Tem dúvidas sobre como deve ser feito o pagamento do valor da arrematação em leilões de imóveis? Quer saber em quais casos é possível realizar o parcelamento?"
    },
    {
      id: "1keAvaimI5k",
      title: "Quem deve arcar com as dívidas de um imóvel arrematado em leilão?", 
      description: "Imóveis vão a leilão para saldar alguma dívida do antigo proprietário. No entanto, e se houver mais dívidas registradas no imóvel?"
    },
    {
      id: "9ZnMzYQJNck",
      title: "Arrematar um imóvel ocupado dá mais dor de cabeça?",
      description: "Muita gente pensa que comprar imóveis em leilão que estejam ocupados dá mais dor de cabeça do que arrematar um imóvel desocupado."
    },
    {
      id: "FQAUWbkwjT8",
      title: "Valor do ITBI em leilões de imóveis",
      description: "ITBI em leilões de imóveis é um assunto que gerou muita polêmica nos últimos anos, especialmente no Rio de Janeiro."
    },
    {
      id: "VVxUQtMC-xg", 
      title: "Leilões extrajudiciais: tudo que você precisa saber",
      description: "O que são leilões de imóveis extrajudiciais? Como eles devem ocorrer, para que não haja anulação da arrematação?"
    },
    {
      id: "Bps7pphdE_g",
      title: "5 fatores que podem levar à anulação da arrematação", 
      description: "Ao participar de leilões de imóveis, é importante estar sempre atento se todos os trâmites legais foram devidamente respeitados."
    }
  ];

  const totalPages = Math.ceil(videos.length / videosPerPage);
  
  const nextVideos = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };
  
  const prevVideos = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const getCurrentVideos = () => {
    const startIndex = currentIndex * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    return videos.slice(startIndex, endIndex);
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
                {getCurrentVideos().map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 rounded-t-lg"
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-900">{video.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{video.description}</p>
                      <div className="mt-4 text-sm text-[#d68e08] font-semibold">
                        Cataldo Siston Advogados
                      </div>
                    </div>
                  </div>
                ))}
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
