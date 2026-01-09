"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import PlanetaryAnalytics, { DetailedPlanetInfo } from '@/components/astrology/PlanetaryAnalytics';
import NorthIndianChart from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import SouthIndianChart from '@/components/astrology/SouthIndianChart';
import VimshottariDasha from '@/components/astrology/VimshottariDasha';
import {
    Download,
    Share2,
    Printer,
    Save,
    Maximize2,
    Zap,
    AlertCircle,
    Settings,
    LayoutGrid,
    Table as TableIcon,
    Star,
    Compass,
    MapPin,
    Plus,
    Users,
    Briefcase,
    FileText,
    Globe,
    MoreVertical,
    Edit2,
    Orbit,
    ArrowRight
} from 'lucide-react';

const SIGN_NAME_TO_ID: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const DEFAULT_SLOTS = ['D1', 'D9', 'D10', 'D12', 'D7', 'D60'];

function WorkbenchStat({ icon: Icon, label, value, orange = false }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#3E2A1F]/5 border border-[#D08C60]/10 hover:border-[#D08C60]/30 hover:bg-[#3E2A1F]/10 transition-all group cursor-default">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    orange ? "bg-[#D08C60]/20 text-[#D08C60]" : "bg-[#3E2A1F]/5 text-[#3E2A1F]/40 group-hover:text-[#3E2A1F]/80"
                )}>
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                    <span className="block text-[9px] font-black text-[#5A3E2B]/40 uppercase tracking-[0.2em] mb-1">{label}</span>
                    <span className={cn("text-[14px] font-serif font-black tracking-tight transition-colors", orange ? "text-[#C9A24D]" : "text-[#3E2A1F]/80 group-hover:text-[#3E2A1F]")}>{value}</span>
                </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D08C60]/20 group-hover:bg-[#D08C60] transition-all" />
        </div>
    );
}


function ActionButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-[#3E2A1F]/5 transition-all text-[#3E2A1F]/40 hover:text-[#D08C60] group"
        >
            <Icon className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
        </button>
    );
}

