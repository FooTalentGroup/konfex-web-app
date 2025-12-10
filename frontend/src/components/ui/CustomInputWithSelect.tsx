"use client"
import React from 'react'
import { UseFormRegisterReturn } from "react-hook-form"
import { ChevronDown } from 'lucide-react'

interface SelectOption {
    value: string
    label: string
}

interface CustomInputWithSelectProps {
    id: string
    label: string
    type?: string
    register: UseFormRegisterReturn
    error?: string
    placeholder?: string
    className?: string
    style?: React.CSSProperties;
    selectId: string
    selectRegister: UseFormRegisterReturn
    selectOptions: SelectOption[]
    selectError?: string
}

const CustomInputWithSelect: React.FC<CustomInputWithSelectProps> = ({
    id,
    label,
    register,
    error,
    type = 'number',
    placeholder = '',
    className = '',
    style,
    selectId,
    selectRegister,
    selectOptions,
    selectError
}) => {
    return (
        <div className="flex flex-col space-y-1 flex-1">
            <label htmlFor={id} className="text-sm font-medium text-black">
                {label}
            </label>
            <div className="flex">
                {/* Input */}
                <div className="flex-1 relative">
                    <input
                        id={id}
                        type={type}
                        step="0.01"
                        {...register}
                        className={`${className} w-full p-3 pr-3 text-black border border-r-0 rounded-l-lg transition duration-150 ease-in-out ${error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-primary-300 focus:ring-purple-300 focus-visible:border-purple-300'
                            } focus:border-purple-300 focus:ring-1 focus-visible:ring-purple-300 outline-none`}
                        placeholder={placeholder}
                        style={style}
                    />
                </div>

                {/* Select  */}
                <div className="relative w-24">
                    <select
                        id={selectId}
                        {...selectRegister}
                        className={`w-full h-full p-3 pr-8 text-black border border-l-0 rounded-r-lg transition duration-150 ease-in-out appearance-none cursor-pointer ${selectError
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-primary-300 focus:ring-purple-300 focus-visible:border-purple-300'
                            } focus:border-purple-300 focus:ring-1 focus-visible:ring-purple-300 outline-none bg-bg-gray-500`}
                        style={style}
                    >
                        {selectOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
            </div>
            {(error || selectError) && (
                <p className="text-xs text-red-500 mt-1">{error || selectError}</p>
            )}
        </div>
    )
}

export default CustomInputWithSelect