export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO string
    timeOfBirth: string; // HH:mm
    placeOfBirth: string;
    lastConsulted?: string; // ISO string
    avatar?: string; // URL
    rashi?: string; // Moon Sign
    nakshatra?: string;
    email?: string;
    phone?: string;
    tags?: string[]; // e.g. "VIP", "New", "Urgent"
    nextConsultation?: string; // ISO string
    lastConsultationType?: string; // e.g. "Natal Chart Reading"
}
