"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MatrixProps {
    type: 'sarva' | 'bhinna';
    planet?: string;
    data: any; // The matrix data
    className?: string;
}

const PLANET_ORDER = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function AshtakavargaMatrix({ type, planet, data, className }: MatrixProps) {
    if (!data) return null;

    // In a real app, we'd have the bits here. 
    // For now, if it's SAV, we show the totals per planet per house.
    // If it's BAV, we show the contributor bits if available.

    return (
        <div className={cn("overflow-x-auto rounded-xl border border-antique bg-white shadow-inner", className)}>
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-parchment/50 border-b border-antique">
                        <th className="p-3 text-[10px] font-black uppercase text-copper-900 border-r border-antique whitespace-nowrap">
                            {type === 'sarva' ? 'Sign' : `${planet} BAV`}
                        </th>
                        {SIGNS.map(s => (
                            <th key={s} className="p-2 text-center text-xs font-bold text-copper-700 border-r border-antique/50 last:border-r-0">
                                {s}
                            </th>
                        ))}
                        <th className="p-2 text-center text-[10px] font-black uppercase text-gold-dark">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {PLANET_ORDER.map((p, idx) => {
                        const rowData = data[p.toLowerCase()] || data[p] || {};
                        let rowTotal = 0;

                        return (
                            <tr key={p} className={cn("border-b border-antique/30 last:border-b-0 group hover:bg-gold-primary/5 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-parchment/20")}>
                                <td className="p-2 text-xs font-bold text-copper-900 border-r border-antique whitespace-nowrap bg-parchment/30">
                                    {p}
                                </td>
                                {SIGNS.map(s => {
                                    const val = rowData[s] ?? '-';
                                    if (typeof val === 'number') rowTotal += val;
                                    return (
                                        <td key={s} className={cn(
                                            "p-2 text-center text-xs border-r border-antique/20 last:border-r-0",
                                            val === 0 ? "text-muted/40" : "font-medium text-copper-950"
                                        )}>
                                            {val}
                                        </td>
                                    );
                                })}
                                <td className="p-2 text-center text-xs font-black text-copper-950 bg-gold-primary/5">
                                    {rowTotal > 0 ? rowTotal : '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-copper-900 text-amber-50 font-bold">
                        <td className="p-3 text-xs uppercase border-r border-white/10">Total SAV</td>
                        {SIGNS.map(s => {
                            let colTotal = 0;
                            PLANET_ORDER.forEach(p => {
                                const val = (data[p.toLowerCase()] || data[p] || {})[s];
                                if (typeof val === 'number') colTotal += val;
                            });
                            return (
                                <td key={s} className="p-2 text-center text-sm border-r border-white/10 last:border-r-0">
                                    {colTotal}
                                </td>
                            );
                        })}
                        <td className="p-2 text-center text-sm bg-amber-400 text-copper-950">
                            {SIGNS.reduce((acc, s) => {
                                let colTotal = 0;
                                PLANET_ORDER.forEach(p => {
                                    const val = (data[p.toLowerCase()] || data[p] || {})[s];
                                    if (typeof val === 'number') colTotal += val;
                                });
                                return acc + colTotal;
                            }, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
