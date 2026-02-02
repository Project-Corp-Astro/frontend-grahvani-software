"use client";

import React from 'react';
import type { KpSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';

interface SignificationMatrixProps {
    significations: KpSignification[];
    className?: string;
}

export default function SignificationMatrix({ significations, className }: SignificationMatrixProps) {
    // Helper to format house list
    const formatHouses = (houses: number[] | undefined) => {
        if (!houses || houses.length === 0) return '';
        return houses.join('  ');
    };

    return (
        <div className={cn("w-full overflow-hidden bg-white/50 dark:bg-neutral-900/50 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm", className)}>
            <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border-b border-stone-200 dark:border-stone-800">
                <h3 className="text-lg font-serif font-bold text-center text-stone-800 dark:text-stone-200">
                    Houses Signified by Planets
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-amber-100/50 dark:bg-amber-900/20 text-stone-600 dark:text-stone-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-bold border-b border-stone-200 dark:border-stone-700">
                                Planet
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-stone-200 dark:border-stone-700 text-center">
                                <span className="block font-bold text-stone-800 dark:text-stone-200">Very strong</span>
                                <span className="text-[10px] font-normal lowercase opacity-75">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-stone-200 dark:border-stone-700 text-center">
                                <span className="block font-bold text-stone-800 dark:text-stone-200">Strong</span>
                                <span className="text-[10px] font-normal lowercase opacity-75">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-stone-200 dark:border-stone-700 text-center">
                                <span className="block font-bold text-stone-800 dark:text-stone-200">Normal</span>
                                <span className="text-[10px] font-normal lowercase opacity-75">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-stone-200 dark:border-stone-700 text-center">
                                <span className="block font-bold text-stone-800 dark:text-stone-200">Weak</span>
                                <span className="text-[10px] font-normal lowercase opacity-75">significator</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                        {significations.map((row) => (
                            <tr key={row.planet} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
                                <th scope="row" className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                                    {row.planet}
                                </th>
                                <td className="px-6 py-4 text-center font-medium text-stone-700 dark:text-stone-300">
                                    {formatHouses(row.levelA)}
                                </td>
                                <td className="px-6 py-4 text-center text-stone-600 dark:text-stone-400">
                                    {formatHouses(row.levelB)}
                                </td>
                                <td className="px-6 py-4 text-center text-stone-600 dark:text-stone-400">
                                    {formatHouses(row.levelC)}
                                </td>
                                <td className="px-6 py-4 text-center text-stone-500 dark:text-stone-500 italic">
                                    {formatHouses(row.levelD)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
