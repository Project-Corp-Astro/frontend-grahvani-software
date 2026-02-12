'use client';

import React, { memo } from 'react';
import { CheckCircle2, Stars, ChevronDown } from 'lucide-react';
import type { NormalizedRemedyCategory } from '@/types/yoga.types';

type RemedyData = string[] | NormalizedRemedyCategory[];

interface YogaRemediesProps {
    data: RemedyData;
}

/** Type guard: is it a categorized remedy list? */
function isCategorized(data: RemedyData): data is NormalizedRemedyCategory[] {
    return data.length > 0 && typeof data[0] === 'object' && 'category' in data[0];
}

const CATEGORY_ICONS: Record<string, string> = {
    'Immediate Actions': '🔥',
    'Weekly Practices': '📅',
    'Monthly Rituals': '🌕',
    'Gemstone Recommendations': '💎',
    'Lifestyle Changes': '🌿',
};

export const YogaRemedies = memo(function YogaRemedies({ data }: YogaRemediesProps) {
    if (data.length === 0) return null;

    // ─── Categorized Remedies (daridra-style) ──────────────
    if (isCategorized(data)) {
        return (
            <div className="bg-parchment border border-antique rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Stars className="w-14 h-14 text-gold-primary" />
                </div>

                <h3 className="text-sm font-serif font-bold text-primary mb-4">Empowering Remedies</h3>

                <div className="space-y-4">
                    {data.map((cat, ci) => (
                        <details key={ci} open={ci === 0}>
                            <summary className="cursor-pointer select-none flex items-center gap-2 text-xs font-bold text-gold-dark hover:text-gold-primary transition-colors group">
                                <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                                <span>{CATEGORY_ICONS[cat.category] ?? '✦'} {cat.category}</span>
                                <span className="text-[9px] text-primary opacity-60 ml-auto">{cat.items.length} items</span>
                            </summary>
                            <div className="flex flex-wrap gap-2 mt-2 pl-5">
                                {cat.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 px-3 py-1.5 bg-white border border-antique rounded-xl shadow-sm hover:border-gold-primary transition-colors cursor-default"
                                    >
                                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-[11px] font-medium text-primary leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        );
    }

    // ─── Flat Remedies (original style) ──────────────────────
    const flatData = data as string[];
    return (
        <div className="bg-parchment border border-antique rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Stars className="w-14 h-14 text-gold-primary" />
            </div>

            <h3 className="text-sm font-serif font-bold text-primary mb-3">Empowering Remedies</h3>

            <div className="flex flex-wrap gap-2">
                {flatData.map((remedy, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-antique rounded-xl shadow-sm hover:border-gold-primary transition-colors cursor-default"
                    >
                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        <span className="text-[11px] font-medium text-primary">{remedy}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});
