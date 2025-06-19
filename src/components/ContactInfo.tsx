"use client";
import * as React from "react";

interface ContactInfoProps {
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-8 items-center my-auto text-lg leading-loose text-white max-md:max-w-full ${className}`}>
      <a
        href="mailto:contato@cataldosiston-adv.com.br"
        className="flex gap-1.5 self-stretch my-auto whitespace-nowrap bg-blend-normal bg-white bg-opacity-0 hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c93ec71e2af23d2082db4ec1605d977abac60dca?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Email icon"
          className="object-contain shrink-0 self-start w-6 aspect-square"
        />
        <span className="flex-auto">
          contato@cataldosiston-adv.com.br
        </span>
      </a>

      <a
        href="tel:+552131733795"
        className="flex gap-1.5 self-stretch my-auto bg-blend-normal bg-white bg-opacity-0 hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e5bfb31fc8fb52bad8166cd11c3f6f9929f388b?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Phone icon"
          className="object-contain shrink-0 self-start w-6 aspect-square"
        />
        <span className="basis-auto">
          +55 (21) 3173-3795
        </span>
      </a>

      <a
        href="#"
        className="flex gap-1 self-stretch p-1 text-base font-bold leading-loose rounded-md bg-blend-normal hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/946b50ec1a3156f3253a92d930ab884adb815692?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="WhatsApp icon"
          className="object-contain shrink-0 self-start bg-blend-normal aspect-square w-[21px]"
        />
        <span className="basis-auto">
          Fale Conosco
        </span>
      </a>
    </div>
  );
}; 