"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import { CLIENTS_General_Sidebar } from '@/config/sidebarConfig';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isProfilePage = pathname !== '/clients' && !pathname.endsWith('/new');

    return (
        <ProtectedRoute>
            <div className="relative min-h-screen">
                {/* Background is now global in body */}
                <div className="pt-14 relative z-10 w-full min-h-screen">
                    {!isProfilePage && (
                        <div className="hidden lg:block fixed left-0 top-14 bottom-0 w-64 overflow-y-auto z-20">
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
        </ProtectedRoute>
    );
}
