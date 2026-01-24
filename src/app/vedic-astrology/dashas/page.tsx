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
import { DASHA_TYPES } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import { useQueryClient } from "@tanstack/react-query";
import { 
    findActiveDashaPath, 
    standardizeDashaLevels, 
    ActiveDashaPath, 
    DashaNode, 
    PLANET_INTEL,
    standardizeDuration
} from '@/lib/dasha-utils';

// =============================================================================
// SENIOR UTILS (Formatting & Progress)
// =============================================================================

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

// Exact colors from demo
const PLANET_COLORS_DEMO: Record<string, string> = {
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
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // State
    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaTree, setDashaTree] = useState<any[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(0); 
    const [selectedPath, setSelectedPath] = useState<any[]>([]); // Array of original period objects
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>([]);
    const [activeAnalysis, setActiveAnalysis] = useState<ActiveDashaPath | null>(null);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string | null>(null);

    const isVimshottari = selectedDashaType === 'vimshottari';

    // Queries
    const { data: treeResponse, isLoading: treeLoading, error: treeError } = useDasha(
        clientDetails?.id || '',
        'tree', 
        settings.ayanamsa.toLowerCase()
    );

    const { data: otherData, isLoading: otherLoading, error: otherError } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        settings.ayanamsa.toLowerCase()
    );

    const isLoading = isVimshottari ? treeLoading : otherLoading;

    // Effect: Initialize and Analyze Tree
    useEffect(() => {
        const response = isVimshottari ? treeResponse : otherData;
        if (response?.data) {
            const rawMahadashas = (response.data as any).mahadashas || (response.data as any).periods || [];
            if (rawMahadashas.length > 0) {
                setDashaTree(rawMahadashas);
                
                // Real-time analysis of the current active sequence
                const analysis = findActiveDashaPath(response.data);
                setActiveAnalysis(analysis);
                
                if (analysis.nodes.length > 0) {
                    setSelectedIntelPlanet(analysis.nodes[0].planet);
                }

                // Default view: Mahadashas
                setViewingPeriods(standardizeDashaLevels(rawMahadashas));
            }
        }
    }, [treeResponse, otherData, isVimshottari]);

    // Navigation Methods (Matching Demo Flow & Solving date-chain bug)
    const handleDrillDown = (period: DashaNode) => {
        const raw = period.raw;
        const nextSublevels = raw.antardashas || raw.pratyantardashas || raw.sookshma_dashas || raw.pran_dashas || raw.sublevels;
        
        if (nextSublevels && Array.isArray(nextSublevels)) {
            const newPath = [...selectedPath, raw];
            setSelectedPath(newPath);
            setCurrentLevel(currentLevel + 1);
            
            // Critical: Pass parent's start date to maintain date-chain continuity
            setViewingPeriods(standardizeDashaLevels(nextSublevels, raw.start_date || raw.startDate || period.startDate));
            setSelectedIntelPlanet(period.planet);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setSelectedPath([]);
            setCurrentLevel(0);
            setViewingPeriods(standardizeDashaLevels(dashaTree));
        } else {
            const newPath = selectedPath.slice(0, index + 1);
            const parent = newPath[newPath.length - 1];
            const children = parent.antardashas || parent.pratyantardashas || parent.sookshma_dashas || parent.pran_dashas || parent.sublevels;
            setSelectedPath(newPath);
            setCurrentLevel(index + 1);
            
            // Critical: Pass parent's start date to maintain date-chain continuity
            // We use the parent's actual calculated start from the tree traversal if possible, 
            // but for breadcrumbs, the raw object is stored.
            setViewingPeriods(standardizeDashaLevels(children, parent.start_date || parent.startDate));
            setSelectedIntelPlanet(parent.planet || parent.lord);
        }
    };

    const handleSystemChange = (type: string) => {
        setSelectedDashaType(type);
        setCurrentLevel(0);
        setSelectedPath([]);
        setDashaTree([]);
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
            
            {/* ================================================================= */}
            {/* HEADER: Client Info & Actions (DEMO PARITY) */}
            {/* ================================================================= */}
            <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#D08C60]" />
                            <div className="font-serif font-black text-[#3E2A1F] text-lg">
                                {clientDetails.name}
                            </div>
                        </div>

                        {/* Client Quick Info */}
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
                            {settings.ayanamsa}
                        </span>
                        <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Print">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Export PDF">
                            <Download className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['dasha'] })}
                            className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" 
                            title="Refresh"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ================================================================= */}
            {/* CURRENT PERIOD CARD (EXACT DEMO UI) */}
            {/* ================================================================= */}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Mahadasha */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Mahadasha</p>
                        <p className="text-2xl font-black text-yellow-300">{activeLords[0]?.planet || '—'}</p>
                        <p className="text-xs text-white/50 mt-1 font-mono">
                            {activeLords[0] ? `${formatDateShort(activeLords[0].startDate)} - ${formatDateShort(activeLords[0].endDate)}` : 'Loading...'}
                        </p>
                    </div>
                    {/* Antardasha */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Antardasha</p>
                        <p className="text-2xl font-black text-orange-300">{activeLords[1]?.planet || '—'}</p>
                        <p className="text-xs text-white/50 mt-1 font-mono">
                            {activeLords[1] ? `${formatDateShort(activeLords[1].startDate)} - ${formatDateShort(activeLords[1].endDate)}` : '...'}
                        </p>
                    </div>
                    {/* Pratyantardasha */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Pratyantardasha</p>
                        <p className="text-2xl font-black text-pink-300">{activeLords[2]?.planet || '—'}</p>
                        <p className="text-xs text-white/50 mt-1 font-mono">
                            {activeLords[2] ? `${formatDateShort(activeLords[2].startDate)} - ${formatDateShort(activeLords[2].endDate)}` : '...'}
                        </p>
                    </div>
                </div>

                {/* Progress Bar (Demo Style) */}
                {activeLords[0] && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-xs mb-2 font-bold tracking-tight">
                            <span className="text-white/80 uppercase">{activeLords[0].planet} Mahadasha Progress</span>
                            <span className="text-yellow-300">{activeAnalysis?.progress}% complete</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-[1000ms]"
                                style={{ width: `${activeAnalysis?.progress || 0}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-white/50 font-medium">
                            <span>Started: {formatDateShort(activeLords[0].startDate)}</span>
                            <span className="text-yellow-300 font-black">
                                {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days remaining
                            </span>
                            <span>Ends: {formatDateShort(activeLords[0].endDate)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ================================================================= */}
            {/* MAIN CONTENT Area (Demo Parity) */}
            {/* ================================================================= */}
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

                            {/* Level Tabs (EXACT DEMO STYLE) */}
                            {isVimshottari && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.map((level, idx) => (
                                        <button
                                            key={level.id}
                                            onClick={() => handleBreadcrumbClick(idx - 1)}
                                            disabled={idx > selectedPath.length}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border",
                                                currentLevel === idx 
                                                    ? "bg-[#D08C60] text-white border-[#D08C60] shadow-sm" 
                                                    : idx <= selectedPath.length 
                                                        ? "bg-white text-[#8B5A2B] border-[#D08C60]/30 hover:bg-[#D08C60]/10" 
                                                        : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                            )}
                                        >
                                            {level.short}
                                        </button>
                                    ))}
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
                            {selectedPath.map((period, idx) => (
                                <React.Fragment key={idx}>
                                    <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                    <button
                                        onClick={() => handleBreadcrumbClick(idx)}
                                        className={cn(
                                            "text-sm font-bold px-2 py-0.5 rounded border",
                                            PLANET_COLORS_DEMO[period.planet || period.lord || 'Jupiter'] || "bg-white border-gray-100"
                                        )}
                                    >
                                        {period.planet || period.lord} {DASHA_LEVELS[idx].short}
                                    </button>
                                </React.Fragment>
                            ))}
                            {currentLevel > 0 && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                    <span className="text-sm font-bold text-[#D08C60]">{DASHA_LEVELS[currentLevel].name}</span>
                                </>
                            )}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto min-h-[400px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                                    <p className="font-serif text-sm text-[#8B5A2B] animate-pulse italic">Quantum Calculating Eras...</p>
                                </div>
                            ) : (
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
                                        {viewingPeriods.map((period, idx) => (
                                            <tr 
                                                key={idx} 
                                                className={cn(
                                                    "hover:bg-[#D08C60]/10 transition-colors cursor-pointer group",
                                                    period.isCurrent && "bg-[#D08C60]/5"
                                                )}
                                                onClick={() => handleDrillDown(period)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border shadow-sm",
                                                            PLANET_COLORS_DEMO[period.planet] || "bg-white"
                                                        )}>
                                                            {period.planet}
                                                        </span>
                                                        {period.isCurrent && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                                Current Active
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]/40" />
                                                        {formatDateShort(period.startDate)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">{formatDateShort(period.endDate)}</td>
                                                <td className="px-6 py-4 text-sm text-[#8B5A2B] font-bold">
                                                    {standardizeDuration(period.raw?.duration_years || 0, period.raw?.duration_days)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                       {period.isCurrent ? (
                                                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                                       ) : (
                                                            <ChevronRight className="w-4 h-4 text-[#D08C60] transition-transform group-hover:scale-125" />
                                                       )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Timeline visualization (Demo Style) */}
                    <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-[#3E2A1F] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D08C60]" />
                            Life Timeline (Mahadasha)
                        </h3>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                            {dashaTree.map((p: any, i) => {
                                const isCur = activeLords[0]?.planet === p.planet;
                                return (
                                    <React.Fragment key={i}>
                                        <div 
                                            className={cn(
                                                "px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-tighter shrink-0 transition-all shadow-sm",
                                                isCur ? "bg-[#3E2A1F] text-white border-[#3E2A1F] ring-2 ring-[#D08C60]/30" : 
                                                PLANET_COLORS_DEMO[p.planet] || "bg-white border-gray-100"
                                            )}
                                        >
                                            {p.planet}
                                            <span className="block text-[8px] font-normal opacity-60 mt-0.5">{Math.floor(p.duration_years || 0)} years</span>
                                        </div>
                                        {i < dashaTree.length - 1 && <div className="w-4 h-[1px] bg-[#D08C60]/20 shrink-0" />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (DEMO PARITY) */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden shadow-sm">
                        <div className={cn(
                            "p-5 border-b border-[#D08C60]/10",
                            PLANET_COLORS_DEMO[selectedIntelPlanet || 'Jupiter'] || "bg-yellow-50"
                        )}>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-serif font-bold text-xl text-[#3E2A1F]">{selectedIntelPlanet} Dasha Intel</h3>
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                            </div>
                            <p className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider opacity-70">
                                {PLANET_INTEL[selectedIntelPlanet || '']?.nature || 'Universal Influence'}
                            </p>
                        </div>
                        
                        <div className="p-5 space-y-6">
                            <section>
                                <h4 className="text-xs font-bold text-[#3E2A1F] uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Star className="w-3.5 h-3.5 text-yellow-500" /> Key Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(PLANET_INTEL[selectedIntelPlanet || '']?.themes || ['Growth', 'Karma']).map((t: string) => (
                                        <span key={t} className="px-2 py-1 bg-[#FAF7F2] text-[#3E2A1F] text-[10px] font-bold rounded-lg border border-[#D08C60]/20">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
                                <h4 className="text-xs font-bold text-[#3E2A1F] uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5 text-amber-600" /> General Effects
                                </h4>
                                <p className="text-xs text-[#5A3E2B] leading-relaxed font-medium italic">
                                    "{PLANET_INTEL[selectedIntelPlanet || '']?.advice || 'This period marks a significant cycle of transformation.'}"
                                </p>
                            </section>

                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 shadow-sm">
                                <p className="text-[10px] uppercase tracking-wider text-amber-800 mb-1 font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Astrologer's Tip
                                </p>
                                <p className="text-xs text-amber-900 font-bold antialiased">
                                    {PLANET_INTEL[selectedIntelPlanet || '']?.tip || 'Individual placement must be analyzed for precise remedial measures.'}
                                </p>
                            </div>

                            <button className="w-full py-3 bg-[#D08C60] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#D08C60]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Generate Expert Analysis
                            </button>
                        </div>
                    </div>

                    {/* All 11 Systems Panel */}
                    <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                        <h3 className="font-serif font-bold text-[#3E2A1F] mb-3 text-sm">All 11 Dasha Systems</h3>
                        <div className="space-y-1 text-xs">
                            {[
                                { name: 'Vimshottari (Moon)', desc: '120 yrs - Universal', ok: true },
                                { name: 'Tribhagi', desc: '40 yrs - Conditional', ok: true },
                                { name: 'Yogini', desc: '36 yrs - Predictive', ok: true },
                                { name: 'Jaimini Chara', desc: 'Sign Based', ok: true },
                                { name: 'Ashtottari', desc: '108 yrs - Conditional', ok: false }
                            ].map((sys, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF7F2] transition-colors">
                                    <span className="font-medium text-[#3E2A1F]">{idx + 1}. {sys.name}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                        sys.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {sys.ok ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
