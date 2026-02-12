'use client';

import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import type { NormalizedTechnical } from '@/types/yoga.types';

interface YogaTechnicalDetailsProps {
    data: NormalizedTechnical;
}

export const YogaTechnicalDetails = memo(function YogaTechnicalDetails({ data }: YogaTechnicalDetailsProps) {
    return (
        <div className="bg-softwhite rounded-2xl p-5 border border-antique">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gold-primary" /> Analysis Engine
            </h3>

            {/* Critical Fixes */}
            {data.criticalFixes && data.criticalFixes.length > 0 && (
                <div className="space-y-2 mb-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar border-b border-antique/30 pb-4">
                    {data.criticalFixes.map((fix, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <span className="text-[9px] font-bold text-primary opacity-40 mt-0.5 shrink-0">0{i + 1}</span>
                            <p className="text-[11px] leading-tight text-primary font-medium group-hover:text-gold-dark transition-colors">{fix}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Technical Metadata */}
            <div className="grid grid-cols-2 gap-2">
                {data.ayanamsaValue && (
                    <div className="bg-parchment/50 border border-antique/50 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-primary opacity-50 uppercase tracking-tighter">Ayanamsa</span>
                        <span className="text-[10px] font-serif font-bold text-primary">{data.ayanamsaValue}</span>
                    </div>
                )}
                {data.houseSystem && (
                    <div className="bg-parchment/50 border border-antique/50 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-primary opacity-50 uppercase tracking-tighter">House System</span>
                        <span className="text-[10px] font-serif font-bold text-primary">{data.houseSystem}</span>
                    </div>
                )}
                {data.chartType && (
                    <div className="bg-parchment/50 border border-antique/50 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-primary opacity-50 uppercase tracking-tighter">Chart Type</span>
                        <span className="text-[10px] font-serif font-bold text-primary">{data.chartType}</span>
                    </div>
                )}
                {data.analysisType && (
                    <div className="bg-parchment/50 border border-antique/50 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-primary opacity-50 uppercase tracking-tighter">Analysis</span>
                        <span className="text-[10px] font-serif font-bold text-primary">{data.analysisType}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
