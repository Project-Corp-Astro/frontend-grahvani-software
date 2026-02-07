"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpPromise } from '@/types/kp.types';

// Zodiac symbols for cusp selector
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// House topics for interpretation
const HOUSE_TOPICS: Record<number, string> = {
    1: 'Self & Personality',
    2: 'Wealth & Family',
    3: 'Siblings & Courage',
    4: 'Home & Mother',
    5: 'Children & Education',
    6: 'Health & Enemies',
    7: 'Partnership & Marriage',
    8: 'Longevity & Transformation',
    9: 'Fortune & Father',
    10: 'Career & Status',
    11: 'Gains & Friends',
    12: 'Loss & Liberation'
};

// Planet symbols
const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿', 'Jupiter': '♃',
    'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
    'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿', 'Ju': '♃',
    'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋'
};

interface CuspData {
    cusp: number;
    sign: string;
    signId: number;
    degree?: number;
    degreeFormatted?: string;
}

interface KpFocusedCuspViewProps {
    promises: KpPromise[];
    cusps?: CuspData[];
    className?: string;
}

export const KpFocusedCuspView: React.FC<KpFocusedCuspViewProps> = ({
    promises,
    cusps = [],
    className
}) => {
    const [selectedCusp, setSelectedCusp] = useState(1);

    // Get current cusp data
    const currentPromise = useMemo((): KpPromise | null => {
        const arr: KpPromise[] = Array.isArray(promises) ? promises : Object.values(promises || {});
        return arr.find((p) => p.houseNumber === selectedCusp) || null;
    }, [promises, selectedCusp]);

    const currentCuspInfo = useMemo(() => {
        return cusps.find(c => c.cusp === selectedCusp) || null;
    }, [cusps, selectedCusp]);

    // Compute neutral houses (1-12 excluding positive and negative)
    const neutralHouses = useMemo(() => {
        if (!currentPromise) return [];
        const positive = new Set(currentPromise.positiveHouses || []);
        const negative = new Set(currentPromise.negativeHouses || []);
        return Array.from({ length: 12 }, (_, i) => i + 1)
            .filter(h => !positive.has(h) && !negative.has(h));
    }, [currentPromise]);

    // Get sign name and format degree
    const signName = currentCuspInfo?.sign || ZODIAC_NAMES[(currentCuspInfo?.signId || 1) - 1] || 'Aries';
    const degreeDisplay = currentCuspInfo?.degreeFormatted || `${(currentCuspInfo?.degree || 0).toFixed(2)}°`;

    return (
        <div className={cn("space-y-6 animate-in fade-in duration-500", className)}>
            {/* Cusp Selector */}
            <div className="flex items-center justify-center gap-1 p-2 bg-parchment rounded-xl border border-antique overflow-x-auto">
                <button className="p-2 text-muted hover:text-ink transition-colors" onClick={() => setSelectedCusp(Math.max(1, selectedCusp - 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(cusp => {
                    const cuspInfo = cusps.find(c => c.cusp === cusp);
                    const signIdx = (cuspInfo?.signId || cusp) - 1;
                    const isActive = selectedCusp === cusp;
                    return (
                        <button
                            key={cusp}
                            onClick={() => setSelectedCusp(cusp)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg transition-all duration-300 font-serif",
                                isActive
                                    ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md scale-105"
                                    : "bg-white/50 text-ink hover:bg-white hover:shadow-sm border border-antique/30"
                            )}
                        >
                            <span className="text-lg">{ZODIAC_SYMBOLS[signIdx] || '♈'}</span>
                            <span className="text-[10px] font-medium opacity-80">C{cusp}</span>
                        </button>
                    );
                })}
                <button className="p-2 text-muted hover:text-ink transition-colors" onClick={() => setSelectedCusp(Math.min(12, selectedCusp + 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Focused Cusp Script */}
                <div className="bg-white rounded-2xl p-6 border border-antique shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest font-serif">Focused Cusp Script</h3>
                        <span className="px-2 py-1 bg-parchment rounded border border-antique text-[10px] text-ink font-medium">{selectedCusp}th House ({HOUSE_TOPICS[selectedCusp]})</span>
                    </div>

                    {/* Cusp Position */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-light text-ink tracking-tight font-serif">
                            {signName} <span className="text-muted">{degreeDisplay}</span>
                        </h2>
                    </div>

                    {/* Lord Chain */}
                    {currentPromise && (
                        <div className="relative pl-8">
                            {/* Vertical Line */}
                            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-gold-primary/50 via-antique to-antique/50" />

                            {/* Sign Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-parchment border-2 border-antique" />
                                <span className="text-lg text-muted">{PLANET_SYMBOLS[currentPromise.chain.signLord.planet] || '☉'}</span>
                                <div>
                                    <span className="text-xs text-muted block">Sign Lord</span>
                                    <span className="text-ink font-medium font-serif">{currentPromise.chain.signLord.planet}</span>
                                    {currentPromise.chain.signLord.isRetro && <span className="text-rose-600 ml-1 text-xs">(R)</span>}
                                </div>
                            </div>

                            {/* Star Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-parchment border-2 border-antique" />
                                <span className="text-lg text-muted">{PLANET_SYMBOLS[currentPromise.chain.starLord.planet] || '☉'}</span>
                                <div>
                                    <span className="text-xs text-muted block">Star Lord</span>
                                    <span className="text-ink font-medium font-serif">{currentPromise.chain.starLord.planet}</span>
                                    {currentPromise.chain.starLord.isRetro && <span className="text-rose-600 ml-1 text-xs">(R)</span>}
                                </div>
                            </div>

                            {/* Sub Lord - Highlighted */}
                            <div className="relative flex items-center gap-3 py-3 my-2">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-gold-primary border-2 border-gold-dark shadow-sm" />
                                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gold-primary to-gold-dark rounded-lg shadow-md">
                                    <span className="text-lg text-white">{PLANET_SYMBOLS[currentPromise.chain.subLord.planet] || '☉'}</span>
                                    <div>
                                        <span className="text-[10px] text-white/80 block uppercase tracking-wider">Sub Lord</span>
                                        <span className="text-white font-bold text-lg font-serif">{currentPromise.chain.subLord.planet}</span>
                                        {currentPromise.chain.subLord.isRetro && <span className="text-rose-200 ml-1 text-xs">(R)</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Sub-Sub Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-parchment border-2 border-antique" />
                                <span className="text-lg text-muted">{PLANET_SYMBOLS[currentPromise.chain.subSubLord.planet] || '☉'}</span>
                                <div>
                                    <span className="text-xs text-muted block">Sub-Sub Lord</span>
                                    <span className="text-ink font-medium font-serif">{currentPromise.chain.subSubLord.planet}</span>
                                    {currentPromise.chain.subSubLord.isRetro && <span className="text-rose-600 ml-1 text-xs">(R)</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {!currentPromise && (
                        <div className="text-center py-8 text-muted">
                            <p>No interlink data for House {selectedCusp}</p>
                        </div>
                    )}
                </div>

                {/* Right Panel - Cuspal Interlinks Promise */}
                <div className="bg-white rounded-2xl p-6 border border-antique shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest font-serif">Cuspal Interlinks Promise</h3>
                        <span className="px-2 py-1 bg-parchment rounded border border-antique text-[10px] text-ink">(CIL View)</span>
                    </div>

                    <div className="space-y-5">
                        {/* Favorable Links */}
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 font-serif">
                                Favorable Links <span className="text-emerald-500 font-normal">(Fruition/Gain)</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(currentPromise?.positiveHouses || []).length > 0 ? (
                                    currentPromise?.positiveHouses.map((h: number) => (
                                        <span key={h} className="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white font-bold rounded-lg shadow-sm text-lg font-serif">
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-emerald-400 text-sm italic">None</span>
                                )}
                            </div>
                        </div>

                        {/* Adverse Links */}
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3 font-serif">
                                Adverse Links <span className="text-rose-400 font-normal">(Negation/Stress)</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(currentPromise?.negativeHouses || []).length > 0 ? (
                                    currentPromise?.negativeHouses.map((h: number) => (
                                        <span key={h} className="flex items-center justify-center w-10 h-10 bg-rose-500 text-white font-bold rounded-lg shadow-sm text-lg font-serif">
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-rose-400 text-sm italic">None</span>
                                )}
                            </div>
                        </div>

                        {/* Neutral/Supporting */}
                        <div className="p-4 bg-parchment/50 border border-antique rounded-xl">
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 font-serif">
                                Neutral/Supporting
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {neutralHouses.length > 0 ? (
                                    neutralHouses.map(h => (
                                        <span key={h} className="flex items-center justify-center w-10 h-10 bg-white text-ink font-medium rounded-lg border border-antique shadow-sm text-lg font-serif">
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted text-sm italic">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interpretation Footer */}
            {currentPromise && (
                <div className="bg-parchment/50 rounded-xl p-4 border border-antique text-center">
                    <p className="text-sm text-ink">
                        <span className="text-gold-dark font-medium font-serif">Interpretation Focus:</span>{' '}
                        The {selectedCusp}{selectedCusp === 1 ? 'st' : selectedCusp === 2 ? 'nd' : selectedCusp === 3 ? 'rd' : 'th'} Cusp Sub Lord ({currentPromise.chain.subLord.planet})
                        {currentPromise.positiveHouses.length > 0 && (
                            <> strongly links to <span className="text-emerald-600 font-medium">{currentPromise.positiveHouses.join(', ')}</span>, indicating <span className="text-emerald-700 font-medium">positive promise</span> for {HOUSE_TOPICS[selectedCusp]?.toLowerCase()} matters</>
                        )}
                        {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length > 0 && ', but also '}
                        {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length === 0 && ' links to '}
                        {currentPromise.negativeHouses.length > 0 && (
                            <><span className="text-rose-600 font-medium">{currentPromise.negativeHouses.join(', ')}</span> indicating <span className="text-rose-700 font-medium">challenges</span></>
                        )}
                        {currentPromise.positiveHouses.length === 0 && currentPromise.negativeHouses.length === 0 && (
                            <> has a <span className="text-muted font-medium">neutral influence</span> on {HOUSE_TOPICS[selectedCusp]?.toLowerCase()} matters</>
                        )}
                        .
                    </p>
                </div>
            )}
        </div>
    );
};

export default KpFocusedCuspView;
