"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import PriorityAlert from '@/components/upaya/PriorityAlert';
import RemedyCard from '@/components/upaya/RemedyCard';
import RulesFooter from '@/components/upaya/RulesFooter';
import styles from './RemedialShared.module.css';

interface LalKitabDashboardProps {
    data: any; // Lal Kitab JSON data
    className?: string;
}

export default function LalKitabDashboard({ data, className }: LalKitabDashboardProps) {
    if (!data || !data.data) return null;

    const ketuData = data.data;

    return (
        <div className={cn(
            "min-h-[85vh] p-8 rounded-[3rem] relative overflow-hidden flex flex-col items-center gap-8",
            styles.dashboardContainer,
            className
        )}>
            {/* Header / Title */}
            <div className="relative z-10 w-full flex flex-col items-center mb-4 text-center">
                <h2 className="text-xl font-bold tracking-tight mb-8" style={{ color: 'var(--ink)' }}>
                    Personalized Lal Kitab Remedial Dashboard | User: {data.user_name || "Sadhaka"}
                </h2>

                <PriorityAlert mahadasha="Mercury" antardasha="Saturn" />
            </div>

            {/* Remedy Grid - Responsive Horizontal Cards */}
            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Card 1: Saturn (Mocked for layout consistency with image) */}
                <RemedyCard
                    planet="Saturn (Shani)"
                    focusType="Antardasha Focus"
                    diagnosis="Saturn in 5th (Leo) conflict."
                    remedyText="Offer food to crows/laborers."
                    time="Before Sunset."
                    constraint="Continuous 43 Days."
                    status="In Progress"
                    progress={12}
                />

                {/* Card 2: Mercury (Mocked for layout consistency with image) */}
                <RemedyCard
                    planet="Mercury (Budh)"
                    focusType="1st House Stability"
                    diagnosis="Combust in 1st House."
                    remedyText="Wear solid silver chain."
                    time="All times."
                    constraint="Ensure silver purity."
                    status="Recommended"
                />

                {/* Card 3: Ketu (From JSON) */}
                <RemedyCard
                    planet={`${ketuData.planet} (Ketu)`}
                    focusType={`${ketuData.house}th House Focus`}
                    diagnosis={`${ketuData.details.malefic} detected.`}
                    remedyText={ketuData.details.remedies[1]} // Feed dogs
                    time={ketuData.best_time}
                    constraint={`Respect ${ketuData.remedy_cycle} cycle.`}
                    status="Recommended"
                />

            </div>

            {/* Rules Footer */}
            <RulesFooter />

        </div>
    );
}
