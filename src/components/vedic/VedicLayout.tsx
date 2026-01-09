"use client";

import React from "react";
import { useVedicClient } from "@/context/VedicClientContext";
import ClientDetailsForm from "./ClientDetailsForm";
import SectionSidebar, { SidebarItem } from "@/components/layout/SectionSidebar";
import { LayoutDashboard, Compass, Star, Map, Edit2, History } from "lucide-react";
import Link from 'next/link';

// Sample features for the sidebar
const VEDIC_NAV_ITEMS: SidebarItem[] = [
    { name: "Chart Overview", path: "/vedic-astrology", icon: LayoutDashboard },
    { name: "Dashas", path: "dashas", icon: History },
    { name: "Divisional Charts", path: "divisional", icon: Map },
    { name: "Planetary Details", path: "planets", icon: Compass },
    { name: "Numerology", path: "numerology", icon: Star },
];

export default function VedicLayout({ children }: { children: React.ReactNode }) {
    const { isClientSet, clientDetails, setClientDetails } = useVedicClient();

    const [isEditing, setIsEditing] = React.useState(false);

    // If client is not set OR we are editing, show the form
    if (!isClientSet || isEditing) {
        return (
            <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-[#1A0F0A]">
                <ClientDetailsForm onSuccess={() => setIsEditing(false)} />
            </div>
        );
    }

    // Interactive element to edit client details or switch client
    // This could be placed in the sidebar at the top
    const ClientInfoCard = () => (
        <div className="mb-6 px-3 py-4 rounded-xl bg-[#FEFAEA]/5 border border-[#D08C60]/20 relative group">
            <button
                onClick={() => setIsEditing(true)}
                title="Edit Details"
                className="absolute top-2 right-2 p-1.5 text-[#D08C60] hover:text-[#FEFAEA] hover:bg-[#D08C60]/20 rounded-lg transition-colors"
            >
                <Edit2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D08C60] to-[#8B4826] flex items-center justify-center text-white font-serif font-bold text-lg">
                    {clientDetails?.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-[#FEFAEA] font-serif font-bold leading-tight">{clientDetails?.name}</h3>
                    <p className="text-[#D08C60] text-xs font-serif uppercase tracking-wider">{clientDetails?.placeOfBirth.city}</p>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-[#D08C60]/10 flex justify-between text-[10px] text-[#FEFAEA]/60 font-mono uppercase tracking-wide">
                <span>{clientDetails?.dateOfBirth}</span>
                <span>{clientDetails?.timeOfBirth}</span>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-[#1A0F0A]">
            {/* Custom Sidebar Wrapper to include Client Info */}
            <aside
                className="w-full lg:w-72 h-full py-6 px-4 flex flex-col border-r border-[#D08C60]/30 hidden lg:flex bg-[#1A0F0A]"
                style={{
                    background: 'linear-gradient(180deg, #2A1810 0%, #1A0F0A 100%)',
                }}
            >
                <ClientInfoCard />

                <div className="mb-2 px-2">
                    <h3 className="text-xs font-bold text-[#D08C60] uppercase tracking-widest font-serif opacity-70">
                        Analysis Tools
                    </h3>
                </div>

                <nav className="space-y-1 flex-1">
                    {VEDIC_NAV_ITEMS.map((item) => {
                        // Logic for active state would go here, replicating SectionSidebar or using it directly if refactored
                        return (
                            <Link
                                key={item.name}
                                href={item.path.startsWith('/') ? item.path : `/vedic-astrology/${item.path}`}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#FEFAEA]/70 hover:bg-[#FEFAEA]/5 hover:text-white transition-all group"
                            >
                                <item.icon className="w-5 h-5 text-[#D08C60] group-hover:text-[#FFD27D]" />
                                <span className="font-serif text-sm tracking-wide">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-[#1A0F0A] relative">
                {/* Top fade for smooth scroll */}
                <div className="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1A0F0A] to-transparent z-10 pointer-events-none" />

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
