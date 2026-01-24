"use client";

import React, { useState, useMemo } from 'react';
import {
    TrendingUp, Info, ChevronRight, ChevronLeft, ChevronDown,
    Calendar, Star, Clock, Printer, Download, FileText,
    User, MapPin, Sun, Moon as MoonIcon
} from 'lucide-react';

// =============================================================================
// MOCK DATA - Senior Astrologer's Test Cases
// =============================================================================

const MOCK_CLIENTS = [
    {
        id: '1',
        name: 'Ramesh Kumar',
        birthDate: '15 Aug 1985',
        birthTime: '10:30 AM',
        birthPlace: 'Mumbai, Maharashtra',
        moonSign: 'Taurus',
        nakshatra: 'Rohini',
        lagnaSign: 'Libra',
        currentAge: 40,
    },
    {
        id: '2',
        name: 'Priya Sharma',
        birthDate: '22 Mar 1990',
        birthTime: '02:15 PM',
        birthPlace: 'Delhi, NCR',
        moonSign: 'Scorpio',
        nakshatra: 'Anuradha',
        lagnaSign: 'Cancer',
        currentAge: 35,
    },
    {
        id: '3',
        name: 'Arun Patel',
        birthDate: '08 Nov 1978',
        birthTime: '06:45 AM',
        birthPlace: 'Ahmedabad, Gujarat',
        moonSign: 'Pisces',
        nakshatra: 'Revati',
        lagnaSign: 'Scorpio',
        currentAge: 47,
    },
];

