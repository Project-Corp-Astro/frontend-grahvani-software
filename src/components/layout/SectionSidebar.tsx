"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, ChevronRight, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface SidebarItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

interface SectionSidebarProps {
    title: string;
    basePath: string; // e.g. "/muhurta"
    items: SidebarItem[];
}

export default function SectionSidebar({ title, basePath, items }: SectionSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className="w-full lg:w-64 h-full py-6 px-4 flex flex-col gap-2 border-r border-[#D08C60]/30 bg-header-gradient"
            style={{
                boxShadow: 'inset 0 2px 4px rgba(255,210,125,0.15), inset 0 -2px 4px rgba(0,0,0,0.3)',
            }}
        >

            <div className="mb-6 px-2">
                <h3 className="text-xs font-bold text-[#D08C60] tracking-widest font-serif">
                    {title}
                </h3>
            </div>

            <nav className="space-y-1">
                {items.map((item) => {
                    // Check if absolute path or relative
                    const href = item.path.startsWith('/') ? item.path : `${basePath}/${item.path}`;

                    // Simple active check
                    // If pathname is exactly the href OR pathname starts with href/
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            className={cn(
                                "flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-[#FEFAEA]/10 text-[#FFD27D] font-bold shadow-sm border border-[#D08C60]/50"
                                    : "text-white hover:bg-[#FEFAEA]/5 hover:text-[#FFD27D]"
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
                    href={`/settings`}
                    className="flex items-center gap-3 text-[#FEFAEA]/70 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-serif text-sm">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
