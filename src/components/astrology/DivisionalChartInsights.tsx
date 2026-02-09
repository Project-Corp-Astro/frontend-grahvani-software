"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Planet } from '@/components/astrology/NorthIndianChart';
import { Sparkles } from 'lucide-react';

interface DivisionalChartInsightsProps {
    chartType: string;
    planets: Planet[];
    ascendant: number;
    className?: string;
}

const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// Helper to safely get sign name
const getSignName = (signId: number | undefined): string => {
    if (!signId || signId < 1 || signId > 12) return '-';
    return SIGN_NAMES[signId - 1] || '-';
};

// Get house number from signId and ascendant
const getHouse = (signId: number | undefined, asc: number): number => {
    if (!signId) return 0;
    return ((signId - asc + 12) % 12) + 1;
};

// Check if planet is in specific house
const inHouse = (planet: Planet | undefined, houses: number[], asc: number): boolean => {
    if (!planet?.signId) return false;
    const h = getHouse(planet.signId, asc);
    return houses.includes(h);
};

// Simple yoga detection for each chart
const detectYogas = (chartType: string, planets: Planet[], asc: number): { name: string; present: boolean; desc: string }[] => {
    const sun = planets.find(p => p.name === 'Su');
    const moon = planets.find(p => p.name === 'Mo');
    const mars = planets.find(p => p.name === 'Ma');
    const mercury = planets.find(p => p.name === 'Me');
    const jupiter = planets.find(p => p.name === 'Ju');
    const venus = planets.find(p => p.name === 'Ve');
    const saturn = planets.find(p => p.name === 'Sa');
    const rahu = planets.find(p => p.name === 'Ra');
    const ketu = planets.find(p => p.name === 'Ke');

    const yogas: { name: string; present: boolean; desc: string }[] = [];

    switch (chartType) {
        case 'D1':
            // Gajakesari Yoga: Jupiter in kendra from Moon
            const moonHouse = getHouse(moon?.signId, asc);
            const jupHouse = getHouse(jupiter?.signId, asc);
            const moonKendras = [moonHouse, ((moonHouse + 2) % 12) + 1, ((moonHouse + 5) % 12) + 1, ((moonHouse + 8) % 12) + 1];
            yogas.push({ name: 'Gajakesari', present: moonKendras.includes(jupHouse), desc: 'Jupiter in kendra from Moon' });

            // Budhaditya Yoga: Sun-Mercury conjunction
            yogas.push({ name: 'Budhaditya', present: sun?.signId === mercury?.signId, desc: 'Sun-Mercury together' });
            break;

        case 'D9':
            // Vargottama Lagna in D9
            const d1Asc = asc; // Simplified - would need D1 data
            yogas.push({ name: 'Strong Venus', present: ['Taurus', 'Libra', 'Pisces'].includes(getSignName(venus?.signId)), desc: 'Venus in dignity' });
            yogas.push({ name: 'Jupiter Aspecting 7th', present: inHouse(jupiter, [1, 7], asc), desc: 'Marriage blessing' });
            break;

        case 'D10':
            // Sun in 10th - Raja Yoga
            yogas.push({ name: 'Leadership', present: inHouse(sun, [10, 1], asc), desc: 'Sun in angles = authority' });
            // Saturn strong
            yogas.push({ name: 'Career Success', present: ['Capricorn', 'Aquarius', 'Libra'].includes(getSignName(saturn?.signId)), desc: 'Saturn in dignity' });
            break;

        case 'D7':
            // Jupiter 5th house
            yogas.push({ name: 'Child Blessing', present: inHouse(jupiter, [1, 5, 9], asc), desc: 'Jupiter in trikona' });
            break;

        case 'D24':
            // Mercury strong
            yogas.push({ name: 'Academic Success', present: ['Gemini', 'Virgo'].includes(getSignName(mercury?.signId)), desc: 'Mercury in own sign' });
            yogas.push({ name: 'Higher Learning', present: inHouse(jupiter, [4, 5, 9], asc), desc: 'Jupiter supporting education' });
            break;

        case 'D2':
            // Wealth indicators
            yogas.push({ name: 'Self-Earned', present: planets.filter(p => p.signId === 5).length >= 3, desc: '3+ planets in Sun Hora' });
            yogas.push({ name: 'Inherited', present: planets.filter(p => p.signId === 4).length >= 3, desc: '3+ planets in Moon Hora' });
            break;

        case 'D20':
            // Spiritual
            yogas.push({ name: 'Spiritual Growth', present: inHouse(ketu, [9, 12], asc), desc: 'Ketu in moksha house' });
            yogas.push({ name: 'Divine Grace', present: inHouse(jupiter, [1, 5, 9], asc), desc: 'Jupiter in trikona' });
            break;
    }

    return yogas;
};

