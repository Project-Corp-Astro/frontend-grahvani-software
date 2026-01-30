import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';
import { useVedicClient } from '@/context/VedicClientContext';

interface ClientListRowProps {
    client: Client;
    onSelect?: (client: Client) => void;
    onEdit?: (client: Client) => void;
    onDelete?: (client: Client) => void;
}

export default function ClientListRow({ client, onSelect, onEdit, onDelete }: ClientListRowProps) {
    const router = useRouter();
    const { setClientDetails } = useVedicClient();

    const handleSelectClient = () => {
        if (onSelect) {
            onSelect(client);
            return;
        }

        // Default legacy behavior (Vedic flow)
        setClientDetails({
            id: client.id,
            name: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
            gender: client.gender || "male", // Fallback for mock
            dateOfBirth: client.dateOfBirth || client.birthDate || '',
            timeOfBirth: client.timeOfBirth || client.birthTime || "12:00",
            placeOfBirth: {
                city: client.placeOfBirth || client.birthPlace || '',
            },
            rashi: client.rashi
        });

        // Steer directly to the Vedic Overview first
        router.push('/vedic-astrology/overview');
    };

    return (
        <div className="group relative">
            <div
                onClick={handleSelectClient}
                className="
                    relative flex items-center p-4
                    bg-softwhite border border-antique rounded-3xl
                    transition-all duration-300
                    hover:border-gold-primary hover:shadow-card
                    cursor-pointer overflow-hidden
                "
            >
                {/* Hover Glow via gradient */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gold-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 1. Avatar / Photo with Gold Ring */}
                <div className="relative mr-8">
                    <div className="w-16 h-16 rounded-full border border-antique overflow-hidden shadow-sm bg-parchment flex items-center justify-center relative group-hover:border-gold-primary transition-colors">
                        {client.avatar ? (
                            <img src={client.avatar} alt={client.firstName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-serif text-2xl text-gold-dark font-bold tracking-tight">
                                {(client.firstName || client.fullName || '?')[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Main Info */}
                <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-[#2B1510] group-hover:text-gold-dark transition-colors tracking-tight">
                                {client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Unknown'}
                            </h3>
                            <div className="flex items-center flex-wrap gap-4 xl:gap-6 mt-2">
                                <div className="flex items-center text-[#2B1510] text-xs font-sans uppercase tracking-widest font-bold">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-[#8B5A2B]" />
                                    {client.placeOfBirth || client.birthPlace || 'Unknown'}
                                </div>
                                <div className="flex items-center text-[#2B1510] text-xs font-sans uppercase tracking-widest font-bold">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-[#8B5A2B]" />
                                    {(client.dateOfBirth || client.birthDate) ? new Date(client.dateOfBirth || client.birthDate || '').toLocaleDateString('en-US', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    }) : 'Unknown'}
                                </div>
                                {(client.timeOfBirth || client.birthTime) && (
                                    <div className="hidden xl:flex items-center text-[#2B1510] text-xs font-sans uppercase tracking-widest font-bold">
                                        <span className="text-[#8B5A2B] mr-2">⏰</span>
                                        {client.timeOfBirth || client.birthTime}
                                    </div>
                                )}
                                {(client.phone || client.phonePrimary) && (
                                    <div className="hidden 2xl:flex items-center text-[#2B1510] text-xs font-sans uppercase tracking-widest font-bold">
                                        <span className="text-[#8B5A2B] mr-2">📞</span>
                                        {client.phone || client.phonePrimary}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Right Side: Indicators */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-[#6B4423] mb-1">Soul Signature</span>
                                <span className="text-xs font-serif font-bold text-[#2B1510]">
                                    {client.rashi} Rashi
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-parchment rounded-full border border-antique group-hover:border-gold-primary/30 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-[#2B1510] uppercase tracking-widest leading-none">Active</span>
                            </div>

                            {/* Embedded Actions - Moved here for better alignment and visibility */}
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    className="p-2.5 rounded-xl bg-white border border-antique text-muted hover:text-gold-dark hover:border-gold-primary shadow-sm transition-all"
                                    title="Edit Record"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(client);
                                    }}
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    className="p-2.5 rounded-xl bg-white border border-antique text-muted hover:text-red-600 hover:border-red-200 shadow-sm transition-all"
                                    title="Purge Record"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(client);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <ChevronRight className="w-5 h-5 text-muted group-hover:text-gold-dark group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
