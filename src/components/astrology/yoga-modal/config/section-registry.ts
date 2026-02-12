/**
 * Section Registry — Config-Driven UI Rendering
 *
 * Maps NormalizedYogaData keys to their component + display priority.
 * YogaSectionRenderer iterates this array and only renders sections
 * where the normalized data is non-null.
 *
 * To add a new section:
 *   1. Create the component in sections/
 *   2. Add an entry here with the matching NormalizedYogaData key
 *   3. Done — no other files need changes
 */

import { YogaHeader } from '../sections/YogaHeader';
import { YogaMeta } from '../sections/YogaMeta';
import { YogaDescription } from '../sections/YogaDescription';
import { YogaEffects } from '../sections/YogaEffects';
import { YogaStrengthIndicator } from '../sections/YogaStrengthIndicator';
import { YogaCombinations } from '../sections/YogaCombinations';
import { YogaPlanetsGrid } from '../sections/YogaPlanetsGrid';
import { YogaHousesGrid } from '../sections/YogaHousesGrid';
import { YogaActivationPeriod } from '../sections/YogaActivationPeriod';
import { YogaCancellationConditions } from '../sections/YogaCancellationConditions';
import { YogaDoshaSeverity } from '../sections/YogaDoshaSeverity';
import { YogaTechnicalDetails } from '../sections/YogaTechnicalDetails';
import { YogaRemedies } from '../sections/YogaRemedies';
import { YogaConditions } from '../sections/YogaConditions';
import { YogaRajYogas } from '../sections/YogaRajYogas';
import type { SectionKey } from '@/types/yoga.types';

export interface RegistryEntry {
    /** Must match a key in NormalizedYogaData (excluding 'raw') */
    key: SectionKey;
    /** The React component to render for this section */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<{ data: any }>;
    /** Higher priority = renders first. Title > Meta > Insight > Technical > Remedy > Notes */
    priority: number;
}

/**
 * Content hierarchy order:
 * Title (100) > Meta (90) > Strength (80) > Conditions (75) > Description (70) >
 * RajYogas (67) > Effects (65) > Combinations (60) > Timing (55) > Planets (50) >
 * Houses (45) > Cancellation (40) > Dosha (35) >
 * Technical (25) > Remedies (20)
 */
export const SECTION_REGISTRY: RegistryEntry[] = ([
    { key: 'header' as const, component: YogaHeader, priority: 100 },
    // { key: 'meta' as const, component: YogaMeta, priority: 90 },
    { key: 'strength' as const, component: YogaStrengthIndicator, priority: 80 },
    { key: 'conditions' as const, component: YogaConditions, priority: 75 },
    { key: 'description' as const, component: YogaDescription, priority: 70 },
    { key: 'rajYogas' as const, component: YogaRajYogas, priority: 67 },
    { key: 'effects' as const, component: YogaEffects, priority: 65 },
    { key: 'combinations' as const, component: YogaCombinations, priority: 60 },
    { key: 'timing' as const, component: YogaActivationPeriod, priority: 55 },
    { key: 'planets' as const, component: YogaPlanetsGrid, priority: 50 },
    { key: 'houses' as const, component: YogaHousesGrid, priority: 45 },
    { key: 'cancellation' as const, component: YogaCancellationConditions, priority: 40 },
    { key: 'doshaSeverity' as const, component: YogaDoshaSeverity, priority: 35 },
    { key: 'technical' as const, component: YogaTechnicalDetails, priority: 25 },
    { key: 'remedies' as const, component: YogaRemedies, priority: 20 },
] as RegistryEntry[]).sort((a, b) => b.priority - a.priority);
