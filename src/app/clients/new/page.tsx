"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ClientForm from "@/components/clients/ClientForm";

export default function NewClientPage() {
    return (
        <div className="text-[#3E2A1F]">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto">

                {/* Page Content */}
                <div className="relative">
                    <div className="mb-4 text-center">
                        <h1 className="text-2xl font-serif font-bold text-[#2A1810] mb-1">
                            New Soul Record
                        </h1>
                        <p className="text-[#6B4F1D] font-serif italic text-sm">
                            Accurately record the birth details for a precise cosmic map.
                        </p>
                    </div>

                    <ClientForm />
                </div>

            </div>
        </div>
    );
}
