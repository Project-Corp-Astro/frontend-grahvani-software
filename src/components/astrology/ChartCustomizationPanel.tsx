"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAstrologerStore, ChartStyle, ChartColorTheme } from '@/store/useAstrologerStore';
import { Palette, Layout, HelpCircle, X, ChevronDown, BookOpen, Star, Sparkles } from 'lucide-react';

// Color themes with their color palettes
export const CHART_COLOR_THEMES: Record<ChartColorTheme, {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    preview: string[];
}> = {
    classic: {
        name: 'Classic',
        primary: '#D08C60',
        secondary: '#3E2A1F',
        accent: '#8B5A2B',
        preview: ['#D08C60', '#3E2A1F', '#FFFDF9']
    },
    modern: {
        name: 'Modern',
        primary: '#6366F1',
        secondary: '#1E1B4B',
        accent: '#A5B4FC',
        preview: ['#6366F1', '#1E1B4B', '#EEF2FF']
    },
    royal: {
        name: 'Royal',
        primary: '#9333EA',
        secondary: '#581C87',
        accent: '#C084FC',
        preview: ['#9333EA', '#581C87', '#FAF5FF']
    },
    earth: {
        name: 'Earth',
        primary: '#059669',
        secondary: '#064E3B',
        accent: '#34D399',
        preview: ['#059669', '#064E3B', '#ECFDF5']
    },
    ocean: {
        name: 'Ocean',
        primary: '#0EA5E9',
        secondary: '#0C4A6E',
        accent: '#38BDF8',
        preview: ['#0EA5E9', '#0C4A6E', '#F0F9FF']
    }
};

// Educational content for each divisional chart
export const VARGA_EDUCATION: Record<string, {
    purpose: string;
    keyPlanets: string[];
    significance: string;
    tip: string;
}> = {
    'D1': {
        purpose: 'Main birth chart showing overall life patterns',
        keyPlanets: ['Lagna Lord', 'Moon', 'Sun'],
        significance: 'The foundation chart - all other vargas derive from this',
        tip: 'Strong D1 indicates resilient physical constitution'
    },
    'D2': {
        purpose: 'Wealth accumulation and financial prospects',
        keyPlanets: ['Jupiter', 'Venus', '2nd Lord'],
        significance: 'Sun Hora = self-earned, Moon Hora = inherited wealth',
        tip: 'More planets in Sun Hora = financial independence'
    },
    'D3': {
        purpose: 'Courage, valor, siblings, and short journeys',
        keyPlanets: ['Mars', 'Mercury', '3rd Lord'],
        significance: 'Shows communication skills and artistic talents',
        tip: 'Strong Mars here = natural leadership qualities'
    },
    'D4': {
        purpose: 'Properties, vehicles, fixed assets, and fortune',
        keyPlanets: ['Mars', 'Venus', '4th Lord'],
        significance: 'Indicates ancestral property and real estate luck',
        tip: 'Benefics in 4th house = multiple properties'
    },
    'D7': {
        purpose: 'Children, progeny, and creative output',
        keyPlanets: ['Jupiter', 'Sun', '5th Lord'],
        significance: 'Primary chart for analyzing childbirth prospects',
        tip: 'Jupiter in own/exalted sign = blessed with children'
    },
    'D9': {
        purpose: 'Marriage, spouse, and dharmic path',
        keyPlanets: ['Venus', 'Jupiter', '7th Lord'],
        significance: 'Most important varga after D1 - shows soul\'s true nature',
        tip: 'Compare D1 and D9 positions for accurate predictions'
    },
    'D10': {
        purpose: 'Career, profession, and public recognition',
        keyPlanets: ['Sun', 'Saturn', 'Mercury', '10th Lord'],
        significance: 'Shows type of profession and career heights',
        tip: 'Strong Sun = government/leadership roles'
    },
    'D12': {
        purpose: 'Parents, lineage, and ancestral karma',
        keyPlanets: ['Sun (Father)', 'Moon (Mother)'],
        significance: 'Sun for father, Moon for mother analysis',
        tip: '4th house = mother, 9th house = father'
    },
    'D16': {
        purpose: 'Vehicles, conveyances, and material comforts',
        keyPlanets: ['Venus', 'Mars', '4th Lord'],
        significance: 'Luxury items and modes of transportation',
        tip: 'Strong Venus = luxury vehicles and comforts'
    },
    'D20': {
        purpose: 'Spiritual progress and religious inclinations',
        keyPlanets: ['Jupiter', 'Ketu', 'Moon'],
        significance: 'Shows spiritual practices and devotion',
        tip: 'Jupiter-Ketu connection = spiritual awakening'
    },
    'D24': {
        purpose: 'Education, learning, and knowledge acquisition',
        keyPlanets: ['Mercury', 'Jupiter', '4th Lord'],
        significance: 'Academic achievements and intellectual pursuits',
        tip: 'Strong Mercury = excellence in studies'
    },
    'D27': {
        purpose: 'Physical strength, stamina, and vitality',
        keyPlanets: ['Mars', 'Sun', 'Lagna Lord'],
        significance: 'Overall body strength and athletic ability',
        tip: 'Used in martial arts and sports astrology'
    },
    'D30': {
        purpose: 'Evils, misfortunes, and obstacles',
        keyPlanets: ['Saturn', 'Rahu', 'Mars'],
        significance: 'Shows areas of life prone to difficulties',
        tip: 'Weak malefics here = fewer obstacles'
    },
    'D40': {
        purpose: 'Maternal side legacy and inheritance',
        keyPlanets: ['Moon', 'Venus', '4th Lord'],
        significance: 'Property and wealth from mother\'s side',
        tip: 'Strong Moon = good maternal inheritance'
    },
    'D45': {
        purpose: 'Paternal side legacy and inheritance',
        keyPlanets: ['Sun', 'Jupiter', '9th Lord'],
        significance: 'Property and wealth from father\'s side',
        tip: 'Strong Sun = good paternal legacy'
    },
    'D60': {
        purpose: 'Past life karma and subtle influences',
        keyPlanets: ['Saturn', 'Rahu', 'Ketu'],
        significance: 'Most subtle varga - shows past life impressions',
        tip: 'Used only by advanced practitioners'
    }
};

