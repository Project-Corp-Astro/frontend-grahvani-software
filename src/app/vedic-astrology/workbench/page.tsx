"use client";

import React, { useState, useEffect } from 'react';
import NorthIndianChart, { Planet } from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Calendar,
    FileText,
    ArrowRight,
    Sparkles,
    Activity,
    Target,
    Eye,
    Loader2,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';

// Sign name to ID mapping
const signNameToId: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const signIdToName: Record<number, string> = Object.fromEntries(
    Object.entries(signNameToId).map(([k, v]) => [v, k])
);

// Chart type human-readable names
const CHART_NAMES: Record<string, string> = {
    'D1': 'Rashi (Birth)',
    'D2': 'Hora (Wealth)',
    'D3': 'Drekkana (Siblings)',
    'D4': 'Chaturthamsha (Fortune)',
    'D7': 'Saptamsha (Children)',
    'D9': 'Navamsha (Marriage)',
    'D10': 'Dashamsha (Career)',
    'D12': 'Dwadashamsha (Parents)',
    'D16': 'Shodashamsha (Vehicles)',
    'D20': 'Vimshamsha (Spirituality)',
    'D24': 'Chaturvimshamsha (Education)',
    'D27': 'Saptavimshamsha (Strength)',
    'D30': 'Trimshamsha (Misfortune)',
    'D40': 'Khavedamsha (Auspiciousness)',
    'D45': 'Akshavedamsha (General)',
    'D60': 'Shashtiamsha (Past Karma)',
};

/**
 * Safe degree formatting - handles null/undefined/NaN/string
 */
