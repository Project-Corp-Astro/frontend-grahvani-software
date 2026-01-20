"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Calendar, ChevronRight, ChevronDown, Circle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import { clientApi, DashaResponse } from "@/lib/api";

// --- Types ---
interface DashaNode {
    id: string;
    planet: string;
    start: string;
    end: string;
    level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshma' | 'Prana';
    children?: DashaNode[];
    isCurrent?: boolean;
}

// Planet colors for timeline visualization
const PLANET_COLORS: Record<string, string> = {
    Sun: '#F59E0B',
    Moon: '#94A3B8',
    Mars: '#EF4444',
    Mercury: '#10B981',
    Jupiter: '#F97316',
    Venus: '#EC4899',
    Saturn: '#6B7280',
    Rahu: '#1E3A8A',
    Ketu: '#7C3AED',
};

// Available Dasha systems (only those implemented in backend)
const DASHA_SYSTEMS = [
    { value: "vimshottari", label: "Vimshottari Dasha" },
    { value: "tribhagi", label: "Tribhagi Dasha" },
    { value: "shodashottari", label: "Shodashottari Dasha" },
    { value: "dwadashottari", label: "Dwadashottari Dasha" },
    { value: "panchottari", label: "Panchottari Dasha" },
];

// Transform backend dasha response to DashaNode tree
function transformDashaData(apiData: DashaResponse): DashaNode[] {
    if (!apiData?.data?.mahadashas) return [];

    const now = new Date();

    const formatDate = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const isCurrentPeriod = (startStr: string, endStr: string): boolean => {
        try {
            const start = new Date(startStr);
            const end = new Date(endStr);
            return now >= start && now <= end;
        } catch {
            return false;
        }
    };

    const mapLevel = (depth: number): DashaNode['level'] => {
        const levels: DashaNode['level'][] = ['Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshma', 'Prana'];
        return levels[depth] || 'Prana';
    };

    const transformPeriod = (period: any, depth: number, parentId: string): DashaNode => {
        const id = `${parentId}-${period.planet?.toLowerCase() || 'unknown'}-${depth}`;
        const startDate = period.startDate || period.start_date || '';
        const endDate = period.endDate || period.end_date || '';
        const isCurrent = isCurrentPeriod(startDate, endDate);

        const node: DashaNode = {
            id,
            planet: period.planet || 'Unknown',
            start: formatDate(startDate),
            end: formatDate(endDate),
            level: mapLevel(depth),
            isCurrent,
        };

        // Recursively transform sub-periods
        const subPeriods = period.subPeriods || period.sub_periods || period.antardashas || [];
        if (subPeriods.length > 0) {
            node.children = subPeriods.map((sp: any) => transformPeriod(sp, depth + 1, id));
        }

        return node;
    };

    return apiData.data.mahadashas.map((maha: any, idx: number) =>
        transformPeriod(maha, 0, `maha-${idx}`)
    );
}

