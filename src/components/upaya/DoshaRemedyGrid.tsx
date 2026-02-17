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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doshaList.map(([key, dosha], idx) => {
                const styles = getSeverityStyles(dosha.severity);
                const analysis = doshaAnalysis[key];

                // Light Theme Severity Styles override
                const getLightSeverityStyles = (severity: string) => {
                    switch (severity.toLowerCase()) {
                        case 'high':
                            return {
                                container: 'bg-rose-50/20 border-rose-200/50 hover:border-rose-400/50',
                                iconBg: 'bg-rose-100/50 text-rose-600',
                                badge: 'bg-rose-100 text-rose-700 border-rose-200',
                                accent: 'text-rose-700'
                            };
                        case 'medium':
                            return {
                                container: 'bg-amber-50/20 border-amber-200/50 hover:border-amber-400/50',
                                iconBg: 'bg-amber-100/50 text-amber-600',
                                badge: 'bg-amber-100 text-amber-700 border-amber-200',
                                accent: 'text-amber-700'
                            };
                        default:
                            return {
                                container: 'bg-emerald-50/20 border-emerald-200/50 hover:border-emerald-400/50',
                                iconBg: 'bg-emerald-100/50 text-emerald-600',
                                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                accent: 'text-emerald-700'
                            };
                    }
                };

                const lightStyles = getLightSeverityStyles(dosha.severity);

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + idx * 0.05 }}
                        className={cn(
                            "group relative rounded-2xl border p-5 transition-all duration-300",
                            lightStyles.container,
                            "hover:shadow-sm hover:bg-white"
                        )}
                    >
                        {/* Status Pin */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            <span className={cn("px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border", lightStyles.badge)}>
                                {dosha.severity}
                            </span>
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                            <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-105", lightStyles.iconBg)}>
                                <div className="w-5 h-5 flex items-center justify-center">
                                    {styles.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-bold tracking-tight leading-tight" style={{ color: 'var(--ink)' }}>{dosha.dosha_name}</h3>
                                <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-body)' }}>{dosha.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Impact Areas */}
                            <div>
                                <div className="flex flex-wrap gap-1.5">
                                    {dosha.impact_areas.map((area, i) => (
                                        <span key={i} className="text-[9px] px-2 py-0.5 bg-white/40 rounded-md border font-bold uppercase tracking-tight" style={{ color: 'var(--ink)', borderColor: 'var(--border-antique)' }}>
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Analysis / Cancellations */}
                            {analysis && (analysis.cancellation_factors?.length || analysis.positive_note) && (
                                <div className="p-3 rounded-xl border bg-indigo-50/20" style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <FileWarning className="w-2.5 h-2.5 text-indigo-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Neutralizing Factors</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {analysis.cancellation_factors?.map((factor, i) => (
                                            <li key={i} className="text-[10px] flex items-start gap-1.5" style={{ color: 'var(--text-body)' }}>
                                                <span className="text-indigo-400 mt-0.5">•</span>
                                                {factor}
                                            </li>
                                        ))}
                                        {analysis.positive_note && (
                                            <li className="text-[10px] italic flex items-start gap-1.5 mt-1 text-emerald-700">
                                                <Compass className="w-2.5 h-2.5 mt-0.5 shrink-0" />
                                                <span>{analysis.positive_note}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Remedial Steps */}
                            <div className="border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <HandHeart className="w-2.5 h-2.5" style={{ color: lightStyles.accent }} />
                                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--ink)' }}>Prescribed Action</span>
                                </div>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {dosha.remedies.slice(0, 3).map((remedy, i) => (
                                        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-white/40 rounded-md border border-transparent hover:border-purple-100 hover:bg-white transition-all cursor-default">
                                            <div className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                                            <span className="text-xs font-medium" style={{ color: 'var(--ink)' }}>{remedy}</span>
                                        </div>
                                    ))}
                                    {dosha.remedies.length > 3 && (
                                        <button className="text-[9px] font-black uppercase tracking-widest mt-1 flex items-center gap-1 hover:opacity-75 transition-colors ml-3" style={{ color: lightStyles.accent }}>
                                            +{dosha.remedies.length - 3} More <ChevronRight className="w-2.5 h-2.5" />
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
