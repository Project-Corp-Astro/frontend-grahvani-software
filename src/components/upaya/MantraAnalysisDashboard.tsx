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

                {/* Right Side: Main Panels (8/12) */}
                <div className="lg:col-span-8 space-y-6">
                    <DashaMantraPanel mantras={dashaMantras} />

                    {weakPlanets.length > 0 ? (
                        <WeakPlanetSadhana weakPlanets={weakPlanets} />
                    ) : (
                        <div className={cn("rounded-3xl p-12 flex items-center justify-center text-sm border-antique/20", styles.glassPanel)} style={{ color: 'var(--text-muted)' }}>
                            <div className="text-center group">
                                <Flower2 className="w-12 h-12 mb-4 mx-auto group-hover:opacity-30 transition-all duration-700 hover:rotate-45" style={{ opacity: 0.1 }} />
                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Harmonic Balance Achieved</p>
                                <p className="text-[11px] font-bold mt-2">No active strengthening protocols required</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: Daily Ritual Checklist - Premium Treatment */}
            <div className="border-t pt-8 mt-12 bg-white/30 rounded-3xl p-8 border-antique/20" style={{ borderColor: 'var(--border-antique)' }}>
                <div className="flex items-center gap-3 mb-8 px-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <ScrollText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--ink)' }}>Daily Ritual Sequence</h2>
                        <p className="text-[10px] font-bold uppercase tracking-wider">Systematic Sonic Alignment Checklist</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendations.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-5 rounded-2xl border bg-white/50 backdrop-blur-sm hover:border-indigo-200 hover:bg-white transition-all group cursor-pointer shadow-sm"
                            style={{ borderColor: 'var(--border-antique)' }}
                        >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full border border-antique/30 flex items-center justify-center text-[10px] font-black transition-all mt-0.5 bg-white group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600" style={{ color: 'var(--text-muted)' }}>
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors" style={{ color: 'var(--ink)' }}>{item.category}</h3>
                                <p className="text-xs font-bold leading-tight mb-2" style={{ color: 'var(--text-body)' }}>{item.action}</p>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/60 border border-antique/10 text-[9px] font-bold italic" style={{ color: 'var(--text-muted)' }}>
                                    <span>{item.note}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MantraAnalysisDashboard;
