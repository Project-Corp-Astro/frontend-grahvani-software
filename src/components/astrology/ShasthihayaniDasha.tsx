"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Info, Clock, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';

interface ShasthihayaniDashaProps {
    periods: DashaNode[];
    isApplicable?: boolean;
}

export default function ShasthihayaniDasha({ periods, isApplicable = true }: ShasthihayaniDashaProps) {
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
        'Mercury': 10,
        'Venus': 8,
        'Saturn': 12,
        'Rahu': 12,
        'Jupiter': 10,
        'Sun': 6,
        'Mars': 7,
        'Moon': 5
    };

    // SHASTRA RULE: Render only one complete 60-year cycle.
    // Stop after Moon Mahadasha appears and ends.
    const shastraPeriods: DashaNode[] = [];
    let moonFound = false;
    for (const p of periods) {
        shastraPeriods.push(p);
        if (p.planet === 'Moon') {
            moonFound = true;
            break;
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Applicability Banner */}
            {!isApplicable && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-900">Not Highly Applicable</p>
                        <p className="text-xs text-amber-700">This Ṣaṣṭihāyanī system is not applicable for this chart according to standard rules.</p>
                    </div>
                </div>
            )}

            {/* Header Info */}
            <div className="bg-[#3E2A1F]/5 rounded-2xl p-4 border border-[#D08C60]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D08C60]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#3E2A1F] uppercase tracking-wider">Ṣaṣṭihāyanī Dasha</h3>
                        <p className="text-[10px] font-bold text-[#8B5A2B]/60 uppercase">60 Year Single Cycle • Sun-Vimshottari Variant</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#D08C60]/5 border border-[#D08C60]/10 rounded-full text-[9px] font-black text-[#D08C60] uppercase tracking-wider">
                        <Info className="w-3 h-3" />
                        8 Planet Sequence
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-[#D08C60]/60 uppercase">
                        Strict 1-Cycle Timeline (No Looping)
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="space-y-4 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-[#D08C60]/20"></div>

                {shastraPeriods.map((mahadasha, mIdx) => {
                    const uniqueId = `shasthi-${mahadasha.planet}-${mIdx}`;
                    const isExpanded = expandedMahadasha === uniqueId;
                    const antardashas = mahadasha.sublevel || [];
                    const isBalance = mIdx === 0 && (mahadasha.type === "Balance" || mahadasha.isBalance);
                    const fixedYears = FIXED_DURATIONS[mahadasha.planet || ""];

                    return (
                        <div key={uniqueId} className="relative pl-12 group">
                            {/* Dot Indicator */}
                            <div className={cn(
                                "absolute left-[16px] top-5 w-4 h-4 rounded-full border-[3px] border-white shadow-sm z-10 transition-transform duration-300 group-hover:scale-125",
                                mahadasha.isCurrent ? "bg-green-500 ring-4 ring-green-100" : "bg-[#D08C60]"
                            )}></div>

                            <div className={cn(
                                "bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden transition-all duration-300 shadow-sm",
                                mahadasha.isCurrent ? "border-green-200 ring-1 ring-green-50/50" : "hover:border-[#D08C60]/40",
                                isExpanded ? "shadow-md ring-2 ring-[#D08C60]/5" : ""
                            )}>
                                {/* Mahadasha Header */}
                                <button
                                    onClick={() => setExpandedMahadasha(isExpanded ? null : uniqueId)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                                >
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className={cn(
                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-base sm:text-lg font-black shadow-inner font-serif",
                                            PLANET_COLORS[mahadasha.planet || ""] || "bg-white"
                                        )}>
                                            {mahadasha.planet?.[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black text-[#D08C60]/60 uppercase tracking-widest leading-none">Mahadasha</span>
                                                {mahadasha.isCurrent && (
                                                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-green-500 text-white uppercase tracking-widest">Active</span>
                                                )}
                                                {isBalance && (
                                                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-blue-500 text-white uppercase tracking-widest flex items-center gap-1">
                                                        <AlertCircle className="w-2.5 h-2.5" />
                                                        Balance Mahadasha
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm sm:text-base font-black text-[#3E2A1F] uppercase tracking-wide leading-none font-serif">{mahadasha.planet}</div>
                                            <div className="mt-2 text-[10px] font-mono font-bold text-[#8B5A2B]/50">
                                                {formatDateDisplay(mahadasha.startDate)} — {formatDateDisplay(mahadasha.endDate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-8">
                                        <div className="hidden sm:block text-right">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-[#8B5A2B]/40 mb-1">Shastra Duration</div>
                                            <div className="text-xs font-black text-[#3E2A1F] flex flex-col items-end">
                                                <span>{calculateDuration(mahadasha.startDate, mahadasha.endDate)}</span>
                                                {fixedYears && !isBalance && (
                                                    <span className="text-[9px] text-[#D08C60] leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                                )}
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronDown className="w-5 h-5 text-[#D08C60]" /> : <ChevronRight className="w-5 h-5 text-[#D08C60]" />}
                                    </div>
                                </button>

                                {/* Antardasha Expansion */}
                                {isExpanded && (
                                    <div className="border-t border-[#D08C60]/10 bg-[#FAF7F2]/40 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-3 relative ml-2">
                                            {/* Sub-Timeline Connector */}
                                            <div className="absolute left-[6.5px] top-2 bottom-2 w-[1px] bg-[#D08C60]/30 border-l border-dashed border-[#D08C60]/20"></div>

                                            {antardashas.map((antar, aIdx) => (
                                                <div key={aIdx} className="relative pl-6">
                                                    <div className={cn(
                                                        "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10",
                                                        antar.isCurrent ? "bg-green-500 scale-110" : "bg-[#D08C60]/40"
                                                    )}></div>

                                                    <div className={cn(
                                                        "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border bg-white/60 transition-colors",
                                                        antar.isCurrent ? "border-green-200 bg-green-50/30" : "border-[#D08C60]/10 hover:border-[#D08C60]/20"
                                                    )}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-[#3E2A1F] uppercase tracking-wide w-16 sm:w-20 font-serif">
                                                                    {antar.planet}
                                                                </span>
                                                            </div>
                                                            <div className="h-3 w-[1px] bg-[#D08C60]/20 hidden sm:block"></div>
                                                            <div className="text-[10px] font-mono font-bold text-[#8B5A2B] leading-none">
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
                                                            <span className="text-[10px] font-black text-[#D08C60] whitespace-nowrap">
                                                                {calculateDuration(antar.startDate, antar.endDate)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {antardashas.length === 0 && (
                                                <div className="pl-6 text-[10px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">
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

                {!moonFound && periods.length > 0 && (
                    <div className="pl-12 pt-4">
                        <p className="text-[10px] font-bold text-[#8B5A2B]/40 uppercase tracking-widest italic">
                            Timeline truncated as per Shastra rules (Single 60-Year Cycle)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
