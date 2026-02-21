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
// Planet Symbols for Display
// ============================================================================
const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa'
};

// Bala axis labels for radar chart
const BALA_AXES = [
    { key: 'sthalaBala', label: 'Positional', shortLabel: 'Positional' },
    { key: 'digBala', label: 'Directional', shortLabel: 'Directional' },
    { key: 'kalaBala', label: 'Temporal', shortLabel: 'Temporal' },
    { key: 'cheshtaBala', label: 'Motional', shortLabel: 'Motional' },
    { key: 'naisargikaBala', label: 'Natural', shortLabel: 'Natural' },
    { key: 'drikBala', label: 'Aspectual', shortLabel: 'Aspectual' },
];

// ============================================================================
// Radial Gauge Sub-component
// ============================================================================
function RadialGauge({ planet, rupaBala, minRequired, isStrong, color, rank }: {
    planet: string; rupaBala: number; minRequired: number; isStrong: boolean; color: string; rank: number;
}) {
    const size = 130;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2 - 8;
    const center = size / 2;
    const maxVal = 12; // Rupa scale max for visual
    const circumference = 2 * Math.PI * radius;
    const startAngle = 135; // Start from bottom-left
    const sweepAngle = 270; // Sweep 270 degrees

    const valueAngle = Math.min(rupaBala / maxVal, 1) * sweepAngle;
    const minAngle = Math.min(minRequired / maxVal, 1) * sweepAngle;

    const polarToCartesian = (angleDeg: number) => {
        const angleRad = ((angleDeg + startAngle) * Math.PI) / 180;
        return {
            x: center + radius * Math.cos(angleRad),
            y: center + radius * Math.sin(angleRad),
        };
    };

    const describeArc = (startDeg: number, endDeg: number) => {
        const start = polarToCartesian(startDeg);
        const end = polarToCartesian(endDeg);
        const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    const minTick = polarToCartesian(minAngle);
    const minTickInner = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius - strokeWidth / 2 - 4;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();
    const minTickOuter = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius + strokeWidth / 2 + 4;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center group"
        >
            <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background arc */}
                    <path d={describeArc(0, sweepAngle)} fill="none" stroke="#e8e0d0" strokeWidth={strokeWidth} strokeLinecap="round" />
                    {/* Value arc */}
                    <motion.path
                        d={describeArc(0, valueAngle)}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                    />
                    {/* Min threshold tick */}
                    <line
                        x1={minTickInner.x} y1={minTickInner.y}
                        x2={minTickOuter.x} y2={minTickOuter.y}
                        stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round"
                    />
                    {/* Planet symbol in center */}
                    <text x={center} y={center - 6} textAnchor="middle" dominantBaseline="central"
                        fontSize="24" fill={color} fontWeight="700" style={{ fontFamily: 'serif' }}>
                        {PLANET_SYMBOLS[planet]}
                    </text>
                    {/* Rupa value */}
                    <text x={center} y={center + 18} textAnchor="middle" dominantBaseline="central"
                        fontSize="13" fill="#3E2A1F" fontWeight="800">
                        {rupaBala.toFixed(2)}
                    </text>
                    <text x={center} y={center + 32} textAnchor="middle" dominantBaseline="central"
                        fontSize="8" fill="#8B7355" fontWeight="700" letterSpacing="1.5">
                        RUPA
                    </text>
                </svg>
            </div>
            <div className="mt-1 text-center">
                <p className="text-xs font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{planet}</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-400">#{rank}</span>
                    <span className={cn(
                        "text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider",
                        isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {isStrong ? "POTENT" : "WEAK"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}


// ============================================================================
// Heatmap Cell Helper
// ============================================================================
function getHeatmapStyle(value: number, maxVal: number): React.CSSProperties {
    if (value < 0) {
        const intensity = Math.min(Math.abs(value) / 50, 1);
        return { backgroundColor: `rgba(239, 68, 68, ${intensity * 0.15})` };
    }
    const intensity = Math.min(value / maxVal, 1);
    return { backgroundColor: `rgba(201, 162, 77, ${intensity * 0.18})` };
}

// ============================================================================
// Enhanced Dashboard Sub-component
// ============================================================================

function ShadbalaDashboard({ displayData, rawResponse }: { displayData: ShadbalaData, rawResponse: any }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    // Compute max values for heatmap scaling
    const tableMaxValues: Record<string, number> = {};
    BALA_AXES.forEach(axis => {
        tableMaxValues[axis.key] = Math.max(...displayData.planets.map(p => Math.abs((p as any)[axis.key] || 0)));
    });

    const strongestTheme = PLANET_THEMES[strongest.planet];
    const weakestTheme = PLANET_THEMES[weakest.planet];

    // Mini ring SVG for summary cards
    const MiniRing = ({ value, max, color }: { value: number; max: number; color: string }) => {
        const r = 22;
        const circumference = 2 * Math.PI * r;
        const pct = Math.min(value / max, 1);
        const dashOffset = circumference * (1 - pct);
        return (
            <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={r} fill="none" stroke="#e8e0d0" strokeWidth="5" />
                <motion.circle
                    cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
                    strokeLinecap="round" strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    transform="rotate(-90 28 28)"
                    style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
                />
                <text x="28" y="28" textAnchor="middle" dominantBaseline="central"
                    fontSize="11" fontWeight="800" fill={color}>
                    {value.toFixed(1)}
                </text>
            </svg>
        );
    };

    return (
        <div className="space-y-5">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: Hero Summary Cards
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-antique p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${strongestTheme.color}10, ${strongestTheme.color}05)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <h3 className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Strongest</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl" style={{ color: strongestTheme.color }}>{PLANET_SYMBOLS[strongest.planet]}</span>
                                <span className="text-xl font-bold font-serif" style={{ color: 'var(--ink)' }}>{strongest.planet}</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-600 mt-1 tracking-wider">
                                {strongest.rupaBala.toFixed(2)} Rupa · Rank #{strongest.rank}
                            </p>
                        </div>
                        <MiniRing value={strongest.rupaBala} max={12} color={strongestTheme.color} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white border border-antique p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${weakestTheme.color}10, ${weakestTheme.color}05)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                <h3 className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Weakest</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl" style={{ color: weakestTheme.color }}>{PLANET_SYMBOLS[weakest.planet]}</span>
                                <span className="text-xl font-bold font-serif" style={{ color: 'var(--ink)' }}>{weakest.planet}</span>
                            </div>
                            <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">
                                {weakest.rupaBala.toFixed(2)} Rupa · Rank #{weakest.rank}
                            </p>
                        </div>
                        <MiniRing value={weakest.rupaBala} max={12} color={weakestTheme.color} />
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Six-Fold Strength Per Planet + Ishta-Kashta Side Panel
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Small Multiples: One card per planet showing 6 bala bars */}
                <div className="lg:col-span-8 bg-white border border-antique rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-antique bg-parchment/10 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-gold-primary" />
                        <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Six-Fold Strength Profile</h3>
                        <span className="text-[9px] ml-auto font-bold text-slate-400 tracking-wider">STRENGTH ACROSS 6 DIMENSIONS</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sortedPlanets.map((p, idx) => {
                            const theme = PLANET_THEMES[p.planet];
                            // Get bala values for this planet
                            const balas = BALA_AXES.map(axis => ({
                                label: axis.shortLabel,
                                value: (p as any)[axis.key] || 0,
                            }));
                            // Find planet-local max for scaling bars within this card
                            const localMax = Math.max(...balas.map(b => Math.abs(b.value)), 1);

                            return (
                                <motion.div
                                    key={`profile-${p.planet}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                                    className="rounded-2xl border p-4 transition-all hover:shadow-md"
                                    style={{ borderColor: `${theme.color}30`, background: `linear-gradient(135deg, ${theme.color}04, transparent)` }}
                                >
                                    {/* Planet Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                                style={{ backgroundColor: theme.color }}>
                                                {PLANET_SYMBOLS[p.planet]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{p.planet}</h4>
                                                <p className="text-[9px] font-bold tracking-wider" style={{ color: theme.color }}>
                                                    {p.rupaBala.toFixed(2)} Rupa · #{p.rank}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider",
                                            p.isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            {p.isStrong ? "STRONG" : "WEAK"}
                                        </span>
                                    </div>

                                    {/* 6 Bala Bars */}
                                    <div className="space-y-2">
                                        {balas.map((bala) => {
                                            const isNegative = bala.value < 0;
                                            const barWidth = Math.min((Math.abs(bala.value) / localMax) * 100, 100);
                                            return (
                                                <div key={bala.label} className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-slate-500 w-[62px] shrink-0 text-right tracking-tight">
                                                        {bala.label}
                                                    </span>
                                                    <div className="flex-1 h-[7px] bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${barWidth}%` }}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                            style={{
                                                                backgroundColor: isNegative ? '#EF4444' : theme.color,
                                                                opacity: isNegative ? 0.7 : 0.85,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[9px] font-bold w-[32px] text-right tabular-nums",
                                                        isNegative ? "text-rose-500" : "text-slate-600"
                                                    )}>
                                                        {bala.value.toFixed(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Ishta & Kashta Phala - Refined */}
                <div className="lg:col-span-4 bg-white border border-antique rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-antique bg-parchment/10">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Ishta & Kashta Phala</h3>
                        </div>
                        <p className="text-[9px] mt-1 text-slate-400 font-bold tracking-wider">AUSPICIOUS vs INAUSPICIOUS STRENGTH</p>
                    </div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-center">
                        {displayData.planets.map(p => {
                            if (!p.ishtaKashta) return null;
                            const theme = PLANET_THEMES[p.planet];
                            const ishtaVal = p.ishtaKashta.ishta;
                            const kashtaVal = p.ishtaKashta.kashta;
                            const total = Math.max(ishtaVal + kashtaVal, 1);
                            const ishtaWidth = (ishtaVal / total) * 100;

                            return (
                                <div key={`phala-${p.planet}`} className="group">
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                        {/* Planet Icon Circle */}
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                                            style={{ backgroundColor: theme.color }}>
                                            {PLANET_SYMBOLS[p.planet]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[11px] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{p.planet}</span>
                                                <div className="flex gap-2 text-[9px] font-bold tracking-tighter">
                                                    <span className="text-emerald-600">I:{ishtaVal.toFixed(1)}</span>
                                                    <span className="text-rose-500">K:{kashtaVal.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex group-hover:scale-[1.02] transition-transform shadow-inner">
                                                <motion.div
                                                    className="h-full rounded-l-full"
                                                    style={{ background: 'linear-gradient(90deg, #10B981, #34D399)', width: `${ishtaWidth}%` }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${ishtaWidth}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                />
                                                <div className="h-full flex-1 rounded-r-full" style={{ background: 'linear-gradient(90deg, #FB7185, #EF4444)' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 pt-2 border-t border-antique/50 mt-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-bold text-slate-500 tracking-wider">ISHTA</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <span className="text-[9px] font-bold text-slate-500 tracking-wider">KASHTA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Radial Gauge Meters
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-antique bg-parchment/10 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-gold-primary" />
                    <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Rupa Strength Overview</h3>
                    <span className="text-[9px] ml-auto font-bold text-slate-400 tracking-wider">RED TICK = MIN. REQUIRED</span>
                </div>
                <div className="p-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {sortedPlanets.map((p) => {
                        const theme = PLANET_THEMES[p.planet];
                        const minRequiredRupa = p.minBalaRequired / 60;
                        return (
                            <RadialGauge
                                key={`gauge-${p.planet}`}
                                planet={p.planet}
                                rupaBala={p.rupaBala}
                                minRequired={minRequiredRupa}
                                isStrong={p.isStrong}
                                color={theme.color}
                                rank={p.rank}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: Heatmap Breakdown Table
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white border border-antique rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-antique bg-parchment/5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink)' }}>Six-Fold Virupa Breakdown</h3>
                    <span className="text-[9px] ml-auto font-bold text-slate-400 tracking-wider">CELL COLOR = RELATIVE STRENGTH</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-antique">
                                <th className="p-4 font-bold text-[11px] tracking-widest text-primary">Planet</th>
                                {BALA_AXES.map(axis => (
                                    <th key={axis.key} className="p-4 text-[11px] font-bold text-primary text-center" title={axis.label}>
                                        {axis.shortLabel}
                                    </th>
                                ))}
                                <th className="p-4 text-[11px] font-bold text-gold-dark text-center bg-gold-primary/5 tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlanets.map((p) => {
                                const theme = PLANET_THEMES[p.planet];
                                return (
                                    <tr key={`table-${p.planet}`} className="border-b border-antique last:border-0 hover:bg-parchment/5 transition-colors">
                                        <td className="p-4 text-sm font-bold" style={{ color: 'var(--ink)' }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base" style={{ color: theme.color }}>{PLANET_SYMBOLS[p.planet]}</span>
                                                {p.planet}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.sthalaBala, tableMaxValues['sthalaBala'])}>{p.sthalaBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.digBala, tableMaxValues['digBala'])}>{p.digBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.kalaBala, tableMaxValues['kalaBala'])}>{p.kalaBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.cheshtaBala, tableMaxValues['cheshtaBala'])}>{p.cheshtaBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.naisargikaBala, tableMaxValues['naisargikaBala'])}>{p.naisargikaBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center" style={getHeatmapStyle(p.drikBala, tableMaxValues['drikBala'])}>{p.drikBala.toFixed(0)}</td>
                                        <td className="p-4 text-xs font-bold text-center text-gold-dark bg-gold-primary/5 tracking-tight">{p.totalBala.toFixed(1)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
