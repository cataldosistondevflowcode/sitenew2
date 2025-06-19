import React from 'react';

interface PropertyHeaderProps {
  title: string;
  address: string;
  locationIcon: string;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  address,
  locationIcon
}) => {
  return (
    <header>
      <h1 className="self-stretch mt-7 text-5xl font-medium leading-tight text-zinc-900 max-md:max-w-full">
        {title}
      </h1>
      <div className="flex gap-0.5 mt-2 text-lg text-zinc-900">
        <img
          src={locationIcon}
          alt="Location"
          className="object-contain shrink-0 my-auto w-4 aspect-square"
        />
        <div className="grow shrink-0 px-2.5 py-2.5 rounded-lg border border-yellow-600 border-solid basis-0 w-fit">
          {address}
        </div>
      </div>
    </header>
  );
}; 