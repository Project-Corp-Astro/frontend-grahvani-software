"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, Milestone, Info } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';

interface TribhagiDashaProps {
    periods: DashaNode[];
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

const ERA_NAMES: Record<number, string> = {
    1: "First Era (Childhood To Youth)",
    2: "Second Era (Adulthood)",
    3: "Third Era (Maturity & Wisdom)",
    4: "Fourth Era (Legacy)"
};

export default function TribhagiDasha({ periods }: TribhagiDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    // Group periods by cycle dynamically
    const cycles = useMemo(() => {
        const grouped: Record<number, DashaNode[]> = {};
        periods.forEach((p, idx) => {
            const cNum = p.raw?.cycle || Math.floor(idx / 9) + 1;
            if (!grouped[cNum]) grouped[cNum] = [];
            grouped[cNum].push(p);
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

    const currentCyclePeriods = cycles[selectedCycle] || [];

    return (
        <div className="space-y-3 animate-in fade-in duration-700">
            {/* Cycle/Era Navigation - Compact Tabs */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex bg-[#F5E6D3]/40 rounded-lg p-0.5 gap-1 border border-[#D08C60]/10 backdrop-blur-sm overflow-x-auto scrollbar-hide">
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
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap",
                                    isActive
                                        ? "bg-[#3E2A1F] text-[#FFD27D] shadow-sm font-semibold"
                                        : "hover:bg-[#3E2A1F]/5 text-[#3E2A1F]/70 font-medium"
                                )}
                            >
                                <span className="text-[10px] uppercase tracking-wider">Cycle {c}</span>
                                <span className="text-[10px] opacity-60">|</span>
                                <span className="text-[10px] font-mono opacity-80">{startYear}-{endYear}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="ml-auto hidden sm:flex items-center gap-2">
                    <h3 className="text-[10px] font-bold text-[#5A3E2B] flex items-center gap-2 uppercase tracking-wider bg-[#F5E6D3]/30 px-2 py-1 rounded-md border border-[#D08C60]/10">
                        <Milestone className="w-3 h-3 text-[#D08C60]" />
                        {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                    </h3>
                </div>
            </div>

            <div className="flex items-center justify-end sm:hidden">
                <h3 className="text-[10px] font-bold text-[#5A3E2B] flex items-center gap-2 uppercase tracking-wider">
                    <Milestone className="w-3.5 h-3.5 text-[#D08C60]" />
                    {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[9px] tracking-widest border-b border-[#D08C60]/10">
                        <tr>
                            <th className="px-3 py-2 text-left">Planet</th>
                            <th className="px-3 py-2 text-left">Start Date</th>
                            <th className="px-3 py-2 text-left">End Date</th>
                            <th className="px-3 py-2 text-left">Duration</th>
                            <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D08C60]/10 font-medium">
                        {currentCyclePeriods.map((mahadasha, mIdx) => {
                            const isExpanded = expandedMahadasha === `${selectedCycle}-${mahadasha.planet}`;
                            const antardashas = mahadasha.sublevel || [];

                            return (
                                <React.Fragment key={mIdx}>
                                    <tr
                                        className={cn(
                                            "hover:bg-[#D08C60]/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-[#D08C60]/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : `${selectedCycle}-${mahadasha.planet}`)}
                                    >
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-sm min-w-[60px] justify-center",
                                                    PLANET_COLORS[mahadasha.planet || ''] || "bg-white"
                                                )}>
                                                    {mahadasha.planet}
                                                </span>
                                                {mahadasha.isCurrent && (
                                                    <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-[#8B5A2B]/40" />
                                                {formatDateDisplay(mahadasha.startDate)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(mahadasha.endDate)}</td>
                                        <td className="px-3 py-2 text-xs text-[#8B5A2B] font-bold">
                                            {standardizeDuration(mahadasha.raw?.duration_years || mahadasha.raw?.years || 0, mahadasha.raw?.duration_days)}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {mahadasha.isCurrent ? (
                                                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-3 h-3 text-[#D08C60]" /> : <ChevronDown className="w-3 h-3 text-[#D08C60]" />
                                                ) : (
                                                    <span className="text-[#D08C60]/40 text-xs">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Antardasha Row */}
                                    {isExpanded && antardashas.length > 0 && (
                                        <tr>
                                            <td colSpan={5} className="bg-[#FAF7F2]/60 px-3 py-2">
                                                <div className="text-[9px] font-black text-[#8B5A2B] uppercase tracking-[0.2em] mb-2 pl-2 border-l-2 border-[#D08C60]/30 ml-1">
                                                    Sub-Periods
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-[#D08C60]/10">
                                                        {antardashas.map((antar, aIdx) => (
                                                            <tr key={aIdx} className={cn(
                                                                "hover:bg-white/50 transition-colors",
                                                                antar.isCurrent && "bg-green-50/50"
                                                            )}>
                                                                <td className="px-3 py-1.5">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border opacity-90",
                                                                        PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                    )}>
                                                                        {antar.planet}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-1.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.startDate)}</td>
                                                                <td className="px-3 py-1.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.endDate)}</td>
                                                                <td className="px-3 py-1.5 text-xs text-[#8B5A2B] font-bold">
                                                                    {standardizeDuration(antar.raw?.duration_years || antar.raw?.years || 0, antar.raw?.duration_days)}
                                                                </td>
                                                                <td className="px-3 py-1.5 text-center">
                                                                    {antar.isCurrent && (
                                                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
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
        </div>
    );
}
