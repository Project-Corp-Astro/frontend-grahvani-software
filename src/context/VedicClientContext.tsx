"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clientApi } from "@/lib/api";
import { useClientCharts } from "@/hooks/queries/useClientCharts";
import { useGenerateProfile } from "@/hooks/mutations/useGenerateProfile";

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
    const {
        data: processedCharts = {},
        isLoading: isQueryLoading,
        isRefetching: isRefreshingCharts,
        refetch: refreshCharts
    } = useClientCharts(clientDetails?.id);

    const generateMutation = useGenerateProfile();
    const isGeneratingCharts = generateMutation.isPending;

    // isLoadingCharts should be true only if we have no data AND we are loading/fetching
    // This mimics the original behavior where isLoadingCharts was true only on initial empty fetch
    const isLoadingCharts = isQueryLoading && Object.keys(processedCharts).length === 0;

    // Optional: Persist to sessionStorage so reload doesn't wipe it immediately
    useEffect(() => {
        const stored = sessionStorage.getItem("vedic_client_temp");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setClientDetails(parsed);
                // Schema check or revalidation could happen here
            } catch (e) {
                console.error("Failed to parse stored client details", e);
            }
        }
    }, []);

    const updateClientDetails = (details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
            // Trigger auto-check for full profile generation
            if (details.id) {
                checkAndGenerateProfile(details.id);
            }
        } else {
            sessionStorage.removeItem("vedic_client_temp");
        }
    };

    const checkAndGenerateProfile = async (clientId: string) => {
        // We rely on useGenerateProfile mutation if explicit generation is requested.
        // Auto-generation logic is currently paused to rely on efficient Query caching.
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
                processedCharts, // Now comes from useQuery
                isLoadingCharts,
                isRefreshingCharts,
                refreshCharts: async () => { await refreshCharts(); }
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
