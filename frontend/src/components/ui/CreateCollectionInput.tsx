'use client';

import React, { useEffect, useRef } from 'react';

interface CreateCollectionInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    isCreating: boolean;
    onCancel: () => void;
}

const CreateCollectionInput: React.FC<CreateCollectionInputProps> = ({
    value,
    onChange,
    onKeyDown,
    isCreating,
    onCancel,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="relative">
            <div className="flex flex-col w-full h-full items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-dashed border-[#D5A1F7] bg-[#E6E1EA]">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Nombre colección"
                    disabled={isCreating}
                    className="w-full text-center font-[var(--font-lato),sans-serif] font-bold text-base sm:text-lg text-[#6A5379] bg-transparent border-none outline-none placeholder:text-[#9E8AA8] disabled:opacity-50"
                />
                <span className="text-center font-[var(--font-lato),sans-serif] font-normal text-xs sm:text-sm text-[#9E8AA8] mt-1">
                    {isCreating ? 'Creando...' : 'Presiona Enter para crear'}
                </span>
            </div>

            <button
                onClick={onCancel}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-gray-600 transition-colors shadow-md z-10"
                disabled={isCreating}
            >
                ✕
            </button>
        </div>
    );
};

export default CreateCollectionInput;
