import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    RDStationForms: any;
  }
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar formulário RD Station quando o modal abre
  useEffect(() => {
    if (isOpen) {
      const loadForm = () => {
        if (containerRef.current) {
          // Limpa qualquer conteúdo anterior
          containerRef.current.innerHTML = '';
          
          // Verifica se já existe um script do RDStation carregado
          const existingScript = document.querySelector('script[src*="rdstation-forms"]');
          const existingContainer = document.getElementById('shortcode3-e67a38fad5973ddb16a8');
          
          // Remove elementos duplicados se existirem
          if (existingContainer && existingContainer !== containerRef.current.querySelector('#shortcode3-e67a38fad5973ddb16a8')) {
            existingContainer.remove();
          }
          
          // Código HTML e JavaScript direto do RDStation (mesmo ID usado em todos os outros formulários)
          const formHTML = `
            <div role="main" id="shortcode3-e67a38fad5973ddb16a8" style="display: none;"></div>
          `;
          
          containerRef.current.innerHTML = formHTML;
          
          // Carrega o script apenas se não existir
          if (!existingScript) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
            script.onload = () => {
              console.log('Script RDStation carregado para WhatsApp modal');
              initializeRDStationForm();
            };
            script.onerror = () => {
              console.error('Erro ao carregar script do RDStation para WhatsApp modal');
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
              new window.RDStationForms('shortcode3-e67a38fad5973ddb16a8', 'UA-150032078-1').createForm();
              console.log('RDStation Form do WhatsApp modal criado com sucesso');
              setIsFormLoaded(true);
            } else {
              console.error('RDStationForms não disponível para WhatsApp modal');
            }
          } catch (error) {
            console.error('Erro ao criar RDStation Form do WhatsApp modal:', error);
          }
        }, 1000);
      };

      loadForm();
    }
  }, [isOpen]);

  // Função para enviar dados através do formulário RD Station oculto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Aguarda o formulário RD Station estar carregado
      if (!isFormLoaded) {
        setIsSubmitting(false);
        return;
      }

      // Procura o formulário RD Station 
      const container = document.querySelector('#shortcode3-e67a38fad5973ddb16a8');
      console.log('Container do WhatsApp modal encontrado:', container);
      console.log('HTML do container do WhatsApp modal:', container?.innerHTML);

      const rdForm = container?.querySelector('form') || 
                     document.querySelector('#shortcode3-e67a38fad5973ddb16a8 form') ||
                     document.querySelector('form[data-rd-form]');
      
      console.log('Formulário do WhatsApp modal encontrado:', rdForm);

      if (rdForm) {
        console.log('HTML do formulário do WhatsApp modal:', rdForm.innerHTML);
        
        // Procura campos por diferentes atributos
        const nameField = rdForm.querySelector('input[name*="name"], input[name*="nome"], input[placeholder*="nome"], input[placeholder*="name"]') as HTMLInputElement;
        const emailField = rdForm.querySelector('input[name*="email"], input[type="email"], input[placeholder*="email"]') as HTMLInputElement;
        const phoneField = rdForm.querySelector('input[name*="phone"], input[name*="telefone"], input[name*="celular"], input[type="tel"], input[placeholder*="telefone"]') as HTMLInputElement;

        console.log('Campos do WhatsApp modal encontrados:', { nameField, emailField, phoneField });

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

        console.log('Botão de submit do WhatsApp modal encontrado:', submitButton);

        if (submitButton) {
          // Tenta diferentes formas de enviar
          if (submitButton instanceof HTMLInputElement || submitButton instanceof HTMLButtonElement) {
            submitButton.click();
          } else {
            submitButton.dispatchEvent(new Event('click', { bubbles: true }));
          }
        } else {
          // Se não encontrou botão, tenta enviar o form diretamente
          console.log('Tentando enviar formulário do WhatsApp modal diretamente');
          
          // Dispara evento de submit no formulário
          rdForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          
          // Ou usa o método submit se disponível
          if (rdForm instanceof HTMLFormElement) {
            rdForm.submit();
          }
        }
      }
    } catch (error) {
      console.error('Erro ao enviar formulário do WhatsApp modal:', error);
    }

    // Aguarda um pouco para garantir que o envio foi processado
    setTimeout(() => {
      // Abrir o WhatsApp Web numa nova guia
      const whatsappUrl = 'https://web.whatsapp.com/send?phone=+5521977294848&text=Gostaria+de+Atendimento+via+WhatsApp';
      window.open(whatsappUrl, '_blank');
      
      // Fechar o modal e limpar os campos
      setFormData({ name: '', email: '', phone: '' });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="bg-[#25d366] text-white p-4 rounded-t-lg relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold">Olá! Preencha os campos abaixo para iniciar a conversa no WhatsApp</h2>
        </div>
        
        {/* Corpo do modal */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <div className="flex">
                <select className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent">
                  <option value="+55">🇧🇷 +55</option>
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
                  placeholder="21 99999-9999"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25d366] hover:bg-[#128c7e] text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-5 h-5" />
              {isSubmitting ? "Enviando..." : "Iniciar a conversa"}
            </button>
          </form>

          {/* Container oculto para o formulário RDStation */}
          <div 
            ref={containerRef}
            style={{ display: 'none' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal; 