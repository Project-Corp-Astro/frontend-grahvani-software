"use client";

import React from 'react';
import ClientHeader from "@/components/clients/ClientHeader";
import TabNavigation from "@/components/ui/TabNavigation";
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

export default function ClientLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    // In a real app, fetch client by params.id here

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
            <div className="pt-[64px] relative z-10 w-full">

                {/* Client Context Header */}
                <ClientHeader client={MOCK_CLIENT} />

                {/* Tab Navigation */}
                <TabNavigation basePath={`/client/${params.id}`} />

                {/* Sub-page Content (Charts, Dashas, etc.) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
