"use client"
import React from 'react'

interface CustomSelectProps {
    options: Array<{ label: string, value: string }>
    label: string;
    name: string;
    register: any;
    classname?: string
    placeholder?: string
}

export default function CustomSelect({ options, label, name, register, placeholder = '', classname }: CustomSelectProps) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <select
                {...register(name)}   
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
        </div>
    )
}
