"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RemedyListPanelProps {
    recommendations: any[];
}

export default function RemedyListPanel({ recommendations }: RemedyListPanelProps) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className={cn("p-6 h-full rounded-3xl backdrop-blur-md", "bg-[rgba(254,250,234,0.6)] border border-[#E7D6B8]")}>
            <h3 className="text-sm font-semibold mb-8 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.2)', borderColor: 'rgba(201, 162, 77, 0.3)' }}>
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                </span>
                Prioritized Remedial Recommendations
            </h3>

            <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative border rounded-2xl p-4 transition-all duration-500"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: 'var(--border-antique)' }}
                    >
                        {/* Background Gem Glow - Adjusted for Light Theme */}
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 right-4 w-24 h-24 blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none",
                            getGemGlow(rec.gemstone_info.primary)
                        )} />

                        <div className="flex gap-4">
                            {/* Gemstone Image Placeholder */}
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border p-2 flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'var(--border-antique)' }}>
                                <div className={cn(
                                    "w-full h-full rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-700",
                                    getGemGradient(rec.gemstone_info.primary)
                                )} />
                                {/* Sparkle Effect Overlay - Darker for visibility */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-multiply" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="text-sm font-bold truncate" style={{ color: 'var(--ink)' }}>
                                        <span className="mr-2" style={{ color: 'var(--gold-dark)' }}>{rec.priority}.</span>
                                        {rec.gemstone_info.primary}
                                    </h4>
                                    <div className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: 'rgba(201, 162, 77, 0.2)' }}>
                                        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--gold-dark)' }}>{rec.planet}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--text-body)' }}>
                                    For {rec.planet} ({rec.reason.split('-')[0].trim()})
                                </p>

                                {rec.gemstone_info.warning && (
                                    <div className="flex items-start gap-1.5 text-[10px] font-bold p-1.5 rounded-lg border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.05)', borderColor: 'rgba(201, 162, 77, 0.1)', color: 'var(--gold-dark)' }}>
                                        <span className="flex-shrink-0 mt-0.5">⚠️</span>
                                        <span>{rec.gemstone_info.warning.replace('CRITICAL:', '').trim()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expandable Details on Hover */}
                        <div className="mt-4 pt-4 border-t hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: 'var(--border-divider)' }}>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Mantra</p>
                                    <p className="text-[10px] italic leading-tight line-clamp-2" style={{ color: 'var(--ink)' }}>"{rec.gemstone_info.mantra.split('(')[0]}"</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Finger & Day</p>
                                    <p className="text-[10px]" style={{ color: 'var(--ink)' }}>{rec.gemstone_info.finger} ({rec.gemstone_info.day})</p>
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
                                <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Key Benefits</p>
                                <p className="text-[10px] leading-normal" style={{ color: 'var(--text-body)' }}>{rec.benefits}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Helpers for visual aesthetics
function getGemGradient(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('blue sapphire')) return "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900";
    if (lower.includes('yellow sapphire')) return "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600";
    if (lower.includes('red coral')) return "bg-gradient-to-br from-red-500 via-rose-600 to-red-800";
    if (lower.includes('pearl')) return "bg-gradient-to-br from-slate-100 via-white to-slate-300 shadow-inner";
    if (lower.includes('emerald')) return "bg-gradient-to-br from-emerald-400 via-green-600 to-teal-900";
    return "bg-gradient-to-br from-slate-500 to-slate-900";
}

function getGemGlow(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('blue sapphire')) return "bg-blue-600";
    if (lower.includes('yellow sapphire')) return "bg-amber-400";
    if (lower.includes('red coral')) return "bg-red-600";
    if (lower.includes('pearl')) return "bg-slate-400";
    if (lower.includes('emerald')) return "bg-emerald-600";
    return "bg-slate-600";
}
