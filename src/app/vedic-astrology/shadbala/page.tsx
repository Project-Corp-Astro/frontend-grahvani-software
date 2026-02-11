"use client";

import React, { useState, useEffect } from 'react';
import {
    Orbit,
    ArrowLeft,
    Zap,
    Shield,
    Clock,
    Compass,
    Star,
    BarChart2,
    AlertTriangle,
    Loader2,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Info,
    CheckCircle2,
    Layers,
    Smile,
    Frown,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";

// ============================================================================
// Shadbala Types & Interfaces
// ============================================================================

interface IshtaKashta {
    ishta: number;
    kashta: number;
}

interface ShadbalaPlanet {
    planet: string;
    sthalaBala: number;   // Positional
    digBala: number;      // Directional
    kalaBala: number;     // Temporal
    cheshtaBala: number;  // Motional
    naisargikaBala: number; // Natural
    drikBala: number;     // Aspectual
    totalBala: number;    // Total in Virupas
    rupaBala: number;     // Total in Rupas (total/60)
    minBalaRequired: number;
    ratio: number;
    rank: number;
    isStrong: boolean;
    ishtaKashta?: IshtaKashta;
}

interface ShadbalaData {
    planets: ShadbalaPlanet[];
    ayanamsa: string;
    system: string;
    raw?: any; // To store original response if needed
}

// Planet Themes for Professional UI
const PLANET_THEMES: Record<string, { color: string, bg: string, text: string, border: string, iconColor: string }> = {
    'Sun': { color: '#F97316', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', iconColor: 'text-orange-500' },
    'Moon': { color: '#64748B', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', iconColor: 'text-slate-400' },
    'Mars': { color: '#EF4444', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', iconColor: 'text-red-500' },
    'Mercury': { color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', iconColor: 'text-emerald-500' },
    'Jupiter': { color: '#EAB308', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', iconColor: 'text-yellow-600' },
    'Venus': { color: '#D946EF', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', iconColor: 'text-pink-500' },
    'Saturn': { color: '#334155', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', iconColor: 'text-gray-600' }
};

// ============================================================================
// Shadbala Page Component
// ============================================================================

export default function ShadbalaPage() {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ShadbalaData | null>(null);
    const [rawResponse, setRawResponse] = useState<any>(null);

    const clientId = clientDetails?.id || '';

    // Standard Minimum Rupa Requirements
    const MIN_BALA_REQUIREMENTS: Record<string, number> = {
        'Sun': 6.5,
        'Moon': 6.0,
        'Mars': 5.0,
        'Mercury': 7.0,
        'Jupiter': 6.5,
        'Venus': 7.5,
        'Saturn': 5.0
    };

    /**
     * Normalizes complex Python engine response to clean frontend types
     */
    const normalizeShadbalaData = (raw: any): ShadbalaData => {
        const planets: ShadbalaPlanet[] = [];
        const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

        planetKeys.forEach(p => {
            const details = raw[`${p}_details`] || {};
            const virupas = raw.shadbala_virupas?.[p] || 0;
            const rupas = raw.shadbala_rupas?.[p] || 0;
            const rank = raw.relative_rank?.[p] || 0;
            const strength = raw.strength_summary?.[p] || 'Weak';
            const ishKas = raw.ishta_kashta_phala?.[p] || { Ishta: 0, Kashta: 0 };

            // Calculate Temporal (Kala) Bala from sub-components
            const kalaComponents = [
                details['Ayana Bala'] || 0,
                details['Natonnata Bala'] || 0,
                details['Paksha Bala'] || 0,
                details['Tri-Bhaga Bala'] || 0,
                details['Kaala_Dina_Bala'] || 0,
                details['Varsha_Bala'] || 0,
                details['Maasa_Bala'] || 0,
                details['Vaara_Bala'] || 0,
                details['Hora_Bala'] || 0
            ];
            const kalaBala = kalaComponents.reduce((a, b) => a + b, 0);

            const minRequired = MIN_BALA_REQUIREMENTS[p] || 6.0;

            planets.push({
                planet: p,
                sthalaBala: details['STHANA TOTAL'] || 0,
                digBala: details['Dig Bala'] || 0,
                kalaBala: kalaBala,
                cheshtaBala: details['Chesta Bala'] || 0,
                naisargikaBala: details['Naisargika Bala'] || 0,
                drikBala: details['Drik Bala'] || 0,
                totalBala: virupas,
                rupaBala: rupas,
                minBalaRequired: minRequired * 60, // Convert to Virupas
                ratio: rupas / minRequired,
                rank: rank,
                isStrong: strength === 'Strong',
                ishtaKashta: {
                    ishta: ishKas.Ishta || 0,
                    kashta: ishKas.Kashta || 0
                }
            });
        });

        return {
            planets,
            ayanamsa: raw.meta?.ayanamsa || 'Lahiri',
            system: 'Chitrapaksha',
            raw: raw
        };
    };

    const fetchShadbala = async (force: boolean = false) => {
        if (!clientId) {
            console.warn("[Shadbala] No clientId found in context, skipping fetch.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log(`[Shadbala] Fetching data for client: ${clientId}...`);
            const result = await clientApi.getShadbala(clientId);
            console.log("[Shadbala] FULL Result Object:", result);

            // Robust extraction: Handle nested data structure
            const rawData = result.data?.data || result.chartData?.data || result.data || result.chartData || result;
            console.log("[Shadbala] EXTRACTED rawData for normalization:", rawData);

            setRawResponse(result); // Store FULL result for debug console (to see cached flag)

            if (rawData && rawData.shadbala_virupas) {
                console.info("[Shadbala] shadbala_virupas found. Normalizing...");
                const normalized = normalizeShadbalaData(rawData);
                setData(normalized);
            } else {
                console.warn("[Shadbala] Data received, but 'shadbala_virupas' missing.");
                setData(null);
            }
        } catch (err: any) {
            console.error("[Shadbala] Fetch error:", err);
            setError(err.message || "Failed to calculate Shadbala strengths");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ayanamsa === 'Lahiri' && clientId) {
            fetchShadbala();
        }
    }, [clientId, ayanamsa]);

    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Orbit className="w-12 h-12 text-primary mb-4 opacity-20" />
                <h2 className="text-xl font-serif font-bold text-primary mb-2">Shadbala Analysis — Lahiri Only</h2>
                <p className="text-primary text-sm max-w-md">
                    Shadbala (Six-fold planetary strength) analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                </p>
                <Link href="/vedic-astrology/overview" className="mt-6 text-sm font-medium text-gold-dark hover:text-gold-primary transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Kundali
                </Link>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-primary text-xs mb-1">
                        <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors">Kundali</Link>
                        <span>/</span>
                        <span>Shadbala</span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
                        <Orbit className="w-7 h-7 text-gold-primary" />
                        Shadbala — Planetary Strengths
                    </h1>
                    <p className="text-sm text-primary mt-1">
                        Comprehensive six-fold strength analysis for <span className="font-medium text-primary">{clientDetails.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchShadbala(true)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-antique rounded-xl text-sm font-medium text-primary hover:text-gold-dark hover:border-gold-primary/30 transition-all disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Recalculate
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-parchment/30 rounded-3xl border border-antique">
                    <Loader2 className="w-10 h-10 text-gold-primary animate-spin mb-4" />
                    <p className="text-sm font-serif text-primary italic tracking-wide">Calculating celestial potencies...</p>
                </div>
            ) : error ? (
                <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-red-900 font-bold font-serif text-lg mb-2">Calculation Error</h3>
                    <p className="text-sm text-red-600 max-w-md mx-auto mb-6">{error}</p>
                    <button onClick={() => fetchShadbala(true)} className="px-6 py-2.5 bg-red-100 text-red-700 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors">
                        Retry Calculation
                    </button>
                </div>
            ) : data?.planets ? (
                <ShadbalaDashboard displayData={data} rawResponse={rawResponse} />
            ) : (
                <div className="p-10 bg-parchment/30 border border-antique rounded-3xl text-center lg:py-32">
                    <Orbit className="w-10 h-10 text-primary mx-auto mb-4 opacity-30" />
                    <p className="text-sm text-primary">No Shadbala data found for this chart.</p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Enhanced Dashboard Sub-component
// ============================================================================

function ShadbalaDashboard({ displayData, rawResponse }: { displayData: ShadbalaData, rawResponse: any }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    return (
        <div className="space-y-8">
            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-antique p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Strongest</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mt-auto">
                            <span className="text-2xl font-serif font-bold text-primary">{strongest.planet}</span>
                            <span className="text-sm font-bold text-emerald-600">{strongest.rupaBala.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-antique p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Weakest</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mt-auto">
                            <span className="text-2xl font-serif font-bold text-primary">{weakest.planet}</span>
                            <span className="text-sm font-bold text-red-500">{weakest.rupaBala.toFixed(2)}</span>
                        </div>
                    </div>
                </div>


            </div>

            {/* Visual Strength Bars */}
            <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-antique bg-parchment/10 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-primary flex items-center gap-2 text-lg">
                        <BarChart2 className="w-5 h-5 text-gold-primary" />
                        Shadbala Strength Profile
                    </h3>
                </div>
                <div className="p-8 space-y-8">
                    {displayData.planets.map((p) => {
                        const theme = PLANET_THEMES[p.planet];
                        const scorePercentage = Math.min((p.rupaBala / 10) * 100, 100);
                        const minRequiredRupa = p.minBalaRequired / 60;
                        const minPercentage = (minRequiredRupa / 10) * 100;

                        return (
                            <div key={p.planet} className="relative">
                                <div className="flex items-end justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-lg shadow-sm border", theme.bg, theme.text, theme.border)}>
                                            {p.planet[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-primary leading-none">{p.planet}</h4>
                                            <p className="text-[10px] text-primary font-medium uppercase tracking-tighter mt-1">Rank #{p.rank} • {p.isStrong ? "POTENT" : "WEAK"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold font-serif text-primary">{p.rupaBala.toFixed(2)}</span>
                                        <span className="text-[10px] font-bold text-primary ml-1 uppercase">Rupas</span>
                                    </div>
                                </div>
                                <div className="relative h-5 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                    {/* Sub-Bala segments (optional visualization) - Here we just use a gradient */}
                                    <div
                                        className="h-full transition-all duration-1000 ease-out flex shadow-inner shadow-black/5"
                                        style={{ width: `${scorePercentage}%`, backgroundColor: theme.color }}
                                    />

                                    {/* Requirement Marker */}
                                    <div
                                        className="absolute top-0 bottom-0 w-[3px] bg-red-400/80 z-10 border-r border-white/20"
                                        style={{ left: `${minPercentage}%` }}
                                        title={`Required: ${minRequiredRupa}`}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-[9px] font-bold uppercase tracking-widest text-primary">
                                    <span>Ratio: {p.ratio.toFixed(2)}x</span>
                                    <span>Threshold: {minRequiredRupa.toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ishta & Kashta Phala Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-antique bg-parchment/10">
                        <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            Auspicious vs Inauspicious
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {displayData.planets.map(p => {
                            if (!p.ishtaKashta) return null;
                            const ishtaVal = p.ishtaKashta.ishta;
                            const kashtaVal = p.ishtaKashta.kashta;
                            const total = Math.max(ishtaVal + kashtaVal, 1);
                            const ishtaWidth = (ishtaVal / total) * 100;

                            return (
                                <div key={`phala-${p.planet}`}>
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <span className="text-xs font-bold text-primary font-serif">{p.planet}</span>
                                        <div className="flex gap-4 text-[9px] font-bold uppercase">
                                            <span className="text-emerald-600">Ishta: {ishtaVal.toFixed(1)}</span>
                                            <span className="text-red-500">Kashta: {kashtaVal.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${ishtaWidth}%` }} />
                                        <div className="h-full bg-red-500 transition-all duration-1000 flex-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-parchment/30 to-white border border-antique rounded-3xl p-8 h-full flex flex-col justify-center">
                        <h3 className="font-serif font-bold text-primary text-xl mb-4">Interpreting Results</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="p-2 bg-emerald-50 rounded-xl h-fit">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary">Strength Ratios</h4>
                                    <p className="text-xs text-primary leading-relaxed">A ratio {'>'} 1.0 means the planet has exceeded its minimum cosmic requirement. These planets act as pillars of the character.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-2 bg-amber-50 rounded-xl h-fit">
                                    <Layers className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary">Virupa Breakdown</h4>
                                    <p className="text-xs text-primary leading-relaxed">Scroll down to the table to see exactly which of the 6 sources (Directional, Positional, etc.) contribute most to your planets.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-antique">
                                <th className="p-4 font-serif text-sm font-bold text-primary">Planet</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Positional</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Directional</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Temporal</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Motional</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Natural</th>
                                <th className="p-4 text-[10px] font-bold text-primary uppercase text-center">Aspectual</th>
                                <th className="p-4 text-[10px] font-bold text-gold-dark uppercase text-center bg-gold-primary/5">Total (V)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlanets.map((p) => (
                                <tr key={`table-${p.planet}`} className="border-b border-antique last:border-0 hover:bg-parchment/5">
                                    <td className="p-4 font-serif font-bold text-primary">{p.planet}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.sthalaBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.digBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.kalaBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.cheshtaBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.naisargikaBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs text-center text-primary">{p.drikBala.toFixed(1)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-gold-dark bg-gold-primary/5">{p.totalBala.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
