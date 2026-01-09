"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import ChartControls from "@/components/astrology/ChartControls";
import PlanetaryTable, { PlanetaryInfo } from "@/components/astrology/PlanetaryTable";

export default function ChartsPage() {

    const mockPlanetaryData: PlanetaryInfo[] = [
        { planet: 'Ascendant', sign: 'Leo', degree: '14°32\'', nakshatra: 'Purva Phalguni', nakshatraPart: 1, house: 1 },
        { planet: 'Sun', sign: 'Leo', degree: '05°12\'', nakshatra: 'Magha', nakshatraPart: 2, house: 1 },
        { planet: 'Moon', sign: 'Leo', degree: '10°45\'', nakshatra: 'Magha', nakshatraPart: 4, house: 1 },
        { planet: 'Mars', sign: 'Leo', degree: '22°18\'', nakshatra: 'Purva Phalguni', nakshatraPart: 3, house: 1 },
        { planet: 'Mercury', sign: 'Virgo', degree: '02°10\'', nakshatra: 'Uttara Phalguni', nakshatraPart: 2, house: 2 },
        { planet: 'Jupiter', sign: 'Cancer', degree: '12°35\'', nakshatra: 'Pushya', nakshatraPart: 3, house: 12 },
        { planet: 'Venus', sign: 'Virgo', degree: '18°22\'', nakshatra: 'Hasta', nakshatraPart: 3, house: 2 },
        { planet: 'Saturn', sign: 'Aquarius', degree: '29°05\'', nakshatra: 'Purva Bhadrapada', nakshatraPart: 3, house: 7, isRetro: true },
        { planet: 'Rahu', sign: 'Scorpio', degree: '15°00\'', nakshatra: 'Anuradha', nakshatraPart: 4, house: 4, isRetro: true },
        { planet: 'Ketu', sign: 'Taurus', degree: '15°00\'', nakshatra: 'Rohini', nakshatraPart: 2, house: 10, isRetro: true },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Left Sidebar: Controls */}
            <div className="w-full lg:w-[280px] shrink-0 bg-[#FEFAEA] border border-[#E7D6B8] rounded p-4 overflow-y-auto custom-scrollbar">
                <ChartControls />
            </div>

            {/* Right Area: Chart Canvas & Data */}
            <div className="flex-1 bg-[#FEFAEA] border border-[#E7D6B8] rounded p-6 shadow-inner overflow-y-auto custom-scrollbar relative">

                {/* Decorative Background */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none sticky top-0"
                    style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                        backgroundBlendMode: 'multiply'
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-10 max-w-4xl mx-auto">

                    {/* Chart Section */}
                    <div className="w-full max-w-[450px] aspect-square">
                        <NorthIndianChart
                            ascendantSign={5}
                            planets={[
                                { name: 'Ju', signId: 4, degree: '12°' },
                                { name: 'Su', signId: 5, degree: '05°' },
                                { name: 'Ma', signId: 5, degree: '22°' },
                                { name: 'Ve', signId: 6, degree: '18°' },
                                { name: 'Me', signId: 6, degree: '02°' },
                                { name: 'Ra', signId: 8, degree: '15°' },
                                { name: 'Ke', signId: 2, degree: '15°' },
                                { name: 'Sa', signId: 11, degree: '29°' },
                                { name: 'Mo', signId: 5, degree: '10°' },
                                { name: 'Asc', signId: 4, degree: '14°' }
                            ]}
                        />
                    </div>

                    {/* Planetary Table Section */}
                    <div className="w-full">
                        <h3 className="font-serif text-[#9C7A2F] text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-[#9C7A2F]/50"></span>
                            Planetary Details
                            <span className="w-8 h-[1px] bg-[#9C7A2F]/50"></span>
                        </h3>
                        <PlanetaryTable planets={mockPlanetaryData} />
                    </div>

                </div>
            </div>
        </div>
    );
}
