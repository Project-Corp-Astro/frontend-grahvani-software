"use client";

import React from 'react';
import { Sun, Moon, Wind, Compass } from 'lucide-react';

export default function PanchangCompact() {
    // Mock data for UI demonstration
    const data = [
        { label: "Tithi", value: "Shukla Navami", icon: Moon, color: "text-[#FFD27D]" },
        { label: "Nakshatra", value: "Magha", icon: Sun, color: "text-[#D08C60]" },
        { label: "Yoga", value: "Vyatipata", icon: Wind, color: "text-[#FFD27D]" },
        { label: "Karana", value: "Taitila", icon: Compass, color: "text-[#D08C60]" }
    ];

    return (
        <div className="bg-[#2A1810]/40 backdrop-blur-sm border border-[#D08C60]/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#D08C60]/10 px-4 py-2 border-b border-[#D08C60]/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#FFD27D] uppercase tracking-widest font-serif">Daily Panchang</span>
                <span className="text-[9px] text-white/40 uppercase tracking-tighter">New Delhi • 11:45 AM</span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-[#D08C60]/10">
                {data.map((item, i) => (
                    <div key={i} className="bg-[#2A1810]/60 p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{item.label}</p>
                            <p className="text-sm font-serif text-white font-bold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-[#1A0A05]/80 text-center">
                <button className="text-[10px] font-bold text-[#D08C60] uppercase tracking-widest hover:text-[#FFD27D] transition-colors">
                    View Full Calendar →
                </button>
            </div>
        </div>
    );
}
