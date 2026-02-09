import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Ayanamsa = "Lahiri" | "Raman" | "KP" | "Tropical" | "Yukteswar";
export type ChartStyle = "North Indian" | "South Indian";
export type ChartColorTheme = "classic" | "modern" | "royal" | "earth" | "ocean";

interface AstrologerSettings {
    ayanamsa: Ayanamsa;
    chartStyle: ChartStyle;
    chartColorTheme: ChartColorTheme;
    recentClientIds: string[];
}

interface AstrologerStore extends AstrologerSettings {
    setAyanamsa: (val: Ayanamsa) => void;
    setChartStyle: (val: ChartStyle) => void;
    setChartColorTheme: (val: ChartColorTheme) => void;
    addRecentClient: (id: string) => void;
    updateSettings: (newSettings: Partial<AstrologerSettings>) => void;
}

const DEFAULT_SETTINGS: AstrologerSettings = {
    ayanamsa: "Lahiri",
    chartStyle: "North Indian",
    chartColorTheme: "classic",
    recentClientIds: [],
};

export const useAstrologerStore = create<AstrologerStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setAyanamsa: (val) => set({ ayanamsa: val }),

            setChartStyle: (val) => set({ chartStyle: val }),

            setChartColorTheme: (val) => set({ chartColorTheme: val }),

            addRecentClient: (id) => set((state) => {
                const filtered = state.recentClientIds.filter(cid => cid !== id);
                const updatedIds = [id, ...filtered].slice(0, 5);
                return { recentClientIds: updatedIds };
            }),

            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings
            })),
        }),
        {
            name: 'grahvani_astrologer_settings_store', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
