"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Info, Clock, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';

interface SatabdikaDashaProps {
    periods: DashaNode[];
}

export default function SatabdikaDasha({ periods }: SatabdikaDashaProps) {
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

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Info */}
            <div className="bg-[#3E2A1F]/5 rounded-2xl p-4 border border-[#D08C60]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D08C60]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#3E2A1F] uppercase tracking-wider">Satabdika Dasha</h3>
                        <p className="text-[10px] font-bold text-[#8B5A2B]/60 uppercase">100 Year Cycle • 7 Planet System</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-[#D08C60]/60 uppercase">
                    <Info className="w-3.5 h-3.5" />
                    Strict 2-Level Timeline
                </div>
            </div>

            {/* Mahadasha Timeline */}
            <div className="space-y-4 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-[#D08C60]/20"></div>

                {periods.map((mahadasha, mIdx) => {
                    const isExpanded = expandedMahadasha === mahadasha.planet;
                    const antardashas = mahadasha.sublevel || [];
                    const isBalance = (mahadasha.raw as any)?.dasha_balance_at_birth != null && mIdx === 0;

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
                                            PLANET_COLORS[mahadasha.planet || ""] || "bg-white"
                                        )}>
                                            {mahadasha.planet?.[0] || '?'}
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
                                                        Balance at Birth
                                                    </span>
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
                                            <div className="text-[8px] font-black uppercase tracking-widest text-[#8B5A2B]/40 mb-1">Duration</div>
                                            <div className="text-sm font-black text-[#3E2A1F]">
                                                {calculateDuration(mahadasha.startDate, mahadasha.endDate)}
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
                                                                <span className="text-xs font-black text-[#3E2A1F] uppercase tracking-wide w-16 sm:w-20">
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
                                                            <span className="text-[10px] font-black text-[#D08C60]">
                                                                {calculateDuration(antar.startDate, antar.endDate)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
