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
        <img
          src={contactInfo.socialIcon}
          alt="Social media sharing"
          className="object-contain mt-6 aspect-[7.81] w-[266px]"
        />
      </div>
    </aside>
  );
}; 