"use client";

import React, { useEffect, useState } from 'react';
import {
    X,
    Loader2,
    AlertTriangle,
    Star,
    Moon,
    Sun,
    Activity,
    Hexagon,
    Shield,
    Zap,
    Heart,
    Anchor,
    Feather,
    Disc
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { clientApi } from '@/lib/api';
import DebugConsole from '@/components/debug/DebugConsole';

interface AvakhadaChakraViewProps {
    clientId: string;
    onClose: () => void;
}

export default function AvakhadaChakraView({ clientId, onClose }: AvakhadaChakraViewProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await clientApi.getAvakhadaChakra(clientId);
                console.log("Avakhada API Result:", result);

                // Extract inner data: Wrapper (chartData) -> Response -> avakhada_chakra
                const rawData = result.chartData || result.data || result;
                const cleanData = rawData.avakhada_chakra || rawData;

                setData(cleanData);
            } catch (err: any) {
                console.error("Avakhada Fetch Error:", err);
                setError(err.message || "Failed to load Avakhada Chakra");
            } finally {
                setLoading(false);
            }
        };

        if (clientId) fetchData();
    }, [clientId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-4" />
                <p className="text-sm font-serif text-muted italic">Consulting the Stars...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 text-center space-y-4">
                <div className="bg-red-50 p-4 rounded-xl inline-block mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-serif font-bold text-red-900 mb-2">Unavailable</h3>
                <p className="text-sm text-red-600 mb-6">{error || "Data not found"}</p>

                {/* Debug Console for Error State */}
                <DebugConsole title="Debug: Raw Response (Error State)" data={{ error, rawData: data }} className="text-left" />

                <button onClick={onClose} className="px-4 py-2 bg-white border border-antique rounded-lg text-sm hover:bg-red-50 transition-colors mt-4">
                    Close
                </button>
            </div>
        );
    }

    // Map data fields to icons and labels
    const items = [
        { key: 'varna', label: 'Varna', icon: Shield, desc: 'Class / Temperament' },
        { key: 'vashya', label: 'Vashya', icon: Anchor, desc: 'Control / Nature' },
        { key: 'tara', label: 'Tara', icon: Star, desc: 'Birth Star Group' },
        { key: 'yoni', label: 'Yoni', icon: Hexagon, desc: 'Instinct' },
        { key: 'gana', label: 'Gana', icon: UsersIcon, desc: 'Nature' },
        { key: 'nadi', label: 'Nadi', icon: Activity, desc: 'Health' },
        { key: 'symbol_tatva', label: 'Tatva', icon: Feather, desc: 'Element' },
        { key: 'rashi_lord', label: 'Rashi Lord', icon: Sun, desc: 'Sign Ruler' },
        { key: 'rashi', label: 'Rashi', icon: Moon, desc: 'Moon Sign' },
        { key: 'nakshatra', label: 'Nakshatra', icon: Star, desc: 'Birth Star' },
        { key: 'pada', label: 'Pada', icon: Disc, desc: 'Quarter' },
        { key: 'namakshar', label: 'Namakshar', icon: TypeIcon, desc: 'Sound' },
        { key: 'paya_rashi', label: 'Paya (Rashi)', icon: Disc, desc: 'Base' },
        { key: 'paya_nakshatra', label: 'Paya (Nakshatra)', icon: Disc, desc: 'Metal' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#FFFCF6]">
            {/* COMPACT HEADER */}
            <div className="bg-gradient-to-r from-[#2C1810] to-[#4A2C20] text-parchment px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <Star className="w-5 h-5 text-gold-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD27D] to-[#D08C60]">
                            Avakhada Chakra
                        </h2>
                        <p className="text-xs text-parchment/60 font-sans tracking-wide uppercase">
                            Foundational Classification
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-parchment/70 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                {/* Main Grid - Responsive & Compact */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                    {items.map((item) => {
                        const value = data[item.key] || data[item.key.toLowerCase()];
                        if (!value) return null;

                        return (
                            <div key={item.key} className="bg-white border border-antique/40 p-2.5 rounded-xl hover:border-gold-primary/40 hover:shadow-md transition-all group flex flex-col justify-between min-h-[85px]">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-refined/80">{item.label}</span>
                                    <item.icon className="w-3 h-3 text-[#D08C60]/60 group-hover:text-[#D08C60] transition-colors" />
                                </div>
                                <div>
                                    <div className="font-serif text-sm font-semibold text-primary leading-tight line-clamp-1" title={value}>
                                        {value}
                                    </div>
                                    <div className="text-[8px] text-muted-refined italic mt-0.5 truncate max-w-full opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Extra items like Hamsa Swara if present */}
                    {data.hamsa_swara && (
                        <div className="bg-white border border-antique/40 p-2.5 rounded-xl hover:border-gold-primary/40 hover:shadow-md transition-all group flex flex-col justify-between min-h-[85px]">
                            <div className="flex justify-between items-start mb-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-refined/80">Hamsa Swara</span>
                                <Feather className="w-3 h-3 text-[#D08C60]/60" />
                            </div>
                            <div className="font-serif text-sm font-semibold text-primary leading-tight">
                                {data.hamsa_swara}
                            </div>
                        </div>
                    )}
                </div>

                <DebugConsole title="Raw Data" data={data} className="mt-8 opacity-50 hover:opacity-100 transition-opacity" />
            </div>

            {/* Footer Status Bar if needed, otherwise clean break */}
            <div className="bg-softwhite border-t border-antique/20 px-6 py-3 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-muted-refined font-sans">
                    * Calculation based on Lahiri Ayanamsa
                </span>
                <button onClick={onClose} className="text-xs font-bold text-secondary hover:text-primary uppercase tracking-wider">
                    Close
                </button>
            </div>
        </div>
    );
}

// Custom Icons
function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function TypeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    )
}
