"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Calendar, Milestone, Info, ArrowDownNarrowWide, Minus } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';

interface TribhagiDashaProps {
    periods: DashaNode[];
}

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

    const PLANET_COLORS: Record<string, string> = {
        'Sun': 'border-orange-200 text-orange-700 bg-orange-50/50',
        'Moon': 'border-blue-200 text-blue-700 bg-blue-50/50',
        'Mars': 'border-red-200 text-red-700 bg-red-50/50',
        'Rahu': 'border-slate-200 text-slate-700 bg-slate-50/50',
        'Jupiter': 'border-yellow-200 text-yellow-700 bg-yellow-50/50',
        'Saturn': 'border-indigo-200 text-indigo-700 bg-indigo-50/50',
        'Mercury': 'border-emerald-200 text-emerald-700 bg-emerald-50/50',
        'Ketu': 'border-stone-200 text-stone-700 bg-stone-50/50',
        'Venus': 'border-pink-200 text-pink-700 bg-pink-50/50'
    };

    const ERA_NAMES: Record<number, string> = {
        1: "First Era (Childhood To Youth)",
        2: "Second Era (Adulthood)",
        3: "Third Era (Maturity & Wisdom)",
        4: "Fourth Era (Legacy)"
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Cycle/Era Navigation */}
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

            <div className="px-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-[#5A3E2B] flex items-center gap-3 uppercase tracking-widest">
                        <Milestone className="w-4 h-4 text-[#D08C60]" />
                        {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                    </h3>
                    <div className="text-[9px] font-black uppercase text-[#D08C60]/60 tracking-tighter flex items-center gap-2">
                        <Info className="w-3 h-3" /> Click a Mahadasha to explore sub-periods
                    </div>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-4 relative">
                    {/* Primary Connector Line */}
                    <div className="absolute left-[23px] top-6 bottom-6 w-[1.5px] bg-[#D08C60]/20"></div>

                    {(cycles[selectedCycle] || []).map((mahadasha, mIdx) => {
                        const isExpanded = expandedMahadasha === mahadasha.planet;
                        const antardashas = mahadasha.sublevel || [];

                        return (
                            <div key={mIdx} className="relative pl-12 group">
                                {/* Dot Indicator */}
                                <div className={cn(
                                    "absolute left-[16px] top-5 w-4 h-4 rounded-full border-[3px] border-white shadow-sm z-10 transition-transform duration-300 group-hover:scale-125",
                                    mahadasha.isCurrent ? "bg-green-500 ring-4 ring-green-100" : "bg-[#D08C60]"
                                )}></div>

                                <div className={cn(
                                    "bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden transition-all duration-300",
                                    mahadasha.isCurrent ? "border-green-200 ring-1 ring-green-50/50 shadow-sm" : "hover:border-[#D08C60]/40",
                                    isExpanded ? "shadow-md ring-2 ring-[#D08C60]/5" : ""
                                )}>
                                    {/* Mahadasha Header */}
                                    <button
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : mahadasha.planet)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className={cn(
                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-base sm:text-lg font-black shadow-inner",
                                                PLANET_COLORS[mahadasha.planet] || "bg-white"
                                            )}>
                                                {mahadasha.planet[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black text-[#D08C60]/60 uppercase tracking-widest leading-none">Mahadasha</span>
                                                    {mahadasha.isCurrent && (
                                                        <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-green-500 text-white uppercase tracking-widest">Active</span>
                                                    )}
                                                </div>
                                                <div className="text-sm sm:text-base font-black text-[#3E2A1F] uppercase tracking-wide leading-none">{mahadasha.planet}</div>
                                                <div className="mt-2 text-[10px] font-mono font-bold text-[#8B5A2B]/50">
                                                    {formatDateDisplay(mahadasha.startDate)} — {formatDateDisplay(mahadasha.endDate)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:gap-8">
                                            <div className="hidden sm:block text-right">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-[#8B5A2B]/40 mb-1">Total Impact</div>
                                                <div className="text-sm font-black text-[#3E2A1F]">
                                                    {standardizeDuration(mahadasha.raw?.duration_years || mahadasha.raw?.years || 0)}
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronDown className="w-5 h-5 text-[#D08C60]" /> : <ChevronRight className="w-5 h-5 text-[#D08C60]" />}
                                        </div>
                                    </button>

                                    {/* Antardasha Expansion (Nested Timeline) */}
                                    {isExpanded && (
                                        <div className="border-t border-[#D08C60]/10 bg-[#FAF7F2]/40 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2 mb-6">
                                                <ArrowDownNarrowWide className="w-3.5 h-3.5 text-[#D08C60]" />
                                                <span className="text-[9px] font-black text-[#8B5A2B] uppercase tracking-[0.2em]">Sub-Period Breakdown (Antardasha)</span>
                                            </div>

                                            <div className="relative space-y-3 ml-2">
                                                {/* Sub-Connector */}
                                                <div className="absolute left-[6.5px] top-2 bottom-2 w-[1px] bg-[#D08C60]/30 border-l border-dashed border-[#D08C60]/20"></div>

                                                {antardashas.map((antar, aIdx) => (
                                                    <div key={aIdx} className="relative pl-6">
                                                        {/* Sub-Dot */}
                                                        <div className={cn(
                                                            "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10",
                                                            antar.isCurrent ? "bg-green-500 scale-110" : "bg-[#D08C60]/40"
                                                        )}></div>

                                                        <div className={cn(
                                                            "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border bg-white/60 transition-colors",
                                                            antar.isCurrent ? "border-green-200 bg-green-50/30" : "border-[#D08C60]/10 hover:border-[#D08C60]/20"
                                                        )}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-black text-[#3E2A1F] uppercase tracking-wide w-16 sm:w-20">
                                                                    {antar.planet}
                                                                </span>
                                                                <div className="h-3 w-[1px] bg-[#D08C60]/20 hidden sm:block"></div>
                                                                <div className="text-[10px] font-mono font-bold text-[#8B5A2B] leading-none">
                                                                    {formatDateDisplay(antar.startDate)} <span className="opacity-40 px-1">—</span> {formatDateDisplay(antar.endDate)}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-end gap-3 px-1 sm:px-0">
                                                                {antar.isCurrent && (
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                                        <span className="text-[8px] font-black text-green-600 uppercase">Current</span>
                                                                    </div>
                                                                )}
                                                                <span className="text-[10px] font-black text-[#D08C60]">
                                                                    {standardizeDuration(antar.raw?.duration_years || antar.raw?.years || 0, antar.raw?.duration_days)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {antardashas.length === 0 && (
                                                    <div className="pl-6 text-xs italic text-[#8B5A2B]/40">
                                                        No sub-period details available
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Visual Legend / Health Status */}
            <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-3xl p-6 border border-[#D08C60]/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">Selected Cycle</div>
                        <div className="text-lg font-black text-[#3E2A1F]">{selectedCycle}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">Levels Monitored</div>
                        <div className="text-lg font-black text-[#3E2A1F]">2</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">Total Periods</div>
                        <div className="text-lg font-black text-[#3E2A1F]">{periods.length}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[8px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">Integrity Check</div>
                        <div className="text-lg font-black text-green-600 flex items-center justify-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                            V1.0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
