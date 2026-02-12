/**
 * Yoga Modal — Barrel Exports
 *
 * Usage:
 *   import { YogaModal } from '@/components/astrology/yoga-modal';
 */

export { YogaModal } from './YogaModal';
export { YogaSectionRenderer } from './YogaSectionRenderer';
export { normalizeYogaData } from './utils/normalizer';

// Section components (for custom layouts)
export { YogaHeader } from './sections/YogaHeader';
export { YogaMeta } from './sections/YogaMeta';
export { YogaDescription } from './sections/YogaDescription';
export { YogaEffects } from './sections/YogaEffects';
export { YogaStrengthIndicator } from './sections/YogaStrengthIndicator';
export { YogaCombinations } from './sections/YogaCombinations';
export { YogaPlanetsGrid } from './sections/YogaPlanetsGrid';
export { YogaHousesGrid } from './sections/YogaHousesGrid';
export { YogaActivationPeriod } from './sections/YogaActivationPeriod';
export { YogaRemedies } from './sections/YogaRemedies';
export { YogaDoshaSeverity } from './sections/YogaDoshaSeverity';
export { YogaCancellationConditions } from './sections/YogaCancellationConditions';
export { YogaTechnicalDetails } from './sections/YogaTechnicalDetails';
export { YogaConditions } from './sections/YogaConditions';
export { YogaRajYogas } from './sections/YogaRajYogas';

// Config
export { SECTION_REGISTRY } from './config/section-registry';

// Types re-export
export type { NormalizedYogaData, RawYogaResponse, SectionKey } from '@/types/yoga.types';
