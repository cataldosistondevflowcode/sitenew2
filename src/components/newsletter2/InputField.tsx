"use client";
import * as React from "react";

interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  className?: string;
  placeholder?: string;
  name?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  required = false,
  type = "text",
  className = "",
  placeholder = "",
  name = ""
}, ref) => {
  return (
    <div className={`flex flex-col text-base leading-none ${className}`}>
      <label className="self-start mb-2 text-sm sm:text-base font-medium">
        {label}{required && "*"}
      </label>
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full h-10 rounded-md border-2 border-yellow-600 border-solid px-3 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-sm sm:text-base"
        required={required}
      />
    </div>
  );
});

InputField.displayName = "InputField"; 