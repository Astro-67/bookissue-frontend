import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} text-indigo-600`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V5H6.5C5.11929 5 4 6.11929 4 7.5V19.5Z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path
            d="M6.5 17H20V19H6.5C5.11929 19 4 17.8807 4 16.5V7.5C4 6.11929 5.11929 5 6.5 5H20V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 9H16M8 13H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Issue indicator - exclamation mark */}
          <circle cx="18" cy="6" r="2.5" fill="#EF4444" />
          <path d="M18 4.5V6.5M18 7.5H18.01" stroke="white" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>
            BookIssue
          </span>
          <span className="text-xs text-gray-500 -mt-1">
            Tracker
          </span>
        </div>
      )}
    </div>
  )
}
