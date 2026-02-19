"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FlaskConical,
    Grid3x3,
    Layers,
    Clock,
    Globe,
    History,
    HelpCircle,
    FileText,
    Compass,
} from 'lucide-react';

export type KpSection =
    | 'dashboard'
    | 'kp-analysis'
    | 'cusps'
    | 'significators'
    | 'ruling-planets'
    | 'dashas'
    | 'transit'
    | 'events'
    | 'reports';

interface KpDashboardSidebarProps {
    activeSection: KpSection;
    onSectionChange: (section: KpSection) => void;
    className?: string;
}

const SIDEBAR_ITEMS: { id: KpSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kp-analysis', label: 'KP Analysis', icon: FlaskConical },
    { id: 'cusps', label: 'Cusps', icon: Compass },
    { id: 'significators', label: 'Significators', icon: Grid3x3 },
    { id: 'ruling-planets', label: 'Ruling Planets', icon: Layers },
    { id: 'dashas', label: 'Dashas', icon: History },
    { id: 'transit', label: 'Transit', icon: Globe },
    { id: 'events', label: 'Events', icon: HelpCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
];

/**
 * KP Dashboard Sidebar Navigation
 * Left panel with scroll-to-section navigation
 */
export default function KpDashboardSidebar({
    activeSection,
    onSectionChange,
    className,
}: KpDashboardSidebarProps) {
    return (
        <div className={cn(
            "w-48 shrink-0 bg-softwhite border border-antique rounded-2xl p-3 h-fit sticky top-32",
            className
        )}>
            <div className="mb-3 px-2">
                <p className="text-[9px] uppercase tracking-widest text-muted-refined font-bold">KP Navigation</p>
            </div>
            <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                                isActive
                                    ? "bg-gold-primary/15 text-gold-dark border border-gold-primary/30 font-semibold"
                                    : "text-secondary hover:text-primary hover:bg-parchment"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4 shrink-0",
                                isActive ? "text-gold-dark" : "text-muted-refined"
                            )} />
                            <span className="font-serif text-[13px]">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
