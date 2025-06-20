"use client";

import React from 'react';
import { VideoControls } from './VideoControls';

interface VideoPlayerProps {
  videoThumbnail: string;
  overlayImage: string;
  channelAvatar: string;
  watchLaterIcon: string;
  shareIcon: string;
  youtubeLogoIcon: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoThumbnail,
  overlayImage,
  channelAvatar,
  watchLaterIcon,
  shareIcon,
  youtubeLogoIcon
}) => {
  return (
    <figure className="flex flex-col justify-center py-px w-full max-md:max-w-full">
      <div className="flex flex-col justify-center bg-black min-h-[402px] max-md:max-w-full">
        <div className="overflow-hidden flex-1 w-full bg-black max-md:max-w-full">
          <div className="flex relative flex-col py-1 w-full min-h-[402px] max-md:max-w-full">
            <img
              src={videoThumbnail}
              className="object-cover absolute inset-0 size-full"
              alt="Video thumbnail"
            />

            <div className="flex relative flex-col px-3 pb-10 w-full min-h-[99px] max-md:max-w-full">
              <img
                src={overlayImage}
                className="object-cover absolute inset-0 size-full"
                alt="Video overlay"
              />

              <div className="flex relative w-full max-md:max-w-full">
                <div className="flex overflow-hidden z-0 flex-1 shrink justify-center h-full text-lg leading-tight basis-5 min-h-[52px] min-w-60 text-zinc-100">
                  <div className="overflow-hidden flex-1 shrink pt-5 pl-12 w-full basis-0 max-w-[364px] min-w-60">
                    <div className="overflow-hidden w-full">
                      Entrevista CJC - Leilão de imóv…
                    </div>
                  </div>
                </div>

                <div className="flex overflow-hidden absolute z-0 items-start self-start p-1.5 rounded-3xl bottom-[3px] h-[50px] left-[-5px] min-h-[50px] w-[50px]">
                  <img
                    src={channelAvatar}
                    className="object-contain w-10 rounded-3xl aspect-square"
                    alt="Channel avatar"
                  />
                </div>

                <VideoControls
                  watchLaterIcon={watchLaterIcon}
                  shareIcon={shareIcon}
                />
              </div>
            </div>

            <a
              href="#"
              className="relative mt-64 max-w-full rounded-none bg-neutral-900 bg-opacity-80 min-h-[47px] w-[181px] max-md:mt-10"
            >
              <div className="flex gap-2.5 items-start px-3 pt-4 w-full">
                <span className="flex-1 shrink text-base font-medium leading-none text-white basis-0">
                  Assistir no
                </span>
                <div className="flex flex-col justify-center min-h-4 w-[72px]">
                  <img
                    src={youtubeLogoIcon}
                    className="object-contain flex-1 aspect-[4.5] w-[72px]"
                    alt="YouTube logo"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </figure>
  );
}; 