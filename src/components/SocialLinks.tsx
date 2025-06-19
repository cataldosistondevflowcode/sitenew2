"use client";
import * as React from "react";

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = "" }) => {
  return (
    <nav
      className={`flex gap-2.5 items-start pb-1.5 pl-20 bg-blend-normal min-h-[42px] ${className}`}
      aria-label="Social media links"
    >
      <a
        href="#"
        aria-label="Social media link 1"
        className="hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3184a957e3adf3afd7d1dbf7234f1d24816a5e18?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Social media icon"
          className="object-contain shrink-0 w-9 bg-blend-normal aspect-square"
        />
      </a>
      <a
        href="#"
        aria-label="Social media link 2"
        className="hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/739b4f964e70b09896d6a0c04116737a34e70fe3?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Social media icon"
          className="object-contain shrink-0 w-9 bg-blend-normal aspect-square"
        />
      </a>
      <a
        href="#"
        aria-label="Social media link 3"
        className="hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4365d654c84abc0462c1a408d4c557a91358a3a7?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
          alt="Social media icon"
          className="object-contain shrink-0 w-9 bg-blend-normal aspect-square"
        />
      </a>
    </nav>
  );
}; 