"use client";

import React, { useState } from 'react';
import ChartComparison from '@/components/astrology/ChartComparison';
import { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import { GitCompare } from 'lucide-react';
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import GoldenButton from "@/components/GoldenButton";

// MOCK DATA GENERATOR (Reused)
const generateMockPlanets = (ascSign: number): Planet[] => [
    { name: 'Asc', signId: ascSign, degree: '14°' },
    { name: 'Su', signId: 5, degree: '05°' },
    { name: 'Mo', signId: 2, degree: '10°' },
    { name: 'Ma', signId: 6, degree: '22°' },
    { name: 'Me', signId: 6, degree: '02°' },
    { name: 'Ju', signId: 4, degree: '12°' },
    { name: 'Ve', signId: 7, degree: '18°' },
    { name: 'Sa', signId: 11, degree: '29°' },
    { name: 'Ra', signId: 8, degree: '15°' },
    { name: 'Ke', signId: 2, degree: '15°' },
];

const generateAltPlanets = (ascSign: number): Planet[] => [
    { name: 'Asc', signId: ascSign, degree: '02°' },
    { name: 'Su', signId: 1, degree: '25°' },
    { name: 'Mo', signId: 4, degree: '15°' },
    { name: 'Ma', signId: 10, degree: '05°' },
    { name: 'Me', signId: 12, degree: '10°' },
    { name: 'Ju', signId: 9, degree: '22°' },
    { name: 'Ve', signId: 11, degree: '08°' },
    { name: 'Sa', signId: 7, degree: '19°' },
    { name: 'Ra', signId: 3, degree: '01°' },
    { name: 'Ke', signId: 9, degree: '01°' },
];

export default function ClientComparisonPage() {
    const [chart1Type, setChart1Type] = useState("D1");
    const [chart2Type, setChart2Type] = useState("Partner (Synastry)");
    const [ayanamsa, setAyanamsa] = useState("Lahiri");

    const chart1 = {
        name: "Ananya Sharma (Natal)",
        ascendantSign: 5, // Leo
        planets: generateMockPlanets(5),
    };

    const chart2 = {
        name: "Partner / Transit",
        ascendantSign: 8, // Scorpio
        planets: generateAltPlanets(8),
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Header Card */}
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-[#D08C60]/30"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                }}
            >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <GitCompare className="w-5 h-5 text-[#D08C60]" />
                    <h1 className="font-serif text-2xl font-bold text-[#FEFAEA]">Chart Comparison</h1>
                </div>
                <p className="text-[#FEFAEA]/80 font-serif italic text-sm max-w-2xl relative z-10">
                    Compare two charts side-by-side to analyze compatibility (Synastry) or overlay transit planetary positions against the natal chart.
                </p>
            </div>

            {/* Controls Section */}
            <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 1. Ayanamsa */}
                    <ParchmentSelect
                        label="Ayanamsa"
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value)}
                        options={[
                            { value: "Lahiri", label: "Lahiri (Chitra Paksha)" },
                            { value: "Raman", label: "BV Raman" },
                            { value: "KP", label: "Krishnamurti Paddhati" },
                            { value: "Tropical", label: "Tropical" }
                        ]}
                    />

                    {/* 2. Chart Type (Reference including D-Charts) */}
                    <ParchmentSelect
                        label="Primary Chart"
                        value={chart1Type}
                        onChange={(e) => setChart1Type(e.target.value)}
                        options={[
                            { value: "D1", label: "D1 - Rashi (Natal)" },
                            { value: "D9", label: "D9 - Navamsa" },
                            { value: "D10", label: "D10 - Dasamsa" },
                            { value: "D4", label: "D4 - Chaturthamsa" },
                            { value: "D7", label: "D7 - Saptamsa" },
                            { value: "D2", label: "D2 - Hora" },
                            { value: "D3", label: "D3 - Drekkana" },
                            { value: "D12", label: "D12 - Dwadasamsa" },
                            { value: "D16", label: "D16 - Shodasamsa" },
                            { value: "D20", label: "D20 - Vimsamsa" },
                            { value: "D24", label: "D24 - Chaturvimsamsa" },
                            { value: "D27", label: "D27 - Saptavimsamsa" },
                            { value: "D30", label: "D30 - Trimsamsa" },
                            { value: "D40", label: "D40 - Khavedamsa" },
                            { value: "D45", label: "D45 - Akshavedamsa" },
                            { value: "D60", label: "D60 - Shastiamsa" }
                        ]}
                    />

                    {/* 3. Comparison Target */}
                    <ParchmentSelect
                        label="Compare With"
                        value={chart2Type}
                        onChange={(e) => setChart2Type(e.target.value)}
                        options={[
                            { value: "Partner (Synastry)", label: "Partner (Synastry)" },
                            { value: "Transit Chart", label: "Transit Chart" },
                            { value: "Progressed Chart", label: "Progressed Chart" },
                            { value: "Solar Return", label: "Solar Return (Varshphal)" }
                        ]}
                    />
                </div>

                <div className="flex justify-center">
                    <GoldenButton
                        topText="Generate"
                        bottomText="Comparison"
                        className="w-full md:w-auto"
                        onClick={() => { }}
                    />
                </div>
            </div>

            <main>
                <ChartComparison chart1={chart1} chart2={chart2} />
            </main>
        </div>
    );
}
