import React from 'react';

export const SuccessCases = () => {
  const cases = [
    {
      id: "nXMiKXmjEOs",
      title: "Leilão de imóvel | Ipanema/RJ",
      description: "Caso real de imóvel em leilão em Ipanema, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    },
    {
      id: "AH_sNBsqIMg",
      title: "Leilão de imóvel | Botafogo/RJ",
      description: "Caso real de imóvel em leilão em Botafogo, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    },
    {
      id: "9vziuX_9kxA",
      title: "Leilão de imóvel | Fonte da Saudade/RJ", 
      description: "Caso real de imóvel em leilão na Fonte da Saudade assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 max-md:mb-0">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Casos de Sucesso</h2>
        
        {/* Layout Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {cases.map((case_item) => (
            <div key={case_item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${case_item.id}`}
                  title={case_item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-48 rounded-t-lg"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">{case_item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{case_item.description}</p>
                <div className="mt-4 text-sm text-[#d68e08] font-semibold">
                  Cataldo Siston Advogados
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layout Mobile com scroll horizontal */}
        <div className="md:hidden relative">
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
              {cases.map((case_item) => (
                <div key={`mobile-${case_item.id}`} className="bg-white rounded-lg shadow-lg overflow-hidden w-80 flex-shrink-0">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${case_item.id}`}
                      title={case_item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-48 rounded-t-lg"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">{case_item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{case_item.description}</p>
                    <div className="mt-4 text-sm text-[#d68e08] font-semibold">
                      Cataldo Siston Advogados
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradiente indicador nas laterais para mobile */}
          <div className="absolute top-16 left-0 w-4 h-64 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute top-16 right-0 w-4 h-64 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
        <div className="text-center mt-10">
          <a 
            href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#d68e08] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors"
          >
            Veja os nossos resultados
          </a>
        </div>
      </div>
    </section>
  );
};
