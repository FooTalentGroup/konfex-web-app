"use client";
import React from "react";
import { FieldValues, Path, PathValue, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface CounterInputProps<T extends FieldValues> {
    name: Path<T>;
    watch: UseFormWatch<T>;
    setValue: UseFormSetValue<T>;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    className?: string;
}

function CounterInput<T extends FieldValues>({
    name,
    watch,
    setValue,
    min = 0,
    max = 9999,
    step = 1,
    label = "",
    className = "",
}: CounterInputProps<T>) {
    const watched = watch(name) as PathValue<T, Path<T>> | undefined;
    const value = typeof watched === "number" ? watched : Number(watched ?? 0);

    const increase = () => {
        const next = value + step;
        if (next <= max) {
            setValue(name, (next as unknown) as PathValue<T, Path<T>>);
        }
    };

    const decrease = () => {
        const next = value - step;
        if (next >= min) {
            setValue(name, (next as unknown) as PathValue<T, Path<T>>);
        }
    };

    return (
        <div className={`flex flex-col space-y-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-500">{label}</label>
            )}

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={increase}
                    className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center text-xl font-bold shadow hover:bg-gray-100"
                >
                    +
                </button>

                <span className="text-lg font-semibold w-10 text-center text-black">{value}</span>

                <button
                    type="button"
                    onClick={decrease}
                    className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center text-xl font-bold shadow hover:bg-gray-100"
                >
                    –
                </button>
            </div>
        </div>
    );
}

export default CounterInput;