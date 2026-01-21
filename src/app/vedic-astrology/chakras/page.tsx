"use client";

import React, { useState, useEffect } from 'react';
import {
    Compass,
    Loader2,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Info,
    LayoutDashboard,
    Hexagon
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useSudarshanChakra } from '@/hooks/queries/useCalculations';
import { cn } from '@/lib/utils';
import SudarshanChakraFinal from '@/components/astrology/SudarshanChakraFinal';

export default function ChakrasPage() {
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    // Query for Sudarshan Chakra
    const { data: chakraResponse, isLoading: chakraLoading, refetch } = useSudarshanChakra(
        clientDetails?.id || '',
        settings.ayanamsa.toLowerCase()
    );

    const loading = chakraLoading;
    const chakraData = chakraResponse?.data || chakraResponse;
    const fetchChakraData = refetch; // Map refetch to old handler name for compatibility if needed, or update usage

    /* Removed manual fetchChakraData and useEffect */

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Compass className="w-16 h-16 text-copper-300 mb-4 animate-spin-slow" />
                <h2 className="text-2xl font-serif text-copper-900 mb-2">No Client Selected</h2>
                <p className="text-copper-600 max-w-md">Please select a client to view their Sudarshan Chakra and other esoteric diagrams.</p>
            </div>
        );
    }

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
                        onClick={() => fetchChakraData()}
                        className="p-3 bg-white text-copper-600 hover:bg-copper-50 rounded-2xl border border-copper-200 shadow-sm transition-all active:scale-95"
                        title="Recalculate Diagram"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Visualization Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative aspect-square w-full bg-[#fdfcfb] rounded-[3rem] border border-copper-200 shadow-[0_32px_64px_-16px_rgba(139,92,71,0.15)] overflow-hidden flex items-center justify-center p-6 group">
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
                            <div className="w-full h-full relative z-10 animate-in zoom-in-95 duration-1000 flex items-center justify-center">
                                <SudarshanChakraFinal
                                    data={chakraData}
                                    className="max-w-[100%] max-h-[100%] scale-90 lg:scale-100"
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
                    {/* Dynamic Legend Card */}
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
                                <h4 className="text-sm font-bold text-amber-900 mb-1">Interpretation Guide</h4>
                                <p className="text-xs text-amber-700/70 leading-relaxed">
                                    This confluence chart allows you to simultaneously observe how the luminaries (Sun/Moon) and the Lagna interact across all 12 houses.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
