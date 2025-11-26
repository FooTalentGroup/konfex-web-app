"use client"
import React from 'react'
import FabricForm from './FabricForm'
import BackNavigationBar from './BackNavigationBar'

function CreateFabricTemplate() {

    return (
        <div className="max-w-full bg-[#E6E1EA] rounded-lg shadow-sm">
            <BackNavigationBar
                title="Agregar"
                breadcrumbs={[
                    { label: 'Tus materiales' },
                    { label: 'Tela' },
                ]}
                />
            {/* <div className="p-4 border-b">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-primary-500" />
                </button>
            </div> */}
            <FabricForm />
        </div>
    )
}

export default CreateFabricTemplate