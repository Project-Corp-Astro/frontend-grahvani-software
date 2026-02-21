"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { Sparkles } from 'lucide-react';
import DebugConsole from '@/components/debug/DebugConsole';

interface YantraDashboardProps {
    data: any; // Full yantra JSON data
    className?: string;
}

export default function YantraDashboard({ data, className }: YantraDashboardProps) {
    const { processedCharts } = useVedicClient();
    if (!data) return null;

    // Fallback for D1 Chart
    const d1Chart = data.detailed_analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer, className)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-antique)' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-medium tracking-tight" style={{ color: 'var(--ink)' }}>
                            Yantras : {data.user_name || "Sadhaka"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Layout - Rebalanced for consistency */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Side: Chart & Info (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={data.detailed_analysis?.doshas || {}}
                    />

                    {/* Legend / Subtle Footer - Integrated into Sidebar */}
                    <div className="bg-white/30 rounded-3xl p-6 border border-antique/20 space-y-4">
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-900/60 px-1">Practice Insights</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[12px] font-medium text-ink">
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                                Karmic Priority
                            </div>
                            <div className="flex items-center gap-3 text-[12px] font-medium text-ink">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                                Dasha Influence
                            </div>
                            <div className="flex items-center gap-3 text-[12px] font-medium text-ink">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                Growth Potential
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Main Panels (8/12) - Unified Light Glass Dashboard */}
                <div className="lg:col-span-8">
                    <div className="rounded-[2.5rem] bg-[rgba(254,250,234,0.6)] border border-[#E7D6B8] shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-6 space-y-4 h-fit">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-medium text-ink tracking-tight">Today's Yantra Focus (Priority)</h2>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse" />
                        </div>

                        <div className="space-y-6">
                            <MantraFocusPanel
                                currentDasha={data.current_dasha}
                                yantras={data.yantra_recommendations}
                            />

                            <div className="h-px bg-amber-900/10 mx-2" />

                            <StrengtheningPanel
                                planetaryStrengths={data.planetary_strengths}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Debugging Console */}
            <DebugConsole
                title="Yantra Raw Data"
                data={data}
            />
        </div>
    );
}
