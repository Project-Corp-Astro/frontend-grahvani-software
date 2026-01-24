'use client';

import React, { useState } from 'react';
import { useRamanNatalChart } from '@/hooks/queries/useRaman';
import { RamanChartRenderer } from './RamanChartRenderer';
import { mapRamanResponseToNorthIndian } from '@/utils/astrology/ramanMapping';

interface RamanChartContainerProps {
    clientId: string;
}

export const RamanChartContainer: React.FC<RamanChartContainerProps> = ({ clientId }) => {
    const { data, isLoading, error } = useRamanNatalChart(clientId);
    const [showDebug, setShowDebug] = useState(false);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Raman Chart...</div>;
    }

    if (error || !data || !data.success) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading chart: {error?.message || 'Unknown error'}
            </div>
        );
    }

    const houseData = mapRamanResponseToNorthIndian(data.data);

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex justify-between items-center px-4">
                <h2 className="text-xl font-serif text-slate-800">Raman Ayanamsa (North Indian Layout)</h2>
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs text-amber-900 underline font-bold"
                >
                    {showDebug ? 'Hide Debug' : 'Verify Raw Data'}
                </button>
            </div>

            <div className="w-full max-w-lg aspect-square shadow-lg bg-orange-50/50 p-2 rounded-lg border border-orange-200">
                <RamanChartRenderer houses={houseData} />
            </div>

            <div className="text-sm text-slate-600 text-center">
                <p>Chart calculated using Raman Ayanamsa.</p>
                <p>Lagna: {data.data.ascendant.sign} ({data.data.ascendant.degrees})</p>
            </div>

            {showDebug && (
                <div className="w-full mt-8 border-t border-slate-200 pt-4 text-left">
                    <h3 className="font-bold text-sm mb-2 text-slate-800">Backend Response Validation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-4 rounded overflow-auto max-h-96 border border-slate-200">
                        <div>
                            <p className="font-bold mb-1 text-blue-800">Raw Backend Data (Raman)</p>
                            <pre className="whitespace-pre-wrap">{JSON.stringify(data.data.planetary_positions, null, 2)}</pre>
                        </div>
                        <div>
                            <p className="font-bold mb-1 text-green-800">Mapped Frontend Houses</p>
                            <pre className="whitespace-pre-wrap">{JSON.stringify(houseData, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
