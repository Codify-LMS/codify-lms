import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number; // 0-100
  colorClass: string; // Tailwind class for fill color, e.g., 'bg-progress-bar-fill-web'
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass, className }) => {
  return (
    <div className={twMerge("w-full bg-progress-bar-bg rounded-full h-2.5", className)}>
      <div
        className={twMerge("h-2.5 rounded-full transition-all duration-300", colorClass)}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;