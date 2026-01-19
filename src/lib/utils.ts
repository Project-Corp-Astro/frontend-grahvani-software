import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Parses a DMS string (e.g. "8° 21' 6.44"") or numeric value to a decimal degree number.
 * Returns null if invalid.
 */
export function parseDMS(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;

    if (typeof value === 'string') {
        const dmsRegex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)"?/;
        const match = value.match(dmsRegex);
        if (match) {
            const degrees = parseFloat(match[1]);
            const minutes = parseFloat(match[2]);
            const seconds = parseFloat(match[3]);
            return degrees + (minutes / 60) + (seconds / 3600);
        }
        // Fallback for simple decimal strings
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

/**
 * Formats a decimal degree or DMS string into "DD:MM" format.
 */
export function formatPlanetDegree(value: string | number | null | undefined): string {
    const decimal = parseDMS(value);
    if (decimal === null) return "";

    const d = Math.floor(decimal);
    const m = Math.floor((decimal - d) * 60);

    const dd = d.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');

    return `${dd}:${mm}`;
}
