/**
 * Gerenciador global do RD Station para evitar múltiplas instâncias
 * do mesmo formulário shortcode3 sendo carregadas simultaneamente
 * 
 * CONFIGURAÇÕES RD STATION (Cataldo Siston):
 * - Account ID: 6c080696-d8cd-4a58-a778-f5d664a27c6e
 * - Form ID (ShortCode3): shortcode3-e67a38fad5973ddb16a8
 * - UA Google Analytics: UA-150032078-1
 */

declare global {
  interface Window {
    RDStationForms: any;
    rdStationManager: RDStationManager;
  }
}

// IDs oficiais do RD Station (coletados do painel em 05/02/2026)
const RD_STATION_CONFIG = {
  FORM_ID: 'shortcode3-e67a38fad5973ddb16a8',
  UA_ID: 'UA-150032078-1',
  ACCOUNT_ID: '6c080696-d8cd-4a58-a778-f5d664a27c6e',
} as const;

class RDStationManager {
  private static instance: RDStationManager;
  private activeContainers: Map<HTMLElement, string> = new Map();
  private isScriptLoaded = false;
  private loadingPromise: Promise<void> | null = null;
  private formCounter = 0;

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
   * Usa o ID oficial do formulário ShortCode3 do RD Station
   */
  async initializeForm(containerElement: HTMLElement): Promise<boolean> {
    try {
      // Usar o ID oficial do RD Station (não gerar IDs dinâmicos)
      this.formCounter++;
      const formId = RD_STATION_CONFIG.FORM_ID;
      const containerId = `${formId}-container-${this.formCounter}`;

      console.log(`Inicializando formulário RD Station:`);
      console.log(`  - Form ID: ${formId}`);
      console.log(`  - Container ID: ${containerId}`);
      console.log(`  - UA ID: ${RD_STATION_CONFIG.UA_ID}`);

      // Carrega o script se necessário
      await this.loadScript();

      // Limpa o container
      containerElement.innerHTML = '';

      // Cria o HTML do formulário usando o ID oficial do RD Station
      const formHTML = `
        <div role="main" id="${formId}"></div>
      `;

      containerElement.innerHTML = formHTML;
      this.activeContainers.set(containerElement, formId);

      // Aguarda um pouco para garantir que o DOM foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Inicializa o formulário RD Station com os IDs oficiais
      if (window.RDStationForms) {
        new window.RDStationForms(formId, RD_STATION_CONFIG.UA_ID).createForm();
        console.log(`✅ RDStation Form criado com sucesso!`);
        console.log(`   Form ID: ${formId}`);
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
   * Envia dados através do formulário RD Station ativo
   */
  async submitForm(formData: { name: string; email: string; phone: string }): Promise<boolean> {
    try {
      console.log('RDStationManager.submitForm chamado com:', formData);

      if (this.activeContainers.size === 0) {
        console.warn('Nenhum formulário RD Station está ativo');
        return false;
      }

      // Procura pelo primeiro container ativo disponível
      let containerFound = null;
      let containerElement = null;

      for (const [element, containerId] of this.activeContainers) {
        const container = document.querySelector(`#${containerId}`);
        console.log(`Procurando container ID: ${containerId}`, container);

        if (container) {
          containerFound = container;
          containerElement = element;
          break;
        }
      }

      if (!containerFound) {
        console.warn('Nenhum container do formulário foi encontrado no DOM');
        // Tentar procurar qualquer container RD Station
        const alternativeContainer = document.querySelector('[id*="shortcode"]') ||
                                   document.querySelector('.rdstation-form') ||
                                   document.querySelector('[data-rd-form]');
        console.log('Container alternativo encontrado:', alternativeContainer);

        if (alternativeContainer) {
          containerFound = alternativeContainer;
        } else {
          return false;
        }
      }

      // Procura o formulário RDStation
      const rdForm = containerFound.querySelector('form') ||
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
    for (const [element, containerId] of this.activeContainers) {
      if (document.querySelector(`#${containerId}`)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Remove um container específico
   */
  removeContainer(containerElement: HTMLElement): void {
    if (this.activeContainers.has(containerElement)) {
      const containerId = this.activeContainers.get(containerElement);
      const container = document.querySelector(`#${containerId}`);
      if (container) {
        container.remove();
      }
      this.activeContainers.delete(containerElement);
    }
  }
}

export default RDStationManager;