function parseDegree(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

function formatDegree(degrees: number | null | undefined): string {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return '';
    const deg = degrees % 30;
    return `${Math.floor(deg)}°`;
}

/**
 * Maps chart API data to Planet[] format for NorthIndianChart
 */
function mapChartDataToPlanets(chartData: any): Planet[] {
    if (!chartData || !chartData.planetary_positions) return [];

    return Object.keys(chartData.planetary_positions).map(key => {
        const p = chartData.planetary_positions[key];
        // Handle different key formats: 'Sun', 'sun', etc.
        const name = key.length <= 3 ? key.charAt(0).toUpperCase() + key.slice(1, 2)
            : key.substring(0, 2);

        // Safely extract degrees - API returns string like "12.34"
        const deg = parseDegree(p?.degrees) ?? parseDegree(p?.longitude) ?? parseDegree(p?.degree);

        return {
            name,
            signId: signNameToId[p?.sign] || 1,
            degree: formatDegree(deg),
            isRetro: p?.retrograde || false,
        };
    });
}

export default function AnalyticalWorkbenchPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();

    const [charts, setCharts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChartType, setSelectedChartType] = useState('D1');

    // Get available chart types based on system
    const systemCapabilities = clientApi.getSystemCapabilities(settings.ayanamsa);
    const availableCharts = systemCapabilities.charts.divisional;

    // Fetch charts from API
    const fetchCharts = async () => {
        if (!clientDetails?.id) return;

        try {
            setIsLoading(true);
            const data = await clientApi.getCharts(clientDetails.id);
            setCharts(data || []);

            // Auto-generate if no charts
            if (!data || data.length === 0) {
                await clientApi.generateCoreCharts(clientDetails.id);
                const refreshedData = await clientApi.getCharts(clientDetails.id);
                setCharts(refreshedData || []);
            }
        } catch (err) {
            console.error('Failed to fetch charts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharts();
    }, [clientDetails?.id, settings.ayanamsa]);

    // Get current chart data
    const activeSystem = settings.ayanamsa.toLowerCase();
    const currentChart = charts.find(c =>
        c.chartType === selectedChartType &&
        (c.chartConfig?.system || 'lahiri').toLowerCase() === activeSystem
    );

    const chartData = currentChart?.chartData || null;
    const displayPlanets = chartData ? mapChartDataToPlanets(chartData) : [];
    const ascendantSign = chartData?.ascendant?.sign
        ? signNameToId[chartData.ascendant.sign]
        : 1;

    // Build house analysis from chart data
    const getHouseAnalysis = () => {
        if (!chartData?.houses) return [];

        const houses = chartData.houses || {};
        return Object.entries(houses).slice(0, 3).map(([key, value]: [string, any]) => ({
            house: `${key}`,
            sign: value.sign || 'Unknown',
            planets: value.planets?.join(', ') || '—',
            strength: value.strength > 30 ? 'Strong' : value.strength > 15 ? 'Neutral' : 'Weak'
        }));
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-muted">Please select a client to begin analysis</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Analytical Workbench</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted">Deep analysis tools for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark text-[10px] font-bold uppercase rounded-full border border-gold-primary/30">
                                {settings.ayanamsa}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCharts}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-parchment border border-antique hover:bg-softwhite text-muted disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </button>
                    <Link href="/vedic-astrology/overview" className="px-4 py-2 bg-parchment border border-antique rounded-lg text-sm font-medium text-body hover:bg-softwhite transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Overview
                    </Link>
                </div>
            </div>

            {/* Quick Tools Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickToolCard
                    href="/vedic-astrology/planets"
                    icon={<Activity className="w-5 h-5" />}
                    title="Planetary Strength"
                    desc="Shadbala & Ashtakavarga"
                    disabled={!systemCapabilities.hasAshtakavarga}
                />
                <QuickToolCard
                    href="/vedic-astrology/divisional"
                    icon={<Target className="w-5 h-5" />}
                    title="Divisional Charts"
                    desc={systemCapabilities.hasDivisional ? "D1 to D60 analysis" : "KP: D1 only"}
                    disabled={!systemCapabilities.hasDivisional}
                />
                <QuickToolCard
                    href="/vedic-astrology/dashas"
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="Dasha Explorer"
                    desc="Timeline predictions"
                />
                <QuickToolCard
                    href="/vedic-astrology/transits"
                    icon={<Calendar className="w-5 h-5" />}
                    title="Transit Analysis"
                    desc="Current planetary impact"
                />
            </div>

            {/* Main Workbench Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Interactive Chart */}
                <div className="lg:col-span-2 bg-softwhite border border-antique rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif font-bold text-ink">Interactive Chart</h2>
                        <select
                            className="text-sm bg-parchment border border-antique rounded-lg px-3 py-1.5 text-body focus:outline-none focus:border-gold-primary"
                            value={selectedChartType}
                            onChange={(e) => setSelectedChartType(e.target.value)}
                        >
                            {availableCharts.map((chart: string) => (
                                <option key={chart} value={chart}>
                                    {chart} - {CHART_NAMES[chart] || chart}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="aspect-square max-w-md mx-auto bg-parchment rounded-xl p-4 border border-antique/50 relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
                            </div>
                        ) : displayPlanets.length > 0 ? (
                            <NorthIndianChart
                                ascendantSign={ascendantSign}
                                planets={displayPlanets}
                                className="bg-transparent border-none"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <p className="font-serif text-muted mb-2">No chart data available</p>
                                <button
                                    onClick={() => clientApi.generateChart(clientDetails.id!, selectedChartType, activeSystem).then(fetchCharts)}
                                    className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-medium hover:bg-gold-dark"
                                >
                                    Generate {selectedChartType} Chart
                                </button>
                            </div>
                        )}
                    </div>

                    {currentChart && (
                        <p className="text-center text-[10px] text-muted mt-3">
                            Last calculated: {new Date(currentChart.calculatedAt).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Analysis Panel */}
                <div className="space-y-4">
                    <div className="bg-softwhite border border-antique rounded-xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-primary" />
                            House Focus
                        </h3>
                        <p className="text-sm text-muted mb-3">Based on {selectedChartType} chart</p>
                        <div className="space-y-2">
                            {chartData?.houses ? (
                                getHouseAnalysis().map((h, i) => (
                                    <HouseStat key={i} house={h.house} sign={h.sign} planets={h.planets} strength={h.strength} />
                                ))
                            ) : (
                                <>
                                    <HouseStat house="1st" sign={signIdToName[ascendantSign] || '—'} planets={displayPlanets.filter(p => p.signId === ascendantSign).map(p => p.name).join(', ') || '—'} strength="—" />
                                    <HouseStat house="7th" sign={signIdToName[((ascendantSign + 5) % 12) + 1] || '—'} planets="—" strength="—" />
                                    <HouseStat house="10th" sign={signIdToName[((ascendantSign + 8) % 12) + 1] || '—'} planets="—" strength="—" />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-softwhite border border-antique rounded-xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold-primary" />
                            Planet Positions
                        </h3>
                        <div className="text-sm text-body space-y-1 max-h-32 overflow-y-auto">
                            {displayPlanets.length > 0 ? (
                                displayPlanets.map((p, i) => (
                                    <p key={i}>
                                        <span className="font-medium text-ink">{p.name}</span>
                                        <span className="text-muted ml-2">in {signIdToName[p.signId]} at {p.degree}</span>
                                        {p.isRetro && <span className="text-orange-500 ml-1">(R)</span>}
                                    </p>
                                ))
                            ) : (
                                <p className="text-muted italic">No planet data available</p>
                            )}
                        </div>
                    </div>

                    <Link href="/vedic-astrology/reports" className="block bg-gold-primary/10 border border-gold-primary/30 rounded-xl p-5 hover:bg-gold-primary/20 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gold-dark" />
                                <span className="font-serif font-bold text-ink">Generate Report</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gold-dark group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-muted mt-2">Create detailed prediction report</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function QuickToolCard({ href, icon, title, desc, disabled = false }: { href: string; icon: React.ReactNode; title: string; desc: string; disabled?: boolean }) {
    const content = (
        <div className={cn("relative group overflow-hidden rounded-xl transition-all duration-300", !disabled && "hover:scale-[1.02] hover:-translate-y-1")}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F0] to-[#FDFBF7] z-0" />
            <div className={cn(
                "absolute inset-0 border rounded-xl z-20 transition-colors",
                disabled ? "border-gray-200" : "border-[#D08C60]/20 group-hover:border-[#D08C60]/50"
            )} />

            {disabled && (
                <div className="absolute inset-0 bg-gray-100/50 z-40 flex items-center justify-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase bg-white px-2 py-1 rounded">N/A for KP</span>
                </div>
            )}

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-[radial-gradient(circle_at_center,_rgba(255,210,125,0.15),_transparent_70%)]" />

            <div className="relative z-30 p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg transition-all",
                        disabled ? "bg-gray-300" : "bg-gradient-to-br from-[#D08C60] to-[#8B5A2B] group-hover:shadow-[0_0_12px_#D08C60]"
                    )}>
                        {icon}
                    </div>
                </div>

                <h3 className={cn(
                    "font-serif font-bold text-sm mb-1 transition-colors",
                    disabled ? "text-gray-400" : "text-[#3E2A1F] group-hover:text-[#D08C60]"
                )}>{title}</h3>
                <p className="text-[10px] text-[#8B5A2B]/70 font-medium uppercase tracking-wide">{desc}</p>
            </div>
        </div>
    );

    if (disabled) {
        return <div className="cursor-not-allowed">{content}</div>;
    }

    return <Link href={href}>{content}</Link>;
}

function HouseStat({ house, sign, planets, strength }: { house: string; sign: string; planets: string; strength: string }) {
    const strengthColor = strength === "Strong" ? "text-green-600" : strength === "Weak" ? "text-red-500" : "text-muted";
    return (
        <div className="flex items-center justify-between text-sm">
            <div>
                <span className="font-medium text-ink">{house}</span>
                <span className="text-muted ml-2">{sign}</span>
                {planets !== '—' && <span className="text-gold-dark ml-2 text-xs">({planets})</span>}
            </div>
            <span className={cn("text-xs font-medium", strengthColor)}>{strength}</span>
        </div>
    );
}
