import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';
import { useVedicClient } from '@/context/VedicClientContext';

interface ClientListRowProps {
    client: Client;
    onSelect?: (client: Client) => void;
}

export default function ClientListRow({ client, onSelect }: ClientListRowProps) {
    const router = useRouter();
    const { setClientDetails } = useVedicClient();

    const handleSelectClient = () => {
        if (onSelect) {
            onSelect(client);
            return;
        }

        // Default legacy behavior (Vedic flow)
        setClientDetails({
            name: `${client.firstName} ${client.lastName}`,
            gender: "male", // Fallback for mock
            dateOfBirth: client.dateOfBirth,
            timeOfBirth: client.timeOfBirth || "12:00",
            placeOfBirth: {
                city: client.placeOfBirth,
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
                    relative flex items-center p-6
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
                                {client.firstName[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Main Info */}
                <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-gold-dark transition-colors tracking-tight">
                                {client.firstName} {client.lastName}
                            </h3>
                            <div className="flex items-center gap-6 mt-2">
                                <div className="flex items-center text-muted text-[11px] font-serif uppercase tracking-[0.2em] font-bold">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-gold-dark" />
                                    {client.placeOfBirth}
                                </div>
                                <div className="hidden sm:flex items-center text-muted text-[11px] font-serif uppercase tracking-[0.2em] font-bold">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-gold-dark" />
                                    {new Date(client.dateOfBirth).toLocaleDateString('en-US', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 3. Right Side: Indicators */}
                        <div className="flex items-center gap-12">
                            <div className="hidden lg:block text-right">
                                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-muted mb-1">Soul Signature</span>
                                <span className="text-xs font-serif font-bold text-gold-dark">
                                    {client.rashi} Rashi
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-parchment rounded-full border border-antique group-hover:border-gold-primary/30 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-ink/70 uppercase tracking-widest leading-none">Active</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted group-hover:text-gold-dark group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Actions - Redesigned for Light Theme */}
            <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto z-20">
                <button
                    className="p-3 rounded-xl bg-white border border-antique text-muted hover:text-gold-dark hover:border-gold-primary shadow-lg transition-all"
                    title="Edit Record"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    className="p-3 rounded-xl bg-white border border-antique text-muted hover:text-red-600 hover:border-red-200 shadow-lg transition-all"
                    title="Purge Record"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
