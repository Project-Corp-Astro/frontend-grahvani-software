"use client";

import React from 'react';
import type { KpHouseSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';

interface HouseSignificatorsTableProps {
    data: KpHouseSignification[];
    className?: string;
}

export default function HouseSignificatorsTable({ data, className }: HouseSignificatorsTableProps) {
    const houseNames = [
        "First", "Second", "Third", "Fourth", "Fifth", "Sixth",
        "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"
    ];

    const formatPlanets = (planets: string[]) => {
        if (!planets || planets.length === 0) return '';
        // Map short names if needed, or use as is. Reference uses 'Sa', 'Su'. 
        // The API returns full names usually ("Sun"). We can shorten them.
        return planets.map(p => p.substring(0, 2)).join(', ');
    };

    return (
        <div className={cn("w-full overflow-hidden bg-white/50 dark:bg-neutral-900/50 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm", className)}>
            <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border-b border-stone-200 dark:border-stone-800">
                <h3 className="text-lg font-serif font-bold text-center text-red-800 dark:text-red-400">
                    Significations of the Houses
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-amber-100/50 dark:bg-amber-900/20 text-stone-900 dark:text-stone-300">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700 w-32">
                                House
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700">
                                Planets in nak. of occupants
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700">
                                Occupants
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700">
                                Planets in nak. of cusp sign lord
                            </th>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700">
                                Cusp sign lord
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                        {data.map((row) => (
                            <tr key={row.house} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
                                <th scope="row" className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                                    {row.house}. {houseNames[row.house - 1]}
                                </th>
                                <td className="px-6 py-4 text-stone-700 dark:text-stone-300">
                                    {formatPlanets(row.levelB)}
                                </td>
                                <td className="px-6 py-4 text-stone-700 dark:text-stone-300">
                                    {formatPlanets(row.levelA)}
                                </td>
                                <td className="px-6 py-4 text-stone-700 dark:text-stone-300">
                                    {formatPlanets(row.levelD)}
                                </td>
                                <td className="px-6 py-4 text-stone-700 dark:text-stone-300">
                                    {formatPlanets(row.levelC)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
