"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
    Scroll,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Gem,
    Utensils,
    Gift,
    BookOpen,
    Info,
    Sun,
    Moon
} from 'lucide-react';
import DebugConsole from '@/components/debug/DebugConsole';

interface LalKitabDashboardProps {
    data: any; // Lal Kitab JSON data
    className?: string;
}

export default function LalKitabDashboard({ data, className }: LalKitabDashboardProps) {
    if (!data || !data.data) return null;

    const remedyData = data.data;
    const details = remedyData.details || {};
    const planetInfo = remedyData.planet_info || {};

    return (
        <div className={cn(
            "h-full max-h-[85vh] rounded-[2rem] bg-[#FDFBF7] border-4 border-[#D4C3A3] shadow-2xl flex flex-col overflow-hidden relative",
            className
        )}>
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4A3B2A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            {/* Premium Header */}
            <div className="shrink-0 bg-gradient-to-b from-[#EAD8B1] to-[#D4C3A3] p-5 border-b-2 border-[#B8A383] relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Scroll className="w-20 h-20 text-[#4A3B2A]" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/40 rounded-2xl shadow-inner border border-white/20 backdrop-blur-sm">
                            <Sparkles className="w-6 h-6 text-[#B8860B]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-black text-[#4A3B2A] tracking-tight flex items-center gap-3">
                                Lal Kitab Remedial Plan
                            </h2>
                            <p className="text-[#6B5A45] text-xs font-medium uppercase tracking-widest mt-0.5">
                                Accurate Prescription for <span className="text-[#B8860B] font-bold">{data.user_name || "Sadhaka"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm text-center">
                            <p className="text-[10px] uppercase font-black text-[#B8860B] mb-0.5">Cycle Duration</p>
                            <p className="text-sm font-serif font-bold text-[#4A3B2A]">{remedyData.remedy_cycle || "43 Days"}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm text-center">
                            <p className="text-[10px] uppercase font-black text-[#B8860B] mb-0.5">Primary Focus</p>
                            <p className="text-sm font-serif font-bold text-[#4A3B2A]">{remedyData.planet} in {remedyData.house}{getOrdinal(remedyData.house)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Flush bottom with footer */}
            <div className="flex-1 px-4 lg:px-6 pt-4 lg:pt-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Main Remedy Card */}
                    <RemedyAnalysisCard
                        title={`${remedyData.planet} (${remedyData.planet === 'Ketu' ? 'Dragon\'s Tail' : remedyData.planet})`}
                        focus={`${remedyData.house}${getOrdinal(remedyData.house)} House Stability`}
                        diagnosis={details.malefic || "Planetary imbalance detected."}
                        remedy={details.remedies?.[0] || "Consult expert for guidance."}
                        time={remedyData.best_time}
                        constraint={`Cycle: ${remedyData.remedy_cycle || '43 Days'}`}
                        status="Recommended"
                        icon={remedyData.planet === 'Sun' ? Sun : remedyData.planet === 'Moon' ? Moon : Sparkles}
                        accent="amber"
                    />

                    {/* Technical Analysis Card */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-[#E6D5BC] shadow-sm flex-1 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-serif font-black text-[#4A3B2A] mb-4 uppercase tracking-widest flex items-center gap-2">
                                <Scroll className="w-4 h-4 text-[#B8860B]" />
                                Scriptural Diagnosis
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-[#FFF9E5] p-3 rounded-xl border border-[#E6D5BC]/50">
                                    <p className="text-[10px] font-black text-[#B8860B] uppercase mb-1">Karmic Trigger</p>
                                    <p className="text-xs text-[#4A3B2A] font-medium leading-relaxed italic">
                                        "{details.why || "Planetary energy requires specific material grounding to stabilize."}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E6D5BC]/30">
                                        <p className="text-[10px] font-bold text-[#6B5A45] mb-1 uppercase">Positive</p>
                                        <p className="text-[11px] text-[#2D6A4F] font-bold">{details.benefic || "Neutral"}</p>
                                    </div>
                                    <div className="p-3 bg-[#FFF5F5] rounded-xl border border-red-100">
                                        <p className="text-[10px] font-bold text-red-800 mb-1 uppercase">Warning</p>
                                        <p className="text-[11px] text-red-700 font-bold">{details.malefic?.split(',')[0] || "Alert"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Practical Karma Box */}
                        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-black text-sky-800 uppercase tracking-wider mb-1">Practical Logic</h4>
                                <p className="text-xs text-sky-700 leading-snug">{details.practical || "Ensure consistency in actions for best results."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Remedies & Cautions */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-[#E6D5BC] shadow-sm flex-1 relative flex flex-col">
                            <h3 className="text-sm font-serif font-black text-[#4A3B2A] mb-3 uppercase tracking-widest flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-[#B8860B]" />
                                Supplementary Measures
                            </h3>
                            <div className="flex-1 space-y-2 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                                {details.remedies?.slice(1).map((r: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 bg-[#FAFAFA] rounded-xl border border-gray-100">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-[11px] text-[#4A3B2A] font-medium leading-tight">{r}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#F5E6D3]">
                                <h4 className="text-xs font-black text-red-800 uppercase mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Major Cautions
                                </h4>
                                <ul className="space-y-1">
                                    {details.cautions?.map((c: string, idx: number) => (
                                        <li key={idx} className="text-[10px] text-red-700 font-bold flex items-start gap-2">
                                            <span className="shrink-0 mt-1 w-1 h-1 bg-red-400 rounded-full"></span>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Golden Rules Footer - light Premium Scroll Style */}
            <div className="shrink-0 px-8 pb-10 pt-2 bg-gradient-to-t from-[#EAD8B1] to-[#FDFBF7] relative">
                {/* Subtle Texture */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4A3B2A 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-[1px] w-12 bg-[#B8860B]/30"></div>
                        <h3 className="text-[#4A3B2A] font-serif font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-[#B8860B]" />
                            Golden Rules for Success
                            <Sparkles className="w-4 h-4 text-[#B8860B]" />
                        </h3>
                        <div className="h-[1px] w-12 bg-[#B8860B]/30"></div>
                    </div>

                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-[#D4C3A3]/50 group-hover:border-[#B8860B] transition-colors shadow-sm">
                                <Sun className="w-5 h-5 text-[#B8860B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[#B8860B] font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 1</p>
                                <p className="text-[#4A3B2A] text-[11px] leading-tight font-bold">Perform during daylight (Sunrise to Sunset) only.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-[#D4C3A3]/50 group-hover:border-[#B8860B] transition-colors shadow-sm">
                                <Utensils className="w-5 h-5 text-[#B8860B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[#B8860B] font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 2</p>
                                <p className="text-[#4A3B2A] text-[11px] leading-tight font-bold">Initiate only one new remedy per progression day.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-[#D4C3A3]/50 group-hover:border-[#B8860B] transition-colors shadow-sm">
                                <Calendar className="w-5 h-5 text-[#B8860B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[#B8860B] font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 3</p>
                                <p className="text-[#4A3B2A] text-[11px] leading-tight font-bold">Maintain 43-day continuity for permanent effects.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Debugging Console */}
            <div className="px-8 pb-10">
                <DebugConsole
                    title="Lal Kitab Raw Data"
                    data={data}
                />
            </div>
        </div>
    );
}

// Sub-component for individual remedy cards with Slide 3 premium feel
function RemedyAnalysisCard({ title, focus, diagnosis, remedy, time, constraint, status, icon: Icon, accent }: any) {
    return (
        <div className="bg-white rounded-[2rem] border-2 border-[#E6D5BC] shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-gold-primary/40 transition-all duration-300">
            {/* Card Header */}
            <div className={cn(
                "p-4 border-b-2 text-white",
                accent === 'amber' ? "bg-gradient-to-r from-[#D08C60] to-[#B8733D] border-[#B8733D]" : "bg-gradient-to-r from-sky-700 to-sky-900 border-sky-900"
            )}>
                <h4 className="text-sm font-serif font-black uppercase tracking-tight">{title} <span className="mx-2 opacity-50">|</span> {focus}</h4>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-24 h-24 rounded-2xl bg-[#FDFBF7] border-2 border-[#E6D5BC]/50 flex items-center justify-center relative overflow-hidden group-hover:bg-[#FFF9E5]">
                        <Icon className="w-12 h-12 text-[#D08C60] opacity-80 group-hover:scale-110 transition-transform" />
                        {/* Status Check */}
                        <div className="absolute top-1 right-1">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-wider">Diagnosis</p>
                            <p className="text-xs text-[#4A3B2A] font-bold leading-snug mt-0.5">{diagnosis}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-wider">Remedy</p>
                            <p className="text-xs text-[#4A3B2A] font-medium leading-relaxed mt-0.5">{remedy}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                        <p className="text-[9px] font-black text-[#6B5A45] uppercase">Time</p>
                        <p className="text-[10px] text-[#4A3B2A] font-bold">{time || "Daylight"}</p>
                    </div>
                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                        <p className="text-[9px] font-black text-[#6B5A45] uppercase">Constraint</p>
                        <p className="text-[10px] text-[#4A3B2A] font-bold">{constraint}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 uppercase text-[10px] font-black text-[#6B5A45]">
                        Status: <span className="text-green-600">{status}</span>
                    </div>
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[12%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for ordinal suffix
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
