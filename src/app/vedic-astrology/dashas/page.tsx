"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader2, RefreshCw, ChevronRight, ChevronLeft, Calendar, Star, Info, ChevronDown } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DASHA_TYPES } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';

// Console logger for debugging
const logger = {
    debug: (data: any) => console.debug('[Dasha Debug]', data),
    info: (data: any) => console.info('[Dasha Info]', data),
    warn: (data: any) => console.warn('[Dasha Warn]', data),
    error: (data: any) => console.error('[Dasha Error]', data),
};

interface DashaPeriod {
    planet?: string;
    lord?: string;
    sign?: string;
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
    // Signs for Chara Dasha
    aries: 'bg-red-100 text-red-800 border-red-200',
    taurus: 'bg-green-100 text-green-800 border-green-200',
    gemini: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancer: 'bg-blue-100 text-blue-800 border-blue-200',
    leo: 'bg-orange-100 text-orange-800 border-orange-200',
    virgo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    libra: 'bg-pink-100 text-pink-800 border-pink-200',
    scorpio: 'bg-purple-100 text-purple-800 border-purple-200',
    sagittarius: 'bg-amber-100 text-amber-800 border-amber-200',
    capricorn: 'bg-stone-100 text-stone-800 border-stone-200',
    aquarius: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    pisces: 'bg-violet-100 text-violet-800 border-violet-200',
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

import { useQueryClient } from "@tanstack/react-query";

export default function VedicDashasPage() {
    const queryClient = useQueryClient();
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaData, setDashaData] = useState<any>(null);
    // const [isLoading, setIsLoading] = useState(true); // Derived
    // const [error, setError] = useState<string | null>(null); // Derived
    const [currentLevel, setCurrentLevel] = useState<DashaLevel>('mahadasha');
    const [selectedPath, setSelectedPath] = useState<DashaPeriod[]>([]);
    const [viewingPeriods, setViewingPeriods] = useState<DashaPeriod[]>([]);
    const [showDashaInfo, setShowDashaInfo] = useState(false);

    const isVimshottari = selectedDashaType === 'vimshottari';
    const currentDashaInfo = DASHA_TYPES[selectedDashaType];

    const context: any = {};
    if (selectedPath.length > 0) context.mahaLord = selectedPath[0].planet || selectedPath[0].lord;
    if (selectedPath.length > 1) context.antarLord = selectedPath[1].planet || selectedPath[1].lord;
    if (selectedPath.length > 2) context.pratyantarLord = selectedPath[2].planet || selectedPath[2].lord;

    // Queries
    const { data: vimData, isLoading: vimLoading, error: vimError } = useDasha(
        clientDetails?.id || '',
        currentLevel as any,
        settings.ayanamsa.toLowerCase(),
        context
    );

