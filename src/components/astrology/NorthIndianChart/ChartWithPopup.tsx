"use client";

import React, { useState, useRef, useEffect } from 'react';
import NorthIndianChart, { Planet } from './NorthIndianChart';
import { X, Star, Orbit, Sparkles } from 'lucide-react';
import { getHouseDetails } from '@/data/house-data';
import { cn } from '@/lib/utils';

interface ChartWithPopupProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    preserveAspectRatio?: string;
    showDegrees?: boolean;
}

import { createPortal } from 'react-dom';

export default function ChartWithPopup({ planets, ascendantSign, className = "", preserveAspectRatio, showDegrees = true }: ChartWithPopupProps) {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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

            // Convert SVG coordinates (0-400) to viewport pixels
            const xPercent = center.x / 400;
            const yPercent = center.y / 400;

            const clientX = rect.left + (xPercent * rect.width);
            const clientY = rect.top + (yPercent * rect.height);

            setPopupPosition({ x: clientX, y: clientY });
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

    // Smart Positioning Logic
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Decide side based on horizontal position (split screen in half)
    const isRightSide = popupPosition.x > viewportWidth / 2;

    // Calculate top position, clamping to keep inside viewport
    const POPUP_HEIGHT = 280; // Compact height
    const GAP = 25; // More breathing room from cursor

    let topPos = popupPosition.y - (POPUP_HEIGHT / 2);
    // Clamp top
    if (topPos < GAP) topPos = GAP;
    // Clamp bottom
    if (topPos + POPUP_HEIGHT > viewportHeight - GAP) {
        topPos = viewportHeight - POPUP_HEIGHT - GAP;
    }

    const style: React.CSSProperties = {
        top: Math.max(GAP, Math.min(topPos, viewportHeight - POPUP_HEIGHT - GAP)),
        position: 'fixed',
        zIndex: 9999 // Ensure it's above everything globally
    };

    if (isRightSide) {
        style.right = (viewportWidth - popupPosition.x) + GAP;
    } else {
        style.left = popupPosition.x + GAP;
    }


    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <NorthIndianChart
                planets={planets}
                ascendantSign={ascendantSign}
                preserveAspectRatio={preserveAspectRatio}
                onHouseClick={handleHouseClick}
                showDegrees={showDegrees}
            />

            {/* Portal Overlay Popup */}
            {mounted && selectedHouse && houseDetails && createPortal(
                <>
                    {/* Backdrop - Transparent but clickable to close */}
                    <div
                        className="fixed inset-0 z-[9990] cursor-default"
                        onClick={closePopup}
                        aria-hidden="true"
                    />

                    {/* Popup Card - Compact & Glassmorphic */}
                    <div
                        className="w-64 bg-white/95 backdrop-blur-md border border-gold-primary/30 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200"
                        style={style}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Close Button - Minimal */}
                        <button
                            onClick={closePopup}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold-dark transition-colors shadow-sm z-10"
                            aria-label="Close popup"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        {/* Header: House Number & Name */}
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-antique/40">
                            <div className="w-8 h-8 rounded-lg bg-gold-primary flex items-center justify-center text-white font-serif font-bold text-base shadow-sm shrink-0">
                                {selectedHouse}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-serif font-bold text-ink text-base leading-tight truncate">{houseDetails.name}</h3>
                                <p className="text-[9px] text-muted uppercase tracking-wider font-medium truncate">
                                    {houseDetails.sign.name}
                                </p>
                            </div>
                        </div>

                        {/* Sign Info - Compact Row */}
                        <div className="flex items-center justify-between bg-parchment/40 rounded-lg p-2 mb-3 border border-antique/30">
                            <div className="flex items-center gap-2">
                                <div className="text-xl leading-none">{houseDetails.sign.symbol}</div>
                                <div>
                                    <div className="text-[10px] font-bold text-ink leading-tight">{houseDetails.sign.rulingPlanet}</div>
                                    <div className="text-[8px] text-muted leading-tight">Ruler</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-medium text-ink">{houseDetails.sign.element}</div>
                                <div className="text-[8px] text-muted">{houseDetails.sign.quality}</div>
                            </div>
                        </div>

                        {/* Planets in House - Simplified List */}
                        {planetsInHouse.length > 0 ? (
                            <div className="">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Sparkles className="w-3 h-3 text-gold-primary" />
                                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Planets Here</span>
                                </div>
                                <div className="space-y-1">
                                    {planetsInHouse.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors border border-transparent hover:border-gold-primary/20">
                                            <span className="font-serif font-bold text-ink">{p.name} {p.isRetro && <span className="text-red-500 ml-0.5 text-[9px]">(R)</span>}</span>
                                            <span className="font-mono text-[10px] text-ink/70">
                                                {p.degree}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-2 text-center text-[10px] text-muted italic bg-slate-50 rounded-lg border border-slate-100">
                                Empty House
                            </div>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
