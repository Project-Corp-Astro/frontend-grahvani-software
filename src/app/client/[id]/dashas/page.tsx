"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import { clientApi } from "@/lib/api";
import { useClient } from "@/hooks/queries/useClients";
import { useDasha, useOtherDasha } from "@/hooks/queries/useCalculations";

// --- Types ---
interface DashaPeriod {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years?: number;
    duration_months?: number; // Added for precise duration display
    duration_days?: number;
    duration_hours?: number;
    // Astro Engine format (named arrays)
    antardashas?: DashaPeriod[];
    pratyantardashas?: DashaPeriod[];
    sookshma_dashas?: DashaPeriod[];
    pran_dashas?: DashaPeriod[];
    // Database format (generic sublevels)
    sublevels?: DashaPeriod[];
}

interface DashaData {
    mahadashas: DashaPeriod[];
    dasha_list?: DashaPeriod[];
    user_name?: string;
    nakshatra_at_birth?: string;
}

type DashaLevel = 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshmadasha' | 'Pranadasha';

// Available Dasha systems with their endpoints
const DASHA_SYSTEMS = [
    { value: "vimshottari", label: "Vimshottari Dasha (120 Years)", endpoint: "prana" },
    { value: "tribhagi", label: "Tribhagi Dasha", endpoint: "tribhagi" },
    { value: "shodashottari", label: "Shodashottari Dasha (116 Years)", endpoint: "shodashottari" },
    { value: "dwadashottari", label: "Dwadashottari Dasha (112 Years)", endpoint: "dwadashottari" },
    { value: "panchottari", label: "Panchottari Dasha (105 Years)", endpoint: "panchottari" },
    { value: "chaturshitisama", label: "Chaturshitisama Dasha (84 Years)", endpoint: "chaturshitisama" },
    { value: "satabdika", label: "Satabdika Dasha (100 Years)", endpoint: "satabdika" },
    { value: "dwisaptati", label: "Dwisaptati Dasha (72 Years)", endpoint: "dwisaptati" },
    { value: "shastihayani", label: "Shastihayani Dasha (60 Years)", endpoint: "shastihayani" },
    { value: "shattrimshatsama", label: "Shattrimshatsama Dasha (36 Years)", endpoint: "shattrimshatsama" },
];

// Planet abbreviations for display
const PLANET_ABBR: Record<string, string> = {
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke',
};

// Format date for display
const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    } catch {
        return dateStr;
    }
};

// Format duration for display (e.g., 6y 10m 22d)
const formatDuration = (period: DashaPeriod): string => {
    const parts = [];
    if (period.duration_years && Math.floor(period.duration_years) > 0) {
        parts.push(`${Math.floor(period.duration_years)}y`);
    }

    // Some responses have duration_months/days directly
    if (period.duration_months && period.duration_months > 0) {
        parts.push(`${period.duration_months}m`);
    } else if (period.duration_years) {
        // Fallback calculation from fractional years if months missing
        const partialYear = period.duration_years % 1;
        const months = Math.floor(partialYear * 12);
        if (months > 0) parts.push(`${months}m`);
    }

    if (period.duration_days && Math.floor(period.duration_days) > 0) {
        parts.push(`${Math.floor(period.duration_days)}d`);
    }

    if (parts.length === 0 && period.duration_hours) {
        parts.push(`${Math.floor(period.duration_hours)}h`);
    }

    return parts.join(' ') || '-';
};

// Check if a period is currently active
const isCurrentPeriod = (startStr: string, endStr: string): boolean => {
    try {
        const now = new Date();
        const start = new Date(startStr);
        const end = new Date(endStr);
        return now >= start && now <= end;
    } catch {
        return false;
    }
};

// Get child periods based on level - handles BOTH Astro Engine and Database formats
const getChildPeriods = (period: DashaPeriod): DashaPeriod[] | undefined => {
    const children = period.sublevels ||
        period.antardashas ||
        period.pratyantardashas ||
        period.sookshma_dashas ||
        period.pran_dashas;
    return children;
};

// Recursive helper to ensure all periods have accurate start/end dates
const processDashaHierarchy = (periods: DashaPeriod[], parentStart?: string): DashaPeriod[] => {
    if (!periods) return [];

    return periods.map((period, idx) => {
        // If start_date is missing, derive it
        const start = period.start_date || (idx === 0 ? parentStart : periods[idx - 1].end_date);
        const children = getChildPeriods(period);

        const processedChildren = children ? processDashaHierarchy(children, start) : undefined;

        return {
            ...period,
            start_date: start as string,
            sublevels: processedChildren
        };
    });
};

// Get next level name
const getNextLevel = (level: DashaLevel): DashaLevel | null => {
    switch (level) {
        case 'Mahadasha': return 'Antardasha';
        case 'Antardasha': return 'Pratyantardasha';
        case 'Pratyantardasha': return 'Sookshmadasha';
        case 'Sookshmadasha': return 'Pranadasha';
        default: return null;
    }
};

