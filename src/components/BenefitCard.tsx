import React from 'react';

interface BenefitCardProps {
  number: string;
  title: string;
  hasGradient?: boolean;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  number,
  title,
  hasGradient = false
}) => {
  return (
    <article className="flex relative flex-col items-center px-7 pt-3 pb-14 h-[181px] w-[287px] max-sm:w-full max-sm:max-w-[287px] bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-5 text-4xl text-center text-yellow-600 leading-[54px]">
        {number}
      </div>
      <p className="flex flex-col justify-center text-lg leading-7 text-center text-zinc-900 max-sm:text-base max-sm:leading-6">
        {title.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < title.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
      {hasGradient && (
        <div className="absolute bottom-0 left-0 h-8 w-[287px] bg-gradient-to-t from-yellow-100 to-transparent rounded-b-lg" />
      )}
    </article>
  );
}; 