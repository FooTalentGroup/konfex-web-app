"use client"
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomSelectProps {
    id?: string;
    options: Array<{ label: string, value: string }>
    label: string;
    register: UseFormRegisterReturn;
    classname?: string
    placeholder?: string
    error?: string;
}

export default function CustomSelect({ id, options, label, register, placeholder = '', error, classname }: CustomSelectProps) {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-600">{label}</label>
            <select
                id={id}
                {...register}
                defaultValue=''
                className={`${classname} border p-3 rounded-lg text-black border-primary-300 focus:border-purple-300 focus:ring-1 focus-visible:ring-purple-300 outline-none`}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
