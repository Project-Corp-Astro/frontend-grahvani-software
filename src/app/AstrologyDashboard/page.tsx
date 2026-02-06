'use client';

import React from 'react';
import NorthIndianChart, { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';

/**
 * MOCK DATA
 */
const CLIENT_DETAILS = {
    name: "Rajesh Kumar",
    gender: "Male",
    dob: "15 Oct 1988",
    tob: "14:30:00",
    pob: "New Delhi, India",
    latitude: "28° 38' N",
    longitude: "77° 13' E",
    ayanamsa: "Lahiri (24° 07' 12\")",
    sunrise: "06:22 AM",
    sunset: "05:48 PM"
};

const PANCHANG = {
    tithi: "Shukla Shashthi (42%)",
    nakshatra: "Jyeshtha (12.4%)",
    yoga: "Sobhana",
    karana: "Taitila",
    day: "Saturday",
    paksha: "Shukla"
};

// D1 PLANETS (MOCK)
// Cancer Ascendant (4)
const D1_ASC_SIGN = 4;
const D1_PLANETS: Planet[] = [
    { name: "Su", signId: 6, degree: "28°12'", nakshatra: "Chitra", house: 3 },
    { name: "Mo", signId: 8, degree: "02°15'", nakshatra: "Jyeshtha", house: 5 }, // Debilitated but in Sco? No Moon is deb in Sc. Acc to mock.
    { name: "Ma", signId: 12, degree: "05°45'", nakshatra: "U.Bhadra", house: 9, isRetro: true },
    { name: "Me", signId: 7, degree: "14°20'", nakshatra: "Swati", house: 4 },
    { name: "Ju", signId: 2, degree: "08°10'", nakshatra: "Krittika", house: 11 },
    { name: "Ve", signId: 8, degree: "22°30'", nakshatra: "Jyeshtha", house: 5 },
    { name: "Sa", signId: 9, degree: "03°55'", nakshatra: "Mula", house: 6 },
    { name: "Ra", signId: 11, degree: "18°00'", nakshatra: "Satabisha", house: 8 },
    { name: "Ke", signId: 5, degree: "18°00'", nakshatra: "P.Phalguni", house: 2 },
    { name: "As", signId: 4, degree: "15°22'", nakshatra: "Pushya", house: 1 },
];

// D9 PLANETS (MOCK)
// Libra Ascendant (7) in D9
const D9_ASC_SIGN = 7;
const D9_PLANETS: Planet[] = [
    { name: "Su", signId: 9, degree: "---" },
    { name: "Mo", signId: 2, degree: "---" },
    { name: "Ma", signId: 4, degree: "---" },
    { name: "Me", signId: 1, degree: "---" },
    { name: "Ju", signId: 10, degree: "---" }, // Debilitated
    { name: "Ve", signId: 8, degree: "---" },
    { name: "Sa", signId: 3, degree: "---" },
    { name: "Ra", signId: 6, degree: "---" },
    { name: "Ke", signId: 12, degree: "---" },
    { name: "As", signId: 7, degree: "---" }
];

const PLANETARY_DETAILS = [
    { name: "Sun", r: "", sign: "Virgo", deg: "28°12'", nak: "Chitra", pada: 2, lord: "Mars", sub: "Sat", status: "Neutral" },
    { name: "Moon", r: "", sign: "Scorpio", deg: "02°15'", nak: "Jyeshtha", pada: 4, lord: "Merc", sub: "Ven", status: "Debilitated" },
    { name: "Mars", r: "R", sign: "Pisces", deg: "05°45'", nak: "U.Bhadra", pada: 1, lord: "Sat", sub: "Merc", status: "Friendly" },
    { name: "Merc", r: "", sign: "Libra", deg: "14°20'", nak: "Swati", pada: 3, lord: "Rahu", sub: "Mer", status: "Friendly" },
    { name: "Jup", r: "", sign: "Taurus", deg: "08°10'", nak: "Krittika", pada: 4, lord: "Sun", sub: "Ven", status: "Enemy" },
    { name: "Ven", r: "", sign: "Scorpio", deg: "22°30'", nak: "Jyeshtha", pada: 2, lord: "Merc", sub: "Moon", status: "Neutral" },
    { name: "Sat", r: "", sign: "Sagitt", deg: "03°55'", nak: "Mula", pada: 2, lord: "Ketu", sub: "Moon", status: "Neutral" },
    { name: "Rahu", r: "R", sign: "Aquar", deg: "18°00'", nak: "Satabisha", pada: 1, lord: "Rahu", sub: "Sun", status: "Own" },
    { name: "Ketu", r: "R", sign: "Leo", deg: "18°00'", nak: "P.Phalguni", pada: 3, lord: "Ven", sub: "Rah", status: "Enemy" }
];

const DASHA_CURRENT = {
    maha: "Venus",
    mahaEnd: "15-10-2035",
    antar: "Jupiter",
    antarEnd: "22-04-2026",
    prat: "Saturn",
    pratEnd: "15-09-2024",
    sook: "Mercury",
    sookEnd: "12-08-2024",
};

const DASHA_LIST = [
    { planet: "Sun", start: "1980", end: "1986" },
    { planet: "Moon", start: "1986", end: "1996" },
    { planet: "Mars", start: "1996", end: "2003" },
    { planet: "Rahu", start: "2003", end: "2021" },
    { planet: "Jupiter", start: "2021", end: "2037" },
    { planet: "Saturn", start: "2037", end: "2056" },
    { planet: "Mercury", start: "2056", end: "2073" },
    { planet: "Ketu", start: "2073", end: "2080" },
];

export default function AstrologyDashboard() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-orange-100 pt-[64px]">
            {/* 1. TOP HEADER: Very compact, "Parashara" style data density */}
            <header className="bg-slate-900 text-amber-50 px-4 py-1.5 border-b border-slate-700 flex justify-between items-center text-xs shadow-md">
                <div className="flex items-center gap-6">
                    <div className="font-bold text-amber-400 text-sm tracking-wide uppercase">{CLIENT_DETAILS.name}</div>
                    <div className="flex items-center gap-3 opacity-90">
                        <span>{CLIENT_DETAILS.gender}</span>
                        <span className="text-slate-500">|</span>
                        <span>{CLIENT_DETAILS.dob}</span>
                        <span className="text-slate-500">|</span>
                        <span>{CLIENT_DETAILS.tob}</span>
                        <span className="text-slate-500">|</span>
                        <span>{CLIENT_DETAILS.pob}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-medium tracking-wider text-slate-400">
                    <span>Lat: {CLIENT_DETAILS.latitude}</span>
                    <span>Long: {CLIENT_DETAILS.longitude}</span>
                    <span>Ayanamsa: {CLIENT_DETAILS.ayanamsa}</span>
                </div>
            </header>

            {/* 1.5. SETTINGS TOOLBAR (New) */}
            <div className="bg-slate-800 text-slate-300 px-4 py-1 border-b border-slate-700 flex justify-between items-center text-[10px] shadow-inner select-none">
                {/* Left: Global Settings */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors group">
                        <span className="opacity-70 group-hover:opacity-100">Ayanamsa:</span>
                        <span className="font-semibold text-amber-400">Lahiri</span>
                        <span className="text-[8px] opacity-50">▼</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors group">
                        <span className="opacity-70 group-hover:opacity-100">Chart Style:</span>
                        <span className="font-semibold text-amber-400">North Indian</span>
                        <span className="text-[8px] opacity-50">▼</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors group">
                        <span className="opacity-70 group-hover:opacity-100">Lang:</span>
                        <span className="font-semibold text-amber-400">English</span>
                        <span className="text-[8px] opacity-50">▼</span>
                    </div>
                    <div className="h-3 w-[1px] bg-slate-600 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <button className="hover:text-amber-300 transition-colors flex items-center gap-1" title="Print">
                            <span>🖨️</span> <span className="hidden xl:inline">Print</span>
                        </button>
                        <button className="hover:text-amber-300 transition-colors flex items-center gap-1" title="Save PDF">
                            <span>📄</span> <span className="hidden xl:inline">Save PDF</span>
                        </button>
                        <button className="hover:text-amber-300 transition-colors flex items-center gap-1" title="Email Report">
                            <span>✉️</span> <span className="hidden xl:inline">Email</span>
                        </button>
                    </div>
                </div>

                {/* Right: Quick Links */}
                <div className="flex items-center gap-5 font-medium tracking-wide">
                    <a href="#" className="hover:text-amber-300 transition-colors">Dashas</a>
                    <a href="#" className="hover:text-amber-300 transition-colors">Transits</a>
                    <a href="#" className="hover:text-amber-300 transition-colors">Varshphal</a>
                    <a href="#" className="hover:text-amber-300 transition-colors">Matchmaking</a>
                    <a href="#" className="hover:text-amber-300 transition-colors text-amber-200">Store</a>
                    <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 py-0.5 rounded ml-2 cursor-pointer hover:from-amber-500 hover:to-amber-400 shadow-sm border border-amber-400/50">
                        Upgrade
                    </div>
                </div>
            </div>

            {/* 2. PANCHANG STRIP */}
            <div className="bg-white border-b border-orange-100 px-4 py-2 flex justify-between items-center shadow-sm text-xs">
                <div className="flex items-center gap-8">
                    <PanchangItem label="Tithi" value={PANCHANG.tithi} />
                    <PanchangItem label="Nakshatra" value={PANCHANG.nakshatra} />
                    <PanchangItem label="Yoga" value={PANCHANG.yoga} />
                    <PanchangItem label="Karana" value={PANCHANG.karana} />
                    <PanchangItem label="Paksha" value={PANCHANG.paksha} />
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                    <div><span className="text-orange-600 font-semibold">Sunrise:</span> {CLIENT_DETAILS.sunrise}</div>
                    <div><span className="text-indigo-600 font-semibold">Sunset:</span> {CLIENT_DETAILS.sunset}</div>
                </div>
            </div>

            <main className="p-3 max-w-[1920px] mx-auto grid grid-cols-12 gap-3 h-[calc(100vh-80px)]">

                {/* LEFT COLUMN: CHARTS (D1 & D9) */}
                <div className="col-span-8 flex flex-col gap-3">
                    {/* CHARTS ROW */}
                    <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                        {/* D1 RASHI */}
                        <ChartCard title="Lagna Chart (D1)">
                            <div className="w-full h-full p-2 flex items-center justify-center bg-[#FFFCF5]">
                                <NorthIndianChart
                                    planets={D1_PLANETS}
                                    ascendantSign={D1_ASC_SIGN}
                                    className="w-full max-w-[420px] max-h-[420px]"
                                />
                            </div>
                        </ChartCard>

                        {/* D9 NAVAMSA */}
                        <ChartCard title="Navamsa Chart (D9)">
                            <div className="w-full h-full p-2 flex items-center justify-center bg-[#FFFCF5]">
                                <NorthIndianChart
                                    planets={D9_PLANETS}
                                    ascendantSign={D9_ASC_SIGN}
                                    className="w-full max-w-[420px] max-h-[420px]"
                                />
                            </div>
                        </ChartCard>
                    </div>

                    {/* PLANETARY DETAILS TABLE (Bottom Left) */}
                    <div className="h-[280px] bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Planetary Positions</h3>
                            <button className="text-[10px] text-blue-600 hover:underline">View Detailed Specs</button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-[#FFF9EE] sticky top-0 z-10 text-slate-600">
                                    <tr>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold w-16">Planet</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold w-8">R/C</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold">Sign</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold">Degree</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold">Nakshatra</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold w-8">Pad</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold">Lord</th>
                                        <th className="py-1 px-2 border-r border-b border-slate-200 font-semibold">Sub</th>
                                        <th className="py-1 px-2 border-b border-slate-200 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLANETARY_DETAILS.map((p, i) => (
                                        <tr key={p.name} className={`hover:bg-blue-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                                            <td className="py-1 px-2 border-r border-slate-200 font-medium text-slate-800">{p.name}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-center text-red-600 font-bold">{p.r}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-slate-600">{p.sign}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-slate-800 font-mono tracking-tighter">{p.deg}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-slate-600">{p.nak}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-center text-slate-500">{p.pada}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-slate-600">{p.lord}</td>
                                            <td className="py-1 px-2 border-r border-slate-200 text-slate-600">{p.sub}</td>
                                            <td className={`py-1 px-2 border-slate-200 text-[10px] font-bold ${p.status === 'Own' || p.status === 'Exalted' ? 'text-green-600' :
                                                p.status === 'Debilitated' || p.status === 'Enemy' ? 'text-red-500' : 'text-slate-500'
                                                }`}>{p.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DASHA & SNAPSHOTS */}
                <div className="col-span-4 flex flex-col gap-3">

                    {/* CURRENT DASHA BLOCK */}
                    <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-0 overflow-hidden">
                        <div className="bg-indigo-900 px-3 py-1.5 border-b border-indigo-800 flex justify-between items-center text-white">
                            <h3 className="text-xs font-bold uppercase tracking-wide">Vimshottari Dasha</h3>
                            <span className="text-[10px] bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-200">Current</span>
                        </div>
                        <div className="p-3 bg-indigo-50/30">
                            {/* Dasha Chain */}
                            <div className="flex items-center justify-between gap-1 mb-4">
                                <DashaNode level="Maha" planet={DASHA_CURRENT.maha} end={DASHA_CURRENT.mahaEnd} color="bg-orange-500" />
                                <div className="h-[1px] w-3 bg-slate-300"></div>
                                <DashaNode level="Antar" planet={DASHA_CURRENT.antar} end={DASHA_CURRENT.antarEnd} color="bg-yellow-500" />
                                <div className="h-[1px] w-3 bg-slate-300"></div>
                                <DashaNode level="Prat" planet={DASHA_CURRENT.prat} end={DASHA_CURRENT.pratEnd} color="bg-blue-500" />
                                <div className="h-[1px] w-3 bg-slate-300"></div>
                                <DashaNode level="Sook" planet={DASHA_CURRENT.sook} end={DASHA_CURRENT.sookEnd} color="bg-green-500" />
                            </div>

                            {/* Dasha Table */}
                            <div className="border border-slate-200 rounded bg-white">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-2 py-1 text-slate-500 font-medium">MD Planet</th>
                                            <th className="px-2 py-1 text-slate-500 font-medium">Start</th>
                                            <th className="px-2 py-1 text-slate-500 font-medium">End</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {DASHA_LIST.map((d) => (
                                            <tr key={d.planet} className={d.planet === "Jupiter" ? "bg-indigo-50 font-semibold" : ""}>
                                                <td className="px-2 py-1">{d.planet}</td>
                                                <td className="px-2 py-1 text-slate-500">{d.start}</td>
                                                <td className="px-2 py-1 text-slate-500">{d.end}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* QUICK TOOLS / SNAPSHOTS */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Yogas & Avamakh</h3>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="border border-green-200 bg-green-50 p-2 rounded">
                                <div className="font-bold text-green-800 mb-1">Gaja Kesari Yoga</div>
                                <div className="text-green-700 opacity-80 leading-tight">Jupiter in Kendra from Moon. Wealth & fame.</div>
                            </div>
                            <div className="border border-red-200 bg-red-50 p-2 rounded">
                                <div className="font-bold text-red-800 mb-1">Kemadruma Yoga</div>
                                <div className="text-red-700 opacity-80 leading-tight">No planet on either side of Moon. Mental unrest.</div>
                            </div>
                            <div className="border border-blue-200 bg-blue-50 p-2 rounded">
                                <div className="font-bold text-blue-800 mb-1">Budhaditya Yoga</div>
                                <div className="text-blue-700 opacity-80 leading-tight">Sun & Mercury together. Intelligence.</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function PanchangItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
            <span className="font-bold text-slate-700">{value}</span>
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
            <div className="bg-[#F8F9FA] px-3 py-1.5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" title="Retrograde"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
            </div>
            <div className="flex-1 relative min-h-0">
                {children}
            </div>
        </div>
    );
}

function DashaNode({ level, planet, end, color }: { level: string; planet: string; end: string; color: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 mb-0.5 uppercase">{level}</span>
            <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-bold shadow-sm text-sm border-2 border-white ring-1 ring-slate-100`}>
                {planet.substring(0, 2)}
            </div>
            <span className="text-[10px] font-medium text-slate-600 mt-1">{end}</span>
        </div>
    );
}