import React from 'react';
import Link from 'next/link';
import { Users, AlertCircle, Clock, Calendar, CreditCard, Gem, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClientsNavigationSidebar() {
    const menuItems = [
        {
            id: 'all-clients',
            label: 'All Clients',
            icon: Users,
            href: '/clients',
            highlighted: true
        },
        {
            id: 'follow-ups',
            label: 'Follow-Ups Due',
            icon: AlertCircle,
            href: '/clients?filter=follow-ups'
        },
        {
            id: 'recent-sessions',
            label: 'Recent Sessions',
            icon: Clock,
            href: '/clients?filter=recent-sessions'
        },
        {
            id: 'bookings',
            label: 'Upcoming Bookings',
            icon: Calendar,
            href: '/clients?filter=bookings'
        },
        {
            id: 'payments',
            label: 'Payments',
            icon: CreditCard,
            href: '/clients?filter=payments'
        },
        {
            id: 'remedies',
            label: 'Pending Remedies',
            icon: Gem,
            href: '/clients?filter=remedies'
        },
        {
            id: 'add-client',
            label: 'Add New Client',
            icon: Plus,
            href: '/clients/new'
        }
    ];

    return (
        <aside className="w-72 h-full flex flex-col bg-header-gradient border-r border-[#D08C60]/20 shadow-2xl">
            {/* Header */}
            <div className="p-6 pb-4">
                <h2 className="text-[#D08C60] text-xs font-black uppercase tracking-[0.2em] mb-6">
                    Clients
                </h2>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isHighlighted = item.highlighted;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group text-left",
                                isHighlighted
                                    ? "bg-white/10 text-white border border-[#D08C60]/30"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform group-hover:scale-110",
                                    isHighlighted ? "text-[#FFD27D]" : "text-[#D08C60]"
                                )} />
                                <span className="font-serif text-sm tracking-wide font-medium">
                                    {item.label}
                                </span>
                            </div>
                            {isHighlighted && (
                                <ChevronRight className="w-4 h-4 text-[#D08C60]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
