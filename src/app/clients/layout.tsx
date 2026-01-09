"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import { CLIENTS_General_Sidebar } from '@/config/sidebarConfig';

import { usePathname } from 'next/navigation';

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide global sidebar if we are deep in a client profile (e.g. /clients/123)
    // Adjust logic if you have other sub-routes. For now, checking if path splits > 2 segments might work, 
    // or specifically checking via regex. 
    // Simpler: if pathname is NOT exactly '/clients' and NOT '/clients/new', we assume it's a profile.
    const isProfilePage = pathname !== '/clients' && !pathname.endsWith('/new');

    return (
        <div className="relative min-h-screen">
            {/* Background is now global in body */}
            <div className="pt-[64px] relative z-10 w-full min-h-screen">
                {!isProfilePage && (
                    <div className="hidden lg:block fixed left-0 top-[64px] bottom-0 w-64 overflow-y-auto z-20">
                        <SectionSidebar title="Clients" basePath="/clients" items={CLIENTS_General_Sidebar} />
                    </div>
                )}
                <div className={`flex-1 flex flex-col w-full ${!isProfilePage ? 'lg:pl-64' : ''}`}>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
