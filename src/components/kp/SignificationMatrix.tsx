"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { KpSignification } from '@/types/kp.types';
import { Info } from 'lucide-react';

interface SignificationMatrixProps {
    significations: KpSignification[];
    className?: string;
}

const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const planetColors: Record<string, string> = {
    'Sun': 'bg-orange-100 text-orange-700 border-orange-200',
    'Moon': 'bg-blue-50 text-blue-600 border-blue-200',
    'Mars': 'bg-red-100 text-red-700 border-red-200',
    'Mercury': 'bg-green-100 text-green-700 border-green-200',
    'Jupiter': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Venus': 'bg-pink-100 text-pink-700 border-pink-200',
    'Saturn': 'bg-gray-200 text-gray-700 border-gray-300',
    'Rahu': 'bg-purple-100 text-purple-700 border-purple-200',
    'Ketu': 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

/**
 * KP Signification Matrix
 * Interactive 9x12 grid showing which planets signify which houses
 * This is the KEY component for KP predictions
 */
export default function SignificationMatrix({ significations, className }: SignificationMatrixProps) {
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    // Convert to matrix format
    const matrix: Record<string, number[]> = {};
    significations.forEach(sig => {
        matrix[sig.planet] = sig.houses || [];
    });

    const isSignified = (planet: string, house: number): boolean => {
        return matrix[planet]?.includes(house) || false;
    };

    const isStrong = (planet: string): boolean => {
        return significations.find(s => s.planet === planet)?.strong || false;
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted mb-4">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-gold-primary/60" />
                    <span>Signified House</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-copper-200" />
                    <span>Highlighted Row/Column</span>
                </div>
                <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Hover to highlight connections</span>
                </div>
            </div>

            {/* Matrix */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="py-3 px-3 bg-copper-900 text-white text-left font-serif font-bold text-sm rounded-tl-lg">
                                Planet
                            </th>
                            {houses.map(house => (
                                <th
                                    key={house}
                                    className={cn(
                                        "py-3 px-2 text-center font-serif font-bold text-sm transition-colors cursor-pointer",
                                        hoveredHouse === house
                                            ? "bg-gold-primary text-white"
                                            : "bg-copper-800 text-white",
                                        house === 12 && "rounded-tr-lg"
                                    )}
                                    onMouseEnter={() => setHoveredHouse(house)}
                                    onMouseLeave={() => setHoveredHouse(null)}
                                >
                                    {house}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {planets.map((planet, pIdx) => (
                            <tr
                                key={planet}
                                className={cn(
                                    "transition-colors",
                                    hoveredPlanet === planet && "bg-gold-primary/10"
                                )}
                                onMouseEnter={() => setHoveredPlanet(planet)}
                                onMouseLeave={() => setHoveredPlanet(null)}
                            >
                                <td
                                    className={cn(
                                        "py-2 px-3 border-b border-antique font-semibold text-sm cursor-pointer",
                                        planetColors[planet] || 'bg-gray-50',
                                        pIdx === planets.length - 1 && "rounded-bl-lg"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {planet}
                                        {isStrong(planet) && (
                                            <span className="w-2 h-2 rounded-full bg-green-500" title="Strong Significator" />
                                        )}
                                    </span>
                                </td>
                                {houses.map((house, hIdx) => {
                                    const signified = isSignified(planet, house);
                                    const highlighted = hoveredPlanet === planet || hoveredHouse === house;

                                    return (
                                        <td
                                            key={house}
                                            className={cn(
                                                "py-2 px-2 text-center border-b border-antique/50 transition-all",
                                                signified
                                                    ? "bg-gold-primary/60"
                                                    : highlighted
                                                        ? "bg-copper-100"
                                                        : pIdx % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-softwhite",
                                                pIdx === planets.length - 1 && hIdx === houses.length - 1 && "rounded-br-lg"
                                            )}
                                        >
                                            {signified && (
                                                <span className="inline-block w-3 h-3 rounded-full bg-gold-dark" />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            {hoveredPlanet && matrix[hoveredPlanet] && (
                <div className="p-4 bg-parchment border border-antique rounded-xl animate-in fade-in duration-200">
                    <p className="text-sm">
                        <span className="font-serif font-bold text-ink">{hoveredPlanet}</span>
                        <span className="text-muted"> signifies houses: </span>
                        <span className="font-semibold text-gold-dark">
                            {matrix[hoveredPlanet].length > 0
                                ? matrix[hoveredPlanet].join(', ')
                                : 'None'}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
