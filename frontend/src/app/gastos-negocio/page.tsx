'use client';

import Header from "@/components/common/Header";
import { useAuth, useSidebar } from "@/hooks";
import Sidebar from "@/components/common/Sidebar";
import PageHeader from "@/components/common/PageHeader";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

const normalizeText = (value: string) => value.trim();

const normalizePercentage = (value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.min(Math.max(num, 0), 100);
};


export default function GastosNegocioPage() {
    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [gastoToDelete, setGastoToDelete] = useState<string | null>(null);

    const {
        gastosNegocio,
        iva,
        loading,
        saving,
        error,
        setIva,
        addGasto,
        updateGasto,
        deleteGasto,
        saveChanges,
    } = useGastosNegocio();

    const [dirty, setDirty] = useState(false);

    const totalPercent = gastosNegocio.reduce((acc, g) => acc + Number(g.porcentaje || 0), 0) + Number(iva || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await saveChanges();

        if (success) {
            setDirty(false);
        } else {
        }
    };

    const handleDeleteGasto = (id: string) => {
        setGastoToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!gastoToDelete) return;

        const success = await deleteGasto(gastoToDelete);

        if (!success) {
        } else {
            setDirty(true);
        }

        setIsDeleteModalOpen(false);
        setGastoToDelete(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setGastoToDelete(null);
    };

    const normalizeText = (value: string) => value.trim();

    const normalizePercentage = (value: string) => {
        const num = Number(value);
        if (Number.isNaN(num)) return 0;
        return Math.min(Math.max(num, 0), 100);
    };

    if (!mounted || !user) {
        return null;
    }

    const handleGastoNameChange =
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = normalizeText(e.target.value);
            updateGasto(id, "nombre", value);
            setDirty(true);
        };

    const handleGastoPercentageChange =
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = normalizePercentage(e.target.value);
            updateGasto(id, "porcentaje", String(value));
            setDirty(true);
        };

    const handleIvaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = normalizePercentage(e.target.value);
        setIva(value);
        setDirty(true);
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#9d86ac]">
            <Header onMenuClick={openSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 flex flex-col">
                <PageHeader
                    title="Gastos del negocio"
                    description="Revisa y ajusta tus costos indirectos e impuestos desde aquí."
                    backgroundColor="#8b709d"
                />

                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    title="Eliminar gasto"
                    message="¿Estás seguro que deseas eliminar este gasto? Esta acción no se puede deshacer."
                    cancelText="Cancelar"
                    confirmText="Eliminar"
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                />

                {/* Form */}
                {!loading && (
                    <form onSubmit={handleSubmit} className="space-y-6 py-5 px-3 bg-[#F4E7FD] shadow rounded-xl w-full max-w-xl mx-auto">
                        <div className="py-4 px-2 border-[1px] rounded-xl border-[#9D86AC] bg-[#E6E1EA]">
                            <div className="flex justify-between pb-1 border-b-[1px] border-[var(--primary-color-300)]">
                                <h2 className="text-xl font-bold text-gray-800">Costos indirectos</h2>
                                <h3 className="text-[var(--secondary-color-300)] text-xl font-semibold">
                                    <span className="text-gray-600 text-lg"> % </span>
                                    {totalPercent.toFixed(2)}
                                </h3>
                            </div>

                            {/* LISTA DE GASTOS */}
                            <div className="space-y-4 pt-2 pb-5 mb-[-20px] border-b-[1px] border-[var(--primary-color-300)]">

                                {gastosNegocio.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">
                                        No hay costos indirectos. Agrega uno con el botón +
                                    </p>
                                )}

                                {gastosNegocio.map((gasto, index) => (
                                    <div key={gasto.id} className="flex flex-col gap-2 px-2 text-gray-800">
                                        <div className="flex justify-between items-center">
                                            <h3>Costo indirecto {index + 3}</h3>
                                        </div>

                                        <div className="relative flex justify-between gap-x-4">
                                            <input
                                                type="text"
                                                placeholder="Nombre del gasto"
                                                value={gasto.nombre}
                                                onChange={e => {
                                                    updateGasto(gasto.id, "nombre", e.target.value);
                                                    setDirty(true);
                                                }}
                                                className="flex-1 p-2 border rounded-md border-[var(--primary-color-300)] text-[var(--primary-color-500)] bg-[var(--background-light)]"
                                                required
                                            />

                                            <div className="flex justify-between gap-x-2">
                                                <div className="relative w-[60px]">
                                                    <input
                                                        type="number"
                                                        value={gasto.porcentaje ?? ""}
                                                        onChange={handleGastoPercentageChange(gasto.id)}
                                                        className="w-full p-2 pr-6 border rounded-md border-[var(--primary-color-300)] text-[var(--primary-color-500)] bg-[var(--background-light)]"
                                                        required
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-color-500)] text-xl font-semibold pointer-events-none">
                                                        %
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGasto(gasto.id)}
                                                    className="mt-[-34px]"
                                                >
                                                    <Trash2 className="w-6 h-6 text-[#0F172A] bg-[#CEC2D6] border border-[#9D86AC] rounded-md font-bold text-xl p-1" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* AGREGAR */}
                            <div className="flex justify-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        addGasto();
                                        setDirty(true);
                                    }}
                                    className="w-10 h-10 bg-[var(--terciary-color-500)] rounded-[50%] border-[1px] border-[var(--primary-color-300)] text-[var(--primary-color-500)] text-3xl flex items-center justify-center hover:bg-[var(--primary-color-100)] transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* IVA */}
                        <div className="py-4 px-2 border-[1px] rounded-xl border-[var(--primary-color-500)] bg-[#E6E1EA]">
                            <div className="flex justify-between pb-1 border-b-[1px] border-[var(--primary-color-300)]">
                                <h2 className="text-xl font-bold text-gray-800">Impuestos</h2>
                                <h3 className="text-[var(--secondary-color-300)] text-xl font-semibold">
                                    <span className="text-gray-600 text-lg"> % </span>
                                    {iva}
                                </h3>
                            </div>

                            <div className="w-full pt-4 text-gray-800 flex-col px-4 border-b-[1px] border-[var(--primary-color-300)]">
                                <h3 className="font-semibold">IVA*</h3>
                                <div className="flex justify-between items-center gap-x-4 mb-[20px] ">
                                    <div className="relative w-full">
                                        <input
                                            type="number"
                                            value={iva ?? ""}
                                            onChange={handleIvaChange}
                                            className="w-full flex-1 p-2 pr-8 border-2 rounded-md border-[var(--primary-color-300)] text-[var(--primary-color-300)] bg-[var(--background-light)]"
                                            required
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--primary-color-500)] text-xl font-semibold pointer-events-none">
                                            %
                                        </span>
                                    </div>
                                    <span>
                                        {/* SVG de la bandera argentina */}
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M48 36.0003C48 37.4148 47.4381 38.7714 46.4379 39.7716C45.4377 40.7718 44.0812 41.3337 42.6667 41.3337H5.33333C3.91885 41.3337 2.56229 40.7718 1.5621 39.7716C0.561903 38.7714 0 37.4148 0 36.0003V12.0003C0 10.5858 0.561903 9.22928 1.5621 8.22909C2.56229 7.2289 3.91885 6.66699 5.33333 6.66699H42.6667C44.0812 6.66699 45.4377 7.2289 46.4379 8.22909C47.4381 9.22928 48 10.5858 48 12.0003V36.0003Z" fill="#75AADB" /> <path d="M0 17.333H48V30.6663H0V17.333Z" fill="#EEEEEE" /> <path d="M24 17.333L24.6507 20.7303L26.552 17.841L25.852 21.2277L28.7134 19.285L26.7707 22.1477L30.1587 21.449L27.2694 23.349L30.6667 23.9997L27.2694 24.6503L30.1587 26.5517L26.7707 25.8517L28.7134 28.713L25.852 26.7703L26.552 30.1583L24.6507 27.269L24 30.6663L23.3494 27.269L21.4494 30.1583L22.148 26.7703L19.2854 28.713L21.228 25.8517L17.8414 26.5517L20.7307 24.6503L17.3334 23.9997L20.7307 23.349L17.8414 21.449L21.228 22.1477L19.2854 19.285L22.148 21.2277L21.4494 17.841L23.3494 20.7303L24 17.333Z" fill="#FCBF49" /> <path d="M24 19.1063L24.3227 20.793L24.4774 21.5997L24.9294 20.9143L25.8734 19.4797L25.5254 21.161L25.3587 21.9663L26.0387 21.505L27.46 20.541L26.496 21.9623L26.0347 22.6423L26.8387 22.4757L28.5214 22.129L27.0867 23.073L26.4 23.5223L27.2067 23.677L28.8934 23.9997L27.2067 24.3223L26.4 24.477L27.0854 24.929L28.52 25.873L26.8374 25.525L26.032 25.3583L26.4934 26.0383L27.4574 27.4583L26.0374 26.4943L25.3574 26.033L25.524 26.8383L25.872 28.521L24.928 27.0863L24.4774 26.3997L24.3227 27.2063L24 28.893L23.6774 27.2063L23.5227 26.3997L23.0707 27.0863L22.1267 28.521L22.4734 26.8383L22.64 26.0343L21.96 26.4957L20.5387 27.4597L21.5027 26.0383L21.964 25.3583L21.1587 25.525L19.4774 25.873L20.912 24.929L21.5974 24.477L20.7907 24.3223L19.1067 23.9997L20.7934 23.677L21.6 23.5223L20.9134 23.0703L19.4787 22.1263L21.16 22.473L21.964 22.6397L21.5027 21.9597L20.5374 20.5383L21.9587 21.5037L22.6387 21.965L22.472 21.161L22.1254 19.4797L23.0694 20.9143L23.5214 21.601L23.676 20.7943L24 19.1063ZM24 17.333L23.3494 20.7303L21.4494 17.841L22.148 21.229L19.2854 19.2863L21.228 22.149L17.8414 21.4503L20.7307 23.3503L17.3334 23.9997L20.7307 24.6503L17.8414 26.5517L21.228 25.8517L19.2854 28.713L22.148 26.7703L21.4494 30.1583L23.3494 27.269L24 30.6663L24.6507 27.269L26.552 30.1583L25.852 26.7703L28.7134 28.713L26.7707 25.8517L30.1587 26.5517L27.2694 24.6503L30.6667 23.9997L27.2694 23.349L30.1587 21.449L26.7707 22.1477L28.7134 19.285L25.852 21.2277L26.552 17.8397L24.6507 20.729L24 17.333Z" fill="#843511" /> <path d="M24 26.6663C25.4728 26.6663 26.6667 25.4724 26.6667 23.9997C26.6667 22.5269 25.4728 21.333 24 21.333C22.5273 21.333 21.3334 22.5269 21.3334 23.9997C21.3334 25.4724 22.5273 26.6663 24 26.6663Z" fill="#FCBF49" /> <path d="M24 26.8337C22.4373 26.8337 21.1666 25.563 21.1666 24.0003C21.1666 22.4377 22.4373 21.167 24 21.167C25.5626 21.167 26.8333 22.4377 26.8333 24.0003C26.8333 25.563 25.5626 26.8337 24 26.8337ZM24 21.5003C22.6213 21.5003 21.5 22.6217 21.5 24.0003C21.5 25.379 22.6213 26.5003 24 26.5003C25.3786 26.5003 26.5 25.379 26.5 24.0003C26.5 22.6217 25.3786 21.5003 24 21.5003Z" fill="#843511" /> <path d="M23.7347 23.6987C23.7347 23.9053 23.3867 24.072 22.9574 24.072C22.5267 24.072 22.1787 23.9053 22.1787 23.6987C22.1787 23.492 22.5267 23.3253 22.9574 23.3253C23.388 23.3253 23.7347 23.492 23.7347 23.6987ZM25.8054 23.6667C25.8054 23.452 25.4507 23.2773 25.0134 23.2773C24.576 23.2773 24.2214 23.4507 24.2214 23.6667C24.2214 23.8827 24.576 24.056 25.0134 24.056C25.452 24.056 25.8054 23.8813 25.8054 23.6667Z" fill="#C16540" /> <path d="M23.2841 25.1657C23.2841 24.9977 23.6121 24.8604 24.0147 24.8604C24.4174 24.8604 24.7454 24.9964 24.7454 25.1657C24.7454 25.3337 24.4174 25.471 24.0147 25.471C23.6121 25.471 23.2841 25.3337 23.2841 25.1657Z" fill="#ED8662" /> </svg> </span>
                                </div>
                            </div>
                            <p className="text-[#4F3E5B] text-[12px] leading-tight px-4 pt-4">“Este porcentaje se aplicará a todos los presupuestos automáticamente.”</p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !dirty}
                            className="w-full py-3 bg-[var(--secondary-color-500)] text-white text-sm rounded-full hover:bg-[var(--secondary-color-600)] disabled:bg-transparent disabled:border-[#D5A1F7] disabled:text-[#D5A1F7] border-[1px] disabled:cursor-not-allowed transition-colors "
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
