"use client";

import React, { useState, useEffect } from 'react';
import {
    ChevronRight, Calendar, Loader2,
    CheckCircle, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clientApi } from '@/lib/api';
import {
    DashaNode,
    formatDateDisplay,
    processDashaResponse,
    standardizeDuration
} from '@/lib/dasha-utils';
import { useVedicClient } from '@/context/VedicClientContext';

// Exact colors from demo/main page parity
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

const DASHA_LEVELS = [
    { id: 'mahadasha', name: 'Mahadasha', short: 'Maha' },
    { id: 'antardasha', name: 'Antardasha', short: 'Antar' },
    { id: 'pratyantardasha', name: 'Pratyantardasha', short: 'Pratyantar' },
    { id: 'sookshmadasha', name: 'Sookshma', short: 'Sookshma' },
    { id: 'pranadasha', name: 'Prana', short: 'Prana' },
];

interface KpVimshottariDashaProps {
    initialPeriods: DashaNode[];
}

export default function KpVimshottariDasha({ initialPeriods }: KpVimshottariDashaProps) {
    const { clientDetails } = useVedicClient();

    // Independent State for Drill-Down
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>(initialPeriods);
    const [path, setPath] = useState<DashaNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(0);

    // Reset when initial periods change (e.g. fresh load)
    useEffect(() => {
        if (path.length === 0) {
            setViewingPeriods(initialPeriods);
        }
    }, [initialPeriods]);

    const handleDrillDown = async (period: DashaNode) => {
        if (currentLevel >= 4) return; // Max depth (Prana) reached

        // Fix TS Error: Ensure ID exists
        if (!clientDetails?.id) {
            console.error("Client ID missing for drill-down");
            return;
        }

        setIsLoading(true);
        try {
            // Determine the NEXT level name
            const nextLevelIndex = currentLevel + 1;
            const nextLevelName = DASHA_LEVELS[nextLevelIndex].id; // e.g., 'antardasha'

            // Prepare Context
            // The API expects: { mahaLord, antarLord, pratyantarLord, sookshmaLord }
            const context: any = {};
            const Lords = [...path.map(p => p.planet), period.planet];

            if (Lords.length > 0) context.mahaLord = Lords[0];
            if (Lords.length > 1) context.antarLord = Lords[1];
            if (Lords.length > 2) context.pratyantarLord = Lords[2];
            if (Lords.length > 3) context.sookshmaLord = Lords[3];

            console.log("KP Drill Request:", {
                level: nextLevelName,
                context: context
            });

            // FETCH from Backend (KP Logic)
            const response = await clientApi.generateDasha(
                clientDetails.id,
                nextLevelName,
                'kp', // FORCE KP
                false,
                context
            );

            // Process Response 
            // We expect the API to return the list of sub-periods for the requested Lord.
            // processDashaResponse will extract the first valid array it finds.
            const fetchedSubPeriods = processDashaResponse(response.data, 1); // 1 = just get the list

            if (fetchedSubPeriods.length > 0) {
                setPath([...path, period]);
                setCurrentLevel(nextLevelIndex);
                setViewingPeriods(fetchedSubPeriods);
            } else {
                console.warn("No sub-periods found for KP drill-down");
            }

        } catch (error) {
            console.error("Failed to drill down KP Dasha:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            // Reset to Root
            setPath([]);
            setCurrentLevel(0);
            setViewingPeriods(initialPeriods);
            return;
        }

        // Slice path to that point
        const targetPath = path.slice(0, index + 1);

        // Re-construct the state:
        setPath(targetPath);
        setCurrentLevel(index + 1);

        // Fix TS Error: Ensure ID exists
        if (!clientDetails?.id) {
            // If we can't fetch, just set path? No, we need data.
            // But if we are just going UP the tree, do we need to re-fetch?
            // Yes, because we don't cache deeply here yet.
            return;
        }

        setIsLoading(true);

        (async () => {
            try {
                const nextLevelName = DASHA_LEVELS[index + 1 + 1].id;
                const context: any = {};
                const Lords = targetPath.map(p => p.planet);
                if (Lords.length > 0) context.mahaLord = Lords[0];
                if (Lords.length > 1) context.antarLord = Lords[1];
                if (Lords.length > 2) context.pratyantarLord = Lords[2];
                if (Lords.length > 3) context.sookshmaLord = Lords[3];

                const response = await clientApi.generateDasha(
                    clientDetails.id!, // ! safe here because checked above
                    nextLevelName,
                    'kp',
                    false,
                    context
                );

                const fetched = processDashaResponse(response.data, 1);
                setViewingPeriods(fetched);
            } catch (e) {
                console.error("Nav failed", e);
            } finally {
                setIsLoading(false);
            }
        })();
    };

    return (
        <div className="bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden shadow-sm">

            {/* Header / Selector / Breadcrumbs */}
            <div className="p-4 border-b border-[#D08C60]/10 bg-[#FAF7F2]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider bg-orange-100 px-2 py-1 rounded-md border border-orange-200">
                        KP System (Precise)
                    </span>
                    <span className="text-xs text-[#8B5A2B]/60 italic">
                        *Fetching exact planetary positions from engine
                    </span>
                </div>

                {/* Breadcrumb Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => handleBreadcrumbClick(-1)}
                        className={cn(
                            "text-sm font-bold transition-colors whitespace-nowrap",
                            path.length === 0 ? "text-[#D08C60]" : "text-[#8B5A2B] hover:text-[#D08C60]"
                        )}
                    >
                        Displaying: Mahadasha
                    </button>

                    {path.map((node, idx) => (
                        <React.Fragment key={idx}>
                            <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40 shrink-0" />
                            <button
                                onClick={() => handleBreadcrumbClick(idx)}
                                className={cn(
                                    "text-sm font-bold px-2 py-0.5 rounded border whitespace-nowrap",
                                    PLANET_COLORS[node.planet] || "bg-white border-gray-100"
                                )}
                            >
                                {node.planet} {DASHA_LEVELS[idx].short}
                            </button>
                        </React.Fragment>
                    ))}

                    {/* Current Level Label */}
                    {path.length > 0 && (
                        <>
                            <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40 shrink-0" />
                            <span className="text-sm font-bold text-[#D08C60]">
                                {DASHA_LEVELS[currentLevel].name} List
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                        <p className="font-serif text-sm text-[#8B5A2B] animate-pulse italic">
                            Calculating precise KP coordinates...
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest border-b border-[#D08C60]/10">
                            <tr>
                                <th className="px-6 py-4 text-left">Planet</th>
                                <th className="px-6 py-4 text-left">Start Date</th>
                                <th className="px-6 py-4 text-left">End Date</th>
                                <th className="px-6 py-4 text-left">Duration</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D08C60]/10 font-medium">
                            {viewingPeriods.map((period, idx) => (
                                <tr
                                    key={idx}
                                    className={cn(
                                        "hover:bg-[#D08C60]/10 transition-colors group",
                                        period.isCurrent && "bg-[#D08C60]/5",
                                        "cursor-pointer" // Make it look clickable
                                    )}
                                    // Only allow click if not at max depth
                                    onClick={() => currentLevel < 4 && handleDrillDown(period)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border shadow-sm",
                                                PLANET_COLORS[period.planet] || "bg-white"
                                            )}>
                                                {period.planet}
                                            </span>
                                            {period.isCurrent && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]/40" />
                                            {formatDateDisplay(period.startDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#3E2A1F] font-mono">
                                        {formatDateDisplay(period.endDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8B5A2B] font-bold">
                                        {standardizeDuration(period.raw?.duration_years || 0, period.raw?.duration_days)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {currentLevel < 4 ? (
                                            <button className="p-2 hover:bg-[#D08C60]/20 rounded-full transition-colors">
                                                <ChevronRight className="w-4 h-4 text-[#D08C60]" />
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
