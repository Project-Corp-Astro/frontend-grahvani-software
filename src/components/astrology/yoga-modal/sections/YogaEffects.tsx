'use client';

import React, { memo } from 'react';
import { Target } from 'lucide-react';
import type { NormalizedEffects } from '@/types/yoga.types';

interface YogaEffectsProps {
    data: NormalizedEffects;
}

export const YogaEffects = memo(function YogaEffects({ data }: YogaEffectsProps) {
    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-5">
            <h3 className="font-serif font-bold text-primary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Target className="w-4 h-4 text-gold-primary" /> Effects & Impacts
            </h3>

            {data.specific.length > 0 && (
                <div className="space-y-2.5 mb-4">
                    {data.specific.map((effect, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <div className="p-1 px-1.5 bg-gold-primary/20 text-primary rounded-md text-[10px] font-bold mt-0.5 group-hover:bg-gold-primary group-hover:text-white transition-colors shrink-0">
                                0{i + 1}
                            </div>
                            <p className="text-xs text-primary leading-relaxed capitalize">
                                {effect.replace(/_/g, ' ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {data.overall && (
                <div className="p-3 bg-parchment/50 rounded-xl border border-antique/50 italic text-[11px] leading-relaxed text-primary opacity-80">
                    &ldquo;{data.overall}&rdquo;
                </div>
            )}
        </div>
    );
});
