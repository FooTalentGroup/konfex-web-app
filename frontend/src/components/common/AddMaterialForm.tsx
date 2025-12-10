"use client";

import { useState, useEffect } from "react";

interface MaterialData {
    id?: number;
    nombre?: string;
    url_imagen?: string | null;
    ancho?: number;
    unidadMedida?: "cm" | "m" | "yds";
    peso?: number;
    colores?: string[];
    proveedor?: string;
    precio?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface AddMaterialFormProps {
    data?: MaterialData | null;
    onSubmit: (values: MaterialData) => Promise<void>;
    onReset?: () => void;
}

export default function AddMaterialForm({ data, onSubmit, onReset }: AddMaterialFormProps) {
    const [form, setForm] = useState({
        nombre: "",
        url_imagen: "",
        ancho: "",
        unidadMedida: "cm",
        peso: "",
        colores: "",
        proveedor: "",
        precio: "",
    });

    useEffect(() => {
        if (data) {
            setForm({
                nombre: data.nombre ?? "",
                url_imagen: data.url_imagen ?? "",
                ancho: data.ancho?.toString() ?? "",
                // 🔥 Fix principal: normalizar unidadMedida
                unidadMedida: (() => {
                    const raw = data.unidadMedida?.toLowerCase();
                    if (!raw) return "cm";
                    if (["m", "metro", "metros"].includes(raw)) return "m";
                    if (["cm", "centimetro", "centimetros"].includes(raw)) return "cm";
                    if (["yds", "yd", "yardas"].includes(raw)) return "yds";
                    return "cm";
                })(),
                peso: data.peso?.toString() ?? "",
                colores: data.colores?.join(", ") ?? "",
                proveedor: data.proveedor ?? "",
                precio: data.precio?.toString() ?? "",
            });
        } else {
            resetForm();
        }
    }, [data]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            nombre: "",
            url_imagen: "",
            ancho: "",
            unidadMedida: "cm",
            peso: "",
            colores: "",
            proveedor: "",
            precio: "",
        });
        onReset && onReset();
    };

    const isFormValid = () => {
        return (
            form.nombre.trim() !== "" &&
            form.ancho.trim() !== "" &&
            !isNaN(Number(form.ancho)) &&
            form.peso.trim() !== "" &&
            !isNaN(Number(form.peso)) &&
            form.colores.trim() !== "" &&
            form.proveedor.trim() !== "" &&
            form.precio.trim() !== "" &&
            !isNaN(Number(form.precio))
        );
    };

    const submit = () => {
        onSubmit({
            nombre: form.nombre,
            url_imagen: form.url_imagen || null,
            ancho: parseFloat(form.ancho),
            unidadMedida: form.unidadMedida as "cm" | "m" | "yds",
            peso: parseFloat(form.peso),
            colores: form.colores.split(",").map((c) => c.trim()),
            proveedor: form.proveedor,
            precio: parseFloat(form.precio),
        });
    };

    // Fecha que se debe mostrar SIEMPRE
    const displayDate = data?.updatedAt
        ? new Date(data.updatedAt)
        : data?.createdAt
            ? new Date(data.createdAt)
            : new Date(); // material nuevo → hoy

    return (
        <div className="w-full">
            {/* Fecha edición */}
            <div className="text-xs text-gray-500 mb-2">
                Editado: {displayDate.toLocaleDateString("es-UY")}
            </div>
            {/* Imagen */}
            {form.url_imagen ? (
                <img
                    src={form.url_imagen}
                    alt="Imagen"
                    className="w-full h-32 object-cover rounded-md mb-4"
                />
            ) : (
                <div className="w-full h-32 rounded-md bg-gray-200 mb-4 flex items-center justify-center text-sm text-gray-500">
                    Sin imagen
                </div>
            )}

            {/* Nombre */}
            <div className="mb-4 text-gray-800">
                <label className="text-sm font-medium">Material</label>
                <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm bg-[#FEFCFF]"
                    placeholder="Algodón Premium"
                />
            </div>

            {/* Ancho y Peso */}
            <div className="flex gap-[4%] mb-4">

                {/* Ancho */}
                <div className="w-[48%] text-gray-800 relative">
                    <label className="text-sm font-medium">Ancho rollo</label>

                    <div className="mt-1 flex border border-[#C7B6D6] rounded-md overflow-hidden h-10">
                        {/* Input numérico */}
                        <input
                            type="number"
                            step="0.01"
                            value={form.ancho}
                            onChange={(e) => handleChange("ancho", e.target.value)}
                            className="flex-1 px-3 border rounded-md p-2 text-sm bg-[#FEFCFF]"
                            placeholder="1.70"
                        />

                        {/* Unidad */}
                        <div className="flex items-center gap-1 px-2 bg-[#EDE6F2] border-gray-600 absolute right-0 bottom-[1px] h-[38px] border-t-[1px] border-r-[1px] border-b-[1px] rounded-r-md">
                            <select
                                value={form.unidadMedida}
                                onChange={(e) => handleChange("unidadMedida", e.target.value)}
                                className="bg-transparent text-sm text-[var(--purple-dark)] outline-none pr-4 appearance-none cursor-pointer "
                            >
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="yds">yds</option>
                            </select>

                            {/* icono caret */}
                            <span className="text-[#6B4F82] text-xs -ml-3">▼</span>
                        </div>
                    </div>
                </div>

                {/* Peso */}
                <div className="w-[48%] relative text-gray-800 ">
                    <label className="text-sm font-medium">Peso</label>

                    <div className="mt-1 flex border border-[#C7B6D6] rounded-md overflow-hidden h-10">
                        {/* Input numérico */}
                        <input
                            type="number"
                            step="0.01"
                            value={form.peso}
                            onChange={(e) => handleChange("peso", e.target.value)}
                            className="flex-1 px-3 border rounded-md p-2 text-sm bg-[#FEFCFF]"
                            placeholder="500"
                        />

                        {/* Unidad fija gr/m² */}
                        <div className="flex items-center gap-1 px-2 bg-[#EDE6F2] border-gray-600 absolute right-0 bottom-[1px] h-[38px] border-t-[1px] border-r-[1px] border-b-[1px] rounded-r-md">
                            <span className="text-[#6B4F82] text-sm mr-2">gr/m²</span>
                        </div>
                    </div>
                </div>

            </div>


            {/* Colores */}
            <div className="mb-4 text-[#6A5379]">
                <label className="text-sm font-medium">Colores</label>
                <input
                    type="text"
                    value={form.colores}
                    onChange={(e) => handleChange("colores", e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm bg-[#FEFCFF] border-[#6A5379]"
                    placeholder="Rojo, Azul, Negro"
                />
            </div>

            {/* Proveedor */}
            <div className="mb-4 text-[#6A5379]">
                <label className="text-sm font-medium">Proveedor</label>
                <input
                    type="text"
                    value={form.proveedor}
                    onChange={(e) => handleChange("proveedor", e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm bg-[#FEFCFF] border-[#6A5379]"
                    placeholder="Textil S.A."
                />
            </div>

            {/* Precio */}
            <div className="mb-6 text-[#6A5379]">
                <label className="text-sm font-medium">Precio</label>
                <input
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => handleChange("precio", e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm bg-[#FEFCFF] border-[#6A5379]"
                    placeholder="350.5"
                />
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 text-[#6A5379]">
                <button
                    onClick={submit}
                    disabled={!isFormValid()}
                    className={`w-full py-2 rounded-full font-semibold transition 
    ${isFormValid()
                            ? "bg-purple-200 text-purple-700"
                            : "bg-[#F4E7FD] text-[#D5A1F7] cursor-not-allowed"
                        }`}
                >
                    Guardar
                </button>

                {onReset && (
                    <button
                        onClick={resetForm}
                        className="w-full py-2 rounded-full bg-gray-100 text-gray-500 text-sm"
                    >
                        Crear nuevo
                    </button>
                )}
            </div>
        </div>
    );
}
