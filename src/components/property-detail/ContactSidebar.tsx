import React from 'react';

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
}

export const ContactSidebar: React.FC<ContactSidebarProps> = ({ contactInfo }) => {
  return (
    <aside className="flex overflow-hidden flex-col items-center self-stretch pt-12 pb-7 m-auto w-full bg-white rounded-2xl shadow-sm max-md:mt-10">
      <div className="flex items-center justify-center bg-black aspect-square rounded-[200px] w-[200px] h-[200px] overflow-hidden">
        <img
          src="/assets/logos/cataldo-siston-round-logo.png"
          alt="Cataldo Siston Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="self-stretch px-1.5 pt-2 pb-6 mx-3 mt-8 text-3xl font-medium leading-tight text-center text-zinc-900 max-md:mx-2.5">
        CATALDO SISTON
      </h2>
      <div className="flex gap-2 mt-6 max-w-full text-base font-bold text-center text-zinc-900 w-[159px]">
        <img
          src={contactInfo.phoneIcon}
          alt="Phone"
          className="object-contain shrink-0 w-4 aspect-square"
        />
        <div className="grow shrink w-[133px]">
          {contactInfo.phone}
        </div>
      </div>
      <div className="flex gap-2 mt-5 max-w-full text-base font-bold text-center whitespace-nowrap text-zinc-900 w-[209px]">
        <img
          src={contactInfo.emailIcon}
          alt="Email"
          className="object-contain shrink-0 w-4 aspect-square"
        />
        <div className="grow shrink w-[183px]">
          {contactInfo.email.split('@')[0]}-
        </div>
      </div>
      <div className="mt-2 text-base font-bold text-center text-zinc-900">
        {contactInfo.email.split('@')[1]}
      </div>
      <div className="flex flex-col self-stretch px-3 mt-5 w-full text-center">
        <a
          href="#"
          className="flex gap-3.5 self-start py-1.5 text-base text-black rounded"
        >
          <img
            src={contactInfo.chatIcon}
            alt="Chat"
            className="object-contain shrink-0 w-6 aspect-square"
          />
          <span className="my-auto basis-auto">
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