// Build breadcrumb path label
const buildPathLabel = (path: DashaPeriod[]): string => {
    return path.map(p => PLANET_ABBR[p.planet] || p.planet.substring(0, 2)).join('/');
};

export default function DashaPage() {
    const params = useParams();
    const clientId = params?.id as string;

    const [selectedSystem, setSelectedSystem] = useState("vimshottari");
    const [dashaData, setDashaData] = useState<DashaData | null>(null);
    // const [clientBirthDate, setClientBirthDate] = useState<string | null>(null); // derived from hook
    // const [isLoading, setIsLoading] = useState(true); // derived
    // const [error, setError] = useState<string | null>(null); // derived

    // Navigation state
    const [currentLevel, setCurrentLevel] = useState<DashaLevel>('Mahadasha');
    const [navigationPath, setNavigationPath] = useState<DashaPeriod[]>([]);
    const [currentPeriods, setCurrentPeriods] = useState<DashaPeriod[]>([]);

    // Fetch Client Data
    const { data: client, isLoading: clientLoading } = useClient(clientId);

    // Determine system params
    const isVimshottari = selectedSystem === 'vimshottari';

    // Parallel Dasha Queries
    const { data: vimData, isLoading: vimLoading, error: vimError } = useDasha(
        clientId,
        'prana', // Endpoint used in original code for vimshottari
        'lahiri', // Hardcoded in original code
    );

    const { data: otherData, isLoading: otherLoading, error: otherError } = useOtherDasha(
        clientId,
        selectedSystem,
        'lahiri'
    );

    const dashaResponse = isVimshottari ? vimData : otherData;
    const isLoading = clientLoading || (isVimshottari ? vimLoading : otherLoading);
    const errorMsg = (isVimshottari ? vimError : otherError);

    // Sync Data
    useEffect(() => {
        if (client && dashaResponse) {
            const birthDate = client.birthDate ? new Date(client.birthDate).toISOString() : undefined;
            // Handle birth time adjustment if needed (copied from original logic)
            if (client.birthDate && client.birthTime) {
                const bd = new Date(client.birthDate);
                const btArr = client.birthTime.split(':');
                bd.setUTCHours(parseInt(btArr[0]), parseInt(btArr[1]), 0);
                // Date string updated
            }

            const data = dashaResponse.data || dashaResponse;
            const rawPeriods = (data as any)?.mahadashas || (data as any)?.dasha_list || [];

            if (rawPeriods && rawPeriods.length > 0) {
                const processedPeriods = processDashaHierarchy(rawPeriods as DashaPeriod[], birthDate);
                setDashaData({
                    mahadashas: processedPeriods,
                    ...data
                } as DashaData);

                // Only reset View if we don't have a path (avoid resetting during deep navigation if re-fetched?) 
                // Actually this page loads full tree so navigation is local.
                // So we usually just set currentPeriods to root IF navigationPath is empty.
                if (navigationPath.length === 0) {
                    setCurrentPeriods(processedPeriods);
                }
            }
        }
    }, [client, dashaResponse, navigationPath.length]);

    // Handle system change reset
    useEffect(() => {
        resetToMahadasha();
    }, [selectedSystem]);

    /* Removed manual fetchDasha useEffect */

    // Handle drilling into a period
    const handlePeriodClick = (period: DashaPeriod) => {
        const children = getChildPeriods(period);
        if (children && children.length > 0) {
            const nextLevel = getNextLevel(currentLevel);
            if (nextLevel) {
                setNavigationPath([...navigationPath, period]);
                setCurrentLevel(nextLevel);
                setCurrentPeriods(children);
            }
        }
    };

    // Handle going back one level
    const handleBack = () => {
        if (navigationPath.length === 0) return;

        const newPath = navigationPath.slice(0, -1);

        if (newPath.length === 0) {
            resetToMahadasha();
        } else {
            const levels: DashaLevel[] = ['Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshmadasha', 'Pranadasha'];
            const parentPeriod = newPath[newPath.length - 1];
            const parentLevel = levels[newPath.length - 1];
            const children = getChildPeriods(parentPeriod);

            setNavigationPath(newPath);
            setCurrentLevel(levels[newPath.length] as DashaLevel);
            setCurrentPeriods(children || []);
        }
    };

    // Reset to Mahadasha
    const resetToMahadasha = () => {
        setCurrentLevel('Mahadasha');
        setNavigationPath([]);
        if (dashaData?.mahadashas) {
            setCurrentPeriods(dashaData.mahadashas);
        }
    };

    // Level tabs
    const LEVELS: DashaLevel[] = ['Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshmadasha', 'Pranadasha'];

    // Get selected system label
    const selectedSystemLabel = DASHA_SYSTEMS.find(s => s.value === selectedSystem)?.label || 'Vimshottari Dasha';

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">

            {/* Header Card */}
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-[#D08C60]/30"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                }}
            >
                <div className="flex items-center justify-between gap-4 mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#D08C60]" />
                        <h1 className="font-serif text-2xl font-bold text-[#FEFAEA]">Dasha Analysis</h1>
                    </div>
                </div>
                <p className="text-[#FEFAEA]/80 font-serif italic text-sm max-w-2xl relative z-10">
                    Select a Dasha system and click on any planet to drill down into sub-periods.
                </p>
            </div>

            {/* Dasha System Selector */}
            <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-sm font-medium text-[#7A5A43]">Dasha System:</label>
                    <div className="flex-1 max-w-md">
                        <ParchmentSelect
                            value={selectedSystem}
                            onChange={(e) => setSelectedSystem(e.target.value)}
                            options={DASHA_SYSTEMS.map(s => ({ value: s.value, label: s.label }))}
                        />
                    </div>
                </div>
            </div>

            {/* Level Tabs */}
            <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-2 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {LEVELS.map((level, idx) => {
                        const isActive = currentLevel === level;
                        const isAccessible = idx <= navigationPath.length;

                        return (
                            <button
                                key={level}
                                onClick={() => {
                                    if (idx === 0) {
                                        setCurrentLevel('Mahadasha');
                                        setNavigationPath([]);
                                        setCurrentPeriods(dashaData?.mahadashas || []);
                                    } else if (idx < navigationPath.length) {
                                        const newPath = navigationPath.slice(0, idx);
                                        const parentPeriod = newPath[idx - 1];
                                        const children = getChildPeriods(parentPeriod);

                                        setNavigationPath(newPath);
                                        setCurrentLevel(level);
                                        setCurrentPeriods(children || []);
                                    }
                                }}
                                disabled={!isAccessible}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-[#F59E0B] text-white shadow-sm"
                                        : isAccessible
                                            ? "bg-[#F6EBD6] text-[#7A5A43] hover:bg-[#EDE0C8]"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current View Header */}
            <div className="bg-[#F59E0B] rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-white text-lg">{currentLevel}</h2>
                    {navigationPath.length > 0 && (
                        <span className="text-white/80 text-sm">
                            ({buildPathLabel(navigationPath)})
                        </span>
                    )}
                </div>
                {navigationPath.length > 0 && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-white hover:text-white/80 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-12 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#9C7A2F] animate-spin" />
                    <p className="text-[#7A5A43] font-serif">Loading {selectedSystemLabel}...</p>
                </div>
            )}

            {/* Error State */}
            {!isLoading && errorMsg && (
                <div className="bg-[#FEFAEA] border border-red-200 rounded-lg p-8 flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <p className="text-red-600 font-serif text-center">{(errorMsg as any)?.message || String(errorMsg)}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-[#9C7A2F] underline hover:no-underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Period List Table */}
            {!isLoading && !errorMsg && currentPeriods.length > 0 && (
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F6EBD6] border-b border-[#E7D6B8]">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-[#7A5A43] uppercase tracking-wider">Planet</th>
                                <th className="px-4 py-3 text-xs font-bold text-[#7A5A43] uppercase tracking-wider">Start Date</th>
                                <th className="px-4 py-3 text-xs font-bold text-[#7A5A43] uppercase tracking-wider">End Date</th>
                                <th className="px-4 py-3 text-xs font-bold text-[#7A5A43] uppercase tracking-wider">Duration</th>
                                <th className="px-4 py-3 text-xs font-bold text-[#7A5A43] uppercase tracking-wider text-right">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPeriods.map((period, idx) => {
                                const isCurrent = isCurrentPeriod(period.start_date, period.end_date);
                                const hasChildren = (getChildPeriods(period)?.length ?? 0) > 0;

                                return (
                                    <tr
                                        key={`${period.planet}-${period.start_date}-${idx}`}
                                        onClick={() => handlePeriodClick(period)}
                                        className={cn(
                                            "border-b border-[#E7D6B8] last:border-b-0 transition-colors",
                                            hasChildren && "cursor-pointer hover:bg-[#F6EBD6]",
                                            isCurrent && "bg-[#FEF3C7]"
                                        )}
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    isCurrent ? "bg-[#F59E0B]" : "bg-[#7A5A43]/20"
                                                )} />
                                                <span className={cn(
                                                    "font-medium",
                                                    isCurrent ? "text-[#F59E0B] font-bold" : "text-[#3E2A1F]"
                                                )}>
                                                    {period.planet}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#7A5A43]">
                                            {formatDate(period.start_date)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#7A5A43]">
                                            {formatDate(period.end_date)}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-serif text-[#7A5A43]">
                                            {formatDuration(period)}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {hasChildren && (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#F6EBD6] text-[#7A5A43]">
                                                    →
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No Data State */}
            {!isLoading && !errorMsg && currentPeriods.length === 0 && (
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-8 text-center">
                    <p className="text-[#7A5A43] font-serif">No periods available at this level.</p>
                </div>
            )}

        </div>
    );
}
