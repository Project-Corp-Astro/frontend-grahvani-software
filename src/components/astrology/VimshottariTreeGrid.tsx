"use client";

import React, { useMemo, useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, ChevronDown, Loader2, Home } from 'lucide-react';
import { DashaNode, isDateRangeCurrent, calculateDuration, generateVimshottariSubperiods, parseApiDate } from '@/lib/dasha-utils';

interface VimshottariTreeGridProps {
    data: DashaNode[];
    isLoading?: boolean;
    className?: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿', 'Jupiter': '♃',
    'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

const LEVEL_LABELS = ["MAHA", "ANTAR", "PRATYANTAR", "SOOKSHMA", "PRANA"];

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
        const d = parseApiDate(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateStr || '—';
    }
};

export default function VimshottariTreeGrid({ data, isLoading, className }: VimshottariTreeGridProps) {
    // State to track the navigation path (array of selected nodes)
    const [navPath, setNavPath] = useState<DashaNode[]>([]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-gold-primary animate-spin mb-1" />
                <p className="font-sans text-xs text-muted-refined italic leading-compact">Processing dasha...</p>
            </div>
        );
    }

    // Determine what to display based on navigation path
    const currentNodes = navPath.length === 0 ? data : navPath[navPath.length - 1].sublevel || [];
    const currentLevelName = LEVEL_LABELS[navPath.length] || "DASA";

    const handleDrillDown = (node: DashaNode) => {
        let nodeToDrill = node;

        // If no sublevels exist, try to generate them on the fly (for non-active periods)
        if (!node.sublevel || node.sublevel.length === 0) {
            const generated = generateVimshottariSubperiods(node);
            if (generated.length > 0) {
                nodeToDrill = { ...node, sublevel: generated };
            }
        }

        if (nodeToDrill.sublevel && nodeToDrill.sublevel.length > 0) {
            setNavPath([...navPath, nodeToDrill]);
        }
    };

    const handleBack = () => {
        setNavPath(navPath.slice(0, -1));
    };

    const handleReset = () => {
        setNavPath([]);
    };

    return (
        <div className={cn("w-full h-full flex flex-col overflow-hidden rounded-lg border border-antique/20 bg-white shadow-sm", className)}>
            {/* Navigation Header / Breadcrumbs */}
            <div className="bg-parchment/30 border-b border-antique/10 p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                    onClick={handleReset}
                    className={cn(
                        "p-1 rounded transition-colors",
                        navPath.length === 0 ? "text-disabled cursor-default" : "text-accent-gold hover:bg-gold-primary/10"
                    )}
                >
                    <Home className="w-3 h-3" />
                </button>

                {navPath.map((node, i) => (
                    <React.Fragment key={i}>
                        <ChevronRight className="w-2.5 h-2.5 text-muted-refined/30 flex-shrink-0" />
                        <button
                            onClick={() => setNavPath(navPath.slice(0, i + 1))}
                            className="px-1.5 py-0.5 rounded font-sans text-xs font-medium text-accent-gold hover:bg-gold-primary/10 whitespace-nowrap transition-colors leading-compact"
                        >
                            {node.planet}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-hidden">
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-parchment/95 backdrop-blur-sm shadow-sm">
                        <tr className="font-sans text-sm font-semibold text-secondary tracking-wider border-b border-antique/10 leading-normal">
                            <th className="px-1.5 py-1 text-left w-[45%]">{currentLevelName}</th>
                            <th className="px-1.5 py-1 text-left w-[20%]">Start</th>
                            <th className="px-1.5 py-1 text-left w-[20%]">End</th>
                            <th className="px-1.5 py-1 text-left w-[15%]">Dur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/5">
                        {currentNodes.length > 0 ? (
                            currentNodes.map((node, idx) => (
                                <DashaDrillRow
                                    key={node.planet + idx}
                                    node={node}
                                    depth={navPath.length}
                                    onDrill={() => handleDrillDown(node)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-4 text-center font-sans text-xs text-muted-refined italic leading-compact">No sub-periods found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {navPath.length > 0 && (
                <button
                    onClick={handleBack}
                    className="p-2 border-t border-antique/10 bg-parchment/20 flex items-center justify-center gap-1.5 font-sans text-xs font-medium text-accent-gold hover:bg-gold-primary/10 transition-colors leading-compact"
                >
                    <ChevronLeft className="w-3 h-3" /> Back to {LEVEL_LABELS[navPath.length - 1] || "Previous"}
                </button>
            )}
        </div>
    );
}

function DashaDrillRow({ node, depth, onDrill }: { node: DashaNode; depth: number; onDrill: () => void }) {
    const isActive = node.isCurrent;
    const hasData = node.sublevel && node.sublevel.length > 0;
    // Allow drilling if we have data OR if we are not yet at the deepest level (Prana = depth 4)
    // This allows generating sub-periods on the fly for non-active branches
    const isDrillable = hasData || depth < 4;

    // Calculate progress for active rows
    const progress = useMemo(() => {
        if (!isActive || !node.startDate || !node.endDate) return 0;
        const start = new Date(node.startDate).getTime();
        const end = new Date(node.endDate).getTime();
        const now = new Date().getTime();
        if (end <= start) return 0;
        return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
    }, [isActive, node.startDate, node.endDate]);

    const durationDisplay = useMemo(() => {
        return calculateDuration(node.startDate, node.endDate);
    }, [node.startDate, node.endDate]);

    return (
        <tr
            onClick={isDrillable ? onDrill : undefined}
            className={cn(
                "transition-colors group border-b border-antique/5",
                isActive ? "bg-gold-primary/10 font-bold" : "hover:bg-gold-primary/5 text-ink",
                isDrillable ? "cursor-pointer" : "cursor-default",
                depth > 0 ? "text-[10px]" : "text-[11px]"
            )}
        >
            <td className="px-1.5 py-1 align-middle">
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                        {isDrillable ? (
                            <ChevronRight className="w-2.5 h-2.5 text-accent-gold/40 group-hover:text-accent-gold transition-colors flex-shrink-0" />
                        ) : (
                            // Spacer for alignment if no chevron
                            <span className="w-2.5 inline-block" />
                        )}
                        <span className="font-sans text-base font-medium text-primary leading-normal">
                            {node.planet}
                        </span>
                        {isActive && (
                            <span className="ml-1 px-1 py-0.5 font-sans text-2xs font-semibold text-green-800 bg-green-100 border border-green-300 rounded leading-none">
                                A
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-1.5 py-1 font-sans text-xs text-muted-refined whitespace-nowrap overflow-hidden leading-compact tracking-tight">
                {formatDate(node.startDate)}
            </td>
            <td className="px-1.5 py-1 font-sans text-xs text-muted-refined whitespace-nowrap overflow-hidden leading-compact tracking-tight">
                {formatDate(node.endDate)}
            </td>
            <td className="px-1.5 py-1 font-sans text-base font-regular text-primary whitespace-nowrap overflow-hidden leading-normal">
                {durationDisplay}
            </td>
        </tr>
    );
}