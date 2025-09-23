/**
 * Gerenciador global do RD Station para evitar múltiplas instâncias
 * do mesmo formulário shortcode3 sendo carregadas simultaneamente
 */

declare global {
  interface Window {
    RDStationForms: any;
    rdStationManager: RDStationManager;
  }
}

class RDStationManager {
  private static instance: RDStationManager;
  private currentFormContainer: HTMLElement | null = null;
  private isFormLoaded = false;
  private isScriptLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  static getInstance(): RDStationManager {
    if (!RDStationManager.instance) {
      RDStationManager.instance = new RDStationManager();
      window.rdStationManager = RDStationManager.instance;
    }
    return RDStationManager.instance;
  }

  /**
   * Carrega o script do RD Station se necessário
   */
  private async loadScript(): Promise<void> {
    if (this.isScriptLoaded) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="rdstation-forms"]');

      if (existingScript) {
        this.isScriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';

      script.onload = () => {
        console.log('Script RDStation carregado');
        this.isScriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        console.error('Erro ao carregar script do RDStation');
        this.loadingPromise = null;
        reject(new Error('Falha ao carregar script RD Station'));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  /**
   * Inicializa o formulário RD Station em um container específico
   */
  async initializeForm(containerElement: HTMLElement): Promise<boolean> {
    try {
      // Se já existe um formulário ativo, remove ele primeiro
      if (this.currentFormContainer && this.currentFormContainer !== containerElement) {
        this.clearCurrentForm();
      }

      // Define o novo container como ativo
      this.currentFormContainer = containerElement;

      // Carrega o script se necessário
      await this.loadScript();

      // Limpa o container e cria o formulário
      containerElement.innerHTML = '';

      // Remove qualquer container duplicado existente
      const existingContainer = document.getElementById('shortcode3-e67a38fad5973ddb16a8');
      if (existingContainer && existingContainer.parentElement !== containerElement) {
        existingContainer.remove();
      }

      // Cria o HTML do formulário
      const formHTML = `
        <div role="main" id="shortcode3-e67a38fad5973ddb16a8" style="display: none;"></div>
      `;

      containerElement.innerHTML = formHTML;

      // Aguarda um pouco para garantir que o DOM foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Inicializa o formulário RD Station
      if (window.RDStationForms) {
        new window.RDStationForms('shortcode3-e67a38fad5973ddb16a8', 'UA-150032078-1').createForm();
        console.log('RDStation Form criado com sucesso');
        this.isFormLoaded = true;
        return true;
      } else {
        console.error('RDStationForms não disponível');
        return false;
      }
    } catch (error) {
      console.error('Erro ao inicializar RDStation Form:', error);
      return false;
    }
  }

  /**
   * Remove o formulário atual
   */
  private clearCurrentForm(): void {
    if (this.currentFormContainer) {
      const existingContainer = this.currentFormContainer.querySelector('#shortcode3-e67a38fad5973ddb16a8');
      if (existingContainer) {
        existingContainer.remove();
      }
    }
    this.isFormLoaded = false;
  }

  /**
   * Envia dados através do formulário RD Station ativo
   */
  async submitForm(formData: { name: string; email: string; phone: string }): Promise<boolean> {
    try {
      if (!this.isFormLoaded) {
        console.warn('Formulário RD Station não está carregado');
        return false;
      }

      const container = document.querySelector('#shortcode3-e67a38fad5973ddb16a8');
      if (!container) {
        console.warn('Container do formulário não encontrado');
        return false;
      }

      // Procura o formulário RDStation
      const rdForm = container.querySelector('form') ||
                     document.querySelector('#shortcode3-e67a38fad5973ddb16a8 form') ||
                     document.querySelector('form[data-rd-form]') ||
                     document.querySelector('.rdstation-form form');

      if (!rdForm) {
        console.warn('Formulário RD Station não encontrado');
        return false;
      }

      // Procura e preenche os campos
      const nameField = rdForm.querySelector('input[name*="name"], input[name*="nome"], input[placeholder*="nome"], input[placeholder*="name"]') as HTMLInputElement;
      const emailField = rdForm.querySelector('input[name*="email"], input[type="email"], input[placeholder*="email"]') as HTMLInputElement;
      const phoneField = rdForm.querySelector('input[name*="phone"], input[name*="telefone"], input[name*="celular"], input[type="tel"], input[placeholder*="telefone"]') as HTMLInputElement;

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

      // Procura e clica no botão de submit
      const submitButton = rdForm.querySelector('input[type="submit"]') ||
                          rdForm.querySelector('button[type="submit"]') ||
                          rdForm.querySelector('button') ||
                          rdForm.querySelector('.submit-button') ||
                          rdForm.querySelector('[role="button"]');

      if (submitButton) {
        if (submitButton instanceof HTMLInputElement || submitButton instanceof HTMLButtonElement) {
          submitButton.click();
        } else {
          submitButton.dispatchEvent(new Event('click', { bubbles: true }));
        }
        return true;
      } else {
        // Se não encontrou botão, tenta enviar o form diretamente
        rdForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

        if (rdForm instanceof HTMLFormElement) {
          rdForm.submit();
        }
        return true;
      }
    } catch (error) {
      console.error('Erro ao enviar formulário RD Station:', error);
      return false;
    }
  }

  /**
   * Verifica se o formulário está carregado e pronto
   */
  isReady(): boolean {
    return this.isFormLoaded && !!document.querySelector('#shortcode3-e67a38fad5973ddb16a8');
  }
}

export default RDStationManager;