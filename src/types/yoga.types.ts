/**
 * Yoga Modal Rendering System — Type Definitions
 *
 * Flexible type system designed to handle ANY yoga JSON structure
 * from the backend. Uses optional fields + index signature for
 * forward-compatibility with new yoga types.
 *
 * Covers 6 known shapes:
 *  1. gaja_kesari  (comprehensive_*_analysis)
 *  2. guru_mangal full  (*_yoga_comprehensive)
 *  3. guru_mangal slim  (*_yoga_analysis)
 *  4. budha-aditya  (*_yoga_analysis + conditions + mathematical)
 *  5. chandra-mangal  (traditional_permutation_combination_analysis)
 *  6. raj-yoga  (raj_yogas with multi-yoga array)
 */

// ─── Primitives ────────────────────────────────────────────────────

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

export interface BirthDetails {
    birth_date?: string;
    birth_time?: string;
    latitude?: number;
    longitude?: number;
    timezone_offset?: number;
    ascendant?: AscendantInfo;
    location?: {
        latitude?: number;
        longitude?: number;
        timezone_offset?: number;
    } | string;
    birth_location?: {
        latitude?: number;
        longitude?: number;
        timezone_offset?: number;
    };
}

export interface HouseSign {
    sign: string;
    start_longitude?: string;
}

export interface CalculationNotes {
    analysis_type?: string;
    ayanamsa?: string;
    ayanamsa_value?: string | number;
    chart_type?: string;
    critical_fixes?: string[];
    house_system?: string;
    combustion_limit?: string;
    mathematical_precision?: string;
    analysis_methodology?: string;
    classical_rules_applied?: string[];
    combinations_analyzed?: string;
    comprehensive_scope?: string;
    sidereal_zodiac?: boolean;
    connection_types?: string;
    implementation?: string;
    validations?: string;
    yoga_analysis?: string;
    yoga_rules?: string;
    coordinate_system?: string;
    calculation_time_ut?: string;
    julian_day?: number;
    [key: string]: unknown;
}

// ─── Yoga-Specific Structures ──────────────────────────────────────

export interface FunctionalStatus {
    combined?: string;
    [planet: string]: string | undefined;
}

export interface YogaCombination {
    type?: string;
    present?: boolean;
    effects?: string[];
    house?: number;
    sign?: string;
    house_category?: string;
    house_strength?: string;
    orb_degrees?: number;
    orb_strength?: string;
    overall_strength?: string;
    strength_score?: number;
    nakshatra_number?: number;
    [key: string]: unknown;
}

export interface YogaAnalysisCore {
    yoga_present?: boolean;
    overall_yoga_present?: boolean;
    reason?: string;
    explanation?: string;
    detailed_analysis?: string;
    total_strength_score?: number;
    functional_status?: FunctionalStatus;
    special_features?: string[];
    strongest_combination?: YogaCombination;
    yoga_combinations?: YogaCombination[];
    // budha-aditya fields
    yoga_strength?: string;
    overall_rating?: number;
    conditions_met?: string[];
    conditions_failed?: string[];
    combination_analysis?: Record<string, unknown>;
    mathematical_analysis?: Record<string, unknown>;
    permutation_analysis?: Record<string, unknown>;
    // chandra-mangal: yoga_present nested here
    yoga_formation_analysis?: {
        yoga_present?: boolean;
        formation_rule?: string;
        separation_analysis?: string;
        alternative_combinations?: string[];
        house_relationship?: Record<string, unknown>;
        [key: string]: unknown;
    };
    // chandra-mangal: permutation data
    complete_permutation_analysis?: Record<string, unknown>;
    individual_analysis?: Record<string, unknown>;
    [key: string]: unknown;
}

// ─── Raj Yoga Structures ───────────────────────────────────────────

export interface RajYogaEntry {
    type: string;
    subtype?: string;
    description: string;
    formation?: string;
    planets: string[];
    houses: number[];
    strength: number;
    priority: string;
    cancellations: string[];
}

export interface RajYogasData {
    totalCount: number;
    averageStrength: number;
    priorityDistribution?: Record<string, number>;
    typeDistribution?: Record<string, number>;
    yogas: RajYogaEntry[];
}

