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
}
