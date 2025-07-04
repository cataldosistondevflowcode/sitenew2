import React from 'react';
import { 
  EmailIcon, 
  PhoneIcon, 
  FacebookIcon, 
  InstagramIcon, 
  JusticeIcon, 
  YouTubeIcon,
  WhatsAppIcon
} from './icons';

export const ContactInfo: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6 w-full sm:w-auto">
      <address className="flex items-center gap-2 text-center sm:text-left">
        <div className="flex-shrink-0">
          <EmailIcon />
        </div>
        <a
          href="mailto:contato@cataldosiston-adv.com.br"
          className="text-sm sm:text-base lg:text-lg text-white hover:underline transition-colors truncate"
        >
          contato@cataldosiston-adv.com.br
        </a>
      </address>

      <address className="flex items-center gap-2 text-center sm:text-left">
        <div className="flex-shrink-0">
          <PhoneIcon />
        </div>
        <a
          href="tel:+552131733795"
          className="text-sm sm:text-base lg:text-lg text-white hover:underline transition-colors"
        >
          +55 (21) 3173-3795
        </a>
      </address>
    </div>
  );
};

interface ContactButtonProps {
  onWhatsAppClick?: () => void;
}

export const ContactButton: React.FC<ContactButtonProps> = ({ onWhatsAppClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onWhatsAppClick) {
      onWhatsAppClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 justify-center px-3 py-2 rounded-md bg-transparent hover:bg-neutral-600 transition-colors min-h-[44px] w-full sm:w-auto cursor-pointer"
    >
      <div className="flex-shrink-0 w-5 h-5">
        <WhatsAppIcon />
      </div>
      <span className="text-sm sm:text-base font-bold text-white">
        Fale Conosco
      </span>
    </button>
  );
};

export const SocialMediaLinks: React.FC = () => {
  return (
    <nav
      className="flex gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto"
      aria-label="Social media links"
    >
      <a
        href="https://facebook.com/cataldosiston"
        className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity rounded-full hover:bg-neutral-600"
        aria-label="Facebook"
      >
        <FacebookIcon />
      </a>

      <a
        href="https://instagram.com/cataldosiston"
        className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity rounded-full hover:bg-neutral-600"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>

      <a
        href="#justice"
        className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity rounded-full hover:bg-neutral-600"
        aria-label="Portal da Justiça"
      >
        <JusticeIcon />
      </a>

      <a
        href="https://youtube.com/@cataldosiston"
        className="flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity rounded-full hover:bg-neutral-600"
        aria-label="YouTube"
      >
        <YouTubeIcon />
      </a>
    </nav>
  );
};

interface SocialBarProps {
  onWhatsAppClick?: () => void;
}

export const SocialBar: React.FC<SocialBarProps> = ({ onWhatsAppClick }) => {
  return (
    <header className="w-full bg-neutral-700 py-2 sm:py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto">
            <ContactInfo />
            <ContactButton onWhatsAppClick={onWhatsAppClick} />
          </div>
          <SocialMediaLinks />
        </div>
      </div>
    </header>
  );
};

export default SocialBar;  