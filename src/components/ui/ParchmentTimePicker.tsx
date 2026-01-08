"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

interface ParchmentTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function ParchmentTimePicker({
    date,
    setDate,
    label,
    placeholder = "Select Time",
    className
}: ParchmentTimePickerProps) {
    // Helper to update specific parts of the date
    const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: string) => {
        const newDate = date ? new Date(date) : new Date();
        // If no date was set, default to today

        let currentHours = newDate.getHours();
        let currentMinutes = newDate.getMinutes();

        if (type === 'hour') {
            const hour = parseInt(value);
            const isPM = currentHours >= 12;
            if (isPM && hour < 12) newDate.setHours(hour + 12);
            else if (!isPM && hour === 12) newDate.setHours(0);
            else if (isPM && hour === 12) newDate.setHours(12);
            else newDate.setHours(hour + (isPM ? 12 : 0) - (isPM && hour !== 12 ? 12 : 0)); // Logic slightly complex, simplifying below

            // Re-calc simply:
            // We want to set the visual hour (1-12) preserving AM/PM
            const ampm = currentHours >= 12 ? 'PM' : 'AM';
            let newH = hour;
            if (ampm === 'PM' && hour !== 12) newH = hour + 12;
            if (ampm === 'AM' && hour === 12) newH = 0;
            newDate.setHours(newH);
        } else if (type === 'minute') {
            newDate.setMinutes(parseInt(value));
        } else if (type === 'ampm') {
            const currentH = newDate.getHours();
            if (value === 'PM' && currentH < 12) newDate.setHours(currentH + 12);
            if (value === 'AM' && currentH >= 12) newDate.setHours(currentH - 12);
        }

        setDate(newDate);
    };

    const getDisplayTime = () => {
        if (!date) return null;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Generate options
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <label className="block text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest pl-1">
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full bg-transparent border-b border-[#DCC9A6] px-3 py-2.5 font-serif text-[#3E2A1F] placeholder-[#DCC9A6] focus:outline-none focus:border-[#9C7A2F] transition-colors flex items-center justify-between group hover:bg-[#FEFAEA]/50 text-left",
                            !date && "text-[#DCC9A6]"
                        )}
                    >
                        <span>{getDisplayTime() || placeholder}</span>
                        <Clock className="w-4 h-4 text-[#DCC9A6] group-hover:text-[#9C7A2F] transition-colors" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <div className="flex gap-2 h-48">
                        {/* Hours */}
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-16 text-center border-r border-[#DCC9A6] pr-2">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1">Hr</span>
                            {hours.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => handleTimeChange('hour', h.toString())}
                                    className={cn(
                                        "py-1 rounded hover:bg-[#F2DCBC] text-sm font-serif",
                                        date && ((date.getHours() % 12 || 12) === h) && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        {/* Minutes */}
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-16 text-center border-r border-[#DCC9A6] pr-2">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1">Min</span>
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleTimeChange('minute', m)}
                                    className={cn(
                                        "py-1 rounded hover:bg-[#F2DCBC] text-sm font-serif",
                                        date && (date.getMinutes() === parseInt(m)) && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* AM/PM */}
                        <div className="flex flex-col gap-1 w-14 text-center">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1">Mer</span>
                            {['AM', 'PM'].map((ap) => (
                                <button
                                    key={ap}
                                    onClick={() => handleTimeChange('ampm', ap)}
                                    className={cn(
                                        "py-2 rounded hover:bg-[#F2DCBC] text-sm font-serif",
                                        date && (date.getHours() >= 12 ? 'PM' : 'AM') === ap && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {ap}
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
