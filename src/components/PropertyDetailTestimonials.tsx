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
      name: "Frederico Brandão",
      role: "Investidor",
      content: "Eu sou do ramo desenvolvimento de projetos para galpões logísticos, atuando geralmente como o \"terreneiro\". No passado, meu pai comprava imóveis estressados em leilões de dívidas trabalhistas bastante arriscados e ele sempre gostou disso. Tivemos uma indicação em 2015 de um amigo para conhecer o Raphael e desde então começamos a arrematar, processo que correu bem com Dr. Raphael e Dra. Cristiane sempre atuando da melhor forma com relação ao interesse do cliente."
    },
    {
      id: 2,
      name: "Denise de Castilho Provenzano",
      role: "Arquiteta",
      content: "Como sou arquiteta, vinha planejando arrematar um imóvel em leilão para reformá-lo e vende-lo, como forma de investimento aliado à minha área de atuação. A grande questão para mim sempre foi diminuir os riscos neste tipo de aquisição, pois estórias de insucessos são muito comuns. Através da indicação de um amigo, fui apresentada ao escritório Cataldo Siston, e desde o primeiro contato fui muito bem atendida pela sócia Cristiane Dellassopa."
    },
    {
      id: 3,
      name: "Felipe Bueno",
      role: "Presidente da BX Capital",
      content: "Como cliente e parceiro de negócios do escritório Cataldo Siston há quase 10 anos tenho toda tranquilidade em referendar seus serviços, seu trabalho impecável e histórico de sucesso em todas as aquisições, investimentos e serviços a nós prestados. Além de ser um workaholic sempre comprometido nos mínimos detalhes, nos protegendo contra riscos e cumprindo estritamente todos os prazos."
    },
    {
      id: 4,
      name: "João Sampaio Vianna",
      role: "Empresário",
      content: "Conheci o escritório Cataldo Siston através de indicação e desde então tenho arrematado diversos imóveis com total segurança jurídica. O acompanhamento é excepcional, desde o estudo prévio até a regularização final da propriedade."
    },
    {
      id: 5,
      name: "Paulo André Marques",
      role: "Investidor Imobiliário",
      content: "A assessoria do escritório Cataldo Siston foi fundamental para o sucesso dos meus investimentos em leilões. Eles me orientaram em todas as etapas e me ajudaram a evitar armadilhas que poderiam comprometer meus negócios."
    },
    {
      id: 6,
      name: "Anderson Carneiro Pereira",
      role: "Corretor de Imóveis",
      content: "Como profissional do mercado imobiliário, posso afirmar que o trabalho do escritório Cataldo Siston é diferenciado. Eles oferecem segurança jurídica e acompanhamento completo em todas as arrematações."
    },
    {
      id: 7,
      name: "Carlos Uchoa",
      role: "Advogado",
      content: "Recomendo o escritório Cataldo Siston para quem busca investir em leilões de imóveis com segurança. O conhecimento técnico e a experiência da equipe fazem toda a diferença no resultado final."
    },
    {
      id: 8,
      name: "Rodrigo Portella",
      role: "Empresário",
      content: "Arrematei meu primeiro imóvel em leilão com a assessoria do escritório Cataldo Siston. O processo foi conduzido com total transparência e profissionalismo, superando minhas expectativas."
    },
    {
      id: 9,
      name: "Ana Maria Mendes",
      role: "Investidora",
      content: "A experiência de arrematar imóveis com o suporte do escritório Cataldo Siston tem sido excelente. Eles cuidam de todos os detalhes legais e me dão total tranquilidade para investir."
    }
  ];
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-12 bg-[#222]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#d68e08]">Depoimentos</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#333] p-6 rounded-lg shadow-md relative">
            <blockquote className="mb-4 text-white">
              "{testimonials[currentIndex].content}"
            </blockquote>
            <div className="flex items-center">
              <div>
                <p className="font-bold text-[#d68e08]">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-gray-400">{testimonials[currentIndex].role}</p>
              </div>
            </div>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full"
              onClick={prevTestimonial}
              aria-label="Depoimento anterior"
            >
              &lt;
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full"
              onClick={nextTestimonial}
              aria-label="Próximo depoimento"
            >
              &gt;
            </button>
          </div>
          
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${index === currentIndex ? 'bg-[#d68e08]' : 'bg-gray-500'}`}
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
