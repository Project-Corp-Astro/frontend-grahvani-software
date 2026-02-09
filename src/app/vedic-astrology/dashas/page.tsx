"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    Loader2, ChevronRight, ChevronLeft,
    Calendar, ChevronDown, ChevronUp, Clock,
    Bug, CheckCircle, XCircle, Database, Zap, Search,
    User, MapPin, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DASHA_TYPES, clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import { useQueryClient } from "@tanstack/react-query";
import TribhagiDasha from '@/components/astrology/TribhagiDasha';
import ShodashottariDasha from '@/components/astrology/ShodashottariDasha';
import DwadashottariDasha from '@/components/astrology/DwadashottariDasha';
import PanchottariDasha from '@/components/astrology/PanchottariDasha';
import ChaturshitisamaDasha from '@/components/astrology/ChaturshitisamaDasha';
import SatabdikaDasha from '@/components/astrology/SatabdikaDasha';
import DwisaptatiDasha from '@/components/astrology/DwisaptatiDasha';
import ShasthihayaniDasha from '@/components/astrology/ShasthihayaniDasha';
import ShattrimshatsamaDasha from '../../../components/astrology/ShattrimshatsamaDasha';
import {
    findActiveDashaPath,
    processDashaResponse,
    standardizeDashaLevels,
    ActiveDashaPath,
    DashaNode,
    standardizeDuration,
    generateVimshottariSubperiods
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

// All 11 Dasha Systems metadata (Parity with Demo)
const DASHA_SYSTEMS = [
    { id: 'vimshottari', name: 'Vimshottari', years: 120, category: 'primary', applicable: true, desc: 'Universal Moon-nakshatra based' },
    { id: 'tribhagi', name: 'Tribhagi', years: 80, category: 'conditional', applicable: true, desc: 'One-third of Vimshottari' },
    { id: 'tribhagi-40', name: 'Tribhagi (40 Years)', years: 40, category: 'conditional', applicable: true, desc: '40 Year Cycle Variation' },
    { id: 'ashtottari', name: 'Ashtottari', years: 108, category: 'conditional', applicable: true, desc: 'Rahu & Venus Special Conditions' },
    { id: 'shodashottari', name: 'Shodashottari', years: 116, category: 'conditional', applicable: true, desc: 'Venus in 9th + Lagna hora' },
    { id: 'dwadashottari', name: 'Dwadashottari', years: 112, category: 'conditional', applicable: true, desc: 'Venus in Lagna' },
    { id: 'panchottari', name: 'Panchottari', years: 105, category: 'conditional', applicable: true, desc: 'Cancer Lagna + Dhanishtha' },
    { id: 'chaturshitisama', name: 'Chaturshitisama', years: 84, category: 'conditional', applicable: false, desc: '10th lord in 10th' },
    { id: 'satabdika', name: 'Satabdika', years: 100, category: 'conditional', applicable: true, desc: 'Vargottama Lagna' },
    { id: 'dwisaptati', name: 'Dwisaptati Sama', years: 72, category: 'conditional', applicable: true, desc: 'Lagna lord in 7th' },
    { id: 'shastihayani', name: 'Shastihayani', years: 60, category: 'conditional', applicable: false, desc: 'Sun in Lagna' },
    { id: 'shattrimshatsama', name: 'Shattrimshatsama', years: 36, category: 'conditional', applicable: false, desc: 'Daytime + Moon in Lagna' },
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
    const [dashaTree, setDashaTree] = useState<DashaNode[]>([]); // Now stores processed DashaNode[]
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [selectedPath, setSelectedPath] = useState<DashaNode[]>([]); // Array of processed DashaNode objects
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>([]);
    const [activeAnalysis, setActiveAnalysis] = useState<ActiveDashaPath | null>(null);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string | null>(null);

    // 🔧 DEBUG PANEL STATE
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [expandedDasha, setExpandedDasha] = useState<string | null>(null);
    const [isSubLevelFetching, setIsSubLevelFetching] = useState(false);

    // Auto-expand active system when panel opens
    useEffect(() => {
        if (showDebugPanel) {
            setExpandedDasha('active');
        }
    }, [showDebugPanel]);

    // Debug: Fetch Tribhagi 40 specifically for testing
    const tribhagi40Query = useOtherDasha(
        clientDetails?.id || '',
        'tribhagi-40',
        settings.ayanamsa.toLowerCase()
    );

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

    const isVimshottari = selectedDashaType === 'vimshottari';
    const isLoading = isVimshottari ? treeLoading : otherLoading;

    // Derived flags for specialized views
    const isTribhagi = selectedDashaType.includes('tribhagi');
    const isShodashottari = selectedDashaType === 'shodashottari';
    const isDwadashottari = selectedDashaType === 'dwadashottari';
    const isPanchottari = selectedDashaType.includes('panchottari');
    const isChaturshitisama = selectedDashaType === 'chaturshitisama';
    const isSatabdika = selectedDashaType === 'satabdika';
    const isDwisaptati = selectedDashaType === 'dwisaptati';
    const isAshtottari = selectedDashaType === 'ashtottari';
    // Fallback detection for Shastihayani via metadata condition
    const hasShasthiMeta = Boolean((otherData?.data?.mahadashas as any)?.meta?.shastihayani_condition);
    const isShasthihayani = selectedDashaType === 'shastihayani' || hasShasthiMeta;
    const hasShattrimMeta = Boolean((otherData?.data?.mahadashas as any)?.meta?.shattrimshatsama_condition);
    const isShattrimshatsama = selectedDashaType === 'shattrimshatsama' || hasShattrimMeta;

    const allowMathematicalDrillDown = isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isShasthihayani && !isShattrimshatsama && !isAshtottari;

    // Effect: Reset to Vimshottari if Raman/KP is selected
    useEffect(() => {
        if ((settings.ayanamsa === 'Raman' || settings.ayanamsa === 'KP') && selectedDashaType !== 'vimshottari') {
            setSelectedDashaType('vimshottari');
            setCurrentLevel(0);
            setSelectedPath([]);
            setDashaTree([]);
        }
    }, [settings.ayanamsa, selectedDashaType]);

    // Effect: Initialize and Analyze Tree
    useEffect(() => {
        const dashaData = isVimshottari ? treeResponse?.data : otherData?.data;
        if (dashaData) {
            // Use the robust processor from utils
            // HARD-LOCK: Specialized systems get maxLevel 1 (Antardasha), Vimshottari gets 4 (Prana)
            // HARD-LOCK: Specialized systems get maxLevel 1 (Antardasha), Vimshottari gets 4 (Prana), Ashtottari gets 2 (Pratyantar)
            const maxLevel = isVimshottari ? 4 : (isAshtottari ? 2 : (isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati || isShasthihayani || isShattrimshatsama ? 1 : 4));
            const processedTree = processDashaResponse(dashaData, maxLevel);

            if (processedTree.length > 0) {
                setDashaTree(processedTree);

                // Real-time analysis of the current active sequence
                // We can still use the raw response for this if findActiveDashaPath expects raw
                // Or update findActiveDashaPath to handle processed notes.
                // dasha-utils findActiveDashaPath handles raw. 
                // Let's stick to that for the "Active Analysis" widget.
                const analysis = findActiveDashaPath(dashaData);
                setActiveAnalysis(analysis);

                if (analysis.nodes.length > 0) {
                    setSelectedIntelPlanet(analysis.nodes[0].planet);
                }
            }
        }
    }, [treeResponse, otherData, isVimshottari, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, isShasthihayani, isShattrimshatsama, isAshtottari]);



    // Derived Viewing Periods based on drill-down
    // This allows traversing the full 5-level tree
    useEffect(() => {
        if ((!allowMathematicalDrillDown && !isAshtottari && currentLevel > 1) || (isAshtottari && currentLevel > 2)) {
            setCurrentLevel(0);
            setSelectedPath([]);
        }

        if (!allowMathematicalDrillDown || (isTribhagi && currentLevel >= 1) || (isShodashottari && currentLevel >= 1) || (isDwadashottari && currentLevel >= 1) || (isPanchottari && currentLevel >= 1) || (isChaturshitisama && currentLevel >= 1) || (isSatabdika && currentLevel >= 1) || (isDwisaptati && currentLevel >= 1) || (isAshtottari && currentLevel >= 2)) {
            // Revert: If it's specialized and we are at Antardasha or deeper, don't allow further
            if ((isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati) && currentLevel === 0) {
                setViewingPeriods(dashaTree);
            } else if (!isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari) {
                setViewingPeriods(dashaTree);
            }
            // For other systems, just show the root level (processed via standardizeDashaLevels previously)
            // But now we rely on dashaTree being processed.
            // Actually, the original logic for non-vimshottari was just showing root.
            if (!isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari) {
                setViewingPeriods(dashaTree);
                return;
            }
        }

        let currentNodes = dashaTree;

        // Traverse down the path
        for (const p of selectedPath) {
            // p is the raw node in the old code, but let's see. 
            // In handleDrillDown below, we should push the PLANET NAME or ID to path, 
            // like the Demo does.
            // Refactoring path to store IDs/Names is cleaner than storing objects.
            // BUT, to minimize breaking changes, let's see what selectedPath stores.
            // Currently it stores provided objects "raw".

            // If selectedPath stores objects, we find the matching node in currentNodes
            const match = currentNodes.find(n => n.planet === (p.planet || p.lord));
            if (match && match.sublevel) {
                currentNodes = match.sublevel;
            } else {
                currentNodes = [];
                break;
            }
        }

        setViewingPeriods(currentNodes);

    }, [dashaTree, selectedPath, allowMathematicalDrillDown, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, currentLevel, isAshtottari]);


    // Navigation Methods (Refactored for Processed Tree)
    const handleDrillDown = async (period: DashaNode) => {
        if (isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati) return; // Disable global drill-down for specialized views

        // ASHTOTTARI INCREMENTAL FETCH
        if (isAshtottari && currentLevel === 1 && (!period.sublevel || period.sublevel.length === 0)) {
            if (!clientDetails?.id) return;
            setIsSubLevelFetching(true);
            try {
                const mahaLord = selectedPath[0].planet;
                const antarLord = period.planet;

                const result = await clientApi.generateOtherDasha(
                    clientDetails.id,
                    'ashtottari',
                    settings.ayanamsa,
                    'pratyantardasha',
                    { mahaLord, antarLord }
                );

                // Process the result to find the specific sublevels
                const fullProcessed = processDashaResponse(result.data, 2);
                // Find matching branch in fullProcessed using path
                const mahaNode = fullProcessed.find(m => m.planet === mahaLord);
                if (mahaNode) {
                    const antarNode = mahaNode.sublevel?.find(a => a.planet === antarLord);
                    if (antarNode && antarNode.sublevel && antarNode.sublevel.length > 0) {
                        period.sublevel = antarNode.sublevel;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Ashtottari Pratyantar:", err);
            } finally {
                setIsSubLevelFetching(false);
            }
        }

        let nextLevelPeriods = period.sublevel || [];

        // Hybrid Logic: If API didn't return deeper levels, generate them on fly
        if ((!nextLevelPeriods || nextLevelPeriods.length === 0) && allowMathematicalDrillDown && currentLevel < 4) {
            nextLevelPeriods = generateVimshottariSubperiods(period);
            period.sublevel = nextLevelPeriods; // Cache it
        }

        if (nextLevelPeriods && nextLevelPeriods.length > 0) {
            // We push the period object itself to path to maintain breadcrumb context
            const newPath = [...selectedPath, period];
            setSelectedPath(newPath);
            setCurrentLevel(currentLevel + 1);
            setSelectedIntelPlanet(period.planet);

            // Note: UseEffect will update viewingPeriods based on new path.
            // But we must ensure the UseEffect finds this 'generated' sublevel.
            // Since we mutated period.sublevel above, and 'period' is reference from dashaTree (or viewingPeriods derived from it),
            // the UseEffect traversal SHOULD see it.
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setSelectedPath([]);
            setCurrentLevel(0);
            setSelectedIntelPlanet(dashaTree.length > 0 ? dashaTree[0].planet : null); // Reset to first or current?
        } else {
            const newPath = selectedPath.slice(0, index + 1);
            setSelectedPath(newPath);
            setCurrentLevel(index + 1);

            const lastParent = newPath[newPath.length - 1];
            setSelectedIntelPlanet(lastParent.planet);
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
        <div className="min-h-screen">
            {/* Page Heading */}
            <div className="mb-4">
                <h1 className="text-lg font-bold text-[#3E2A1F] tracking-wider">Dasha System</h1>
            </div>

            {/* ================================================================= */}
            {/* MAIN GRID LAYOUT - Table on Left, Current Dasha on Right */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


                {/* ================================================================= */}
                {/* LEFT SIDE - MAIN DASHA TABLE (2/3 width) */}
                {/* ================================================================= */}
                <div className="lg:col-span-2">
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
                                        {DASHA_SYSTEMS.filter(sys => {
                                            if (settings.ayanamsa === 'Raman' || settings.ayanamsa === 'KP') {
                                                return sys.id === 'vimshottari';
                                            }
                                            return true;
                                        }).map((sys, idx) => (
                                            <option key={sys.id} value={sys.id}>
                                                {idx + 1}. {sys.name} {sys.years > 0 ? `(${sys.years} yrs)` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5A2B] pointer-events-none" />
                                </div>
                            </div>

                            {/* Level Tabs (EXACT DEMO STYLE) */}
                            {allowMathematicalDrillDown && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isShasthihayani && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.filter((_, idx) => !isTribhagi || idx <= 1).map((level, idx) => (
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
                        {/* Breadcrumbs - Hidden for Specialized Views */}
                        {!isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && (
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
                        )}

                        {/* Table */}
                        <div className="overflow-x-auto min-h-[400px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                                    <p className="font-serif text-sm text-[#8B5A2B] animate-pulse italic">Quantum Calculating Eras...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Sub-levels Labels for Specialized Views (Only 2 levels) - Only show when there's a selection */}
                                    {(isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati || isShasthihayani || isShattrimshatsama || isAshtottari) && selectedPath.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-orange-100">
                                            {selectedPath[0] && (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-[#8B5A2B]/40 uppercase tracking-widest mb-1">Mahadasha (M)</span>
                                                    <span className="text-sm font-black text-[#5A3E2B] uppercase">{selectedPath[0].planet}</span>
                                                </div>
                                            )}
                                            {selectedPath[1] && (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-[#8B5A2B]/40 uppercase tracking-widest mb-1">Antardasha (A)</span>
                                                    <span className="text-sm font-black text-[#5A3E2B] uppercase">{selectedPath[1].planet}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Handle Specialized Views */}
                                    {isTribhagi ? (
                                        <TribhagiDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isShodashottari ? (
                                        <ShodashottariDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isDwadashottari ? (
                                        <DwadashottariDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isPanchottari ? (
                                        <PanchottariDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isChaturshitisama ? (
                                        <ChaturshitisamaDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isSatabdika ? (
                                        <SatabdikaDasha
                                            periods={viewingPeriods}
                                        />
                                    ) : isDwisaptati ? (
                                        <DwisaptatiDasha
                                            periods={viewingPeriods}
                                            isApplicable={(otherData?.data?.mahadashas as any)?.meta?.is_applicable !== false}
                                        />
                                    ) : isShasthihayani ? (
                                        <ShasthihayaniDasha
                                            periods={viewingPeriods}
                                            isApplicable={(otherData?.data?.mahadashas as any)?.meta?.is_applicable !== false}
                                        />
                                    ) : isShattrimshatsama ? (
                                        <ShattrimshatsamaDasha
                                            periods={viewingPeriods}
                                            isApplicable={(otherData?.data?.mahadashas as any)?.meta?.is_applicable !== false}
                                        />
                                    ) : isShattrimshatsama ? (
                                        <ShattrimshatsamaDasha
                                            periods={viewingPeriods}
                                            isApplicable={(otherData?.data?.mahadashas as any)?.meta?.is_applicable !== false}
                                        />

                                    ) : (
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
                                                {viewingPeriods.map((period, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className={cn(
                                                            "hover:bg-[#D08C60]/10 transition-colors group",
                                                            period.isCurrent && "bg-[#D08C60]/5",
                                                            (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) ? "cursor-pointer" : "cursor-default"
                                                        )}
                                                        onClick={() => (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) && (isSubLevelFetching ? null : handleDrillDown(period))}
                                                    >
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-sm min-w-[60px] justify-center",
                                                                    PLANET_COLORS_DEMO[period.planet] || "bg-white"
                                                                )}>
                                                                    {period.planet}
                                                                </span>
                                                                {period.isCurrent && (
                                                                    <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3 h-3 text-[#8B5A2B]/40" />
                                                                {formatDateShort(period.startDate)}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-xs text-[#3E2A1F] font-mono">{formatDateShort(period.endDate)}</td>
                                                        <td className="px-3 py-2 text-xs text-[#8B5A2B] font-bold">
                                                            {standardizeDuration(period.raw?.duration_years || 0, period.raw?.duration_days)}
                                                        </td>
                                                        <td className="px-3 py-2 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {isSubLevelFetching && currentLevel === 1 && period.planet === selectedIntelPlanet ? (
                                                                    <Loader2 className="w-3 h-3 text-[#D08C60] animate-spin" />
                                                                ) : period.isCurrent ? (
                                                                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
                                                                ) : (
                                                                    (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) ? (
                                                                        <ChevronRight className="w-3 h-3 text-[#D08C60] transition-transform group-hover:scale-125" />
                                                                    ) : (
                                                                        <span className="text-[#D08C60]/40 text-xs">—</span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* End Left Side */}

                {/* ================================================================= */}
                {/* RIGHT SIDE - CURRENT DASHA CARD (1/3 width) */}
                {/* ================================================================= */}
                <div className="lg:col-span-1">
                    <div className="bg-[#FAF7F2] border border-[#D08C60]/30 rounded-xl p-4 shadow-sm lg:sticky lg:top-4">
                        <div className="space-y-4">
                            {/* Header with Icon */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#D08C60]/10 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-5 h-5 text-[#D08C60]" />
                                </div>
                                <div>
                                    <h2 className="font-serif font-bold text-lg text-[#3E2A1F] leading-tight">Current Dasha</h2>
                                    <div className="flex items-center gap-2 text-[10px] text-[#8B5A2B] font-mono">
                                        <span className="text-green-600 font-bold tracking-widest uppercase">● Live</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date Range */}
                            {activeLords[0] && (
                                <div className="text-xs text-[#8B5A2B] font-mono border-t border-[#D08C60]/20 pt-3">
                                    {`${formatDateShort(activeLords[0].startDate)} — ${formatDateShort(activeLords[0].endDate)}`}
                                </div>
                            )}

                            {/* Dasha Levels */}
                            <div className="space-y-3">
                                {activeLords.slice(0, 3).map((node, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-[#8B5A2B]/60 font-bold mb-1">
                                            {i === 0 ? 'Mahadasha' : i === 1 ? 'Antardasha' : 'Pratyantardasha'}
                                        </span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className={cn(
                                                "font-bold text-lg",
                                                i === 0 ? "text-[#D97706]" : i === 1 ? "text-[#C2410C]" : "text-[#BE185D]"
                                            )}>
                                                {node.planet}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            {activeLords[0] && (
                                <div className="border-t border-[#D08C60]/20 pt-3">
                                    <div className="flex justify-between text-[10px] mb-2 font-medium tracking-tight">
                                        <span className="text-[#8B5A2B] uppercase">Maha Progress</span>
                                        <span className="text-[#D97706] font-bold">{activeAnalysis?.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-[#D08C60]/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                                            style={{ width: `${activeAnalysis?.progress || 0}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-right mt-2 text-[#8B5A2B]/60 font-mono">
                                        {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days left
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* End Right Side */}

            </div>
            {/* End Grid Layout */}

            {/* 🔧 DASHA DEBUG PANEL - FLOATING ICON MODE */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
                {showDebugPanel && (
                    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-[#4ECCA3]/30 rounded-2xl overflow-hidden shadow-2xl w-[400px] max-w-[90vw] animate-in slide-in-from-bottom-5 fade-in duration-200">
                        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Bug className="w-4 h-4 text-[#4ECCA3]" />
                                <span className="font-mono text-xs font-bold text-[#4ECCA3] uppercase tracking-widest">
                                    Debug Console
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDebugPanel(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
                            <div className="text-[10px] text-white/40 font-mono mb-2">
                                Client: {clientDetails?.id?.slice(0, 8)}... | Sys: {selectedDashaType}
                            </div>

                            {/* Selected Dasha Status */}
                            <DashaDebugRow
                                name={`Active System: ${selectedDashaType}`}
                                query={isVimshottari ? treeResponse : otherError ? { error: otherError, isError: true } : { data: otherData, isLoading: otherLoading, isError: !!otherError }}
                                isExpanded={expandedDasha === 'active'}
                                onToggle={() => setExpandedDasha(expandedDasha === 'active' ? null : 'active')}
                            />

                            {/* Tribhagi-40 Dasha Status (FORCED CHECK) */}
                            <DashaDebugRow
                                name="Tribhagi Dasha 40yr (FORCED CHECK)"
                                query={tribhagi40Query}
                                isExpanded={expandedDasha === 'tribhagi-40'}
                                onToggle={() => setExpandedDasha(expandedDasha === 'tribhagi-40' ? null : 'tribhagi-40')}
                                highlight
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setShowDebugPanel(!showDebugPanel)}
                    className={cn(
                        "p-3 rounded-full shadow-lg border transition-all duration-200 flex items-center justify-center",
                        showDebugPanel
                            ? "bg-[#4ECCA3] border-[#4ECCA3] text-[#1a1a2e] rotate-90"
                            : "bg-[#1a1a2e] border-[#4ECCA3]/50 text-[#4ECCA3] hover:bg-[#4ECCA3] hover:text-[#1a1a2e]"
                    )}
                    title="Toggle Debug Panel"
                >
                    <Bug className="w-5 h-5" />
                </button>
            </div>
        </div >
    );
}

// 🔧 DEBUG COMPONENT - Dasha Status Row
function DashaDebugRow({
    name,
    query,
    isExpanded,
    onToggle,
    highlight = false
}: {
    name: string;
    query: any;
    isExpanded: boolean;
    onToggle: () => void;
    highlight?: boolean;
}) {
    const data = query?.data;
    const isLoading = query?.isLoading;
    const isError = query?.isError;
    const error = query?.error;
    const isFetching = query?.isFetching;

    const getStatusIcon = () => {
        if (isLoading || isFetching) return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
        if (isError) return <XCircle className="w-4 h-4 text-red-400" />;
        if (data) return <CheckCircle className="w-4 h-4 text-green-400" />;
        return <Database className="w-4 h-4 text-white/40" />;
    };

    const getStatusText = () => {
        if (isLoading) return 'Loading...';
        if (isFetching) return 'Refetching...';
        if (isError) return `Error: ${(error as Error)?.message || 'Unknown error'}`;
        if (data) return 'Data received ✓';
        return 'Not fetched';
    };

    const getSourceBadge = () => {
        if (!data) return null;
        const cached = data?.cached;
        return (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${cached
                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                : 'bg-green-500/20 text-green-400 border border-green-400/30'
                }`}>
                {cached ? '📦 FROM CACHE/DB' : '🔥 FRESH FROM API'}
            </span>
        );
    };

    return (
        <div className={`rounded-xl border ${highlight ? 'border-[#4ECCA3]/50 bg-[#4ECCA3]/5' : 'border-white/10 bg-white/5'}`}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <span className={`font-mono text-sm ${highlight ? 'text-[#4ECCA3] font-bold' : 'text-white/80'}`}>
                        {name}
                    </span>
                    {getSourceBadge()}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 font-mono">{getStatusText()}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
            </button>

            {isExpanded && (
                <div className="p-3 pt-0 border-t border-white/10">
                    <div className="bg-black/30 rounded-lg p-3 max-h-60 overflow-auto">
                        <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap">
                            {isError
                                ? JSON.stringify({ error: (error as Error)?.message, stack: (error as Error)?.stack }, null, 2)
                                : data
                                    ? JSON.stringify(data, null, 2)
                                    : 'No data available'
                            }
                        </pre>
                    </div>
                    {data && (
                        <div className="mt-2 flex gap-2 text-[10px] text-white/40 font-mono">
                            <span>📊 Data size: {JSON.stringify(data).length} bytes</span>
                            <span>|</span>
                            <span>⏰ Fetched: {new Date().toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
