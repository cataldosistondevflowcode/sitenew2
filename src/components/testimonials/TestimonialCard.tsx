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
    <article className={`flex flex-col h-full w-full max-w-[800px] justify-center ${className}`}>
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-3 items-start self-stretch">
          <div className="flex flex-col gap-0 items-start self-stretch">
            {content.slice(0, 2).map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-5 text-zinc-800 max-md:text-base max-md:leading-4 max-sm:text-base max-sm:leading-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {content.slice(2).map((paragraph, index) => (
            <p
              key={index + 2}
              className="self-stretch text-lg leading-5 text-zinc-800 max-md:text-base max-md:leading-4 max-sm:text-base max-sm:leading-4"
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