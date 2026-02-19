"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { History, ChevronRight } from 'lucide-react';

interface DashaPeriod {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    subPeriods?: {
        planet: string;
        startDate: string;
        endDate: string;
        isCurrent?: boolean;
    }[];
}

interface KpDashaTimelineProps {
    mahadasha?: DashaPeriod[];
    currentMahadasha?: string;
    currentAntardasha?: string;
    currentPratyantardasha?: string;
    balanceOfDasha?: string;
    className?: string;
}

const planetColors: Record<string, string> = {
    'Sun': 'bg-orange-100 border-orange-300 text-orange-800',
    'Moon': 'bg-blue-50 border-blue-200 text-blue-800',
    'Mars': 'bg-red-50 border-red-200 text-red-800',
    'Mercury': 'bg-green-50 border-green-200 text-green-800',
    'Jupiter': 'bg-amber-50 border-amber-200 text-amber-800',
    'Venus': 'bg-pink-50 border-pink-200 text-pink-800',
    'Saturn': 'bg-slate-100 border-slate-300 text-slate-800',
    'Rahu': 'bg-indigo-50 border-indigo-200 text-indigo-800',
    'Ketu': 'bg-stone-100 border-stone-300 text-stone-700',
};

// Placeholder data for demonstration
const PLACEHOLDER_DASHA: DashaPeriod[] = [
    { planet: 'Jupiter', startDate: '2011-03-15', endDate: '2027-03-15', isCurrent: false },
    {
        planet: 'Saturn', startDate: '2027-03-15', endDate: '2046-03-15', isCurrent: true, subPeriods: [
            { planet: 'Saturn', startDate: '2027-03-15', endDate: '2030-03-18', isCurrent: true },
            { planet: 'Mercury', startDate: '2030-03-18', endDate: '2032-11-27', isCurrent: false },
            { planet: 'Ketu', startDate: '2032-11-27', endDate: '2034-01-06', isCurrent: false },
            { planet: 'Venus', startDate: '2034-01-06', endDate: '2037-03-06', isCurrent: false },
            { planet: 'Sun', startDate: '2037-03-06', endDate: '2038-02-18', isCurrent: false },
            { planet: 'Moon', startDate: '2038-02-18', endDate: '2039-09-18', isCurrent: false },
            { planet: 'Mars', startDate: '2039-09-18', endDate: '2040-10-27', isCurrent: false },
            { planet: 'Rahu', startDate: '2040-10-27', endDate: '2043-09-02', isCurrent: false },
            { planet: 'Jupiter', startDate: '2043-09-02', endDate: '2046-03-15', isCurrent: false },
        ]
    },
    { planet: 'Mercury', startDate: '2046-03-15', endDate: '2063-03-15', isCurrent: false },
    { planet: 'Ketu', startDate: '2063-03-15', endDate: '2070-03-15', isCurrent: false },
    { planet: 'Venus', startDate: '2070-03-15', endDate: '2090-03-15', isCurrent: false },
];

/**
 * KP Dasha Timeline
 * Horizontal Vimshottari timeline with current dasha highlighted
 */
export default function KpDashaTimeline({
    mahadasha = PLACEHOLDER_DASHA,
    currentMahadasha = 'Saturn',
    currentAntardasha = 'Saturn',
    currentPratyantardasha = 'Mercury',
    balanceOfDasha = '2Y 1M 12D',
    className,
}: KpDashaTimelineProps) {
    const [expandedDasha, setExpandedDasha] = useState<string | null>(currentMahadasha);

    const currentDasha = mahadasha.find(d => d.isCurrent) || mahadasha[0];

    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif text-primary flex items-center gap-2 font-semibold">
                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                        <History className="w-3.5 h-3.5 text-gold-dark" />
                    </div>
                    Vimshottari Dasha Timeline
                </h3>
                <div className="flex items-center gap-3 text-xs">
                    <div className="px-2.5 py-1 bg-gold-primary/10 border border-gold-primary/30 rounded-lg">
                        <span className="text-gold-dark font-semibold">
                            {currentMahadasha} / {currentAntardasha} / {currentPratyantardasha}
                        </span>
                    </div>
                    <div className="px-2.5 py-1 bg-parchment border border-antique rounded-lg">
                        <span className="text-muted-refined font-medium">Bal: {balanceOfDasha}</span>
                    </div>
                </div>
            </div>

            {/* Mahadasha Timeline Bar */}
            <div className="flex gap-1 mb-4">
                {mahadasha.map((dasha) => (
                    <button
                        key={dasha.planet}
                        onClick={() => setExpandedDasha(expandedDasha === dasha.planet ? null : dasha.planet)}
                        className={cn(
                            "flex-1 py-2 px-2 rounded-lg border text-xs font-serif font-semibold transition-all text-center min-w-0",
                            dasha.isCurrent
                                ? "bg-gold-primary/20 border-gold-primary/50 text-gold-dark ring-1 ring-gold-primary/30"
                                : "bg-parchment border-antique text-secondary hover:bg-gold-primary/5"
                        )}
                    >
                        <div className="truncate">{dasha.planet}</div>
                        <div className="text-[9px] text-muted-refined mt-0.5 truncate font-sans">
                            {dasha.startDate.slice(0, 4)}–{dasha.endDate.slice(0, 4)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Antardasha Detail (expanded) */}
            {expandedDasha && currentDasha?.subPeriods && currentDasha.planet === expandedDasha && (
                <div className="border-t border-antique/50 pt-3">
                    <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold mb-2 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        {expandedDasha} Mahadasha — Antardasha Periods
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5">
                        {currentDasha.subPeriods.map((sub) => (
                            <div
                                key={sub.planet}
                                className={cn(
                                    "px-2 py-2 rounded-lg border text-center text-xs",
                                    sub.isCurrent
                                        ? "bg-gold-primary/20 border-gold-primary/50"
                                        : "bg-parchment border-antique/50",
                                    planetColors[sub.planet] || ''
                                )}
                            >
                                <div className="font-serif font-bold text-xs">{sub.planet}</div>
                                <div className="text-[8px] mt-0.5 opacity-70 font-sans">
                                    {sub.startDate.slice(0, 7)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
