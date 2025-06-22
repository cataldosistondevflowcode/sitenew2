import React from 'react';

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  className = ""
}) => {
  return (
    <header className={`flex justify-center items-center mb-4 w-full max-w-[930px] ${className}`}>
      <h2 className="flex flex-col justify-center text-5xl font-medium text-center leading-[52.8px] text-zinc-900 max-md:text-4xl max-md:leading-10 max-sm:text-3xl max-sm:leading-8">
        {children}
      </h2>
    </header>
  );
}; 