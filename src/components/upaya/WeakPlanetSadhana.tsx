"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface SadhanaCount {
    total_count: number;
}

interface WeakPlanet {
    planet: string;
    current_position: string;
    count: SadhanaCount;
}

interface WeakPlanetSadhanaProps {
    weakPlanets: WeakPlanet[];
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

const WeakPlanetSadhana: React.FC<WeakPlanetSadhanaProps> = ({ weakPlanets }) => {
    // Mock percentages for visual match
    const mockPercentages: Record<string, number> = {
        'Mercury': 25,
        'Moon': 40,
        'Jupiter': 15
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[13px] font-medium tracking-[0.05em] text-amber-900/60 px-2">2. Long-Term Strengthening (Weak Planets)</h3>
            <div className="grid grid-cols-2 gap-4">
                {weakPlanets.slice(0, 3).map((planet, idx) => {
                    const percentage = mockPercentages[planet.planet] || 30;
                    const isIndigo = planet.planet === 'Moon' || planet.planet === 'Jupiter'; // Example variance
                    return (
                        <div key={idx} className="flex items-center gap-3 px-2 py-1">
                            <CircularProgress percentage={percentage} color={isIndigo ? "indigo" : "amber"} />
                            <div className="min-w-0">
                                <h4 className="text-base font-medium text-ink truncate tracking-tight">{planet.planet} <span className="text-slate-400 text-[11px]">({planet.current_position.split(' ')[0]})</span></h4>
                                <p className="text-[12px] text-slate-500 font-medium tracking-tighter">Target: {planet.count.total_count.toLocaleString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeakPlanetSadhana;
