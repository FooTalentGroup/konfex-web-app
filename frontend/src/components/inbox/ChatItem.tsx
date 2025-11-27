'use client';

import React from 'react';
import Image from 'next/image';

export interface ChatItemProps {
  id: number;
  avatar?: string;
  nombre: string;
  mensaje: string;
  hora: string;
  plataforma: 'instagram' | 'whatsapp';
  tienePresupuesto?: boolean;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  avatar,
  nombre,
  mensaje,
  hora,
  plataforma,
  tienePresupuesto = false,
  onClick,
}) => {
  const getPlataformaStyles = () => {
    switch (plataforma) {
      case 'instagram':
        return {
          bg: '#FEE7EE',
          borderColor: '#FDCEDC',
          icon: (
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={12}
              height={12}
              className="object-contain"
            />
          ),
        };
      case 'whatsapp':
        return {
          bg: '#D8F3E4',
          icon: (
            <Image
              src="/whatsapp.png"
              alt="WhatsApp"
              width={12}
              height={12}
              className="object-contain"
            />
          ),
        };
    }
  };

  const plataformaStyles = getPlataformaStyles();

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 rounded-lg transition-all text-left mb-2"
      style={{
        backgroundColor: '#FEFCFF',
        border: '1px solid transparent',
        boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F3F0F5';
        e.currentTarget.style.borderColor = '#D5A1F7';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#FEFCFF';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="flex-shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={nombre}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span
            className="font-semibold truncate"
            style={{
              fontFamily: 'var(--font-lato), sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#000000',
            }}
          >
            {nombre}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Image
              src="/reloj.png"
              alt="Reloj"
              width={14}
              height={14}
              className="object-contain"
            />
            <span
              style={{
                fontFamily: 'var(--font-lato), sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '131%',
                letterSpacing: '0%',
                color: '#000000',
              }}
            >
              {hora}
            </span>
          </div>
        </div>

        <p
          className="mb-2 truncate"
          style={{
            fontFamily: 'var(--font-lato), sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '131%',
            letterSpacing: '0%',
            color: '#000000',
          }}
        >
          {mensaje}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="rounded-lg flex items-center"
            style={{
              backgroundColor: plataformaStyles.bg,
              border: plataforma === 'instagram' ? '1px solid #FDCEDC' : 'none',
              borderRadius: '12px',
              paddingTop: '2px',
              paddingRight: '6px',
              paddingBottom: '2px',
              paddingLeft: '6px',
              gap: '6px',
              fontFamily: 'var(--font-lato), sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#000000',
            }}
          >
            {plataformaStyles.icon}
            {plataforma === 'instagram' ? 'Instagram' : 'WhatsApp'}
          </span>

          {tienePresupuesto && (
            <span
              className="flex items-center"
              style={{
                backgroundColor: '#F7D8A1',
                color: '#000000',
                fontFamily: 'var(--font-lato), sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '131%',
                letterSpacing: '0%',
                borderRadius: '12px',
                paddingTop: '2px',
                paddingRight: '6px',
                paddingBottom: '2px',
                paddingLeft: '6px',
                gap: '6px',
              }}
            >
              <Image
                src="/presupuestos.png"
                alt="Presupuesto"
                width={12}
                height={12}
                className="object-contain"
              />
              Presupuesto
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatItem;

