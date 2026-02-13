import { NormalizedDoshaData, RawDoshaResponse } from '@/types/dosha.types';
import { PlanetPosition } from '@/types/yoga.types';

/**
 * Transforms various Dosha JSON shapes into a unified NormalizedDoshaData structure.
 */
export function normalizeDoshaData(raw: any): NormalizedDoshaData | null {
    if (!raw) return null;

    // Safely unwrap: backend might return { success: true, data: { ... } }
    const data = raw.data || raw;

    return {
        header: extractHeader(data),
        meta: extractMeta(data),
        severity: extractDoshaSeverity(data),
        impacts: extractImpacts(data),
        remedies: extractRemedies(data),
        planets: extractPlanets(data),
        technical: extractTechnical(data),
        progress: extractProgress(data)
    };
}

function extractHeader(data: any) {
    const angarak = data.angarak_dosha_analysis;
    const shrapit = data.shrapit_dosha_analysis;
    const sadeSati = data.sade_sati;
    const pitra = data.pitra_dosha_analysis;
    const manglik = data.manglik_dosha_analysis;

    const isPresent =
        angarak?.has_angarak_dosha ??
        shrapit?.present ??
        sadeSati?.status?.active ??
        pitra?.pitra_dosha_present ??
        manglik?.is_present ??
        data.is_sade_sati_active ??
        data.is_present ??
        false;

    const title = angarak ? "Angarak Dosha" :
        (shrapit ? "Shrapit Dosha" :
            (pitra ? "Pitra Dosha" :
                (manglik ? "Manglik Dosha" :
                    (sadeSati ? "Sade Sati" : (data.calculation_notes?.analysis_type || "Dosha Analysis")))));

    return {
        title,
        isPresent,
        strengthBadge: isPresent ? "Active" : "None Detected",
        subtitle: isPresent ? "Planetary Affliction Mapping" : "Auspicious Alignment"
    };
}

function extractMeta(data: any) {
    const user = data.user_info;
    const birth = data.birth_details || data.birth_chart;
    const calc = data.calculation_details;
    const chart = data.chart_details;
    const asc = data.ascendant || birth?.ascendant;

    if (!user && !birth) return null;

    let location = "Unknown";
    if (user?.location) {
        location = `Lat: ${user.location.latitude}, Lon: ${user.location.longitude}`;
    } else if (birth?.location) {
        location = `Lat: ${birth.location.latitude}, Lon: ${birth.location.longitude}`;
    } else if (birth?.birth_location) {
        location = birth.birth_location;
    }

    return {
        userName: data.user_name || user?.name || "Grahvani User",
        location,
        date: birth?.date || user?.birth_date || birth?.birth_date || "",
        time: birth?.time || user?.birth_time || birth?.birth_time || "",
        ascendantSign: asc?.sign_name || asc?.sign || birth?.ascendant?.sign || data.planetary_positions?.Ascendant?.sign || "Unknown",
        ascendantDegree: asc?.sign_degree || (asc?.degree !== undefined ? `${asc.degree}°` : (birth?.ascendant?.degrees || data.planetary_positions?.Ascendant?.degree_in_sign ? `${data.planetary_positions.Ascendant.degree_in_sign}°` : "0°"))
    };
}

function extractDoshaSeverity(data: any) {
    const angarak = data.angarak_dosha_analysis;
    const shrapit = data.shrapit_dosha_analysis;
    const sadeSati = data.sade_sati;
    const pitra = data.pitra_dosha_analysis;

    const severity = angarak?.overall_severity ||
        shrapit?.severity ||
        pitra?.overall_severity ||
        sadeSati?.intensity_interpretation?.level ||
        data.severity ||
        data.sade_sati_analysis?.intensity ||
        "Medium";

    const description = angarak?.interpretation_notes?.[0] ||
        shrapit?.degree_analysis ||
        (pitra?.pitra_dosha_present ? "Karmic baggage related to ancestors detected." : null) ||
        sadeSati?.intensity_interpretation?.description ||
        `This condition is analyzed at ${severity.toLowerCase()} intensity.`;

    return {
        level: severity,
        description
    };
}

