"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Shield, Zap, TrendingDown, Anchor } from 'lucide-react';

export interface DetailedPlanetInfo {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    house: number;
    isRetro?: boolean;
    dignity?: 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friend' | 'Neutral' | 'Enemy';
    isCombust?: boolean;
    shadbala?: number; // In Rupas
    avastha?: string; // e.g., Jagrat
    karaka?: string; // e.g., Atmakaraka
}

interface PlanetaryAnalyticsProps {
    planets: DetailedPlanetInfo[];
}

export default function PlanetaryAnalytics({ planets }: PlanetaryAnalyticsProps) {
    return (
        <div className="bg-[#FFFFFF]/60 border border-[#D08C60]/30 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md group">
            <div className="p-6 border-b border-[#D08C60]/20 flex items-center justify-between bg-gradient-to-r from-[#D08C60]/10 to-transparent">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#D08C60]" />
                    <h3 className="text-sm font-bold text-[#3E2A1F] uppercase tracking-[0.2em] font-serif">Planetary State Mastery</h3>
                </div>
                <div className="bg-[#D08C60]/10 text-[#D08C60] text-[9px] px-3 py-1 rounded-full border border-[#D08C60]/30 font-black uppercase tracking-widest">
                    Live Computation
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#3E2A1F]/5 border-b border-[#D08C60]/20">
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Graha</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Longitude</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Sign (Rashi)</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Nakshatra</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Shadbala</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Avastha</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Dignity</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-[#5A3E2B]/70">Karaka</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D08C60]/10">
                        {planets.map((planet) => (
                            <tr key={planet.planet} className="hover:bg-[#3E2A1F]/5 transition-colors group/row">
                                <td className="p-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            planet.isRetro ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-[#D08C60]"
                                        )} />
                                        <span className="font-serif font-extrabold text-[#3E2A1F] text-lg tracking-tight">{planet.planet}</span>
                                        {planet.isRetro && <TrendingDown className="w-3 h-3 text-red-500 animate-pulse" />}
                                    </div>
                                </td>
                                <td className="p-4 px-6">
                                    <span className="font-mono text-xs text-[#3E2A1F] font-bold bg-[#3E2A1F]/5 px-2 py-1 rounded border border-[#3E2A1F]/10">{planet.degree}</span>
                                </td>
                                <td className="p-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-[#3E2A1F] font-serif font-bold">{planet.sign}</span>
                                        <span className="text-[9px] text-[#3E2A1F]/50 uppercase font-black">House {planet.house}</span>
                                    </div>
                                </td>
                                <td className="p-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-[#3E2A1F] font-serif font-bold">{planet.nakshatra} - {planet.pada}</span>
                                        <span className="text-[9px] text-[#A8653A] uppercase font-black tracking-widest">Lord: {planet.nakshatraLord}</span>
                                    </div>
                                </td>

                                {/* Shadbala Cell */}
                                <td className="p-4 px-6">
                                    <div className="flex flex-col gap-1 w-24">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-[#3E2A1F]">{planet.shadbala || 0}</span>
                                            <span className="text-[8px] text-[#8B5A2B] uppercase">Rupas</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#3E2A1F]/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#D08C60] to-[#8B5A2B] rounded-full"
                                                style={{ width: `${Math.min(((planet.shadbala || 0) / 8) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                {/* Avastha Cell */}
                                <td className="p-4 px-6">
                                    <span className="text-xs font-serif font-medium text-[#3E2A1F] italic">{planet.avastha || "—"}</span>
                                </td>

                                <td className="p-4 px-6">
                                    <DignityBadge dignity={planet.dignity} />
                                </td>

                                {/* Karaka Cell */}
                                <td className="p-4 px-6">
                                    {planet.karaka ? (
                                        <span className="bg-[#3E2A1F] text-[#FEFAEA] text-[9px] font-black px-2 py-0.5 rounded border border-[#D08C60]/50 uppercase tracking-widest shadow-sm">
                                            {planet.karaka}
                                        </span>
                                    ) : (
                                        <span className="text-[#3E2A1F]/20 text-[8px] font-black uppercase tracking-tighter">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DignityBadge({ dignity }: { dignity?: DetailedPlanetInfo['dignity'] }) {
    if (!dignity) return <span className="text-[#3E2A1F]/20 text-[8px] font-black uppercase tracking-tighter">—</span>;

    const styles: Record<string, string> = {
        'Exalted': 'bg-green-500/10 text-green-700 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
        'Debilitated': 'bg-red-500/10 text-red-600 border-red-500/30',
        'Moolatrikona': 'bg-[#FFD27D]/20 text-[#A06D00] border-[#FFD27D]/50',
        'Own Sign': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
        'Friend': 'bg-[#3E2A1F]/5 text-[#3E2A1F]/70 border-[#3E2A1F]/10',
        'Neutral': 'bg-[#3E2A1F]/5 text-[#3E2A1F]/40 border-[#3E2A1F]/10',
        'Enemy': 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
            styles[dignity] || styles['Neutral']
        )}>
            {dignity === 'Exalted' && <Zap className="w-2 h-2" />}
            {dignity === 'Debilitated' && <Anchor className="w-2 h-2" />}
            {dignity}
        </div>
    );
}
