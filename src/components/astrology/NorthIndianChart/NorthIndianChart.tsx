import React, { useState } from 'react';
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
    className?: string;
    onHouseClick?: (houseNumber: number) => void; // New prop for interactivity
}

export default function NorthIndianChart({ planets, ascendantSign, className = "", onHouseClick }: NorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

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
        { h: 1, x: 200, y: 105 }, // Top Diamond
        { h: 2, x: 100, y: 55 },  // Top Left Triangle
        { h: 3, x: 55, y: 105 },  // Left Triangle
        { h: 4, x: 105, y: 200 }, // Center Left Diamond
        { h: 5, x: 55, y: 295 },  // Bottom Left Triangle
        { h: 6, x: 100, y: 345 }, // Bottom Left Triangle (Lower)
        { h: 7, x: 200, y: 295 }, // Bottom Diamond
        { h: 8, x: 300, y: 345 }, // Bottom Right Triangle (Lower)
        { h: 9, x: 345, y: 295 }, // Bottom Right Triangle
        { h: 10, x: 295, y: 200 },// Center Right Diamond
        { h: 11, x: 345, y: 105 },// Right Triangle
        { h: 12, x: 300, y: 55 }, // Top Right Triangle
    ];

    // Define clickable polygon regions for each house
    // Chart: outer square 10-390, center at 200,200
    // Diamond: top(200,10), left(10,200), bottom(200,390), right(390,200)
    // X intersects diamond at: (105,105), (295,105), (295,295), (105,295)
    const housePolygons: Record<number, string> = {
        // Inner quadrants (inside diamond, divided by X)
        8: "200,10 105,105 200,200 295,105",              // Top inner
        5: "390,200 295,105 200,200 295,295",             // Right inner
        2: "200,390 295,295 200,200 105,295",             // Bottom inner
        11: "10,200 105,105 200,200 105,295",             // Left inner
        // Outer triangles (corners of square, outside diamond)
        9: "10,10 200,10 105,105",                        // Top-left corner (upper)
        10: "10,10 105,105 10,200",                       // Top-left corner (lower)
        12: "10,200 105,295 10,390",                      // Bottom-left corner (upper)
        1: "10,390 105,295 200,390",                      // Bottom-left corner (lower)
        3: "200,390 295,295 390,390",                     // Bottom-right corner (lower)
        4: "390,200 295,295 390,390",                     // Bottom-right corner (upper)
        6: "200,10 390,10 295,105",                       // Top-right corner (upper)
        7: "390,10 295,105 390,200",                      // Top-right corner (lower)
    };

    const ascSign = ascendantSign;

    const handleHouseClick = (houseNum: number) => {
        if (onHouseClick) {
            onHouseClick(houseNum);
        }
    };

    return (
        <svg viewBox="-10 -10 420 420" className={cn("w-full h-full drop-shadow-2xl", className)}>
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
            <g stroke="#D08C60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                {/* Outer Square Border */}
                <rect x="10" y="10" width="380" height="380" fill="none" />

                {/* Cross Lines (X) */}
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />

                {/* Diamond Lines */}
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Invisible Clickable Regions for Houses */}
            {onHouseClick && houseCenters.map((pos) => (
                <polygon
                    key={`click-${pos.h}`}
                    points={housePolygons[pos.h]}
                    fill={hoveredHouse === pos.h ? "rgba(208, 140, 96, 0.15)" : "transparent"}
                    stroke="transparent"
                    strokeWidth="0"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredHouse(pos.h)}
                    onMouseLeave={() => setHoveredHouse(null)}
                    onClick={() => handleHouseClick(pos.h)}
                />
            ))}

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                const signId = ((ascSign + pos.h - 2) % 12) + 1;
                const boxPlanets = planets.filter(p => p.signId === signId);
                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Sign Number - Positioned in corners/edges */}
                        <text
                            x={pos.x}
                            y={pos.y + (pos.h === 1 || pos.h === 4 || pos.h === 7 || pos.h === 10 ? 32 : pos.h === 2 || pos.h === 12 ? 22 : -22)}
                            fontSize="22"
                            fontFamily="serif"
                            fontWeight="900"
                            fill="#3D2618"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={cn(
                                "select-none transition-all duration-300 cursor-default",
                                isHovered && "scale-110"
                            )}
                            style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                        >
                            {signId}
                        </text>

                        {/* Planets List - Clustered in centers */}
                        {
                            boxPlanets.map((p, i) => {
                                const yOffset = (i * 14) - ((boxPlanets.length - 1) * 7);
                                return (
                                    <g key={p.name} transform={`translate(${pos.x}, ${pos.y + yOffset})`}>
                                        <text
                                            fontSize="13"
                                            fontFamily="serif"
                                            fontWeight="900"
                                            fill="#3D2618"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            className={cn(
                                                "select-none shadow-sm transition-all duration-300",
                                                isHovered && "font-black"
                                            )}
                                        >
                                            {p.name}
                                        </text>
                                        {p.isRetro && (
                                            <text x="12" y="4" fontSize="6" fontWeight="black" fill="#D08C60">R</text>
                                        )}
                                    </g>
                                );
                            })
                        }
                    </g>
                );
            })}
        </svg >
    );
}
