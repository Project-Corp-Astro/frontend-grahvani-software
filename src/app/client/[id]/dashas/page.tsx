"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, Loader2, RefreshCw, ChevronRight, ChevronLeft,
    Calendar, Star, Info, ChevronDown, Clock, MapPin,
    Sun, Moon as MoonIcon, LayoutDashboard, BrainCircuit, User,
    Download, FileText, Printer
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import {
    DashaNode,
    ActiveDashaPath,
    standardizeDashaLevels,
    findActiveDashaPath,
    getSublevels
} from '@/lib/dasha-utils';
import { cn } from '@/lib/utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

// ============ UTILS & CONSTANTS ============

function parseDateStr(dateStr: string): Date | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function formatDateShort(dateStr: string): string {
    const date = parseDateStr(dateStr);
    if (!date) return '—';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDaysRemaining(endDateStr: string): number {
    const end = parseDateStr(endDateStr);
    if (!end) return 0;
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}


// Level configuration for parity
const DASHA_LEVELS = [
    { id: 'mahadasha', name: 'Mahadasha', short: 'Maha' },
    { id: 'antardasha', name: 'Antardasha', short: 'Antar' },
    { id: 'pratyantardasha', name: 'Pratyantardasha', short: 'Pratyantar' },
    { id: 'sookshmadasha', name: 'Sookshma', short: 'Sookshma' },
    { id: 'pranadasha', name: 'Prana', short: 'Prana' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function VedicDashasPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // State
    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaTree, setDashaTree] = useState<any[]>([]);
    const [selectedPath, setSelectedPath] = useState<any[]>([]);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string | null>(null);

    const isVimshottari = selectedDashaType === 'vimshottari';

    // 1. Determine Drill-down Path for Backend Request
    const backendContext = useMemo(() => {
        const pathParam = searchParams.get('p');
        return { drillDownPath: pathParam ? pathParam.split(',') : [] };
    }, [searchParams]);

    // 2. Data Queries
    const { data: treeResponse, isLoading: treeLoading, isFetching: treeFetching } = useDasha(
        clientDetails?.id || '',
        'tree',
        settings.ayanamsa.toLowerCase(),
        backendContext
    );

    const { data: otherData, isLoading: otherLoading, isFetching: otherFetching } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        settings.ayanamsa.toLowerCase()
    );

    const isLoading = isVimshottari ? treeLoading : otherLoading;
    const isFetching = isVimshottari ? treeFetching : otherFetching;

    // 3. Pure Functional Projection: Derive EXACT view from URLs and data
    const activeAnalysis = useMemo(() => {
        const response = isVimshottari ? treeResponse : otherData;
        if (!response?.data) return null;
        const backendPath = (response.data as any).curr_path;
        if (backendPath && Array.isArray(backendPath) && backendPath.length >= 5) {
            return {
                nodes: backendPath,
                progress: findActiveDashaPath(response.data).progress,
                metadata: findActiveDashaPath(response.data).metadata
            };
        }
        return findActiveDashaPath(response.data);
    }, [treeResponse, otherData, isVimshottari]);

    const { currentPath, viewingPeriods, isPathSatisfied } = useMemo(() => {
        const response = isVimshottari ? treeResponse : otherData;
        const rawMahadashas = (response?.data as any)?.mahadashas || (response?.data as any)?.periods || [];

        const pathParam = searchParams.get('p') || "";
        const targetPlanets = pathParam ? pathParam.split(',') : [];

        let branch = rawMahadashas;
        let parentStart = "";
        let reconciledPath: any[] = [];
        let viewingBranch = rawMahadashas;
        let satisfiedCount = 0;

        if (rawMahadashas.length > 0) {
            for (const pName of targetPlanets) {
                const match = branch.find((n: any) =>
                    (n.planet || n.lord || '').toLowerCase() === (pName || '').toLowerCase()
                );
                if (match) {
                    reconciledPath.push(match);
                    parentStart = match.start_date || match.startDate;
                    satisfiedCount++;
                    const subs = getSublevels(match);
                    // Critical: ONLY transition the viewing branch if children actually exist
                    if (subs && subs.length > 0) {
                        branch = subs;
                        viewingBranch = subs;
                    } else {
                        // If we are looking for more path components but children are missing, 
                        // we stop here. isPathSatisfied will be false.
                        break;
                    }
                } else break;
            }
        }

        return {
            currentPath: reconciledPath,
            viewingPeriods: standardizeDashaLevels(viewingBranch, parentStart),
            isPathSatisfied: targetPlanets.length === 0 || satisfiedCount === targetPlanets.length
        };
    }, [treeResponse, otherData, isVimshottari, searchParams]);

    const currentLevel = currentPath.length;

    // 4. Effects for Peripheral Sync (Analysis, Intel, Storage)
    useEffect(() => {
        const response = isVimshottari ? treeResponse : otherData;
        if (response?.data) {
            const raw = (response.data as any).mahadashas || (response.data as any).periods || [];
            if (raw.length > 0) setDashaTree(raw);
        }
    }, [treeResponse, otherData, isVimshottari]);

    useEffect(() => {
        if (activeAnalysis?.nodes && activeAnalysis.nodes.length > 0 && !selectedIntelPlanet) {
            setSelectedIntelPlanet(activeAnalysis.nodes[0].planet || activeAnalysis.nodes[0].lord);
        }
    }, [activeAnalysis, selectedIntelPlanet]);

    useEffect(() => {
        if (JSON.stringify(currentPath) !== JSON.stringify(selectedPath)) {
            setSelectedPath(currentPath);
        }
    }, [currentPath, selectedPath]);

    // Navigation Methods (Deterministic & Auto-Drill)
    const handleDrillDown = (period: DashaNode) => {
        // Last stage locking: stop if we are already at Sookshma viewing Prana (level 4)
        if (currentLevel >= 4) return;

        const raw = period.raw;
        if (getSublevels(raw)) {
            const newPathArr = [...currentPath, raw];
            const urlPlanets = newPathArr.map(p => p.planet || p.lord).join(',');
            router.replace(`?p=${urlPlanets}`, { scroll: false });
            setSelectedIntelPlanet(period.planet);
        }
    };

    const handleBreadcrumbClick = (targetIdx: number) => {
        if (targetIdx === -1) {
            router.replace('?', { scroll: false });
            if (activeAnalysis?.nodes?.[0]) {
                setSelectedIntelPlanet(activeAnalysis.nodes[0].planet);
            }
            return;
        }

        let newPathArr = [];

        if (targetIdx < currentPath.length) {
            // Moving Back: standard slice
            newPathArr = currentPath.slice(0, targetIdx + 1);
        } else {
            // Jumping Forward: Follow ONLY the active/live path to that depth
            const activeNodes = activeAnalysis?.nodes || [];
            newPathArr = activeNodes.slice(0, targetIdx + 1);
        }

        if (newPathArr.length > 0) {
            const lastNode = newPathArr[newPathArr.length - 1];
            const urlPlanets = newPathArr.map(p => p.planet || p.lord).join(',');
            router.replace(`?p=${urlPlanets}`, { scroll: false });
            setSelectedIntelPlanet(lastNode.planet || lastNode.lord);
        }
    };

    const handleSystemChange = (type: string) => {
        setSelectedDashaType(type);
        router.replace('?', { scroll: false });
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view Dasha details</p>
            </div>
        );
    }

    const activeLords = activeAnalysis?.nodes || [];
    const metadata = activeAnalysis?.metadata;

    return (
        <div className="min-h-screen space-y-4 pt-2">

            {/* HEADER: Client Info & Actions */}
            <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#D08C60]" />
                            <div className="font-serif font-black text-[#3E2A1F] text-lg">
                                {clientDetails.name}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 text-sm text-[#8B5A2B] border-l border-[#D08C60]/20 pl-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDateShort(clientDetails.dateOfBirth)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {clientDetails.timeOfBirth}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {clientDetails.placeOfBirth?.city || 'Unknown'}
                            </span>
                            <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-xs font-bold rounded-full">
                                {metadata?.nakshatraAtBirth || 'Vishakha'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#3E2A1F] text-white text-xs font-bold rounded-full uppercase">
                            {ayanamsa}
                        </span>
                        <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Print">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Export PDF">
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['dasha'] })}
                            disabled={isFetching}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                isFetching ? "text-[#D08C60] opacity-50 cursor-wait" : "hover:bg-[#D08C60]/10 text-[#8B5A2B]"
                            )}
                            title="Refresh Data"
                        >
                            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CURRENT PERIOD CARD */}
            <div className="bg-gradient-to-r from-[#3E2A1F] to-[#5A3E2B] rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif font-bold text-lg">Current Running Dasha</h2>
                    <span className="ml-auto text-xs bg-green-500 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        ● LIVE
                    </span>
                </div>

                {activeLords.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Mahadasha</label>
                            <div className="text-2xl font-black">{activeLords[0].planet}</div>
                            <div className="text-[10px] text-white/40 mt-1">{formatDateShort(activeLords[0].startDate)} - {formatDateShort(activeLords[0].endDate)}</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20 transform scale-105 shadow-xl">
                            <label className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold block mb-1 underline decoration-yellow-400/30 underline-offset-4">Antardasha</label>
                            <div className="text-2xl font-black text-yellow-300">{activeLords[1]?.planet || '—'}</div>
                            <div className="text-[10px] text-white/60 mt-1">{formatDateShort(activeLords[1]?.startDate)} - {formatDateShort(activeLords[1]?.endDate)}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Pratyantardasha</label>
                            <div className="text-2xl font-black">{activeLords[2]?.planet || '—'}</div>
                            <div className="text-[10px] text-white/40 mt-1">{formatDateShort(activeLords[2]?.startDate)} - {formatDateShort(activeLords[2]?.endDate)}</div>
                        </div>
                    </div>
                )}

                {activeLords.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-white/40 font-bold tracking-tight">Active Path Summary</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {activeLords.slice(0, 5).map((l, i) => (
                                        <React.Fragment key={i}>
                                            <span className={cn("text-xs font-bold", i === 1 ? "text-yellow-400" : "text-white")}>{l.planet}</span>
                                            {i < 4 && <ChevronRight className="w-3 h-3 text-white/20" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-yellow-300 font-black">
                                {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days remaining
                            </span>
                            <span>Ends: {formatDateShort(activeLords[0].endDate)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden shadow-sm">

                        {/* Selector Tray */}
                        <div className="p-4 border-b border-[#D08C60]/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">System</label>
                                <div className="relative">
                                    <select
                                        value={selectedDashaType}
                                        onChange={(e) => handleSystemChange(e.target.value)}
                                        className="appearance-none bg-[#FAF7F2] border border-[#D08C60]/30 rounded-xl px-4 py-2 pr-10 text-[#3E2A1F] font-medium focus:outline-none focus:ring-2 focus:ring-[#D08C60]/40 cursor-pointer min-w-[200px]"
                                    >
                                        <option value="vimshottari">① Vimshottari (120 yrs)</option>
                                        <option value="chara">② Jaimini Chara Dasha</option>
                                        <option value="yogini">③ Yogini (36 yrs)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5A2B] pointer-events-none" />
                                </div>
                            </div>

                            {isVimshottari && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.map((level, idx) => {
                                        const isNavigable = idx <= currentLevel || idx < (activeAnalysis?.nodes?.length || 0);
                                        return (
                                            <button
                                                key={level.id}
                                                onClick={currentLevel === idx ? undefined : () => handleBreadcrumbClick(idx - 1)}
                                                disabled={!isNavigable}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border",
                                                    currentLevel === idx
                                                        ? "bg-[#D08C60] text-white border-[#D08C60] shadow-sm cursor-default"
                                                        : isNavigable
                                                            ? "bg-white text-[#8B5A2B] border-[#D08C60]/30 hover:bg-[#D08C60]/10"
                                                            : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                                )}
                                            >
                                                {level.short}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Breadcrumbs */}
                        <div className="px-4 py-3 bg-[#FAF7F2] border-b border-[#D08C60]/10 flex items-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => handleBreadcrumbClick(-1)}
                                className={cn(
                                    "text-sm font-bold",
                                    currentLevel === 0 ? "text-[#D08C60]" : "text-[#8B5A2B] hover:text-[#D08C60]"
                                )}
                            >
                                Mahadasha
                            </button>
                            {currentPath.map((period, idx) => (
                                <React.Fragment key={idx}>
                                    <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                    <button
                                        onClick={() => handleBreadcrumbClick(idx)}
                                        className={cn(
                                            "text-sm font-bold px-2 py-0.5 rounded border",
                                            PLANET_COLORS[period.planet || period.lord || 'Jupiter'] || "bg-white border-gray-100"
                                        )}
                                    >
                                        {period.planet || period.lord} {DASHA_LEVELS[idx].short}
                                    </button>
                                </React.Fragment>
                            ))}
                            {currentLevel > 0 && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                    <span className="text-sm font-bold text-[#D08C60]">{DASHA_LEVELS[currentLevel]?.name}</span>
                                </>
                            )}
                        </div>

                        {/* Table Area */}
                        <div className="overflow-x-auto min-h-[400px]">
                            {(isLoading || !isPathSatisfied) ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                                    <p className="font-serif text-sm text-[#8B5A2B] animate-pulse italic">
                                        {!isPathSatisfied ? `Diving into ${DASHA_LEVELS[currentLevel]?.name}...` : "Quantum Calculating Eras..."}
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest border-b border-[#D08C60]/10">
                                        <tr>
                                            <th className="px-6 py-4">Planet</th>
                                            <th className="px-6 py-4">Start Date</th>
                                            <th className="px-6 py-4">End Date</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D08C60]/10">
                                        {viewingPeriods.length > 0 ? viewingPeriods.map((period, idx) => (
                                            <tr
                                                key={idx}
                                                className={cn(
                                                    "transition-colors",
                                                    period.isCurrent ? "bg-[#D08C60]/5" : (currentLevel < 4 ? "hover:bg-[#FAF7F2]" : "")
                                                )}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-xs shadow-sm",
                                                            PLANET_COLORS[period.planet] || "bg-white border-gray-100"
                                                        )}>
                                                            {period.planet.slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[#3E2A1F]">{period.planet}</div>
                                                            {period.isCurrent && (
                                                                <span className="text-[9px] font-black uppercase text-[#D08C60] bg-[#D08C60]/10 px-1.5 py-0.5 rounded tracking-tighter">Current Period</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#5A3E2B] font-medium">{formatDateShort(period.startDate)}</td>
                                                <td className="px-6 py-4 text-sm text-[#5A3E2B] font-medium">{formatDateShort(period.endDate)}</td>
                                                <td className="px-6 py-4 text-sm text-[#8B5A2B]/70 font-bold">{period.duration}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={currentLevel < 4 ? () => setSelectedIntelPlanet(period.planet) : undefined}
                                                            className={cn(
                                                                "p-2 rounded-lg border shadow-sm transition-all",
                                                                currentLevel < 4
                                                                    ? "bg-white border-[#D08C60]/20 text-[#D08C60] hover:bg-[#D08C60] hover:text-white"
                                                                    : "bg-gray-50 border-gray-100 text-gray-300 cursor-default"
                                                            )}
                                                            title={currentLevel < 4 ? "View Intelligence" : "Final Stage"}
                                                        >
                                                            <BrainCircuit className="w-4 h-4" />
                                                        </button>
                                                        {getSublevels(period.raw) && currentLevel < 4 && (
                                                            <button
                                                                onClick={() => handleDrillDown(period)}
                                                                className="p-2 rounded-lg bg-[#FAF7F2] text-[#8B5A2B] hover:bg-[#D08C60] hover:text-white transition-all"
                                                                title="Drill Down"
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-20 text-[#8B5A2B]/40 italic font-serif">
                                                    No dasha cycles calculated for this level.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Life Timeline Placeholder (For UI Parity with Senior Design) */}
                    {isVimshottari && currentLevel === 0 && (
                        <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-5 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase text-[#3E2A1F] tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                LIFE TIMELINE (MAHADASHA)
                            </h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {dashaTree.slice(0, 9).map((d, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl border flex items-center justify-center text-[10px] font-black shadow-sm",
                                            PLANET_COLORS[d.planet || d.lord] || "bg-white border-gray-100"
                                        )}>
                                            {d.planet?.slice(0, 2) || d.lord?.slice(0, 2)}
                                        </div>
                                        <span className="text-[9px] font-bold text-[#8B5A2B] uppercase">{d.planet || d.lord}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR: INTEL */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-5 shadow-sm sticky top-4">
                        <div className="flex items-center gap-2 mb-6 border-b border-[#D08C60]/10 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#D08C60]/10 flex items-center justify-center text-[#D08C60]">
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-serif font-black text-[#3E2A1F]">{selectedIntelPlanet || 'Rahu'} Dasha Intel</h3>
                                <p className="text-[10px] text-[#8B5A2B]/60 font-bold uppercase tracking-wider">Psychological \u0026 Physical Impacts</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-black uppercase text-[#3E2A1F] tracking-widest">Key Themes</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Ambition', 'Foreign Influence', 'Sudden Gains', 'Materialism'].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-[#FAF7F2] border border-[#D08C60]/20 text-[#8B5A2B] rounded-lg text-[10px] font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-[#FAF7F2] to-white rounded-xl border-l-4 border-[#D08C60] shadow-inner">
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-[#D08C60] mt-1 shrink-0" />
                                    <div>
                                        <div className="text-xs font-black text-[#3E2A1F] mb-1">Dasha Sentiment</div>
                                        <p className="text-xs text-[#8B5A2B] leading-relaxed">
                                            This period favors material advancement but may cause internal restlessness. Focus on grounding practices.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-[#3E2A1F] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3E2A1F]/20 hover:bg-[#5A3E2B] transition-all flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" />
                                Generate Full Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}