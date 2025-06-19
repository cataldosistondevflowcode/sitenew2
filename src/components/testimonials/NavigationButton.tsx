"use client";

interface NavigationButtonProps {
  direction: "prev" | "next";
  onClick?: () => void;
  className?: string;
}

export const NavigationButton = ({
  direction,
  onClick,
  className = ""
}: NavigationButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-5 h-[30px] max-sm:w-auto max-sm:h-auto ${className}`}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
    >
      <span className="text-base leading-8 text-yellow-600">
        {direction}
      </span>
    </button>
  );
}; 