"use client";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Sun, Home, Sparkles, Star, Crown, AlertTriangle, Shield, Moon } from 'lucide-react';
import NorthIndianChart, { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';

// Planet color mapping
const PLANET_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Su': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Sun': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Mo': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
    'Moon': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
    'Ma': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Mars': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Me': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Mercury': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Ju': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Jupiter': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Ve': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Venus': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Sa': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Saturn': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Ra': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    'Rahu': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    'Ke': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Ketu': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

const SIGN_NAMES: Record<number, string> = {
    1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
    5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
    9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces'
};

const ZODIAC_SYMBOLS: Record<number, string> = {
    1: '♈', 2: '♉', 3: '♊', 4: '♋', 5: '♌', 6: '♍',
    7: '♎', 8: '♏', 9: '♐', 10: '♑', 11: '♒', 12: '♓'
};

// Planetary Dignities: Exaltation and Debilitation signs
const EXALTATION_SIGNS: Record<string, number> = {
    'Su': 1, 'Sun': 1,       // Aries
    'Mo': 2, 'Moon': 2,      // Taurus
    'Ma': 10, 'Mars': 10,    // Capricorn
    'Me': 6, 'Mercury': 6,   // Virgo
    'Ju': 4, 'Jupiter': 4,   // Cancer
    'Ve': 12, 'Venus': 12,   // Pisces
    'Sa': 7, 'Saturn': 7,    // Libra
    'Ra': 3, 'Rahu': 3,      // Gemini (some traditions say Taurus)
    'Ke': 9, 'Ketu': 9,      // Sagittarius
};

const DEBILITATION_SIGNS: Record<string, number> = {
    'Su': 7, 'Sun': 7,       // Libra
    'Mo': 8, 'Moon': 8,      // Scorpio
    'Ma': 4, 'Mars': 4,      // Cancer
    'Me': 12, 'Mercury': 12, // Pisces
    'Ju': 10, 'Jupiter': 10, // Capricorn
    'Ve': 6, 'Venus': 6,     // Virgo
    'Sa': 1, 'Saturn': 1,    // Aries
    'Ra': 9, 'Rahu': 9,      // Sagittarius
    'Ke': 3, 'Ketu': 3,      // Gemini
};

// Own signs for each planet
const OWN_SIGNS: Record<string, number[]> = {
    'Su': [5], 'Sun': [5],           // Leo
    'Mo': [4], 'Moon': [4],          // Cancer
    'Ma': [1, 8], 'Mars': [1, 8],    // Aries, Scorpio
    'Me': [3, 6], 'Mercury': [3, 6], // Gemini, Virgo
    'Ju': [9, 12], 'Jupiter': [9, 12], // Sagittarius, Pisces
    'Ve': [2, 7], 'Venus': [2, 7],   // Taurus, Libra
    'Sa': [10, 11], 'Saturn': [10, 11], // Capricorn, Aquarius
};

// Nakshatra data (27 nakshatras, each 13°20')
const NAKSHATRAS = [
    { name: 'Ashwini', lord: 'Ke', start: 0 },
    { name: 'Bharani', lord: 'Ve', start: 13.333 },
    { name: 'Krittika', lord: 'Su', start: 26.666 },
    { name: 'Rohini', lord: 'Mo', start: 40 },
    { name: 'Mrigashira', lord: 'Ma', start: 53.333 },
    { name: 'Ardra', lord: 'Ra', start: 66.666 },
    { name: 'Punarvasu', lord: 'Ju', start: 80 },
    { name: 'Pushya', lord: 'Sa', start: 93.333 },
    { name: 'Ashlesha', lord: 'Me', start: 106.666 },
    { name: 'Magha', lord: 'Ke', start: 120 },
    { name: 'P.Phalguni', lord: 'Ve', start: 133.333 },
    { name: 'U.Phalguni', lord: 'Su', start: 146.666 },
    { name: 'Hasta', lord: 'Mo', start: 160 },
    { name: 'Chitra', lord: 'Ma', start: 173.333 },
    { name: 'Swati', lord: 'Ra', start: 186.666 },
    { name: 'Vishakha', lord: 'Ju', start: 200 },
    { name: 'Anuradha', lord: 'Sa', start: 213.333 },
    { name: 'Jyeshtha', lord: 'Me', start: 226.666 },
    { name: 'Moola', lord: 'Ke', start: 240 },
    { name: 'P.Ashadha', lord: 'Ve', start: 253.333 },
    { name: 'U.Ashadha', lord: 'Su', start: 266.666 },
    { name: 'Shravana', lord: 'Mo', start: 280 },
    { name: 'Dhanishta', lord: 'Ma', start: 293.333 },
    { name: 'Shatabhisha', lord: 'Ra', start: 306.666 },
    { name: 'P.Bhadra', lord: 'Ju', start: 320 },
    { name: 'U.Bhadra', lord: 'Sa', start: 333.333 },
    { name: 'Revati', lord: 'Me', start: 346.666 },
];

// House significations
const HOUSE_SIGNIFICATIONS: Record<number, { name: string; keywords: string[] }> = {
    1: { name: 'Tanu Bhava', keywords: ['Self', 'Body', 'Personality', 'Health'] },
    2: { name: 'Dhana Bhava', keywords: ['Wealth', 'Family', 'Speech', 'Values'] },
    3: { name: 'Sahaja Bhava', keywords: ['Siblings', 'Courage', 'Communication', 'Short Travels'] },
    4: { name: 'Sukha Bhava', keywords: ['Mother', 'Home', 'Emotions', 'Property'] },
    5: { name: 'Putra Bhava', keywords: ['Children', 'Creativity', 'Romance', 'Intelligence'] },
    6: { name: 'Ari Bhava', keywords: ['Enemies', 'Diseases', 'Debts', 'Service'] },
    7: { name: 'Kalatra Bhava', keywords: ['Marriage', 'Partnership', 'Business', 'Public'] },
    8: { name: 'Randhra Bhava', keywords: ['Transformation', 'Longevity', 'Occult', 'Inheritance'] },
    9: { name: 'Dharma Bhava', keywords: ['Fortune', 'Religion', 'Father', 'Higher Learning'] },
    10: { name: 'Karma Bhava', keywords: ['Career', 'Status', 'Authority', 'Reputation'] },
    11: { name: 'Labha Bhava', keywords: ['Gains', 'Friends', 'Hopes', 'Income'] },
    12: { name: 'Vyaya Bhava', keywords: ['Losses', 'Moksha', 'Foreign', 'Expenses'] },
};

// Helper functions
const getDignity = (planetName: string, signId: number): { type: string; color: string; icon: React.ReactNode } | null => {
    if (EXALTATION_SIGNS[planetName] === signId) {
        return { type: 'Exalted', color: 'bg-green-100 text-green-700 border-green-300', icon: <Crown className="w-3 h-3" /> };
    }
    if (DEBILITATION_SIGNS[planetName] === signId) {
        return { type: 'Debilitated', color: 'bg-red-100 text-red-700 border-red-300', icon: <AlertTriangle className="w-3 h-3" /> };
    }
    if (OWN_SIGNS[planetName]?.includes(signId)) {
        return { type: 'Own Sign', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: <Shield className="w-3 h-3" /> };
    }
    return null;
};

const getNakshatraInfo = (signId: number, degreeStr?: string): { name: string; lord: string; pada: number } => {
    // Parse degree from string like "17:30" or "17.5"
    let degree = 0;
    if (degreeStr) {
        if (degreeStr.includes(':')) {
            const [d, m] = degreeStr.split(':').map(Number);
            degree = d + (m || 0) / 60;
        } else {
            degree = parseFloat(degreeStr) || 0;
        }
    }

    // Calculate absolute longitude
    const absoluteDegree = ((signId - 1) * 30) + degree;

    // Find nakshatra (each is 13°20' = 13.333°)
    const nakshatraIndex = Math.floor(absoluteDegree / 13.333) % 27;
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    // Calculate pada (each pada is 3°20' = 3.333°)
    const positionInNakshatra = absoluteDegree - (nakshatraIndex * 13.333);
    const pada = Math.floor(positionInNakshatra / 3.333) + 1;

    return {
        name: nakshatra?.name || 'Unknown',
        lord: nakshatra?.lord || '?',
        pada: Math.min(4, Math.max(1, pada))
    };
};

interface DivisionalChartZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    chartType: string;
    chartName: string;
    chartDesc: string;
    planets: Planet[];
    ascendantSign: number;
    chartData?: any;
}

