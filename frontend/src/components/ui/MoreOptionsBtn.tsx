"use client";
import { MoreVertical, Send, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MoreOptionsButtonProps {
    onSend: () => void;
    onSavePDF: () => void;
}

export default function MoreOptionsButton({ onSend, onSavePDF }: MoreOptionsButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-100 shadow transition absolute right-0"
            >
                <MoreVertical className="w-5 h-5 text-primary-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 w-48 z-10">
                    <button
                        onClick={() => {
                            onSend();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                    >
                        <Send className="w-4 h-4" />
                        <span>Enviar</span>
                    </button>

                    <button
                        onClick={() => {
                            onSavePDF();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Guardar PDF</span>
                    </button>
                </div>
            )}
        </div>
    );
}
