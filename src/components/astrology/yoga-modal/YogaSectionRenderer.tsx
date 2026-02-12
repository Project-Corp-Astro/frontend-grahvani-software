'use client';

import React, { memo } from 'react';
import { SECTION_REGISTRY } from './config/section-registry';
import type { NormalizedYogaData } from '@/types/yoga.types';

interface YogaSectionRendererProps {
    data: NormalizedYogaData;
}

/**
 * Dynamic Section Renderer — iterates the section registry
 * and renders only sections where normalized data is non-null.
 *
 * Zero conditional clutter. Adding a new section requires:
 *   1. Create the component
 *   2. Add an entry to section-registry.ts
 *   3. Ensure the normalizer populates the matching key
 */
export const YogaSectionRenderer = memo(function YogaSectionRenderer({ data }: YogaSectionRendererProps) {
    return (
        <div className="space-y-4">
            {SECTION_REGISTRY.map(({ key, component: Component }) => {
                const sectionData = data[key];

                // Skip sections with no data
                if (sectionData === null || sectionData === undefined) return null;

                // Skip empty arrays
                if (Array.isArray(sectionData) && sectionData.length === 0) return null;

                // Skip empty objects (for planets Record)
                if (typeof sectionData === 'object' && !Array.isArray(sectionData) && Object.keys(sectionData).length === 0) return null;

                return <Component key={key} data={sectionData} />;
            })}
        </div>
    );
});
