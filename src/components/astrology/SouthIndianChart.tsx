"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Planet } from './NorthIndianChart/NorthIndianChart';

interface SouthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
}

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Re-map index for South Indian Chart (Fixed Signs)
// 0: Pisces, 1: Aries, 2: Taurus, 3: Gemini
// 4: Aquarius,                5: Cancer
// 6: Capricorn,               7: Leo
// 8: Sagittarius, 9: Scorpio, 10: Libra, 11: Virgo
// This is actually index based for the 4x4 grid.
// Signs in South Indian are FIXED. Aries is always Top-Left-Next-One.
// [Pisces] [Aries] [Taurus] [Gemini]
// [Aquarius]                [Cancer]
// [Capicorn]                [Leo]
// [Saggit]  [Scorpio] [Libra] [Virgo]

const GRID_MAP = [
    { signId: 12, x: 0, y: 0 }, { signId: 1, x: 1, y: 0 }, { signId: 2, x: 2, y: 0 }, { signId: 3, x: 3, y: 0 },
    { signId: 11, x: 0, y: 1 }, { signId: 4, x: 3, y: 1 },
    { signId: 10, x: 0, y: 2 }, { signId: 5, x: 3, y: 2 },
    { signId: 9, x: 0, y: 3 }, { signId: 8, x: 1, y: 3 }, { signId: 7, x: 2, y: 3 }, { signId: 6, x: 3, y: 3 }
];

export default function SouthIndianChart({ planets, ascendantSign, className }: SouthIndianChartProps) {
    return (
        <svg viewBox="0 0 400 400" className={cn("w-full h-full drop-shadow-2xl overflow-visible", className)}>
            <defs>
                <linearGradient id="southChartParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E9" />
                    <stop offset="100%" stopColor="#FEFAEA" />
                </linearGradient>
            </defs>

            {/* Background handled by parent container */}

            {/* Grid Lines - Metallic Accents */}
            <g stroke="#3E2A1F" strokeWidth="1.5" opacity="0.6">
                <rect x="0" y="0" width="400" height="400" fill="none" strokeWidth="3" stroke="#5D3A24" />

                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />

                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="200" x2="400" y2="200" />
                <line x1="0" y1="300" x2="400" y2="300" />
            </g>

            {/* Inner Border for Center Box */}
            <rect x="100" y="100" width="200" height="200" fill="#2A1810" opacity="0.05" />

            {/* Render Signs & Planets */}
            {GRID_MAP.map((grid) => {
                const isAsc = grid.signId === ascendantSign;
                const boxPlanets = planets.filter(p => p.signId === grid.signId);
                const startX = grid.x * 100;
                const startY = grid.y * 100;

                return (
                    <g key={grid.signId}>
                        {/* Ascendant Marker (Cross) */}
                        {isAsc && (
                            <g className="opacity-40">
                                <line x1={startX + 5} y1={startY + 5} x2={startX + 95} y2={startY + 95} stroke="#D08C60" strokeWidth="1" />
                                <text x={startX + 10} y={startY + 20} fontSize="10" fontWeight="black" fill="#D08C60" className="uppercase">Asc</text>
                            </g>
                        )}

                        {/* Sign Label (Usually faint in professional charts) */}
                        <text
                            x={startX + 5}
                            y={startY + 95}
                            fontSize="8"
                            fill="#9C7A2F"
                            opacity="0.5"
                            fontFamily="serif"
                        >
                            {SIGNS[grid.signId - 1]}
                        </text>

                        {/* Planets */}
                        {boxPlanets.map((p, i) => (
                            <text
                                key={p.name}
                                x={startX + 50}
                                y={startY + 35 + (i * 15)}
                                textAnchor="middle"
                                fontSize="13"
                                fontWeight="900"
                                fill="#3E2A1F"
                                fontFamily="serif"
                                className="select-none"
                            >
                                {p.name}{p.isRetro ? ' (R)' : ''}
                            </text>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}
