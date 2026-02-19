"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                <Orbit className="w-12 h-12 text-primary mb-4" />
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
        <div className="-mt-2 lg:-mt-4 space-y-2 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary">Shadbala</h1>
                </div>
                <div className="flex items-center gap-4">

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
                    <Orbit className="w-10 h-10 text-primary mx-auto mb-4" />
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
        <div className="space-y-4">
            {/* Top Section: Quick Insights & Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Summary Cards */}
                <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-antique p-4 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <h3 className="text-xs font-bold text-primary tracking-wider">Strongest</h3>
                            </div>
                            <div className="flex items-baseline gap-2 mt-auto">
                                <span className="text-lg font-bold text-primary">{strongest.planet}</span>
                                <span className="text-xs font-bold text-emerald-600">{strongest.rupaBala.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-antique p-4 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                <h3 className="text-xs font-bold text-primary tracking-wider">Weakest</h3>
                            </div>
                            <div className="flex items-baseline gap-2 mt-auto">
                                <span className="text-lg font-bold text-primary">{weakest.planet}</span>
                                <span className="text-xs font-bold text-rose-500">{weakest.rupaBala.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Main Profiles & Auspicious Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Shadbala Strength Profile - Refined to 2 Columns */}
                <div className="lg:col-span-8 bg-white border border-antique rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-antique bg-parchment/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-gold-primary" />
                            <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Planetary Strength Profile</h3>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 flex-1">
                        {displayData.planets.map((p) => {
                            const theme = PLANET_THEMES[p.planet];
                            const scorePercentage = Math.min((p.rupaBala / 10) * 100, 100);
                            const minRequiredRupa = p.minBalaRequired / 60;
                            const minPercentage = (minRequiredRupa / 10) * 100;

                            return (
                                <div key={p.planet} className="relative group p-2 rounded-xl transition-all hover:bg-parchment/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-base shadow-sm border transition-transform group-hover:scale-110", theme.bg, theme.text, theme.border)}>
                                                {p.planet[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{p.planet}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] font-bold tracking-tighter">Rank #{p.rank}</span>
                                                    <span className={cn(
                                                        "text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-widest",
                                                        p.isStrong ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                                    )}>
                                                        {p.isStrong ? "Potent" : "Weak"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold font-sans" style={{ color: 'var(--ink)' }}>{p.rupaBala.toFixed(2)}</span>
                                            <span className="text-[9px] font-bold ml-1">Rp</span>
                                        </div>
                                    </div>

                                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${scorePercentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full shadow-inner"
                                            style={{ backgroundColor: theme.color }}
                                        />
                                        <div
                                            className="absolute top-0 bottom-0 w-[2px] bg-red-400 z-10"
                                            style={{ left: `${minPercentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-1.5 text-[10px] font-bold tracking-widest">
                                        <span>Ratio: {p.ratio.toFixed(2)}x</span>
                                        <span>Min: {minRequiredRupa.toFixed(1)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Auspicious vs Inauspicious - Compacted into side block */}
                <div className="lg:col-span-4 bg-white border border-antique rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-antique bg-parchment/10">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Ishta & Kashta</h3>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                        {displayData.planets.map(p => {
                            if (!p.ishtaKashta) return null;
                            const ishtaVal = p.ishtaKashta.ishta;
                            const kashtaVal = p.ishtaKashta.kashta;
                            const total = Math.max(ishtaVal + kashtaVal, 1);
                            const ishtaWidth = (ishtaVal / total) * 100;

                            return (
                                <div key={`phala-${p.planet}`} className="group">
                                    <div className="flex justify-between items-center mb-1.5 px-0.5">
                                        <span className="text-xs font-bold text-primary tracking-tight">{p.planet}</span>
                                        <div className="flex gap-2 text-[10px] font-bold tracking-tighter">
                                            <span className="text-emerald-600">I: {ishtaVal.toFixed(1)}</span>
                                            <span className="text-rose-500">K: {kashtaVal.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner group-hover:scale-[1.02] transition-transform">
                                        <div className="h-full bg-emerald-500" style={{ width: `${ishtaWidth}%` }} />
                                        <div className="h-full bg-rose-500 flex-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Analytical Table breakdown */}
            <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-antique bg-parchment/5 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Six-Fold Virupa Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-antique">
                                <th className="p-4 font-bold text-[12px] tracking-widest text-primary">Source Components</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Positional</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Directional</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Temporal</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Motional</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Natural</th>
                                <th className="p-4 text-[12px] font-bold text-primary text-center">Aspectual</th>
                                <th className="p-4 text-[12px] font-bold text-gold-dark text-center bg-gold-primary/5 tracking-widest">Total Virupa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlanets.map((p) => (
                                <tr key={`table-${p.planet}`} className="border-b border-antique last:border-0 hover:bg-parchment/5 transition-colors">
                                    <td className="p-4 font-bold text-primary text-sm">{p.planet}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.sthalaBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.digBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.kalaBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.cheshtaBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.naisargikaBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-primary">{p.drikBala.toFixed(0)}</td>
                                    <td className="p-4 text-xs font-bold text-center text-gold-dark bg-gold-primary/5 tracking-tight">{p.totalBala.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
