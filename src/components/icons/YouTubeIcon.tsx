import React from 'react';

interface YouTubeIconProps {
  className?: string;
}

export const YouTubeIcon: React.FC<YouTubeIconProps> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '32px', height: '32px', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="youtubeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6d4403" />
          <stop offset="50%" stopColor="#b57309" />
          <stop offset="100%" stopColor="#d48d07" />
        </linearGradient>
      </defs>
      <path
        d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="url(#youtubeGradient)"
      />
    </svg>
  );
};
