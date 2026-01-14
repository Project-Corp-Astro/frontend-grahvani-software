"use client";

import React from 'react';

import { Search, ChevronRight, ChevronDown, Calendar, ArrowUpRight, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState } from 'react';

// Types for Dasha Hierarchy
interface DashaPeriod {
    level: 1 | 2 | 3 | 4 | 5; // MD, AD, PD, SD, Prana
    planet: string;
    startDate: string;
    endDate: string;
    ageStart: number; // Age at start of period
    subPeriods?: DashaPeriod[];
    current?: boolean;
}

// Mock Data with Deep Nesting for Demo
const MOCK_DASHAS: DashaPeriod[] = [
    {
        level: 1, planet: "Rahu", startDate: "1994-02-15", endDate: "2012-02-15", ageStart: 0,
        subPeriods: []
    },
    {
        level: 1, planet: "Jupiter", startDate: "2012-02-15", endDate: "2028-02-15", ageStart: 18, current: true,
        subPeriods: [
            { level: 2, planet: "Jupiter", startDate: "2012-02-15", endDate: "2014-04-04", ageStart: 18 },
            { level: 2, planet: "Saturn", startDate: "2014-04-04", endDate: "2016-10-16", ageStart: 20 },
            { level: 2, planet: "Mercury", startDate: "2016-10-16", endDate: "2019-01-22", ageStart: 22 },
            { level: 2, planet: "Ketu", startDate: "2019-01-22", endDate: "2019-12-29", ageStart: 25 },
            {
                level: 2, planet: "Venus", startDate: "2019-12-29", endDate: "2022-08-29", ageStart: 25, current: true,
                subPeriods: [
                    { level: 3, planet: "Venus", startDate: "2019-12-29", endDate: "2020-06-19", ageStart: 25 },
                    { level: 3, planet: "Sun", startDate: "2020-06-19", endDate: "2020-08-19", ageStart: 26 },
                    { level: 3, planet: "Moon", startDate: "2020-08-19", endDate: "2020-11-29", ageStart: 26 },
                    {
                        level: 3, planet: "Mars", startDate: "2020-11-29", endDate: "2021-02-08", ageStart: 26, current: true,
                        subPeriods: [
                            { level: 4, planet: "Mars", startDate: "2020-11-29", endDate: "2020-12-01", ageStart: 26 },
                            { level: 4, planet: "Rahu", startDate: "2020-12-01", endDate: "2020-12-23", ageStart: 26 },
                            { level: 4, planet: "Jupiter", startDate: "2020-12-23", endDate: "2021-01-12", ageStart: 26, current: true },
                        ]
                    },
                    { level: 3, planet: "Rahu", startDate: "2021-02-08", endDate: "2021-08-08", ageStart: 27 },
                    { level: 3, planet: "Jupiter", startDate: "2021-08-08", endDate: "2022-01-16", ageStart: 27 },
                    { level: 3, planet: "Saturn", startDate: "2022-01-16", endDate: "2022-07-29", ageStart: 28 },
                ]
            },
            { level: 2, planet: "Sun", startDate: "2022-08-29", endDate: "2023-06-17", ageStart: 28 },
            { level: 2, planet: "Moon", startDate: "2023-06-17", endDate: "2024-10-17", ageStart: 29 },
            { level: 2, planet: "Mars", startDate: "2024-10-17", endDate: "2025-09-23", ageStart: 30 },
            { level: 2, planet: "Rahu", startDate: "2025-09-23", endDate: "2028-02-15", ageStart: 31 },
        ]
    },
    {
        level: 1, planet: "Saturn", startDate: "2028-02-15", endDate: "2047-02-15", ageStart: 34,
        subPeriods: []
    }
];

