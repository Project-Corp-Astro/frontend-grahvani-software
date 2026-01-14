"use client";

import React from 'react';
import { Compass, Orbit, Zap, Star } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import PlanetaryAnalytics, { DetailedPlanetInfo } from '@/components/astrology/PlanetaryAnalytics';

const MOCK_DETAILED_PLANETS: DetailedPlanetInfo[] = [
    { planet: 'Sun', sign: 'Scorpio', degree: '22° 14\' 30"', nakshatra: 'Jyeshtha', pada: 3, nakshatraLord: 'Mercury', house: 1, dignity: 'Friend', shadbala: 6.8, avastha: 'Jagrat (Awake)', karaka: 'AmtK' },
    { planet: 'Moon', sign: 'Scorpio', degree: '05° 10\' 12"', nakshatra: 'Anuradha', pada: 2, nakshatraLord: 'Saturn', house: 1, dignity: 'Debilitated', shadbala: 5.2, avastha: 'Swapna (Dreaming)', karaka: 'GnK' },
    { planet: 'Mars', sign: 'Scorpio', degree: '12° 45\' 00"', nakshatra: 'Anuradha', pada: 4, nakshatraLord: 'Saturn', house: 1, dignity: 'Own Sign', shadbala: 7.5, avastha: 'Jagrat (Awake)', karaka: 'BK' },
    { planet: 'Mercury', sign: 'Sagittarius', degree: '08° 12\' 10"', nakshatra: 'Mula', pada: 1, nakshatraLord: 'Ketu', house: 2, dignity: 'Neutral', shadbala: 5.9, avastha: 'Sushupti (Asleep)', karaka: 'MK' },
    { planet: 'Jupiter', sign: 'Gemini', degree: '15° 10\' 22"', nakshatra: 'Ardra', pada: 3, nakshatraLord: 'Rahu', house: 8, dignity: 'Enemy', shadbala: 4.5, avastha: 'Swapna (Dreaming)', karaka: 'PiK' },
    { planet: 'Venus', sign: 'Virgo', degree: '18° 22\' 05"', nakshatra: 'Hasta', pada: 2, nakshatraLord: 'Moon', house: 11, dignity: 'Debilitated', shadbala: 3.8, avastha: 'Sushupti (Asleep)', karaka: 'DK' },
    { planet: 'Saturn', sign: 'Aquarius', degree: '03° 55\' 18"', nakshatra: 'Dhanishta', pada: 4, nakshatraLord: 'Mars', house: 4, dignity: 'Moolatrikona', shadbala: 8.2, avastha: 'Jagrat (Awake)', karaka: 'AK' },
    { planet: 'Rahu', sign: 'Scorpio', degree: '25° 12\' 00"', nakshatra: 'Jyeshtha', pada: 4, nakshatraLord: 'Mercury', house: 1, dignity: 'Neutral', shadbala: 0, avastha: '—' },
    { planet: 'Ketu', sign: 'Taurus', degree: '25° 12\' 00"', nakshatra: 'Mrigashira', pada: 2, nakshatraLord: 'Mars', house: 7, dignity: 'Neutral', shadbala: 0, avastha: '—' },
];

export default function VedicPlanetsPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#FFFFFa]/80 border border-[#D08C60]/30 p-8 rounded-[2rem] shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                    <Compass className="w-8 h-8 text-[#D08C60]" />
                    <div>
                        <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight">Planetary Diagnostics</h1>
                        <p className="text-[#8B5A2B] font-serif text-sm">Quantitative strength analysis of the natal field</p>
                    </div>
                </div>

                <PlanetaryAnalytics planets={MOCK_DETAILED_PLANETS} />
            </div>

            {/* Additional Expert Metrics could go here (e.g. Bhava Chalit chart) */}
        </div>
    );
}
