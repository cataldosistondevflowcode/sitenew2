"use client";

import { AuthorInfo } from "./AuthorInfo";

interface TestimonialCardProps {
  content: string[];
  authorName: string;
  authorTitle: string;
  className?: string;
}

export const TestimonialCard = ({
  content,
  authorName,
  authorTitle,
  className = ""
}: TestimonialCardProps) => {
  return (
    <article className={`flex flex-col h-full w-full max-w-[800px] justify-center overflow-hidden ${className}`}>
      <div className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-full overflow-hidden px-2 sm:px-0">
        <div className="flex flex-col gap-2 sm:gap-3 items-start self-stretch w-full max-w-full overflow-hidden">
          <div className="flex flex-col gap-0 items-start self-stretch w-full max-w-full">
            {content.slice(0, 2).map((paragraph, index) => (
              <p
                key={index}
                className="text-sm sm:text-base md:text-lg leading-5 sm:leading-5 text-zinc-800 break-words w-full max-w-full"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {content.slice(2).map((paragraph, index) => (
            <p
              key={index + 2}
              className="self-stretch text-sm sm:text-base md:text-lg leading-5 sm:leading-5 text-zinc-800 break-words w-full max-w-full"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <AuthorInfo
          name={authorName}
          title={authorTitle}
          className="gap-0"
        />
      </div>
    </article>
  );
}; 