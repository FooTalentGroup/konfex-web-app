'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id?: number;
  email?: string;
  name?: string | null;
  role?: string;
}

export interface HeaderProps {
  onMenuClick?: () => void;
  onUserClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onUserClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = setTimeout(() => loadUser(), 0);

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'user') {
          loadUser();
        }
      };

      const handleUserUpdate = () => {
        setTimeout(() => {
          loadUser();
        }, 100);
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('userUpdated', handleUserUpdate);

      return () => {
        clearTimeout(id);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userUpdated', handleUserUpdate);
      };
    }
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuClick?.();
  };

  const handleUserClick = () => {
    onUserClick?.();
  };

  const userName = user?.name || user?.email || '';

  return (
    <header
      className="w-full flex items-center justify-between px-4 sm:px-6"
      style={{
        minHeight: '56px',
        backgroundColor: '#6A5379',
      }}
    >
      <button
        onClick={handleMenuClick}
        className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Abrir menú"
        aria-expanded={isMenuOpen}
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

      <div className="flex-1 flex justify-center">
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
        className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none"
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
