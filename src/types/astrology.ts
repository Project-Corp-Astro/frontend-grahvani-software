/**
 * Astrology Type Definitions for Lahiri Reports
 */

export interface DoshaPlacement {
    house: number;
    sign: string;
    nakshatra: string;
    nakshatra_lord: string;
}

export interface CancellationFactor {
    factor: string;
    description: string;
    impact: string;
    strength: string;
    verified: boolean;
    orb?: number;
    aspect_type?: number;
}

export interface HouseEffect {
    severity: string;
    areas: string[];
    effects: string[];
    positive_potential: string[];
}

export interface Remedies {
    mantras: string[];
    donations: string[];
    gemstones: string[];
    spiritual_practices: string[];
    lifestyle: string[];
}

export interface AngarakDoshaAnalysis {
    has_angarak_dosha: boolean;
    conjunction_details?: {
        orb: number;
        conjunction_strength: string;
        mars_degree: number;
        rahu_degree: number;
    };
    placement?: DoshaPlacement;
    mars_state?: string;
    overall_severity: string;
    house_effects: HouseEffect;
    cancellation_factors: CancellationFactor[];
    cancellation_summary: {
        total_factors: number;
        has_strong_cancellation: boolean;
        has_complete_cancellation: boolean;
    };
    positive_manifestations: string[];
    remedies: Remedies;
    interpretation_notes: string[];
}

export interface SadeSatiAnalysis {
    active: boolean;
    phase: string;
    phase_number: number;
    description: string;
    affected_signs: string[];
    intensity: number;
    interpretation: {
        level: string;
        description: string;
    };
    recommendations: string[];
}

export interface YogaPlanetAnalysis {
    house: number;
    sign: string;
    degrees: string;
    retrograde: string;
    strength_factors: any;
    strength_summary: string;
}

export interface YogaAnalysis {
    yoga_present: boolean;
    yoga_type: string;
    yoga_strength: string;
    base_strength_score: number;
    malefic_penalty: number;
    final_strength_score: number;
    house_relationship: string;
    jupiter_analysis?: YogaPlanetAnalysis;
    moon_analysis?: YogaPlanetAnalysis;
    comprehensive_effects: {
        jupiter_house_effects: any;
        moon_house_effects: any;
        sign_combination_effects: string;
        strength_assessment: string;
        malefic_influences: string;
        overall_prediction: string;
        specific_effects: string[];
    };
    timing_analysis: {
        best_periods: string;
        activation_transits: string;
        peak_effects: string;
        remedial_timing: string;
    };
    remedial_suggestions: string[];
}

// Generic Yoga/Dosha Response Wrapper
export interface AstrologicalReport<T> {
    success: boolean;
    data: T;
    cached: boolean;
    calculatedAt: string;
}
