"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Flame,
    Droplets,
    CheckCircle2,
    Sparkles,
    ScrollText,
    Flower2,
    Calendar,
    Sunrise
} from 'lucide-react';
import { cn } from "@/lib/utils";
import MantraTimingCard from '@/components/upaya/MantraTimingCard';
import DashaMantraPanel from '@/components/upaya/DashaMantraPanel';
import WeakPlanetSadhana from '@/components/upaya/WeakPlanetSadhana';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import { useVedicClient } from '@/context/VedicClientContext';
import styles from './RemedialShared.module.css';

interface MantraAnalysisDashboardProps {
    data: any;
}

const MantraAnalysisDashboard: React.FC<MantraAnalysisDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Extract data from the nested structure
    const analysis = data?.analysis || {};
    const mantraAnalysis = data?.mantra_analysis || {};

    // Fallback for D1 Chart
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    const timing = mantraAnalysis?.current_timing || {};
    const dashaMantras = mantraAnalysis?.dasha_mantras || [];
    const weakPlanets = mantraAnalysis?.weak_planets || [];
    const recommendations = mantraAnalysis?.recommendations || [];

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-antique)' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                            Mantras : {data.user_name || "Sadhaka"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Layout - Rebalanced for consistency */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Side: Chart & Focus (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                    <MantraTimingCard timing={timing} />

                </div>

                {/* Right Side: Main Panels (8/12) - Unified Light Glass Dashboard */}
                <div className="lg:col-span-8">
                    <div className="rounded-[2.5rem] bg-[rgba(254,250,234,0.6)] border border-[#E7D6B8] shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-6 space-y-4 h-fit">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-medium text-ink tracking-tight">Today's Mantra Focus (Priority)</h2>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse" />
                        </div>

                        <div className="space-y-6">
                            <DashaMantraPanel mantras={dashaMantras} />

                            <div className="h-px bg-amber-900/10 mx-2" />

                            {weakPlanets.length > 0 ? (
                                <WeakPlanetSadhana weakPlanets={weakPlanets} />
                            ) : (
                                <div className="p-8 text-center bg-white/40 rounded-[2rem] border border-antique/20">
                                    <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-3 opacity-50" />
                                    <p className="text-[12px] font-medium tracking-[0.05em] text-amber-900/40">Harmonic Balance Achieved</p>
                                </div>
                            )}

                            <div className="h-px bg-amber-900/10 mx-2" />

                            <div className="space-y-4">
                                <h3 className="text-[13px] font-medium tracking-[0.05em] text-amber-900/60 px-2">3. Daily Ritual Sequence</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {recommendations.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-4 p-4 rounded-2xl border bg-white/40 backdrop-blur-sm transition-all group cursor-pointer border-antique/20 hover:bg-white/60"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full border border-antique/30 flex items-center justify-center text-[12px] font-medium transition-all mt-0.5 bg-white group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600" style={{ color: 'var(--text-muted)' }}>
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-[11px] font-medium tracking-widest mb-1 group-hover:text-indigo-600 transition-colors text-ink">{item.category}</h3>
                                                <p className="text-sm font-medium leading-tight mb-2 text-ink/80">{item.action}</p>
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/60 border border-antique/10 text-[10px] font-medium italic text-slate-500">
                                                    <span className="truncate">{item.note}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default MantraAnalysisDashboard;
