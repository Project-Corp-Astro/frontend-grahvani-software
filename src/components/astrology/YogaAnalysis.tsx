"use client";

import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    CheckCircle2,
    Info,
    Zap,
    Trophy,
    Stars,
    ArrowRight,
    Loader2,
    Target,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { clientApi } from '@/lib/api';
import { YogaAnalysis } from '@/types/astrology';

interface YogaAnalysisProps {
    clientId: string;
    yogaType: string;
    ayanamsa?: string;
    className?: string;
}

export default function YogaAnalysisView({ clientId, yogaType, ayanamsa = 'lahiri', className }: YogaAnalysisProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<YogaAnalysis | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await clientApi.getYogaAnalysis(clientId, yogaType, ayanamsa);
                setData(result.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch yoga analysis');
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchData();
        }
    }, [clientId, yogaType, ayanamsa]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-parchment/30 rounded-2xl border border-antique">
                <Loader2 className="w-6 h-6 text-gold-primary animate-spin mb-3" />
                <p className="text-xs font-serif text-muted italic">Analyzing celestial alignments...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                <Info className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <h3 className="text-amber-900 font-bold font-serif text-sm">Yoga Detail Pending</h3>
                <p className="text-[10px] text-amber-600">{error || 'Detailed analysis not currently available for this client'}</p>
            </div>
        );
    }

    if (!data.yoga_present) {
        return (
            <div className={cn("bg-parchment/50 border border-antique rounded-2xl p-6 text-center opacity-60", className)}>
                <Info className="w-8 h-8 text-muted mx-auto mb-2" />
                <h3 className="text-muted font-serif font-bold text-lg capitalize">{yogaType.replace('_', ' ')} Absent</h3>
                <p className="text-xs text-muted mt-1">Planetary conditions for this specific yoga are not fully met in the natal chart.</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* 1. Header & Grandeur */}
            <div className="bg-white border border-antique rounded-3xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-ink">{data.yoga_type}</h2>
                            <p className="text-sm text-gold-dark font-medium">{data.house_relationship}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Manifestation Strength</p>
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold border",
                                data.yoga_strength.includes('Exceptional') ? "bg-amber-600 text-white border-amber-700" :
                                    data.yoga_strength.includes('Strong') ? "bg-gold-primary text-ink border-gold-dark" :
                                        "bg-parchment text-muted border-antique"
                            )}>
                                {data.yoga_strength}
                            </span>
                        </div>
                        <div className="w-24 h-2 bg-parchment rounded-full overflow-hidden border border-antique">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    data.yoga_strength.includes('Exceptional') ? "w-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" :
                                        data.yoga_strength.includes('Strong') ? "w-[75%] bg-gold-primary" :
                                            "w-[40%] bg-gold-primary/50"
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Score Breakdown (Astro-Metrix) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Target className="w-4 h-4 text-gold-primary" /> Potential Impacts
                    </h3>
                    <div className="space-y-3">
                        {data.comprehensive_effects.specific_effects.map((effect, i) => (
                            <div key={i} className="flex gap-3 items-start group">
                                <div className="p-1 px-1.5 bg-gold-primary/20 text-gold-dark rounded-md text-[10px] font-bold mt-0.5 group-hover:bg-gold-primary group-hover:text-white transition-colors">
                                    0{i + 1}
                                </div>
                                <p className="text-xs text-body leading-relaxed">{effect}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-gold-primary" /> Core Assessment
                    </h3>
                    <div className="p-4 bg-parchment/50 rounded-xl border border-antique/50 italic text-xs leading-relaxed text-ink/80">
                        "{data.comprehensive_effects.overall_prediction}"
                    </div>
                    {data.malefic_penalty < 0 && (
                        <div className="mt-4 flex items-center gap-2 p-2 px-3 bg-red-50 border border-red-100 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[10px] font-bold text-red-700">Mitigated by Malefic Influence: {data.malefic_penalty} Points</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Activation Timeline */}
            <div className="bg-softwhite border border-antique rounded-2xl p-6">
                <h3 className="font-serif font-bold text-ink mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Zap className="w-4 h-4 text-gold-primary" /> When it Manifests (Activation)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="relative pl-6 border-l-2 border-gold-primary/20">
                            <div className="absolute w-3 h-3 bg-gold-primary rounded-full -left-[7px] top-1 border-2 border-softwhite shadow-sm" />
                            <h4 className="text-[10px] font-bold text-gold-dark uppercase mb-1">Primary Dasha Periods</h4>
                            <p className="text-xs text-muted leading-relaxed">{data.timing_analysis.best_periods}</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-gold-primary/20">
                            <div className="absolute w-3 h-3 bg-gold-primary/60 rounded-full -left-[7px] top-1 border-2 border-softwhite" />
                            <h4 className="text-[10px] font-bold text-gold-dark uppercase mb-1">Transit Triggers</h4>
                            <p className="text-xs text-muted leading-relaxed">{data.timing_analysis.activation_transits}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-copper-900/5 rounded-2xl border border-copper-900/10">
                        <h4 className="text-sm font-serif font-bold text-copper-900 mb-3 flex items-center gap-2">
                            Golden Timing
                        </h4>
                        <p className="text-xs text-copper-800 leading-relaxed italic">
                            "{data.timing_analysis.remedial_timing}"
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Actionable Remedies */}
            <div className="bg-parchment border border-antique rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Stars className="w-16 h-16 text-gold-primary" />
                </div>

                <h3 className="text-lg font-serif font-bold text-ink mb-4">Empowering Rituals & Remedies</h3>
                <div className="flex flex-wrap gap-2">
                    {data.remedial_suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-antique rounded-xl shadow-sm hover:border-gold-primary transition-colors cursor-default">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs font-medium text-body">{suggestion}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
