"use client";
import * as React from "react";
import { FAQItem } from "./FAQItem";

interface FAQData {
  question: string;
  answer: string;
  iconSrc: string;
}

export const FAQSection: React.FC = () => {
  const faqData: FAQData[] = [
    {
      question: "Como posso ter a posse do imóvel arrematado?",
      answer: "A posse do imóvel arrematado é obtida após a aprovação da arrematação pelo juiz e o cumprimento de todas as obrigações legais, incluindo o pagamento integral do valor e eventuais custas processuais.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "Como é feito o pagamento no leilão judicial?",
      answer: "O pagamento no leilão judicial é feito conforme estabelecido no edital, geralmente em até 10 dias após a arrematação, através de depósito judicial ou conforme determinado pelo juiz responsável.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "Dinheiro de leilão pode ser usado para quitar condomínio após arremate?",
      answer: "Sim, em alguns casos o valor arrecadado no leilão pode ser usado para quitar débitos condominiais, dependendo da decisão judicial e das especificações do processo de execução.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "Imóvel arrematado com hipoteca. O que fazer?",
      answer: "Quando um imóvel com hipoteca é arrematado, é necessário verificar se a hipoteca será extinta com o leilão ou se permanecerá sobre o bem. Recomenda-se assessoria jurídica especializada para análise do caso.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "Quem é responsável pelos débitos de IPTU do imóvel leiloado?",
      answer: "Os débitos de IPTU anteriores ao leilão podem ser de responsabilidade do arrematante, dependendo das condições do edital. É fundamental verificar essa informação antes de participar do leilão.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "É seguro arrematar imóveis em leilão?",
      answer: "Sim, é seguro quando feito com a devida assessoria jurídica especializada. É essencial realizar um estudo prévio de viabilidade jurídica (due diligence) antes de participar do leilão.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IuNEQ2hFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    },
    {
      question: "Qual é o valor utilizado como base de cálculo do ITBI?",
      answer: "O ITBI é calculado sobre o valor de arrematação do imóvel no leilão. Algumas jurisdições podem aplicar regras específicas, por isso é importante consultar a legislação local.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi/+Cjwvc3ZnPgo="
    },
    {
      question: "Vale a pena comprar imóvel em leilão?",
      answer: "Pode valer muito a pena, principalmente pela possibilidade de adquirir imóveis com desconto significativo. No entanto, é essencial contar com assessoria jurídica especializada para evitar riscos.",
      iconSrc: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAxMC41TDE1IDEzLjVMMjIuNSAxMC41IiBzdHJva2U9IiNENjhFMDgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
    }
  ];

  return (
    <section className="text-2xl text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="flex overflow-hidden relative flex-col justify-center items-center px-20 py-20 w-full min-h-[906px] max-md:px-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2dcb22ef4841f771ed9d27b482af771f0de40a?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Background"
          className="object-cover absolute inset-0 w-full h-full"
        />
        <div className="flex relative flex-col max-w-full w-[930px]">
          <h2 className="self-center text-4xl font-medium leading-tight text-center max-md:max-w-full">
            Dúvidas sobre leilões de imóveis
          </h2>

          <div className="mt-12 max-md:mt-10">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                iconSrc={faq.iconSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 