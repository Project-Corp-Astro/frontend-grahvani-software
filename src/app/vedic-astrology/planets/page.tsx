"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Loader2, RefreshCw } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PlanetInfo {
    planet: string;
    sign: string;
    signLord: string;
    degree: string;
    longitude: string;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    house: number;
    dignity: string;
    retrograde: boolean;
}

// Nakshatra lords mapping
const NAKSHATRA_LORDS: Record<string, string> = {
    'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
    'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
    'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
    'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
    'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
    'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
    'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury',
};

// Sign lords
const SIGN_LORDS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter',
};

// Safe degree parsing - handles string/number from API
function parseDegree(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

// Safe degree formatting - handles null/undefined/NaN
function formatDegree(degrees: number | null | undefined): string {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return '—';
    const deg = degrees % 30;
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor(((deg - d) * 60 - m) * 60);
    return `${d}°${m}'${s}"`;
}

// Safe longitude formatting
function formatLongitude(degrees: number | null | undefined): string {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return '—';
    return `${Number(degrees).toFixed(2)}°`;
}

function mapChartToPlanetInfo(chartData: any): PlanetInfo[] {
    if (!chartData?.planetary_positions) return [];

    const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    const planets = Object.entries(chartData.planetary_positions).map(([key, value]: [string, any]) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        const sign = value?.sign || 'Unknown';
        // Handle various degree formats from API (may be string or number)
        const deg = parseDegree(value?.degrees) ?? parseDegree(value?.longitude) ?? parseDegree(value?.degree);

        const nakLord = value?.nakshatra ? NAKSHATRA_LORDS[value.nakshatra] || 'Unknown' : '—';

        return {
            planet: name,
            sign,
            signLord: SIGN_LORDS[sign] || '—',
            degree: formatDegree(deg),
            longitude: formatLongitude(deg),
            nakshatra: value?.nakshatra || '—',
            pada: value?.pada || 1,
            nakshatraLord: nakLord,
            house: value?.house || 1,
            dignity: value?.dignity || 'Neutral',
            retrograde: value?.retrograde || false,
        };
    });

    return planets.sort((a, b) => planetOrder.indexOf(a.planet) - planetOrder.indexOf(b.planet));
}

export default function VedicPlanetsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { settings } = useAstrologerSettings();

    const activeSystem = settings.ayanamsa.toLowerCase();

    const planetData = React.useMemo(() => {
        const key = `D1_${activeSystem}`;
        const d1Chart = processedCharts[key];
        if (d1Chart?.chartData) {
            return mapChartToPlanetInfo(d1Chart.chartData);
        }
        return [];
    }, [processedCharts, activeSystem]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, isGeneratingCharts]);

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view planetary diagnostics</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Compass className="w-8 h-8 text-[#D08C60]" />
                    <div>
                        <h1 className="text-2xl font-serif text-[#3E2A1F] font-black tracking-tight">Planetary Diagnostics</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-[#8B5A2B] font-serif text-sm">Natal positions for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-[10px] font-bold uppercase rounded-full border border-[#D08C60]/30">
                                {settings.ayanamsa}
                            </span>
                            {isGeneratingCharts && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/80 text-green-700 text-[10px] font-bold rounded-full border border-green-200 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Generating...
                                </span>
                            )}
                            {isRefreshingCharts && !isGeneratingCharts && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/80 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Refreshing...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={refreshCharts}
                    disabled={isLoadingCharts}
                    className="p-2 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60]/10 text-[#8B5A2B] disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", isRefreshingCharts && "animate-spin")} />
                </button>
            </div>

            {/* Loading State - Only show if NO data exists */}
            {isLoadingCharts && Object.keys(processedCharts).length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-[#D08C60] animate-spin mb-3" />
                    <p className="font-serif text-[#8B5A2B]">Loading planetary positions...</p>
                </div>
            )}

            {/* No Data State */}
            {!isLoadingCharts && planetData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-serif text-[#8B5A2B] text-lg mb-2">No planetary data available</p>
                    <p className="text-sm text-[#8B5A2B]/60 mb-4">Charts are being generated for this client</p>
                    <button
                        onClick={refreshCharts}
                        className="px-4 py-2 bg-[#D08C60] text-white rounded-lg font-medium hover:bg-[#D08C60]/90"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Planets Table */}
            {planetData.length > 0 && (
                <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 text-left sticky left-0 bg-[#FAF7F2] z-10">Planet</th>
                                    <th className="px-4 py-3 text-left">Sign</th>
                                    <th className="px-4 py-3 text-left">Sign Lord</th>
                                    <th className="px-4 py-3 text-left">Degree</th>
                                    <th className="px-4 py-3 text-left">Longitude</th>
                                    <th className="px-4 py-3 text-left">Nakshatra</th>
                                    <th className="px-4 py-3 text-center">Pada</th>
                                    <th className="px-4 py-3 text-left">Nak Lord</th>
                                    <th className="px-4 py-3 text-center">House</th>
                                    <th className="px-4 py-3 text-left">Dignity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D08C60]/10">
                                {planetData.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-[#3E2A1F]/5 transition-colors">
                                        <td className="px-4 py-3 font-bold text-[#3E2A1F] sticky left-0 bg-[#FFFFFa] z-10">
                                            <span className="flex items-center gap-2">
                                                {p.planet}
                                                {p.retrograde && (
                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">R</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-serif text-[#3E2A1F]">{p.sign}</td>
                                        <td className="px-4 py-3 text-[#8B5A2B]">{p.signLord}</td>
                                        <td className="px-4 py-3 font-mono text-[#3E2A1F] font-medium">{p.degree}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-[#8B5A2B]">{p.longitude}</td>
                                        <td className="px-4 py-3 text-[#3E2A1F]">{p.nakshatra}</td>
                                        <td className="px-4 py-3 text-center font-bold text-[#D08C60]">{p.pada}</td>
                                        <td className="px-4 py-3 text-[#8B5A2B]">{p.nakshatraLord}</td>
                                        <td className="px-4 py-3 text-center font-bold text-[#3E2A1F]">{p.house}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                                p.dignity === 'Exalted' ? 'bg-green-100 text-green-700' :
                                                    p.dignity === 'Debilitated' ? 'bg-red-100 text-red-700' :
                                                        p.dignity === 'Own Sign' ? 'bg-blue-100 text-blue-700' :
                                                            p.dignity === 'Moolatrikona' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-gray-100 text-gray-600'
                                            )}>
                                                {p.dignity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
