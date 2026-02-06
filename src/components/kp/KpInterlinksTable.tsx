import React from 'react';
import { KpPromise } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface KpInterlinksTableProps {
    promises: KpPromise[];
}

export const KpInterlinksTable: React.FC<KpInterlinksTableProps> = ({ promises }) => {
    return (
        <div className="overflow-hidden bg-white border border-antique rounded-xl shadow-sm animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-parchment text-ink font-serif uppercase tracking-wider text-xs border-b border-antique">
                        <tr>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">House</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Sign Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Star Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20 text-gold-dark bg-gold-primary/5">Sub Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20">Sub-Sub Lord</th>
                            <th className="px-4 py-3 font-bold border-r border-antique/20 w-1/4">Significations (Interlinks)</th>
                            <th className="px-4 py-3 font-bold text-center">Verdict</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/20">
                        {(Array.isArray(promises) ? promises : Object.values(promises || {})).map((row: any) => (
                            <tr key={row.houseNumber} className="hover:bg-gold-primary/5 transition-colors">
                                <td className="px-4 py-3 font-bold text-ink border-r border-antique/20">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-parchment border border-antique shadow-sm text-xs">
                                            {row.houseNumber}
                                        </span>
                                        <span className="text-xs text-muted hidden md:inline">{row.topic.split(',')[0]}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20">
                                    <span className="font-medium">{row.chain.signLord.planet}</span>
                                    {row.chain.signLord.isRetro && <span className="text-xs text-rose-600 ml-1">(R)</span>}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20">
                                    <span className="font-medium">{row.chain.starLord.planet}</span>
                                    {row.chain.starLord.isRetro && <span className="text-xs text-rose-600 ml-1">(R)</span>}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20 bg-gold-primary/5 font-bold text-ink">
                                    <span className="font-bold">{row.chain.subLord.planet}</span>
                                    {row.chain.subLord.isRetro && <span className="text-xs text-rose-600 ml-1">(R)</span>}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20">
                                    <span className="font-medium">{row.chain.subSubLord.planet}</span>
                                    {row.chain.subSubLord.isRetro && <span className="text-xs text-rose-600 ml-1">(R)</span>}
                                </td>
                                <td className="px-4 py-3 border-r border-antique/20">
                                    <div className="flex flex-col gap-1.5">
                                        {/* Positive Links */}
                                        {row.positiveHouses && row.positiveHouses.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                                <div className="flex gap-1 flex-wrap">
                                                    {row.positiveHouses.map((h: any) => (
                                                        <span key={h} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Negative Links */}
                                        {row.negativeHouses && row.negativeHouses.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <XCircle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                                                <div className="flex gap-1 flex-wrap">
                                                    {row.negativeHouses.map((h: any) => (
                                                        <span key={h} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded border border-rose-100">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {(!row.positiveHouses?.length && !row.negativeHouses?.length) && (
                                            <span className="text-xs text-muted/50 italic">Neutral</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
                                        row.strength === 'Very Strong' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                                            row.strength === 'Strong' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                row.strength === 'Weak' ? "bg-orange-50 text-orange-700 border-orange-100" :
                                                    row.strength === 'Denied' ? "bg-rose-50 text-rose-700 border-rose-100" :
                                                        "bg-blue-50 text-blue-700 border-blue-100"
                                    )}>
                                        {row.verdict}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-parchment/50 p-2 text-center border-t border-antique/10">
                <p className="text-xs text-muted italic">
                    * The Sub Lord is the key decision maker in Krishnamurti Paddhati.
                </p>
            </div>
        </div>
    );
};
