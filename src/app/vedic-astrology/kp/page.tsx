"use client";

import React, { useState } from 'react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpHouseSignifications,
    useKpPlanetSignificators,
    useKpHoraryMutation,
    useKpInterlinks,
    useKpAdvancedInterlinks,
    useKpNakshatraNadi,
    useKpFortuna,
} from '@/hooks/queries/useKP';
import { useAshtakavarga } from '@/hooks/queries/useCalculations';
import dynamic from 'next/dynamic';
import {
    KpDashboardHeader,
    KpChartSummaryPanel,
    KpDashboardSidebar,
} from '@/components/kp';
import type { KpSection } from '@/components/kp/KpDashboardSidebar';
import ShodashaVargaTable from '@/components/astrology/ShodashaVargaTable';
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';

// Dynamically import tab-specific KP components (only one tab renders at a time)
const KpPlanetaryTable = dynamic(() => import('@/components/kp/KpPlanetaryTable'));
const KpCuspalChart = dynamic(() => import('@/components/kp/KpCuspalChart'));
const SignificationMatrix = dynamic(() => import('@/components/kp/SignificationMatrix'));
const RulingPlanetsWidget = dynamic(() => import('@/components/kp/RulingPlanetsWidget'));
const HoraryPanel = dynamic(() => import('@/components/kp/HoraryPanel'));
const BhavaDetailsTable = dynamic(() => import('@/components/kp/BhavaDetailsTable'));
const HouseSignificatorsTable = dynamic(() => import('@/components/kp/HouseSignificatorsTable'));
const KpInterlinksTable = dynamic(() => import('@/components/kp/KpInterlinksTable').then(m => ({ default: m.KpInterlinksTable })));
const KpAdvancedSslTable = dynamic(() => import('@/components/kp/KpAdvancedSslTable').then(m => ({ default: m.KpAdvancedSslTable })));
const KpFortunaView = dynamic(() => import('@/components/kp/KpFortunaView').then(m => ({ default: m.KpFortunaView })));
const KpNakshatraNadiView = dynamic(() => import('@/components/kp/KpNakshatraNadiView').then(m => ({ default: m.KpNakshatraNadiView })));
const KpFocusedCuspView = dynamic(() => import('@/components/kp/KpFocusedCuspView').then(m => ({ default: m.KpFocusedCuspView })));
const KpAdvancedSslView = dynamic(() => import('@/components/kp/KpAdvancedSslView').then(m => ({ default: m.KpAdvancedSslView })));
const KpNakshatraNadiFocusedView = dynamic(() => import('@/components/kp/KpNakshatraNadiFocusedView').then(m => ({ default: m.KpNakshatraNadiFocusedView })));
const KpDashaTimeline = dynamic(() => import('@/components/kp/KpDashaTimeline'));
const KpTransitPanel = dynamic(() => import('@/components/kp/KpTransitPanel'));
const KpPredictionNotes = dynamic(() => import('@/components/kp/KpPredictionNotes'));
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import { KpHouseSignification } from '@/types/kp.types';
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
    Compass,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type KpTab = 'planets-cusps' | 'significations' | 'bhava-details' | 'ruling-planets' | 'horary' | 'interlinks' | 'advanced-ssl' | 'fortuna' | 'nakshatra-nadi' | 'ashtakavarga';

const tabs: { id: KpTab; label: string; icon: React.ReactNode }[] = [
    { id: 'planets-cusps', label: 'Planets & Cusps', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'significations', label: 'Significations', icon: <Star className="w-4 h-4" /> },
    { id: 'bhava-details', label: 'Bhava Details', icon: <Home className="w-4 h-4" /> },
    { id: 'interlinks', label: 'Interlinks', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'advanced-ssl', label: 'Advanced SSL', icon: <Star className="w-4 h-4" /> },
    { id: 'nakshatra-nadi', label: 'Nakshatra Nadi', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'fortuna', label: 'Pars Fortuna', icon: <Clock className="w-4 h-4" /> },
    { id: 'ruling-planets', label: 'Ruling Planets', icon: <Clock className="w-4 h-4" /> },
];

/**
 * KP Astrology Dashboard
 * Complete KP system interface with all 5 routes
 */
