"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    ArrowRight,
    RefreshCw,
    Info,
    LayoutGrid,
    Map as MapIcon,
    Loader2,
    Zap,
    Compass,
    Grid3X3
} from 'lucide-react';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import NorthIndianChart from '@/components/astrology/NorthIndianChart/NorthIndianChart';

interface AshtakavargaData {
    sarva?: Record<number, number>;
    bhinna?: Record<string, Record<number, number>>;
    shodasha?: any;
    ascendant?: number;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AnalyzeCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: 'amber' | 'rose' | 'copper' }) => (
    <div className={cn(
        "p-6 rounded-3xl border transition-all hover:shadow-lg",
        color === 'amber' ? "bg-amber-50/50 border-amber-100" :
            color === 'rose' ? "bg-rose-50/50 border-rose-100" :
                "bg-copper-50/50 border-copper-100"
    )}>
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm",
            color === 'amber' ? "bg-amber-100 text-amber-600" :
                color === 'rose' ? "bg-rose-100 text-rose-600" :
                    "bg-copper-100 text-copper-600"
        )}>
            {icon}
        </div>
        <h4 className="text-lg font-serif font-black text-copper-950 mb-2">{title}</h4>
        <p className="text-xs text-copper-600 leading-relaxed">{desc}</p>
    </div>
);