// Vimshottari Dasha Periods with full 5-level data
const VIMSHOTTARI_DATA = {
    mahadashas: [
        {
            planet: 'Moon',
            startDate: '15-08-1985',
            endDate: '15-08-1995',
            years: 10,
            antardashas: [
                { planet: 'Moon', startDate: '15-08-1985', endDate: '15-06-1986', months: 10 },
                { planet: 'Mars', startDate: '15-06-1986', endDate: '15-01-1987', months: 7 },
                { planet: 'Rahu', startDate: '15-01-1987', endDate: '15-07-1988', months: 18 },
                { planet: 'Jupiter', startDate: '15-07-1988', endDate: '15-11-1989', months: 16 },
                { planet: 'Saturn', startDate: '15-11-1989', endDate: '15-06-1991', months: 19 },
                { planet: 'Mercury', startDate: '15-06-1991', endDate: '15-11-1992', months: 17 },
                { planet: 'Ketu', startDate: '15-11-1992', endDate: '15-06-1993', months: 7 },
                { planet: 'Venus', startDate: '15-06-1993', endDate: '15-02-1995', months: 20 },
                { planet: 'Sun', startDate: '15-02-1995', endDate: '15-08-1995', months: 6 },
            ]
        },
        {
            planet: 'Mars',
            startDate: '15-08-1995',
            endDate: '15-08-2002',
            years: 7,
            antardashas: [
                { planet: 'Mars', startDate: '15-08-1995', endDate: '15-01-1996', months: 5 },
                { planet: 'Rahu', startDate: '15-01-1996', endDate: '15-02-1997', months: 13 },
                { planet: 'Jupiter', startDate: '15-02-1997', endDate: '15-01-1998', months: 11 },
                { planet: 'Saturn', startDate: '15-01-1998', endDate: '15-02-1999', months: 13 },
                { planet: 'Mercury', startDate: '15-02-1999', endDate: '15-02-2000', months: 12 },
                { planet: 'Ketu', startDate: '15-02-2000', endDate: '15-07-2000', months: 5 },
                { planet: 'Venus', startDate: '15-07-2000', endDate: '15-09-2001', months: 14 },
                { planet: 'Sun', startDate: '15-09-2001', endDate: '15-01-2002', months: 4 },
                { planet: 'Moon', startDate: '15-01-2002', endDate: '15-08-2002', months: 7 },
            ]
        },
        {
            planet: 'Rahu',
            startDate: '15-08-2002',
            endDate: '15-08-2020',
            years: 18,
            isCurrent: false,
            antardashas: [
                { planet: 'Rahu', startDate: '15-08-2002', endDate: '15-04-2005', months: 32 },
                { planet: 'Jupiter', startDate: '15-04-2005', endDate: '15-09-2007', months: 29 },
                { planet: 'Saturn', startDate: '15-09-2007', endDate: '15-07-2010', months: 34 },
                { planet: 'Mercury', startDate: '15-07-2010', endDate: '15-02-2013', months: 31 },
                { planet: 'Ketu', startDate: '15-02-2013', endDate: '15-02-2014', months: 12 },
                { planet: 'Venus', startDate: '15-02-2014', endDate: '15-02-2017', months: 36 },
                { planet: 'Sun', startDate: '15-02-2017', endDate: '15-01-2018', months: 11 },
                { planet: 'Moon', startDate: '15-01-2018', endDate: '15-07-2019', months: 18 },
                { planet: 'Mars', startDate: '15-07-2019', endDate: '15-08-2020', months: 13 },
            ]
        },
        {
            planet: 'Jupiter',
            startDate: '15-08-2020',
            endDate: '15-08-2036',
            years: 16,
            isCurrent: true,
            antardashas: [
                { planet: 'Jupiter', startDate: '15-08-2020', endDate: '15-10-2022', months: 26 },
                { planet: 'Saturn', startDate: '15-10-2022', endDate: '15-04-2025', months: 30, isCurrent: true },
                { planet: 'Mercury', startDate: '15-04-2025', endDate: '15-07-2027', months: 27 },
                { planet: 'Ketu', startDate: '15-07-2027', endDate: '15-06-2028', months: 11 },
                { planet: 'Venus', startDate: '15-06-2028', endDate: '15-02-2031', months: 32 },
                { planet: 'Sun', startDate: '15-02-2031', endDate: '15-12-2031', months: 10 },
                { planet: 'Moon', startDate: '15-12-2031', endDate: '15-04-2033', months: 16 },
                { planet: 'Mars', startDate: '15-04-2033', endDate: '15-03-2034', months: 11 },
                { planet: 'Rahu', startDate: '15-03-2034', endDate: '15-08-2036', months: 29 },
            ]
        },
        {
            planet: 'Saturn',
            startDate: '15-08-2036',
            endDate: '15-08-2055',
            years: 19,
            antardashas: [
                { planet: 'Saturn', startDate: '15-08-2036', endDate: '15-08-2039', months: 36 },
                { planet: 'Mercury', startDate: '15-08-2039', endDate: '15-05-2042', months: 33 },
                { planet: 'Ketu', startDate: '15-05-2042', endDate: '15-06-2043', months: 13 },
                { planet: 'Venus', startDate: '15-06-2043', endDate: '15-08-2046', months: 38 },
                { planet: 'Sun', startDate: '15-08-2046', endDate: '15-08-2047', months: 12 },
                { planet: 'Moon', startDate: '15-08-2047', endDate: '15-03-2049', months: 19 },
                { planet: 'Mars', startDate: '15-03-2049', endDate: '15-04-2050', months: 13 },
                { planet: 'Rahu', startDate: '15-04-2050', endDate: '15-02-2053', months: 34 },
                { planet: 'Jupiter', startDate: '15-02-2053', endDate: '15-08-2055', months: 30 },
            ]
        },
        { planet: 'Mercury', startDate: '15-08-2055', endDate: '15-08-2072', years: 17 },
        { planet: 'Ketu', startDate: '15-08-2072', endDate: '15-08-2079', years: 7 },
        { planet: 'Venus', startDate: '15-08-2079', endDate: '15-08-2099', years: 20 },
        { planet: 'Sun', startDate: '15-08-2099', endDate: '15-08-2105', years: 6 },
    ]
};

