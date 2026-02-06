// =============================================================================
// KP (KRISHNAMURTI PADDHATI) TYPE DEFINITIONS
// For use with KP astrology system endpoints
// =============================================================================

/**
 * Sub-Lord details for KP system
 */
export interface KpSubLord {
    planet: string;
    degree?: number;
    sign?: string;
}

/**
 * KP Planet with complete sub-lord chain
 */
export interface KpPlanet {
    name: string;
    fullName?: string;
    sign: string;
    signId: number;
    degree: number;
    degreeFormatted?: string;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
    subSubLord?: string;
    isRetrograde?: boolean;
}

/**
 * KP Cusp (House Cusp) with sub-lord details
 */
export interface KpCusp {
    cusp: number;
    sign: string;
    signId: number;
    degree: number;
    degreeFormatted?: string;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
    subSubLord?: string;
}

/**
 * Response from /api/kp/planets-cusps
 */
/**
 * Raw KP Planet from API
 */
export interface KpPlanetRaw {
    house: number;
    longitude: string;
    nakshatra: string;
    sign: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord?: string; // Optional
    is_retro?: boolean;
}

/**
 * Raw KP Ruling Planet from API
 * Use number for longitude
 */
export interface KpRulingPlanetRaw {
    formatted_longitude: string;
    is_retrograde: boolean;
    longitude: number; // number!
    nakshatra: string;
    nakshatra_lord: string;
    nakshatra_pada: number;
    sign: string;
    sign_lord: string;
    sub_lord: string;
}

/**
 * Raw KP Cusp from API
 */
export interface KpCuspRaw {
    longitude: string;
    nakshatra: string;
    sign: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord?: string; // Optional
}

/**
 * Response from /api/kp/planets-cusps
 */
export interface KpPlanetsCuspsResponse {
    success: boolean;
    data: {
        ascendant: {
            longitude: string;
            sign: string;
        };
        house_cusps: Record<string, KpCuspRaw>;
        planets: Record<string, KpPlanetRaw>;
        significators?: Record<string, any>;
        metadata?: any;
        user_name?: string;
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * KP Ruling Planets Components
 */
export interface RulingPlanetsComponents {
    "1_day_lord": string;
    "2_lagna_sign_lord": string;
    "3_lagna_star_lord": string;
    "4_lagna_sub_lord": string;
    "5_moon_sign_lord": string;
    "6_moon_star_lord": string;
    "7_moon_sub_lord": string;
}

/**
 * Response from /api/kp/ruling-planets
 */
export interface KpRulingPlanetsResponse {
    success: boolean;
    data: {
        ruling_planets: {
            components: RulingPlanetsComponents;
            strength_order_explanation: Record<string, string>;
            unique_planets_by_strength: string[];
        };
        ayanamsa: {
            type: string;
            value: number;
        };
        lagna: {
            formatted_longitude: string;
            longitude: number;
            sign: string;
            sign_lord: string;
            nakshatra_lord: string;
            sub_lord: string;
        };
        moon: {
            formatted_longitude: string;
            longitude: number;
            is_retrograde?: boolean;
            sign: string;
            sign_lord: string;
            nakshatra_lord: string;
            sub_lord: string;
        };
        all_planets: Record<string, KpRulingPlanetRaw>;
        dayLord?: string;
        user_name?: string;
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * Bhava (House) detail
 */
export interface KpBhava {
    house: number;
    sign: string;
    signLord: string;
    starLord: string;
    subLord: string;
    significators: string[];
    planetsInHouse: string[];
}

/**
 * Response from /api/kp/bhava-details
 */

/**
 * Raw Bhava Detail from API (JSON structure)
 */
export interface KpBhavaRaw {
    NL: string;
    RL: string;
    SL: string;
    SS: string;
    longitude_decimal: number;
    longitude_dms: string;
    nakshatra: string;
    pada: number;
    sign: string;
}

/**
 * Response from /api/kp/bhava-details
 */
export interface KpBhavaDetailsResponse {
    success: boolean;
    data: {
        bhava_details: Record<string, KpBhavaRaw>;
        user_name?: string;
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * Planet signification
 */
export interface KpSignification {
    planet: string;
    houses: number[];
    levelA?: number[];
    levelB?: number[];
    levelC?: number[];
    levelD?: number[];
    strong?: boolean;
    details?: string;
}

/**
 * House signification view (House -> Levels)
 */
export interface KpHouseSignification {
    house: number;
    levelA: string[]; // Planets in nak of occupants
    levelB: string[]; // Occupants
    levelC: string[]; // Planets in nak of cusp sign lord
    levelD: string[]; // Cusp sign lord
}

/**
 * Response from /api/kp/significations
 */
export interface KpSignificationsResponse {
    success: boolean;
    data: {
        significations: KpSignification[];
        matrix?: Record<string, number[]>; // planet -> houses array
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * Request body for horary
 */
export interface KpHoraryRequest {
    horaryNumber: number; // 1-249
    question: string;
    birthDate: string;
    birthTime: string;
    latitude: number;
    longitude: number;
    timezoneOffset?: number;
}

/**
 * Response from /api/kp/horary
 */
export interface KpHoraryResponse {
    success: boolean;
    data: {
        horaryNumber: number;
        question: string;
        ascendant: {
            sign: string;
            degree: number;
            nakshatra: string;
            subLord: string;
        };
        planets: KpPlanet[];
        cusps: KpCusp[];
        significators: {
            house: number;
            signLord: string;
            starLord: string;
            subLord: string;
            significatorPlanets: string[];
        }[];
        verdict?: {
            favorable: boolean;
            reason: string;
        };
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * KP Promise (Interlink) Structure
 */
export interface KpPromise {
    houseNumber: number;
    topic: string;
    chain: {
        signLord: { planet: string; isRetro?: boolean };
        starLord: { planet: string; isRetro?: boolean };
        subLord: { planet: string; isRetro?: boolean };
        subSubLord: { planet: string; isRetro?: boolean };
    };
    positiveHouses: number[];
    negativeHouses: number[];
    strength: string;
    verdict: string;
}

/**
 * Fortuna Calculation Data
 */
export interface KpFortunaResponse {
    fortunaData: {
        calculation: {
            component: string;
            dms: string;
            longitude: number;
            sign: string;
            house: number;
        }[];
        fortunaHouse: {
            sign: string;
            houseNumber: number;
            cuspLongitude: string;
        };
    };
}

/**
 * Nakshatra Nadi Data
 */
export interface KpNakshatraNadiResponse {
    nadiData: {
        planets: {
            name: string;
            isRetro: boolean;
            longitude: string;
            sign: string;
            nakshatraLord: string;
            nakshatraName: string;
            subLord: string;
        }[];
        cusps: {
            label: string;
            longitude: string;
            sign: string;
            nakshatraLord: string;
            nakshatraName: string;
            subLord: string;
        }[];
    };
}