export default function AshtakavargaPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AshtakavargaData | null>(null);
    const [activeTab, setActiveTab] = useState<'sarva' | 'bhinna' | 'shodasha'>('sarva');
    const [selectedPlanet, setSelectedPlanet] = useState<string>('Sun');

    const fetchAshtakavarga = async (type: 'bhinna' | 'sarva' | 'shodasha') => {
        if (!clientDetails?.id) return;
        setLoading(true);
        try {
            const result = await clientApi.generateAshtakavarga(
                clientDetails.id,
                settings.ayanamsa,
                type
            );

            let asc = data?.ascendant;
            if (!asc) {
                const charts = await clientApi.getCharts(clientDetails.id);
                const d1 = charts.find((c: any) => c.chartType === 'D1');
                if (d1?.chartData?.ascendant?.sign) {
                    const signMap: any = { 'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12 };
                    asc = signMap[d1.chartData.ascendant.sign];
                }
            }

            setData(prev => ({
                ...prev,
                [type]: result.data,
                ascendant: asc
            }));
        } catch (error) {
            console.error(`Failed to fetch ${type} ashtakavarga:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientDetails?.id) {
            fetchAshtakavarga('sarva');
            fetchAshtakavarga('bhinna');
        }
    }, [clientDetails?.id, settings.ayanamsa]);

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Shield className="w-16 h-16 text-copper-300 mb-4 animate-pulse" />
                <h2 className="text-2xl font-serif text-copper-900 mb-2">No Client Selected</h2>
                <p className="text-copper-600 max-w-md">Please select a client from the workbench to analyze their Ashtakavarga strengths.</p>
            </div>
        );
    }

    const houseValues: Record<number, number> = {};
    const ascSign = data?.ascendant || 1;

    if (data) {
        let scores: Record<number, number> = {};

        if (activeTab === 'sarva' && data.sarva) {
            // Calculate column totals from the matrix or use direct SAV if available
            // NEW: Handle direct 'signs' object from backend (e.g. { "Aries": 30, ... })
            if ((data.sarva as any).signs) {
                const signMap: Record<string, number> = {
                    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
                    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
                };
                Object.entries((data.sarva as any).signs).forEach(([signName, val]) => {
                    const signId = signMap[signName] || signMap[signName.charAt(0).toUpperCase() + signName.slice(1)];
                    if (signId) scores[signId] = val as number;
                });
            } else {
                // FALLBACK: Calculate column totals from the matrix if it's a raw matrix
                const matrix = data.sarva;
                const signs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                const planets = ['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

                signs.forEach(s => {
                    let colTotal = 0;
                    planets.forEach(p => {
                        const row = (matrix as any)[p] || (matrix as any)[p.toLowerCase()] || {};
                        const val = row[s];
                        if (typeof val === 'number') colTotal += val;
                    });
                    scores[s] = colTotal;
                });
            }
        } else if (activeTab === 'bhinna' && data.bhinna) {
            const planetData = (data.bhinna as any)[selectedPlanet.toLowerCase()] || (data.bhinna as any)[selectedPlanet];
            if (planetData) {
                Object.entries(planetData).forEach(([s, v]) => {
                    scores[parseInt(s)] = typeof v === 'number' ? v : (v as any).total || 0;
                });
            }
        }

        // Map sign scores to houses: House H shows score of Sign S
        // Formula: S = ((L + H - 2) % 12) + 1 where L is Ascendant Sign
        if (Object.keys(scores).length > 0) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascSign + h - 2) % 12) + 1;
                houseValues[h] = scores[s] || 0;
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-copper-950 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-copper-600" />
                        Ashtakavarga Systems
                    </h1>
                    <p className="text-copper-600 mt-1">Numerical strength assessment for {clientDetails.name}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/50 p-1 rounded-xl border border-copper-200">
                        {(['sarva', 'bhinna', 'shodasha'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                                    activeTab === tab
                                        ? "bg-copper-600 text-white shadow-md shadow-copper-200"
                                        : "text-copper-600 hover:bg-copper-100"
                                )}
                            >
                                {tab === 'sarva' ? 'Sarvashtakavarga' : tab === 'bhinna' ? 'Bhinnashtakavarga' : 'Shodasha'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => fetchAshtakavarga(activeTab)}
                        className="p-2 text-copper-600 hover:bg-copper-100 rounded-lg border border-copper-200 transition-all"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {loading && !data?.[activeTab] ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-copper-600 animate-spin mx-auto mb-4" />
                        <p className="text-copper-400 font-serif">Compiling Bindu Matrices...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    {activeTab !== 'shodasha' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Main Content Area: Table + Chart Side by Side */}
                            <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                                <div className="bg-white rounded-[2rem] border border-copper-200 shadow-2xl shadow-copper-100/50 overflow-hidden">
                                    <div className="p-8 border-b border-copper-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-parchment/30 to-white">
                                        <div>
                                            <h2 className="text-2xl font-serif text-copper-900 font-black">
                                                {activeTab === 'sarva' ? 'Sarvashtakavarga (SAV)' : `Bhinnashtakavarga: ${selectedPlanet}`}
                                            </h2>
                                            <p className="text-sm text-copper-600 mt-1 italic">
                                                {activeTab === 'sarva'
                                                    ? 'The collective strength of all planets across the 12 signs/houses.'
                                                    : `Individual contributions to ${selectedPlanet}'s strength in each sign.`}
                                            </p>
                                        </div>

                                        {activeTab === 'bhinna' && (
                                            <div className="flex gap-1.5 bg-copper-50/50 p-1 rounded-xl border border-copper-200 overflow-x-auto">
                                                {PLANETS.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPlanet(p)}
                                                        className={cn(
                                                            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                                                            selectedPlanet === p ? "bg-copper-600 text-white shadow-sm" : "text-copper-600 hover:bg-white"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                                        {/* Left: Technical Matrix */}
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-copper-400 flex items-center gap-2">
                                                <Grid3X3 className="w-4 h-4" /> Technical Bindu Matrix
                                            </h3>
                                            <AshtakavargaMatrix
                                                type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                planet={selectedPlanet}
                                                data={activeTab === 'sarva' ? data?.sarva : data?.bhinna?.[selectedPlanet.toLowerCase()]}
                                            />
                                            <div className="p-4 bg-parchment/30 rounded-2xl border border-antique shadow-inner flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gold-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <Info className="w-5 h-5 text-gold-dark" />
                                                </div>
                                                <p className="text-[11px] text-copper-700 leading-relaxed">
                                                    Rows indicate contributing elements. Columns indicate Signs 1-12.
                                                    <span className="font-bold text-ink"> Confluence point</span>: High SAV (30+) intersecting with strong BAV (5+) indicates exceptional manifestation.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: Visual Chart */}
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-copper-400 flex items-center gap-2">
                                                <MapIcon className="w-4 h-4" /> Spatial Distribution (D1 Houses)
                                            </h3>
                                            <div className="bg-parchment/20 rounded-[2rem] border border-antique p-8 flex items-center justify-center aspect-square relative group overflow-hidden">
                                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                                                    <Shield className="w-[80%] h-[80%] text-copper-900" />
                                                </div>
                                                <div className="relative w-full max-w-md">
                                                    <NorthIndianChart
                                                        planets={[]}
                                                        ascendantSign={data?.ascendant || 1}
                                                        houseValues={houseValues}
                                                        valueType="bindu"
                                                        className="animate-in zoom-in-95 duration-1000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Analytics: Chancha Chakra / Transits Summary */}
                                {activeTab === 'sarva' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <AnalyzeCard
                                            icon={<Zap className="w-5 h-5" />}
                                            title="Transit Hotspots"
                                            desc="Signs with 32+ bindus are ideal for starting new ventures when major planets visit."
                                            color="amber"
                                        />
                                        <AnalyzeCard
                                            icon={<RefreshCw className="w-5 h-5" />}
                                            title="Karmic Filters"
                                            desc="Signs below 20 bindus indicate areas requiring remedial measures (Upayas) or caution."
                                            color="rose"
                                        />
                                        <AnalyzeCard
                                            icon={<LayoutGrid className="w-5 h-5" />}
                                            title="Savra Chancha"
                                            desc="The unified transit score of 337 bindus reveals the individual's global life potential."
                                            color="copper"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Analytics */}
                            <div className="hidden xl:block xl:col-span-4 space-y-6">
                                <div className="bg-white rounded-3xl border border-copper-200 p-8 shadow-xl shadow-copper-100/30">
                                    <h3 className="text-xl font-serif text-copper-950 mb-6 flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-amber-500" /> Scoring Insights
                                    </h3>

                                    <div className="space-y-6">
                                        <InsightRow label="Excellent" range="30+ / 6+" color="text-emerald-600 bg-emerald-50" />
                                        <InsightRow label="Average" range="25-29 / 4-5" color="text-copper-600 bg-copper-50" />
                                        <InsightRow label="Weak" range="< 25 / < 4" color="text-rose-600 bg-rose-50" />
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-copper-100">
                                        <div className="p-5 rounded-2xl bg-parchment/40 border border-antique italic">
                                            <p className="text-xs text-copper-800 leading-relaxed">
                                                "SAV values represent the 'receptive capacity' of a sign. A planet transiting through high bindu houses triggers significant life events corresponding to that house."
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-copper-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                    <Compass className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 transform group-hover:rotate-45 transition-transform duration-1000" />
                                    <h4 className="font-serif text-xl mb-4">Astro Dashboard Tip</h4>
                                    <p className="text-sm text-copper-200 leading-relaxed mb-6">
                                        Combine these scores with Current Transits in the Workbench for high-precision timing of events (Muhurta).
                                    </p>
                                    <button className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-white transition-colors">
                                        VIEW WORKBENCH <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border border-copper-200 p-12 text-center">
                            <Compass className="w-20 h-20 text-copper-200 mx-auto mb-6 animate-spin-slow" />
                            <h3 className="text-2xl font-serif text-copper-900 mb-2">Divisional Varga summary coming soon</h3>
                            <p className="text-copper-500 max-w-md mx-auto">We are precisely calculating the shodasha varga (16 divisional charts) strength matrix for this profile.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const InsightRow = ({ label, range, color }: { label: string; range: string; color: string }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-copper-700">{label}</span>
        <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest", color)}>
            {range}
        </span>
    </div>
);
