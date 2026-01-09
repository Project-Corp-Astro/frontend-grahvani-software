"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

interface Varga {
    id: string;
    name: string;
    label: string;
}

const VARGAS: Varga[] = [
    { id: 'D1', name: 'Rashi', label: 'Main' },
    { id: 'D2', name: 'Hora', label: 'Wealth' },
    { id: 'D3', name: 'Drekkana', label: 'Sibilings' },
    { id: 'D7', name: 'Saptamsa', label: 'Children' },
    { id: 'D9', name: 'Navamsa', label: 'Destiny' },
    { id: 'D10', name: 'Dasamsa', label: 'Career' },
    { id: 'D12', name: 'Dwadasamsa', label: 'Parents' },
    { id: 'D16', name: 'Shodasamsa', label: 'Conveyance' },
    { id: 'D20', name: 'Vimsamsa', label: 'Spirituality' },
    { id: 'D24', name: 'Chaturvimsamsa', label: 'Knowledge' },
    { id: 'D27', name: 'Saptavimsamsa', label: 'Strength' },
    { id: 'D30', name: 'Trimsamsa', label: 'Miseries' },
    { id: 'D40', name: 'Khavedamsa', label: 'Auspicious' },
    { id: 'D45', name: 'Akshavedamsa', label: 'General' },
    { id: 'D60', name: 'Shashtiamsa', label: 'Past Karma' },
];

interface VargaSelectorProps {
    activeVarga: string;
    onSelect: (id: string) => void;
}

export default function VargaSelector({ activeVarga, onSelect }: VargaSelectorProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 bg-[#3E2A1F]/5 border border-[#D08C60]/10 p-1 rounded-2xl backdrop-blur-sm shadow-inner">
                <div className="px-4 py-2 flex items-center gap-2 border-r border-[#D08C60]/10 mr-1">
                    <Layers className="w-4 h-4 text-[#D08C60]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5A3E2B]/60">Varga</span>
                </div>
                {VARGAS.map((varga) => {
                    const isActive = activeVarga === varga.id;
                    return (
                        <button
                            key={varga.id}
                            onClick={() => onSelect(varga.id)}
                            className={cn(
                                "relative px-4 py-2 rounded-xl transition-all duration-300 group whitespace-nowrap",
                                isActive
                                    ? "bg-[#D08C60] text-white shadow-md relative z-10"
                                    : "text-[#5A3E2B]/50 hover:text-[#3E2A1F] hover:bg-[#3E2A1F]/5"
                            )}
                        >
                            <span className="text-xs font-serif font-black tracking-tight">{varga.id}</span>
                            <div className={cn(
                                "absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#3E2A1F] text-[#FFD27D] text-[8px] font-black uppercase tracking-tighter rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-[#FFD27D]/20 shadow-xl",
                                isActive && "group-hover:opacity-0"
                            )}>
                                {varga.name}: {varga.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
