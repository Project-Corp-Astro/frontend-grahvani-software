"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpPlanet } from '@/types/kp.types';
import { ArrowDown } from 'lucide-react';

interface KpPlanetaryTableProps {
    planets: KpPlanet[];
    className?: string;
}

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊',
    'Ketu': '☋', 'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿',
    'Ju': '♃', 'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋',
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/**
 * KP Planetary Table
 * Displays planets with Nakshatra, Sub-Lord, Sub-Sub-Lord (key for KP)
 */
export default function KpPlanetaryTable({ planets, className }: KpPlanetaryTableProps) {
    if (!planets || planets.length === 0) {
        return (
            <div className="text-center py-8 text-muted text-sm">
                No planetary data available
            </div>
        );
    }

    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gradient-to-r from-copper-900 to-copper-800 text-amber-50">
                        <th className="py-3 px-4 text-left font-serif font-bold">Planet</th>
                        <th className="py-3 px-4 text-left font-serif font-bold">Sign</th>
                        <th className="py-3 px-4 text-left font-serif font-bold">Degree</th>
                        <th className="py-3 px-4 text-left font-serif font-bold">House</th>
                        <th className="py-3 px-4 text-left font-serif font-bold">Nakshatra</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-gold-primary">Star Lord</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-amber-300">Sub Lord</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-amber-200">Sub-Sub</th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((planet, idx) => (
                        <tr
                            key={planet.name}
                            className={cn(
                                "border-b border-antique/50 hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-softwhite"
                            )}
                        >
                            <td className="py-2.5 px-4">
                                <span className="flex items-center gap-2">
                                    <span className="text-xl">{planetEmojis[planet.name] || planetEmojis[planet.fullName || ''] || '●'}</span>
                                    <span className="font-serif font-bold text-ink">
                                        {planet.fullName || planet.name}
                                    </span>
                                    {planet.isRetrograde && (
                                        <span className="flex items-center text-red-500" title="Retrograde">
                                            <ArrowDown className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">R</span>
                                        </span>
                                    )}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="flex items-center gap-1">
                                    <span className="text-base">{signSymbols[planet.sign] || ''}</span>
                                    <span className="text-ink">{planet.sign}</span>
                                </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono text-xs text-muted">
                                {planet.degreeFormatted || `${planet.degree.toFixed(2)}°`}
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-copper-100 text-copper-700 text-xs font-bold">
                                    {planet.house}
                                </span>
                            </td>
                            <td className="py-2.5 px-4 text-ink text-xs">
                                {planet.nakshatra}
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-gold-primary/15 text-gold-dark rounded font-semibold text-xs">
                                    {planet.nakshatraLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-copper-100 text-copper-700 rounded font-semibold text-xs">
                                    {planet.subLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                {planet.subSubLord && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-semibold text-xs">
                                        {planet.subSubLord}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
