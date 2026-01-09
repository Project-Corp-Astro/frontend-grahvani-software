"use client";

import React from 'react';

export default function DashasPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-4xl font-serif text-[#FEFAEA] mb-2">Vimshottari Dasha</h1>
                <p className="text-[#FEFAEA]/60 text-lg font-light">Major planetary periods governing the life path.</p>
            </header>

            <div className="bg-[#FEFAEA]/5 border border-[#D08C60]/20 rounded-xl divide-y divide-[#D08C60]/10">
                {[
                    { planet: "Jupiter", period: "2010 - 2026", active: true },
                    { planet: "Saturn", period: "2026 - 2045", active: false },
                    { planet: "Mercury", period: "2045 - 2062", active: false },
                ].map((row, i) => (
                    <div key={i} className={`p-4 flex items-center justify-between ${row.active ? 'bg-[#D08C60]/10' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1A0F0A] border border-[#D08C60]/30 flex items-center justify-center font-serif text-[#D08C60] font-bold">
                                {row.planet.substring(0, 2)}
                            </div>
                            <div>
                                <h3 className={`font-bold font-serif ${row.active ? 'text-[#FFD27D]' : 'text-[#FEFAEA]/80'}`}>Maha Dasha: {row.planet}</h3>
                                <p className="text-xs text-[#FEFAEA]/50 uppercase tracking-widest">Period</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[#FEFAEA] font-mono">{row.period}</span>
                            {row.active && <div className="text-[10px] text-[#FFD27D] uppercase font-bold mt-1">Current</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
