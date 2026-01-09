"use client";

import React from 'react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function VedicDashboardPage() {
    const { clientDetails } = useVedicClient();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-serif text-[#FEFAEA] mb-2">Vedic Chart Overview</h1>
                <p className="text-[#FEFAEA]/60 text-lg font-light">
                    Analysis for <span className="text-[#D08C60] font-bold">{clientDetails?.name}</span> born on {clientDetails?.dateOfBirth} at {clientDetails?.timeOfBirth}
                </p>
            </header>

            {/* Placeholder Grid for Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Rasi Chart (D1)", desc: "Main Birth Chart" },
                    { title: "Navamsa (D9)", desc: "Strength & Potential" },
                    { title: "Moon Chart", desc: "Mental State" }
                ].map((chart, i) => (
                    <div key={i} className="aspect-square bg-[#FEFAEA]/5 border border-[#D08C60]/20 rounded-xl relative group hover:bg-[#FEFAEA]/10 transition-all cursor-pointer">
                        <div className="absolute top-4 left-4">
                            <h3 className="text-[#D08C60] font-serif font-bold text-xl">{chart.title}</h3>
                            <p className="text-[#FEFAEA]/50 text-sm">{chart.desc}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                            {/* Decorative Placeholder for Chart */}
                            <div className="w-2/3 h-2/3 border-2 border-[#D08C60]/30 rotate-45" />
                            <div className="absolute w-2/3 h-2/3 border-2 border-[#D08C60]/30" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#FEFAEA]/5 border border-[#D08C60]/20 rounded-xl p-6">
                <h2 className="text-2xl font-serif text-[#FEFAEA] mb-4">Current Transit</h2>
                <div className="h-32 flex items-center justify-center text-[#FEFAEA]/40 italic">
                    Transit data visualization would go here
                </div>
            </div>
        </div>
    );
}
