"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Moon,
    Orbit,
    FileText,
    GitCompare,
    Settings,
    ChevronRight,
    LayoutTemplate
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface ClientSidebarProps {
    basePath: string;
}

export default function ClientSidebar({ basePath }: ClientSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', path: '/overview', icon: LayoutTemplate },
        { name: 'Charts', path: '/charts', icon: LayoutDashboard },
        { name: 'Planet Position', path: '/planet-position', icon: Orbit },
        { name: 'Dashas', path: '/dashas', icon: Moon },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Comparison', path: '/comparison', icon: GitCompare }, // New Feature Link (Note: Current comparison page is global /comparison, might need to nest later or link out)
    ];

    // Note: The global comparison page is at /comparison. 
    // If we want a client-specific comparison, we'd need a route like /client/[id]/comparison.
    // For now, I'll link to the global one or just a placeholder if not ready. 
    // Wait, the user asked for "client related options". 
    // If I direct to /comparison (global), they lose client context. 
    // For now, let's keep it in the list but maybe point to the global one or a generic one.
    // Actually, let's stick to the TabNavigation list + Comparison if relevant.

    return (
        <aside
            className="w-full lg:w-64 h-full py-8 px-5 flex flex-col gap-2 border-r border-[#D08C60]/30 z-40"
            style={{
                background: 'linear-gradient(180deg, #2A1810 0%, #1A0A05 100%)',
                boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
            }}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-40" />

            <div className="mb-8 px-2 relative z-10">
                <h3 className="text-[10px] font-black text-[#D08C60] uppercase tracking-[0.2em] font-serif">
                    Workspace
                </h3>
            </div>

            <nav className="space-y-2 relative z-10">
                {menuItems.map((item) => {
                    const fullPath = `${basePath}${item.path}`;
                    const isActive = pathname.startsWith(fullPath);

                    return (
                        <Link
                            key={item.name}
                            href={fullPath}
                            className={cn(
                                "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-[#FFD27D]/20 to-transparent text-[#FFD27D] font-bold border-l-4 border-[#FFD27D] shadow-[0_4px_20px_rgba(255,210,125,0.1)]"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-[#FFD27D]" : "text-[#D08C60]")} />
                                <span className="font-serif text-[13px] tracking-widest uppercase font-medium">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FFD27D] animate-pulse" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#D08C60]/30 px-2">
                <Link
                    href={`${basePath}/settings`}
                    className="flex items-center gap-3 text-[#FEFAEA]/70 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-serif text-sm">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
