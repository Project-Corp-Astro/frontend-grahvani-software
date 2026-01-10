"use client";

import React, { useEffect } from 'react';
import { X, Sparkles, Home as HomeIcon, Star, Info, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHouseDetails } from '@/data/house-data';
import { Planet } from '../NorthIndianChart/NorthIndianChart';

interface HouseModalProps {
    houseNumber: number;
    ascendantSign: number;
    planets: Planet[];
    onClose: () => void;
}

export default function HouseModal({ houseNumber, ascendantSign, planets, onClose }: HouseModalProps) {
    const houseDetails = getHouseDetails(houseNumber, ascendantSign);
    const planetsInHouse = planets.filter(p => p.signId === ((ascendantSign + houseNumber - 2) % 12) + 1);

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <>
            {/* Backdrop with Blur */}
            <div
                className="fixed inset-0 z-[200] bg-[#3E2A1F]/30 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none">
                <div
                    className="bg-[#FEFAEA] border-[3px] border-[#D08C60]/60 rounded-[3.5rem] p-12 max-w-3xl w-full relative shadow-[0_50px_150px_rgba(62,42,31,0.5)] pointer-events-auto animate-in zoom-in-95 fade-in duration-500 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#D08C60]/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD27D]/10 rounded-full blur-[100px] pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-4 rounded-2xl bg-[#3E2A1F]/5 hover:bg-[#D08C60]/20 border border-[#3E2A1F]/10 hover:border-[#D08C60]/40 text-[#3E2A1F] hover:text-[#D08C60] transition-all group z-10"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Header */}
                    <div className="relative z-10 mb-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D08C60] to-[#8B5A2B] flex items-center justify-center text-white shadow-xl border-2 border-[#FFD27D]/40">
                                <span className="text-3xl font-serif font-black">{houseNumber}</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-serif text-[#3E2A1F] font-black tracking-tight">
                                    {houseDetails.name}
                                </h2>
                                <p className="text-[11px] text-[#D08C60] uppercase tracking-[0.3em] font-black mt-1">
                                    House {houseNumber} • {houseDetails.sign.name} {houseDetails.sign.symbol}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="relative z-10 space-y-8">

                        {/* Zodiac Sign Information */}
                        <div className="bg-gradient-to-br from-[#D08C60]/10 to-transparent border border-[#D08C60]/30 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-[#D08C60]/20 flex items-center justify-center text-[#D08C60] shrink-0">
                                    <Star className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B5A2B] mb-3">
                                        Zodiac Sign
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-5xl">{houseDetails.sign.symbol}</span>
                                            <div>
                                                <p className="text-2xl font-serif font-black text-[#3E2A1F]">{houseDetails.sign.name}</p>
                                                <p className="text-sm text-[#5A3E2B]/80 font-bold mt-1">
                                                    {houseDetails.sign.element} • {houseDetails.sign.quality}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#5A3E2B] leading-relaxed font-serif italic">
                                            {houseDetails.sign.description}
                                        </p>
                                        <div className="flex items-center gap-2 bg-[#3E2A1F]/5 px-4 py-2 rounded-xl w-fit">
                                            <Orbit className="w-4 h-4 text-[#D08C60]" />
                                            <span className="text-xs font-black text-[#3E2A1F]">
                                                Ruler: {houseDetails.sign.rulingPlanet}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* House Signification */}
                        <div className="bg-[#3E2A1F]/5 border border-[#3E2A1F]/10 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-[#3E2A1F]/10 flex items-center justify-center text-[#3E2A1F] shrink-0">
                                    <Info className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B5A2B] mb-3">
                                        House Signification
                                    </h3>
                                    <p className="text-xl font-serif text-[#D08C60] font-bold mb-3">
                                        {houseDetails.signification}
                                    </p>
                                    <p className="text-sm text-[#5A3E2B] leading-relaxed mb-4">
                                        {houseDetails.description}
                                    </p>

                                    {/* Keywords */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {houseDetails.keywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-[#D08C60]/10 border border-[#D08C60]/20 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D08C60]"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Life Areas */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#5A3E2B]/60 mb-2">
                                            Life Areas Governed
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {houseDetails.areas.map((area, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D08C60]" />
                                                    <span className="text-xs text-[#3E2A1F] font-bold">{area}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Planets in House */}
                        <div className="bg-gradient-to-br from-[#FFD27D]/20 to-transparent border border-[#FFD27D]/40 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-[#FFD27D]/30 flex items-center justify-center text-[#8B5A2B] shrink-0">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B5A2B] mb-4">
                                        Planets Positioned
                                    </h3>
                                    {planetsInHouse.length > 0 ? (
                                        <div className="space-y-3">
                                            {planetsInHouse.map((planet, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between bg-[#3E2A1F]/5 px-5 py-3 rounded-xl border border-[#3E2A1F]/10"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-[#D08C60]/20 flex items-center justify-center">
                                                            <span className="font-serif font-black text-[#D08C60]">{planet.name}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#3E2A1F]">{planet.name}</p>
                                                            {planet.isRetro && (
                                                                <span className="text-[9px] text-[#D08C60] uppercase tracking-wider font-black">
                                                                    Retrograde
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-bold text-[#5A3E2B] font-mono">
                                                        {planet.degree}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#5A3E2B]/60 italic">
                                            No planets currently positioned in this house.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Decoration */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#D08C60] to-transparent opacity-30" />
                </div>
            </div>
        </>
    );
}
