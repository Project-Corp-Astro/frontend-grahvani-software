"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Flame,
    Play,
    Repeat,
    Clock,
    Crown,
    Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface MantraInfo {
    sanskrit: string;
    transliteration: string;
    meaning: string;
}

interface DashaMantra {
    type: string;
    planet: string;
    mantra: MantraInfo;
    priority: string;
    daily_count: number;
    remaining_years: number;
}

interface DashaMantraPanelProps {
    mantras: DashaMantra[];
}

const DashaMantraPanel: React.FC<DashaMantraPanelProps> = ({ mantras }) => {
    return (
        <div className={cn("p-6 h-full relative overflow-hidden flex flex-col", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-8">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ink)' }}>Primary Mantra Sadhana</h3>
            </div>

            <div className="space-y-8 flex-1">
                {mantras.map((mantra, idx) => (
                    <div key={idx} className="relative group">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Graphic / Planet Identifier */}
                            <div className="flex-shrink-0 flex md:flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-3xl border flex items-center justify-center relative overflow-hidden transition-all group-hover:shadow-md group-hover:scale-105 bg-white/50 border-antique/30">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gold-primary/10" />
                                    {mantra.type.includes('Maha') ? (
                                        <Crown className="w-7 h-7 text-amber-600" />
                                    ) : (
                                        <Sparkles className="w-7 h-7 text-indigo-500" />
                                    )}
                                </div>
                                <div className="md:text-center">
                                    <h4 className="text-xl font-black tracking-tighter" style={{ color: 'var(--ink)' }}>{mantra.planet}</h4>
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Lord</span>
                                </div>
                            </div>

                            {/* Mantra Content Area */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border bg-amber-50/50 border-amber-200/50 text-amber-700">
                                            {mantra.type}
                                        </span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/5 text-slate-500">
                                            {mantra.remaining_years.toFixed(1)}y Remaining
                                        </span>
                                    </div>
                                    <button className="w-9 h-9 rounded-full border flex items-center justify-center transition-all bg-white border-antique/40 text-antique hover:bg-gold-primary/10 hover:text-gold-dark hover:scale-110 shadow-sm">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </button>
                                </div>

                                <div className="rounded-2xl p-5 border relative transition-all group-hover:bg-white/40 bg-white/20 border-antique/20 shadow-sm">
                                    <div className="mb-4">
                                        <p className="text-2xl font-serif mb-2 leading-tight tracking-wide" style={{ color: 'var(--ink)' }}>
                                            {mantra.mantra.sanskrit}
                                        </p>
                                        <p className="text-xs italic font-semibold tracking-tight" style={{ color: 'var(--text-body)' }}>
                                            {mantra.mantra.transliteration}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5 pt-4 border-t border-antique/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                                                <Repeat className="w-2.5 h-2.5 text-orange-600" />
                                            </div>
                                            <span className="text-[10px] font-black" style={{ color: 'var(--ink)' }}>{mantra.daily_count} <span className="ml-0.5">DLY</span></span>
                                        </div>
                                        <div className="h-4 w-px bg-antique/10" />
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                                            </div>
                                            <span className="text-[10px] font-bold truncate" style={{ color: 'var(--text-body)' }}>{mantra.mantra.meaning}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Inscription */}
            <div className="mt-8 pt-4 border-t border-antique/20 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Vibrational Alignment Protocol</p>
            </div>
        </div>
    );
};

export default DashaMantraPanel;
