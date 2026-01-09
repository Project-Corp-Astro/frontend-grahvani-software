"use client";

import React, { useState } from 'react';
import { Clock, Calendar, ChevronRight, ChevronDown, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";
import ParchmentSelect from "@/components/ui/ParchmentSelect";

// --- Types & Mock Data ---

interface DashaNode {
    id: string;
    planet: string;
    start: string;
    end: string;
    level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha' | 'Sookshma' | 'Prana';
    children?: DashaNode[];
    isCurrent?: boolean; // Highlight active period
}

const MOCK_DASHA_DATA: DashaNode[] = [
    {
        id: "saturn-maha",
        planet: "Saturn",
        start: "Jan 15, 2010",
        end: "Jan 15, 2029",
        level: "Mahadasha",
        isCurrent: true,
        children: [
            {
                id: "sat-sat-antar",
                planet: "Saturn",
                start: "Jan 15, 2010",
                end: "Jan 18, 2013",
                level: "Antardasha",
                children: [
                    { id: "sat-sat-sat-prat", planet: "Saturn", start: "Jan 15, 2010", end: "Jun 24, 2010", level: "Pratyantardasha" },
                    { id: "sat-sat-mer-prat", planet: "Mercury", start: "Jun 24, 2010", end: "Nov 27, 2010", level: "Pratyantardasha" }
                ]
            },
            {
                id: "sat-mer-antar",
                planet: "Mercury",
                start: "Jan 18, 2013",
                end: "Sept 27, 2015",
                level: "Antardasha",
            },
            {
                id: "sat-ket-antar",
                planet: "Ketu",
                start: "Sept 27, 2015",
                end: "Nov 06, 2016",
                level: "Antardasha",
            },
            {
                id: "sat-ven-antar",
                planet: "Venus",
                start: "Nov 06, 2016",
                end: "Jan 06, 2020",
                level: "Antardasha",
            },
            {
                id: "sat-sun-antar",
                planet: "Sun",
                start: "Jan 06, 2020",
                end: "Dec 18, 2020",
                level: "Antardasha",
            },
            {
                id: "sat-moon-antar",
                planet: "Moon",
                start: "Dec 18, 2020",
                end: "Jul 19, 2022",
                level: "Antardasha",
            },
            {
                id: "sat-mars-antar",
                planet: "Mars",
                start: "Jul 19, 2022",
                end: "Aug 28, 2023",
                level: "Antardasha",
            },
            {
                id: "sat-rah-antar",
                planet: "Rahu",
                start: "Aug 28, 2023",
                end: "Jul 04, 2026",
                level: "Antardasha",
                isCurrent: true, // Currently expanding this one
                children: [
                    { id: "sat-rah-rah-prat", planet: "Rahu", start: "Aug 28, 2023", end: "Jan 31, 2024", level: "Pratyantardasha" },
                    { id: "sat-rah-jup-prat", planet: "Jupiter", start: "Jan 31, 2024", end: "Jun 19, 2024", level: "Pratyantardasha" },
                    { id: "sat-rah-sat-prat", planet: "Saturn", start: "Jun 19, 2024", end: "Dec 01, 2024", level: "Pratyantardasha" },
                    { id: "sat-rah-mer-prat", planet: "Mercury", start: "Dec 01, 2024", end: "Apr 28, 2025", level: "Pratyantardasha", isCurrent: true },
                ]
            },
            {
                id: "sat-jup-antar",
                planet: "Jupiter",
                start: "Jul 04, 2026",
                end: "Jan 15, 2029",
                level: "Antardasha",
            }
        ]
    },
    {
        id: "mercury-maha",
        planet: "Mercury",
        start: "Jan 15, 2029",
        end: "Jan 15, 2046",
        level: "Mahadasha",
        children: [
            { id: "mer-mer-antar", planet: "Mercury", start: "Jan 15, 2029", end: "Jun 12, 2031", level: "Antardasha" },
        ]
    },
    {
        id: "ketu-maha",
        planet: "Ketu",
        start: "Jan 15, 2046",
        end: "Jan 15, 2053",
        level: "Mahadasha",
    },
    {
        id: "venus-maha",
        planet: "Venus",
        start: "Jan 15, 2053",
        end: "Jan 15, 2073",
        level: "Mahadasha",
    }
];

export default function DashaPage() {
    const [dashaSystem, setDashaSystem] = useState("Vimshottari Dasha");

    // State to track expanded nodes (by ID)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["saturn-maha", "sat-rah-antar"]));

    const toggleNode = (id: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNodes(newExpanded);
    };

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

            {/* Vimshottari Timeline Section */}
            <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="font-serif text-xs uppercase tracking-widest text-[#7A5A43]">{dashaSystem}</h3>
                    <div className="w-full sm:w-64">
                        <ParchmentSelect
                            value={dashaSystem}
                            onChange={(e) => setDashaSystem(e.target.value)}
                            options={[
                                { value: "Vimshottari Dasha", label: "Vimshottari Dasha" },
                                { value: "Yogini Dasha", label: "Yogini Dasha" },
                                { value: "Chara Dasha", label: "Chara Dasha" },
                                { value: "Ashtottari Dasha", label: "Ashtottari Dasha" },
                            ]}
                        />
                    </div>
                </div>

                {/* Active Dasha Bar */}
                <div className="bg-[#F6EBD6] border border-[#E7D6B8] rounded-lg px-6 py-4 flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 rounded-full bg-[#4A729A]"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-serif font-bold text-[#3E2A1F] text-lg">Saturn Mahadasha</span>
                        <div className="flex items-center gap-2 text-sm text-[#7A5A43] font-serif">
                            <span>•</span>
                            <span>Rahu Antardasha</span>
                            <span>•</span>
                            <span>Mercury Pratyantar</span>
                        </div>
                    </div>
                    <span className="text-sm text-[#7A5A43] ml-auto font-serif hidden sm:inline-block">(Until 1/15/2029)</span>
                </div>

                {/* Timeline Visual (Simplified for mock) */}
                <div className="relative mb-2">
                    <div className="flex w-full h-16 rounded-md overflow-hidden text-white font-bold text-xs uppercase tracking-wider text-center shadow-inner">
                        {/* Saturn */}
                        <div className="w-[30%] bg-[#6B93B8] flex items-center justify-center relative group cursor-help">
                            Saturn
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Mercury */}
                        <div className="w-[35%] bg-[#6BB86E] flex items-center justify-center relative group cursor-help">
                            Mercury
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Ketu */}
                        <div className="w-[10%] bg-[#A0A0A0] flex items-center justify-center relative group cursor-help">
                            Ketu
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Venus */}
                        <div className="w-[25%] bg-[#F48FB1] flex items-center justify-center relative group cursor-help">
                            Venus
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    {/* Active Marker Indicator */}
                    <div className="absolute top-0 bottom-0 left-[30%] w-[2px] bg-[#3E2A1F] z-10 hidden sm:flex flex-col items-center">
                        <div className="w-3 h-3 -mt-1.5 bg-[#3E2A1F] rounded-full shadow-md border-2 border-[#FEFAEA]"></div>
                        <div className="mt-auto mb-[-25px] bg-[#3E2A1F] text-[#FEFAEA] text-[10px] px-2 py-1 rounded font-bold">Now</div>
                    </div>
                </div>

                {/* Timeline Dates */}
                <div className="flex justify-between text-xs text-[#7A5A43] font-serif font-medium px-1">
                    <span>2010</span>
                    <span className="ml-[10%]">2029</span>
                    <span>2073</span>
                </div>
            </div>

            {/* Dasha Hierarchy List (Replacing Grid) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#9C7A2F]" />
                    <h2 className="font-serif text-lg font-bold text-[#3E2A1F]">Dasha Cycles</h2>
                </div>

                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-lg overflow-hidden divide-y divide-[#E7D6B8]">
                    {MOCK_DASHA_DATA.map((node) => (
                        <DashaRow
                            key={node.id}
                            node={node}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            depth={0}
                        />
                    ))}
                </div>
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

    // Indent based on depth (but keep mobile usable)
    const paddingLeft = depth * 20 + 16; // 16px base + 20px per level

    return (
        <div className="flex flex-col">
            {/* The Row Itself */}
            <div
                className={cn(
                    "flex items-center py-4 pr-4 transition-colors relative",
                    node.isCurrent ? "bg-[#F6EBD6]" : "hover:bg-[#FAF5E6]",
                    (isExpanded && hasChildren) ? "bg-[#FAF5E6]" : ""
                )}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={() => hasChildren && toggleNode(node.id)}
            >
                {/* Active Indicator Line on Left */}
                {node.isCurrent && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#9C7A2F]" />
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
                        // Spacer for alignment if no children, but only if not at root? 
                        // Actually circle dot looks nice for leaf nodes
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
                        {/* Mobile Date View */}
                        {/* <span className="text-[10px] text-[#7A5A43] sm:hidden">{node.start} - {node.end}</span> */}
                    </div>
                </div>

                {/* Right: Date Range (Desktop) */}
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
