"use client";
import { useSearchParams } from 'next/navigation';
import AddGarmentTemplate from '@/components/common/AddGarmentTemplate'

function AddGarmentPage() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('coleccionId');

  return (
    <>
        <AddGarmentTemplate collectionId={collectionId ? Number(collectionId) : undefined}/>
    </>
  )
}

export default AddGarmentPage