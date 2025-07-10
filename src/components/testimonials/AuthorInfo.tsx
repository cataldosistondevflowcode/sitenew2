"use client";

interface AuthorInfoProps {
  name: string;
  title: string;
  className?: string;
}

export const AuthorInfo = ({ name, title, className = "" }: AuthorInfoProps) => {
  return (
    <div className={`flex flex-col gap-0 items-center self-stretch ${className}`}>
      <div className="h-[5px] w-[100px] max-sm:w-20 max-sm:h-1 bg-gradient-to-r from-yellow-600 to-yellow-500" />
      <h3 className="text-2xl leading-7 text-center text-zinc-800 max-md:text-xl max-md:leading-6 max-sm:text-lg max-sm:leading-5">
        {name}
      </h3>
      <p className="self-stretch text-base leading-5 text-center uppercase text-zinc-800 max-md:text-sm max-md:leading-4 max-sm:text-sm max-sm:leading-4">
        {title}
      </p>
    </div>
  );
}; 