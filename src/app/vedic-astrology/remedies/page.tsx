"use client";

import React from 'react';
import {
    Gem,
    Sparkles,
    HandHeart,
    Scroll,
    CheckCircle2,
    Clock,
    Flame
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";

// Mock Prescription Data
const RX_GEMSTONES = [
    { name: "Yellow Sapphire (Pukhraj)", weight: "5.25 Ratti", metal: "Gold", finger: "Index Finger", day: "Thursday Morning", planet: "Jupiter" },
    { name: "Red Coral (Moonga)", weight: "6.00 Ratti", metal: "Copper/Gold", finger: "Ring Finger", day: "Tuesday Morning", planet: "Mars" }
];

const RX_MANTRAS = [
    {
        name: "Brihaspati Beej Mantra",
        sanskrit: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ||",
        transliteration: "Om Gram Grim Grom Sah Gurave Namah",
        count: "19,000 times",
        rosary: "Tulsi or Haldi",
        planet: "Jupiter"
    },
    {
        name: "Mars Gayatri",
        sanskrit: "ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात् ||",
        transliteration: "Om Angarakaya Vidmahe Shaktihastaya Dhimahi Tanno Bhaumah Prachodayat",
        count: "108 Daily",
        rosary: "Red Sandalwood",
        planet: "Mars"
    }
];

const RX_DONATIONS = [
    { item: "Yellow Gram (Chana Dal)", day: "Thursday", recipient: "Temple Priest or Brahmin", planet: "Jupiter", completed: false },
    { item: "Red Lentils (Masoor Dal)", day: "Tuesday", recipient: "Young Brahmacharis", planet: "Mars", completed: true }
];

export default function RemediesPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D08C60]/20 pb-4">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-1 flex items-center gap-3">
                        <Scroll className="w-8 h-8 text-[#D08C60]" />
                        Karmic Prescription
                    </h1>
                    <p className="text-[#8B5A2B] font-serif text-sm">Remedial measures to balance planetary energies.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-[#8B5A2B]/60 tracking-widest">Prescription ID</p>
                    <p className="font-mono text-[#3E2A1F] font-bold">RX-{new Date().getFullYear()}-001</p>
                </div>
            </div>

            {/* SECTION 1: GEMSTONES (Ratna) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[#D08C60]">
                    <Gem className="w-5 h-5" />
                    <h2 className="text-lg font-serif font-bold text-[#3E2A1F] uppercase tracking-wide">Gemstone Therapy (Ratna)</h2>
                </div>

                <div className="overflow-hidden bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#D08C60]/10 text-[#5A3E2B] font-bold uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-3">Gemstone</th>
                                <th className="px-6 py-3">Weight</th>
                                <th className="px-6 py-3">Metal</th>
                                <th className="px-6 py-3">Wearing Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D08C60]/10">
                            {RX_GEMSTONES.map((gem, i) => (
                                <tr key={i} className="hover:bg-[#3E2A1F]/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="block font-bold text-[#3E2A1F] text-lg font-serif">{gem.name}</span>
                                        <span className="text-xs text-[#8B5A2B] font-medium uppercase tracking-wider">For {gem.planet}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[#5A3E2B]">{gem.weight}</td>
                                    <td className="px-6 py-4 text-[#5A3E2B]">{gem.metal}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-[#3E2A1F]">{gem.finger}</span>
                                            <span className="text-xs text-[#8B5A2B] flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {gem.day}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SECTION 2: MANTRAS (Japa) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[#D08C60]">
                    <Flame className="w-5 h-5" />
                    <h2 className="text-lg font-serif font-bold text-[#3E2A1F] uppercase tracking-wide">Mantra Sadhana</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RX_MANTRAS.map((mantra, i) => (
                        <div key={i} className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D08C60]/50 transition-all">
                            {/* Decorative Background Char */}
                            <div className="absolute -right-4 -bottom-4 text-9xl font-serif text-[#D08C60]/5 rotate-12 pointer-events-none">
                                ॐ
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-[#3E2A1F] text-lg font-serif group-hover:text-[#D08C60] transition-colors">{mantra.name}</h3>
                                    <p className="text-[10px] uppercase font-bold text-[#8B5A2B]/60 tracking-widest">{mantra.planet} Propitiation</p>
                                </div>
                                <div className="bg-[#D08C60]/10 px-3 py-1 rounded-full text-xs font-bold text-[#8B5A2B] border border-[#D08C60]/20">
                                    {mantra.count}
                                </div>
                            </div>

                            <div className="bg-[#3E2A1F]/5 rounded-xl p-4 mb-4 border border-[#3E2A1F]/5">
                                <p className="text-xl font-serif text-[#3E2A1F] text-center mb-2 leading-relaxed">{mantra.sanskrit}</p>
                                <p className="text-xs text-center text-[#5A3E2B]/70 italic">{mantra.transliteration}</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-[#8B5A2B] font-medium">
                                <Sparkles className="w-4 h-4" />
                                <span>Rosary: {mantra.rosary}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 3: DONATIONS (Daan) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[#D08C60]">
                    <HandHeart className="w-5 h-5" />
                    <h2 className="text-lg font-serif font-bold text-[#3E2A1F] uppercase tracking-wide">Charity & Daan</h2>
                </div>

                <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl p-2">
                    {RX_DONATIONS.map((daan, i) => (
                        <div key={i} className={cn(
                            "flex items-center justify-between p-4 rounded-xl transition-all",
                            daan.completed ? "opacity-50 grayscale" : "hover:bg-[#D08C60]/5"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                                    daan.completed ? "bg-[#D08C60] border-[#D08C60] text-white" : "border-[#D08C60]/40 text-transparent hover:border-[#D08C60]"
                                )}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className={cn("font-bold text-[#3E2A1F] font-serif", daan.completed && "line-through")}>{daan.item}</h4>
                                    <p className="text-xs text-[#8B5A2B]">Donate to {daan.recipient} on {daan.day}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D08C60]/60 border border-[#D08C60]/20 px-2 py-1 rounded">
                                {daan.planet}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
