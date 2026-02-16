"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { parseChartData, signIdToName } from '@/lib/chart-helpers';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Star,
    Moon,
    Sun,
    Activity,
    Hexagon,
    Shield,
    Anchor,
    Feather,
    Disc,
    Zap,
    RefreshCcw,
    CalendarDays,
    Sunrise,
    Sunset,
    Loader2,
    AlertTriangle,
    Sparkle,
    Heart
} from 'lucide-react';


// ============================================================================
// PANCHANGA OVERVIEW PAGE — Full-page view with 3 sections
// ============================================================================

// Icon components for Avakhada items
function UsersIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TypeIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    );
}

// Avakhada field mapping
const AVAKHADA_ITEMS = [
    { key: 'varna', label: 'Varna', sanskrit: 'वर्ण', icon: Shield, desc: 'Class / Temperament', color: 'from-amber-500/10 to-orange-500/10', accent: 'text-amber-600' },
    { key: 'vashya', label: 'Vashya', sanskrit: 'वश्य', icon: Anchor, desc: 'Control / Nature', color: 'from-blue-500/10 to-cyan-500/10', accent: 'text-blue-600' },
    { key: 'yoni', label: 'Yoni', sanskrit: 'योनि', icon: Hexagon, desc: 'Instinct / Animal Symbol', color: 'from-emerald-500/10 to-green-500/10', accent: 'text-emerald-600' },
    { key: 'gana', label: 'Gana', sanskrit: 'गण', icon: UsersIcon, desc: 'Nature / Temperament Group', color: 'from-violet-500/10 to-purple-500/10', accent: 'text-violet-600' },
    { key: 'nadi', label: 'Nadi', sanskrit: 'नाडी', icon: Activity, desc: 'Health / Energy Channel', color: 'from-rose-500/10 to-pink-500/10', accent: 'text-rose-600' },
    { key: 'symbol_tatva', label: 'Tatva', sanskrit: 'तत्व', icon: Feather, desc: 'Element', color: 'from-teal-500/10 to-emerald-500/10', accent: 'text-teal-600' },
    { key: 'rashi_lord', label: 'Rashi Lord', sanskrit: 'राशि स्वामी', icon: Sun, desc: 'Sign Ruler', color: 'from-orange-500/10 to-red-500/10', accent: 'text-orange-600' },
    { key: 'rashi', label: 'Rashi', sanskrit: 'राशि', icon: Moon, desc: 'Moon Sign', color: 'from-indigo-500/10 to-blue-500/10', accent: 'text-indigo-600' },
    { key: 'nakshatra', label: 'Nakshatra', sanskrit: 'नक्षत्र', icon: Star, desc: 'Birth Star', color: 'from-yellow-500/10 to-amber-500/10', accent: 'text-yellow-600' },
    { key: 'pada', label: 'Pada', sanskrit: 'पाद', icon: Disc, desc: 'Quarter', color: 'from-slate-500/10 to-gray-500/10', accent: 'text-slate-600' },
    { key: 'namakshar', label: 'Namakshar', sanskrit: 'नामाक्षर', icon: TypeIcon, desc: 'Sound / First Letter', color: 'from-cyan-500/10 to-sky-500/10', accent: 'text-cyan-600' },
    { key: 'paya_rashi', label: 'Paya (Rashi)', sanskrit: 'पाया (राशि)', icon: Disc, desc: 'Base Metal', color: 'from-stone-500/10 to-neutral-500/10', accent: 'text-stone-600' },
    { key: 'paya_nakshatra', label: 'Paya (Nakshatra)', sanskrit: 'पाया (नक्षत्र)', icon: Disc, desc: 'Star Metal', color: 'from-zinc-500/10 to-gray-500/10', accent: 'text-zinc-600' },
];

// Helper for formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
        if (timeStr.includes('T')) {
            const timePart = timeStr.split('T')[1];
            const cleanTime = timePart.replace('Z', '').split('+')[0].split('.')[0];
            const [hours, minutes] = cleanTime.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${ampm}`;
        }
        const date = new Date(`1970-01-01T${timeStr}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        return timeStr;
    } catch { return timeStr; }
};

