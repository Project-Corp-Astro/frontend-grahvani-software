"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clientApi } from "@/lib/api";

export interface VedicClientDetails {
    id?: string;
    name: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string; // YYYY-MM-DD
    timeOfBirth: string; // HH:mm
    placeOfBirth: {
        city: string;
        latitude?: number;
        longitude?: number;
    };
    rashi?: string;
    fatherName?: string;
    motherName?: string;
    occupation?: string;
    notes?: string;
}

interface VedicClientContextType {
    clientDetails: VedicClientDetails | null;
    setClientDetails: (details: VedicClientDetails | null) => void;
    clearClientDetails: () => void;
    isClientSet: boolean;
    isGeneratingCharts: boolean;
    processedCharts: Record<string, any>; // Lookups by "ChartType_System"
    isLoadingCharts: boolean; // True only if NO charts exist yet
    isRefreshingCharts: boolean; // True whenever a fetch is in progress
    refreshCharts: () => Promise<void>;
}

const VedicClientContext = createContext<VedicClientContextType | undefined>(undefined);

export function VedicClientProvider({ children }: { children: ReactNode }) {
    const [clientDetails, setClientDetails] = useState<VedicClientDetails | null>(null);
    const [isGeneratingCharts, setIsGeneratingCharts] = useState(false);
    const [processedCharts, setProcessedCharts] = useState<Record<string, any>>({});
    const [isLoadingCharts, setIsLoadingCharts] = useState(false);
    const [isRefreshingCharts, setIsRefreshingCharts] = useState(false);

    // Optional: Persist to sessionStorage so reload doesn't wipe it immediately
    useEffect(() => {
        const stored = sessionStorage.getItem("vedic_client_temp");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setClientDetails(parsed);
                // Initial fetch for the stored client
                if (parsed.id) {
                    fetchChartsInternal(parsed.id);
                }
            } catch (e) {
                console.error("Failed to parse stored client details", e);
            }
        }
    }, []);

    const fetchChartsInternal = async (clientId: string) => {
        try {
            const hasData = Object.keys(processedCharts).length > 0;
            if (!hasData) setIsLoadingCharts(true);
            setIsRefreshingCharts(true);

            const rawCharts = await clientApi.getCharts(clientId);

            if (!rawCharts || !Array.isArray(rawCharts)) {
                setProcessedCharts({});
                return [];
            }

            // Pre-process all charts into a specialized lookup map
            // Format: { "D1_lahiri": { planets, ascendant }, "D9_kp": ... }
            const lookup: Record<string, any> = {};
            rawCharts.forEach((c: any) => {
                const system = (c.chartConfig?.system || 'lahiri').toLowerCase();
                const key = `${c.chartType}_${system}`;
                lookup[key] = c; // Store full chart object for now, or just chartData
            });

            setProcessedCharts(lookup);
            return rawCharts;
        } catch (err) {
            console.error('Failed to fetch charts:', err);
            return null;
        } finally {
            setIsLoadingCharts(false);
            setIsRefreshingCharts(false);
        }
    };

    const refreshCharts = async () => {
        if (clientDetails?.id) {
            await fetchChartsInternal(clientDetails.id);
        }
    };

    // Auto-generate all charts when client is selected
    const generateAllChartsForClient = async (clientId: string) => {
        try {
            setIsGeneratingCharts(true);

            // First fetch/check
            const existingCharts = await fetchChartsInternal(clientId);

            // If less than 20 charts (exhaustive profile has many more), trigger full generation
            // This ensures Dasha, Ashtakavarga, and all Vargas are available
            if (!existingCharts || existingCharts.length < 20) {
                console.log('Automated technical audit: Missing charts detected. Initializing exhaustive Vedic profile generation for:', clientId);
                await clientApi.generateFullVedicProfile(clientId);
                // Re-fetch immediately after generation finishes to populate the UI
                await fetchChartsInternal(clientId);
            }
        } catch (err) {
            console.error('Exhaustive auto-generation failed:', err);
        } finally {
            setIsGeneratingCharts(false);
        }
    };

    // Refresh charts whenever isGeneratingCharts transitions from true to false
    useEffect(() => {
        if (!isGeneratingCharts && clientDetails?.id) {
            refreshCharts();
        }
    }, [isGeneratingCharts]);

    const updateClientDetails = (details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
            // Reset charts state for new client
            setProcessedCharts({});
            // Trigger auto-generation for the client
            if (details.id) {
                generateAllChartsForClient(details.id);
            }
        } else {
            sessionStorage.removeItem("vedic_client_temp");
            setProcessedCharts({});
        }
    };

    const clearClientDetails = () => updateClientDetails(null);

    return (
        <VedicClientContext.Provider
            value={{
                clientDetails,
                setClientDetails: updateClientDetails,
                clearClientDetails,
                isClientSet: !!clientDetails,
                isGeneratingCharts,
                processedCharts,
                isLoadingCharts,
                isRefreshingCharts,
                refreshCharts
            }}
        >
            {children}
        </VedicClientContext.Provider>
    );
}

export function useVedicClient() {
    const context = useContext(VedicClientContext);
    if (context === undefined) {
        throw new Error("useVedicClient must be used within a VedicClientProvider");
    }
    return context;
}
