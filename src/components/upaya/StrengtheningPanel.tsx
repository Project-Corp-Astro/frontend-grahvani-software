"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface StrengtheningPanelProps {
    planetaryStrengths: any;
}

const CircularProgress = ({ percentage, color = "amber" }: { percentage: number, color?: "amber" | "indigo" }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-amber-900/5"
                />
                <motion.circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={color === "amber" ? "text-amber-500/80" : "text-indigo-500/80"}
                />
            </svg>
            <span className="absolute text-[13px] font-medium text-ink">{percentage}%</span>
        </div>
    );
};

export default function StrengtheningPanel({ planetaryStrengths }: StrengtheningPanelProps) {
    if (!planetaryStrengths) return null;

    // Filter for weak planets to display
    const weakPlanets = Object.entries(planetaryStrengths)
        .filter(([_, data]: [string, any]) => data.is_weak || data.percentage_of_required < 100)
        .sort((a: any, b: any) => a[1].percentage_of_required - b[1].percentage_of_required)
        .slice(0, 4); // Show top 4 in grid

    return (
        <div className="space-y-4">
            <h3 className="text-[13px] font-medium tracking-[0.05em] text-amber-900/60 px-2">2. Long-Term Strengthening (Weak Planets)</h3>

            <div className="grid grid-cols-2 gap-4">
                {weakPlanets.map(([name, data]: [string, any], idx) => {
                    const percentage = Math.round(data.percentage_of_required);
                    const isIndigo = name === 'Moon' || name === 'Jupiter' || name === 'Mars'; // Variance

                    return (
                        <div key={name} className="flex items-center gap-3 px-2 py-1">
                            <CircularProgress percentage={percentage} color={isIndigo ? "indigo" : "amber"} />
                            <div className="min-w-0">
                                <h4 className="text-base font-medium text-ink truncate tracking-tight">
                                    {name} <span className="text-slate-400 text-[11px]">({data.strength_category})</span>
                                </h4>
                                <p className="text-[12px] text-slate-500 font-medium tracking-tighter">
                                    Target: {getTargetCount(name).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Helper (matching original logic)
function getTargetCount(name: string): number {
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
