"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, Info, Milestone, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';

interface ShattrimshatsamaDashaProps {
    periods: DashaNode[];
    isApplicable?: boolean;
}

// Vimshottari-style planet colors
const PLANET_COLORS: Record<string, string> = {
    Sun: 'bg-orange-100 text-orange-800 border-orange-300',
    Moon: 'bg-slate-100 text-slate-700 border-slate-300',
    Mars: 'bg-red-100 text-red-800 border-red-300',
    Mercury: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Jupiter: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Venus: 'bg-pink-100 text-pink-800 border-pink-300',
    Saturn: 'bg-gray-200 text-gray-800 border-gray-400',
    Rahu: 'bg-purple-100 text-purple-800 border-purple-300',
    Ketu: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

const FIXED_DURATIONS: Record<string, number> = {
    'Saturn': 6,
    'Venus': 7,
    'Rahu': 8,
    'Moon': 1,
    'Sun': 2,
    'Jupiter': 3,
    'Mars': 4,
    'Mercury': 5
};

export default function ShattrimshatsamaDasha({ periods, isApplicable = true }: ShattrimshatsamaDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    // Group periods by cycle dynamically
    const cycles = useMemo(() => {
        const grouped: Record<number, DashaNode[]> = {};
        periods.forEach((p, idx) => {
            const cNum = p.raw?.cycle || p.raw?.cycle_number || Math.floor(idx / 8) + 1;
            const cycleKey = typeof cNum === 'string' ? parseInt(cNum, 10) : cNum;
            if (!grouped[cycleKey]) grouped[cycleKey] = [];
            grouped[cycleKey].push(p);
        });
        return grouped;
    }, [periods]);

    const availableCycles = useMemo(() => {
        return Object.keys(cycles).map(Number).sort((a, b) => a - b);
    }, [cycles]);

    const activeCycleNum = useMemo(() => {
        for (const cNum of availableCycles) {
            if (cycles[cNum].some(p => p.isCurrent)) return cNum;
        }
        return availableCycles.length > 0 ? availableCycles[0] : 1;
    }, [cycles, availableCycles]);

    React.useEffect(() => {
        if (activeCycleNum) setSelectedCycle(activeCycleNum);
    }, [activeCycleNum]);

    if (availableCycles.length === 0) return null;

    const finalPeriods = (cycles[selectedCycle] || []).slice(0, 8);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Applicability Warning */}
            {!isApplicable && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-900">Not Highly Applicable</p>
                        <p className="text-xs text-amber-700">This Śattriṁśat Samā (36-year) system is specifically for Daytime births with Moon in Lagna.</p>
                    </div>
                </div>
            )}

            {/* Cycle Toggle Navigation */}
            {availableCycles.length > 1 && (
                <div className="flex bg-[#F5E6D3]/30 rounded-3xl p-1 gap-2 border border-[#D08C60]/10 backdrop-blur-sm shadow-inner overflow-x-auto scrollbar-hide">
                    {availableCycles.map((c) => {
                        const isActive = selectedCycle === c;
                        const cyclePeriods = cycles[c];
                        const startYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[0].startDate).split(' ').pop() : '';
                        const endYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[cyclePeriods.length - 1].endDate).split(' ').pop() : '';

                        return (
                            <button
                                key={c}
                                onClick={() => setSelectedCycle(c)}
                                className={cn(
                                    "flex-1 min-w-[150px] flex flex-col items-center justify-center py-2.5 px-4 rounded-2xl transition-all duration-300",
                                    isActive ? "bg-[#3E2A1F] text-[#FFD27D] shadow-lg" : "bg-transparent text-[#3E2A1F]/40 hover:text-[#3E2A1F]/70"
                                )}
                            >
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cycle {c}</span>
                                <span className="text-[11px] font-mono font-bold">{startYear} — {endYear}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Header Info */}
            <div className="bg-[#3E2A1F]/5 rounded-2xl p-4 border border-[#D08C60]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D08C60]/10 flex items-center justify-center">
                        <Milestone className="w-5 h-5 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#3E2A1F] uppercase tracking-wider">Śattriṁśat Samā Dasha</h3>
                        <p className="text-[10px] font-bold text-[#8B5A2B]/60 uppercase">
                            {availableCycles.length > 1 ? `Cycle ${selectedCycle} of ${availableCycles.length}` : 'Single 36-Year Cycle'} • 8 Planets
                        </p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-[#D08C60]/60 uppercase">
                    <Info className="w-3.5 h-3.5" />
                    Click row to expand sub-periods
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest border-b border-[#D08C60]/10">
                        <tr>
                            <th className="px-6 py-4 text-left">Planet</th>
                            <th className="px-6 py-4 text-left">Start Date</th>
                            <th className="px-6 py-4 text-left">End Date</th>
                            <th className="px-6 py-4 text-left">Duration</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D08C60]/10 font-medium">
                        {finalPeriods.map((mahadasha, mIdx) => {
                            const uniqueId = `shattrim-${mahadasha.planet}-${mIdx}`;
                            const isExpanded = expandedMahadasha === uniqueId;
                            const antardashas = mahadasha.sublevel || [];
                            const isBalance = mIdx === 0;
                            const fixedYears = FIXED_DURATIONS[mahadasha.planet || ""];

                            return (
                                <React.Fragment key={uniqueId}>
                                    <tr
                                        className={cn(
                                            "hover:bg-[#D08C60]/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-[#D08C60]/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : uniqueId)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border shadow-sm",
                                                    PLANET_COLORS[mahadasha.planet || ''] || "bg-white"
                                                )}>
                                                    {mahadasha.planet}
                                                </span>
                                                {mahadasha.isCurrent && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                        Current Active
                                                    </span>
                                                )}
                                                {isBalance && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                        <AlertCircle className="w-2.5 h-2.5" />
                                                        Balance at Birth
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]/40" />
                                                {formatDateDisplay(mahadasha.startDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">{formatDateDisplay(mahadasha.endDate)}</td>
                                        <td className="px-6 py-4 text-sm text-[#8B5A2B] font-bold">
                                            <div className="flex flex-col">
                                                <span>{calculateDuration(mahadasha.startDate, mahadasha.endDate)}</span>
                                                {fixedYears && (
                                                    <span className="text-[9px] text-[#D08C60] leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {mahadasha.isCurrent ? (
                                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-4 h-4 text-[#D08C60]" /> : <ChevronDown className="w-4 h-4 text-[#D08C60]" />
                                                ) : (
                                                    <span className="text-[#D08C60]/40">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Antardasha Row */}
                                    {isExpanded && antardashas.length > 0 && (
                                        <tr>
                                            <td colSpan={5} className="bg-[#FAF7F2]/60 px-6 py-4">
                                                <div className="text-[9px] font-black text-[#8B5A2B] uppercase tracking-[0.2em] mb-3">
                                                    Antardasha Sub-Periods
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-[#D08C60]/10">
                                                        {antardashas.map((antar, aIdx) => (
                                                            <tr key={aIdx} className={cn(
                                                                "hover:bg-white/50 transition-colors",
                                                                antar.isCurrent && "bg-green-50/50"
                                                            )}>
                                                                <td className="px-4 py-2.5">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border",
                                                                        PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                    )}>
                                                                        {antar.planet}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.startDate)}</td>
                                                                <td className="px-4 py-2.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.endDate)}</td>
                                                                <td className="px-4 py-2.5 text-xs text-[#8B5A2B] font-bold">
                                                                    {calculateDuration(antar.startDate, antar.endDate)}
                                                                </td>
                                                                <td className="px-4 py-2.5 text-center">
                                                                    {antar.isCurrent && (
                                                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Shastra Timeline Footer */}
            <div className="text-center pt-2">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Info className="w-3 h-3" />
                    Shastra Timeline End (36 Years)
                </p>
            </div>
        </div>
    );
}
