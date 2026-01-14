"use client";

import React, { useState } from 'react';
import { Map, Grid3X3, Maximize2, Minimize2, Info } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import NorthIndianChart from '@/components/astrology/NorthIndianChart';
import { cn } from "@/lib/utils";

// Mock Data for Multiple Vargas
const VARGA_DATA = {
    D1: { label: "Rashi (D1)", desc: "Physical Body & General Destiny", asc: 8, planets: [{ name: 'Su', signId: 8, degree: '22°' }, { name: 'Mo', signId: 8, degree: '05°' }] },
    D9: { label: "Navamsha (D9)", desc: "Spiritual Core & Marriage", asc: 4, planets: [{ name: 'Su', signId: 1, degree: '22°' }, { name: 'Mo', signId: 10, degree: '05°' }] },
    D10: { label: "Dashamsha (D10)", desc: "Career & Status", asc: 11, planets: [{ name: 'Su', signId: 10, degree: '22°' }, { name: 'Mo', signId: 5, degree: '05°' }] },
    D4: { label: "Chaturthamsha (D4)", desc: "Assets & Residence", asc: 2, planets: [{ name: 'Su', signId: 5, degree: '22°' }, { name: 'Mo', signId: 11, degree: '05°' }] },
    // D7: { label: "Saptamsha (D7)", desc: "Progeny & Legacy", asc: 5, planets: [{ name: 'Su', signId: 9, degree: '22°' }, { name: 'Mo', signId: 1, degree: '05°' }] },
};

export default function VedicDivisionalPage() {
    const { clientDetails } = useVedicClient();
    const [maximizedChart, setMaximizedChart] = useState<string | null>(null);

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-1 flex items-center gap-3">
                        <Grid3X3 className="w-6 h-6 text-[#D08C60]" />
                        Shodashvarga Matrix
                    </h1>
                    <p className="text-[#8B5A2B] font-serif text-sm">Simultaneous analysis of subtle harmonic charts.</p>
                </div>
                <div className="flex bg-[#FFFFFa] border border-[#D08C60]/30 rounded-lg p-1">
                    <button className="px-3 py-1.5 text-xs font-bold uppercase bg-[#D08C60] text-white rounded shadow-sm">Grid View</button>
                    <button className="px-3 py-1.5 text-xs font-bold uppercase text-[#8B5A2B]/60 hover:bg-[#D08C60]/5 rounded">Table View</button>
                </div>
            </header>

            <div className={cn(
                "grid gap-4 flex-1 min-h-0",
                maximizedChart ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" // 2x2 Grid by default
            )}>
                {Object.entries(VARGA_DATA).map(([key, data]) => {
                    if (maximizedChart && maximizedChart !== key) return null;

                    return (
                        <div key={key} className="bg-[#FFFFFa]/80 border border-[#D08C60]/20 rounded-2xl p-4 flex flex-col relative group transition-all hover:border-[#D08C60]/50 shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-2 shrink-0">
                                <div>
                                    <h3 className="font-serif font-bold text-[#3E2A1F] text-lg">{data.label}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-[#8B5A2B]">{data.desc}</p>
                                </div>
                                <button
                                    onClick={() => setMaximizedChart(maximizedChart === key ? null : key)}
                                    className="p-2 hover:bg-[#D08C60]/10 rounded-full text-[#D08C60] transition-colors"
                                >
                                    {maximizedChart === key ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="flex-1 min-h-0 relative flex items-center justify-center bg-[#FDFBF7] rounded-xl border border-[#D08C60]/5">
                                <div className="w-full h-full p-2 max-w-sm aspect-square">
                                    <NorthIndianChart
                                        ascendantSign={data.asc}
                                        planets={data.planets}
                                        className="bg-transparent border-none"
                                    />
                                </div>
                            </div>

                            {/* Vimshopak Balance Placeholder */}
                            <div className="mt-3 py-2 px-3 bg-[#D08C60]/5 rounded-lg flex justify-between items-center text-xs">
                                <span className="font-bold text-[#3E2A1F]">Vimshopak Score</span>
                                <span className="font-mono text-[#D08C60]">14.5 / 20</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
