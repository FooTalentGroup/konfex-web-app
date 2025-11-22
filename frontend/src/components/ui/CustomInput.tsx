"use client"
import React from 'react'
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: string;
  unit?: string;
  placeholder?: string
  classname?: string
}

const CustomInput: React.FC<CustomInputProps> = ({ id, label, register, error, type = 'text', unit = '', placeholder = '', classname }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-black">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          {...register}
          className={`${classname} w-full p-3 ${unit ? 'pr-10' : 'pr-3'} text-black border rounded-lg transition duration-150 ease-in-out ${error ? 'border-red-500 focus:ring-red-500' : 'border-primary-300 focus:ring-purple-300 focus-visible:border-purple-300'
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
