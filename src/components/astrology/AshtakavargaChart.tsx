"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AshtakavargaChartProps {
    ascendantSign: number;
    houseValues: Record<number, number>;
    className?: string;
}

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const getColor = (val: number, isMax: boolean, isMin: boolean) => {
    if (isMax) return '#166534'; // Dark green
    if (isMin) return '#DC2626'; // Red
    if (val < 22) return '#DC2626';
    if (val < 26) return '#D97706';
    if (val >= 30) return '#166534';
    return '#3E2A1F';
};

export default function AshtakavargaChart({ ascendantSign, houseValues, className = "" }: AshtakavargaChartProps) {
    // Find max/min
    let maxH = 1, minH = 1, maxV = 0, minV = 999;
    Object.entries(houseValues).forEach(([h, v]) => {
        if (v > maxV) { maxV = v; maxH = parseInt(h); }
        if (v < minV) { minV = v; minH = parseInt(h); }
    });

    // House positions for 280x280 viewBox
    const pos = [
        { h: 1, x: 140, y: 50 },
        { h: 2, x: 70, y: 35 },
        { h: 3, x: 35, y: 70 },
        { h: 4, x: 70, y: 140 },
        { h: 5, x: 35, y: 210 },
        { h: 6, x: 70, y: 245 },
        { h: 7, x: 140, y: 230 },
        { h: 8, x: 210, y: 245 },
        { h: 9, x: 245, y: 210 },
        { h: 10, x: 210, y: 140 },
        { h: 11, x: 245, y: 70 },
        { h: 12, x: 210, y: 35 }
    ];

    return (
        <div className={cn("flex flex-col items-center", className)}>
            <svg viewBox="0 0 280 280" className="w-full max-w-[260px]">
                {/* Background */}
                <rect x="0" y="0" width="280" height="280" fill="#FFFDF9" />

                {/* Chart lines */}
                <g stroke="#3E2A1F" strokeWidth="1.5" fill="none">
                    <rect x="1" y="1" width="278" height="278" strokeWidth="2" />
                    <line x1="0" y1="0" x2="280" y2="280" />
                    <line x1="280" y1="0" x2="0" y2="280" />
                    <line x1="140" y1="0" x2="0" y2="140" />
                    <line x1="0" y1="140" x2="140" y2="280" />
                    <line x1="140" y1="280" x2="280" y2="140" />
                    <line x1="280" y1="140" x2="140" y2="0" />
                </g>

                {/* Values */}
                {pos.map(p => {
                    const signIdx = ((ascendantSign + p.h - 2) % 12);
                    const signAbbr = SIGNS[signIdx].substring(0, 2);
                    const v = houseValues[p.h] || 0;
                    const isMax = p.h === maxH;
                    const isMin = p.h === minH;
                    const col = getColor(v, isMax, isMin);

                    return (
                        <g key={p.h}>
                            {/* Highlight circle for max/min */}
                            {(isMax || isMin) && (
                                <circle cx={p.x} cy={p.y} r="18" fill={isMax ? '#BBF7D0' : '#FECACA'} opacity="0.6" />
                            )}

                            {/* ASC label */}
                            {p.h === 1 && (
                                <text x={p.x} y={p.y - 22} fontSize="8" fontWeight="bold" fill="#D08C60" textAnchor="middle">ASC</text>
                            )}

                            {/* Value */}
                            <text x={p.x} y={p.y + 2} fontSize="22" fontFamily="Georgia, serif" fontWeight="700" fill={col} textAnchor="middle" dominantBaseline="middle">
                                {v}
                            </text>

                            {/* Sign */}
                            <text x={p.x} y={p.y + 16} fontSize="8" fill="#8B5A2B" textAnchor="middle">
                                {signAbbr}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex flex-col gap-1 text-[9px] text-center">
                <div className="flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span>30+ Strong</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>22-29</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>&lt;22 Weak</span>
                </div>
                <div className="flex items-center justify-center gap-4 font-semibold">
                    <span className="text-green-700">↑ Best: H{maxH} ({maxV})</span>
                    <span className="text-red-600">↓ Weak: H{minH} ({minV})</span>
                </div>
            </div>
        </div>
    );
}
