"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import YogaAnalysisView from '@/components/astrology/YogaAnalysis';
import DoshaAnalysis from '@/components/astrology/DoshaAnalysis';
import {
    Sparkles,
    AlertTriangle,
    Star,
    Shield,
    Zap,
    ArrowLeft,
    Sun,
    Moon,
    Flame,
} from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// Yoga & Dosha Type Definitions (Lahiri-Exclusive Features)
// ============================================================================

interface YogaItem {
    id: string;
    name: string;
    sanskrit: string;
    description: string;
    category: 'benefic' | 'challenging';
    icon: React.ReactNode;
}

interface DoshaItem {
    id: string;
    name: string;
    sanskrit: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
}

const YOGA_TYPES: YogaItem[] = [
    // Benefic Yogas
    { id: 'gaja_kesari', name: 'Gaja Kesari', sanskrit: 'गजकेसरी', description: 'Jupiter in Kendra from Moon — brings wisdom, fortune & fame', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'guru_mangal', name: 'Guru Mangal', sanskrit: 'गुरु मंगल', description: 'Jupiter-Mars conjunction — courage with wisdom', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'budha_aditya', name: 'Budha Aditya', sanskrit: 'बुधादित्य', description: 'Sun-Mercury conjunction — intelligence & communication', category: 'benefic', icon: <Sun className="w-4 h-4" /> },
    { id: 'chandra_mangal', name: 'Chandra Mangal', sanskrit: 'चन्द्र मंगल', description: 'Moon-Mars conjunction — emotional strength & wealth', category: 'benefic', icon: <Moon className="w-4 h-4" /> },
    { id: 'raj_yoga', name: 'Raja Yoga', sanskrit: 'राजयोग', description: 'Kendra-Trikona lord conjunction — power & authority', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'pancha_mahapurusha', name: 'Pancha Mahapurusha', sanskrit: 'पंच महापुरुष', description: 'Planets in own/exalted sign in Kendra — exceptional personality', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'dhan', name: 'Dhana Yoga', sanskrit: 'धनयोग', description: 'Wealth combinations from 2nd, 5th, 9th, 11th lords', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'shubh', name: 'Shubha Yoga', sanskrit: 'शुभयोग', description: 'Benefic planetary combinations for auspicious results', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'kalpadruma', name: 'Kalpadruma', sanskrit: 'कल्पद्रुम', description: 'Wish-fulfilling tree yoga — rare prosperity combination', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'spiritual', name: 'Spiritual Yoga', sanskrit: 'आध्यात्मिक योग', description: 'Combinations indicating spiritual inclination & moksha', category: 'benefic', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'viparitha_raja', name: 'Viparitha Raja', sanskrit: 'विपरीत राजयोग', description: 'Dusthana lords in dusthana — adversity creating fortune', category: 'benefic', icon: <Star className="w-4 h-4" /> },

    // Challenging Yogas
    { id: 'daridra', name: 'Daridra Yoga', sanskrit: 'दरिद्रयोग', description: 'Poverty combinations — 11th lord in 6th/8th/12th', category: 'challenging', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'malefic', name: 'Malefic Yogas', sanskrit: 'पापयोग', description: 'Harmful planetary combinations requiring remedies', category: 'challenging', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'kala_sarpa', name: 'Kala Sarpa Yoga', sanskrit: 'कालसर्पयोग', description: 'All planets hemmed between Rahu-Ketu axis', category: 'challenging', icon: <Flame className="w-4 h-4" /> },
    { id: 'special', name: 'Special Yogas', sanskrit: 'विशेषयोग', description: 'Rare and unique planetary combinations', category: 'benefic', icon: <Sparkles className="w-4 h-4" /> },
];

const DOSHA_TYPES: DoshaItem[] = [
    { id: 'kala_sarpa', name: 'Kala Sarpa Dosha', sanskrit: 'कालसर्प दोष', description: 'All planets between Rahu-Ketu — karmic restriction', severity: 'high', icon: <Flame className="w-4 h-4" /> },
    { id: 'angarak', name: 'Angarak Dosha', sanskrit: 'अंगारक दोष', description: 'Mars-Rahu conjunction — anger, accidents & disputes', severity: 'high', icon: <Zap className="w-4 h-4" /> },
    { id: 'guru_chandal', name: 'Guru Chandal Dosha', sanskrit: 'गुरु चण्डाल दोष', description: 'Jupiter-Rahu conjunction — misguided wisdom', severity: 'medium', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'shrapit', name: 'Shrapit Dosha', sanskrit: 'श्रापित दोष', description: 'Saturn-Rahu conjunction — past-life curse patterns', severity: 'high', icon: <Shield className="w-4 h-4" /> },
    { id: 'sade_sati', name: 'Sade Sati', sanskrit: 'साढ़े साती', description: "Saturn's 7.5 year transit over natal Moon — karmic tests", severity: 'medium', icon: <Moon className="w-4 h-4" /> },
    { id: 'pitra', name: 'Pitra Dosha', sanskrit: 'पितृ दोष', description: 'Sun-Rahu/Saturn affliction — ancestral karmic debt', severity: 'medium', icon: <Sun className="w-4 h-4" /> },
];

type MainTab = 'yogas' | 'doshas';
type YogaCategory = 'all' | 'benefic' | 'challenging';

