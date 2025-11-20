'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useToast } from '@/contexts/ToastContext';

interface LoginFormData {
  usuario: string;
  contraseña: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signIn({
        email: data.usuario,
        password: data.contraseña,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      showSuccess('¡Sesión iniciada correctamente!');

      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      
      showError(errorMessage);
      
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setFormError('usuario', { type: 'manual', message: errorMessage });
      }
      if (errorMessage.includes('contraseña') || errorMessage.includes('password') || errorMessage.includes('Credenciales')) {
        setFormError('contraseña', { type: 'manual', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="w-full">
            <label
              htmlFor="usuario"
              className="block mb-2 w-full"
              style={{
                minHeight: '24px',
                fontFamily: 'var(--font-lato), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(16px, 4vw, 18px)',
                lineHeight: '131%',
                letterSpacing: '0%',
                color: '#1A151E',
              }}
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              {...register('usuario', {
                required: 'El usuario es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Debe ser un email válido',
                },
              })}
              className="focus:outline-none w-full"
              style={{
                height: '48px',
                borderRadius: '6px',
                borderWidth: errors.usuario ? '2px' : '1px',
                borderStyle: 'solid',
                borderColor: errors.usuario ? '#D9537A' : '#6A5379',
                padding: '12px',
                backgroundColor: '#FEFCFF',
                color: '#1A151E',
                fontFamily: 'var(--font-lato), sans-serif',
              }}
              placeholder="luciana@gmail.com"
            />
            {errors.usuario && (
              <p className="mt-1 text-sm text-[#D9537A]">{errors.usuario.message}</p>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="contraseña"
              className="block mb-2 w-full"
              style={{
                minHeight: '24px',
                fontFamily: 'var(--font-lato), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(16px, 4vw, 18px)',
                lineHeight: '131%',
                letterSpacing: '0%',
                color: errors.contraseña ? '#D9537A' : '#1A151E',
              }}
            >
              Contraseña
            </label>
            <div className="relative w-full">
              <input
                id="contraseña"
                type={showPassword ? 'text' : 'password'}
                {...register('contraseña', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  },
                })}
                className="focus:outline-none w-full"
                style={{
                  height: '48px',
                  borderRadius: '6px',
                  borderWidth: errors.contraseña ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: errors.contraseña ? '#D9537A' : '#6A5379',
                  padding: '12px',
                  paddingRight: '48px',
                  backgroundColor: '#FEFCFF',
                  color: '#1A151E',
                  fontFamily: 'var(--font-lato), sans-serif',
                }}
                placeholder="Luciana2025*"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-80 focus:outline-none flex items-center justify-center ${
                  errors.contraseña ? 'text-[#D9537A]' : 'text-gray-400'
                }`}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showPassword ? (
                    <>
                      <path
                        d="M1 1L23 23M9 9C8.5 9.5 8 10.2 8 11C8 12.1 8.9 13 10 13C10.8 13 11.5 12.5 12 12M21 12C21 12 17 18 12 18C11.5 18 11 17.9 10.5 17.7M3 3C2.4 3.6 1.9 4.2 1.5 5M6.5 6.5C5.8 7.2 5.3 8.1 5 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.contraseña && (
              <p className="mt-1 text-sm text-[#D9537A]">{errors.contraseña.message}</p>
            )}
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8B709D] focus:ring-offset-2 transition-opacity w-full max-w-[390px] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: '42px',
              backgroundColor: '#8B709D',
              borderRadius: '8px',
              padding: '10px 16px',
              fontFamily: 'var(--font-lato), sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#FEFCFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