// ─── Raw Backend Response (any shape) ──────────────────────────────

/**
 * Represents the raw JSON from the backend for ANY yoga type.
 * Every field is optional. The `[key: string]: unknown` escape hatch
 * ensures we never break on new/unexpected keys.
 */
export interface RawYogaResponse {
    user_name?: string;

    // Ascendant — 3 possible shapes from backend
    ascendant?: AscendantInfo;
    ascendant_sign?: string;

    // Birth details
    birth_details?: BirthDetails;

    // Planetary positions — 2 possible keys
    all_planetary_positions?: Record<string, PlanetPosition>;
    planetary_positions?: Record<string, PlanetPosition>;

    // House signs map (12 houses)
    house_signs?: Record<string, HouseSign>;

    // House lords map (raj-yoga)
    house_lords?: Record<string, string>;

    // Calculation details / notes — 8 possible sources
    calculation_notes?: CalculationNotes;
    notes?: CalculationNotes;
    calculation_details?: CalculationNotes;
    technical_details?: CalculationNotes;
    technical_notes?: CalculationNotes & {
        fixes_applied?: string[];
        calculation_precision?: string;
        house_calculation_method?: string;
    };
    calculation_info?: CalculationNotes & {
        comprehensive_coverage?: string[];
        precision?: string;
        ephemeris?: string;
        coordinate_system?: string;
        yoga_count?: number;
    };
    chart_details?: {
        ascendant?: AscendantInfo;
        ayanamsa?: string;
        ayanamsa_value?: string | number;
        house_system?: string;
        [key: string]: unknown;
    };
    chart_info?: {
        ascendant_sign?: string;
        ascendant_degree?: string;
        ayanamsa?: string;
        ayanamsa_value?: string | number;
        house_system?: string;
        lagna_lord?: string;
        lagna_lord_strength?: string;
        [key: string]: unknown;
    };
    chart_foundations?: {
        ascendant?: AscendantInfo & { lord?: string };
        planetary_positions?: Record<string, PlanetPosition>;
        house_signs?: Record<string, HouseSign & { lord?: string }>;
        [key: string]: unknown;
    };

    // Classical analysis (dhan-yoga)
    classical_analysis?: {
        key_strengths?: string[];
        cautions?: string[];
        recommendations?: string[];
        remedial_suggestions?: string[];
        timing_notes?: string;
        [key: string]: unknown;
    };

    // Classical notes (yoga-analysis)
    classical_notes?: Record<string, string>;

    // Top-level summary (composite yoga-analysis)
    summary?: Record<string, unknown>;

    // Validation report
    yoga_validation_report?: Record<string, unknown>;
    active_yogas_summary?: unknown[];

    // Remedial measures — flat array OR categorized object
    remedial_measures?: Record<string, string[]>;

    // Spiritual recommendations (spiritual-prosperity)
    spiritual_recommendations?: string[];

    // Shubh yoga analysis
    shubh_yoga_analysis?: YogaAnalysisCore & {
        overall_category?: string;
        overall_strength?: number;
        yogas_by_category?: Record<string, unknown[]>;
    };

    // Kalpadruma yoga
    kalpadruma_yoga?: YogaAnalysisCore & {
        dispositor_chain?: Record<string, string>;
        navamsa_calculation?: Record<string, unknown>;
        yoga_analysis?: Array<{
            planet: string;
            role: string;
            sign: string;
            house: number;
            in_exaltation: boolean;
            in_kendra: boolean;
            in_trikona: boolean;
            condition_met: boolean;
        }>;
    };

    // Kala Sarpa analysis
    kala_sarpa_analysis?: YogaAnalysisCore & {
        final_assessment?: Record<string, unknown>;
        cancellation_analysis?: Record<string, unknown>;
        rule_by_rule_analysis?: Record<string, {
            description?: string;
            yoga_present?: boolean;
            [key: string]: unknown;
        }>;
        individual_planet_analysis?: Record<string, unknown>;
        structural_analysis?: Record<string, unknown>;
        opposition_verification?: Record<string, unknown>;
    };

    // Interpretation guide
    interpretation_guide?: Record<string, Record<string, string>>;

    // Mathematical framework (budha-aditya)
    mathematical_framework?: Record<string, unknown>;

