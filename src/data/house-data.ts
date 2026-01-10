// House data for Vedic Astrology
// Contains comprehensive information about each house and zodiac sign

export interface HouseInfo {
    house: number;
    name: string;
    signification: string;
    description: string;
    keywords: string[];
    areas: string[];
}

export interface ZodiacSign {
    id: number;
    name: string;
    symbol: string;
    element: string;
    quality: string;
    rulingPlanet: string;
    description: string;
}

// The 12 Houses in Vedic Astrology
export const HOUSE_DATA: Record<number, HouseInfo> = {
    1: {
        house: 1,
        name: "Lagna (Ascendant)",
        signification: "Self, Personality, Physical Body",
        description: "The first house represents the self, physical appearance, temperament, and general vitality. It is the most important house in the chart, determining one's overall approach to life.",
        keywords: ["Self", "Identity", "Physical Body", "Vitality", "Temperament"],
        areas: ["Personality", "Health", "Appearance", "Life Path", "Character"]
    },
    2: {
        house: 2,
        name: "Dhana Bhava",
        signification: "Wealth, Family, Speech",
        description: "The second house governs accumulated wealth, family lineage, speech, eating habits, and early childhood. It represents material security and values.",
        keywords: ["Wealth", "Family", "Speech", "Food", "Values"],
        areas: ["Finances", "Family", "Communication", "Assets", "Self-Worth"]
    },
    3: {
        house: 3,
        name: "Sahaja Bhava",
        signification: "Courage, Siblings, Communication",
        description: "The third house represents courage, siblings, short journeys, skills, hobbies, and self-effort. It shows one's mental strength and communication abilities.",
        keywords: ["Courage", "Siblings", "Skills", "Communication", "Effort"],
        areas: ["Brothers/Sisters", "Learning", "Writing", "Travel", "Initiative"]
    },
    4: {
        house: 4,
        name: "Sukha Bhava",
        signification: "Home, Mother, Happiness",
        description: "The fourth house signifies mother, home, property, emotional foundations, education, and inner peace. It represents one's roots and emotional security.",
        keywords: ["Home", "Mother", "Emotions", "Property", "Peace"],
        areas: ["Family", "Real Estate", "Education", "Comforts", "Heart"]
    },
    5: {
        house: 5,
        name: "Putra Bhava",
        signification: "Children, Intelligence, Creativity",
        description: "The fifth house governs children, creativity, intelligence, romance, speculation, and past life merits. It represents creative self-expression and joy.",
        keywords: ["Children", "Intelligence", "Creativity", "Romance", "Merit"],
        areas: ["Offspring", "Arts", "Investments", "Love Affairs", "Spirituality"]
    },
    6: {
        house: 6,
        name: "Ripu Bhava",
        signification: "Enemies, Disease, Service",
        description: "The sixth house represents enemies, diseases, debts, daily work, service, and obstacles. It shows one's ability to overcome challenges and maintain health.",
        keywords: ["Health", "Service", "Enemies", "Obstacles", "Work"],
        areas: ["Employment", "Litigation", "Pets", "Competition", "Daily Routine"]
    },
    7: {
        house: 7,
        name: "Kalatra Bhava",
        signification: "Marriage, Partnership, Business",
        description: "The seventh house governs marriage, partnerships, business relationships, and one-to-one interactions. It represents the life partner and public dealings.",
        keywords: ["Marriage", "Partnership", "Business", "Spouse", "Contracts"],
        areas: ["Relationships", "Legal Bonds", "Trade", "Public Life", "Cooperation"]
    },
    8: {
        house: 8,
        name: "Ayur Bhava",
        signification: "Longevity, Transformation, Occult",
        description: "The eighth house signifies longevity, transformation, sudden events, inheritance, occult sciences, and mysteries. It represents deep psychological change.",
        keywords: ["Longevity", "Transformation", "Occult", "Mystery", "Inheritance"],
        areas: ["Sudden Changes", "Research", "Secrets", "Death/Rebirth", "Hidden Wealth"]
    },
    9: {
        house: 9,
        name: "Dharma Bhava",
        signification: "Fortune, Father, Spirituality",
        description: "The ninth house represents father, fortune, higher learning, philosophy, spirituality, long journeys, and dharma. It shows one's beliefs and higher purpose.",
        keywords: ["Fortune", "Father", "Dharma", "Philosophy", "Pilgrimage"],
        areas: ["Higher Education", "Religion", "Teachers", "Luck", "Ethics"]
    },
    10: {
        house: 10,
        name: "Karma Bhava",
        signification: "Career, Status, Authority",
        description: "The tenth house governs career, profession, public image, fame, authority, and achievements. It represents one's actions and worldly status.",
        keywords: ["Career", "Status", "Authority", "Achievement", "Reputation"],
        areas: ["Profession", "Fame", "Power", "Government", "Public Image"]
    },
    11: {
        house: 11,
        name: "Labha Bhava",
        signification: "Gains, Friends, Aspirations",
        description: "The eleventh house signifies gains, friends, social networks, aspirations, and fulfillment of desires. It represents income and elder siblings.",
        keywords: ["Gains", "Friends", "Income", "Aspirations", "Networks"],
        areas: ["Elder Siblings", "Organizations", "Goals", "Profits", "Social Circle"]
    },
    12: {
        house: 12,
        name: "Vyaya Bhava",
        signification: "Loss, Liberation, Foreign Lands",
        description: "The twelfth house represents expenses, losses, isolation, foreign lands, spirituality, and moksha. It shows one's connection to the divine and liberation.",
        keywords: ["Loss", "Liberation", "Foreign", "Isolation", "Spirituality"],
        areas: ["Expenses", "Meditation", "Hospitalization", "Travel Abroad", "Enlightenment"]
    }
};

