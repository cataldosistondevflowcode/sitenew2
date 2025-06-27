"use client";
import * as React from "react";

export const NewsletterSignup: React.FC = () => {
  const [formHtml, setFormHtml] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('Iniciando carregamento do formulário RDStation...');
    
    // Cria o HTML do formulário com um ID único para evitar conflitos
    const uniqueId = `newsletter-site-de34ae318d19588a9ae8-${Date.now()}`;
    
    const rdStationHtml = `
      <div style="margin-top: 1.5rem; width: 100%; max-width: 64rem; margin-left: auto; margin-right: auto;">
        <div role="main" id="newsletter-site-de34ae318d19588a9ae8"></div>
      </div>
      <script type="text/javascript" src="https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"></script>
      <script type="text/javascript">
        console.log('Script RDStation carregado, tentando criar formulário...');
        
        function tentarCriarFormulario() {
          if (typeof RDStationForms !== 'undefined') {
            try {
              console.log('RDStationForms encontrado, criando formulário...');
              new RDStationForms('newsletter-site-de34ae318d19588a9ae8', 'UA-150032078-1').createForm();
              console.log('Formulário RDStation criado com sucesso!');
              
              // Aplica estilos customizados após criar o formulário
              setTimeout(function() {
                aplicarEstilosCustomizados();
              }, 500);
              
            } catch (error) {
              console.error('Erro ao criar formulário RDStation:', error);
              setTimeout(tentarCriarFormulario, 1000);
            }
          } else {
            console.log('RDStationForms ainda não está disponível, tentando novamente...');
            setTimeout(tentarCriarFormulario, 500);
          }
        }
        
        function aplicarEstilosCustomizados() {
          console.log('Aplicando estilos customizados...');
          
          const style = document.createElement('style');
          style.id = 'rdstation-custom-styles';
          
          // Remove estilo anterior se existir
          const existingStyle = document.getElementById('rdstation-custom-styles');
          if (existingStyle) {
            existingStyle.remove();
          }
          
          style.textContent = \`
            #newsletter-site-de34ae318d19588a9ae8 {
              margin-top: 0 !important;
              width: 100% !important;
              max-width: 64rem !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field {
              margin-bottom: 1rem !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field label {
              color: white !important;
              font-weight: 500 !important;
              margin-bottom: 0.5rem !important;
              display: block !important;
              font-size: 0.875rem !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input {
              width: 100% !important;
              height: 2.5rem !important;
              border-radius: 0.375rem !important;
              border: 2px solid #d68e08 !important;
              padding: 0.5rem 0.75rem !important;
              background: transparent !important;
              color: white !important;
              font-size: 0.875rem !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input::placeholder {
              color: #d1d5db !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input:focus {
              outline: none !important;
              border-color: #d68e08 !important;
              box-shadow: 0 0 0 2px rgba(214, 142, 8, 0.2) !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit {
              width: 100% !important;
              margin-top: 0.5rem !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input,
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button {
              width: 100% !important;
              padding: 0.75rem 1.5rem !important;
              background-color: #d68e08 !important;
              color: white !important;
              font-weight: bold !important;
              border-radius: 0.375rem !important;
              border: none !important;
              cursor: pointer !important;
              transition: background-color 0.2s !important;
              font-size: 0.875rem !important;
            }
            
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input:hover,
            #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button:hover {
              background-color: #b8780a !important;
            }
            
            @media (min-width: 1024px) {
              #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-fields {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 1rem !important;
                align-items: end !important;
              }
              
              #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field {
                flex: 1 !important;
                min-width: 200px !important;
                margin-bottom: 0 !important;
              }
              
              #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit {
                flex: 0 0 auto !important;
                min-width: 120px !important;
                margin-top: 0 !important;
              }
              
              #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input,
              #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button {
                height: 2.5rem !important;
                padding: 0.5rem 2rem !important;
                font-size: 1.125rem !important;
              }
            }
          \`;
          
          document.head.appendChild(style);
          console.log('Estilos customizados aplicados!');
        }
        
        // Inicia o processo de criação do formulário
        setTimeout(tentarCriarFormulario, 1000);
      </script>
    `;
    
    setFormHtml(rdStationHtml);
    setIsLoading(false);
    console.log('HTML do formulário definido');
  }, []);

  // Adiciona estilos customizados para o formulário do RDStation
  React.useEffect(() => {
    if (isFormLoaded) {
      const style = document.createElement('style');
      style.textContent = `
        #newsletter-site-de34ae318d19588a9ae8 {
          margin-top: 0 !important;
          width: 100% !important;
          max-width: 64rem !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field {
          margin-bottom: 1rem !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field label {
          color: white !important;
          font-weight: 500 !important;
          margin-bottom: 0.5rem !important;
          display: block !important;
          font-size: 0.875rem !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input {
          width: 100% !important;
          height: 2.5rem !important;
          border-radius: 0.375rem !important;
          border: 2px solid #d68e08 !important;
          padding: 0.5rem 0.75rem !important;
          background: transparent !important;
          color: white !important;
          font-size: 0.875rem !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input::placeholder {
          color: #d1d5db !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field input:focus {
          outline: none !important;
          ring: 2px !important;
          ring-color: #d68e08 !important;
          border-color: #d68e08 !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit {
          width: 100% !important;
          margin-top: 0.5rem !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input,
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button {
          width: 100% !important;
          padding: 0.75rem 1.5rem !important;
          background-color: #d68e08 !important;
          color: white !important;
          font-weight: bold !important;
          border-radius: 0.375rem !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
          font-size: 0.875rem !important;
        }
        
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input:hover,
        #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button:hover {
          background-color: #b8780a !important;
        }
        
        /* Layout responsivo para desktop */
        @media (min-width: 1024px) {
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-fields {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 1rem !important;
            align-items: end !important;
          }
          
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field {
            flex: 1 !important;
            min-width: 200px !important;
            margin-bottom: 0 !important;
          }
          
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit {
            flex: 0 0 auto !important;
            min-width: 120px !important;
            margin-top: 0 !important;
          }
          
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input,
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button {
            height: 2.5rem !important;
            padding: 0.5rem 2rem !important;
            font-size: 1.125rem !important;
          }
        }
        
        /* Estilo para mobile */
        @media (max-width: 1023px) {
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-field {
            margin-bottom: 1rem !important;
          }
          
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit input,
          #newsletter-site-de34ae318d19588a9ae8 .rdstation-form .form-submit button {
            font-size: 1rem !important;
            padding: 0.75rem 1.5rem !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [isFormLoaded]);

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
        
        {/* Container para o formulário RDStation */}
        <div 
          ref={containerRef}
          className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto"
        ></div>
        
        {/* Loading placeholder */}
        {!isFormLoaded && (
          <div className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto">
            <div className="text-white text-center mb-4">
              Carregando formulário...
            </div>
            <div className="animate-pulse">
              <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4 lg:items-end">
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
                  <div className="h-10 bg-gray-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
                  <div className="h-10 bg-gray-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
                  <div className="h-10 bg-gray-600 rounded"></div>
                </div>
                <div className="lg:min-w-[120px]">
                  <div className="h-10 bg-yellow-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}; 