function SlotCommand({ icon: Icon, onClick, label }: { icon: any, onClick: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-[#3E2A1F]/5 text-[#D08C60] transition-all group/btn"
        >
            <Icon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-serif">{label}</span>
        </button>
    );
}

function ToolButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

export default function VedicDashboardPage() {
    const { clientDetails, setClientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();

    // Workbench Functional State
    const [slots, setSlots] = useState<string[]>(DEFAULT_SLOTS);
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);
    const [zoomIndex, setZoomIndex] = useState<number | null>(null);
    const [isReplacing, setIsReplacing] = useState<number | null>(null);

    // Feature Toggles & UI State
    const [isDualGrid, setIsDualGrid] = useState(true);
    const [slotSettingsIndex, setSlotSettingsIndex] = useState<number | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const [workbenchSettings, setWorkbenchSettings] = useState({
        showDegrees: true,
        overlayTransits: false,
        displayAspects: false,
    });

    const toggleSetting = (key: keyof typeof workbenchSettings) => {
        setWorkbenchSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!clientDetails) {
        return (
            <div className="h-[85vh] flex flex-col items-center justify-center text-center px-4 bg-luxury-radial">
                <div className="w-full max-w-xl mx-auto">
                    <div className="w-24 h-24 rounded-[2rem] bg-[#D08C60]/10 flex items-center justify-center mb-8 border border-[#D08C60]/30 shadow-lg mx-auto">
                        <Zap className="w-12 h-12 text-[#D08C60]" />
                    </div>
                    <h2 className="text-5xl font-serif text-[#3E2A1F] mb-6 font-black tracking-tighter italic">Initiate Session</h2>
                    <p className="text-[#5A3E2B]/70 max-w-lg mx-auto mb-12 font-serif italic text-lg leading-relaxed">
                        The celestial matrices are dormant. Enter vital statistics to generate the multi-chart synthesis.
                    </p>

                    <div className="bg-[#FFFFFF]/60 backdrop-blur-sm border border-[#D08C60]/20 rounded-[3rem] p-12 shadow-2xl">
                        <QuickEntryForm onComplete={(details) => {
                            /* This simulates adding client details in the 'Quick Mode' */
                            /* In a real app, this would use the Context to set client details */
                        }} />
                    </div>

                    <div className="mt-12 flex justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                        <a href="/clients" className="px-8 py-4 bg-[#3E2A1F]/5 text-[#3E2A1F]/60 hover:text-[#3E2A1F] hover:bg-[#D08C60]/20 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                            Or Access Registry Archives
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const activeVarga = slots[activeSlotIndex] || 'D1';

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">

            {/* 1. MASTER WORKBENCH HEADER & CONTROLS */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#D08C60]/30 pb-10">
                <div>
                    <h1 className="text-6xl font-serif text-[#3E2A1F] font-black tracking-tighter italic mb-4">Analytical Workbench</h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#D08C60]">
                            <Orbit className={cn("w-6 h-6", isSyncing && "animate-spin")} />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] font-serif">Celestial Sync Active</span>
                        </div>
                        <div className="h-4 w-[1px] bg-[#D08C60]/30" />
                        <div className="flex items-center gap-2 text-[#5A3E2B]">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">{settings.ayanamsa} Ayanamsa Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-[#3E2A1F]/10 p-2.5 rounded-[2.5rem] border border-[#D08C60]/30 shadow-lg">
                    <button
                        onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => setIsSyncing(false), 2000);
                        }}
                        className={cn(
                            "px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] font-serif transition-all relative overflow-hidden group",
                            isSyncing ? "bg-[#D08C60] text-white" : "bg-[#C9A24D] text-[#3E2A1F] hover:scale-105 shadow-lg"
                        )}
                    >
                        <span className="relative z-10">{isSyncing ? "Syncing..." : "Sync Global Transits"}</span>
                        {isSyncing && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 animate-progress" />}
                    </button>
                    <button className="p-5 bg-[#3E2A1F]/10 text-[#D08C60] hover:bg-[#C9A24D] hover:text-[#3E2A1F] rounded-2xl transition-all shadow-lg border border-[#D08C60]/30">
                        <Settings className="w-6 h-6" />
                    </button>
                    <button className="p-5 bg-[#3E2A1F]/10 text-[#D08C60] hover:bg-[#C9A24D] hover:text-[#3E2A1F] rounded-2xl transition-all shadow-lg border border-[#D08C60]/30">
                        <Download className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* 2. DYNAMIC ANALYTICAL HUD (Dasha + High-Level Metrics) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* A. ACTIVE DASHA PATHWAY (Compact & Focused) */}
                <div className="lg:col-span-12 xl:col-span-4 translate-y-[-10px]">
                    <VimshottariDasha compact />
                </div>

                <div className="lg:col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    <div className="p-8 rounded-[2.5rem] bg-[#FFFFFF] border border-[#D08C60]/10 flex flex-col shadow-xl hover:shadow-2xl transition-all">
                        <h3 className="text-[9px] font-black text-[#D08C60] uppercase tracking-[0.3em] mb-6">Primary Lagna Insights</h3>
                        <div className="space-y-4 flex-1">
                            <WorkbenchStat icon={Star} label="Lagna Lord" value="Sun (D1)" orange />
                            <WorkbenchStat icon={Compass} label="Nakshatra" value="Magha" />
                            <WorkbenchStat icon={MapPin} label="Position" value="1h 22°" />
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-[#FFFFFF] border border-[#D08C60]/10 flex flex-col shadow-xl hover:shadow-2xl transition-all">
                        <h3 className="text-[9px] font-black text-[#8B5A2B]/60 uppercase tracking-[0.3em] mb-6">Chart Highlights</h3>
                        <div className="space-y-4 flex-1">
                            <WorkbenchStat icon={Zap} label="Yoga" value="Raja Yoga" />
                            <WorkbenchStat icon={Orbit} label="Retrograde" value="Saturn" />
                            <WorkbenchStat icon={AlertCircle} label="Gandanta" value="None" />
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-[#FFFFFF] border border-[#D08C60]/20 shadow-xl hover:shadow-2xl transition-all flex flex-col">
                        <h3 className="text-[9px] font-black text-[#D08C60] uppercase tracking-[0.3em] mb-6">Display Settings</h3>
                        <div className="space-y-3 flex-1">
                            <ConfigToggle
                                label="Show Degrees"
                                active={workbenchSettings.showDegrees}
                                onClick={() => toggleSetting('showDegrees')}
                            />
                            <ConfigToggle
                                label="Overlay Transits"
                                active={workbenchSettings.overlayTransits}
                                onClick={() => toggleSetting('overlayTransits')}
                            />
                            <ConfigToggle
                                label="View Aspects"
                                active={workbenchSettings.displayAspects}
                                onClick={() => toggleSetting('displayAspects')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DYNAMIC ANALYTICAL MATRIX (GRID REFINED) */}
            <div className="space-y-12">
                <div className="flex items-center justify-between px-10 py-10 bg-[#FFFFFF] border-l-[12px] border-[#D08C60] rounded-r-[4rem] shadow-2xl backdrop-blur-3xl border-y border-r border-[#D08C60]/10">
                    <div>
                        <h2 className="text-6xl font-serif text-[#3E2A1F] font-black tracking-tighter italic drop-shadow-sm">Varga Matrix</h2>
                        <p className="text-[14px] text-[#A8653A] uppercase tracking-[0.5em] font-black mt-4 opacity-80">Multiplex Harmonic Workspace — Advanced Vedic Analysis</p>
                    </div>
                    <div className="flex gap-6">
                        <button
                            onClick={() => setIsDualGrid(!isDualGrid)}
                            className={cn(
                                "flex items-center gap-4 px-10 py-5 rounded-[2rem] border transition-all group shadow-2xl",
                                isDualGrid
                                    ? "bg-[#FFD27D] border-[#FFD27D] text-[#3E2A1F]"
                                    : "bg-white/5 border-white/20 text-[#D08C60] hover:text-[#FFD27D] hover:bg-[#FFD27D]/10 hover:border-[#FFD27D]/40"
                            )}
                        >
                            <LayoutGrid className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] font-serif">{isDualGrid ? "Dual View Active" : "Grid Logic"}</span>
                        </button>
                    </div>
                </div>

                <div className={cn(
                    "grid gap-16 transition-all duration-700",
                    isDualGrid ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}>
                    {slots.map((varga, index) => (
                        <ChartSlot
                            key={`${varga}-${index}`}
                            varga={varga}
                            active={activeSlotIndex === index}
                            onClick={() => setActiveSlotIndex(index)}
                            onReplace={() => setIsReplacing(index)}
                            onZoom={() => setZoomIndex(index)}
                            onConfig={() => setSlotSettingsIndex(index)}
                            chartStyle={settings.chartStyle}
                            showDegrees={workbenchSettings.showDegrees}
                        />
                    ))}
                    {slots.length < 8 && (
                        <div className="flex flex-col gap-6 opacity-40 hover:opacity-100 transition-all duration-500">
                            {/* Alignment spacer (Header) */}
                            <div className="h-[48px]" />

                            <button
                                onClick={() => setIsReplacing(slots.length)}
                                className="aspect-square rounded-[3rem] border-4 border-dashed border-[#D08C60]/30 bg-[#1A0A05]/40 flex flex-col items-center justify-center gap-6 text-[#D08C60]/60 hover:text-[#FFD27D] hover:border-[#FFD27D]/60 hover:bg-[#FFD27D]/5 transition-all group relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD27D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFD27D]/10 transition-all duration-700">
                                    <Plus className="w-10 h-10" />
                                </div>
                                <div className="text-center px-6">
                                    <span className="block text-[13px] font-black uppercase tracking-[0.4em] font-serif text-[#FFD27D]">Add Matrix perspective</span>
                                    <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-[#D08C60]/60 mt-2 italic font-black">Expand Analytical Workspace</span>
                                </div>
                            </button>

                            {/* Alignment spacer (Footer) */}
                            <div className="h-[52px]" />
                        </div>
                    )}
                </div>
            </div>

            {/* 3. COORDINATE PRECISION FLOOR */}
            <div className="bg-[#FFFFFF]/40 border border-[#D08C60]/20 rounded-[3.5rem] p-12 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight italic">Coordinate Insight: {activeVarga}</h2>
                        <p className="text-[10px] text-[#A8653A] uppercase tracking-[0.4em] font-black mt-2">Real-time harmonic positions for selection</p>
                    </div>
                    <button className="px-10 py-5 bg-[#D08C60] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all flex items-center gap-3 border border-white/20">
                        <Zap className="w-5 h-5" />
                        AI Synthesis
                    </button>
                </div>

                <PlanetaryAnalytics planets={MOCK_REALISTIC_DETAILS} />
            </div>

            {/* MODALS / OVERLAYS */}
            {/* IMPROVED VIEWPORT-SAFE ZOOM MODAL */}
            {/* IMPROVED VIEWPORT-SAFE ZOOM MODAL */}
            {zoomIndex !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 bg-[#3E2A1F]/30 backdrop-blur-md animate-in fade-in duration-700">
                    <div className="w-full max-w-7xl h-full flex flex-col gap-8">
                        {/* Persistent Navigation Header */}
                        <div className="flex items-center justify-between shrink-0 relative z-[110]">
                            <button
                                onClick={() => setZoomIndex(null)}
                                className="flex items-center gap-4 px-10 py-5 rounded-full bg-[#D08C60] text-white hover:scale-105 transition-all group shadow-lg border-2 border-white/20"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[13px] font-black uppercase tracking-[0.3em] font-serif">Esc / Back to Matrix</span>
                            </button>

                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-[#D08C60] uppercase tracking-[0.5em] mb-2">High-Precision Analysis Chamber</span>
                                <h3 className="text-4xl font-serif text-[#3E2A1F] font-black italic tracking-tighter">Varga: {slots[zoomIndex]}</h3>
                            </div>
                        </div>

                        {/* Analysis Chamber Container (Split View) */}
                        <div className="flex-1 min-h-0 flex gap-12 items-stretch">
                            {/* LEFT: THE CHART */}
                            <div className="flex-[1.5] bg-[#FEFAEA] rounded-[4rem] border-[12px] border-[#3E2A1F]/5 shadow-[0_0_80px_rgba(62,42,31,0.1)] relative overflow-hidden flex items-center justify-center p-12">
                                <ChartSlot
                                    varga={slots[zoomIndex]}
                                    active
                                    isZoomed
                                    onClose={() => setZoomIndex(null)}
                                    chartStyle={settings.chartStyle}
                                    showDegrees={workbenchSettings.showDegrees}
                                />
                            </div>

                            {/* RIGHT: THE DATA SIDE-CAR */}
                            <div className="w-[380px] flex flex-col gap-10 py-8 bg-[#FEFAEA] rounded-[3rem] p-8 border border-[#D08C60]/10 shadow-2xl">
                                <div className="space-y-10 px-4">
                                    <div>
                                        <h4 className="text-[10px] font-black text-[#D08C60] uppercase tracking-[0.6em] mb-8 border-b border-[#3E2A1F]/10 pb-6 font-serif italic">Stellar Coordinates</h4>
                                        <div className="space-y-6">
                                            {MOCK_REALISTIC_DETAILS.map((p: DetailedPlanetInfo) => (
                                                <div key={p.planet} className="flex justify-between items-center group/item transition-all py-2 border-b border-[#3E2A1F]/5 last:border-0 hover:bg-[#3E2A1F]/5 rounded-lg px-2 -mx-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D08C60]/40 group-hover/item:bg-[#D08C60]" />
                                                        <span className="font-serif font-black text-[#3E2A1F] group-hover/item:text-[#D08C60] transition-colors">{p.planet}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[#A8653A] font-mono font-black text-[14px]">{p.degree}</span>
                                                        <span className="block text-[8px] text-[#5A3E2B]/50 uppercase tracking-widest font-black mt-1 group-hover/item:text-[#D08C60]">{p.sign} • {p.nakshatra}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] bg-[#D08C60]/10 border border-[#D08C60]/20">
                                        <h5 className="text-[9px] font-black text-[#D08C60] uppercase tracking-widest mb-4">Harmonic Synthesis</h5>
                                        <p className="text-[#5A3E2B] font-serif italic text-sm leading-relaxed">
                                            The {slots[zoomIndex]} matrix reveals the subtle strengths of your planetary alignments. Focus on the dignity calculations for advanced structural analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WORKBENCH CONTROL PANEL (REPLACING CONFIG MODAL) */}
            {slotSettingsIndex !== null && (
                <div className="fixed inset-0 z-[120] flex items-center justify-end p-0 bg-[#3E2A1F]/20 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="w-[450px] h-full bg-[#FEFAEA] border-l border-[#D08C60]/30 shadow-[-50px_0_100px_rgba(62,42,31,0.2)] animate-in slide-in-from-right duration-700 flex flex-col">
                        <div className="p-12 border-b border-[#D08C60]/10 bg-gradient-to-br from-[#FFF9F0] to-transparent">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-serif text-[#3E2A1F] font-black italic">Matrix Control</h2>
                                <button onClick={() => setSlotSettingsIndex(null)} className="p-4 rounded-full bg-[#3E2A1F]/5 hover:bg-[#3E2A1F]/10 text-[#5A3E2B]/50 hover:text-[#5A3E2B] transition-all">
                                    <Plus className="w-6 h-6 rotate-45" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 bg-[#D08C60]/10 p-4 rounded-2xl border border-[#D08C60]/20">
                                <Zap className="w-6 h-6 text-[#D08C60]" />
                                <span className="text-xs font-black uppercase text-[#D08C60] tracking-widest">{slots[slotSettingsIndex]} Synthesis Configuration</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-10">
                            <div>
                                <h4 className="text-[10px] font-black text-[#5A3E2B]/60 uppercase tracking-[0.4em] mb-6">Visual Filters</h4>
                                <div className="space-y-4">
                                    <ConfigToggle label="Display Degree Tokens" active={workbenchSettings.showDegrees} onClick={() => toggleSetting('showDegrees')} />
                                    <ConfigToggle label="Overlay Current Transits" active={workbenchSettings.overlayTransits} onClick={() => toggleSetting('overlayTransits')} />
                                    <ConfigToggle label="Stellar Aspect Web" active={workbenchSettings.displayAspects} onClick={() => toggleSetting('displayAspects')} />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-[#5A3E2B]/60 uppercase tracking-[0.4em] mb-6">Analytical Layers</h4>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D08C60]/10 hover:border-[#D08C60]/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-serif text-[#3E2A1F] font-bold group-hover:text-[#D08C60] transition-colors">Bhava Chalit Integration</span>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#3E2A1F]/10 group-hover:bg-[#D08C60] transition-colors" />
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D08C60]/10 hover:border-[#D08C60]/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-serif text-[#3E2A1F] font-bold group-hover:text-[#D08C60] transition-colors">Avastha Highlighting</span>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#3E2A1F]/10 group-hover:bg-[#D08C60] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 bg-[#3E2A1F]/5 border-t border-[#D08C60]/10">
                            <button
                                onClick={() => setSlotSettingsIndex(null)}
                                className="w-full py-6 bg-[#D08C60] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all hover:bg-[#C9A24D]"
                            >
                                Apply Workbench Parameters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReplacing !== null && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#3E2A1F]/20 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
                    <div className="bg-[#FEFAEA] border border-[#D08C60]/30 rounded-[5rem] p-20 max-w-4xl w-full shadow-[0_50px_100px_rgba(62,42,31,0.3)] relative overflow-hidden">
                        {/* Interactive cancellation */}
                        <div className="absolute top-10 right-10">
                            <button onClick={() => setIsReplacing(null)} className="p-4 rounded-full bg-[#3E2A1F]/5 hover:bg-[#3E2A1F]/10 text-[#5A3E2B]/40 hover:text-[#5A3E2B] transition-all">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-serif text-[#3E2A1F] font-black tracking-tighter italic mb-4">Select Matrix Perspective</h2>
                                <p className="text-[11px] text-[#A8653A] uppercase tracking-[0.4em] font-black">Choosing harmonic layer for slot {isReplacing + 1}</p>
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                {['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D60'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => {
                                            const s = [...slots];
                                            if (isReplacing === slots.length) {
                                                s.push(v);
                                            } else {
                                                s[isReplacing] = v;
                                            }
                                            setSlots(s);
                                            setIsReplacing(null);
                                        }}
                                        className="group relative py-10 rounded-[3rem] bg-[#3E2A1F]/5 border border-[#D08C60]/10 transition-all hover:bg-[#D08C60] hover:border-[#D08C60] hover:scale-110 hover:shadow-lg"
                                    >
                                        <span className="text-3xl font-serif font-black text-[#3E2A1F] group-hover:text-white transition-colors">{v}</span>
                                        <span className="absolute bottom-4 left-0 right-0 text-[8px] font-black uppercase tracking-widest text-[#5A3E2B]/30 group-hover:text-white/50 transition-colors">Varga Layer</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsReplacing(null)}
                                className="w-full mt-16 py-6 border border-[#D08C60]/20 rounded-2xl text-[#5A3E2B]/40 hover:text-red-500 hover:border-red-400/20 uppercase font-black text-[11px] tracking-[0.5em] transition-all"
                            >
                                Cancel Modification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// --- MATRIX & PASSPORT HELPER COMPONENTS ---

function PassportField({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#3E2A1F]/5 border border-[#D08C60]/10 flex items-center justify-center text-[#D08C60] group-hover:bg-[#D08C60]/10 group-hover:border-[#D08C60]/30 transition-all">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <span className="text-[9px] font-black uppercase text-[#5A3E2B]/40 tracking-[0.2em] block mb-1">{label}</span>
                <span className="text-md text-[#3E2A1F] font-serif font-black tracking-tight">{value}</span>
            </div>
        </div>
    );
}


// STELLAR MASK DATA - Full Detailed Information for Analytics and HUD
const MOCK_REALISTIC_DETAILS: DetailedPlanetInfo[] = [
    { planet: 'Sun', sign: 'Leo', degree: '22° 14\' 30"', nakshatra: 'Purva Phalguni', pada: 3, nakshatraLord: 'Venus', house: 1, dignity: 'Own Sign' },
    { planet: 'Moon', sign: 'Scorpio', degree: '05° 10\' 12"', nakshatra: 'Anuradha', pada: 3, nakshatraLord: 'Saturn', house: 1, dignity: 'Debilitated' },
    { planet: 'Mars', sign: 'Scorpio', degree: '12° 45\' 00"', nakshatra: 'Anuradha', pada: 4, nakshatraLord: 'Saturn', house: 1, dignity: 'Own Sign' },
    { planet: 'Mercury', sign: 'Virgo', degree: '08° 22\' 15"', nakshatra: 'Uttara Phalguni', pada: 4, nakshatraLord: 'Sun', house: 11, dignity: 'Exalted' },
    { planet: 'Jupiter', sign: 'Cancer', degree: '15° 30\' 00"', nakshatra: 'Pushya', pada: 4, nakshatraLord: 'Saturn', house: 9, dignity: 'Exalted' },
    { planet: 'Venus', sign: 'Leo', degree: '28° 10\' 00"', nakshatra: 'Uttara Phalguni', pada: 1, nakshatraLord: 'Sun', house: 10, dignity: 'Friend' },
    { planet: 'Saturn', sign: 'Aquarius', degree: '11° 05\' 44"', nakshatra: 'Shatabhisha', pada: 2, nakshatraLord: 'Rahu', house: 4, dignity: 'Moolatrikona' },
    { planet: 'Rahu', sign: 'Pisces', degree: '19° 20\' 10"', nakshatra: 'Revati', pada: 1, nakshatraLord: 'Mercury', house: 5, dignity: 'Neutral' },
    { planet: 'Ketu', sign: 'Virgo', degree: '19° 20\' 10"', nakshatra: 'Hasta', pada: 3, nakshatraLord: 'Moon', house: 11, dignity: 'Neutral' },
];

const STELLAR_CHART_PLANETS = MOCK_REALISTIC_DETAILS.map(d => ({
    planet: d.planet,
    sign: d.sign,
    degree: d.degree.split(' ')[0]
}));

function ChartSlot({ varga, active, isZoomed = false, onClick, onReplace, onZoom, onConfig, chartStyle, showDegrees, onClose }: any) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col gap-6 group cursor-pointer"
        >
            {/* 1. FLOATING HEADER - ZERO OVERLAP ZONE */}
            <div className="flex items-center justify-between px-4 h-[48px]">
                <div className={cn(
                    "px-6 py-2 rounded-2xl border-2 transition-all duration-700 shadow-sm",
                    active ? "bg-[#3E2A1F] border-[#D08C60] text-[#FFD27D] scale-110" : "bg-[#3E2A1F]/5 border-[#3E2A1F]/10 text-[#3E2A1F]/50"
                )}>
                    <span className="text-xl font-black font-serif tracking-widest">{varga}</span>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onConfig(); }}
                    className={cn(
                        "p-3.5 rounded-2xl bg-[#3E2A1F] text-[#FFD27D] border border-[#D08C60]/30 hover:bg-[#D08C60] hover:text-white transition-all opacity-0 translate-x-4",
                        active ? "opacity-100 translate-x-0" : "group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* 2. CORE CHART CONTAINER - THE FULL CHART */}
            <div className={cn(
                "relative aspect-square rounded-[3rem] border-[3px] transition-all duration-1000 overflow-hidden",
                active
                    ? "bg-[#FEFAEA] border-[#D08C60] shadow-[0_60px_150px_rgba(62,42,31,0.15)] scale-[1.02] z-10"
                    : "bg-[#FEFAEA]/80 border-[#D08C60]/10 hover:border-[#D08C60]/30 shadow-lg"
            )}>
                <div className="w-full h-full relative flex items-center justify-center p-12">
                    {/* Immersive Active Glow */}
                    {active && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD27D]/10 to-transparent animate-pulse" />
                    )}

                    {chartStyle === 'North Indian' ? (
                        <NorthIndianChart
                            ascendantSign={varga === 'D9' ? 5 : 8}
                            planets={STELLAR_CHART_PLANETS.map(p => ({
                                name: p.planet.substring(0, 2),
                                signId: SIGN_NAME_TO_ID[p.sign] || 1,
                                degree: p.degree
                            }))}
                            className={cn(
                                "bg-transparent border-none shadow-none transform transition-all duration-1000",
                                isZoomed ? "scale-[2.4]" : "scale-[1.45] group-hover:scale-[1.55]"
                            )}
                        />
                    ) : (
                        <SouthIndianChart
                            ascendantSign={varga === 'D9' ? 5 : 8}
                            planets={STELLAR_CHART_PLANETS.map(p => ({
                                name: p.planet.substring(0, 2),
                                signId: SIGN_NAME_TO_ID[p.sign] || 1,
                                degree: p.degree
                            }))}
                            className={cn(
                                "bg-transparent border-none transform transition-all duration-1000",
                                isZoomed ? "scale-[2.0]" : "scale-[1.3] group-hover:scale-140"
                            )}
                        />
                    )}
                </div>
            </div>

            {/* 3. COMMAND TRAY - DETACHED ZONE */}
            <div className={cn(
                "flex items-center justify-center gap-4 h-[52px] transition-all duration-700",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
            )}>
                <button
                    onClick={(e) => { e.stopPropagation(); onReplace(); }}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#3E2A1F] border border-[#FFD27D]/40 text-[#FFD27D] hover:bg-[#FFD27D] hover:text-[#3E2A1F] transition-all shadow-xl group/btn"
                >
                    <Edit2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-serif">Shift Perspective</span>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onZoom(); }}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFD27D] border border-white/20 text-[#3E2A1F] hover:scale-105 transition-all shadow-xl shadow-[#FFD27D]/10 group/btn"
                >
                    <Maximize2 className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-serif">Detailed Synthesis</span>
                </button>
            </div>
        </div>
    );
}


// Logic to vary the look of mock charts
function indexToSignId(varga: string) {
    const sum = varga.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum % 12) + 1;
}

function ToolTab({ id, icon: Icon, active, onClick }: { id: string, icon: any, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-2.5 rounded-2xl flex items-center gap-3 transition-all relative overflow-hidden group",
                active ? "bg-[#D08C60] text-white shadow-xl" : "text-[#5A3E2B]/50 hover:text-[#3E2A1F] hover:bg-[#3E2A1F]/5"
            )}
        >
            <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-white" : "text-[#D08C60]")} />
            <span className="text-[10px] font-black uppercase tracking-widest">{id}</span>
            {active && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
        </button>
    );
}

function ConfigToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm",
                active ? "bg-[#D08C60] border-[#D08C60]" : "bg-white border-[#D08C60]/20 hover:border-[#D08C60]/50"
            )}
        >
            <span className={cn("text-xs font-serif font-bold uppercase tracking-wider", active ? "text-white" : "text-[#3E2A1F]")}>{label}</span>
            <div className={cn("w-4 h-4 rounded-full border", active ? "bg-white border-white" : "border-[#D08C60]/30")} />
        </button>
    );
}

function QuickEntryForm({ onComplete }: { onComplete: (d: any) => void }) {
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male' as const,
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({
            ...formData,
            placeOfBirth: { city: formData.placeOfBirth }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Full Name" value={formData.name} onChange={v => setFormData(p => ({ ...p, name: v }))} placeholder="e.g. Vikram Singh" />
                <div>
                    <label className="text-[10px] font-black text-[#D08C60] uppercase tracking-widest mb-3 block">Gender Identity</label>
                    <div className="flex gap-4">
                        {['male', 'female', 'other'].map(g => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, gender: g as any }))}
                                className={cn("flex-1 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all", formData.gender === g ? "bg-[#D08C60] border-[#D08C60] text-white" : "bg-[#3E2A1F]/5 border-[#3E2A1F]/10 text-[#3E2A1F]/40 hover:border-[#3E2A1F]/30")}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
                <InputGroup label="Celestial Date" value={formData.dateOfBirth} onChange={v => setFormData(p => ({ ...p, dateOfBirth: v }))} type="date" />
                <InputGroup label="Precise Time" value={formData.timeOfBirth} onChange={v => setFormData(p => ({ ...p, timeOfBirth: v }))} type="time" />
                <div className="md:col-span-2">
                    <InputGroup label="Birth Location" value={formData.placeOfBirth} onChange={v => setFormData(p => ({ ...p, placeOfBirth: v }))} placeholder="Enter city or coordinates..." />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-6 mt-6 bg-[#D08C60] text-white rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-lg hover:bg-[#C9A24D] hover:scale-[1.02] transition-transform border border-white/10"
            >
                Launch Analytical Workbench
            </button>
        </form>
    );
}

function InputGroup({ label, value, onChange, placeholder, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-[#D08C60] uppercase tracking-widest block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 rounded-2xl p-4 px-6 text-[#3E2A1F] placeholder:text-[#3E2A1F]/30 focus:border-[#D08C60]/50 outline-none transition-all font-serif italic"
            />
        </div>
    );
}
