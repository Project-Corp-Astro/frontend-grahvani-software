import React from 'react';

export interface Planet {
    name: string;
    signId: number;
    degree: string;
    isRetro?: boolean;
}

interface NorthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string; // Add className prop for flexibility
}

export default function NorthIndianChart({ planets, ascendantSign, className = "" }: NorthIndianChartProps) {
    // North Indian Style (Diamond Chart)
    // Signs are MUTABLE (Houses are fixed).
    // House 1 is always Top Diamond.
    // Count proceeds anti-clockwise usually.

    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1; // 1 to 12
        // Calculate sign in house based on Ascendant
        const signNum = ((ascendantSign + i - 1) % 12) || 12;
        return { house: houseNum, sign: signNum };
    });

    const houseCenters = [
        { h: 1, x: 200, y: 100 }, // Top Diamond
        { h: 2, x: 100, y: 50 },  // Top Left Triangle
        { h: 3, x: 50, y: 100 },  // Left Triangle
        { h: 4, x: 100, y: 200 }, // Center Left Diamond
        { h: 5, x: 50, y: 300 },  // Bottom Left Triangle
        { h: 6, x: 100, y: 350 }, // Bottom Left Triangle (Lower)
        { h: 7, x: 200, y: 300 }, // Bottom Diamond
        { h: 8, x: 300, y: 350 }, // Bottom Right Triangle (Lower)
        { h: 9, x: 350, y: 300 }, // Bottom Right Triangle
        { h: 10, x: 300, y: 200 },// Center Right Diamond
        { h: 11, x: 350, y: 100 },// Right Triangle
        { h: 12, x: 300, y: 50 }, // Top Right Triangle
    ];

    const ascSign = ascendantSign;



    return (
        <svg viewBox="0 0 400 400" className="w-full h-full border-2 border-[#3E2A1F] bg-[#FEFAEA]">

            {/* Outline Box */}
            <rect x="0" y="0" width="400" height="400" fill="none" stroke="#3E2A1F" strokeWidth="2" />

            {/* Cross Lines (X) */}
            <line x1="0" y1="0" x2="400" y2="400" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="400" y1="0" x2="0" y2="400" stroke="#3E2A1F" strokeWidth="2" />

            {/* Diamond Lines (Connect Midpoints) */}
            <line x1="200" y1="0" x2="0" y2="200" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="0" y1="200" x2="200" y2="400" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="200" y1="400" x2="400" y2="200" stroke="#3E2A1F" strokeWidth="2" />
            <line x1="400" y1="200" x2="200" y2="0" stroke="#3E2A1F" strokeWidth="2" />

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                // Find sign for this house
                // houseData is fixed length 12
                const signId = ((ascSign + pos.h - 2) % 12) + 1; // Correct 1-based sign calc

                const boxPlanets = planets.filter(p => p.signId === signId);

                return (
                    <g key={pos.h}>
                        {/* House Number (small, faint) - Optional, maybe show Sign Number instead */}
                        {/* In North Chart, Sign Number is usually shown in corners of house */}

                        <text
                            x={pos.x}
                            y={pos.y + (pos.h === 1 || pos.h === 4 || pos.h === 7 || pos.h === 10 ? 35 : pos.h === 2 || pos.h === 12 ? 20 : -20)}
                            // Adjust Y based on shape of house to put sign number near a corner or center
                            // Just putting sign number in center with faint color for now
                            fontSize="24"
                            fontFamily="serif"
                            fontWeight="bold"
                            fill="#9C7A2F"
                            textAnchor="middle"
                            dominantBaseline="central"
                            opacity="0.9"
                        >
                            {signId}
                        </text>

                        {/* Planets List */}
                        {boxPlanets.map((p, i) => {
                            // layout offset
                            const yOffset = (i * 14) - ((boxPlanets.length - 1) * 7);
                            return (
                                <text
                                    key={p.name}
                                    x={pos.x}
                                    y={pos.y + yOffset}
                                    fontSize="12"
                                    fontFamily="serif"
                                    fontWeight="bold"
                                    fill="#3E2A1F"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {p.name}
                                </text>
                            );
                        })}
                    </g>
                );
            })}

        </svg>
    );
}
