import React from 'react';
import { Pencil, Zap, Compass, Star } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientHeaderProps {
    client: Client;
}

export default function ClientHeader({ client }: ClientHeaderProps) {
    return (
        <div className="relative overflow-hidden bg-[#1A0A05] border-b border-[#D08C60]/30 shadow-2xl">
            {/* Subtle Gradient Glow */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#D08C60]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Header Left: Name & Birth Metadata */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex w-14 h-14 rounded-full bg-gradient-to-br from-[#D08C60] to-[#3E2A1F] border border-[#FFD27D]/30 items-center justify-center text-white shadow-xl">
                            <span className="text-2xl font-serif font-bold">{client.firstName.charAt(0)}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                                    {client.firstName} {client.lastName}
                                </h1>
                                <div className="bg-[#FFD27D]/10 text-[#FFD27D] text-[9px] px-2 py-0.5 rounded-full border border-[#FFD27D]/30 font-black uppercase tracking-widest">
                                    Primary Record
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-white/40 text-[11px] font-serif uppercase tracking-widest font-bold">
                                <span>{new Date(client.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D08C60]/40" />
                                <span>{client.timeOfBirth} IST</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D08C60]/40" />
                                <span className="text-[#FFD27D]">{client.placeOfBirth}</span>
                            </div>
                        </div>
                    </div>

                    {/* Header Right: Quick State Indicators */}
                    <div className="flex items-center gap-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <MetadataTag icon={Compass} label="Asc" value="Cancer" />
                            <MetadataTag icon={Star} label="Rashi" value={client.rashi || "Unknown"} orange />
                            <MetadataTag icon={Zap} label="Dasha" value="Jup-Sat" />
                        </div>
                        <button className="ml-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-[#FFD27D] transition-all" title="Modify Soul Record">
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetadataTag({ icon: Icon, label, value, orange = false }: { icon: any, label: string, value: string, orange?: boolean }) {
    return (
        <div className={`px-4 py-2 rounded-xl border flex flex-col min-w-[90px] transition-all ${orange ? 'bg-[#D08C60]/10 border-[#D08C60]/40' : 'bg-white/5 border-white/10'}`}>
            <span className="text-[8px] font-black uppercase tracking-tighter text-white/30 mb-0.5">{label}</span>
            <span className={`text-xs font-serif font-black tracking-wide ${orange ? 'text-[#FFD27D]' : 'text-white/80'}`}>{value}</span>
        </div>
    );
}
