"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Loader2, RefreshCw } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
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



import { parseChartData, signIdToName } from '@/lib/chart-helpers';

function mapChartToPlanetInfo(chartData: any): PlanetInfo[] {
    // Leverage the robust parser we alread fixed
    const { planets } = parseChartData(chartData);

    if (planets.length === 0) return [];

    const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    // Map of short names to long names if needed for sorting or display
    const longNames: Record<string, string> = {
        'Su': 'Sun', 'Mo': 'Moon', 'Ma': 'Mars', 'Me': 'Mercury',
        'Ju': 'Jupiter', 'Ve': 'Venus', 'Sa': 'Saturn', 'Ra': 'Rahu', 'Ke': 'Ketu'
    };

    return planets
        .filter(p => p.name !== 'As') // Exclude Ascendant from planets list
        .map(p => {
            const longName = longNames[p.name] || p.name;
            const signName = signIdToName[p.signId] || 'Unknown';
            // Determine Nakshatra Lord
            const nakLord = p.nakshatra ? NAKSHATRA_LORDS[p.nakshatra] || 'Unknown' : '—';

            return {
                planet: longName,
                sign: signName,
                signLord: SIGN_LORDS[signName] || '—',
                degree: p.degree,
                longitude: '—', // Normalized parser handles degree formatting, raw longitude might be lost but degree is present
                nakshatra: p.nakshatra || '—',
                pada: p.pada || 1,
                nakshatraLord: nakLord,
                house: p.house || 1,
                dignity: 'Neutral', // Dignity is complex to calculate, placeholder or needs robust calc
                retrograde: p.isRetro || false,
            };
        })
        .sort((a, b) => {
            const idxA = planetOrder.indexOf(a.planet);
            const idxB = planetOrder.indexOf(b.planet);
            // Handle if names mismatch (e.g. Su vs Sun)
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });
}

export default function VedicPlanetsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

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
