"use client";

import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    Shield,
    Info,
    Hammer,
    Heart,
    Zap,
    Flame,
    Loader2,
    Target,
    Moon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { clientApi } from '@/lib/api';
import DebugConsole from '../debug/DebugConsole';

interface DoshaAnalysisProps {
    clientId: string;
    doshaType: string;
    ayanamsa?: string;
    className?: string;
}

export default function DoshaAnalysis({ clientId, doshaType, ayanamsa = 'lahiri', className }: DoshaAnalysisProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await clientApi.getDoshaAnalysis(clientId, doshaType, ayanamsa);
                setData(result.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch dosha analysis');
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchData();
        }
    }, [clientId, doshaType, ayanamsa]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-parchment/30 rounded-2xl border border-antique">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-4" />
                <p className="text-sm font-serif text-muted italic">Consulting Stellar records...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="space-y-4">
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className="text-red-900 font-bold font-serif mb-1">Analysis Unavailable</h3>
                    <p className="text-xs text-red-600">{error || 'Data could not be retrieved'}</p>
                </div>
                {error && <DebugConsole title={`Dosha Analysis Error: ${doshaType}`} data={{ error, doshaType, ayanamsa }} />}
            </div>
        );
    }

    // Dynamic rendering based on Dosha Type
    if (doshaType === 'angarak') {
        return <AngarakDoshaView data={data} className={className} />;
    }

    if (doshaType === 'sade_sati') {
        return <SadeSatiView data={data} className={className} />;
    }

    // Fallback for types not yet fully implemented with custom views
    return (
        <div className="space-y-6">
            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gold-primary/10 rounded-lg">
                        <Zap className="w-5 h-5 text-gold-dark" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-ink capitalize">{doshaType.replace('_', ' ')} Analysis</h2>
                </div>
                <p className="text-sm text-muted">Detailed report for {doshaType} is being prepared by the engine.</p>
                <DebugConsole title={`Dosha Analysis: ${doshaType}`} data={data} className="mt-6" />
            </div>
        </div>
    );
}

/**
 * ANGARAK DOSHA VIEW
 */
function AngarakDoshaView({ data, className }: { data: any; className?: string }) {
    if (!data.has_angarak_dosha) {
        return (
            <div className="space-y-4">
                <div className={cn("bg-green-50 border border-green-100 rounded-2xl p-6 text-center", className)}>
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <h3 className="text-green-900 font-serif font-bold text-lg">Dosha Absent</h3>
                    <p className="text-sm text-green-700 mt-1">Mars and Rahu are harmoniously placed. No Angarak Dosha signature found.</p>
                </div>
                <DebugConsole title="Angarak Dosha Raw Data (Absent)" data={data} />
            </div>
        );
    }

    const { conjunction_details, overall_severity, house_effects, cancellation_factors } = data;

    return (
        <div className={cn("space-y-6", className)}>
            {/* 1. Header & Severity */}
            <div className="bg-softwhite border border-antique rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600">
                            <Flame className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-ink">Angarak Dosha</h2>
                            <p className="text-sm text-red-700 font-medium">Mars-Rahu Conjunction in House {data.placement?.house}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Overall Severity</p>
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold border",
                                overall_severity?.includes('Very High') ? "bg-red-500 text-white border-red-600" :
                                    overall_severity?.includes('High') ? "bg-orange-500 text-white border-orange-600" :
                                        "bg-amber-500 text-white border-amber-600"
                            )}>
                                {overall_severity}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Impact Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase">
                        <Target className="w-4 h-4 text-red-600" /> Focus Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {house_effects?.areas?.map((area: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-parchment border border-antique rounded-lg text-[10px] font-medium text-ink">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase">
                        <AlertTriangle className="w-4 h-4 text-orange-500" /> Specific Effects
                    </h3>
                    <ul className="space-y-2">
                        {house_effects?.effects?.map((effect: string, i: number) => (
                            <li key={i} className="text-[11px] text-muted flex items-start gap-2 leading-tight">
                                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                {effect}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 3. Remedies Card */}
            <div className="bg-ink text-parchment rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-primary/10 rounded-full -mb-24 -mr-24 blur-3xl" />
                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-3">
                    <Hammer className="w-6 h-6 text-gold-primary" /> Remedies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-3">Vedic Mantras</h4>
                        <ul className="space-y-3">
                            {data.remedies?.mantras?.slice(0, 3).map((mantra: string, i: number) => (
                                <li key={i} className="text-[11px] italic text-parchment/80 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/10">
                                    "{mantra}"
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-3">Actions</h4>
                        <ul className="space-y-2">
                            {data.remedies?.lifestyle?.slice(0, 4).map((tip: string, i: number) => (
                                <li key={i} className="text-[11px] flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-primary shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Debug Console */}
            <DebugConsole title="Angarak Dosha Raw Data" data={data} />
        </div>
    );
}

/**
 * SADE SATI VIEW
 */
function SadeSatiView({ data, className }: { data: any; className?: string }) {
    if (!data.active) {
        return (
            <div className="space-y-4">
                <div className={cn("bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center", className)}>
                    <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-blue-900 font-serif font-bold text-lg">Sade Sati Inactive</h3>
                    <p className="text-sm text-blue-700 mt-1">Transiting Saturn is currently not in the 12th, 1st, or 2nd from your Natal Moon.</p>
                </div>
                <DebugConsole title="Sade Sati Raw Data (Inactive)" data={data} />
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="bg-indigo-950 text-white border border-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300">
                        <Moon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold">Sade Sati Analysis</h2>
                        <p className="text-sm text-indigo-300 font-medium">Saturn Transiting {data.phase}</p>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-xs font-serif italic text-indigo-100 leading-relaxed text-center">
                        "{data.interpretation?.description}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase">
                        <Info className="w-4 h-4 text-indigo-600" /> Details
                    </h3>
                    <p className="text-[11px] text-muted leading-relaxed">{data.description}</p>
                </div>
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Recommendations
                    </h3>
                    <ul className="space-y-2">
                        {data.recommendations?.slice(0, 4).map((rec: string, i: number) => (
                            <li key={i} className="text-[11px] text-muted flex items-start gap-2 leading-tight">
                                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                {rec.replace(/[🕉️🙏📿💖🪔👴⏸️]/g, '')}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <DebugConsole title="Sade Sati Raw Data" data={data} />
        </div>
    );
}
