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
    Wind,
    Droplets,
    Flame,
    ArrowRight,
    Loader2,
    Target,
    Moon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { clientApi } from '@/lib/api';
import { AngarakDoshaAnalysis, SadeSatiAnalysis } from '@/types/astrology';

interface DoshaAnalysisProps {
    clientId: string;
    doshaType: 'angarak' | 'sade_sati' | 'manglik' | 'kala_sarpa' | 'pitra';
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
                // Map frontend type to backend endpoint if necessary
                const targetType = doshaType === 'sade_sati' ? 'sade_sati' : doshaType;
                const result = await clientApi.getDoshaAnalysis(clientId, targetType, ayanamsa);
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
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="text-red-900 font-bold font-serif mb-1">Analysis Unavailable</h3>
                <p className="text-xs text-red-600">{error || 'Data could not be retrieved'}</p>
            </div>
        );
    }

    // Dynamic rendering based on Dosha Type
    if (doshaType === 'angarak') {
        return <AngarakDoshaView data={data as AngarakDoshaAnalysis} className={className} />;
    }

    if (doshaType === 'sade_sati') {
        return <SadeSatiView data={data as SadeSatiAnalysis} className={className} />;
    }

    // Fallback for types not yet fully implemented with custom views
    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gold-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="text-xl font-serif font-bold text-ink capitalize">{doshaType.replace('_', ' ')} Analysis</h2>
            </div>
            <p className="text-sm text-muted">Detailed report for {doshaType} is being prepared by the engine.</p>
        </div>
    );
}

/**
 * ANGARAK DOSHA VIEW
 */
function AngarakDoshaView({ data, className }: { data: AngarakDoshaAnalysis; className?: string }) {
    if (!data.has_angarak_dosha) {
        return (
            <div className={cn("bg-green-50 border border-green-100 rounded-2xl p-6 text-center", className)}>
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="text-green-900 font-serif font-bold text-lg">Dosha Absent</h3>
                <p className="text-sm text-green-700 mt-1">Mars and Rahu are harmoniously placed. No Angarak Dosha signature found.</p>
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
                                overall_severity.includes('Very High') ? "bg-red-500 text-white border-red-600" :
                                    overall_severity.includes('High') ? "bg-orange-500 text-white border-orange-600" :
                                        "bg-amber-500 text-white border-amber-600"
                            )}>
                                {overall_severity}
                            </span>
                        </div>
                        <div className="w-24 h-2 bg-parchment rounded-full overflow-hidden border border-antique">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    overall_severity.includes('Very High') ? "w-[90%] bg-red-600" :
                                        overall_severity.includes('High') ? "w-[70%] bg-orange-500" :
                                            "w-[40%] bg-amber-500"
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Impact Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-red-600" /> Focus Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {house_effects.areas.map((area, i) => (
                            <span key={i} className="px-3 py-1 bg-parchment border border-antique rounded-lg text-xs font-medium text-ink">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" /> Specific Effects
                    </h3>
                    <ul className="space-y-2">
                        {house_effects.effects.map((effect, i) => (
                            <li key={i} className="text-xs text-muted flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                {effect}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 3. Cancellations (Nivaran Factors) */}
            {cancellation_factors.length > 0 && (
                <div className="bg-parchment border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" /> Mitigation Factors (Cancellations)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {cancellation_factors.map((factor, i) => (
                            <div key={i} className="p-3 bg-white/60 border border-blue-100 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-1">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        factor.strength === 'Complete' ? "bg-green-500" :
                                            factor.strength === 'Strong' ? "bg-blue-500" :
                                                "bg-amber-500"
                                    )} />
                                </div>
                                <p className="text-[10px] font-bold text-blue-800 uppercase mb-1">{factor.factor}</p>
                                <p className="text-[11px] text-ink font-semibold leading-tight mb-1">{factor.impact}</p>
                                <p className="text-[9px] text-muted leading-tight">{factor.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Remedies Card */}
            <div className="bg-ink text-parchment rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-primary/10 rounded-full -mb-24 -mr-24 blur-3xl" />

                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-3">
                    <Hammer className="w-6 h-6 text-gold-primary" /> Personalized Remedies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-4">Vedic Mantras</h4>
                        <div className="space-y-4">
                            {data.remedies.mantras.slice(0, 2).map((mantra, i) => (
                                <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-xs italic leading-relaxed text-parchment/80">"{mantra}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-4">Life Guidance</h4>
                        <ul className="space-y-3">
                            {data.remedies.lifestyle.slice(0, 4).map((tip, i) => (
                                <li key={i} className="text-[11px] flex items-start gap-2 text-white/90">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-primary mt-0.5 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-4">Spiritual Acts</h4>
                        <ul className="space-y-3">
                            {data.remedies.spiritual_practices.slice(0, 4).map((act, i) => (
                                <li key={i} className="text-[11px] flex items-start gap-2 text-white/90">
                                    <Heart className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                    {act}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * SADE SATI VIEW
 */
function SadeSatiView({ data, className }: { data: SadeSatiAnalysis; className?: string }) {
    if (!data.active) {
        return (
            <div className={cn("bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center", className)}>
                <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="text-blue-900 font-serif font-bold text-lg">Sade Sati Inactive</h3>
                <p className="text-sm text-blue-700 mt-1">Transiting Saturn is currently not in the 12th, 1st, or 2nd from your Natal Moon.</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="bg-indigo-950 text-white border border-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300">
                            <Moon className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold">Sade Sati Analysis</h2>
                            <p className="text-sm text-indigo-300 font-medium">Saturn Transiting {data.phase}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-1">Impact Intensity</p>
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold border capitalize",
                                data.intensity > 70 ? "bg-red-600 border-red-500" :
                                    data.intensity > 40 ? "bg-orange-600 border-orange-500" :
                                        "bg-blue-600 border-blue-500"
                            )}>
                                {data.interpretation.level}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-sm font-serif italic text-indigo-100 text-center leading-relaxed">
                        "{data.interpretation.description}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-600" /> Phase Description
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">{data.description}</p>
                    <div className="mt-4 flex gap-2">
                        {data.affected_signs.map((sign, i) => (
                            <span key={i} className="px-3 py-1 bg-parchment border border-antique rounded-lg text-xs font-medium text-ink">
                                {sign}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Mitigating Actions
                    </h3>
                    <ul className="space-y-2">
                        {data.recommendations.slice(0, 4).map((rec, i) => (
                            <li key={i} className="text-xs text-muted flex items-start gap-2">
                                <div className="mt-1 shrink-0">{rec.includes('🕉️') ? '🕉️' : rec.includes('🙏') ? '🙏' : '✨'}</div>
                                {rec.replace(/[🕉️🙏📿💖🪔👴⏸️]/g, '')}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ImpactMeter({ label, value, max = 100, color = "gold" }: { label: string; value: number; max?: number; color?: string }) {
    const percentage = (value / max) * 100;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-muted">{label}</span>
                <span className="text-xs font-bold text-ink">{value}/{max}</span>
            </div>
            <div className="h-1.5 w-full bg-parchment rounded-full border border-antique overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-1000",
                        color === "red" ? "bg-red-600" :
                            color === "blue" ? "bg-blue-600" :
                                "bg-gold-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
