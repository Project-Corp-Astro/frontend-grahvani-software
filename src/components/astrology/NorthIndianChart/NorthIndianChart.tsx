import React from 'react';
import { cn } from '@/lib/utils';

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
        <svg viewBox="0 0 400 400" className={cn("w-full h-full drop-shadow-2xl overflow-visible", className)}>
            <defs>
                <linearGradient id="chartParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E9" />
                    <stop offset="100%" stopColor="#FEFAEA" />
                </linearGradient>
                <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                    <feOffset dy="1" dx="1" />
                    <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                    <feFlood floodColor="#D08C60" floodOpacity="0.1" />
                    <feComposite in2="shadowDiff" operator="in" />
                    <feComposite in2="SourceGraphic" operator="over" />
                </filter>
            </defs>

            {/* Background is handled by parent container */}
            <g stroke="#3E2A1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">

                {/* Cross Lines (X) */}
                <line x1="0" y1="0" x2="400" y2="400" />
                <line x1="400" y1="0" x2="0" y2="400" />

                {/* Diamond Lines */}
                <line x1="200" y1="0" x2="0" y2="200" stroke="#D08C60" strokeWidth="2" />
                <line x1="0" y1="200" x2="200" y2="400" stroke="#D08C60" strokeWidth="2" />
                <line x1="200" y1="400" x2="400" y2="200" stroke="#D08C60" strokeWidth="2" />
                <line x1="400" y1="200" x2="200" y2="0" stroke="#D08C60" strokeWidth="2" />
            </g>

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                const signId = ((ascSign + pos.h - 2) % 12) + 1;
                const boxPlanets = planets.filter(p => p.signId === signId);

                return (
                    <g key={pos.h}>
                        {/* Sign Number - Positioned in corners/edges */}
                        <text
                            x={pos.x}
                            y={pos.y + (pos.h === 1 || pos.h === 4 || pos.h === 7 || pos.h === 10 ? 32 : pos.h === 2 || pos.h === 12 ? 22 : -22)}
                            fontSize="22"
                            fontFamily="serif"
                            fontWeight="900"
                            fill="#D08C60"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none opacity-40 hover:opacity-100 transition-opacity cursor-default"
                        >
                            {signId}
                        </text>

                        {/* Planets List - Clustered in centers */}
                        {boxPlanets.map((p, i) => {
                            const yOffset = (i * 14) - ((boxPlanets.length - 1) * 7);
                            return (
                                <g key={p.name} transform={`translate(${pos.x}, ${pos.y + yOffset})`}>
                                    <text
                                        fontSize="13"
                                        fontFamily="serif"
                                        fontWeight="900"
                                        fill="#3E2A1F"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="select-none shadow-sm"
                                    >
                                        {p.name}
                                    </text>
                                    {p.isRetro && (
                                        <text x="12" y="4" fontSize="6" fontWeight="black" fill="#D08C60">R</text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
}
