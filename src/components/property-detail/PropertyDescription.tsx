import React from 'react';

interface Tag {
  label: string;
  color: 'yellow' | 'green';
}

interface PropertyDescriptionProps {
  tags: Tag[];
  descriptions: string[];
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  tags,
  descriptions
}) => {
  return (
    <section>
      <h2 className="mt-6 text-3xl font-medium leading-tight text-zinc-900">
        Descrição
      </h2>
      <div className="flex gap-4 mt-3 text-base font-bold text-white">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`px-1.5 py-2.5 whitespace-nowrap rounded ${
              tag.color === 'yellow' ? 'bg-yellow-600' : 'bg-green-500'
            }`}
          >
            {tag.label}
          </div>
        ))}
      </div>
      {descriptions.map((description, index) => (
        <p
          key={index}
          className="mt-7 text-lg leading-7 text-zinc-900 max-md:max-w-full"
        >
          {description}
        </p>
      ))}
    </section>
  );
}; 