import { Client } from "@/types/client";

// MOCK DATA - strictly for UI architecture validation as per user request not to connect backend yet
export const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        firstName: 'Ananya',
        lastName: 'Sharma',
        dateOfBirth: '1992-08-15',
        timeOfBirth: '14:30',
        placeOfBirth: 'New Delhi, India',
        lastConsulted: '2025-12-01',
        rashi: 'Leo',
        email: 'ananya.sharma@example.com',
        phone: '+91 98765 43210',
        tags: ['VIP', 'Recurring'],
        nextConsultation: '2026-02-14',
        lastConsultationType: 'Annual Forecast'
    },
    {
        id: '2',
        firstName: 'Vikram',
        lastName: 'Singh',
        dateOfBirth: '1985-04-20',
        timeOfBirth: '09:15',
        placeOfBirth: 'Jaipur, India',
        lastConsulted: '2026-01-05',
        rashi: 'Aries',
        email: 'vikram.singh@example.com',
        phone: '+91 99887 76655',
        tags: ['New'],
        nextConsultation: undefined,
        lastConsultationType: 'Career Analysis'
    },
    {
        id: '3',
        firstName: 'Priya',
        lastName: 'Verma',
        dateOfBirth: '1998-11-05',
        timeOfBirth: '23:45',
        placeOfBirth: 'Mumbai, India',
        lastConsulted: '2024-11-20',
        rashi: 'Scorpio',
        email: 'priya.v@example.com',
        phone: '+91 91234 56789',
        tags: ['Referral'],
        nextConsultation: '2026-01-20',
        lastConsultationType: 'Relationship Matching'
    }
];
