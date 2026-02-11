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
    neutral: 'text-primary'
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
        <div className={cn("w-full bg-softwhite rounded-xl border border-antique shadow-card p-4", className)}>
            {/* Header with Legend */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-serif font-bold text-primary">Shodashvarga Summary</h2>
                <div className="flex gap-3 text-xs font-medium font-sans">
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>Exalted</span>
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>Own</span>
                    <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Debilitated</span>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-antique max-w-7xl mx-auto">
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-amber-50/30 border-b border-antique">
                            <th className="py-2 px-3 text-left font-semibold text-primary font-sans uppercase border-r border-antique w-28">Varga</th>
                            <th className="py-2 px-1 text-center font-semibold text-primary font-sans border-r border-antique">Asc</th>
                            {PLANETS.map(p => (
                                <th key={p} className="py-2 px-1 text-center font-semibold text-primary font-sans border-r border-antique">
                                    {p.substring(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {VARGA_ORDER.map((v, i) => (
                            <tr key={v.key} className={cn("border-b border-antique font-sans", i % 2 === 1 && "bg-parchment/30")}>
                                <td className="py-1.5 px-3 border-r border-antique">
                                    <span className="text-primary font-bold mr-1.5">{v.key}</span>
                                    <span className="text-primary">{v.name}</span>
                                </td>
                                <td className="py-1.5 text-center text-primary border-r border-antique">
                                    {SIGN_ABBR[getSign('Ascendant', v.key).charAt(0).toUpperCase() + getSign('Ascendant', v.key).slice(1).toLowerCase()] || getSign('Ascendant', v.key).substring(0, 2)}
                                </td>
                                {PLANETS.map(p => {
                                    const sign = getSign(p, v.key);
                                    const abbr = SIGN_ABBR[sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()] || sign.substring(0, 2);
                                    const dignity = getDignity(p, sign);
                                    return (
                                        <td key={p} className="py-1.5 text-center border-r border-antique">
                                            <span className={cn("font-medium", DIGNITY_STYLE[dignity])}>
                                                {sign === '-' ? '-' : abbr}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🌟 NEW: Dignity Score Cards */}
            <div className="mt-6">
                <div className="text-xs font-bold text-primary uppercase mb-2 font-sans">Planetary Dignity Score (across 16 Vargas)</div>
                <div className="grid grid-cols-9 gap-2">
                    {dignityScores.map(ps => (
                        <div key={ps.planet} className={cn(
                            "rounded-lg p-2 text-center border",
                            ps.score > 3 ? "bg-green-50 border-green-200" :
                                ps.score < 0 ? "bg-red-50 border-red-200" :
                                    "bg-softwhite border-antique"
                        )}>
                            <div className="text-2xs font-bold text-primary font-sans uppercase">{ps.planet.substring(0, 3)}</div>
                            <div className="text-lg font-bold text-primary font-sans">{ps.score}</div>
                            <div className="flex justify-center gap-1 text-[9px] font-medium font-sans">
                                {ps.exalted > 0 && <span className="text-emerald-600">{ps.exalted}E</span>}
                                {ps.own > 0 && <span className="text-green-600">{ps.own}O</span>}
                                {ps.debilitated > 0 && <span className="text-red-500">{ps.debilitated}D</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="flex justify-between mt-3 text-xs font-medium font-sans">
                <span className="text-emerald-700">⭐ Strongest: {strongestPlanet.planet} (Score: {strongestPlanet.score})</span>
                <span className="text-red-600">⚠ Weakest: {weakestPlanet.planet} (Score: {weakestPlanet.score})</span>
            </div>
        </div>
    );
}
