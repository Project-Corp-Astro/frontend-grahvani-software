"use client";

import React from 'react';
import { Play, Volume2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface MantraFocusPanelProps {
    currentDasha: string;
    yantras: any[];
}

export default function MantraFocusPanel({ currentDasha, yantras }: MantraFocusPanelProps) {
    // We prioritize the current Dasha and the top recommendation
    const topRecommendation = yantras[0];

    return (
        <div className={cn("p-6 h-full backdrop-blur-md relative overflow-hidden", styles.glassPanel)}>
            <h3 className="text-sm font-medium mb-8" style={{ color: 'var(--text-muted)' }}>Today's Mantra Focus (Priority)</h3>

            <div className="space-y-8">
                {/* 1. High Priority: Dasha Period Mantras */}
                <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>1. High Priority: Dasha Period Mantras</h4>

                    <div className="border rounded-2xl p-5 relative overflow-hidden group transition-all duration-500" style={{ backgroundColor: 'rgba(255,255,255,0.4)', borderColor: 'var(--border-antique)' }}>
                        {/* Fake Waveform effect */}
                        <div className="absolute top-4 right-6 flex items-end gap-0.5 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none">
                            {[0.4, 0.7, 0.5, 0.9, 0.3, 0.6, 0.8, 0.5, 0.4, 0.7, 0.6].map((h, i) => (
                                <div key={i} className="w-[3px] rounded-full" style={{ height: `${h * 40}px`, backgroundColor: 'var(--gold-dark)' }} />
                            ))}
                        </div>

                        <div className="flex items-center gap-5 relative z-10">
                            <button className="w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-xl group-hover:scale-105" style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--border-antique)', color: 'var(--gold-dark)' }}>
                                <Play className="w-6 h-6 fill-current ml-1" />
                            </button>

                            <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{currentDasha} (Mahadasha)</p>
                                <h5 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>ॐ ब्रां ब्रीं ब्रों स: बुधाय नम:</h5>
                                <p className="text-[10px] italic" style={{ color: 'var(--text-body)' }}>Om Braam Breem Braum Sah Budhaya Namah | <span className="font-bold" style={{ color: 'var(--gold-dark)' }}>Goal: 108</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Priority Box */}
                    <div className="mt-4 border rounded-2xl p-5 group transition-all duration-500 cursor-pointer" style={{ backgroundColor: 'rgba(249, 115, 22, 0.05)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-all bg-white hover:text-orange-600" style={{ borderColor: 'var(--border-antique)', color: 'var(--text-muted)' }}>
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                </button>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">{topRecommendation.planet} (Recommended)</p>
                                    <h5 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>ॐ ह्रां ह्रीं ह्रों स: सूर्याय नम:</h5>
                                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Goal: 108 | <span className="text-orange-600 italic">*Best during Rahu Kaal*</span></p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[0.3, 0.6, 0.4, 0.8, 0.5].map((h, i) => (
                                    <div key={i} className="w-[2px] rounded-full" style={{ height: `${h * 20}px`, backgroundColor: 'var(--border-antique)' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional Footer Action */}
                <div className="pt-4">
                    <button className="w-full py-4 border rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-sm hover:shadow-md" style={{ background: 'linear-gradient(to right, rgba(201, 162, 77, 0.1), rgba(245, 158, 11, 0.1))', borderColor: 'var(--gold-primary)', color: 'var(--gold-dark)' }}>
                        Complete Practice
                    </button>
                </div>
            </div>
        </div>
    );
}
