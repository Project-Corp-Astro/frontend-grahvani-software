"use client";

import React, { useMemo } from 'react';
import ChartControls from "@/components/astrology/ChartControls";
import { RamanChartContainer } from "@/components/astrology/raman/RamanChartContainer";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import PlanetaryTable from "@/components/astrology/PlanetaryTable";
import { useClientCharts } from "@/hooks/queries/useClientCharts";
import { useChartMutations } from "@/hooks/mutations/useChartMutations";
import { parseChartData, signIdToName } from "@/lib/chart-helpers";

interface ChartsPageProps {
    params: {
        id: string;
    };
}

export default function ChartsPage({ params }: ChartsPageProps) {
    const clientId = params.id;
    const { ayanamsa } = useAstrologerStore();

    // Fetch real chart data from backend
    const { data: charts, isLoading, error, refetch } = useClientCharts(clientId);
    const { generateFullVedicProfile, isGeneratingFull } = useChartMutations();

    // Identify current chart based on system
    const currentChart = useMemo(() => {
        if (!charts) return null;
        const systemKey = (ayanamsa || 'lahiri').toLowerCase();
        return charts[`D1_${systemKey}`] || charts[`natal_${systemKey}`];
    }, [charts, ayanamsa]);

    // Process planetary data for rendering
    const processed = useMemo(() => {
        if (!currentChart?.chartData) return null;
        return parseChartData(currentChart.chartData);
    }, [currentChart]);

    // Map to PlanetaryTable format
    const planetaryInfo = useMemo(() => {
        if (!processed) return [];
        return processed.planets.map(p => ({
            planet: p.name,
            sign: signIdToName[p.signId] || '??',
            degree: p.degree || '00°00\'',
            nakshatra: p.nakshatra || '??',
            nakshatraPart: p.pada || 1,
            house: p.house || 1,
            isRetro: p.isRetro
        }));
    }, [processed]);

    const handleGenerate = async () => {
        try {
            await generateFullVedicProfile.mutateAsync(clientId);
            refetch();
        } catch (err) {
            console.error("Failed to generate charts", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-140px)]">
                <div className="text-amber-900 animate-pulse font-serif text-xl">Consulting the Stars...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Left Sidebar: Controls */}
            <div className="w-full lg:w-[280px] shrink-0 bg-[#FEFAEA] border border-[#E7D6B8] rounded p-4 overflow-y-auto custom-scrollbar">
                <ChartControls />
            </div>

            {/* Right Area: Chart Canvas & Data */}
            <div className="flex-1 bg-[#FEFAEA] border border-[#E7D6B8] rounded p-6 shadow-inner overflow-y-auto custom-scrollbar relative">

                {/* Decorative Background */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none sticky top-0"
                    style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                        backgroundBlendMode: 'multiply'
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-10 max-w-4xl mx-auto">

                    {/* Dynamic Chart Selection */}
                    <div className="w-full">
                        {/* Raman has its own specialized container with advanced mapping */}
                        {ayanamsa.toLowerCase() === 'raman' ? (
                            <RamanChartContainer clientId={clientId} />
                        ) : (
                            // Lahiri / Default View
                            <div className="flex flex-col items-center gap-10">
                                {currentChart ? (
                                    <>
                                        <div className="w-full max-w-[450px] aspect-square">
                                            <h2 className="text-xl font-serif text-slate-800 mb-4 text-center">
                                                {ayanamsa} Ayanamsa (D1 Chart)
                                            </h2>
                                            {processed && (
                                                <NorthIndianChart
                                                    ascendantSign={processed.ascendant}
                                                    planets={processed.planets}
                                                />
                                            )}
                                        </div>
                                        {/* Planetary Table Section */}
                                        <div className="w-full">
                                            <h3 className="font-serif text-[#9C7A2F] text-lg font-bold mb-4 flex items-center gap-2">
                                                <span className="w-8 h-[1px] bg-[#9C7A2F]/50"></span>
                                                Planetary Details
                                                <span className="w-8 h-[1px] bg-[#9C7A2F]/50"></span>
                                            </h3>
                                            <PlanetaryTable planets={planetaryInfo} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-amber-200 rounded-xl bg-amber-50/30">
                                        <div className="text-5xl mb-4">✨</div>
                                        <h3 className="text-xl font-serif text-amber-900 mb-2">No Vedic Data Found</h3>
                                        <p className="text-slate-600 mb-6 max-w-md">The astrological profile for this client hasn't been generated for the {ayanamsa} system yet.</p>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGeneratingFull}
                                            className="px-6 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors disabled:bg-amber-300"
                                        >
                                            {isGeneratingFull ? 'Generating Profile...' : 'Generate Full Profile'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

