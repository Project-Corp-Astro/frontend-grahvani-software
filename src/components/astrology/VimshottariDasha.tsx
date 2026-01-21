"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Calendar, Star, Zap, Loader2 } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { clientApi } from '@/lib/api'; // Keep for now if we do manual expansion triggers, or remove if fully hookified
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { useDasha } from '@/hooks/queries/useCalculations';

interface DashaLevel {
    planet: string;
    start: string;
    end: string;
    sublevels?: DashaLevel[];
}

interface VimshottariDashaProps {
    compact?: boolean;
}

// Helper for date formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return dateStr; }
};

export default function VimshottariDasha({ compact = false }: VimshottariDashaProps) {
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [dashaData, setDashaData] = useState<DashaLevel[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [currentMaha, setCurrentMaha] = useState<string>('');

    // Initial Query
    const { data: initialData, isLoading: loading } = useDasha(
        clientDetails?.id || '',
        'deep',
        settings.ayanamsa.toLowerCase()
    );

    // Sync initial data
    useEffect(() => {
        if (initialData) {
            const rawList = initialData.dasha_list || initialData.data?.mahadashas || [];
            // Map backend data to UI format
            const mapped: DashaLevel[] = rawList.map((d: any) => ({
                planet: d.planet,
                start: d.start_date,
                end: d.end_date,
                sublevels: d.sublevels?.map((s: any) => ({
                    planet: s.planet,
                    start: s.start_date,
                    end: s.end_date,
                    sublevels: [] // Start empty for sub-levels unless provided
                }))
            }));

            setDashaData(mapped);

            // Find current active mahadasha
            const now = new Date();
            const current = mapped.find((d: DashaLevel) => new Date(d.start) <= now && new Date(d.end) >= now);
            if (current) {
                setCurrentMaha(current.planet);
                // Auto-expand current if not already set
                if (expanded.length === 0) {
                    setExpanded([current.planet]);
                }
            }
        }
    }, [initialData]);

    const fetchLevel = async (
        parent: DashaLevel,
        depth: number,
        path: string[]
    ) => {
        if (!clientDetails?.id || parent.sublevels?.length) return;

        const levels = ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'];
        const nextLevel = levels[depth + 1];
        if (!nextLevel) return;

        try {
            const context: any = {};
            if (path.length > 0) context.mahaLord = path[0];
            if (path.length > 1) context.antarLord = path[1];
            if (path.length > 2) context.pratyantarLord = path[2];
            if (path.length > 3) context.sookshmaLord = path[3];

            const result = await clientApi.generateDasha(
                clientDetails.id,
                nextLevel,
                settings.ayanamsa,
                false,
                context
            );

            const rawList = result.dasha_list || result.data?.mahadashas || [];
            if (!rawList.length) return;

            const newSublevels: DashaLevel[] = rawList.map((d: any) => ({
                planet: d.planet,
                start: d.start_date,
                end: d.end_date,
                sublevels: []
            }));

            const updateTree = (nodes: DashaLevel[], currentPath: string[]): DashaLevel[] => {
                return nodes.map(node => {
                    if (node.planet === currentPath[0]) {
                        if (currentPath.length === 1) {
                            return { ...node, sublevels: newSublevels };
                        } else {
                            return { ...node, sublevels: updateTree(node.sublevels || [], currentPath.slice(1)) };
                        }
                    }
                    return node;
                });
            };

            setDashaData(prev => updateTree(prev, path));

        } catch (error) {
            console.error(`Failed to fetch ${nextLevel}:`, error);
        }
    };

    const toggle = (id: string, level: DashaLevel, depth: number, path: string[]) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
        if (!expanded.includes(id)) {
            fetchLevel(level, depth, [...path]);
        }
    };

    const renderBreadcrumbs = () => {
        if (compact) return null;
        return (
            <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto">
                <button
                    onClick={() => setExpanded([])}
                    className={cn("hover:text-[#D08C60] transition-colors font-bold uppercase tracking-widest text-[10px]", expanded.length === 0 ? "text-[#D08C60]" : "text-[#3E2A1F]/60")}
                >
                    Mahadasha
                </button>
                {expanded.map((id, idx) => {
                    const label = id.split('-').pop();
                    return (
                        <React.Fragment key={id}>
                            <ChevronRight className="w-3 h-3 text-[#D08C60]/40" />
                            <span className="font-bold uppercase tracking-widest text-[10px] text-[#D08C60] whitespace-nowrap">
                                {label}
                            </span>
                        </React.Fragment>
                    )
                })}
            </div>
        );
    };

    if (loading && !dashaData.length) {
        return (
            <div className={cn(
                "bg-[#FFFFFF] border border-[#D08C60]/20 rounded-[2.5rem] p-8 backdrop-blur-3xl h-full flex items-center justify-center shadow-xl",
                compact && "p-6 rounded-[2rem] shadow-2xl"
            )}>
                <Loader2 className="w-8 h-8 text-[#D08C60] animate-spin" />
            </div>
        );
    }

    return (
        <div className={cn(
            "bg-[#FFFFFF] border border-[#D08C60]/20 rounded-[2.5rem] p-8 backdrop-blur-3xl h-full overflow-hidden flex flex-col shadow-xl",
            compact && "p-6 rounded-[2rem] bg-[#FFFFFF] shadow-2xl"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    {!compact ? (
                        <>
                            <h3 className="text-[10px] font-black text-[#D08C60] uppercase tracking-[0.3em] mb-1">Vimshottari System</h3>
                            <h2 className="text-2xl font-serif text-[#3E2A1F] font-black tracking-tight italic">Temporal Matrix</h2>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-lg font-serif text-[#3E2A1F] font-black tracking-tight">{currentMaha} Mahadasha</h2>
                            <p className="text-[9px] text-[#A8653A] uppercase tracking-[0.3em] font-black mt-1">Time Lord Sequence</p>
                        </div>
                    )}
                </div>
                {
                    !compact && currentMaha && (
                        <div className="bg-[#FFD27D]/10 px-4 py-1.5 rounded-full border border-[#FFD27D]/30 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD27D] animate-pulse" />
                            <span className="text-[9px] font-black text-[#FFD27D] uppercase tracking-widest">Active: {currentMaha}</span>
                        </div>
                    )
                }
            </div >

            {renderBreadcrumbs()}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3">
                {dashaData
                    .filter(d => !compact || d.planet === currentMaha)
                    .map((d) => (
                        <DashaItem
                            key={d.planet}
                            level={d}
                            depth={0}
                            expanded={expanded}
                            onToggle={toggle}
                            compact={compact}
                            path={[d.planet]}
                        />
                    ))}
            </div>
        </div >
    );
}

function DashaItem({ level, depth, expanded, onToggle, compact = false, path }: {
    level: DashaLevel,
    depth: number,
    expanded: string[],
    onToggle: (id: string, level: DashaLevel, depth: number, path: string[]) => void,
    compact?: boolean,
    path: string[]
}) {
    const uniqueId = path.join('-');
    const isExpanded = expanded.includes(uniqueId);
    const canExpand = (level.sublevels && level.sublevels.length > 0) || depth < 4;
    const now = new Date();
    const isActive = new Date(level.start) <= now && new Date(level.end) >= now;

    return (
        <div className="space-y-2">
            <div
                onClick={() => !compact && canExpand && onToggle(uniqueId, level, depth, path)}
                className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border group",
                    depth === 0 ? "bg-[#FFF9F0] border-[#D08C60]/10 hover:bg-[#FEFAEA] shadow-sm" : "bg-transparent border-transparent hover:bg-[#FFF9F0]/50",
                    isExpanded && depth === 0 && !compact && "bg-[#FEFAEA] border-[#D08C60]/30",
                    isActive && depth > 0 && "bg-[#FFD27D]/20 border-[#FFD27D]/40",
                    compact && "p-3 cursor-default"
                )}
            >
                <div className="flex items-center gap-4">
                    {!compact && canExpand && (
                        <ChevronRight className={cn("w-4 h-4 text-[#D08C60] transition-transform duration-300", isExpanded && "rotate-90")} />
                    )}
                    {!compact && !canExpand && <div className="w-4" />}

                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        depth === 0 ? "bg-[#D08C60]/10 text-[#D08C60]" : "bg-[#D08C60]/5 text-[#D08C60]/40",
                        compact && "w-8 h-8 rounded-lg",
                        isActive && "bg-[#FFD27D] text-[#3E2A1F] shadow-lg"
                    )}>
                        <Star className={cn("w-5 h-5", compact && "w-4 h-4")} />
                    </div>

                    <div>
                        <h4 className={cn("font-serif font-black tracking-tight flex items-center gap-2",
                            depth === 0 ? "text-lg text-[#3E2A1F]" : "text-md text-[#5A3E2B]",
                            compact && (depth === 0 ? "text-md" : "text-sm")
                        )}>
                            {level.planet}
                            {isActive && <span className="text-[8px] bg-[#3E2A1F] text-[#FFD27D] px-1.5 py-0.5 rounded uppercase tracking-wider">Current</span>}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3 text-[#D08C60]/60" />
                            <span className="text-[9px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">{formatDate(level.start)} — {formatDate(level.end)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={cn(
                    "ml-10 border-l border-[#D08C60]/20 pl-4 space-y-2 animate-in slide-in-from-left-2 duration-300",
                    compact && "ml-4 pl-3"
                )}>
                    {level.sublevels && level.sublevels.length > 0 ? (
                        level.sublevels.map((s) => (
                            <DashaItem
                                key={s.planet}
                                level={s}
                                depth={depth + 1}
                                expanded={expanded}
                                onToggle={onToggle}
                                compact={compact}
                                path={[...path, s.planet]}
                            />
                        ))
                    ) : (
                        <div className="flex items-center gap-2 p-2">
                            <Loader2 className="w-4 h-4 text-[#D08C60] animate-spin" />
                            <span className="text-xs text-[#D08C60]">Loading sub-periods...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
