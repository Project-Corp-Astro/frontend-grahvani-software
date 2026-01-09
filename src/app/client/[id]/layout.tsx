import React from 'react';
import ClientHeader from "@/components/clients/ClientHeader";
import ClientSidebar from "@/components/clients/ClientSidebar";
import { Client } from '@/types/client';

// MOCK DATA FOR LAYOUT
const MOCK_CLIENT: Client = {
    id: '1',
    firstName: 'Ananya',
    lastName: 'Sharma',
    dateOfBirth: '1992-08-15',
    timeOfBirth: '14:30',
    placeOfBirth: 'New Delhi, India',
    rashi: 'Leo',
    nakshatra: 'Magha'
};

export default async function ClientLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    // In a real app, fetch client by params.id here
    const { id } = await params;

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

            {/* Content starts below header */}
            <div className="pt-[64px] relative z-10 w-full min-h-screen">

                {/* Sidebar - Fixed Position */}
                <div className="hidden lg:block fixed left-0 top-[64px] bottom-0 w-64 overflow-y-auto z-20">
                    <ClientSidebar basePath={`/client/${id}`} />
                </div>

                {/* Right Side: Header + Content */}
                <div className="flex-1 flex flex-col w-full lg:pl-64">

                    {/* Client Context Header */}
                    <ClientHeader client={MOCK_CLIENT} />

                    {/* Main Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>

            </div>
        </div>
    );
}
