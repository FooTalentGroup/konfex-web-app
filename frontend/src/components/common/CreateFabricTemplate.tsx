"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import FabricForm from './FabricForm'

function CreateFabricTemplate() {
    const router = useRouter()

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-primary-500" />
                </button>
            </div>

            <FabricForm />
        </div>
    )
}

export default CreateFabricTemplate