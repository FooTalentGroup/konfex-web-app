"use client";

import React from "react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onContinueEditing: () => void;
  onExitWithoutSaving: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  onContinueEditing,
  onExitWithoutSaving,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onContinueEditing}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-[340px] p-6 mx-4 animate-scale-in">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#FFE5E5] flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#FF4D4D" strokeWidth="2" />
              <path
                d="M12 8V12"
                stroke="#FF4D4D"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="#FF4D4D" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-[#FF4D4D] mb-3">
          ¡Ups, parece que no guardaste este presupuesto!
        </h2>

        <p className="text-center text-sm text-gray-700 mb-6 leading-relaxed">
          ¿Quieres guardarlo antes de salir para no perder la información
          ingresada? Se guardará como borrador en la sección Presupuestos.
        </p>

        <div className="space-y-3">
          <button
            onClick={onContinueEditing}
            className="w-full py-3 px-4 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-95"
            style={{
              background: "linear-gradient(135deg, #B65CF2 0%, #8B44CC 100%)",
            }}
          >
            Seguir editando
          </button>

          <button
            onClick={onExitWithoutSaving}
            className="w-full py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-gray-100 active:scale-95"
            style={{
              backgroundColor: "#F5E6FF",
              color: "#8B44CC",
            }}
          >
            Salir sin guardar
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
