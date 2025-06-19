import React from 'react';

export const SuccessCases = () => {
  const cases = [
    {
      id: "hbt-4kFMD4Q",
      title: "Leilão de imóvel | Ipanema/RJ",
      description: "Caso real de imóvel em leilão em Ipanema, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    },
    {
      id: "IssSNAzj4ag",
      title: "Leilão de imóvel | Botafogo/RJ",
      description: "Caso real de imóvel em leilão em Botafogo, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    },
    {
      id: "H9-LPE3gRFg",
      title: "Leilão de imóvel | Fonte da Saudade/RJ", 
      description: "Caso real de imóvel em leilão na Fonte da Saudade assessorado pela equipe jurídica do escritório Cataldo Siston Advogados."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Casos de Sucesso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <div className="text-center mt-10">
          <a 
            href="#" 
            className="inline-block bg-[#d68e08] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors"
          >
            Veja os nossos resultados
          </a>
        </div>
      </div>
    </section>
  );
};
