import React from 'react';
import { KpPromise } from '@/types/kp.types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpAdvancedSslTableProps {
    promises: KpPromise[];
}

export const KpAdvancedSslTable: React.FC<KpAdvancedSslTableProps> = ({ promises }) => {
    return (
        <div className="overflow-hidden bg-white border border-antique rounded-xl shadow-sm animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    {/* Header */}
                    <thead className="bg-parchment text-ink font-serif uppercase tracking-wider text-xs border-b border-antique">
                        <tr>
                            <th className="px-4 py-3 font-bold border-r border-antique/20 w-12">H</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Sign Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Star Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Sub Lord</th>
                            <th className="px-4 py-3 font-bold text-white bg-ink border-r border-antique/20">Sub-Sub Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20 w-1/3">Interlinks (Involved Houses)</th>
                            <th className="px-4 py-3 font-bold text-center">Status</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-antique/20">
                        {(Array.isArray(promises) ? promises : Object.values(promises || {})).map((row: any) => (
                            <tr key={row.houseNumber} className="hover:bg-gold-primary/5 transition-colors">

                                {/* House Number */}
                                <td className="px-4 py-3 font-bold text-ink border-r border-antique/20 text-center">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-parchment border border-antique shadow-sm text-xs">
                                        {row.houseNumber}
                                    </span>
                                </td>

                                {/* Lords Chain */}
                                <td className="px-4 py-3 border-r border-antique/20 font-medium text-muted">
                                    {row.chain.signLord.planet}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20 font-medium text-muted">
                                    {row.chain.starLord.planet}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20 font-medium text-ink">
                                    {row.chain.subLord.planet}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20 bg-ink/5 font-bold text-ink">
                                    {row.chain.subSubLord.planet}
                                </td>

                                {/* Interlinks (Positive / Negative) */}
                                <td className="px-4 py-3 border-r border-antique/20">
                                    <div className="flex flex-col gap-1.5">
                                        {/* Positive */}
                                        {row.positiveHouses && row.positiveHouses.length > 0 ? (
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex flex-wrap gap-1">
                                                    {row.positiveHouses.map((h: any) => (
                                                        <span key={h} className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted/50 ml-6">-</span>
                                        )}

                                        {/* Negative */}
                                        {row.negativeHouses && row.negativeHouses.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <XCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex flex-wrap gap-1">
                                                    {row.negativeHouses.map((h: any) => (
                                                        <span key={h} className="text-[11px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Verdict Tag */}
                                <td className="px-4 py-3 text-center">
                                    <div className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        row.strength === 'Very Strong' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                                        row.strength === 'Strong' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                                        row.strength === 'Moderate' && "bg-amber-50 text-amber-600 border-amber-100",
                                        row.strength === 'Weak' && "bg-orange-50 text-orange-600 border-orange-100",
                                        row.strength === 'Denied' && "bg-rose-50 text-rose-600 border-rose-100"
                                    )}>
                                        {row.strength}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-parchment/30 p-3 text-center border-t border-antique/10 text-xs text-muted">
                <strong>Advanced Sub-Sub Lord Analysis</strong>: The SSL determines the final confirmation of the event.
            </div>
        </div>
    );
};
