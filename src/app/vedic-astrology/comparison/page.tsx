"use client";

import React from 'react';
import { GitCompare, Users, Zap, Compass, ArrowRightLeft } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function VedicComparisonPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#FFFFFF]/40 border border-[#D08C60]/30 p-12 rounded-[3.5rem] text-center shadow-xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B]/5 via-transparent to-[#4ECDC4]/5 pointer-events-none" />

                <div className="inline-flex p-5 rounded-[2rem] bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 mb-8 items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#D08C60]/20 flex items-center justify-center text-[#D08C60]">
                        <Compass className="w-8 h-8" />
                    </div>
                    <ArrowRightLeft className="w-6 h-6 text-[#3E2A1F]/20" />
                    <div className="w-14 h-14 rounded-2xl bg-[#3E2A1F]/5 flex items-center justify-center text-[#3E2A1F]/30 border border-dashed border-[#3E2A1F]/10">
                        <Users className="w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-5xl font-serif text-[#3E2A1F] font-black tracking-tight mb-4">The Synastry Engine</h1>
                <p className="text-[#5A3E2B]/80 italic font-serif text-xl max-w-2xl mx-auto">
                    Compare {clientDetails.name}'s cosmic field against secondary charts, transits, or partners.
                </p>

                <div className="mt-12 flex justify-center gap-4">
                    <button className="px-10 py-5 bg-[#FF6B6B] text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:scale-105 transition-all">
                        Select Partner Chart
                    </button>
                    <button className="px-10 py-5 bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 text-[#3E2A1F] rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-[#3E2A1F]/10 transition-all">
                        Layer Transits
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-6">
                <Feature icon={GitCompare} title="8-Fold Matching" desc="Traditional Guna-Milan with breakdown." />
                <Feature icon={Zap} title="Dynamic Drishti" title2="Aspect Overlay" desc="Visual overlap of aspect fields." />
                <Feature icon={Compass} title="Transit Sync" desc="Real-time planetary shifts vs Natal." />
            </div>
        </div>
    );
}

function Feature({ icon: Icon, title, title2, desc }: { icon: any, title: string, title2?: string, desc: string }) {
    return (
        <div className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D08C60]/10 border border-[#D08C60]/20 flex items-center justify-center text-[#D08C60] mx-auto mb-6">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif font-black text-[#3E2A1F]">{title} {title2 && <span className="block text-sm text-[#D08C60]">{title2}</span>}</h4>
            <p className="text-[11px] text-[#5A3E2B]/70 leading-relaxed font-serif">{desc}</p>
        </div>
    );
}
