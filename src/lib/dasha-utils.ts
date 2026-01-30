/**
 * Dasha Utility Library (Senior Level)
 * 
 * Provides robust mapping and traversal logic for multi-level Dasha trees.
 * Standardizes raw engine JSON into dashboard-ready formats.
 */

export interface DashaNode {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    canDrillFurther?: boolean;
    sublevel?: DashaNode[];
    raw?: any;
    [key: string]: any;
}

export interface DashaMetadata {
    moonLongitude: number;
    nakshatraAtBirth: string;
    userName: string;
}

export interface ActiveDashaPath {
    nodes: DashaNode[];
    progress: number; // Percentage through current deepest period
    metadata?: DashaMetadata;
}

/**
 * Robustly find sublevels in a dasha node regardless of naming convention.
 */
export function getSublevels(node: any): any[] | null {
    if (!node) return null;
    const sublevels = node.sublevels ||
        node.antardashas ||
        node.pratyantardashas ||
        node.sookshma_dashas ||
        node.sookshmadashas ||
        node.prandashas ||
        node.pran_dashas ||
        node.sublevel ||
        node.timeline ||
        node.periods; // Added common fallback
    return Array.isArray(sublevels) ? sublevels : null;
}

/**
 * Recursively find the first available array in a nested object.
 * Essential for systems like Tribhagi where dasha periods are buried in data.mahadashas.data.tribhagi_dashas_janma
 */
export function extractPeriodsArray(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // If it's an object, check common dasha keys
    if (typeof data === 'object') {
        // Dwadashottari/Specialized wrapped structure support
        if (data.detailed_mahadashas_with_antardashas && Array.isArray(data.detailed_mahadashas_with_antardashas)) {
            return data.detailed_mahadashas_with_antardashas.map((item: any) => ({
                ...(item.mahadasha || {}),
                antardashas: item.antardashas || []
            }));
        }

        // Panchottari Support
        if (data.panchottari_dasha && data.panchottari_dasha.mahadashas) {
            return data.panchottari_dasha.mahadashas;
        }

        // Dwisaptati Support (Normalization) - 144 Year Double Cycle
        // MUST BE BEFORE Chaturshitisama as both use dasha_table
        // Path: data.mahadashas.data.meta.system_years
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.dasha_table && (data.mahadashas.data.meta?.system_years === 144 || data.mahadashas.meta?.system_years === 144)) {
            return data.mahadashas.data.dasha_table.map((m: any, idx: number) => ({
                planet: m.mahadasha,
                startDate: m.start,
                endDate: m.end,
                raw: { ...m, cycle: idx < 8 ? 1 : 2 },
                sublevels: (m.antardashas || []).map((a: any) => ({
                    planet: a.antar_lord,
                    startDate: a.start,
                    endDate: a.end,
                    raw: a
                }))
            }));
        }

        // Chaturshitisama Support (Normalization) - 84 Year System
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.dasha_table && (data.mahadashas.data.meta?.system_years === 84 || data.mahadashas.meta?.system_years === 84)) {
            return data.mahadashas.data.dasha_table.map((m: any) => ({
                planet: m.mahadasha_lord,
                startDate: m.mahadasha_beginning,
                endDate: m.mahadasha_ending,
                duration: m.duration,
                raw: m,
                sublevels: (m.antardashas || []).map((a: any) => ({
                    planet: a.antardasha_lord,
                    startDate: a.beginning,
                    endDate: a.ending,
                    raw: a
                }))
            }));
        }

        // Satabdika Support (Normalization) - 100 Year System
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.satabdika_dasha) {
            return data.mahadashas.data.satabdika_dasha.map((m: any) => ({
                planet: m.lord,
                startDate: m.start_date,
                endDate: m.end_date,
                raw: m,
                sublevels: (m.antardashas || []).map((a: any) => ({
                    planet: a.lord,
                    startDate: a.start_date,
                    endDate: a.end_date,
                    raw: a
                }))
            }));
        }

        // Specialized Systems Support (Normalization for Shattrimshatsama, Shasthihayani, Dwisaptati, etc.)
        // Robust check for nested dasha data structures
        const dashaContainer = data.mahadashas?.data || data.mahadashas || data;
        const targetList = dashaContainer.timeline || dashaContainer.dasha_system || dashaContainer.dasha_table || dashaContainer.dasha_list;

        if (Array.isArray(targetList)) {
            return targetList.map((m: any) => {
                const startDate = m.startDate || m.start_date || m.start || m.mahadasha_beginning || m.beginning;
                const endDate = m.endDate || m.end_date || m.end || m.mahadasha_ending || m.ending;
                const isCurrent = isDateRangeCurrent(startDate, endDate);

                return {
                    planet: m.planet || m.mahadasha || m.mahadasha_lord || m.lord || m.lord_name || m.sign,
                    startDate,
                    endDate,
                    isCurrent,
                    type: m.type,
                    isBalance: m.type === "Balance" || m.is_balance === true || m.balance_at_birth === true,
                    duration: m.duration ? (typeof m.duration === 'number' ? `${m.duration}y` : m.duration) : undefined,
                    raw: m,
                    sublevel: (m.antardashas || m.sublevels || m.sublevel || []).map((a: any) => {
                        const aStart = a.startDate || a.start_date || a.start || a.beginning;
                        const aEnd = a.endDate || a.end_date || a.end || a.ending;
                        return {
                            planet: a.planet || a.antardasha_lord || a.antar_lord || a.lord || a.lord_name,
                            startDate: aStart,
                            endDate: aEnd,
                            isCurrent: isDateRangeCurrent(aStart, aEnd),
                            duration: a.duration_months ? `${a.duration_months}m` : undefined,
                            raw: a
                        };
                    })
                };
            });
        }

        const keysToTry = [
            'mahadashas',
            'periods',
            'tribhagi_dashas_janma',
            'panchottari_dasha', // Add to keys to try as well
            'yoginis',
            'chara_dashas',
            'data', // Check nested data objects
            'dasha_list'
        ];

        for (const key of keysToTry) {
            if (data[key]) {
                const result = extractPeriodsArray(data[key]);
                if (result.length > 0) return result;
            }
        }

        // Final fallback: Find the first array property
        const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]) && data[k].length > 0);
        if (firstArrayKey) return data[firstArrayKey];
    }

    return [];
}