    // Individual planet details (slim response shape)
    jupiter_details?: PlanetPosition;
    mars_details?: PlanetPosition;
    moon_details?: PlanetPosition;
    sun_details?: PlanetPosition;
    mercury_details?: PlanetPosition;
    venus_details?: PlanetPosition;
    saturn_details?: PlanetPosition;
    rahu_details?: PlanetPosition;
    ketu_details?: PlanetPosition;

    // Catch-all: yoga analysis lives under dynamic keys like
    // "comprehensive_gaja_kesari_analysis", "raj_yogas", etc.
    [key: string]: unknown;
}

// ─── Normalized Shape (consumed by all section components) ─────────

export interface NormalizedHeader {
    title: string;
    subtitle?: string;
    isPresent: boolean;
    strength?: string;
    strengthScore?: number;
    overallRating?: number;
    totalCount?: number;
}

export interface NormalizedMeta {
    userName?: string;
    birthDate?: string;
    birthTime?: string;
    ascendantSign?: string;
    ascendantDegrees?: string;
    latitude?: number;
    longitude?: number;
    ayanamsa?: string;
    ayanamsaValue?: string;
    houseSystem?: string;
    chartType?: string;
    analysisType?: string;
}

export interface NormalizedDescription {
    text: string;
    explanation?: string;
}

export interface NormalizedEffects {
    specific: string[];
    overall?: string;
}

export interface NormalizedStrength {
    base?: number;
    penalty?: number;
    final: number;
    label?: string;
    overallRating?: number;
    functionalStatus?: FunctionalStatus;
    specialFeatures?: string[];
}

export interface NormalizedCombination {
    type: string;
    present: boolean;
    effects: string[];
    house?: number;
    sign?: string;
    houseCategory?: string;
    houseStrength?: string;
    orbDegrees?: number;
    orbStrength?: string;
    overallStrength?: string;
    strengthScore?: number;
    nakshatraNumber?: number;
}

export interface NormalizedTiming {
    bestPeriods?: string;
    activationTransits?: string;
    peakEffects?: string;
    remedialTiming?: string;
}

export interface NormalizedTechnical {
    criticalFixes?: string[];
    ayanamsa?: string;
    ayanamsaValue?: string;
    houseSystem?: string;
    calculationMethod?: string;
    analysisType?: string;
    chartType?: string;
    classicalRules?: string[];
    methodology?: string;
    yogaRules?: string;
    coordinateSystem?: string;
}

export interface NormalizedHouse {
    houseNumber: number;
    sign: string;
    startLongitude?: string;
    lord?: string;
}

export interface CancellationFactor {
    factor: string;
    description: string;
    impact?: string;
    strength?: string;
    verified?: boolean;
}

export interface NormalizedDoshaSeverity {
    level: string;
    description?: string;
}

export interface NormalizedConditions {
    met: string[];
    failed: string[];
}

export interface NormalizedRemedyCategory {
    category: string;
    items: string[];
}

/**
 * The single, consistent shape consumed by all section components.
 * null means "this section has no data — don't render it."
 */
export interface NormalizedYogaData {
    header: NormalizedHeader | null;
    meta: NormalizedMeta | null;
    description: NormalizedDescription | null;
    effects: NormalizedEffects | null;
    strength: NormalizedStrength | null;
    combinations: NormalizedCombination[] | null;
    conditions: NormalizedConditions | null;
    rajYogas: RajYogasData | null;
    planets: Record<string, PlanetPosition> | null;
    houses: NormalizedHouse[] | null;
    timing: NormalizedTiming | null;
    remedies: (string[] | NormalizedRemedyCategory[]) | null;
    cancellation: CancellationFactor[] | null;
    doshaSeverity: NormalizedDoshaSeverity | null;
    technical: NormalizedTechnical | null;
    raw: Record<string, unknown>;
}

// ─── Section Registry Types ────────────────────────────────────────

export type SectionKey = keyof Omit<NormalizedYogaData, 'raw'>;

export interface SectionRegistryEntry {
    key: SectionKey;
    component: React.ComponentType<{ data: NonNullable<NormalizedYogaData[SectionKey]> }>;
    priority: number;
}
