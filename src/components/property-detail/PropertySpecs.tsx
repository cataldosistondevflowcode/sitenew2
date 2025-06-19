import React from 'react';

interface PropertySpec {
  label: string;
  value: string;
}

interface PropertySpecsProps {
  specs: PropertySpec[];
}

export const PropertySpecs: React.FC<PropertySpecsProps> = ({ specs }) => {
  return (
    <section className="flex gap-5 justify-between mt-7 max-w-full text-zinc-900 w-[469px]">
      <div className="flex gap-10 items-start">
        {specs.slice(0, 3).map((spec, index) => (
          <div key={index} className="flex flex-col whitespace-nowrap">
            <div className="self-start text-sm font-bold">
              {spec.label}
            </div>
            <div className="mt-3 text-lg">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
      {specs[3] && (
        <div className="self-start text-sm font-bold">
          {specs[3].label}
        </div>
      )}
    </section>
  );
}; 