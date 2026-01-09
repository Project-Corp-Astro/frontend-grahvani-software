"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Clock,
    MapPin,
    FileText,
    TrendingUp,
    Sparkles,
    Zap,
    History,
    Edit3,
    ArrowRight,
    Star,
    Compass,
    Activity,
    Orbit,
    Maximize2
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';

export default function VedicOverviewPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();
    const [zoomedChart, setZoomedChart] = React.useState<{ varga: string, label: string } | null>(null);

    if (!clientDetails) return null;

    // Simplified helpers for Overview
    const indexToSignId = (varga: string) => {
        if (varga === "D9") return 5; // Leo
        return 8; // Scorpio (D1 ascendant matching user image)
    };

    const MOCK_PLANETS = [
        { name: 'Su', signId: 8, degree: '22°' },
        { name: 'Mo', signId: 8, degree: '05°' },
        { name: 'Ma', signId: 8, degree: '12°' },
        { name: 'Me', signId: 9, degree: '08°' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">

            {/* 1. MASTER WORKSPACE HEADER (REFINED) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#3E2A1F]/5 border border-[#D08C60]/30 p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
                {/* Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D08C60]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD27D]/20 transition-colors" />

                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#D08C60] to-[#8B5A2B] border border-[#FFD27D]/40 flex items-center justify-center text-white shadow-2xl relative">
                        <span className="text-4xl font-serif font-black">{clientDetails.name.charAt(0)}</span>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#FFD27D] flex items-center justify-center text-[#3E2A1F] shadow-lg border-4 border-[#FEFAEA]">
                            <Orbit className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">{clientDetails.name}</h1>
                            <div className="flex items-center gap-2 bg-[#D08C60]/10 px-3 py-1 rounded-full border border-[#D08C60]/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D08C60] animate-pulse" />
                                <span className="text-[10px] font-black text-[#D08C60] uppercase tracking-widest">Session Active</span>
                            </div>
                        </div>
                        <p className="text-[#5A3E2B] text-base font-serif italic mt-2 opacity-80 max-w-xl">
                            Synthesis of the soul's current manifestation within the {settings.ayanamsa} calculation framework.
                        </p>
                    </div>
                </div>

                <Link href="/vedic-astrology" className="relative z-10 px-10 py-5 bg-[#FFD27D] text-[#3E2A1F] rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_rgba(255,210,125,0.3)] hover:scale-105 hover:bg-white transition-all flex items-center gap-3 active:scale-95 group/btn">
                    <Zap className="w-5 h-5 group-hover/btn:animate-pulse" />
                    Enter Analytical Workbench
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* 2. THE COSMIC ARCHIVE (LEFT COLUMN) */}
                <div className="lg:col-span-4 space-y-10">

                    {/* A. DIVINE BIRTH MARKERS */}
                    <div className="bg-[#3E2A1F]/5 border border-[#D08C60]/20 rounded-[3rem] p-10 backdrop-blur-sm">
                        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8B5A2B] mb-10 pb-4 border-b border-[#D08C60]/20">
                            Birth Coordinates
                        </h2>
                        <div className="space-y-8">
                            <BirthDatum icon={Calendar} label="Date of Descent" value={clientDetails.dateOfBirth} />
                            <BirthDatum icon={Clock} label="Temporal Marker" value={clientDetails.timeOfBirth} />
                            <BirthDatum icon={MapPin} label="Sacred Space" value={clientDetails.placeOfBirth.city} />
                        </div>
                    </div>

                    {/* B. CORE NAKSHATRAS & METRICS */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <SignatureCard label="Lagna (ASC)" value="Scorpio" sub="Jyeshtha" />
                            <SignatureCard label="Chandra (Moon)" value={clientDetails.rashi || "Scorpio"} sub="Anuradha" highlight />
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-[#3E2A1F]/5 border border-[#D08C60]/10 flex items-center justify-between group hover:border-[#D08C60]/30 transition-all">
                            <div>
                                <p className="text-[9px] font-black text-[#8B5A2B] uppercase tracking-widest mb-1">Nakshatra Context</p>
                                <p className="text-xl font-serif text-[#3E2A1F] font-black">Anuradha • <span className="text-[#D08C60]">Pada 3</span></p>
                                <p className="text-[10px] text-[#5A3E2B]/60 uppercase tracking-widest mt-1 font-black">Lord: Saturn (Shani)</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D08C60]/10 flex items-center justify-center text-[#D08C60]">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* C. PLANETARY STRENGTHS */}
                    <div className="bg-gradient-to-br from-[#3E2A1F]/5 to-transparent border border-[#3E2A1F]/5 rounded-[3rem] p-10">
                        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8B5A2B] mb-8 pb-4 border-b border-[#3E2A1F]/10">
                            Elementary Balance
                        </h2>
                        <div className="space-y-6">
                            <ElementProgress label="Fire (Agni)" value={75} color="bg-[#FF6B6B]" />
                            <ElementProgress label="Water (Jala)" value={90} color="bg-[#4DABF7]" />
                            <ElementProgress label="Earth (Prithvi)" value={45} color="#D08C60" />
                        </div>
                    </div>
                </div>

                {/* 3. ANALYTICAL SYNTHESIS (RIGHT COLUMN) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* A. CRITICAL MATRIX PREVIEW (D1 & D9) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        <ChartPreview
                            varga="D1"
                            label="Natal Chart"
                            ascendantSign={indexToSignId("D1")}
                            planets={MOCK_PLANETS}
                            onZoom={() => setZoomedChart({ varga: "D1", label: "Natal Chart" })}
                        />
                        <ChartPreview
                            varga="D9"
                            label="Navamsha Chart"
                            ascendantSign={indexToSignId("D9")}
                            planets={MOCK_PLANETS}
                            onZoom={() => setZoomedChart({ varga: "D9", label: "Navamsha Chart" })}
                        />
                    </div>

                    {/* B. ACTIVE LIFECYCLE CHAIN (DASHAS) */}
                    <div className="bg-gradient-to-br from-[#3E2A1F] to-[#2A1810] border border-[#D08C60]/20 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 p-10">
                            <TrendingUp className="w-12 h-12 text-[#FFD27D]/20" />
                        </div>

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-serif text-white font-black tracking-tight italic">Divine Timing Chain</h2>
                                <p className="text-[10px] text-[#FFD27D] uppercase tracking-widest font-black mt-2 opacity-80">Vimshottari Lifecycle Path</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Active Mahadasha</span>
                                <div className="bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 px-6 py-2 rounded-xl">
                                    <span className="text-[#FF6B6B] font-black text-sm uppercase tracking-widest">Ketu System</span>
                                </div>
                            </div>
                        </div>

                        {/* Dasha Path Visualization */}
                        <div className="grid grid-cols-3 gap-6 relative z-10">
                            {/* Connector line */}
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />

                            <DashaStep label="Maha Dasha" value="Ketu" date="ends 2026" active />
                            <DashaStep label="Antar Dasha" value="Mars" date="ends June 2025" active />
                            <DashaStep label="Pratyantar" value="Mercury" date="ends Dec 2024" />
                        </div>
                    </div>

                    {/* C. ASTROLOGER'S SYNTHESIS (INTEGRATED) */}
                    <div className="bg-[#FFD27D]/20 border border-[#FFD27D]/30 rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-32 h-1 bg-[#D08C60]" />
                        <div className="flex items-start gap-8">
                            <div className="w-16 h-16 rounded-full bg-[#3E2A1F]/5 flex items-center justify-center text-[#3E2A1F] shrink-0 border border-[#3E2A1F]/10">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black text-[#8B5A2B] uppercase tracking-[0.3em] mb-4">Master Synthesis</h3>
                                <p className="font-serif italic text-[#3E2A1F] text-2xl leading-relaxed">
                                    "The soul is currently transitioning through a purification phase. With Scorpio moon and Mars Antar-dasha, focus on controlled emotional grounding. The Navamsha suggests hidden strengths manifesting soon..."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHART ZOOM MODAL */}
            {/* CHART ZOOM MODAL - PARCHMENT THEMED */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 backdrop-blur-3xl bg-[#3E2A1F]/20 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-[#FEFAEA] border border-[#D08C60]/40 rounded-[4rem] p-16 max-w-4xl w-full relative shadow-[0_50px_150px_rgba(62,42,31,0.4)]">
                        {/* Interactive Back Button */}
                        <button
                            onClick={() => setZoomedChart(null)}
                            className="absolute top-10 left-10 flex items-center gap-3 px-6 py-3 rounded-full bg-[#3E2A1F]/5 text-[#3E2A1F] hover:bg-[#D08C60]/20 hover:scale-105 transition-all group"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Overview</span>
                        </button>

                        <div className="mb-12 text-center">
                            <h2 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">{zoomedChart.label}</h2>
                            <p className="text-[12px] text-[#A8653A] uppercase tracking-[0.4em] font-black mt-3">{zoomedChart.varga} Harmonic Synthesis Matrix</p>
                        </div>

                        <div className="aspect-square w-full max-w-2xl mx-auto bg-[#FFF9F0] rounded-[3rem] p-10 border border-[#D08C60]/10 shadow-inner">
                            <NorthIndianChart
                                ascendantSign={indexToSignId(zoomedChart.varga)}
                                planets={MOCK_PLANETS}
                                className="bg-transparent border-none scale-110"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BirthDatum({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 flex items-center justify-center text-[#D08C60] group-hover:bg-[#D08C60]/10 group-hover:border-[#D08C60]/40 transition-all">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#5A3E2B]/60 mb-1">{label}</p>
                <p className="font-serif text-2xl font-black text-[#3E2A1F]">{value}</p>
            </div>
        </div>
    );
}

function SignatureCard({ label, value, sub, highlight = false }: { label: string, value: string, sub?: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden",
            highlight ? "bg-[#D08C60]/10 border-[#D08C60]/40 shadow-lg" : "bg-[#3E2A1F]/5 border-[#3E2A1F]/5"
        )}>
            <p className="text-[10px] uppercase tracking-widest text-[#5A3E2B]/60 mb-3 font-black">{label}</p>
            <p className={cn("font-serif text-2xl font-black", highlight ? "text-[#D08C60]" : "text-[#3E2A1F]")}>{value}</p>
            {sub && <p className="text-[12px] font-serif italic text-[#3E2A1F]/40 mt-1">{sub}</p>}
        </div>
    );
}

function ChartPreview({ varga, label, ascendantSign, planets, onZoom }: any) {
    return (
        <div className="bg-[#FFFFFF]/40 border-[3px] border-[#D08C60]/20 rounded-[3.5rem] p-10 group hover:border-[#D08C60]/60 transition-all flex flex-col shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Accent Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D08C60]/10 blur-3xl pointer-events-none group-hover:bg-[#FFD27D]/20 transition-all" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-2xl font-serif text-[#3E2A1F] font-black italic">{label}</h3>
                    <p className="text-[10px] text-[#A8653A] uppercase tracking-widest font-black mt-1 opacity-80 transition-opacity group-hover:opacity-100">{varga} Harmonic Matrix</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onZoom(); }}
                    className="p-4 rounded-2xl bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 text-[#3E2A1F]/40 group-hover:text-[#3E2A1F] group-hover:bg-[#D08C60]/20 group-hover:border-[#D08C60] transition-all active:scale-90 shadow-sm"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 aspect-square bg-[#FEFAEA] rounded-[2.5rem] p-10 group-hover:scale-[1.03] transition-transform duration-1000 shadow-inner border border-[#3E2A1F]/5">
                <NorthIndianChart
                    ascendantSign={ascendantSign}
                    planets={planets}
                    className="bg-transparent border-none shadow-none scale-[1.35]"
                />
            </div>
        </div>
    );
}

function ElementProgress({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#5A3E2B]/60">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-2 bg-[#3E2A1F]/5 rounded-full overflow-hidden border border-[#3E2A1F]/5">
                <div
                    className={cn("h-full transition-all duration-1000", color.startsWith('#') ? "" : color)}
                    style={{ width: `${value}%`, backgroundColor: color.startsWith('#') ? color : undefined }}
                />
            </div>
        </div>
    );
}

function DashaStep({ label, value, date, active = false }: { label: string, value: string, date: string, active?: boolean }) {
    return (
        <div className={cn(
            "relative z-10 flex flex-col items-center p-8 rounded-[2rem] border transition-all text-center",
            active ? "bg-[#FFD27D]/20 border-[#FFD27D]/40 shadow-lg scale-105" : "bg-[#FEFAEA]/10 border-[#FEFAEA]/10 opacity-60"
        )}>
            <span className="text-[9px] font-black uppercase text-[#FFD27D] tracking-widest mb-2">{label}</span>
            <span className="text-2xl font-serif font-black text-white mb-1">{value}</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-black">{date}</span>
            {active && (
                <div className="absolute -top-1 px-3 py-1 bg-[#FFD27D] text-[#3E2A1F] rounded-full text-[8px] font-black uppercase tracking-widest -translate-y-1/2">
                    Running
                </div>
            )}
        </div>
    );
}

