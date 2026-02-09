"use client";

import React, { useEffect, useState } from 'react';
import { ChartWithPopup } from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import { useDasha } from "@/hooks/queries/useCalculations";
import {
    Maximize2,
    TrendingUp,
    ArrowRight,
    Loader2,
    Calendar,
    Clock,
    MapPin,
    Sparkle,
    X,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DashaResponse } from '@/lib/api';
import DoshaAnalysis from '@/components/astrology/DoshaAnalysis';
import YogaAnalysisView from '@/components/astrology/YogaAnalysis';
import PlanetaryTable from '@/components/astrology/PlanetaryTable';
import { parseChartData, signIdToName } from '@/lib/chart-helpers';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import { processDashaResponse } from '@/lib/dasha-utils';
import BirthPanchanga from '@/components/astrology/BirthPanchanga';

// Helper for formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
        if (timeStr.includes('T')) {
            const timePart = timeStr.split('T')[1];
            const cleanTime = timePart.replace('Z', '').split('+')[0].split('.')[0];
            const [hours, minutes] = cleanTime.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${ampm}`;
        }
        const date = new Date(`1970-01-01T${timeStr}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        return timeStr;
    } catch (e) {
        return timeStr;
    }
};

export default function VedicOverviewPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [zoomedChart, setZoomedChart] = React.useState<{ varga: string, label: string } | null>(null);
    const [dashaData, setDashaData] = useState<DashaResponse | null>(null);
    const [analysisModal, setAnalysisModal] = useState<{ type: 'yoga' | 'dosha', subType: string, label: string } | null>(null);

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Dasha Query
    const { data: dashaDataVal, isLoading: dashaLoading } = useDasha(
        clientDetails?.id || '',
        'mahadasha',
        settings.ayanamsa.toLowerCase()
    );

    useEffect(() => {
        if (dashaDataVal) setDashaData(dashaDataVal);
    }, [dashaDataVal]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, settings.ayanamsa]);

    // Memoize chart data transformations
    const d1Data = React.useMemo(() => parseChartData(processedCharts[`D1_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d9Data = React.useMemo(() => parseChartData(processedCharts[`D9_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d10Data = React.useMemo(() => parseChartData(processedCharts[`D10_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d60Data = React.useMemo(() => parseChartData(processedCharts[`D60_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);

    const zoomedData = React.useMemo(() => {
        if (!zoomedChart) return { planets: [], ascendant: 1 };
        const key = `${zoomedChart.varga}_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [zoomedChart, processedCharts, activeSystem]);

    // Prepare Planetary Data for Table
    const planetaryTableData = React.useMemo(() => {
        return d1Data.planets.filter(p => p.name !== 'As').map(p => ({
            planet: p.name,
            sign: signIdToName[p.signId] || '-',
            degree: p.degree,
            nakshatra: p.nakshatra || '-',
            nakshatraPart: p.pada ? (typeof p.pada === 'number' ? p.pada : parseInt(String(p.pada).replace('Pada ', ''))) : undefined,
            house: p.house || 0,
            isRetro: p.isRetro
        }));
    }, [d1Data]);

    const isLoading = isGeneratingCharts || (isLoadingCharts && Object.keys(processedCharts).length === 0);

    const yogas = React.useMemo(() => {
        return Object.values(processedCharts)
            .filter((c: any) => c.chartType?.startsWith('yoga_'))
            .map((c: any) => {
                const subType = c.chartType.replace('yoga_', '');
                const label = subType.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                return { name: label, subType: subType };
            });
    }, [processedCharts]);

    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData;

    return (
        <div className="p-2 w-full min-h-screen animate-in fade-in duration-500">
            {/* Header / Client Context - Removed and moved to Profile Card */}
            {isLoading && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gold-primary/90 text-white rounded-full font-sans text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing Chart...
                </div>
            )}

            <div className="grid grid-cols-12 gap-2">
                {/* LEFT COLUMN: D1 & Planetary Details */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-2">
                    {/* D1 Chart Window */}
                    <div className="border border-antique rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique flex justify-between items-center">
                            <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Birth Chart (D1)</h3>
                            <button onClick={() => setZoomedChart({ varga: "D1", label: "Birth Chart (D1)" })} className="text-secondary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                        </div>
                        <div className="w-full h-[380px] bg-[#FFFCF6]">
                            <ChartWithPopup
                                ascendantSign={d1Data.ascendant}
                                planets={d1Data.planets}
                                className="bg-transparent border-none w-full h-full"
                                preserveAspectRatio="none"
                            />
                        </div>
                    </div>

                    {/* Planetary Details Window */}
                    <div className="border border-antique rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique">
                            <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Birth Planetary Positions</h3>
                        </div>
                        <div className="overflow-x-auto text-[10px] md:text-xs bg-[#FFFCF6]">
                            <PlanetaryTable
                                planets={planetaryTableData}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Divisional Charts, Dasha, Profile */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-2">

                    {/* Top Row: Profile & Dasha */}
                    <div className="grid grid-cols-12 gap-2 auto-rows-fr">
                        {/* Profile & Info */}
                        <div className="col-span-12 md:col-span-5 lg:col-span-4 border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-[#FFFCF6]">
                            <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Client Profile</h3>
                            </div>
                            <div className="p-2.5 space-y-2.5 flex-1">
                                {clientDetails && (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gold-primary flex items-center justify-center text-white font-serif font-semibold text-lg shrink-0 shadow-sm">
                                                {clientDetails.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-serif text-md font-bold text-primary leading-tight truncate">{clientDetails.name}</div>
                                                <div className="font-sans text-[10px] text-secondary leading-compact flex flex-wrap gap-x-2 opacity-80 mt-0.5">
                                                    <span>{formatDate(clientDetails.dateOfBirth)}</span>
                                                    <span className="text-antique">•</span>
                                                    <span>{formatTime(clientDetails.timeOfBirth)}</span>
                                                </div>
                                                <div className="font-sans text-[10px] text-primary/70 leading-compact truncate mt-0.5 max-w-[150px] italic">{clientDetails.placeOfBirth.city}</div>
                                            </div>
                                        </div>



                                        <div className="grid grid-cols-3 gap-1.5">
                                            <div className="bg-softwhite p-2 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors">
                                                <span className="block font-sans text-[9px] font-bold text-secondary/60 uppercase tracking-tighter mb-1">Lagna</span>
                                                <span className="font-serif text-sm font-bold text-primary group-hover:text-accent-gold transition-colors">{signIdToName[(d1Data.ascendant || 1) as number]}</span>
                                            </div>
                                            <div className="bg-softwhite p-1.5 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors">
                                                <span className="block font-sans text-[9px] font-bold text-secondary/60 uppercase tracking-tighter mb-1">Moon</span>
                                                <span className="font-serif text-sm font-bold text-primary group-hover:text-accent-gold transition-colors">{
                                                    d1Data.planets.find(p => p.name === "Mo")
                                                        ? signIdToName[d1Data.planets.find(p => p.name === "Mo")!.signId]
                                                        : "-"
                                                }</span>
                                            </div>
                                            <div className="bg-softwhite p-1.5 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors">
                                                <span className="block font-sans text-[9px] font-bold text-secondary/60 uppercase tracking-tighter mb-1">Sun</span>
                                                <span className="font-serif text-sm font-bold text-primary group-hover:text-accent-gold transition-colors">{
                                                    d1Data.planets.find(p => p.name === "Su")
                                                        ? signIdToName[d1Data.planets.find(p => p.name === "Su")!.signId]
                                                        : "-"
                                                }</span>
                                            </div>
                                        </div>

                                        <hr className="border-antique/40 border-dashed" />

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-serif text-[10px] font-bold text-primary/80 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkle className="w-2.5 h-2.5 text-accent-gold animate-pulse" />
                                                    Birth Panchanga
                                                </h4>
                                                <span className="text-[8px] text-muted-refined/60 italic">Standard Time</span>
                                            </div>
                                            <BirthPanchanga data={birthPanchangaData} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vimshottari Dasha */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-[#FFFCF6]">
                            <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Vimshottari Dasha</h3>
                            </div>
                            <div className="p-0 flex-1">
                                <VimshottariTreeGrid
                                    data={dashaData ? processDashaResponse(dashaData) : []}
                                    isLoading={dashaLoading}
                                    className="h-full border-none shadow-none rounded-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: D9 & D10 */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* D9 Navamsha */}
                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Navamsha (D9)</h3>
                                <button onClick={() => setZoomedChart({ varga: "D9", label: "Navamsha (D9)" })} className="text-secondary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                            </div>
                            <div className="w-full h-[320px] bg-[#FFFCF6]">
                                {d9Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d9Data.ascendant} planets={d9Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" />
                                ) : <div className="font-sans text-xs text-muted-refined p-2">Loading...</div>}
                            </div>
                        </div>

                        {/* D10 Dashamsha */}
                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Dashamsha (D10)</h3>
                                <button onClick={() => setZoomedChart({ varga: "D10", label: "Dashamsha (D10)" })} className="text-secondary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                            </div>
                            <div className="w-full h-[320px] bg-[#FFFCF6]">
                                {d10Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d10Data.ascendant} planets={d10Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" />
                                ) : <div className="font-sans text-xs text-muted-refined p-2">Loading...</div>}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Yogas */}
                    <div className="border border-antique rounded-lg overflow-hidden shadow-sm bg-[#FFFCF6]">
                        <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique">
                            <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Yogas & Combinations</h3>
                        </div>
                        <div className="p-3">
                            {yogas && yogas.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {yogas.map((yoga, i) => (
                                        <div key={i} onClick={() => setAnalysisModal({ type: 'yoga', subType: yoga.subType, label: yoga.name })}
                                            className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-softwhite border border-antique/50 font-sans text-[10px] font-bold text-primary cursor-pointer hover:bg-gold-primary/10 hover:text-accent-gold transition-all shadow-xs group">
                                            <span className="truncate">{yoga.name}</span>
                                            <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all text-accent-gold" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="font-sans text-xs text-muted-refined italic p-2 text-center">No specific yogas identified for this chart.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Zoom */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-softwhite border border-antique rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button onClick={() => setZoomedChart(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-parchment text-secondary hover:bg-gold-primary/20 hover:text-accent-gold transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className="font-serif text-xl font-semibold text-primary leading-tight">{zoomedChart.label}</h2>
                            <p className="font-sans text-xs text-muted-refined uppercase tracking-wider leading-compact mt-2">{zoomedChart.varga} Divisional Chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto rounded-2xl p-6 border border-antique">
                            <ChartWithPopup ascendantSign={zoomedData.ascendant} planets={zoomedData.planets} className="bg-transparent border-none" />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS MODAL */}
            {analysisModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/60 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-parchment border border-antique rounded-[2.5rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar border-b-8 border-gold-primary">
                        <button onClick={() => setAnalysisModal(null)} className="absolute top-6 right-6 p-2 rounded-2xl bg-white border border-antique text-secondary hover:bg-red-50 hover:text-red-500 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="mb-8">
                            <h2 className="font-serif text-xl font-semibold text-primary leading-tight">{analysisModal.label}</h2>
                        </div>
                        {analysisModal.type === 'yoga' ? (
                            <YogaAnalysisView clientId={clientDetails?.id || ""} yogaType={analysisModal.subType} ayanamsa={settings.ayanamsa} />
                        ) : (
                            <DoshaAnalysis clientId={clientDetails?.id || ""} doshaType={analysisModal.subType as any} ayanamsa={settings.ayanamsa} />
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

// Sub-components

function SmallChartCard({ varga, label, data, onZoom }: { varga: string, label: string, data: any, onZoom: () => void }) {
    return (
        <div className="flex flex-col items-center transition-colors cursor-pointer group" onClick={onZoom}>
            <div className="w-full aspect-square mb-2 relative overflow-hidden flex items-center justify-center">
                {data.planets.length > 0 ? (
                    <ChartWithPopup ascendantSign={data.ascendant} planets={data.planets} className="bg-transparent border-none scale-[0.8] origin-center" />
                ) : (
                    <div className="font-sans text-2xs text-muted-refined italic">loading...</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-4 h-4 text-primary" />
                </div>
            </div>
            <span className="font-sans text-sm font-semibold text-primary">{varga}</span>
            <span className="font-sans text-xs text-secondary">{label}</span>
        </div>
    );
}

function ProfileItem({ label, value, sub, highlight }: { label: string, value: string, sub?: string, highlight?: boolean }) {
    return (
        <div className={cn("p-3 rounded-xl border transition-colors", highlight ? "bg-gold-primary/5 border-gold-primary/30" : "bg-softwhite border-antique/50 hover:border-gold-primary/20 hidden-scrollbar")}>
            <div className="font-sans text-xs text-secondary uppercase tracking-wider font-medium mb-1 leading-compact">{label}</div>
            <div className={cn("font-serif text-base font-semibold leading-tight", highlight ? "text-accent-gold" : "text-primary")}>{value}</div>
            {sub && <div className="font-sans text-xs text-muted-refined italic mt-0.5 leading-compact">{sub}</div>}
        </div>
    );
}

const DashaRow = ({ planet, start, ends, duration, active }: { planet: string, start: string, ends: string, duration: string, active?: boolean }) => {
    return (
        <div className={cn("grid grid-cols-4 gap-2 p-3 rounded-xl border items-center text-center", active ? "bg-gold-primary/10 border-gold-primary/30" : "bg-parchment border-antique/30")}>
            <span className="font-sans text-base font-medium text-primary text-left pl-2 leading-normal">{planet}</span>
            <span className="font-sans text-xs text-muted-refined leading-compact">{start}</span>
            <span className="font-sans text-xs text-muted-refined leading-compact">{ends}</span>
            <span className="font-sans text-base font-regular text-primary leading-normal">{duration}</span>
        </div>
    );
};
