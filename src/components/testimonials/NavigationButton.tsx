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
  const ArrowIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={direction === "prev" ? "rotate-180" : ""}
    >
      <path 
        d="M9 18L15 12L9 6" 
        stroke="#D4AF37" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-12 h-12 rounded-full border border-yellow-600 hover:bg-yellow-50 transition-colors duration-200 ${className}`}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
    >
      <ArrowIcon />
    </button>
  );
}; 