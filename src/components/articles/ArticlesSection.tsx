"use client";
import * as React from "react";
import { ArticleCard } from "./ArticleCard";
import { NavigationButton } from "./NavigationButton";

export function ArticlesSection() {
  const articles = [
    {
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/0254e4f12d5a287b68afcd06e1bafc097b7aaa85?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      title: "Imóveis em leilão costumam\nestar em péssimo estado de\nconservação?",
      description: "Muitos investidores e\ncompradores em potencial se\npreocupam com o estado de\nconservação dos imóveis em\nleilão. A ideia de que essas\npropriedades estão\ncompletamente deterioradas,\nexigindo reformas onerosas,…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e950cad0fb86d9a56163de76d08b71dc2644b797?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
    },
    {
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e145cdbcbb7a1330a02b8c6044727a198c0c874e?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      title: "O que você deve pagar, após\narrematar um imóvel em\nleilão?",
      description: "Quando você decide adquirir um\nimóvel em leilão, seja judicial ou\nextrajudicial, a arrematação é\napenas o primeiro passo para\ngarantir a sua propriedade. O\nvalor do lance é…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/8bab8ca5f1e7da663f03610d411a5858b3b5cf25?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
    },
    {
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/e77bd401e6076acfa28974b18bfc9a4af4cf8dbc?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a",
      title: "Saiba como ocorre a imissão\nna posse em leilões de\nimóveis",
      description: "A imissão na posse em leilões de\nimóveis, seja extrajudiciais ou\njudiciais, é algo que suscita\nmuitos questionamentos por\nparte dos licitantes ou\ninteressados em participar desta\nmodalidade de…",
      readMoreIconUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/571fe5f53b82099e9da6337b0802e635f055a695?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
    }
  ];

  const handlePreviousClick = () => {
    // Navigation logic would be implemented here
    console.log("Previous slide");
  };

  const handleNextClick = () => {
    // Navigation logic would be implemented here
    console.log("Next slide");
  };

  return (
    <section className="flex relative gap-4 justify-center items-start pt-10 pr-5 pb-12 pl-4 min-h-[430px]">
      <div className="flex absolute inset-0 z-0 self-start bg-gray-200 min-h-[787px] w-[1420px] max-md:max-w-full" />
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
                <div className="flex flex-wrap min-h-[527px]">
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={index}
                      imageUrl={article.imageUrl}
                      title={article.title}
                      description={article.description}
                      readMoreIconUrl={article.readMoreIconUrl}
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