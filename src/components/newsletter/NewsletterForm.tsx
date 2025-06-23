"use client";
import * as React from "react";
import { InputField } from "./InputField";

export const NewsletterForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-5 whitespace-nowrap max-md:max-w-full">
      <InputField
        label="Nome"
        required
        className="min-w-0"
      />

      <div className="grow shrink-0 basis-0 w-fit max-md:max-w-full">
        <div className="flex gap-5 justify-between max-w-full text-base leading-none w-[298px]">
          <label>Email*</label>
          <label>Telefone*</label>
        </div>

        <div className="flex flex-wrap gap-3.5 items-start mt-2.5 text-xl font-bold leading-none text-center max-md:max-w-full">
          <input
            type="email"
            required
            className="h-10 rounded-md border border-yellow-600 border-solid w-[214px] px-3 bg-transparent text-white placeholder-gray-300"
          />
          <input
            type="tel"
            required
            className="h-10 rounded-md border border-yellow-600 border-solid w-[214px] px-3 bg-transparent text-white placeholder-gray-300"
          />
          <button
            type="submit"
            className="px-16 py-3 bg-yellow-600 rounded-md max-md:px-5 text-white font-bold hover:bg-yellow-700 transition-colors"
          >
            ENVIAR
          </button>
        </div>
      </div>
    </form>
  );
}; 