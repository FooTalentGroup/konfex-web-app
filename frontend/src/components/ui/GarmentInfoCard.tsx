'use client';

import React from 'react';
import PriceDisplay from './PriceDisplay';

interface GarmentInfoCardProps {
    id: number;
    season: string;
    price: number;
}

const GarmentInfoCard: React.FC<GarmentInfoCardProps> = ({ id, season, price }) => {
    return (
        <div className="bg-[#F3F0F5] p-4 rounded-lg border border-primary-300 flex sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 space-x-2">
                    <span className="text-sm font-medium text-gray-700">ID prenda:</span>
                    <span className="text-sm font-bold text-black">{id}</span>
                </div>
                <div className="flex items-center gap-2 space-x-2">
                    <span className="text-sm font-medium text-gray-700">Temporada:</span>
                    <span className="text-sm font-bold text-black">{season}</span>
                </div>
            </div>

            <div className="w-auto">
                <PriceDisplay
                    label="Costo prenda"
                    amount={price}
                    className="text-right"
                />
            </div>
        </div>
    );
};

export default GarmentInfoCard;
