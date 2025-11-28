'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export interface HeaderProps {
  onMenuClick?: () => void;
  onUserClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onUserClick,
}) => {
  const { userName } = useAuth();

  const handleMenuClick = () => {
    onMenuClick?.();
  };

  const handleUserClick = () => {
    onUserClick?.();
  };

  return (
    <header
      className="w-full flex items-center px-4 sm:px-6 relative"
      style={{
        minHeight: '56px',
        backgroundColor: '#6A5379',
      }}
    >
      <button
        onClick={handleMenuClick}
        className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none w-10 h-10 flex-shrink-0 relative z-10"
        aria-label="Abrir menú"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex-1 flex justify-center items-center absolute left-0 right-0 pointer-events-none z-0">
        <Image
          src="/image.png"
          alt="KONFEX Logo"
          width={120}
          height={40}
          className="object-contain"
          priority
        />
      </div>

      <button
        onClick={handleUserClick}
        className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none ml-auto flex-shrink-0 relative z-10"
        aria-label={`Perfil de ${userName || 'usuario'}`}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src="/avatar.png"
            alt="Avatar de usuario"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        {userName && (
          <span
            className="ml-2 text-sm text-white"
            style={{
              color: '#FFFFFF',
              fontFamily: 'var(--font-lato), sans-serif',
            }}
          >
            {userName}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
