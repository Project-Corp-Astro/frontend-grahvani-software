"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

const signAbbreviations: Record<string, string> = {
    'Aries': 'Ari', 'Taurus': 'Tau', 'Gemini': 'Gem', 'Cancer': 'Can',
    'Leo': 'Leo', 'Virgo': 'Vir', 'Libra': 'Lib', 'Scorpio': 'Sco',
    'Sagittarius': 'Sag', 'Capricorn': 'Cap', 'Aquarius': 'Aqu', 'Pisces': 'Pis',
};

interface PlanetSnapshot {
    name: string;
    sign: string;
    isRetrograde?: boolean;
}

interface KpChartSummaryPanelProps {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    lagna?: string;
    lagnaLord?: string;
    ayanamsaType?: string;
    ayanamsaValue?: string;
    moonSign?: string;
    moonNakshatra?: string;
    moonStarLord?: string;
    houseCuspCount?: number;
    planets?: PlanetSnapshot[];
    className?: string;
}

/**
 * Chart Summary Panel
 * Compact card with birth details, Lagna, Ayanamsa, and quick planet glyphs
 */
export default function KpChartSummaryPanel({
    birthDate,
    birthTime,
    birthPlace,
    lagna,
    lagnaLord,
    ayanamsaType = 'KP',
    ayanamsaValue,
    moonSign,
    moonNakshatra,
    moonStarLord,
    houseCuspCount = 12,
    planets = [],
    className,
}: KpChartSummaryPanelProps) {
    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-5", className)}>
            <h3 className="text-base font-serif text-primary mb-4 flex items-center gap-2 font-semibold">
                <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                    <Compass className="w-3.5 h-3.5 text-gold-dark" />
                </div>
                Chart Summary
            </h3>

            {/* Key Details Grid */}
            <div className="space-y-2.5">
                <DetailRow label="Birth Date" value={birthDate || '—'} />
                <DetailRow label="Birth Time" value={birthTime || '—'} />
                <DetailRow label="Birth Place" value={birthPlace || '—'} />
                <div className="border-t border-antique/50 pt-2.5" />
                <DetailRow label="Lagna" value={lagna || '—'} highlight />
                <DetailRow label="Lagna Lord" value={lagnaLord || '—'} />
                <DetailRow label="Moon Sign" value={moonSign || '—'} />
                <DetailRow label="Moon Nakshatra" value={moonNakshatra || '—'} />
                <DetailRow label="Moon Star Lord" value={moonStarLord || '—'} />
                <div className="border-t border-antique/50 pt-2.5" />
                <DetailRow label="Ayanamsa" value={`${ayanamsaType}${ayanamsaValue ? ` (${ayanamsaValue})` : ''}`} highlight />
                <DetailRow label="House System" value="Placidus (KP)" />
                <DetailRow label="Cusps" value={`${houseCuspCount} houses`} />
            </div>

            {/* Planet Snapshot */}
            {planets.length > 0 && (
                <div className="mt-4 pt-3 border-t border-antique/50">
                    <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold mb-2">Planet Snapshot</p>
                    <div className="flex flex-wrap gap-1.5">
                        {planets.map((p) => (
                            <div
                                key={p.name}
                                className="flex items-center gap-1 px-2 py-1 bg-parchment border border-antique rounded text-xs"
                                title={`${p.name} in ${p.sign}${p.isRetrograde ? ' (R)' : ''}`}
                            >
                                <span className="text-sm">{planetEmojis[p.name] || '●'}</span>
                                <span className="font-sans text-secondary font-medium">
                                    {signAbbreviations[p.sign] || p.sign?.slice(0, 3)}
                                </span>
                                {p.isRetrograde && (
                                    <span className="text-red-500 text-[9px] font-bold">R</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-refined font-bold shrink-0">{label}</span>
            <span className={cn(
                "text-sm font-serif font-medium text-right",
                highlight ? "text-gold-dark font-bold" : "text-primary"
            )}>
                {value}
            </span>
        </div>
    );
}
