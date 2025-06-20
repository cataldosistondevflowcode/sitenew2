"use client";
import * as React from "react";
import { NewsletterForm } from "./NewsletterForm";

export const NewsletterSignup: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center px-20 py-14 max-w-full text-white bg-neutral-700 w-full max-md:px-5">
      <div className="flex flex-col max-w-full w-[899px]">
        <header className="self-center text-5xl font-medium text-center leading-[53px] max-md:max-w-full max-md:text-4xl">
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