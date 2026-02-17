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
    Info
} from 'lucide-react';

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
            "h-full max-h-[85vh] p-4 lg:p-6 rounded-[1.5rem] bg-[#FDFBF7] border border-[#E6D5BC] flex flex-col gap-4 shadow-sm overflow-hidden",
            className
        )}>
            {/* compact Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-[#E6D5BC]/50 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFF9E5] rounded-lg border border-[#E6D5BC]">
                        <Scroll className="w-5 h-5 text-[#B8860B]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-serif font-bold text-[#4A3B2A] leading-tight">
                            Lal Kitab Prescription
                        </h2>
                        <p className="text-[#8B7355] text-xs">
                            <strong className="text-[#B8860B]">{remedyData.planet}</strong> in <strong className="text-[#B8860B]">{remedyData.house}{getOrdinal(remedyData.house)} House</strong>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-[#E6D5BC] px-3 py-1.5 rounded-full text-xs font-medium text-[#6B5A45]">
                        <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Cycle: {remedyData.remedy_cycle || "43 Days"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-[#E6D5BC] px-3 py-1.5 rounded-full text-xs font-medium text-[#6B5A45]">
                        <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Start: {remedyData.best_day}</span>
                    </div>
                </div>
            </div>

            {/* Main Content - No scroll if possible, use grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">

                {/* Column 1: Snapshot (Planet + Attributes) - Span 3 */}
                <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-1">
                    <div className="bg-white p-4 rounded-xl border border-[#E6D5BC] shadow-sm flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFF9E5] flex items-center justify-center border border-[#E6D5BC]">
                                <Sparkles className="w-5 h-5 text-[#B8860B]" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#4A3B2A]">{remedyData.planet}</h3>
                                <span className="px-2 py-0.5 bg-[#F5E6D3] rounded text-[10px] uppercase font-bold text-[#6B5A45] tracking-wider">
                                    {details.domain || "General"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-[#F5E6D3] pt-3">
                            <div className="bg-[#FAFAFA] p-2 rounded-lg border border-gray-100">
                                <span className="text-[10px] font-bold text-[#6B5A45] uppercase block mb-1">Benefic</span>
                                <p className="text-[#4A3B2A] text-xs leading-snug">{details.benefic || "N/A"}</p>
                            </div>
                            <div className="bg-[#FAFAFA] p-2 rounded-lg border border-gray-100">
                                <span className="text-[10px] font-bold text-[#8B0000] uppercase block mb-1">Malefic</span>
                                <p className="text-[#4A3B2A] text-xs leading-snug">{details.malefic || "N/A"}</p>
                            </div>
                            <div className="flex items-start gap-1.5 p-2">
                                <Info className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-[#6B5A45] italic leading-snug">{details.why || "Karmic balance required."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Attributes Compact */}
                    <div className="bg-[#FFF9E5]/50 p-3 rounded-xl border border-[#E6D5BC]/50 text-xs">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            <span className="text-[#8B7355]">Color:</span> <span className="font-medium text-[#4A3B2A] text-right">{planetInfo.color}</span>
                            <span className="text-[#8B7355]">Metal:</span> <span className="font-medium text-[#4A3B2A] text-right">{planetInfo.metal || "-"}</span>
                            <span className="text-[#8B7355]">Time:</span> <span className="font-medium text-[#4A3B2A] text-right">{remedyData.best_time}</span>
                        </div>
                        {planetInfo.items && planetInfo.items.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-[#E6D5BC]/30">
                                <div className="flex flex-wrap gap-1">
                                    {planetInfo.items.map((item: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-white border border-[#E6D5BC] rounded-[4px] text-[10px] text-[#6B5A45]">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Remedies (The Core) - Span 5 */}
                <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
                    <div className="bg-white p-5 rounded-xl border border-[#E6D5BC] shadow-sm flex flex-col h-full">
                        <h3 className="text-sm font-serif font-bold text-[#4A3B2A] mb-3 flex items-center gap-2 shrink-0">
                            <Utensils className="w-4 h-4 text-[#B8860B]" />
                            Prescribed Upaya
                        </h3>

                        <div className="overflow-y-auto pr-2 space-y-2 flex-1 custom-scrollbar">
                            {details.remedies && details.remedies.length > 0 ? (
                                details.remedies.map((remedy: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:border-[#E6D5BC] transition-colors group">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-[#4A3B2A] text-sm leading-snug font-medium">{remedy}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 italic">No specific remedies listed.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 3: Actions & Precautions - Span 4 */}
                <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">

                    {/* Practical Karma */}
                    {details.practical && (
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <h4 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> Practical Karma
                            </h4>
                            <p className="text-xs text-blue-700 leading-relaxed">{details.practical}</p>
                        </div>
                    )}

                    {/* Donations */}
                    {details.donations && details.donations.length > 0 && (
                        <div className="p-4 bg-white border border-[#E6D5BC] rounded-xl">
                            <h4 className="text-xs font-bold text-[#8B7355] mb-2 flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5" /> Donations
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {details.donations.map((item: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-[#FFF9E5] border border-[#E6D5BC] rounded-md text-[10px] font-medium text-[#6B5A45]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Precautions - Pushed to bottom or fills space */}
                    {details.cautions && details.cautions.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex-1">
                            <h4 className="text-xs font-bold text-red-800 mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> Precautions
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {details.cautions.map((caution: string, idx: number) => (
                                    <li key={idx} className="text-xs text-red-700 leading-snug">{caution}</li>
                                ))}
                            </ul>
                        </div>
                    )}
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
