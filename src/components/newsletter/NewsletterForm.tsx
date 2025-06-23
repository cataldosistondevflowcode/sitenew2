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
    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto">
      {/* Layout para mobile: todos os campos em coluna */}
      <div className="block lg:hidden space-y-4">
        <InputField
          label="Nome"
          required
          className="w-full"
        />
        <InputField
          label="Email"
          type="email"
          required
          className="w-full"
        />
        <InputField
          label="Telefone"
          type="tel"
          required
          className="w-full"
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-yellow-600 rounded-md text-white font-bold hover:bg-yellow-700 transition-colors text-base sm:text-lg"
        >
          ENVIAR
        </button>
      </div>

      {/* Layout para desktop: layout horizontal otimizado */}
      <div className="hidden lg:block">
        <div className="flex flex-wrap gap-4 items-end">
          <InputField
            label="Nome"
            required
            className="flex-1 min-w-[200px]"
          />
          <InputField
            label="Email"
            type="email"
            required
            className="flex-1 min-w-[250px]"
          />
          <InputField
            label="Telefone"
            type="tel"
            required
            className="flex-1 min-w-[200px]"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-yellow-600 rounded-md text-white font-bold hover:bg-yellow-700 transition-colors text-lg min-w-[120px] h-[40px] flex items-center justify-center"
          >
            ENVIAR
          </button>
        </div>
      </div>
    </form>
  );
}; 