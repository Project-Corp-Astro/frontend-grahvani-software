'use client';

import React, { memo } from 'react';
import { Stars, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedDoshaRemedy } from '@/types/dosha.types';

interface DoshaRemediesProps {
    data: NormalizedDoshaRemedy[];
}

export const DoshaRemedies = memo(function DoshaRemedies({ data }: DoshaRemediesProps) {
    if (data.length === 0) return null;

    const categories = {
        mantra: data.filter(r => r.type === 'mantra'),
        ritual: data.filter(r => r.type === 'ritual' || r.type === 'general'),
        lifestyle: data.filter(r => r.type === 'lifestyle'),
    };

    return (
        <div className="bg-parchment border border-antique rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 duration-700">
                <Stars className="w-16 h-16 text-red-500" />
            </div>

            <h3 className="text-lg font-serif font-black text-ink mb-6 flex items-center gap-2">
                Empowering Measures <span className="text-secondary">& Remedies</span>
            </h3>

            <div className="space-y-6">
                {Object.entries(categories).map(([key, items]) => (
                    items.length > 0 && (
                        <div key={key} className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary flex items-center gap-2 mb-2">
                                <Sparkles className="w-3 h-3 text-red-400" /> {key} Instructions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {items.map((remedy, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-antique rounded-xl shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-default group/item"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover/item:scale-110 transition-transform" />
                                        <span className="text-[11px] font-medium text-primary">{remedy.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
});
