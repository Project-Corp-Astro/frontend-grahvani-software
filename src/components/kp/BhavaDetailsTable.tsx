"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpBhavaRaw } from '@/types/kp.types';
import { Sparkles } from 'lucide-react';

interface BhavaDetailsTableProps {
    bhavaDetails: Record<string, KpBhavaRaw>;
    className?: string;
}

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const houseNames: Record<string, string> = {
    '1': 'First House', '2': 'Second House', '3': 'Third House', '4': 'Fourth House',
    '5': 'Fifth House', '6': 'Sixth House', '7': 'Seventh House', '8': 'Eighth House',
    '9': 'Ninth House', '10': 'Tenth House', '11': 'Eleventh House', '12': 'Twelfth House'
};

/**
 * KP Bhava Details Table
 * Displays detailed house cusps with lords (RL, NL, SL, SS)
 */
export default function BhavaDetailsTable({ bhavaDetails, className }: BhavaDetailsTableProps) {
    if (!bhavaDetails || Object.keys(bhavaDetails).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                <p>No bhava details available for this chart</p>
            </div>
        );
    }

    // Sort keys to ensure 1-12 order
    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("overflow-hidden", className)}>
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h3 className="font-serif font-bold text-xl text-ink">Bhava Chalit Details</h3>
                    <p className="text-xs text-muted uppercase tracking-wider mt-1">KP System Cusp Coordinates</p>
                </div>
                <div className="px-3 py-1 bg-gold-primary/10 rounded-full border border-gold-primary/20">
                    <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-widest">Placidus / KP</span>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-antique/50">
                <table className="w-full text-sm border-collapse bg-white/50">
                    <thead>
                        <tr className="bg-gradient-to-r from-parchment to-softwhite border-b border-antique">
                            <th className="py-4 px-4 text-left font-serif font-bold text-ink w-32">House</th>
                            <th className="py-4 px-4 text-left font-serif font-bold text-ink">Sign & Degree</th>
                            <th className="py-4 px-4 text-left font-serif font-bold text-ink">Nakshatra</th>
                            <th className="py-4 px-4 text-center font-serif font-bold text-ink w-16">Pada</th>
                            <th className="py-4 px-4 text-center font-serif font-bold text-gold-dark w-14" title="Rashi Lord">RL</th>
                            <th className="py-4 px-4 text-center font-serif font-bold text-gold-dark w-14" title="Nakshatra Lord">NL</th>
                            <th className="py-4 px-4 text-center font-serif font-bold text-gold-dark w-14" title="Sub Lord">SL</th>
                            <th className="py-4 px-4 text-center font-serif font-bold text-gold-dark w-14" title="Sub-Sub Lord">SS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/30">
                        {sortedKeys.map((key) => {
                            const bhava = bhavaDetails[key];
                            const isAngular = ['1', '4', '7', '10'].includes(key);

                            return (
                                <tr
                                    key={key}
                                    className={cn(
                                        "transition-colors hover:bg-gold-primary/5",
                                        isAngular ? "bg-softwhite/50" : "bg-transparent"
                                    )}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-serif font-semibold text-ink text-base">
                                                {key}<sup className="text-[10px] ml-0.5">H</sup>
                                            </span>
                                            <span className="text-[10px] text-muted hidden sm:inline-block opacity-70">
                                                {houseNames[key].replace(' House', '')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-parchment border border-antique text-lg text-ink font-serif"
                                                title={bhava.sign}
                                            >
                                                {signSymbols[bhava.sign] || ''}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-ink leading-tight">{bhava.sign}</span>
                                                <span className="font-mono text-xs text-muted/80 leading-tight">
                                                    {bhava.longitude_dms.replace(/["]/g, '')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-ink font-medium">
                                        {bhava.nakshatra}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-antique text-xs font-serif text-ink">
                                            {bhava.pada}
                                        </span>
                                    </td>
                                    {['RL', 'NL', 'SL', 'SS'].map((lordType) => (
                                        <td key={lordType} className="py-3 px-4 text-center">
                                            <span className={cn(
                                                "font-medium text-sm",
                                                // Highlight strong significators? For now simple logic
                                                lordType === 'SL' ? "text-red-700 font-bold" : "text-ink"
                                            )}>
                                                {/* @ts-ignore - dynamic access */}
                                                {(bhava[lordType] || '-').slice(0, 2)}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex justify-end gap-4 text-[10px] text-muted">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold-dark/60"></span>
                    <span>RL: Rashi Lord</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold-dark/60"></span>
                    <span>NL: Nakshatra Lord</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-700/60"></span>
                    <span>SL: Sub Lord</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold-dark/60"></span>
                    <span>SS: Sub-Sub Lord</span>
                </div>
            </div>
        </div>
    );
}
