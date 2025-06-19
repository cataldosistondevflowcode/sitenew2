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
    <article className={`flex flex-col gap-10 items-center flex-[1_0_0] max-md:gap-8 max-sm:gap-6 ${className}`}>
      <div className="flex flex-col gap-4 items-start self-stretch">
        <div className="flex flex-col gap-0 items-start self-stretch">
          {content.slice(0, 2).map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-7 text-zinc-800 max-md:text-base max-md:leading-6 max-sm:text-base max-sm:leading-6"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {content.slice(2).map((paragraph, index) => (
          <p
            key={index + 2}
            className="self-stretch text-lg leading-7 text-zinc-800 max-md:text-base max-md:leading-6 max-sm:text-base max-sm:leading-6"
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
    </article>
  );
}; 