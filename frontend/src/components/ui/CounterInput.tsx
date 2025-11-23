"use client";
import { UseFormRegisterReturn } from "react-hook-form";

interface CounterInputProps {
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

function CounterInput({
    id,
    label = "",
    value,
    setValue,
    register,
    min = 0,
    max = 9999,
    step = 1,
    className = "",
    error
}: CounterInputProps) {


    const increase = () => {
        const newValue = Number(value) + step
        if (newValue <= max) setValue(value + step);
    };

    const decrease = () => {
        const newValue = Number(value) - step
        if (newValue >= min) setValue(value - step);
    };

    return (
        <div className={`flex flex-col space-y-1 ${className}`}>

            <label htmlFor={id} className="text-sm font-medium text-gray-500">{label}</label>

            <input type="number" id={id} {...register} value={value} readOnly className="hidden" />

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

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default CounterInput;
