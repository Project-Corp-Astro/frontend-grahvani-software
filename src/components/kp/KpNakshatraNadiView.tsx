import React, { useState } from 'react';
import { KpNakshatraNadiResponse } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { Sparkles, Compass } from 'lucide-react';

interface KpNakshatraNadiViewProps {
    data: KpNakshatraNadiResponse;
}

export const KpNakshatraNadiView: React.FC<KpNakshatraNadiViewProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<'planets' | 'cusps'>('planets');
    const { nadiData } = data;

    if (!nadiData) return <div className="p-8 text-center bg-white rounded-xl">Loading Nadi Data...</div>;

    const TabButton = ({ id, label, icon: Icon }: { id: 'planets' | 'cusps', label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2",
                activeTab === id
                    ? "border-gold-primary text-gold-dark bg-gold-primary/5"
                    : "border-transparent text-muted hover:text-ink hover:bg-black/5"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="bg-white border border-antique rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Tabs */}
            <div className="flex items-center border-b border-antique/20 bg-parchment/30">
                <TabButton id="planets" label="Planetary Nadi" icon={Sparkles} />
                <TabButton id="cusps" label="Cuspal Nadi (Bhavas)" icon={Compass} />
            </div>

            {/* Content Area */}
            <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-parchment text-ink font-serif uppercase tracking-wider text-xs border-b border-antique">
                        <tr>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/6">
                                {activeTab === 'planets' ? 'Planet' : 'House Cusp'}
                            </th>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/6">Longitude (DMS)</th>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/6">Sign</th>
                            <th className="px-6 py-4 font-bold border-r border-antique/20 w-1/4">Star Lord (Nakshatra)</th>
                            <th className="px-6 py-4 font-bold text-gold-dark bg-gold-primary/5 w-1/4">Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/10">
                        {activeTab === 'planets' ? (
                            (Array.isArray(nadiData.planets) ? nadiData.planets : Object.values(nadiData.planets || {})).map((planet: any, idx) => (
                                <tr key={`${planet.name}-${idx}`} className="hover:bg-gold-primary/5 transition-colors">
                                    <td className="px-6 py-3 font-bold text-ink border-r border-antique/20 flex items-center gap-2">
                                        {planet.name}
                                        {planet.isRetro && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">R</span>}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-muted/80 border-r border-antique/20">
                                        {planet.longitude}
                                    </td>
                                    <td className="px-6 py-3 border-r border-antique/20">
                                        {planet.sign}
                                    </td>
                                    <td className="px-6 py-3 border-r border-antique/20">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-ink">{planet.nakshatraLord}</span>
                                            <span className="text-[10px] text-muted">{planet.nakshatraName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 bg-gold-primary/5 font-bold text-ink">
                                        {planet.subLord}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            (Array.isArray(nadiData.cusps) ? nadiData.cusps : Object.values(nadiData.cusps || {})).map((cusp: any, idx) => (
                                <tr key={`${cusp.label}-${idx}`} className="hover:bg-gold-primary/5 transition-colors">
                                    <td className="px-6 py-3 font-bold text-ink border-r border-antique/20">
                                        <span className="bg-parchment border border-antique px-2 py-1 rounded-md shadow-sm">
                                            {cusp.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 font-mono text-muted/80 border-r border-antique/20">
                                        {cusp.longitude}
                                    </td>
                                    <td className="px-6 py-3 border-r border-antique/20">
                                        {cusp.sign}
                                    </td>
                                    <td className="px-6 py-3 border-r border-antique/20">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-ink">{cusp.nakshatraLord}</span>
                                            <span className="text-[10px] text-muted">{cusp.nakshatraName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 bg-gold-primary/5 font-bold text-ink">
                                        {cusp.subLord}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-parchment/30 p-3 text-center border-t border-antique/10 text-xs text-muted">
                Displaying <strong>{activeTab === 'planets' ? 'Planetary' : 'Cuspal'} Positions</strong> with Star and Sub Lords.
            </div>
        </div>
    );
};
