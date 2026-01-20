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

    // Handle nested structure from backend
    const matrixPayload = data.bhinnashtakavarga || data;
    const savPayload = data.sarvashtakavarga || data;
    const contributors = data.contributors; // Dedicated BAV payload structure
    const totalBindusArray = data.total_bindus; // Dedicated BAV payload structure

    const signMap: Record<string, number> = {
        'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
        'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
    };

    // Determine row identifiers (Planets/Contributors)
    let rowKeys = contributors
        ? contributors.map((c: any) => c.contributor)
        : PLANET_ORDER;

    // Filter out Lagna for Sarvashtakavarga specifically as per user request
    if (type === 'sarva') {
        rowKeys = rowKeys.filter((k: string) => k !== 'Lagna' && k !== 'Ascendant' && k !== 'lagna' && k !== 'ascendant');
    }

    // Helper to get sign value from array (0-indexed) or object (1-indexed or name-indexed)
    const getValBySign = (rowData: any, s: number) => {
        if (!rowData) return null;
        if (Array.isArray(rowData)) return rowData[s - 1];

        const signName = Object.keys(signMap).find(k => signMap[k] === s);
        return rowData[s] ?? (signName ? rowData[signName] : null);
    };

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
                    {rowKeys.map((p: string, idx: number) => {
                        let rowData: any = {};

                        if (contributors) {
                            const contrib = contributors.find((c: any) => c.contributor === p);
                            if (contrib && Array.isArray(contrib.bindus)) {
                                contrib.bindus.forEach((val: number, sIdx: number) => {
                                    rowData[sIdx + 1] = val;
                                });
                            }
                        } else {
                            const lookupKey = p === 'Lagna' ? 'Ascendant' : p;
                            rowData = matrixPayload[lookupKey] ||
                                matrixPayload[lookupKey.toLowerCase()] ||
                                matrixPayload[lookupKey.charAt(0).toUpperCase() + lookupKey.slice(1)] ||
                                {};
                        }

                        let rowTotal = 0;

                        return (
                            <tr key={p} className={cn("border-b border-antique/30 last:border-b-0 group hover:bg-gold-primary/5 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-parchment/20")}>
                                <td className="p-2 text-xs font-bold text-copper-900 border-r border-antique whitespace-nowrap bg-parchment/30">
                                    {p === 'Ascendant' ? 'Lagna' : p}
                                </td>
                                {SIGNS.map(s => {
                                    const val = getValBySign(rowData, s) ?? '-';

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
                                    {rowTotal > 0 ? rowTotal : (rowData[1] !== undefined ? 0 : '-')}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-copper-900 text-amber-50 font-bold">
                        <td className="p-3 text-xs uppercase border-r border-white/10">Total SAV</td>
                        {SIGNS.map(s => {
                            // Check for direct SAV totals from backend first
                            if (Array.isArray(totalBindusArray)) {
                                return (
                                    <td key={s} className="p-2 text-center text-sm border-r border-white/10 last:border-r-0">
                                        {totalBindusArray[s - 1]}
                                    </td>
                                );
                            }

                            const signName = Object.keys(signMap).find(k => signMap[k] === s);
                            const signsData = savPayload.signs || savPayload;
                            const directSav = signsData ? (signsData[s] ?? (signName ? signsData[signName] : null)) : null;

                            if (typeof directSav === 'number') {
                                return (
                                    <td key={s} className="p-2 text-center text-sm border-r border-white/10 last:border-r-0">
                                        {directSav}
                                    </td>
                                );
                            }

                            // Fallback to calculation
                            let colTotal = 0;
                            rowKeys.forEach((p: string) => {
                                let rowData: any = {};
                                if (contributors) {
                                    const contrib = contributors.find((c: any) => c.contributor === p);
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
                                const val = getValBySign(rowData, s);
                                if (typeof val === 'number') colTotal += val;
                            });
                            return (
                                <td key={s} className="p-2 text-center text-sm border-r border-white/10 last:border-r-0">
                                    {colTotal}
                                </td>
                            );
                        })}
                        <td className="p-2 text-center text-sm bg-amber-400 text-copper-950">
                            {Array.isArray(totalBindusArray)
                                ? totalBindusArray.reduce((a: number, b: number) => a + b, 0)
                                : (savPayload.total_bindus || SIGNS.reduce((acc, s) => {
                                    const signName = Object.keys(signMap).find(k => signMap[k] === s);
                                    const signsData = savPayload.signs || savPayload;
                                    const directSav = signsData ? (signsData[s] ?? (signName ? signsData[signName] : null)) : null;

                                    if (typeof directSav === 'number') return acc + directSav;

                                    let colTotal = 0;
                                    rowKeys.forEach((p: string) => {
                                        let rowData: any = {};
                                        if (contributors) {
                                            const contrib = contributors.find((c: any) => c.contributor === p);
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
                                        const val = getValBySign(rowData, s);
                                        if (typeof val === 'number') colTotal += val;
                                    });
                                    return acc + colTotal;
                                }, 0))}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
