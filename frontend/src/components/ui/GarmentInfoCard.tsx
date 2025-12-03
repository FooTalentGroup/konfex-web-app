'use client';

import React from 'react';
import PriceDisplay from './PriceDisplay';

interface GarmentInfoCardProps {
    id: string;
    season: string;
    price: number;
}

const GarmentInfoCard: React.FC<GarmentInfoCardProps> = ({ id, season, price }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">ID prenda:</span>
                    <span className="text-sm font-bold text-black">{id}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Temporada:</span>
                    <span className="text-sm font-bold text-black">{season}</span>
                </div>
            </div>

            <div className="w-auto">
                <PriceDisplay
                    label="Precio prenda"
                    amount={price}
                    className="text-right"
                />
            </div>
        </div>
    );
};

export default GarmentInfoCard;