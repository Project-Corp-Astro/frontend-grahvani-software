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
import styles from './RemedialShared.module.css';

interface MantraAnalysisDashboardProps {
    data: any;
}

const MantraAnalysisDashboard: React.FC<MantraAnalysisDashboardProps> = ({ data }) => {
    // Extract data from the nested structure
    const analysis = data?.analysis || {};
    const mantraAnalysis = data?.mantra_analysis || {};

    const timing = mantraAnalysis?.current_timing || {};
    const dashaMantras = mantraAnalysis?.dasha_mantras || [];
    const weakPlanets = mantraAnalysis?.weak_planets || [];
    const recommendations = mantraAnalysis?.recommendations || [];

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center border rounded-lg bg-[#E6C97A]/20" style={{ borderColor: 'var(--gold-primary)' }}>
                            <Sunrise className="w-5 h-5" style={{ color: 'var(--gold-dark)' }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Mantra & Sacred Sound: {data.user_name || "Sadhaka"}</h2>
                            <p className="text-xs" style={{ color: 'var(--text-body)' }}>Sonic Architecture & Karmic Resonance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Chart & Sacred Timing (3/12) */}
                <div className="lg:col-span-3 space-y-6">
                    <SadhanaChartPanel
                        chartData={analysis.chart}
                        doshaStatus={analysis.doshas}
                    />
                    <MantraTimingCard timing={timing} />
                </div>

                {/* Center Column: Dasha Mantras (5/12) */}
                <div className="lg:col-span-5 h-full">
                    <DashaMantraPanel mantras={dashaMantras} />
                </div>

                {/* Right Column: Weak Planet Sadhana (4/12) */}
                <div className="lg:col-span-4 h-full">
                    {weakPlanets.length > 0 ? (
                        <WeakPlanetSadhana weakPlanets={weakPlanets} />
                    ) : (
                        <div className={cn("rounded-3xl p-6 h-full flex items-center justify-center text-sm", styles.glassPanel)} style={{ color: 'var(--text-muted)' }}>
                            No active strengthening protocols required.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: Daily Ritual Checklist */}
            <div className={cn("rounded-3xl p-8 mt-6 backdrop-blur-md", styles.glassPanel)}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'var(--border-antique)' }}>
                        <ScrollText className="w-4 h-4" style={{ color: 'var(--ink)' }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>Daily Ritual Checklist</h2>
                        <p className="text-xs tracking-wide uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Recommended Sequence</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendations.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 p-4 border rounded-xl hover:bg-white/40 transition-colors group cursor-pointer"
                            style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'var(--border-antique)' }}
                        >
                            <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold transition-colors mt-0.5" style={{ borderColor: 'var(--border-antique)', color: 'var(--text-muted)' }}>
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="text-xs font-bold mb-0.5 transition-colors" style={{ color: 'var(--ink)' }}>{item.category}</h3>
                                <p className="text-[10px] leading-relaxed mb-1.5" style={{ color: 'var(--text-body)' }}>{item.action}</p>
                                <span className="text-[9px] italic px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: 'var(--text-muted)' }}>{item.note}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MantraAnalysisDashboard;
