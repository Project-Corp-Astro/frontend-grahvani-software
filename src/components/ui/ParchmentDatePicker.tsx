"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";

interface ParchmentDatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function ParchmentDatePicker({
    date,
    setDate,
    label,
    placeholder = "Select Date",
    className
}: ParchmentDatePickerProps) {
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
                        {date ? format(date, "PPP") : <span>{placeholder}</span>}
                        <CalendarIcon className="w-4 h-4 text-[#DCC9A6] group-hover:text-[#9C7A2F] transition-colors" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
