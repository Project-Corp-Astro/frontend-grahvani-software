"use client";

import React from 'react';
import NorthIndianChart from '../astrology/NorthIndianChart/NorthIndianChart';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

import { parseChartData } from '@/lib/chart-helpers';

interface SadhanaChartPanelProps {
    chartData: any;
    doshaStatus: any;
}

export default function SadhanaChartPanel({ chartData, doshaStatus }: SadhanaChartPanelProps) {
    const { planets, ascendant: ascendantSign } = parseChartData(chartData);

    // Only return null if we absolutely have no planetary data
    if (planets.length === 0) return null;

    // Check if all doshas are false
    const isAllClear = Object.values(doshaStatus).every(v => v === false);

    return (
        <div className="flex flex-col gap-6">
            {/* Chart Card */}
            <div className={cn("p-6 backdrop-blur-md relative overflow-hidden group", styles.glassPanel)}>
                {/* Horizontal Gradient Aura for Chart - Adjusted for Light Theme */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[70px] pointer-events-none" style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }} />

                <h3 className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>Your Horoscope Snapshot</h3>

                <div className="relative aspect-square w-full max-w-[340px] mx-auto filter drop-shadow-[0_0_15px_rgba(251,146,60,0.1)]">
                    <NorthIndianChart
                        planets={planets}
                        ascendantSign={ascendantSign}
                        className="sadhana-chart"
                        showDegrees={false} // Match image style - cleaner labels
                    />
                </div>

                <style jsx global>{`
                    .sadhana-chart g[stroke="#D08C60"] {
                        stroke: #B45309; /* Amber 700 */
                        stroke-opacity: 0.6;
                        stroke-width: 1.5;
                    }
                    .sadhana-chart text {
                        fill: #3E2A1F !important; /* var(--ink) */
                        font-size: 17px !important;
                        font-weight: 600 !important;
                    }
                    .sadhana-chart text[font-weight="700"] {
                        fill: #78350F !important; /* Amber 900 */
                        font-size: 16px !important;
                    }
                `}</style>
            </div>

            {/* Dosha Status Badge */}
            <div className={cn(
                "rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500",
                isAllClear
                    ? "bg-emerald-50 border border-emerald-200 shadow-sm"
                    : "bg-red-50 border border-red-200 shadow-sm"
            )}>
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                    isAllClear ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                    {isAllClear ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
                </div>
                <h4 className={cn(
                    "text-xl font-bold mb-1",
                    isAllClear ? "text-emerald-700" : "text-red-700"
                )}>
                    Dosha Status: {isAllClear ? "All Clear" : "Attention Required"}
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-body)' }}>
                    {isAllClear
                        ? "Great news! No major doshas detected in your chart."
                        : "Some planetary afflictions may require remedial focus."}
                </p>
            </div>
        </div>
    );
}
