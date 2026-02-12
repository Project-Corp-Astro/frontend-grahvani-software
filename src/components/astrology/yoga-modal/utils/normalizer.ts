/**
 * Yoga Data Normalizer
 *
 * Pure function that transforms ANY backend yoga JSON
 * into the consistent NormalizedYogaData shape.
 *
 * Handles 6 known shapes:
 *  1. gaja_kesari  → comprehensive_*_analysis
 *  2. guru_mangal full → *_yoga_comprehensive
 *  3. guru_mangal slim → *_yoga_analysis
 *  4. budha-aditya → *_yoga_analysis + conditions + mathematical
 *  5. chandra-mangal → traditional_permutation_combination_analysis
 *  6. raj-yoga → raj_yogas with multi-yoga array
 *
 * Also handles:
 *  - Double-nested data.data unwrapping
 *  - Varying planet formats (all_planetary_positions, planetary_positions, *_details)
 *  - Varying ascendant formats (object, string, inside birth_details)
 *  - Varying notes keys (calculation_notes, notes)
 *  - house_lords map
 */

import type {
    RawYogaResponse,
    NormalizedYogaData,
    NormalizedHeader,
    NormalizedMeta,
    NormalizedDescription,
    NormalizedEffects,
    NormalizedStrength,
    NormalizedCombination,
    NormalizedConditions,
    NormalizedRemedyCategory,
    NormalizedTiming,
    NormalizedTechnical,
    NormalizedHouse,
    NormalizedDoshaSeverity,
    PlanetPosition,
    AscendantInfo,
    YogaAnalysisCore,
    CancellationFactor,
    RajYogasData,
    RajYogaEntry,
} from '@/types/yoga.types';

// ─── Key Detection Helpers ─────────────────────────────────────────

/** Patterns that match known yoga analysis keys */
const YOGA_ANALYSIS_PATTERNS = [
    /^comprehensive_.*_analysis$/,
    /^.*_yoga_comprehensive$/,
    /^.*_yoga_analysis$/,
    /^traditional_.*_analysis$/,
    /^yoga_analysis$/,
    /^special_yogas$/,
    /^spiritual_prosperity_analysis$/,
    /^shubh_.*_analysis$/,
    /^kalpadruma_yoga$/,
    /^kala_sarpa_analysis$/,
    /^.*_yogas$/,
];

/** Pattern for raj_yogas key */
const RAJ_YOGAS_KEY = 'raj_yogas';

const PLANET_DETAIL_PATTERN = /^(.+)_details$/;

const KNOWN_TOP_LEVEL_KEYS = new Set([
    'user_name',
    'ascendant',
    'ascendant_sign',
    'birth_details',
    'all_planetary_positions',
    'planetary_positions',
    'house_signs',
    'house_lords',
    'calculation_notes',
    'calculation_details',
    'chart_details',
    'notes',
    'mathematical_framework',
    'remedial_measures',
    'classical_analysis',
    'classical_notes',
    'technical_analysis',
    'wealth_houses_analysis',
    'lordship_analysis',
    'yoga_summary',
    'active_yogas_summary',
    'summary',
    'chart_info',
    'chart_foundations',
    'technical_details',
    'yoga_validation_report',
    'special_yogas',
    'spiritual_prosperity_analysis',
    'shubh_yoga_analysis',
    'kalpadruma_yoga',
    'kala_sarpa_analysis',
    'calculation_info',
    'technical_notes',
    'interpretation_guide',
    'data', // double-wrapped
]);

/**
 * Find the yoga analysis object inside the raw response.
 * Searches known regex patterns, then falls back to raj_yogas,
 * then falls back to any unknown object containing yoga_present.
 */
