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
    const isScrolling = React.useRef(false);

    // Scroll to selected value on mount and when selected changes externally
    React.useEffect(() => {
        if (scrollRef.current && !isScrolling.current) {
            const targetScroll = selectedValue * ITEM_HEIGHT;
            scrollRef.current.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });
        }
    }, [selectedValue]);

    // Handle scroll end to snap to nearest value
    const handleScroll = React.useCallback(() => {
        if (!scrollRef.current) return;

        isScrolling.current = true;

        // Debounce the snap
        const timer = setTimeout(() => {
            if (!scrollRef.current) return;
            const scrollTop = scrollRef.current.scrollTop;
            const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(values.length - 1, nearestIndex));

            if (clampedIndex !== selectedValue) {
                onSelect(clampedIndex);
            }

            // Snap to exact position
            scrollRef.current.scrollTo({
                top: clampedIndex * ITEM_HEIGHT,
                behavior: "smooth",
            });

            isScrolling.current = false;
        }, 100);

        return () => clearTimeout(timer);
    }, [values.length, selectedValue, onSelect]);

    return (
        <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#6B4F1D] font-bold uppercase mb-2 tracking-wider">
                {label}
            </span>
            <div className="relative h-[180px] w-14 overflow-hidden">
                {/* Selection highlight bar */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-r from-[#D08C60]/20 via-[#D08C60]/30 to-[#D08C60]/20 border-y border-[#D08C60]/40 pointer-events-none z-10 rounded-sm" />

                {/* Fade gradients */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF5E6] to-transparent pointer-events-none z-20" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF5E6] to-transparent pointer-events-none z-20" />

                {/* Scrollable wheel */}
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto no-scrollbar wheel-scroll"
                    onScroll={handleScroll}
                    style={{ scrollSnapType: "y mandatory" }}
                >
                    {/* Top padding to allow first item to center */}
                    <div style={{ height: ITEM_HEIGHT * 2 }} />

                    {values.map((val, idx) => {
                        const isSelected = idx === selectedValue;
                        return (
                            <motion.button
                                key={val}
                                type="button"
                                onClick={() => {
                                    onSelect(idx);
                                    scrollRef.current?.scrollTo({
                                        top: idx * ITEM_HEIGHT,
                                        behavior: "smooth",
                                    });
                                }}
                                className={cn(
                                    "w-full flex items-center justify-center font-serif transition-all duration-150",
                                    isSelected
                                        ? "text-[#3E2A1F] font-bold text-lg"
                                        : "text-[#9C7A2F]/60 text-base"
                                )}
                                style={{
                                    height: ITEM_HEIGHT,
                                    scrollSnapAlign: "center",
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {val.toString().padStart(2, "0")}
                            </motion.button>
                        );
                    })}

                    {/* Bottom padding to allow last item to center */}
                    <div style={{ height: ITEM_HEIGHT * 2 }} />
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