// Chart-specific analysis rules
const CHART_INSIGHTS: Record<string, {
    title: string;
    keyPlanets: string[];
    keyHouses: number[];
    getInsight: (planets: Planet[], asc: number) => { label: string; value: string; status: 'good' | 'neutral' | 'weak' }[];
}> = {
    'D1': {
        title: 'Physical & Overall Life',
        keyPlanets: ['Su', 'Mo', 'As'],
        keyHouses: [1, 9, 10],
        getInsight: (planets, asc) => {
            const lagna = getSignName(asc);
            const sun = planets.find(p => p.name === 'Su');
            const moon = planets.find(p => p.name === 'Mo');
            return [
                { label: 'Lagna', value: lagna.substring(0, 3), status: 'neutral' },
                { label: 'Sun', value: getSignName(sun?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Moon', value: getSignName(moon?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D2': {
        title: 'Wealth & Resources',
        keyPlanets: ['Su', 'Mo', 'Ju'],
        keyHouses: [2, 11],
        getInsight: (planets, asc) => {
            const sunInSunHora = planets.filter(p => p.signId === 5).length;
            const moonInMoonHora = planets.filter(p => p.signId === 4).length;
            const jupiter = planets.find(p => p.name === 'Ju');
            const jupSign = getSignName(jupiter?.signId);

            return [
                { label: 'Sun Hora', value: `${sunInSunHora} pl`, status: sunInSunHora >= 3 ? 'good' : 'neutral' },
                { label: 'Moon Hora', value: `${moonInMoonHora} pl`, status: moonInMoonHora >= 3 ? 'good' : 'neutral' },
                { label: 'Jupiter', value: jupSign.substring(0, 3), status: ['Cancer', 'Sagittarius', 'Pisces'].includes(jupSign) ? 'good' : 'neutral' }
            ];
        }
    },
    'D3': {
        title: 'Courage & Siblings',
        keyPlanets: ['Ma', 'Me'],
        keyHouses: [3, 11],
        getInsight: (planets, asc) => {
            const mars = planets.find(p => p.name === 'Ma');
            const marsSign = getSignName(mars?.signId);
            const h3Planets = planets.filter(p => p.signId && ((p.signId - asc + 12) % 12) + 1 === 3).length;

            return [
                { label: 'Mars', value: marsSign.substring(0, 3), status: ['Aries', 'Scorpio', 'Capricorn'].includes(marsSign) ? 'good' : marsSign === 'Cancer' ? 'weak' : 'neutral' },
                { label: '3rd H', value: `${h3Planets} pl`, status: h3Planets > 0 ? 'good' : 'neutral' }
            ];
        }
    },
    'D4': {
        title: 'Property & Fortune',
        keyPlanets: ['Ma', 'Ve', 'Sa'],
        keyHouses: [4],
        getInsight: (planets, asc) => {
            const h4Planets = planets.filter(p => p.signId && ((p.signId - asc + 12) % 12) + 1 === 4);
            const venus = planets.find(p => p.name === 'Ve');

            return [
                { label: '4th H', value: `${h4Planets.length} pl`, status: h4Planets.length > 0 ? 'good' : 'neutral' },
                { label: 'Venus', value: getSignName(venus?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D7': {
        title: 'Children & Progeny',
        keyPlanets: ['Ju', 'Su'],
        keyHouses: [5],
        getInsight: (planets, asc) => {
            const jupiter = planets.find(p => p.name === 'Ju');
            const jupSign = getSignName(jupiter?.signId);
            const h5Planets = planets.filter(p => p.signId && ((p.signId - asc + 12) % 12) + 1 === 5).length;

            return [
                { label: 'Jupiter', value: jupSign.substring(0, 3), status: ['Cancer', 'Sagittarius', 'Pisces'].includes(jupSign) ? 'good' : jupSign === 'Capricorn' ? 'weak' : 'neutral' },
                { label: '5th H', value: `${h5Planets} pl`, status: h5Planets > 0 ? 'good' : 'neutral' }
            ];
        }
    },
    'D9': {
        title: 'Marriage & Dharma',
        keyPlanets: ['Ve', 'Ju', 'Mo'],
        keyHouses: [7, 1],
        getInsight: (planets, asc) => {
            const venus = planets.find(p => p.name === 'Ve');
            const veSign = getSignName(venus?.signId);
            const jupiter = planets.find(p => p.name === 'Ju');
            const juSign = getSignName(jupiter?.signId);
            const h7Planets = planets.filter(p => p.signId && ((p.signId - asc + 12) % 12) + 1 === 7).length;

            return [
                { label: 'Venus', value: veSign.substring(0, 3), status: ['Taurus', 'Libra', 'Pisces'].includes(veSign) ? 'good' : veSign === 'Virgo' ? 'weak' : 'neutral' },
                { label: 'Jupiter', value: juSign.substring(0, 3), status: ['Cancer', 'Sagittarius'].includes(juSign) ? 'good' : 'neutral' },
                { label: '7th H', value: `${h7Planets} pl`, status: 'neutral' }
            ];
        }
    },
    'D10': {
        title: 'Career & Profession',
        keyPlanets: ['Su', 'Sa', 'Ma', 'Me'],
        keyHouses: [10, 1],
        getInsight: (planets, asc) => {
            const sun = planets.find(p => p.name === 'Su');
            const suSign = getSignName(sun?.signId);
            const saturn = planets.find(p => p.name === 'Sa');
            const saSign = getSignName(saturn?.signId);
            const h10Planets = planets.filter(p => p.signId && ((p.signId - asc + 12) % 12) + 1 === 10).length;

            return [
                { label: 'Sun', value: suSign.substring(0, 3), status: ['Aries', 'Leo'].includes(suSign) ? 'good' : suSign === 'Libra' ? 'weak' : 'neutral' },
                { label: 'Saturn', value: saSign.substring(0, 3), status: ['Capricorn', 'Aquarius', 'Libra'].includes(saSign) ? 'good' : saSign === 'Aries' ? 'weak' : 'neutral' },
                { label: '10th H', value: `${h10Planets} pl`, status: h10Planets > 0 ? 'good' : 'neutral' }
            ];
        }
    },
    'D12': {
        title: 'Parents',
        keyPlanets: ['Su', 'Mo'],
        keyHouses: [4, 9],
        getInsight: (planets, asc) => {
            const sun = planets.find(p => p.name === 'Su');
            const moon = planets.find(p => p.name === 'Mo');

            return [
                { label: 'Father', value: getSignName(sun?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Mother', value: getSignName(moon?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D16': {
        title: 'Vehicles & Comforts',
        keyPlanets: ['Ve', 'Ma'],
        keyHouses: [4],
        getInsight: (planets, asc) => {
            const venus = planets.find(p => p.name === 'Ve');
            const mars = planets.find(p => p.name === 'Ma');

            return [
                { label: 'Venus', value: getSignName(venus?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Mars', value: getSignName(mars?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D20': {
        title: 'Spiritual Progress',
        keyPlanets: ['Ju', 'Ke', 'Mo'],
        keyHouses: [9, 12],
        getInsight: (planets, asc) => {
            const jupiter = planets.find(p => p.name === 'Ju');
            const ketu = planets.find(p => p.name === 'Ke');

            return [
                { label: 'Jupiter', value: getSignName(jupiter?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Ketu', value: getSignName(ketu?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D24': {
        title: 'Education & Learning',
        keyPlanets: ['Me', 'Ju'],
        keyHouses: [4, 5, 9],
        getInsight: (planets, asc) => {
            const mercury = planets.find(p => p.name === 'Me');
            const meSign = getSignName(mercury?.signId);
            const jupiter = planets.find(p => p.name === 'Ju');

            return [
                { label: 'Mercury', value: meSign.substring(0, 3), status: ['Gemini', 'Virgo'].includes(meSign) ? 'good' : meSign === 'Pisces' ? 'weak' : 'neutral' },
                { label: 'Jupiter', value: getSignName(jupiter?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D27': {
        title: 'Strength & Stamina',
        keyPlanets: ['Ma', 'Su'],
        keyHouses: [1, 3],
        getInsight: (planets, asc) => {
            const mars = planets.find(p => p.name === 'Ma');
            const sun = planets.find(p => p.name === 'Su');

            return [
                { label: 'Mars', value: getSignName(mars?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Sun', value: getSignName(sun?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D30': {
        title: 'Evils & Misfortunes',
        keyPlanets: ['Sa', 'Ra', 'Ma'],
        keyHouses: [6, 8, 12],
        getInsight: (planets, asc) => {
            const saturn = planets.find(p => p.name === 'Sa');
            const rahu = planets.find(p => p.name === 'Ra');

            return [
                { label: 'Saturn', value: getSignName(saturn?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Rahu', value: getSignName(rahu?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D40': {
        title: 'Maternal Legacy',
        keyPlanets: ['Mo', 'Ve'],
        keyHouses: [4],
        getInsight: (planets, asc) => {
            const moon = planets.find(p => p.name === 'Mo');

            return [
                { label: 'Moon', value: getSignName(moon?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D45': {
        title: 'Paternal Legacy',
        keyPlanets: ['Su', 'Ju'],
        keyHouses: [9],
        getInsight: (planets, asc) => {
            const sun = planets.find(p => p.name === 'Su');

            return [
                { label: 'Sun', value: getSignName(sun?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    },
    'D60': {
        title: 'Past Life Karma',
        keyPlanets: ['Sa', 'Ra', 'Ke'],
        keyHouses: [8, 12],
        getInsight: (planets, asc) => {
            const saturn = planets.find(p => p.name === 'Sa');
            const ketu = planets.find(p => p.name === 'Ke');

            return [
                { label: 'Saturn', value: getSignName(saturn?.signId).substring(0, 3), status: 'neutral' },
                { label: 'Ketu', value: getSignName(ketu?.signId).substring(0, 3), status: 'neutral' }
            ];
        }
    }
};

const STATUS_STYLES = {
    good: 'bg-green-100 text-green-700 border-green-200',
    neutral: 'bg-[#FAF8F5] text-[#3E2A1F] border-[#E8DDD0]',
    weak: 'bg-red-100 text-red-600 border-red-200'
};

export default function DivisionalChartInsights({ chartType, planets, ascendant, className }: DivisionalChartInsightsProps) {
    const config = CHART_INSIGHTS[chartType];

    if (!config || planets.length === 0) return null;

    const insights = config.getInsight(planets, ascendant);
    const yogas = detectYogas(chartType, planets, ascendant);
    const presentYogas = yogas.filter(y => y.present);

    return (
        <div className={cn("mt-2 space-y-1.5", className)}>
            {/* Insights Row */}
            <div className="flex items-center gap-1 flex-wrap">
                {insights.map((ins, idx) => (
                    <div key={idx} className={cn(
                        "px-1.5 py-0.5 rounded border text-[8px] font-medium",
                        STATUS_STYLES[ins.status]
                    )}>
                        <span className="opacity-70">{ins.label}:</span> <span className="font-bold">{ins.value}</span>
                    </div>
                ))}
            </div>

            {/* Yogas Row - Only show if there are present yogas */}
            {presentYogas.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                    {presentYogas.map((yoga, idx) => (
                        <div
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 text-[8px] font-medium text-amber-800 flex items-center gap-0.5"
                            title={yoga.desc}
                        >
                            <Sparkles className="w-2.5 h-2.5" />
                            {yoga.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
