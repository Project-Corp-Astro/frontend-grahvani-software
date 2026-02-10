"use client";

import React from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useVedicClient } from "@/context/VedicClientContext";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { SidebarItem } from "@/components/layout/SectionSidebar";
import {
    LayoutDashboard,
    Compass,
    Map,
    History,
    FileText,
    GitCompare,
    LayoutTemplate,
    Orbit,
    Globe,
    Gem,
    NotebookPen,
    User,
    ArrowLeft,
    ChevronDown,
    Shield,
    Layers,
    Sparkles,
    FlaskConical,
    Hash,
    Heart
} from "lucide-react";

// ============================================================================
// Navigation Items with Jyotish Terminology + System Compatibility
// ============================================================================
// systemFilter: which ayanamsa systems should show this item
//   - undefined = show for all systems
//   - ['Lahiri'] = show only for Lahiri
//   - ['KP'] = show only for KP
//   - ['Lahiri', 'Raman', 'Yukteswar'] = show for these systems

interface NavItem extends SidebarItem {
    systemFilter?: string[];
    isOverflow?: boolean; // true = goes into "More" dropdown
}

const VEDIC_NAV_ITEMS: NavItem[] = [
    // ── Primary Navigation (always visible, system-filtered) ──
    { name: "Kundali", path: "/overview", icon: LayoutTemplate },
    { name: "Graha Sthiti", path: "/planets", icon: Compass },
    { name: "Varga Charts", path: "/divisional", icon: Map, systemFilter: ['Lahiri', 'Raman', 'Yukteswar'] },
    { name: "Dasha", path: "/dashas", icon: History },
    { name: "Yoga & Dosha", path: "/yoga-dosha", icon: Sparkles, systemFilter: ['Lahiri'] },
    { name: "Ashtakavarga", path: "/ashtakavarga", icon: Shield, systemFilter: ['Lahiri', 'Raman', 'Yukteswar'] },
    { name: "Shadbala", path: "/shadbala", icon: Orbit, systemFilter: ['Lahiri'] },
    { name: "Gochar", path: "/transits", icon: Globe },
    { name: "Upaya", path: "/remedies", icon: Gem, systemFilter: ['Lahiri'] },
    { name: "KP System", path: "/kp", icon: FlaskConical, systemFilter: ['KP'] },
    { name: "Workbench", path: "/workbench", icon: LayoutDashboard },

    // ── Overflow Navigation (inside "More" dropdown) ──
    { name: "Sudarshan Chakra", path: "/chakras", icon: Layers, isOverflow: true },
    { name: "Compatibility", path: "/comparison", icon: Heart, isOverflow: true },
    { name: "Phala Jyotish", path: "/reports", icon: FileText, isOverflow: true },
    { name: "Notes", path: "/notes", icon: NotebookPen, isOverflow: true },
];