// The 12 Zodiac Signs
export const ZODIAC_SIGNS: Record<number, ZodiacSign> = {
    1: {
        id: 1,
        name: "Aries",
        symbol: "♈",
        element: "Fire",
        quality: "Movable (Chara)",
        rulingPlanet: "Mars (Mangal)",
        description: "Cardinal fire sign representing initiative, courage, and leadership. Quick to act and pioneering in nature."
    },
    2: {
        id: 2,
        name: "Taurus",
        symbol: "♉",
        element: "Earth",
        quality: "Fixed (Sthira)",
        rulingPlanet: "Venus (Shukra)",
        description: "Fixed earth sign representing stability, material comfort, and sensual pleasures. Patient and determined."
    },
    3: {
        id: 3,
        name: "Gemini",
        symbol: "♊",
        element: "Air",
        quality: "Dual (Dwiswabhava)",
        rulingPlanet: "Mercury (Budha)",
        description: "Mutable air sign representing communication, versatility, and intellectual curiosity. Adaptable and social."
    },
    4: {
        id: 4,
        name: "Cancer",
        symbol: "♋",
        element: "Water",
        quality: "Movable (Chara)",
        rulingPlanet: "Moon (Chandra)",
        description: "Cardinal water sign representing emotions, nurturing, and intuition. Protective and home-loving."
    },
    5: {
        id: 5,
        name: "Leo",
        symbol: "♌",
        element: "Fire",
        quality: "Fixed (Sthira)",
        rulingPlanet: "Sun (Surya)",
        description: "Fixed fire sign representing leadership, creativity, and self-expression. Confident and charismatic."
    },
    6: {
        id: 6,
        name: "Virgo",
        symbol: "♍",
        element: "Earth",
        quality: "Dual (Dwiswabhava)",
        rulingPlanet: "Mercury (Budha)",
        description: "Mutable earth sign representing analysis, service, and perfection. Detail-oriented and practical."
    },
    7: {
        id: 7,
        name: "Libra",
        symbol: "♎",
        element: "Air",
        quality: "Movable (Chara)",
        rulingPlanet: "Venus (Shukra)",
        description: "Cardinal air sign representing balance, harmony, and relationships. Diplomatic and fair-minded."
    },
    8: {
        id: 8,
        name: "Scorpio",
        symbol: "♏",
        element: "Water",
        quality: "Fixed (Sthira)",
        rulingPlanet: "Mars (Mangal)",
        description: "Fixed water sign representing transformation, intensity, and depth. Passionate and investigative."
    },
    9: {
        id: 9,
        name: "Sagittarius",
        symbol: "♐",
        element: "Fire",
        quality: "Dual (Dwiswabhava)",
        rulingPlanet: "Jupiter (Guru)",
        description: "Mutable fire sign representing philosophy, expansion, and wisdom. Optimistic and adventurous."
    },
    10: {
        id: 10,
        name: "Capricorn",
        symbol: "♑",
        element: "Earth",
        quality: "Movable (Chara)",
        rulingPlanet: "Saturn (Shani)",
        description: "Cardinal earth sign representing discipline, ambition, and structure. Patient and hardworking."
    },
    11: {
        id: 11,
        name: "Aquarius",
        symbol: "♒",
        element: "Air",
        quality: "Fixed (Sthira)",
        rulingPlanet: "Saturn (Shani)",
        description: "Fixed air sign representing innovation, humanitarianism, and independence. Progressive and unconventional."
    },
    12: {
        id: 12,
        name: "Pisces",
        symbol: "♓",
        element: "Water",
        quality: "Dual (Dwiswabhava)",
        rulingPlanet: "Jupiter (Guru)",
        description: "Mutable water sign representing compassion, spirituality, and imagination. Intuitive and empathetic."
    }
};

/**
 * Get the sign occupying a specific house based on the ascendant
 * @param houseNumber House number (1-12)
 * @param ascendantSign Ascendant sign ID (1-12)
 * @returns Sign ID occupying that house
 */
export function getSignInHouse(houseNumber: number, ascendantSign: number): number {
    return ((ascendantSign + houseNumber - 2) % 12) + 1;
}

/**
 * Get complete house information including the sign occupying it
 * @param houseNumber House number (1-12)
 * @param ascendantSign Ascendant sign ID (1-12)
 * @returns Complete house information
 */
export function getHouseDetails(houseNumber: number, ascendantSign: number) {
    const houseInfo = HOUSE_DATA[houseNumber];
    const signId = getSignInHouse(houseNumber, ascendantSign);
    const signInfo = ZODIAC_SIGNS[signId];

    return {
        ...houseInfo,
        sign: signInfo
    };
}
