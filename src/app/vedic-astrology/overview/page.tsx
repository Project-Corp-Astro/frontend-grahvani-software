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
    Loader2,
    Shield,
    Compass,
    Layers,
    Star,
    X,
    Sparkle
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi, DashaResponse } from '@/lib/api';
import DoshaAnalysis from '@/components/astrology/DoshaAnalysis';
import YogaAnalysisView from '@/components/astrology/YogaAnalysis';

import { parseChartData } from '@/lib/chart-helpers';

// ... (other imports)

export default function VedicOverviewPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();
    const [zoomedChart, setZoomedChart] = React.useState<{ varga: string, label: string } | null>(null);
    const [charts, setCharts] = useState<any[]>([]);
    const [dashaData, setDashaData] = useState<DashaResponse | null>(null);
    const [dashaLoading, setDashaLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [analysisModal, setAnalysisModal] = useState<{ type: 'yoga' | 'dosha', subType: string, label: string } | null>(null);

    // Calculate Age
    const age = clientDetails ? new Date().getFullYear() - new Date(clientDetails.dateOfBirth).getFullYear() : 0;

    useEffect(() => {
        if (clientDetails?.id) {
            fetchCharts();
            fetchDasha();
        }
    }, [clientDetails, settings.ayanamsa]);

    const fetchCharts = async () => {
        if (!clientDetails?.id) return;
        try {
            const data = await clientApi.getCharts(clientDetails.id);
            setCharts(data);
        } catch (error) {
            console.error("Failed to fetch charts:", error);
        }
    };

    const fetchDasha = async () => {
        if (!clientDetails?.id) return;
        setDashaLoading(true);
        try {
            const data = await clientApi.generateDasha(clientDetails.id, 'mahadasha', settings.ayanamsa);
            setDashaData(data);
        } catch (error) {
            console.error("Failed to fetch dasha:", error);
        } finally {
            setDashaLoading(false);
        }
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-4" />
                <p className="text-muted font-serif">Loading Client Profile...</p>
            </div>
        );
    }

    // Helper to get processed data for a specific chart type
    const getProcessedChart = (varga: string) => {
        const activeSystem = settings.ayanamsa.toLowerCase();
        const chart = charts.find((c: any) => (c.chartConfig?.system || 'lahiri').toLowerCase() === activeSystem && c.chartType === varga);
        return parseChartData(chart?.chartData); // Returns { planets: [], ascendant: 1 } if no data
    };

    const d1Data = getProcessedChart("D1");
    const d9Data = getProcessedChart("D9");

    // Zoomed chart logic - Get dynamic data based on selected varga
    const zoomedData = zoomedChart ? getProcessedChart(zoomedChart.varga) : { planets: [], ascendant: 1 };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. HEADER */}
            <div className="bg-softwhite border border-antique rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                        {clientDetails.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-serif font-bold text-ink">{clientDetails.name}</h1>
                            <span className="text-xs text-muted bg-parchment px-2 py-0.5 rounded-full border border-antique">{age} yrs • {clientDetails.gender}</span>
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
                    Analytical Workbench <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* 2. CORE SIGNATURES - Dynamically extracted from D1 chart */}
            {(() => {
                // Extract core signatures from D1 chart
                const d1Chart = charts.find((c: any) =>
                    (c.chartConfig?.system || 'lahiri').toLowerCase() === settings.ayanamsa.toLowerCase()
                    && c.chartType === 'D1'
                );
                const chartData = d1Chart?.chartData;

                // Sign names for ID mapping
                const signNames = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

                // Nakshatra lords
                const nakshatraLords: Record<string, string> = {
                    'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
                    'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
                    'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
                    'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
                    'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
                    'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
                    'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
                    'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
                    'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
                };

                // Extract values
                const ascendant = chartData?.ascendant;
                const lagnaSign = ascendant?.sign || signNames[d1Data.ascendant] || '—';
                const lagnaDegs = ascendant?.degrees?.split('°')[0] || '';

                const planets = chartData?.planetary_positions || {};
                const moonData = planets['Moon'] || {};
                const sunData = planets['Sun'] || {};

                const moonSign = moonData?.sign || clientDetails.rashi || '—';
                const moonNakshatra = moonData?.nakshatra || '—';
                const moonPada = moonData?.pada ? `Pada ${moonData.pada}` : '';

                const sunSign = sunData?.sign || '—';
                const sunDegrees = sunData?.degrees?.split("'")[0]?.replace('°', '° ') || '';

                const nakshatraLord = nakshatraLords[moonNakshatra] || '—';

                // Planets in 1st house for Lagna sub-text
                const lagnaHousePlanets = Object.entries(planets)
                    .filter(([_, p]: [string, any]) => p.house === 1)
                    .map(([name]) => name.substring(0, 2))
                    .join(', ') || 'No planets';

                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <SignatureCard
                            label="Lagna"
                            value={lagnaSign}
                            sub={lagnaHousePlanets}
                        />
                        <SignatureCard
                            label="Moon Sign"
                            value={moonSign}
                            sub={moonNakshatra && moonPada ? `${moonNakshatra} ${moonPada}` : moonNakshatra}
                            highlight
                        />
                        <SignatureCard
                            label="Sun Sign"
                            value={sunSign}
                            sub={sunDegrees}
                        />
                        <SignatureCard
                            label="Nakshatra Lord"
                            value={nakshatraLord}
                            sub={nakshatraLord !== '—' ? nakshatraLords[moonNakshatra] || '' : ''}
                        />
                    </div>
                );
            })()}

            {/* 3. MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <ChartCard varga="D1" label={`Rashi Chart (${settings.ayanamsa})`} ascendantSign={d1Data.ascendant} planets={d1Data.planets} onZoom={() => setZoomedChart({ varga: "D1", label: "Rashi Chart" })} />
                    {settings.ayanamsa !== 'KP' && (
                        <ChartCard varga="D9" label="Navamsha" ascendantSign={d9Data.ascendant} planets={d9Data.planets} onZoom={() => setZoomedChart({ varga: "D9", label: "Navamsha Chart" })} />
                    )}
                </div>

                <div className="lg:col-span-5 bg-softwhite border border-antique rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-serif font-bold text-lg text-ink">Vimshottari Dasha</h3>
                            <p className="text-[10px] text-gold-dark uppercase tracking-widest">Active Lifecycle</p>
                        </div>
                        {dashaData?.data?.current_dasha && (
                            <div className="bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                                <span className="text-red-600 text-xs font-semibold">Active</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        {dashaLoading ? (
                            <div className="flex items-center justify-center py-6"><Loader2 className="w-6 h-6 text-gold-primary animate-spin" /></div>
                        ) : dashaData?.data?.mahadashas?.slice(0, 3).map((md: any, idx: number) => (
                            <DashaRow key={idx} level={idx === 0 ? "Mahadasha" : idx === 1 ? "Antardasha" : "Pratyantardasha"} planet={md.planet || md.lord} ends={md.end_date ? new Date(md.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'} active={md.is_current || md.isCurrent || false} />
                        )) || [1, 2, 3].map(i => <DashaRow key={i} level="Dasha" planet="—" ends="—" />)}
                    </div>
                    <Link href="/vedic-astrology/dashas" className="mt-4 flex items-center justify-center gap-2 text-gold-dark text-sm hover:text-gold-primary transition-colors py-2 border-t border-antique">
                        <TrendingUp className="w-4 h-4" /> Dasha Explorer <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* 4. PROFESSIONAL CONSULT SUITE */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-copper-200 to-transparent" />
                    <h2 className="text-lg font-serif text-copper-900 font-bold px-4 flex items-center gap-2 whitespace-nowrap">
                        <Layers className="w-5 h-5 text-copper-600" /> Professional Consult Suite
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-copper-200 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="group bg-white border border-copper-200 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer" onClick={() => window.location.href = '/vedic-astrology/ashtakavarga'}>
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Shield className="w-5 h-5" /></div>
                            <ArrowRight className="w-4 h-4 text-copper-300 group-hover:translate-x-1" />
                        </div>
                        <h3 className="font-serif font-bold text-ink">Ashtakavarga Strength</h3>
                        <p className="text-[11px] text-muted mt-1 leading-relaxed">Numerical Bindu assessment to identify high-potential transits and natal house power.</p>
                    </div>

                    <div className="group bg-white border border-copper-200 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer" onClick={() => window.location.href = '/vedic-astrology/chakras'}>
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Compass className="w-5 h-5" /></div>
                            <ArrowRight className="w-4 h-4 text-copper-300 group-hover:translate-x-1" />
                        </div>
                        <h3 className="font-serif font-bold text-ink">Sudarshan Confluence</h3>
                        <p className="text-[11px] text-muted mt-1 leading-relaxed">Aligned life-dimension analysis. Triple-layer view of Body, Mind, and Soul alignment.</p>
                    </div>

                    <div className="group bg-copper-900 text-amber-50 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-white/10 rounded-xl text-amber-400"><Star className="w-5 h-5" /></div>
                            <ArrowRight className="w-4 h-4 text-copper-400 group-hover:translate-x-1" />
                        </div>
                        <h3 className="font-serif font-bold text-amber-200">Esoteric Lahiri Points</h3>
                        <p className="text-[11px] text-copper-300 mt-1 leading-relaxed">Arudha Lagna and Karkamsha charts for deep karmic manifestation analysis.</p>
                    </div>
                </div>
            </div>

            {/* 5. BOTTOM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold-primary" /> Yogas & Doshas</h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {charts.filter((c: any) => c.chartType.startsWith('yoga_') || c.chartType.startsWith('dosha_')).length > 0 ? (
                            charts.filter((c: any) => c.chartType.startsWith('yoga_') || c.chartType.startsWith('dosha_')).slice(0, 8).map((c: any, i: number) => {
                                const isYoga = c.chartType.startsWith('yoga_');
                                const type = isYoga ? 'yoga' : 'dosha';
                                const subType = c.chartType.replace(isYoga ? 'yoga_' : 'dosha_', '');
                                const label = subType.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

                                return (
                                    <YogaItem
                                        key={i}
                                        type={type as any}
                                        name={label}
                                        desc={isYoga ? "Benefic Combination" : "Malefic Influence"}
                                        onClick={() => setAnalysisModal({ type: type as any, subType, label: `${label} ${isYoga ? 'Yoga' : 'Analysis'}` })}
                                    />
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 border border-dashed border-antique rounded-lg bg-parchment/30">
                                <Sparkle className="w-4 h-4 text-muted/30 mb-1" />
                                <p className="text-[10px] text-muted italic text-center">No major signatures detected in core charts</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Transit Alerts</h3>
                    <div className="space-y-2">
                        <AlertItem level="high" text="Saturn transit 7th — relationship pressure" />
                        <AlertItem level="medium" text="Mars Antardasha — increased drive" />
                    </div>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <h3 className="font-serif font-bold text-ink text-sm mb-3 flex items-center gap-2"><Edit3 className="w-4 h-4 text-gold-primary" /> Session Notes</h3>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-20 text-xs bg-parchment border border-antique rounded-lg p-2 resize-none focus:outline-none focus:border-gold-primary" />
                </div>
            </div>

            {/* ZOOM MODAL */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-softwhite border border-antique rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button onClick={() => setZoomedChart(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-parchment text-muted hover:bg-gold-primary/20 hover:text-ink transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-serif text-ink font-bold">{zoomedChart.label}</h2>
                            <p className="text-xs text-muted uppercase tracking-widest mt-1">{zoomedChart.varga} Divisional Chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto bg-parchment rounded-2xl p-6 border border-antique">
                            <ChartWithPopup ascendantSign={zoomedData.ascendant} planets={zoomedData.planets} className="bg-transparent border-none" />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS MODAL */}
            {analysisModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/60 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-parchment border border-antique rounded-[2.5rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar border-b-8 border-gold-primary">
                        <button onClick={() => setAnalysisModal(null)} className="absolute top-6 right-6 p-2 rounded-2xl bg-white border border-antique text-muted hover:bg-red-50 hover:text-red-500 transition-all">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-gold-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">Lahiri Astrological Report</span>
                            </div>
                            <h2 className="text-3xl font-serif text-ink font-bold">{analysisModal.label}</h2>
                        </div>

                        {analysisModal.type === 'yoga' ? (
                            <YogaAnalysisView
                                clientId={clientDetails.id!}
                                yogaType={analysisModal.subType}
                                ayanamsa={settings.ayanamsa}
                            />
                        ) : (
                            <DoshaAnalysis
                                clientId={clientDetails.id!}
                                doshaType={analysisModal.subType as any}
                                ayanamsa={settings.ayanamsa}
                            />
                        )}

                        <div className="mt-8 pt-6 border-t border-antique/50 text-center">
                            <p className="text-[10px] text-muted italic">
                                * This analysis is based on Vedic principles and Lahiri Ayanamsa. Remedies are suggestive and for spiritual guidance.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SignatureCard({ label, value, sub, highlight = false }: { label: string; value: string; sub?: string; highlight?: boolean }) {
    return (
        <div className={cn("p-4 rounded-xl border transition-all", highlight ? "bg-gold-primary/10 border-gold-primary/40 shadow-sm" : "bg-softwhite border-antique")}>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-semibold">{label}</p>
            <p className={cn("font-serif font-bold text-lg", highlight ? "text-gold-dark" : "text-ink")}>{value}</p>
            {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
        </div>
    );
}

function ChartCard({ varga, label, ascendantSign, planets, onZoom }: any) {
    return (
        <div className="bg-softwhite border border-antique rounded-xl p-4 hover:border-gold-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-serif font-bold text-ink text-sm">{label}</h3>
                    <p className="text-[9px] text-muted uppercase tracking-widest">{varga} Chart</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onZoom(); }} className="p-1.5 rounded-lg bg-parchment text-muted hover:bg-gold-primary/20 hover:text-ink transition-all"><Maximize2 className="w-4 h-4" /></button>
            </div>
            <div className="aspect-square bg-parchment rounded-lg p-2 border border-antique/50">
                <ChartWithPopup ascendantSign={ascendantSign} planets={planets} className="bg-transparent border-none" />
            </div>
        </div>
    );
}

function DashaRow({ level, planet, ends, active = false }: { level: string; planet: string; ends: string; active?: boolean }) {
    return (
        <div className={cn("flex items-center justify-between p-2.5 rounded-lg border", active ? "bg-gold-primary/10 border-gold-primary/30" : "bg-parchment border-antique/50")}>
            <div>
                <p className="text-[9px] uppercase tracking-widest text-muted">{level}</p>
                <p className="font-serif font-bold text-ink text-sm">{planet}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-muted">ends</p>
                <p className="text-xs font-medium text-ink">{ends}</p>
            </div>
        </div>
    );
}

function YogaItem({ type, name, desc, onClick }: { type: "yoga" | "dosha"; name: string; desc: string; onClick?: () => void }) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 p-2 rounded-xl border border-transparent transition-all cursor-pointer group",
                type === "yoga" ? "hover:bg-green-50 hover:border-green-100" : "hover:bg-orange-50 hover:border-orange-100"
            )}
            onClick={onClick}
        >
            <div className={cn(
                "p-1.5 rounded-lg shrink-0",
                type === "yoga" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"
            )}>
                {type === "yoga" ? <Sparkle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink truncate group-hover:text-gold-dark transition-colors">{name}</p>
                <div className="flex items-center justify-between">
                    <p className="text-[9px] text-muted truncate">{desc}</p>
                    <ArrowRight className="w-2.5 h-2.5 text-muted/0 group-hover:text-gold-primary group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </div>
    );
}

function AlertItem({ level, text }: { level: "high" | "medium" | "low"; text: string }) {
    const colors = { high: "bg-red-50 border-red-100 text-red-700", medium: "bg-orange-50 border-orange-100 text-orange-700", low: "bg-green-50 border-green-100 text-green-700" };
    return <div className={cn("text-[10px] p-2 rounded-lg border", colors[level])}>{text}</div>;
}
