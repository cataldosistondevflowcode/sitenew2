"use client";
import * as React from "react";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from './icons';

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
        href="https://www.facebook.com/cataldosistonadvogados/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="hover:opacity-80 transition-opacity"
      >
        <FacebookIcon className="shrink-0 w-9 h-9" />
      </a>
      <a
        href="https://www.instagram.com/cataldosiston.advogados/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="hover:opacity-80 transition-opacity"
      >
        <InstagramIcon className="shrink-0 w-9 h-9" />
      </a>
      <a
        href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        className="hover:opacity-80 transition-opacity"
      >
        <YouTubeIcon className="shrink-0 w-9 h-9" />
      </a>
    </nav>
  );
}; 