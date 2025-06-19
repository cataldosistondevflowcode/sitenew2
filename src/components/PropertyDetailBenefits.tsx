import React from 'react';

export const PropertyDetailBenefits = () => {
  return (
    <section className="py-12 bg-[#222]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#d68e08]">Benefícios dos leilões imobiliários</h2>
        
        <p className="text-lg text-center mb-8 text-white">
          A possibilidade de adquirir imóveis por preços fortemente descontados (até pela metade do seu valor) faz com que esse tipo de investimento imobiliário seja altamente vantajoso para quem deseja lucrar com a revenda ou locação, e também para aqueles que almejam comprar a casa própria ou melhorar o padrão residencial.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-[#333] text-white p-8 rounded-lg text-center">
            <h3 className="text-4xl text-[#d68e08] mb-6">1</h3>
            <h4 className="text-xl font-semibold mb-4">Alta rentabilidade na revenda ou locação</h4>
          </div>
          
          <div className="bg-[#333] text-white p-8 rounded-lg text-center">
            <h3 className="text-4xl text-[#d68e08] mb-6">2</h3>
            <h4 className="text-xl font-semibold mb-4">Compra da moradia por valor muito abaixo do mercado</h4>
          </div>
          
          <div className="bg-[#333] text-white p-8 rounded-lg text-center">
            <h3 className="text-4xl text-[#d68e08] mb-6">3</h3>
            <h4 className="text-xl font-semibold mb-4">Segurança jurídica do investimento, se bem assessorado</h4>
          </div>
        </div>
      </div>
    </section>
  );
};
