"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Droplets,
    Calendar,
    RotateCcw,
    Info,
    ArrowRight,
    Target
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface SadhanaCount {
    base_count: number;
    multiplier: number;
    total_count: number;
    daily_count: number;
    duration_days: number;
    mala_rounds: number;
}

interface WeakPlanet {
    planet: string;
    house: number;
    current_position: string;
    severity: string;
    reasons: string[];
    best_day: string;
    count: SadhanaCount;
    mantra: {
        sanskrit: string;
        transliteration: string;
        meaning: string;
    };
}

interface WeakPlanetSadhanaProps {
    weakPlanets: WeakPlanet[];
}

const WeakPlanetSadhana: React.FC<WeakPlanetSadhanaProps> = ({ weakPlanets }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': case 'severe': return 'text-rose-600 bg-rose-50 border-rose-200';
            case 'medium': case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        }
    };

    return (
        <div className={cn("p-6 h-full backdrop-blur-md flex flex-col", styles.glassPanel)}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ink)' }}>Planetary Strengthening</h3>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {weakPlanets.map((planet, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="border rounded-2xl p-4 relative overflow-hidden group transition-all hover:bg-white/40 bg-white/20 border-antique/20"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/50 border border-antique/30 flex items-center justify-center font-black text-xs text-ink group-hover:scale-110 transition-transform">
                                    {planet.planet.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight leading-none mb-1" style={{ color: 'var(--ink)' }}>{planet.planet}</h3>
                                    <p className="text-[9px] font-black uppercase tracking-wider">{planet.current_position}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest",
                                getSeverityColor(planet.severity)
                            )}>
                                {planet.severity}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="rounded-xl p-2.5 text-center border bg-white/40 border-antique/20 group-hover:border-emerald-200/50 transition-colors">
                                <span className="block text-xl font-black tracking-tighter" style={{ color: 'var(--ink)' }}>{planet.count.duration_days}</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.1em]">Days Duration</span>
                            </div>
                            <div className="rounded-xl p-2.5 text-center border bg-white/40 border-antique/20 group-hover:border-emerald-200/50 transition-colors">
                                <span className="block text-xl font-black tracking-tighter" style={{ color: 'var(--ink)' }}>{planet.count.mala_rounds}</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.1em]">Mala Rounds</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-antique/10">
                            <div className="flex items-center gap-2 min-w-0">
                                <Target className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold truncate" style={{ color: 'var(--text-body)' }}>{planet.reasons[0]}</span>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-white/50 border border-antique/20 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-antique/20 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Sadhana Protocol</span>
                <Info className="w-3 h-3" />
            </div>
        </div>
    );
};

export default WeakPlanetSadhana;
