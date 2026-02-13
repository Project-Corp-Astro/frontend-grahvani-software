'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clientApi } from '@/lib/api';
import { normalizeDoshaData } from './utils/dosha-normalizer';
import { DoshaSectionRenderer } from '@/components/astrology/dosha-modal/DoshaSectionRenderer';
import DebugConsole from '@/components/debug/DebugConsole';

interface DoshaModalProps {
    clientId: string;
    doshaType: string;
    ayanamsa?: string;
    className?: string;
}

/**
 * DoshaModal — independent orchestrator for Dosha analysis.
 */
export const DoshaModal = memo(function DoshaModal({
    clientId,
    doshaType,
    ayanamsa = 'lahiri',
    className,
}: DoshaModalProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rawData, setRawData] = useState<unknown>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch from Dosha-specific API
                const result = await clientApi.getDoshaAnalysis(clientId, doshaType, ayanamsa);
                const responseData = result.data?.data || result.data || result;
                setRawData(responseData);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch dosha analysis';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchData();
        }
    }, [clientId, doshaType, ayanamsa]);

    const normalized = useMemo(() => {
        if (!rawData) return null;
        return normalizeDoshaData(rawData);
    }, [rawData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-parchment/30 rounded-2xl border border-antique">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin mb-3" />
                <p className="text-xs font-serif text-secondary italic">Mapping karmic patterns...</p>
            </div>
        );
    }

    if (error || !normalized) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                    <Info className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <h3 className="text-red-900 font-bold font-serif text-sm">Dosha Analysis Pending</h3>
                    <p className="text-[10px] text-red-600">
                        {error || 'Detailed analysis not currently available for this client'}
                    </p>
                </div>
                {error && <DebugConsole title={`Dosha Error: ${doshaType}`} data={{ error, doshaType, ayanamsa }} />}
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300', className)}>
            <DoshaSectionRenderer data={normalized} />
            <DebugConsole title={`Dosha: ${doshaType}`} data={rawData} />
        </div>
    );
});
