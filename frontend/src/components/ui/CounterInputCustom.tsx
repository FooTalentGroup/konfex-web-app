'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CounterInputCustomProps {
    id: string;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    setValue: (value: number) => void;
    register?: UseFormRegisterReturn;
    className?: string;
    error?: string;
}

const CounterInputCustom: React.FC<CounterInputCustomProps> = ({
    id,
    label = '',
    value,
    setValue,
    register,
    min = 0,
    max = 9999,
    step = 1,
    className = '',
    error,
}) => {
    const increase = () => {
        const newValue = Number(value) + step;
        if (newValue <= max) setValue(newValue);
    };

    const decrease = () => {
        const newValue = Number(value) - step;
        if (newValue >= min) setValue(newValue);
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs sm:text-sm font-[var(--font-lato),sans-serif] font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            <input
                type="number"
                id={id}
                {...register}
                value={value}
                readOnly
                className="hidden"
            />

            <div className="flex items-center justify-center gap-8 bg-white p-2 rounded-lg border border-[#6A5379]">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= min}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    −
                </button>

                <span className="text-base sm:text-lg font-[var(--font-lato),sans-serif] font-semibold text-black min-w-[3rem] text-center">
                    {value}
                </span>

                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    +
                </button>
            </div>

            {error && (
                <p className="text-xs sm:text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default CounterInputCustom;