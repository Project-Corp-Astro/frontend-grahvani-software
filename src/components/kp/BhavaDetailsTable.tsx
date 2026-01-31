"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpBhavaRaw } from '@/types/kp.types';

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
    '1': 'First', '2': 'Second', '3': 'Third', '4': 'Fourth',
    '5': 'Fifth', '6': 'Sixth', '7': 'Seventh', '8': 'Eighth',
    '9': 'Ninth', '10': 'Tenth', '11': 'Eleventh', '12': 'Twelfth'
};

/**
 * KP Bhava Details Table
 * Displays detailed house cusps with lords (RL, NL, SL, SS)
 */
export default function BhavaDetailsTable({ bhavaDetails, className }: BhavaDetailsTableProps) {
    if (!bhavaDetails || Object.keys(bhavaDetails).length === 0) {
        return (
            <div className="text-center py-8 text-muted text-sm">
                No bhava details available
            </div>
        );
    }

    // Sort keys to ensure 1-12 order
    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("overflow-x-auto", className)}>
            <div className="mb-4 text-center">
                <h3 className="font-serif font-bold text-xl text-red-900">Bhava Details (KP System)</h3>
            </div>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-black/80">
                        <th className="py-2 px-3 text-left font-bold text-black w-24">House cusp</th>
                        <th className="py-2 px-3 text-left font-bold text-black w-20">Sign</th>
                        <th className="py-2 px-3 text-left font-bold text-black">Degree</th>
                        <th className="py-2 px-3 text-left font-bold text-black">Nakshatra</th>
                        <th className="py-2 px-3 text-center font-bold text-black w-12">Pada</th>
                        <th className="py-2 px-3 text-center font-bold text-black w-12">RL</th>
                        <th className="py-2 px-3 text-center font-bold text-black w-12">NL</th>
                        <th className="py-2 px-3 text-center font-bold text-black w-12">SL</th>
                        <th className="py-2 px-3 text-center font-bold text-black w-12">SS</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedKeys.map((key) => {
                        const bhava = bhavaDetails[key];
                        return (
                            <tr
                                key={key}
                                className="hover:bg-gold-primary/5 transition-colors border-b border-gray-200"
                            >
                                <td className="py-2 px-3 text-ink font-medium">
                                    {key}. {houseNames[key] || ''}
                                </td>
                                <td className="py-2 px-3 text-ink">
                                    <span className="flex items-center gap-1">
                                        <span>{bhava.sign.slice(0, 3)}</span>
                                    </span>
                                </td>
                                <td className="py-2 px-3 font-mono text-xs text-ink">
                                    {bhava.longitude_dms.replace(/["]/g, '')}
                                </td>
                                <td className="py-2 px-3 text-ink">
                                    {bhava.nakshatra}
                                </td>
                                <td className="py-2 px-3 text-center text-ink">
                                    {bhava.pada}
                                </td>
                                <td className="py-2 px-3 text-center text-ink font-medium">
                                    {bhava.RL.slice(0, 2)}
                                </td>
                                <td className="py-2 px-3 text-center text-ink font-medium">
                                    {bhava.NL.slice(0, 2)}
                                </td>
                                <td className="py-2 px-3 text-center text-ink font-medium">
                                    {bhava.SL.slice(0, 2)}
                                </td>
                                <td className="py-2 px-3 text-center text-ink font-medium">
                                    {bhava.SS.slice(0, 2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
