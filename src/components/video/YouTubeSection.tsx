import React from 'react';

interface YouTubeSectionProps {
  youtubeIcon: string;
}

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({
  youtubeIcon
}) => {
  return (
    <section className="grow shrink self-stretch my-auto min-w-60 w-[286px]">
      <figure className="flex flex-col items-start w-full max-w-[358px]">
        <div className="flex overflow-hidden items-start w-11">
          <div className="flex overflow-hidden flex-col justify-center items-center w-11 h-[37px]">
            <img
              src={youtubeIcon}
              className="object-contain w-full aspect-[1.19]"
              alt="YouTube"
            />
          </div>
        </div>
      </figure>

      <h2 className="mt-4 w-full text-xl font-medium leading-6 text-zinc-900">
        Conﬁra a entrevista do advogado
        <br />
        <span style={{fontWeight: 700, color: 'rgba(214,142,8,1)'}}>
          Raphael Cataldo Siston
        </span>{" "}
        sobre leilões de
        <br />
        imóveis
      </h2>

      <div className="flex flex-wrap items-center mt-4 w-full text-xl text-center text-yellow-600">
        <div className="self-stretch my-auto">
          <a
            href="https://www.youtube.com/watch?v=IssSNAzj4ag&t=1s"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 pr-5 pl-4 rounded-full border border-yellow-600 border-solid"
          >
            Assista na íntegra
          </a>
        </div>
      </div>
    </section>
  );
}; 