// All 11 Dasha Systems metadata
const DASHA_SYSTEMS = [
    { id: 'vimshottari', name: 'Vimshottari', years: 120, category: 'primary', applicable: true, desc: 'Universal Moon-nakshatra based' },
    { id: 'tribhagi', name: 'Tribhagi', years: 40, category: 'conditional', applicable: true, desc: 'One-third of Vimshottari' },
    { id: 'shodashottari', name: 'Shodashottari', years: 116, category: 'conditional', applicable: true, desc: 'Venus in 9th + Lagna hora' },
    { id: 'dwadashottari', name: 'Dwadashottari', years: 112, category: 'conditional', applicable: true, desc: 'Venus in Lagna' },
    { id: 'panchottari', name: 'Panchottari', years: 105, category: 'conditional', applicable: true, desc: 'Cancer Lagna + Dhanishtha' },
    { id: 'chaturshitisama', name: 'Chaturshitisama', years: 84, category: 'conditional', applicable: false, desc: '10th lord in 10th' },
    { id: 'satabdika', name: 'Satabdika', years: 100, category: 'conditional', applicable: true, desc: 'Vargottama Lagna' },
    { id: 'dwisaptati', name: 'Dwisaptati Sama', years: 72, category: 'conditional', applicable: true, desc: 'Lagna lord in 7th' },
    { id: 'shastihayani', name: 'Shastihayani', years: 60, category: 'conditional', applicable: false, desc: 'Sun in Lagna' },
    { id: 'shattrimshatsama', name: 'Shattrimshatsama', years: 36, category: 'conditional', applicable: false, desc: 'Daytime + Moon in Lagna' },
    { id: 'chara', name: 'Chara (Jaimini)', years: 0, category: 'jaimini', applicable: true, desc: 'Sign-based system' },
];

// Planet interpretations (Senior Astrologer's knowledge base)
const PLANET_INTERPRETATIONS: Record<string, {
    nature: string;
    keywords: string[];
    general: string;
    houses?: string;
}> = {
    Sun: {
        nature: 'Malefic (Natural)',
        keywords: ['Authority', 'Father', 'Government', 'Soul', 'Vitality'],
        general: 'Period of self-realization, authority, and recognition. May bring prominence but also ego challenges.',
    },
    Moon: {
        nature: 'Benefic (Natural)',
        keywords: ['Mother', 'Mind', 'Emotions', 'Public', 'Travel'],
        general: 'Emotional period with focus on mental peace, mother, and home. Good for public dealings.',
    },
    Mars: {
        nature: 'Malefic (Natural)',
        keywords: ['Energy', 'Siblings', 'Property', 'Courage', 'Conflicts'],
        general: 'Dynamic period with increased energy. Watch for accidents, conflicts. Good for property matters.',
    },
    Mercury: {
        nature: 'Neutral',
        keywords: ['Communication', 'Business', 'Intelligence', 'Learning', 'Skin'],
        general: 'Intellectual period favoring education, communication, and business activities.',
    },
    Jupiter: {
        nature: 'Benefic (Natural)',
        keywords: ['Wisdom', 'Children', 'Fortune', 'Dharma', 'Teacher'],
        general: 'Auspicious period for growth, wisdom, children, and spiritual progress. Generally favorable.',
        houses: 'Rules 3rd & 6th houses in this chart',
    },
    Venus: {
        nature: 'Benefic (Natural)',
        keywords: ['Marriage', 'Luxury', 'Arts', 'Vehicles', 'Relationships'],
        general: 'Period of comfort, relationships, and material prosperity. Good for marriage and partnerships.',
    },
    Saturn: {
        nature: 'Malefic (Natural)',
        keywords: ['Discipline', 'Delays', 'Karma', 'Service', 'Long-term'],
        general: 'Period of hard work, discipline, and karmic lessons. Delays possible but long-term gains.',
        houses: 'Rules 4th & 5th houses in this chart',
    },
    Rahu: {
        nature: 'Malefic (Node)',
        keywords: ['Foreign', 'Unconventional', 'Obsession', 'Technology', 'Illusion'],
        general: 'Period of materialistic pursuits, foreign connections. Watch for deception and obsessions.',
    },
    Ketu: {
        nature: 'Malefic (Node)',
        keywords: ['Spirituality', 'Detachment', 'Past Karma', 'Losses', 'Liberation'],
        general: 'Spiritual period with potential for detachment and losses. Good for moksha pursuits.',
    },
};

// Level configuration
const DASHA_LEVELS = [
    { id: 'mahadasha', name: 'Mahadasha', short: 'Maha' },
    { id: 'antardasha', name: 'Antardasha', short: 'Antar' },
    { id: 'pratyantardasha', name: 'Pratyantardasha', short: 'Pratyantar' },
    { id: 'sookshmadasha', name: 'Sookshma', short: 'Sookshma' },
    { id: 'pranadasha', name: 'Prana', short: 'Prana' },
];

