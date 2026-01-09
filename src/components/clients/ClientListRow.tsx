import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Client } from '@/types/client';
import { useVedicClient } from '@/context/VedicClientContext';

interface ClientListRowProps {
    client: Client;
}

export default function ClientListRow({ client }: ClientListRowProps) {
    const router = useRouter();
    const { setClientDetails } = useVedicClient();

    const handleSelectClient = () => {
        // Set the active session context
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
                    bg-[#1A0A05]/80 border border-white/5 rounded-3xl
                    transition-all duration-500
                    hover:border-[#FFD27D]/40 hover:bg-[#2A1810]
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    cursor-pointer overflow-hidden
                "
            >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#D08C60]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* 1. Avatar / Photo with Gold Ring */}
                <div className="relative mr-8">
                    <div className="w-20 h-20 rounded-full border border-[#D08C60]/30 overflow-hidden shadow-2xl bg-gradient-to-br from-[#2A1810] to-[#1A0A05] flex items-center justify-center relative group-hover:border-[#FFD27D]/60 transition-colors">
                        <div className="absolute inset-0 bg-[#FFD27D]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {client.avatar ? (
                            <img src={client.avatar} alt={client.firstName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-serif text-3xl text-[#FFD27D] font-bold tracking-tight">
                                {client.firstName[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Main Info */}
                <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#FFD27D] transition-colors tracking-tight">
                                {client.firstName} {client.lastName}
                            </h3>
                            <div className="flex items-center gap-6 mt-2">
                                <div className="flex items-center text-white/40 text-[11px] font-serif uppercase tracking-[0.2em] font-bold">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-[#D08C60]" />
                                    {client.placeOfBirth}
                                </div>
                                <div className="hidden sm:flex items-center text-white/40 text-[11px] font-serif uppercase tracking-[0.2em] font-bold">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-[#D08C60]" />
                                    {new Date(client.dateOfBirth).toLocaleDateString('en-US', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 3. Right Side: Indicators */}
                        <div className="flex items-center gap-12">
                            <div className="hidden lg:block text-right">
                                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-[#D08C60] mb-1">Soul Signature</span>
                                <span className="text-xs font-serif font-bold text-[#FFD27D]">
                                    {client.rashi} Rashi
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 group-hover:border-[#D08C60]/30 transition-all">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none">Record Active</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#FFD27D] group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto z-20">
                <button
                    className="p-3 rounded-xl bg-[#2A1810] border border-white/10 text-white/40 hover:text-[#FFD27D] hover:border-[#FFD27D]/40 shadow-2xl transition-all"
                    title="Edit Record"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    className="p-3 rounded-xl bg-[#2A1810] border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/40 shadow-2xl transition-all"
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
