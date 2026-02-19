"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AshtakavargaChartProps {
    type: 'sarva' | 'bhinna';
    ascendantSign: number;
    houseValues: Record<number, number>;
    className?: string;
}


export default function AshtakavargaChart({ type = 'sarva', ascendantSign, houseValues, className = "" }: AshtakavargaChartProps) {
    // Find max/min
    let maxH = 1, minH = 1, maxV = 0, minV = 999;
    Object.entries(houseValues).forEach(([h, v]) => {
        if (v > maxV) { maxV = v; maxH = parseInt(h); }
        if (v < minV) { minV = v; minH = parseInt(h); }
    });

    // Color logic from North Indian Chart
    const getValueColor = (val: number) => {
        if (type === 'sarva') {
            if (val >= 30) return "#10B981"; // Emerald
            if (val < 22) return "#E11D48";  // Rose
        } else {
            if (val >= 5) return "#10B981";
            if (val < 4) return "#E11D48";
        }
        return "#2D2419"; // Bronze/Ink
    };

    // House positions for house values (centered in segments)
    const valuePos = [
        { h: 1, x: 140, y: 50 },
        { h: 2, x: 74, y: 24 },
        { h: 3, x: 24, y: 54 },
        { h: 4, x: 70, y: 140 },
        { h: 5, x: 24, y: 226 },
        { h: 6, x: 74, y: 266 },
        { h: 7, x: 140, y: 230 },
        { h: 8, x: 206, y: 266 },
        { h: 9, x: 256, y: 226 },
        { h: 10, x: 250, y: 140 },
        { h: 11, x: 260, y: 54 },
        { h: 12, x: 206, y: 24 }
    ];

    // House positions for sign numbers (offset to corners for clarity)
    const signPos = [
        { h: 1, x: 140, y: 120 },
        { h: 2, x: 74, y: 54 },
        { h: 3, x: 44, y: 74 },
        { h: 4, x: 120, y: 140 },
        { h: 5, x: 24, y: 186 },
        { h: 6, x: 74, y: 236 },
        { h: 7, x: 140, y: 170 },
        { h: 8, x: 206, y: 236 },
        { h: 9, x: 236, y: 206 },
        { h: 10, x: 170, y: 140 },
        { h: 11, x: 236, y: 74 },
        { h: 12, x: 206, y: 44 }
    ];

    return (
        <div className={cn("flex flex-col items-center", className)}>
            <svg viewBox="0 0 280 280" className="w-full max-w-[260px] drop-shadow-sm">
                {/* Background */}
                <rect x="0" y="0" width="280" height="280" fill="#FFF9E9" />

                {/* Chart lines */}
                <g stroke="#D08C60" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="1" width="278" height="278" strokeWidth="2" />
                    <line x1="0" y1="0" x2="280" y2="280" />
                    <line x1="280" y1="0" x2="0" y2="280" />
                    <line x1="140" y1="0" x2="0" y2="140" />
                    <line x1="0" y1="140" x2="140" y2="280" />
                    <line x1="140" y1="280" x2="280" y2="140" />
                    <line x1="280" y1="140" x2="140" y2="0" />
                </g>

                {/* Values and Sign Numbers */}
                {[...Array(12)].map((_, i) => {
                    const houseNum = i + 1;
                    const vP = valuePos.find(p => p.h === houseNum)!;
                    const sP = signPos.find(p => p.h === houseNum)!;

                    const signIdx = ((ascendantSign + houseNum - 2) % 12);
                    const v = houseValues[houseNum] || 0;
                    const isMax = houseNum === maxH;
                    const isMin = houseNum === minH;
                    const vColor = getValueColor(v);

                    return (
                        <g key={houseNum}>
                            {/* ASC label */}
                            {houseNum === 1 && (
                                <text x={vP.x} y={vP.y - 18} fontSize="10" fontWeight="600" fontFamily="'Spectral', serif" fill="var(--text-accent-gold)" textAnchor="middle">Asc</text>
                            )}

                            {/* Value */}
                            <text
                                x={vP.x}
                                y={vP.y}
                                fontSize="22"
                                fontFamily="'Spectral', serif"
                                fontWeight="500"
                                fill={vColor}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {v}
                            </text>

                            {/* Indicator dot - subtle and synced with color */}
                            {(isMax || isMin) && (
                                <circle
                                    cx={vP.x + 15}
                                    cy={vP.y - 10}
                                    r="2.2"
                                    fill={isMax ? '#10B981' : '#E11D48'}
                                />
                            )}

                            {/* Sign Number */}
                            <text
                                x={sP.x}
                                y={sP.y}
                                fontSize="14"
                                fontWeight="500"
                                fontFamily="'Spectral', serif"
                                fill="var(--text-primary)"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {signIdx + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="mt-3 flex flex-col gap-1.5 text-[10px] text-center font-serif">
                <div className="flex items-center justify-center gap-4 text-secondary/80 font-medium tracking-normal">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>{type === 'sarva' ? '30+ Strong' : '5+ Strong'}</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>{type === 'sarva' ? '22-29' : '4 Avg'}</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>{type === 'sarva' ? '<22 Weak' : '<4 Weak'}</span>
                </div>
                <div className="flex items-center justify-center gap-5 font-medium text-primary/70">
                    <span className="inline-flex items-center gap-1">
                        Best House: <span className="text-[#10B981]">H{maxH} ({maxV})</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                        Weak House: <span className="text-[#E11D48]">H{minH} ({minV})</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
