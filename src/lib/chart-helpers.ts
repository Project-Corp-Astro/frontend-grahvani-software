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

    let planets: Planet[] = [];
    const positions = chartData.planetary_positions || chartData.planets;

    if (positions) {
        // Handle both Array and Object formats
        const entries: [string, any][] = Array.isArray(positions)
            ? positions.map((p: any) => [p.name || p.planet_name || "??", p])
            : Object.entries(positions);

        planets = entries.map((entry) => {
            const key = entry[0];
            const value = entry[1];
            const name = planetMap[key] || key.substring(0, 2);
            const sign = value?.sign || value?.sign_name || "";
            const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            const rawDegree = value?.degrees || value?.longitude || value?.degree;
            // Parse house if available (ensure it's a number)
            const house = value?.house ? parseInt(value.house) : undefined;

            // Rahu and Ketu are always retrograde - don't show marker (Vedic convention)
            const isRahuKetu = name === 'Ra' || name === 'Ke';
            const hasRetrograde = value?.retrograde === 'R' || value?.retrograde === true || value?.is_retro === true;

            return {
                name,
                signId: signNameToId[normalizedSign] || 1,
                degree: formatPlanetDegree(rawDegree),
                isRetro: isRahuKetu ? false : hasRetrograde, // Never show R for Rahu/Ketu
                house
            };
        });
    }

    // Process Ascendant
    let ascendant = 1; // Default Aries
    if (chartData.ascendant) {
        const asc = chartData.ascendant;
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
            house: 1 // Ascendant is always in House 1 (Lagna)
        });
    }

    return { planets, ascendant };
}
