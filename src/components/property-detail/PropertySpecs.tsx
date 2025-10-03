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
    <section className="w-full max-w-full text-zinc-900 mt-7">
      {/* Layout para mobile - grid 2x2 */}
      <div className="grid grid-cols-2 gap-4 sm:hidden">
        {specs.map((spec, index) => (
          <div key={index} className="flex flex-col">
            <div className="text-xs sm:text-sm font-bold text-gray-600">
              {spec.label}
            </div>
            <div className="mt-1 text-sm sm:text-lg font-semibold">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Layout para desktop - horizontal */}
      <div className="hidden sm:flex gap-6 lg:gap-10 items-start justify-between">
        {specs.slice(0, 3).map((spec, index) => (
          <div key={index} className="flex flex-col">
            <div className="text-sm font-bold text-gray-600">
              {spec.label}
            </div>
            <div className="mt-3 text-lg font-semibold">
              {spec.value}
            </div>
          </div>
        ))}
        {specs[3] && (
          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-600">
              {specs[3].label}
            </div>
            <div className="mt-3 text-lg font-semibold">
              {specs[3].value}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}; 