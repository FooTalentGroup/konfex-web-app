"use client";
import { useState } from "react";
import CustomInput from "@/components/ui/CustomInput"; // ajusta la ruta
import { UseFormRegisterReturn, ChangeHandler } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  type?: string;
  register?: UseFormRegisterReturn; // <-- opcional para react-hook-form
}

export default function AutocompleteSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  type,
  register
}: Props) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);

  const optionsWithProspecto: Option[] =
    type === "cliente" ? [{ label: "Nuevo", value: "nuevo" }, ...options] : options;

  const filtered = optionsWithProspecto.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange: ChangeHandler = async (event) => {
    const value =
      (event as any)?.target?.value !== undefined
        ? (event as any).target.value
        : "";
    setQuery(value);
    onChange(value);
    setOpen(true);
    if (register) {
      await register.onChange(event);
    }
    return true;
  };

  const registerProps: UseFormRegisterReturn = register
    ? {
        ...register,
        onChange: handleChange,
      }
    : {
        name: label,
        onChange: handleChange,
        onBlur: async () => true,
        ref: () => {},
      };

  return (
    <div className="w-full relative">
      <CustomInput
        id={label}
        label={label}
        placeholder={placeholder}
        className="bg-white pr-8 text-gray-900"
        type="text"
        register={registerProps}
        error={error}
      />

      <span
        className="absolute right-3 top-[38px] cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        ▼
      </span>

      {open && filtered.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow mt-1 max-h-48 overflow-y-auto">
          {filtered.map((opt) => (
            <div
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-gray-900"
              onClick={() => {
                onChange(opt.value);
                setQuery(opt.label);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
