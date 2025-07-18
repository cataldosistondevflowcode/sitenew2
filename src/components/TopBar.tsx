import React from 'react';
import { 
  EmailIcon, 
  PhoneIcon, 
  FacebookIcon, 
  InstagramIcon, 
  YouTubeIcon 
} from './icons';

export const ContactInfo: React.FC = () => {
  return (
    <>
      <address className="absolute h-[26px] left-[15px] top-[3px] w-[316px] max-md:relative max-md:top-auto max-md:left-auto max-md:w-auto max-md:h-auto max-sm:w-full max-sm:text-center">
        <div className="flex absolute top-0 left-0 shrink-0 items-center py-0.5 pr-72 pl-0 h-[26px] w-[316px] max-sm:p-0 max-sm:w-full">
          <EmailIcon />
        </div>
        <a
          href="mailto:contato@cataldosiston-adv.com.br"
          className="absolute top-0.5 shrink-0 text-lg leading-7 text-white h-[22px] left-[30px] w-[286px] max-sm:left-0 max-sm:w-full max-sm:text-sm max-sm:top-[30px] hover:underline"
        >
          contato@cataldosiston-adv.com.br
        </a>
      </address>

      <address className="absolute h-[26px] left-[336px] top-[3px] w-[177px] max-md:relative max-md:top-auto max-md:left-auto max-md:w-auto max-md:h-auto max-sm:w-full max-sm:text-center">
        <div className="flex absolute top-0 left-0 shrink-0 items-center py-0.5 pr-40 pl-0 h-[26px] w-[177px] max-sm:p-0 max-sm:w-full">
          <PhoneIcon />
        </div>
        <a
          href="tel:+552131733795"
          className="absolute top-0.5 shrink-0 text-lg leading-7 text-white h-[22px] left-[30px] w-[147px] max-sm:left-0 max-sm:w-full max-sm:text-sm max-sm:top-[30px] hover:underline"
        >
          +55 (21) 3173-3795
        </a>
      </address>
    </>
  );
};

export const ContactButton: React.FC = () => {
  return (
    <a
      href="#contact"
      className="flex absolute top-0 gap-1 justify-center items-start pt-1.5 pr-2 pb-1 pl-1 rounded-md h-[31px] left-[517px] w-[139px] max-md:relative max-md:top-auto max-md:left-auto max-md:w-auto max-sm:p-2.5 max-sm:w-full max-sm:text-center hover:bg-neutral-600 transition-colors"
    >
      <span className="absolute h-5 text-base font-bold leading-6 text-white left-[29px] top-[7px] w-[103px] max-sm:left-2/4 max-sm:text-sm max-sm:-translate-x-2/4">
        Fale Conosco
      </span>
    </a>
  );
};

export const SocialMediaLinks: React.FC = () => {
  return (
    <nav
      className="flex absolute gap-2.5 justify-center items-start px-11 pt-0 pb-1.5 h-[42px] left-[1260px] top-[5px] w-[263px] max-md:relative max-md:top-auto max-md:left-auto max-md:gap-4 max-md:px-0 max-md:py-2.5 max-md:w-auto max-sm:flex-wrap max-sm:gap-5"
      aria-label="Social media links"
    >
      <a
        href="https://www.facebook.com/cataldosistonadvogados/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex absolute top-0 left-11 shrink-0 justify-center items-center w-9 h-9 max-md:relative max-md:top-auto max-md:left-auto hover:opacity-80 transition-opacity"
        aria-label="Facebook"
      >
        <div className="flex absolute top-0 left-0 shrink-0 justify-center items-center px-0 py-0.5 w-9 h-9">
          <FacebookIcon />
        </div>
      </a>

      <a
        href="https://www.instagram.com/cataldosiston.advogados/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex absolute top-0 shrink-0 justify-center items-center w-9 h-9 left-[90px] max-md:relative max-md:top-auto max-md:left-auto hover:opacity-80 transition-opacity"
        aria-label="Instagram"
      >
        <div className="flex absolute top-0 left-0 shrink-0 justify-center items-center px-0 py-0.5 w-9 h-9">
          <InstagramIcon />
        </div>
      </a>

      <a
        href="https://www.youtube.com/channel/UCldbgxJU1D9h3U6Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
        target="_blank"
        rel="noopener noreferrer"
        className="flex absolute top-0 shrink-0 justify-center items-center w-9 h-9 left-[136px] max-md:relative max-md:top-auto max-md:left-auto hover:opacity-80 transition-opacity"
        aria-label="YouTube"
      >
        <div className="flex absolute top-0 left-0 shrink-0 justify-center items-center px-0 py-0.5 w-9 h-9">
          <YouTubeIcon />
        </div>
      </a>
    </nav>
  );
};

export const TopBar: React.FC = () => {
  return (
    <header className="flex relative items-center p-0 w-full bg-neutral-700 h-[47px] max-md:px-0 max-md:py-2.5 max-md:h-auto max-sm:px-0 max-sm:py-4">
      <div className="flex absolute gap-1 items-end mx-auto max-w-none h-[31px] left-[375px] top-[11px] w-[878px] max-md:relative max-md:top-auto max-md:left-auto max-md:flex-col max-md:gap-4 max-md:items-center max-md:px-5 max-md:py-0 max-md:w-full max-md:max-w-[991px] max-sm:gap-5 max-sm:px-4 max-sm:py-0 max-sm:max-w-screen-sm">
        <ContactInfo />
        <ContactButton />
      </div>
      <SocialMediaLinks />
    </header>
  );
};
