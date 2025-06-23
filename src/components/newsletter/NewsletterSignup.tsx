"use client";
import * as React from "react";
import { NewsletterForm } from "./NewsletterForm";

export const NewsletterSignup: React.FC = () => {
  return (
    <section 
      className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 md:py-14 max-w-full text-white bg-cover bg-center relative w-full"
      style={{backgroundImage: 'url(/assets/bg/mesa-cataldo.png)'}}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="flex flex-col max-w-full w-full max-w-5xl relative z-10 px-4">
        <header className="self-center text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-tight sm:leading-relaxed max-md:max-w-full">
          <h1>
            Inscreva-se para receber
            <br />
            oportunidades de leilões de imóveis
          </h1>
        </header>
        <NewsletterForm />
      </div>
    </section>
  );
}; 