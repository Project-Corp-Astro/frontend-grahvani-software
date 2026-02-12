'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clientApi } from '@/lib/api';
import { normalizeYogaData } from './utils/normalizer';
import { YogaSectionRenderer } from './YogaSectionRenderer';
import DebugConsole from '@/components/debug/DebugConsole';

interface YogaModalProps {
    clientId: string;
    yogaType: string;
    ayanamsa?: string;
    className?: string;
    onClose?: () => void;
}

/**
 * YogaModal — the orchestrator component.
 *
 * 1. Fetches yoga data from the existing API (unchanged)
 * 2. Normalizes via normalizeYogaData()
 * 3. Delegates rendering to YogaSectionRenderer
 *
 * Handles loading, error, and "yoga absent" states.
 */
export const YogaModal = memo(function YogaModal({
    clientId,
    yogaType,
    ayanamsa = 'lahiri',
    className,
    onClose,
}: YogaModalProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rawData, setRawData] = useState<unknown>(null);

    // Fetch data from existing API (no backend changes)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await clientApi.getYogaAnalysis(clientId, yogaType, ayanamsa);
                // Safely unwrap: backend might return { data: { data: ... } }
                const responseData = result.data?.data || result.data || result;
                setRawData(responseData);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch yoga analysis';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchData();
        }
    }, [clientId, yogaType, ayanamsa]);

    // Normalize data — memoized to avoid re-processing on every render
    const normalized = useMemo(() => {
        if (!rawData) return null;
        return normalizeYogaData(rawData);
    }, [rawData]);

    // ─── Loading State ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-parchment/30 rounded-2xl border border-antique">
                <Loader2 className="w-6 h-6 text-gold-primary animate-spin mb-3" />
                <p className="text-xs font-serif text-secondary italic">Analyzing celestial alignments...</p>
            </div>
        );
    }

    // ─── Error State ───────────────────────────────────────────────
    if (error || !normalized) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                    <Info className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-amber-900 font-bold font-serif text-sm">Yoga Detail Pending</h3>
                    <p className="text-[10px] text-amber-600">
                        {error || 'Detailed analysis not currently available for this client'}
                    </p>
                </div>
                {error && <DebugConsole title={`Yoga Error: ${yogaType}`} data={{ error, yogaType, ayanamsa }} />}
            </div>
        );
    }

    // ─── Yoga Not Present ──────────────────────────────────────────
    if (normalized.header && !normalized.header.isPresent) {
        return (
            <div className={cn('space-y-4 p-4', className)}>
                {/* Still render section renderer — it will show header (with "Inactive" badge),
            meta, description, planets, etc. even for absent yogas */}
                <YogaSectionRenderer data={normalized} />
                <DebugConsole title={`Yoga (Inactive): ${yogaType}`} data={rawData} />
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300', className)}>
            <YogaSectionRenderer data={normalized} />
            <DebugConsole title={`Yoga: ${yogaType}`} data={rawData} />
        </div>
    );
});
