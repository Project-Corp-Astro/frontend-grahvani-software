"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MatrixProps {
    type: 'sarva' | 'bhinna';
    planet?: string;
    data: any;
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// House Groups for astrological analysis
const HOUSE_GROUPS = {
    dharma: { houses: [1, 5, 9], name: 'Dharma', desc: 'Purpose & Luck', color: 'bg-purple-100 text-purple-800' },
    artha: { houses: [2, 6, 10], name: 'Artha', desc: 'Wealth & Career', color: 'bg-amber-100 text-amber-800' },
    kama: { houses: [3, 7, 11], name: 'Kama', desc: 'Desires & Gains', color: 'bg-pink-100 text-pink-800' },
    moksha: { houses: [4, 8, 12], name: 'Moksha', desc: 'Liberation', color: 'bg-blue-100 text-blue-800' }
};

const getBinduColor = (val: number) => {
    if (val === 0) return 'text-gray-300';
    if (val === 1) return 'text-red-500';
    if (val === 2) return 'text-orange-500';
    if (val === 3) return 'text-amber-500';
    if (val === 4) return 'text-lime-500';
    if (val === 5) return 'text-green-500 font-semibold';
    if (val === 6) return 'text-green-600 font-bold';
    if (val === 7) return 'text-emerald-600 font-bold';
    return 'text-emerald-700 font-black';
};

const getSavStyle = (val: number) => {
    if (val < 22) return 'bg-red-400 text-red-950 font-bold';
    if (val < 26) return 'bg-amber-300 text-amber-950 font-bold';
    if (val < 30) return 'bg-amber-100 text-amber-900 font-semibold';
    return 'bg-green-400 text-green-950 font-bold';
};

