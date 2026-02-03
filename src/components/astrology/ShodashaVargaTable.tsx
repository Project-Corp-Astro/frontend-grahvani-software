"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ShodashaVargaTableProps {
    data: any;
    className?: string;
}

const VARGA_ORDER = [
    { key: 'D1', name: 'Janma' },
    { key: 'D2', name: 'Hora' },
    { key: 'D3', name: 'Dreshkana' },
    { key: 'D4', name: 'Chaturthamsha' },
    { key: 'D7', name: 'Saptamsha' },
    { key: 'D9', name: 'Navamsha' },
    { key: 'D10', name: 'Dashamsha' },
    { key: 'D12', name: 'Dwadashamsha' },
    { key: 'D16', name: 'Shodashamsha' },
    { key: 'D20', name: 'Vimshamsha' },
    { key: 'D24', name: 'Chaturvimshamsha' },
    { key: 'D27', name: 'Saptavimshamsha' },
    { key: 'D30', name: 'Trimshamsha' },
    { key: 'D40', name: 'Khavedamsha' },
    { key: 'D45', name: 'Akshavedamsha' },
    { key: 'D60', name: 'Shashtiamsha' }
];

const PLANET_ORDER = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const SIGN_ABBR: Record<string, string> = {
    'Aries': 'Ari',
    'Taurus': 'Tau',
    'Gemini': 'Gem',
    'Cancer': 'Can',
    'Leo': 'Leo',
    'Virgo': 'Vir',
    'Libra': 'Lib',
    'Scorpio': 'Sco',
    'Sagittarius': 'Sag',
    'Capricorn': 'Cap',
    'Aquarius': 'Aqu',
    'Pisces': 'Pis'
};

const getAbbr = (sign: string) => SIGN_ABBR[sign] || sign;

export default function ShodashaVargaTable({ data, className }: ShodashaVargaTableProps) {
    if (!data) return null;

    // Handle standard Lahiri format (shodasha_varga_summary) AND Raman/KP format (shodasha_varga_signs)
    const summary = data.shodasha_varga_summary || data.shodasha_varga_signs || data;

    // Helper to safely extract sign name from string or object { D1: { sign: "Aries" } }
    const getSignName = (planetData: any, vargaKey: string): string => {
        if (!planetData) return '-';

        const value = planetData[vargaKey];
        if (!value) return '-';

        // Check if value is object with 'sign' property (Raman/KP format)
        if (typeof value === 'object' && value.sign) {
            return value.sign;
        }

        // Assume string (Lahiri format)
        return String(value);
    };

    return (
        <div className={cn("mx-auto max-w-6xl overflow-x-auto rounded-[1.5rem] border border-antique bg-white shadow-xl", className)}>
            <div className="p-4 border-b border-copper-100 bg-gradient-to-r from-parchment/30 to-white">
                <h2 className="text-xl font-serif text-copper-900 font-bold text-center">Shodashvarga Summary</h2>
                <p className="text-[11px] text-copper-600 mt-0.5 text-center font-bold">Signs occupied by planets in Shodashvargas</p>
            </div>

            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-parchment/50 border-b border-antique">
                        <th className="p-1.5 px-3 text-[10px] font-black uppercase text-copper-900 border-r border-antique sticky left-0 bg-parchment/50 z-10 w-[110px]">
                            Varga
                        </th>
                        {PLANET_ORDER.map(p => (
                            <th key={p} className="p-1 px-2 text-center text-[10px] font-black uppercase text-copper-900 border-r border-antique/50 last:border-r-0">
                                {p === 'Ascendant' ? 'Lagna' : p}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {VARGA_ORDER.map((varga, idx) => (
                        <tr
                            key={varga.key}
                            className={cn(
                                "border-b border-antique/30 last:border-b-0 group hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-parchment/20"
                            )}
                        >
                            <td className="p-1.5 px-3 text-xs font-bold text-copper-900 border-r border-antique sticky left-0 bg-inherit group-hover:bg-inherit z-10">
                                {varga.name}
                            </td>
                            {PLANET_ORDER.map(p => {
                                const signName = getSignName(summary[p], varga.key);
                                return (
                                    <td
                                        key={p}
                                        className="p-1 text-center text-xs font-medium text-copper-950 border-r border-antique/20 last:border-r-0"
                                    >
                                        {getAbbr(signName)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="p-3 bg-parchment/5 border-t border-antique flex items-center justify-center gap-x-6 gap-y-2 flex-wrap">
                {Object.entries(SIGN_ABBR).map(([full, abbr]) => (
                    <div key={full} className="flex items-center gap-1.5 text-[10px] text-copper-600">
                        <span className="font-bold text-copper-900/70">{abbr}:</span>
                        <span className="opacity-80">{full}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
