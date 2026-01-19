"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface PlanetPosition {
    name: string;
    signId: number;
    degree: string;
}

interface SudarshanChakraProps {
    lagnaPlanets: PlanetPosition[];
    moonPlanets: PlanetPosition[];
    sunPlanets: PlanetPosition[];
    activeLayer: 'triple' | 'lagna' | 'moon' | 'sun';
    className?: string;
    // Map of house index (0-11) to signId (1-12) for each layer
    layerSigns?: {
        lagna: number[];
        moon: number[];
        sun: number[];
    };
}

export default function SudarshanChakraPro({ lagnaPlanets, moonPlanets, sunPlanets, activeLayer, className, layerSigns }: SudarshanChakraProps) {
    // Layer configuration: Outer (Sun), Middle (Moon), Inner (Lagna/Birth)
    // Radially: Birth (inner) -> Moon (middle) -> Sun (outer)
    const layers = [
        { id: 'sun', data: sunPlanets, radius: 215, label: 'Surya Chart', signs: layerSigns?.sun || [] },
        { id: 'moon', data: moonPlanets, radius: 165, label: 'Chandra Chart', signs: layerSigns?.moon || [] },
        { id: 'lagna', data: lagnaPlanets, radius: 115, label: 'Birth Chart', signs: layerSigns?.lagna || [] },
    ];

    const getCoord = (angle: number, radius: number) => {
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: 250 + radius * Math.cos(rad),
            y: 250 + radius * Math.sin(rad)
        };
    };

    return (
        <div className={cn("w-full h-full flex items-center justify-center p-4", className)}>
            <div className="w-full aspect-square relative flex items-center justify-center">
                <svg viewBox="0 0 500 500" className="w-full h-full block overflow-visible">
                    {/* Background Circle / Subtle Glow */}
                    <circle cx="250" cy="250" r="245" fill="none" stroke="#f8fafc" strokeWidth="0.5" />

                    {/* Concentric Circles - Sharp Technical Lines */}
                    {[80, 135, 190, 245].map(r => (
                        <circle key={r} cx="250" cy="250" r={r} fill="none" stroke="#000000" strokeWidth="0.8" />
                    ))}

                    {/* 12 House Dividing Lines */}
                    {[...Array(12)].map((_, i) => {
                        const angle = i * 30 - 15; // Rotate to 12 o'clock position start
                        const p1 = getCoord(angle, 80);
                        const p2 = getCoord(angle, 245);
                        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#000000" strokeWidth="0.8" />;
                    })}

                    {/* Planetary Layers */}
                    {layers.map((layer) => {
                        if (activeLayer !== 'triple' && activeLayer !== layer.id) return null;

                        return (
                            <g key={layer.id}>
                                {[...Array(12)].map((_, i) => {
                                    const angle = i * 30;
                                    const signId = layer.signs[i] || '';

                                    const planetsInHouse = layer.data.filter(p => {
                                        if (layer.signs.length > 0) return p.signId === signId;
                                        return p.signId === (i + 1);
                                    });

                                    const signCoord = getCoord(angle, layer.radius + 15);
                                    const planetCoord = getCoord(angle, layer.radius - 12);

                                    const pNames = planetsInHouse.map(p => p.name);
                                    const planetChunks: string[] = [];
                                    for (let j = 0; j < pNames.length; j += 2) {
                                        planetChunks.push(pNames.slice(j, j + 2).join(' '));
                                    }

                                    return (
                                        <g key={`seg-${layer.id}-${i}`}>
                                            <text
                                                x={signCoord.x}
                                                y={signCoord.y}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-[16px] font-bold fill-slate-900 font-sans"
                                            >
                                                {signId}
                                            </text>

                                            {planetChunks.map((chunk, cIdx) => (
                                                <text
                                                    key={cIdx}
                                                    x={planetCoord.x}
                                                    y={planetCoord.y - (planetChunks.length > 1 ? (cIdx - (planetChunks.length - 1) / 2) * 14 : 0)}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    className="text-[14px] font-serif font-black fill-black"
                                                >
                                                    {chunk}
                                                </text>
                                            ))}
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* Central Area - Subtle point */}
                    <circle cx="250" cy="250" r="1.5" fill="#000" opacity="0.2" />
                </svg>
            </div>
        </div>
    );
}
