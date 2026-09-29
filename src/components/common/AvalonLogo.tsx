import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean; // kept for backwards prop compatibility, but tagline text is omitted
  className?: string;
  lightText?: boolean;
}

export const AvalonLogo: React.FC<Props> = ({
  size = 'md',
  className = '',
  lightText = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const textSizes = {
    sm: 'text-[15px]',
    md: 'text-[18px]',
    lg: 'text-[22px]',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Distinctive Avalon Geometric Apex Emblem (Original faceted chevron prism) */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
        >
          {/* Subtle outer geometric squircle shield */}
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="8"
            className="fill-slate-900 dark:fill-white"
          />
          {/* Clean faceted Avalon 'A' apex vectors */}
          <path
            d="M16 7L8 23H12.5L16 15.5L19.5 23H24L16 7Z"
            className="fill-white dark:fill-slate-900"
          />
          {/* Internal precision beam core */}
          <path
            d="M16 11.5L13.8 17.5H18.2L16 11.5Z"
            className="fill-indigo-400 dark:fill-indigo-600"
          />
          <circle
            cx="16"
            cy="14.5"
            r="1.2"
            className="fill-white dark:fill-slate-900"
          />
        </svg>
      </div>

      {/* Strictly 'Avalon' alone */}
      <span
        className={`${textSizes[size]} font-bold tracking-tight font-sans transition-colors ${
          lightText ? 'text-white' : 'text-[#0f172a] dark:text-white'
        }`}
      >
        Avalon
      </span>
    </div>
  );
};
