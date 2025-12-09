"use client";

import { ReactNode } from "react";

interface SimpleButton {
    icon: ReactNode;
    onClick: () => void;
}

interface Props {
    simpleButtons?: SimpleButton[];
    children?: ReactNode;
}

export default function ActionBar({ simpleButtons = [], children }: Props) {
    return (
        <div className="flex justify-center gap-4 bg-[var(--primary-color-300)] rounded-l-4xl rounded-r-4xl py-2 px-4">

            {/* Render botones simples */}
            {simpleButtons.map((btn, index) => (
                <button
                    key={index}
                    className="bg-[var(--primary-color-500)] flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 shadow-lg"
                    onClick={btn.onClick}
                >
                    {btn.icon}
                </button>
            ))}

            {/* Render componentes personalizados */}
            {children}
        </div>
    );
}
