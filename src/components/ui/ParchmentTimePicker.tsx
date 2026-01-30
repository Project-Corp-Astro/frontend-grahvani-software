"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { motion, AnimatePresence } from "framer-motion";

interface ParchmentTimePickerProps {
    value?: string; // HH:mm:ss (24h format)
    onChange: (time: string | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 5;

// Wheel column component for hours, minutes, or seconds
function WheelColumn({
    values,
    selectedValue,
    onSelect,
    label,
}: {
    values: number[];
    selectedValue: number;
    onSelect: (val: number) => void;
    label: string;
}) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Initial positioning and external updates
    React.useEffect(() => {
        if (scrollRef.current) {
            const targetScroll = selectedValue * ITEM_HEIGHT;
            // Immediate scroll on mount, smooth on updates
            scrollRef.current.scrollTo({
                top: targetScroll,
                behavior: scrollRef.current.scrollTop === 0 ? "auto" : "smooth",
            });
        }
    }, [selectedValue]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        // Logic to update state when scrolling stops naturally (native snap)
        // We use a debounce to detect the final resting position
        const timer = (target as any)._scrollTimer;
        if (timer) clearTimeout(timer);

        (target as any)._scrollTimer = setTimeout(() => {
            const scrollTop = target.scrollTop;
            const index = Math.round(scrollTop / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(values.length - 1, index));

            if (clampedIndex !== selectedValue) {
                onSelect(clampedIndex);
            }
        }, 150);
    };

    return (
        <div className="flex flex-col items-center select-none">
            <span className="text-[10px] text-[#6B4F1D] font-black uppercase mb-3 tracking-[0.2em] opacity-80 font-serif">
                {label}
            </span>
            <div className="relative h-[216px] w-14 group">
                {/* Selection highlight bar - Enhanced with glow */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-[#D08C60]/10 via-[#D08C60]/25 to-[#D08C60]/10 border-y border-[#D08C60]/30 pointer-events-none z-10 rounded-sm shadow-[0_0_15px_rgba(208,140,96,0.1)]" />

                {/* Depth/Curvature Goggles */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF5E6] via-[#FAF5E6]/90 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF5E6] via-[#FAF5E6]/90 to-transparent pointer-events-none z-20" />

                {/* Outer shadow for "rolling inward" effect */}
                <div className="absolute inset-0 border-x border-[#D08C60]/5 pointer-events-none z-30" />

                {/* Scrollable wheel */}
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto no-scrollbar scroll-smooth"
                    onScroll={handleScroll}
                    style={{
                        scrollSnapType: "y mandatory",
                        overscrollBehavior: "contain"
                    }}
                >
                    {/* Padding for centering first/last items */}
                    <div style={{ height: ITEM_HEIGHT * 2.5 }} />

                    {values.map((val, idx) => {
                        const isSelected = idx === selectedValue;
                        return (
                            <button
                                key={val}
                                type="button"
                                onClick={() => onSelect(idx)}
                                className={cn(
                                    "w-full flex items-center justify-center font-serif transition-colors duration-200",
                                    isSelected
                                        ? "text-[#3E2A1F] font-black text-xl scale-110"
                                        : "text-[#9C7A2F]/40 text-base hover:text-[#9C7A2F]/70"
                                )}
                                style={{
                                    height: ITEM_HEIGHT,
                                    scrollSnapAlign: "center",
                                }}
                            >
                                {val.toString().padStart(2, "0")}
                            </button>
                        );
                    })}

                    <div style={{ height: ITEM_HEIGHT * 2.5 }} />
                </div>
            </div>
        </div>
    );
}

export default function ParchmentTimePicker({
    value,
    onChange,
    label,
    placeholder = "Select Time",
    className,
}: ParchmentTimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse HH:mm:ss (24h) - be tolerant of ISO artifacts
    const parsedTime = React.useMemo(() => {
        if (!value) return { h: 12, m: 0, s: 0 };
        const cleanValue = value.split(".")[0].split("+")[0].split("Z")[0];
        const parts = cleanValue.split(":").map(Number);
        return {
            h: parts[0] || 0,
            m: parts[1] || 0,
            s: parts[2] || 0,
        };
    }, [value]);

    const handleTimeChange = (type: "hour" | "minute" | "second", newVal: number) => {
        let { h, m, s } = parsedTime;

        if (type === "hour") h = newVal;
        else if (type === "minute") m = newVal;
        else if (type === "second") s = newVal;

        const formatted = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        onChange(formatted);
    };

    const getDisplayTime = () => {
        if (!value) return null;
        const { h, m, s } = parsedTime;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const setNow = () => {
        const now = new Date();
        const formatted = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        onChange(formatted);
    };

    // Generate options
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const seconds = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <label className="block text-[11px] font-bold font-serif text-[#6B4F1D] uppercase tracking-widest pl-1">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full bg-transparent border-b border-[#C9A24D]/50 px-2 py-2 font-serif text-[#2A1810] focus:outline-none focus:border-[#9C7A2F] transition-colors flex items-center justify-between group hover:border-[#9C7A2F] text-left",
                            !value && "text-[#8B6914]"
                        )}
                    >
                        <span>{getDisplayTime() || placeholder}</span>
                        <Clock className="w-4 h-4 text-[#DCC9A6] group-hover:text-[#9C7A2F] transition-colors" />
                    </button>
                </PopoverTrigger>
                <AnimatePresence>
                    {open && (
                        <PopoverContent className="w-auto p-0" align="start" asChild>
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="bg-[#FAF5E6] border border-[#DCC9A6] rounded-lg shadow-lg p-4"
                            >
                                {/* Wheel picker columns */}
                                <div className="flex gap-4">
                                    <WheelColumn
                                        values={hours}
                                        selectedValue={parsedTime.h}
                                        onSelect={(val) => handleTimeChange("hour", val)}
                                        label="Hour"
                                    />
                                    <div className="flex items-center justify-center text-[#9C7A2F] font-bold text-xl pt-6">
                                        :
                                    </div>
                                    <WheelColumn
                                        values={minutes}
                                        selectedValue={parsedTime.m}
                                        onSelect={(val) => handleTimeChange("minute", val)}
                                        label="Min"
                                    />
                                    <div className="flex items-center justify-center text-[#9C7A2F] font-bold text-xl pt-6">
                                        :
                                    </div>
                                    <WheelColumn
                                        values={seconds}
                                        selectedValue={parsedTime.s}
                                        onSelect={(val) => handleTimeChange("second", val)}
                                        label="Sec"
                                    />
                                </div>

                                {/* Quick actions */}
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#DCC9A6]">
                                    <button
                                        type="button"
                                        onClick={setNow}
                                        className="text-sm font-serif text-[#9C7A2F] hover:text-[#763A1F] transition-colors px-3 py-1.5 rounded hover:bg-[#D08C60]/10"
                                    >
                                        Now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="text-sm font-serif bg-[#D08C60] text-white px-4 py-1.5 rounded hover:bg-[#98522F] transition-colors font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </PopoverContent>
                    )}
                </AnimatePresence>
            </Popover>
        </div>
    );
}
