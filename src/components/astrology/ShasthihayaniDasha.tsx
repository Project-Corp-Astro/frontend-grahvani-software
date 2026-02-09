"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, Info, Clock, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';

interface ShasthihayaniDashaProps {
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
    'Mercury': 10,
    'Venus': 8,
    'Saturn': 12,
    'Rahu': 12,
    'Jupiter': 10,
    'Sun': 6,
    'Mars': 7,
    'Moon': 5
};

export default function ShasthihayaniDasha({ periods, isApplicable = true }: ShasthihayaniDashaProps) {
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    // SHASTRA RULE: Render only one complete 60-year cycle.
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
                        {shastraPeriods.map((mahadasha, mIdx) => {
                            const uniqueId = `shasthi-${mahadasha.planet}-${mIdx}`;
                            const isExpanded = expandedMahadasha === uniqueId;
                            const antardashas = mahadasha.sublevel || [];
                            const isBalance = mIdx === 0 && ((mahadasha as any).type === "Balance" || (mahadasha as any).isBalance);
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
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-sm min-w-[60px] justify-center",
                                                    PLANET_COLORS[mahadasha.planet || ''] || "bg-white"
                                                )}>
                                                    {mahadasha.planet}
                                                </span>
                                                {mahadasha.isCurrent && (
                                                    <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-semibold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                        Current Active
                                                    </span>
                                                )}
                                                {isBalance && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[9px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                        <AlertCircle className="w-2.5 h-2.5" />
                                                        Balance
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
                                            <div className="flex flex-col">
                                                <span>{calculateDuration(mahadasha.startDate, mahadasha.endDate)}</span>
                                                {fixedYears && !isBalance && (
                                                    <span className="text-2xs text-[#D08C60] leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {mahadasha.isCurrent ? (
                                                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-4 h-4 text-[#D08C60]" /> : <ChevronDown className="w-4 h-4 text-[#D08C60]" />
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
                                                <div className="text-2xs font-black text-[#8B5A2B] uppercase tracking-[0.2em] mb-2 pl-2">
                                                    Antardasha Sub-Periods
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-[#D08C60]/10">
                                                        {antardashas.map((antar, aIdx) => (
                                                            <tr key={aIdx} className={cn(
                                                                "hover:bg-white/50 transition-colors",
                                                                antar.isCurrent && "bg-green-50/50"
                                                            )}>
                                                                <td className="px-3 py-2">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold border",
                                                                        PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                    )}>
                                                                        {antar.planet}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.startDate)}</td>
                                                                <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.endDate)}</td>
                                                                <td className="px-3 py-2 text-xs text-[#8B5A2B] font-bold">
                                                                    {calculateDuration(antar.startDate, antar.endDate)}
                                                                </td>
                                                                <td className="px-3 py-2 text-center">
                                                                    {antar.isCurrent && (
                                                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
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

            {/* Shastra Rule Footer */}
            {!moonFound && periods.length > 0 && (
                <div className="text-center pt-2">
                    <p className="text-xs font-semibold text-[#8B5A2B]/40 uppercase tracking-widest italic">
                        Timeline truncated as per Shastra rules (Single 60-Year Cycle)
                    </p>
                </div>
            )}
        </div>
    );
}
