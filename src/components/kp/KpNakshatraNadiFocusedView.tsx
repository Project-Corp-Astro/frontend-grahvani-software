"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpNakshatraNadiResponse } from '@/types/kp.types';
import { Sparkles, Compass, Star, Moon, Sun, CircleDot } from 'lucide-react';

// Planet symbols and colors
const PLANET_DATA: Record<string, { symbol: string; color: string; element: string }> = {
    'Sun': { symbol: '☉', color: 'from-orange-400 to-amber-500', element: 'Fire' },
    'Moon': { symbol: '☽', color: 'from-slate-300 to-slate-400', element: 'Water' },
    'Mars': { symbol: '♂', color: 'from-red-500 to-rose-600', element: 'Fire' },
    'Mercury': { symbol: '☿', color: 'from-emerald-400 to-green-500', element: 'Earth' },
    'Jupiter': { symbol: '♃', color: 'from-yellow-400 to-amber-500', element: 'Ether' },
    'Venus': { symbol: '♀', color: 'from-pink-400 to-rose-400', element: 'Water' },
    'Saturn': { symbol: '♄', color: 'from-indigo-500 to-violet-600', element: 'Air' },
    'Rahu': { symbol: '☊', color: 'from-slate-600 to-slate-700', element: 'Shadow' },
    'Ketu': { symbol: '☋', color: 'from-amber-600 to-orange-700', element: 'Shadow' },
};

// Zodiac data
const ZODIAC_DATA: Record<string, { symbol: string; element: string; quality: string }> = {
    'Aries': { symbol: '♈', element: 'Fire', quality: 'Cardinal' },
    'Taurus': { symbol: '♉', element: 'Earth', quality: 'Fixed' },
    'Gemini': { symbol: '♊', element: 'Air', quality: 'Mutable' },
    'Cancer': { symbol: '♋', element: 'Water', quality: 'Cardinal' },
    'Leo': { symbol: '♌', element: 'Fire', quality: 'Fixed' },
    'Virgo': { symbol: '♍', element: 'Earth', quality: 'Mutable' },
    'Libra': { symbol: '♎', element: 'Air', quality: 'Cardinal' },
    'Scorpio': { symbol: '♏', element: 'Water', quality: 'Fixed' },
    'Sagittarius': { symbol: '♐', element: 'Fire', quality: 'Mutable' },
    'Capricorn': { symbol: '♑', element: 'Earth', quality: 'Cardinal' },
    'Aquarius': { symbol: '♒', element: 'Air', quality: 'Fixed' },
    'Pisces': { symbol: '♓', element: 'Water', quality: 'Mutable' },
};

// Nakshatra data with their lords and padas
const NAKSHATRA_MEANINGS: Record<string, string> = {
    'Ashwini': 'Swift healing, new beginnings',
    'Bharani': 'Transformation, restraint',
    'Krittika': 'Purification, cutting ties',
    'Rohini': 'Growth, beauty, fertility',
    'Mrigashira': 'Searching, exploration',
    'Ardra': 'Storms, breakthroughs',
    'Punarvasu': 'Return, renewal',
    'Pushya': 'Nourishment, prosperity',
    'Ashlesha': 'Clinging, intensity',
    'Magha': 'Ancestors, authority',
    'Purva Phalguni': 'Pleasure, creativity',
    'Uttara Phalguni': 'Contracts, unions',
    'Hasta': 'Skill, craftsmanship',
    'Chitra': 'Brilliance, design',
    'Swati': 'Independence, movement',
    'Vishakha': 'Determination, goals',
    'Anuradha': 'Devotion, friendship',
    'Jyeshtha': 'Seniority, protection',
    'Mula': 'Roots, destruction',
    'Purva Ashadha': 'Invincibility, water',
    'Uttara Ashadha': 'Final victory',
    'Shravana': 'Learning, listening',
    'Dhanishta': 'Wealth, music',
    'Shatabhisha': 'Hundred healers',
    'Purva Bhadrapada': 'Scorching, purification',
    'Uttara Bhadrapada': 'Warrior, depths',
    'Revati': 'Wealth, safe passage',
};

// Common interface for planet/cusp data
interface NadiItem {
    name?: string;
    label?: string;
    sign: string;
    longitude: string;
    nakshatraName: string;
    nakshatraLord: string;
    subLord: string;
    isRetro?: boolean;
}

interface KpNakshatraNadiFocusedViewProps {
    data: KpNakshatraNadiResponse;
    className?: string;
}

