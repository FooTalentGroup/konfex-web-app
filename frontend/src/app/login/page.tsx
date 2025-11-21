'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useLogin } from '@/hooks/useLogin';

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { register, handleSubmit, errors, isLoading, error, onSubmit } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-2 sm:p-4">
      <div className="rounded-2xl shadow-lg overflow-hidden flex flex-col w-full max-w-[430px] bg-[#F3F0F5] pb-10">
        <div className="relative w-full overflow-hidden h-[400px] min-h-[400px]">
          <Image
            src="/logo.png"
            alt="KONFEX Logo"
            fill
            className="object-cover"
            priority
            sizes="430px"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-[40px] pt-6 sm:pt-8 pb-4 bg-[#F3F0F5]">
          <h2 
            className="mb-6 sm:mb-8 mt-4 w-full max-w-[390px]"
            style={{
              minHeight: '42px',
              fontFamily: 'var(--font-lato), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#B65CF2',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Iniciá tu sesión
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[390px] space-y-6">
            <Input
              id="usuario"
              label="Usuario"
              type="text"
              placeholder="luciana@gmail.com"
              register={register('usuario', {
                required: 'El usuario es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Debe ser un email válido',
                },
              })}
              error={errors.usuario?.message}
            />

            <Input
              id="contraseña"
              label="Contraseña"
              type="password"
              placeholder="Luciana2025*"
              showPasswordToggle
              register={register('contraseña', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
              })}
              error={errors.contraseña?.message}
            />

          <div className="flex justify-end w-full">
            <a
              href="#"
              className="hover:opacity-80 underline w-full max-w-[390px]"
              style={{
                minHeight: '21px',
                fontFamily: 'var(--font-lato), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                lineHeight: '131%',
                letterSpacing: '0%',
                color: errors.contraseña ? '#D9537A' : '#1A151E',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              Recuperar contraseña
            </a>
          </div>

          {error && (
            <div className="w-full max-w-[390px] mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-[#D9537A] text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Iniciando sesión..."
            className="max-w-[390px] mt-4"
          >
            Iniciar Sesión
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
