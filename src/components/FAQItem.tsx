"use client";
import * as React from "react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer?: string;
  iconSrc: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer, iconSrc }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-yellow-600 border-solid max-md:max-w-full mt-8 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
      <div 
        className="flex flex-wrap gap-5 justify-between px-4 py-4 cursor-pointer hover:bg-white/10 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="max-md:max-w-full text-lg font-medium">
          {question}
        </div>
        <img
          src={iconSrc}
          alt={isExpanded ? "Collapse FAQ" : "Expand FAQ"}
          className={`object-contain shrink-0 self-start aspect-square w-[30px] transition-transform ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      
      {isExpanded && answer && (
        <div className="px-4 pb-4 text-base text-gray-200 border-t border-yellow-600/30">
          <p className="mt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}; 