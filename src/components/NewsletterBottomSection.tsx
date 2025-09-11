"use client";
import React, { useRef, useState, useEffect } from 'react';

declare global {
  interface Window {
    RDStationForms: any;
  }
}

interface NewsletterBottomSectionProps {
  onWhatsAppClick?: () => void;
  onOpportunityClick?: () => void;
}

export const NewsletterBottomSection: React.FC<NewsletterBottomSectionProps> = ({ 
  onWhatsAppClick, 
  onOpportunityClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  
  // Estados para os campos da máscara visual
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const loadForm = () => {
      if (containerRef.current) {
        // Limpa qualquer conteúdo anterior
        containerRef.current.innerHTML = '';
        
        // Verifica se já existe um script do RDStation carregado
        const existingScript = document.querySelector('script[src*="rdstation-forms"]');
        const uniqueId = 'newsletter-bottom-shortcode3';
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
      const uniqueId = 'newsletter-bottom-shortcode3';
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
    <section className="pt-8 sm:pt-12 pb-0 sm:pb-0 bg-cover bg-center relative max-md:mt-0" style={{backgroundImage: 'url(/bg-newsletter.jpg.webp)'}}>
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="container mx-auto relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">Receba nossa newsletter</h2>
              
              {/* Mensagem de Sucesso */}
              {isSuccess && (
                <div className="mb-4 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-md">
                  <p className="text-white text-center font-medium">
                    ✅ Inscrição realizada com sucesso! Você receberá as oportunidades de leilões em breve.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome*" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <input 
                  type="email" 
                  placeholder="Email*" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <input 
                  type="tel" 
                  placeholder="Telefone*" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border-2 border-[#d68e08] rounded-md bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d68e08] text-sm sm:text-base" 
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full px-6 sm:px-8 py-3 bg-[#d68e08] hover:bg-[#b8780a] disabled:bg-[#d68e08]/50 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors text-sm sm:text-base"
                >
                  {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
              </form>
              
              <div className="mt-8 sm:mt-12">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Podemos ajudar a solucionar o seu caso!</h3>
                <div className="flex justify-center lg:justify-start space-x-6 sm:space-x-8">
                  <button 
                    onClick={onWhatsAppClick}
                    className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">WhatsApp</span>
                  </button>
                  <a 
                    href="mailto:contato@cataldosiston-adv.com.br"
                    className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Email</span>
                  </a>
                  <a 
                    href="tel:55-21-3173-3795"
                    className="flex flex-col items-center text-[#d68e08] hover:text-[#b8780a] transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Telefone</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center order-first lg:order-last">
              <img 
                src="/foto-recortada-cataldo.png" 
                alt="Advogado Cataldo" 
                className="max-w-full h-auto rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-full" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Container oculto para o formulário RDStation */}
      <div 
        ref={containerRef}
        style={{ display: 'none' }}
      ></div>
    </section>
  );
};  