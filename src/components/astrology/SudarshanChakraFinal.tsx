"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface HouseData {
    planets: string[];
    sign: string;
}

interface ChartData {
    [key: string]: HouseData;
}

interface SudarshanChakraFinalProps {
    data: {
        surya_chart: ChartData;
        chandra_chart: ChartData;
        lagna_chart: ChartData;
    } | any;
    className?: string;
}

const PLANET_ABBR: Record<string, string> = {
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke',
    'Ascendant': 'As'
};

const SIGN_NUMBERS: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const getAbbr = (planet: string) => PLANET_ABBR[planet] || planet.substring(0, 2);

export default function SudarshanChakraFinal({ data, className }: SudarshanChakraFinalProps) {
    if (!data) return null;

    const chakra = data.sudarshan_chakra || data;
    const surya = chakra.surya_chart || chakra.surya;
    const chandra = chakra.chandra_chart || chakra.chandra;
    const lagna = chakra.lagna_chart || chakra.lagna;

    if (!surya || !chandra || !lagna) return (
        <div className="flex items-center justify-center p-8 border border-dashed border-copper-200 rounded-3xl text-copper-400 italic">
            Insufficient data for Sudarshan Chakra
        </div>
    );

    const getCoord = (angle: number, radius: number) => {
        // Offset by -90 to start 0 at 12 o'clock
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: 300 + radius * Math.cos(rad),
            y: 300 + radius * Math.sin(rad)
        };
    };

    // Radius configuration for segments - Proportioned like the sample
    const ringConfig = [
        { id: 'surya', data: surya, outerR: 295, innerR: 220, signR: 235, planetR: 265 },
        { id: 'chandra', data: chandra, outerR: 220, innerR: 145, signR: 160, planetR: 190 },
        { id: 'lagna', data: lagna, outerR: 145, innerR: 70, signR: 85, planetR: 115 },
    ];

    return (
        <div className={cn("w-full h-full flex flex-col items-center justify-center p-0", className)}>
            <div className="w-full aspect-square relative max-w-[550px]">
                <svg viewBox="0 0 600 600" className="w-full h-full block overflow-visible">
                    {/* Concentric Circles */}
                    {[70, 145, 220, 295].map(r => (
                        <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#000" strokeWidth="1.2" />
                    ))}

                    {/* 12 Dividing Lines (Counter-Clockwise Houses) */}
                    {[...Array(12)].map((_, i) => {
                        const angle = -(i * 30 + 15);
                        const p1 = getCoord(angle, 70);
                        const p2 = getCoord(angle, 295);
                        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#000" strokeWidth="1.2" />;
                    })}


                    {/* Layers and Segments */}
                    {ringConfig.map((ring) => (
                        <g key={ring.id}>
                            {[...Array(12)].map((_, i) => {
                                const houseNum = (i + 1).toString();
                                const house = ring.data[houseNum];
                                if (!house) return null;

                                // House 1 is top, House 2 is counter-clockwise (left)
                                const angle = -(i * 30);
                                const signNum = SIGN_NUMBERS[house.sign] || house.sign;
                                const planets = house.planets || [];

                                // Positioning
                                const signPos = getCoord(angle, ring.signR);
                                const planetBasePos = getCoord(angle, ring.planetR);

                                return (
                                    <g key={`${ring.id}-${i}`}>
                                        {/* Sign Number (Inner Arc) */}
                                        <text
                                            x={signPos.x}
                                            y={signPos.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-[14px] font-bold fill-black/90"
                                        >
                                            {signNum}
                                        </text>

                                        {/* Planets (Outer Arc) */}
                                        <g>
                                            {planets.map((p: string, pIdx: number) => {
                                                // Intelligent layout: Stacked/horizontal depending on count
                                                const spiralOffset = (planets.length > 2 && pIdx >= 3) ? 14 : 0;
                                                const horizOffset = (planets.length > 1) ? (pIdx % 3 - Math.min(planets.length, 3 - 1) / 2) * 22 : 0;
                                                const vertOffset = (planets.length > 3 && pIdx >= 3) ? 15 : 0;

                                                return (
                                                    <text
                                                        key={pIdx}
                                                        x={planetBasePos.x + horizOffset}
                                                        y={planetBasePos.y - vertOffset}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        className="text-[15px] font-sans font-medium fill-black"
                                                    >
                                                        {getAbbr(p)}
                                                    </text>
                                                );
                                            })}
                                        </g>
                                    </g>
                                );
                            })}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
