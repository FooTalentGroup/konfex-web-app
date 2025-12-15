"use client";
import { useState } from "react";
import CustomInput from "@/components/ui/CustomInput"; // ajusta la ruta
import { UseFormRegisterReturn } from "react-hook-form";

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

  return (
    <div className="w-full relative">
      <CustomInput
        id={label}
        label={label}
        placeholder={placeholder}
        className="bg-white pr-8 text-gray-900"
        type="text"
        register={
          register
            ? {
          ...register,
          value: query,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
                },
              }
            : undefined
          }
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
