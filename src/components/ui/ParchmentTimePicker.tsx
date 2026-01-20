"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

interface ParchmentTimePickerProps {
    value?: string; // HH:mm:ss (24h format)
    onChange: (time: string | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function ParchmentTimePicker({
    value,
    onChange,
    label,
    placeholder = "Select Time",
    className
}: ParchmentTimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse HH:mm:ss (24h) - be tolerant of ISO artifacts
    const parsedTime = React.useMemo(() => {
        if (!value) return { h: 12, m: 0, s: 0 };
        // Extract only the HH:mm:ss part if there's any suffix like .000Z
        const cleanValue = value.split('.')[0].split('+')[0].split('Z')[0];
        const parts = cleanValue.split(':').map(Number);
        return {
            h: parts[0] || 0,
            m: parts[1] || 0,
            s: parts[2] || 0
        };
    }, [value]);

    const handleTimeChange = (type: 'hour' | 'minute' | 'second', newVal: number) => {
        let { h, m, s } = parsedTime;

        if (type === 'hour') h = newVal;
        else if (type === 'minute') m = newVal;
        else if (type === 'second') s = newVal;

        const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        onChange(formatted);
    };

    const getDisplayTime = () => {
        if (!value) return null;
        const { h, m, s } = parsedTime;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Generate options
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const seconds = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <label className="block text-[10px] font-bold font-serif text-[#9C7A2F] uppercase tracking-widest pl-1">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full bg-transparent border-b border-[#DCC9A6] px-3 py-2.5 font-serif text-[#3E2A1F] placeholder-[#DCC9A6] focus:outline-none focus:border-[#9C7A2F] transition-colors flex items-center justify-between group hover:bg-[#FEFAEA]/50 text-left",
                            !value && "text-[#DCC9A6]"
                        )}
                    >
                        <span>{getDisplayTime() || placeholder}</span>
                        <Clock className="w-4 h-4 text-[#DCC9A6] group-hover:text-[#9C7A2F] transition-colors" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <div className="flex gap-2 h-64 overflow-hidden">
                        {/* Hours */}
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-14 text-center border-r border-[#DCC9A6] pr-2">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1 sticky top-0 bg-white py-1">H</span>
                            {hours.map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => handleTimeChange('hour', h)}
                                    className={cn(
                                        "py-1 rounded hover:bg-[#F2DCBC] text-sm font-serif transition-colors shrink-0",
                                        value && parsedTime.h === h && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {h.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        {/* Minutes */}
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-14 text-center border-r border-[#DCC9A6] pr-2">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1 sticky top-0 bg-white py-1">M</span>
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleTimeChange('minute', m)}
                                    className={cn(
                                        "py-1 rounded hover:bg-[#F2DCBC] text-sm font-serif transition-colors shrink-0",
                                        value && parsedTime.m === m && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {m.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        {/* Seconds */}
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar w-14 text-center pr-2">
                            <span className="text-[10px] text-[#9C7A2F] font-bold uppercase mb-1 sticky top-0 bg-white py-1">S</span>
                            {seconds.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleTimeChange('second', s)}
                                    className={cn(
                                        "py-1 rounded hover:bg-[#F2DCBC] text-sm font-serif transition-colors shrink-0",
                                        value && parsedTime.s === s && "bg-[#9C7A2F] text-[#FEFAEA] font-bold hover:bg-[#763A1F]"
                                    )}
                                >
                                    {s.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
