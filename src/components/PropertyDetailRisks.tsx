import React from 'react';

export const PropertyDetailRisks = () => {
  return (
    <section className="py-12 bg-[#191919]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#d68e08]">Quais são os riscos de arrematar imóveis em leilão?</h2>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 text-white">
            Os riscos inerentes aos leilões imobiliários caracterizam-se pela eventual <strong>demora na finalização da arrematação</strong>, que se dará com a transferência da posse e da propriedade do imóvel, e pela <strong>posterior anulação do leilão realizado</strong>, que poderá ocorrer caso seja verificado algum vício no processo judicial ou no procedimento extrajudicial que levou o imóvel a leilão.
          </p>
        </div>
      </div>
    </section>
  );
};