function extractYogaAnalysis(data: Record<string, unknown>): YogaAnalysisCore | null {
    // 1. Match known regex patterns
    for (const key of Object.keys(data)) {
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) {
            const value = data[key];
            if (value && typeof value === 'object') {
                return value as YogaAnalysisCore;
            }
        }
    }

    // 2. Fallback — scan for any object that looks like a yoga analysis
    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        if (key === RAJ_YOGAS_KEY) continue;
        const value = data[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;
            if (
                'yoga_present' in obj ||
                'overall_yoga_present' in obj ||
                'yoga_formation_analysis' in obj ||
                'total_yogas_found' in obj ||
                'total_count' in obj ||
                'detected_yogas' in obj ||
                'yogas_found' in obj ||
                'yoga_summary' in obj
            ) {
                return obj as YogaAnalysisCore;
            }
        }
    }

    return null;
}

/**
 * Find the yoga analysis KEY name from the raw response.
 */
function findYogaAnalysisKey(data: Record<string, unknown>): string | null {
    for (const key of Object.keys(data)) {
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) {
            return key;
        }
    }
    // Fallback check
    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        if (key === RAJ_YOGAS_KEY) return key;
        const value = data[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;
            if (
                'yoga_present' in obj ||
                'overall_yoga_present' in obj ||
                'yoga_formation_analysis' in obj ||
                'total_yogas_found' in obj ||
                'total_count' in obj ||
                'detected_yogas' in obj ||
                'yogas_found' in obj ||
                'yoga_summary' in obj
            ) {
                return key;
            }
        }
    }
    return null;
}

/**
 * Extract yoga type name from the dynamic analysis key.
 * e.g. "comprehensive_gaja_kesari_analysis" → "Gaja Kesari"
 *      "guru_mangal_yoga_comprehensive"     → "Guru Mangal"
 *      "raj_yogas"                          → "Raj"
 *      "traditional_permutation_combination_analysis" → "Chandra Mangal" (fallback)
 */
function extractYogaTypeName(data: Record<string, unknown>): string {
    const key = findYogaAnalysisKey(data);
    if (!key) return 'Yoga Analysis';

    return key
        .replace(/^comprehensive_/, '')
        .replace(/_analysis$/, '')
        .replace(/_yoga_comprehensive$/, '')
        .replace(/_yoga_analysis$/, '')
        .replace(/^traditional_/, '')
        .replace(/_permutation_combination$/, '')
        .replace(/_yogas$/, '')
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * Extract planet positions from individual *_details keys.
 */
function extractPlanetDetails(data: Record<string, unknown>): Record<string, PlanetPosition> | null {
    const planets: Record<string, PlanetPosition> = {};
    let found = false;

    for (const key of Object.keys(data)) {
        const match = key.match(PLANET_DETAIL_PATTERN);
        if (match) {
            const value = data[key];
            if (value && typeof value === 'object' && 'sign' in (value as object)) {
                const planetName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                planets[planetName] = value as PlanetPosition;
                found = true;
            }
        }
    }

    return found ? planets : null;
}

/**
 * Collect unknown keys into the raw passthrough bucket.
 */
function collectUnknownKeys(data: Record<string, unknown>): Record<string, unknown> {
    const raw: Record<string, unknown> = {};
    const analysisKey = findYogaAnalysisKey(data);

    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (key === analysisKey) continue;
        if (key === RAJ_YOGAS_KEY) continue;
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        raw[key] = data[key];
    }

    return raw;
}

// ─── Section Extractors ────────────────────────────────────────────

