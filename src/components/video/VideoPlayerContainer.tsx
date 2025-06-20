import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { YouTubeSection } from './YouTubeSection';

const VideoPlayerContainer: React.FC = () => {
  return (
    <div className="flex relative gap-4 justify-center items-start pt-9 pr-5 pb-5 pl-4 min-h-[430px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/701a6185858d9b8c9a444791e97327cc9b488b37?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
        className="object-contain absolute inset-x-0 top-0 bottom-4 z-0 self-start aspect-[2.58] w-[1420px] max-md:max-w-full"
        alt="Background"
      />

      <div className="flex z-0 flex-col flex-1 shrink justify-center items-center py-12 my-auto w-full basis-0 min-w-60 max-md:max-w-full">
        <div className="flex flex-wrap gap-9 justify-center items-center px-4 max-w-full w-[960px]">
          <div className="grow shrink self-stretch pb-4 my-auto min-w-60 w-[465px] max-md:max-w-full">
            <VideoPlayer
              videoThumbnail="https://cdn.builder.io/api/v1/image/assets/TEMP/259bbc3e149de586edda2ff3e1d0c1f4702e1768?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
              overlayImage="https://cdn.builder.io/api/v1/image/assets/TEMP/dbc8a5c117d31eef507353a3feef76529db409ae?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
              channelAvatar="https://cdn.builder.io/api/v1/image/assets/TEMP/babbee62882b4ff7d155221c5f6b010feda0a5c7?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
              watchLaterIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/0f6216d038c4a7c86e22dd20ac354364f24a9dd9?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
              shareIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/812e199a879af9ca037d94b9bd1c583e5b0c326d?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
              youtubeLogoIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/878dc4fecf4542e803f24851af04cbe96d1b2e05?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a"
            />
          </div>

          <YouTubeSection youtubeIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/2913a0bbd0d9af04d57f6bbf998d4e03e1958577?placeholderIfAbsent=true&apiKey=ca38ae4db7a6428881f7c632440d043a" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerContainer; 