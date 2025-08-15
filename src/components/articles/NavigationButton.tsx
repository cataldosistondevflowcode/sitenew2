import * as React from "react";

interface NavigationButtonProps {
  iconUrl: string;
  direction: "previous" | "next";
  onClick?: () => void;
}

export function NavigationButton({ iconUrl, direction, onClick }: NavigationButtonProps) {
  const positionClass = direction === "previous" ? "left-2.5" : "right-2.5";

  return (
    <button
      className={`flex absolute ${positionClass} z-10 justify-center items-center top-1/2 -translate-y-1/2 h-[45px] min-h-[45px] w-[45px] bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all duration-200 max-md:hidden`}
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous slide" : "Next slide"}
    >
      <div className="self-stretch my-auto min-h-[45px] w-[45px]">
        <div className="overflow-hidden w-full min-h-[45px]">
          <img
            src={iconUrl}
            className="object-contain w-full aspect-square"
            alt=""
          />
        </div>
      </div>
    </button>
  );
} 