// Find current dasha sequence for display
function findCurrentDasha(nodes: DashaNode[]): { maha?: string; antar?: string; pratyantar?: string } {
    for (const maha of nodes) {
        if (maha.isCurrent) {
            const result: { maha?: string; antar?: string; pratyantar?: string } = { maha: maha.planet };
            if (maha.children) {
                for (const antar of maha.children) {
                    if (antar.isCurrent) {
                        result.antar = antar.planet;
                        if (antar.children) {
                            for (const pratyantar of antar.children) {
                                if (pratyantar.isCurrent) {
                                    result.pratyantar = pratyantar.planet;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            return result;
        }
    }
    return {};
}

export default function DashaPage() {
    const params = useParams();
    const clientId = params?.id as string;

    const [dashaSystem, setDashaSystem] = useState("vimshottari");
    const [dashaData, setDashaData] = useState<DashaNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // Fetch dasha data when client or system changes
    useEffect(() => {
        if (!clientId) return;

        const fetchDasha = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Request deep dasha (prana level includes all 5 levels)
                const response = await clientApi.generateDasha(
                    clientId,
                    'prana', // Get deepest level to have full hierarchy
                    'lahiri',
                    false
                );

                const transformed = transformDashaData(response);
                setDashaData(transformed);

                // Auto-expand current periods
                const currentIds = new Set<string>();
                const findCurrentIds = (nodes: DashaNode[]) => {
                    for (const node of nodes) {
                        if (node.isCurrent) {
                            currentIds.add(node.id);
                            if (node.children) findCurrentIds(node.children);
                        }
                    }
                };
                findCurrentIds(transformed);
                setExpandedNodes(currentIds);

            } catch (err: any) {
                console.error('Dasha fetch error:', err);
                setError(err.message || 'Failed to load Dasha data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDasha();
    }, [clientId, dashaSystem]);

    const toggleNode = (id: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNodes(newExpanded);
    };

    // Get current running dasha for header display
    const currentDasha = useMemo(() => findCurrentDasha(dashaData), [dashaData]);

    // Get current mahadasha end date
    const currentMahaEnd = useMemo(() => {
        const currentMaha = dashaData.find(d => d.isCurrent);
        return currentMaha?.end || '';
    }, [dashaData]);

    // Get display label for selected system
    const systemLabel = DASHA_SYSTEMS.find(s => s.value === dashaSystem)?.label || 'Vimshottari Dasha';

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">

            {/* Header Card */}
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-[#D08C60]/30"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                }}
            >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Clock className="w-5 h-5 text-[#D08C60]" />
                    <h1 className="font-serif text-2xl font-bold text-[#FEFAEA]">Dasha Analysis</h1>
                </div>
                <p className="text-[#FEFAEA]/80 font-serif italic text-sm max-w-2xl relative z-10">
                    Vimshottari Dasha is the most widely used predictive system in Vedic Astrology. It maps your life's timeline across 120 years, governed by the nine celestial bodies.
                </p>
            </div>

            {/* Dasha Selection & Status Section */}
            <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="font-serif text-xs uppercase tracking-widest text-[#7A5A43]">{systemLabel}</h3>
                    <div className="w-full sm:w-64">
                        <ParchmentSelect
                            value={dashaSystem}
                            onChange={(e) => setDashaSystem(e.target.value)}
                            options={DASHA_SYSTEMS}
                        />
                    </div>
                </div>

                {/* Active Dasha Bar */}
                {!isLoading && !error && currentDasha.maha && (
                    <div className="bg-[#F6EBD6] border border-[#E7D6B8] rounded-lg px-6 py-4 flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLANET_COLORS[currentDasha.maha] || '#4A729A' }}></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="font-serif font-bold text-[#3E2A1F] text-lg">{currentDasha.maha} Mahadasha</span>
                            <div className="flex items-center gap-2 text-sm text-[#7A5A43] font-serif">
                                {currentDasha.antar && (
                                    <>
                                        <span>•</span>
                                        <span>{currentDasha.antar} Antardasha</span>
                                    </>
                                )}
                                {currentDasha.pratyantar && (
                                    <>
                                        <span>•</span>
                                        <span>{currentDasha.pratyantar} Pratyantar</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {currentMahaEnd && (
                            <span className="text-sm text-[#7A5A43] ml-auto font-serif hidden sm:inline-block">
                                (Until {currentMahaEnd})
                            </span>
                        )}
                    </div>
                )}

                {/* Timeline Visual - Only show for Vimshottari with data */}
                {!isLoading && !error && dashaSystem === 'vimshottari' && dashaData.length > 0 && (
                    <div className="relative mb-2">
                        <div className="flex w-full h-16 rounded-md overflow-hidden text-white font-bold text-xs uppercase tracking-wider text-center shadow-inner">
                            {dashaData.slice(0, 6).map((maha, idx) => {
                                const totalYears = 120;
                                const startYear = new Date(maha.start.replace(/,/g, '')).getFullYear();
                                const endYear = new Date(maha.end.replace(/,/g, '')).getFullYear();
                                const duration = endYear - startYear;
                                const widthPercent = (duration / totalYears) * 100;

                                return (
                                    <div
                                        key={maha.id}
                                        className={cn(
                                            "flex items-center justify-center relative group cursor-help transition-all",
                                            maha.isCurrent && "ring-2 ring-[#3E2A1F] ring-inset"
                                        )}
                                        style={{
                                            width: `${Math.max(widthPercent, 8)}%`,
                                            backgroundColor: PLANET_COLORS[maha.planet] || '#6B93B8'
                                        }}
                                        title={`${maha.planet}: ${maha.start} - ${maha.end}`}
                                    >
                                        {widthPercent > 10 ? maha.planet : maha.planet.charAt(0)}
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Dasha Hierarchy List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-lg font-bold text-[#3E2A1F]">Dasha Cycles</h2>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 text-[#9C7A2F] animate-spin" />
                        <p className="text-[#7A5A43] font-serif">Calculating Dasha periods...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="bg-[#FEFAEA] border border-red-200 rounded-lg p-8 flex flex-col items-center justify-center gap-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <p className="text-red-600 font-serif text-center">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-[#9C7A2F] underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Dasha Tree */}
                {!isLoading && !error && dashaData.length > 0 && (
                    <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg overflow-hidden divide-y divide-[#E7D6B8]">
                        {dashaData.map((node) => (
                            <DashaRow
                                key={node.id}
                                node={node}
                                expandedNodes={expandedNodes}
                                toggleNode={toggleNode}
                                depth={0}
                            />
                        ))}
                    </div>
                )}

                {/* No Data State */}
                {!isLoading && !error && dashaData.length === 0 && (
                    <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg p-8 text-center">
                        <p className="text-[#7A5A43] font-serif">No Dasha data available for this client.</p>
                    </div>
                )}
            </div>

        </div>
    );
}

// Recursive Row Component
function DashaRow({
    node,
    expandedNodes,
    toggleNode,
    depth
}: {
    node: DashaNode;
    expandedNodes: Set<string>;
    toggleNode: (id: string) => void;
    depth: number;
}) {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    // Indent based on depth
    const paddingLeft = depth * 20 + 16;

    return (
        <div className="flex flex-col">
            {/* The Row Itself */}
            <div
                className={cn(
                    "flex items-center py-4 pr-4 transition-colors relative cursor-pointer",
                    node.isCurrent ? "bg-[#F6EBD6]" : "hover:bg-[#FAF5E6]",
                    (isExpanded && hasChildren) ? "bg-[#FAF5E6]" : ""
                )}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={() => hasChildren && toggleNode(node.id)}
            >
                {/* Active Indicator Line on Left */}
                {node.isCurrent && (
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[4px]"
                        style={{ backgroundColor: PLANET_COLORS[node.planet] || '#9C7A2F' }}
                    />
                )}

                {/* Left: Icon or Spacer + Label */}
                <div className="flex items-center gap-3 flex-1">
                    {hasChildren ? (
                        <button
                            className="p-1 rounded-full hover:bg-[#DCC9A6]/30 text-[#9C7A2F] transition-transform duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNode(node.id);
                            }}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className="w-6 flex justify-center">
                            <Circle className="w-2 h-2 text-[#DCC9A6] fill-[#DCC9A6]" />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <span className={cn(
                            "font-serif font-bold text-[#3E2A1F]",
                            depth === 0 ? "text-lg" : "text-sm",
                            node.isCurrent ? "text-[#763A1F]" : ""
                        )}>
                            {node.planet} <span className="font-normal text-[#7A5A43] text-xs uppercase tracking-wider ml-1 opacity-70">{node.level}</span>
                        </span>
                    </div>
                </div>

                {/* Right: Date Range */}
                <div className="text-right text-sm font-serif text-[#7A5A43]">
                    <span className="block sm:inline">{node.start}</span>
                    <span className="hidden sm:inline mx-1">-</span>
                    <span className="block sm:inline">{node.end}</span>
                </div>
            </div>

            {/* Render Children Recursively */}
            {isExpanded && hasChildren && (
                <div className="border-t border-[#E7D6B8]/50">
                    {node.children!.map(child => (
                        <DashaRow
                            key={child.id}
                            node={child}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
