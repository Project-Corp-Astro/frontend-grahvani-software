"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ClientForm from "@/components/clients/ClientForm";

export default function NewClientPage() {
    return (
        <div className="min-h-screen bg-luxury-radial relative text-[#3E2A1F]">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                    backgroundBlendMode: 'multiply'
                }}
            />



            <main className="pt-[100px] pb-20 relative z-10 px-4 sm:px-6 lg:px-8">
                {/* Main Container - The "Registry" */}
                <div className="max-w-4xl mx-auto">

                    {/* Back Link */}
                    <div className="mb-8">
                        <Link href="/clients" className="inline-flex items-center text-[#7A5A43] hover:text-[#9C7A2F] transition-colors font-serif italic text-sm group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Return to Registry
                        </Link>
                    </div>

                    {/* Page Content Card */}
                    <div className="bg-[#FEFAEA] p-8 md:p-12 rounded-lg border border-[#E7D6B8] shadow-[0_4px_20px_rgba(62,42,31,0.08)] relative">
                        {/* Decorative Corner Borders */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C9A24D] rounded-tl-lg opacity-50" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C9A24D] rounded-tr-lg opacity-50" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C9A24D] rounded-bl-lg opacity-50" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C9A24D] rounded-br-lg opacity-50" />

                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-serif font-bold text-[#3E2A1F] mb-2">
                                New Soul Record
                            </h1>
                            <p className="text-[#7A5A43] font-serif italic">
                                Accurately record the birth details for a precise cosmic map.
                            </p>
                        </div>

                        <ClientForm />
                    </div>

                </div>
            </main>
        </div>
    );
}
