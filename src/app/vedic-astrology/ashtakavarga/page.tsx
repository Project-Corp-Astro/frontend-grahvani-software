"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    RefreshCw,
    Info,
    LayoutGrid,
    Map as MapIcon,
    Loader2,
    Zap,
    Compass,
    Grid3X3
} from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useAshtakavarga } from '@/hooks/queries/useCalculations';
import { cn } from '@/lib/utils';
import NorthIndianChart from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import AshtakavargaChart from '@/components/astrology/AshtakavargaChart';
import ShodashaVargaTable from '@/components/astrology/ShodashaVargaTable';
import TemporalRelationshipTable from '@/components/astrology/TemporalRelationshipTable';
import KarakaStrengthAnalysis from '@/components/astrology/KarakaStrengthAnalysis';

const SIGN_MAP: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

interface AshtakavargaData {
    sarva?: any;
    bhinna?: any;
    shodasha?: any;
    temporal?: any;
    karaka?: any;
    ascendant?: number;
}

const PLANETS = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
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
        <h4 className="text-sm font-serif font-bold text-copper-950 mb-2">{title}</h4>
        <p className="text-[10px] text-copper-600 leading-relaxed">{desc}</p>
    </div>
);

import { parseChartData } from '@/lib/chart-helpers';

export default function AshtakavargaPage() {
    const queryClient = useQueryClient();
    const { clientDetails, processedCharts, isLoadingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [activeTab, setActiveTab] = useState<'sarva' | 'bhinna' | 'shodasha' | 'temporal' | 'karaka'>('sarva');
    const [selectedPlanet, setSelectedPlanet] = useState<string>('Lagna');

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Replaced slow useAshtakavarga hooks with instant pre-fetched data from context
    const { data, loading } = React.useMemo(() => {
        const sarvaKey = `ashtakavarga_sarva_${activeSystem}`;
        const bhinnaKey = `ashtakavarga_bhinna_${activeSystem}`;
        const shodashaKey = `ashtakavarga_shodasha_${activeSystem}`;
        const shodashaKpKey = `shodasha_varga_signs_${activeSystem}`;
        const d1Key = `D1_${activeSystem}`;

        const sarvaRaw = processedCharts[sarvaKey]?.chartData;
        const bhinnaRaw = processedCharts[bhinnaKey]?.chartData;
        const shodashaRaw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
        const temporalRaw = processedCharts[`tatkalik_maitri_chakra_${activeSystem}`]?.chartData;
        const karakaRaw = processedCharts[`karaka_strength_${activeSystem}`]?.chartData;
        const d1Raw = processedCharts[d1Key]?.chartData;

        // Still loading if context is empty and client is active
        if (!sarvaRaw && !bhinnaRaw && !shodashaRaw && isLoadingCharts) {
            return { data: null, loading: true };
        }

        // Get ascendant via robust parser
        const { ascendant } = parseChartData(d1Raw);

        return {
            loading: false,
            data: {
                sarva: sarvaRaw?.data || sarvaRaw,
                bhinna: bhinnaRaw?.data || bhinnaRaw,
                shodasha: shodashaRaw?.data || shodashaRaw,
                temporal: temporalRaw?.data || temporalRaw,
                karaka: karakaRaw?.data || karakaRaw,
                ascendant
            }
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    /* Removed fetchAshtakavarga and useEffect */

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Shield className="w-16 h-16 text-copper-300 mb-4 animate-pulse" />
                <h2 className="text-lg font-serif text-copper-900 mb-2">No Client Selected</h2>
                <p className="text-xs text-copper-600 max-w-md">Please select a client from the workbench to analyze their Ashtakavarga strengths.</p>
            </div>
        );
    }

    const houseValues: Record<number, number> = {};
    const ascSign = data?.ascendant || 1;

    if (data) {
        let scores: Record<number, number> = {};

        if (activeTab === 'sarva' && data.sarva) {
            const sarvaData = data.sarva.sarvashtakavarga || data.sarva.ashtakvarga || data.sarva;
            const signs = sarvaData.signs || sarvaData.houses_matrix || sarvaData.houses || {};

            Object.entries(signs).forEach(([s, v]) => {
                const signId = SIGN_MAP[s] || SIGN_MAP[s.charAt(0).toUpperCase() + s.slice(1)] ||
                    (s.startsWith('House') ? ((ascSign + parseInt(s.split(' ')[1]) - 2) % 12) + 1 : parseInt(s));

                if (signId && signId >= 1 && signId <= 12) {
                    scores[signId] = v as number;
                }
            });
        } else if (activeTab === 'bhinna' && data.bhinna) {
            const bhinnaRoot = data.bhinna.bhinnashtakavarga || data.bhinna.ashtakvarga || data.bhinna;
            const planetKey = selectedPlanet === 'Lagna' ? 'Ascendant' : selectedPlanet;

            // Handle array of tables from some backend versions
            const tables = bhinnaRoot.tables || [];
            const specificTable = Array.isArray(tables) ? tables.find((t: any) => t.planet === planetKey || t.planet === selectedPlanet) : null;

            // Priority: direct total_bindus array > 'total' field in matrix > 'total_bindus' field in matrix
            let planetData = specificTable?.total_bindus || bhinnaRoot[planetKey] || bhinnaRoot[planetKey.toLowerCase()] || {};

            // If planetData contains a 'total' or 'total_bindus' property, that's our BAV scores
            if (planetData && typeof planetData === 'object' && !Array.isArray(planetData)) {
                if (planetData.total) planetData = planetData.total;
                else if (planetData.total_bindus) planetData = planetData.total_bindus;
                else if (planetData.bindus && Array.isArray(planetData.bindus)) planetData = planetData.bindus;
            }

            if (Array.isArray(planetData)) {
                planetData.forEach((v, idx) => { scores[idx + 1] = v; });
            } else {
                Object.entries(planetData).forEach(([s, v]) => {
                    const signId = SIGN_MAP[s] || SIGN_MAP[s.charAt(0).toUpperCase() + s.slice(1)] || parseInt(s);
                    if (signId && signId >= 1 && signId <= 12) {
                        scores[signId] = (typeof v === 'number' ? v : (v as any).total) || 0;
                    }
                });
            }
        }

        if (Object.keys(scores).length > 0 && ascSign) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascSign + h - 2) % 12) + 1;
                houseValues[h] = scores[s] || 0;
            }
        }
    }

    return (
        <div className="-mt-2 lg:-mt-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary">
                        Ashtakavarga Systems
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-softwhite p-1 rounded-xl border border-antique overflow-x-auto">
                        {(['sarva', 'bhinna', 'shodasha', 'temporal', 'karaka'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-3 py-1 rounded-lg text-sm font-semibold font-sans capitalize transition-all whitespace-nowrap",
                                    activeTab === tab
                                        ? "bg-gold-primary text-primary shadow-sm scale-[1.02]"
                                        : "text-secondary hover:bg-gold-primary/10 hover:text-primary"
                                )}
                            >
                                {tab === 'sarva' ? 'Sarvashtakavarga' :
                                    tab === 'bhinna' ? 'Bhinnashtakavarga' :
                                        tab === 'shodasha' ? 'Shodasha' :
                                            tab === 'temporal' ? 'Tatkalik Maitri' : 'Karaka Strength'}
                            </button>
                        ))}
                    </div>

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
                <div className="space-y-4">
                    {activeTab === 'sarva' || activeTab === 'bhinna' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-12 space-y-4">
                                <div className="bg-softwhite rounded-xl border border-antique shadow-card overflow-hidden">
                                    <div className="p-3 border-b border-antique flex flex-col md:flex-row md:items-center justify-between gap-3 bg-parchment/30">
                                        <div>
                                            <h2 className="text-md font-serif text-primary font-semibold">
                                                {activeTab === 'sarva' ? 'Sarvashtakavarga (SAV)' : `Bhinnashtakavarga: ${selectedPlanet}`}
                                            </h2>
                                            <p className="text-xs text-secondary font-sans mt-0.5">
                                                {activeTab === 'sarva'
                                                    ? 'The collective strength of all planets across the 12 signs/houses.'
                                                    : `Individual contributions to ${selectedPlanet}'s strength in each sign.`}
                                            </p>
                                        </div>

                                        {activeTab === 'bhinna' && (
                                            <div className="flex gap-1.5 bg-parchment/50 p-1 rounded-xl border border-antique overflow-x-auto">
                                                {PLANETS.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPlanet(p)}
                                                        className={cn(
                                                            "px-3 py-1 text-sm font-semibold font-sans rounded-lg transition-all whitespace-nowrap",
                                                            selectedPlanet === p ? "bg-gold-primary text-primary shadow-sm scale-105" : "text-secondary hover:bg-gold-primary/10 hover:text-primary"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 items-start">
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-sans flex items-center gap-2">
                                                <Grid3X3 className="w-3.5 h-3.5" /> Bindu Matrix
                                            </h3>
                                            <AshtakavargaMatrix
                                                type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                data={activeTab === 'sarva' ? data?.sarva : (data?.bhinna?.ashtakvarga?.tables?.find((t: any) =>
                                                    t.planet === selectedPlanet ||
                                                    (selectedPlanet === 'Lagna' && (t.planet === 'Ascendant' || t.planet === 'Lagna'))
                                                ) || data?.bhinna?.bhinnashtakavarga?.[selectedPlanet] || data?.bhinna?.bhinnashtakavarga?.[selectedPlanet.toLowerCase()] || data?.bhinna?.[selectedPlanet.toLowerCase()])}
                                                planet={selectedPlanet}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-sans flex items-center gap-2">
                                                <MapIcon className="w-3.5 h-3.5" /> House Distribution
                                            </h3>
                                            <div className="bg-softwhite rounded-lg border border-antique p-2 flex items-center justify-center">
                                                <AshtakavargaChart
                                                    type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                    ascendantSign={data?.ascendant || 1}
                                                    houseValues={houseValues}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'shodasha' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[calc(100vh-220px)]">
                            <ShodashaVargaTable data={data?.shodasha} className="h-full" />
                        </div>
                    ) : activeTab === 'temporal' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {data?.temporal ? (
                                <TemporalRelationshipTable data={data.temporal} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] bg-softwhite rounded-3xl border border-antique border-dashed p-12 text-center">
                                    <h3 className="text-xl font-serif text-primary font-bold mb-4">No Temporal Relationship Data</h3>
                                    <button
                                        onClick={() => clientApi.generateChart(clientDetails.id!, 'tatkalik_maitri_chakra', activeSystem as any).then(() => window.location.reload())}
                                        className="px-8 py-3 bg-gold-primary text-ink rounded-2xl font-bold hover:shadow-xl transition-all"
                                    >
                                        Generate Tatkalik Maitri
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {data?.karaka ? (
                                <KarakaStrengthAnalysis data={data.karaka} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] bg-softwhite rounded-3xl border border-antique border-dashed p-12 text-center">
                                    <h3 className="text-xl font-serif text-primary font-bold mb-4">No Karaka Strength Data</h3>
                                    <button
                                        onClick={() => clientApi.generateChart(clientDetails.id!, 'karaka_strength', activeSystem as any).then(() => window.location.reload())}
                                        className="px-8 py-3 bg-gold-primary text-ink rounded-2xl font-bold hover:shadow-xl transition-all"
                                    >
                                        Generate Karaka Strength
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


