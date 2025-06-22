import React from 'react';

interface CallToActionButtonProps {
  text: string;
  onClick?: () => void;
}

export const CallToActionButton: React.FC<CallToActionButtonProps> = ({
  text,
  onClick
}) => {
  return (
    <button
      className="flex justify-center items-center px-7 pt-4 pb-4 rounded-xl transition-all cursor-pointer duration-[0.3s] ease-[ease] h-[60px] w-[553px] max-md:w-full max-md:max-w-[500px] bg-[#d68e08] hover:bg-[#b8780a]"
      onClick={onClick}
    >
      <span className="text-xl leading-7 text-center text-white max-sm:text-lg max-sm:leading-7">
        {text}
      </span>
    </button>
  );
}; 