/**
 * Traverse a nested Dasha tree to find the current active path based on time.
 * Logic: missing start_date = end_date of previous sibling or parent start.
 */
export function findActiveDashaPath(rawResponse: any): ActiveDashaPath {
    const now = new Date();
    const path: DashaNode[] = [];

    // Extract Metadata
    const metadata: DashaMetadata = {
        moonLongitude: rawResponse.moon_longitude || 0,
        nakshatraAtBirth: rawResponse.nakshatra_at_birth || 'Unknown',
        userName: rawResponse.user_name || 'Anonymous'
    };

    const mahadashas = extractPeriodsArray(rawResponse);
    let currentLevel = mahadashas;
    let foundNode: any = null;
    let foundStart: string = "";
    let parentStart: string = "";

    // Traverse down the hierarchy
    while (currentLevel && Array.isArray(currentLevel) && currentLevel.length > 0) {
        let activeNode: any = null;
        let chainStart = parentStart;

        for (const p of currentLevel) {
            const s = p.start_date || p.startDate || p.start || chainStart;
            const e = p.end_date || p.endDate || p.end;

            if (s && e) {
                const startTime = parseApiDate(s).getTime();
                const endTime = parseApiDate(e).getTime();
                const nowTime = now.getTime();

                // Buffer comparison to avoid jumping due to micro-drifts
                if (nowTime >= startTime && nowTime < endTime) {
                    activeNode = p;
                    activeNode._calculated_start = s;
                    break;
                }
            }
            if (e) chainStart = e;
        }

        if (!activeNode) break;

        const sDate = activeNode._calculated_start;
        const eDate = activeNode.end_date || activeNode.endDate || activeNode.end;

        const standardizedNode: DashaNode = {
            planet: activeNode.planet || activeNode.lord || activeNode.sign,
            startDate: sDate,
            endDate: eDate,
            isCurrent: true,
            raw: activeNode
        };

        path.push(standardizedNode);

        foundNode = activeNode;
        foundStart = sDate;
        parentStart = sDate;
        currentLevel = getSublevels(activeNode) || [];
    }

    // Calculate progress for the current (deepest) active node
    let progress = 0;
    if (foundNode) {
        const start = parseApiDate(foundNode._calculated_start || foundNode.start_date || foundNode.startDate || foundNode.start).getTime();
        const end = parseApiDate(foundNode.end_date || foundNode.endDate || foundNode.end).getTime();
        const nowMs = now.getTime();
        if (end > start) {
            progress = Math.max(0, Math.min(100, Math.round(((nowMs - start) / (end - start)) * 100)));
        }
    }

    return { nodes: path, progress, metadata };
}

