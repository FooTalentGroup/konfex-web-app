"use client";

import { useParams, useRouter } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/Footer";
import BackNavigationBar from "@/components/common/BackNavigationBar";
import AddMaterialForm from "@/components/common/AddMaterialForm";
import { useCategories } from "@/hooks/useCategories";

type MaterialData = {
    nombre?: string;
    url_imagen?: string | null;
    ancho?: number;
    unidadMedida?: "cm" | "m" | "yds";
    peso?: number;
    colores?: string[];
    proveedor?: string;
    precio?: number;
};

export default function CreateMaterialPage() {
    const params = useParams();
    const router = useRouter();
    const { user, mounted } = useAuth();
    const { isOpen, open, close } = useSidebar();
    const { categories } = useCategories();

    const categorySlug = params.categoria as string;
    const category = categories.find((c) => c.slug === categorySlug);

    if (!mounted || !user) return null;
    if (!category) return <div className="p-6">Cargando categoría…</div>;

    const handleSubmit = async (values: MaterialData) => {
        const res = await fetch(`/api/v1/materials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...values,
                categoriaId: category.id,
            }),
        });

        if (res.ok) {
            router.push(`/raw-materials/${categorySlug}`);
        } else {
            alert("Error al crear material");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
            <Header onMenuClick={open} />
            <Sidebar isOpen={isOpen} onClose={close} />

            <BackNavigationBar
                title="Agregar"
                breadcrumbs={[
                    { label: "Tus materiales", href: "/raw-materials" },
                    { label: category.nombre, href: `/raw-materials/${categorySlug}` }
                ]}
            />

            <div className="bg-[#E6E1EA] rounded-t-2xl pb-10 pt-4 flex-1">
                <div className="w-[calc(100%-2rem)] max-w-sm mx-auto">
                    <AddMaterialForm data={null} onSubmit={handleSubmit} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