// ============================================================================
// Sub-Header Navigation Bar
// ============================================================================
function VedicSubHeader({ clientDetails, setClientDetails, pathname, router, ayanamsa }: any) {
    const [isMoreOpen, setIsMoreOpen] = React.useState(false);
    const moreRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter nav items based on system compatibility
    const filteredPrimaryItems = VEDIC_NAV_ITEMS.filter(item => {
        if (item.isOverflow) return false; // Skip overflow items
        if (!item.systemFilter) return true; // No filter = show for all
        return item.systemFilter.includes(ayanamsa);
    });

    const filteredOverflowItems = VEDIC_NAV_ITEMS.filter(item => {
        if (!item.isOverflow) return false;
        if (!item.systemFilter) return true;
        return item.systemFilter.includes(ayanamsa);
    });

    return (
        <div
            className="sticky top-14 left-0 right-0 z-40 h-12 bg-header-gradient flex items-center px-4 md:px-6 gap-4"
        >
            {/* Top Border Indicator */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#D08C60] opacity-10" />

            {/* Bottom Ornament */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D08C60] to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />

            {/* Navigation Items */}
            <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto no-scrollbar h-full">
                {filteredPrimaryItems.map((item) => {
                    const href = item.path === "" ? "/vedic-astrology" : `/vedic-astrology${item.path}`;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            className={cn(
                                "flex items-center px-3 py-2 transition-all duration-300 relative group shrink-0 whitespace-nowrap font-serif text-sm font-medium tracking-wide",
                                isActive
                                    ? "text-[#FFD27D] text-shadow-glow"
                                    : "text-white hover:text-[#FFD27D]"
                            )}
                        >
                            <span>{item.name}</span>

                            {/* Active Indicator */}
                            {isActive && (
                                <>
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD27D] to-transparent shadow-[0_0_10px_2px_rgba(255,210,125,0.5)]" />
                                    <span
                                        className="absolute inset-0 -z-10 rounded-lg opacity-20 blur-md pointer-events-none"
                                        style={{ background: 'radial-gradient(ellipse at center, #FFD27D 0%, transparent 70%)' }}
                                    />
                                </>
                            )}
                        </Link>
                    );
                })}

            </nav>

            {/* "More" Dropdown - Outside nav to avoid overflow clipping */}
            {filteredOverflowItems.length > 0 && (
                <div ref={moreRef} className="relative shrink-0 flex items-center h-full">
                    <button
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={cn(
                            "flex items-center gap-1 px-3 py-2 transition-all duration-300 font-serif text-sm font-medium tracking-wide",
                            isMoreOpen
                                ? "text-[#FFD27D]"
                                : "text-white/70 hover:text-[#FFD27D]"
                        )}
                    >
                        <span>More</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isMoreOpen && "rotate-180")} />
                    </button>

                    {isMoreOpen && (
                        <div className="absolute top-full right-0 mt-0 w-48 bg-[#1E1410] border border-[#D08C60]/30 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredOverflowItems.map((item) => {
                                const href = `/vedic-astrology${item.path}`;
                                const isActive = pathname === href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={href}
                                        onClick={() => setIsMoreOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-serif transition-all",
                                            isActive
                                                ? "text-[#FFD27D] bg-[#FFD27D]/10"
                                                : "text-white/80 hover:text-[#FFD27D] hover:bg-white/5"
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4 opacity-60" />}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Client Profile Card (Right) */}
            {clientDetails && (
                <div className="flex items-center gap-4 pl-6 border-l border-[#D08C60]/20 shrink-0 h-10 ml-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push(`/vedic-astrology/overview`)}
                    >
                        <div className="hidden sm:block text-right">
                            <h2 className="text-white font-serif font-semibold text-md tracking-wide group-hover:text-[#FFD27D] transition-colors">{clientDetails.name}</h2>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#2A1810] border border-[#D08C60]/30 flex items-center justify-center text-[#FFD27D] font-serif font-bold text-sm shadow-[0_0_15px_rgba(208,140,96,0.1)] group-hover:border-[#FFD27D]/50 transition-all">
                            {clientDetails.name.charAt(0)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Layout Wrapper
// ============================================================================
export default function VedicLayout({ children }: { children: React.ReactNode }) {
    const { isClientSet, clientDetails, setClientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const pathname = usePathname();
    const router = useRouter();

    // If client is not set and not on the registry page, redirect to registry
    React.useEffect(() => {
        if (!isClientSet && pathname !== "/vedic-astrology") {
            router.push("/vedic-astrology");
        }
    }, [isClientSet, pathname, router]);

    // Show nothing while redirecting
    if (!isClientSet && pathname !== "/vedic-astrology") {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen pt-14 bg-luxury-radial relative">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Sub-Header Hub */}
            {pathname !== "/vedic-astrology" && (
                <VedicSubHeader
                    clientDetails={clientDetails}
                    setClientDetails={setClientDetails}
                    pathname={pathname}
                    router={router}
                    ayanamsa={ayanamsa}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 transition-all duration-500">
                <div className="p-2 lg:p-4 w-full h-full pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
