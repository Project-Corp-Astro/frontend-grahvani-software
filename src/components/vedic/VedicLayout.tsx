"use client";

import React from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useVedicClient } from "@/context/VedicClientContext";
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
    ArrowLeft
} from "lucide-react";

// Unified Professional Navigation for the Consultation Workspace
const VEDIC_NAV_ITEMS: SidebarItem[] = [
    { name: "Overview", path: "/overview", icon: LayoutTemplate },
    { name: "Analytical Workbench", path: "/workbench", icon: LayoutDashboard },
    { name: "Planetary Details", path: "/planets", icon: Compass },
    { name: "Divisional Charts", path: "/divisional", icon: Map },
    { name: "Vimshottari Dasha", path: "/dashas", icon: History },
    { name: "Transits", path: "/transits", icon: Globe },
    { name: "Report Lab", path: "/reports", icon: FileText },
    { name: "Remedies", path: "/remedies", icon: Gem },
    { name: "Notes History", path: "/notes", icon: NotebookPen },
    { name: "Comparison", path: "/comparison", icon: GitCompare },
];


export default function VedicLayout({ children }: { children: React.ReactNode }) {
    const { isClientSet, clientDetails, setClientDetails } = useVedicClient();
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
        <div className="flex h-screen pt-[64px] bg-luxury-radial relative overflow-hidden">
            {/* Subtle Texture Overlay - matching Dashboard Layout */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Unified Professional Sidebar - Fixed Height within Flex Container */}
            {pathname !== "/vedic-astrology" && (
                <aside
                    className="w-full lg:w-72 h-full py-6 px-4 flex flex-col border-r border-[#D08C60]/30 hidden lg:flex relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    style={{
                        background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(255,210,125,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
                    }}
                >

                    {/* CUSTOM PROFILE HEADER - Only when client is active */}
                    {clientDetails ? (
                        <div className="mb-8 px-2 relative z-10 flex flex-col items-center shrink-0">
                            {/* Back Link */}
                            <button
                                onClick={() => setClientDetails(null)}
                                className="self-start flex items-center gap-2 text-[#FFD27D]/60 hover:text-[#FFD27D] text-xs font-serif uppercase tracking-wider mb-8 transition-colors group"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                Back to Archives
                            </button>

                            {/* Avatar Circle */}
                            <div className="relative mb-3 group cursor-pointer" onClick={() => router.push(`/client/${clientDetails.id || '1'}/overview`)}>
                                <div className="w-20 h-20 rounded-full bg-[#2A1810] border border-[#FFD27D]/20 flex items-center justify-center text-[#FFD27D] font-serif text-3xl shadow-[0_0_25px_rgba(255,210,125,0.1)] group-hover:border-[#FFD27D]/50 transition-all">
                                    {clientDetails.name.charAt(0)}
                                </div>
                                {/* Active Dot */}
                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#00C853] border-[3px] border-[#55250F] rounded-full" />
                            </div>

                            {/* Client Name & ID */}
                            <h2 className="text-2xl font-serif font-bold text-white mb-0.5">{clientDetails.name.split(' ')[0]}</h2>
                            <p className="text-xs text-[#FFD27D]/60 font-mono tracking-widest">#{clientDetails.id || '001'}</p>
                        </div>
                    ) : (
                        <div className="mb-8 px-4 relative z-10 shrink-0">
                            <h3 className="text-[10px] font-black text-[#FFD27D]/80 uppercase tracking-[0.3em] font-serif">
                                Analytical Engine
                            </h3>
                        </div>
                    )}

                    <nav className="space-y-1 flex-1 relative z-10 min-h-0 pb-4">
                        {VEDIC_NAV_ITEMS.map((item) => {
                            const href = item.path === "" ? "/vedic-astrology" : `/vedic-astrology${item.path}`;
                            const isActive = pathname === href;

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-gradient-to-r from-[#FFD27D]/25 via-[#FFD27D]/15 to-[#FFD27D]/15 text-white font-bold shadow-[0_0_20px_rgba(255,210,125,0.5),inset_0_0_10px_rgba(255,210,125,0.1)]"
                                            : "text-[#FFF5E6] hover:bg-[#FEFAEA]/10 hover:text-white hover:pl-4"
                                    )}
                                >
                                    {/* Active Indicator Line - Tab Style */}
                                    {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#FFD27D] shadow-[0_0_10px_#FFD27D] rounded-r-sm" />}

                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "text-[#FFD27D] scale-110" : "text-[#FFD27D]/70 group-hover:text-[#FFD27D] group-hover:scale-105")} />
                                        <span className="font-serif text-sm tracking-wide">{item.name}</span>
                                    </div>
                                    {/* {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FFD27D] shadow-[0_0_8px_#FFD27D]" />} */}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>
            )}

            {/* Main Content Area - Scrollable */}
            <main className="flex-1 overflow-y-auto relative z-10 h-full">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-full pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