function extractImpacts(data: any) {
    const impacts: any[] = [];
    const angarak = data.angarak_dosha_analysis;
    const shrapit = data.shrapit_dosha_analysis;
    const sadeSati = data.sade_sati;
    const pitra = data.pitra_dosha_analysis;

    if (angarak) {
        // 1. House effects
        if (angarak.house_effects?.areas && angarak.house_effects?.effects) {
            const areas = angarak.house_effects.areas;
            const effects = angarak.house_effects.effects;
            areas.forEach((area: string, i: number) => {
                impacts.push({
                    title: `Area: ${area}`,
                    content: effects[i] || "Possible disturbance in this area.",
                    type: 'impact'
                });
            });
        }

        // 2. Positive manifestations
        if (Array.isArray(angarak.positive_manifestations)) {
            impacts.push({
                title: "Positive Manifestations",
                content: "These qualities can be harnessed through discipline: " + angarak.positive_manifestations.join(", ") + ".",
                type: 'analysis'
            });
        }

        // 3. Interpretation Notes
        if (Array.isArray(angarak.interpretation_notes)) {
            angarak.interpretation_notes.forEach((note: string, i: number) => {
                if (i === 0) return; // Skip first which is usually used for severity description
                impacts.push({
                    title: "Astrological Note",
                    content: note,
                    type: 'analysis'
                });
            });
        }

        // 4. Cancellation factors
        if (Array.isArray(angarak.cancellation_factors)) {
            angarak.cancellation_factors.forEach((cf: any) => {
                impacts.push({
                    title: `Cancellation: ${cf.factor}`,
                    content: `${cf.description}. Effect: ${cf.impact}`,
                    type: 'analysis'
                });
            });
        }
    }

    if (shrapit) {
        if (shrapit.house_severity_info?.primary_effects) {
            impacts.push({
                title: "Primary Effects",
                content: shrapit.house_severity_info.primary_effects,
                type: 'impact'
            });
        }

        if (shrapit.detailed_analysis) {
            const details = shrapit.detailed_analysis;
            const analysisText = [
                details.base_calculation,
                details.house_impact,
                details.sign_impact,
                details.final_assessment
            ].filter(Boolean).join(". ");

            impacts.push({
                title: "Technical Assessment",
                content: analysisText,
                type: 'analysis'
            });
        }

        if (Array.isArray(shrapit.aggravations)) {
            shrapit.aggravations.forEach((agg: any) => {
                impacts.push({
                    title: `Aggravating Factor: ${agg.type}`,
                    content: agg.effect,
                    type: 'analysis'
                });
            });
        }
    }

    if (pitra) {
        if (Array.isArray(pitra.indicators)) {
            pitra.indicators.forEach((ind: any) => {
                impacts.push({
                    title: `Indicator: ${ind.rule}`,
                    content: `${ind.description}. (Severity: ${ind.severity})`,
                    type: 'impact'
                });
            });
        }

        if (Array.isArray(pitra.cancellation_factors)) {
            pitra.cancellation_factors.forEach((cf: any) => {
                impacts.push({
                    title: `Protection: ${cf.type}`,
                    content: `${cf.description}. (Strength: ${cf.strength})`,
                    type: 'analysis'
                });
            });
        }

        if (pitra.combination_summary) {
            const s = pitra.combination_summary;
            impacts.push({
                title: "Combination Summary",
                content: `Detected ${s.secondary_combinations} secondary and ${s.tertiary_combinations} tertiary ancestral combinations.`,
                type: 'analysis'
            });
        }
    }

    if (sadeSati?.status) {
        impacts.push({
            title: "Phase Status",
            content: sadeSati.status.description,
            type: 'impact'
        });

        if (data.moon_analysis) {
            impacts.push({
                title: "Moon Assessment",
                content: `Moon in ${data.moon_analysis.sign} (House ${data.moon_analysis.house}) is at ${data.moon_analysis.strength?.strength_level || 'Average'} strength.`,
                type: 'analysis'
            });
        }
    }

    // Sade Sati specific (other shape)
    if (data.sade_sati_analysis?.phase_description) {
        impacts.push({
            title: "Current Phase Impact",
            content: data.sade_sati_analysis.phase_description,
            type: 'impact'
        });
    }

    // Generic summary
    const summary = data.analysis_summary ||
        angarak?.impact_summary ||
        shrapit?.detailed_analysis?.final_assessment ||
        (pitra?.overall_severity ? `Overall Severity: ${pitra.overall_severity}` : null) ||
        sadeSati?.status?.description;

    if (summary) {
        impacts.push({
            title: "Core Assessment",
            content: summary,
            type: 'analysis'
        });
    }

    return impacts;
}