interface ChartCustomizationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedChart?: string;
    className?: string;
}

export default function ChartCustomizationPanel({ isOpen, onClose, selectedChart, className }: ChartCustomizationPanelProps) {
    const { chartStyle, setChartStyle, chartColorTheme, setChartColorTheme } = useAstrologerStore();
    const [activeTab, setActiveTab] = useState<'style' | 'colors' | 'learn'>('style');

    const education = selectedChart ? VARGA_EDUCATION[selectedChart] : null;

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm",
            className
        )}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#3E2A1F] to-[#5C4033]">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <h2 className="text-lg font-serif font-bold text-white">
                            {selectedChart ? `${selectedChart} Settings` : 'Chart Customization'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#E8DDD0]">
                    <button
                        onClick={() => setActiveTab('style')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                            activeTab === 'style' ? "text-[#D08C60] border-b-2 border-[#D08C60] bg-[#FAF8F5]" : "text-[#8B5A2B] hover:bg-[#FAF8F5]"
                        )}
                    >
                        <Layout className="w-4 h-4" /> Chart Style
                    </button>
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                            activeTab === 'colors' ? "text-[#D08C60] border-b-2 border-[#D08C60] bg-[#FAF8F5]" : "text-[#8B5A2B] hover:bg-[#FAF8F5]"
                        )}
                    >
                        <Palette className="w-4 h-4" /> Colors
                    </button>
                    {education && (
                        <button
                            onClick={() => setActiveTab('learn')}
                            className={cn(
                                "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                                activeTab === 'learn' ? "text-[#D08C60] border-b-2 border-[#D08C60] bg-[#FAF8F5]" : "text-[#8B5A2B] hover:bg-[#FAF8F5]"
                            )}
                        >
                            <BookOpen className="w-4 h-4" /> Learn
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 max-h-[400px] overflow-y-auto">
                    {activeTab === 'style' && (
                        <div className="space-y-4">
                            <p className="text-sm text-[#8B5A2B]">Select your preferred chart layout style:</p>

                            <div className="grid grid-cols-2 gap-3">
                                {(['North Indian', 'South Indian'] as ChartStyle[]).map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setChartStyle(style)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all text-left",
                                            chartStyle === style
                                                ? "border-[#D08C60] bg-[#D08C60]/10"
                                                : "border-[#E8DDD0] hover:border-[#D08C60]/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {chartStyle === style && <Star className="w-4 h-4 text-[#D08C60] fill-[#D08C60]" />}
                                            <span className="font-bold text-[#3E2A1F]">{style}</span>
                                        </div>
                                        <p className="text-xs text-[#8B5A2B]">
                                            {style === 'North Indian'
                                                ? 'Diamond shape with fixed houses. Ascendant always at top.'
                                                : 'Square grid where signs are fixed. Widely used in South India.'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'colors' && (
                        <div className="space-y-4">
                            <p className="text-sm text-[#8B5A2B]">Choose a color theme for your charts:</p>

                            <div className="grid grid-cols-1 gap-2">
                                {(Object.entries(CHART_COLOR_THEMES) as [ChartColorTheme, typeof CHART_COLOR_THEMES['classic']][]).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => setChartColorTheme(key)}
                                        className={cn(
                                            "p-3 rounded-xl border-2 transition-all flex items-center justify-between",
                                            chartColorTheme === key
                                                ? "border-[#D08C60] bg-[#D08C60]/10"
                                                : "border-[#E8DDD0] hover:border-[#D08C60]/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {chartColorTheme === key && <Star className="w-4 h-4 text-[#D08C60] fill-[#D08C60]" />}
                                            <span className="font-bold text-[#3E2A1F]">{theme.name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {theme.preview.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'learn' && education && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-[#FAF8F5] to-[#F5EDE3] rounded-xl border border-[#E8DDD0]">
                                <h3 className="font-bold text-[#3E2A1F] mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#D08C60]" />
                                    Purpose of {selectedChart}
                                </h3>
                                <p className="text-sm text-[#5C4033]">{education.purpose}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                                    <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Key Planets</h4>
                                    <p className="text-sm text-blue-700">{education.keyPlanets.join(', ')}</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                                    <h4 className="text-xs font-bold text-purple-800 uppercase mb-1">Significance</h4>
                                    <p className="text-sm text-purple-700">{education.significance}</p>
                                </div>
                            </div>

                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
                                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold text-amber-800 uppercase">Pro Tip</h4>
                                    <p className="text-sm text-amber-700">{education.tip}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-[#FAF8F5] border-t border-[#E8DDD0] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#D08C60] text-white rounded-lg text-sm font-medium hover:bg-[#C07A50] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