export const KpNakshatraNadiFocusedView: React.FC<KpNakshatraNadiFocusedViewProps> = ({ data, className }) => {
    const [activeTab, setActiveTab] = useState<'planets' | 'cusps'>('planets');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const { nadiData } = data;

    // Get planets and cusps arrays
    const planets = useMemo(() => {
        if (!nadiData?.planets) return [];
        return Array.isArray(nadiData.planets) ? nadiData.planets : Object.values(nadiData.planets);
    }, [nadiData]);

    const cusps = useMemo(() => {
        if (!nadiData?.cusps) return [];
        return Array.isArray(nadiData.cusps) ? nadiData.cusps : Object.values(nadiData.cusps);
    }, [nadiData]);

    // Get selected item details
    const selectedDetails = useMemo((): NadiItem | null => {
        if (!selectedItem) return null;
        if (activeTab === 'planets') {
            return (planets.find((p: any) => p.name === selectedItem) as NadiItem) || null;
        }
        return (cusps.find((c: any) => c.label === selectedItem) as NadiItem) || null;
    }, [selectedItem, activeTab, planets, cusps]);

    if (!nadiData) {
        return <div className="p-8 text-center bg-white rounded-xl text-muted">Loading Nadi Data...</div>;
    }

    const TabButton = ({ id, label, icon: Icon }: { id: 'planets' | 'cusps', label: string, icon: any }) => (
        <button
            onClick={() => { setActiveTab(id); setSelectedItem(null); }}
            className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 font-serif",
                activeTab === id
                    ? "border-gold-primary text-gold-dark bg-gold-primary/5"
                    : "border-transparent text-muted hover:text-ink hover:bg-black/5"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className={cn("space-y-0 animate-in fade-in duration-500", className)}>
            {/* Header Tabs */}
            <div className="flex items-center border-b border-antique/20 bg-parchment/30 rounded-t-xl overflow-hidden">
                <TabButton id="planets" label="Planetary Nadi" icon={Sparkles} />
                <TabButton id="cusps" label="Cuspal Nadi (Bhavas)" icon={Compass} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Left - Selection Grid */}
                <div className="lg:col-span-2 bg-white border-r border-antique/20 p-4">
                    {activeTab === 'planets' ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {planets.map((planet: any) => {
                                const pData = PLANET_DATA[planet.name] || { symbol: '☉', color: 'from-gray-400 to-gray-500', element: 'Unknown' };
                                const isSelected = selectedItem === planet.name;
                                return (
                                    <button
                                        key={planet.name}
                                        onClick={() => setSelectedItem(planet.name)}
                                        className={cn(
                                            "relative p-4 rounded-xl transition-all duration-300 border-2 text-center group",
                                            isSelected
                                                ? "border-gold-primary bg-gold-primary/10 shadow-lg scale-105"
                                                : "border-antique/30 bg-parchment/30 hover:border-antique hover:shadow-md"
                                        )}
                                    >
                                        {planet.isRetro && (
                                            <span className="absolute top-1 right-1 text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">R</span>
                                        )}
                                        <div className={cn(
                                            "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl text-white shadow-lg bg-gradient-to-br",
                                            pData.color
                                        )}>
                                            {pData.symbol}
                                        </div>
                                        <span className="font-bold text-ink font-serif text-sm">{planet.name}</span>
                                        <span className="block text-[10px] text-muted mt-1">{planet.sign}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {cusps.map((cusp: any) => {
                                const signData = ZODIAC_DATA[cusp.sign] || { symbol: '♈', element: 'Fire', quality: 'Cardinal' };
                                const isSelected = selectedItem === cusp.label;
                                const cuspNum = cusp.label.replace('Cusp ', '').replace('C', '');
                                return (
                                    <button
                                        key={cusp.label}
                                        onClick={() => setSelectedItem(cusp.label)}
                                        className={cn(
                                            "relative p-3 rounded-xl transition-all duration-300 border-2 text-center",
                                            isSelected
                                                ? "border-gold-primary bg-gold-primary/10 shadow-lg scale-105"
                                                : "border-antique/30 bg-parchment/30 hover:border-antique hover:shadow-md"
                                        )}
                                    >
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-ink flex items-center justify-center text-white font-bold font-serif">
                                            {cuspNum}
                                        </div>
                                        <span className="font-medium text-ink font-serif text-xs">{signData.symbol} {cusp.sign}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-parchment/50 rounded-xl p-4 text-center border border-antique/30">
                            <Sun className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                            <span className="text-2xl font-bold text-ink">{planets.length}</span>
                            <span className="block text-[10px] text-muted uppercase tracking-wider">Grahas</span>
                        </div>
                        <div className="bg-parchment/50 rounded-xl p-4 text-center border border-antique/30">
                            <CircleDot className="w-5 h-5 mx-auto text-indigo-500 mb-2" />
                            <span className="text-2xl font-bold text-ink">{cusps.length}</span>
                            <span className="block text-[10px] text-muted uppercase tracking-wider">Bhavas</span>
                        </div>
                        <div className="bg-parchment/50 rounded-xl p-4 text-center border border-antique/30">
                            <Star className="w-5 h-5 mx-auto text-gold-dark mb-2" />
                            <span className="text-2xl font-bold text-ink">27</span>
                            <span className="block text-[10px] text-muted uppercase tracking-wider">Nakshatras</span>
                        </div>
                    </div>
                </div>

                {/* Right - Detail Panel */}
                <div className="bg-parchment/20 p-6 min-h-[400px]">
                    {selectedDetails ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="text-center">
                                {activeTab === 'planets' ? (
                                    <>
                                        <div className={cn(
                                            "w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center text-4xl text-white shadow-xl bg-gradient-to-br",
                                            PLANET_DATA[selectedDetails.name || '']?.color || 'from-gray-400 to-gray-500'
                                        )}>
                                            {PLANET_DATA[selectedDetails.name || '']?.symbol || '☉'}
                                        </div>
                                        <h2 className="text-2xl font-bold text-ink font-serif">{selectedDetails.name}</h2>
                                        {selectedDetails.isRetro && (
                                            <span className="inline-block mt-1 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Retrograde</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-ink flex items-center justify-center text-3xl text-white shadow-xl font-serif font-bold">
                                            {(selectedDetails.label || '').replace('Cusp ', '').replace('C', '')}
                                        </div>
                                        <h2 className="text-2xl font-bold text-ink font-serif">{selectedDetails.label}</h2>
                                    </>
                                )}
                            </div>

                            {/* Position Card */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className="text-[10px] text-muted uppercase tracking-wider mb-3 font-serif">Position</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-3xl mr-2">{ZODIAC_DATA[selectedDetails.sign]?.symbol || '♈'}</span>
                                        <span className="text-xl font-serif text-ink">{selectedDetails.sign}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono text-lg text-ink">{selectedDetails.longitude}</span>
                                        <span className="block text-[10px] text-muted">{ZODIAC_DATA[selectedDetails.sign]?.element} • {ZODIAC_DATA[selectedDetails.sign]?.quality}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nakshatra Details */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className="text-[10px] text-muted uppercase tracking-wider mb-3 font-serif">Nakshatra (Star)</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-ink font-serif text-lg">{selectedDetails.nakshatraName}</span>
                                        <span className="block text-sm text-muted">Lord: <span className="text-ink font-medium">{selectedDetails.nakshatraLord}</span></span>
                                    </div>
                                </div>
                                {NAKSHATRA_MEANINGS[selectedDetails.nakshatraName] && (
                                    <p className="mt-3 text-xs text-muted bg-parchment/50 p-2 rounded-lg italic">
                                        "{NAKSHATRA_MEANINGS[selectedDetails.nakshatraName]}"
                                    </p>
                                )}
                            </div>

                            {/* Sub Lord - Highlighted */}
                            <div className="bg-gradient-to-r from-gold-primary to-gold-dark rounded-xl p-4 text-white shadow-lg">
                                <h4 className="text-[10px] text-white/70 uppercase tracking-wider mb-2 font-serif">Sub Lord (Key Signifier)</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                                        {PLANET_DATA[selectedDetails.subLord]?.symbol || '☉'}
                                    </div>
                                    <div>
                                        <span className="font-bold text-white font-serif text-2xl">{selectedDetails.subLord}</span>
                                        <span className="block text-xs text-white/70">Determines fine timing & results</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lord Chain Summary */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className="text-[10px] text-muted uppercase tracking-wider mb-3 font-serif">Stellar Chain</h4>
                                <div className="flex items-center justify-between text-center">
                                    <div className="flex-1">
                                        <span className="text-lg">{ZODIAC_DATA[selectedDetails.sign]?.symbol}</span>
                                        <span className="block text-[10px] text-muted">Sign</span>
                                    </div>
                                    <span className="text-antique">→</span>
                                    <div className="flex-1">
                                        <span className="text-lg">{PLANET_DATA[selectedDetails.nakshatraLord]?.symbol || '☉'}</span>
                                        <span className="block text-[10px] text-muted">Star Lord</span>
                                    </div>
                                    <span className="text-antique">→</span>
                                    <div className="flex-1 bg-gold-primary/10 rounded-lg py-1">
                                        <span className="text-lg">{PLANET_DATA[selectedDetails.subLord]?.symbol || '☉'}</span>
                                        <span className="block text-[10px] text-gold-dark font-bold">Sub Lord</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted">
                            <Moon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-serif text-lg">Select a {activeTab === 'planets' ? 'planet' : 'cusp'}</p>
                            <p className="text-sm">to view detailed Nadi information</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-parchment/30 p-3 text-center border-t border-antique/10 text-xs text-muted rounded-b-xl">
                <Star className="w-3 h-3 inline-block mr-1 text-gold-dark" />
                <strong className="font-serif">Nakshatra Nadi System</strong>: Star lords reveal the source, Sub lords determine the result.
            </div>
        </div>
    );
};

export default KpNakshatraNadiFocusedView;
