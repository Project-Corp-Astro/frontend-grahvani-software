"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ShodashaVargaTableProps {
    data: any;
    className?: string;
}

const VARGA_ORDER = [
    { key: 'D1', name: 'Janma' },
    { key: 'D2', name: 'Hora' },
    { key: 'D3', name: 'Dreshkana' },
    { key: 'D4', name: 'Chaturthamsha' },
    { key: 'D7', name: 'Saptamsha' },
    { key: 'D9', name: 'Navamsha' },
    { key: 'D10', name: 'Dashamsha' },
    { key: 'D12', name: 'Dwadashamsha' },
    { key: 'D16', name: 'Shodashamsha' },
    { key: 'D20', name: 'Vimshamsha' },
    { key: 'D24', name: 'Chaturvimshamsha' },
    { key: 'D27', name: 'Saptavimshamsha' },
    { key: 'D30', name: 'Trimshamsha' },
    { key: 'D40', name: 'Khavedamsha' },
    { key: 'D45', name: 'Akshavedamsha' },
    { key: 'D60', name: 'Shashtiamsha' }
];

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const DIGNITIES: Record<string, { own: string[], exalted: string, debilitated: string }> = {
    'Sun': { own: ['Leo'], exalted: 'Aries', debilitated: 'Libra' },
    'Moon': { own: ['Cancer'], exalted: 'Taurus', debilitated: 'Scorpio' },
    'Mars': { own: ['Aries', 'Scorpio'], exalted: 'Capricorn', debilitated: 'Cancer' },
    'Mercury': { own: ['Gemini', 'Virgo'], exalted: 'Virgo', debilitated: 'Pisces' },
    'Jupiter': { own: ['Sagittarius', 'Pisces'], exalted: 'Cancer', debilitated: 'Capricorn' },
    'Venus': { own: ['Taurus', 'Libra'], exalted: 'Pisces', debilitated: 'Virgo' },
    'Saturn': { own: ['Capricorn', 'Aquarius'], exalted: 'Libra', debilitated: 'Aries' },
    'Rahu': { own: ['Aquarius'], exalted: 'Taurus', debilitated: 'Scorpio' },
    'Ketu': { own: ['Scorpio'], exalted: 'Scorpio', debilitated: 'Taurus' }
};

const SIGN_ABBR: Record<string, string> = {
    'Aries': 'Ar', 'Taurus': 'Ta', 'Gemini': 'Ge', 'Cancer': 'Ca',
    'Leo': 'Le', 'Virgo': 'Vi', 'Libra': 'Li', 'Scorpio': 'Sc',
    'Sagittarius': 'Sa', 'Capricorn': 'Cp', 'Aquarius': 'Aq', 'Pisces': 'Pi'
};

const getDignity = (planet: string, sign: string): 'exalted' | 'own' | 'debilitated' | 'neutral' => {
    if (!planet || !sign || planet === 'Ascendant') return 'neutral';
    const d = DIGNITIES[planet];
    if (!d) return 'neutral';
    const s = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
    if (d.exalted === s) return 'exalted';
    if (d.own.includes(s)) return 'own';
    if (d.debilitated === s) return 'debilitated';
    return 'neutral';
};

const DIGNITY_STYLE: Record<string, string> = {
    exalted: 'text-emerald-700 font-bold',
    own: 'text-green-600 font-semibold',
    debilitated: 'text-red-500',
    neutral: 'text-[#5C4033]'
};

