"use client";

import React from 'react';

interface VideoControlsProps {
  watchLaterIcon: string;
  shareIcon: string;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  watchLaterIcon,
  shareIcon
}) => {
  return (
    <div className="flex z-0 gap-5 items-start px-2.5 h-full">
      <button className="flex overflow-hidden flex-col items-center pt-1.5 w-20 max-w-20 min-w-12">
        <div className="flex flex-col justify-center w-9 min-h-9">
          <img
            src={watchLaterIcon}
            className="object-contain flex-1 w-full aspect-square"
            alt="Watch later"
          />
        </div>
        <span className="overflow-hidden w-20 text-sm font-medium leading-tight text-center text-zinc-100">
          Assistir m…
        </span>
      </button>

      <button className="flex overflow-hidden flex-col items-center pt-1.5 w-20 max-w-20 min-w-12">
        <div className="flex flex-col justify-center w-9 min-h-9">
          <img
            src={shareIcon}
            className="object-contain flex-1 w-full aspect-square"
            alt="Share"
          />
        </div>
        <span className="overflow-hidden w-20 text-sm font-medium leading-tight text-center whitespace-nowrap text-zinc-100">
          Compartilh…
        </span>
      </button>
    </div>
  );
}; 