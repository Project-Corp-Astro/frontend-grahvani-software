"use client";

import React, { useState, useEffect } from 'react';
import {
    Gem,
    Sparkles,
    HandHeart,
    Scroll,
    Flame,
    Shield,
    BookOpen,
    Loader2,
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import UpayaDashboard from '@/components/upaya/UpayaDashboard';
import YantraDashboard from '@/components/upaya/YantraDashboard';
import LalKitabDashboard from '@/components/upaya/LalKitabDashboard';
import VedicRemediesDashboard from '@/components/upaya/VedicRemediesDashboard';
import MantraAnalysisDashboard from '@/components/upaya/MantraAnalysisDashboard';

// ============================================================================
// Remedy Type Definitions (Lahiri-Exclusive — 5 Endpoints)
// ============================================================================

interface RemedyTab {
    id: string;
    apiType: string; // What to pass to generateChart
    name: string;
    sanskrit: string;
    description: string;
    icon: React.ReactNode;
}

const REMEDY_TABS: RemedyTab[] = [
    {
        id: 'gemstone',
        apiType: 'remedy:gemstone',
        name: 'Gemstones',
        sanskrit: 'रत्न चिकित्सा',
        description: 'Planetary gemstone prescriptions for strengthening weak planets',
        icon: <Gem className="w-4 h-4" />
    },
    {
        id: 'mantra',
        apiType: 'remedy:mantra',
        name: 'Mantras',
        sanskrit: 'मंत्र साधना',
        description: 'Sacred syllables for planetary propitiation',
        icon: <Flame className="w-4 h-4" />
    },
    {
        id: 'yantra',
        apiType: 'remedy:yantra',
        name: 'Yantra',
        sanskrit: 'यंत्र',
        description: 'Sacred geometric diagrams for cosmic alignment',
        icon: <Shield className="w-4 h-4" />
    },
    {
        id: 'vedic_remedies',
        apiType: 'remedy:vedic_remedies',
        name: 'Vedic Remedies',
        sanskrit: 'वैदिक उपाय',
        description: 'Traditional Vedic remedial prescriptions and rituals',
        icon: <BookOpen className="w-4 h-4" />
    },
    {
        id: 'lal_kitab',
        apiType: 'remedy:lal_kitab',
        name: 'Lal Kitab',
        sanskrit: 'लाल कितब',
        description: 'Unique remedies from the Lal Kitab tradition',
        icon: <Scroll className="w-4 h-4" />
    },
];

// ============================================================================
// Generic Remedy Data Renderer
// ============================================================================
function RemedyDataView({ data, type }: { data: any; type: string }) {
    if (!data) {
        return (
            <div className="p-8 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-primary">No remedy data available for this type.</p>
            </div>
        );
    }

    // Special view for Gemstones (Dashboard style)
    if (type === 'gemstone') {
        return <UpayaDashboard data={data} />;
    }

    // Special view for Yantras (Sadhana Dashboard style)
    if (type === 'yantra') {
        return <YantraDashboard data={data} />;
    }

    // Special view for Lal Kitab (Remedial Dashboard style)
    if (type === 'lal_kit_tab' || type === 'lal_kitab') {
        return <LalKitabDashboard data={data} />;
    }

    // Special view for Vedic Remedies (Royal Purple Dashboard style)
    if (type === 'vedic_remedies' || type === 'vedic') {
        return <VedicRemediesDashboard data={data} />;
    }

    // Special view for Mantra Analysis (Sacred Sadhana Dashboard style)
    if (type === 'mantra') {
        return <MantraAnalysisDashboard data={data} />;
    }

    // Try to extract the actual remedy content from various response formats
    const remedyContent = data.data || data.remedies || data;

    // If it's an object with named keys (common pattern from astro engine)
    if (typeof remedyContent === 'object' && !Array.isArray(remedyContent)) {
        return (
            <div className="space-y-4">
                {Object.entries(remedyContent).map(([key, value]: [string, any]) => {
                    // Skip metadata keys
                    if (['ayanamsa', 'system', 'cached', 'chart_type', 'birth_details'].includes(key)) return null;

                    return (
                        <div key={key} className="bg-white border border-antique rounded-2xl p-5 hover:shadow-md transition-shadow">
                            <h3 className="font-serif font-bold text-primary text-base capitalize mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-gold-primary" />
                                {key.replace(/_/g, ' ')}
                            </h3>
                            {typeof value === 'string' ? (
                                <p className="text-sm text-primary leading-relaxed">{value}</p>
                            ) : typeof value === 'object' && value !== null ? (
                                <div className="space-y-2">
                                    {Array.isArray(value) ? (
                                        value.map((item: any, i: number) => (
                                            <div key={i} className="bg-parchment/50 rounded-xl p-4 border border-antique/50">
                                                {typeof item === 'string' ? (
                                                    <p className="text-sm text-primary">{item}</p>
                                                ) : typeof item === 'object' ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(item).map(([k, v]) => (
                                                            <div key={k} className="text-sm">
                                                                <span className="text-primary text-xs uppercase tracking-wider">{k.replace(/_/g, ' ')}: </span>
                                                                <span className="text-primary font-medium">{String(v)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-primary">{String(item)}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        Object.entries(value).map(([k, v]) => (
                                            <div key={k} className="flex items-start gap-2 text-sm bg-parchment/30 rounded-lg p-3">
                                                <span className="text-primary min-w-[120px] text-xs uppercase tracking-wider font-medium">{k.replace(/_/g, ' ')}</span>
                                                <span className="text-primary">{typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-primary">{String(value)}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // If it's an array
    if (Array.isArray(remedyContent)) {
        return (
            <div className="space-y-3">
                {remedyContent.map((item: any, i: number) => (
                    <div key={i} className="bg-white border border-antique rounded-2xl p-5">
                        {typeof item === 'string' ? (
                            <p className="text-sm text-primary">{item}</p>
                        ) : typeof item === 'object' ? (
                            <div className="space-y-2">
                                {Object.entries(item).map(([k, v]) => (
                                    <div key={k} className="flex items-start gap-2 text-sm">
                                        <span className="text-primary min-w-[120px] text-xs uppercase tracking-wider font-medium">{k.replace(/_/g, ' ')}</span>
                                        <span className="text-primary">{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    }

    // Fallback: render as formatted JSON
    return (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap overflow-auto max-h-96">
                {JSON.stringify(remedyContent, null, 2)}
            </pre>
        </div>
    );
}

// ============================================================================
// Main Remedies Page (Upaya)
// ============================================================================
export default function RemediesPage() {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [activeTab, setActiveTab] = useState('gemstone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remedyData, setRemedyData] = useState<Record<string, any>>({});

    const clientId = clientDetails?.id || '';
    const activeRemedyTab = REMEDY_TABS.find(t => t.id === activeTab)!;

    // Fetch remedy data when tab changes
    useEffect(() => {
        if (!clientId || !activeRemedyTab) return;

        // Skip if already fetched
        if (remedyData[activeTab]) return;

        const fetchRemedy = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await clientApi.generateChart(
                    clientId,
                    activeRemedyTab.apiType,
                    'lahiri'
                );
                setRemedyData(prev => ({
                    ...prev,
                    [activeTab]: result.data || result.chartData || result
                }));
            } catch (err: any) {
                console.error(`[Remedies] Error fetching ${activeTab}:`, err);
                setError(err.message || `Failed to fetch ${activeRemedyTab.name} data`);
            } finally {
                setLoading(false);
            }
        };

        fetchRemedy();
    }, [clientId, activeTab, activeRemedyTab]);

    const handleRefresh = async () => {
        if (!clientId || !activeRemedyTab) return;

        // Clear cached data for this tab and re-fetch
        setRemedyData(prev => {
            const updated = { ...prev };
            delete updated[activeTab];
            return updated;
        });
        setLoading(true);
        setError(null);
        try {
            const result = await clientApi.generateChart(
                clientId,
                activeRemedyTab.apiType,
                'lahiri'
            );
            setRemedyData(prev => ({
                ...prev,
                [activeTab]: result.data || result.chartData || result
            }));
        } catch (err: any) {
            setError(err.message || `Failed to fetch ${activeRemedyTab.name} data`);
        } finally {
            setLoading(false);
        }
    };

    // System check — Remedies are Lahiri-exclusive
    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Gem className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-xl font-serif font-bold text-primary mb-2">Upaya — Lahiri Only</h2>
                <p className="text-primary text-sm max-w-md">
                    Remedial prescriptions are currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                    Please switch to Lahiri from the header dropdown to access remedies.
                </p>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-primary text-sm mb-1">
                    <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" />
                        Kundali
                    </Link>
                    <span>/</span>
                    <span>Upaya (Remedies)</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
                            <Scroll className="w-7 h-7 text-gold-primary" />
                            Upaya — Karmic Prescriptions
                        </h1>
                        <p className="text-sm text-primary mt-1">
                            Remedial measures for <span className="font-medium">{clientDetails.name}</span> based on planetary analysis
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-antique rounded-xl text-sm text-muted hover:text-ink hover:border-gold-primary/30 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Remedy Type Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-parchment rounded-xl border border-antique">
                {REMEDY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-serif font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md"
                                : "text-primary hover:text-primary hover:bg-white/50"
                        )}
                    >
                        {tab.icon}
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Active Tab Description */}
            <div className="bg-gold-primary/5 border border-gold-primary/15 rounded-xl px-5 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-primary/10 rounded-lg flex items-center justify-center text-gold-dark">
                        {activeRemedyTab.icon}
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-primary text-sm">{activeRemedyTab.name}</h3>
                        <p className="text-[10px] text-gold-dark/60 font-medium">{activeRemedyTab.sanskrit}</p>
                        <p className="text-xs text-primary mt-0.5">{activeRemedyTab.description}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-parchment/30 rounded-2xl border border-antique">
                        <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-4" />
                        <p className="text-sm font-serif text-muted italic">Consulting planetary prescriptions...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h3 className="text-red-900 font-bold font-serif mb-1">Prescription Unavailable</h3>
                        <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : remedyData[activeTab] ? (
                    <RemedyDataView data={remedyData[activeTab]} type={activeTab} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-parchment/30 rounded-2xl border border-antique">
                        <Gem className="w-8 h-8 text-primary mb-3" />
                        <p className="text-sm text-primary">Select a remedy type to view prescriptions</p>
                    </div>
                )}
            </div>
        </div>
    );
}
