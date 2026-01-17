"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader2, RefreshCw, ChevronRight, ChevronLeft, Calendar, Star } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface DashaPeriod {
    planet?: string;
    lord?: string;
    startDate?: string;
    start_date?: string;
    endDate?: string;
    end_date?: string;
    isCurrent?: boolean;
    is_current?: boolean;
    duration?: string;
    years?: string;
    subPeriods?: DashaPeriod[];
    sub_periods?: DashaPeriod[];
}

type DashaLevel = 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'sookshma' | 'prana';

const LEVEL_LABELS: Record<DashaLevel, string> = {
    mahadasha: 'Mahadasha',
    antardasha: 'Antardasha',
    pratyantardasha: 'Pratyantardasha',
    sookshma: 'Sookshma',
    prana: 'Prana'
};

const LEVEL_ORDER: DashaLevel[] = ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'];

// Planet colors for visual distinction
const PLANET_COLORS: Record<string, string> = {
    sun: 'bg-orange-100 text-orange-800 border-orange-200',
    moon: 'bg-slate-100 text-slate-800 border-slate-200',
    mars: 'bg-red-100 text-red-800 border-red-200',
    mercury: 'bg-green-100 text-green-800 border-green-200',
    jupiter: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    venus: 'bg-pink-100 text-pink-800 border-pink-200',
    saturn: 'bg-gray-100 text-gray-800 border-gray-200',
    rahu: 'bg-purple-100 text-purple-800 border-purple-200',
    ketu: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    // Handle DD-MM-YYYY format often returned by Python APIs
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
        const [d, m, y] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function formatDate(dateStr: string): string {
    const date = parseDate(dateStr);
    if (!date) return '—';
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calculateDuration(startStr: string, endStr: string): string {
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    if (!start || !end) return '—';

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);

    return parts.length > 0 ? parts.join(' ') : '0d';
}

function getDaysRemaining(endDate: string): number {
    const end = parseDate(endDate);
    if (!end) return 0;
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function VedicDashasPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();

    const [dashaData, setDashaData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentLevel, setCurrentLevel] = useState<DashaLevel>('mahadasha');
    const [selectedPath, setSelectedPath] = useState<DashaPeriod[]>([]);
    const [viewingPeriods, setViewingPeriods] = useState<DashaPeriod[]>([]);

    const fetchDashaData = async () => {
        if (!clientDetails?.id) return;

        try {
            setIsLoading(true);
            setError(null);

            // Construct context from path for backend drill-down
            const context: any = {};
            if (selectedPath.length > 0) context.mahaLord = selectedPath[0].planet || selectedPath[0].lord;
            if (selectedPath.length > 1) context.antarLord = selectedPath[1].planet || selectedPath[1].lord;
            if (selectedPath.length > 2) context.pratyantarLord = selectedPath[2].planet || selectedPath[2].lord;

            const response = await clientApi.generateDasha(
                clientDetails.id,
                currentLevel,
                settings.ayanamsa.toLowerCase(),
                false,
                context
            );
            setDashaData(response);

            // Parse the periods - handle various API response formats
            const periods =
                (response?.data as any)?.mahadashas ||
                (response?.data as any)?.periods ||
                (response?.data as any)?.mahadasha_periods ||
                (response?.data as any)?.antardashas ||
                [];
            setViewingPeriods(periods);
        } catch (err: any) {
            console.error('Failed to fetch dasha:', err);
            setError(err.message || 'Failed to load dasha data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if we are at mahadasha level OR the path changed and we don't have local data
        if (currentLevel === 'mahadasha') {
            fetchDashaData();
        } else if (selectedPath.length > 0) {
            const lastPeriod = selectedPath[selectedPath.length - 1];
            const localSubs = lastPeriod.subPeriods || lastPeriod.sub_periods;

            if (localSubs && localSubs.length > 0) {
                setViewingPeriods(localSubs);
                setIsLoading(false);
            } else {
                fetchDashaData();
            }
        }
    }, [clientDetails?.id, settings.ayanamsa, currentLevel, selectedPath.length]);

    // Navigate into a dasha period (drill down)
    const drillDown = (period: DashaPeriod) => {
        const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);
        if (currentLevelIndex < LEVEL_ORDER.length - 1) {
            setSelectedPath([...selectedPath, period]);
            setCurrentLevel(LEVEL_ORDER[currentLevelIndex + 1]);
        }
    };

    // Navigate back (drill up)
    const drillUp = () => {
        const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);
        if (currentLevelIndex > 0) {
            const newPath = selectedPath.slice(0, -1);
            const parentLevel = LEVEL_ORDER[currentLevelIndex - 1];

            setSelectedPath(newPath);
            setCurrentLevel(parentLevel);
        }
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view Vimshottari Dasha</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D08C60]/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#D08C60]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#3E2A1F]">Vimshottari Dasha</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-[#8B5A2B]">Time Lord Sequence for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-[10px] font-bold uppercase rounded-full border border-[#D08C60]/30">
                                {settings.ayanamsa}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={fetchDashaData}
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60]/10 text-[#8B5A2B] disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#D08C60]/20 rounded-xl px-4 py-3">
                <button
                    onClick={() => {
                        setCurrentLevel('mahadasha');
                        setSelectedPath([]);
                    }}
                    className={cn(
                        "text-sm font-bold",
                        currentLevel === 'mahadasha' ? "text-[#D08C60]" : "text-[#8B5A2B] hover:text-[#D08C60]"
                    )}
                >
                    Mahadasha
                </button>
                {selectedPath.map((period, idx) => (
                    <React.Fragment key={idx}>
                        <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                        <button
                            onClick={() => {
                                setSelectedPath(selectedPath.slice(0, idx + 1));
                                setCurrentLevel(LEVEL_ORDER[idx + 1]);
                            }}
                            className={cn(
                                "text-sm font-bold px-2 py-0.5 rounded",
                                PLANET_COLORS[(period.planet || period.lord || 'unknown').toLowerCase()] || "bg-gray-100 text-gray-800"
                            )}
                        >
                            {period.planet || period.lord} {LEVEL_LABELS[LEVEL_ORDER[idx]]}
                        </button>
                    </React.Fragment>
                ))}
                <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                <span className="text-sm font-bold text-[#D08C60]">{LEVEL_LABELS[currentLevel]}</span>
            </div>

            {/* Active Path Summary */}
            <div className="bg-white border border-[#D08C60]/20 rounded-2xl p-4 flex items-center gap-6 overflow-x-auto shadow-sm">
                <div className="flex items-center gap-2 text-[#8B5A2B] font-bold text-xs uppercase tracking-wider border-r border-[#D08C60]/20 pr-6 shrink-0">
                    <Star className="w-4 h-4 text-[#D08C60]" />
                    <span>Selected Path</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8B5A2B]/60 font-black uppercase tracking-tighter">Root</span>
                        <ChevronRight className="w-3 h-3 text-[#D08C60]/40" />
                    </div>
                    {selectedPath.length > 0 ? selectedPath.map((period, idx) => (
                        <React.Fragment key={idx}>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all",
                                PLANET_COLORS[(period.planet || period.lord || 'unknown').toLowerCase()] || "bg-gray-50 border-gray-100"
                            )}>
                                <span className="text-sm font-bold">{period.planet || period.lord}</span>
                                {period.isCurrent || period.is_current ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                ) : null}
                            </div>
                            {idx < selectedPath.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-[#D08C60]/30" />
                            )}
                        </React.Fragment>
                    )) : (
                        <span className="text-sm text-[#8B5A2B]/40 italic">Overview Level</span>
                    )}
                </div>
            </div>

            {/* Back Button */}
            {currentLevel !== 'mahadasha' && (
                <button
                    onClick={drillUp}
                    className="flex items-center gap-2 text-sm font-medium text-[#8B5A2B] hover:text-[#D08C60]"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to {LEVEL_LABELS[LEVEL_ORDER[LEVEL_ORDER.indexOf(currentLevel) - 1]]}
                </button>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                    <p className="font-serif text-[#8B5A2B]">Calculating {LEVEL_LABELS[currentLevel]} periods...</p>
                </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-serif text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashaData}
                        className="px-4 py-2 bg-[#D08C60] text-white rounded-lg font-medium hover:bg-[#D08C60]/90"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Dasha Table */}
            {!isLoading && !error && (
                <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-[#D08C60]/10 bg-[#FAF7F2]">
                        <h3 className="font-serif font-bold text-[#3E2A1F]">{LEVEL_LABELS[currentLevel]} Periods</h3>
                        <p className="text-xs text-[#8B5A2B] mt-1">Click on any row to see sub-periods</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-3 text-left">Planet</th>
                                    <th className="px-6 py-3 text-left">Start Date</th>
                                    <th className="px-6 py-3 text-left">End Date</th>
                                    <th className="px-6 py-3 text-left">Duration</th>
                                    <th className="px-6 py-3 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D08C60]/10">
                                {viewingPeriods.length > 0 ? viewingPeriods.map((period, idx) => {
                                    const planetName = period.planet || period.lord || 'Unknown';
                                    const start = period.startDate || period.start_date || '';
                                    const end = period.endDate || period.end_date || '';
                                    const isCurrent = period.isCurrent || period.is_current || false;
                                    const daysLeft = isCurrent ? getDaysRemaining(end) : null;
                                    const colorClass = PLANET_COLORS[planetName.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';

                                    const canDrillDown = LEVEL_ORDER.indexOf(currentLevel) < LEVEL_ORDER.length - 1;

                                    return (
                                        <tr
                                            key={idx}
                                            className={cn(
                                                "hover:bg-[#3E2A1F]/5 transition-colors",
                                                isCurrent && "bg-[#D08C60]/5",
                                                canDrillDown && "cursor-pointer"
                                            )}
                                            onClick={() => canDrillDown && drillDown(period)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border",
                                                        colorClass
                                                    )}>
                                                        {planetName}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse">
                                                            ACTIVE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]/40" />
                                                    {formatDate(start)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                                {formatDate(end)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#8B5A2B]">
                                                {calculateDuration(start, end)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {canDrillDown && (
                                                    <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#D08C60] transition-colors">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#8B5A2B]">
                                            No dasha data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
