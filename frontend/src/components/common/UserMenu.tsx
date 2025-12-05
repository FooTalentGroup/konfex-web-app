'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, userName } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Verificar que el click no sea en el elemento anchor
        if (anchorRef?.current && anchorRef.current.contains(event.target as Node)) {
          return;
        }
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (isOpen && menuRef.current && anchorRef?.current) {
      // Posicionar el menú cerca del elemento anchor
      const rect = anchorRef.current.getBoundingClientRect();
      const menu = menuRef.current;
      
      // Posición por defecto: debajo del botón, alineado a la derecha
      menu.style.position = 'fixed';
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.right = `${window.innerWidth - rect.right}px`;
      menu.style.left = 'auto';
      menu.style.transform = 'none';
    }
  }, [isOpen, anchorRef]);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg py-2 min-w-[200px]"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              <Image
                src="/avatar.png"
                alt="Avatar de usuario"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-sm font-semibold text-gray-900 truncate"
                style={{
                  fontFamily: 'var(--font-lato), sans-serif',
                }}
              >
                {userName || 'Usuario'}
              </span>
              {user?.email && (
                <span
                  className="text-xs text-gray-500 truncate"
                  style={{
                    fontFamily: 'var(--font-lato), sans-serif',
                  }}
                >
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors"
            style={{
              fontFamily: 'var(--font-lato), sans-serif',
              color: '#1A151E',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenu;

