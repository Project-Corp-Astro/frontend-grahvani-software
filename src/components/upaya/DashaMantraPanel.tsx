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
        <div className={cn("p-6 h-full relative overflow-hidden", styles.glassPanel)}>
            <h3 className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>Mantra Sadhana Focus (Dasha Period)</h3>

            <div className="space-y-6">
                {mantras.map((mantra, idx) => (
                    <div key={idx} className="relative group">
                        {idx > 0 && <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--border-divider)' }} />}

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Graphic / Play Button Area */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-2xl border flex items-center justify-center relative overflow-hidden transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'var(--border-antique)' }}>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)' }} />
                                    {mantra.type === 'Mahadasha' ? (
                                        <Crown className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                                    ) : (
                                        <Sparkles className="w-6 h-6" style={{ color: 'var(--gold-primary)' }} />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: 'rgba(201, 162, 77, 0.2)', color: 'var(--gold-dark)' }}>
                                                {mantra.type} Lord
                                            </span>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
                                                {mantra.remaining_years.toFixed(1)} Yrs Left
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{mantra.planet}</h3>
                                    </div>
                                    <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg group-hover:scale-105" style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--border-antique)', color: 'var(--text-muted)' }}>
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    </button>
                                </div>

                                <div className="rounded-xl p-4 border relative transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}>
                                    <p className="text-lg font-serif mb-2 leading-relaxed tracking-wide" style={{ color: 'var(--ink)' }}>
                                        {mantra.mantra.sanskrit}
                                    </p>
                                    <p className="text-sm italic font-medium mb-3" style={{ color: 'var(--text-body)' }}>
                                        "{mantra.mantra.transliteration}"
                                    </p>

                                    <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border-divider)' }}>
                                        <div className="flex items-center gap-1.5">
                                            <Repeat className="w-3 h-3" style={{ color: 'var(--gold-dark)' }} />
                                            <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{mantra.daily_count} <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Daily</span></span>
                                        </div>
                                        <div className="h-3 w-px" style={{ backgroundColor: 'var(--border-divider)' }} />
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-purple-600" />
                                            <span className="text-[10px] font-medium uppercase tracking-wide truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{mantra.mantra.meaning}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashaMantraPanel;
