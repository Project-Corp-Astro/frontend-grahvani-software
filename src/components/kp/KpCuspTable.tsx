"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpCusp } from '@/types/kp.types';

interface KpCuspTableProps {
    cusps: KpCusp[];
    className?: string;
}

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/**
 * KP Cusp Table
 * Displays all 12 house cusps with Star-Lord, Sub-Lord, Sub-Sub-Lord
 */
export default function KpCuspTable({ cusps, className }: KpCuspTableProps) {
    if (!cusps || cusps.length === 0) {
        return (
            <div className="text-center py-8 text-muted text-sm">
                No cusp data available
            </div>
        );
    }

    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-parchment border-b-2 border-gold-primary/30">
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">Cusp</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">Sign</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">Degree</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">Nakshatra</th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">
                            <span className="text-gold-dark">Star Lord</span>
                        </th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">
                            <span className="text-copper-600">Sub Lord</span>
                        </th>
                        <th className="py-3 px-4 text-left font-serif font-bold text-ink">
                            <span className="text-indigo-600">Sub-Sub</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cusps.map((cusp, idx) => (
                        <tr
                            key={cusp.cusp}
                            className={cn(
                                "border-b border-antique/50 hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-softwhite"
                            )}
                        >
                            <td className="py-2.5 px-4 font-bold text-ink">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark text-white text-xs font-bold">
                                    {cusp.cusp}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="text-lg">{signSymbols[cusp.sign] || ''}</span>
                                    <span className="font-medium text-ink">{cusp.sign}</span>
                                </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono text-xs text-muted">
                                {cusp.degreeFormatted || `${cusp.degree.toFixed(2)}°`}
                            </td>
                            <td className="py-2.5 px-4 text-ink">
                                {cusp.nakshatra}
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark rounded font-semibold text-xs">
                                    {cusp.nakshatraLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-copper-100 text-copper-700 rounded font-semibold text-xs">
                                    {cusp.subLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                {cusp.subSubLord && (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-semibold text-xs">
                                        {cusp.subSubLord}
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
