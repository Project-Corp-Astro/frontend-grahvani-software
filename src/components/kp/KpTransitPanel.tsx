"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Globe, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

interface TransitPlanet {
    name: string;
    sign: string;
    degree: string;
    nakshatra: string;
    starLord: string;
    isRetrograde?: boolean;
    transitHouse?: number;
    impact?: 'favorable' | 'unfavorable' | 'neutral';
}

interface KpTransitPanelProps {
    transitPlanets?: TransitPlanet[];
    transitDate?: string;
    className?: string;
}

// Placeholder transit data
const PLACEHOLDER_TRANSITS: TransitPlanet[] = [
    { name: 'Sun', sign: 'Aquarius', degree: '06° 12\' 34"', nakshatra: 'Shatabhisha', starLord: 'Rahu', transitHouse: 4, impact: 'neutral' },
    { name: 'Moon', sign: 'Cancer', degree: '18° 45\' 12"', nakshatra: 'Ashlesha', starLord: 'Mercury', transitHouse: 9, impact: 'favorable' },
    { name: 'Mars', sign: 'Gemini', degree: '22° 30\' 08"', nakshatra: 'Punarvasu', starLord: 'Jupiter', transitHouse: 8, impact: 'unfavorable' },
    { name: 'Mercury', sign: 'Capricorn', degree: '28° 55\' 41"', nakshatra: 'Dhanishta', starLord: 'Mars', transitHouse: 3, impact: 'favorable' },
    { name: 'Jupiter', sign: 'Taurus', degree: '14° 22\' 15"', nakshatra: 'Rohini', starLord: 'Moon', isRetrograde: false, transitHouse: 7, impact: 'favorable' },
    { name: 'Venus', sign: 'Pisces', degree: '09° 18\' 52"', nakshatra: 'Uttarabhadra', starLord: 'Saturn', transitHouse: 5, impact: 'favorable' },
    { name: 'Saturn', sign: 'Aquarius', degree: '24° 08\' 33"', nakshatra: 'Purva Bhadra', starLord: 'Jupiter', transitHouse: 4, impact: 'neutral' },
    { name: 'Rahu', sign: 'Pisces', degree: '01° 42\' 19"', nakshatra: 'Purva Bhadra', starLord: 'Jupiter', transitHouse: 5, impact: 'unfavorable' },
    { name: 'Ketu', sign: 'Virgo', degree: '01° 42\' 19"', nakshatra: 'Uttara Phalguni', starLord: 'Sun', transitHouse: 11, impact: 'favorable' },
];

/**
 * KP Transit View Panel
 * Shows current transit positions with KP Star Lord / impact analysis
 */
export default function KpTransitPanel({
    transitPlanets = PLACEHOLDER_TRANSITS,
    transitDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    className,
}: KpTransitPanelProps) {

    const impactIcon = (impact?: string) => {
        switch (impact) {
            case 'favorable': return <ArrowUp className="w-3 h-3 text-emerald-600" />;
            case 'unfavorable': return <ArrowDown className="w-3 h-3 text-red-500" />;
            default: return <Minus className="w-3 h-3 text-muted-refined" />;
        }
    };

    const impactBgClass = (impact?: string) => {
        switch (impact) {
            case 'favorable': return 'bg-emerald-50/50 border-emerald-200/50';
            case 'unfavorable': return 'bg-red-50/30 border-red-200/30';
            default: return '';
        }
    };

    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif text-primary flex items-center gap-2 font-semibold">
                    <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                        <Globe className="w-3.5 h-3.5 text-gold-dark" />
                    </div>
                    Transit Positions
                </h3>
                <span className="text-xs text-muted-refined font-sans">{transitDate}</span>
            </div>

            {/* Transit Impact Summary */}
            <div className="flex items-center gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50/50 border border-emerald-200/50 rounded">
                    <ArrowUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">
                        {transitPlanets.filter(p => p.impact === 'favorable').length} Favorable
                    </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50/30 border border-red-200/30 rounded">
                    <ArrowDown className="w-3 h-3 text-red-500" />
                    <span className="text-red-600 font-medium">
                        {transitPlanets.filter(p => p.impact === 'unfavorable').length} Adverse
                    </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-parchment border border-antique rounded">
                    <Minus className="w-3 h-3 text-muted-refined" />
                    <span className="text-muted-refined font-medium">
                        {transitPlanets.filter(p => p.impact === 'neutral').length} Neutral
                    </span>
                </div>
            </div>

            {/* Transit Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-antique">
                            <th className="py-2 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Planet</th>
                            <th className="py-2 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Sign</th>
                            <th className="py-2 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Degree</th>
                            <th className="py-2 px-3 text-left text-[10px] uppercase tracking-widest text-muted-refined font-bold">Nakshatra</th>
                            <th className="py-2 px-3 text-left text-[10px] uppercase tracking-widest text-gold-dark font-bold">Star Lord</th>
                            <th className="py-2 px-3 text-center text-[10px] uppercase tracking-widest text-muted-refined font-bold">House</th>
                            <th className="py-2 px-3 text-center text-[10px] uppercase tracking-widest text-muted-refined font-bold">Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transitPlanets.map((planet, idx) => (
                            <tr
                                key={planet.name}
                                className={cn(
                                    "border-b border-antique/30 hover:bg-gold-primary/5 transition-colors",
                                    idx % 2 === 0 ? "bg-white/50" : "bg-softwhite",
                                    impactBgClass(planet.impact)
                                )}
                            >
                                <td className="py-2 px-3">
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-base">{planetEmojis[planet.name] || '●'}</span>
                                        <span className="font-serif font-bold text-primary text-xs">{planet.name}</span>
                                        {planet.isRetrograde && (
                                            <span className="text-red-500 text-[9px] font-bold">R</span>
                                        )}
                                    </span>
                                </td>
                                <td className="py-2 px-3 text-xs text-secondary">{planet.sign}</td>
                                <td className="py-2 px-3 font-mono text-[11px] text-muted-refined">{planet.degree}</td>
                                <td className="py-2 px-3 text-xs text-secondary">{planet.nakshatra}</td>
                                <td className="py-2 px-3">
                                    <span className="px-2 py-0.5 bg-gold-primary/15 text-gold-dark rounded font-semibold text-xs">
                                        {planet.starLord}
                                    </span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-parchment border border-antique text-xs font-bold text-secondary">
                                        {planet.transitHouse}
                                    </span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                    {impactIcon(planet.impact)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
