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
import { parseChartData } from '@/lib/chart-helpers';
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
    const significationsQuery = useKpSignifications(clientId, { enabled: activeTab === 'significations' });
    const bhavaDetailsQuery = useKpBhavaDetails(clientId, { enabled: activeTab === 'bhava-details' });
    const rulingPlanetsQuery = useKpRulingPlanets(clientId, { enabled: activeTab === 'ruling-planets' });
    const horaryMutation = useKpHoraryMutation();

    // D1 Data from processedCharts (fallback/main source)
    const d1Data = React.useMemo(() => {
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const parsed = parseChartData(d1Kp.chartData);
            // Filter out outer planets (Uranus, Neptune, Pluto)
            parsed.planets = parsed.planets.filter(p =>
                !['Uranus', 'Neptune', 'Pluto', 'Ur', 'Ne', 'Pl'].some(n => p.name.includes(n))
            );
            return parsed;
        }
        return { planets: [], ascendant: 1 };
    }, [processedCharts]);

    // KP Cusp Data - fallback to D1_kp houses if API fails
    const cuspData = React.useMemo(() => {
        // Try real-time API data first
        if (planetsCuspsQuery.data?.data?.cusps) {
            return planetsCuspsQuery.data.data.cusps;
        }

        // Fallback to D1_kp houses
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            console.log('[KP Cusps] Using D1_kp fallback');
            const data = d1Kp.chartData.data || d1Kp.chartData;
            const houses = data.houses || data.observations || []; // Handle different formats

            if (Array.isArray(houses) && houses.length > 0) {
                return houses.map((h: any) => ({
                    cusp: h.house || h.house_number,
                    sign: h.sign || h.sign_name,
                    signId: h.sign_id || 1, // Add signId to satisfy interface
                    degree: h.degree || h.longitude,
                    degreeFormatted: h.degreeFormatted,
                    nakshatra: h.nakshatra || '-',
                    nakshatraLord: h.nakshatra_lord || '-',
                    subLord: h.sub_lord || '-',
                    subSubLord: h.sub_sub_lord || '-'
                }));
            }

            // If explicit houses missing but we have Ascendant, generate Equal Houses (better than nothing)
            const asc = data.ascendant || data.natal_ascendant;
            if (asc) {
                const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                let ascSignId = 1;

                if (typeof asc.sign === 'number') ascSignId = asc.sign;
                else if (typeof asc.signId === 'number') ascSignId = asc.signId;
                else if (typeof asc.sign_id === 'number') ascSignId = asc.sign_id;

                const ascDeg = typeof asc.degree === 'number' ? asc.degree : parseFloat(asc.degree) || 0;

                const generated = [];
                for (let i = 0; i < 12; i++) {
                    const houseNum = i + 1;
                    const currentSignId = ((ascSignId - 1 + i) % 12) + 1;

                    generated.push({
                        cusp: houseNum,
                        sign: signs[currentSignId - 1],
                        signId: currentSignId,
                        degree: ascDeg,
                        degreeFormatted: `${ascDeg.toFixed(2)}°`,
                        nakshatra: '-',
                        nakshatraLord: '-',
                        subLord: '-',
                        subSubLord: '-'
                    });
                }
                return generated;
            }
        }

        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Planetary Data - fallback to D1_kp planets if API fails
    const planetaryData = React.useMemo(() => {
        if (planetsCuspsQuery.data?.data?.planets) {
            return planetsCuspsQuery.data.data.planets;
        }

        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const data = d1Kp.chartData.data || d1Kp.chartData;
            // Re-use parseChartData or similar logic to map to KpPlanet
            // Using parseKpChartData logic but mapping to KpPlanet interface
            // This is a quick map, detailed KP fields like subLord will be empty
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

    // KP Bhava Data
    // We now use the raw API response directly for the table
    const bhavaDetails = React.useMemo(() => {
        console.log('Bhava Query Status:', bhavaDetailsQuery.status);
        console.log('Bhava Query Data:', bhavaDetailsQuery.data);
        console.log('Bhava Query Error:', bhavaDetailsQuery.error);
        if (bhavaDetailsQuery.data?.data?.bhava_details) {
            return bhavaDetailsQuery.data.data.bhava_details;
        }
        return {};
    }, [bhavaDetailsQuery.data, bhavaDetailsQuery.status, bhavaDetailsQuery.error]);
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
                        {significationsQuery.isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                            </div>
                        ) : significationsQuery.data?.data?.significations ? (
                            <SignificationMatrix significations={significationsQuery.data.data.significations} />
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
