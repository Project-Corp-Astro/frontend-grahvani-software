"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import RahuKaalAlert from '@/components/upaya/RahuKaalAlert';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';

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
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                            Yantras : {data.user_name}
                        </h2>
                    </div>
                </div>

                {/* Top Alert Bar */}
                <RahuKaalAlert />
            </div>

            {/* Main Dashboard Layout - Rebalanced for consistency */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Information Column (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={data.detailed_analysis?.doshas || {}}
                    />
                    <StrengtheningPanel
                        planetaryStrengths={data.planetary_strengths}
                    />
                </div>

                {/* Action Column (8/12) */}
                <div className="lg:col-span-8 h-full">
                    <MantraFocusPanel
                        currentDasha={data.current_dasha}
                        yantras={data.yantra_recommendations}
                    />
                </div>
            </div>

            {/* Legend / Subtle Footer */}
            <div className="flex items-center justify-center gap-8 py-4 border-t" style={{ borderColor: 'var(--border-divider)' }}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--ink)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Karmic Priority
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--ink)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Dasha Influence
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--ink)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Growth Potential
                </div>
            </div>
        </div>
    );
}
