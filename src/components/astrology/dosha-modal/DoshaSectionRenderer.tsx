'use client';

import React, { memo } from 'react';
import { NormalizedDoshaData } from '@/types/dosha.types';
import {
    DoshaHeader,
    DoshaSeverity,
    DoshaImpact,
    DoshaRemedies,
    DoshaProgress,
    DoshaPlanets,
    DoshaTechnical
} from '@/components/astrology/dosha-modal/sections';

interface DoshaSectionRendererProps {
    data: NormalizedDoshaData;
}

export const DoshaSectionRenderer = memo(function DoshaSectionRenderer({ data }: DoshaSectionRendererProps) {
    return (
        <div className="space-y-4">
            {/* 1. Identity & Presence */}
            <DoshaHeader data={data.header} meta={data.meta} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 2. Primary Analysis (Left/Center) */}
                <div className="lg:col-span-8 space-y-4">
                    {data.severity && <DoshaSeverity data={data.severity} />}
                    {data.progress && <DoshaProgress data={data.progress} />}
                    <DoshaImpact data={data.impacts} />
                    <DoshaRemedies data={data.remedies} />
                </div>

                {/* 3. Technical & Planetary (Right) */}
                <div className="lg:col-span-4 space-y-4">
                    <DoshaPlanets data={data.planets} />
                    {data.technical && <DoshaTechnical data={data.technical} />}
                </div>
            </div>
        </div>
    );
});
