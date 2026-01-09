"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Ayanamsa = "Lahiri" | "Raman" | "KP" | "Tropical";
export type ChartStyle = "North Indian" | "South Indian";

interface AstrologerSettings {
    ayanamsa: Ayanamsa;
    chartStyle: ChartStyle;
    recentClientIds: string[];
}

interface SettingsContextType {
    settings: AstrologerSettings;
    updateAyanamsa: (val: Ayanamsa) => void;
    updateChartStyle: (val: ChartStyle) => void;
    addRecentClient: (id: string) => void;
    updateSettings: (newSettings: Partial<AstrologerSettings>) => void;
}

const DEFAULT_SETTINGS: AstrologerSettings = {
    ayanamsa: "Lahiri",
    chartStyle: "North Indian",
    recentClientIds: [],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function AstrologerSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AstrologerSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const stored = localStorage.getItem("grahvani_astrologer_settings");
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse astrologer settings", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<AstrologerSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem("grahvani_astrologer_settings", JSON.stringify(updated));
            return updated;
        });
    };

    const updateAyanamsa = (val: Ayanamsa) => updateSettings({ ayanamsa: val });
    const updateChartStyle = (val: ChartStyle) => updateSettings({ chartStyle: val });

    const addRecentClient = (id: string) => {
        setSettings(prev => {
            const filtered = prev.recentClientIds.filter(cid => cid !== id);
            const updatedIds = [id, ...filtered].slice(0, 5);
            const updated = { ...prev, recentClientIds: updatedIds };
            localStorage.setItem("grahvani_astrologer_settings", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateAyanamsa, updateChartStyle, addRecentClient, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useAstrologerSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useAstrologerSettings must be used within an AstrologerSettingsProvider");
    }
    return context;
}