function extractRemedies(data: any) {
    const remedies: any[] = [];
    const angarak = data.angarak_dosha_analysis;
    const shrapit = data.shrapit_dosha_analysis;
    const pitra = data.pitra_dosha_analysis;
    const topRecs = data.recommendations;

    // 1. Pitra Remedies
    if (Array.isArray(pitra?.remedial_guidance?.primary_remedies)) {
        pitra.remedial_guidance.primary_remedies.forEach((rec: string) => {
            let type: any = 'ritual';
            if (rec.toLowerCase().includes('chant') || rec.toLowerCase().includes('recite')) type = 'mantra';
            if (rec.toLowerCase().includes('donate') || rec.toLowerCase().includes('charitable')) type = 'ritual';
            remedies.push({ text: rec, type });
        });
    }

    // 2. Top level recommendations (Sade Sati sample)
    if (Array.isArray(topRecs)) {
        topRecs.forEach((rec: string) => {
            let type: any = 'general';
            if (rec.toLowerCase().includes('chant') || rec.toLowerCase().includes('mantra')) type = 'mantra';
            if (rec.toLowerCase().includes('puja') || rec.toLowerCase().includes('temple') || rec.toLowerCase().includes('worship')) type = 'ritual';
            if (rec.toLowerCase().includes('donate') || rec.toLowerCase().includes('serve') || rec.toLowerCase().includes('plant')) type = 'ritual';
            if (rec.toLowerCase().includes('avoid') || rec.toLowerCase().includes('practice') || rec.toLowerCase().includes('exercise')) type = 'lifestyle';
            remedies.push({ text: rec, type });
        });
    }

    // ... (rest of function)
    if (Array.isArray(shrapit?.recommendations)) {
        shrapit.recommendations.forEach((rec: string) => {
            let type: any = 'general';
            if (rec.toLowerCase().includes('chant') || rec.toLowerCase().includes('mantra')) type = 'mantra';
            if (rec.toLowerCase().includes('puja') || rec.toLowerCase().includes('temple') || rec.toLowerCase().includes('worship')) type = 'ritual';
            if (rec.toLowerCase().includes('donate') || rec.toLowerCase().includes('serve') || rec.toLowerCase().includes('plant')) type = 'ritual';
            if (rec.toLowerCase().includes('avoid') || rec.toLowerCase().includes('practice') || rec.toLowerCase().includes('exercise')) type = 'lifestyle';
            if (rec.includes('🔴')) type = 'ritual'; // High priority

            remedies.push({ text: rec, type });
        });
    }

    if (angarak?.remedies) {
        const r = angarak.remedies;
        if (Array.isArray(r.mantras)) r.mantras.forEach((m: string) => remedies.push({ text: m, type: 'mantra' }));
        if (Array.isArray(r.spiritual_practices)) r.spiritual_practices.forEach((s: string) => remedies.push({ text: s, type: 'ritual' }));
        if (Array.isArray(r.donations)) r.donations.forEach((d: string) => remedies.push({ text: d, type: 'ritual' }));
        if (Array.isArray(r.lifestyle)) r.lifestyle.forEach((l: string) => remedies.push({ text: l, type: 'lifestyle' }));
        if (Array.isArray(r.gemstones)) r.gemstones.forEach((g: string) => remedies.push({ text: g, type: 'lifestyle' }));
    }

    const generic = data.remedial_suggestions;
    if (Array.isArray(generic)) {
        generic.forEach((r: any) => remedies.push({ text: typeof r === 'string' ? r : JSON.stringify(r), type: 'general' }));
    } else if (generic && typeof generic === 'object') {
        const g = generic as any;
        if (g.mantras) g.mantras.forEach((r: any) => remedies.push({ text: r, type: 'mantra' }));
        if (g.rituals) g.rituals.forEach((r: any) => remedies.push({ text: r, type: 'ritual' }));
        if (g.lifestyle) g.lifestyle.forEach((r: any) => remedies.push({ text: r, type: 'lifestyle' }));
    }

    const recs = data.sade_sati_analysis?.recommendations;
    if (Array.isArray(recs)) {
        recs.forEach(r => remedies.push({ text: r, type: 'general' }));
    }

    return remedies;
}

function extractPlanets(data: any) {
    const chartPlanets = data.birth_chart?.planets;
    const positions = data.planetary_positions || data.all_planetary_positions || chartPlanets;
    if (!positions) return [];

    return Object.entries(positions).map(([name, pos]: [string, any]) => ({
        name,
        sign: pos.sign_name || pos.sign,
        house: pos.house,
        degree: pos.sign_degree || pos.degrees || pos.degree_in_sign || (pos.degree !== undefined ? `${pos.degree}°` : (pos.degree_in_sign !== undefined ? `${pos.degree_in_sign}°` : "0°")),
        isFocal: name === 'Mars' || name === 'Rahu' || name === 'Saturn' || name === 'Sat'
    }));
}

function extractTechnical(data: any) {
    const notes = data.calculation_details || data.calculation_notes || data.chart_details;
    if (!notes) return null;

    return {
        ayanamsa: notes.ayanamsa_type || notes.ayanamsa || notes.ayanamsa_value || "Lahiri",
        houseSystem: notes.house_system || "Whole Sign",
        coordinateSystem: notes.coordinate_system || notes.zodiac || "Geocentric",
        precision: "High",
        fixes: notes.critical_fixes || []
    };
}

function extractProgress(data: any) {
    const sadeSati = data.sade_sati;
    if (sadeSati?.status?.active) {
        const phase = sadeSati.status.phase || "";
        const phaseNum = sadeSati.status.phase_number || 0;
        let percentage = (phaseNum / 3) * 100;

        return {
            label: phase,
            percentage,
            description: sadeSati.status.description || "Active Sade Sati phase."
        };
    }

    if (data.is_sade_sati_active && data.sade_sati_analysis) {
        const phase = data.sade_sati_analysis.current_phase || "";
        let percentage = 0;
        if (phase.includes('1')) percentage = 33;
        if (phase.includes('2')) percentage = 66;
        if (phase.includes('3')) percentage = 100;

        return {
            label: phase,
            percentage,
            description: data.sade_sati_analysis.transit_details || "Current Saturn movement over natal Moon."
        };
    }
    return null;
}
