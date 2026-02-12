'use client';

import React, { memo } from 'react';
import { Crown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RajYogasData } from '@/types/yoga.types';

interface YogaRajYogasProps {
    data: RajYogasData;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    'Very Strong': { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-700' },
    'Strong': { bg: 'bg-gold-primary', text: 'text-primary', border: 'border-gold-dark' },
    'Moderate': { bg: 'bg-parchment', text: 'text-primary', border: 'border-antique' },
};

export const YogaRajYogas = memo(function YogaRajYogas({ data }: YogaRajYogasProps) {
    const { yogas, totalCount, averageStrength, typeDistribution } = data;

    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-5">
            <h3 className="font-serif font-bold text-primary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Crown className="w-4 h-4 text-gold-primary" /> Raj Yogas Found
            </h3>

            {/* Summary Strip */}
            <div className="flex items-center gap-4 flex-wrap bg-white rounded-xl border border-antique/50 p-3 mb-4">
                <div className="text-center px-3">
                    <span className="block text-lg font-serif font-bold text-gold-dark">{totalCount}</span>
                    <span className="text-[8px] font-bold text-primary opacity-60 uppercase tracking-wider">Total</span>
                </div>
                <div className="w-px h-8 bg-antique/50" />
                <div className="text-center px-3">
                    <span className="block text-lg font-serif font-bold text-primary">{averageStrength.toFixed(1)}</span>
                    <span className="text-[8px] font-bold text-primary opacity-60 uppercase tracking-wider">Avg Strength</span>
                </div>
                {typeDistribution && (
                    <>
                        <div className="w-px h-8 bg-antique/50" />
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(typeDistribution).map(([type, count]) => (
                                <span key={type} className="px-2 py-0.5 bg-parchment text-primary border border-antique rounded-full text-[9px] font-bold">
                                    {type}: {count}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Individual Raj Yogas */}
            <div className="space-y-3">
                {yogas.map((yoga, i) => {
                    const ps = PRIORITY_STYLES[yoga.priority] ?? PRIORITY_STYLES.Moderate;

                    return (
                        <div
                            key={i}
                            className="flex flex-col bg-white rounded-xl border border-antique/50 p-4 hover:border-gold-primary/30 transition-colors"
                        >
                            {/* Header Row */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-gold-primary/10 text-gold-dark flex items-center justify-center text-[10px] font-black">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-primary">{yoga.type}</span>
                                        {yoga.subtype && (
                                            <span className="text-[9px] text-primary opacity-60 ml-1.5">• {yoga.subtype}</span>
                                        )}
                                    </div>
                                </div>
                                <span className={cn(
                                    'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                                    ps.bg, ps.text, ps.border
                                )}>
                                    {yoga.priority}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-[11px] text-primary leading-relaxed mb-2 pl-8">{yoga.description}</p>

                            {/* Detail Chips */}
                            <div className="flex flex-wrap gap-1.5 pl-8">
                                {yoga.planets.map(planet => (
                                    <span key={planet} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-bold">
                                        {planet}
                                    </span>
                                ))}
                                {yoga.houses.map(house => (
                                    <span key={house} className="px-2 py-0.5 bg-parchment text-primary border border-antique rounded text-[9px] font-bold">
                                        H{house}
                                    </span>
                                ))}
                                <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark border border-gold-primary/20 rounded text-[9px] font-bold">
                                    {yoga.strength}%
                                </span>
                                {yoga.formation && (
                                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded text-[9px] font-bold capitalize">
                                        <ChevronRight className="w-2 h-2" />
                                        {yoga.formation.replace(/_/g, ' ')}
                                    </span>
                                )}
                            </div>

                            {/* Cancellations */}
                            {yoga.cancellations.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                                    {yoga.cancellations.map((cancel, ci) => (
                                        <span
                                            key={ci}
                                            className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[9px] font-bold capitalize"
                                        >
                                            ⚠ {cancel.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
