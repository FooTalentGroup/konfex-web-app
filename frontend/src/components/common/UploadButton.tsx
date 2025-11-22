'use client';

import React from 'react';

export interface UploadButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  label = 'Subir PDF',
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all hover:opacity-90 ${className}`}
      style={{
        backgroundColor: '#B65CF2',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#FEFCFF' }}
      >
        <path
          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-sm"
        style={{
          color: '#FEFCFF',
          fontFamily: 'var(--font-lato), sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '131%',
          letterSpacing: '0%',
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default UploadButton;

