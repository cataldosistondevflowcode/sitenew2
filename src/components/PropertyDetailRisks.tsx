import React from 'react';

export const PropertyDetailRisks = () => {
  return (
    <section className="py-12 bg-[#191919]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#d68e08]">
          Quais são os riscos de arrematar imóveis em leilão?
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-lg text-white leading-relaxed">
            Os riscos inerentes aos leilões imobiliários caracterizam-se principalmente por dois aspectos fundamentais:
          </p>
          
          <div className="space-y-4">
            <div className="bg-[#2a2a2a] p-6 rounded-lg border-l-4 border-[#d68e08]">
              <h3 className="text-xl font-semibold text-[#d68e08] mb-3">
                1. Demora na finalização da arrematação
              </h3>
              <p className="text-lg text-white leading-relaxed">
                A eventual demora que pode ocorrer na finalização da arrematação, que se dará somente com a transferência da posse e da propriedade do imóvel.
              </p>
            </div>
            
            <div className="bg-[#2a2a2a] p-6 rounded-lg border-l-4 border-[#d68e08]">
              <h3 className="text-xl font-semibold text-[#d68e08] mb-3">
                2. Posterior anulação do leilão
              </h3>
              <p className="text-lg text-white leading-relaxed">
                A possibilidade de posterior anulação do leilão realizado, que poderá ocorrer caso seja verificado algum vício no processo judicial ou no procedimento extrajudicial que levou o imóvel a leilão.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-[#1a1a1a] rounded-lg border border-[#d68e08]">
            <p className="text-lg text-white text-center leading-relaxed">
              <strong className="text-[#d68e08]">Importante:</strong> Com a assessoria jurídica adequada, estes riscos podem ser minimizados através de uma análise prévia detalhada do processo e do imóvel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
