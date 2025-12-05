"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./UserMenu";

export interface HeaderProps {
  onMenuClick?: () => void;
  onUserClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onUserClick }) => {
  const { userName } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuClick = () => {
    onMenuClick?.();
  };

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    onUserClick?.();
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className="w-full flex items-center px-4 sm:px-6 relative"
      style={{
        minHeight: "56px",
        backgroundColor: "#6A5379",
      }}
    >
      <button
        onClick={handleMenuClick}
        className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none w-10 h-10 shrink-0 relative z-10"
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

      <div className="relative ml-auto shrink-0 z-10">
        <button
          ref={userButtonRef}
          onClick={handleUserClick}
          className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label={`Perfil de ${userName || "usuario"}`}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
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
                color: "#FFFFFF",
                fontFamily: "var(--font-lato), sans-serif",
              }}
            >
              {userName}
            </span>
          )}
        </button>
        <UserMenu
          isOpen={isUserMenuOpen}
          onClose={handleCloseUserMenu}
          anchorRef={userButtonRef}
        />
      </div>
    </header>
  );
};

export default Header;
