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
const SIGN_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function AshtakavargaMatrix({ type, planet, data, className }: MatrixProps) {
    if (!data) return null;

    // Determine row identifiers
    // If it's Bhinna mode, show only the active planet rows (contributors)
    // If it's Sarva mode, show the traditional Lagna + 7 planets matrix
    const isSarva = type === 'sarva';

    // Handle data extract from various possible backend structures
    const matrixPayload = data.bhinnashtakavarga || data.ashtakvarga || data;
    const contributors = data.contributors; // Dedicated BAV payload structure
    const totalBindusArray = data.total_bindus || data.sarvashtakavarga?.total_bindus;

    let rowKeys = isSarva ? PLANET_ORDER : (contributors ? contributors.map((c: any) => c.contributor) : [planet || 'Lagna']);

    // Remove Lagna/Ascendant from the display rows
    rowKeys = rowKeys.filter((p: string) => p !== 'Lagna' && p !== 'Ascendant' && p !== 'lagna' && p !== 'ascendant');

    // Helper to get bindu value for a specific sign ID (1-12)
    const getVal = (rowData: any, signId: number) => {
        if (!rowData) return 0;
        if (Array.isArray(rowData)) return rowData[signId - 1] ?? 0;

        const signName = SIGN_NAMES[signId - 1];
        return rowData[signId] ?? rowData[signName] ?? rowData[signName.toLowerCase()] ?? 0;
    };

    return (
        <div className={cn("overflow-x-auto rounded-xl border border-antique bg-white shadow-inner", className)}>
            <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                    <tr className="bg-parchment/50 border-b border-antique">
                        <th className="p-3 text-[10px] font-black uppercase text-copper-900 border-r border-antique whitespace-nowrap sticky left-0 bg-parchment/90 backdrop-blur-sm z-20">
                            {isSarva ? 'Sign' : `${planet} BAV`}
                        </th>
                        {SIGNS.map(s => (
                            <th key={s} className="p-2 text-center text-xs font-bold text-copper-700 border-r border-antique/50 last:border-r-0 min-w-[35px]">
                                {s}
                            </th>
                        ))}
                        <th className="p-3 text-center text-[10px] font-black uppercase text-gold-dark sticky right-0 bg-parchment/90 backdrop-blur-sm z-20">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rowKeys.map((p: string, idx: number) => {
                        let rowData: any = {};
                        if (contributors) {
                            const contrib = contributors.find((c: any) => c.contributor === p || (p === 'Lagna' && (c.contributor === 'Ascendant' || c.contributor === 'lagna')));
                            if (contrib && Array.isArray(contrib.bindus)) {
                                contrib.bindus.forEach((val: number, sIdx: number) => { rowData[sIdx + 1] = val; });
                            }
                        } else {
                            const lookupKey = p === 'Lagna' ? 'Ascendant' : p;
                            rowData = matrixPayload[lookupKey] ||
                                matrixPayload[lookupKey.toLowerCase()] ||
                                matrixPayload[lookupKey.charAt(0).toUpperCase() + lookupKey.slice(1)] ||
                                {};
                        }

                        let rowTotal = 0;
                        SIGNS.forEach(s => { rowTotal += getVal(rowData, s); });

                        return (
                            <tr key={p} className={cn("border-b border-antique/30 last:border-b-0 group hover:bg-gold-primary/5 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-parchment/20")}>
                                <td className="p-2 px-3 text-xs font-bold text-copper-900 border-r border-antique whitespace-nowrap sticky left-0 bg-white group-hover:bg-gold-primary/5 transition-colors z-10">
                                    {p}
                                </td>
                                {SIGNS.map(s => {
                                    const val = getVal(rowData, s);
                                    return (
                                        <td key={s} className={cn(
                                            "p-2 text-center text-xs border-r border-antique/20 last:border-r-0",
                                            val === 0 ? "text-muted/40" : "font-medium text-copper-950"
                                        )}>
                                            {val}
                                        </td>
                                    );
                                })}
                                <td className="p-2 text-center text-xs font-black text-copper-950 bg-white group-hover:bg-gold-primary/10 transition-colors sticky right-0 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)] border-l border-antique/20">
                                    {rowTotal}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-copper-900 text-amber-50 font-bold border-t border-copper-800">
                        <td className="p-3 px-3 text-[10px] font-black uppercase border-r border-white/10 sticky left-0 bg-copper-900 z-20">Total SAV</td>
                        {SIGNS.map(s => {
                            let colTotal = 0;
                            const signsData = data.sarvashtakavarga?.signs || data.signs;
                            const signName = SIGN_NAMES[s - 1];
                            const directSav = signsData ? (signsData[s] ?? signsData[signName] ?? signsData[signName.toLowerCase()]) : null;

                            if (typeof directSav === 'number') {
                                colTotal = directSav;
                            } else if (Array.isArray(totalBindusArray) && totalBindusArray[s - 1] !== undefined) {
                                colTotal = totalBindusArray[s - 1];
                            } else {
                                // Calculate col total from current rows (Excluding Lagna as per traditional SAV standards)
                                rowKeys.forEach((p: string) => {
                                    if (p === 'Lagna' || p === 'Ascendant' || p === 'lagna') return;
                                    let rowData: any = {};
                                    if (contributors) {
                                        const contrib = contributors.find((c: any) => c.contributor === p || (p === 'Lagna' && (c.contributor === 'Ascendant' || c.contributor === 'lagna')));
                                        if (contrib && Array.isArray(contrib.bindus)) {
                                            contrib.bindus.forEach((val: number, sIdx: number) => { rowData[sIdx + 1] = val; });
                                        }
                                    } else {
                                        const lookupKey = p === 'Lagna' ? 'Ascendant' : p;
                                        rowData = matrixPayload[lookupKey] || matrixPayload[lookupKey.toLowerCase()] || {};
                                    }
                                    colTotal += getVal(rowData, s);
                                });
                            }

                            return (
                                <td key={s} className="p-2 text-center text-sm border-r border-white/10 last:border-r-0">
                                    {colTotal}
                                </td>
                            );
                        })}
                        <td className="p-2 text-center text-sm bg-gold-primary text-ink sticky right-0 z-20 shadow-[-4px_0_12px_rgba(0,0,0,0.1)] border-l border-white/20">
                            {SIGNS.reduce((acc, s) => {
                                if (totalBindusArray && totalBindusArray[s - 1] !== undefined) return acc + totalBindusArray[s - 1];
                                let colTotal = 0;
                                rowKeys.forEach((p: string) => {
                                    if (p === 'Lagna' || p === 'Ascendant' || p === 'lagna') return;
                                    let rowData: any = {};
                                    if (contributors) {
                                        const contrib = contributors.find((c: any) => c.contributor === p || (p === 'Lagna' && (c.contributor === 'Ascendant' || c.contributor === 'lagna')));
                                        if (contrib && Array.isArray(contrib.bindus)) {
                                            contrib.bindus.forEach((val: number, sIdx: number) => { rowData[sIdx + 1] = val; });
                                        }
                                    } else {
                                        const lookupKey = p === 'Lagna' ? 'Ascendant' : p;
                                        rowData = matrixPayload[lookupKey] || matrixPayload[lookupKey.toLowerCase()] || {};
                                    }
                                    colTotal += getVal(rowData, s);
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
