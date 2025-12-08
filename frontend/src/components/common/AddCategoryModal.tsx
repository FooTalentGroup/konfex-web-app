"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddCategoryModalProps {
    onClose: () => void;
    onConfirm: (nombre: string) => void | Promise<void>;
}

export function AddCategoryModal({ onClose, onConfirm }: AddCategoryModalProps) {
    const [name, setName] = useState("");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add Category</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    onClick={() => onConfirm(name)}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
