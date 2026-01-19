"use client";

import React, { useState, useEffect } from 'react';
import {
    Compass,
    Loader2,
    RefreshCw,
    Layers,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Info,
    LayoutDashboard,
    Hexagon
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import SudarshanChakraPro, { PlanetPosition } from '@/components/astrology/SudarshanChakraPro';

const signNameToId: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

export default function ChakrasPage() {
    const { clientDetails } = useVedicClient();
    const { settings } = useAstrologerSettings();
    const [loading, setLoading] = useState(true);
    const [chakraData, setChakraData] = useState<any>(null);
    const [activeLayer, setActiveLayer] = useState<'triple' | 'lagna' | 'moon' | 'sun'>('triple');

    const fetchChakraData = async () => {
        if (!clientDetails?.id) return;
        setLoading(true);
        try {
            const result = await clientApi.generateSudarshanChakra(clientDetails.id, settings.ayanamsa);
            // Handle nested data if present
            setChakraData(result.data || result);
        } catch (error) {
            console.error("Failed to fetch Sudarshan Chakra:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientDetails?.id) {
            fetchChakraData();
        }
    }, [clientDetails?.id, settings.ayanamsa]);

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Compass className="w-16 h-16 text-copper-300 mb-4 animate-spin-slow" />
                <h2 className="text-2xl font-serif text-copper-900 mb-2">No Client Selected</h2>
                <p className="text-copper-600 max-w-md">Please select a client to view their Sudarshan Chakra and other esoteric diagrams.</p>
            </div>
        );
    }

    // ROBUST DATA MAPPING
    const getLayerSigns = (chartData: any) => {
        if (!chartData) return Array(12).fill(0);

        // Handle houses as object or array
        const houses = chartData.houses || chartData.house_positions;
        if (!houses) return Array(12).fill(0);

        return Array.from({ length: 12 }, (_, i) => {
            const h = Array.isArray(houses) ? houses[i] : houses[i + 1];
            if (!h) return 0;
            const signName = h.sign || h.sign_name;
            if (!signName) return 0;

            // Normalize sign name
            const normalized = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
            return signNameToId[normalized] || 0;
        });
    };

    const mapPlanets = (chartData: any): PlanetPosition[] => {
        if (!chartData) return [];

        const positions = chartData.planetary_positions || chartData.planets;
        if (!positions) return [];

        if (Array.isArray(positions)) {
            return positions.map((p: any) => {
                const name = p.name || p.planet_name || "";
                const sign = p.sign || p.sign_name || "";
                const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
                return {
                    name: name.substring(0, 2),
                    signId: signNameToId[normalized] || 0,
                    degree: p.degrees || p.degree || '0°'
                };
            }).filter(p => p.signId > 0);
        }

        return Object.entries(positions).map(([name, pos]: [string, any]) => {
            const sign = pos.sign || pos.sign_name || "";
            const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            return {
                name: name.substring(0, 2),
                signId: signNameToId[normalized] || 0,
                degree: pos.degrees || pos.degree || '0°'
            };
        }).filter(p => p.signId > 0);
    };

    const lagnaPlanets = mapPlanets(chakraData?.lagna_chart || chakraData?.lagna);
    const moonPlanets = mapPlanets(chakraData?.moon_chart || chakraData?.moon);
    const sunPlanets = mapPlanets(chakraData?.sun_chart || chakraData?.sun);

    const layerSigns = {
        lagna: getLayerSigns(chakraData?.lagna_chart || chakraData?.lagna),
        moon: getLayerSigns(chakraData?.moon_chart || chakraData?.moon),
        sun: getLayerSigns(chakraData?.sun_chart || chakraData?.sun)
    };

    return (
        <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-copper-200 pb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-copper-950 font-black tracking-tighter flex items-center gap-4">
                        <Hexagon className="w-10 h-10 text-copper-600 fill-copper-50" />
                        Sudarshan Chakra
                    </h1>
                    <p className="text-copper-600 font-medium tracking-tight">Triple Confluence Analysis for {clientDetails.name}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchChakraData}
                        className="p-3 bg-white text-copper-600 hover:bg-copper-50 rounded-2xl border border-copper-200 shadow-sm transition-all active:scale-95"
                        title="Recalculate Diagram"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                    <div className="flex bg-white/80 backdrop-blur p-1.5 rounded-2xl border border-copper-200 shadow-sm">
                        {(['triple', 'lagna', 'moon', 'sun'] as const).map((layer) => (
                            <button
                                key={layer}
                                onClick={() => setActiveLayer(layer)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all capitalize tracking-wide",
                                    activeLayer === layer
                                        ? "bg-copper-950 text-white shadow-lg shadow-copper-200"
                                        : "text-copper-600 hover:bg-copper-50"
                                )}
                            >
                                {layer === 'triple' ? 'Confluence' : layer}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Visualization Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative aspect-square w-full bg-[#fdfcfb] rounded-[3rem] border border-copper-200 shadow-[0_32px_64px_-16px_rgba(139,92,71,0.15)] overflow-hidden flex items-center justify-center p-12 group">
                        {/* Parchment Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }} />

                        <div className="absolute inset-0 bg-gradient-to-tr from-copper-50/20 via-transparent to-amber-50/20 pointer-events-none" />

                        {loading ? (
                            <div className="flex flex-col items-center gap-6 relative z-10">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-copper-600 animate-spin" />
                                    <Compass className="w-8 h-8 text-copper-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-copper-900 font-serif text-xl font-bold animate-pulse">Drafting Celestial Map...</p>
                                    <p className="text-copper-400 text-sm italic">Synchronizing Surya, Chandra, & Birth chart layers</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative z-10 animate-in zoom-in-95 duration-1000">
                                <SudarshanChakraPro
                                    lagnaPlanets={lagnaPlanets}
                                    moonPlanets={moonPlanets}
                                    sunPlanets={sunPlanets}
                                    activeLayer={activeLayer}
                                    layerSigns={layerSigns}
                                    className="scale-110 lg:scale-100"
                                />
                            </div>
                        )}

                        {/* Visual Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            {[
                                { icon: Maximize2, label: 'Fullscreen' },
                                { icon: ZoomIn, label: 'Zoom In' },
                                { icon: ZoomOut, label: 'Zoom Out' }
                            ].map((ctrl, idx) => (
                                <button key={idx} className="p-4 bg-white/90 backdrop-blur text-copper-600 rounded-2xl border border-copper-100 shadow-xl hover:bg-copper-950 hover:text-white transition-all transform hover:scale-110">
                                    <ctrl.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Side Panel Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Dynamic Legend Card - CRITICAL UPDATE */}
                    <div className="bg-white rounded-3xl border border-copper-200 p-8 shadow-sm space-y-6">
                        <div className="border-b border-copper-100 pb-4">
                            <h3 className="text-[11px] font-black text-copper-400 uppercase tracking-[0.2em]">Chart Legend</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Surya Chart', circle: 'Outer Circle', color: 'border-slate-800', desc: 'Soul\'s physical destiny & vitality' },
                                { label: 'Chandra Chart', circle: 'Middle Circle', color: 'border-slate-500', desc: 'Mental landscape & emotional flow' },
                                { label: 'Birth Chart', circle: 'Inner Circle', color: 'border-slate-300', desc: 'The core karmic blueprint (Lagna)' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className={cn("w-1.5 h-auto rounded-full transition-all group-hover:w-2", item.color, "bg-current border-none opacity-20")}
                                        style={{ backgroundColor: i === 0 ? '#334155' : i === 1 ? '#64748b' : '#94a3b8' }} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-copper-950 underline decoration-copper-200 decoration-4 underline-offset-4">{item.label}</span>
                                            <span className="text-[10px] font-bold text-copper-400 uppercase tracking-wider">— {item.circle}</span>
                                        </div>
                                        <p className="text-xs text-copper-500 mt-2 font-medium leading-relaxed italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interpretation Insights */}
                    <div className="bg-gradient-to-br from-copper-950 to-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <Hexagon className="absolute -bottom-12 -right-12 w-48 h-48 text-white/5 rotate-12" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <Info className="w-6 h-6 text-amber-400" />
                                <h3 className="font-serif text-xl font-bold tracking-tight">Technical Summary</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                    <div className="text-[10px] text-copper-300 uppercase font-bold tracking-widest mb-1">System</div>
                                    <div className="text-sm font-black">{settings.ayanamsa.toUpperCase()}</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
                                    <div className="text-[10px] text-copper-300 uppercase font-bold tracking-widest mb-1">Calculation</div>
                                    <div className="text-sm font-black">Triple Stream</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">Professional Note</h4>
                                <p className="text-xs text-copper-100/80 leading-relaxed font-medium">
                                    Sudarshan Chakra acts as an "X-Ray" of destiny. When a planet occupies the same sign in all three charts, its results are considered mathematically certain.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-amber-50/50 rounded-3xl border border-amber-100 border-dashed">
                        <div className="flex items-start gap-4">
                            <LayoutDashboard className="w-5 h-5 text-amber-600 mt-1" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900 mb-1">Comparative View</h4>
                                <p className="text-xs text-amber-700/70 leading-relaxed">
                                    Use the layer toggle to isolate specific charts or return to Confluence for a holistic perspective.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
