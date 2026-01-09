"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import GoldenButton from "@/components/GoldenButton";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-serif text-ink font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#FEFAEA] border border-[#E7D6B8] rounded-[4px] p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none" />

                    <div className="w-12 h-12 bg-[#FAF5E6] rounded-full border border-[#DCC9A6] flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-[#9C7A2F]" />
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-[#3E2A1F] mb-2">
                        Client Registry
                    </h2>
                    <p className="font-serif text-[#7A5A43] italic mb-8 max-w-[80%]">
                        Manage client profiles, birth details, and session history in one sacred archival space.
                    </p>

                    <Link href="/clients">
                        <GoldenButton
                            topText="View"
                            bottomText="Registry"
                            className="w-full"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
