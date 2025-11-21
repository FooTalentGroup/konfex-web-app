"use client"
import { BudgetFormData } from '@/types/IBudget';
import React from 'react'

interface CustomInputProps {
    label: string;
    name: keyof BudgetFormData;
    register: any;
    error: string | undefined;
    type?: string;
    unit?: string;
    placeholder?: string
    classname?: string
}

const CustomInput: React.FC<CustomInputProps> = ({ label, name, register, error, type = 'text', unit = '', placeholder = '', classname}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-black">{label}</label>
      <div className="relative">
        <input
            id={name}
            type={type}
            {...register(name, {
              ...(type === "number" && {
                setValueAs: (v: any) => {
                  if (v === "" || v === null || v === undefined) return undefined;
                  const num = parseFloat(v);
                  return isNaN(num) ? undefined : num;
                }
              })
            })}
            className={`${classname} w-full p-3 ${unit ? 'pr-10' : 'pr-3'} text-black border rounded-lg transition duration-150 ease-in-out ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-primary-300 focus:ring-purple-300 focus-visible:border-purple-300'
            } focus:border-purple-300 focus:ring-1 focus-visible:ring-purple-300 outline-none`}
            
            placeholder={placeholder}
        />
        {unit && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black font-bold">{unit}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default CustomInput
