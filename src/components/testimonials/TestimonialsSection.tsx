"use client";

import { useState } from "react";
import { QuoteIcon } from "./QuoteIcon";
import { NavigationButton } from "./NavigationButton";
import { TestimonialCard } from "./TestimonialCard";

interface Testimonial {
  content: string[];
  authorName: string;
  authorTitle: string;
}

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      content: [
        "Como cliente e parceiro de negócios do escritório Cataldo Siston há quase 10 anos tenho toda",
        "tranquilidade em referenciar seus serviços, seu trabalho impecável e histórico de sucesso em",
        "todas as aquisições, investimentos e serviços a nós prestados. Além de ser um workaholic sempre",
        "comprometido nos mínimos detalhes, nos protegendo contra riscos e cumprindo estritamente",
        "todos os prazos.",
        "Estou à disposição de qualquer um que queira conversar a respeito da competência, qualidade,",
        "comprometimento e seriedade com que o Raphael e sua equipe prestam serviços na área",
        "imobiliária tendo como foco principal os leilões de imóveis."
      ],
      authorName: "Felipe Bueno",
      authorTitle: "PRESIDENTE DA BX CAPITAL"
    },
    {
      content: [
        "Como sou arquiteta, vinha planejando arrematar um imóvel em leilão para reformá-lo e vendê-lo,",
        "como forma de investimento aliado à minha área de atuação. A grande questão para mim",
        "sempre foi diminuir os riscos neste tipo de aquisição, pois estórias de insucesso são muito",
        "comuns.",
        "Através da indicação de um amigo, fui apresentada ao escritório Cataldo Siston, e desde o",
        "primeiro contato fui muito bem atendida pela sócia Cristiane Dellassopa, que fez toda a análise",
        "jurídica necessária para que eu pudesse arrematar com tranquilidade o imóvel que julgou mais",
        "interessante para meu objetivo.",
        "Em todas as fases, incluindo emissão da posse até o registro de imóveis, a eficiência e",
        "profissionalismo do escritório esteve presente. Agora aguardo a venda deste imóvel para entrar",
        "em nova empreitada com meus novos \"parceiros\"."
      ],
      authorName: "Denise de Castilho Provenzano",
      authorTitle: "ARQUITETA"
    },
    {
      content: [
        "Eu sou do ramo desenvolvimento de projetos para galpões logísticos, atuando geralmente como",
        "investidor. Na paixão por imóveis estava pai empresa imóveis estressados pai leilões. Muitos",
        "trabalhistas bastante arriscados e ele sempre gostou disso. Tivemos uma indicação em 2015 de",
        "um amigo para conhecer o Raphael e desde então começamos a arrematar, processo que correu",
        "bem com Dr. Raphael e Dra. Cristiane sempre atuando da melhor forma com atenção do interesse",
        "do cliente. Indiquei para um parceiro nosso que tem uma grande rede de farmácias, que",
        "também está extremamente satisfeito e vem expandindo seus negócios e arrematando novas",
        "lojas. Além disso, tenho Dr. Raphael como um grande amigo no âmbito pessoal."
      ],
      authorName: "Frederico Brandão",
      authorTitle: "INVESTIDOR"
    },
    {
      content: [
        "O contato inicial com o escritório foi por indicação para solução de uma demanda na área",
        "imobiliária. A partir daí, construímos uma relação de confiança, sustentada pela percepção de",
        "competência e experiência profissional demonstradas por seus advogados. Com essa relação",
        "fortalecida, depositamos cada vez mais credibilidade na advocacia do escritório e fomos além da",
        "contratação de serviços partindo para a aquisição de imóveis em leilões. Prestação de serviço",
        "com seriedade e presteza, num ambiente confortável e acolhedor."
      ],
      authorName: "Ana Maria Mendes",
      authorTitle: "INVESTIDORA"
    },
    {
      content: [
        "A procura por leilão de imóveis hoje é um atrativo para o tipo de aquisição, pois fica abaixo do",
        "preço de mercado, atualmente, os leilões são realizados presencialmente e online se podem ser",
        "acompanhados virtualmente após um cadastro na nossa site. A nossa atuação é voltada para",
        "leilões judiciais de imóveis e dispomos de excelente estrutura administrativa, escritório e auditório",
        "para transmissão dos leilões, ainda disponibilizamos transmissão instantânea. O objetivo da",
        "empresa é atender aos clientes que nos honram por escolherem nossos serviços profissionais,",
        "nos sentimos altamente gratificados. Além disso, é necessário que todo arrematante tenha uma",
        "assessoria e o Cataldo Siston oferece esse assessoramento de forma completa para uma",
        "arrematação segura e o bem é liberado rapidamente."
      ],
      authorName: "Rodrigo Portella",
      authorTitle: "LEILOEIRO PÚBLICO"
    },
    {
      content: [
        "Conheci o Raphael Siston através de um amigo, o seu tio Eduardo. Estava em busca de alguém",
        "competente para assessorar-me no seguimento de Leilão de Imóveis. No primeiro encontro fiquei",
        "impressionado com o vasto conhecimento sobre o tema que o jovem Siston demonstrou ter. Foi",
        "uma aula e posso dizer que aprendi muito que eu pude conhecer um pouco sobre as questões",
        "legais que envolve ainda contato com outro advogado que trabalha no mesmo setor, mas o Siston o supera e muito.",
        "Conversei, resolvi investir no ramo e fiz minha primeira arrematação em 2013, até hoje sou",
        "cliente bastante ativo. A assessoria jurídica prestada por eles no Átrio do Fórum, onde domina",
        "do momento exato de entrar no pregão do leilão é fundamental, total, tranquilizante. A sua equipe",
        "de assistentes, em especial a advogada Cristiane, é o que há de melhor nessa relação comercial,",
        "pois sempre dispostos a esclarecer nossas dúvidas.",
        "O vasto conhecimento jurídico que eles têm sobre o assunto, impressiona. A vontade de ganhar",
        "sempre estampadas em seus rostos nos passa uma tranquilidade impressionante. Li",
        "praticamente todos os meus processos e tiro o chapéu para o trabalho que desenvolvem. Pelo",
        "que sei nunca perderam um processo sequer, todos os meus receberam vencedor. Resultado 100% garantido.",
        "Recomendo, sem medo de errar, a assistência jurídica prestada pelo Cataldo Siston Advogados",
        "em leilões de um modo geral."
      ],
      authorName: "Paulo André Marques",
      authorTitle: "INVESTIDOR"
    },
    {
      content: [
        "Com sólido escritório de leilões, na seara judicial, podemos afirmar que a aquisição de bens",
        "(particularmente imóveis) em leilões sempre representou uma excelente oportunidade de",
        "investimento, uma vez que arrematações bem abaixo do valor de mercado constituem regra.",
        "De uns tempos para cá, o mercado de leilões - quase sempre exclusivamente voltado para",
        "investidores - foi abraçado também por pessoas interessadas em adquirir imóveis para uso",
        "próprio.",
        "Importante salientar que o interessado em adquirir um bem em leilão pode e deve se valer de",
        "assessoria jurídica até porque a exigência de documentos em tudo",
        "exemplificativamente carta de arrematação. É dentro dos escritórios atuantes nessa específica",
        "área, sento-nos à vontade de citar o Cataldo Siston Advogados, que sempre demonstrou lisura",
        "e competência quando atuou nos leilões conduzidos por nosso escritório de leilões."
      ],
      authorName: "Anderson Carneiro Pereira",
      authorTitle: "LEILOEIRO PÚBLICO"
    }
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Quicksand:wght@400&family=Inter:wght@400&display=swap"
      />
      <section className="flex justify-center items-center self-stretch px-4 pt-8 pb-8 bg-neutral-100 h-[900px] max-md:h-[800px] max-sm:h-[750px] relative mt-0">
        <img
          src="/assets/bg/fundo-marmore.png"
          alt="Fundo mármore"
          className="object-cover absolute inset-0 z-0 w-full h-full"
        />

        <div className="flex flex-col items-center flex-[1_0_0] z-[1] relative h-full">
          <div className="flex flex-col justify-center items-center self-stretch px-4 py-0 h-full">
            <div className="flex flex-col gap-2 justify-center items-center h-full max-w-[1038px] w-full">
              <h1 className="text-4xl font-medium leading-10 text-center text-black w-full max-md:text-3xl max-md:leading-8 max-sm:text-2xl max-sm:leading-7 mb-4">
                Depoimentos
              </h1>

              <div className="flex flex-col items-center w-full mb-4">
                <figure className="flex flex-col items-start">
                  <div className="flex items-start w-[100px]">
                    <QuoteIcon />
                  </div>
                </figure>
              </div>

              <div className="flex gap-6 justify-center items-center px-2.5 w-full flex-1 max-md:gap-4 max-md:px-2.5 max-sm:flex-col max-sm:gap-5 max-sm:px-1.5">
                <NavigationButton
                  direction="prev"
                  onClick={handlePrevClick}
                  className="shrink-0 max-sm:order-3"
                />

                <div className="flex-1 h-[620px] max-md:h-[550px] max-sm:h-[500px] flex items-center justify-center max-sm:order-1">
                  <TestimonialCard
                    content={currentTestimonial.content}
                    authorName={currentTestimonial.authorName}
                    authorTitle={currentTestimonial.authorTitle}
                  />
                </div>

                <NavigationButton
                  direction="next"
                  onClick={handleNextClick}
                  className="shrink-0 max-sm:order-2"
                />
              </div>
              
              {/* Indicators */}
              <div className="flex gap-2 justify-center items-center mt-6 max-sm:order-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-yellow-600' : 'bg-gray-400'
                    }`}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection; 