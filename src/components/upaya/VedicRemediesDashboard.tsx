"use client";

import React from 'react';
import {
    Sparkles,
    BookOpen,
    Heart,
    Flower2,
    Compass,
    CheckCircle2,
    Crown,
    ScrollText
} from 'lucide-react';
import { cn } from "@/lib/utils";
import DashaRemediesCard from '@/components/upaya/DashaRemediesCard';
import DoshaRemedyGrid from '@/components/upaya/DoshaRemedyGrid';
import VedicStrengthPanel from '@/components/upaya/VedicStrengthPanel';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import styles from './RemedialShared.module.css';

interface VedicRemediesDashboardProps {
    data: any;
}

const VedicRemediesDashboard: React.FC<VedicRemediesDashboardProps> = ({ data }) => {
    // Extract data from the complex nested structure
    const analysis = data?.analysis || {};
    const remedies = data?.remedies || {};

    const dashaRemedies = remedies?.dasha_remedies || {};
    const doshaRemedies = remedies?.dosha_remedies || {};
    const planetaryStrength = analysis?.planetary_strength || {};
    const generalRecommendations = remedies?.general_recommendations || [];

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', borderColor: 'rgba(147, 51, 234, 0.3)' }}>
                            <Crown className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Vedic Remedial Protocol: {data.user_name || "User"}</h2>
                            <p className="text-xs" style={{ color: 'var(--text-body)' }}>Divine Alignment & Karmic Mitigation</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: D1 Chart Snapshot (3/12) */}
                <div className="lg:col-span-3">
                    <SadhanaChartPanel
                        chartData={analysis?.chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                </div>

                {/* Center Column: Dasha Remedies (Main Focus) (5/12) */}
                <div className="lg:col-span-5 h-full">
                    <DashaRemediesCard dashaData={dashaRemedies} />
                </div>

                {/* Right Column: Vigor & Doshas (4/12) */}
                <div className="lg:col-span-4 h-full flex flex-col gap-6">
                    <div className="flex-1">
                        <VedicStrengthPanel planetaryStrength={planetaryStrength} />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <ScrollText className="w-4 h-4 text-purple-600" />
                            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--ink)' }}>Active Doshas</h3>
                        </div>
                        <DoshaRemedyGrid
                            doshaRemedies={doshaRemedies}
                            doshaAnalysis={analysis?.doshas || {}}
                        />
                    </div>
                </div>
            </div>

            {/* Footer / General Recommendations */}
            <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--border-divider)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-90 hover:opacity-100 transition-opacity">
                    {generalRecommendations.slice(0, 4).map((rec: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-xs p-3 rounded-xl border transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'var(--border-antique)', color: 'var(--text-body)' }}>
                            <CheckCircle2 className="w-3 h-3 text-purple-600" />
                            <span>{rec}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VedicRemediesDashboard;
