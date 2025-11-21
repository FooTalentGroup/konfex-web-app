"use client"
import React, { useState, PropsWithChildren } from 'react'
import { BudgetFormData } from '@/types/IBudget'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface CostSectionCardProps extends PropsWithChildren {
    title: string;
    totalAmount: number;
    hideTotal?: boolean;
    // name: keyof BudgetFormData
}

const CostSectionCard: React.FC<CostSectionCardProps> = ({ title, totalAmount, hideTotal, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className={`w-full ${isExpanded ? 'bg-secondary-50' : 'bg-bg-gray-500'} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='w-full flex-col p-4 md:p-5 text-purple-800 hover:bg-purple-50 transition-colors duration-200 focus:outline-none'
                aria-expanded={isExpanded}
                aria-controls={`content-${title.replace(/\s/g, '-')}`}
                type='button'
            >
                <div className='w-full flex items-center justify-between'>
                    <div className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-5">
                        {!hideTotal && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-900 font-bold">$</span>
                                <span className="text-secondary-300 font-bold text-sm md:text-base">{totalAmount}</span>
                            </div>
                        )}

                        <div className="text-purple-500 transition-transform duration-300">
                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>
                    </div>
                </div>
                <div className='border border-gray-300 mx-0.5 mt-2'></div>
            </button>


            <div
                id={`content-${title.replace(/\s/g, '-')}`}
                // Utiliza max-h-0 y max-h-screen para una transición de altura fluida
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 bg-secondary-50 p-4 md:p-5 border-t border-purple-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                {children}
            </div>
        </div>
    )
}

export default CostSectionCard
