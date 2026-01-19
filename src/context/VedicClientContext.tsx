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
}

const VedicClientContext = createContext<VedicClientContextType | undefined>(undefined);

export function VedicClientProvider({ children }: { children: ReactNode }) {
    const [clientDetails, setClientDetails] = useState<VedicClientDetails | null>(null);
    const [isGeneratingCharts, setIsGeneratingCharts] = useState(false);

    // Optional: Persist to sessionStorage so reload doesn't wipe it immediately
    useEffect(() => {
        const stored = sessionStorage.getItem("vedic_client_temp");
        if (stored) {
            try {
                setClientDetails(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored client details", e);
            }
        }
    }, []);

    // Auto-generate all charts when client is selected
    const generateAllChartsForClient = async (clientId: string) => {
        try {
            setIsGeneratingCharts(true);

            // First check if charts exist
            const existingCharts = await clientApi.getCharts(clientId);

            // If less than 20 charts (exhaustive profile has many more), trigger full generation
            // This ensures Dasha, Ashtakavarga, and all Vargas are available
            if (!existingCharts || existingCharts.length < 20) {
                console.log('Automated technical audit: Missing charts detected. Initializing exhaustive Vedic profile generation for:', clientId);
                await clientApi.generateFullVedicProfile(clientId);
            }
        } catch (err) {
            console.error('Exhaustive auto-generation failed:', err);
        } finally {
            setIsGeneratingCharts(false);
        }
    };

    const updateClientDetails = (details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
            // Trigger auto-generation for the client
            if (details.id) {
                generateAllChartsForClient(details.id);
            }
        } else {
            sessionStorage.removeItem("vedic_client_temp");
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
