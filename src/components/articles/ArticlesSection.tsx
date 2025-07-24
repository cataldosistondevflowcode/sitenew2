"use client";
import * as React from "react";
import { ArticleCard } from "./ArticleCard";
import { NavigationButton } from "./NavigationButton";

export function ArticlesSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const articles = [
    {
      imageUrl: "https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/08/como-ocorre-a-imissao-na-posse-leiloes-de-imoveis-blog-escritorio-cataldo-siston.webp",
      title: "Saiba como ocorre a imissão na posse em leilões de imóveis",
      description: "A imissão na posse em leilões de imóveis, seja extrajudiciais ou judiciais, é algo que suscita muitos questionamentos por parte dos licitantes ou interessados em participar desta modalidade de…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e950cad0fb86d9a56163de76d08b71dc2644b797?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      link: "https://leilaodeimoveis-cataldosiston.com/como-ocorre-a-imissao-na-posse-em-leiloes-de-imoveis/"
    },
    {
      imageUrl: "https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/08/impugnacao-a-arrematacao-quando-pode-ocorrer-blog-escritorio-cataldo-siston.webp",
      title: "Impugnação à arrematação do imóvel: quando pode ocorrer?",
      description: "Um dos maiores receios de quem participa de leilões de imóveis, ou daqueles que têm interesse em participar, é chegar ao final de todo o processo e ocorrer algo…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/8bab8ca5f1e7da663f03610d411a5858b3b5cf25?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      link: "https://leilaodeimoveis-cataldosiston.com/impugnacao-a-arrematacao-em-leiloes-de-imoveis/"
    },
    {
      imageUrl: "https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/03/entrevista-casa-jardim-como-funcionam-leiloes-de-imoveis.png",
      title: "Leilão de imóveis: como funciona e dicas para participar",
      description: "O Raphael Siston, sócio do escritório Cataldo Siston, deu uma entrevista para a Casa & Jardim falando como funcionam os leilões de imóveis e de que forma é possível…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/571fe5f53b82099e9da6337b0802e635f055a695?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      link: "https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-como-funciona-e-dicas-para-participar/"
    },
    {
      imageUrl: "https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2025/02/imoveis-em-leilao-costumam-estar-em-pessimo-estado-de-conservacao-blog-cataldo-siston-advogados.jpg",
      title: "Imóveis em leilão costumam estar em péssimo estado de conservação?",
      description: "Muitos investidores e compradores em potencial se preocupam com o estado de conservação dos imóveis em leilão. A ideia de que essas propriedades estão completamente deterioradas, exigindo reformas onerosas,…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e950cad0fb86d9a56163de76d08b71dc2644b797?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      link: "https://leilaodeimoveis-cataldosiston.com/imoveis-em-leilao-costumam-estar-em-pessimo-estado-de-conservacao/"
    },
    {
      imageUrl: "https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/11/custos-apos-a-arrematacao-blog-cataldo-siston-advogados.jpg",
      title: "O que você deve pagar, após arrematar um imóvel em leilão?",
      description: "Quando você decide adquirir um imóvel em leilão, seja judicial ou extrajudicial, a arrematação é apenas o primeiro passo para garantir a sua propriedade. O valor do lance é…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/8bab8ca5f1e7da663f03610d411a5858b3b5cf25?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      link: "https://leilaodeimoveis-cataldosiston.com/o-que-voce-deve-pagar-apos-arrematar-um-imovel-em-leilao/"
    }
  ];

  const handlePreviousClick = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Hook para detectar se é mobile
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Função para determinar quais artigos exibir
  const getVisibleArticles = () => {
    const articlesToShow = isMobile ? 1 : 3;
    
    const visibleArticles = [];
    for (let i = 0; i < articlesToShow; i++) {
      const index = (currentIndex + i) % articles.length;
      visibleArticles.push(articles[index]);
    }
    return visibleArticles;
  };

  const visibleArticles = getVisibleArticles();

  return (
    <section className="flex relative gap-4 justify-center items-start pt-10 pr-5 pb-0 pl-4 min-h-[430px]">
      <div className="flex absolute inset-0 z-0 self-start bg-gray-200 w-full h-full" />
      <div className="flex z-0 flex-col flex-1 shrink items-center my-auto basis-0 min-w-60 max-md:max-w-full">
        <div className="px-4 max-w-full w-[960px]">
          <div className="w-full max-md:max-w-full">
            <header className="flex flex-col items-center w-full text-4xl font-medium leading-tight text-center text-black max-md:max-w-full">
              <div className="flex flex-col py-4 pr-px pl-2.5 max-w-full w-[802px]">
                <h2 className="max-md:max-w-full">
                  Confira entrevistas e artigos do advogado Raphael
                </h2>
                <div className="self-center mt-2 max-md:max-w-full">
                  Cataldo Siston sobre leilão de imóveis
                </div>
              </div>
            </header>
            <div className="flex relative flex-col items-start px-16 mt-2 w-full max-md:px-5 max-md:max-w-full">
              <div className="overflow-hidden z-0 self-stretch pb-16 w-full max-md:max-w-full">
                <div className="flex flex-wrap justify-center min-h-[527px]">
                  {visibleArticles.map((article, index) => (
                    <ArticleCard
                      key={`${currentIndex}-${index}`}
                      imageUrl={article.imageUrl}
                      title={article.title}
                      description={article.description}
                      readMoreIconUrl={article.readMoreIconUrl}
                      link={article.link}
                    />
                  ))}
                </div>
              </div>
              <NavigationButton
                iconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/a65b5aaab2a0afc03529b63a0c554d839d705705?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
                direction="previous"
                onClick={handlePreviousClick}
              />
              <NavigationButton
                iconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/2088bc86f37e92fa8fd473cd08e0b624e148cd04?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
                direction="next"
                onClick={handleNextClick}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection; 