"use client";

import React from 'react';
import { Calendar, Clock, User, MapPin, Phone, MoreVertical, Plus } from 'lucide-react';

export default function UpcomingBookingsPage() {
    // Mock bookings data
    const bookings = [
        {
            id: 1,
            clientName: "Ananya Sharma",
            date: "2026-01-12",
            time: "10:00 AM",
            duration: "45 min",
            type: "Career Consultation",
            status: "confirmed",
            phone: "+91 98765 43210"
        },
        {
            id: 2,
            clientName: "Vikram Singh",
            date: "2026-01-12",
            time: "2:30 PM",
            duration: "30 min",
            type: "Follow-up Call",
            status: "pending",
            phone: "+91 87654 32109"
        },
        {
            id: 3,
            clientName: "Priya Mehta",
            date: "2026-01-14",
            time: "11:00 AM",
            duration: "60 min",
            type: "Marriage Compatibility",
            status: "confirmed",
            phone: "+91 76543 21098"
        },
    ];

    const getStatusBadge = (status: string) => {
        if (status === "confirmed") {
            return <span className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg">Confirmed</span>;
        }
        return <span className="px-2.5 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg">Pending</span>;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Upcoming Bookings</h1>
                        <p className="text-sm text-muted">Scheduled consultations</p>
                    </div>
                </div>
                <button className="px-4 py-2.5 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Booking
                </button>
            </div>

            {/* Today's Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Today</p>
                    <p className="text-2xl font-serif font-bold text-ink">2</p>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">This Week</p>
                    <p className="text-2xl font-serif font-bold text-ink">5</p>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-2xl font-serif font-bold text-orange-600">1</p>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-3">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif font-bold text-gold-dark">
                                    {booking.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-ink">{booking.clientName}</h3>
                                    <p className="text-sm text-gold-dark font-medium">{booking.type}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {booking.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {booking.time} ({booking.duration})
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(booking.status)}
                                <button className="p-2 rounded-lg hover:bg-parchment text-muted hover:text-ink transition-colors">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-parchment text-muted hover:text-ink transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
