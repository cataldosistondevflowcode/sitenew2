import React, { useRef, useEffect } from 'react';

interface ContactInfo {
  phone: string;
  email: string;
  phoneIcon: string;
  emailIcon: string;
  chatIcon: string;
  socialIcon: string;
}

interface ContactSidebarProps {
  contactInfo: ContactInfo;
  onTripleClick?: () => void;
}

export const ContactSidebar: React.FC<ContactSidebarProps> = ({ contactInfo, onTripleClick }) => {
  const whatsAppUrl = "https://api.whatsapp.com/send/?phone=5521977294848&text=Gostaria+de+saber+mais+sobre+o+im%C3%B3vel+em+leil%C3%A3o&type=phone_number&app_absent=0";

  // Triple click functionality
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleImageClick = () => {
    clickCountRef.current++;
    console.log(`Click ${clickCountRef.current}/3 no círculo do Cataldo Siston`);
    
    if (clickCountRef.current === 3) {
      console.log('🎯 TRIPLE CLICK DETECTADO! Ativando debug...');
      
      // Animação visual
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
      
      if (onTripleClick) {
        onTripleClick();
      }
      clickCountRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }
    
    // Reset click count after 500ms if not triple clicked
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      timeoutRef.current = null;
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <aside className="flex overflow-hidden flex-col items-center self-stretch pt-12 pb-7 m-auto w-full bg-white rounded-2xl shadow-sm max-md:mt-10">
      <div 
        className={`flex items-center justify-center bg-white border-2 border-gray-200 aspect-square rounded-[200px] w-[200px] h-[200px] overflow-hidden cursor-pointer hover:border-gray-300 transition-all duration-300 ${
          isAnimating ? 'border-green-500 shadow-lg shadow-green-200 scale-105' : ''
        }`}
        onClick={handleImageClick}
        title="Clique 3x para ativar debug da página (?debug=true)"
      >
        <img
          src="/imagem-padrao.webp"
          alt="Cataldo Siston Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="self-stretch px-1.5 pt-2 pb-6 mx-3 mt-8 text-3xl font-medium leading-tight text-center text-zinc-900 max-md:mx-2.5">
        CATALDO SISTON
      </h2>
      <div className="flex gap-2 items-start mt-6 max-w-full text-base font-bold text-zinc-900 w-full px-3">
        <img
          src={contactInfo.emailIcon}
          alt="Email"
          className="object-contain shrink-0 w-4 h-4 mt-0.5"
        />
        <div className="grow text-left leading-tight whitespace-nowrap">
          {contactInfo.email}
        </div>
      </div>
      <div className="flex flex-col self-stretch px-3 mt-5 w-full text-center">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3.5 justify-center items-center py-4 px-6 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-[#d68e08] via-[#e6a010] to-[#d68e08] hover:from-[#b8780a] hover:via-[#c8920e] hover:to-[#b8780a] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          data-lov-id="src\components\property-detail\ContactSidebar.tsx:20:8"
        >
          <img
            src={contactInfo.chatIcon}
            alt="WhatsApp"
            className="object-contain shrink-0 w-6 h-6 filter brightness-0 invert"
          />
          <span className="uppercase tracking-wide">
            Fale com nossos advogados
          </span>
        </a>
        <h3 className="self-center mt-5 text-2xl font-medium leading-tight text-zinc-900">
          COMPARTILHAR
        </h3>
        <div className="flex gap-5 justify-center mt-6">
          {/* WhatsApp */}
          <a 
            href="#" 
            aria-label="Compartilhar no WhatsApp" 
            className="icon"
            onClick={(e) => {
              e.preventDefault();
              const currentUrl = window.location.href;
              const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`;
              window.open(whatsappUrl, '_blank');
            }}
            style={{
              width: '40px',
              height: '40px',
              display: 'grid',
              placeItems: 'center',
              color: '#c69200',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                fill="currentColor" 
              />
            </svg>
          </a>

          {/* E‑mail */}
          <a 
            href="#" 
            aria-label="Compartilhar por E-mail" 
            className="icon"
            onClick={(e) => {
              e.preventDefault();
              const currentUrl = window.location.href;
              const subject = encodeURIComponent('Confira este imóvel em leilão');
              const body = encodeURIComponent(`Olá!\n\nEncontrei este imóvel em leilão que pode te interessar:\n\nVeja mais detalhes: ${currentUrl}\n\nAbraços!`);
              const emailUrl = `mailto:?subject=${subject}&body=${body}`;
              window.location.href = emailUrl;
            }}
            style={{
              width: '40px',
              height: '40px',
              display: 'grid',
              placeItems: 'center',
              color: '#c69200',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
                fill="currentColor" 
              />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}; 