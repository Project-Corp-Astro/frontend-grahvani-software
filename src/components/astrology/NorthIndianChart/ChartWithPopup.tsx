"use client";

import React, { useState, useRef } from 'react';
import NorthIndianChart, { Planet } from './NorthIndianChart';
import { X, Star, Orbit, Sparkles } from 'lucide-react';
import { getHouseDetails } from '@/data/house-data';
import { cn } from '@/lib/utils';

interface ChartWithPopupProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
}

export default function ChartWithPopup({ planets, ascendantSign, className = "" }: ChartWithPopupProps) {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // House center positions (matching NorthIndianChart houseCenters)
    const houseCenters: Record<number, { x: number; y: number }> = {
        1: { x: 200, y: 105 },
        2: { x: 105, y: 45 },
        3: { x: 45, y: 105 },
        4: { x: 105, y: 200 },
        5: { x: 45, y: 295 },
        6: { x: 105, y: 355 },
        7: { x: 200, y: 295 },
        8: { x: 295, y: 355 },
        9: { x: 355, y: 295 },
        10: { x: 295, y: 200 },
        11: { x: 355, y: 105 },
        12: { x: 295, y: 45 },
    };

    const handleHouseClick = (houseNum: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const center = houseCenters[houseNum] || { x: 200, y: 200 };

            // Convert SVG coordinates (0-400) to container percentages
            const xPercent = center.x / 400;
            const yPercent = center.y / 400;

            // Calculate pixel position relative to container
            const x = xPercent * rect.width;
            const y = yPercent * rect.height;

            setPopupPosition({ x, y });
            setSelectedHouse(houseNum);
        }
    };

    const closePopup = () => setSelectedHouse(null);

    const houseDetails = selectedHouse ? getHouseDetails(selectedHouse, ascendantSign) : null;
    const planetsInHouse = selectedHouse
        ? planets
            .filter(p => (p.house ? p.house === selectedHouse : p.signId === ((ascendantSign + selectedHouse - 2) % 12) + 1))
            .sort((a, b) => a.degree.localeCompare(b.degree))
        : [];

    // Determine popup position (left or right of click point)
    const popupSide = popupPosition.x > 200 ? 'left' : 'right';

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <NorthIndianChart
                planets={planets}
                ascendantSign={ascendantSign}
                onHouseClick={handleHouseClick}
            />

            {/* Inline Popup */}
            {selectedHouse && houseDetails && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={closePopup}
                    />

                    {/* Popup Card */}
                    <div
                        className={cn(
                            "absolute z-50 w-72 bg-softwhite border-2 border-gold-primary/40 rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-300",
                            popupSide === 'left' ? "right-[60%]" : "left-[60%]"
                        )}
                        style={{
                            top: `${Math.max(10, Math.min(popupPosition.y - 100, 60))}%`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold-dark transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gold-primary flex items-center justify-center text-white font-serif font-bold text-lg">
                                {selectedHouse}
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-ink text-lg leading-tight">{houseDetails.name}</h3>
                                <p className="text-[10px] text-gold-dark uppercase tracking-wider font-bold">
                                    {houseDetails.sign.name} {houseDetails.sign.symbol}
                                </p>
                            </div>
                        </div>

                        {/* Sign Info */}
                        <div className="bg-parchment rounded-xl p-3 mb-3 border border-antique">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-gold-primary" />
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">Sign</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{houseDetails.sign.symbol}</span>
                                <div>
                                    <p className="font-serif font-bold text-ink">{houseDetails.sign.name}</p>
                                    <p className="text-[10px] text-muted">{houseDetails.sign.element} • {houseDetails.sign.quality}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-body">
                                <Orbit className="w-3 h-3 text-gold-dark" />
                                <span>Ruler: <strong>{houseDetails.sign.rulingPlanet}</strong></span>
                            </div>
                        </div>

                        {/* Planets in House */}
                        {planetsInHouse.length > 0 ? (
                            <div className="bg-white/50 rounded-xl p-3 border border-antique">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-gold-primary" />
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Planets</span>
                                </div>
                                <div className="space-y-1">
                                    {planetsInHouse.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-antique/30 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif font-bold text-ink">{p.name} {p.isRetro && '(R)'}</span>
                                            </div>
                                            <span className="font-mono text-xs text-ink font-medium bg-gold-primary/10 px-1.5 py-0.5 rounded">
                                                {p.degree}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-2 text-center text-xs text-muted italic bg-parchment/50 rounded-lg border border-antique/30">
                                No planets in this house
                            </div>
                        )}

                    </div>
                </>
            )}
        </div>
    );
}
