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
      
      // Disponibilizar função de debug globalmente
      (window as any).findAndLogWidget = findAndLogWidget;
      (window as any).executeWhatsAppAction = executeWhatsAppAction;
      
      // Aguardar alguns segundos e fazer uma primeira verificação
      setTimeout(() => {
        console.log('🔍 Verificação inicial do widget...');
        console.log('💡 Funções disponíveis no console: findAndLogWidget(), executeWhatsAppAction()');
        findAndLogWidget();
      }, 3000);
    })
    .catch((error) => {
      console.error('Erro ao inicializar script do WhatsApp:', error);
    });
};

// Função auxiliar para encontrar e logar informações sobre o widget
export const findAndLogWidget = (): void => {
  console.log('🔍 Fazendo scan completo do DOM em busca de widgets...');
  
  // Primeiro, verificar se o script foi carregado
  const rdScripts = document.querySelectorAll('script[src*="d335luupugsy2.cloudfront.net"]');
  console.log(`📜 Scripts RDStation encontrados: ${rdScripts.length}`);
  
  // Buscar elementos que podem ser o widget RDStation criados dinamicamente
  console.log('🔍 Buscando elementos RDStation específicos...');
  
  // Verificar por elementos com IDs ou classes específicas do RDStation
  const rdElements = [
    ...document.querySelectorAll('[id*="rd"]'),
    ...document.querySelectorAll('[class*="rd"]'),
    ...document.querySelectorAll('[id*="rdstation"]'),
    ...document.querySelectorAll('[class*="rdstation"]'),
    ...document.querySelectorAll('div[style*="position: fixed"]'),
    ...document.querySelectorAll('div[style*="bottom"]'),
    ...document.querySelectorAll('div[style*="right"]'),
    ...document.querySelectorAll('iframe[src*="rdstation"]'),
    ...document.querySelectorAll('iframe[src*="whatsapp"]')
  ];
  
  console.log(`🎯 Elementos RDStation específicos encontrados: ${rdElements.length}`);
  rdElements.forEach((el, index) => {
    const element = el as HTMLElement;
    console.log(`🎯 Elemento RD ${index + 1}:`, {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      style: element.getAttribute('style'),
      src: element.getAttribute('src'),
      href: element.getAttribute('href'),
      innerHTML: element.innerHTML.substring(0, 150),
      textContent: element.textContent?.substring(0, 100)
    });
  });
  
  // Buscar todos os elementos fixed para análise geral
  const allFixedElements = document.querySelectorAll('*');
  const fixedElements: HTMLElement[] = [];
  const possibleWidgets: HTMLElement[] = [];
  
  allFixedElements.forEach((el) => {
    const element = el as HTMLElement;
    const computedStyle = window.getComputedStyle(element);
    
    // Verificar se é posição fixa
    if (computedStyle.position === 'fixed') {
      fixedElements.push(element);
      
      const href = element.getAttribute('href');
      const className = element.className;
      const id = element.id;
      const innerHTML = element.innerHTML.toLowerCase();
      const textContent = element.textContent?.toLowerCase() || '';
      const styleAttr = element.getAttribute('style') || '';
      
      // Log de todos os elementos fixed para debugging
      console.log('🔍 Elemento fixed encontrado:', {
        tagName: element.tagName,
        className: className,
        id: id,
        href: href,
        styleAttr: styleAttr,
        innerHTML: innerHTML.substring(0, 100),
        textContent: textContent.substring(0, 100),
        position: {
          top: computedStyle.top,
          bottom: computedStyle.bottom,
          left: computedStyle.left,
          right: computedStyle.right
        },
        zIndex: computedStyle.zIndex,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        rect: element.getBoundingClientRect()
      });
      
      // Verificar se tem indicadores de WhatsApp ou RDStation (critérios mais amplos)
      if (href?.includes('whatsapp') || href?.includes('wa.me') ||
          className.toLowerCase().includes('whatsapp') ||
          id.toLowerCase().includes('whatsapp') ||
          innerHTML.includes('whatsapp') ||
          textContent.includes('whatsapp') ||
          className.toLowerCase().includes('wa-') ||
          className.toLowerCase().includes('rd-') ||
          id.toLowerCase().includes('rd-') ||
          innerHTML.includes('wa.me') ||
          textContent.includes('wa.me') ||
          innerHTML.includes('rdstation') ||
          styleAttr.includes('whatsapp') ||
          element.tagName.toLowerCase() === 'iframe') {
        
        possibleWidgets.push(element);
        
        console.log('🎯 Possível widget WhatsApp/RD encontrado:', {
          element: element,
          tagName: element.tagName,
          className: className,
          id: id,
          href: href,
          styleAttr: styleAttr,
          innerHTML: innerHTML.substring(0, 200),
          textContent: textContent.substring(0, 200),
          rect: element.getBoundingClientRect()
        });
      }
    }
  });
  
  // Verificar também por iframes que podem conter o widget
  const iframes = document.querySelectorAll('iframe');
  console.log(`🖼️ IFrames encontrados: ${iframes.length}`);
  iframes.forEach((iframe, index) => {
    console.log(`🖼️ IFrame ${index + 1}:`, {
      src: iframe.src,
      id: iframe.id,
      className: iframe.className,
      style: iframe.getAttribute('style')
    });
  });
  
  // Verificar elementos com atributos data-* que podem ser do RDStation
  const dataElements = document.querySelectorAll('[data-rd], [data-rdstation], [data-widget]');
  console.log(`📊 Elementos com data-* encontrados: ${dataElements.length}`);
  dataElements.forEach((el, index) => {
    console.log(`📊 Data element ${index + 1}:`, {
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ')
    });
  });
  
  console.log(`📈 Resumo: ${fixedElements.length} elementos fixed, ${possibleWidgets.length} possíveis widgets WhatsApp`);
  
  // Buscar por qualquer elemento que contenha "WhatsApp" ou "RDStation" no texto ou atributos
  console.log('🔍 Busca ampla por elementos com WhatsApp/RDStation...');
  const allElementsWithText = document.querySelectorAll('*');
  let elementsWithWhatsApp = 0;
  
  allElementsWithText.forEach((el) => {
    const element = el as HTMLElement;
    const text = element.textContent?.toLowerCase() || '';
    const html = element.innerHTML.toLowerCase();
    const allAttrs = Array.from(element.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ')
      .toLowerCase();
    
    if (text.includes('whatsapp') || html.includes('whatsapp') || allAttrs.includes('whatsapp') ||
        text.includes('rdstation') || html.includes('rdstation') || allAttrs.includes('rdstation')) {
      
      elementsWithWhatsApp++;
      console.log(`📱 Elemento ${elementsWithWhatsApp} com WhatsApp/RD:`, {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        textContent: text.substring(0, 100),
        innerHTML: html.substring(0, 100),
        attributes: allAttrs.substring(0, 200),
        position: window.getComputedStyle(element).position,
        display: window.getComputedStyle(element).display
      });
    }
  });
  
  console.log(`📈 Resumo final: ${elementsWithWhatsApp} elementos com WhatsApp/RDStation encontrados`);
  
  if (possibleWidgets.length === 0 && elementsWithWhatsApp === 0) {
    console.log('❌ Nenhum widget WhatsApp ou elemento RDStation encontrado no DOM');
    console.log('💡 Dica: Verifique se o script RDStation carregou corretamente');
    
    // Verificar se há elementos shadow DOM
    console.log('🔍 Verificando shadow DOM...');
    document.querySelectorAll('*').forEach((el) => {
      if ((el as any).shadowRoot) {
        console.log('🌙 Shadow DOM encontrado em:', el.tagName, el.className);
      }
    });
    
  } else {
    console.log(`✅ ${possibleWidgets.length} possível(is) widget(s) + ${elementsWithWhatsApp} elemento(s) com WhatsApp/RD encontrado(s)`);
  }
  
  // Adicionar também uma função de teste manual
  console.log('🧪 Função de teste disponível: window.testRDStationClick()');
  (window as any).testRDStationClick = () => {
    console.log('🧪 Testando clique em todos os elementos possíveis...');
    const testElements = [
      ...document.querySelectorAll('a[href*="whatsapp"]'),
      ...document.querySelectorAll('a[href*="wa.me"]'),
      ...document.querySelectorAll('[id*="rd"]'),
      ...document.querySelectorAll('[class*="rd"]'),
      ...document.querySelectorAll('iframe')
    ];
    
    testElements.forEach((el, index) => {
      console.log(`🧪 Testando elemento ${index + 1}:`, el);
      (el as HTMLElement).click();
    });
  };
};

// Função para executar o novo comportamento do WhatsApp (simula clique no widget)
export const executeWhatsAppAction = async (): Promise<void> => {
  console.log('🔍 Iniciando busca pelo widget WhatsApp...');
  
  // Primeiro, fazer um scan completo para debug
  findAndLogWidget();
  
  // Função para aguardar até que o widget apareça
  const waitForWidget = (maxAttempts = 30): Promise<HTMLElement | null> => {
    return new Promise((resolve) => {
      let attempts = 0;
      
      const checkForWidget = () => {
        attempts++;
        console.log(`🔍 Tentativa ${attempts}/${maxAttempts} - Buscando widget RDStation...`);
        
        // Primeiro, buscar elementos específicos do RDStation
        const rdElements = [
          ...document.querySelectorAll('[id*="rd"]'),
          ...document.querySelectorAll('[class*="rd"]'),
          ...document.querySelectorAll('[id*="rdstation"]'),
          ...document.querySelectorAll('[class*="rdstation"]'),
          ...document.querySelectorAll('iframe[src*="rdstation"]'),
          ...document.querySelectorAll('iframe[src*="whatsapp"]'),
          ...document.querySelectorAll('div[style*="position: fixed"]'),
          ...document.querySelectorAll('a[href*="whatsapp"]'),
          ...document.querySelectorAll('a[href*="wa.me"]')
        ];
        
        // Verificar elementos RDStation específicos primeiro
        for (const element of rdElements) {
          const el = element as HTMLElement;
          const computedStyle = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          // Verificar se é visível e potencialmente o widget
          if (computedStyle.display !== 'none' && 
              computedStyle.visibility !== 'hidden' && 
              rect.width > 0 && rect.height > 0) {
            
            console.log('✅ Elemento RDStation específico encontrado!', {
              element: el,
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              href: el.getAttribute('href'),
              src: el.getAttribute('src'),
              rect: rect,
              position: computedStyle.position
            });
            
            resolve(el);
            return;
          }
        }
        
        // Buscar qualquer elemento fixed que possa ser o widget do RDStation
        const allElements = document.querySelectorAll('*');
        
        for (const element of allElements) {
          const el = element as HTMLElement;
          const computedStyle = window.getComputedStyle(el);
          
          // Verificar se é posição fixa
          if (computedStyle.position === 'fixed') {
            const rect = el.getBoundingClientRect();
            const isBottomRight = (
              (computedStyle.bottom !== 'auto' && computedStyle.bottom !== '0px') ||
              (computedStyle.right !== 'auto' && computedStyle.right !== '0px') ||
              (rect.bottom > window.innerHeight * 0.5 && rect.right > window.innerWidth * 0.5)
            );
            
            if (isBottomRight && rect.width > 0 && rect.height > 0) {
              const href = el.getAttribute('href');
              const className = el.className.toLowerCase();
              const id = el.id.toLowerCase();
              const innerHTML = el.innerHTML.toLowerCase();
              const textContent = el.textContent?.toLowerCase() || '';
              const styleAttr = el.getAttribute('style') || '';
              
              // Verificar se tem indicadores de WhatsApp ou RDStation (critérios mais amplos)
              const hasWhatsAppIndicators = (
                href?.includes('whatsapp') || href?.includes('wa.me') ||
                className.includes('whatsapp') || className.includes('wa-') ||
                id.includes('whatsapp') || id.includes('wa-') ||
                innerHTML.includes('whatsapp') || innerHTML.includes('wa.me') ||
                textContent.includes('whatsapp') || textContent.includes('wa.me') ||
                className.includes('rd-') || id.includes('rd-') ||
                innerHTML.includes('rdstation') || styleAttr.includes('whatsapp') ||
                el.tagName.toLowerCase() === 'iframe' ||
                // Critérios mais amplos para elementos que podem ser widgets
                (rect.width < 200 && rect.height < 200 && isBottomRight)
              );
              
              if (hasWhatsAppIndicators) {
                console.log('✅ Possível widget WhatsApp/RDStation encontrado!', {
                  element: el,
                  tagName: el.tagName,
                  className: el.className,
                  id: el.id,
                  href: href,
                  styleAttr: styleAttr,
                  position: {
                    bottom: computedStyle.bottom,
                    right: computedStyle.right,
                    rect: rect
                  },
                  indicators: {
                    href: href?.includes('whatsapp') || href?.includes('wa.me'),
                    className: className.includes('whatsapp') || className.includes('wa-') || className.includes('rd-'),
                    innerHTML: innerHTML.includes('whatsapp') || innerHTML.includes('rdstation'),
                    textContent: textContent.includes('whatsapp') || textContent.includes('wa.me')
                  }
                });
                
                resolve(el);
                return;
              }
            }
          }
        }
        
        // Se não encontrou e ainda tem tentativas, tentar novamente
        if (attempts < maxAttempts) {
          setTimeout(checkForWidget, 1000); // Aguardar 1 segundo entre tentativas
        } else {
          console.log('❌ Widget não encontrado após todas as tentativas');
          console.log('💡 Executando findAndLogWidget() para análise final...');
          findAndLogWidget();
          resolve(null);
        }
      };
      
      checkForWidget();
    });
  };
  
  try {
    // Aguardar o widget aparecer
    const widget = await waitForWidget();
    
    if (widget) {
      console.log('🎯 Widget encontrado! Simulando clique para abrir modal...');
      
      // Simular apenas um clique simples no widget para abrir o modal
      console.log('🎯 Simulando clique simples no widget...');
      console.log('🔍 Detalhes do widget antes do clique:', {
        tagName: widget.tagName,
        className: widget.className,
        id: widget.id,
        href: widget.getAttribute('href'),
        onclick: widget.onclick ? 'presente' : 'ausente',
        eventListeners: 'não detectável via JS'
      });
      
      // Tentar apenas o clique nativo primeiro
      widget.click();
      
      console.log('✅ Clique executado - aguardando resultado...');
      
      // Aguardar um pouco para ver se o modal aparece
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar se algum modal apareceu
      const modals = document.querySelectorAll('[class*="modal"], [class*="popup"], [class*="dialog"], [id*="modal"], [id*="popup"]');
      console.log(`🔍 Modais encontrados após clique: ${modals.length}`);
      modals.forEach((modal, index) => {
        const el = modal as HTMLElement;
        console.log(`📋 Modal ${index + 1}:`, {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          display: window.getComputedStyle(el).display,
          visibility: window.getComputedStyle(el).visibility,
          zIndex: window.getComputedStyle(el).zIndex
        });
      });
      
      // Tentar interceptar e prevenir o fechamento automático do modal
      const originalPreventDefault = Event.prototype.preventDefault;
      let modalCloseEvents = 0;
      
      // Interceptar eventos que podem fechar o modal
      const preventModalClose = (e: Event) => {
        modalCloseEvents++;
        console.log(`🚫 Tentativa ${modalCloseEvents} de fechar modal interceptada:`, e.type);
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Adicionar listeners para prevenir fechamento automático
      const eventsToPrevent = ['click', 'mousedown', 'keydown', 'blur'];
      eventsToPrevent.forEach(eventType => {
        document.addEventListener(eventType, preventModalClose, true);
      });
      
      // Remover os listeners após 2 segundos
      setTimeout(() => {
        eventsToPrevent.forEach(eventType => {
          document.removeEventListener(eventType, preventModalClose, true);
        });
        console.log('🔓 Proteção contra fechamento automático removida após 2 segundos');
      }, 2000);
      
      console.log('📝 Modal deve estar aberto para preenchimento dos dados do usuário');
      console.log('🛡️ Proteção contra fechamento automático ativada por 2 segundos');
      
      // Apenas abrir o modal - não fazer mais nada automaticamente
      // O próprio widget RDStation vai gerenciar o fluxo a partir daqui
      
    } else {
      console.log('❌ Widget RDStation não encontrado após aguardar');
      console.log('💡 Execute findAndLogWidget() no console para debug');
      console.log('📱 Usando fallback direto...');
      
      const whatsappUrl = 'https://wa.me/5521977294848?text=Gostaria%20de%20falar%20com%20um%20especialista%20em%20leil%C3%B5es';
      window.open(whatsappUrl, '_blank');
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar ação do WhatsApp:', error);
    // Fallback em caso de erro
    const whatsappUrl = 'https://wa.me/5521977294848?text=Gostaria%20de%20falar%20com%20um%20especialista%20em%20leil%C3%B5es';
    window.open(whatsappUrl, '_blank');
  }
};
