"use client";
import React from 'react';
import { SectionHeading } from './SectionHeading';
import { BenefitCard } from './BenefitCard';
import { CallToActionButton } from './CallToActionButton';

export const AuctionBenefitsSection: React.FC = () => {
  return (
    <main 
      className="flex relative flex-col items-center p-8 w-full min-h-screen max-md:px-5 max-md:py-6 max-sm:px-4 max-sm:py-4"
      style={{
        backgroundImage: 'url(/assets/bg/fundo-marmore.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100vw',
        marginLeft: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      <div className="w-full h-[68px]" />

      <SectionHeading>
        <span>
          <span>Benefícios dos</span>
          <br />
          <span>leilões imobiliários</span>
        </span>
      </SectionHeading>

      <div className="mb-10 w-full max-w-[930px] max-md:max-w-full">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6 text-center">
          A possibilidade de adquirir imóveis por preços fortemente descontados (<strong className="text-yellow-600">até pela metade do seu valor</strong>) faz com que esse tipo de <strong className="text-yellow-600">investimento imobiliário</strong> seja altamente vantajoso para quem deseja lucrar com a revenda ou locação, e também para aqueles que almejam comprar a casa própria ou melhorar o padrão residencial.
        </p>
      </div>

      <section className="flex gap-9 justify-center mb-8 w-full max-w-[930px] max-md:flex-col max-md:gap-5 max-md:items-center">
        <BenefitCard
          number="1"
          title="Alta rentabilidade na revenda ou locação"
        />
        <BenefitCard
          number="2"
          title="Compra da moradia por valor muito abaixo do mercado"
          hasGradient={true}
        />
        <BenefitCard
          number="3"
          title="Segurança jurídica do investimento, se bem assessorado"
        />
      </section>

      <div className="w-full h-[50px]" />

      <SectionHeading>
        <span>
          <span>Quais são os riscos de</span>
          <br />
          <span>arrematar imóveis em leilão?</span>
        </span>
      </SectionHeading>

      <div className="mb-10 w-full max-w-[930px] max-md:max-w-full">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6 text-center">
          Os riscos inerentes aos leilões imobiliários caracterizam-se pela eventual <strong>demora na finalização da arrematação</strong>, que se dará com a transferência da posse e da propriedade do imóvel, e pela <strong>posterior anulação do leilão realizado</strong>, que poderá ocorrer caso seja verificado algum vício no processo judicial ou no procedimento extrajudicial que levou o imóvel a leilão.
        </p>
      </div>

      <div className="w-full h-[50px]" />

      <SectionHeading>
        <span>
          <span>Como arrematar imóveis em</span>
          <br />
          <span>leilão com segurança?</span>
        </span>
      </SectionHeading>

      <div className="mb-10 w-full max-w-[930px] max-md:max-w-full">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6 text-center">
          Os <strong>leilões de imóveis</strong> possuem procedimentos definidos em lei. Portanto, é extremamente importante destacar que <strong>o principal fator de sucesso desse investimento é jurídico</strong>, motivo pelo qual somente um <strong>escritório de advocacia extremamente especializado e experiente</strong> na área consegue prover a necessária segurança jurídica e financeira de toda a operação, que inicia com o <strong>estudo prévio de viabilidade jurídica</strong> (due diligence) e só termina com a <strong>entrega da posse e da propriedade do imóvel ao arrematante</strong>, de forma livre e desembaraçada de débitos.
        </p>
      </div>

      <div className="w-full h-[50px]" />

      {/* Seção de vídeos do YouTube com os links movidos do PropertyDetailAuctionSteps */}
      <section className="w-full max-w-[930px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#d68e08] text-white p-4 rounded-lg max-h-[320px] flex flex-col">
            <h3 className="text-xl font-bold mb-3 text-center">PRÉ-LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-3 flex-grow">
              <iframe
                src="https://www.youtube.com/embed/_UvtOSXGFSg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="A importância do estudo prévio do processo em leilões de imóveis"
                className="w-full h-40 rounded"
              ></iframe>
            </div>
            <p className="text-center text-sm mt-auto leading-snug">
              Estudo de viabilidade jurídica do leilão imobiliário
            </p>
          </div>
          
          <div className="bg-[#333] text-white p-4 rounded-lg max-h-[320px] flex flex-col">
            <h3 className="text-xl font-bold mb-3 text-center">DIA DO LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-3 flex-grow">
              <iframe
                src="https://www.youtube.com/embed/5AuJmevvCHA"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Como funciona nossa assessoria no dia do leilão?"
                className="w-full h-40 rounded"
              ></iframe>
            </div>
            <p className="text-center text-sm mt-auto leading-snug">
              Acompanhamento na realização dos lances e assinatura do Auto de Arrematação
            </p>
          </div>
          
          <div className="bg-[#d68e08] text-white p-4 rounded-lg max-h-[320px] flex flex-col">
            <h3 className="text-xl font-bold mb-3 text-center">PÓS-LEILÃO</h3>
            <div className="aspect-w-16 aspect-h-9 mb-3 flex-grow">
              <iframe
                src="https://www.youtube.com/embed/uISCy7wT-G4"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Burocracia pós-leilão: o que fazer após arrematar um imóvel?"
                className="w-full h-40 rounded"
              ></iframe>
            </div>
            <p className="text-center text-sm mt-auto leading-snug">
              Desocupação do imóvel, regularização e registro do título de propriedade
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-[35px]" />

      <CallToActionButton
        text="SAIBA MAIS SOBRE A NOSSA ASSESSORIA EM LEILÕES"
        onClick={() => {
          // Handle click action here
          console.log('CTA button clicked');
        }}
      />

      <div className="w-full h-[35px]" />
    </main>
  );
};

export default AuctionBenefitsSection; 