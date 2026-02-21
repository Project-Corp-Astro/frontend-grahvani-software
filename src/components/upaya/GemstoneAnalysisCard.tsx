"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Info, AlertCircle, ShieldCheck, MapPin, Zap, Gem, Hand, Home } from 'lucide-react';

// ============================================================================
// Planet-to-Gemstone Color Map (matches app PLANET_THEMES aesthetic)
// ============================================================================
const PLANET_GEM_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    'Sun': { bg: '#FEF3E2', border: '#F59E0B', text: '#92400E', dot: '#F59E0B' },
    'Moon': { bg: '#F0F4FF', border: '#93A8D0', text: '#334155', dot: '#93A8D0' },
    'Mars': { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444' },
    'Mercury': { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981' },
    'Jupiter': { bg: '#FFFBEB', border: '#D4A24C', text: '#78350F', dot: '#D4A24C' },
    'Venus': { bg: '#FDF4FF', border: '#C084FC', text: '#6B21A8', dot: '#C084FC' },
    'Saturn': { bg: '#F1F5F9', border: '#475569', text: '#1E293B', dot: '#475569' },
    'Rahu': { bg: '#F5F3FF', border: '#7C3AED', text: '#4C1D95', dot: '#7C3AED' },
    'Ketu': { bg: '#FFF7ED', border: '#F97316', text: '#7C2D12', dot: '#F97316' },
};

interface GemstoneAnalysisCardProps {
    gemstone: any;
    isRecommended: boolean;
    priority?: number;
}

export default function GemstoneAnalysisCard({ gemstone, isRecommended, priority }: GemstoneAnalysisCardProps) {
    const { planet, analysis, gem_data, position, rulerships, dasha_status } = gemstone;
    const colors = PLANET_GEM_COLORS[planet] || PLANET_GEM_COLORS['Sun'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "group relative border rounded-2xl transition-all duration-300 overflow-hidden flex flex-col",
                isRecommended
                    ? "bg-white border-antique hover:border-gold-primary/50 shadow-sm hover:shadow-md"
                    : "bg-white border-red-200/60 hover:border-red-300 shadow-sm hover:shadow-md"
            )}
        >
            {/* ── Header ── */}
            <div className={cn(
                "px-5 py-4 flex items-center justify-between border-b",
                isRecommended ? "bg-parchment/20 border-antique/60" : "bg-red-50/30 border-red-100/40"
            )}>
                <div className="flex items-center gap-3 min-w-0">
                    {/* Gem dot */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: colors.bg, border: `1.5px solid ${colors.border}` }}>
                        <Gem className="w-4.5 h-4.5" style={{ color: colors.dot }} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif font-bold text-[15px] leading-tight"
                                style={{ color: 'var(--ink)' }}>
                                {gem_data.stone}
                            </h3>
                            {priority && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider"
                                    style={{
                                        backgroundColor: 'var(--gold-primary)',
                                        color: 'white',
                                        opacity: 0.9,
                                    }}>
                                    Priority {priority}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] font-semibold tracking-wider uppercase mt-0.5"
                            style={{ color: colors.text }}>
                            FOR {planet.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Nature Badge */}
                <div className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 border",
                    analysis.nature === 'Benefic'
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : analysis.nature === 'Neutral'
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-red-50 border-red-200 text-red-700"
                )}>
                    {analysis.nature === 'Benefic'
                        ? <ShieldCheck className="w-3 h-3" />
                        : <AlertCircle className="w-3 h-3" />}
                    {analysis.nature}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="px-5 py-4 space-y-4 flex-1 flex flex-col">

                {/* Astrological Rationale */}
                <div className={cn(
                    "p-3.5 rounded-xl border",
                    isRecommended
                        ? "bg-parchment/30 border-antique/40"
                        : "bg-red-50/20 border-red-100/30"
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <Info className={cn("w-3.5 h-3.5 shrink-0",
                            isRecommended ? "text-gold-dark" : "text-red-400"
                        )} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em]"
                            style={{ color: 'var(--text-muted-refined, #6B5D4F)' }}>
                            Astrological Rationale
                        </span>
                    </div>
                    <p className="text-[12px] leading-relaxed italic font-medium pl-5.5"
                        style={{ color: 'var(--text-secondary, #4A3F32)' }}>
                        "{analysis.logic}"
                    </p>
                </div>

                {/* Metal & Finger + Placement */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="p-3 rounded-xl bg-white border border-antique/30">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Hand className="w-3 h-3 text-gold-primary" />
                            <p className="text-[9px] font-bold uppercase tracking-[0.1em]"
                                style={{ color: 'var(--text-muted-refined, #6B5D4F)' }}>
                                Metal & Finger
                            </p>
                        </div>
                        <p className="text-[12px] font-semibold" style={{ color: 'var(--ink)' }}>
                            {gem_data.metal} — {gem_data.finger}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-antique/30">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Home className="w-3 h-3 text-gold-primary" />
                            <p className="text-[9px] font-bold uppercase tracking-[0.1em]"
                                style={{ color: 'var(--text-muted-refined, #6B5D4F)' }}>
                                Placement
                            </p>
                        </div>
                        <p className="text-[12px] font-semibold" style={{ color: 'var(--ink)' }}>
                            {position.sign} in {position.house}{getOrdinal(position.house)} House
                            {position.is_retro && <span className="ml-1 text-red-500 text-[9px] font-bold">(R)</span>}
                            {position.is_combust && <span className="ml-1 text-amber-600 text-[9px] font-bold">(C)</span>}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Footer: Badges ── */}
            {(rulerships.length > 0 || dasha_status.is_active) && (
                <div className={cn(
                    "px-5 py-3 flex flex-wrap items-center gap-2 border-t",
                    isRecommended ? "bg-parchment/10 border-antique/40" : "bg-red-50/10 border-red-100/30"
                )}>
                    {rulerships.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 rounded-lg border border-sky-100/60">
                            <MapPin className="w-3 h-3 text-sky-500" />
                            <span className="text-[10px] font-bold text-sky-700">
                                Houses: {rulerships.join(', ')}
                            </span>
                        </div>
                    )}
                    {dasha_status.is_active && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-100/60">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-700">
                                Running {dasha_status.period}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

// ============================================================================
// Helpers
// ============================================================================
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
