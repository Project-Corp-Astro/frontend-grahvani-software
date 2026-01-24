/**
 * Raman System Type Definitions
 * Matches backend `services/astro-engine/src/types/responses.types.ts`
 */

export interface RamanPlanetPosition {
    sign: string;
    degrees: string; // e.g., "10.5" or "10°30'" depending on backend
    retrograde: boolean;
    house: number; // 1-12
    nakshatra: string;
    pada: number;
}

export interface RamanAscendant {
    sign: string;
    degrees: string;
    nakshatra: string;
    pada: number;
}

export interface RamanChartNotes {
    ayanamsa: string;
    ayanamsa_value: string;
    chart_type: string;
    house_system: string;
}

export interface RamanNatalResponse {
    user_name: string;
    birth_details: {
        birth_date: string;
        birth_time: string;
        latitude: number;
        longitude: number;
        timezone_offset: number;
    };
    planetary_positions: Record<string, RamanPlanetPosition>;
    ascendant: RamanAscendant;
    notes: RamanChartNotes;
}

// Wrapper for standard response
export interface RamanApiResponse<T> {
    success: boolean;
    data: T;
    cached: boolean;
    calculatedAt: string;
    error?: string;
    system: 'raman';
}
