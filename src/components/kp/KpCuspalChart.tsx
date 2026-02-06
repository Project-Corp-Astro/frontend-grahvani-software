"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Planet } from '../astrology/NorthIndianChart/NorthIndianChart';

export interface KpCuspalChartProps {
    planets: Planet[]; // Planets mapped to houses
    houseSigns: number[]; // Array of 12 sign IDs, one for each house (1-12)
    className?: string;
    onHouseClick?: (houseNumber: number) => void;
}

/**
 * KpCuspalChart
 * Specialized North Indian Chart for KP System
 * - Supports Unequal House Signs (KP/Placidus) via houseSigns prop
 * - House 1 is always top diamond
 * - Signs are displayed based on the Cusp sign
 */
export default function KpCuspalChart({
    planets,
    houseSigns,
    className = "",
    onHouseClick,
}: KpCuspalChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    // Helpers for Geometry
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

    // Define clickable polygon regions for each house
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
        <svg viewBox="-10 -10 420 420" className={cn("w-full h-full drop-shadow-2xl", className)}>
            <defs>
                <linearGradient id="kpChartBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E9" />
                    <stop offset="100%" stopColor="#FEFAEA" />
                </linearGradient>
            </defs>

            {/* Background is handled by parent container but we keep SVG geometry */}
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

            {/* Clickable Regions */}
            {houseCenters.map((pos) => (
                <polygon
                    key={`poly-${pos.h}`}
                    points={housePolygons[pos.h]}
                    fill={hoveredHouse === pos.h ? "rgba(208, 140, 96, 0.25)" : "transparent"}
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
                // Get Sign for this House from Prop (or default to 1)
                const signId = houseSigns[pos.h - 1] || 1;

                // Simple filtering: Planets in this house OR Planets with this Sign (if house not specified)
                // For KP Cusp chart, we usually plot planets based on usage relative to the cusp logic.
                // Assuming `planets` prop passed here will have `house` set correctly by parent.
                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));

                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Sign Number - REMOVED as per user request */}
                        {/* 
                        <text
                            x={pos.x}
                            y={pos.y + (pos.h === 1 || pos.h === 4 || pos.h === 7 || pos.h === 10 ? 35 : pos.h % 2 === 0 ? 30 : -30)}
                            fontSize="22"
                            fontFamily="serif"
                            fontWeight="900"
                            fill="#3D2618"
                            fillOpacity="0.5"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none pointer-events-none"
                        >
                            {signId}
                        </text> 
                        */}

                        {/* Planets List */}
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                            {
                                boxPlanets.map((p, i) => {
                                    const spacing = boxPlanets.length > 5 ? 10 : 14;
                                    const yOffset = (i * spacing) - ((boxPlanets.length - 1) * (spacing / 2));
                                    const displayName = p.isRetro ? `${p.name}℞` : p.name;

                                    return (
                                        <g key={p.name} transform={`translate(0, ${yOffset})`}>
                                            <text
                                                fontSize="14"
                                                fontFamily="serif"
                                                fontWeight="900"
                                                fill="#3D2618"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className={cn(
                                                    "select-none transition-all duration-300",
                                                    isHovered && "font-black"
                                                )}
                                            >
                                                {displayName}
                                                <tspan fontSize="9" fontWeight="500" fill="#3D2618" dx="2">
                                                    {p.degree}
                                                </tspan>
                                            </text>
                                        </g>
                                    );
                                })
                            }
                        </g>

                        {/* House Number (Roman or Small) - Optional, typically North Indian Charts don't show house numbers explicitly 
                            except by position. Keeping it clean. */}
                    </g>
                );
            })}
        </svg >
    );
}
