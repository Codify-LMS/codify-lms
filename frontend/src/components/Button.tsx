import { twMerge } from "tailwind-merge";
import React, { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({className, children, disabled, type = 'button', ...props}, ref) => {
  return (
    <button
      type={type}
      ref={ref}
      disabled={disabled}
      {...props}
      className={twMerge(
        `
        rounded-lg
        bg-[#050772]
        text-white
        font-semibold
        py-4 
        px-6 
        border-transparent 
        hover:opacity-80 
        hover:cursor-pointer
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        className
      )}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;