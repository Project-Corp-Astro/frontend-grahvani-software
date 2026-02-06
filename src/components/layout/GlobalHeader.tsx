"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Clock, User, Bell, ChevronDown } from "lucide-react";
import GoldenButton from "@/components/GoldenButton";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function GlobalHeader() {
    const pathname = usePathname();
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { user, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

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
        <header className="fixed top-0 left-0 right-0 z-50 h-14">
            {/* Main Header Container */}
            <div
                className="relative h-full w-full flex items-center justify-between px-4 lg:px-8 bg-header-gradient"
                style={{
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
                            <span className="font-serif text-lg font-bold text-white tracking-wider group-hover:text-[#D08C60] transition-colors">
                                Grahvani
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                        <NavLink href="/clients" label="Clients" active={isActive("/clients")} />

                        <NavLink href="/vedic-astrology" label="Vedic Astrology" active={isActive("/vedic-astrology")} />

                        <NavLink href="/muhurta" label="Muhurta" active={isActive("/muhurta")} />
                        <NavLink href="/matchmaking" label="Matchmaking" active={isActive("/matchmaking")} />
                        <NavLink href="/calendar" label="Calendar" active={isActive("/calendar")} />
                    </nav>
                </div>

                {/* RIGHT ZONE: Utilities & Profile */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Time / Ayanamsa Display (Static) */}
                    <div className="hidden lg:flex flex-col items-end mr-2 text-right">
                        <span className="text-[10px] font-serif text-white tracking-wider">{settings.ayanamsa} Ayanamsa</span>
                        <div className="flex items-center gap-1.5 text-white">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-serif tracking-wider" suppressHydrationWarning>
                                {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block h-8 w-[1px] bg-[#D08C60]/30" />

                    {/* System Icons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-white hover:text-[#FEFAEA] transition-colors relative group"
                            title="Global Settings"
                        >
                            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#D08C60] rounded-full border border-[#763A1F]" />
                        </button>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 pl-2 border-l border-[#D08C60]/30 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#2A1810] border border-[#D08C60] flex items-center justify-center text-[#FEFAEA] font-serif text-sm group-hover:bg-[#3E2A1F] transition-colors overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-[#D08C60] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-64 bg-[#FFF9F0] rounded-2xl shadow-2xl border border-[#D08C60]/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-5 bg-gradient-to-br from-[#98522F] to-[#763A1F] text-white">
                                        <p className="font-serif font-bold text-lg leading-tight truncate">
                                            {user?.name || user?.email}
                                        </p>
                                        <p className="text-[#FFD27D]/70 text-[10px] tracking-widest mt-1 truncate">
                                            {user?.role || 'Astro Seeker'} • {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#3E2A1F] hover:bg-[#FFF4E6] rounded-xl transition-colors font-medium"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4 text-[#D08C60]" />
                                            <span>My Journey</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#3E2A1F] hover:bg-[#FFF4E6] rounded-xl transition-colors font-medium"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 text-[#D08C60]" />
                                            <span>Sanctum Settings</span>
                                        </Link>
                                        <div className="h-[1px] bg-[#D08C60]/10 my-2 mx-2" />
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 rounded-xl transition-colors font-bold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Leave Sanctum</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Settings Modal */}
            <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />


        </header>
    );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`
                px-4 py-2 font-serif text-xs font-bold tracking-wide transition-all duration-300 relative
                ${active
                    ? 'text-[#FFD27D] text-shadow-glow'
                    : 'text-white hover:text-[#FFD27D]'
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

function GlobalSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();

    // Fix: Memoize settings object to prevent infinite useEffect loop
    const settings = React.useMemo(() => ({
        ayanamsa,
        chartStyle,
        recentClientIds
    }), [ayanamsa, chartStyle, recentClientIds]);

    const [tempSettings, setTempSettings] = React.useState(settings);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) setTempSettings(settings);
    }, [isOpen, settings]);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        // Simulate a brief delay for "processing" feel
        setTimeout(() => {
            updateSettings(tempSettings);
            setIsSaving(false);
            onClose();
        }, 600);
    };

    const AYANAMSAS = [
        { id: 'Lahiri', label: 'Lahiri (Chitra Paksha)', desc: 'Most widely used in Vedic Astrology' },
        { id: 'KP', label: 'KP (Krishnamurti)', desc: 'Preferred for Stellar/Nakshatra precision' },
        { id: 'Raman', label: 'Raman', desc: 'BV Raman traditional ayanamsa' },
        { id: 'Yukteswar', label: 'Sri Yukteswar', desc: 'Galactic Center based precision' },
        { id: 'Tropical', label: 'Tropical (Sayana)', desc: 'Western Zodiac aligned' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Content */}
            <div className="w-full max-w-2xl bg-[#FFF9F0] rounded-[2rem] shadow-2xl overflow-hidden border border-[#D08C60]/30 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-[#98522F] to-[#763A1F] flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-serif text-white font-bold tracking-wide">Global Preference Matrix</h2>
                        <p className="text-[#FFD27D]/80 text-[11px] uppercase tracking-widest mt-1">System-wide Astronomical Constants</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10">

                    {/* Ayanamsa Section */}
                    <section>
                        <h3 className="text-[#D08C60] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-[#D08C60]" />
                            Ayanamsa System
                            <span className="flex-1 h-[1px] bg-[#D08C60]/20" />
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AYANAMSAS.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => setTempSettings(prev => ({ ...prev, ayanamsa: a.id as any }))}
                                    className={`relative p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] group ${tempSettings.ayanamsa === a.id
                                        ? 'bg-[#98522F] border-[#98522F] shadow-lg'
                                        : 'bg-white border-[#D08C60]/20 hover:border-[#D08C60] hover:bg-[#FFF4E6]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-serif font-bold ${tempSettings.ayanamsa === a.id ? 'text-white' : 'text-[#3E2A1F]'
                                            }`}>{a.label}</span>
                                        {tempSettings.ayanamsa === a.id && (
                                            <div className="w-4 h-4 rounded-full bg-[#FFD27D] flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#98522F]" />
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-[10px] font-medium leading-relaxed ${tempSettings.ayanamsa === a.id ? 'text-white/60' : 'text-[#8B5A2B]/60'
                                        }`}>{a.desc}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-8 bg-[#FEFAEA] border-t border-[#D08C60]/10 flex items-center justify-between shrink-0">
                    <span className="text-[10px] text-[#A8653A] font-medium italic">Changes reflect immediately across all open modules.</span>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl text-[#8B5A2B] text-xs font-bold uppercase tracking-wider hover:bg-[#8B5A2B]/5 transition-colors">
                            Cancel
                        </button>
                        <GoldenButton
                            topText={isSaving ? "Saving" : "Update"}
                            bottomText={isSaving ? "..." : "Matrix"}
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
