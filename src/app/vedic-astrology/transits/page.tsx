"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCcw, AlertTriangle, ShieldAlert, Loader2, Calendar, Info } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { cn } from "@/lib/utils";
import NorthIndianChart, { Planet } from '@/components/astrology/NorthIndianChart';
import { clientApi } from '@/lib/api';

import { parseChartData, signNameToId, signIdToName } from '@/lib/chart-helpers';

interface TransitPlanet {
    planet: string;
    sign: string;
    degree: string;
    house: number;
    status: string;
    isRetro: boolean;
    nakshatra: string;
}

// Map API data to transit format using robust parser
function mapChartToTransits(chartData: any, natalAscendant: number): TransitPlanet[] {
    // Leverage the robust parser we already fixed
    const { planets } = parseChartData(chartData);

    if (planets.length === 0) return [];

    return planets
        .filter(p => p.name !== 'As') // Exclude Ascendant marker
        .map(p => {
            const normalized = p.signId; // signId is 1-12
            // Calculate house relative to natal ascendant
            const house = ((normalized - natalAscendant + 12) % 12) + 1;

            // Simplified status logic or map from p.dignity if we extend Planet interface
            // For now, we assume neutral unless data provided, 
            // but parseChartData standardizes the core fields.

            return {
                planet: p.name,
                sign: signIdToName[p.signId] || 'Unknown',
                degree: p.degree,
                house,
                status: 'Neutral', // Placeholder or needs extending Planet interface if dignity is critical
                isRetro: p.isRetro || false,
                nakshatra: p.nakshatra || '—',
            };
        });
}

