import React from 'react';

interface VideoCardProps {
  phase: string;
  videoTitle: string;
  description: string;
  playButtonSvg: string;
  menuIconSvg: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  phase,
  videoTitle,
  description,
  playButtonSvg,
  menuIconSvg
}) => {
  return (
    <article className="flex flex-col w-[287px] max-sm:w-full max-sm:max-w-[287px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <header className="flex justify-center items-center h-[70px] w-full bg-[#d68e08]">
        <h3 className="text-base font-bold leading-5 text-center text-white uppercase">
          {phase}
        </h3>
      </header>

      <figure className="flex justify-center items-center mb-5 h-[161px] w-full max-sm:w-full max-sm:max-w-[287px]">
        <div className="flex justify-center items-center bg-black h-[161px] w-full max-sm:w-full max-sm:max-w-[287px]">
          <div className="relative bg-black h-[161px] w-full max-sm:w-full max-sm:max-w-[287px]">
            <img
              src="https://via.placeholder.com/287x99/333333/ffffff?text=Video+Thumbnail"
              alt="Video Thumbnail"
              className="absolute top-0 left-0 h-[99px] w-full max-sm:w-full max-sm:max-w-[287px]"
            />

            <div className="inline-flex absolute top-0 left-3 justify-end items-center pt-5 pr-0 pb-2 pl-12 h-[52px] w-[215px]">
              <div className="flex absolute justify-center items-center pt-px pr-0.5 pb-0.5 pl-0 left-[50px] top-[21px]">
                <div className="text-lg leading-6 text-zinc-100">
                  {videoTitle}
                </div>
              </div>
            </div>

            <div className="flex absolute top-0 right-3 flex-col justify-end items-center px-1.5 pt-4 pb-0 w-12 opacity-90 h-[52px]">
              <div>
                <div dangerouslySetInnerHTML={{ __html: menuIconSvg }} />
              </div>
            </div>

            <div className="flex absolute justify-center items-center p-1.5 rounded-3xl h-[50px] left-[7px] top-[7px] w-[50px]">
              <img
                src="https://via.placeholder.com/40x40/d68e08/ffffff?text=Logo"
                alt="Channel Logo"
                className="w-10 h-10 rounded-3xl"
              />
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div dangerouslySetInnerHTML={{ __html: playButtonSvg }} />
            </div>
          </div>
        </div>
      </figure>

      <p className="flex flex-col justify-center text-lg leading-7 text-center text-zinc-900 max-sm:text-base max-sm:leading-6 px-4 pb-4">
        {description.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < description.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    </article>
  );
}; 