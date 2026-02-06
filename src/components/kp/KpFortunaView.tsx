import React from 'react';
import { KpFortunaResponse } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { Calculator, ArrowRight } from 'lucide-react';

interface KpFortunaViewPropsNew {
    data: KpFortunaResponse;
}

export const KpFortunaView: React.FC<KpFortunaViewPropsNew> = ({ data }) => {
    const { fortunaData } = data;

    if (!fortunaData) return <div className="p-8 text-center text-muted">Fortuna Data Unavailable</div>;

    const { calculation, fortunaHouse } = fortunaData;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">

            <div className="bg-white border border-antique rounded-xl shadow-sm overflow-hidden">
                <div className="bg-parchment/50 p-4 border-b border-antique/20 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-gold-dark" />
                        Mathematical Derivation
                    </h3>
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">Formula: Ascendant + Moon - Sun</span>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-parchment text-ink font-serif uppercase tracking-wider text-xs border-b border-antique">
                        <tr>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/4">Component</th>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/4">Longitude (Deg)</th>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/4">Sign</th>
                            <th className="px-6 py-4 font-bold w-1/4">House</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/10">
                        {(Array.isArray(calculation) ? calculation : Object.values(calculation || {})).map((row: any, idx) => (
                            <tr key={row.component} className={cn(
                                "transition-colors",
                                row.component === 'Pars Fortuna' ? "bg-gold-primary/10 font-bold text-ink" : "hover:bg-gold-primary/5"
                            )}>
                                <td className="px-6 py-4 border-r border-antique/20 flex items-center gap-2">
                                    {row.component === 'Pars Fortuna' && <span className="text-xl">⊗</span>}
                                    {row.component === 'Ascendant' && <span className="text-md font-serif">Asc</span>}
                                    {row.component === 'Sun' && <span className="text-md">⊙</span>}
                                    {row.component === 'Moon' && <span className="text-md">☾</span>}

                                    <span>{row.component}</span>
                                </td>
                                <td className="px-6 py-4 border-r border-antique/20 font-mono text-muted/80">
                                    {row.dms} <span className="text-[10px] text-muted/50 ml-1">({row.longitude.toFixed(2)}°)</span>
                                </td>
                                <td className="px-6 py-4 border-r border-antique/20">
                                    {row.sign}
                                </td>
                                <td className="px-6 py-4">
                                    {row.house}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Analysis Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Fortuna Placement
                    </h4>
                    {fortunaHouse ? (
                        <>
                            <p className="text-sm text-emerald-900 leading-relaxed">
                                Fortuna is located in <strong className="font-semibold px-1 rounded bg-white border border-emerald-200">{fortunaHouse.sign}</strong>
                                in the <strong className="font-semibold px-1 rounded bg-white border border-emerald-200">House {fortunaHouse.houseNumber}</strong>.
                            </p>
                            <p className="text-xs text-emerald-700 mt-2">
                                Cusp Longitude: {fortunaHouse.cuspLongitude}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted italic">Placement details unavailable</p>
                    )}
                </div>

                <div className="p-6 rounded-xl bg-white border border-antique shadow-sm">
                    <h4 className="font-bold text-ink mb-2">Interpretation Key</h4>
                    <ul className="text-sm text-muted space-y-1.5 list-disc pl-4">
                        <li><strong>Formula</strong>: Used for Day Birth. (Night Birth reverses Sun/Moon).</li>
                        <li><strong>House</strong>: The area of life where material prosperity is most easily accessible.</li>
                        <li><strong>Sign</strong>: The manner in which you achieve success.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