export default function ShodashaVargaTable({ data, className }: ShodashaVargaTableProps) {
    if (!data) return null;

    const summary = data.shodasha_varga_summary || data.shodasha_varga_signs || data;

    const getSign = (planet: string, varga: string): string => {
        const pd = summary[planet];
        if (!pd) return '-';
        const v = pd[varga];
        if (!v) return '-';
        return typeof v === 'object' && v.sign ? v.sign : String(v);
    };

    // 🌟 Calculate Dignity Scores for each planet
    const dignityScores = PLANETS.map(p => {
        let exalted = 0, own = 0, debilitated = 0, total = 0;
        VARGA_ORDER.forEach(v => {
            const sign = getSign(p, v.key);
            if (sign !== '-') {
                total++;
                const d = getDignity(p, sign);
                if (d === 'exalted') exalted++;
                else if (d === 'own') own++;
                else if (d === 'debilitated') debilitated++;
            }
        });
        const score = (exalted * 2) + own - debilitated; // Weighted score
        return { planet: p, exalted, own, debilitated, total, score };
    });

    const strongestPlanet = dignityScores.reduce((a, b) => a.score > b.score ? a : b);
    const weakestPlanet = dignityScores.reduce((a, b) => a.score < b.score ? a : b);

    return (
        <div className={cn("w-full", className)}>
            {/* Header with Legend */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-serif font-black text-[#3E2A1F]">Shodashvarga Summary</h2>
                <div className="flex gap-2 text-[9px] font-medium">
                    <span className="text-emerald-700">● Exalted</span>
                    <span className="text-green-600">● Own</span>
                    <span className="text-red-500">● Debilitated</span>
                </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-[#D08C60]">
                        <th className="py-1.5 px-2 text-left text-[9px] font-black text-[#3E2A1F] uppercase w-28">Varga</th>
                        <th className="py-1.5 px-1 text-center text-[8px] font-bold text-[#8B5A2B]">Asc</th>
                        {PLANETS.map(p => (
                            <th key={p} className="py-1.5 px-0.5 text-center text-[8px] font-bold text-[#8B5A2B]">
                                {p.substring(0, 3)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {VARGA_ORDER.map((v, i) => (
                        <tr key={v.key} className={cn("border-b border-[#E8DDD0]", i % 2 === 1 && "bg-[#FAF8F5]")}>
                            <td className="py-1 px-2">
                                <span className="text-[#D08C60] font-bold text-[10px] mr-1">{v.key}</span>
                                <span className="text-[10px] text-[#3E2A1F]">{v.name}</span>
                            </td>
                            <td className="py-1 text-center text-[10px] text-[#5C4033]">
                                {SIGN_ABBR[getSign('Ascendant', v.key).charAt(0).toUpperCase() + getSign('Ascendant', v.key).slice(1).toLowerCase()] || getSign('Ascendant', v.key).substring(0, 2)}
                            </td>
                            {PLANETS.map(p => {
                                const sign = getSign(p, v.key);
                                const abbr = SIGN_ABBR[sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()] || sign.substring(0, 2);
                                const dignity = getDignity(p, sign);
                                return (
                                    <td key={p} className="py-1 text-center">
                                        <span className={cn("text-[10px]", DIGNITY_STYLE[dignity])}>
                                            {sign === '-' ? '-' : abbr}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🌟 NEW: Dignity Score Cards */}
            <div className="mt-3">
                <div className="text-[10px] font-bold text-[#3E2A1F] uppercase mb-1">Planetary Dignity Score (across 16 Vargas)</div>
                <div className="grid grid-cols-9 gap-1">
                    {dignityScores.map(ps => (
                        <div key={ps.planet} className={cn(
                            "rounded-lg p-1.5 text-center border",
                            ps.score > 3 ? "bg-green-50 border-green-200" :
                                ps.score < 0 ? "bg-red-50 border-red-200" :
                                    "bg-[#FAF8F5] border-[#E8DDD0]"
                        )}>
                            <div className="text-[9px] font-bold text-[#3E2A1F]">{ps.planet.substring(0, 3)}</div>
                            <div className="text-lg font-black text-[#3E2A1F]">{ps.score}</div>
                            <div className="flex justify-center gap-1 text-[7px]">
                                {ps.exalted > 0 && <span className="text-emerald-600">{ps.exalted}E</span>}
                                {ps.own > 0 && <span className="text-green-500">{ps.own}O</span>}
                                {ps.debilitated > 0 && <span className="text-red-500">{ps.debilitated}D</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="flex justify-between mt-2 text-[10px] font-semibold">
                <span className="text-green-700">⭐ Strongest: {strongestPlanet.planet} (Score: {strongestPlanet.score})</span>
                <span className="text-red-600">⚠ Weakest: {weakestPlanet.planet} (Score: {weakestPlanet.score})</span>
            </div>
        </div>
    );
}
