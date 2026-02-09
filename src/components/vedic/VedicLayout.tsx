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
    Sparkles
} from "lucide-react";

// Unified Professional Navigation for the Consultation Workspace
const VEDIC_NAV_ITEMS: SidebarItem[] = [
    { name: "Overview", path: "/overview", icon: LayoutTemplate },
    { name: "Analytical Workbench", path: "/workbench", icon: LayoutDashboard },
    { name: "KP System", path: "/kp", icon: Sparkles },
    { name: "Planetary Details", path: "/planets", icon: Compass },
    { name: "Divisional Charts", path: "/divisional", icon: Map },
    { name: "Ashtakavarga", path: "/ashtakavarga", icon: Shield },
    { name: "Dasha Systems", path: "/dashas", icon: History },
    { name: "Chakras", path: "/chakras", icon: Layers },
    { name: "Transits", path: "/transits", icon: Globe },
    { name: "Report Lab", path: "/reports", icon: FileText },
    { name: "Remedies", path: "/remedies", icon: Gem },
    { name: "Notes History", path: "/notes", icon: NotebookPen },
    { name: "Comparison", path: "/comparison", icon: GitCompare },
];

// Horizontal Sub-Header Hub for Consultation Workspace
function VedicSubHeader({ clientDetails, setClientDetails, pathname, router, ayanamsa }: any) {
    const [isMoreOpen, setIsMoreOpen] = React.useState(false);

    // Filter nav items - only show KP System when KP is selected
    const filteredNavItems = VEDIC_NAV_ITEMS.filter(item => {
        if (item.path === '/kp') return ayanamsa === 'KP';
        return true;
    });

    return (
        <div
            className="sticky top-14 left-0 right-0 z-40 h-12 bg-header-gradient flex items-center px-4 md:px-6 gap-4"
        >
            {/* Top Border Indicator (Matching GlobalHeader) */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#D08C60] opacity-10" />

            {/* Bottom Ornament (Matching GlobalHeader) */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D08C60] to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />

            {/* 1. Navigation Items (Left/Center) */}
            <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto no-scrollbar h-full">
                {filteredNavItems.map((item) => {
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

                            {/* Active Indicator (Matching GlobalHeader exactly) */}
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
                    )
                })}
            </nav>

            {/* 2. Client Profile Card (Right) */}
            {
                clientDetails && (
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
                )
            }
        </div >
    );
}

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

            {/* Sub-Header Hub - Desktop only for now */}
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