    const { data: otherData, isLoading: otherLoading, error: otherError } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        settings.ayanamsa.toLowerCase()
    );

    const response = isVimshottari ? vimData : otherData;
    const isLoading = isVimshottari ? vimLoading : otherLoading;
    const errorMsg = (isVimshottari ? vimError : otherError) ? ((isVimshottari ? vimError : otherError) as Error).message : null;

    useEffect(() => {
        if (response) {
            setDashaData(response);
            // Parse the periods - handle various API response formats
            const periods =
                (response?.data as any)?.mahadashas ||
                (response?.data as any)?.periods ||
                (response?.data as any)?.mahadasha_periods ||
                (response?.data as any)?.antardashas ||
                (response?.data as any)?.dasha_periods ||
                response?.data ||
                [];

            // Handle if periods is an array
            const periodsArray = Array.isArray(periods) ? periods : [];
            
            // Filter out null/undefined entries
            const validPeriods = periodsArray.filter(p => p && (p.planet || p.lord || p.sign));
            
            setViewingPeriods(validPeriods);
            
            // Log if we got empty but valid response
            if (periodsArray.length === 0 && response?.data !== undefined) {
                logger.debug({
                    dashaType: selectedDashaType,
                    responseData: response?.data,
                    message: 'Valid empty dasha response (not applicable for this chart)'
                });
            }
        }
    }, [response]);

    /* Removed manual fetchDashaData */

    useEffect(() => {
        // Reset state when dasha type changes
        if (!isVimshottari) {
            setCurrentLevel('mahadasha');
            setSelectedPath([]);
        }
    }, [selectedDashaType]);

    // Optimized local drill-down removed in favor of consistently using the hook which handles caching.
    // Transitioning between levels updates 'currentLevel' and 'context', triggering the hook.

    // Navigate into a dasha period (drill down) - Vimshottari only
    const drillDown = (period: DashaPeriod) => {
        if (!isVimshottari) return;
        const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);
        if (currentLevelIndex < LEVEL_ORDER.length - 1) {
            setSelectedPath([...selectedPath, period]);
            setCurrentLevel(LEVEL_ORDER[currentLevelIndex + 1]);
        }
    };

    // Navigate back (drill up) - Vimshottari only
    const drillUp = () => {
        if (!isVimshottari) return;
        const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);
        if (currentLevelIndex > 0) {
            const newPath = selectedPath.slice(0, -1);
            const parentLevel = LEVEL_ORDER[currentLevelIndex - 1];
            setSelectedPath(newPath);
            setCurrentLevel(parentLevel);
        }
    };

    const handleDashaTypeChange = (type: string) => {
        setSelectedDashaType(type);
        setCurrentLevel('mahadasha');
        setSelectedPath([]);
        setViewingPeriods([]);
        setDashaData(null);
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view Dasha details</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D08C60]/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#D08C60]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#3E2A1F]">Dasha Systems</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-[#8B5A2B]">Time Lord Analysis for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-[10px] font-bold uppercase rounded-full border border-[#D08C60]/30">
                                {settings.ayanamsa}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['dasha'] })}
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60]/10 text-[#8B5A2B] disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Dasha Type Selector */}
            <div className="bg-white border border-[#D08C60]/20 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-[#3E2A1F] uppercase tracking-wider">Dasha System</label>
                        <div className="relative">
                            <select
                                value={selectedDashaType}
                                onChange={(e) => handleDashaTypeChange(e.target.value)}
                                className="appearance-none bg-[#FAF7F2] border border-[#D08C60]/30 rounded-xl px-4 py-2.5 pr-10 text-[#3E2A1F] font-medium focus:outline-none focus:ring-2 focus:ring-[#D08C60]/40 cursor-pointer min-w-[200px]"
                            >
                                <optgroup label="Primary Systems">
                                    <option value="vimshottari">Vimshottari (120 Years)</option>
                                </optgroup>
                                <optgroup label="Conditional Systems">
                                    {Object.entries(DASHA_TYPES)
                                        .filter(([key, val]) => val.category === 'conditional')
                                        .map(([key, val]) => (
                                            <option key={key} value={key}>
                                                {val.name} {val.years > 0 ? `(${val.years} Years)` : ''}
                                            </option>
                                        ))
                                    }
                                </optgroup>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5A2B] pointer-events-none" />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDashaInfo(!showDashaInfo)}
                        className="flex items-center gap-2 text-sm text-[#8B5A2B] hover:text-[#D08C60] transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        <span>About this Dasha</span>
                    </button>
                </div>

                {/* Dasha Info Panel */}
                {showDashaInfo && currentDashaInfo && (
                    <div className="mt-4 pt-4 border-t border-[#D08C60]/10">
                        <div className="bg-[#FAF7F2] rounded-xl p-4">
                            <h4 className="font-bold text-[#3E2A1F] mb-2">{currentDashaInfo.name} Dasha</h4>
                            <p className="text-sm text-[#8B5A2B] mb-2">{currentDashaInfo.desc}</p>
                            {currentDashaInfo.years > 0 && (
                                <p className="text-xs text-[#8B5A2B]/70">
                                    <span className="font-bold">Total Cycle:</span> {currentDashaInfo.years} years
                                </p>
                            )}
                            {currentDashaInfo.category === 'conditional' && (
                                <p className="text-xs text-amber-600 mt-2">
                                    ⚠️ This is a conditional dasha system. It may only be applicable under specific chart conditions.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Vimshottari-specific: Breadcrumb Navigation */}
            {isVimshottari && (
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
            )}

            {/* Vimshottari-specific: Active Path Summary */}
            {isVimshottari && (
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
                                    {(period.isCurrent || period.is_current) ? (
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
            )}

            {/* Vimshottari-specific: Back Button */}
            {isVimshottari && currentLevel !== 'mahadasha' && (
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
                    <p className="font-serif text-[#8B5A2B]">
                        {isVimshottari
                            ? `Calculating ${LEVEL_LABELS[currentLevel]} periods...`
                            : `Loading ${currentDashaInfo?.name || 'Dasha'} periods...`
                        }
                    </p>
                </div>
            )}

            {/* Error State */}
            {!isLoading && errorMsg && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-serif text-red-600 mb-4">{errorMsg}</p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['dasha'] })}
                        className="px-4 py-2 bg-[#D08C60] text-white rounded-lg font-medium hover:bg-[#D08C60]/90"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty Data State (Valid) */}
            {!isLoading && !errorMsg && viewingPeriods.length === 0 && (
                <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-[#D08C60]/10 bg-[#FAF7F2]">
                        <h3 className="font-serif font-bold text-[#3E2A1F]">
                            {`${currentDashaInfo?.name || 'Dasha'} Periods`}
                        </h3>
                    </div>
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                            <Info className="w-8 h-8 text-amber-600" />
                        </div>
                        <p className="font-medium text-[#3E2A1F] mb-2">
                            No dasha data available
                        </p>
                        <p className="text-sm text-[#8B5A2B] max-w-md">
                            {currentDashaInfo?.category === 'conditional'
                                ? `${currentDashaInfo?.name} is a conditional dasha system. It only applies under specific astrological conditions. This chart doesn't meet those conditions.`
                                : 'The requested dasha system is not applicable for this chart configuration.'
                            }
                        </p>
                        <div className="mt-6 pt-6 border-t border-[#D08C60]/10">
                            <p className="text-xs text-[#8B5A2B]/60 font-mono">
                                Dasha Type: {selectedDashaType} | System: {settings.ayanamsa}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dasha Table */}
            {!isLoading && !errorMsg && viewingPeriods.length > 0 && (
                <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-[#D08C60]/10 bg-[#FAF7F2]">
                        <h3 className="font-serif font-bold text-[#3E2A1F]">
                            {isVimshottari ? `${LEVEL_LABELS[currentLevel]} Periods` : `${currentDashaInfo?.name || 'Dasha'} Periods`}
                        </h3>
                        <p className="text-xs text-[#8B5A2B] mt-1">
                            {isVimshottari
                                ? 'Click on any row to see sub-periods'
                                : `${viewingPeriods.length} periods calculated`
                            }
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-3 text-left">{selectedDashaType === 'chara' ? 'Sign' : 'Planet'}</th>
                                    <th className="px-6 py-3 text-left">Start Date</th>
                                    <th className="px-6 py-3 text-left">End Date</th>
                                    <th className="px-6 py-3 text-left">Duration</th>
                                    {isVimshottari && <th className="px-6 py-3 text-center">View</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D08C60]/10">
                                {viewingPeriods.map((period, idx) => {
                                    const periodLabel = period.planet || period.lord || period.sign || 'Unknown';
                                    const start = period.startDate || period.start_date || '';
                                    const end = period.endDate || period.end_date || '';
                                    const isCurrent = period.isCurrent || period.is_current || false;
                                    const colorClass = PLANET_COLORS[periodLabel.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
                                    const canDrillDown = isVimshottari && LEVEL_ORDER.indexOf(currentLevel) < LEVEL_ORDER.length - 1;

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
                                                        {periodLabel}
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
                                            {isVimshottari && (
                                                <td className="px-6 py-4 text-center">
                                                    {canDrillDown && (
                                                        <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#D08C60] transition-colors">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
