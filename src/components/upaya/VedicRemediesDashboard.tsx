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
import { useVedicClient } from '@/context/VedicClientContext';

interface VedicRemediesDashboardProps {
    data: any;
}

const VedicRemediesDashboard: React.FC<VedicRemediesDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Extract data from the complex nested structure
    const analysis = data?.analysis || {};
    const remedies = data?.remedies || {};

    const dashaRemedies = remedies?.dasha_remedies || {};
    const doshaRemedies = remedies?.dosha_remedies || {};
    const planetaryStrength = analysis?.planetary_strength || {};
    const generalRecommendations = remedies?.general_recommendations || [];

    // Fallback for D1 Chart
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-6 animate-in fade-in duration-700", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-divider)' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                            Vedic Remedies : {data.user_name || "User"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Layout */}
            {/* Main Dashboard Layout - Rebalanced for more horizontal room */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* TOP ROW: Snapshot & Primary Remedies */}
                <div className="lg:col-span-4 h-full">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                </div>

                <div className="lg:col-span-8 h-full">
                    <DashaRemediesCard dashaData={dashaRemedies} />
                </div>

                {/* BOTTOM ROW: Technical Vigor & Expanded Doshas */}
                <div className="lg:col-span-4">
                    <VedicStrengthPanel planetaryStrength={planetaryStrength} />
                </div>

                <div className="lg:col-span-8">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6 px-4">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <ScrollText className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ink)' }}>Active Dosha Analysis</h3>
                                <p className="text-[10px] font-bold uppercase tracking-wider">Karmic Afflictions & Remedial Directives</p>
                            </div>
                        </div>
                        <DoshaRemedyGrid
                            doshaRemedies={doshaRemedies}
                            doshaAnalysis={analysis?.doshas || {}}
                        />
                    </div>
                </div>
            </div>

            {/* Footer / General Recommendations - Premium Styling */}
            <div className="border-t pt-8 mt-12 bg-white/30 rounded-3xl p-6 border-antique/20" style={{ borderColor: 'var(--border-antique)' }}>
                <div className="flex items-center gap-2 mb-6 px-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">General Daily Alignment</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {generalRecommendations.slice(0, 4).map((rec: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 text-[11px] p-4 rounded-2xl border bg-white/50 backdrop-blur-sm hover:border-purple-200 transition-all group" style={{ borderColor: 'var(--border-antique)', color: 'var(--text-body)' }}>
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <span className="font-semibold leading-relaxed">{rec}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VedicRemediesDashboard;
