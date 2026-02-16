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
        <div className={cn("p-6 h-full backdrop-blur-md", styles.glassPanel)}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>3. Planetary Strengthening</h3>
                <div className="p-2 rounded-lg border" style={{ backgroundColor: 'primary', borderColor: 'var(--border-antique)' }}>
                    <Droplets className="w-4 h-4 text-emerald-600" />
                </div>
            </div>

            <div className="space-y-4">
                {weakPlanets.map((planet, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="border rounded-2xl p-5 relative overflow-hidden group transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{planet.planet}</h3>
                                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-body)' }}>{planet.current_position}</p>
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                                getSeverityColor(planet.severity)
                            )}>
                                {planet.severity}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="rounded-lg p-2 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'var(--border-antique)' }}>
                                <span className="block text-lg font-bold" style={{ color: 'var(--ink)' }}>{planet.count.duration_days}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Days</span>
                            </div>
                            <div className="rounded-lg p-2 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'var(--border-antique)' }}>
                                <span className="block text-lg font-bold" style={{ color: 'var(--ink)' }}>{planet.count.mala_rounds}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mala/Day</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-divider)' }}>
                            <div className="flex items-center gap-2">
                                <Target className="w-3 h-3 text-emerald-600" />
                                <span className="text-[10px] font-medium" style={{ color: 'var(--text-body)' }}>{planet.reasons[0].substring(0, 25)}...</span>
                            </div>
                            <ArrowRight className="w-3 h-3 transition-colors group-hover:text-emerald-600" style={{ color: 'var(--text-muted)' }} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WeakPlanetSadhana;