/**
 * Calculate duration between two date strings and return formatted string.
 */
export function calculateDuration(startStr: string, endStr: string): string {
    if (!startStr || !endStr) return "—";
    const start = parseApiDate(startStr).getTime();
    const end = parseApiDate(endStr).getTime();
    return formatDurationMs(end - start);
}

/**
 * Standardize durations like 2.5 years -> "2y 6m", or sub-day units for deep dashas.
 */
export function standardizeDuration(years: number, days?: number): string {
    if (years <= 0 && (!days || days <= 0)) return "0d";

    // Convert everything to total milliseconds for high-precision calculation
    // Using 365.25 for Julian year alignment with most astro engines
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const totalMs = (years > 0 ? years * msPerYear : 0) + (days && days > 0 ? days * 24 * 60 * 60 * 1000 : 0);

    return formatDurationMs(totalMs);
}

/**
 * Core formatter for duration in milliseconds
 */
export function formatDurationMs(totalMs: number): string {
    if (totalMs <= 0) return "0d";

    const MS_PER_MINUTE = 60 * 1000;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;
    const MS_PER_MONTH = (365.25 / 12) * MS_PER_DAY;
    const MS_PER_YEAR = 365.25 * MS_PER_DAY;

    // 1. Years & Months (Major periods)
    if (totalMs >= MS_PER_YEAR) {
        const y = Math.floor(totalMs / MS_PER_YEAR);
        const remaining = totalMs % MS_PER_YEAR;
        const m = Math.round(remaining / MS_PER_MONTH);
        if (m === 0) return `${y}y`;
        if (m === 12) return `${y + 1}y`;
        return `${y}y ${m}m`;
    }

    // 2. Months & Days (Medium periods)
    if (totalMs >= MS_PER_MONTH) {
        const m = Math.floor(totalMs / MS_PER_MONTH);
        const remaining = totalMs % MS_PER_MONTH;
        const d = Math.round(remaining / MS_PER_DAY);
        if (d === 0) return `${m}m`;
        return `${m}m ${d}d`;
    }

    // 3. Days & Hours (Deep periods - Sookshma)
    if (totalMs >= MS_PER_DAY) {
        const d = Math.floor(totalMs / MS_PER_DAY);
        const remaining = totalMs % MS_PER_DAY;
        const h = Math.round(remaining / MS_PER_HOUR);
        if (h === 0) return `${d}d`;
        return `${d}d ${h}h`;
    }

    // 4. Hours & Minutes (Micro periods - Prana)
    if (totalMs >= MS_PER_HOUR) {
        const h = Math.floor(totalMs / MS_PER_HOUR);
        const remaining = totalMs % MS_PER_HOUR;
        const min = Math.round(remaining / MS_PER_MINUTE);
        if (min === 0) return `${h}h`;
        return `${h}h ${min}m`;
    }

    // 5. Just Minutes
    const min = Math.round(totalMs / MS_PER_MINUTE);
    return `${Math.max(1, min)}m`;
}