export default function DashasPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-2">Vimshottari Time Microscope</h1>
                    <p className="text-[#8B5A2B] font-serif text-sm"> Navigate the 120-year cycle with varying granularities.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search period..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#FFFFFa] border border-[#D08C60]/30 rounded-lg py-2 pl-9 pr-4 text-sm font-serif focus:outline-none focus:border-[#D08C60] shadow-inner"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#D08C60]/70" />
                </div>
            </header>

            <div className="bg-[#FFFFFa]/80 border border-[#D08C60]/30 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden min-h-[600px] flex flex-col">
                {/* Header Row */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#D08C60]/10 border-b border-[#D08C60]/20 text-[10px] uppercase font-black tracking-widest text-[#8B5A2B]">
                    <div className="w-1/3">Dasha Period</div>
                    <div className="w-1/3">Timeline & Age</div>
                    <div className="w-1/3 text-right">Actions</div>
                </div>

                {/* Dasha Tree */}
                <div className="flex-1 overflow-y-auto p-2">
                    {MOCK_DASHAS.map((dasha, idx) => (
                        <DashaRow key={idx} period={dasha} searchTerm={searchTerm} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function DashaRow({ period, searchTerm }: { period: DashaPeriod, searchTerm: string }) {
    const [expanded, setExpanded] = useState(period.current || false);

    // Simple filter logic: if searchTerm exists, expand if children match or self matches
    // For demo, we just highlight. Real recursion filtering is complex.
    const isMatched = searchTerm && period.planet.toLowerCase().includes(searchTerm.toLowerCase());

    return (
        <div className="mb-1">
            <div
                className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer select-none",
                    period.current
                        ? "bg-[#D08C60]/10 border-[#D08C60]/40 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-[#D08C60]/5 hover:border-[#D08C60]/20",
                    isMatched && "ring-2 ring-[#D08C60]"
                )}
                onClick={() => setExpanded(!expanded)}
                style={{ marginLeft: `${(period.level - 1) * 1.5}rem` }}
            >
                {/* Left: Planet & Hierarchy */}
                <div className="flex items-center gap-3 w-1/3">
                    <div className={cn("transition-transform", expanded ? "rotate-90" : "")}>
                        {period.subPeriods && period.subPeriods.length > 0 ? (
                            <ChevronRight className="w-4 h-4 text-[#8B5A2B]/50" />
                        ) : (
                            <div className="w-4" />
                        )}
                    </div>

                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold font-serif text-sm border",
                        period.current ? "bg-[#D08C60] text-white border-[#D08C60]" : "bg-white text-[#3E2A1F] border-[#D08C60]/20"
                    )}>
                        {period.planet.substring(0, 2)}
                    </div>

                    <div className="flex flex-col">
                        <span className={cn("font-serif font-bold text-[#3E2A1F] flex items-center gap-2", period.level === 1 && "text-lg")}>
                            {period.planet}
                            {period.current && <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 text-[9px] uppercase tracking-widest rounded border border-red-500/20">Active</span>}
                        </span>
                        <span className="text-[10px] text-[#8B5A2B]/60 uppercase tracking-wider">
                            {period.level === 1 ? 'Mahadasha' : period.level === 2 ? 'Antardasha' : period.level === 3 ? 'Pratyantar' : 'Sookshma'}
                        </span>
                    </div>
                </div>

                {/* Middle: Timeline */}
                <div className="w-1/3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm font-mono text-[#3E2A1F]/80">
                        <Calendar className="w-3.5 h-3.5 text-[#D08C60]" />
                        <span>{period.startDate}</span>
                        <span className="text-[#D08C60] mx-1">→</span>
                        <span>{period.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 bg-[#D08C60]/20 rounded-full w-24 overflow-hidden">
                            {period.current && <div className="h-full bg-[#D08C60] w-1/2" />}
                        </div>
                        <span className="text-[10px] text-[#8B5A2B]/70 font-bold uppercase">Age: {period.ageStart}y</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="w-1/3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60] hover:text-white text-[#8B5A2B] text-xs font-bold transition-colors shadow-sm">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        View Transit
                    </button>
                </div>
            </div>

            {/* Recursion */}
            {expanded && period.subPeriods && (
                <div className="relative">
                    <div className="absolute left-[calc(1.5rem_*_var(--level)_+_1rem)] top-0 bottom-0 w-[1px] bg-[#D08C60]/20" style={{ '--level': period.level } as React.CSSProperties} />
                    {period.subPeriods.map((sub, idx) => (
                        <DashaRow key={idx} period={sub} searchTerm={searchTerm} />
                    ))}
                </div>
            )}
        </div>
    );
}
