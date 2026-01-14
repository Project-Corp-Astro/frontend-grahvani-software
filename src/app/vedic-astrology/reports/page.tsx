"use client";

import React, { useState } from 'react';
import {
    FileText,
    Download,
    Star,
    Sparkles,
    Cpu,
    Printer,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";

// Mock Yoga Data
const IDENTIFIED_YOGAS = [
    { name: "Gaja Kesari Yoga", type: "Raja Yoga", strength: 85, desc: "Moon & Jupiter in Kendra. Grants fame and wisdom.", active: true },
    { name: "Budhaditya Yoga", type: "Raja Yoga", strength: 92, desc: "Sun & Mercury conjunction using high intelligence.", active: true },
    { name: "Kemadruma Yoga", type: "Dosha", strength: 0, desc: "No planets flanking Moon. CANCELLED due to Jupiter aspect.", active: false },
    { name: "Panch Mahapurusha", type: "Raja Yoga", strength: 78, desc: "Mars in Own Sign (Ruchaka Yoga).", active: true },
];

export default function VedicReportsPage() {
    const { clientDetails } = useVedicClient();
    const [generating, setGenerating] = useState(false);

    if (!clientDetails) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-black tracking-tight mb-1 flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-[#D08C60]" />
                        Report Lab
                    </h1>
                    <p className="text-[#8B5A2B] font-serif text-sm">Automated Yoga identification and document synthesis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#3E2A1F] text-white rounded-lg shadow-lg hover:bg-[#5A3E2B] transition-colors">
                        <Printer className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Print Chart</span>
                    </button>
                </div>
            </div>

            {/* YOGA DETECTOR */}
            <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-[#D08C60]/10 border-b border-[#D08C60]/20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#D08C60]" />
                        <h3 className="font-serif font-bold text-[#3E2A1F]">Cosmic Signatures (Yogas)</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#8B5A2B]/60 tracking-widest">AI Scan Complete</span>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FFFFFa] text-[#5A3E2B]/70 font-black uppercase text-[10px] tracking-widest border-b border-[#D08C60]/10">
                        <tr>
                            <th className="px-6 py-3">Yoga Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Strength</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D08C60]/5">
                        {IDENTIFIED_YOGAS.map((yoga, i) => (
                            <tr key={i} className={cn("hover:bg-[#3E2A1F]/5 transition-colors", !yoga.active && "opacity-60 bg-gray-50")}>
                                <td className="px-6 py-4 font-bold text-[#3E2A1F] font-serif flex items-center gap-2">
                                    <Star className={cn("w-3 h-3", yoga.active ? "text-[#D08C60] fill-[#D08C60]" : "text-gray-400")} />
                                    {yoga.name}
                                </td>
                                <td className="px-6 py-4 text-[#5A3E2B] text-xs uppercase tracking-wider font-bold">{yoga.type}</td>
                                <td className="px-6 py-4">
                                    {yoga.active ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 bg-[#D08C60]/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#D08C60]" style={{ width: `${yoga.strength}%` }} />
                                            </div>
                                            <span className="text-xs font-mono text-[#D08C60] font-bold">{yoga.strength}%</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 font-mono">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-[#5A3E2B] text-xs leading-relaxed max-w-xs">{yoga.desc}</td>
                                <td className="px-6 py-4 text-right">
                                    {yoga.active ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-wider">
                                            <XCircle className="w-3 h-3" /> Cancelled
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DOWNLOAD GRID */}
            <div>
                <h3 className="font-serif font-bold text-[#3E2A1F] mb-4 text-lg">Available Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Report Card 1 */}
                    <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl p-6 hover:shadow-lg transition-all group">
                        <div className="w-12 h-12 bg-[#3E2A1F]/5 rounded-xl flex items-center justify-center text-[#3E2A1F] mb-4 group-hover:bg-[#D08C60] group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#3E2A1F] font-serif text-lg mb-2">Detailed Horoscope</h4>
                        <p className="text-sm text-[#8B5A2B] mb-6 min-h-[40px]">Full 50-page PDF covering Lagna, Divisional Charts, and Dashas.</p>
                        <button className="w-full py-3 border border-[#D08C60]/30 rounded-lg text-[#8B5A2B] font-bold text-xs uppercase tracking-widest hover:bg-[#D08C60] hover:text-white transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>

                    {/* Report Card 2 */}
                    <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl p-6 hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="absolute right-0 top-0 px-3 py-1 bg-[#D08C60] text-white text-[9px] font-black uppercase rounded-bl-xl">Premium</div>
                        <div className="w-12 h-12 bg-[#3E2A1F]/5 rounded-xl flex items-center justify-center text-[#3E2A1F] mb-4 group-hover:bg-[#D08C60] group-hover:text-white transition-colors">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#3E2A1F] font-serif text-lg mb-2">Yearly Progression</h4>
                        <p className="text-sm text-[#8B5A2B] mb-6 min-h-[40px]">Varshaphal analysis for the upcoming solar return year.</p>
                        <button className="w-full py-3 bg-[#3E2A1F] text-white rounded-lg shadow-md hover:bg-[#5A3E2B] transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest">
                            <Cpu className="w-4 h-4" /> Generate AI Report
                        </button>
                    </div>

                    {/* Report Card 3 */}
                    <div className="bg-[#FFFFFa] border border-[#D08C60]/20 rounded-2xl p-6 hover:shadow-lg transition-all group">
                        <div className="w-12 h-12 bg-[#3E2A1F]/5 rounded-xl flex items-center justify-center text-[#3E2A1F] mb-4 group-hover:bg-[#D08C60] group-hover:text-white transition-colors">
                            <Star className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#3E2A1F] font-serif text-lg mb-2">Gemstone Guide</h4>
                        <p className="text-sm text-[#8B5A2B] mb-6 min-h-[40px]">Detailed certification of suitable gemstones and wearing protocols.</p>
                        <button className="w-full py-3 border border-[#D08C60]/30 rounded-lg text-[#8B5A2B] font-bold text-xs uppercase tracking-widest hover:bg-[#D08C60] hover:text-white transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
