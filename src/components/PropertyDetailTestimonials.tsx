import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
}

export const PropertyDetailTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Felipe Bueno",
      role: "Presidente da BX Capital",
      content: "Como cliente e parceiro de negócios do escritório Cataldo Siston há quase 10 anos tenho toda tranquilidade em referenciar seus serviços, seu trabalho impecável e histórico de sucesso em todas as aquisições, investimentos e serviços a nós prestados. Além de ser um workaholic sempre comprometido nos mínimos detalhes, nos protegendo contra riscos e cumprindo estritamente todos os prazos. Estou à disposição de qualquer um que queira conversar a respeito da competência, qualidade, comprometimento e seriedade com que o Raphael e sua equipe prestam serviços na área imobiliária tendo como foco principal os leilões de imóveis."
    },
    {
      id: 2,
      name: "Denise de Castilho Provenzano",
      role: "Arquiteta",
      content: "Como sou arquiteta, vinha planejando arrematar um imóvel em leilão para reformá-lo e vendê-lo, como forma de investimento aliado à minha área de atuação. A grande questão para mim sempre foi diminuir os riscos neste tipo de aquisição, pois estórias de insucesso são muito comuns. Através da indicação de um amigo, fui apresentada ao escritório Cataldo Siston, e desde o primeiro contato fui muito bem atendida pela sócia Cristiane Dellassopa, que fez toda a análise jurídica necessária para que eu pudesse arrematar com tranquilidade o imóvel que julgou mais interessante para meu objetivo. Em todas as fases, incluindo emissão da posse até o registro de imóveis, a eficiência e profissionalismo do escritório esteve presente. Agora aguardo a venda deste imóvel para entrar em nova empreitada com meus novos \"parceiros\"."
    },
    {
      id: 3,
      name: "Frederico Brandão",
      role: "Investidor",
      content: "Eu sou do ramo desenvolvimento de projetos para galpões logísticos, atuando geralmente como investidor. Na paixão por imóveis estava pai empresa imóveis estressados pai leilões. Muitos trabalhistas bastante arriscados e ele sempre gostou disso. Tivemos uma indicação em 2015 de um amigo para conhecer o Raphael e desde então começamos a arrematar, processo que correu bem com Dr. Raphael e Dra. Cristiane sempre atuando da melhor forma com atenção do interesse do cliente. Indiquei para um parceiro nosso que tem uma grande rede de farmácias, que também está extremamente satisfeito e vem expandindo seus negócios e arrematando novas lojas. Além disso, tenho Dr. Raphael como um grande amigo no âmbito pessoal."
    },
    {
      id: 4,
      name: "Ana Maria Mendes",
      role: "Investidora",
      content: "O contato inicial com o escritório foi por indicação para solução de uma demanda na área imobiliária. A partir daí, construímos uma relação de confiança, sustentada pela percepção de competência e experiência profissional demonstradas por seus advogados. Com essa relação fortalecida, depositamos cada vez mais credibilidade na advocacia do escritório e fomos além da contratação de serviços partindo para a aquisição de imóveis em leilões. Prestação de serviço com seriedade e presteza, num ambiente confortável e acolhedor."
    },
    {
      id: 5,
      name: "Rodrigo Portella",
      role: "Leiloeiro Público",
      content: "A procura por leilão de imóveis hoje é um atrativo para o tipo de aquisição, pois fica abaixo do preço de mercado, atualmente, os leilões são realizados presencialmente e online se podem ser acompanhados virtualmente após um cadastro na nossa site. A nossa atuação é voltada para leilões judiciais de imóveis e dispomos de excelente estrutura administrativa, escritório e auditório para transmissão dos leilões, ainda disponibilizamos transmissão instantânea. O objetivo da empresa é atender aos clientes que nos honram por escolherem nossos serviços profissionais, nos sentimos altamente gratificados. Além disso, é necessário que todo arrematante tenha uma assessoria e o Cataldo Siston oferece esse assessoramento de forma completa para uma arrematação segura e o bem é liberado rapidamente."
    },
    {
      id: 6,
      name: "Paulo André Marques",
      role: "Investidor",
      content: "Conheci o Raphael Siston através de um amigo, o seu tio Eduardo. Estava em busca de alguém competente para assessorar-me no seguimento de Leilão de Imóveis. No primeiro encontro fiquei impressionado com o vasto conhecimento sobre o tema que o jovem Siston demonstrou ter. Foi uma aula e posso dizer que aprendi muito que eu pude conhecer um pouco sobre as questões legais que envolve ainda contato com outro advogado que trabalha no mesmo setor, mas o Siston o supera e muito. Conversei, resolvi investir no ramo e fiz minha primeira arrematação em 2013, até hoje sou cliente bastante ativo. A assessoria jurídica prestada por eles no Átrio do Fórum, onde domina do momento exato de entrar no pregão do leilão é fundamental, total, tranquilizante. A sua equipe de assistentes, em especial a advogada Cristiane, é o que há de melhor nessa relação comercial, pois sempre dispostos a esclarecer nossas dúvidas. O vasto conhecimento jurídico que eles têm sobre o assunto, impressiona. A vontade de ganhar sempre estampadas em seus rostos nos passa uma tranquilidade impressionante. Li praticamente todos os meus processos e tiro o chapéu para o trabalho que desenvolvem. Pelo que sei nunca perderam um processo sequer, todos os meus receberam vencedor. Resultado 100% garantido. Recomendo, sem medo de errar, a assistência jurídica prestada pelo Cataldo Siston Advogados em leilões de um modo geral."
    },
    {
      id: 7,
      name: "Anderson Carneiro Pereira",
      role: "Leiloeiro Público",
      content: "Com sólido escritório de leilões, na seara judicial, podemos afirmar que a aquisição de bens (particularmente imóveis) em leilões sempre representou uma excelente oportunidade de investimento, uma vez que arrematações bem abaixo do valor de mercado constituem regra. De uns tempos para cá, o mercado de leilões - quase sempre exclusivamente voltado para investidores - foi abraçado também por pessoas interessadas em adquirir imóveis para uso próprio. Importante salientar que o interessado em adquirir um bem em leilão pode e deve se valer de assessoria jurídica até porque a exigência de documentos em tudo exemplificativamente carta de arrematação. É dentro dos escritórios atuantes nessa específica área, sento-nos à vontade de citar o Cataldo Siston Advogados, que sempre demonstrou lisura e competência quando atuou nos leilões conduzidos por nosso escritório de leilões."
    }
  ];
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-12 bg-[#222] h-[650px] max-md:h-[600px] max-sm:h-[550px] flex items-center">
      <div className="container mx-auto px-4 h-full">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d68e08]">Depoimentos</h2>
        
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="bg-[#333] p-6 rounded-lg shadow-md relative flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-4 mb-6">
              <blockquote className="text-white text-base leading-5 max-md:text-sm max-md:leading-4">
              "{testimonials[currentIndex].content}"
            </blockquote>
            </div>
            
            <div className="flex items-center">
              <div>
                <p className="font-bold text-[#d68e08] text-base">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-gray-400">{testimonials[currentIndex].role}</p>
              </div>
            </div>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
              onClick={prevTestimonial}
              aria-label="Depoimento anterior"
            >
              &lt;
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
              onClick={nextTestimonial}
              aria-label="Próximo depoimento"
            >
              &gt;
            </button>
          </div>
          
          <div className="flex justify-center mt-4 flex-shrink-0">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 mx-1 rounded-full transition-colors ${index === currentIndex ? 'bg-[#d68e08]' : 'bg-gray-500'}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
