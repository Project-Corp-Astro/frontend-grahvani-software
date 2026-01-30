"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Info, Clock, AlertCircle, Zap, Milestone } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';

interface ShattrimshatsamaDashaProps {
    periods: DashaNode[];
    isApplicable?: boolean;
}

export default function ShattrimshatsamaDasha({ periods, isApplicable = true }: ShattrimshatsamaDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    const PLANET_COLORS: Record<string, string> = {
        'Sun': 'border-orange-200 text-orange-700 bg-orange-50/50',
        'Mars': 'border-red-200 text-red-700 bg-red-50/50',
        'Jupiter': 'border-yellow-200 text-yellow-700 bg-yellow-50/50',
        'Saturn': 'border-indigo-200 text-indigo-700 bg-indigo-50/50',
        'Moon': 'border-blue-200 text-blue-700 bg-blue-50/50',
        'Mercury': 'border-emerald-200 text-emerald-700 bg-emerald-50/50',
        'Venus': 'border-pink-200 text-pink-700 bg-pink-50/50',
        'Rahu': 'border-purple-200 text-purple-700 bg-purple-50/50',
        'Ketu': 'border-stone-200 text-stone-700 bg-stone-50/50'
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

    // Group periods by cycle dynamically (like Tribhagi)
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

    // Find the cycle containing the currently active Mahadasha
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

    // Get the periods for the currently selected cycle (max 8)
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

            {/* Cycle Toggle Navigation (Tribhagi Style) */}
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
            <div className="bg-[#3E2A1F]/5 rounded-2xl p-4 border border-[#D08C60]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#D08C60]/5 border border-[#D08C60]/10 rounded-full text-[9px] font-black text-[#D08C60] uppercase tracking-wider">
                        <Zap className="w-3 h-3" />
                        8 Planet Sequence
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-[#D08C60]/60 uppercase">
                        Strict 1-Cycle Timeline
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="space-y-4 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[-12px] top-6 bottom-6 w-[1px] bg-[#D08C60]/10 hidden"></div>

                {finalPeriods.map((mahadasha, mIdx) => {
                    const uniqueId = `shattrim-${mahadasha.planet}-${mIdx}`;
                    const isExpanded = expandedMahadasha === uniqueId;
                    const antardashas = mahadasha.sublevel || [];
                    const isBalance = mIdx === 0;
                    const durationStr = calculateDuration(mahadasha.startDate, mahadasha.endDate)
                        .replace(/(\d+)\s*years?/gi, '$1Y')
                        .replace(/(\d+)\s*months?/gi, '$1M')
                        .replace(/(\d+)\s*days?/gi, '$1D');

                    return (
                        <div key={uniqueId} className="relative group">
                            {/* Dot Indicator on Connector for Active Period */}
                            {mahadasha.isCurrent && (
                                <div className="absolute left-[-20px] top-10 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm z-20 animate-pulse"></div>
                            )}

                            <div className={cn(
                                "bg-white rounded-[24px] border border-gray-100 overflow-hidden transition-all duration-300 relative",
                                mahadasha.isCurrent ? "border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "hover:border-[#D08C60]/20 shadow-sm",
                                isExpanded ? "shadow-lg border-[#D08C60]/10" : "shadow-sm"
                            )}>
                                {/* Active Side Accent */}
                                {mahadasha.isCurrent && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
                                )}

                                {/* Mahadasha Header */}
                                <button
                                    onClick={() => setExpandedMahadasha(isExpanded ? null : uniqueId)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                                >
                                    <div className="flex items-center gap-4 sm:gap-7 pl-1">
                                        <div className={cn(
                                            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border flex items-center justify-center text-lg sm:text-xl font-black shadow-inner transition-colors font-serif",
                                            PLANET_COLORS[mahadasha.planet || ""] || "bg-white border-stone-100"
                                        )}>
                                            {mahadasha.planet?.[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                <span className="text-[10px] font-black text-[#D08C60]/60 uppercase tracking-widest leading-none">Mahadasha</span>
                                                {mahadasha.isCurrent && (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black bg-green-600 text-white uppercase tracking-widest shadow-sm">
                                                        Active
                                                    </span>
                                                )}
                                                {isBalance && (
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black bg-[#4386F4] text-white uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Balance at Birth
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xl sm:text-2xl font-black text-[#3E2A1F] uppercase tracking-tight leading-none font-serif">
                                                {mahadasha.planet}
                                            </div>
                                            <div className="mt-2 text-[11px] font-mono font-bold text-[#8B5A2B]/40">
                                                {formatDateDisplay(mahadasha.startDate)} — {formatDateDisplay(mahadasha.endDate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-12">
                                        <div className="text-right">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-[#8B5A2B]/40 mb-1">Shastra Duration</div>
                                            <div className="text-lg font-black text-[#3E2A1F]">
                                                {durationStr}
                                            </div>
                                            <div className="text-[9px] font-bold text-[#D08C60]/70 uppercase tracking-tighter">
                                                {FIXED_DURATIONS[mahadasha.planet || ""] || "0"} Years Fixed
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#D08C60]/30 group-hover:text-[#D08C60] transition-colors">
                                            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                                        </div>
                                    </div>
                                </button>

                                {/* Antardasha Expansion */}
                                {isExpanded && (
                                    <div className="border-t border-gray-50 bg-gray-50/20 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-3 relative ml-2">
                                            <div className="absolute left-[6.5px] top-2 bottom-2 w-[1px] bg-[#D08C60]/30 border-l border-dashed border-[#D08C60]/20"></div>

                                            {antardashas.map((antar, aIdx) => {
                                                const antarDurationStr = calculateDuration(antar.startDate, antar.endDate)
                                                    .replace(/(\d+)\s*years?/gi, '$1Y')
                                                    .replace(/(\d+)\s*months?/gi, '$1M')
                                                    .replace(/(\d+)\s*days?/gi, '$1D');
                                                return (
                                                    <div key={aIdx} className="relative pl-6">
                                                        <div className={cn(
                                                            "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10",
                                                            antar.isCurrent ? "bg-green-500 scale-110" : "bg-[#D08C60]/40"
                                                        )}></div>

                                                        <div className={cn(
                                                            "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border bg-white/60 transition-colors",
                                                            antar.isCurrent ? "border-green-200 bg-green-50/20" : "border-[#D08C60]/10 hover:border-[#D08C60]/20"
                                                        )}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-black text-[#3E2A1F] uppercase tracking-wide w-16 sm:w-20">
                                                                    {antar.planet}
                                                                </span>
                                                                <div className="h-3 w-[1px] bg-[#D08C60]/20 hidden sm:block"></div>
                                                                <div className="text-[10px] font-mono font-bold text-[#8B5A2B]">
                                                                    {formatDateDisplay(antar.startDate)} <span className="opacity-40 px-1">—</span> {formatDateDisplay(antar.endDate)}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                                                {antar.isCurrent && (
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                                        <span className="text-[8px] font-black text-green-600 uppercase">Current</span>
                                                                    </div>
                                                                )}
                                                                <span className="text-[10px] font-black text-[#D08C60] uppercase tracking-tight">
                                                                    {antarDurationStr}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {antardashas.length === 0 && (
                                                <div className="pl-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    No Antardasha data available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Termination Footer */}
                <div className="pt-4 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <Info className="w-3 h-3" />
                        Shastra Timeline End (36 Years)
                    </p>
                </div>
            </div>
        </div>
    );
}
