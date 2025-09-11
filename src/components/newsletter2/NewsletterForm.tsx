"use client";
import * as React from "react";
import { InputField } from "./InputField";
// import { useAnalytics } from "@/hooks/useAnalytics";

export const NewsletterForm: React.FC = () => {
  const nameRefMobile = React.useRef<HTMLInputElement>(null);
  const emailRefMobile = React.useRef<HTMLInputElement>(null);
  const phoneRefMobile = React.useRef<HTMLInputElement>(null);
  
  const nameRefDesktop = React.useRef<HTMLInputElement>(null);
  const emailRefDesktop = React.useRef<HTMLInputElement>(null);
  const phoneRefDesktop = React.useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<string>("");
  
  // Analytics tracking removido para evitar duplicidade com RD Station

  const handleSubmit = async (e: React.FormEvent, isMobile: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Seleciona as refs corretas baseado no layout
      const nameRef = isMobile ? nameRefMobile : nameRefDesktop;
      const emailRef = isMobile ? emailRefMobile : emailRefDesktop;
      const phoneRef = isMobile ? phoneRefMobile : phoneRefDesktop;

      const name = nameRef.current?.value || "";
      const email = emailRef.current?.value || "";
      const phone = phoneRef.current?.value || "";

      // Validação básica
      if (!name || !email || !phone) {
        setSubmitMessage("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      // NOTA: API direta removida para evitar duplicidade
      // Este componente não deve enviar dados para RD Station diretamente
      // O RD Station será gerenciado pelos componentes que usam shortcode3
      
      // Simula sucesso apenas para feedback visual
      setSubmitMessage("Obrigado! Sua inscrição foi realizada com sucesso!");
      
      // NOTA: Analytics tracking removido para evitar duplicidade com RD Station
      // O RD Station já registra a conversão automaticamente via API
      
      // Limpa os campos
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (phoneRef.current) phoneRef.current.value = "";
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      
      // Fallback: tenta via formulário oculto
      try {
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = 'https://api.rd.services/platform/conversions';
        form.target = '_blank';
        
        const nameRef = isMobile ? nameRefMobile : nameRefDesktop;
        const emailRef = isMobile ? emailRefMobile : emailRefDesktop;
        const phoneRef = isMobile ? phoneRefMobile : phoneRefDesktop;

        const name = nameRef.current?.value || "";
        const email = emailRef.current?.value || "";
        const phone = phoneRef.current?.value || "";
        
        // Fallback removido - não deve enviar dados para RD Station
        console.log('NewsletterForm: Fallback removido para evitar duplicidade');
        
        setSubmitMessage("Obrigado! Sua inscrição foi realizada com sucesso!");
        
        // Limpa os campos
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        setSubmitMessage("Ops! Houve um erro. Tente novamente em instantes.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = isSubmitting ? "ENVIANDO..." : "ENVIAR";

  return (
    <div className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto">
      {submitMessage && (
        <div className={`mb-4 p-3 rounded-md text-center ${
          submitMessage.includes("sucesso") 
            ? "bg-green-600/20 text-green-200 border border-green-600" 
            : "bg-red-600/20 text-red-200 border border-red-600"
        }`}>
          {submitMessage}
        </div>
      )}
      
      {/* Layout para mobile: todos os campos em coluna */}
      <form onSubmit={(e) => handleSubmit(e, true)} className="block lg:hidden space-y-4">
        <InputField
          ref={nameRefMobile}
          label="Nome"
          name="name"
          required
          className="w-full"
        />
        <InputField
          ref={emailRefMobile}
          label="Email"
          name="email"
          type="email"
          required
          className="w-full"
        />
        <InputField
          ref={phoneRefMobile}
          label="Telefone"
          name="personal_phone"
          type="tel"
          required
          className="w-full"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-yellow-600 rounded-md text-white font-bold hover:bg-yellow-700 transition-colors text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </form>

      {/* Layout para desktop: layout horizontal otimizado */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="hidden lg:block">
        <div className="flex flex-wrap gap-4 items-end">
          <InputField
            ref={nameRefDesktop}
            label="Nome"
            name="name"
            required
            className="flex-1 min-w-[200px]"
          />
          <InputField
            ref={emailRefDesktop}
            label="Email"
            name="email"
            type="email"
            required
            className="flex-1 min-w-[250px]"
          />
          <InputField
            ref={phoneRefDesktop}
            label="Telefone"
            name="personal_phone"
            type="tel"
            required
            className="flex-1 min-w-[200px]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-yellow-600 rounded-md text-white font-bold hover:bg-yellow-700 transition-colors text-lg min-w-[120px] h-[40px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonText}
          </button>
        </div>
      </form>
      </div>
  );
}; 