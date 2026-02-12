'use client';

import React, { memo } from 'react';
import { Info } from 'lucide-react';
import type { NormalizedDescription } from '@/types/yoga.types';

interface YogaDescriptionProps {
    data: NormalizedDescription;
}

export const YogaDescription = memo(function YogaDescription({ data }: YogaDescriptionProps) {
    return (
        <div className="bg-softwhite border border-antique rounded-2xl p-5">
            <h3 className="font-serif font-bold text-primary mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Info className="w-4 h-4 text-gold-primary" /> Analysis
            </h3>
            <p className="text-xs text-primary leading-relaxed">{data.text}</p>
            {data.explanation && data.text !== data.explanation && (
                <div className="mt-3 p-3 bg-parchment/50 rounded-xl border border-antique/50 italic text-[11px] leading-relaxed text-primary opacity-80">
                    &ldquo;{data.explanation}&rdquo;
                </div>
            )}
        </div>
    );
});
