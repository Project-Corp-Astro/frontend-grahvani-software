"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import { MUHURTA_Sidebar } from '@/config/sidebarConfig';
import Header from '@/components/Header'; // Using Global Header logic wrapper? 
// No, the user wants "GlobalHeader" to be the main header.
// But wait, the standard layout uses `Header`. 
// The GlobalHeader component I read earlier is `src/components/layout/GlobalHeader.tsx`
// The `src/components/Header.tsx` seems to be an older or alternative one?
// Let's assume GlobalHeader is the correct one for the root layout, OR I should use the sidebar inside the standard layout?
// Usually Layout wraps children.
// For these sub-routes, I want the sidebar on the left.
// I will render `SectionSidebar` strictly.

export default function MuhurtaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-luxury-radial relative">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />

            <div className="pt-[64px] relative z-10 w-full min-h-screen">
                <div className="hidden lg:block fixed left-0 top-[64px] bottom-0 w-64 overflow-y-auto z-20">
                    <SectionSidebar title="Muhurta" basePath="/muhurta" items={MUHURTA_Sidebar} />
                </div>

                <div className="flex-1 flex flex-col w-full lg:pl-64">
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
