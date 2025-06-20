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
      className={`flex absolute ${positionClass} z-0 justify-center items-center bottom-[272px] h-[45px] min-h-[45px] w-[45px]`}
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