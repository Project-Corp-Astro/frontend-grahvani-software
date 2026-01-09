import React from 'react';
import ChartComparison from '@/components/astrology/ChartComparison';
import { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';

// MOCK DATA GENERATOR
const generateMockPlanets = (ascSign: number): Planet[] => [
    { name: 'Asc', signId: ascSign, degree: '14°' },
    { name: 'Su', signId: 5, degree: '05°' },
    { name: 'Mo', signId: 2, degree: '10°' },
    { name: 'Ma', signId: 6, degree: '22°' },
    { name: 'Me', signId: 6, degree: '02°' },
    { name: 'Ju', signId: 4, degree: '12°' },
    { name: 'Ve', signId: 7, degree: '18°' },
    { name: 'Sa', signId: 11, degree: '29°' },
    { name: 'Ra', signId: 8, degree: '15°' },
    { name: 'Ke', signId: 2, degree: '15°' },
];

const generateAltPlanets = (ascSign: number): Planet[] => [
    { name: 'Asc', signId: ascSign, degree: '02°' },
    { name: 'Su', signId: 1, degree: '25°' }, // Exalted
    { name: 'Mo', signId: 4, degree: '15°' }, // Own sign
    { name: 'Ma', signId: 10, degree: '05°' }, // Exalted
    { name: 'Me', signId: 12, degree: '10°' }, // Debilitated
    { name: 'Ju', signId: 9, degree: '22°' },
    { name: 'Ve', signId: 11, degree: '08°' },
    { name: 'Sa', signId: 7, degree: '19°' }, // Exalted!
    { name: 'Ra', signId: 3, degree: '01°' },
    { name: 'Ke', signId: 9, degree: '01°' },
];


export default function ComparisonPage() {

    const chart1 = {
        name: "Person A (Natal)",
        ascendantSign: 5, // Leo Asc
        planets: generateMockPlanets(5),
    };

    const chart2 = {
        name: "Person B (Partner)",
        ascendantSign: 8, // Scorpio Asc
        planets: generateAltPlanets(8),
    };

    return (
        <div className="min-h-screen bg-[#FEFAEA] p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-serif text-[#3E2A1F] font-bold">Astrology Tools</h1>
                    <p className="text-[#7A5A43]">Advanced Chart Comparison Module</p>
                </header>

                <main>
                    <ChartComparison chart1={chart1} chart2={chart2} />
                </main>
            </div>
        </div>
    );
}
