"use client";

import React, { useState } from 'react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpSignifications,
    useKpHoraryMutation,
} from '@/hooks/queries/useKP';
import {
    KpCuspTable,
    KpPlanetaryTable,
    SignificationMatrix,
    RulingPlanetsWidget,
    HoraryPanel,
    BhavaDetailsTable,
} from '@/components/kp';
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import { cn } from '@/lib/utils';
import {
    Loader2,
    LayoutGrid,
    Grid3x3,
    Home,
    Clock,
    HelpCircle,
    Star,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

type KpTab = 'planets-cusps' | 'significations' | 'bhava-details' | 'ruling-planets' | 'horary';

const tabs: { id: KpTab; label: string; icon: React.ReactNode }[] = [
    { id: 'planets-cusps', label: 'Planets & Cusps', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'significations', label: 'Significations', icon: <Grid3x3 className="w-4 h-4" /> },
    { id: 'bhava-details', label: 'Bhava Details', icon: <Home className="w-4 h-4" /> },
    { id: 'ruling-planets', label: 'Ruling Planets', icon: <Clock className="w-4 h-4" /> },
    { id: 'horary', label: 'Horary (Prashna)', icon: <HelpCircle className="w-4 h-4" /> },
];

/**
 * KP Astrology Dashboard
 * Complete KP system interface with all 5 routes
 */
export default function KpDashboardPage() {
    const { clientDetails, processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [activeTab, setActiveTab] = useState<KpTab>('planets-cusps');

    const clientId = clientDetails?.id || '';

    // Queries - planetsCusps is always needed for the chart
    const planetsCuspsQuery = useKpPlanetsCusps(clientId);
    const significationsQuery = useKpSignifications(clientId, { enabled: activeTab === 'significations' && !planetsCuspsQuery.data?.data?.significators });
    const bhavaDetailsQuery = useKpBhavaDetails(clientId, { enabled: activeTab === 'bhava-details' });
    const rulingPlanetsQuery = useKpRulingPlanets(clientId, { enabled: activeTab === 'ruling-planets' });
    const horaryMutation = useKpHoraryMutation();

    // D1 Data for Visual Chart - Prioritize live KP data
    const d1Data = React.useMemo(() => {
        // 1. Try Live KP Data
        if (planetsCuspsQuery.data?.data) {
            const { ascendant, planets } = planetsCuspsQuery.data.data;
            let ascSignId = 1;

            // Parse Ascendant
            if (ascendant) {
                const signName = ascendant.sign;
                // Normalize sign name (e.g. "Aries" -> "Aries")
                const normalized = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
                ascSignId = signNameToId[normalized] || 1;
            }

            // Parse Planets
            const visualPlanets: any[] = [];
            // Handle Record<string, Planet>
            if (planets && !Array.isArray(planets)) {
                Object.entries(planets).forEach(([name, p]) => {
                    if (['Uranus', 'Neptune', 'Pluto'].includes(name)) return; // Exclude outer

                    const signName = p.sign;
                    const normalizedSign = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();

                    visualPlanets.push({
                        name: name.substring(0, 2), // Chart expects short names like 'Su', 'Mo'
                        signId: signNameToId[normalizedSign] || 1,
                        degree: p.longitude?.split('°')[0] + '°' || "0°", // Visual chart expects string
                        isRetro: p.is_retro || false,
                        house: p.house
                    });
                });
            }

            // Add Ascendant as a planet point 'As'
            visualPlanets.push({
                name: 'As',
                signId: ascSignId,
                degree: ascendant?.longitude?.split('°')[0] + '°' || "0°",
                isRetro: false,
                house: 1
            });

            return { planets: visualPlanets, ascendant: ascSignId };
        }

        // 2. Fallback to processedCharts
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const parsed = parseChartData(d1Kp.chartData);
            parsed.planets = parsed.planets.filter(p =>
                !['Uranus', 'Neptune', 'Pluto', 'Ur', 'Ne', 'Pl'].some(n => p.name.includes(n))
            );
            return parsed;
        }
        return { planets: [], ascendant: 1 };
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Cusp Data - fallback to D1_kp houses if API fails
    // Helper to parse "268° 5' 50\"" to decimal
    const parseDms = (dms: string): number => {
        if (!dms) return 0;
        const match = dms.match(/(\d+)[°\s]+(\d+)['\s]+(\d+)/);
        if (match) {
            return parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
        }
        return parseFloat(dms) || 0;
    };

    // KP Cusp Data - Transform API object to Array
    const cuspData = React.useMemo(() => {
        const rawCusps = planetsCuspsQuery.data?.data?.house_cusps;
        if (rawCusps) {
            return Object.entries(rawCusps).map(([key, c]) => ({
                cusp: parseInt(key),
                sign: c.sign,
                signId: signNameToId[c.sign] || 1,
                degree: parseDms(c.longitude),
                degreeFormatted: c.longitude, // Use the provided DMS string
                nakshatra: c.nakshatra,
                nakshatraLord: c.star_lord, // Map JSON star_lord -> nakshatraLord
                subLord: c.sub_lord,      // Map JSON sub_lord -> subLord
                subSubLord: c.sub_sub_lord || '-'
            })).sort((a, b) => a.cusp - b.cusp);
        }

        // Fallback to D1_kp houses
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            console.log('[KP Cusps] Using D1_kp fallback');
            const data = d1Kp.chartData.data || d1Kp.chartData;
            const houses = data.houses || data.observations || [];

            if (Array.isArray(houses) && houses.length > 0) {
                return houses.map((h: any) => ({
                    cusp: h.house || h.house_number,
                    sign: h.sign || h.sign_name,
                    signId: h.sign_id || 1,
                    degree: h.degree || h.longitude,
                    degreeFormatted: h.degreeFormatted,
                    nakshatra: h.nakshatra || '-',
                    nakshatraLord: h.nakshatra_lord || '-',
                    subLord: h.sub_lord || '-',
                    subSubLord: h.sub_sub_lord || '-'
                }));
            }
        }
        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Planetary Data - Transform API object to Array
    const planetaryData = React.useMemo(() => {
        const rawPlanets = planetsCuspsQuery.data?.data?.planets;
        // Check if it's the new Record format (check if keys are strings like "Sun")
        if (rawPlanets && !Array.isArray(rawPlanets)) {
            return Object.entries(rawPlanets).map(([name, p]) => ({
                name: name,
                fullName: name,
                sign: p.sign,
                signId: signNameToId[p.sign] || 1,
                degree: parseDms(p.longitude),
                degreeFormatted: p.longitude, // Use provided DMS
                house: p.house,
                nakshatra: p.nakshatra,
                nakshatraLord: p.star_lord, // Map JSON star_lord -> nakshatraLord
                subLord: p.sub_lord,      // Map JSON sub_lord -> subLord
                subSubLord: p.sub_sub_lord || '-',
                isRetrograde: p.is_retro || false
            }));
        }

        // Handle Array format (legacy or fallback)
        if (Array.isArray(rawPlanets)) {
            return rawPlanets;
        }

        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const data = d1Kp.chartData.data || d1Kp.chartData;
            const planetsList = data.planets || data.planetary_positions || [];
            if (Array.isArray(planetsList)) {
                return planetsList.map((p: any) => ({
                    name: p.name || p.planet,
                    fullName: p.full_name || p.name || p.planet,
                    sign: p.sign || '-',
                    signId: p.sign_id || p.signId || 1,
                    degree: typeof p.degree === 'number' ? p.degree : parseFloat(p.degree) || 0,
                    degreeFormatted: p.degreeFormatted || `${(p.degree || 0).toFixed(2)}°`,
                    house: p.house || p.bhava || 1,
                    nakshatra: p.nakshatra || '-',
                    nakshatraLord: p.nakshatra_lord || '-',
                    subLord: p.sub_lord || '-',
                    subSubLord: p.sub_sub_lord || '-',
                    isRetrograde: p.isRetrograde || p.is_retro || false
                }));
            }
        }
        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Signification Data - Transform API object (House-view) to Component Array (Planet-view)
    const significationData = React.useMemo(() => {
        const rawSignificators = planetsCuspsQuery.data?.data?.significators;
        if (rawSignificators) {
            const planetMap: Record<string, Set<number>> = {};
            const planetStrong: Record<string, boolean> = {};

            // Initialize planets
            ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].forEach(p => {
                planetMap[p] = new Set();
            });

            // Iterate houses (keys "1", "2"...)
            Object.entries(rawSignificators).forEach(([houseKey, levels]: [string, any]) => {
                const houseNum = parseInt(houseKey);
                if (isNaN(houseNum)) return;

                // Levels A, B, C, D
                Object.entries(levels).forEach(([level, planets]: [string, any]) => {
                    if (Array.isArray(planets)) {
                        planets.forEach((planetName: string) => {
                            // Handle basic name matching
                            // The API returns "Sun", "Moon" etc. matching our keys
                            if (planetMap[planetName]) {
                                planetMap[planetName].add(houseNum);
                                // A and B are considered strong significators
                                if (level === 'A' || level === 'B') {
                                    planetStrong[planetName] = true;
                                }
                            }
                        });
                    }
                });
            });

            return Object.entries(planetMap).map(([planet, housesSet]) => ({
                planet,
                houses: Array.from(housesSet).sort((a, b) => a - b),
                strong: planetStrong[planet] || false
            }));
        }
        return [];
    }, [planetsCuspsQuery.data]);

    // KP Bhava Data
    // We now use the raw API response directly for the table
    const bhavaDetails = React.useMemo(() => {
        if (bhavaDetailsQuery.data?.data?.bhava_details) {
            return bhavaDetailsQuery.data.data.bhava_details;
        }
        return {};
    }, [bhavaDetailsQuery.data]);
    if (ayanamsa !== 'KP') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Star className="w-12 h-12 text-muted mb-4" />
                <h2 className="text-xl font-serif font-bold text-ink mb-2">KP System Not Selected</h2>
                <p className="text-muted text-sm max-w-md">
                    Please select <strong>KP (Krishnamurti)</strong> from the Ayanamsa dropdown in the header to access KP features.
                </p>
            </div>
        );
    }

    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-muted text-sm mb-1">
                        <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" />
                            Overview
                        </Link>
                        <span>/</span>
                        <span>KP System</span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-ink">KP Astrology Dashboard</h1>
                    <p className="text-sm text-muted mt-1">
                        Krishnamurti Paddhati analysis for <span className="font-medium">{clientDetails.name}</span>
                    </p>
                </div>
                <div className="px-4 py-2 bg-gold-primary/10 border border-gold-primary/30 rounded-lg">
                    <span className="text-[10px] text-gold-dark uppercase tracking-widest font-semibold">KP System Active</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-parchment rounded-xl border border-antique">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md"
                                : "text-muted hover:text-ink hover:bg-white/50"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* Planets & Cusps */}
                {activeTab === 'planets-cusps' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* D1 Chart */}
                            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">KP Natal Chart</h3>
                                <div className="aspect-square bg-parchment rounded-xl p-4 border border-antique/50">
                                    <ChartWithPopup
                                        ascendantSign={d1Data.ascendant}
                                        planets={d1Data.planets}
                                        className="bg-transparent border-none"
                                    />
                                </div>
                            </div>

                            {/* Cusps Table */}
                            <div className="lg:col-span-2 bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">House Cusps with Sub-Lords</h3>
                                {planetsCuspsQuery.isLoading && !cuspData.length ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : cuspData.length > 0 ? (
                                    <KpCuspTable cusps={cuspData} />
                                ) : (
                                    <p className="text-muted text-center py-8">No cusp data available</p>
                                )}
                            </div>
                        </div>

                        {/* Planets Table */}
                        <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                            <h3 className="font-serif font-bold text-lg text-ink mb-4">Planetary Positions with Star & Sub Lords</h3>
                            {planetsCuspsQuery.isLoading && !planetaryData.length ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                </div>
                            ) : planetaryData.length > 0 ? (
                                <KpPlanetaryTable planets={planetaryData} />
                            ) : (
                                <p className="text-muted text-center py-8">No planetary data available</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Significations */}
                {activeTab === 'significations' && (
                    <div className="bg-white border border-antique rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="font-serif font-bold text-lg text-ink">Signification Matrix</h3>
                            <p className="text-sm text-muted mt-1">Which planets signify which houses - the core of KP prediction</p>
                        </div>
                        {/* Show loading ONLY if we don't have cached data from planets-cusps AND query is loading */}
                        {(significationsQuery.isLoading && !significationData.length) ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                            </div>
                        ) : (significationsQuery.data?.data?.significations || significationData.length > 0) ? (
                            <SignificationMatrix significations={significationsQuery.data?.data?.significations || significationData} />
                        ) : (
                            <p className="text-muted text-center py-8">No signification data available</p>
                        )}
                    </div>
                )}

                {/* Bhava Details */}
                {activeTab === 'bhava-details' && (
                    <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                        {bhavaDetailsQuery.isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                            </div>
                        ) : (
                            <BhavaDetailsTable bhavaDetails={bhavaDetails} className="w-full" />
                        )}
                    </div>
                )}

                {/* Ruling Planets */}
                {activeTab === 'ruling-planets' && (
                    <div className="max-w-2xl mx-auto">
                        <RulingPlanetsWidget
                            data={rulingPlanetsQuery.data?.data || null}
                            isLoading={rulingPlanetsQuery.isLoading}
                            onRefresh={() => rulingPlanetsQuery.refetch()}
                            calculatedAt={rulingPlanetsQuery.data?.calculatedAt}
                        />
                    </div>
                )}

                {/* Horary */}
                {activeTab === 'horary' && (
                    <div className="max-w-2xl mx-auto">
                        <HoraryPanel
                            onSubmit={(horaryNumber, question) => {
                                horaryMutation.mutate({ clientId, horaryNumber, question });
                            }}
                            result={horaryMutation.data?.data}
                            isLoading={horaryMutation.isPending}
                            error={horaryMutation.error?.message}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
