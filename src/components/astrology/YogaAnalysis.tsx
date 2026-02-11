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
    ShieldCheck,
    LayoutGrid,
    MapPin,
    Calendar,
    Clock,
    AlertCircle,
    User,
    Compass
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { clientApi } from '@/lib/api';
import { YogaAnalysis } from '@/types/astrology';
import DebugConsole from '../debug/DebugConsole';

interface YogaAnalysisProps {
    clientId: string;
    yogaType: string;
    ayanamsa?: string;
    className?: string;
}

export default function YogaAnalysisView({ clientId, yogaType, ayanamsa = 'lahiri', className }: YogaAnalysisProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await clientApi.getYogaAnalysis(clientId, yogaType, ayanamsa);
                // Safely unwrap data: backend might return { data: { data: ... } } (double nested)
                const responseData = result.data?.data || result.data;
                setData(responseData);
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
            <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                    <Info className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-amber-900 font-bold font-serif text-sm">Yoga Detail Pending</h3>
                    <p className="text-[10px] text-amber-600">{error || 'Detailed analysis not currently available for this client'}</p>
                </div>
                {error && <DebugConsole title={`Yoga Analysis Error: ${yogaType}`} data={{ error, yogaType, ayanamsa }} />}
            </div>
        );
    }

    // Specialized Gaja Kesari View
    if (yogaType === 'gaja_kesari' || yogaType === 'gajakesari' || data.comprehensive_gaja_kesari_analysis) {
        return <GajaKesariView data={data} className={className} />;
    }

    if (!data.yoga_present) {
        return (
            <div className="space-y-4">
                <div className={cn("bg-parchment/50 border border-antique rounded-2xl p-6 text-center opacity-60", className)}>
                    <Info className="w-8 h-8 text-muted mx-auto mb-2" />
                    <h3 className="text-muted font-serif font-bold text-lg capitalize">{yogaType.replace('_', ' ')} Absent</h3>
                    <p className="text-xs text-muted mt-1">Planetary conditions for this specific yoga are not fully met in the natal chart.</p>
                </div>
                <DebugConsole title={`Yoga Analysis (Absent): ${yogaType}`} data={data} />
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
                                data.yoga_strength?.includes('Exceptional') ? "bg-amber-600 text-white border-amber-700" :
                                    data.yoga_strength?.includes('Strong') ? "bg-gold-primary text-ink border-gold-dark" :
                                        "bg-parchment text-muted border-antique"
                            )}>
                                {data.yoga_strength}
                            </span>
                        </div>
                        <div className="w-24 h-2 bg-parchment rounded-full overflow-hidden border border-antique">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    data.yoga_strength?.includes('Exceptional') ? "w-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" :
                                        data.yoga_strength?.includes('Strong') ? "w-[75%] bg-gold-primary" :
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
                        {data.comprehensive_effects?.specific_effects?.map((effect: any, i: number) => (
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
                        "{data.comprehensive_effects?.overall_prediction}"
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
                            <p className="text-xs text-muted leading-relaxed">{data.timing_analysis?.best_periods}</p>
                        </div>
                        <div className="relative pl-6 border-l-2 border-gold-primary/20">
                            <div className="absolute w-3 h-3 bg-gold-primary/60 rounded-full -left-[7px] top-1 border-2 border-softwhite" />
                            <h4 className="text-[10px] font-bold text-gold-dark uppercase mb-1">Transit Triggers</h4>
                            <p className="text-xs text-muted leading-relaxed">{data.timing_analysis?.activation_transits}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-copper-900/5 rounded-2xl border border-copper-900/10">
                        <h4 className="text-sm font-serif font-bold text-copper-900 mb-3 flex items-center gap-2">
                            Golden Timing
                        </h4>
                        <p className="text-xs text-copper-800 leading-relaxed italic">
                            "{data.timing_analysis?.remedial_timing}"
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
                    {data.remedial_suggestions?.map((suggestion: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-antique rounded-xl shadow-sm hover:border-gold-primary transition-colors cursor-default">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs font-medium text-body">{suggestion}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Debug Console */}
            <DebugConsole title={`Yoga Analysis: ${yogaType}`} data={data} />
        </div>
    );
}

/**
 * GAJA KESARI SPECIALIZED VIEW - COMPACT DASHBOARD
 * 
 * Designed to be "Above the Fold" with high information density.
 */
function GajaKesariView({ data, className }: { data: any, className?: string }) {
    // Correctly handle the case where data might be double-nested
    const rawData = data?.data || data;
    const analysis = rawData.comprehensive_gaja_kesari_analysis || {};
    const positions = rawData.all_planetary_positions || {};
    const notes = rawData.calculation_notes || {};
    const birth = rawData.birth_details || {};

    const jupiter = positions.Jupiter || {};
    const moon = positions.Moon || {};

    const jHouse = parseInt(jupiter.house?.toString() || '0');
    const mHouse = parseInt(moon.house?.toString() || '0');
    const houseGap = (jHouse && mHouse) ? Math.abs(mHouse - jHouse) : NaN;

    return (
        <div className={cn("space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>

            {/* 1. COMPACT HEADER BAR */}
            <div className="bg-white border border-gold-primary/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gold-primary/5 -skew-x-12 translate-x-10" />

                {/* Title Section */}
                <div className="flex items-center gap-4 z-10">
                    <div className="w-10 h-10 rounded-xl bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-black text-ink leading-none">Gaja Kesari <span className="text-gold-dark">Yoga</span></h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                                analysis.yoga_present
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-orange-50 text-orange-700 border-orange-200"
                            )}>
                                {analysis.yoga_present ? "Active" : "Inactive"}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">{notes.analysis_type}</span>
                        </div>
                    </div>
                </div>

                {/* Compact Identity Strip */}
                <div className="flex items-center gap-6 text-xs z-10 bg-parchment/30 px-4 py-2 rounded-lg border border-antique/50">
                    <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gold-dark" />
                        <span className="font-bold text-ink">{rawData.user_name}</span>
                    </div>
                    <div className="w-px h-3 bg-antique/50" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {birth.birth_date}
                    </div>
                    <div className="w-px h-3 bg-antique/50" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" /> {birth.birth_time}
                    </div>
                    <div className="w-px h-3 bg-antique/50" />
                    <div className="flex items-center gap-2">
                        <Compass className="w-3 h-3 text-gold-dark" />
                        <span className="font-serif font-bold text-gold-primary">{birth.ascendant?.sign}</span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">

                {/* LEFT: VISUAL MATRIX & STATUS (Compact) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    {/* Horizontal Matrix */}
                    <div className="bg-white border border-antique rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent opacity-20" />

                        <div className="flex items-center justify-between max-w-2xl mx-auto w-full relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-10 right-10 h-px border-t border-dashed border-gold-primary/30 -translate-y-1/2" />

                            {/* Moon */}
                            <div className="relative z-10 flex flex-col items-center gap-2 group">
                                <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                    <Stars className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div className="text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-white/50">
                                    <p className="text-[10px] font-black text-indigo-900 uppercase tracking-wider">Moon</p>
                                    <p className="text-sm font-serif font-black text-ink leading-none mt-0.5">H{moon.house}</p>
                                </div>
                            </div>

                            {/* Gap Pill */}
                            <div className="relative z-10 bg-white border border-antique shadow-sm px-4 py-1.5 rounded-full flex flex-col items-center">
                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Angle</span>
                                <span className={cn("text-xl font-serif font-black leading-none", analysis.yoga_present ? "text-emerald-600" : "text-orange-500")}>
                                    {isNaN(houseGap) ? '?' : houseGap}
                                </span>
                            </div>

                            {/* Jupiter */}
                            <div className="relative z-10 flex flex-col items-center gap-2 group">
                                <div className="w-14 h-14 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                    <Zap className="w-6 h-6 text-gold-primary" />
                                </div>
                                <div className="text-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-white/50">
                                    <p className="text-[10px] font-black text-gold-dark uppercase tracking-wider">Jupiter</p>
                                    <p className="text-sm font-serif font-black text-ink leading-none mt-0.5">H{jupiter.house}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className={cn(
                        "rounded-xl border px-5 py-3 flex items-start gap-4 transition-colors",
                        analysis.yoga_present
                            ? "bg-emerald-50/50 border-emerald-100"
                            : "bg-orange-50/50 border-orange-100"
                    )}>
                        <div className={cn(
                            "p-1.5 rounded-lg shrink-0 mt-0.5",
                            analysis.yoga_present ? "bg-emerald-200 text-emerald-800" : "bg-orange-200 text-orange-800"
                        )}>
                            {analysis.yoga_present ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                            <h4 className={cn("text-sm font-serif font-bold", analysis.yoga_present ? "text-emerald-900" : "text-orange-900")}>
                                {analysis.yoga_present ? "Yoga Formed" : "Conditions Not Met"}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                {analysis.reason}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TECHNICAL PANEL (Dense) */}
                <div className="lg:col-span-4 bg-zinc-900 rounded-2xl p-5 text-zinc-300 flex flex-col border border-zinc-800">
                    <h3 className="text-[10px] font-black text-gold-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Analysis Engine
                    </h3>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
                        {notes.critical_fixes?.length > 0 ? notes.critical_fixes.map((fix: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start group">
                                <span className="text-[9px] font-mono text-zinc-500 mt-0.5">0{i + 1}</span>
                                <p className="text-[11px] leading-tight group-hover:text-white transition-colors">
                                    {fix}
                                </p>
                            </div>
                        )) : (
                            <p className="text-[11px] italic text-zinc-600">System operating normally.</p>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                        <div className="bg-white/5 rounded-lg p-2">
                            <span className="block text-[9px] text-zinc-500 uppercase">Ayanamsa</span>
                            <span className="text-[10px] font-mono text-gold-primary">{notes.ayanamsa_value || 'N/A'}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                            <span className="block text-[9px] text-zinc-500 uppercase">House System</span>
                            <span className="text-[10px] font-serif text-white">{notes.house_system || 'Placidus'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PLANETARY STRIP (Bottom) */}
            <div className="bg-white border border-antique rounded-xl p-3 shadow-none">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <LayoutGrid className="w-3.5 h-3.5 text-gold-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Chart Positions</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-9 gap-2">
                    {Object.entries(positions).map(([planet, details]: [string, any]) => (
                        <div key={planet} className={cn(
                            "flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-lg p-1.5 hover:border-gold-primary/30 transition-colors",
                            (planet === 'Jupiter' || planet === 'Moon') && "bg-gold-primary/5 border-gold-primary/20"
                        )}>
                            <div className={cn(
                                "w-6 h-6 rounded flex items-center justify-center text-[9px] font-black shrink-0",
                                planet === 'Jupiter' ? "bg-gold-primary text-ink" :
                                    planet === 'Moon' ? "bg-indigo-500 text-white" : "bg-white border text-ink"
                            )}>
                                {planet.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[9px] font-bold text-ink truncate w-full">{details.sign}</span>
                                <span className="text-[8px] text-muted-foreground font-mono">{details.house}H</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden Debug */}
            <div className="hidden">
                <DebugConsole title="Gaja Kesari Compact Layout" data={data} />
            </div>
        </div>
    );
}