export default function DivisionalChartZoomModal({
    isOpen,
    onClose,
    chartType,
    chartName,
    chartDesc,
    planets,
    ascendantSign,
}: DivisionalChartZoomModalProps) {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedHouse) {
                    setSelectedHouse(null);
                } else {
                    onClose();
                }
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, selectedHouse]);

    if (!isOpen) return null;

    // Group planets by house
    const planetsByHouse: Record<number, Planet[]> = {};
    planets.forEach(p => {
        if (p.name === 'As' || p.name === 'Asc') return;
        const house = p.house || ((p.signId - ascendantSign + 12) % 12) + 1;
        if (!planetsByHouse[house]) planetsByHouse[house] = [];
        planetsByHouse[house].push(p);
    });

    const getPlanetColor = (name: string) => PLANET_COLORS[name] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    const retroPlanets = planets.filter(p => p.isRetro);
    const filteredPlanets = planets.filter(p => p.name !== 'As' && p.name !== 'Asc');

    // House click handler
    const handleHouseClick = (house: number) => {
        setSelectedHouse(selectedHouse === house ? null : house);
    };

    // Get house lord
    const getHouseLord = (house: number) => {
        const signId = ((ascendantSign + house - 2) % 12) + 1;
        const lords: Record<number, string> = {
            1: 'Ma', 2: 'Ve', 3: 'Me', 4: 'Mo', 5: 'Su', 6: 'Me',
            7: 'Ve', 8: 'Ma', 9: 'Ju', 10: 'Sa', 11: 'Sa', 12: 'Ju'
        };
        return lords[signId] || '?';
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex items-start justify-center overflow-y-auto"
            style={{ paddingTop: '110px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="bg-[#FDFBF7] rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row w-full max-w-6xl border-2 border-[#D08C60]/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* LEFT - Chart Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#D08C60] to-[#8B5A2B] text-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg font-bold shrink-0">
                                {chartType}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg font-serif font-bold truncate">{chartName}</h2>
                                <p className="text-white/70 text-xs truncate">{chartDesc}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
                            title="Close (ESC)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex items-center justify-center p-4 bg-[#FDFBF7]">
                        <div className="w-full max-w-[450px] aspect-square bg-white rounded-xl border border-[#D08C60]/20 p-4 shadow-lg">
                            <NorthIndianChart
                                ascendantSign={ascendantSign}
                                planets={planets}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT - Planet Details */}
                <div className="w-full lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-[#D08C60]/20 flex flex-col max-h-[500px] lg:max-h-[600px]">
                    {/* Ascendant + Stats */}
                    <div className="p-3 border-b border-[#D08C60]/10 flex items-center gap-3 bg-gradient-to-r from-purple-50/50 to-transparent">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-lg shrink-0">
                            {ZODIAC_SYMBOLS[ascendantSign]}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[8px] text-purple-600 uppercase tracking-wider font-bold">Lagna</span>
                            <h3 className="text-sm font-serif font-bold text-purple-900">{SIGN_NAMES[ascendantSign]}</h3>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <div className="text-center">
                                <Sun className="w-3.5 h-3.5 mx-auto text-amber-500" />
                                <span className="text-xs font-bold text-[#3E2A1F]">{filteredPlanets.length}</span>
                            </div>
                            <div className="text-center">
                                <Sparkles className="w-3.5 h-3.5 mx-auto text-rose-500" />
                                <span className="text-xs font-bold text-[#3E2A1F]">{retroPlanets.length}R</span>
                            </div>
                        </div>
                    </div>

                    {/* Planet List with Dignities & Nakshatra */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <h4 className="text-[10px] font-bold text-[#8B5A2B]/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                            <Star className="w-3.5 h-3.5" /> Planet Positions
                        </h4>
                        <div className="space-y-1.5">
                            {filteredPlanets.map((planet, idx) => {
                                const colors = getPlanetColor(planet.name);
                                const house = planet.house || ((planet.signId - ascendantSign + 12) % 12) + 1;
                                const dignity = getDignity(planet.name, planet.signId);
                                const nakshatra = getNakshatraInfo(planet.signId, planet.degree);

                                return (
                                    <div
                                        key={`${planet.name}-${idx}`}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg border",
                                            colors.bg, colors.border
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                                            colors.text, "bg-white/50"
                                        )}>
                                            {planet.name.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className={cn("font-bold text-sm", colors.text)}>{planet.name}</span>
                                                {planet.isRetro && (
                                                    <span className="text-[7px] bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold">R</span>
                                                )}
                                                {dignity && (
                                                    <span className={cn("text-[7px] px-1.5 py-0.5 rounded border font-bold flex items-center gap-0.5", dignity.color)}>
                                                        {dignity.icon}
                                                        {dignity.type}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[9px] text-[#8B5A2B]/80">
                                                {ZODIAC_SYMBOLS[planet.signId]} {SIGN_NAMES[planet.signId]} · {planet.degree}
                                            </div>
                                            <div className="text-[8px] text-[#8B5A2B]/60 flex items-center gap-1">
                                                <Moon className="w-2.5 h-2.5" />
                                                {nakshatra.name} P{nakshatra.pada} · Lord: {nakshatra.lord}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 bg-white/60 px-2 py-1 rounded">
                                            <span className="text-sm font-bold text-[#3E2A1F]">H{house}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Interactive House Grid */}
                    <div className="p-3 border-t border-[#D08C60]/10 bg-[#FDFBF7]/50">
                        <h4 className="text-[9px] font-bold text-[#8B5A2B]/70 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Home className="w-3 h-3" /> Click House for Details
                        </h4>
                        <div className="grid grid-cols-6 gap-1">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(house => {
                                const housePlanets = planetsByHouse[house] || [];
                                const hasPlayers = housePlanets.length > 0;
                                const signId = ((ascendantSign + house - 2) % 12) + 1;
                                const isSelected = selectedHouse === house;

                                return (
                                    <button
                                        key={house}
                                        onClick={() => handleHouseClick(house)}
                                        className={cn(
                                            "p-1.5 rounded-lg text-center text-[9px] transition-all cursor-pointer",
                                            isSelected
                                                ? "bg-[#D08C60] text-white ring-2 ring-[#D08C60]/50"
                                                : hasPlayers
                                                    ? "bg-[#D08C60]/15 border border-[#D08C60]/30 hover:bg-[#D08C60]/25"
                                                    : "bg-gray-50/50 hover:bg-gray-100"
                                        )}
                                    >
                                        <div className="font-bold">{house}</div>
                                        {hasPlayers && !isSelected && (
                                            <div className="text-[7px] text-[#D08C60] font-medium truncate">
                                                {housePlanets.map(p => p.name.substring(0, 2)).join(',')}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* House Details Popup */}
                        {selectedHouse && (
                            <div className="mt-2 p-3 bg-white rounded-lg border border-[#D08C60]/30 shadow-lg animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-lg font-bold text-[#3E2A1F]">House {selectedHouse}</span>
                                        <span className="text-xs text-[#8B5A2B]/70 ml-2">
                                            {ZODIAC_SYMBOLS[((ascendantSign + selectedHouse - 2) % 12) + 1]} {SIGN_NAMES[((ascendantSign + selectedHouse - 2) % 12) + 1]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedHouse(null)}
                                        className="text-[#8B5A2B]/50 hover:text-[#8B5A2B]"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-[10px] text-[#8B5A2B] mb-2">
                                    <span className="font-bold">{HOUSE_SIGNIFICATIONS[selectedHouse]?.name}</span>
                                    <span className="mx-1">·</span>
                                    <span className="text-[#8B5A2B]/70">Lord: {getHouseLord(selectedHouse)}</span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-2">
                                    {HOUSE_SIGNIFICATIONS[selectedHouse]?.keywords.map((kw, i) => (
                                        <span key={i} className="text-[8px] bg-[#D08C60]/10 text-[#8B5A2B] px-1.5 py-0.5 rounded-full">
                                            {kw}
                                        </span>
                                    ))}
                                </div>

                                {(planetsByHouse[selectedHouse]?.length || 0) > 0 ? (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-[#3E2A1F] uppercase">Planets in House:</span>
                                        {planetsByHouse[selectedHouse].map((p, i) => {
                                            const dignity = getDignity(p.name, p.signId);
                                            return (
                                                <div key={i} className="flex items-center gap-2 text-[10px] bg-gray-50 px-2 py-1 rounded">
                                                    <span className="font-bold">{p.name}</span>
                                                    <span className="text-[#8B5A2B]/70">{p.degree}</span>
                                                    {p.isRetro && <span className="text-rose-600 font-bold">℞</span>}
                                                    {dignity && <span className={cn("text-[7px] px-1 rounded", dignity.color)}>{dignity.type}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-[#8B5A2B]/50 italic">No planets in this house</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
