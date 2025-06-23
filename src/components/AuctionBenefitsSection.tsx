"use client";
import React from 'react';
import { SectionHeading } from './SectionHeading';
import { BenefitCard } from './BenefitCard';
import { CallToActionButton } from './CallToActionButton';

export const AuctionBenefitsSection: React.FC = () => {
  return (
    <main className="flex relative flex-col items-center p-8 mx-auto my-0 w-full bg-neutral-50 max-w-[1920px] max-md:px-5 max-md:py-6 max-md:max-w-[991px] max-sm:px-4 max-sm:py-4 max-sm:max-w-screen-sm">
      <div className="w-full h-[68px]" />

      <SectionHeading>
        <span>
          <span>Benefícios dos</span>
          <br />
          <span>leilões imobiliários</span>
        </span>
      </SectionHeading>

      <section className="flex flex-wrap items-start mb-px w-full max-w-[930px] max-md:max-w-full max-sm:flex-col">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          A possibilidade de adquirir imóveis por preços fortemente descontados (
        </p>
        <span className="flex justify-center items-center">
          <strong className="text-lg font-bold leading-7 text-yellow-600 max-sm:text-base max-sm:leading-6">
            até pela metade do seu valor
          </strong>
        </span>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          ) faz com
        </p>
      </section>

      <section className="flex flex-wrap items-start mb-px w-full max-w-[930px] max-md:max-w-full max-sm:flex-col">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          que esse tipo de
        </p>
        <span className="flex justify-center items-center">
          <strong className="text-lg font-bold leading-7 text-yellow-600 max-sm:text-base max-sm:leading-6">
            investimento imobiliário
          </strong>
        </span>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          seja altamente vantajoso para quem deseja lucrar com a revenda ou
        </p>
      </section>

      <p className="mb-10 w-full text-lg leading-7 max-w-[930px] text-zinc-900 max-md:max-w-full max-sm:text-base max-sm:leading-6">
        locação, e também para aqueles que almejam comprar a casa própria ou melhorar o padrão residencial.
      </p>

      <section className="flex gap-9 justify-center mb-8 w-full max-w-[930px] max-md:flex-col max-md:gap-5 max-md:items-center">
        <BenefitCard
          number="1"
          title="Alta rentabilidade na revenda\nou locação"
        />
        <BenefitCard
          number="2"
          title="Compra da moradia por valor\nmuito abaixo do mercado"
          hasGradient={true}
        />
        <BenefitCard
          number="3"
          title="Segurança jurídica do\ninvestimento, se bem\nassessorado"
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

      <section className="flex flex-wrap items-start mb-px w-full max-w-[930px] max-md:max-w-full max-sm:flex-col">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          Os riscos inerentes aos leilões imobiliários caracterizam-se pela eventual
        </p>
        <div className="flex flex-col">
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            demora na ﬁnalização da
          </strong>
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            arrematação
          </strong>
        </div>
      </section>

      <section className="flex flex-wrap items-start mb-px w-full max-w-[930px] max-md:max-w-full max-sm:flex-col">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          , que se dará com a transferência da posse e da propriedade do imóvel, e pela
        </p>
        <div className="flex flex-col">
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            posterior anulação
          </strong>
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            do leilão realizado
          </strong>
        </div>
      </section>

      <p className="mb-px w-full text-lg leading-7 max-w-[930px] text-zinc-900 max-md:max-w-full max-sm:text-base max-sm:leading-6">
        , que poderá ocorrer caso seja veriﬁcado algum vício no processo judicial ou no procedimento
      </p>

      <p className="mb-10 w-full text-lg leading-7 max-w-[930px] text-zinc-900 max-md:max-w-full max-sm:text-base max-sm:leading-6">
        extrajudicial que levou o imóvel a leilão.
      </p>

      <div className="w-full h-[50px]" />

      <SectionHeading>
        <span>
          <span>Como arrematar imóveis em</span>
          <br />
          <span>leilão com segurança?</span>
        </span>
      </SectionHeading>

      <section className="flex flex-col gap-px mb-10 w-full max-w-[930px] max-md:max-w-full">
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          <span>Os</span>
          <strong className="font-bold"> leilões de imóveis</strong>
          <span> possuem procedimentos deﬁnidos em lei. Portanto, é extremamente importante destacar</span>
        </p>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          <span>que</span>
          <strong className="font-bold"> o principal fator de sucesso desse investimento é jurídico</strong>
          <span>, motivo pelo qual somente um</span>
        </p>
        <div className="flex flex-col">
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            escritório de
          </strong>
          <strong className="text-lg font-bold leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
            advocacia extremamente especializado e experiente
          </strong>
        </div>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          na área consegue prover a necessária segurança jurídica
        </p>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          <span>e ﬁnanceira de toda a operação, que inicia com o</span>
          <strong className="font-bold"> estudo prévio de viabilidade jurídica</strong>
          <span> (due diligence) e só</span>
        </p>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          <span>termina com a</span>
          <strong className="font-bold"> entrega da posse e da propriedade do imóvel ao arrematante</strong>
          <span>, de forma livre e</span>
        </p>
        <p className="text-lg leading-7 text-zinc-900 max-sm:text-base max-sm:leading-6">
          desembaraçada de débitos.
        </p>
      </section>

      <div className="w-full h-[50px]" />

      {/* Seção de vídeos do YouTube com os links movidos do PropertyDetailAuctionSteps */}
      <section className="w-full max-w-[930px]">
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