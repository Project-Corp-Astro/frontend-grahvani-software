"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Info, AlertCircle, ShieldCheck, MapPin, Zap } from 'lucide-react';

interface GemstoneAnalysisCardProps {
    gemstone: any;
    isRecommended: boolean;
    priority?: number;
}

export default function GemstoneAnalysisCard({ gemstone, isRecommended, priority }: GemstoneAnalysisCardProps) {
    const { planet, analysis, gem_data, position, rulerships, dasha_status } = gemstone;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative border-2 rounded-[2rem] p-6 transition-all duration-500 overflow-hidden",
                isRecommended
                    ? "bg-white/60 border-antique hover:border-gold-primary/40 shadow-sm hover:shadow-xl"
                    : "bg-red-50/10 border-red-100 hover:border-red-200 opacity-90"
            )}
        >
            {/* Header: Planet & Stone */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border",
                        isRecommended ? "bg-parchment border-antique" : "bg-red-50 border-red-100"
                    )}>
                        <span className="text-2xl">{getGemEmoji(gem_data.stone)}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-serif font-black text-ink">{gem_data.stone}</h3>
                            {priority && (
                                <span className="text-[10px] font-bold bg-gold-primary/10 text-gold-dark px-2 py-0.5 rounded-full border border-gold-primary/20">
                                    Priority {priority}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">
                            For {planet}
                        </p>
                    </div>
                </div>

                <div className={cn(
                    "px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5",
                    analysis.nature === 'Benefic'
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-red-50 border-red-100 text-red-700"
                )}>
                    {analysis.nature === 'Benefic' ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {analysis.nature}
                </div>
            </div>

            {/* Content Body: Logic & Implementation */}
            <div className="space-y-4">
                {/* 1. Astrologer's Logic */}
                <div className={cn(
                    "p-4 rounded-2xl border relative overflow-hidden",
                    isRecommended ? "bg-parchment/40 border-antique/50" : "bg-red-50/30 border-red-100/50"
                )}>
                    <div className="flex items-start gap-3 mb-2">
                        <Info className={cn("w-4 h-4 shrink-0 mt-0.5", isRecommended ? "text-gold-dark" : "text-red-500")} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-ink">Astrological Rationale</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-ink/80 italic font-medium">
                        "{analysis.logic}"
                    </p>
                </div>

                {/* 2. Key Specs (Horizontal Scrollable or Grid) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/40 p-3 rounded-xl border border-antique/30">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Metal & Finger</p>
                        <p className="text-[11px] font-bold text-ink">{gem_data.metal} — {gem_data.finger}</p>
                    </div>
                    <div className="bg-white/40 p-3 rounded-xl border border-antique/30">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Placement</p>
                        <p className="text-[11px] font-bold text-ink">
                            {position.sign} in {position.house}{getOrdinal(position.house)} House
                            {position.is_retro && <span className="ml-1 text-red-500 text-[9px]">(R)</span>}
                            {position.is_combust && <span className="ml-1 text-amber-600 text-[9px]">(C)</span>}
                        </p>
                    </div>
                </div>

                {/* 3. Status Badges: Dasha & Rulerships */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {rulerships.length > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 rounded-lg border border-sky-100">
                            <MapPin className="w-3 h-3 text-sky-600" />
                            <span className="text-[10px] font-black text-sky-800">Houses: {rulerships.join(', ')}</span>
                        </div>
                    )}
                    {dasha_status.is_active && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 animate-pulse">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span className="text-[10px] font-black text-amber-800">Running {dasha_status.period}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Accent Emoji */}
            <div className="absolute -bottom-4 -right-2 opacity-[0.03] text-8xl pointer-events-none select-none">
                {getGemEmoji(gem_data.stone)}
            </div>
        </motion.div>
    );
}

// Helpers
function getGemEmoji(stone: string): string {
    const s = stone.toLowerCase();
    if (s.includes('pearl')) return '⚪';
    if (s.includes('ruby')) return '🔴';
    if (s.includes('emerald')) return '🟢';
    if (s.includes('yellow sapphire')) return '🟡';
    if (s.includes('blue sapphire')) return '🔵';
    if (s.includes('red coral')) return '🪸';
    if (s.includes('diamond') || s.includes('opal')) return '💎';
    if (s.includes('hessonite')) return '🍯';
    if (s.includes('cat')) return '👁️';
    return '💎';
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
