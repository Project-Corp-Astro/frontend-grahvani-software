"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import { Calendar, Clock, MapPin, FileText, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import GoldenButton from "@/components/GoldenButton";

export default function ClientOverviewPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

            {/* LEFT COLUMN (approx 1/3) */}
            <div className="lg:col-span-4 space-y-6">

                {/* SOUL RECORD CARD */}
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-[#3E2A1F] border-b border-[#E7D6B8] pb-3 mb-6">
                        Soul Record
                    </h2>
                    <div className="space-y-6 text-[#5A3E2B]">
                        <div className="flex gap-4">
                            <Calendar className="w-5 h-5 text-[#9C7A2F] mt-1" />
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-[#9C7A2F]">Birth Date</p>
                                <p className="font-serif text-lg font-medium">1992-08-15</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Clock className="w-5 h-5 text-[#9C7A2F] mt-1" />
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-[#9C7A2F]">Birth Time</p>
                                <p className="font-serif text-lg font-medium">14:30:00 (GMT +5.5)</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <MapPin className="w-5 h-5 text-[#9C7A2F] mt-1" />
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-[#9C7A2F]">Birth Place</p>
                                <p className="font-serif text-lg font-medium">New Delhi, India</p>
                                <p className="text-xs font-serif italic opacity-70">Lat: 28.6139, Long: 77.209</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COSMIC IDENTITY CARD */}
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-6 shadow-sm bg-gradient-to-br from-[#FEFAEA] to-[#FDF5E1]">
                    <h2 className="text-[10px] font-bold tracking-widest uppercase text-[#9C7A2F] mb-6 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Cosmic Identity
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white border border-[#E7D6B8] p-4 text-center rounded shadow-sm">
                            <p className="text-[9px] uppercase tracking-widest text-[#7A5A43] mb-1">Ascendant</p>
                            <p className="font-serif text-xl font-bold text-[#3E2A1F]">Cancer</p>
                        </div>
                        <div className="bg-white border border-[#E7D6B8] p-4 text-center rounded shadow-sm">
                            <p className="text-[9px] uppercase tracking-widest text-[#7A5A43] mb-1">Moon Rashi</p>
                            <p className="font-serif text-xl font-bold text-[#3E2A1F]">Leo</p>
                        </div>
                    </div>
                    <div className="bg-white border border-[#E7D6B8] p-4 text-center rounded shadow-sm">
                        <p className="text-[9px] uppercase tracking-widest text-[#7A5A43] mb-1">Nakshatra</p>
                        <p className="font-serif text-xl font-bold text-[#3E2A1F]">Magha</p>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (approx 2/3) */}
            <div className="lg:col-span-8 flex flex-col gap-6">

                {/* MAIN DASHBOARD CARD */}
                <div className="flex-1 bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-8 shadow-sm relative overflow-hidden">
                    {/* Soft decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2E6D0] rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* CHART SECTION */}
                        <div className="flex-1 w-full flex flex-col items-center">
                            <h3 className="font-serif italic text-[#9C7A2F] mb-4">Rasi Chart (D1)</h3>
                            <div className="w-full max-w-[320px] aspect-square shadow-lg border border-[#E7D6B8] bg-white p-1">
                                <NorthIndianChart
                                    ascendantSign={4}
                                    planets={[
                                        { name: 'Ju', signId: 4, degree: '' },
                                        { name: 'Su', signId: 5, degree: '' },
                                        { name: 'Mo', signId: 5, degree: '' },
                                        { name: 'Ma', signId: 5, degree: '' },
                                        { name: 'Me', signId: 6, degree: '' },
                                        { name: 'Ke', signId: 11, degree: '' }
                                    ]}
                                    className="bg-[#FEFAEA]"
                                />
                            </div>
                            <button className="mt-4 text-[#9C7A2F] text-xs font-serif underline hover:text-[#763A1F] transition-colors">
                                Open Analytical Workspace
                            </button>
                        </div>

                        {/* DASHA & ACTIONS SECTION */}
                        <div className="flex-1 w-full space-y-8 pt-4">

                            <div>
                                <h3 className="font-serif text-sm uppercase tracking-widest text-[#5A3E2B] mb-4">Vimshottari Mahadasha</h3>
                                <div className="bg-[#F6EBD6] border border-[#E7D6B8] rounded px-4 py-3 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#4A729A]"></div>
                                    <span className="font-serif font-bold text-[#3E2A1F]">Saturn Mahadasha</span>
                                    <span className="text-xs text-[#7A5A43] ml-auto">(Until 1/15/2029)</span>
                                </div>
                            </div>

                            {/* Timeline Bar */}
                            <div className="relative h-12 w-full bg-[#E7D6B8]/30 rounded flex overflow-hidden">
                                <div className="w-[60%] bg-[#6B93B8] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">Saturn</div>
                                <div className="w-[40%] bg-[#6BB86E] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">Mercury</div>
                                {/* Marker */}
                                <div className="absolute top-0 bottom-0 left-[60%] w-[2px] bg-black/50 z-10 flex flex-col items-center">
                                    <div className="w-2 h-2 -mt-1 bg-black rounded-full shadow-md"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[10px] text-[#7A5A43] font-serif mt-1">
                                <span>2010</span>
                                <span>2046</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-2">
                                <GoldenButton
                                    topText="Analyse"
                                    bottomText="Dashas"
                                    className="flex-1"
                                />
                                <GoldenButton
                                    topText="Generate"
                                    bottomText="Report"
                                    className="flex-1"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* ASTROLOGICAL INSIGHTS */}
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#9C7A2F] mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Astrological Insights
                    </h3>
                    <p className="font-serif italic text-[#5A3E2B] leading-relaxed">
                        "The placement of the Moon in Magha suggests a strong connection to ancestral roots and a natural inclination towards leadership. Current Saturn mahadasha indicates a period of structural changes and karmic lessons..."
                    </p>
                </div>

            </div>
        </div>
    );
}
