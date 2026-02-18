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
    const { clientDetails, processedCharts, isLoadingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const activeSystem = settings.ayanamsa.toLowerCase();

    const chartContainerRef = React.useRef<HTMLDivElement>(null);
    const [zoomScale, setZoomScale] = useState(1);

    const handleZoomIn = () => setZoomScale(s => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setZoomScale(s => Math.max(s - 0.2, 0.5));
    const handleFullscreen = () => {
        if (chartContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                chartContainerRef.current.requestFullscreen();
            }
        }
    };

    // Use pre-fetched data from context for instant render
    const { chakraData, loading } = React.useMemo(() => {
        const key = `sudarshana_${activeSystem}`;
        const raw = processedCharts[key]?.chartData;

        return {
            chakraData: raw?.data || raw,
            loading: !raw && isLoadingCharts
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    const fetchChakraData = refreshCharts; // Map refetch to the global refresh helper

    /* Removed manual fetchChakraData and useEffect */

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Compass className="w-16 h-16 text-copper-300 mb-4 animate-spin-slow" />
                <h2 className="text-lg font-serif text-copper-900 mb-2">No Client Selected</h2>
                <p className="text-xs text-copper-600 max-w-md">Please select a client to view their Sudarshan Chakra and other esoteric diagrams.</p>
            </div>
        );
    }

    return (
        <div className="-mt-2 lg:-mt-4 min-h-screen space-y-2 animate-in fade-in duration-700">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-copper-200 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-serif font-bold text-primary">
                        Sudarshan Chakra
                    </h1>
                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Visualization Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div
                        ref={chartContainerRef}
                        className="relative w-full bg-[#fdfcfb] rounded-[3rem] border border-copper-200 shadow-[0_32px_64px_-16px_rgba(139,92,71,0.15)] overflow-hidden flex items-center justify-center p-2 group overflow-y-auto"
                    >
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
                                    <p className="text-copper-900 font-serif text-sm font-bold animate-pulse">Drafting Celestial Map...</p>
                                    <p className="text-copper-400 text-[10px] italic">Synchronizing Surya, Chandra, & Birth chart layers</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative z-10 animate-in zoom-in-95 duration-1000 flex items-center justify-center">
                                <div style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.3s ease-out' }} className="w-full h-full flex items-center justify-center">
                                    <SudarshanChakraFinal
                                        data={chakraData}
                                        className="max-w-[100%] max-h-[100%] scale-100"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Visual Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 z-20">
                            {[
                                { icon: Maximize2, label: 'Fullscreen', onClick: handleFullscreen },
                                { icon: ZoomIn, label: 'Zoom In', onClick: handleZoomIn },
                                { icon: ZoomOut, label: 'Zoom Out', onClick: handleZoomOut }
                            ].map((ctrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={ctrl.onClick}
                                    title={ctrl.label}
                                    className="p-4 bg-white/90 backdrop-blur text-copper-600 rounded-2xl border border-copper-100 shadow-xl hover:bg-copper-950 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <ctrl.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Side Panel Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Dynamic Legend Card */}
                    <div className=" rounded-3xl border border-copper-200 p-8 shadow-sm space-y-6">
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




                </div>
            </div>
        </div>
    );
}
