"use client";

import React from 'react';
import { FileText, Download, Star, Moon, Heart, Clock, Zap } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function VedicReportsPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    const reports = [
        {
            title: "Executive Soul Synthesis",
            icon: Star,
            description: "A comprehensive AI-driven breakdown of natal potential and current planetary pressure points.",
            status: "Ready for Synthesis",
            premium: true
        },
        {
            title: "Karmic Debt Analysis",
            icon: History,
            description: "Deep dive into past life influences and remedial measures to balance the current incarnation.",
            status: "Requires Generation",
            premium: true
        },
        {
            title: "Temporal Path (Dashas)",
            icon: Clock,
            description: "Minute-by-minute timeline of life events for the next decade based on Vimshottari calculations.",
            status: "Active",
            premium: false
        },
        {
            title: "Relational Synastry",
            icon: Heart,
            description: "Compatibility analysis for professional and personal unions using 8-fold Guna matching.",
            status: "On-demand",
            premium: true
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFFFFF]/40 to-transparent border-l-4 border-[#D08C60] p-10 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                    <FileText className="w-8 h-8 text-[#D08C60]" />
                    <h1 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">Report Lab</h1>
                </div>
                <p className="text-[#5A3E2B]/80 italic font-serif text-lg max-w-2xl">
                    Channel cosmic insights into structured professional documentation for {clientDetails.name}.
                </p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reports.map((report, index) => (
                    <div key={index} className="group relative bg-[#FFFFFF]/40 border border-[#D08C60]/10 rounded-[2.5rem] p-10 hover:border-[#D08C60]/50 transition-all shadow-lg hover:shadow-xl overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D08C60]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#D08C60]/10 border border-[#D08C60]/20 flex items-center justify-center text-[#D08C60] group-hover:scale-110 transition-transform">
                                <report.icon className="w-8 h-8" />
                            </div>
                            {report.premium && (
                                <div className="px-4 py-2 bg-[#D08C60]/10 border border-[#D08C60]/30 rounded-full">
                                    <span className="text-[10px] font-black text-[#D08C60] uppercase tracking-widest">Premium AI</span>
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-serif font-black text-[#3E2A1F] mb-4 relative z-10">{report.title}</h3>
                        <p className="text-[#5A3E2B]/70 font-serif leading-relaxed mb-10 relative z-10">{report.description}</p>

                        <button className="w-full py-5 bg-[#3E2A1F]/5 group-hover:bg-[#D08C60] border border-[#3E2A1F]/5 group-hover:translate-y-[-4px] transition-all rounded-2xl flex items-center justify-center gap-3 relative z-10 overflow-hidden">
                            <Zap className="w-4 h-4 text-[#D08C60] group-hover:text-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E2A1F]/60 group-hover:text-white">
                                Draft Synthesis
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { History } from 'lucide-react';
