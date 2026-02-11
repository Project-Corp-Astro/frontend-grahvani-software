"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AshtakavargaChartProps {
    type: 'sarva' | 'bhinna';
    ascendantSign: number;
    houseValues: Record<number, number>;
    className?: string;
}

// Minimal indicator dot for values (adaptive to type)
const getValueBadge = (val: number, type: 'sarva' | 'bhinna', isMax: boolean, isMin: boolean) => {
    if (isMax) return <span className="w-1.5 h-1.5 rounded-full bg-green-600" />;
    if (isMin) return <span className="w-1.5 h-1.5 rounded-full bg-red-500" />;

    // Sarva thresholds (0-48 range)
    if (type === 'sarva') {
        if (val >= 30) return <span className="w-1 h-1 rounded-full bg-green-600" />;
        if (val < 22) return <span className="w-1 h-1 rounded-full bg-red-500" />;
    }
    // Bhinna thresholds (0-8 range)
    else {
        if (val >= 5) return <span className="w-1 h-1 rounded-full bg-green-600" />;
        if (val < 4) return <span className="w-1 h-1 rounded-full bg-red-500" />;
    }

    return null;
};

export default function AshtakavargaChart({ type = 'sarva', ascendantSign, houseValues, className = "" }: AshtakavargaChartProps) {
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
                    const v = houseValues[p.h] || 0;
                    const isMax = p.h === maxH;
                    const isMin = p.h === minH;

                    return (
                        <g key={p.h}>
                            {/* ASC label */}
                            {p.h === 1 && (
                                <text x={p.x} y={p.y - 20} fontSize="9" fontWeight="600" fill="var(--text-accent-gold)" textAnchor="middle">ASC</text>
                            )}

                            {/* Value */}
                            <text x={p.x} y={p.y + 2} fontSize="18" fontFamily="var(--font-family-sans)" fontWeight="600" fill="var(--text-primary)" textAnchor="middle" dominantBaseline="middle">
                                {v}
                            </text>

                            {/* Indicator badge */}
                            {(isMax || isMin || (type === 'sarva' ? (v >= 30 || v < 22) : (v >= 5 || v < 4))) && (
                                <circle
                                    cx={p.x + 12}
                                    cy={p.y - 8}
                                    r="2"
                                    fill={isMax || (type === 'sarva' ? v >= 30 : v >= 5) ? '#16a34a' : '#ef4444'}
                                />
                            )}

                            {/* Sign Number */}
                            <text x={p.x} y={p.y + 25} fontSize="18" fontWeight="600" fontFamily="var(--font-family-sans)" fill="var(--text-primary)" textAnchor="middle">
                                {signIdx + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex flex-col gap-1 text-xs text-center font-sans">
                <div className="flex items-center justify-center gap-3 text-secondary">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span>{type === 'sarva' ? '30+ Strong' : '5+ Strong'}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>{type === 'sarva' ? '22-29' : '4 Avg'}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>{type === 'sarva' ? '<22 Weak' : '<4 Weak'}</span>
                </div>
                <div className="flex items-center justify-center gap-4 font-medium">
                    <span className="text-secondary inline-flex items-center gap-1">
                        ↑ Best: H{maxH} <span className="font-semibold text-primary">({maxV})</span>
                    </span>
                    <span className="text-secondary inline-flex items-center gap-1">
                        ↓ Weak: H{minH} <span className="font-semibold text-primary">({minV})</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
