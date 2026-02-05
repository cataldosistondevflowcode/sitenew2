import React from 'react';

export const YouTubeIcon: React.FC = () => {
  return (
    <img
      src="https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/e31888807ac0e2e4d00224790a076ac9216edea3?placeholderIfAbsent=true"
      className="hover:opacity-80 cursor-pointer transition-opacity"
      alt="YouTube"
      style={{ 
        width: '32px', 
        height: '32px', 
        objectFit: 'contain',
        aspectRatio: '1 / 1',
        flexShrink: 0
      }}
    />
  );
}; 