"use client";

import React, { useState, useEffect } from 'react';
import NorthIndianChart, { ChartWithPopup, Planet } from "@/components/astrology/NorthIndianChart";
import ShodashaDignity from '@/components/astrology/ShodashaDignity';
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
    RefreshCw,
    Layers,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useSystemCapabilities } from "@/hooks/queries/useCalculations";
import { useChartMutations } from "@/hooks/mutations/useChartMutations";

import { parseChartData, signIdToName } from '@/lib/chart-helpers';

const CHART_NAMES: Record<string, string> = {
    // Divisional Charts
    'D1': 'Rashi (Birth Chart)',
    'D2': 'Hora (Wealth)',
    'D3': 'Drekkana (Siblings)',
    'D4': 'Chaturthamsha (Fortune)',
    'D7': 'Saptamsha (Children)',
    'D9': 'Navamsha (Spouse & Soul)',
    'D10': 'Dashamsha (Career)',
    'D12': 'Dwadashamsha (Parents)',
    'D16': 'Shodashamsha (Vehicles)',
    'D20': 'Vimshamsha (Spirituality)',
    'D24': 'Chaturvimshamsha (Education)',
    'D27': 'Bhamsha (Strength)',
    'D30': 'Trimshamsha (Misfortunes)',
    'D40': 'Khavedamsha (Auspiciousness)',
    'D45': 'Akshavedamsha (General)',
    'D60': 'Shashtiamsha (Past Karma)',

    // Chandra & Surya Lagna
    'moon_chart': 'Chandra Lagna (Moon Chart)',
    'sun_chart': 'Surya Lagna (Sun Chart)',

    // Special Lagnas & Analysis
    'arudha_lagna': 'Arudha Lagna (Perception)',
    'bhava_lagna': 'Bhava Lagna (Relative Strength)',
    'hora_lagna': 'Hora Lagna (Prosperity)',
    'karkamsha_d1': 'Karkamsha D1 (Soul Desire)',
    'karkamsha_d9': 'Karkamsha D9 (Internal Soul)',
    'sripathi_bhava': 'Sripathi Bhava (House Analysis)',
    'kp_bhava': 'KP Bhava (Stellar System)',
    'equal_bhava': 'Equal Bhava',
    'mandi': 'Mandi (Karmic Obstacles)',
    'gulika': 'Gulika (Instant Karma)',
};

export default function AnalyticalWorkbenchPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { generateChart } = useChartMutations();

    const [selectedChartType, setSelectedChartType] = useState('D1');
    const [activeTab, setActiveTab] = useState<'chart' | 'dignity' | 'lagna'>('chart');
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

    // Handler for generating individual charts
    const handleGenerateChart = async () => {
        if (!clientDetails?.id) return;
        setIsGeneratingLocal(true);
        try {
            await clientApi.generateChart(clientDetails.id, selectedChartType, settings.ayanamsa.toLowerCase());
            await refreshCharts();
        } catch (err: any) {
            console.error('Chart generation failed:', err);
            alert(`Failed to generate ${selectedChartType}: ${err.message || 'Unknown error'}`);
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    const systemCapabilities = useSystemCapabilities(settings.ayanamsa);
    const divisionalCharts = systemCapabilities.charts.divisional.filter(c => !c.toLowerCase().includes('shodasha_varga'));
    const lagnaCharts = systemCapabilities.charts.lagna;
    const specialCharts = systemCapabilities.charts.special.filter(c =>
        !c.toLowerCase().includes('shodasha') &&
        !c.toLowerCase().includes('sudarshana') &&
        !c.toLowerCase().includes('transit')
    );

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Use global pre-processed charts for O(1) lookup
    const currentChart = React.useMemo(() => {
        const key = `${selectedChartType}_${activeSystem}`;
        return processedCharts[key];
    }, [selectedChartType, activeSystem, processedCharts]);

    // Use shared parser
    const { planets: displayPlanets, ascendant: ascendantSign } = parseChartData(currentChart?.chartData);

    if (!clientDetails) return <div className="flex flex-col items-center justify-center min-h-[400px] text-center"><p className="font-serif text-xl text-primary">Please select a client to begin analysis</p></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-primary">Analytical Workbench</h1>
                        <div className="flex items-center gap-2">

                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isGeneratingCharts && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/80 text-green-700 text-2xs font-bold rounded-full border border-green-200 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Generating...
                        </span>
                    )}
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex bg-white/50 p-1 rounded-2xl border border-antique/50 w-fit">
                {(['chart', 'dignity', 'lagna'] as const).map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'lagna') setSelectedChartType('arudha_lagna'); else if (tab === 'chart') setSelectedChartType('D1'); }} className={cn("px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all", activeTab === tab ? "bg-gold-primary text-ink shadow-lg" : "text-primary hover:bg-parchment")}>
                        {tab === 'lagna' ? 'Lagna Analysis' : tab === 'dignity' ? 'Dignity Matrix' : 'Interactive Chart'}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={cn("grid grid-cols-1 gap-6", activeTab === 'dignity' ? "lg:grid-cols-1" : "lg:grid-cols-5")}>
                <div className={cn("space-y-6", activeTab === 'dignity' ? "lg:col-span-1" : "lg:col-span-3")}>
                    {activeTab === 'chart' || activeTab === 'lagna' ? (
                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm bg-[#FFFCF6]">
                            <div className="bg-[#EAD8B1] px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">
                                    {activeTab === 'lagna' ? 'Lagna Manifestation' : 'Interactive Visualization'}
                                </h3>
                                <select
                                    className="text-xs bg-white/50 border border-antique/50 rounded-lg px-2 py-0.5 focus:outline-none focus:border-gold-primary font-bold"
                                    value={selectedChartType}
                                    onChange={e => setSelectedChartType(e.target.value)}
                                >
                                    {activeTab === 'chart' ? (
                                        <>
                                            <optgroup label="Divisional Charts (Vargas)">
                                                {divisionalCharts.map(c => <option key={c} value={c}>{c} - {CHART_NAMES[c] || c}</option>)}
                                            </optgroup>
                                            <optgroup label="Special Focus Charts">
                                                {specialCharts.map(c => <option key={c} value={c}>{CHART_NAMES[c] || c.toUpperCase()}</option>)}
                                            </optgroup>
                                        </>
                                    ) : (
                                        <optgroup label="Lagna Analysis">
                                            {lagnaCharts.map(c => <option key={c} value={c}>{CHART_NAMES[c] || c.toUpperCase() + ' Analysis'}</option>)}
                                        </optgroup>
                                    )}
                                </select>
                            </div>
                            <div className="p-6">
                                <div className="aspect-square max-w-md mx-auto bg-parchment rounded-3xl p-6 border border-antique relative shadow-inner">
                                    {isLoadingCharts && Object.keys(processedCharts).length === 0 ? (
                                        <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-primary animate-spin" /></div>
                                    ) : displayPlanets.length > 0 ? (
                                        <ChartWithPopup ascendantSign={ascendantSign} planets={displayPlanets} className="bg-transparent border-none" showDegrees={selectedChartType === 'D1'} />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                            <p className="text-primary italic mb-4">No data for {CHART_NAMES[selectedChartType] || selectedChartType}</p>
                                            <button
                                                onClick={() => clientApi.generateChart(clientDetails.id!, selectedChartType, activeSystem as any).then(refreshCharts)}
                                                className="px-6 py-2 bg-gold-primary text-ink rounded-xl font-bold hover:shadow-lg transition-all"
                                            >
                                                {isGeneratingLocal ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    `Generate ${selectedChartType}`
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {processedCharts[`shodasha_varga_signs_${activeSystem}`] || Object.values(processedCharts).some(c => c.chartType && c.chartType.startsWith('D')) ? (
                                <ShodashaDignity data={{ charts: Object.values(processedCharts) }} activeSystem={activeSystem} />
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-copper-100 border-dashed p-12 text-center shadow-xl">
                                    <div className="p-6 bg-copper-50 rounded-full mb-6">
                                        <Shield className="w-12 h-12 text-copper-300" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-copper-900 mb-3">Shodasha Analysis Required</h3>
                                    <p className="text-copper-600 mb-8 max-w-md leading-relaxed font-medium">
                                        To view the complete Dignity Matrix and Vimsopaka strengths, we need to generate the Shodasha Varga summary.
                                    </p>
                                    <button
                                        onClick={() => clientApi.generateChart(clientDetails.id!, 'shodasha_varga_signs', activeSystem as any).then(refreshCharts)}
                                        className="px-10 py-4 bg-copper-900 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3 group"
                                    >
                                        {isGeneratingLocal ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                                        )}
                                        Generate Dignity Analysis
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                {activeTab !== 'dignity' && (
                    <div className="space-y-4 h-full w-145">
                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm bg-[#FFFCF6] flex flex-col h-full">
                            <div className="bg-[#EAD8B1] px-4 py-2 border-b border-antique shrink-0">
                                <h3 className="font-serif text-lg font-semibold text-primary leading-tight tracking-wide">Birth Planetary Positions</h3>
                            </div>

                            {/* Table Headers */}
                            <div className="grid grid-cols-12 px-4 py-2 border-b border-antique/30 bg-white/30 text-[10px] uppercase font-bold text-primary-refined tracking-wider shrink-0">
                                <div className="col-span-3">Planet</div>
                                <div className="col-span-6 text-center">Sign</div>
                                <div className="col-span-3 text-right">Deg</div>
                            </div>

                            <div className="p-0 flex-1 overflow-auto scrollbar-hide">
                                <div className="text-sm">
                                    {displayPlanets.map((p, i) => (
                                        <div key={i} className="grid grid-cols-12 items-center px-4 py-3 border-b border-antique/20 last:border-0 hover:bg-parchment/20 transition-colors">
                                            <div className="col-span-3 flex items-center gap-1">
                                                <span className="font-bold text-primary">{p.name}</span>
                                                {p.isRetro && <span className="text-red-500 font-bold text-[10px]">(R)</span>}
                                            </div>
                                            <div className="col-span-6 text-primary font-medium text-center">
                                                {signIdToName[p.signId]}
                                            </div>
                                            <div className="col-span-3 text-right font-mono text-xs text-primary">
                                                {p.degree}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickToolCard({ href, icon, title, desc, disabled = false }: { href: string; icon: React.ReactNode; title: string; desc: string; disabled?: boolean }) {
    return (
        <Link href={disabled ? '#' : href} className={cn("block group p-4 rounded-2xl border transition-all", disabled ? "opacity-50 grayscale cursor-not-allowed border-antique" : "bg-white border-antique hover:border-gold-primary hover:shadow-lg")}>
            <div className="w-10 h-10 rounded-xl bg-gold-primary/10 flex items-center justify-center mb-3 group-hover:bg-gold-primary group-hover:text-white transition-all">{icon}</div>
            <h3 className="font-bold text-primary text-sm mb-1">{title}</h3>
            <p className="text-2xs text-primary leading-tight">{desc}</p>
        </Link>
    );
}
