"use client";
import * as React from "react";

declare global {
  interface Window {
    RDStationForms: any;
  }
}

export const NewsletterSignup: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFormLoaded, setIsFormLoaded] = React.useState(false);
  
  // Estados para os campos da máscara visual
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    const loadForm = () => {
      if (containerRef.current) {
        // Limpa qualquer conteúdo anterior
        containerRef.current.innerHTML = '';
        
        // Verifica se já existe um script do RDStation carregado
        const existingScript = document.querySelector('script[src*="rdstation-forms"]');
        const uniqueId = 'newsletter-signup-shortcode3';
        const existingContainer = document.getElementById(uniqueId);
        
        // Remove elementos duplicados se existirem
        if (existingContainer && existingContainer !== containerRef.current.querySelector(`#${uniqueId}`)) {
          existingContainer.remove();
        }
        
        // Código HTML e JavaScript direto do RDStation
        const formHTML = `
          <div role="main" id="${uniqueId}" style="display: none;"></div>
        `;
        
        containerRef.current.innerHTML = formHTML;
        
        // Carrega o script apenas se não existir
        if (!existingScript) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
          script.onload = () => {
            console.log('Script RDStation carregado');
            initializeRDStationForm();
          };
          script.onerror = () => {
            console.error('Erro ao carregar script do RDStation');
          };
          document.head.appendChild(script);
        } else {
          // Se o script já existe, apenas inicializa o formulário
          initializeRDStationForm();
        }
      }
    };
    
    const initializeRDStationForm = () => {
      setTimeout(() => {
        try {
          if (window.RDStationForms) {
            new window.RDStationForms(uniqueId, 'UA-150032078-1').createForm();
            console.log('RDStation Form criado com sucesso');
            setIsFormLoaded(true);
          } else {
            console.error('RDStationForms não disponível');
          }
        } catch (error) {
          console.error('Erro ao criar RDStation Form:', error);
        }
      }, 1000);
    };

    loadForm();
  }, []);

  // Função para enviar dados através do formulário RDStation oculto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      // Não usar alert, apenas destacar campos vazios
      return;
    }

    setIsSubmitting(true);

    try {
      // Aguarda o formulário RDStation estar carregado
      if (!isFormLoaded) {
        setIsSubmitting(false);
        return;
      }

      // Debug: vamos ver o que tem no container
      const uniqueId = 'newsletter-signup-shortcode3';
      const container = document.querySelector(`#${uniqueId}`);
      console.log('Container encontrado:', container);
      console.log('HTML do container:', container?.innerHTML);

      // Procura o formulário RDStation de diferentes formas
      const rdForm = container?.querySelector('form') || 
                     document.querySelector(`#${uniqueId} form`) ||
                     document.querySelector('form[data-rd-form]') ||
                     document.querySelector('.rdstation-form form');
      
      console.log('Formulário encontrado:', rdForm);

      if (rdForm) {
        console.log('HTML do formulário:', rdForm.innerHTML);
        
        // Procura campos por diferentes atributos
        const nameField = rdForm.querySelector('input[name*="name"], input[name*="nome"], input[placeholder*="nome"], input[placeholder*="name"]') as HTMLInputElement;
        const emailField = rdForm.querySelector('input[name*="email"], input[type="email"], input[placeholder*="email"]') as HTMLInputElement;
        const phoneField = rdForm.querySelector('input[name*="phone"], input[name*="telefone"], input[name*="celular"], input[type="tel"], input[placeholder*="telefone"]') as HTMLInputElement;

        console.log('Campos encontrados:', { nameField, emailField, phoneField });

        // Preenche os campos se encontrados
        if (nameField) {
          nameField.value = formData.name;
          nameField.dispatchEvent(new Event('input', { bubbles: true }));
          nameField.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (emailField) {
          emailField.value = formData.email;
          emailField.dispatchEvent(new Event('input', { bubbles: true }));
          emailField.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (phoneField) {
          phoneField.value = formData.phone;
          phoneField.dispatchEvent(new Event('input', { bubbles: true }));
          phoneField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Procura o botão de submit de diferentes formas
        const submitButton = rdForm.querySelector('input[type="submit"]') ||
                            rdForm.querySelector('button[type="submit"]') ||
                            rdForm.querySelector('button') ||
                            rdForm.querySelector('.submit-button') ||
                            rdForm.querySelector('[role="button"]');

        console.log('Botão de submit encontrado:', submitButton);

        if (submitButton) {
          // Tenta diferentes formas de enviar
          if (submitButton instanceof HTMLInputElement || submitButton instanceof HTMLButtonElement) {
            submitButton.click();
          } else {
            submitButton.dispatchEvent(new Event('click', { bubbles: true }));
          }
          
          // Reset form após envio - SEM alert
          setTimeout(() => {
            setFormData({ name: '', email: '', phone: '' });
            setIsSubmitting(false);
            setIsSuccess(true);
            // Remove mensagem de sucesso após 5 segundos
            setTimeout(() => setIsSuccess(false), 5000);
          }, 1000);
        } else {
          // Se não encontrou botão, tenta enviar o form diretamente
          console.log('Tentando enviar formulário diretamente');
          
          // Dispara evento de submit no formulário
          rdForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          
          // Ou usa o método submit se disponível
          if (rdForm instanceof HTMLFormElement) {
            rdForm.submit();
          }
          
          setTimeout(() => {
            setFormData({ name: '', email: '', phone: '' });
            setIsSubmitting(false);
            setIsSuccess(true);
            // Remove mensagem de sucesso após 5 segundos
            setTimeout(() => setIsSuccess(false), 5000);
          }, 1000);
        }
      } else {
        // Se não encontrou o formulário, apenas remove loading
        console.log('Formulário não encontrado');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 sm:pt-12 md:pt-12 pb-[50px] max-w-full text-white bg-cover bg-center relative w-full"
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
        
        {/* Formulário Visual Customizado */}
        <form 
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto"
        >
          <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4 lg:items-end">
            {/* Campo Nome */}
            <div className="flex-1">
              <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Campo Email */}
            <div className="flex-1">
              <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seuemail@exemplo.com"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Campo Telefone */}
            <div className="flex-1">
              <label htmlFor="phone" className="block text-white font-medium mb-2 text-sm">
                Telefone *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                required
                className="w-full h-10 border-2 border-yellow-600 rounded-md px-3 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </div>

            {/* Botão Submit */}
            <div className="lg:min-w-[120px]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors px-8"
              >
                {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
              </button>
            </div>
          </div>
        </form>
        
        {/* Mensagem de Sucesso */}
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-md">
            <p className="text-white text-center font-medium">
              ✅ Inscrição realizada com sucesso! Você receberá as oportunidades de leilões em breve.
            </p>
          </div>
        )}
        
        {/* Container oculto para o formulário RDStation */}
        <div 
          ref={containerRef}
          style={{ display: 'none' }}
        ></div>
        
        {/* Loading placeholder apenas enquanto carrega o RDStation */}
        {!isFormLoaded && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            Inicializando sistema de inscrição...
          </div>
        )}
      </div>
    </section>
  );
}; 