"use client";

import React from 'react';
import {
    AlertTriangle,
    RefreshCcw,
    TrendingUp,
    ShieldAlert,
    Info,
    ChevronRight,
    Crosshair
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";
import NorthIndianChart from '@/components/astrology/NorthIndianChart';

// MOCK TRANSIT DATA (Real-time approx)
const CURRENT_TRANSITS = [
    { planet: 'Sun', sign: 'Sagittarius', degree: '24°10\'', house: 2, status: 'Neutral' },
    { planet: 'Moon', sign: 'Leo', degree: '12°05\'', house: 10, status: 'Benefic' }, // Transit Moon
    { planet: 'Mars', sign: 'Cancer', degree: '05°22\'', house: 9, status: 'Debilitated', isRetro: true },
    { planet: 'Mercury', sign: 'Scorpio', degree: '15°45\'', house: 1, status: 'Neutral' },
    { planet: 'Jupiter', sign: 'Taurus', degree: '18°30\'', house: 7, status: 'Benefic', isRetro: true },
    { planet: 'Venus', sign: 'Aquarius', degree: '02°11\'', house: 4, status: 'Friend' },
    { planet: 'Saturn', sign: 'Aquarius', degree: '19°55\'', house: 4, status: 'Moolatrikona' },
    { planet: 'Rahu', sign: 'Pisces', degree: '02°30\'', house: 5, status: 'Neutral' },
    { planet: 'Ketu', sign: 'Virgo', degree: '02°30\'', house: 11, status: 'Neutral' },
];

export default function TransitsPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-1 flex items-center gap-3">
                        <RefreshCcw className="w-8 h-8 text-[#D08C60]" />
                        Transit Impact Analysis
                    </h1>
                    <p className="text-[#8B5A2B] font-serif text-sm">Real-time planetary influence on the natal field.</p>
                </div>
                <div className="bg-[#D08C60]/10 px-4 py-2 rounded-lg border border-[#D08C60]/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase text-[#3E2A1F] tracking-wider">Live Ephemeris</span>
                </div>
            </div>

            {/* CRITICAL ALERTS BANNER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="p-2 bg-red-100/50 rounded-lg text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900 font-serif text-lg">Caution: Mars Retrograde</h3>
                        <p className="text-xs text-red-800/80 mt-1 leading-relaxed">
                            Mars is currently retrograde in Cancer (Debilitation). Avoid hasty decisions regarding property or conflicts.
                            Transit involves 9th House issues.
                        </p>
                    </div>
                </div>

                <div className="bg-[#D08C60]/10 border border-[#D08C60]/30 rounded-2xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute right-0 top-0 opacity-10">
                        <ShieldAlert className="w-24 h-24" />
                    </div>
                    <div className="p-2 bg-[#D08C60]/20 rounded-lg text-[#8B5A2B]">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-[#5A3E2B] font-serif text-lg">Sade Sati Check</h3>
                        <p className="text-xs text-[#5A3E2B]/80 mt-1">
                            Client is currently <strong>NOT</strong> in Sade Sati.
                            <br />
                            <span className="font-bold opacity-70">Next Phase: Saturn enters Aries (2028).</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Transit Chart Overlay */}
                <div className="lg:col-span-1 bg-[#FFFFFa]/60 border border-[#D08C60]/20 rounded-3xl p-6 flex flex-col items-center justify-center relative">
                    <h3 className="w-full text-center font-bold text-[#3E2A1F] uppercase tracking-widest text-xs mb-4">Gochar Chart (Transit)</h3>
                    <div className="w-full aspect-square max-w-xs relative p-2 bg-white rounded-xl shadow-inner border border-[#D08C60]/10">
                        {/* We reuse chart component but ideally transit chart overlays outer ring */}
                        <NorthIndianChart
                            ascendantSign={8} // Scorpio Lagna (Natal)
                            planets={[]}  // Mock empty, just showing structure
                            className="opacity-60 grayscale-[0.5]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-[#D08C60] text-white text-[10px] px-2 py-1 rounded shadow-lg font-bold uppercase">Transit Overlay</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Detailed Transit Table */}
                <div className="lg:col-span-2 bg-[#FFFFFa] border border-[#D08C60]/20 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-[#D08C60]/10 bg-[#FAF7F2] flex justify-between items-center">
                        <h3 className="font-serif font-bold text-[#3E2A1F]">Planetary Positions</h3>
                        <span className="text-[10px] uppercase text-[#8B5A2B]/60 tracking-wider">Ayanamsa: Lahiri</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-3">Planet</th>
                                    <th className="px-6 py-3">Sign</th>
                                    <th className="px-6 py-3">House (Lagna)</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Vedha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D08C60]/10">
                                {CURRENT_TRANSITS.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#3E2A1F]/5 transition-colors group">
                                        <td className="px-6 py-3 font-bold text-[#3E2A1F] flex items-center gap-2">
                                            {row.planet}
                                            {row.isRetro && <RefreshCcw className="w-3 h-3 text-red-500 animate-spin-slow" />}
                                        </td>
                                        <td className="px-6 py-3 font-serif text-[#5A3E2B]">
                                            {row.sign} <span className="text-[10px] text-muted-foreground ml-1 font-mono">{row.degree}</span>
                                        </td>
                                        <td className="px-6 py-3 text-[#5A3E2B]">
                                            <span className="font-bold">{row.house}th</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider border",
                                                row.status === 'Debilitated' ? "bg-red-100 text-red-700 border-red-200" :
                                                    row.status === 'Benefic' ? "bg-green-100 text-green-700 border-green-200" :
                                                        "bg-gray-100 text-gray-600 border-gray-200"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-[#3E2A1F]/30 text-xs">—</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Custom animation utility css class 'animate-spin-slow' would be needed in global css or tailwind config
