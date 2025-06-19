import React from 'react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    isActive?: boolean;
  }>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex gap-1.5 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex gap-0.5">
          <span className={item.isActive ? "text-yellow-600" : "text-zinc-900"}>
            {item.label}
          </span>
          {index < items.length - 1 && (
            <span className="text-zinc-900"> /</span>
          )}
        </div>
      ))}
    </nav>
  );
}; 