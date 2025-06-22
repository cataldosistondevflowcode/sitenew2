"use client";
import React from 'react';
import { SectionHeading } from './SectionHeading';
import { BenefitCard } from './BenefitCard';
import { VideoCard } from './VideoCard';
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

      <section className="flex gap-9 justify-center mb-9 w-full max-w-[930px] max-md:flex-col max-md:gap-8 max-md:items-center">
        <VideoCard
          phase="PRÉ-LEILÃO"
          videoTitle="A importância do e…"
          description="Estudo de viabilidade jurídica\ndo leilão imobiliário"
          playButtonSvg='<svg width="69" height="49" viewBox="0 0 69 49" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-button" style="width: 68px; height: 48px; position: absolute; left: 110px; top: 57px"> <path d="M67.02 7.82008C66.24 4.89008 64.53 2.41008 61.6 1.63008C56.29 0.210078 34.5 0.0800781 34.5 0.0800781C34.5 0.0800781 12.71 0.210078 7.4 1.63008C4.47 2.41008 2.77 4.89008 1.98 7.82008C0.56 13.1301 0.5 24.0801 0.5 24.0801C0.5 24.0801 0.56 35.0301 1.98 40.3401C2.76 43.2701 4.47 45.7501 7.4 46.5301C12.71 47.9501 34.5 48.0801 34.5 48.0801C34.5 48.0801 56.29 47.9501 61.6 46.5301C64.53 45.7501 66.24 43.2701 67.02 40.3401C68.44 35.0301 68.5 24.0801 68.5 24.0801C68.5 24.0801 68.44 13.1301 67.02 7.82008Z" fill="#FF0033"></path> <path d="M45.5 24.0801L27.5 14.0801V34.0801" fill="white"></path> </svg>'
          menuIconSvg='<svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon" style="width: 36px; height: 36px"> <path d="M17 13.5801C18.1 13.5801 19 12.6801 19 11.5801C19 10.4801 18.1 9.58008 17 9.58008C15.9 9.58008 15 10.4801 15 11.5801C15 12.6801 15.9 13.5801 17 13.5801ZM17 15.5801C15.9 15.5801 15 16.4801 15 17.5801C15 18.6801 15.9 19.5801 17 19.5801C18.1 19.5801 19 18.6801 19 17.5801C19 16.4801 18.1 15.5801 17 15.5801ZM17 21.5801C15.9 21.5801 15 22.4801 15 23.5801C15 24.6801 15.9 25.5801 17 25.5801C18.1 25.5801 19 24.6801 19 23.5801C19 22.4801 18.1 21.5801 17 21.5801Z" fill="white"></path> </svg>'
        />

        <VideoCard
          phase="DIA DO LEILÃO"
          videoTitle="Como funciona no…"
          description="Acompanhamento na\nrealização dos lances e\nassinatura do Auto de\nArrematação"
          playButtonSvg='<svg width="69" height="49" viewBox="0 0 69 49" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-button" style="width: 68px; height: 48px; position: absolute; left: 110px; top: 57px"> <path d="M66.75 7.82008C65.97 4.89008 64.26 2.41008 61.33 1.63008C56.02 0.210078 34.23 0.0800781 34.23 0.0800781C34.23 0.0800781 12.44 0.210078 7.12998 1.63008C4.19998 2.41008 2.49998 4.89008 1.70998 7.82008C0.289981 13.1301 0.22998 24.0801 0.22998 24.0801C0.22998 24.0801 0.289981 35.0301 1.70998 40.3401C2.48998 43.2701 4.19998 45.7501 7.12998 46.5301C12.44 47.9501 34.23 48.0801 34.23 48.0801C34.23 48.0801 56.02 47.9501 61.33 46.5301C64.26 45.7501 65.97 43.2701 66.75 40.3401C68.17 35.0301 68.23 24.0801 68.23 24.0801C68.23 24.0801 68.17 13.1301 66.75 7.82008Z" fill="#FF0033"></path> <path d="M45.23 24.0801L27.23 14.0801V34.0801" fill="white"></path> </svg>'
          menuIconSvg='<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon" style="width: 36px; height: 36px"> <path d="M17.73 13.5801C18.83 13.5801 19.73 12.6801 19.73 11.5801C19.73 10.4801 18.83 9.58008 17.73 9.58008C16.63 9.58008 15.73 10.4801 15.73 11.5801C15.73 12.6801 16.63 13.5801 17.73 13.5801ZM17.73 15.5801C16.63 15.5801 15.73 16.4801 15.73 17.5801C15.73 18.6801 16.63 19.5801 17.73 19.5801C18.83 19.5801 19.73 18.6801 19.73 17.5801C19.73 16.4801 18.83 15.5801 17.73 15.5801ZM17.73 21.5801C16.63 21.5801 15.73 22.4801 15.73 23.5801C15.73 24.6801 16.63 25.5801 17.73 25.5801C18.83 25.5801 19.73 24.6801 19.73 23.5801C19.73 22.4801 18.83 21.5801 17.73 21.5801Z" fill="white"></path> </svg>'
        />

        <VideoCard
          phase="VENCENDO O LEILÃO"
          videoTitle="Burocracia pós-leil…"
          description="Desocupação do imóvel,\nregularização e registro do\ntítulo de propriedade"
          playButtonSvg='<svg width="69" height="49" viewBox="0 0 69 49" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-button" style="width: 68px; height: 48px; position: absolute; left: 110px; top: 57px"> <path d="M67.49 7.82008C66.71 4.89008 65 2.41008 62.07 1.63008C56.76 0.210078 34.97 0.0800781 34.97 0.0800781C34.97 0.0800781 13.18 0.210078 7.86997 1.63008C4.93997 2.41008 3.23997 4.89008 2.44997 7.82008C1.02997 13.1301 0.969971 24.0801 0.969971 24.0801C0.969971 24.0801 1.02997 35.0301 2.44997 40.3401C3.22997 43.2701 4.93997 45.7501 7.86997 46.5301C13.18 47.9501 34.97 48.0801 34.97 48.0801C34.97 48.0801 56.76 47.9501 62.07 46.5301C65 45.7501 66.71 43.2701 67.49 40.3401C68.91 35.0301 68.97 24.0801 68.97 24.0801C68.97 24.0801 68.91 13.1301 67.49 7.82008Z" fill="#FF0033"></path> <path d="M45.97 24.0801L27.97 14.0801V34.0801" fill="white"></path> </svg>'
          menuIconSvg='<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-icon" style="width: 36px; height: 36px"> <path d="M17.47 13.5801C18.57 13.5801 19.47 12.6801 19.47 11.5801C19.47 10.4801 18.57 9.58008 17.47 9.58008C16.37 9.58008 15.47 10.4801 15.47 11.5801C15.47 12.6801 16.37 13.5801 17.47 13.5801ZM17.47 15.5801C16.37 15.5801 15.47 16.4801 15.47 17.5801C15.47 18.6801 16.37 19.5801 17.47 19.5801C18.57 19.5801 19.47 18.6801 19.47 17.5801C19.47 16.4801 18.57 15.5801 17.47 15.5801ZM17.47 21.5801C16.37 21.5801 15.47 22.4801 15.47 23.5801C15.47 24.6801 16.37 25.5801 17.47 25.5801C18.57 25.5801 19.47 24.6801 19.47 23.5801C19.47 22.4801 18.57 21.5801 17.47 21.5801Z" fill="white"></path> </svg>'
        />
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