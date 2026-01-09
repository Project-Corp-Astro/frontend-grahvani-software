"use client";

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useVedicClient } from "@/context/VedicClientContext";
import { SidebarItem } from "@/components/layout/SectionSidebar";
import ClientDetailsForm from "./ClientDetailsForm";
import {
    LayoutDashboard,
    Compass,
    Star,
    Map,
    Edit2,
    History,
    FileText,
    GitCompare,
    LayoutTemplate,
    Orbit,
    X
} from "lucide-react";

// Unified Professional Navigation for the Consultation Workspace
const VEDIC_NAV_ITEMS: SidebarItem[] = [
    { name: "Overview", path: "/overview", icon: LayoutTemplate },
    { name: "Analytical Workbench", path: "", icon: LayoutDashboard }, // Base path is the workbench
    { name: "Planetary Details", path: "/planets", icon: Compass },
    { name: "Divisional Charts", path: "/divisional", icon: Map },
    { name: "Vimshottari Dasha", path: "/dashas", icon: History },
    { name: "Report Lab", path: "/reports", icon: FileText },
    { name: "Comparison Engine", path: "/comparison", icon: GitCompare },
];

export default function VedicLayout({ children }: { children: React.ReactNode }) {
    const { isClientSet, clientDetails, setClientDetails } = useVedicClient();
    const pathname = usePathname();
    const [isEditing, setIsEditing] = React.useState(false);

    // If client is not set, show the form in fullpage
    if (!isClientSet) {
        return (
            <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-luxury-radial">
                <ClientDetailsForm />
            </div>
        );
    }

    // Interactive element to edit client details or switch client
    const ClientInfoCard = () => (
        <div className="mb-8 px-4 py-5 rounded-[2rem] bg-gradient-to-br from-[#FFD27D]/5 to-transparent border border-[#D08C60]/20 relative group shadow-2xl">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD27D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

            <button
                onClick={() => setIsEditing(true)}
                title="Edit Details"
                className="absolute top-4 right-4 p-2 text-[#D08C60] hover:text-[#FFD27D] hover:bg-[#D08C60]/10 rounded-xl transition-all z-10"
            >
                <Edit2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D08C60] to-[#1A0A05] border border-[#FFD27D]/40 flex items-center justify-center text-[#FFD27D] font-serif font-bold text-2xl shadow-xl ring-4 ring-[#D08C60]/5">
                    {clientDetails?.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-white font-serif font-bold text-lg leading-tight tracking-tight">{clientDetails?.name}</h3>
                    <p className="text-[#D08C60] text-[10px] font-serif uppercase tracking-[0.2em] font-black mt-1 opacity-60">Consultation Active</p>
                </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#D08C60]/10">
                <div className="flex justify-between text-[11px] text-white/50 font-serif uppercase tracking-[0.2em] relative z-10">
                    <span>{clientDetails?.dateOfBirth}</span>
                    <span className="text-[#FFD27D] opacity-40">•</span>
                    <span>{clientDetails?.timeOfBirth}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-luxury-radial relative">
            {/* Subtle Texture Overlay - matching Dashboard Layout */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Unified Professional Sidebar - Matching Dashboard SectionSidebar */}
            <aside
                className="w-full lg:w-72 h-full py-6 px-4 flex flex-col border-r border-[#D08C60]/30 hidden lg:flex relative z-10"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255,210,125,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
                }}
            >

                <div className="relative z-10">
                    <ClientInfoCard />
                </div>

                <div className="mb-4 px-4 relative z-10">
                    <h3 className="text-[10px] font-black text-[#D08C60]/50 uppercase tracking-[0.3em] font-serif">
                        Analytical Engine
                    </h3>
                </div>

                <nav className="space-y-1 flex-1 relative z-10">
                    {VEDIC_NAV_ITEMS.map((item) => {
                        const href = item.path === "" ? "/vedic-astrology" : `/vedic-astrology${item.path}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.name}
                                href={href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-[#FEFAEA]/10 text-white font-bold shadow-sm border border-[#D08C60]/50"
                                        : "text-[#FEFAEA]/70 hover:bg-[#FEFAEA]/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#FFD27D]" : "text-[#D08C60] group-hover:text-[#FFD27D]")} />
                                    <span className="font-serif text-sm tracking-wide">{item.name}</span>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FFD27D]" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto px-4 relative z-10">
                    <button
                        onClick={() => setClientDetails(null)}
                        className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400/60 hover:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        End Consultation session
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Matching Dashboard */}
            <main className="flex-1 overflow-auto relative z-10">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Editing Modal Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <ClientDetailsForm onSuccess={() => setIsEditing(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
