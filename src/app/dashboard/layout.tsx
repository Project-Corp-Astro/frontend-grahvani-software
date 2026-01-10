"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import { DASHBOARD_Sidebar } from '@/config/sidebarConfig';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-luxury-radial relative">
                {/* Subtle Texture Overlay - matching Client Layout */}
                <div
                    className="absolute inset-0 opacity-15 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                        backgroundBlendMode: 'multiply'
                    }}
                />

                <div className="pt-[64px] relative z-10 w-full min-h-screen">
                    {/* Sidebar - Fixed Position */}
                    <div className="hidden lg:block fixed left-0 top-[64px] bottom-0 w-64 overflow-y-auto z-20">
                        <SectionSidebar title="Dashboard" basePath="/dashboard" items={DASHBOARD_Sidebar} />
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 flex flex-col w-full lg:pl-64">
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
