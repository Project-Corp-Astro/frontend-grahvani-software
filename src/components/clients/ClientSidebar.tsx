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
            className="w-full lg:w-64 h-full py-6 px-4 flex flex-col gap-2 border-r border-[#D08C60]/30"
            style={{
                background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255,210,125,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
            }}
        >

            <div className="mb-6 px-2">
                <h3 className="text-xs font-bold text-[#D08C60] uppercase tracking-widest font-serif">
                    Menu
                </h3>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => {
                    // Always use relative path for client context pages
                    const fullPath = `${basePath}${item.path}`;

                    const isActive = pathname.startsWith(fullPath) && (fullPath !== '/' || pathname === '/');

                    return (
                        <Link
                            key={item.name}
                            href={fullPath}
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
                            {isActive && <ChevronRight className="w-4 h-4 text-[#FFD27D]" />}
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
