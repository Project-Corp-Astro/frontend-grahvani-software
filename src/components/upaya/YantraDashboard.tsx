"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import RahuKaalAlert from '@/components/upaya/RahuKaalAlert';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';

interface YantraDashboardProps {
    data: any; // Full yantra JSON data
    className?: string;
}

export default function YantraDashboard({ data, className }: YantraDashboardProps) {
    if (!data) return null;

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer, className)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                            <svg className="w-5 h-5" style={{ color: '#4F46E5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Daily Sadhana & Chart Insights: {data.user_name}</h2>
                            <p className="text-xs" style={{ color: 'var(--text-body)' }}>Sacred Geometry & Sound Vibrations for Alignment</p>
                        </div>
                    </div>
                </div>

                {/* Top Alert Bar */}
                <RahuKaalAlert />
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Horoscope Snapshot (3/12) */}
                <div className="lg:col-span-3">
                    <SadhanaChartPanel
                        chartData={data.detailed_analysis?.chart}
                        doshaStatus={data.detailed_analysis?.doshas}
                    />
                </div>

                {/* Center Column: Mantra Focus (5/12) */}
                <div className="lg:col-span-5 h-full">
                    <MantraFocusPanel
                        currentDasha={data.current_dasha}
                        yantras={data.yantra_recommendations}
                    />
                </div>

                {/* Right Column: Strengthening Gauges (4/12) */}
                <div className="lg:col-span-4 h-full">
                    <StrengtheningPanel
                        planetaryStrengths={data.planetary_strengths}
                    />
                </div>
            </div>

            {/* Legend / Subtle Footer */}
            <div className="flex items-center justify-center gap-8 py-4 opacity-50 border-t" style={{ borderColor: 'var(--border-divider)' }}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Karmic Priority
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Dasha Influence
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Growth Potential
                </div>
            </div>
        </div>
    );
}
