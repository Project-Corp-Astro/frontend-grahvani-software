import React from 'react';

export interface YogaItem {
    id: string;
    name: string;
    sanskrit: string;
    description: string;
    category: 'benefic' | 'challenging';
    icon: React.ReactNode;
}

export interface DoshaItem {
    id: string;
    name: string;
    sanskrit: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    category: 'karmic' | 'planetary' | 'transit';
    icon: React.ReactNode;
}
