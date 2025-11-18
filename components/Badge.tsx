import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'emerald' | 'gray' | 'teal';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'emerald', className = '' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]} ${className}`}>
      {text}
    </span>
  );
};