"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Calendar, Star, Zap } from 'lucide-react';

interface DashaLevel {
    planet: string;
    start: string;
    end: string;
    sublevels?: DashaLevel[];
}

const MOCK_DASHAS: DashaLevel[] = [
    {
        planet: "Venus",
        start: "2010-10-12",
        end: "2030-10-12",
        sublevels: [
            { planet: "Sun", start: "2023-01-01", end: "2024-01-01" },
            {
                planet: "Moon",
                start: "2024-01-02",
                end: "2025-06-15",
                sublevels: [
                    { planet: "Mars", start: "2024-05-01", end: "2024-06-01" },
                    { planet: "Rahu", start: "2024-06-02", end: "2024-08-15" }
                ]
            },
            { planet: "Mars", start: "2025-06-16", end: "2026-08-12" }
        ]
    },
    {
        planet: "Sun",
        start: "2030-10-13",
        end: "2036-10-13"
    }
];

interface VimshottariDashaProps {
    compact?: boolean;
}

export default function VimshottariDasha({ compact = false }: VimshottariDashaProps) {
    const [expanded, setExpanded] = useState<string[]>(['Venus', 'Moon']);

    const toggle = (id: string) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    return (
        <div className={cn(
            "bg-[#FFFFFF] border border-[#D08C60]/20 rounded-[2.5rem] p-8 backdrop-blur-3xl h-full overflow-hidden flex flex-col shadow-xl",
            compact && "p-6 rounded-[2rem] bg-[#FFFFFF] shadow-2xl"
        )}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    {!compact ? (
                        <>
                            <h3 className="text-[10px] font-black text-[#D08C60] uppercase tracking-[0.3em] mb-1">Vimshottari System</h3>
                            <h2 className="text-2xl font-serif text-[#3E2A1F] font-black tracking-tight italic">Temporal Matrix</h2>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-lg font-serif text-[#3E2A1F] font-black tracking-tight">Time Lord Sequence</h2>
                            <p className="text-[9px] text-[#A8653A] uppercase tracking-[0.3em] font-black mt-1">Current Active Cycle</p>
                        </div>
                    )}
                </div>
                {
                    !compact && (
                        <div className="bg-[#FFD27D]/10 px-4 py-1.5 rounded-full border border-[#FFD27D]/30 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD27D] animate-pulse" />
                            <span className="text-[9px] font-black text-[#FFD27D] uppercase tracking-widest">Active Maha</span>
                        </div>
                    )
                }
            </div >

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3">
                {MOCK_DASHAS
                    .filter(d => !compact || d.planet === 'Venus') // Maha
                    .map((d) => (
                        <DashaItem
                            key={d.planet}
                            level={d}
                            depth={0}
                            expanded={compact ? ['Venus', 'Moon'] : expanded}
                            onToggle={toggle}
                            compact={compact}
                        />
                    ))}
            </div>
        </div >
    );
}

function DashaItem({ level, depth, expanded, onToggle, compact = false }: {
    level: DashaLevel,
    depth: number,
    expanded: string[],
    onToggle: (id: string) => void,
    compact?: boolean
}) {
    const isExpanded = expanded.includes(level.planet);
    const hasChildren = level.sublevels && level.sublevels.length > 0;

    return (
        <div className="space-y-2">
            <div
                onClick={() => !compact && hasChildren && onToggle(level.planet)}
                className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border group",
                    depth === 0 ? "bg-[#FFF9F0] border-[#D08C60]/10 hover:bg-[#FEFAEA] shadow-sm" : "bg-transparent border-transparent hover:bg-[#FFF9F0]/50",
                    isExpanded && depth === 0 && !compact && "bg-[#FEFAEA] border-[#D08C60]/30",
                    compact && "p-3 cursor-default"
                )}
            >
                <div className="flex items-center gap-4">
                    {!compact && hasChildren && (
                        <ChevronRight className={cn("w-4 h-4 text-[#D08C60] transition-transform duration-300", isExpanded && "rotate-90")} />
                    )}
                    {!compact && !hasChildren && <div className="w-4" />}

                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        depth === 0 ? "bg-[#D08C60]/10 text-[#D08C60]" : "bg-[#D08C60]/5 text-[#D08C60]/40",
                        compact && "w-8 h-8 rounded-lg"
                    )}>
                        <Star className={cn("w-5 h-5", compact && "w-4 h-4")} />
                    </div>

                    <div>
                        <h4 className={cn("font-serif font-black tracking-tight",
                            depth === 0 ? "text-lg text-[#3E2A1F]" : "text-md text-[#5A3E2B]",
                            compact && (depth === 0 ? "text-md" : "text-sm")
                        )}>{level.planet}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3 text-[#D08C60]/60" />
                            <span className="text-[9px] font-black text-[#8B5A2B]/40 uppercase tracking-widest">{level.start} — {level.end}</span>
                        </div>
                    </div>
                </div>

                {depth === 0 && isExpanded && (
                    <div className="px-3 py-1 bg-[#FFD27D] text-[#3E2A1F] rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">
                        Running
                    </div>
                )}
            </div>

            {isExpanded && hasChildren && (
                <div className={cn(
                    "ml-10 border-l border-[#D08C60]/20 pl-4 space-y-2 animate-in slide-in-from-left-2 duration-300",
                    compact && "ml-4 pl-3"
                )}>
                    {level.sublevels!.map((s) => (
                        <DashaItem key={s.planet} level={s} depth={depth + 1} expanded={expanded} onToggle={onToggle} compact={compact} />
                    ))}
                </div>
            )}
        </div>
    );
}
