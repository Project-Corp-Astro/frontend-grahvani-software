"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ShieldAlert,
    HandHeart,
    CheckCircle2,
    ChevronRight,
    Search,
    Brain,
    Scale,
    Activity,
    FileWarning,
    Compass
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface DoshaRemedy {
    dosha_name: string;
    description: string;
    severity: string;
    impact_areas: string[];
    remedies: string[];
}

interface DoshaAnalysis {
    base_score?: number;
    final_score?: number;
    cancellation_factors?: string[] | null;
    classical_basis?: string;
    conjunction_orb?: number;
    positive_note?: string;
}

interface DoshaRemedyGridProps {
    doshaRemedies: Record<string, DoshaRemedy>;
    doshaAnalysis: Record<string, DoshaAnalysis>;
}

const DoshaRemedyGrid: React.FC<DoshaRemedyGridProps> = ({ doshaRemedies, doshaAnalysis }) => {
    const doshaList = Object.entries(doshaRemedies);

    const getSeverityStyles = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
                return {
                    border: 'border-rose-500/30',
                    bg: 'bg-rose-500/5',
                    accent: 'text-rose-400',
                    dot: 'bg-rose-500',
                    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]',
                    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
                };
            case 'medium':
                return {
                    border: 'border-amber-500/30',
                    bg: 'bg-amber-500/5',
                    accent: 'text-amber-400',
                    dot: 'bg-amber-500',
                    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
                    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
                };
            default:
                return {
                    border: 'border-emerald-500/30',
                    bg: 'bg-emerald-500/5',
                    accent: 'text-emerald-400',
                    dot: 'bg-emerald-500',
                    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                };
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doshaList.map(([key, dosha], idx) => {
                const styles = getSeverityStyles(dosha.severity);
                const analysis = doshaAnalysis[key];

                // Light Theme Severity Styles override
                const getLightSeverityStyles = (severity: string) => {
                    switch (severity.toLowerCase()) {
                        case 'high':
                            return {
                                container: 'bg-rose-50/50 border-rose-200 hover:border-rose-300',
                                iconBg: 'bg-rose-100 text-rose-600',
                                badge: 'bg-rose-100 text-rose-700 border-rose-200',
                                accent: 'text-rose-700'
                            };
                        case 'medium':
                            return {
                                container: 'bg-amber-50/50 border-amber-200 hover:border-amber-300',
                                iconBg: 'bg-amber-100 text-amber-600',
                                badge: 'bg-amber-100 text-amber-700 border-amber-200',
                                accent: 'text-amber-700'
                            };
                        default:
                            return {
                                container: 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300',
                                iconBg: 'bg-emerald-100 text-emerald-600',
                                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                accent: 'text-emerald-700'
                            };
                    }
                };

                const lightStyles = getLightSeverityStyles(dosha.severity);

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className={cn(
                            "group relative rounded-2xl border p-6 transition-all duration-300",
                            lightStyles.container,
                            "hover:shadow-md hover:bg-white/80"
                        )}
                    >
                        {/* Status Pin */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border", lightStyles.badge)}>
                                {dosha.severity}
                            </span>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-105", lightStyles.iconBg)}>
                                {styles.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{dosha.dosha_name}</h3>
                                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-body)' }}>{dosha.description}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Impact Areas */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="w-3 h-3" style={{ color: lightStyles.accent }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Major Impacts</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {dosha.impact_areas.map((area, i) => (
                                        <span key={i} className="text-[11px] px-3 py-1 bg-white/60 rounded-full border font-medium" style={{ color: 'var(--text-body)', borderColor: 'var(--border-antique)' }}>
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Analysis / Cancellations */}
                            {analysis && (analysis.cancellation_factors?.length || analysis.positive_note) && (
                                <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileWarning className="w-3 h-3 text-indigo-600" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Neutralizing Factors</span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {analysis.cancellation_factors?.map((factor, i) => (
                                            <li key={i} className="text-[11px] flex items-start gap-2" style={{ color: 'var(--text-body)' }}>
                                                <span className="text-emerald-600 mt-0.5">•</span>
                                                {factor}
                                            </li>
                                        ))}
                                        {analysis.positive_note && (
                                            <li className="text-[11px] italic flex items-start gap-2 mt-1 text-emerald-700">
                                                <Compass className="w-2.5 h-2.5 mt-0.5" />
                                                {analysis.positive_note}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Remedial Steps */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <HandHeart className="w-3 h-3" style={{ color: lightStyles.accent }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Prescribed Remedies</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {dosha.remedies.slice(0, 4).map((remedy, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-transparent hover:border-purple-200 hover:bg-white transition-colors cursor-default">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{remedy}</span>
                                        </div>
                                    ))}
                                    {dosha.remedies.length > 4 && (
                                        <button className="text-[11px] font-bold uppercase tracking-widest mt-2 flex items-center gap-1 hover:opacity-75 transition-colors ml-4" style={{ color: lightStyles.accent }}>
                                            +{dosha.remedies.length - 4} More specific actions <ChevronRight className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DoshaRemedyGrid;