function extractHeader(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedHeader | null {
    const yogaName = extractYogaTypeName(data);

    // yoga_present can live at top-level, nested under yoga_formation_analysis,
    // or be derived from total_yogas_found / total_count > 0
    const overallAssessment = (analysis as any)?.overall_assessment;
    const totalYogasFound = (analysis?.total_yogas_found ?? analysis?.total_count ?? overallAssessment?.total_yogas_found) as number | undefined;
    const isPresent = analysis?.yoga_present
        ?? analysis?.overall_yoga_present
        ?? analysis?.yoga_formation_analysis?.yoga_present
        ?? (totalYogasFound !== undefined ? totalYogasFound > 0 : false);

    // Strength label — multiple sources
    const strength = analysis?.yoga_strength
        ?? analysis?.strongest_combination?.overall_strength
        ?? (analysis as any)?.overall_category
        ?? (analysis as any)?.final_assessment?.yoga_classification
        ?? (typeof (data as any).yoga_strength === 'string' ? (data as any).yoga_strength : undefined);

    // Strength score — multiple sources
    const strengthScore = analysis?.total_strength_score
        ?? analysis?.strongest_combination?.strength_score
        ?? (analysis as any)?.overall_strength
        ?? (typeof (data as any).base_strength_score === 'number' ? (data as any).base_strength_score : undefined);

    // Raja yoga stats
    const rajYogas = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    const rajTotalCount = rajYogas?.total_count as number | undefined;
    const avgStrength = rajYogas?.average_strength as number | undefined;

    // Subtitle — yoga_summary, reason, explanation, or formation_rule
    const subtitle = (analysis?.yoga_summary as string | undefined)
        ?? analysis?.reason
        ?? analysis?.explanation
        ?? (analysis?.yoga_formation_analysis?.formation_rule as string | undefined);

    return {
        title: yogaName,
        subtitle,
        isPresent: rajYogas ? (rajTotalCount ?? 0) > 0 : isPresent,
        strength,
        strengthScore: strengthScore ?? avgStrength,
        overallRating: analysis?.overall_rating as number | undefined,
        totalCount: rajTotalCount ?? totalYogasFound,
    };
}

function extractMeta(data: Record<string, unknown>): NormalizedMeta | null {
    const raw = data as RawYogaResponse;
    const birth = raw.birth_details;
    const notes = raw.calculation_notes ?? raw.notes ?? raw.calculation_details ?? raw.technical_details ?? raw.calculation_info ?? raw.technical_notes;
    const chartDetails = raw.chart_details;
    const chartInfo = raw.chart_info;
    const chartFoundations = raw.chart_foundations;

    // Ascendant — 8 possible formats
    let ascendantSign: string | undefined;
    let ascendantDegrees: string | undefined;
    if (raw.ascendant) {
        ascendantSign = raw.ascendant.sign;
        ascendantDegrees = raw.ascendant.degrees ?? raw.ascendant.formatted_degree ?? (raw.ascendant.degree_in_sign != null ? String(raw.ascendant.degree_in_sign) : undefined);
    } else if (chartFoundations?.ascendant) {
        ascendantSign = chartFoundations.ascendant.sign;
        ascendantDegrees = chartFoundations.ascendant.degrees;
    } else if (chartDetails?.ascendant) {
        ascendantSign = (chartDetails.ascendant as AscendantInfo).sign;
        ascendantDegrees = (chartDetails.ascendant as AscendantInfo).degrees;
    } else if (chartDetails?.ascendant_sign) {
        ascendantSign = chartDetails.ascendant_sign as string;
        ascendantDegrees = chartDetails.ascendant_degree as string | undefined;
    } else if (chartInfo) {
        ascendantSign = chartInfo.ascendant_sign;
        ascendantDegrees = chartInfo.ascendant_degree;
    } else if (raw.ascendant_sign) {
        ascendantSign = raw.ascendant_sign;
    } else if (birth?.ascendant) {
        ascendantSign = birth.ascendant.sign;
        ascendantDegrees = birth.ascendant.degrees;
    }

    // Lat/lon can be in birth_details directly, or nested in .location / .birth_location
    let lat = birth?.latitude ?? birth?.birth_location?.latitude;
    let lon = birth?.longitude ?? birth?.birth_location?.longitude;

    if (birth?.location) {
        if (typeof birth.location === 'object') {
            lat = lat ?? (birth.location as any).latitude;
            lon = lon ?? (birth.location as any).longitude;
        } else if (typeof birth.location === 'string') {
            const match = birth.location.match(/Lat:\s*([0-9.]+),\s*Lon:\s*([0-9.]+)/);
            if (match) {
                lat = parseFloat(match[1]);
                lon = parseFloat(match[2]);
            }
        }
    }

    const hasMeta = raw.user_name || birth || notes || chartDetails || chartInfo || chartFoundations || ascendantSign;
    if (!hasMeta) return null;

    // ayanamsa_value can come from notes, chart_details, or chart_info
    const ayVal = notes?.ayanamsa_value ?? chartDetails?.ayanamsa_value ?? chartInfo?.ayanamsa_value;
    const ayanamsaValue = ayVal != null ? String(ayVal).replace(/°$/, '') : undefined;

    return {
        userName: raw.user_name,
        birthDate: birth?.birth_date,
        birthTime: birth?.birth_time,
        ascendantSign,
        ascendantDegrees,
        latitude: lat,
        longitude: typeof lon === 'number' ? lon : undefined,
        ayanamsa: notes?.ayanamsa ?? (chartDetails?.ayanamsa as string | undefined) ?? chartInfo?.ayanamsa,
        ayanamsaValue,
        houseSystem: notes?.house_system ?? chartDetails?.house_system ?? chartInfo?.house_system,
        chartType: notes?.chart_type,
        analysisType: notes?.analysis_type ?? notes?.analysis_methodology,
    };
}

function extractDescription(analysis: YogaAnalysisCore | null): NormalizedDescription | null {
    if (!analysis) return null;

    const text = analysis.detailed_analysis;
    const explanation = analysis.explanation;

    // Also check yoga_formation_analysis for description content
    const formationRule = analysis.yoga_formation_analysis?.formation_rule as string | undefined;
    const separationAnalysis = analysis.yoga_formation_analysis?.separation_analysis as string | undefined;

    const primaryText = text ?? explanation ?? separationAnalysis;
    if (!primaryText) return null;

    return {
        text: primaryText,
        explanation: text ? (explanation ?? formationRule) : formationRule,
    };
}

function extractEffects(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedEffects | null {
    // From the old YogaAnalysis shape (gaja_kesari-like)
    const compEffects = (data as any).comprehensive_effects;
    if (compEffects) {
        return {
            specific: compEffects.specific_effects ?? [],
            overall: compEffects.overall_prediction,
        };
    }

    // From yoga combinations
    if (analysis?.strongest_combination?.effects) {
        return {
            specific: analysis.strongest_combination.effects,
            overall: analysis.detailed_analysis,
        };
    }

    // From chandra-mangal individual_analysis
    if (analysis?.individual_analysis) {
        const indiv = analysis.individual_analysis as Record<string, unknown>;
        const combined = indiv.combined_individual_influence as Record<string, unknown> | undefined;
        if (combined) {
            return {
                specific: (combined.individual_contributions as string[]) ?? [],
                overall: combined.overall_assessment as string | undefined,
            };
        }
    }

    // From alternative_combinations in yoga_formation_analysis
    const alts = analysis?.yoga_formation_analysis?.alternative_combinations;
    if (Array.isArray(alts) && alts.length > 0) {
        return {
            specific: alts,
            overall: 'Alternative yogas to consider',
        };
    }

    return null;
}

function extractStrength(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedStrength | null {
    const score = analysis?.total_strength_score
        ?? analysis?.strongest_combination?.strength_score
        ?? (analysis as any)?.overall_strength
        ?? (analysis as any)?.strength_percentage
        ?? (analysis as any)?.final_assessment?.cancellation_score;
    const label = analysis?.yoga_strength
        ?? analysis?.strongest_combination?.overall_strength
        ?? (analysis as any)?.overall_category
        ?? (analysis as any)?.final_assessment?.strength
        ?? (typeof (data as any).yoga_strength === 'string' ? (data as any).yoga_strength : undefined);
    const base = typeof (data as any).base_strength_score === 'number' ? (data as any).base_strength_score : undefined;
    const penalty = typeof (data as any).malefic_penalty === 'number' ? (data as any).malefic_penalty : undefined;
    const overallRating = analysis?.overall_rating as number | undefined;

    // Raj yoga average strength
    const rajYogas = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    const avgStrength = rajYogas?.average_strength as number | undefined;

    if (score === undefined && label === undefined && base === undefined && overallRating === undefined && avgStrength === undefined) return null;

    return {
        base,
        penalty,
        final: overallRating ?? score ?? avgStrength ?? base ?? 0,
        label,
        overallRating,
        functionalStatus: analysis?.functional_status ?? undefined,
        specialFeatures: analysis?.special_features ?? undefined,
    };
}

function extractConditions(analysis: YogaAnalysisCore | null): NormalizedConditions | null {
    let met = (analysis?.conditions_met as string[] | undefined) ?? [];
    let failed = (analysis?.conditions_failed as string[] | undefined) ?? [];

    // Kalpadruma-style yoga_analysis array
    const kalpaAnalysis = (analysis as any)?.yoga_analysis;
    if (Array.isArray(kalpaAnalysis)) {
        kalpaAnalysis.forEach((cond: any) => {
            const label = `${cond.role}: ${cond.planet} in ${cond.sign} (H${cond.house})`;
            if (cond.condition_met) {
                if (!met.includes(label)) met.push(label);
            } else {
                if (!failed.includes(label)) failed.push(label);
            }
        });
    }

    // Kala-sarpa-style rule_by_rule_analysis
    const ruleByRule = (analysis as any)?.rule_by_rule_analysis;
    if (ruleByRule && typeof ruleByRule === 'object') {
        Object.entries(ruleByRule).forEach(([ruleName, ruleData]: [string, any]) => {
            const label = `${ruleName.replace(/_/g, ' ')}: ${ruleData.description ?? ''}`;
            if (ruleData.yoga_present) {
                if (!met.includes(label)) met.push(label);
            } else {
                if (!failed.includes(label)) failed.push(label);
            }
        });
    }

    // Kala-sarpa final_assessment as header-like summary → also inject into conditions
    const finalAssessment = (analysis as any)?.final_assessment;
    if (finalAssessment?.recommendation) {
        const recLabel = `Recommendation: ${finalAssessment.recommendation}`;
        if (!met.includes(recLabel) && !failed.includes(recLabel)) {
            met.push(recLabel);
        }
    }

    if (met.length === 0 && failed.length === 0) return null;

    return {
        met,
        failed,
    };
}

function extractRajYogas(data: Record<string, unknown>): RajYogasData | null {
    const rajData = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    if (!rajData) return null;

    const yogasRaw = rajData.yogas as Array<Record<string, unknown>> | undefined;
    if (!yogasRaw || yogasRaw.length === 0) return null;

    const yogas: RajYogaEntry[] = yogasRaw.map(y => ({
        type: (y.type as string) ?? 'Unknown',
        subtype: y.subtype as string | undefined,
        description: (y.description as string) ?? '',
        formation: y.formation as string | undefined,
        planets: (y.planets as string[]) ?? [],
        houses: (y.houses as number[]) ?? [],
        strength: (y.strength as number) ?? 0,
        priority: (y.priority as string) ?? 'Unknown',
        cancellations: (y.cancellations as string[]) ?? [],
    }));

    return {
        totalCount: (rajData.total_count as number) ?? yogas.length,
        averageStrength: (rajData.average_strength as number) ?? 0,
        priorityDistribution: rajData.priority_distribution as Record<string, number> | undefined,
        typeDistribution: rajData.type_distribution as Record<string, number> | undefined,
        yogas,
    };
}

function extractCombinations(analysis: YogaAnalysisCore | null): NormalizedCombination[] | null {
    if (!analysis?.yoga_combinations?.length) return null;

    return analysis.yoga_combinations.map(combo => ({
        type: combo.type ?? 'unknown',
        present: combo.present ?? false,
        effects: combo.effects ?? [],
        house: combo.house,
        sign: combo.sign,
        houseCategory: combo.house_category,
        houseStrength: combo.house_strength,
        orbDegrees: combo.orb_degrees,
        orbStrength: combo.orb_strength,
        overallStrength: combo.overall_strength,
        strengthScore: combo.strength_score,
        nakshatraNumber: combo.nakshatra_number,
    }));
}

function extractPlanets(data: Record<string, unknown>): Record<string, PlanetPosition> | null {
    const raw = data as RawYogaResponse;

    // Full planet grids
    const grids = [
        raw.all_planetary_positions,
        raw.planetary_positions,
        raw.chart_foundations?.planetary_positions
    ];

    for (const grid of grids) {
        if (grid && Object.keys(grid).length > 0) {
            // Apply fixes to grid items if needed (e.g. formatted_degree)
            Object.values(grid).forEach(p => {
                if (!p.degrees && p.formatted_degree) p.degrees = p.formatted_degree;
            });
            return grid;
        }
    }

    // Individual *_details keys
    return extractPlanetDetails(data);
}

function extractHouses(data: Record<string, unknown>): NormalizedHouse[] | null {
    const raw = data as RawYogaResponse;
    const houseSigns = raw.house_signs ?? raw.chart_foundations?.house_signs;
    if (!houseSigns) return null;

    const entries = Object.entries(houseSigns);
    if (entries.length === 0) return null;

    const lords = raw.house_lords;

    return entries
        .map(([key, value]) => {
            const num = parseInt(key.replace(/\D/g, ''), 10);
            // Lords can use "House 1", "1", or "house_1" format, OR be inline in chart_foundations
            const lordKey = (value as any).lord
                ?? (lords ? (lords[key] ?? lords[`House ${num}`] ?? lords[String(num)] ?? lords[`house_${num}`]) : undefined);
            return {
                houseNumber: isNaN(num) ? 0 : num,
                sign: value.sign,
                startLongitude: value.start_longitude,
                lord: lordKey,
            };
        })
        .sort((a, b) => a.houseNumber - b.houseNumber);
}

function extractTiming(data: Record<string, unknown>): NormalizedTiming | null {
    const timing = (data as any).timing_analysis;
    if (!timing) return null;

    return {
        bestPeriods: timing.best_periods,
        activationTransits: timing.activation_transits,
        peakEffects: timing.peak_effects,
        remedialTiming: timing.remedial_timing,
    };
}

function extractRemedies(data: Record<string, unknown>): (string[] | NormalizedRemedyCategory[]) | null {
    // Flat array: remedial_suggestions (top-level)
    const suggestions = (data as any).remedial_suggestions;
    if (Array.isArray(suggestions) && suggestions.length > 0) return suggestions;

    // Flat array: spiritual_recommendations (spiritual-prosperity)
    const spiritualRecs = (data as any).spiritual_recommendations;
    if (Array.isArray(spiritualRecs) && spiritualRecs.length > 0) return spiritualRecs;

    // Flat array: classical_analysis.remedial_suggestions (dhan-yoga)
    const raw = data as RawYogaResponse;
    const classicalSuggestions = raw.classical_analysis?.remedial_suggestions;
    if (Array.isArray(classicalSuggestions) && classicalSuggestions.length > 0) return classicalSuggestions;

    // Categorized object: remedial_measures
    if (raw.remedial_measures && typeof raw.remedial_measures === 'object') {
        const categories: NormalizedRemedyCategory[] = Object.entries(raw.remedial_measures)
            .filter(([, items]) => Array.isArray(items) && items.length > 0)
            .map(([key, items]) => ({
                category: key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase()),
                items: items as string[],
            }));
        if (categories.length > 0) return categories;
    }

    return null;
}

function extractCancellation(data: Record<string, unknown>): CancellationFactor[] | null {
    const factors = (data as any).cancellation_factors;
    if (Array.isArray(factors) && factors.length > 0) return factors;
    return null;
}

function extractDoshaSeverity(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedDoshaSeverity | null {
    // Top-level severity
    const severity = (data as any).overall_severity;
    if (severity) {
        return {
            level: severity,
            description: (data as any).severity_description ?? (data as any).financial_outlook,
        };
    }

    // Severity inside yoga analysis (daridra)
    const analysisSeverity = analysis?.overall_severity as string | undefined;
    if (analysisSeverity) {
        return {
            level: analysisSeverity,
            description: analysis?.financial_outlook as string | undefined,
        };
    }

    return null;
}

function extractTechnical(data: Record<string, unknown>, normalizedMeta: NormalizedMeta | null): NormalizedTechnical | null {
    const raw = data as RawYogaResponse;
    const notes = raw.calculation_notes ?? raw.notes ?? raw.calculation_details ?? raw.technical_details ?? raw.calculation_info ?? raw.technical_notes;
    const validation = raw.yoga_validation_report;
    const calcInfo = raw.calculation_info;
    const techNotes = raw.technical_notes;

    return {
        ayanamsa: normalizedMeta?.ayanamsa,
        ayanamsaValue: normalizedMeta?.ayanamsaValue,
        houseSystem: normalizedMeta?.houseSystem,
        calculationMethod: (notes?.calculation_method ?? (notes as any)?.calculation_type) as string | undefined,
        chartType: normalizedMeta?.chartType,
        yogaRules: (notes?.yoga_validation ?? notes?.conjunction_rule ?? notes?.kaal_sarpa_rule) as string | undefined,
        coordinateSystem: (notes?.coordinate_system ?? notes?.ephemeris ?? calcInfo?.coordinate_system ?? calcInfo?.ephemeris ?? techNotes?.coordinate_system ?? techNotes?.ephemeris) as string | undefined,
        classicalRules: [
            ...(Object.entries(notes ?? {})
                .filter(([k]) => k.endsWith('_rule') || k.endsWith('_source'))
                .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)),
            ...(calcInfo?.comprehensive_coverage ?? []),
            ...(techNotes?.fixes_applied ?? []),
            ...(raw.interpretation_guide?.rule_explanations
                ? Object.entries(raw.interpretation_guide.rule_explanations).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                : [])
        ],
        methodology: validation
            ? Object.entries(validation).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
            : (calcInfo?.precision ?? techNotes?.calculation_precision),
    };
}

// ─── Main Normalizer ───────────────────────────────────────────────

/**
 * Normalizes any raw yoga API response into the consistent
 * NormalizedYogaData shape. Sections with no data are null.
 *
 * @param input - Raw JSON from the backend (may be double-nested)
 * @returns NormalizedYogaData with null sections where data is absent
 */
export function normalizeYogaData(input: unknown): NormalizedYogaData {
    // Step 1: Unwrap double-nested data.data
    let data: Record<string, unknown> = {};
    if (input && typeof input === 'object') {
        const obj = input as Record<string, unknown>;
        if (obj.data && typeof obj.data === 'object') {
            const inner = obj.data as Record<string, unknown>;
            if (inner.data && typeof inner.data === 'object') {
                data = inner.data as Record<string, unknown>;
            } else {
                data = inner;
            }
        } else {
            data = obj;
        }
    }

    // Step 2: Extract yoga analysis from dynamic key
    const analysis = extractYogaAnalysis(data);
    const meta = extractMeta(data);

    // Step 3: Build normalized sections
    return {
        header: extractHeader(data, analysis),
        meta,
        description: extractDescription(analysis),
        effects: extractEffects(data, analysis),
        strength: extractStrength(data, analysis),
        combinations: extractCombinations(analysis),
        conditions: extractConditions(analysis),
        rajYogas: extractRajYogas(data),
        planets: extractPlanets(data),
        houses: extractHouses(data),
        timing: extractTiming(data),
        remedies: extractRemedies(data),
        cancellation: extractCancellation(data),
        doshaSeverity: extractDoshaSeverity(data, analysis),
        technical: extractTechnical(data, meta),
        raw: collectUnknownKeys(data),
    };
}
