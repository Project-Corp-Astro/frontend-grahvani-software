"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, HelpCircle, Clock, User, Bell } from "lucide-react";

export default function GlobalHeader() {
    const pathname = usePathname();

    // Hide header on authenticaton pages
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/dashboard") return true;
        if (path === "/dashboard" && pathname === "/dashboard") return true;
        if (path !== "/" && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[64px]">
            {/* Main Header Container */}
            <div
                className="relative h-full w-full flex items-center justify-between px-4 lg:px-8"
                style={{
                    background: 'linear-gradient(180deg, #98522F 0%, #763A1F 40%, #55250F 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Top Gold Border (Subtle) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#D08C60] opacity-30" />

                {/* Bottom Gold Border (Ornamental) */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D08C60] to-transparent" />

                {/* LEFT ZONE: Identity & Navigation */}
                <div className="flex items-center gap-8">
                    {/* Brand Mark */}
                    <Link href="/dashboard" className="group">
                        <div className="flex items-center gap-3">
                            {/* Stylized circular logo placeholder */}
                            <div className="w-8 h-8 rounded-full border border-[#D08C60] flex items-center justify-center bg-[#2A1810]">
                                <span className="font-serif text-white font-bold text-lg leading-none pt-1">G</span>
                            </div>
                            <span className="font-serif text-lg font-bold text-white tracking-widest group-hover:text-[#D08C60] transition-colors">
                                GRAHVANI
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href="/clients" label="Clients" active={isActive("/clients")} />
                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} />
                        <NavLink href="/matchmaking" label="Matchmaking" active={isActive("/matchmaking")} />
                        <NavLink href="/calendar" label="Calendar" active={isActive("/calendar")} />
                    </nav>
                </div>

                {/* RIGHT ZONE: Utilities & Profile */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Time / Mode Indicator */}
                    <div className="hidden lg:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-serif text-white tracking-widest uppercase">Lahiri Ayanamsa</span>
                        <div className="flex items-center gap-1.5 text-white/90">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-serif tracking-wider">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block h-8 w-[1px] bg-[#D08C60]/30" />

                    {/* System Icons */}
                    <div className="flex items-center gap-3">
                        <button className="text-white hover:text-[#FEFAEA] transition-colors" title="Settings">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-[#FEFAEA] transition-colors" title="Help">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Profile */}
                    <button className="flex items-center gap-3 pl-2 border-l border-[#D08C60]/30 group">
                        <div className="w-8 h-8 rounded-full bg-[#2A1810] border border-[#D08C60] flex items-center justify-center text-[#FEFAEA] font-serif text-sm group-hover:bg-[#3E2A1F] transition-colors">
                            AS
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`
                px-4 py-2 font-serif text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 relative
                ${active
                    ? 'text-white text-shadow-glow'
                    : 'text-white/70 hover:text-white'
                }
            `}
        >
            {label}
            {active && (
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
}
