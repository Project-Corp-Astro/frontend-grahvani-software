"use client";

import React from 'react';
import { Compass, Orbit, Zap, Star } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import PlanetaryAnalytics, { DetailedPlanetInfo } from '@/components/astrology/PlanetaryAnalytics';

const MOCK_DETAILED_PLANETS: DetailedPlanetInfo[] = [
    { planet: 'Sun', sign: 'Leo', degree: '22° 14\' 30"', nakshatra: 'Purva Phalguni', pada: 3, nakshatraLord: 'Venus', house: 1, dignity: 'Own Sign' },
    { planet: 'Moon', sign: 'Leo', degree: '05° 10\' 12"', nakshatra: 'Magha', pada: 2, nakshatraLord: 'Ketu', house: 1, dignity: 'Friend' },
    // Simplified for placeholder
];

export default function VedicPlanetsPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#FFFFFa]/40 border border-[#D08C60]/30 p-10 rounded-[3rem] shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                    <Compass className="w-10 h-10 text-[#D08C60]" />
                    <h1 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">Celectial Coordinates</h1>
                </div>
                <p className="text-[#5A3E2B]/80 italic font-serif text-lg max-w-2xl mb-10">
                    Precision coordinates and mathematical dignity for every graha in {clientDetails.name}'s natal field.
                </p>

                <PlanetaryAnalytics planets={MOCK_DETAILED_PLANETS} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-[#3E2A1F]/5 border border-[#D08C60]/10 rounded-[2.5rem] hover:border-[#D08C60]/40 transition-all hover:bg-[#3E2A1F]/10 hover:shadow-lg group">
                    <Orbit className="w-8 h-8 text-[#D08C60] mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-serif text-[#3E2A1F] font-black mb-4">Graha Drishti</h3>
                    <p className="text-[#5A3E2B]/70 font-serif">Mapping the aspect fields and mutual planetary interactions across the 12 houses.</p>
                </div>
                <div className="p-10 bg-[#3E2A1F]/5 border border-[#D08C60]/10 rounded-[2.5rem] hover:border-[#D08C60]/40 transition-all hover:bg-[#3E2A1F]/10 hover:shadow-lg group">
                    <Zap className="w-8 h-8 text-[#C9A24D] mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-serif text-[#3E2A1F] font-black mb-4">Shadbala Strength</h3>
                    <p className="text-[#5A3E2B]/70 font-serif">Calculation of the six-fold strength index for determining active cosmic power.</p>
                </div>
            </div>
        </div>
    );
}
