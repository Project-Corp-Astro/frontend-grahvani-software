"use client";

import React from 'react';
import NorthIndianChart from '../astrology/NorthIndianChart/NorthIndianChart';
import { cn } from "@/lib/utils";

interface ChartAlignmentPanelProps {
    chartData: any;
    planetaryAnalysis: any;
}

export default function ChartAlignmentPanel({ chartData, planetaryAnalysis }: ChartAlignmentPanelProps) {
    if (!chartData) return null;

    // Map planets for NorthIndianChart
    const planets = Object.entries(chartData.planetary_positions).map(([name, data]: [string, any]) => ({
        name: name.substring(0, 2), // Su, Mo, etc.
        signId: getSignId(data.sign),
        degree: `${Math.floor(data.degree)}°`,
        isRetro: data.retrograde,
        house: data.house
    }));

    const ascendantSign = chartData.ascendant.sign_number + 1;

    // Find highlights
    const highlights = [];
    if (chartData.planetary_positions.Sun?.positional_status === 'Exalted') {
        highlights.push("Exalted Sun in 1st House");
    }

    // Find clusters (houses with 3+ planets)
    const houseCounts: Record<number, number> = {};
    Object.values(chartData.planetary_positions).forEach((p: any) => {
        houseCounts[p.house] = (houseCounts[p.house] || 0) + 1;
    });

    const clusters = Object.entries(houseCounts)
        .filter(([_, count]) => count >= 3)
        .map(([house, _]) => `Significant ${getOrdinal(parseInt(house))} House Cluster`);

    return (
        <div className={cn("p-6 h-full relative overflow-hidden group rounded-3xl", "bg-[rgba(254,250,234,0.6)] border border-[#E7D6B8] backdrop-blur-md")}>
            {/* Subtle Glow Effect - Adjusted for Light Theme */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />

            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: 'var(--gold-primary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--gold-primary)' }} />
                </span>
                Birth Chart & Planetary Alignments
            </h3>

            <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                <NorthIndianChart
                    planets={planets}
                    ascendantSign={ascendantSign}
                    className="chart-parchment-theme"
                    showDegrees={true}
                />
            </div>

            <style jsx global>{`
                .chart-parchment-theme g[stroke="#D08C60"] {
                    stroke: #3E2A1F; /* Ink */
                    stroke-opacity: 0.8;
                }
                .chart-parchment-theme text {
                    fill: #3E2A1F !important;
                    font-weight: 600;
                }
                .chart-parchment-theme text[font-weight="700"] {
                    fill: #5A3E2B !important;
                }
                /* Highlight certain signs/houses */
                .chart-parchment-theme polygon[fill*="rgba(208, 140, 96"] {
                    fill: rgba(201, 162, 77, 0.1) !important;
                }
            `}</style>

            <div className="mt-8 space-y-3">
                {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 border rounded-xl p-3" style={{ backgroundColor: 'rgba(201, 162, 77, 0.05)', borderColor: 'var(--gold-primary)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--gold-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{h}</span>
                    </div>
                ))}
                {clusters.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 border rounded-xl p-3" style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{c}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>Karmic Focus Area</p>
                <p className="text-xs mt-1 italic" style={{ color: 'var(--text-body)' }}>"The 5th house concentration indicates high creative and intelligence merit from past lives."</p>
            </div>
        </div>
    );
}

// Helpers
function getSignId(signName: string): number {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(signName) + 1;
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
