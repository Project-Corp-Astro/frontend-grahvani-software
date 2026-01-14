"use client";

import React, { useState } from 'react';
import { GitCompare, Heart, AlertTriangle, Users, Check, X } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";

// Mock Compatibility Data
const GUNAS = [
    { name: "Varna", max: 1, obtained: 1, desc: "Work/Ego Compatibility" },
    { name: "Vashya", max: 2, obtained: 1.5, desc: "Dominance/Control" },
    { name: "Tara", max: 3, obtained: 3, desc: "Destiny/Health" },
    { name: "Graha Maitri", max: 5, obtained: 0.5, desc: "Mental Friendship" },
    { name: "Gana", max: 6, obtained: 6, desc: "Temperament" },
    { name: "Bhakoot", max: 7, obtained: 0, desc: "Family Welfare (Zero: Dosha)" },
    { name: "Nadi", max: 8, obtained: 8, desc: "Genetic Health" },
];

const TOTAL_SCORE = GUNAS.reduce((acc, g) => acc + g.obtained, 0);

export default function VedicComparisonPage() {
    const { clientDetails } = useVedicClient();
    const [partnerName, setPartnerName] = useState("Priya Sharma"); // Mock Partner

    if (!clientDetails) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-1 flex items-center gap-3">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                        Vedic Compatibility
                    </h1>
                    <p className="text-[#8B5A2B] font-serif text-sm">Ashtakoota Guna Milan & Dosha Analysis.</p>
                </div>
            </div>

            {/* Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Connector */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-[#FDFBF7] shadow-lg flex items-center justify-center">
                        <GitCompare className="w-6 h-6 text-[#D08C60]" />
                    </div>
                </div>

                {/* Boy / Client */}
                <div className="bg-[#FFFFFa] border border-[#D08C60]/30 rounded-3xl p-6 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto bg-[#3E2A1F]/5 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-8 h-8 text-[#3E2A1F]" />
                    </div>
                    <h2 className="text-xl font-bold font-serif text-[#3E2A1F]">{clientDetails.name}</h2>
                    <p className="text-xs text-[#8B5A2B] uppercase tracking-widest mb-4">Primary Chart</p>
                    <div className="flex justify-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-[#3E2A1F]/5 rounded">Ashlesha (2)</span>
                        <span className="px-2 py-1 bg-[#3E2A1F]/5 rounded">Cancer</span>
                    </div>
                </div>

                {/* Girl / Partner */}
                <div className="bg-[#FFFFFa] border border-dashed border-[#D08C60]/40 rounded-3xl p-6 text-center hover:bg-[#D08C60]/5 transition-colors cursor-pointer group relative">
                    <div className="absolute top-4 right-4 text-[#D08C60] opacity-50 text-xs font-bold uppercase tracking-widest group-hover:opacity-100">Change</div>
                    <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-3">
                        <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold font-serif text-[#3E2A1F]">{partnerName}</h2>
                    <p className="text-xs text-[#8B5A2B] uppercase tracking-widest mb-4">Partner Chart</p>
                    <div className="flex justify-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Magha (1)</span>
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Leo</span>
                    </div>
                </div>
            </div>

            {/* ASHTAKOOTA TABLE */}
            <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-[#D08C60]/10 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-[#3E2A1F]">Ashtakoota Scorecard</h3>
                    <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-[#D08C60]/20">
                        <span className="text-xs font-bold text-[#8B5A2B] uppercase mr-2">Total Score</span>
                        <span className={cn("text-lg font-black", TOTAL_SCORE > 18 ? "text-green-600" : "text-red-600")}>
                            {TOTAL_SCORE} / 36
                        </span>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#3E2A1F]/5 text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-3">Koota (Area)</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Max Points</th>
                            <th className="px-6 py-3 text-right">Obtained</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D08C60]/10">
                        {GUNAS.map((guna, i) => (
                            <tr key={i} className={cn("hover:bg-[#3E2A1F]/5 transition-colors", guna.obtained === 0 && "bg-red-50")}>
                                <td className="px-6 py-3 font-bold text-[#3E2A1F] font-serif">{guna.name}</td>
                                <td className="px-6 py-3 text-[#5A3E2B]">
                                    {guna.desc}
                                    {guna.obtained === 0 && <span className="ml-2 text-[10px] font-black text-red-600 bg-red-100 px-1 py-0.5 rounded border border-red-200">DOSHA</span>}
                                </td>
                                <td className="px-6 py-3 text-right font-mono text-[#8B5A2B]">{guna.max}</td>
                                <td className="px-6 py-3 text-right font-black text-[#3E2A1F]">{guna.obtained}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MANGAL DOSHA CHECK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700">
                        <Check className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-900">Boy: Non-Manglik</h4>
                        <p className="text-xs text-green-800">Mars is in 3rd House (Safe).</p>
                    </div>
                </div>

                <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-700">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-900">Girl: High Manglik</h4>
                        <p className="text-xs text-red-800">Mars in 7th House caused Bhakoot Dosha.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
