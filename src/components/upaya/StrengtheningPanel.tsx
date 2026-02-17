"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface StrengtheningPanelProps {
    planetaryStrengths: any;
}

export default function StrengtheningPanel({ planetaryStrengths }: StrengtheningPanelProps) {
    if (!planetaryStrengths) return null;

    // Filter for weak planets to display
    const weakPlanets = Object.entries(planetaryStrengths)
        .filter(([_, data]: [string, any]) => data.is_weak || data.percentage_of_required < 100)
        .sort((a: any, b: any) => a[1].percentage_of_required - b[1].percentage_of_required)
        .slice(0, 3); // Top 3 weakest

    return (
        <div className={cn("p-6 h-full backdrop-blur-md", styles.glassPanel)}>
            <h3 className="text-sm font-black mb-8" style={{ color: 'var(--ink)' }}>2. Long-Term Strengthening (Weak Planets)</h3>

            <div className="space-y-6">
                {weakPlanets.map(([name, data]: [string, any], idx) => {
                    const percentage = Math.round(data.percentage_of_required);
                    const stroke = getPlanetColor(name);
                    // Use a lighter gray for empty track in light mode
                    const trackColor = "rgba(0,0,0,0.1)";

                    return (
                        <div key={name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center p-1 relative shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'var(--border-antique)' }}>
                                    <div className={cn("w-full h-full rounded-full", getPlanetGradient(name))} />
                                    {/* Icon or Symbol could go here */}
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: 'var(--ink)' }}>{name.substring(0, 1)}</span>
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{name} <span className="text-[10px] font-black" style={{ color: 'var(--ink)' }}>({data.strength_category})</span></h5>
                                    <p className="text-[10px] font-black mt-0.5" style={{ color: 'var(--ink)' }}>Target: <span>{getTargetCount(name).toLocaleString()}</span></p>

                                    {/* Mini linear progress bar as shown in image */}
                                    <div className="mt-2 w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                        <motion.div
                                            className={cn("h-full", getPlanetBg(name))}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1.5, delay: idx * 0.2 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-16 h-16 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        stroke={trackColor}
                                        strokeWidth="3.5"
                                        fill="transparent"
                                    />
                                    <motion.circle
                                        cx="32" cy="32" r="28"
                                        stroke={stroke}
                                        strokeWidth="3.5"
                                        fill="transparent"
                                        strokeDasharray={175.84}
                                        initial={{ strokeDashoffset: 175.84 }}
                                        animate={{ strokeDashoffset: 175.84 - (175.84 * percentage) / 100 }}
                                        transition={{ duration: 2, ease: "easeOut", delay: idx * 0.2 }}
                                        strokeLinecap="round"
                                        className="drop-shadow-sm"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{percentage}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Helpers
function getPlanetColor(name: string): string {
    const colors: any = {
        'Sun': '#d97706', // Amber-600
        'Moon': '#64748b', // Slate-500 (visible on white)
        'Mars': '#dc2626', // Red-600
        'Mercury': '#059669', // Emerald-600
        'Jupiter': '#d97706', // Amber-600
        'Venus': '#db2777', // Pink-600
        'Saturn': '#4f46e5', // Indigo-600
        'Rahu': '#475569', // Slate-600
        'Ketu': '#b45309'  // Amber-700
    };
    return colors[name] || '#94A3B8';
}

function getPlanetBg(name: string): string {
    const bgs: any = {
        'Sun': 'bg-amber-500',
        'Moon': 'bg-slate-400',
        'Mars': 'bg-red-500',
        'Mercury': 'bg-emerald-500',
        'Jupiter': 'bg-yellow-500',
        'Venus': 'bg-pink-400',
        'Saturn': 'bg-indigo-500',
        'Rahu': 'bg-gray-600',
        'Ketu': 'bg-orange-600'
    };
    return bgs[name] || 'bg-slate-500';
}

function getPlanetGradient(name: string): string {
    const grads: any = {
        'Sun': 'bg-gradient-to-br from-amber-400 to-orange-600',
        'Moon': 'bg-gradient-to-br from-slate-200 to-slate-500',
        'Mars': 'bg-gradient-to-br from-red-400 to-rose-700',
        'Mercury': 'bg-gradient-to-br from-emerald-400 to-teal-700',
        'Jupiter': 'bg-gradient-to-br from-yellow-300 to-amber-600',
        'Venus': 'bg-gradient-to-br from-pink-300 to-fuchsia-600',
        'Saturn': 'bg-gradient-to-br from-indigo-400 to-blue-800',
        'Rahu': 'bg-gradient-to-br from-gray-500 to-slate-900',
        'Ketu': 'bg-gradient-to-br from-orange-400 to-amber-900'
    };
    return grads[name] || 'bg-slate-500';
}

function getTargetCount(name: string): number {
    // Arbitrary target counts for visualization as shown in image
    const targets: any = {
        'Mercury': 18036,
        'Moon': 11016,
        'Jupiter': 19008,
        'Sun': 7000,
        'Mars': 10000,
        'Venus': 16000,
        'Saturn': 23000
    };
    return targets[name] || 15000;
}