export default function PanchangaOverviewPage() {
    const { clientDetails, processedCharts, isLoadingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();

    // Avakhada data state
    const [avakhadaData, setAvakhadaData] = useState<any>(null);
    const [avakhadaLoading, setAvakhadaLoading] = useState(true);
    const [avakhadaError, setAvakhadaError] = useState<string | null>(null);

    // D1 chart data for Lagna, Moon, Sun
    const d1Data = useMemo(() => {
        const key = `D1_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [processedCharts, activeSystem]);

    // Birth Panchanga data
    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData;
    const panchanga = birthPanchangaData?.panchanga;
    const times = birthPanchangaData?.times;

    // Fetch Avakhada data
    useEffect(() => {
        const fetchAvakhada = async () => {
            if (!clientDetails?.id) return;
            setAvakhadaLoading(true);
            setAvakhadaError(null);
            try {
                const result = await clientApi.getAvakhadaChakra(clientDetails.id);
                const rawData = result.chartData || result.data || result;
                const cleanData = rawData.avakhada_chakra || rawData;
                setAvakhadaData(cleanData);
            } catch (err: any) {
                console.error("Avakhada Fetch Error:", err);
                setAvakhadaError(err.message || "Failed to load Avakhada Chakra");
            } finally {
                setAvakhadaLoading(false);
            }
        };
        fetchAvakhada();
    }, [clientDetails?.id]);

    // Loading state
    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const moonPlanet = d1Data.planets.find(p => p.name === "Mo");
    const sunPlanet = d1Data.planets.find(p => p.name === "Su");

    return (
        <div className="space-y-5 animate-in fade-in duration-500 pb-8">

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* PAGE HEADER                                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-muted-refined text-2xs mb-1 uppercase tracking-wider font-bold">
                        <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" />
                            Kundali
                        </Link>
                        <span>/</span>
                        <span>Panchanga Overview</span>
                    </div>
                    <h1 className="text-2xl font-serif font-black text-ink tracking-tight">Panchanga Overview</h1>
                    <p className="text-2xs text-secondary mt-0.5 font-medium italic">
                        Birth-time cosmic alignment for <span className="text-primary font-bold not-italic">{clientDetails.name}</span>
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 1: CLIENT PROFILE BANNER                          */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="bg-[#EAD8B1] border border-antique rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D08C60] to-[#B8733D] flex items-center justify-center text-white font-serif font-bold text-2xl shrink-0 shadow-lg">
                        {clientDetails.name.charAt(0)}
                    </div>

                    {/* Name & Birth Details */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-serif font-bold text-primary">
                            {clientDetails.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1.5 text-secondary text-xs">
                                <Calendar className="w-3.5 h-3.5 text-accent-gold" />
                                <span>{formatDate(clientDetails.dateOfBirth)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-secondary text-xs">
                                <Clock className="w-3.5 h-3.5 text-accent-gold" />
                                <span>{formatTime(clientDetails.timeOfBirth)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-secondary text-xs">
                                <MapPin className="w-3.5 h-3.5 text-accent-gold" />
                                <span>{clientDetails.placeOfBirth.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Astro Stats */}
                    <div className="flex gap-3 shrink-0">
                        <div className="bg-parchment border border-antique/50 rounded-xl px-4 py-3 text-center min-w-[80px]">
                            <p className="text-2xs uppercase tracking-widest text-muted-refined font-bold mb-1">Lagna</p>
                            <p className="font-serif text-sm font-bold text-primary">{signIdToName[(d1Data.ascendant || 1) as number] || '—'}</p>
                        </div>
                        <div className="bg-parchment border border-antique/50 rounded-xl px-4 py-3 text-center min-w-[80px]">
                            <p className="text-2xs uppercase tracking-widest text-muted-refined font-bold mb-1">Moon</p>
                            <p className="font-serif text-sm font-bold text-primary">{moonPlanet ? signIdToName[moonPlanet.signId] : '—'}</p>
                        </div>
                        <div className="bg-parchment border border-antique/50 rounded-xl px-4 py-3 text-center min-w-[80px]">
                            <p className="text-2xs uppercase tracking-widest text-muted-refined font-bold mb-1">Sun</p>
                            <p className="font-serif text-sm font-bold text-primary">{sunPlanet ? signIdToName[sunPlanet.signId] : '—'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 2: BIRTH PANCHANGA — Expanded Premium Layout       */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="border border-antique rounded-2xl overflow-hidden shadow-sm bg-[#FFFCF6]">
                <div className="bg-[#EAD8B1] px-5 py-3 border-b border-antique flex items-center gap-3">
                    <div className="p-1.5 bg-white/60 rounded-lg shadow-xs">
                        <Sparkle className="w-4 h-4 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg font-bold text-primary leading-tight tracking-wide">Birth Panchanga</h3>
                        <p className="text-2xs text-secondary italic font-sans">Five-fold daily cosmic markers at the moment of birth</p>
                    </div>
                </div>

                {!panchanga ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-serif text-secondary italic">Loading birth panchanga data...</p>
                    </div>
                ) : (
                    <div className="p-5">
                        {/* Main 5 Panchangas */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
                            {/* Tithi */}
                            <PanchangaCard
                                label="Tithi"
                                sanskrit="तिथि"
                                value={panchanga.tithi?.name || '—'}
                                subValue={panchanga.tithi?.paksha}
                                description="Lunar day — phase of the Moon relative to the Sun"
                                icon={Moon}
                                gradient="from-indigo-50 to-blue-50"
                                iconColor="text-indigo-500"
                                borderColor="border-indigo-200/60"
                            />
                            {/* Nakshatra */}
                            <PanchangaCard
                                label="Nakshatra"
                                sanskrit="नक्षत्र"
                                value={panchanga.nakshatra?.name || '—'}
                                subValue={panchanga.nakshatra?.pada ? `Pada ${panchanga.nakshatra.pada}` : undefined}
                                description="Birth star — lunar mansion at birth moment"
                                icon={Star}
                                gradient="from-amber-50 to-yellow-50"
                                iconColor="text-amber-500"
                                borderColor="border-amber-200/60"
                            />
                            {/* Yoga */}
                            <PanchangaCard
                                label="Yoga"
                                sanskrit="योग"
                                value={panchanga.yoga?.name || '—'}
                                description="Luni-solar combination — Sun & Moon angular distance"
                                icon={RefreshCcw}
                                gradient="from-teal-50 to-emerald-50"
                                iconColor="text-teal-500"
                                borderColor="border-teal-200/60"
                            />
                            {/* Karana */}
                            <PanchangaCard
                                label="Karana"
                                sanskrit="करण"
                                value={panchanga.karana?.name || '—'}
                                description="Half-tithi — sub-division of the lunar day"
                                icon={CalendarDays}
                                gradient="from-rose-50 to-pink-50"
                                iconColor="text-rose-500"
                                borderColor="border-rose-200/60"
                            />
                            {/* Vara */}
                            <PanchangaCard
                                label="Vara"
                                sanskrit="वार"
                                value={panchanga.vara?.name || '—'}
                                description="Weekday — planetary ruler of the birth day"
                                icon={Sun}
                                gradient="from-orange-50 to-amber-50"
                                iconColor="text-orange-500"
                                borderColor="border-orange-200/60"
                            />
                        </div>

                        {/* Sunrise / Sunset Row */}
                        {times && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50/80 to-transparent rounded-xl border border-amber-200/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                        <Sunrise className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xs uppercase tracking-widest text-secondary font-bold mb-0.5">Sunrise</p>
                                        <p className="font-serif text-lg font-bold text-primary">{times.sunrise?.time || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50/80 to-transparent rounded-xl border border-indigo-200/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                        <Sunset className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xs uppercase tracking-widest text-secondary font-bold mb-0.5">Sunset</p>
                                        <p className="font-serif text-lg font-bold text-primary">{times.sunset?.time || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 3: AVAKHADA CHAKRA — Full-Width Detailed Grid      */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="border border-antique rounded-2xl overflow-hidden shadow-sm bg-[#FFFCF6]">
                <div className="bg-[#EAD8B1] px-5 py-3 border-b border-antique flex items-center gap-3">
                    <div className="p-1.5 bg-white/60 rounded-lg shadow-xs">
                        <Star className="w-4 h-4 text-[#D08C60]" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg font-bold text-primary leading-tight tracking-wide">
                            Avakhada Chakra
                        </h3>
                        <p className="text-2xs text-secondary italic font-sans">
                            Foundational classification — compatibility & character attributes
                        </p>
                    </div>
                </div>

                {avakhadaLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-serif text-secondary italic">Consulting the Stars...</p>
                    </div>
                ) : avakhadaError || !avakhadaData ? (
                    <div className="p-8 text-center space-y-3">
                        <div className="bg-red-50 p-3 rounded-xl inline-block">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="text-md font-serif font-bold text-red-900">Unavailable</h4>
                        <p className="text-xs text-red-600">{avakhadaError || "Data not found"}</p>

                    </div>
                ) : (
                    <div className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {AVAKHADA_ITEMS.map((item) => {
                                const value = avakhadaData[item.key] || avakhadaData[item.key.toLowerCase()];
                                if (!value) return null;

                                return (
                                    <div
                                        key={item.key}
                                        className={cn(
                                            "relative bg-gradient-to-br p-4 rounded-xl border hover:shadow-lg transition-all group",
                                            item.color,
                                            "border-antique/30 hover:border-gold-primary/40"
                                        )}
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-refined block">{item.label}</span>
                                                <span className="text-[8px] text-muted-refined/60 font-serif">{item.sanskrit}</span>
                                            </div>
                                            <item.icon className={cn("w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity", item.accent)} />
                                        </div>
                                        {/* Value */}
                                        <div className="font-serif text-base font-bold text-primary leading-tight mb-1" title={value}>
                                            {value}
                                        </div>
                                        {/* Description */}
                                        <div className="text-[9px] text-muted-refined italic leading-snug opacity-60 group-hover:opacity-100 transition-opacity">
                                            {item.desc}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Hamsa Swara (extra field) */}
                            {avakhadaData.hamsa_swara && (
                                <div className="relative bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-4 rounded-xl border border-antique/30 hover:border-gold-primary/40 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-refined block">Hamsa Swara</span>
                                            <span className="text-[8px] text-muted-refined/60 font-serif">हंस स्वर</span>
                                        </div>
                                        <Feather className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity text-sky-600" />
                                    </div>
                                    <div className="font-serif text-base font-bold text-primary leading-tight mb-1">
                                        {avakhadaData.hamsa_swara}
                                    </div>
                                    <div className="text-[9px] text-muted-refined italic leading-snug opacity-60 group-hover:opacity-100 transition-opacity">
                                        Life breath classification
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PanchangaCard({
    label, sanskrit, value, subValue, description, icon: Icon, gradient, iconColor, borderColor
}: {
    label: string;
    sanskrit: string;
    value: string;
    subValue?: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    borderColor: string;
}) {
    return (
        <div className={cn(
            "bg-gradient-to-br rounded-xl p-4 border transition-all hover:shadow-md group",
            gradient, borderColor
        )}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-2xs font-bold uppercase tracking-widest text-muted-refined">{label}</p>
                    <p className="text-2xs text-muted-refined/50 font-serif">{sanskrit}</p>
                </div>
                <div className="p-1.5 bg-white/80 rounded-lg shadow-xs group-hover:shadow-sm transition-shadow">
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>
            <p className="font-serif text-lg font-bold text-primary leading-tight">{value}</p>
            {subValue && (
                <p className="text-2xs text-secondary font-medium mt-0.5">{subValue}</p>
            )}
            <p className="text-2xs text-muted-refined italic mt-2 leading-snug opacity-60 group-hover:opacity-100 transition-opacity">{description}</p>
        </div>
    );
}
