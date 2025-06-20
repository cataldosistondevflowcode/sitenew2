import * as React from "react";

interface ArticleCardProps {
  imageUrl: string;
  title: string;
  description: string;
  readMoreIconUrl: string;
}

export function ArticleCard({ imageUrl, title, description, readMoreIconUrl }: ArticleCardProps) {
  return (
    <article className="flex flex-col grow shrink justify-center pr-2.5 min-w-60 w-[216px]">
      <div className="w-full bg-neutral-800 h-[527px] max-w-[260px] shadow-[0px_0px_8px_rgba(0,0,0,0.75)]">
        <div className="flex justify-center items-start w-full">
          <img
            src={imageUrl}
            className="object-contain flex-1 shrink w-full aspect-[1.33] basis-0 min-w-60"
            alt=""
          />
        </div>
        <div className="p-4 w-full">
          <h3 className="w-full text-lg font-medium leading-5 text-white">
            {title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>
          <div className="mt-4 w-full">
            <p className="w-full text-sm leading-6 text-white">
              {description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < description.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <div className="flex flex-col items-start mt-4 w-full">
              <div className="w-8 min-h-8">
                <div className="flex overflow-hidden flex-col justify-center items-center w-full min-h-8">
                  <img
                    src={readMoreIconUrl}
                    className="object-contain w-full aspect-square"
                    alt="Read more"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 