/**
 * Parse API date string "YYYY-MM-DD HH:mm:ss" to Date object
 */
export function parseApiDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    // Handle DD-MM-YYYY or DD-MM-YYYY HH:mm:ss
    if (dateStr.includes('-')) {
        const parts = dateStr.split(' ')[0].split('-');
        if (parts[0].length === 2) {
            // It's DD-MM-YYYY
            const timePart = dateStr.split(' ')[1] || '00:00:00';
            const [d, m, y] = parts;
            return new Date(`${y}-${m}-${d}T${timePart.replace(/:/g, ':')}`);
        }
    }

    return new Date(dateStr.replace(' ', 'T'));
}

/**
 * Format date for display
 */
export function formatDateDisplay(dateStr: string): string {
    try {
        if (!dateStr) return '—';
        const date = parseApiDate(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return '—'; }
}

/**
 * Check if a date range includes the current time
 */
export function isDateRangeCurrent(start: string, end: string): boolean {
    if (!start || !end) return false;
    const now = new Date();
    const s = parseApiDate(start);
    const e = parseApiDate(end);
    return now >= s && now <= e;
}

/**
 * Recursive mapper to process the raw Dasha tree.
 * Handles date inheritance (waterfall logic) and standardizes the structure.
 */
function mapDashaLevelRecursive(node: any, level: number, inheritedStartDate?: string, maxLevel: number = 4): DashaNode {
    // Determine children using robust helper
    const rawChildren = getSublevels(node);
    let mappedChildren: DashaNode[] = [];

    // START DATE RESOLUTION
    let myStartDateRaw = node.start_date || node.startDate || node.start || node.mahadasha_beginning || node.beginning;
    if (!myStartDateRaw && inheritedStartDate) {
        myStartDateRaw = inheritedStartDate;
    }

    if (Array.isArray(rawChildren)) {
        let runningStart = myStartDateRaw;
        mappedChildren = rawChildren.map((child: any) => {
            const mappedChild = mapDashaLevelRecursive(child, level + 1, runningStart, maxLevel);
            if (child.end_date || child.endDate || child.end || child.ending || child.mahadasha_ending) {
                runningStart = child.end_date || child.endDate || child.end || child.ending || child.mahadasha_ending;
            }
            return mappedChild;
        });
    }

    const sDate = myStartDateRaw;
    const eDate = node.end_date || node.endDate || node.end || node.ending || node.mahadasha_ending;
    const isCurrent = isDateRangeCurrent(sDate, eDate);
    const hasChildren = mappedChildren.length > 0;

    return {
        // Robust planet name fallbacks for specialized systems
        planet: node.planet || node.lord || node.mahadasha || node.mahadasha_lord || node.antardasha_lord || node.antar_lord || node.lord_name || node.sign || 'Unknown',
        startDate: sDate,
        endDate: eDate,
        isCurrent,
        canDrillFurther: level < maxLevel && hasChildren,
        sublevel: level < maxLevel ? mappedChildren : [],
        raw: node
    };
}

/**
 * Process the full API response into a standardized Dasha tree.
 * robustly handling missing start dates and verifying structure.
 */
export function processDashaResponse(data: any, maxLevel: number = 4): DashaNode[] {
    if (!data) return [];

    const periods = extractPeriodsArray(data);
    if (periods.length === 0) return [];

    let currentStart = '';

    // Seed the waterfall with the first available date if needed
    if (periods.length > 0 && !periods[0].start_date) {
        // Simple search for any start date to anchor (simplified)
        const first = periods[0];
        const s = first.start_date || first.start;
        if (!s) {
            if (first.antardashas?.[0]?.start_date) currentStart = first.antardashas[0].start_date;
            else if (first.antardashas?.[0]?.start) currentStart = first.antardashas[0].start;
            else if (first.sublevels?.[0]?.start_date) currentStart = first.sublevels[0].start_date;
            else if (first.sublevels?.[0]?.start) currentStart = first.sublevels[0].start;
        } else {
            currentStart = s;
        }
    }

    return periods.map((m: any) => {
        // Handle varying date keys (Tribhagi uses 'start', others 'start_date')
        const s = m.start_date || m.start;
        if (s) currentStart = s;

        const mapped = mapDashaLevelRecursive(m, 0, currentStart, maxLevel);

        const e = m.end_date || m.end;
        if (e) currentStart = e;

        return mapped;
    });
}

/**
 * Standardize a level of periods for the table view.
 * Logic: missing start_date = end_date of previous sibling or parent start.
 */
export function standardizeDashaLevels(periods: any[], parentStartDate?: string): DashaNode[] {
    // If periods are already processed DashaNodes (have sublevel etc), just return them
    // This allows the UI to handle both raw and processed arrays seamlessly
    if (periods.length > 0 && (periods[0].sublevel !== undefined || periods[0].canDrillFurther !== undefined)) {
        return periods as DashaNode[];
    }

    if (!Array.isArray(periods)) return [];

    const now = new Date();
    let currentChainStart = parentStartDate || "";

    return periods.map((p) => {
        const sDate = p.start_date || p.startDate || p.start || currentChainStart;
        const eDate = p.end_date || p.endDate || p.end;

        // Advance currentChainStart for the next sibling
        if (eDate) currentChainStart = eDate;

        // Check if this period has nested sub-levels for drill-down
        const sublevels = p.antardashas || p.pratyantardashas || p.sookshma_dashas || p.pran_dashas || p.sublevels;
        const canDrillFurther = Array.isArray(sublevels) && sublevels.length > 0;

        // Standardize Duration Display (if engine provides duration_years)
        // Note: standardizeDuration is imported from above? No, it's defined in this file.
        // But for DashaNode structure we don't strictly need it in the node object unless UI uses it.
        // The UI calculates it or expects d.duration string.
        // We'll leave it as calculated by the UI usually, or pass raw values.
        const isCurrent = sDate && eDate ? (now >= parseApiDate(sDate) && now <= parseApiDate(eDate)) : false;
        const displayDuration = ''; // Placeholder, as duration calculation is complex and often done in UI or a dedicated helper

        return {
            planet: p.planet || p.lord || p.sign || 'Unknown',
            startDate: sDate,
            endDate: eDate,
            duration: displayDuration,
            isCurrent,
            canDrillFurther,
            raw: p
        };
    });
}

/**
 * Planet Metadata & Interpretations (Ported from Senior Knowledge Base)
 */
export const PLANET_INTEL: Record<string, any> = {
    Sun: {
        nature: 'Malefic (Natural)',
        themes: ['Authority', 'Soul', 'Father', 'Government'],
        advice: 'Period of self-realization and recognition. Focus on discipline and leadership.',
        tip: 'Best period for soul-searching and starting new ventures. Avoid excessive ego.'
    },
    Moon: {
        nature: 'Benefic (Natural)',
        themes: ['Mind', 'Emotions', 'Mother', 'Public Affairs'],
        advice: 'Focus on mental health and home peace. Good for emotional growth.',
        tip: 'Excellent for traveling and connecting with the public. Maintain emotional balance.'
    },
    Mars: {
        nature: 'Malefic (Natural)',
        themes: ['Energy', 'Siblings', 'Property', 'Courage'],
        advice: 'High energy period. Watch for accidents or conflicts. Channel energy into property.',
        tip: 'Good for sports and competitive activities. Stay calm to avoid unnecessary fights.'
    },
    Mercury: {
        nature: 'Neutral',
        themes: ['Business', 'Speech', 'Logic', 'Intelligence'],
        advice: 'Intellectual growth favors education and business. Communication is key.',
        tip: 'Best for learning new skills and network building. Verify details before signing.'
    },
    Jupiter: {
        nature: 'Benefic (Natural)',
        themes: ['Wisdom', 'Growth', 'Wealth', 'Dharma'],
        advice: 'Auspicious period for growth and wisdom. Spiritual progress is likely.',
        tip: 'Best period for education, marriage, and spiritual growth. Wear yellow sapphire for enhanced results.'
    },
    Venus: {
        nature: 'Benefic (Natural)',
        themes: ['Luxury', 'Arts', 'Love', 'Vehicles'],
        advice: 'Period of comfort and material prosperity. Relationships flourish.',
        tip: 'Focus on harmony in partnerships. Excellent for creative hobbies and luxury purchases.'
    },
    Saturn: {
        nature: 'Malefic (Natural)',
        themes: ['Karma', 'Discipline', 'Delay', 'Service'],
        advice: 'Period of hard work and discipline. Long-term results through patience.',
        tip: 'Stay consistent and disciplined. Blue sapphire may help if Saturn is well-placed.'
    },
    Rahu: {
        nature: 'Malefic (Node)',
        themes: ['Foreign', 'Obsession', 'Illusion', 'Technology'],
        advice: 'Period of materialistic pursuits and foreign connections. Watch for deception.',
        tip: 'Good for technical fields. Avoid shortcuts and unconventional obsessions.'
    },
    Ketu: {
        nature: 'Malefic (Node)',
        themes: ['Spiritual', 'Detachment', 'Moksha', 'Intuition'],
        advice: 'Spiritual detachment and potential for losses. Focus on inner peace.',
        tip: 'Great for meditation and occult studies. Let go of past baggage.'
    },
};

// Vimshottari Constants
export const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
const PLANET_YEARS: Record<string, number> = {
    'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
    'Saturn': 19, 'Mercury': 17, 'Ketu': 7, 'Venus': 20
};
const VIMSHOTTARI_CYCLE_YEARS = 120;

/**
 * Generate sub-periods for a Vimshottari period on the fly.
 * Used when API data is truncated (e.g. Sookshma/Prana levels missing).
 */
export function generateVimshottariSubperiods(parent: DashaNode): DashaNode[] {
    if (!parent || !parent.planet || !parent.startDate || !parent.endDate) return [];

    const parentPlanet = parent.planet;
    // Map irregular planet names if necessary (e.g. 'Rahu (Node)' -> 'Rahu')
    const cleanPlanet = parentPlanet.split(' ')[0];
    const startIdx = PLANET_ORDER.indexOf(cleanPlanet);

    if (startIdx === -1) return []; // Not a standard planet

    // Reorder planets starting from the parent Lord
    const orderedPlanets = [...PLANET_ORDER.slice(startIdx), ...PLANET_ORDER.slice(0, startIdx)];

    // Calculate total duration in ms
    const start = parseApiDate(parent.startDate);
    const end = parseApiDate(parent.endDate);
    const totalDurationMs = end.getTime() - start.getTime();

    // Generate sub-periods
    let currentStart = start;
    const subPeriods: DashaNode[] = orderedPlanets.map(planet => {
        // Duration is proportional to the planet's Vimsottari years
        // Proportion = PlanetYears / 120
        const proportion = (PLANET_YEARS[planet] || 0) / VIMSHOTTARI_CYCLE_YEARS;
        const durationMs = totalDurationMs * proportion;

        const periodStart = new Date(currentStart);
        const periodEnd = new Date(periodStart.getTime() + durationMs);

        // Update generic currentStart for next iteration
        currentStart = periodEnd;

        const sStr = toApiDateString(periodStart);
        const eStr = toApiDateString(periodEnd);

        return {
            planet,
            startDate: sStr,
            endDate: eStr,
            isCurrent: isDateRangeCurrent(sStr, eStr),
            canDrillFurther: true, // Generated nodes can always be drilled further mathametically
            sublevel: [],
            raw: { generated: true }
        };
    });

    return subPeriods;
}

function toApiDateString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}