export default function TransitsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const activeSystem = settings.ayanamsa.toLowerCase();

    const { transitData, natalAscendant, transitPlanets } = React.useMemo(() => {
        const d1Key = `D1_${activeSystem}`;
        const transitKey = `transit_${activeSystem}`;

        const d1Chart = processedCharts[d1Key];
        const transitChart = processedCharts[transitKey];

        // Transit page needs BOTH: D1 (for natal ascendant/houses) and transit chart (for Gochar positions)
        if (!d1Chart?.chartData || !transitChart?.chartData) {
            console.log("🔍 DEBUG: Transits Page - Missing Data", {
                hasD1: !!d1Chart?.chartData,
                hasTransit: !!transitChart?.chartData,
                d1Key, transitKey
            });
            return { transitData: [], natalAscendant: 1, transitPlanets: [] };
        }

        console.log("🔍 DEBUG: Transits Page - Data Found", {
            d1: d1Chart.chartData ? "OK" : "Missing",
            transit: transitChart.chartData ? "OK" : "Missing"
        });

        const natal = d1Chart.chartData;
        const transit = transitChart.chartData;

        // Use parseChartData for NATAL as well to robustly find ascendantSign
        const { ascendant: ascSign } = parseChartData(natal);
        const transits = mapChartToTransits(transit, ascSign);

        // Parse transit planets for North Indian Chart - REUSE robust 'transits' array
        const planets: Planet[] = transits.map(t => ({
            name: t.planet.substring(0, 2), // Short name for chart (Su, Mo, etc.)
            signId: signNameToId[t.sign] || 1,
            degree: t.degree,
            isRetro: t.isRetro
        }));

        return { transitData: transits, natalAscendant: ascSign, transitPlanets: planets };
    }, [processedCharts, activeSystem]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, isGeneratingCharts]);

    const retroPlanets = transitData.filter(t => t.isRetro);
    const debilitatedPlanets = transitData.filter(t => t.status === 'Debilitated');

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view transit analysis</p>
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif text-[#3E2A1F] font-black tracking-tight flex items-center gap-2">
                        <RefreshCcw className="w-5 h-5 text-[#D08C60]" />
                        Transit Impact Analysis
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[#8B5A2B] font-serif text-sm">Gochar positions for {clientDetails.name}</p>
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshCharts}
                        disabled={isLoadingCharts}
                        className="p-2 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60]/10 text-[#8B5A2B] disabled:opacity-50"
                    >
                        <RefreshCcw className={cn("w-4 h-4", isRefreshingCharts && "animate-spin")} />
                    </button>
                    <div className="bg-green-100 px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase text-green-700">Live</span>
                    </div>
                </div>
            </div>

            {/* Loading State - Only show if NO data exists */}
            {isLoadingCharts && Object.keys(processedCharts).length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-[#D08C60] animate-spin mb-3" />
                    <p className="font-serif text-[#8B5A2B]">Calculating transit positions...</p>
                </div>
            )}


            {/* No Data State */}
            {!isLoadingCharts && transitData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Info className="w-12 h-12 text-[#8B5A2B]/30 mb-3" />
                    <p className="font-serif text-[#8B5A2B] text-lg mb-2">Transit data unavailable</p>
                    <p className="text-sm text-[#8B5A2B]/60 mb-4">Charts are being generated for this client</p>
                    <button
                        onClick={refreshCharts}
                        className="px-4 py-2 bg-[#D08C60] text-white rounded-lg font-medium hover:bg-[#D08C60]/90"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {transitData.length > 0 && (
                <>
                    {/* Alert Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {retroPlanets.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-900 font-serif">Retrograde Alert</h3>
                                    <p className="text-xs text-red-800/80 mt-0.5">
                                        {retroPlanets.map(p => p.planet).join(', ')} {retroPlanets.length === 1 ? 'is' : 'are'} retrograde.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-[#D08C60]/10 border border-[#D08C60]/30 rounded-xl p-3 flex items-start gap-3">
                            <div className="p-1.5 bg-[#D08C60]/20 rounded-lg text-[#8B5A2B]">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#5A3E2B] font-serif">Transit Summary</h3>
                                <p className="text-xs text-[#5A3E2B]/80 mt-0.5">
                                    {debilitatedPlanets.length > 0
                                        ? `${debilitatedPlanets.map(p => p.planet).join(', ')} in challenging positions.`
                                        : 'No major planetary afflictions.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Transit Chart */}
                        <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-xl p-4">
                            <h3 className="font-serif font-bold text-[#3E2A1F] text-sm text-center mb-3">Gochar Chart</h3>
                            <div className="aspect-square bg-[#FDFBF7] rounded-lg border border-[#D08C60]/10 p-3 flex items-center justify-center">
                                <NorthIndianChart
                                    ascendantSign={natalAscendant}
                                    planets={transitPlanets}
                                    className="bg-transparent border-none w-full h-full"
                                    showDegrees={false}
                                />
                            </div>
                            <p className="text-[10px] text-center text-[#8B5A2B] mt-2">
                                Natal Ascendant: {signIdToName[natalAscendant]}
                            </p>
                        </div>

                        {/* Transit Table */}
                        <div className="lg:col-span-2 bg-[#FFFFFa] border border-[#D08C60]/20 rounded-xl overflow-hidden">
                            <div className="p-3 border-b border-[#D08C60]/10 bg-[#FAF7F2] flex justify-between items-center">
                                <h3 className="font-serif font-bold text-[#3E2A1F] text-sm">Transit Positions</h3>
                                <div className="flex items-center gap-1 text-[10px] text-[#8B5A2B]">
                                    <Calendar className="w-3 h-3" />
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[9px] tracking-wider">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Planet</th>
                                            <th className="px-3 py-2 text-left">Sign</th>
                                            <th className="px-3 py-2 text-left">Degree</th>
                                            <th className="px-3 py-2 text-left">Nakshatra</th>
                                            <th className="px-3 py-2 text-center">House</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D08C60]/10">
                                        {transitData.map((row, i) => (
                                            <tr key={i} className="hover:bg-[#3E2A1F]/5 transition-colors">
                                                <td className="px-3 py-2 font-bold text-[#3E2A1F]">
                                                    <span className="flex items-center gap-1.5">
                                                        {row.planet}
                                                        {row.isRetro && (
                                                            <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded animate-pulse">R</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 font-serif text-[#3E2A1F]">{row.sign}</td>
                                                <td className="px-3 py-2 font-mono text-[#3E2A1F]">{row.degree}</td>
                                                <td className="px-3 py-2 text-[#8B5A2B]">{row.nakshatra}</td>
                                                <td className="px-3 py-2 text-center font-bold text-[#3E2A1F]">{row.house}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
