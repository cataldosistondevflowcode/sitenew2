"use client";
import * as React from "react";
import { ContactInfo } from "./ContactInfo";
import { SocialLinks } from "./SocialLinks";

interface SocialBarProps {
  className?: string;
}

export const SocialBar: React.FC<SocialBarProps> = ({ className = "" }) => {
  return (
    <header
      className={`flex gap-2.5 items-start px-32 py-1.5 bg-blend-normal bg-neutral-700 max-md:px-5 ${className}`}
    >
      <div className="flex flex-wrap flex-1 shrink gap-5 justify-between pr-20 pl-4 w-full bg-blend-normal basis-0 min-w-60 max-md:pr-5 max-md:max-w-full">
        <ContactInfo />
        <SocialLinks />
      </div>
    </header>
  );
};

export default SocialBar; 