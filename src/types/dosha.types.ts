// =============================================================================
// PRIMITIVES & SHARED
// =============================================================================

export interface PlanetPosition {
    degrees?: string;
    degree_in_sign?: number | string;
    degrees_in_sign?: string;
    formatted_degree?: string;
    house: number;
    sign: string;
    sign_index?: number;
    navamsa_sign?: string;
    retrograde?: string;
    longitude?: number | string;
    dignity?: string;
    strength_score?: number;
    strength_percentage?: number;
    strength_category?: string;
    combustion_status?: { is_combust: boolean; distance_from_sun: number } | boolean;
    house_significance?: string;
    is_strong?: boolean;
    lordships?: number[];
    [key: string]: unknown;
}

export interface AscendantInfo {
    degrees?: string;
    formatted_degree?: string;
    degree_in_sign?: number | string;
    sign: string;
    sign_index?: number;
    longitude?: number | string;
}

export interface NormalizedDoshaSeverity {
    level: string;
    description?: string;
}

// =============================================================================
// RAW BACKEND DOSHA SHAPES
// =============================================================================

export interface RawDoshaResponse {
    success: boolean;
    data: {
        user_name?: string;
        birth_details?: {
            birth_date: string;
            birth_time: string;
            ascendant: AscendantInfo;
            birth_location?: string;
            latitude?: number;
            longitude?: number;
        };
        all_planetary_positions?: Record<string, PlanetPosition>;
        calculation_notes?: {
            analysis_type?: string;
            ayanamsa_value?: string;
            house_system?: string;
            critical_fixes?: string[];
            calculation_info?: string;
        };

        // Angarak Specific
        has_angarak_dosha?: boolean;
        angarak_dosha_analysis?: {
            is_present: boolean;
            conjunction_details: string;
            severity: string;
            impact_summary: string;
            specific_effects: Record<string, string>;
            lifestyle_remedies: string[];
            spiritual_remedies: string[];
        };

        // Sade Sati Specific
        is_sade_sati_active?: boolean;
        sade_sati_analysis?: {
            is_active: boolean;
            current_phase: string;
            phase_description: string;
            intensity: string;
            recommendations: string[];
            transit_details: string;
        };

        // Generic Analysis (Pitra, Guru Chandal, Shrapit)
        is_present?: boolean;
        severity?: string;
        analysis_summary?: string;
        key_indicators?: string[];
        remedial_suggestions?: string[] | { mantras?: string[]; rituals?: string[]; lifestyle?: string[] };

        [key: string]: unknown;
    };
}

// =============================================================================
// NORMALIZED DOSHA DATA
// =============================================================================

export interface NormalizedDoshaHeader {
    title: string;
    subtitle?: string;
    isPresent: boolean;
    strengthBadge: string;
}

export interface NormalizedDoshaMeta {
    userName: string;
    location: string;
    date: string;
    time: string;
    ascendantSign: string;
    ascendantDegree: string;
}

export interface NormalizedDoshaImpact {
    title: string;
    content: string;
    type: 'impact' | 'analysis';
}

export interface NormalizedDoshaRemedy {
    text: string;
    type: 'mantra' | 'ritual' | 'lifestyle' | 'general';
}

export interface NormalizedDoshaPlanet {
    name: string;
    sign: string;
    house: number;
    degree: string;
    isFocal: boolean;
}

export interface NormalizedDoshaTechnical {
    ayanamsa: string;
    houseSystem: string;
    coordinateSystem: string;
    precision: string;
    fixes: string[];
}

export interface NormalizedDoshaData {
    header: NormalizedDoshaHeader;
    meta: NormalizedDoshaMeta | null;
    severity: NormalizedDoshaSeverity | null;
    impacts: NormalizedDoshaImpact[];
    remedies: NormalizedDoshaRemedy[];
    planets: NormalizedDoshaPlanet[];
    technical: NormalizedDoshaTechnical | null;
    progress?: {
        label: string;
        percentage: number; // 0-100
        description: string;
    } | null;
}
