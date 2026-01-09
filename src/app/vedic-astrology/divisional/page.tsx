"use client";

import React, { useState } from 'react';
import { Map, LayoutGrid, Zap, Compass } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import VargaSelector from '@/components/astrology/VargaSelector';
import NorthIndianChart from '@/components/astrology/NorthIndianChart';

export default function VedicDivisionalPage() {
    const { clientDetails } = useVedicClient();
    const [activeVarga, setActiveVarga] = useState('D9');

    if (!clientDetails) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-10 bg-[#FFFFFF]/40 border border-[#D08C60]/30 rounded-[3rem] shadow-xl backdrop-blur-sm">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Map className="w-8 h-8 text-[#D08C60]" />
                        <h1 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">Divisional Analysis</h1>
                    </div>
                    <p className="text-[#5A3E2B]/80 italic font-serif text-lg">Detailed microscopic view of specific life areas via Shodashvarga.</p>
                </div>
                <VargaSelector activeVarga={activeVarga} onSelect={setActiveVarga} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-[#FFFFFF]/40 border border-[#D08C60]/20 rounded-[3rem] p-12 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-8 left-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D08C60]">{activeVarga} Mapping</span>
                    </div>
                    <NorthIndianChart ascendantSign={7} planets={[]} />
                </div>

                <div className="space-y-8">
                    <AnalyticsCard title="Varga Status" value="Excellent" desc="High dignity in the current divisional chart." />
                    <AnalyticsCard title="Soul Focus" value="Marital Prosperity" desc="D9 (Navamsa) highlights core spiritual fruit." />
                </div>
            </div>
        </div>
    );
}

function AnalyticsCard({ title, value, desc }: { title: string, value: string, desc: string }) {
    return (
        <div className="p-8 bg-[#3E2A1F]/5 border border-[#3E2A1F]/5 rounded-[2.5rem] hover:border-[#D08C60]/40 transition-all hover:bg-[#3E2A1F]/10 hover:shadow-lg group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5A3E2B]/60">{title}</span>
                <Compass className="w-4 h-4 text-[#D08C60]" />
            </div>
            <p className="text-2xl font-serif font-black text-[#3E2A1F] mb-2">{value}</p>
            <p className="text-sm text-[#5A3E2B]/70 font-serif leading-relaxed">{desc}</p>
        </div>
    );
}
