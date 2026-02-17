"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    ShieldAlert,
    Award
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface PlanetStrength {
    strength_score: number;
    is_weak: boolean;
    severity: string;
    benefic_factors: string[];
    afflictions: string[];
}

interface VedicStrengthPanelProps {
    planetaryStrength: Record<string, PlanetStrength>;
}

const VedicStrengthPanel: React.FC<VedicStrengthPanelProps> = ({ planetaryStrength }) => {
    // Sort planets: weak ones first, then by score
    const planets = Object.entries(planetaryStrength).sort((a, b) => {
        if (a[1].is_weak !== b[1].is_weak) return a[1].is_weak ? -1 : 1;
        return a[1].strength_score - b[1].strength_score;
    });

    const getStrengthColor = (score: number, isWeak: boolean) => {
        if (isWeak) return "from-rose-500 to-rose-600 shadow-rose-500/20";
        if (score >= 80) return "from-indigo-500 to-purple-600 shadow-purple-500/20";
        if (score >= 60) return "from-emerald-500 to-teal-600 shadow-emerald-500/20";
        return "from-amber-500 to-orange-600 shadow-amber-500/20";
    };

    return (
        <div className={cn("p-6 shadow-sm relative overflow-hidden h-full backdrop-blur-md", styles.glassPanel)}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                        <Zap className="w-5 h-5 text-purple-600" />
                        Planetary Vigor
                    </h3>
                    <p className="text-xs mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>Strength & Afflictions Analysis</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-emerald-700">Strong</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-rose-700">Weak</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planets.map(([name, data], idx) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                            "group border rounded-2xl p-4 transition-all",
                            data.is_weak
                                ? "border-rose-200 bg-rose-50/30"
                                : "border-emerald-100 bg-emerald-50/20 hover:border-purple-200 hover:bg-white"
                        )}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--ink)' }}>{name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-tight",
                                        data.is_weak ? "text-rose-600" : "text-emerald-600"
                                    )}>
                                        {data.is_weak ? 'Needs Vigor' : 'Stable'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black leading-none" style={{ color: 'var(--ink)' }}>{data.strength_score}</span>
                                <span className="text-[8px] block font-bold uppercase -mt-1" style={{ color: 'var(--text-muted)' }}>Vigor</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mb-3 border border-antique/20">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.strength_score}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className={cn(
                                    "h-full rounded-full bg-gradient-to-r",
                                    getStrengthColor(data.strength_score, data.is_weak)
                                )}
                            />
                        </div>

                        {/* Factors - More Compact */}
                        <div className="flex flex-wrap gap-1">
                            {data.afflictions.length > 0 && (
                                <span className="text-[8px] px-1.5 py-0.5 bg-rose-500/5 text-rose-600 border border-rose-500/10 rounded font-medium flex items-center gap-0.5">
                                    <ShieldAlert className="w-2 h-2" /> {data.afflictions[0].substring(0, 15)}...
                                </span>
                            )}
                            {data.benefic_factors.length > 0 && (
                                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 rounded font-medium flex items-center gap-0.5">
                                    <ShieldCheck className="w-2 h-2" /> {data.benefic_factors[0].substring(0, 15)}...
                                </span>
                            )}
                        </div>

                        {/* Recommendation Trigger */}
                        {data.is_weak && (
                            <div className="mt-3 pt-3 border-t border-antique/20 flex items-center justify-between">
                                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Priority Mitigation</span>
                                <Award className="w-3 h-3 text-purple-600 animate-pulse" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Aesthetic Background Pattern */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/5 blur-3xl rounded-full" />
        </div>
    );
};

export default VedicStrengthPanel;
