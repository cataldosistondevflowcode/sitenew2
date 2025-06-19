"use client";
import React from 'react';

interface ImageGalleryProps {
  mainImage: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex overflow-hidden relative flex-col flex-wrap gap-5 justify-between items-start px-3 py-20 mt-2 w-full text-2xl leading-10 text-yellow-600 whitespace-nowrap min-h-[271px] max-md:max-w-full">
      <img
        src={mainImage}
        alt="Property"
        className="object-cover absolute inset-0 size-full"
      />
      <button
        onClick={onPrevious}
        className="relative bg-transparent border-none text-yellow-600 cursor-pointer"
        aria-label="Previous image"
      >
        prev
      </button>
      <button
        onClick={onNext}
        className="relative bg-transparent border-none text-yellow-600 cursor-pointer"
        aria-label="Next image"
      >
        next
      </button>
    </div>
  );
}; 