"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/hooks/useAuth";

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
    isValid,
    onSubmit,
  } = useLogin();

  useEffect(() => {
    setMounted(true);
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
          <h2
            className="mb-6 sm:mb-8 mt-4 w-full max-w-[390px]"
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
            Iniciar sesión
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[390px] space-y-6"
          >
            <Input
              id="usuario"
              label="E-mail"
              type="text"
              placeholder="test@example.com"
              register={register("usuario", {
                required: "El usuario es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Debe ser un email válido",
                },
              })}
              error={errors.usuario?.message}
            />

            <Input
              id="contraseña"
              label="Contraseña"
              type="password"
              placeholder="test1234"
              showPasswordToggle
              register={register("contraseña", {
                required: "La contraseña es requerida",
              })}
              error={errors.contraseña?.message}
            />

            {error && (
              <div className="w-full max-w-[390px] mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-[#D9537A] text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isValid || isLoading}
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
