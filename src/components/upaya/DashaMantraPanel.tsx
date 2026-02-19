"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MantraInfo {
    sanskrit: string;
    transliteration: string;
    meaning: string;
}

interface DashaMantra {
    type: string;
    planet: string;
    mantra: MantraInfo;
    priority: string;
    daily_count: number;
    remaining_years: number;
}

interface DashaMantraPanelProps {
    mantras: DashaMantra[];
}

const Waveform = ({ color = "amber" }: { color?: "amber" | "indigo" }) => (
    <div className="flex items-center gap-0.5 h-6 opacity-30 group-hover:opacity-60 transition-opacity">
        {[2, 4, 3, 5, 4, 6, 4, 7, 3, 5, 4, 2].map((h, i) => (
            <motion.div
                key={i}
                animate={{ height: [h * 2, h * 4, h * 2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className={cn("w-0.5 rounded-full", color === "amber" ? "bg-amber-500" : "bg-indigo-500")}
            />
        ))}
    </div>
);

const DashaMantraPanel: React.FC<DashaMantraPanelProps> = ({ mantras }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-[13px] font-medium tracking-[0.05em] text-amber-900/60 px-2">1. High Priority: Dasha Period Mantras</h3>
            <div className="space-y-2">
                {mantras.slice(0, 2).map((mantra, idx) => {
                    const isActive = idx === 1; // Example active state from the reference image
                    const isMahadasha = mantra.type.includes('Maha');

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300",
                                isActive
                                    ? "bg-amber-500/5 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                                    : "bg-white/40 border-antique/20 hover:bg-white/60"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <button className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border",
                                    isActive
                                        ? "bg-amber-500 text-white border-amber-600"
                                        : "bg-white text-amber-600 border-antique/30"
                                )}>
                                    <Play className={cn("w-5 h-5", isActive ? "fill-current" : "")} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-medium text-ink tracking-tight">
                                        {mantra.planet} <span className="opacity-40 text-[12px]">({mantra.type})</span>
                                    </h4>
                                    <div className="flex items-baseline gap-2 overflow-hidden">
                                        <p className="text-lg font-serif text-ink tracking-tight truncate">
                                            {mantra.mantra.sanskrit}
                                        </p>
                                        <span className="text-[12px] font-medium text-amber-900/40 whitespace-nowrap">| Goal: {mantra.daily_count}</span>
                                    </div>
                                    {isActive && (
                                        <p className="text-[11px] text-amber-600 mt-0.5 font-medium tracking-wide italic">*Best during Rahu Kaal*</p>
                                    )}
                                </div>

                                <div className="hidden sm:block">
                                    <Waveform color={isMahadasha ? "amber" : "indigo"} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashaMantraPanel;
