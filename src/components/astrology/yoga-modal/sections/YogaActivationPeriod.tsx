'use client';

import React, { memo } from 'react';
import { Zap } from 'lucide-react';
import type { NormalizedTiming } from '@/types/yoga.types';

interface YogaActivationPeriodProps {
    data: NormalizedTiming;
}

export const YogaActivationPeriod = memo(function YogaActivationPeriod({ data }: YogaActivationPeriodProps) {
    const timelineItems = [
        data.bestPeriods && { label: 'Primary Dasha Periods', value: data.bestPeriods },
        data.activationTransits && { label: 'Transit Triggers', value: data.activationTransits },
        data.peakEffects && { label: 'Peak Effects', value: data.peakEffects },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-5">
            <h3 className="font-serif font-bold text-primary mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Zap className="w-4 h-4 text-gold-primary" /> Activation Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline */}
                {timelineItems.length > 0 && (
                    <div className="space-y-4">
                        {timelineItems.map((item, i) => (
                            <div key={i} className="relative pl-5 border-l-2 border-gold-primary/20">
                                <div className="absolute w-2.5 h-2.5 bg-gold-primary rounded-full -left-[6px] top-1 border-2 border-softwhite" style={{ opacity: 1 - i * 0.2 }} />
                                <h4 className="text-[10px] font-bold text-primary opacity-60 uppercase mb-1">{item.label}</h4>
                                <p className="text-xs text-primary leading-relaxed">{item.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Remedial Timing */}
                {data.remedialTiming && (
                    <div className="p-4 bg-copper-900/5 rounded-xl border border-copper-900/10">
                        <h4 className="text-xs font-serif font-bold text-primary mb-2">Golden Timing</h4>
                        <p className="text-[11px] text-primary leading-relaxed italic opacity-80">
                            &ldquo;{data.remedialTiming}&rdquo;
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});
