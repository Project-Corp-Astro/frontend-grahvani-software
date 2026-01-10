"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
}

const VedicClientContext = createContext<VedicClientContextType | undefined>(undefined);

export function VedicClientProvider({ children }: { children: ReactNode }) {
    const [clientDetails, setClientDetails] = useState<VedicClientDetails | null>(null);

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

    const updateClientDetails = (details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
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
