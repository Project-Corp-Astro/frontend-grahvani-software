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

    const mahadashas = rawResponse.mahadashas || [];
    let currentLevel = mahadashas;
    let foundNode: any = null;
    let foundStart: string = "";
    let parentStart: string = "";

    // Traverse down the hierarchy
    while (currentLevel && Array.isArray(currentLevel)) {
        let activeNode: any = null;
        let chainStart = parentStart;

        for (const p of currentLevel) {
            const s = p.start_date || p.startDate || chainStart;
            const e = p.end_date || p.endDate;

            if (s && e && now >= new Date(s) && now <= new Date(e)) {
                activeNode = p;
                activeNode._calculated_start = s;
                break;
            }
            if (e) chainStart = e;
        }

        if (!activeNode) break;

        const sDate = activeNode._calculated_start;
        const eDate = activeNode.end_date || activeNode.endDate;

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
        currentLevel = activeNode.antardashas || activeNode.pratyantardashas || activeNode.sookshma_dashas || activeNode.pran_dashas || activeNode.sublevels;
    }

    // Calculate progress for the current (deepest) active node
    let progress = 0;
    if (foundNode) {
        const start = new Date(foundNode._calculated_start || foundNode.start_date || foundNode.startDate).getTime();
        const end = new Date(foundNode.end_date || foundNode.endDate).getTime();
        const nowMs = now.getTime();
        if (end > start) {
            progress = Math.max(0, Math.min(100, Math.round(((nowMs - start) / (end - start)) * 100)));
        }
    }

    return { nodes: path, progress, metadata };
}

/**
 * Standardize durations like "2y 1m 5d" -> "2y 1m" or "2y" for clean UI
 */
export function standardizeDuration(years: number, days?: number): string {
    if (years > 0) {
        const decimal = years - Math.floor(years);
        if (decimal === 0) return `${years}y`;
        return `${Math.floor(years)}y ${Math.round(decimal * 12)}m`;
    }
    if (days && days > 0) {
        if (days > 30) return `${Math.floor(days / 30)}m ${days % 30}d`;
        return `${days}d`;
    }
    return "—";
}

/**
 * Standardize a level of periods for the table view.
 * Logic: missing start_date = end_date of previous sibling or parent start.
 */
export function standardizeDashaLevels(periods: any[], parentStartDate?: string): DashaNode[] {
    if (!Array.isArray(periods)) return [];

    const now = new Date();
    let currentChainStart = parentStartDate || "";

    return periods.map((p) => {
        const sDate = p.start_date || p.startDate || currentChainStart;
        const eDate = p.end_date || p.endDate;

        // Advance currentChainStart for the next sibling
        if (eDate) currentChainStart = eDate;

        return {
            planet: p.planet || p.lord || p.sign,
            startDate: sDate,
            endDate: eDate,
            isCurrent: sDate && eDate ? (now >= new Date(sDate) && now <= new Date(eDate)) : false,
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
