"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import RemedyListPanel from '@/components/upaya/RemedyListPanel';
import styles from './UpayaDashboard.module.css'; // Import Module

interface UpayaDashboardProps {
    data: any; // Full gemstone JSON data
    className?: string;
}

export default function UpayaDashboard({ data, className }: UpayaDashboardProps) {
    if (!data) return null;

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer, className)}>
            {/* Main Header (Standardized) */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                        Gemstones : {data.user_details?.name || 'Upaya Analysis'}
                    </h2>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Chart & Alignments */}
                <div className="lg:col-span-1 space-y-6">
                    <ChartAlignmentPanel
                        chartData={data.chart_details}
                        planetaryAnalysis={data.planetary_strength_analysis}
                    />
                </div>

                {/* Column 2: Vigor & Temporal Cycles */}
                <div className="lg:col-span-1 space-y-6">
                    <VigorTimelinePanel
                        strengthAnalysis={data.planetary_strength_analysis}
                        dashaDetails={data.dasha_details}
                    />
                </div>

                {/* Column 3: Prioritized Recommendations */}
                <div className="lg:col-span-1">
                    <RemedyListPanel
                        recommendations={data.gemstone_recommendations?.primary_recommendations}
                    />
                </div>
            </div>

            {/* General Guidelines & Footer */}
            {data.gemstone_recommendations?.general_guidelines && (
                <div className={cn("rounded-2xl p-6 backdrop-blur-sm", styles.glassPanel)}>
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--gold-primary)' }} />
                        Sacred Protocols for Gemstone Wearing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.gemstone_recommendations.general_guidelines.map((guideline: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-body)' }}>
                                <span className="mt-0.5">{guideline.startsWith('✓') ? '✨' : guideline.startsWith('✗') ? '🚫' : '💡'}</span>
                                <span className={cn(guideline.includes('NEVER') ? "font-medium text-red-600" : "")}>
                                    {guideline.replace(/^[✓✗🚨👨⚕️⚠️💡]/, '').trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
