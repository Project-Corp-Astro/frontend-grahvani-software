"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AshtakavargaChartProps {
    ascendantSign: number; // 1-12
    houseValues: Record<number, number>; // Map of HouseNumber (1-12) to Value (Bindus)
    className?: string;
}

export default function AshtakavargaChart({
    ascendantSign,
    houseValues,
    className = ""
}: AshtakavargaChartProps) {

    // Standard North Indian Chart coordinates (400x400 grid)
    const centers = [
        { h: 1, x: 200, y: 80 }, // Top Diamond
        { h: 2, x: 120, y: 40 }, // Top Left Triangle
        { h: 3, x: 60, y: 120 }, // Left Top Triangle
        { h: 4, x: 120, y: 200 }, // Left Diamond
        { h: 5, x: 60, y: 280 }, // Left Bottom Triangle
        { h: 6, x: 120, y: 360 }, // Bottom Left Triangle
        { h: 7, x: 200, y: 320 }, // Bottom Diamond
        { h: 8, x: 280, y: 360 }, // Bottom Right Triangle
        { h: 9, x: 340, y: 280 }, // Right Bottom Triangle
        { h: 10, x: 280, y: 200 }, // Right Diamond
        { h: 11, x: 340, y: 120 }, // Right Top Triangle
        { h: 12, x: 280, y: 40 }  // Top Right Triangle
    ];

    return (
        <svg viewBox="0 0 400 400" className={cn("w-full h-full", className)}>
            {/* Background Lines */}
            <g stroke="#3D2618" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* Outer Double Frame */}
                <rect x="0" y="0" width="400" height="400" strokeWidth="2" />
                <rect x="5" y="5" width="390" height="390" strokeWidth="0.5" strokeOpacity="0.5" />

                {/* Diagonals */}
                <line x1="0" y1="0" x2="400" y2="400" />
                <line x1="400" y1="0" x2="0" y2="400" />

                {/* Inscribed Diamond */}
                <line x1="200" y1="0" x2="0" y2="200" />
                <line x1="0" y1="200" x2="200" y2="400" />
                <line x1="200" y1="400" x2="400" y2="200" />
                <line x1="400" y1="200" x2="200" y2="0" />
            </g>

            {/* House Numbers and Values */}
            {centers.map((pos) => {
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;
                const bindus = houseValues[pos.h] || 0;

                // Traditional sign number offset logic
                let signOffset = { x: 0, y: 35 };
                if (pos.h === 1) signOffset = { x: 0, y: 55 };
                else if (pos.h === 7) signOffset = { x: 0, y: -55 };
                else if (pos.h === 4) signOffset = { x: 55, y: 0 };
                else if (pos.h === 10) signOffset = { x: -55, y: 0 };
                // Corners
                else if (pos.h === 2) signOffset = { x: -25, y: -15 };
                else if (pos.h === 3) signOffset = { x: -25, y: -15 };
                else if (pos.h === 5) signOffset = { x: -25, y: 15 };
                else if (pos.h === 6) signOffset = { x: -25, y: 15 };
                else if (pos.h === 8) signOffset = { x: 25, y: 15 };
                else if (pos.h === 9) signOffset = { x: 25, y: 15 };
                else if (pos.h === 11) signOffset = { x: 25, y: -15 };
                else if (pos.h === 12) signOffset = { x: 25, y: -15 };

                return (
                    <g key={pos.h}>
                        {/* Bindu Value (Large) */}
                        <text
                            x={pos.x}
                            y={pos.y}
                            fontSize="42"
                            fontFamily="serif"
                            fontWeight="900"
                            fill={bindus < 20 ? "#E11D48" : "#3D2618"}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none"
                        >
                            {bindus}
                        </text>

                        {/* Sign Number (Small) */}
                        <text
                            x={pos.x + signOffset.x}
                            y={pos.y + signOffset.y}
                            fontSize="14"
                            fontFamily="serif"
                            fontWeight="bold"
                            fill="#3D2618"
                            fillOpacity="0.7"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none"
                        >
                            {signId}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
