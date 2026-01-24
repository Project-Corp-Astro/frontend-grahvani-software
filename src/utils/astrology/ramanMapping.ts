import { RamanNatalResponse, RamanPlanetPosition } from '@/types/raman';

export interface ChartPoint {
    name: string;
    sign: string;
    longitude: string; // degree format
    isRetro: boolean;
    house: number;
    nakshatra?: string;
    pada?: number;
}

export interface HouseData {
    houseNumber: number; // 1-12
    sign: number;        // 1-12 (Aries=1)
    points: ChartPoint[];
}

const SIGN_MAP: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
    'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
    'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const SHORT_NAMES: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
    'Ascendant': 'As', 'Lagna': 'As', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

/**
 * Normalizes degrees string "10.5" -> "10°30'" if needed, usually just displayed as is
 * or parsed. Here we assume we just pass it through or simple formatting.
 */
export const formatDegrees = (deg: string | number): string => {
    return deg.toString(); // Placeholder for more complex formatting if needed
};

/**
 * Maps the Raman API response to an array of 12 HouseData objects
 * suitable for the North Indian Chart renderer.
 */
export const mapRamanResponseToNorthIndian = (data: RamanNatalResponse): HouseData[] => {
    if (!data || !data.ascendant) return [];

    // 1. Identify Lagna Sign
    const lagnaSignName = data.ascendant.sign;
    const lagnaSignNum = SIGN_MAP[lagnaSignName] || 1;

    // 2. Initialize 12 Houses
    // In North Indian chart:
    // House 1 is always the top diamond.
    // The Sign in House 1 is the Lagna Sign.
    // Signs proceed Counter-Clockwise (1 -> 2 -> 3...) through the houses (which are fixed in position).
    // Actually, in North Indian:
    // Houses are Fixed (1 is Top, 2 is Top-Left, etc. counter-clockwise)
    // Signs populate these houses starting from Lagna in House 1.
    // Wait, Standard North Indian:
    // Houses are fixed. 1st House is Top Middle. Count Anti-Clockwise.
    // Signs: 1st House gets Lagna Sign. 2nd House gets (Lagna+1) Sign.

    // We need to return an array of 12 houses where index 0 = House 1, index 1 = House 2, etc.
    const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1;
        // Current Sign = (LagnaSign + (HouseNum - 1) - 1) % 12 + 1
        // Example: Lagna = 1 (Aries). House 1 Sign = 1.
        // House 2 Sign = 2 (Taurus).
        let currentSign = (lagnaSignNum + (houseNum - 1));
        if (currentSign > 12) currentSign -= 12;

        return {
            houseNumber: houseNum,
            sign: currentSign,
            points: []
        };
    });

    // 3. Map Planets to Houses
    // The backend `RamanPlanetPosition` already has a `house` field (1-12).
    // We should trust the backend's house assignment if it's Bhava-based.
    // HOWEVER, for North Indian Rashi Chart (D1), the house is strictly Sign-Based relative to Lagna.
    // Backend "house" property might be Bhava Chalit or Rashi house.
    // Usually D1 = Rashi Chart. House = Current Sign - Lagna Sign + 1.

    // SAFETY CHECK: Does the backend `house` match the calculated Rashi house?
    // If we are drawing a D1 Rashi chart, we rely on Signs.
    // If backend provides specific `house` (maybe Bhava), we might put it there.
    // Standard practice: D1 is Rashi. Use Sign to determine House.

    // Let's rely on the Planet's Sign to place it in the correct House relative to Lagna.

    Object.entries(data.planetary_positions).forEach(([key, planet]) => {
        const planetSignNum = SIGN_MAP[planet.sign] || 0;
        if (planetSignNum === 0) return;

        // Calculate House based on Sign (Whole Sign House System for D1)
        // House = (PlanetSign - LagnaSign + 1)
        let calculatedHouse = (planetSignNum - lagnaSignNum) + 1;
        if (calculatedHouse <= 0) calculatedHouse += 12;

        // Note: We ignore `planet.house` from backend if we purely want Rashi chart accuracy based on signs.
        // If the user wants Bhava styling, we'd use `planet.house`.
        // Given 'Raman' usually implies strict Rashi for main chart unless specified otherwise.
        // I will use calculatedHouse to ensure 100% Sign consistency.

        const ptAndShort = SHORT_NAMES[key] || key.substring(0, 2);

        const point: ChartPoint = {
            name: ptAndShort,
            sign: planet.sign,
            longitude: formatDegrees(planet.degrees),
            isRetro: planet.retrograde,
            house: calculatedHouse,
            nakshatra: planet.nakshatra,
            pada: planet.pada
        };

        // Add to correct house (index = house - 1)
        houses[calculatedHouse - 1].points.push(point);
    });

    // Add logic for ASC/Lagna point in House 1
    // (Optional, usually implied by House 1 position, but good to have in data)
    // houses[0].points.push({ ...Ascendant ... }) -- Usually specific renderer handles "As" label.

    return houses;
};
