'use client';

import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import type { NormalizedHouse } from '@/types/yoga.types';

interface YogaHousesGridProps {
    data: NormalizedHouse[];
}

export const YogaHousesGrid = memo(function YogaHousesGrid({ data }: YogaHousesGridProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-5">
            <h3 className="font-serif font-bold text-primary mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-gold-primary" /> House Placements
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {data.map(house => (
                    <div
                        key={house.houseNumber}
                        className="bg-white border border-antique/50 rounded-lg p-2 text-center hover:border-gold-primary/30 transition-colors"
                    >
                        <span className="block text-[9px] text-primary opacity-60 font-bold uppercase">H{house.houseNumber}</span>
                        <span className="block text-xs font-serif font-bold text-primary mt-0.5">{house.sign}</span>
                        {house.lord && (
                            <span className="block text-[8px] text-gold-dark font-bold mt-0.5">{house.lord}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});
