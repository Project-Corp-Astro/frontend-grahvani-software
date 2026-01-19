"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';

interface DignityMatrixProps {
    data: any; // Raw API response containing multiple divisional charts
    className?: string;
}

const VARGAS = [
    { id: 'D1', weight: 6, label: 'Rashi' },
    { id: 'D2', weight: 2, label: 'Hora' },
    { id: 'D3', weight: 4, label: 'Drekkana' },
    { id: 'D7', weight: 5, label: 'Saptamsha' },
    { id: 'D9', weight: 5, label: 'Navamsha' },
    { id: 'D10', weight: 4, label: 'Dashamsha' },
    { id: 'D12', weight: 4, label: 'Dwadashamsha' },
    { id: 'D16', weight: 2, label: 'Shodashamsha' },
    { id: 'D30', weight: 2, label: 'Trimshamsha' },
    { id: 'D60', weight: 5, label: 'Shashtiamsha' },
];

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export default function ShodashaDignity({ data, className }: DignityMatrixProps) {

    // Mock logic for determining dignity (Ideally this comes from API or shared logic)
    const getDignityLabel = (planet: string, sign: string) => {
        const ucha: any = { 'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn', 'Mercury': 'Virgo', 'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra' };
        const neecha: any = { 'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer', 'Mercury': 'Pisces', 'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries' };
        const swakshetra: any = {
            'Sun': ['Leo'], 'Moon': ['Cancer'], 'Mars': ['Aries', 'Scorpio'], 'Mercury': ['Gemini', 'Virgo'],
            'Jupiter': ['Sagittarius', 'Pisces'], 'Venus': ['Taurus', 'Libra'], 'Saturn': ['Capricorn', 'Aquarius']
        };

        if (ucha[planet] === sign) return { label: 'Ucha', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
        if (neecha[planet] === sign) return { label: 'Neecha', color: 'text-rose-600 bg-rose-50 border-rose-100' };
        if (swakshetra[planet]?.includes(sign)) return { label: 'Swa', color: 'text-amber-600 bg-amber-50 border-amber-100' };
        return null;
    };

    // Calculate Vimsopaka Score (simplified)
    const calculateVimsopaka = (planet: string) => {
        let total = 0;
        VARGAS.forEach(v => {
            const chart = data?.charts?.find((c: any) => c.chartType === v.id);
            const pos = chart?.chartData?.planetary_positions?.[planet];
            if (pos) {
                const dignity = getDignityLabel(planet, pos.sign);
                if (dignity?.label === 'Ucha') total += v.weight * 1.5;
                else if (dignity?.label === 'Swa') total += v.weight * 1.0;
                else if (dignity?.label === 'Neecha') total += v.weight * 0.2;
                else total += v.weight * 0.7;
            }
        });
        return Math.min(20, (total / 30) * 20).toFixed(1);
    };

    return (
        <div className={cn("bg-white rounded-3xl border border-copper-200 shadow-sm overflow-hidden", className)}>
            <div className="p-6 border-b border-copper-100 bg-copper-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-serif text-copper-900 font-bold">Shodasha Dignity Matrix</h3>
                    <p className="text-sm text-copper-600">Planetary strength across divisional vargas</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-copper-600 text-white rounded-xl text-xs font-bold shadow-lg">
                    <Sparkles className="w-4 h-4" /> Vimsopaka Strength
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white">
                            <th className="p-4 text-[10px] uppercase font-black text-copper-400 border-b border-copper-50 sticky left-0 bg-white z-10 w-24">Planet</th>
                            {VARGAS.map(v => (
                                <th key={v.id} className="p-4 text-[10px] uppercase font-black text-copper-400 border-b border-copper-50 text-center">
                                    {v.id}
                                    <div className="text-[8px] font-normal text-copper-300 normal-case">{v.label}</div>
                                </th>
                            ))}
                            <th className="p-4 text-[10px] uppercase font-black text-copper-600 border-b border-copper-50 text-right bg-copper-50/20">Vimsopaka</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PLANETS.map(p => {
                            const score = parseFloat(calculateVimsopaka(p));
                            return (
                                <tr key={p} className="hover:bg-copper-50/30 transition-colors group">
                                    <td className="p-4 font-bold text-copper-900 border-b border-copper-50 sticky left-0 bg-white z-10">{p}</td>
                                    {VARGAS.map(v => {
                                        const chart = data?.charts?.find((c: any) => c.chartType === v.id);
                                        const pos = chart?.chartData?.planetary_positions?.[p];
                                        const dignity = pos ? getDignityLabel(p, pos.sign) : null;
                                        return (
                                            <td key={v.id} className="p-2 border-b border-copper-50 text-center">
                                                {pos ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs text-copper-700 font-serif">{pos.sign.substring(0, 2)}</span>
                                                        {dignity && (
                                                            <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border mt-1", dignity.color)}>
                                                                {dignity.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-copper-200">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 border-b border-copper-50 text-right bg-copper-50/20">
                                        <div className={cn(
                                            "inline-block px-3 py-1 rounded-lg text-sm font-bold",
                                            score >= 15 ? "text-emerald-700 bg-emerald-50" :
                                                score >= 10 ? "text-copper-700 bg-copper-50" : "text-rose-700 bg-rose-50"
                                        )}>
                                            {score}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-copper-50/30 border-t border-copper-100 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-copper-600 font-bold uppercase">Ucha (Exalted)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-copper-600 font-bold uppercase">Swa (Own Sign)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] text-copper-600 font-bold uppercase">Neecha (Debilitated)</span>
                </div>
            </div>
        </div>
    );
}