export default function KpDashboardPage() {
    const { clientDetails, processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<KpTab>('planets-cusps');
    const [viewMode, setViewMode] = useState<'dashboard' | 'detailed'>('dashboard');
    const [activeSidebarSection, setActiveSidebarSection] = useState<KpSection>('dashboard');

    const clientId = clientDetails?.id || '';

    // Synchronize activeTab with URL search params
    React.useEffect(() => {
        const tab = searchParams.get('tab') as KpTab;
        if (tab && ['planets-cusps', 'significations', 'bhava-details', 'ruling-planets', 'horary', 'interlinks', 'advanced-ssl', 'fortuna', 'nakshatra-nadi', 'ashtakavarga'].includes(tab)) {
            setActiveTab(tab);
            setViewMode('detailed'); // Switch to detailed view if a tab is specified
        } else if (!tab) {
            // Reset to defaults if no tab is specified (e.g. clicking "KP System" link)
            setActiveTab('planets-cusps');
            setViewMode('dashboard');
        }
    }, [searchParams]);

    // Queries - planetsCusps is always needed for the chart
    const planetsCuspsQuery = useKpPlanetsCusps(clientId);
    const houseSignificationsQuery = useKpHouseSignifications(clientId, { enabled: activeTab === 'significations' });
    const planetSignificatorsQuery = useKpPlanetSignificators(clientId, { enabled: activeTab === 'significations' });
    const bhavaDetailsQuery = useKpBhavaDetails(clientId, { enabled: activeTab === 'bhava-details' });
    const rulingPlanetsQuery = useKpRulingPlanets(clientId, { enabled: activeTab === 'ruling-planets' || activeSidebarSection === 'ruling-planets' || activeSidebarSection === 'dashboard' });
    const horaryMutation = useKpHoraryMutation();
    const interlinksQuery = useKpInterlinks(clientId, { enabled: activeTab === 'interlinks' });
    const advancedSslQuery = useKpAdvancedInterlinks(clientId, { enabled: activeTab === 'advanced-ssl' });
    const nakshatraNadiQuery = useKpNakshatraNadi(clientId, { enabled: activeTab === 'nakshatra-nadi' });
    const fortunaQuery = useKpFortuna(clientId, { enabled: activeTab === 'fortuna' });
    const ashtakavargaQuery = useAshtakavarga(clientId, ayanamsa, 'shodasha');

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
        const rawResponse = planetsCuspsQuery.data?.data || processedCharts['kp_planets_cusps_kp']?.chartData?.data || processedCharts['kp_planets_cusps_kp']?.chartData;
        const rawPlanets = rawResponse?.planets || rawResponse?.planetary_positions;

        // Check if it's the new Record format (check if keys are strings like "Sun")
        if (rawPlanets && !Array.isArray(rawPlanets)) {
            return Object.entries(rawPlanets).map(([name, p]: [string, any]) => ({
                name: name,
                fullName: name,
                sign: p.sign,
                signId: signNameToId[p.sign] || 1,
                degree: parseDms(p.longitude || p.degreeFormatted || p.degree),
                degreeFormatted: p.longitude || p.degreeFormatted || p.degree,
                house: p.house || p.bhava,
                nakshatra: p.nakshatra,
                nakshatraLord: p.star_lord || p.nakshatra_lord || p.nakshatraLord,
                subLord: p.sub_lord || p.subLord,
                subSubLord: p.sub_sub_lord || p.subSubLord || '-',
                isRetrograde: p.is_retro || p.is_retrograde || p.isRetrograde || false
            }));
        }

        // Handle Array format (legacy or fallback)
        if (Array.isArray(rawPlanets)) {
            return rawPlanets.map((p: any) => ({
                name: p.name || p.planet,
                fullName: p.full_name || p.name || p.planet,
                sign: p.sign || '-',
                signId: p.sign_id || p.signId || signNameToId[p.sign] || 1,
                degree: typeof p.degree === 'number' ? p.degree : parseFloat(p.degree) || 0,
                degreeFormatted: p.degreeFormatted || p.longitude || p.degree || `${(p.degree || 0).toFixed(2)}°`,
                house: p.house || p.bhava || 1,
                nakshatra: p.nakshatra || '-',
                nakshatraLord: p.star_lord || p.nakshatra_lord || p.nakshatraLord || '-',
                subLord: p.sub_lord || p.subLord || '-',
                subSubLord: p.sub_sub_lord || p.subSubLord || '-',
                isRetrograde: p.isRetrograde || p.is_retro || p.is_retrograde || false
            }));
        }

        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP House Significator Data (House View)
    const houseSignificators = React.useMemo(() => {
        const rawResponse = planetsCuspsQuery.data?.data || houseSignificationsQuery.data?.data || processedCharts['kp_house_significations_kp']?.chartData?.data || processedCharts['kp_house_significations_kp']?.chartData;
        const planetsResponse = planetsCuspsQuery.data?.data || processedCharts['kp_planets_cusps_kp']?.chartData?.data || processedCharts['kp_planets_cusps_kp']?.chartData;

        // Check for new API format: house_significations inside the query response
        const newSignifications = rawResponse?.house_significations || rawResponse?.significators;

        if (newSignifications && planetsResponse?.planets) {
            const normalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

            // Create map of Planet -> StarLord
            const planetStarLords: Record<string, string> = {};
            const rawPlanets = planetsResponse.planets;
            if (Array.isArray(rawPlanets)) {
                rawPlanets.forEach((p: any) => {
                    planetStarLords[normalize(p.name || p.planet)] = normalize(p.star_lord || p.nakshatra_lord || '');
                });
            } else {
                Object.entries(rawPlanets).forEach(([k, v]: [string, any]) => {
                    planetStarLords[normalize(k)] = normalize(v.star_lord || v.nakshatra_lord || '');
                });
            }

            return Object.entries(newSignifications).map(([houseKey, hData]: [string, any]) => {
                const houseNum = parseInt(houseKey);
                if (isNaN(houseNum)) return null;

                const occupants: string[] = Array.isArray(hData.occupants) ? hData.occupants.map(normalize) : [];
                const lord: string = normalize(hData.lord);
                const nakshatraPlanets: string[] = Array.isArray(hData.nakshatra_planets) ? hData.nakshatra_planets.map(normalize) : [];

                const levelA: string[] = hData.A || [];
                const levelB: string[] = hData.B || occupants;
                const levelC: string[] = hData.C || [];
                const levelD: string[] = hData.D || (lord ? [lord] : []);

                if (levelA.length === 0 && levelC.length === 0 && nakshatraPlanets.length > 0) {
                    nakshatraPlanets.forEach(planet => {
                        const starLord = planetStarLords[planet];
                        if (!starLord) return;
                        if (occupants.includes(starLord)) levelA.push(planet);
                        if (starLord === lord) levelC.push(planet);
                    });
                }

                return {
                    house: houseNum,
                    levelA: Array.from(new Set(levelA)),
                    levelB: Array.from(new Set(levelB)),
                    levelC: Array.from(new Set(levelC)),
                    levelD: Array.from(new Set(levelD)),
                } as KpHouseSignification;
            }).filter((h): h is KpHouseSignification => h !== null).sort((a, b) => a.house - b.house);
        }

        return [];
    }, [planetsCuspsQuery.data, houseSignificationsQuery.data, processedCharts]);

    // KP Signification Data (Planet View)
    const significationData = React.useMemo(() => {
        const rawResponse = planetSignificatorsQuery.data?.data || processedCharts['kp_planet_significators_kp']?.chartData?.data || processedCharts['kp_planet_significators_kp']?.chartData;
        const apiData = rawResponse?.planet_significators || rawResponse;

        // If API provides direct matrix data (from new endpoint)
        if (apiData && typeof apiData === 'object' && !Array.isArray(apiData) && Object.keys(apiData).length > 0) {
            return Object.entries(apiData).map(([planet, details]: [string, any]) => ({
                planet,
                levelA: details.levelA || details["Very Strong"] || details.very_strong || [],
                levelB: details.levelB || details["Strong"] || details.strong || [],
                levelC: details.levelC || details["Normal"] || details.normal || [],
                levelD: details.levelD || details["Weak"] || details.weak || [],
                houses: Array.from(new Set([
                    ...(details.levelA || details["Very Strong"] || details.very_strong || []),
                    ...(details.levelB || details["Strong"] || details.strong || []),
                    ...(details.levelC || details["Normal"] || details.normal || []),
                    ...(details.levelD || details["Weak"] || details.weak || [])
                ].map(Number))).sort((a: number, b: number) => a - b),
                strong: (details.levelA || details["Very Strong"] || details.very_strong || []).length > 0
            }));
        }

        // Fallback: Pivot houseSignificators to Planet View (Client-side calculation)
        const planetMap: Record<string, { A: number[], B: number[], C: number[], D: number[] }> = {};
        const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

        planets.forEach(p => { planetMap[p] = { A: [], B: [], C: [], D: [] }; });

        houseSignificators.forEach(h => {
            h.levelA.forEach((p: string) => { if (planetMap[p]) planetMap[p].A.push(h.house); });
            h.levelB.forEach((p: string) => { if (planetMap[p]) planetMap[p].B.push(h.house); });
            h.levelC.forEach((p: string) => { if (planetMap[p]) planetMap[p].C.push(h.house); });
            h.levelD.forEach((p: string) => { if (planetMap[p]) planetMap[p].D.push(h.house); });
        });

        return Object.entries(planetMap).map(([planet, levels]) => ({
            planet,
            houses: [...levels.A, ...levels.B, ...levels.C, ...levels.D].sort((a, b) => a - b),
            levelA: levels.A.sort((a, b) => a - b),
            levelB: levels.B.sort((a, b) => a - b),
            levelC: levels.C.sort((a, b) => a - b),
            levelD: levels.D.sort((a, b) => a - b),
            strong: (levels.A.length > 0 || levels.B.length > 0)
        }));
    }, [houseSignificators, planetSignificatorsQuery.data, processedCharts]);

    // --- DATA TRANSFORMATION HELPERS ---

    // 1. Interlinks Transformer
    const interlinksData = React.useMemo(() => {
        const raw = interlinksQuery.data?.data || processedCharts['kp_interlinks_kp']?.chartData?.data || processedCharts['kp_interlinks_kp']?.chartData;
        if (!raw) return [];

        const houseLords = raw.houses?.houses || {};

        // Try house_relationships (Basic Interlinks)
        if (raw.cuspal_interlinks?.house_relationships) {
            return Object.entries(raw.cuspal_interlinks.house_relationships).map(([house, data]: [string, any]) => {
                const hLords = houseLords[house] || {};
                return {
                    houseNumber: parseInt(house),
                    topic: `House ${house}`,
                    chain: {
                        signLord: { planet: hLords.sign_lord || '-', isRetro: false },
                        starLord: { planet: hLords.star_lord || '-', isRetro: false },
                        subLord: { planet: hLords.sub_lord || '-', isRetro: false },
                        subSubLord: { planet: hLords.sub_sub_lord || '-', isRetro: false }
                    },
                    positiveHouses: (data.favorable || []).map(Number),
                    negativeHouses: (data.adverse || []).map(Number),
                    strength: 'Neutral',
                    verdict: 'Neutral'
                };
            });
        }

        // Try analysis (Advanced)
        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: item.interpretation?.split('-')[0]?.trim() || `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false }
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral'
        }));
    }, [interlinksQuery.data, processedCharts]);

    // 2. SSL Transformer
    const sslData = React.useMemo(() => {
        const raw = advancedSslQuery.data?.data || processedCharts['kp_interlinks_advanced_kp']?.chartData?.data || processedCharts['kp_interlinks_advanced_kp']?.chartData;
        if (!raw) return [];

        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false }
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral'
        }));
    }, [advancedSslQuery.data, processedCharts]);

    // 3. Nakshatra Nadi Transformer
    const nadiData = React.useMemo(() => {
        const raw = nakshatraNadiQuery.data?.data || processedCharts['kp_nakshatra_nadi_kp']?.chartData?.data || processedCharts['kp_nakshatra_nadi_kp']?.chartData;
        if (!raw || !raw.planets || !raw.houses) return null;

        // Transform Planets
        const planets = Object.entries(raw.planets).map(([name, p]: [string, any]) => ({
            name: name,
            isRetro: p.is_retrograde,
            longitude: p.position_dms || p.longitude, // Use formatted if available
            sign: p.sign_name,
            nakshatraLord: p.nakshatra_lord,
            nakshatraName: p.nakshatra_name,
            subLord: p.sub_lord
        }));

        // Transform Cusps
        const cusps = Object.entries(raw.houses).map(([key, h]: [string, any]) => {
            let label = key.replace('House_', '');
            if (key === 'MC') label = '10';
            if (key === 'Ascendant' || key === 'Lagna') label = '1';

            return {
                label: label,
                longitude: h.position_dms || h.longitude,
                sign: h.sign_name,
                nakshatraLord: h.nakshatra_lord,
                nakshatraName: h.nakshatra_name,
                subLord: h.sub_lord
            };
        }).sort((a, b) => {
            const numA = parseInt(a.label) || (a.label === '1' ? 1 : a.label === 'Ascendant' ? 1 : 99);
            const numB = parseInt(b.label) || (b.label === '1' ? 1 : b.label === 'Ascendant' ? 1 : 99);
            return numA - numB;
        });

        return { planets, cusps };
    }, [nakshatraNadiQuery.data, processedCharts]);

    // 4. Fortuna Transformer
    const fortunaData = React.useMemo(() => {
        const raw = fortunaQuery.data?.data || processedCharts['kp_fortuna_kp']?.chartData?.data || processedCharts['kp_fortuna_kp']?.chartData;
        if (!raw || !raw.details) return null;

        // Construct calculation array
        const calculation = [
            { component: 'Ascendant', dms: '-', longitude: raw.details.ascendant.longitude, sign: raw.details.ascendant.sign, house: raw.details.ascendant.house },
            { component: 'Moon', dms: '-', longitude: raw.details.moon.longitude, sign: raw.details.moon.sign, house: raw.details.moon.house },
            { component: 'Sun', dms: '-', longitude: raw.details.sun.longitude, sign: raw.details.sun.sign, house: raw.details.sun.house }
        ];

        return {
            calculation,
            fortunaHouse: {
                sign: raw.fortuna_sign,
                houseNumber: raw.fortuna_house,
                cuspLongitude: `${raw.fortuna_longitude?.toFixed(2)}`
            }
        };

    }, [fortunaQuery.data, processedCharts]);



    // KP Bhava Data
    // We now use the raw API response directly for the table
    const bhavaDetails = React.useMemo(() => {
        const raw = bhavaDetailsQuery.data?.data || processedCharts['kp_bhava_details_kp']?.chartData?.data || processedCharts['kp_bhava_details_kp']?.chartData;
        if (raw?.bhava_details) {
            return raw.bhava_details;
        }
        return {};
    }, [bhavaDetailsQuery.data, processedCharts]);

    // KP Debug Logs
    console.log('KP Debug Data:', {
        interlinks: interlinksQuery.data,
        ssl: advancedSslQuery.data,
        nadi: nakshatraNadiQuery.data,
        fortuna: fortunaQuery.data
    });

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

    // --- Dashboard Helper: Extract key data for summary panels ---
    const summaryPlanets = React.useMemo(() => {
        return planetaryData.map(p => ({
            name: p.fullName || p.name,
            sign: p.sign,
            isRetrograde: p.isRetrograde,
        }));
    }, [planetaryData]);

    const lagnaInfo = React.useMemo(() => {
        const asc = planetsCuspsQuery.data?.data?.ascendant;
        return {
            sign: asc?.sign || '—',
            lord: '—',
        };
    }, [planetsCuspsQuery.data]);

    const moonInfo = React.useMemo(() => {
        const moon = planetsCuspsQuery.data?.data?.planets?.Moon;
        return {
            sign: moon?.sign || '—',
            nakshatra: moon?.nakshatra || '—',
            starLord: moon?.star_lord || '—',
        };
    }, [planetsCuspsQuery.data]);

    const ayanamsaInfo = React.useMemo(() => {
        const ay = rulingPlanetsQuery.data?.data?.ayanamsa;
        if (ay?.value) {
            const deg = Math.floor(ay.value);
            const min = Math.floor((ay.value % 1) * 60);
            const sec = Math.round(((ay.value % 1) * 60 % 1) * 60);
            return `${deg}°${min}'${sec}""`;
        }
        return '—';
    }, [rulingPlanetsQuery.data]);

    // Cuspal table data for the dashboard view
    const cuspalTableData = React.useMemo(() => {
        return cuspData.map(c => ({
            house: c.cusp,
            sign: c.sign,
            degree: c.degreeFormatted || `${c.degree?.toFixed(2)}°`,
            starLord: c.nakshatraLord || '—',
            subLord: c.subLord || '—',
            subSubLord: c.subSubLord || '—',
        }));
    }, [cuspData]);

    // Handle sidebar navigation scroll
    const handleSidebarSection = (section: KpSection) => {
        setActiveSidebarSection(section);
        const el = document.getElementById(`kp-section-${section}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            {(activeTab as string) !== 'ashtakavarga' && (activeTab as string) !== 'horary' && (
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
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-parchment rounded-lg border border-antique p-0.5">
                            <button
                                onClick={() => setViewMode('dashboard')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                                    viewMode === 'dashboard'
                                        ? "bg-gold-primary text-white shadow-sm"
                                        : "text-muted hover:text-ink"
                                )}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setViewMode('detailed')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                                    viewMode === 'detailed'
                                        ? "bg-gold-primary text-white shadow-sm"
                                        : "text-muted hover:text-ink"
                                )}
                            >
                                Detailed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== DASHBOARD VIEW ==================== */}
            {viewMode === 'dashboard' && (
                <div className="space-y-4">
                    {/* Top Navigation Tabs */}
                    <div className="flex flex-wrap gap-1.5 p-1 bg-parchment rounded-xl border border-antique">
                        {([
                            { id: 'dashboard' as KpSection, label: 'Overview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { id: 'cusps' as KpSection, label: 'Cusps', icon: <Compass className="w-3.5 h-3.5" /> },
                            { id: 'kp-analysis' as KpSection, label: 'Planets', icon: <Star className="w-3.5 h-3.5" /> },
                            { id: 'significators' as KpSection, label: 'Significators', icon: <Grid3x3 className="w-3.5 h-3.5" /> },
                            { id: 'ruling-planets' as KpSection, label: 'Ruling Planets', icon: <Clock className="w-3.5 h-3.5" /> },
                            { id: 'bhava-details' as KpSection, label: 'Bhava Details', icon: <Home className="w-3.5 h-3.5" /> },
                            { id: 'interlinks' as KpSection, label: 'Interlinks', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                            { id: 'advanced-ssl' as KpSection, label: 'Advanced SSL', icon: <Star className="w-3.5 h-3.5" /> },
                            { id: 'nakshatra-nadi' as KpSection, label: 'Nakshatra Nadi', icon: <HelpCircle className="w-3.5 h-3.5" /> },
                            { id: 'fortuna' as KpSection, label: 'Pars Fortuna', icon: <Clock className="w-3.5 h-3.5" /> },
                        ]).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSidebarSection(tab.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                    activeSidebarSection === tab.id
                                        ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md"
                                        : "text-muted hover:text-ink hover:bg-white/50"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Section Content — only the active section renders */}
                    <div className="min-h-[400px]">

                        {/* Overview: Chart Summary + Ruling Planets + Natal Chart */}
                        {activeSidebarSection === 'dashboard' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <KpChartSummaryPanel
                                    birthDate={clientDetails.dateOfBirth}
                                    birthTime={clientDetails.timeOfBirth}
                                    birthPlace={clientDetails.placeOfBirth?.city}
                                    lagna={lagnaInfo.sign}
                                    lagnaLord={lagnaInfo.lord}
                                    ayanamsaType="KP"
                                    ayanamsaValue={ayanamsaInfo}
                                    moonSign={moonInfo.sign}
                                    moonNakshatra={moonInfo.nakshatra}
                                    moonStarLord={moonInfo.starLord}
                                    planets={summaryPlanets}
                                />
                                <RulingPlanetsWidget
                                    data={rulingPlanetsQuery.data?.data || null}
                                    isLoading={rulingPlanetsQuery.isLoading}
                                    onRefresh={() => rulingPlanetsQuery.refetch()}
                                    calculatedAt={rulingPlanetsQuery.data?.calculatedAt}
                                />
                                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                                    <h3 className="text-base font-serif text-primary mb-3 flex items-center gap-2 font-semibold">
                                        KP Natal Chart
                                    </h3>
                                    <div className="aspect-square bg-parchment rounded-xl p-3 border border-antique/50">
                                        <ChartWithPopup
                                            ascendantSign={d1Data.ascendant}
                                            planets={d1Data.planets}
                                            className="bg-transparent border-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cuspal Table */}
                        {activeSidebarSection === 'cusps' && (
                            <div className="bg-softwhite border border-antique rounded-2xl p-5">
                                <h3 className="text-base font-serif text-primary mb-4 font-semibold">KP Cuspal Table</h3>
                                {planetsCuspsQuery.isLoading && !cuspalTableData.length ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : cuspalTableData.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-antique">
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">House</th>
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Sign</th>
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Degree</th>
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-gold-dark font-bold">Star Lord</th>
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-gold-dark font-bold">Sub Lord</th>
                                                    <th className="py-2.5 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Sub-Sub Lord</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cuspalTableData.map((cusp, idx) => (
                                                    <tr
                                                        key={cusp.house}
                                                        className={cn(
                                                            "border-b border-antique/30 hover:bg-gold-primary/5 transition-colors",
                                                            idx % 2 === 0 ? "bg-white/50" : "bg-softwhite"
                                                        )}
                                                    >
                                                        <td className="py-2 px-3">
                                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-parchment border border-antique text-xs font-bold text-primary font-serif">
                                                                {cusp.house}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3 text-xs font-serif text-primary font-medium">{cusp.sign}</td>
                                                        <td className="py-2 px-3 font-mono text-[11px] text-muted-refined">{cusp.degree}</td>
                                                        <td className="py-2 px-3">
                                                            <span className="px-2 py-0.5 bg-gold-primary/15 text-gold-dark rounded font-semibold text-xs">
                                                                {cusp.starLord}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark rounded font-semibold text-xs">
                                                                {cusp.subLord}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <span className="px-2 py-0.5 bg-parchment text-secondary rounded text-xs font-medium">
                                                                {cusp.subSubLord}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-6 text-sm">No cuspal data available</p>
                                )}
                            </div>
                        )}

                        {/* Planetary Positions */}
                        {activeSidebarSection === 'kp-analysis' && (
                            <div className="bg-softwhite border border-antique rounded-2xl p-5 overflow-hidden">
                                <h3 className="text-base font-serif text-primary mb-4 font-semibold">Planetary Positions</h3>
                                {planetsCuspsQuery.isLoading && !planetaryData.length ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : planetaryData.length > 0 ? (
                                    <KpPlanetaryTable planets={planetaryData} />
                                ) : (
                                    <p className="text-muted text-center py-6 text-sm">No planetary data available</p>
                                )}
                            </div>
                        )}

                        {/* Significators */}
                        {activeSidebarSection === 'significators' && (
                            <div className="bg-softwhite border border-antique rounded-2xl p-5 overflow-hidden">
                                <h3 className="text-base font-serif text-primary mb-4 font-semibold">Significators Analysis</h3>
                                {(houseSignificators.length > 0 || significationData.length > 0) ? (
                                    <div className="space-y-4">
                                        {houseSignificators.length > 0 && (
                                            <HouseSignificatorsTable data={houseSignificators} />
                                        )}
                                        {significationData.length > 0 && (
                                            <SignificationMatrix significations={significationData} />
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-6 text-sm">No signification data available</p>
                                )}
                            </div>
                        )}

                        {/* Ruling Planets */}
                        {activeSidebarSection === 'ruling-planets' && (
                            <RulingPlanetsWidget
                                data={rulingPlanetsQuery.data?.data || null}
                                isLoading={rulingPlanetsQuery.isLoading}
                                onRefresh={() => rulingPlanetsQuery.refetch()}
                                calculatedAt={rulingPlanetsQuery.data?.calculatedAt}
                            />
                        )}

                        {/* Bhava Details */}
                        {activeSidebarSection === 'bhava-details' && (
                            <div className="bg-white border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">Bhava Details</h3>
                                {bhavaDetailsQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : Object.keys(bhavaDetails).length > 0 ? (
                                    <BhavaDetailsTable bhavaDetails={bhavaDetails} />
                                ) : (
                                    <p className="text-muted text-center py-8">No bhava details available</p>
                                )}
                            </div>
                        )}

                        {/* Interlinks */}
                        {activeSidebarSection === 'interlinks' && (
                            <div className="bg-white border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">Cuspal Interlinks</h3>
                                {interlinksQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : interlinksQuery.data?.data ? (
                                    <KpFocusedCuspView promises={interlinksData} cusps={cuspData} />
                                ) : (
                                    <p className="text-muted text-center py-8">No interlinks data available</p>
                                )}
                            </div>
                        )}

                        {/* Advanced SSL */}
                        {activeSidebarSection === 'advanced-ssl' && (
                            <div className="bg-white border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">Advanced SSL Analysis</h3>
                                {advancedSslQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : advancedSslQuery.data?.data ? (
                                    <KpAdvancedSslView promises={sslData} cusps={cuspData} />
                                ) : (
                                    <p className="text-muted text-center py-8">No advanced SSL data available</p>
                                )}
                            </div>
                        )}

                        {/* Nakshatra Nadi */}
                        {activeSidebarSection === 'nakshatra-nadi' && (
                            <div className="bg-white border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">Nakshatra Nadi</h3>
                                {nakshatraNadiQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : (nakshatraNadiQuery.data?.data && nadiData) ? (
                                    <KpNakshatraNadiFocusedView data={{ nadiData }} />
                                ) : (
                                    <p className="text-muted text-center py-8">No nakshatra nadi data available</p>
                                )}
                            </div>
                        )}

                        {/* Pars Fortuna */}
                        {activeSidebarSection === 'fortuna' && (
                            <div className="bg-white border border-antique rounded-2xl p-6">
                                <h3 className="font-serif font-bold text-lg text-ink mb-4">Pars Fortuna</h3>
                                {fortunaQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : (fortunaQuery.data?.data && fortunaData) ? (
                                    <KpFortunaView data={{ fortunaData }} />
                                ) : (
                                    <p className="text-muted text-center py-8">No fortuna data available</p>
                                )}
                            </div>
                        )}

                        {/* Dashas */}
                        {activeSidebarSection === 'dashas' && (
                            <KpDashaTimeline />
                        )}

                        {/* Transit */}
                        {activeSidebarSection === 'transit' && (
                            <KpTransitPanel />
                        )}

                        {/* Horary / Events */}
                        {activeSidebarSection === 'events' && (
                            <HoraryPanel
                                onSubmit={(horaryNumber, question) => {
                                    horaryMutation.mutate({ clientId, horaryNumber, question });
                                }}
                                result={horaryMutation.data?.data}
                                isLoading={horaryMutation.isPending}
                                error={horaryMutation.error?.message}
                            />
                        )}

                        {/* Notes */}
                        {activeSidebarSection === 'reports' && (
                            <KpPredictionNotes />
                        )}
                    </div>
                </div >
            )
            }

            {/* ==================== DETAILED VIEW (Existing Tab-Based) ==================== */}
            {
                viewMode === 'detailed' && (
                    <>
                        {/* Tabs */}
                        {(activeTab as string) !== 'ashtakavarga' && (activeTab as string) !== 'horary' && (
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
                        )}

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

                                        {/* Cusps Chart */}
                                        <div className="lg:col-span-2 bg-white border border-antique rounded-2xl p-6">
                                            <h3 className="font-serif font-bold text-lg text-ink mb-4">Cuspal Chart</h3>
                                            {planetsCuspsQuery.isLoading && !cuspData.length ? (
                                                <div className="flex items-center justify-center py-12">
                                                    <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                </div>
                                            ) : cuspData.length > 0 ? (
                                                <div className="aspect-square w-full max-w-[400px] mx-auto bg-parchment rounded-xl p-4 border border-antique/50">
                                                    <KpCuspalChart
                                                        planets={d1Data.planets}
                                                        houseSigns={cuspData.map(c => c.signId)}
                                                        className="w-full h-full"
                                                    />
                                                </div>
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
                                    {/* Show loading ONLY if queries are loading AND we don't have data */}
                                    {(houseSignificationsQuery.isLoading && !houseSignificators.length) || (planetSignificatorsQuery.isLoading && !significationData.length) ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (houseSignificators.length > 0 || significationData.length > 0) ? (
                                        <div className="space-y-8">
                                            {/* House View Table */}
                                            {houseSignificators.length > 0 && (
                                                <HouseSignificatorsTable data={houseSignificators} />
                                            )}
                                            {/* Planet View Table */}
                                            <SignificationMatrix significations={significationData} />
                                        </div>
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

                            {/* Cuspal Interlinks */}
                            {/* Custom Interlinks - Debug Logs Included */}
                            {/* Cuspal Interlinks */}

                            {activeTab === 'interlinks' && (
                                <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                                    {interlinksQuery.isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (
                                        interlinksQuery.data?.data ? (
                                            <KpFocusedCuspView promises={interlinksData} cusps={cuspData} />
                                        ) : (
                                            <p className="text-muted text-center py-8">No interlinks data available</p>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Advanced SSL */}
                            {activeTab === 'advanced-ssl' && (
                                <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                                    {advancedSslQuery.isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (
                                        advancedSslQuery.data?.data ? (
                                            <KpAdvancedSslView promises={sslData} cusps={cuspData} />
                                        ) : (
                                            <p className="text-muted text-center py-8">No Advanced SSL data available</p>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Nakshatra Nadi */}
                            {activeTab === 'nakshatra-nadi' && (
                                <div className="bg-white border border-antique rounded-2xl overflow-hidden">
                                    {nakshatraNadiQuery.isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (
                                        nakshatraNadiQuery.data?.data && nadiData ? (
                                            <KpNakshatraNadiFocusedView data={{ nadiData }} />
                                        ) : (
                                            <p className="text-muted text-center py-8">No Nakshatra Nadi data available</p>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Pars Fortuna */}
                            {activeTab === 'fortuna' && (
                                <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                                    {fortunaQuery.isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (
                                        fortunaQuery.data?.data && fortunaData ? (
                                            <KpFortunaView data={{ fortunaData }} />
                                        ) : (
                                            <p className="text-muted text-center py-8">No Fortuna data available</p>
                                        )
                                    )}
                                </div>
                            )}

                            {activeTab === 'ashtakavarga' && (
                                <div className="bg-white border border-antique rounded-2xl p-6 overflow-hidden">
                                    {ashtakavargaQuery.isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                        </div>
                                    ) : (
                                        ashtakavargaQuery.data?.data || ashtakavargaQuery.data ? (
                                            <ShodashaVargaTable data={ashtakavargaQuery.data?.data || ashtakavargaQuery.data} />
                                        ) : (
                                            <p className="text-muted text-center py-8">No Ashtakavarga data available</p>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Debug Box */}
                        <div className="mt-8 pt-8 border-t border-antique/20">
                            <details className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/5">
                                <summary className="p-4 text-white font-mono text-xs cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Star className="w-3 h-3 text-gold-primary" />
                                        🛠️ KP Storage & Debug Inspector
                                    </span>
                                    <span className="text-[10px] opacity-50 uppercase tracking-widest">Click to Expand</span>
                                </summary>
                                <div className="p-6 bg-slate-950 space-y-6">
                                    {/* Storage Status Grid */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Database Storage Status</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {[
                                                { id: 'D1_kp', label: 'Natal Chart (KP)' },
                                                { id: 'kp_planets_cusps_kp', label: 'Planets & Cusps' },
                                                { id: 'kp_significations_kp', label: 'Significations' },
                                                { id: 'kp_house_significations_kp', label: 'House Table' },
                                                { id: 'kp_planet_significators_kp', label: 'Planet Matrix' },
                                                { id: 'kp_bhava_details_kp', label: 'Bhava Details' },
                                                { id: 'kp_interlinks_kp', label: 'Interlinks' },
                                                { id: 'kp_interlinks_advanced_kp', label: 'Advanced SSL' },
                                                { id: 'kp_interlinks_sl_kp', label: 'Interlinks (SL)' },
                                                { id: 'kp_nakshatra_nadi_kp', label: 'Nakshatra Nadi' },
                                                { id: 'kp_fortuna_kp', label: 'Pars Fortuna' },
                                                { id: 'kp_ruling_planets_kp', label: 'Ruling Planets' },
                                                { id: 'shodasha_varga_signs_kp', label: 'Shodasha Varga' },
                                            ].map((item) => {
                                                const isSaved = !!processedCharts[item.id];
                                                return (
                                                    <div key={item.id} className={cn(
                                                        "p-2 rounded border text-[10px] font-mono flex items-center justify-between gap-2",
                                                        isSaved
                                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                            : "bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60"
                                                    )}>
                                                        <span className="truncate">{item.label}</span>
                                                        <span className="flex-shrink-0">{isSaved ? '✅ SAVED' : '❌ MISS'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Raw API Response Viewers */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Active Tab Query State</h4>
                                            <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                                <pre className="text-green-500 text-[10px] leading-relaxed">
                                                    {activeTab === 'interlinks' && JSON.stringify(interlinksQuery.data, null, 2)}
                                                    {activeTab === 'advanced-ssl' && JSON.stringify(advancedSslQuery.data, null, 2)}
                                                    {activeTab === 'nakshatra-nadi' && JSON.stringify(nakshatraNadiQuery.data, null, 2)}
                                                    {activeTab === 'fortuna' && JSON.stringify(fortunaQuery.data, null, 2)}
                                                    {activeTab === 'planets-cusps' && JSON.stringify(planetsCuspsQuery.data, null, 2)}
                                                    {activeTab === 'significations' && JSON.stringify({ house: houseSignificationsQuery.data, planet: planetSignificatorsQuery.data }, null, 2)}
                                                    {activeTab === 'bhava-details' && JSON.stringify(bhavaDetailsQuery.data, null, 2)}
                                                    {activeTab === 'ruling-planets' && JSON.stringify(rulingPlanetsQuery.data, null, 2)}
                                                    {activeTab === 'ashtakavarga' && JSON.stringify(ashtakavargaQuery.data, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Full Payload Inspector</h4>
                                            <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                                <pre className="text-blue-400 text-[10px] leading-relaxed">
                                                    {JSON.stringify({
                                                        processedKeys: Object.keys(processedCharts).filter(k => k.toLowerCase().includes('kp') || k.startsWith('D1')),
                                                        ayanamsa,
                                                        clientId,
                                                        tab: activeTab
                                                    }, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </>
                )
            }
        </div >
    );
}
