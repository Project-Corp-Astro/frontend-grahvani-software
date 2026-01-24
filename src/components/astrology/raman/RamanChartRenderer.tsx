'use client';

import React from 'react';
import { HouseData, ChartPoint } from '@/utils/astrology/ramanMapping';

interface RamanChartRendererProps {
    houses: HouseData[];
}

/**
 * North Indian Chart Renderer (Diamond Style)
 * Houses are fixed:
 * 1: Top Diamond
 * 2: Top-Left Triangle
 * 3: Left Triangle
 * 4: Lower-Left Diamond
 * ...etc.
 */
export const RamanChartRenderer: React.FC<RamanChartRendererProps> = ({ houses }) => {
    // SVG Coordinate System (0,0 to 100,100)

    // House Center Coordinates (approximate for label placement)
    const houseCenters = [
        { x: 50, y: 25 }, // H1
        { x: 25, y: 12 }, // H2
        { x: 12, y: 25 }, // H3
        { x: 25, y: 50 }, // H4
        { x: 12, y: 75 }, // H5
        { x: 25, y: 88 }, // H6
        { x: 50, y: 75 }, // H7
        { x: 75, y: 88 }, // H8
        { x: 88, y: 75 }, // H9
        { x: 75, y: 50 }, // H10
        { x: 88, y: 25 }, // H11
        { x: 75, y: 12 }, // H12
    ];

    // Helper to render points in a house
    const renderPoints = (points: ChartPoint[], houseIndex: number) => {
        const center = houseCenters[houseIndex];
        if (!center) return null;

        // Simple stacking logic
        return points.map((p, i) => (
            <text
                key={p.name}
                x={center.x}
                y={center.y + (i * 6) - ((points.length - 1) * 3)} // Stack vertically centered
                textAnchor="middle"
                className={`text-[3px] font-medium fill-slate-800 ${p.isRetro ? 'fill-red-700' : ''}`}
                style={{ fontSize: '0.25rem' }}
            >
                {p.name}{p.isRetro ? '(R)' : ''} {Math.floor(parseFloat(p.longitude))}°
            </text>
        ));
    };

    // Helper to render Sign Number in corner of house
    // H1: Bottom corner, H2: Bottom-Right, etc. (Standard positions)
    // Actually, traditionally sign numbers are placed:
    // H1: Bottom, H2: Left etc? No standard varies.
    // Let's place sign number clearly readable.

    const renderSignNumber = (sign: number, houseIndex: number) => {
        // Custom offsets for sign numbers based on house shape
        // Simplified: distinct position from planets
        const offsets = [
            { dx: 0, dy: 15 },  // H1 (Below center)
            { dx: 0, dy: -5 },  // H2 (Above)
            { dx: 5, dy: 0 },   // H3 (Right)
            { dx: 0, dy: -10 }, // H4 (Above)
            { dx: 5, dy: 0 },   // H5 (Right)
            { dx: 0, dy: -5 },  // H6 (Above)
            { dx: 0, dy: -15 }, // H7 (Above center)
            { dx: 0, dy: 5 },   // H8 (Below)
            { dx: -5, dy: 0 },  // H9 (Left)
            { dx: 0, dy: 10 },  // H10 (Below)
            { dx: -5, dy: 0 },  // H11 (Left)
            { dx: 0, dy: 5 },   // H12 (Below)
        ];

        const center = houseCenters[houseIndex];
        const offset = offsets[houseIndex];

        return (
            <text
                x={center.x + offset.dx}
                y={center.y + offset.dy}
                textAnchor="middle"
                className="text-[4px] font-bold fill-amber-700/50"
                style={{ fontSize: '0.35rem' }}
            >
                {sign}
            </text>
        );
    };

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full bg-orange-50/30 border border-orange-200">
            {/* Main Grid Lines */}
            <g className="stroke-orange-800 stroke-[0.5]">
                {/* Outer Box */}
                <rect x="0" y="0" width="100" height="100" fill="none" />
                {/* Diagonals */}
                <line x1="0" y1="0" x2="100" y2="100" />
                <line x1="100" y1="0" x2="0" y2="100" />
                {/* Diamond */}
                <line x1="50" y1="0" x2="100" y2="50" />
                <line x1="100" y1="50" x2="50" y2="100" />
                <line x1="50" y1="100" x2="0" y2="50" />
                <line x1="0" y1="50" x2="50" y2="0" />
            </g>

            {/* House Contents */}
            {houses.map((house, i) => (
                <g key={house.houseNumber}>
                    {/* Render Sign Number */}
                    {renderSignNumber(house.sign, i)}
                    {/* Render Planets */}
                    {renderPoints(house.points, i)}
                </g>
            ))}

            {/* Lagna Label in House 1 (Optional, redundant with 'As' point but standard) */}
            <text x="50" y="10" textAnchor="middle" className="text-[3px] fill-slate-500">
                Lagna
            </text>
        </svg>
    );
};
