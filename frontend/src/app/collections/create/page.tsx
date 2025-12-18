"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AddGarmentTemplate from "@/components/common/AddGarmentTemplate";

function AddGarmentContent() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("coleccionId");

  return (
    <AddGarmentTemplate
      collectionId={collectionId ? Number(collectionId) : undefined}
    />
  );
}

function AddGarmentPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AddGarmentContent />
    </Suspense>
  );
}

export default AddGarmentPage;