// Planet colors
const PLANET_COLORS: Record<string, string> = {
    Sun: 'bg-orange-100 text-orange-800 border-orange-300',
    Moon: 'bg-slate-100 text-slate-700 border-slate-300',
    Mars: 'bg-red-100 text-red-800 border-red-300',
    Mercury: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Jupiter: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Venus: 'bg-pink-100 text-pink-800 border-pink-300',
    Saturn: 'bg-gray-200 text-gray-800 border-gray-400',
    Rahu: 'bg-purple-100 text-purple-800 border-purple-300',
    Ketu: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const parseDate = (dateStr: string): Date => {
    const [d, m, y] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const formatDateShort = (dateStr: string): string => {
    const date = parseDate(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculateProgress = (startDate: string, endDate: string): number => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
};

const getDaysRemaining = (endDate: string): number => {
    const end = parseDate(endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
};

// =============================================================================
// COMPONENTS
// =============================================================================

export default function DashaDemoPage() {
    // State
    const [selectedClientId, setSelectedClientId] = useState(MOCK_CLIENTS[0].id);
    const [selectedDashaSystem, setSelectedDashaSystem] = useState('vimshottari');
    const [currentLevel, setCurrentLevel] = useState(0); // 0 = Mahadasha, 1 = Antardasha, etc.
    const [selectedPath, setSelectedPath] = useState<string[]>([]); // ['Jupiter', 'Saturn'] = Jupiter Maha > Saturn Antar
    const [selectedPeriodForInfo, setSelectedPeriodForInfo] = useState<string>('Jupiter');

    // Derived data
    const selectedClient = MOCK_CLIENTS.find(c => c.id === selectedClientId) || MOCK_CLIENTS[0];
    const selectedSystem = DASHA_SYSTEMS.find(s => s.id === selectedDashaSystem) || DASHA_SYSTEMS[0];

    // Get current viewing periods based on drill-down level
    // For levels beyond Antardasha, we generate sub-periods dynamically
    const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];

    const generateSubPeriods = (parentPlanet: string, level: number, startDate: string, endDate: string) => {
        // Generate proportional sub-periods for any level
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        // Find starting planet index based on parent
        const startIdx = PLANET_ORDER.indexOf(parentPlanet);
        const orderedPlanets = [...PLANET_ORDER.slice(startIdx), ...PLANET_ORDER.slice(0, startIdx)];

        // Calculate proportional durations (simplified Vimshottari ratios)
        const ratios: Record<string, number> = {
            'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
            'Saturn': 19, 'Mercury': 17, 'Ketu': 7, 'Venus': 20
        };
        const totalRatio = Object.values(ratios).reduce((a, b) => a + b, 0);

        let currentDate = new Date(start);
        return orderedPlanets.map((planet, idx) => {
            const periodDays = (ratios[planet] / totalRatio) * totalDays;
            const periodStart = new Date(currentDate);
            currentDate = new Date(currentDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
            const periodEnd = new Date(currentDate);

            // Check if this is the current period (contains today)
            const now = new Date();
            const isCurrent = periodStart <= now && now <= periodEnd;

            return {
                planet,
                startDate: `${periodStart.getDate().toString().padStart(2, '0')}-${(periodStart.getMonth() + 1).toString().padStart(2, '0')}-${periodStart.getFullYear()}`,
                endDate: `${periodEnd.getDate().toString().padStart(2, '0')}-${(periodEnd.getMonth() + 1).toString().padStart(2, '0')}-${periodEnd.getFullYear()}`,
                days: Math.round(periodDays),
                isCurrent,
                canDrillFurther: level < 4, // Can drill up to level 4 (Prana)
            };
        });
    };

    const viewingPeriods = useMemo(() => {
        if (selectedDashaSystem !== 'vimshottari') {
            // For non-Vimshottari, return simplified mock data
            return VIMSHOTTARI_DATA.mahadashas.slice(0, 5).map(m => ({
                planet: m.planet,
                startDate: m.startDate,
                endDate: m.endDate,
                years: m.years || 0,
                isCurrent: m.isCurrent,
                canDrillFurther: false,
            }));
        }

        // Level 0: Mahadashas
        if (currentLevel === 0) {
            return VIMSHOTTARI_DATA.mahadashas.map(m => ({
                ...m,
                canDrillFurther: true,
            }));
        }

        // Level 1: Antardashas (use pre-defined data)
        if (currentLevel === 1 && selectedPath.length >= 1) {
            const maha = VIMSHOTTARI_DATA.mahadashas.find(m => m.planet === selectedPath[0]);
            if (maha?.antardashas) {
                return maha.antardashas.map(a => ({
                    ...a,
                    canDrillFurther: true,
                }));
            }
        }

        // Levels 2-4: Generate dynamically based on parent period
        if (currentLevel >= 2 && selectedPath.length >= 2) {
            // Get the parent period's dates
            const maha = VIMSHOTTARI_DATA.mahadashas.find(m => m.planet === selectedPath[0]);
            const antar = maha?.antardashas?.find(a => a.planet === selectedPath[1]);

            if (antar) {
                let parentStart = antar.startDate;
                let parentEnd = antar.endDate;
                let parentPlanet = selectedPath[selectedPath.length - 1];

                // For deeper levels, we recursively subdivide
                // This is a simplification - real calculation would be more complex
                const subPeriods = generateSubPeriods(parentPlanet, currentLevel, parentStart, parentEnd);

                // For level 3+, further subdivide from the previous level's selected period
                if (currentLevel >= 3 && selectedPath.length >= 3) {
                    // Find the selected sub-period from previous level and subdivide that
                    const prevLevelPeriods = generateSubPeriods(selectedPath[1], 2, antar.startDate, antar.endDate);
                    const selectedPratyantar = prevLevelPeriods.find(p => p.planet === selectedPath[2]);
                    if (selectedPratyantar) {
                        return generateSubPeriods(selectedPath[2], currentLevel, selectedPratyantar.startDate, selectedPratyantar.endDate);
                    }
                }

                return subPeriods;
            }
        }

        return VIMSHOTTARI_DATA.mahadashas;
    }, [selectedDashaSystem, currentLevel, selectedPath]);

    // Current running periods
    const currentMaha = VIMSHOTTARI_DATA.mahadashas.find(m => m.isCurrent);
    const currentAntar = currentMaha?.antardashas?.find((a: any) => a.isCurrent);

    // Handlers
    const handleDrillDown = (planet: string) => {
        if (selectedDashaSystem !== 'vimshottari') return;
        if (currentLevel < 4) {
            setSelectedPath([...selectedPath, planet]);
            setCurrentLevel(currentLevel + 1);
            setSelectedPeriodForInfo(planet);
        }
    };

    const handleDrillUp = () => {
        if (currentLevel > 0) {
            setSelectedPath(selectedPath.slice(0, -1));
            setCurrentLevel(currentLevel - 1);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setSelectedPath([]);
            setCurrentLevel(0);
        } else {
            setSelectedPath(selectedPath.slice(0, index + 1));
            setCurrentLevel(index + 1);
        }
    };

    const handleSystemChange = (systemId: string) => {
        setSelectedDashaSystem(systemId);
        setCurrentLevel(0);
        setSelectedPath([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE4]">
            <div className="max-w-[1600px] mx-auto p-4 space-y-4">

                {/* ================================================================= */}
                {/* HEADER: Client Selector + Quick Actions */}
                {/* ================================================================= */}
                <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Client Selector */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-[#D08C60]" />
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    className="bg-[#FAF7F2] border border-[#D08C60]/30 rounded-xl px-4 py-2 text-[#3E2A1F] font-medium focus:outline-none focus:ring-2 focus:ring-[#D08C60]/40 cursor-pointer"
                                >
                                    {MOCK_CLIENTS.map(client => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Client Quick Info */}
                            <div className="hidden md:flex items-center gap-4 text-sm text-[#8B5A2B] border-l border-[#D08C60]/20 pl-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {selectedClient.birthDate}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {selectedClient.birthTime}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {selectedClient.birthPlace}
                                </span>
                                <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-xs font-bold rounded-full">
                                    Age: {selectedClient.currentAge}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-[#3E2A1F] text-white text-xs font-bold rounded-full">
                                LAHIRI
                            </span>
                            <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Print">
                                <Printer className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Export PDF">
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-[#D08C60]/10 text-[#8B5A2B]" title="Add Notes">
                                <FileText className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Birth Details Row (Mobile) */}
                    <div className="md:hidden mt-3 pt-3 border-t border-[#D08C60]/10 flex flex-wrap gap-3 text-xs text-[#8B5A2B]">
                        <span className="flex items-center gap-1"><MoonIcon className="w-3 h-3" /> {selectedClient.moonSign}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {selectedClient.nakshatra}</span>
                        <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Lagna: {selectedClient.lagnaSign}</span>
                    </div>
                </div>

                {/* ================================================================= */}
                {/* CURRENT PERIOD CARD - Always Visible, Most Important! */}
                {/* ================================================================= */}
                <div className="bg-gradient-to-r from-[#3E2A1F] to-[#5A3E2B] rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <h2 className="font-serif font-bold text-lg">Current Running Dasha</h2>
                        <span className="ml-auto text-xs bg-green-500 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            ● LIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Mahadasha */}
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Mahadasha</p>
                            <p className="text-2xl font-bold text-yellow-300">{currentMaha?.planet || 'Jupiter'}</p>
                            <p className="text-xs text-white/60 mt-1">
                                {currentMaha?.startDate ? formatDateShort(currentMaha.startDate) : '15 Aug 2020'} - {currentMaha?.endDate ? formatDateShort(currentMaha.endDate) : '15 Aug 2036'}
                            </p>
                        </div>
                        {/* Antardasha */}
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Antardasha</p>
                            <p className="text-2xl font-bold text-orange-300">{currentAntar?.planet || 'Saturn'}</p>
                            <p className="text-xs text-white/60 mt-1">
                                {currentAntar?.startDate ? formatDateShort(currentAntar.startDate) : '15 Oct 2022'} - {currentAntar?.endDate ? formatDateShort(currentAntar.endDate) : '15 Apr 2025'}
                            </p>
                        </div>
                        {/* Pratyantardasha */}
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Pratyantardasha</p>
                            <p className="text-2xl font-bold text-pink-300">Mercury</p>
                            <p className="text-xs text-white/60 mt-1">15 Jan 2026 - 15 Mar 2026</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex justify-between text-xs mb-2">
                            <span>Jupiter Mahadasha Progress</span>
                            <span className="font-bold">{Math.round(calculateProgress('15-08-2020', '15-08-2036'))}% complete</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                                style={{ width: `${calculateProgress('15-08-2020', '15-08-2036')}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-white/60">
                            <span>Started: 15 Aug 2020</span>
                            <span className="text-yellow-300 font-bold">
                                {getDaysRemaining('15-08-2036').toLocaleString()} days remaining
                            </span>
                            <span>Ends: 15 Aug 2036</span>
                        </div>
                    </div>
                </div>

                {/* ================================================================= */}
                {/* MAIN CONTENT AREA */}
                {/* ================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* LEFT: Dasha Table (2 columns) */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Dasha System Selector + Level Tabs */}
                        <div className="bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-[#D08C60]/10 flex flex-wrap items-center justify-between gap-4">
                                {/* System Selector */}
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">System</label>
                                    <div className="relative">
                                        <select
                                            value={selectedDashaSystem}
                                            onChange={(e) => handleSystemChange(e.target.value)}
                                            className="appearance-none bg-[#FAF7F2] border border-[#D08C60]/30 rounded-xl px-4 py-2 pr-10 text-[#3E2A1F] font-medium focus:outline-none focus:ring-2 focus:ring-[#D08C60]/40 cursor-pointer min-w-[200px]"
                                        >
                                            <optgroup label="Primary">
                                                <option value="vimshottari">① Vimshottari (120 yrs)</option>
                                            </optgroup>
                                            <optgroup label="Conditional">
                                                {DASHA_SYSTEMS.filter(s => s.category === 'conditional').map((s, idx) => (
                                                    <option key={s.id} value={s.id} disabled={!s.applicable}>
                                                        {`②③④⑤⑥⑦⑧⑨⑩`[idx]} {s.name} ({s.years} yrs) {!s.applicable ? '❌' : ''}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Jaimini">
                                                <option value="chara">⑪ Chara - Sign Based</option>
                                            </optgroup>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5A2B] pointer-events-none" />
                                    </div>
                                </div>

                                {/* Level Tabs (Vimshottari only) */}
                                {selectedDashaSystem === 'vimshottari' && (
                                    <div className="flex gap-1 overflow-x-auto">
                                        {DASHA_LEVELS.map((level, idx) => (
                                            <button
                                                key={level.id}
                                                onClick={() => handleBreadcrumbClick(idx - 1)}
                                                disabled={idx > currentLevel}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${idx === currentLevel
                                                    ? 'bg-[#D08C60] text-white'
                                                    : idx < currentLevel
                                                        ? 'bg-[#D08C60]/20 text-[#D08C60] cursor-pointer hover:bg-[#D08C60]/30'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {level.short}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Breadcrumb Navigation */}
                            {selectedDashaSystem === 'vimshottari' && selectedPath.length > 0 && (
                                <div className="px-4 py-2 bg-[#FAF7F2] border-b border-[#D08C60]/10 flex items-center gap-2 text-sm overflow-x-auto">
                                    <button
                                        onClick={() => handleBreadcrumbClick(-1)}
                                        className="flex items-center gap-1 text-[#D08C60] hover:underline"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        All Mahadashas
                                    </button>
                                    {selectedPath.map((planet, idx) => (
                                        <React.Fragment key={idx}>
                                            <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                            <button
                                                onClick={() => handleBreadcrumbClick(idx)}
                                                className={`px-2 py-0.5 rounded font-medium ${PLANET_COLORS[planet] || 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {planet} {DASHA_LEVELS[idx]?.short}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                    <ChevronRight className="w-4 h-4 text-[#8B5A2B]/40" />
                                    <span className="text-[#D08C60] font-bold">{DASHA_LEVELS[currentLevel]?.name}</span>
                                </div>
                            )}

                            {/* Periods Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#3E2A1F]/5">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#5A3E2B]/70">
                                                {currentLevel === 0 ? 'Mahadasha Lord' : DASHA_LEVELS[currentLevel]?.name + ' Lord'}
                                            </th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#5A3E2B]/70">Start</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#5A3E2B]/70">End</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#5A3E2B]/70">Duration</th>
                                            {selectedDashaSystem === 'vimshottari' && (
                                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#5A3E2B]/70">Drill</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D08C60]/10">
                                        {viewingPeriods.map((period: any, idx: number) => {
                                            const isCurrent = period.isCurrent;
                                            const canDrill = selectedDashaSystem === 'vimshottari' && currentLevel < 4 && period.canDrillFurther;

                                            return (
                                                <tr
                                                    key={idx}
                                                    className={`hover:bg-[#D08C60]/5 transition-colors ${isCurrent ? 'bg-green-50' : ''} ${canDrill ? 'cursor-pointer' : ''}`}
                                                    onClick={() => {
                                                        setSelectedPeriodForInfo(period.planet);
                                                        if (canDrill) handleDrillDown(period.planet);
                                                    }}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${PLANET_COLORS[period.planet] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                                                {period.planet}
                                                            </span>
                                                            {isCurrent && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-300 animate-pulse">
                                                                    ● ACTIVE
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-[#3E2A1F] font-mono">
                                                        {formatDateShort(period.startDate)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-[#3E2A1F] font-mono">
                                                        {formatDateShort(period.endDate)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-[#8B5A2B]">
                                                        {period.years ? `${period.years} years` : period.months ? `${period.months} months` : period.days ? `${period.days} days` : '—'}
                                                    </td>
                                                    {selectedDashaSystem === 'vimshottari' && (
                                                        <td className="px-4 py-3 text-center">
                                                            {canDrill && (
                                                                <button className="p-1.5 rounded-lg hover:bg-[#D08C60]/10 text-[#D08C60] transition-colors">
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Timeline View */}
                        <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                            <h3 className="font-serif font-bold text-[#3E2A1F] mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D08C60]" />
                                Life Timeline (Vimshottari)
                            </h3>
                            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                                {VIMSHOTTARI_DATA.mahadashas.map((maha, idx) => {
                                    const isCurrent = maha.isCurrent;
                                    const isPast = parseDate(maha.endDate) < new Date();

                                    return (
                                        <React.Fragment key={idx}>
                                            {idx > 0 && <div className="w-4 h-0.5 bg-[#D08C60]/30 shrink-0" />}
                                            <button
                                                onClick={() => setSelectedPeriodForInfo(maha.planet)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${isCurrent
                                                    ? 'bg-green-100 text-green-800 border-green-300 ring-2 ring-green-400 ring-offset-1'
                                                    : isPast
                                                        ? 'bg-gray-100 text-gray-500 border-gray-200'
                                                        : PLANET_COLORS[maha.planet] || 'bg-gray-100'
                                                    }`}
                                            >
                                                {maha.planet}
                                                <span className="block text-[9px] font-normal opacity-70">
                                                    {maha.years}y
                                                </span>
                                            </button>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-[10px] text-[#8B5A2B]/60 mt-2 px-1">
                                <span>Birth: 1985</span>
                                <span>Age 40 (Now)</span>
                                <span>End: 2105 (120 yrs)</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Interpretation Panel (1 column) */}
                    <div className="space-y-4">
                        {/* Selected Period Interpretation */}
                        <div className="bg-white rounded-2xl border border-[#D08C60]/20 overflow-hidden shadow-sm">
                            <div className={`p-4 ${PLANET_COLORS[selectedPeriodForInfo]?.replace('bg-', 'bg-') || 'bg-yellow-100'} border-b`}>
                                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                                    {selectedPeriodForInfo} Dasha
                                    <Info className="w-4 h-4 opacity-50" />
                                </h3>
                                <p className="text-xs opacity-70">
                                    {PLANET_INTERPRETATIONS[selectedPeriodForInfo]?.nature}
                                </p>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Keywords */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B] mb-2 font-bold">Key Themes</p>
                                    <div className="flex flex-wrap gap-1">
                                        {PLANET_INTERPRETATIONS[selectedPeriodForInfo]?.keywords.map((kw, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-[#FAF7F2] text-[#3E2A1F] text-xs rounded-full border border-[#D08C60]/20">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* House Rulership */}
                                {PLANET_INTERPRETATIONS[selectedPeriodForInfo]?.houses && (
                                    <div className="p-3 bg-[#FAF7F2] rounded-xl">
                                        <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B] mb-1 font-bold">In This Chart</p>
                                        <p className="text-sm text-[#3E2A1F]">
                                            {PLANET_INTERPRETATIONS[selectedPeriodForInfo].houses}
                                        </p>
                                    </div>
                                )}

                                {/* General Interpretation */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B] mb-2 font-bold">General Effects</p>
                                    <p className="text-sm text-[#3E2A1F] leading-relaxed">
                                        {PLANET_INTERPRETATIONS[selectedPeriodForInfo]?.general}
                                    </p>
                                </div>

                                {/* Quick Tips */}
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <p className="text-[10px] uppercase tracking-wider text-amber-800 mb-1 font-bold flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Astrologer's Tip
                                    </p>
                                    <p className="text-xs text-amber-900">
                                        {selectedPeriodForInfo === 'Jupiter'
                                            ? 'Best period for education, marriage, and spiritual growth. Wear yellow sapphire for enhanced results.'
                                            : selectedPeriodForInfo === 'Saturn'
                                                ? 'Period of discipline and hard work. Blue sapphire may help if Saturn is well-placed.'
                                                : 'Consult detailed horoscope for personalized remedies.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* All 11 Systems Quick Reference */}
                        <div className="bg-white rounded-2xl border border-[#D08C60]/20 p-4 shadow-sm">
                            <h3 className="font-serif font-bold text-[#3E2A1F] mb-3 text-sm">All 11 Dasha Systems</h3>
                            <div className="space-y-1 text-xs">
                                {DASHA_SYSTEMS.map((sys, idx) => (
                                    <div
                                        key={sys.id}
                                        className={`flex items-center justify-between p-2 rounded-lg ${sys.id === selectedDashaSystem
                                            ? 'bg-[#D08C60]/10 border border-[#D08C60]/30'
                                            : 'hover:bg-[#FAF7F2]'
                                            } ${!sys.applicable ? 'opacity-50' : 'cursor-pointer'}`}
                                        onClick={() => sys.applicable && handleSystemChange(sys.id)}
                                    >
                                        <span className="font-medium text-[#3E2A1F]">
                                            {idx + 1}. {sys.name}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sys.applicable
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {sys.applicable ? '✓' : '✗'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-[#8B5A2B] py-4">
                    <p>Grahvani Dasha Analysis • Demo with Static Data • <a href="/vedic-astrology/dashas" className="text-[#D08C60] hover:underline">Go to Live →</a></p>
                </div>
            </div>
        </div>
    );
}
