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
export interface KpPlanetsCuspsResponse {
    success: boolean;
    data: {
        ascendant: {
            sign: string;
            signId: number;
            degree: number;
            nakshatra: string;
            nakshatraLord: string;
            subLord: string;
        };
        planets: KpPlanet[];
        cusps: KpCusp[];
    };
    cached: boolean;
    calculatedAt: string;
}

/**
 * Ruling Planet details
 */
export interface RulingPlanet {
    type: string;
    planet: string;
    sign?: string;
    nakshatra?: string;
}

/**
 * Response from /api/kp/ruling-planets
 */
export interface KpRulingPlanetsResponse {
    success: boolean;
    data: {
        dayLord: string;
        moonSignLord: string;
        moonStarLord: string;
        moonSubLord: string;
        lagnaSignLord: string;
        lagnaStarLord: string;
        lagnaSubLord: string;
        rulingPlanets: RulingPlanet[];
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
export interface KpBhavaDetailsResponse {
    success: boolean;
    data: {
        bhavas: KpBhava[];
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
    strong?: boolean;
    details?: string;
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
