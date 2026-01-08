"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart"; // Will create next
import ChartControls from "@/components/astrology/ChartControls"; // Will create next

export default function ChartsPage() {

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
            {/* Left Sidebar: Controls */}
            <div className="w-full lg:w-[280px] bg-[#FEFAEA] border border-[#E7D6B8] rounded p-4 overflow-y-auto">
                <ChartControls />
            </div>

            {/* Right Area: Chart Canvas */}
            <div className="flex-1 bg-[#FEFAEA] border border-[#E7D6B8] rounded p-4 flex items-center justify-center relative shadow-inner">
                {/* Decorative Canvas Background */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                        backgroundBlendMode: 'multiply'
                    }}
                />

                <div className="w-full h-full max-w-[800px] max-h-[800px] aspect-square relative z-10">
                    <NorthIndianChart />
                </div>
            </div>
        </div>
    );
}
