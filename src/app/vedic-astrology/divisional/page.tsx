"use client";

import React, { useState, useEffect } from 'react';
import { Grid3X3, RefreshCw, Loader2, Plus, X, Maximize2, Minimize2, Settings2, House, ChevronDown } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerSettings } from '@/context/AstrologerSettingsContext';
import NorthIndianChart, { ChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import { cn } from "@/lib/utils";
import { clientApi, CHART_METADATA } from '@/lib/api';

import { parseChartData, signIdToName } from '@/lib/chart-helpers';

type GridSize = '2x2' | '2x3' | '3x3';

// Safe degree parsing - handles string/number from API (Keep if needed locally or move to utils if generic)
function parseDegree(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

// Safe degree formatting - DMS format (Keep if needed locally)
function formatDegree(degrees: number | null | undefined): string {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return '';
    const deg = degrees % 30;
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor(((deg - d) * 60 - m) * 60);
    return `${d}°${m}'${s}"`;
}

// Get house-wise planet distribution (Uses standardized logic via helpers if possible, but keep local for now as it does specific formatting)
function getHouseDistribution(chartData: any, ascendantSign: number): Record<number, { planets: string[], signName: string }> {
    const houses: Record<number, { planets: string[], signName: string }> = {};

    for (let i = 1; i <= 12; i++) {
        const signId = ((ascendantSign + i - 2) % 12) + 1;
        houses[i] = { planets: [], signName: signIdToName[signId] || '' };
    }

    const positions = chartData?.planetary_positions || chartData?.planets;
    if (positions) {
        // Reuse standardized logic? For now keep existing but fix sign lookups
        const processPlanet = (key: string, value: any) => {
            const sign = value?.sign || value?.sign_name || "";
            // ... (rest logic can remain or use parsed Planets from helper)
            // Ideally we should use the parsed planets to avoid re-parsing
        };
        // NOTE: Optimization: We can pass the already parsed 'planets' array to this function instead of raw 'chartData'
    }

    // RE-WRITE to use parsed data
    return houses; // Placeholder, see actual implementation below
}

// Optimized version using parsed planets
function getHouseDistributionFromPlanets(planets: Planet[], ascendantSign: number): Record<number, { planets: string[], signName: string }> {
    const houses: Record<number, { planets: string[], signName: string }> = {};

    for (let i = 1; i <= 12; i++) {
        const signId = ((ascendantSign + i - 2) % 12) + 1;
        houses[i] = { planets: [], signName: signIdToName[signId] || '' };
    }

    planets.forEach(p => {
        if (p.name === 'As') return; // Skip Ascendant in the list of planets in house
        const houseNum = ((p.signId - ascendantSign + 12) % 12) + 1;
        const retroStr = p.isRetro ? ' (R)' : '';
        houses[houseNum].planets.push(`${p.name}${p.degree ? ' ' + p.degree : ''}${retroStr}`);
    });

    return houses;
}

const DEFAULT_CHART_SLOTS = ['D1', 'D9', 'D4', 'D7', 'D10', 'D3'];

export default function VedicDivisionalPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { settings } = useAstrologerSettings();

    const [gridSize, setGridSize] = useState<GridSize>('2x3');
    const [chartSlots, setChartSlots] = useState<string[]>(DEFAULT_CHART_SLOTS);
    const [maximizedChart, setMaximizedChart] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState<number | null>(null);
    // Track which charts have house details open (Set for independent toggles)
    const [openHouseDetails, setOpenHouseDetails] = useState<Set<string>>(new Set());
    // Show Add Chart selector
    const [showAddChartSelector, setShowAddChartSelector] = useState(false);

    // Get available divisional charts based on system
    const systemCapabilities = clientApi.getSystemCapabilities(settings.ayanamsa);
    const availableCharts = systemCapabilities.charts.divisional;

    // Grid columns based on size
    const gridCols = gridSize === '2x2' ? 'grid-cols-2' : gridSize === '2x3' ? 'grid-cols-3' : 'grid-cols-3';
    const gridRows = gridSize === '2x2' ? 4 : gridSize === '2x3' ? 6 : 9;

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, isGeneratingCharts]);

    // Get chart data by type - Optimized for O(1) lookup
    const getChartData = React.useCallback((chartType: string) => {
        const activeSystem = settings.ayanamsa.toLowerCase();
        const key = `${chartType}_${activeSystem}`;
        return processedCharts[key]?.chartData || null;
    }, [processedCharts, settings.ayanamsa]);

    // Toggle house details for a specific chart (independent of others)
    const toggleHouseDetails = (chartType: string) => {
        setOpenHouseDetails(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chartType)) {
                newSet.delete(chartType);
            } else {
                newSet.add(chartType);
            }
            return newSet;
        });
    };

    // Replace chart in slot
    const replaceChart = (slotIndex: number, newChartType: string) => {
        const newSlots = [...chartSlots];
        newSlots[slotIndex] = newChartType;
        setChartSlots(newSlots);
        setShowSettings(null);
    };

    // Remove chart from slot
    const removeChart = (slotIndex: number) => {
        const newSlots = chartSlots.filter((_, i) => i !== slotIndex);
        setChartSlots(newSlots);
        setShowSettings(null);
    };

    // Add specific chart with auto-resize logic
    const addChart = (chartType: string) => {
        if (!chartSlots.includes(chartType)) {
            // Check if grid needs expansion
            const currentLimit = gridSize === '2x2' ? 4 : gridSize === '2x3' ? 6 : 9;
            if (chartSlots.length >= currentLimit) {
                if (gridSize === '2x2') {
                    setGridSize('2x3');
                } else if (gridSize === '2x3') {
                    setGridSize('3x3');
                }
                // If 3x3 (9) is full, we append anyway. Consider removing the slice constraint in render if functionality allows, 
                // but for now resizing handles the common 99% case.
            }
            setChartSlots([...chartSlots, chartType]);
        }
        setShowAddChartSelector(false);
    };

    // REMOVED: Auto-fill useEffect. 
    // We now allow the grid to have empty slots for manual filling ("Flexible" behavior).

    // Update slots when grid size changes - REMOVED to prevent "glitch" filling behavior.

    // Get unused charts for add selector
    const unusedCharts = availableCharts.filter(c => !chartSlots.includes(c));

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-[#8B5A2B]">Please select a client to view divisional charts</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-700 pb-20"> {/* Add padding bottom for scrolling */}
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif text-[#3E2A1F] font-black tracking-tight flex items-center gap-2">
                        <Grid3X3 className="w-5 h-5 text-[#D08C60]" />
                        Shodashvarga Matrix
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[#8B5A2B] font-serif text-sm">{clientDetails.name}'s harmonic charts</p>
                        <span className="px-2 py-0.5 bg-[#D08C60]/10 text-[#D08C60] text-[10px] font-bold uppercase rounded-full border border-[#D08C60]/30">
                            {settings.ayanamsa}
                        </span>
                        {isGeneratingCharts && (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/80 text-green-700 text-[10px] font-bold rounded-full border border-green-200 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Generating...
                            </span>
                        )}
                        {isRefreshingCharts && !isGeneratingCharts && (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/80 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Refreshing...
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshCharts}
                        disabled={isLoadingCharts}
                        className="p-2 rounded-lg bg-white border border-[#D08C60]/30 hover:bg-[#D08C60]/10 text-[#8B5A2B] disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-4 h-4", isRefreshingCharts && "animate-spin")} />
                    </button>

                    {/* Grid Size Selector */}
                    <select
                        value={gridSize}
                        onChange={(e) => setGridSize(e.target.value as GridSize)}
                        className="text-xs bg-white border border-[#D08C60]/30 rounded-lg px-2 py-1.5 text-[#8B5A2B] font-bold"
                    >
                        <option value="2x2">2×2 Grid</option>
                        <option value="2x3">2×3 Grid</option>
                        <option value="3x3">3×3 Grid</option>
                    </select>
                </div>
            </header>

            {/* Loading State - Only show if NO data exists */}
            {isLoadingCharts && Object.keys(processedCharts).length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#D08C60] animate-spin mb-4" />
                    <p className="font-serif text-[#8B5A2B]">Loading divisional charts...</p>
                </div>
            )}

            {/* Grid View - Show if we have data, even if refreshing */}
            {Object.keys(processedCharts).length > 0 && (
                <div className={cn(
                    "grid gap-4",
                    maximizedChart ? "grid-cols-1" : gridCols
                )}>
                    {chartSlots.slice(0, gridRows).map((chartType, idx) => {
                        if (maximizedChart && maximizedChart !== chartType) return null;

                        const chartData = getChartData(chartType);
                        const { planets, ascendant } = parseChartData(chartData);
                        const meta = CHART_METADATA[chartType] || { name: chartType, desc: 'Divisional Chart' };
                        const isGenerating = !chartData && isGeneratingCharts;
                        const houseData = chartData ? getHouseDistributionFromPlanets(planets, ascendant) : {};
                        const isHouseDetailsOpen = openHouseDetails.has(chartType);

                        return (
                            <div key={`${chartType}-${idx}`} className={cn(
                                "bg-[#FFFFFa] border border-[#D08C60]/20 rounded-xl p-3 relative group transition-all hover:border-[#D08C60]/50 shadow-sm",
                                maximizedChart === chartType && "col-span-full max-w-2xl mx-auto"
                            )}>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif font-bold text-[#3E2A1F] text-sm truncate">{chartType} - {meta.name}</h3>
                                        <p className="text-[9px] uppercase tracking-wider text-[#8B5A2B] truncate">{meta.desc}</p>
                                    </div>

                                    <div className="flex items-center gap-1 ml-2">
                                        {/* View House Details - Toggle independently */}
                                        {chartData && (
                                            <button
                                                onClick={() => toggleHouseDetails(chartType)}
                                                className={cn(
                                                    "p-1 rounded text-[#8B5A2B] transition-colors",
                                                    isHouseDetailsOpen ? "bg-[#D08C60]/20" : "hover:bg-[#D08C60]/10"
                                                )}
                                                title="House Details"
                                            >
                                                <House className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        {/* Maximize */}
                                        <button
                                            onClick={() => setMaximizedChart(maximizedChart === chartType ? null : chartType)}
                                            className="p-1 hover:bg-[#D08C60]/10 rounded text-[#8B5A2B]"
                                            title="Zoom"
                                        >
                                            {maximizedChart === chartType ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                        </button>

                                        {/* Settings (Replace/Remove) */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowSettings(showSettings === idx ? null : idx)}
                                                className="p-1 hover:bg-[#D08C60]/10 rounded text-[#8B5A2B]"
                                                title="Options"
                                            >
                                                <Settings2 className="w-3.5 h-3.5" />
                                            </button>

                                            {showSettings === idx && (
                                                <div className="absolute right-0 top-7 z-30 bg-white border border-[#D08C60]/30 rounded-lg shadow-xl py-1 min-w-[140px]">
                                                    <div className="px-2 py-1 text-[10px] text-[#8B5A2B]/60 uppercase font-bold border-b border-[#D08C60]/10">Replace With</div>
                                                    <div className="max-h-40 overflow-y-auto">
                                                        {availableCharts.filter(c => !chartSlots.includes(c) || c === chartType).map(chart => (
                                                            <button
                                                                key={chart}
                                                                onClick={() => replaceChart(idx, chart)}
                                                                className={cn(
                                                                    "w-full px-3 py-1.5 text-left text-xs hover:bg-[#D08C60]/10 flex justify-between",
                                                                    chart === chartType && "bg-[#D08C60]/10"
                                                                )}
                                                            >
                                                                <span className="font-bold">{chart}</span>
                                                                <span className="text-[9px] text-[#8B5A2B]/60">{CHART_METADATA[chart]?.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="border-t border-[#D08C60]/10 mt-1 pt-1">
                                                        <button
                                                            onClick={() => removeChart(idx)}
                                                            className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <X className="w-3 h-3" />
                                                            Remove Chart
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Display */}
                                <div className={cn(
                                    "bg-[#FDFBF7] rounded-lg border border-[#D08C60]/10 p-2 flex items-center justify-center",
                                    maximizedChart ? "aspect-square max-w-md mx-auto" : "aspect-square"
                                )}>
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <Loader2 className="w-5 h-5 text-[#D08C60]/50 animate-spin mb-1" />
                                            <p className="text-[10px] text-[#8B5A2B]/60">Generating...</p>
                                        </div>
                                    ) : chartData ? (
                                        <ChartWithPopup
                                            ascendantSign={ascendant}
                                            planets={planets}
                                            className="bg-transparent border-none w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <p className="text-[10px] text-[#8B5A2B]/60">Awaiting data...</p>
                                        </div>
                                    )}
                                </div>

                                {/* House Details Panel - Stays open independently for each chart */}
                                {isHouseDetailsOpen && chartData && (
                                    <div className="mt-3 pt-3 border-t border-[#D08C60]/10 space-y-1">
                                        <div className="text-[10px] font-bold uppercase text-[#8B5A2B]/60 mb-2">House-wise Positions</div>
                                        <div className="grid grid-cols-3 gap-1 text-[9px]">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                                <div key={h} className={cn(
                                                    "px-1.5 py-1 rounded",
                                                    houseData[h]?.planets.length ? "bg-[#D08C60]/10" : "bg-gray-50"
                                                )}>
                                                    <span className="font-bold text-[#3E2A1F]">H{h}</span>
                                                    <span className="ml-1 text-[#8B5A2B]">{houseData[h]?.signName?.substring(0, 3)}</span>
                                                    {houseData[h]?.planets.length > 0 && (
                                                        <div className="text-[8px] text-[#3E2A1F] mt-0.5">
                                                            {houseData[h].planets.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Stats - Ascendant Info (only when house details closed) */}
                                {chartData && !isHouseDetailsOpen && (
                                    <div className="mt-2 flex items-center justify-between text-[9px] text-[#8B5A2B]">
                                        <span>Asc: <strong className="text-[#3E2A1F]">{chartData?.ascendant?.sign || '—'}</strong></span>
                                        <span className="text-[#8B5A2B]/50">{planets.filter(p => p.isRetro).length > 0 ? `${planets.filter(p => p.isRetro).length} Retro` : 'No Retro'}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Chart Button with Selector - FIXED POSITONING */}
            {!isLoadingCharts && !maximizedChart && unusedCharts.length > 0 && (
                <div className="flex justify-center py-2 relative z-50"> {/* Increased Z-Index context */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAddChartSelector(!showAddChartSelector)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#D08C60] text-white rounded-lg text-sm font-medium hover:bg-[#D08C60]/90 shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Add Chart
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showAddChartSelector && "rotate-180")} />
                        </button>

                        {/* Chart Selector Dropdown - Opens UPWARDS now */}
                        {showAddChartSelector && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[60] bg-white border border-[#D08C60]/30 rounded-xl shadow-2xl py-2 min-w-[280px] max-h-60 overflow-y-auto">
                                <div className="px-3 py-1 text-[10px] text-[#8B5A2B]/60 uppercase font-bold border-b border-[#D08C60]/10 mb-1">
                                    Select Chart to Add
                                </div>
                                <div className="grid grid-cols-2 gap-1 px-2">
                                    {unusedCharts.map(chart => (
                                        <button
                                            key={chart}
                                            onClick={() => addChart(chart)}
                                            className="px-3 py-2 text-left text-xs hover:bg-[#D08C60]/10 rounded-lg flex flex-col"
                                        >
                                            <span className="font-bold text-[#3E2A1F]">{chart}</span>
                                            <span className="text-[9px] text-[#8B5A2B]/60">{CHART_METADATA[chart]?.name || 'Chart'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside to close selector */}
            {showAddChartSelector && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowAddChartSelector(false)}
                />
            )}
        </div>
    );
}
