'use client';

import React from 'react';

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full ${className}`}
      style={{
        backgroundColor: '#6A5379',
        padding: 'clamp(16px, 4vw, 20px)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <p
          className="text-center text-sm sm:text-base"
          style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-lato), sans-serif',
          }}
        >
          © {currentYear} KONFEX. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

