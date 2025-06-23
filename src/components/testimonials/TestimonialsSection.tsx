"use client";

import { QuoteIcon } from "./QuoteIcon";
import { NavigationButton } from "./NavigationButton";
import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => {
  const testimonialContent = [
    "Na Ipanema Investimentos adotamos o modelo: faça o melhor, com o melhor, sempre focando na",
    "segurança e rentabilidade.",
    "Na área de Direito Imobiliário o escritório Cataldo Siston é o melhor.",
    "Sempre nos entregou excelentes resultados."
  ];

  const handlePrevClick = () => {
    // Navigation logic would be implemented here
    console.log("Previous testimonial");
  };

  const handleNextClick = () => {
    // Navigation logic would be implemented here
    console.log("Next testimonial");
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Quicksand:wght@400&family=Inter:wght@400&display=swap"
      />
      <section className="flex justify-center items-center self-stretch p-4 bg-neutral-100 min-h-[630px] max-md:p-4 max-md:min-h-[550px] max-sm:p-2.5 max-sm:min-h-[500px] relative">
        <img
          src="/assets/bg/fundo-marmore.png"
          alt="Fundo mármore"
          className="object-cover absolute inset-0 z-0 w-full h-full"
        />

        <div className="flex flex-col items-center flex-[1_0_0] z-[1] relative">
          <div className="flex flex-col justify-center items-center self-stretch px-4 py-0">
            <div className="flex flex-col gap-2 justify-center items-center">
              <h1 className="text-4xl font-medium leading-10 text-center text-black w-[930px] max-md:w-full max-md:text-3xl max-md:leading-8 max-md:max-w-[700px] max-sm:text-2xl max-sm:leading-7">
                Depoimentos
              </h1>

              <div className="flex flex-col items-center w-[930px] max-md:w-full max-md:max-w-[700px]">
                <figure className="flex flex-col items-start max-w-[930px]">
                  <div className="flex items-start max-w-[930px] w-[100px]">
                    <QuoteIcon />
                  </div>
                </figure>
              </div>

              <div className="flex gap-6 justify-center items-center px-2.5 py-8 w-[1038px] max-md:gap-4 max-md:px-2.5 max-md:py-6 max-md:w-full max-md:max-w-[800px] max-sm:flex-col max-sm:gap-5 max-sm:px-1.5 max-sm:py-5">
                <NavigationButton
                  direction="prev"
                  onClick={handlePrevClick}
                  className="shrink-0"
                />

                <TestimonialCard
                  content={testimonialContent}
                  authorName="João Sampaio Vianna"
                  authorTitle="PRESIDENTE DA IPANEMA INVESTIMENTOS"
                />

                <NavigationButton
                  direction="next"
                  onClick={handleNextClick}
                  className="shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection; 