export default function AshtakavargaMatrix({ type, planet, data, className }: MatrixProps) {
    if (!data) return null;

    const isSarva = type === 'sarva';
    const payload = data.bhinnashtakavarga || data.ashtakvarga || data;
    const contribs = data.contributors;

    let rows = isSarva ? PLANETS : (contribs ? contribs.map((c: any) => c.contributor) : [planet || 'Sun']);
    rows = rows.filter((p: string) => !['Lagna', 'Ascendant', 'lagna', 'ascendant'].includes(p));

    const getVal = (rd: any, s: number) => {
        if (!rd) return 0;
        if (Array.isArray(rd)) return rd[s - 1] ?? 0;
        return rd[s] ?? rd[SIGN_NAMES[s - 1]] ?? rd[SIGN_NAMES[s - 1]?.toLowerCase()] ?? 0;
    };

    // Calc SAV
    const sav: Record<number, number> = {};
    SIGNS.forEach(s => {
        let tot = 0;
        rows.forEach((p: string) => {
            let rd: any = {};
            if (contribs) {
                const c = contribs.find((x: any) => x.contributor === p);
                if (c?.bindus) c.bindus.forEach((v: number, i: number) => { rd[i + 1] = v; });
            } else {
                rd = payload[p] || payload[p.toLowerCase()] || {};
            }
            tot += getVal(rd, s);
        });
        sav[s] = tot;
    });

    const maxS = Math.max(...Object.values(sav));
    const minS = Math.min(...Object.values(sav));

    // Calculate House Group totals
    const groupTotals = Object.entries(HOUSE_GROUPS).map(([key, group]) => {
        const total = group.houses.reduce((sum, h) => sum + (sav[h] || 0), 0);
        const avg = Math.round(total / 3);
        return { key, ...group, total, avg };
    });

    return (
        <div className={cn("w-full", className)}>
            {/* Legend */}
            <div className="flex items-center justify-between mb-2 text-[10px]">
                <div className="flex items-center gap-1 text-[#8B5A2B] font-medium">
                    <span className="uppercase font-bold">Bindu:</span>
                    <span className="text-gray-400">0</span>
                    <span className="text-red-500">1-2</span>
                    <span className="text-amber-500">3-4</span>
                    <span className="text-green-600 font-bold">5-8</span>
                </div>
                <div className="flex items-center gap-1 text-[#8B5A2B] font-medium">
                    <span className="uppercase font-bold">SAV:</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-400 text-red-950 text-[8px]">&lt;22</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-300 text-amber-950 text-[8px]">22-25</span>
                    <span className="px-1.5 py-0.5 rounded bg-green-400 text-green-950 text-[8px]">30+</span>
                </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-[#D08C60]">
                        <th className="py-2 px-2 text-left text-[10px] font-black text-[#3E2A1F] uppercase w-14">
                            {isSarva ? 'Planet' : planet?.substring(0, 4)}
                        </th>
                        {SIGNS.map(s => (
                            <th key={s} className="py-2 px-0 text-center text-[10px] font-bold text-[#8B5A2B] w-7">{s}</th>
                        ))}
                        <th className="py-2 px-1 text-center text-[10px] font-black text-[#3E2A1F] bg-[#F5EDE3] w-9">Tot</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((p: string, idx: number) => {
                        let rd: any = {};
                        if (contribs) {
                            const c = contribs.find((x: any) => x.contributor === p);
                            if (c?.bindus) c.bindus.forEach((v: number, i: number) => { rd[i + 1] = v; });
                        } else {
                            rd = payload[p] || payload[p.toLowerCase()] || {};
                        }
                        let rowTot = 0;
                        SIGNS.forEach(s => { rowTot += getVal(rd, s); });

                        return (
                            <tr key={p} className={cn("border-b border-[#E8DDD0]", idx % 2 === 1 && "bg-[#FAF8F5]")}>
                                <td className="py-1 px-2 text-[11px] font-semibold text-[#3E2A1F]">{p.substring(0, 3)}</td>
                                {SIGNS.map(s => (
                                    <td key={s} className={cn("py-1 text-center text-[11px]", getBinduColor(getVal(rd, s)))}>{getVal(rd, s)}</td>
                                ))}
                                <td className="py-1 text-center text-[11px] font-bold text-[#3E2A1F] bg-[#F5EDE3]">{rowTot}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-[#3E2A1F]">
                        <td className="py-2 px-2 text-[10px] font-black text-amber-100 uppercase">SAV</td>
                        {SIGNS.map(s => {
                            const v = sav[s];
                            return (
                                <td key={s} className="py-1.5 px-0.5 text-center">
                                    <span className={cn(
                                        "inline-block w-6 py-0.5 rounded text-[11px]",
                                        getSavStyle(v),
                                        v === maxS && "ring-2 ring-green-300",
                                        v === minS && "ring-2 ring-red-300"
                                    )}>{v}</span>
                                </td>
                            );
                        })}
                        <td className="py-2 text-center text-[11px] font-black text-amber-100 bg-[#D08C60]">
                            {Object.values(sav).reduce((a, b) => a + b, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* 🌟 NEW: House Group Analysis Cards */}
            <div className="mt-3 grid grid-cols-4 gap-2">
                {groupTotals.map(g => (
                    <div key={g.key} className={cn("rounded-lg p-2 text-center", g.color)}>
                        <div className="text-[9px] font-bold uppercase tracking-wide">{g.name}</div>
                        <div className="text-[8px] opacity-75">{g.houses.join('-')}</div>
                        <div className="text-lg font-black">{g.total}</div>
                        <div className="text-[8px]">{g.desc}</div>
                    </div>
                ))}
            </div>

            {/* Quick Summary */}
            <div className="flex justify-between mt-2 text-[10px] font-semibold">
                <span className="text-[#8B5A2B]">
                    Strongest: <span className="text-purple-700">{groupTotals.sort((a, b) => b.total - a.total)[0].name}</span>
                </span>
                <div className="flex gap-4">
                    <span className="text-green-700">↑ Best: Sign {SIGNS.find(s => sav[s] === maxS)} ({maxS})</span>
                    <span className="text-red-600">↓ Weak: Sign {SIGNS.find(s => sav[s] === minS)} ({minS})</span>
                </div>
            </div>
        </div>
    );
}
