"use client";

import React, { useEffect, useState } from 'react';
import NorthIndianChart, { ChartWithPopup, Planet } from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Clock,
    MapPin,
    TrendingUp,
    Sparkles,
    ArrowRight,
    Activity,
    Maximize2,
    AlertTriangle,
    CheckCircle2,
    User,
    Edit3,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';

const signNameToId: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const indexToSignId = (varga: string) => {
    if (varga === "D9") return 5;
    return 8;
};

const MOCK_PLANETS = [
    { name: 'Su', signId: 8, degree: '22°' },
    { name: 'Mo', signId: 8, degree: '05°' },
    { name: 'Ma', signId: 8, degree: '12°', retrograde: true },
    { name: 'Me', signId: 9, degree: '08°', combust: true },
    { name: 'Ju', signId: 3, degree: '15°', exalted: true },
    { name: 'Ve', signId: 6, degree: '18°' },
    { name: 'Sa', signId: 11, degree: '03°', retrograde: true },
    { name: 'Ra', signId: 8, degree: '25°' },
    { name: 'Ke', signId: 2, degree: '25°' },
];

export default function VedicOverviewPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();
    const [zoomedChart, setZoomedChart] = React.useState<{ varga: string, label: string } | null>(null);

    if (!clientDetails) return null;

    // Data States
    const [charts, setCharts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notes, setNotes] = React.useState("Client anxious about job change. Saturn return approaching in 2026. Focus on career stability.");

    // Fetch Charts
    const fetchCharts = async () => {
        const clientId = clientDetails?.id;
        if (!clientId) return;

        try {
            setIsLoading(true);
            const data = await clientApi.getCharts(clientId);
            setCharts(data || []);

            // AUTO-GENERATE if no charts found for any system
            if (!data || data.length === 0) {
                await handleGenerateCharts();
            }
        } catch (err) {
            console.error("Failed to fetch charts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCharts = async () => {
        const clientId = clientDetails?.id;
        if (!clientId || isGenerating) return;

        try {
            setIsGenerating(true);
            // Trigger bulk core generation (D1, D9 all systems)
            await clientApi.generateCoreCharts(clientId);

            // Refresh charts after generation
            const updatedData = await clientApi.getCharts(clientId);
            setCharts(updatedData || []);
        } catch (err) {
            console.error("Failed to generate charts:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!clientDetails?.id) return;
        fetchCharts();
    }, [clientDetails?.id]);

    // Calculate age from DOB
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const age = calculateAge(clientDetails.dateOfBirth);

    // Filter charts based on Settings
    const activeSystem = settings.ayanamsa.toLowerCase(); // 'lahiri', 'raman', 'kp'

    const getChartData = (varga: string): { planets: Planet[], ascendant: number } => {
        const chart = charts.find(c => {
            // Check system in config or fallback (legacy charts might not have config)
            const sys = c.chartConfig?.system || 'lahiri';
            return c.chartType === varga && sys.toLowerCase() === activeSystem;
        });

        if (!chart || !chart.chartData) return { planets: [], ascendant: 1 };

        // Mapper logic
        try {
            const data = chart.chartData;
            if (!data) return { planets: [], ascendant: 1 };

            const planetaryPositions = data.planetary_positions || {};
            const planets: Planet[] = Object.keys(planetaryPositions).map(key => {
                const p = planetaryPositions[key];
                return {
                    name: key.substring(0, 2), // 'Sun' -> 'Su', 'Moon' -> 'Mo'
                    signId: signNameToId[p.sign] || 1,
                    degree: p.degrees || '0°',
                    retrograde: p.retrograde || false
                };
            });

            const ascendantSign = signNameToId[data.ascendant?.sign] || 1;

            return { planets, ascendant: ascendantSign };
        } catch (e) {
            console.error("Failed to map chart data", e);
            return { planets: [], ascendant: 1 };
        }
    };

    const d1Data = getChartData("D1");
    const d9Data = getChartData("D9");

    const displayPlanetsD1 = d1Data.planets.length > 0 ? d1Data.planets : MOCK_PLANETS;
    const displayAscendantD1 = d1Data.planets.length > 0 ? d1Data.ascendant : 8;

    const displayPlanetsD9 = d9Data.planets.length > 0 ? d9Data.planets : MOCK_PLANETS;
    const displayAscendantD9 = d9Data.planets.length > 0 ? d9Data.ascendant : 5; // Default Leo for D9 demo

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ... Existing JSX ... */}
            {/* 1. COMPACT CLIENT HEADER */}
            <div className="bg-softwhite border border-antique rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center text-white font-serif font-bold text-xl">
                        {clientDetails.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-serif font-bold text-ink">{clientDetails.name}</h1>
                            <span className="text-xs text-muted bg-parchment px-2 py-0.5 rounded-full border border-antique">
                                {age} yrs • {clientDetails.gender}
                            </span>
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-semibold text-green-700 uppercase">Active • {settings.ayanamsa}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {clientDetails.dateOfBirth}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {clientDetails.timeOfBirth}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {clientDetails.placeOfBirth.city}</span>
                        </div>
                    </div>
                </div>
                <Link href="/vedic-astrology/workbench" className="px-5 py-2.5 bg-gold-primary text-ink rounded-lg font-semibold text-sm hover:bg-gold-soft transition-colors flex items-center gap-2">
                    Analytical Workbench
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* 2. CORE SIGNATURES - Compact Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SignatureCard label="Lagna" value="Scorpio" sub="Mars, Ketu, Rahu" />
                <SignatureCard label="Moon Sign" value={clientDetails.rashi || "Scorpio"} sub="Anuradha Pada 3" highlight />
                <SignatureCard label="Sun Sign" value="Capricorn" sub="22° 14'" />
                <SignatureCard label="Nakshatra Lord" value="Saturn" sub="Shani" />
            </div>

            {/* 3. MAIN GRID - Charts + Dasha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* LEFT: D1 + D9 Charts */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <ChartCard
                        varga="D1"
                        label={`Rashi Chart (${settings.ayanamsa})`}
                        ascendantSign={displayAscendantD1}
                        planets={displayPlanetsD1}
                        onZoom={() => setZoomedChart({ varga: "D1", label: "Rashi Chart" })}

                    />
                    {settings.ayanamsa !== 'KP' && (
                        <ChartCard
                            varga="D9"
                            label="Navamsha"
                            ascendantSign={displayAscendantD9}
                            planets={displayPlanetsD9}
                            onZoom={() => setZoomedChart({ varga: "D9", label: "Navamsha Chart" })}
                        />
                    )}
                </div>

                {/* RIGHT: Dasha Timeline */}
                <div className="lg:col-span-5 bg-softwhite border border-antique rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-serif font-bold text-lg text-ink">Vimshottari Dasha</h3>
                            <p className="text-[10px] text-gold-dark uppercase tracking-widest">Active Lifecycle</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                            <span className="text-red-600 text-xs font-semibold">Change in 45 days</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <DashaRow level="Mahadasha" planet="Ketu" ends="Dec 2026" active />
                        <DashaRow level="Antardasha" planet="Mars" ends="Jun 2025" active />
                        <DashaRow level="Pratyantardasha" planet="Mercury" ends="Feb 2025" />
                    </div>

                    <Link href="/vedic-astrology/dashas" className="mt-4 flex items-center justify-center gap-2 text-gold-dark text-sm hover:text-gold-primary transition-colors py-2 border-t border-antique">
                        <TrendingUp className="w-4 h-4" />
                        Full Dasha Explorer
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* 4. BOTTOM ROW - Yogas/Doshas + Alerts + Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Yogas & Doshas */}
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-primary" />
                        Key Yogas & Doshas
                    </h3>
                    <div className="space-y-2">
                        <YogaItem type="yoga" name="Gaja Kesari Yoga" desc="Jupiter-Moon • Wisdom, Prosperity" />
                        <YogaItem type="dosha" name="Mangal Dosha" desc="Mars in 7th • Marriage considerations" />
                        <YogaItem type="yoga" name="Budhaditya Yoga" desc="Sun-Mercury • Intelligence" />
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Transit Alerts
                    </h3>
                    <div className="space-y-2">
                        <AlertItem level="high" text="Saturn transit 7th house — relationship pressure" />
                        <AlertItem level="medium" text="Mars Antardasha — increased drive/aggression" />
                        <AlertItem level="low" text="Jupiter in Taurus — career opportunities" />
                    </div>
                </div>

                {/* Editable Notes */}
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-gold-primary" />
                        Session Notes
                    </h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-24 text-sm text-body bg-parchment border border-antique rounded-lg p-3 resize-none focus:outline-none focus:border-gold-primary transition-colors"
                        placeholder="Add consultation notes..."
                    />
                </div>
            </div>

            {/* CHART ZOOM MODAL */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-softwhite border border-antique rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button
                            onClick={() => setZoomedChart(null)}
                            className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-parchment text-muted hover:bg-gold-primary/20 hover:text-ink transition-all text-sm font-medium"
                        >
                            Close
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-serif text-ink font-bold">{zoomedChart.label}</h2>
                            <p className="text-xs text-muted uppercase tracking-widest mt-1">{zoomedChart.varga} Divisional Chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto bg-parchment rounded-2xl p-6 border border-antique">
                            <ChartWithPopup
                                ascendantSign={indexToSignId(zoomedChart.varga)}
                                planets={zoomedChart.varga === 'D9' ? displayPlanetsD9 : displayPlanetsD1}
                                className="bg-transparent border-none"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


// COMPACT HELPER COMPONENTS

function SignatureCard({ label, value, sub, highlight = false }: { label: string; value: string; sub?: string; highlight?: boolean }) {
    return (
        <div className={cn(
            "p-4 rounded-xl border transition-all",
            highlight ? "bg-gold-primary/10 border-gold-primary/40" : "bg-softwhite border-antique"
        )}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-semibold">{label}</p>
            <p className={cn("font-serif font-bold text-lg", highlight ? "text-gold-dark" : "text-ink")}>{value}</p>
            {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
        </div>
    );
}

function ChartCard({ varga, label, ascendantSign, planets, onZoom }: any) {
    return (
        <div className="bg-softwhite border border-antique rounded-xl p-4 hover:border-gold-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-serif font-bold text-ink">{label}</h3>
                    <p className="text-[10px] text-muted uppercase tracking-widest">{varga} Chart</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onZoom(); }}
                    className="p-2 rounded-lg bg-parchment text-muted hover:bg-gold-primary/20 hover:text-ink transition-all"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>
            <div className="aspect-square bg-parchment rounded-lg p-3 border border-antique/50">
                <ChartWithPopup
                    ascendantSign={ascendantSign}
                    planets={planets}
                    className="bg-transparent border-none"
                />
            </div>
        </div>
    );
}

function DashaRow({ level, planet, ends, active = false }: { level: string; planet: string; ends: string; active?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            active ? "bg-gold-primary/10 border-gold-primary/30" : "bg-parchment border-antique/50"
        )}>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-muted">{level}</p>
                <p className="font-serif font-bold text-ink">{planet}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted">ends</p>
                <p className="text-sm font-medium text-ink">{ends}</p>
            </div>
        </div>
    );
}

function YogaItem({ type, name, desc }: { type: "yoga" | "dosha"; name: string; desc: string }) {
    const isYoga = type === "yoga";
    return (
        <div className="flex items-start gap-2">
            {isYoga ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            ) : (
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            )}
            <div>
                <p className="text-sm font-medium text-ink">{name}</p>
                <p className="text-xs text-muted">{desc}</p>
            </div>
        </div>
    );
}

function AlertItem({ level, text }: { level: "high" | "medium" | "low"; text: string }) {
    const colors = {
        high: "bg-red-50 border-red-200 text-red-700",
        medium: "bg-orange-50 border-orange-200 text-orange-700",
        low: "bg-green-50 border-green-200 text-green-700"
    };
    return (
        <div className={cn("text-xs p-2 rounded-lg border", colors[level])}>
            {text}
        </div>
    );
}
