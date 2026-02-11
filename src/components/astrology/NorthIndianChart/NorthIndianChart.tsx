"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Planet {
    name: string;
    signId: number;
    degree: string;
    isRetro?: boolean;
    house?: number;
    nakshatra?: string;
    pada?: number;
}

interface NorthIndianChartProps {
    planets: Planet[];
    ascendantSign: number; // 1-12
    className?: string;
    onHouseClick?: (houseNumber: number) => void;
    houseValues?: Record<number, number>; // Map of HouseNumber (1-12) to Value (e.g. Bindus)
    valueType?: 'bindu' | 'none';
    preserveAspectRatio?: string;
    showDegrees?: boolean; // Show planet degrees - true for D1, false for divisional charts
}

export default function NorthIndianChart({
    planets,
    ascendantSign,
    className = "",
    onHouseClick,
    houseValues,
    valueType = 'none',
    preserveAspectRatio,
    showDegrees = true
}: NorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    // DEBUG: Check props
    console.log("🔍 DEBUG: NorthIndianChart Render", { planetsCount: planets.length, ascendantSign });

    // Helpers for Heatmap
    const getHouseColor = (houseNum: number) => {
        if (!houseValues || !houseValues[houseNum]) return "transparent";
        const val = houseValues[houseNum];
        if (valueType === 'bindu') {
            if (val >= 32) return "rgba(16, 185, 129, 0.15)"; // Emerald
            if (val >= 28) return "rgba(208, 140, 96, 0.1)"; // Copper/Gold
            if (val < 20) return "rgba(225, 29, 72, 0.1)"; // Red
        }
        return "transparent";
    };

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
        { h: 2, x: 105, y: 45 },  // Top Left Triangle (Top-most)
        { h: 3, x: 45, y: 105 },  // Top Left Triangle (Left-most)
        { h: 4, x: 105, y: 200 }, // Left Diamond
        { h: 5, x: 45, y: 295 },  // Bottom Left Triangle (Left-most)
        { h: 6, x: 105, y: 355 }, // Bottom Left Triangle (Bottom-most)
        { h: 7, x: 200, y: 295 }, // Bottom Diamond
        { h: 8, x: 295, y: 355 }, // Bottom Right Triangle (Bottom-most)
        { h: 9, x: 355, y: 295 }, // Bottom Right Triangle (Right-most)
        { h: 10, x: 295, y: 200 },// Right Diamond
        { h: 11, x: 355, y: 105 },// Top Right Triangle (Right-most)
        { h: 12, x: 295, y: 45 }, // Top Right Triangle (Top-most)
    ];

    // Separate positions for sign numbers - placed at corners to avoid overlap with planets
    const signNumberPositions: Record<number, { x: number; y: number }> = {
        1: { x: 200, y: 170 },    // Top Diamond - bottom area
        2: { x: 105, y: 85 },     // Top-left upper triangle - center-right
        3: { x: 85, y: 105 },     // Top-left lower triangle - center-bottom
        4: { x: 175, y: 195 },    // Left Diamond - upper area
        5: { x: 90, y: 295 },     // Bottom-left upper triangle - center-top
        6: { x: 105, y: 325 },    // Bottom-left lower triangle - center-left
        7: { x: 200, y: 230 },    // Bottom Diamond - top area
        8: { x: 295, y: 325 },    // Bottom-right lower triangle - center-right
        9: { x: 315, y: 295 },    // Bottom-right upper triangle - center-bottom
        10: { x: 235, y: 205 },   // Right Diamond - lower area
        11: { x: 315, y: 105 },   // Top-right lower triangle - center-top
        12: { x: 295, y: 85 },    // Top-right upper triangle - center-left
    };

    // Define clickable polygon regions for each house
    // Houses are numbered 1-12 anti-clockwise starting from H1 (Top Diamond)
    const housePolygons: Record<number, string> = {
        1: "200,10 105,105 200,200 295,105",              // Top inner diamond
        2: "10,10 200,10 105,105",                        // Top-left corner (upper)
        3: "10,10 105,105 10,200",                       // Top-left corner (lower)
        4: "10,200 105,105 200,200 105,295",             // Left inner diamond
        5: "10,200 105,295 10,390",                      // Bottom-left corner (upper)
        6: "10,390 105,295 200,390",                      // Bottom-left corner (lower)
        7: "200,390 105,295 200,200 295,295",             // Bottom inner diamond
        8: "200,390 295,295 390,390",                     // Bottom-right corner (lower)
        9: "390,200 295,295 390,390",                     // Bottom-right corner (upper)
        10: "390,200 295,105 200,200 295,295",             // Right inner diamond
        11: "390,10 295,105 390,200",                      // Top-right corner (lower)
        12: "200,10 390,10 295,105",                       // Top-right corner (upper)
    };

    const handleHouseClick = (houseNum: number) => {
        if (onHouseClick) {
            onHouseClick(houseNum);
        }
    };

    return (
        <svg viewBox="-10 -10 420 420" preserveAspectRatio={preserveAspectRatio} className={cn("w-full h-full drop-shadow-2xl", className)}>
            <defs>
                <linearGradient id="chartParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E9" />
                    <stop offset="100%" stopColor="#FEFAEA" />
                </linearGradient>
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

            {/* Clickable Regions & Heatmap for Houses */}
            {houseCenters.map((pos) => (
                <polygon
                    key={`poly-${pos.h}`}
                    points={housePolygons[pos.h]}
                    fill={hoveredHouse === pos.h ? "rgba(208, 140, 96, 0.25)" : getHouseColor(pos.h)}
                    stroke="transparent"
                    strokeWidth="0"
                    className={cn("transition-all duration-300", onHouseClick && "cursor-pointer")}
                    onMouseEnter={() => setHoveredHouse(pos.h)}
                    onMouseLeave={() => setHoveredHouse(null)}
                    onClick={() => handleHouseClick(pos.h)}
                />
            ))}

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                // House 1 is always the Ascendant. 
                // Sign numbers count anti-clockwise starting from the Ascendant's sign in House 1.
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;

                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));
                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Sign Number - Positioned at corner/edge of each house segment */}
                        <text
                            x={signNumberPositions[pos.h].x}
                            y={signNumberPositions[pos.h].y}
                            fontSize="18"
                            fontFamily="'Spectral', 'Crimson Pro', serif"
                            fontWeight="700"
                            fill="#4A3F32"
                            fillOpacity="0.9"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none pointer-events-none"
                        >
                            {signId}
                        </text>

                        {/* Ashtakavarga Score / Value */}
                        {houseValues && houseValues[pos.h] !== undefined && (
                            <text
                                x={pos.x}
                                y={pos.y}
                                fontSize="34"
                                fontFamily="'Inter', 'Source Sans 3', sans-serif"
                                fontWeight="600"
                                fill={houseValues[pos.h] < 20 ? "#E11D48" : houseValues[pos.h] >= 30 ? "#10B981" : "#2D2419"}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {houseValues[pos.h]}
                            </text>
                        )}

                        {/* Planets List - Clustered in centers with color coding */}
                        <g transform={`translate(${pos.x}, ${pos.y + (houseValues ? 25 : -(boxPlanets.length > 3 ? 10 : 0))})`}>
                            {
                                boxPlanets.map((p, i) => {
                                    const spacing = boxPlanets.length > 5 ? 10 : 14;
                                    const yOffset = (i * spacing) - ((boxPlanets.length - 1) * (spacing / 2));

                                    // Planet color mapping
                                    const planetColors: Record<string, string> = {
                                        'Su': '#D97706', 'Sun': '#D97706',       // Amber
                                        'Mo': '#334155', 'Moon': '#334155',       // Slate 700 (Darker Gray)
                                        'Ma': '#DC2626', 'Mars': '#DC2626',       // Red
                                        'Me': '#059669', 'Mercury': '#059669',    // Green
                                        'Ju': '#CA8A04', 'Jupiter': '#CA8A04',    // Yellow
                                        'Ve': '#DB2777', 'Venus': '#DB2777',      // Pink
                                        'Sa': '#4F46E5', 'Saturn': '#4F46E5',     // Indigo
                                        'Ra': '#374151', 'Rahu': '#374151',       // Dark gray
                                        'Ke': '#EA580C', 'Ketu': '#EA580C',       // Orange
                                        'As': '#7C3AED', 'Asc': '#7C3AED',        // Purple
                                    };
                                    const planetColor = planetColors[p.name] || '#3D2618';

                                    return (
                                        <g key={p.name} transform={`translate(0, ${yOffset})`}>
                                            <text
                                                fontSize="14"
                                                fontFamily="'Spectral', 'Crimson Pro', serif"
                                                fontWeight="600"
                                                fill={planetColor}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className={cn(
                                                    "select-none transition-all duration-300",
                                                    isHovered && "font-black"
                                                )}
                                            >
                                                {p.name}
                                                {p.isRetro && (
                                                    <tspan fontSize="12" fontWeight="bold" fill="#DC2626" dx="1">R</tspan>
                                                )}
                                                {showDegrees && (
                                                    <tspan fontSize="10" fontWeight="400" fill="#4A3F32" dx="2">
                                                        {p.degree}
                                                    </tspan>
                                                )}
                                            </text>
                                        </g>
                                    );
                                })
                            }
                        </g>
                    </g>
                );
            })}
        </svg >
    );
}
