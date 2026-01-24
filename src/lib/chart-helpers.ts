import { Planet } from "@/components/astrology/NorthIndianChart";
import { formatPlanetDegree } from "@/lib/utils";

export const signNameToId: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

export const signIdToName: Record<number, string> = Object.fromEntries(
    Object.entries(signNameToId).map(([k, v]) => [v, k])
);

export interface ProcessedChartData {
    planets: Planet[];
    ascendant: number;
}

const planetMap: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
    'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

/**
 * Standardizes chart data parsing for all chart types (D1, D9, etc.)
 * Extracts Planets and Ascendant Sign ID.
 */
export function parseChartData(chartData: any): ProcessedChartData {
    if (!chartData) return { planets: [], ascendant: 1 };

    // 1. Identify where the planet list is
    let positions = chartData.transit_positions ||
        chartData.planetary_positions ||
        chartData.planets ||
        chartData.data?.transit_positions || // NEW: Support nested transit positions
        chartData.data?.planetary_positions || // Handle nested data wrapper
        chartData.data?.planets ||
        (chartData['Sun'] || chartData['Moon'] ? chartData : null);

    // Deep fallback: Duck-typing for direct map without known keys
    if (!positions) {
        // Search first level values for something that looks like a planet map
        const potentialKey = Object.keys(chartData).find(key => {
            const val = chartData[key];
            // Check if value is object and has planet-like properties
            return val && typeof val === 'object' && !Array.isArray(val) && (
                (val.Sun && val.Moon) ||
                (val['Sun'] && val['Moon']) ||
                (val[0]?.name === 'Sun')
            );
        });

        if (potentialKey) {
            positions = chartData[potentialKey];
        } else {
            // Deep fallback 2: Check standard planet keys at root even if duck typing failed
            const isPlanetMap = Object.entries(chartData).some(([k, v]: [string, any]) =>
                !['notes', 'birth_details', 'user_name', 'transit_time', 'natal_ascendant', 'ayanamsa', 'chart_type'].includes(k.toLowerCase()) &&
                v && typeof v === 'object' && (v.sign || v.sign_name) && (v.degrees || v.longitude || v.degree)
            );
            if (isPlanetMap) {
                positions = chartData;
            }
        }
    }

    let planets: Planet[] = [];

    if (positions) {
        // Handle both Array and Object formats
        const entries: [string, any][] = Array.isArray(positions)
            ? positions.map((p: any) => [p.name || p.planet_name || "??", p])
            : Object.entries(positions);

        planets = entries.map(([key, value]) => {
            // Skip non-planet keys if mixed object (e.g. "ayanamsa" or "meta" keys)
            if (!value || typeof value !== 'object') return null;

            // Extract planet name
            const rawName = value?.name || value?.planet_name || value?.planet || value?.label || value?.id || key || "??";

            // Normalize for lookup (Capitalize first letter, rest lowercase)
            const rawNameStr = String(rawName);
            const lookupKey = rawNameStr.charAt(0).toUpperCase() + rawNameStr.slice(1).toLowerCase();
            const name = planetMap[lookupKey] || (rawNameStr.length > 3 ? rawNameStr.substring(0, 2) : rawNameStr);

            const sign = value?.sign || value?.sign_name || "";
            const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            const rawDegree = value?.degrees || value?.longitude || value?.degree;
            // Parse house if available
            const house = value?.house ? parseInt(String(value.house)) : undefined;

            // Rahu and Ketu are always retrograde - don't show marker (Vedic convention)
            const isRahuKetu = name === 'Ra' || name === 'Ke';
            const hasRetrograde = value?.retrograde === 'R' || value?.retrograde === true || value?.is_retro === true;

            return {
                name,
                signId: signNameToId[normalizedSign] || 1,
                degree: formatPlanetDegree(rawDegree),
                isRetro: isRahuKetu ? false : hasRetrograde,
                house,
                nakshatra: value?.nakshatra || value?.nakshatra_name,
                pada: value?.pada || value?.nakshatra_pada
            };
        }).filter(Boolean) as Planet[];
    }

    // Process Ascendant
    let ascendant = 1; // Default Aries
    const asc = chartData.ascendant || chartData.data?.natal_ascendant || chartData.data?.ascendant;

    if (asc) {
        const sign = asc.sign || asc.sign_name || "Aries";
        const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
        ascendant = signNameToId[normalizedSign] || 1;

        // Add Ascendant to planets list so it renders as a point "As"
        const rawDegree = asc.degrees || asc.longitude || asc.degree;
        planets.push({
            name: 'As',
            signId: ascendant,
            degree: formatPlanetDegree(rawDegree),
            isRetro: false,
            house: 1
        });
    }

    return { planets, ascendant };
}
