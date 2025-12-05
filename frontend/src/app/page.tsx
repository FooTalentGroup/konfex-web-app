"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useLogin } from "@/hooks/useLogin";
import { useSignUp } from "@/hooks/useSignUp";
import { useAuth } from "@/hooks/useAuth";

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const loginHook = useLogin();
  const signUpHook = useSignUp();

  useEffect(() => {
    // Usar setTimeout para evitar el warning de React
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Si el usuario ya está autenticado, redirigir a inbox
  useEffect(() => {
    if (mounted && user) {
      router.push("/inbox");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return null;
  }

  // Si ya está autenticado, no mostrar nada (está siendo redirigido)
  if (user) {
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
          <div className="w-full max-w-[390px] mb-6 sm:mb-8 mt-4">
            <h2
              className="mb-4"
              style={{
                minHeight: "42px",
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                lineHeight: "131%",
                letterSpacing: "0%",
                color: "#B65CF2",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSignUp ? "Registrarse" : "Iniciar sesión"}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  !isSignUp
                    ? "bg-[#B65CF2] text-white font-semibold"
                    : "bg-transparent text-[#1A151E] hover:bg-gray-100"
                }`}
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                }}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isSignUp
                    ? "bg-[#B65CF2] text-white font-semibold"
                    : "bg-transparent text-[#1A151E] hover:bg-gray-100"
                }`}
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                }}
              >
                Registrarse
              </button>
            </div>
          </div>

          {isSignUp ? (
            <form
              onSubmit={signUpHook.handleSubmit(signUpHook.onSubmit)}
              className="w-full max-w-[390px] space-y-6"
            >
              <Input
                id="nombre"
                label="Nombre (opcional)"
                type="text"
                placeholder="Luciana"
                register={signUpHook.register("nombre")}
                error={signUpHook.errors.nombre?.message}
              />

              <Input
                id="usuario"
                label="E-mail"
                type="text"
                placeholder="luciana@gmail.com"
                register={signUpHook.register("usuario", {
                  required: "El usuario es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Debe ser un email válido",
                  },
                })}
                error={signUpHook.errors.usuario?.message}
              />

              <Input
                id="contraseña"
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres, letras y números"
                showPasswordToggle
                register={signUpHook.register("contraseña", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                  pattern: {
                    value: /(?=.*[A-Za-z])(?=.*\d)/,
                    message: "Debe incluir letras y números",
                  },
                })}
                error={signUpHook.errors.contraseña?.message}
              />

              <Input
                id="confirmarContraseña"
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirma tu contraseña"
                showPasswordToggle
                register={signUpHook.register("confirmarContraseña", {
                  required: "Debes confirmar la contraseña",
                  validate: (value: string) => {
                    if (signUpHook.password && value !== signUpHook.password) {
                      return "Las contraseñas no coinciden";
                    }
                    return true;
                  },
                })}
                error={signUpHook.errors.confirmarContraseña?.message}
              />

              {signUpHook.error && (
                <div className="w-full max-w-[390px] mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-[#D9537A] text-center">
                    {signUpHook.error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!signUpHook.isValid || signUpHook.isLoading}
                isLoading={signUpHook.isLoading}
                loadingText="Registrando..."
                className="max-w-[390px] mt-4"
              >
                Registrarse
              </Button>
            </form>
          ) : (
            <form
              onSubmit={loginHook.handleSubmit(loginHook.onSubmit)}
              className="w-full max-w-[390px] space-y-6"
            >
              <Input
                id="usuario"
                label="E-mail"
                type="text"
                placeholder="luciana@gmail.com"
                register={loginHook.register("usuario", {
                  required: "El usuario es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Debe ser un email válido",
                  },
                })}
                error={loginHook.errors.usuario?.message}
              />

              <Input
                id="contraseña"
                label="Contraseña"
                type="password"
                placeholder="Luciana2025*"
                showPasswordToggle
                register={loginHook.register("contraseña", {
                  required: "La contraseña es requerida",
                })}
                error={loginHook.errors.contraseña?.message}
              />

              <div className="flex justify-end w-full">
                <a
                  href="#"
                  className="hover:opacity-80 underline w-full max-w-[390px]"
                  style={{
                    minHeight: "21px",
                    fontFamily: "var(--font-lato), sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                    lineHeight: "131%",
                    letterSpacing: "0%",
                    color: loginHook.errors.contraseña ? "#D9537A" : "#1A151E",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  Recuperar contraseña
                </a>
              </div>

              {loginHook.error && (
                <div className="w-full max-w-[390px] mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-[#D9537A] text-center">
                    {loginHook.error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!loginHook.isValid || loginHook.isLoading}
                isLoading={loginHook.isLoading}
                loadingText="Iniciando sesión..."
                className="max-w-[390px] mt-4"
              >
                Iniciar Sesión
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