// ============================================================================
// Main Page Component
// ============================================================================
export default function YogaDoshaPage() {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [mainTab, setMainTab] = useState<MainTab>('yogas');
    const [yogaCategory, setYogaCategory] = useState<YogaCategory>('all');
    const [selectedYoga, setSelectedYoga] = useState<string | null>(null);
    const [selectedDosha, setSelectedDosha] = useState<string | null>(null);

    const clientId = clientDetails?.id || '';

    // Filter yogas by category
    const filteredYogas = yogaCategory === 'all'
        ? YOGA_TYPES
        : YOGA_TYPES.filter(y => y.category === yogaCategory);

    // System check — Yoga/Dosha is Lahiri-exclusive
    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Sparkles className="w-12 h-12 text-muted mb-4" />
                <h2 className="text-xl font-serif font-bold text-ink mb-2">Yoga & Dosha — Lahiri Only</h2>
                <p className="text-muted text-sm max-w-md">
                    Yoga and Dosha analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                    Please switch to Lahiri from the header dropdown to access these features.
                </p>
            </div>
        );
    }

    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Breadcrumb + Title */}
            <div>
                <div className="flex items-center gap-2 text-muted text-sm mb-1">
                    <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" />
                        Kundali
                    </Link>
                    <span>/</span>
                    <span>Yoga & Dosha</span>
                </div>
                <h1 className="text-2xl font-serif font-bold text-ink">Yoga & Dosha Analysis</h1>
                <p className="text-sm text-muted mt-1">
                    Comprehensive planetary combinations for <span className="font-medium">{clientDetails.name}</span>
                </p>
            </div>

            {/* Main Tabs: Yogas / Doshas */}
            <div className="flex gap-2 p-1 bg-parchment rounded-xl border border-antique">
                <button
                    onClick={() => { setMainTab('yogas'); setSelectedDosha(null); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-serif font-medium transition-all",
                        mainTab === 'yogas'
                            ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md"
                            : "text-muted hover:text-ink hover:bg-white/50"
                    )}
                >
                    <Sparkles className="w-4 h-4" />
                    Yogas ({YOGA_TYPES.length})
                </button>
                <button
                    onClick={() => { setMainTab('doshas'); setSelectedYoga(null); }}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-serif font-medium transition-all",
                        mainTab === 'doshas'
                            ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md"
                            : "text-muted hover:text-ink hover:bg-white/50"
                    )}
                >
                    <Shield className="w-4 h-4" />
                    Doshas ({DOSHA_TYPES.length})
                </button>
            </div>

            {/* ═══════════════ YOGAS TAB ═══════════════ */}
            {mainTab === 'yogas' && (
                <div className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex gap-2">
                        {[
                            { id: 'all' as YogaCategory, label: 'All Yogas', count: YOGA_TYPES.length },
                            { id: 'benefic' as YogaCategory, label: 'Benefic (Shubh)', count: YOGA_TYPES.filter(y => y.category === 'benefic').length },
                            { id: 'challenging' as YogaCategory, label: 'Challenging (Ashubh)', count: YOGA_TYPES.filter(y => y.category === 'challenging').length },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setYogaCategory(cat.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-medium transition-all border",
                                    yogaCategory === cat.id
                                        ? "bg-gold-primary/10 border-gold-primary/30 text-gold-dark font-bold"
                                        : "bg-white border-antique text-muted hover:border-gold-primary/20"
                                )}
                            >
                                {cat.label} ({cat.count})
                            </button>
                        ))}
                    </div>

                    {/* Yoga Selection Grid */}
                    {!selectedYoga ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredYogas.map(yoga => (
                                <button
                                    key={yoga.id}
                                    onClick={() => setSelectedYoga(yoga.id)}
                                    className={cn(
                                        "group text-left p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg",
                                        yoga.category === 'benefic'
                                            ? "bg-white border-antique hover:border-gold-primary/40 hover:bg-gold-primary/5"
                                            : "bg-white border-red-100 hover:border-red-300 hover:bg-red-50/30"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                            yoga.category === 'benefic'
                                                ? "bg-gold-primary/10 text-gold-dark"
                                                : "bg-red-50 text-red-500"
                                        )}>
                                            {yoga.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-serif font-bold text-ink text-sm group-hover:text-gold-dark transition-colors">
                                                {yoga.name}
                                            </h3>
                                            <p className="text-[10px] text-gold-dark/60 font-medium mb-1">{yoga.sanskrit}</p>
                                            <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{yoga.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Selected Yoga Detail View */
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedYoga(null)}
                                className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to all yogas
                            </button>
                            <YogaAnalysisView
                                clientId={clientId}
                                yogaType={selectedYoga}
                                ayanamsa="lahiri"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════ DOSHAS TAB ═══════════════ */}
            {mainTab === 'doshas' && (
                <div className="space-y-4">
                    {!selectedDosha ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DOSHA_TYPES.map(dosha => (
                                <button
                                    key={dosha.id}
                                    onClick={() => setSelectedDosha(dosha.id)}
                                    className="group text-left p-5 rounded-2xl bg-white border border-red-100 hover:border-red-300 hover:bg-red-50/20 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            dosha.severity === 'high'
                                                ? "bg-red-100 text-red-600"
                                                : dosha.severity === 'medium'
                                                    ? "bg-amber-100 text-amber-600"
                                                    : "bg-orange-50 text-orange-500"
                                        )}>
                                            {dosha.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-serif font-bold text-ink text-base group-hover:text-red-700 transition-colors">
                                                    {dosha.name}
                                                </h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                                    dosha.severity === 'high'
                                                        ? "bg-red-100 text-red-700"
                                                        : dosha.severity === 'medium'
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-orange-50 text-orange-600"
                                                )}>
                                                    {dosha.severity}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gold-dark/60 font-medium mb-1">{dosha.sanskrit}</p>
                                            <p className="text-xs text-muted leading-relaxed">{dosha.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Selected Dosha Detail View */
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedDosha(null)}
                                className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to all doshas
                            </button>
                            <DoshaAnalysis
                                clientId={clientId}
                                doshaType={selectedDosha as any}
                                ayanamsa="lahiri"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
