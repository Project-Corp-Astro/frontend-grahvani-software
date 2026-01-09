import React from 'react';
import NorthIndianChart, { Planet } from './NorthIndianChart/NorthIndianChart';
import PlanetComparisonTable from './PlanetComparisonTable';

interface ChartData {
    name: string;
    ascendantSign: number;
    planets: Planet[];
}

interface ChartComparisonProps {
    chart1: ChartData;
    chart2: ChartData;
}

export default function ChartComparison({ chart1, chart2 }: ChartComparisonProps) {
    return (
        <div className="space-y-8 p-4 bg-[#FAF5E6] rounded-lg border border-[#DCC9A6]">

            {/* Header / Title could go here */}
            <div className="flex items-center justify-between border-b border-[#DCC9A6] pb-4">
                <h2 className="text-xl font-serif font-bold text-[#3E2A1F]">Chart Comparison</h2>
                <div className="text-sm text-[#7A5A43] font-serif italic">
                    Comparing {chart1.name} w/ {chart2.name}
                </div>
            </div>

            {/* Charts View (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart 1 */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-center font-bold text-[#9C7A2F] font-serif">{chart1.name}</h3>
                    <div className="aspect-square w-full max-w-[400px] mx-auto">
                        <NorthIndianChart
                            planets={chart1.planets}
                            ascendantSign={chart1.ascendantSign}
                        />
                    </div>
                </div>

                {/* Chart 2 */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-center font-bold text-[#9C7A2F] font-serif">{chart2.name}</h3>
                    <div className="aspect-square w-full max-w-[400px] mx-auto">
                        <NorthIndianChart
                            planets={chart2.planets}
                            ascendantSign={chart2.ascendantSign}
                        />
                    </div>
                </div>
            </div>

            {/* Planetary Comparison Table */}
            <div className="mt-8">
                <h3 className="font-serif font-bold text-[#3E2A1F] mb-4">Planetary Positions</h3>
                <PlanetComparisonTable
                    planetsA={chart1.planets}
                    planetsB={chart2.planets}
                    chartAName={chart1.name}
                    chartBName={chart2.name}
                />
            </div>

        </div>
    );
}
