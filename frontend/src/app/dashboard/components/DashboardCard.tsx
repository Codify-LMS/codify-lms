import React from 'react';
import { twMerge } from 'tailwind-merge';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        p-8
        rounded-4xl
        shadow-md
        border border-dashboard-border
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default DashboardCard;