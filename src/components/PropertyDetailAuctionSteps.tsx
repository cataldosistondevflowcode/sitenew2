import React from 'react';

export const PropertyDetailAuctionSteps = () => {
  return (
    <section className="py-12 bg-[#191919]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#d68e08] text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">PRÉ-LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src="https://www.youtube.com/embed/_UvtOSXGFSg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="A importância do estudo prévio do processo em leilões de imóveis"
                className="w-full h-56 rounded"
              ></iframe>
            </div>
            <p className="text-center mt-4">
              Estudo de viabilidade jurídica do leilão imobiliário
            </p>
          </div>
          
          <div className="bg-[#333] text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">DIA DO LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src="https://www.youtube.com/embed/5AuJmevvCHA"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Como funciona nossa assessoria no dia do leilão?"
                className="w-full h-56 rounded"
              ></iframe>
            </div>
            <p className="text-center mt-4">
              Acompanhamento na realização dos lances e assinatura do Auto de Arrematação
            </p>
          </div>
          
          <div className="bg-[#d68e08] text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">PÓS-LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src="https://www.youtube.com/embed/uISCy7wT-G4"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Burocracia pós-leilão: o que fazer após arrematar um imóvel?"
                className="w-full h-56 rounded"
              ></iframe>
            </div>
            <p className="text-center mt-4">
              Desocupação do imóvel, regularização e registro do título de propriedade
            </p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#d68e08] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#b8780a] transition-colors"
          >
            SAIBA MAIS SOBRE A NOSSA ASSESSORIA EM LEILÕES
          </a>
        </div>
      </div>
    </section>
  );
};
