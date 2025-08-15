// Utilitário para carregar e executar o novo script do WhatsApp
export const loadWhatsAppScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se o script já foi carregado
    const existingScript = document.querySelector('script[src*="6c080696-d8cd-4a58-a778-f5d664a27c6e-loader.js"]');
    
    if (existingScript) {
      // Se já existe, resolve imediatamente
      resolve();
      return;
    }

    // Cria e carrega o novo script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/6c080696-d8cd-4a58-a778-f5d664a27c6e-loader.js';
    
    script.onload = () => {
      console.log('Script do WhatsApp carregado com sucesso');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Erro ao carregar script do WhatsApp');
      reject(new Error('Falha ao carregar script do WhatsApp'));
    };
    
    // Adiciona o script ao head
    document.head.appendChild(script);
  });
};

// Função para carregar automaticamente o script no carregamento da página
export const initializeWhatsAppScript = (): void => {
  // Carrega o script automaticamente
  loadWhatsAppScript()
    .then(() => {
      console.log('Widget do WhatsApp inicializado com sucesso');
    })
    .catch((error) => {
      console.error('Erro ao inicializar script do WhatsApp:', error);
    });
};

// Função para executar o novo comportamento do WhatsApp (mantida para compatibilidade)
export const executeWhatsAppAction = async (): Promise<void> => {
  // Função mantida apenas para compatibilidade com botões existentes
  // Como o novo script cria seu próprio widget, não precisamos fazer nada aqui
  // O widget do novo script funcionará independentemente desta função
  console.log('Função executeWhatsAppAction chamada - novo widget já ativo');
};
