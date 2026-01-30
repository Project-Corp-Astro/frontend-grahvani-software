"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, Info, Clock, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';

interface DwadashottariDashaProps {
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

export default function DwadashottariDasha({ periods }: DwadashottariDashaProps) {
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Info */}
            <div className="bg-[#3E2A1F]/5 rounded-2xl p-4 border border-[#D08C60]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D08C60]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#3E2A1F] uppercase tracking-wider">Dwadashottari Dasha</h3>
                        <p className="text-[10px] font-bold text-[#8B5A2B]/60 uppercase">112 Year Cycle • 8 Planet System</p>
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
                        {periods.map((mahadasha, mIdx) => {
                            const isExpanded = expandedMahadasha === mahadasha.planet;
                            const antardashas = mahadasha.sublevel || [];
                            const isBalance = mahadasha.raw?.is_balance === true;

                            return (
                                <React.Fragment key={mIdx}>
                                    <tr
                                        className={cn(
                                            "hover:bg-[#D08C60]/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-[#D08C60]/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : mahadasha.planet)}
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
                                            {mahadasha.raw?.duration_formatted || standardizeDuration(mahadasha.raw?.duration_years || mahadasha.raw?.years || 0)}
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
                                                        {antardashas.map((antar, aIdx) => {
                                                            const isAntarBalance = antar.raw?.antardasha_type?.toLowerCase().includes('balance') || antar.raw?.is_balance === true;

                                                            return (
                                                                <tr key={aIdx} className={cn(
                                                                    "hover:bg-white/50 transition-colors",
                                                                    antar.isCurrent && "bg-green-50/50"
                                                                )}>
                                                                    <td className="px-4 py-2.5">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={cn(
                                                                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border",
                                                                                PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                            )}>
                                                                                {antar.planet}
                                                                            </span>
                                                                            {isAntarBalance && (
                                                                                <span className="text-[7px] font-black text-blue-600 uppercase tracking-tighter">Running at Birth</span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-2.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.startDate)}</td>
                                                                    <td className="px-4 py-2.5 text-xs text-[#3E2A1F] font-mono">{formatDateDisplay(antar.endDate)}</td>
                                                                    <td className="px-4 py-2.5 text-xs text-[#8B5A2B] font-bold">
                                                                        {antar.raw?.duration_formatted || standardizeDuration(antar.raw?.duration_years || antar.raw?.years || 0, antar.raw?.duration_days)}
                                                                    </td>
                                                                    <td className="px-4 py-2.5 text-center">
                                                                        {antar.isCurrent && (
                                                                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
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
