"use client";
import * as React from "react";

interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  className?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  type = "text",
  className = "",
  placeholder = ""
}) => {
  return (
    <div className={`flex flex-col text-base leading-none ${className}`}>
      <label className="self-start mb-3">
        {label}{required && "*"}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="h-10 rounded-md border border-yellow-600 border-solid px-3 bg-transparent text-white placeholder-gray-300"
        required={required}
      />
    </div>
  );
}; 