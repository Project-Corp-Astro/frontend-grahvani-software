"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Sparkles, Clock, Info, Maximize2, X, ArrowDown, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import NorthIndianChart, { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import { ChartWithPopup } from "@/components/astrology/NorthIndianChart";
import { Modal } from '@/components/ui/Modal';
import { YogaModal } from '@/components/astrology/yoga-modal';
import { YogaItem } from '@/app/vedic-astrology/yoga-dosha/page';

interface Yoga {
    id: string;
    name: string;
    benefit: string;
    description: string;
    type: string;
}

interface DashaProgress {
    planet: string;
    subPlanet: string;
    percentage: number;
}

interface ActiveYogasLayoutProps {
    clientId: string;
    planets: Planet[];
    ascendantSign: number;
    activeYogas: Yoga[];
    allYogas: YogaItem[];
    currentDasha: DashaProgress;
    ayanamsa?: string;
    className?: string;
}

export default function ActiveYogasLayout({
    clientId,
    planets,
    ascendantSign,
    activeYogas,
    allYogas,
    currentDasha,
    ayanamsa = 'lahiri',
    className
}: ActiveYogasLayoutProps) {
    const [selectedYoga, setSelectedYoga] = useState<Yoga | null>(() => {
        const defaultYoga = allYogas.find(y => y.id === 'gaja_kesari');
        if (defaultYoga) {
            return {
                id: defaultYoga.id,
                name: defaultYoga.name,
                benefit: defaultYoga.category.toUpperCase(),
                description: defaultYoga.description,
                type: defaultYoga.id
            };
        }
        return null;
    });
    const [zoomedChart, setZoomedChart] = useState<{ varga: string, label: string } | null>(null);

    return (
        <div className={cn("flex flex-col lg:flex-row gap-4 p-4 bg-parchment min-h-screen font-sans", className)}>
            {/* LEFT: Birth Chart - Fixed Width */}
            <div className="flex flex-col gap-2 h-[480px] w-full lg:w-[440px] shrink-0">
                <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-[#FFFCF6] max-w-[440px]">
                    <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique flex justify-between items-center shrink-0">
                        <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Birth Chart (D1)</h3>
                        <button
                            onClick={() => setZoomedChart({ varga: "D1", label: "Birth Chart (D1)" })}
                            className="text-primary hover:text-accent-gold transition-colors"
                        >
                            <Maximize2 className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-start p-0 pb-0 bg-transparent">
                        <ChartWithPopup
                            planets={planets}
                            ascendantSign={ascendantSign}
                            className="bg-transparent border-none aspect-square h-full w-auto"
                            preserveAspectRatio="none"
                            showDegrees={true}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT: Yogas & Details - Flexible Width */}
            <div className="flex-1 flex flex-col gap-2 h-[480px] min-w-0">
                <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-[#FFFCF6]">
                    <div className="bg-[#EAD8B1] px-4 py-2 border-b border-antique flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
                        <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide whitespace-nowrap">Yogas & Combinations</h3>

                        {/* Integrated Header Dropdown */}
                        <div className="relative group w-full sm:w-48 shrink-0">
                            <select
                                value={selectedYoga?.id || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) return;
                                    const item = allYogas.find(y => y.id === val);
                                    if (item) {
                                        setSelectedYoga({
                                            id: item.id,
                                            name: item.name,
                                            benefit: item.category.toUpperCase(),
                                            description: item.description,
                                            type: item.id
                                        });
                                    }
                                }}
                                className="w-full pl-3 pr-8 py-1.5 bg-white/80 border border-gold-primary/30 rounded-xl text-[10px] font-bold text-primary appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-primary/30 transition-all shadow-sm group-hover:bg-white"
                            >
                                <optgroup label="Benefic" className="font-serif italic text-primary">
                                    {allYogas.filter(y => y.category === 'benefic').map(y => (
                                        <option key={y.id} value={y.id} className="font-sans not-italic font-medium text-primary">
                                            {y.name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Challenging" className="font-serif italic text-primary">
                                    {allYogas.filter(y => y.category === 'challenging').map(y => (
                                        <option key={y.id} value={y.id} className="font-sans not-italic font-medium text-primary">
                                            {y.name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none transition-transform group-hover:scale-110">
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-3 flex flex-col gap-4 overflow-hidden">
                        {/* RELOCATED: Yoga Detail Section (Right Side Panel) */}
                        {selectedYoga && (
                            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden flex flex-col">
                                <div className="bg-white border border-gold-primary/30 rounded-[1.5rem] overflow-hidden shadow-lg relative flex flex-col h-full mt-0">
                                    {/* Detail Content */}
                                    <div className="flex-1 p-0 bg-parchment/10 overflow-y-auto custom-scrollbar">
                                        <YogaModal
                                            clientId={clientId}
                                            yogaType={selectedYoga.type}
                                            ayanamsa={ayanamsa}
                                            className="bg-transparent border-none p-2 shadow-none"
                                        />
                                    </div>

                                    {/* Detail Footer - Simplified */}
                                    <div className="bg-parchment/30 px-5 py-3 border-t border-antique/30 flex justify-center shrink-0">
                                        <button
                                            onClick={() => setSelectedYoga(null)}
                                            className="text-primary hover:text-accent-gold transition-colors text-[9px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5"
                                        >
                                            Clear Selection
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Zoom */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-softwhite border border-antique rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button
                            onClick={() => setZoomedChart(null)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-parchment text-primary hover:bg-gold-primary/20 hover:text-accent-gold transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className="font-serif text-xl font-semibold text-primary leading-tight">{zoomedChart.label}</h2>
                            <p className="font-sans text-xs text-primary uppercase tracking-wider leading-compact mt-2">{zoomedChart.varga} Divisional Chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto rounded-2xl p-6 border border-antique">
                            <ChartWithPopup
                                ascendantSign={ascendantSign}
                                planets={planets}
                                className="bg-transparent border-none"
                                showDegrees={zoomedChart?.varga === 'D1'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
