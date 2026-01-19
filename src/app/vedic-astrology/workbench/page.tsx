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
    Layers
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';

import { parseChartData, signNameToId, signIdToName } from '@/lib/chart-helpers';

const CHART_NAMES: Record<string, string> = {
    'D1': 'Rashi (Birth)',
    // ...
    'D60': 'Shashtiamsha (Past Karma)',
};

export default function AnalyticalWorkbenchPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();

    const [charts, setCharts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChartType, setSelectedChartType] = useState('D1');
    const [activeTab, setActiveTab] = useState<'chart' | 'dignity' | 'lagna'>('chart');

    const systemCapabilities = clientApi.getSystemCapabilities(settings.ayanamsa);
    const divisionalCharts = systemCapabilities.charts.divisional;
    const lagnaCharts = systemCapabilities.charts.lagna;

    const fetchCharts = async () => {
        if (!clientDetails?.id) return;
        try {
            setIsLoading(true);
            const data = await clientApi.getCharts(clientDetails.id);
            setCharts(data || []);
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

    const activeSystem = settings.ayanamsa.toLowerCase();
    const currentChart = charts.find(c => c.chartType === selectedChartType && (c.chartConfig?.system || 'lahiri').toLowerCase() === activeSystem);

    // Use shared parser
    const { planets: displayPlanets, ascendant: ascendantSign } = parseChartData(currentChart?.chartData);

    if (!clientDetails) return <div className="flex flex-col items-center justify-center min-h-[400px] text-center"><p className="font-serif text-xl text-muted">Please select a client to begin analysis</p></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center"><LayoutDashboard className="w-6 h-6 text-gold-primary" /></div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Analytical Workbench</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted">Deep analysis tools for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark text-[10px] font-bold uppercase rounded-full border border-gold-primary/30">{settings.ayanamsa}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchCharts} disabled={isLoading} className="p-2 rounded-lg bg-parchment border border-antique hover:bg-softwhite text-muted disabled:opacity-50"><RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /></button>
                    <Link href="/vedic-astrology/overview" className="px-4 py-2 bg-parchment border border-antique rounded-lg text-sm font-medium text-body hover:bg-softwhite flex items-center gap-2"><Eye className="w-4 h-4" /> Overview</Link>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex bg-white/50 p-1 rounded-2xl border border-antique/50 w-fit">
                {(['chart', 'dignity', 'lagna'] as const).map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'lagna') setSelectedChartType('arudha'); else if (tab === 'chart') setSelectedChartType('D1'); }} className={cn("px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all", activeTab === tab ? "bg-gold-primary text-ink shadow-lg" : "text-muted hover:bg-parchment")}>
                        {tab === 'lagna' ? 'Lagna Analysis' : tab === 'dignity' ? 'Dignity Matrix' : 'Interactive Chart'}
                    </button>
                ))}
            </div>

            {/* Content View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'chart' || activeTab === 'lagna' ? (
                        <div className="bg-softwhite border border-antique rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif font-bold text-ink flex items-center gap-2">{activeTab === 'lagna' ? <Layers className="w-5 h-5 text-gold-primary" /> : <Activity className="w-5 h-5 text-gold-primary" />} {activeTab === 'lagna' ? 'Lagna Manifestation' : 'Interactive Visualization'}</h2>
                                <select className="text-sm bg-parchment border border-antique rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-primary" value={selectedChartType} onChange={e => setSelectedChartType(e.target.value)}>
                                    {activeTab === 'chart' ? (
                                        <optgroup label="Divisional Charts">
                                            {divisionalCharts.map(c => <option key={c} value={c}>{c} - {CHART_NAMES[c] || c}</option>)}
                                        </optgroup>
                                    ) : (
                                        <optgroup label="Special Lagnas">
                                            {lagnaCharts.map(c => <option key={c} value={c}>{c.toUpperCase()} Analysis</option>)}
                                        </optgroup>
                                    )}
                                </select>
                            </div>
                            <div className="aspect-square max-w-md mx-auto bg-parchment rounded-3xl p-6 border border-antique relative shadow-inner">
                                {isLoading ? <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-primary animate-spin" /></div> : displayPlanets.length > 0 ? <ChartWithPopup ascendantSign={ascendantSign} planets={displayPlanets} className="bg-transparent border-none" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><p className="text-muted italic mb-4">No data for {selectedChartType}</p><button onClick={() => clientApi.generateChart(clientDetails.id!, selectedChartType, activeSystem).then(fetchCharts)} className="px-6 py-2 bg-gold-primary text-ink rounded-xl font-bold hover:shadow-lg transition-all">Generate {selectedChartType}</button></div>}
                            </div>
                        </div>
                    ) : (
                        <ShodashaDignity data={{ charts }} />
                    )}
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                    <div className="bg-softwhite border border-antique rounded-2xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold-primary" /> Analysis Context</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-parchment rounded-xl border border-antique/50">
                                <p className="text-[10px] uppercase font-bold text-muted mb-1">Active Chart</p>
                                <p className="text-sm font-bold text-ink">{selectedChartType} — {CHART_NAMES[selectedChartType] || 'Special'}</p>
                            </div>
                            <div className="p-3 bg-parchment rounded-xl border border-antique/50">
                                <p className="text-[10px] uppercase font-bold text-muted mb-1">Ascendant Significance</p>
                                <p className="text-xs text-body leading-relaxed">{selectedChartType === 'arudha' ? 'Perceived persona and worldly success.' : selectedChartType === 'karkamsha' ? 'The soul\'s true desire and talent.' : 'Primary physical and general destiny.'}</p>
                            </div>
                        </div>
                    </div>

                    <Link href="/vedic-astrology/dashas" className="flex items-center justify-between p-4 bg-copper-900 text-amber-50 rounded-2xl hover:shadow-xl transition-all">
                        <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-amber-400" /> <span className="font-bold">Dasha Timeline</span></div>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="bg-softwhite border border-antique rounded-2xl p-5">
                        <h3 className="font-serif font-bold text-ink mb-3 text-sm">Planet Summary</h3>
                        <div className="text-xs space-y-2 max-h-48 overflow-y-auto pr-2">
                            {displayPlanets.map((p, i) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-antique last:border-0">
                                    <span className="font-bold text-copper-900">{p.name}</span>
                                    <span className="text-muted">{signIdToName[p.signId]} {p.degree}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickToolCard({ href, icon, title, desc, disabled = false }: { href: string; icon: React.ReactNode; title: string; desc: string; disabled?: boolean }) {
    return (
        <Link href={disabled ? '#' : href} className={cn("block group p-4 rounded-2xl border transition-all", disabled ? "opacity-50 grayscale cursor-not-allowed border-antique" : "bg-white border-antique hover:border-gold-primary hover:shadow-lg")}>
            <div className="w-10 h-10 rounded-xl bg-gold-primary/10 flex items-center justify-center mb-3 group-hover:bg-gold-primary group-hover:text-white transition-all">{icon}</div>
            <h3 className="font-bold text-ink text-sm mb-1">{title}</h3>
            <p className="text-[10px] text-muted leading-tight">{desc}</p>
        </Link>
    );
}
