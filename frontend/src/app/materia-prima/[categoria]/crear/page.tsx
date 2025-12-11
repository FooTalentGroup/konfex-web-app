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

export default function CrearMaterialPage() {
    const params = useParams();
    const router = useRouter();
    const { user, mounted } = useAuth();
    const { isOpen, open, close } = useSidebar();
    const { categories } = useCategories();

    const categoriaSlug = params.categoria as string;
    const categoria = categories.find((c) => c.slug === categoriaSlug);

    if (!mounted || !user) return null;
    if (!categoria) return <div className="p-6">Cargando categoría…</div>;

    const handleSubmit = async (values: any) => {
        const res = await fetch(`/api/v1/materiales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...values,
                categoriaId: categoria.id,
            }),
        });

        if (res.ok) {
            router.push(`/materia-prima/${categoriaSlug}`);
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
                    { label: "Tus materiales", href: "/materia-prima" },
                    { label: categoria.nombre, href: `/materia-prima/${categoriaSlug}` }
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
